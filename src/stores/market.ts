import { defineStore } from 'pinia'
import { fetchMarketAssets, fetchAssetDetail } from '@/services/marketApi'

// Define the TypeScript interfaces for our data structures
export interface MarketAsset {
  id: string
  symbol: string
  name: string
  current_price: number
  image: string
}

export interface MarketAssetDetail {
  id: string
  symbol: string
  name: string
  current_price: number
  description: {
    en: string
  }
  image: {
    large: string
  }
  market_data: {
    current_price: {
      usd: number
    }
    market_cap: {
      usd: number
    }
  }
}

// Define the shape of our store's state
interface MarketState {
  assets: MarketAsset[]
  currentAsset: MarketAssetDetail | null
  isLoading: boolean
  error: string | null
  searchQuery: string
}

// Create the store
export const useMarketStore = defineStore('market', {
  // 1. STATE: The core data of our store.
  state: (): MarketState => ({
    assets: [],
    currentAsset: null,
    isLoading: false,
    error: null,
    searchQuery: '',
  }),

  // 2. GETTERS: Computed properties for the store. Like computed() in a component.
  getters: {
    // A simple getter to get the full list
    // assetList: (state) => state.assets,

    // The new, powerful getter!
    filteredAssets: (state) => {
      if (!state.searchQuery) {
        return state.assets // If no search term, return the full list
      }
      const lowerCaseQuery = state.searchQuery.toLowerCase()
      return state.assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(lowerCaseQuery) ||
          asset.symbol.toLowerCase().includes(lowerCaseQuery)
      )
    },
  },

  // 3. ACTIONS: Methods that can change the state. Where we put our business logic.
  actions: {
    async fetchAssets() {
      this.isLoading = true
      this.error = null
      try {
        this.assets = await fetchMarketAssets()
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.isLoading = false
      }
    },

    async fetchAssetById(id: string) {
      this.isLoading = true
      this.error = null
      this.currentAsset = null
      try {
        this.currentAsset = await fetchAssetDetail(id)
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.isLoading = false
      }
    },

    setSearchQuery(query: string) {
      this.searchQuery = query
    },
  },
})
