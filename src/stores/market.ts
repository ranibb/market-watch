import { defineStore } from 'pinia'
import {
  fetchMarketAssets,
  fetchAssetDetail,
  fetchAssetChartData,
  searchCoins,
} from '@/services/marketApi'
import { showErrorToast, showWarnToast } from '@/services/toastService'
import { RateLimitError } from '@/services/apiErrors'

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

  searchQuery: string
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
    searchQuery: '',
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
      // Remember the current page before we do anything.
      const previousPage = this.currentPage

      this.isLoading = true

      // The DataTable event provides a 0-based page index, our API needs a 1-based page number
      const pageNumber = event.page + 1
      const rows = event.rows

      this.currentPage = pageNumber
      this.rowsPerPage = event.rows

      // ===================================================================
      // THE UPGRADED CACHING LOGIC
      // 1. Create a unique cache key for this specific page and size.
      const cacheKey = `${this.searchQuery}-${pageNumber}-${rows}`

      // 2. Check if this specific data is already in our cache.
      if (this.assetsCache.has(cacheKey)) {
        this.currentPageAssets = this.assetsCache.get(cacheKey)!
        this.isLoading = false
        // console.log(`Serving ${cacheKey} from cache.`)
        return
      }
      // ===================================================================

      // 3. If not in the cache, proceed to fetch from the API.
      // console.log(`Fetching ${cacheKey} from API.`) // For debugging

      try {
        let coinIds: string[] = []

        // Fetch the total count ONLY if we don't have it yet.
        if (this.searchQuery) {
          coinIds = await searchCoins(this.searchQuery)
          this.totalRecords = coinIds.length // The total is now the number of search results
          if (coinIds.length === 0) {
            this.currentPageAssets = []
            this.assetsCache.set(cacheKey, [])
            return
          }
        } else {
          // If the search query is empty, it means we are back to the full list.
          // We should reset totalRecords to 0 to force a re-evaluation.
          // In a real app, an API would give us the total. Here we reset to our default.
          this.totalRecords = 300 // Let's hardcode a reasonable default total
        }

        // Fetch just the data for the current page
        const pageData = await fetchMarketAssets(this.currentPage, this.rowsPerPage, coinIds)
        // 4. Update the current view's data
        this.currentPageAssets = pageData
        // 5. IMPORTANT: Store the newly fetched data in the cache for next time.
        this.assetsCache.set(cacheKey, pageData)
      } catch (e: unknown) {
        // If any error occurs, revert the currentPage back to its previous value.
        this.currentPage = previousPage
        if (e instanceof RateLimitError) {
          // This will now only be hit if the server correctly sends CORS headers on a 429
          showErrorToast(e.message)
        } else if (e instanceof Error) {
          // Check for the specific CORS-related error message
          if (e.message.includes('Failed to fetch')) {
            showWarnToast('Too many requests. The API is rate-limiting you. Please wait a moment.')
          } else {
            // Handle all other generic errors
            showErrorToast(e.message)
          }
        } else {
          showErrorToast('An unexpected error occurred')
        }
      } finally {
        this.isLoading = false
      }
    },

    // NEW ACTION: To handle a new search query
    async searchAssets(query: string) {
      this.searchQuery = query
      // CRITICAL: A new search invalidates all previous page data. Clear the cache!
      this.assetsCache.clear()
      // Reset to the first page and load the new search results
      await this.loadAssets({ page: 0, rows: this.rowsPerPage })
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
        if (e instanceof RateLimitError) {
          // This will now only be hit if the server correctly sends CORS headers on a 429
          showErrorToast(e.message)
        } else if (e instanceof Error) {
          // Check for the specific CORS-related error message
          if (e.message.includes('Failed to fetch')) {
            showWarnToast('Too many requests. The API is rate-limiting you. Please wait a moment.')
          } else {
            // Handle all other generic errors
            showErrorToast(e.message)
          }
        } else {
          showErrorToast('An unexpected error occurred')
        }
      } finally {
        this.isLoading = false
      }
    },
  },
})
