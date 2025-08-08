import type { MarketAsset, MarketAssetDetail } from '@/stores/market'
import { RateLimitError } from './apiErrors'

// Define a base URL for our API calls
const API_BASE_URL = 'https://api.coingecko.com/api/v3'

// Helper function to handle response checking
const handleResponse = async (response: Response) => {
  // If the status is 429, throw our custom error
  if (response.status === 429) {
    throw new RateLimitError('Too many requests. Please wait a moment before trying again.')
  }
  // For other errors, throw a generic error
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText} (Status: ${response.status})`)
  }
  return response.json()
}

// NEW FUNCTION: Search for coins and return their IDs
export const searchCoins = async (query: string): Promise<string[]> => {
  if (!query) return []
  const response = await fetch(`${API_BASE_URL}/search?query=${query}`)
  if (!response.ok) throw new Error('Search API failed.')
  const result = await handleResponse(response)
  // The search result contains an array of coins, we just want their IDs
  return result.coins.map((coin: unknown) => (coin as { id: string }).id)
}

// UPGRADED FUNCTION: Now accepts an optional list of IDs
export const fetchMarketAssets = async (
  page: number,
  rows: number,
  ids: string[] = [],
): Promise<MarketAsset[]> => {
  let url = `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${rows}&page=${page}`

  // If a list of IDs is provided, add it to the request
  if (ids.length > 0) {
    url += `&ids=${ids.join(',')}`
  }

  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch assets from the API.')
  return handleResponse(response)
}

export const fetchAssetDetail = async (id: string): Promise<MarketAssetDetail> => {
  const response = await fetch(`${API_BASE_URL}/coins/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch details for asset "${id}" from the API.`)
  }
  return handleResponse(response)
}

export const fetchAssetChartData = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/coins/${id}/market_chart?vs_currency=usd&days=7`)
  if (!response.ok) {
    throw new Error(`Failed to fetch chart data for asset "${id}".`)
  }
  return handleResponse(response)
}
