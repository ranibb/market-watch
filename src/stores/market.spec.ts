import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useMarketStore, type MarketAsset } from './market'
import * as api from '@/services/marketApi'

// Mock the entire marketApi service
vi.mock('@/services/marketApi', () => ({
  fetchMarketAssets: vi.fn(),
  fetchAssetDetail: vi.fn(),
  fetchAssetChartData: vi.fn(),
  searchCoins: vi.fn(),
}))

describe('Market Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  it('should have correct initial state', () => {
    const store = useMarketStore()
    expect(store.currentPageAssets).toEqual([])
    expect(store.searchQuery).toBe('')
    expect(store.isLoading).toBe(false)
    expect(store.totalRecords).toBe(0)
  })

  it('loadAssets action should update state on success (no search)', async () => {
    const store = useMarketStore()
    const mockAssets: MarketAsset[] = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 50000, image: 'url' },
    ]

    // We only need to mock the fetchMarketAssets function for this test case
    vi.mocked(api.fetchMarketAssets).mockResolvedValue(mockAssets)

    await store.loadAssets({ page: 0, rows: 5 })

    expect(store.currentPageAssets).toEqual(mockAssets)
    expect(store.isLoading).toBe(false)
    // The totalRecords should now be our hardcoded default of 300
    expect(store.totalRecords).toBe(300)
  })

  it('loadAssets action should handle errors', async () => {
    const store = useMarketStore()

    // Tell the mocked function to reject with an error
    vi.mocked(api.fetchMarketAssets).mockRejectedValue(new Error('API Error'))

    await store.loadAssets({ page: 0, rows: 5 })

    expect(store.currentPageAssets).toEqual([])
    expect(store.isLoading).toBe(false)
  })

  it('searchAssets action should update state correctly on success', async () => {
    const store = useMarketStore()
    const mockSearchResults = ['bitcoin', 'ethereum']
    const mockAssets: MarketAsset[] = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', current_price: 50000, image: 'url' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'eth', current_price: 3000, image: 'url' },
    ]

    // Mock the two API calls that will happen during a search
    vi.mocked(api.searchCoins).mockResolvedValue(mockSearchResults)
    vi.mocked(api.fetchMarketAssets).mockResolvedValue(mockAssets)

    await store.searchAssets('bit')

    expect(store.searchQuery).toBe('bit')
    expect(store.currentPageAssets).toEqual(mockAssets)
    // The totalRecords should be the length of the search results
    expect(store.totalRecords).toBe(mockSearchResults.length)
    expect(store.isLoading).toBe(false)
  })
})
