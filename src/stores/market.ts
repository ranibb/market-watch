import { defineStore } from 'pinia'
import { fetchMarketAssets, fetchAssetDetail, fetchAssetChartData } from '@/services/marketApi'
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
  assets: MarketAsset[]
  detailsCache: Map<string, MarketAssetDetail> // Implement a caching mechanism directly within our Pinia store. The Map data structure in JavaScript is perfect for this, as it allows us to store data using a unique key (the asset id)
  isLoading: boolean
  searchQuery: string
}

// Create the store
export const useMarketStore = defineStore('market', {
  // 1. STATE: The core data of our store.
  state: (): MarketState => ({
    assets: [],
    detailsCache: new Map(), // <-- Initialize the cache as a new Map
    isLoading: false,
    searchQuery: '',
  }),

  // 2. GETTERS: Computed properties for the store. Like computed() in a component.
  getters: {
    filteredAssets: (state) => {
      if (!state.searchQuery) {
        return state.assets // If no search term, return the full list
      }
      const lowerCaseQuery = state.searchQuery.toLowerCase()
      return state.assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(lowerCaseQuery) ||
          asset.symbol.toLowerCase().includes(lowerCaseQuery),
      )
    },

    // // The new advanced getter!
    // getAssetById: (state) => {
    //   return (id: string) => state.assets.find((asset) => asset.id === id)
    // },

    // This getter will now check the CACHE for the detailed asset
    getAssetDetailsById: (state) => {
      return (id: string) => state.detailsCache.get(id)
    },
  },

  // 3. ACTIONS: Methods that can change the state. Where we put our business logic.
  actions: {
    async fetchAssets() {
      // We can add a check here to prevent re-fetching if assets already exist
      if (this.assets.length > 0) return

      this.isLoading = true
      try {
        this.assets = await fetchMarketAssets()
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

    setSearchQuery(query: string) {
      this.searchQuery = query
    },
  },
})
