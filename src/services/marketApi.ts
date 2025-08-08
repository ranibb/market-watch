import type { MarketAsset, MarketAssetDetail } from '@/stores/market' // Import the types

// Define a base URL for our API calls
const API_BASE_URL = 'https://api.coingecko.com/api/v3'

// This service is now solely responsible for interacting with the market API.
// It doesn't know anything about Pinia or the application's state.

export const fetchMarketAssets = async (page: number, rows: number): Promise<MarketAsset[]> => {
  // We add page and per_page to the API call. Note: CoinGecko pages are 1-based.
  const response = await fetch(
    `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${rows}&page=${page}`,
  )
  if (!response.ok) {
    throw new Error('Failed to fetch assets from the API.')
  }
  return response.json()
}

// This is a new function to get the total count of assets for the paginator.
// We only need to call this once.
export const fetchTotalAssetCount = async (): Promise<number> => {
  // The /coins/list endpoint gives us a list of all coins. We can get the length of this array.
  const response = await fetch(`${API_BASE_URL}/coins/list`)
  if (!response.ok) {
    throw new Error('Failed to fetch total asset count.')
  }
  const allCoins = await response.json()
  return allCoins.length
}

export const fetchAssetDetail = async (id: string): Promise<MarketAssetDetail> => {
  const response = await fetch(`${API_BASE_URL}/coins/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch details for asset "${id}" from the API.`)
  }
  return response.json()
}

export const fetchAssetChartData = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=7`)
  if (!response.ok) {
    throw new Error(`Failed to fetch chart data for asset "${id}".`)
  }
  return response.json()
}
