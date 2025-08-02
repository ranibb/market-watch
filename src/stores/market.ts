import { defineStore } from 'pinia'

// Define the TypeScript interfaces for our data structures
export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  image: string;
  
}

export interface MarketAssetDetail {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  description: {
    en: string;
  };
  image: {
    large: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
  };
}

// Define the shape of our store's state
interface MarketState {
  assets: MarketAsset[];
  currentAsset: MarketAssetDetail | null;
  isLoading: boolean;
  error: string | null;
}

// Create the store
export const useMarketStore = defineStore('market', {
  // 1. STATE: The core data of our store.
  state: (): MarketState => ({
    assets: [],
    currentAsset: null,
    isLoading: false,
    error: null,
  }),

  // 2. GETTERS: Computed properties for the store. Like computed() in a component.
  getters: {
    // A simple getter to get the full list
    assetList: (state) => state.assets,
  },

  // 3. ACTIONS: Methods that can change the state. Where we put our business logic.
  actions: {
    async fetchAssets() {
      this.isLoading = true
      this.error = null
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1')
        if (!response.ok) throw new Error('Failed to fetch assets')
        // We use 'this' to access state properties inside an action
        this.assets = await response.json()
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
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`)
        if (!response.ok) throw new Error(`Asset with ID "${id}" not found.`)
        this.currentAsset = await response.json()
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.isLoading = false
      }
    },
  },
})