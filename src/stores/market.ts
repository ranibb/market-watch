import { defineStore } from 'pinia'
import {
  fetchMarketAssets,
  fetchAssetDetail,
  fetchAssetChartData,
  fetchTotalAssetCount,
} from '@/services/marketApi'
import { showErrorToast } from '@/services/toastService'

// Define the TypeScript interfaces for our data structures
export interface MarketAsset {
  id: string
  symbol: string
  name: string
  current_price: number
  image: string
}

// Let's bring back our detailed interface!
export interface MarketAssetDetail {
  id: string
  symbol: string
  name: string
  image: {
    large: string
  }
  description: {
    en: string
  }
  market_data: {
    current_price: {
      usd: number
    }
    market_cap: {
      usd: number
    }
  }
  chartData?: { prices: [number, number][] }
}

// Define the shape of our store's state
interface MarketState {
  currentPageAssets: MarketAsset[]

  // Implement a caching mechanism directly within our Pinia store. The Map data structure in JavaScript is perfect for this, as it allows us to store data using a unique key (the asset id)
  detailsCache: Map<string, MarketAssetDetail>

  // THE NEW CACHE! Key: page number, Value: array of assets
  assetsCache: Map<string, MarketAsset[]>

  isLoading: boolean

  // New properties for server-side pagination
  totalRecords: number
  rowsPerPage: number
  currentPage: number
}

// Create the store
export const useMarketStore = defineStore('market', {
  // 1. STATE: The core data of our store.
  state: (): MarketState => ({
    currentPageAssets: [],
    detailsCache: new Map(), // <-- Initialize the cache as a new Map
    assetsCache: new Map(),
    isLoading: false,
    // Initialize the new state properties
    totalRecords: 0,
    rowsPerPage: 5, // Default rows per page
    currentPage: 1, // Page numbers are 1-based for our logic
  }),

  // 2. GETTERS: Computed properties for the store. Like computed() in a component.
  getters: {
    // This getter will now check the CACHE for the detailed asset
    getAssetDetailsById: (state) => {
      return (id: string) => state.detailsCache.get(id)
    },
  },

  // 3. ACTIONS: Methods that can change the state. Where we put our business logic.
  actions: {
    // This is our new, powerful action for loading data for the DataTable
    async loadAssets(event: { page: number; rows: number }) {
      this.isLoading = true

      // The DataTable event provides a 0-based page index, our API needs a 1-based page number
      const pageNumber = event.page + 1
      const rows = event.rows

      this.currentPage = pageNumber
      this.rowsPerPage = event.rows

      // ===================================================================
      // THE UPGRADED CACHING LOGIC
      // 1. Create a unique cache key for this specific page and size.
      const cacheKey = `${pageNumber}-${rows}`

      // 2. Check if this specific data is already in our cache.
      if (this.assetsCache.has(cacheKey)) {
        this.currentPageAssets = this.assetsCache.get(cacheKey)!
        this.isLoading = false
        console.log(`Serving ${cacheKey} from cache.`)
        return
      }
      // ===================================================================

      // 3. If not in the cache, proceed to fetch from the API.
      console.log(`Fetching ${cacheKey} from API.`) // For debugging

      try {
        // Fetch the total count ONLY if we don't have it yet.
        if (this.totalRecords === 0) {
          const total = await fetchTotalAssetCount()
          this.totalRecords = total
        }

        // Fetch just the data for the current page
        const pageData = await fetchMarketAssets(this.currentPage, this.rowsPerPage)
        // 4. Update the current view's data
        this.currentPageAssets = pageData
        // 5. IMPORTANT: Store the newly fetched data in the cache for next time.
        this.assetsCache.set(cacheKey, pageData)
      } catch (e: unknown) {
        if (e instanceof Error) showErrorToast(e.message)
      } finally {
        this.isLoading = false
      }
    },

    // This is the new, intelligent action!
    async fetchAssetDetailsIfNeeded(id: string) {
      // 1. Check if the details are already in the cache. If so, do nothing.
      if (this.detailsCache.has(id)) {
        return
      }

      if (this.detailsCache.get(id)?.chartData) return // Only fetch if chart data is missing

      // 2. If not in the cache, fetch from the API.
      this.isLoading = true
      try {
        // Fetch details and chart data in parallel for performance
        const [details, chart] = await Promise.all([
          this.detailsCache.has(id)
            ? Promise.resolve(this.detailsCache.get(id)!)
            : fetchAssetDetail(id),
          fetchAssetChartData(id),
        ])

        const fullDetails = { ...details, chartData: chart }
        this.detailsCache.set(id, fullDetails)
      } catch (e: unknown) {
        if (e instanceof Error) {
          showErrorToast(e.message)
        } else {
          showErrorToast('An unexpected error occurred')
        }
      } finally {
        this.isLoading = false
      }
    },
  },
})
