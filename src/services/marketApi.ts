import type { MarketAsset, MarketAssetDetail } from '@/stores/market' // Import the types

// Define a base URL for our API calls
const API_BASE_URL = 'https://api.coingecko.com/api/v3'

// This service is now solely responsible for interacting with the market API.
// It doesn't know anything about Pinia or the application's state.

export const fetchMarketAssets = async (): Promise<MarketAsset[]> => {
  const response = await fetch(
    `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch assets from the API.')
  }
  return response.json()
}

export const fetchAssetDetail = async (id: string): Promise<MarketAssetDetail> => {
  const response = await fetch(`${API_BASE_URL}/coins/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch details for asset "${id}" from the API.`)
  }
  return response.json()
}
