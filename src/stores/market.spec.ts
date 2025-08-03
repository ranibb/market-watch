import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useMarketStore } from './market'
import * as api from '@/services/marketApi' // Import our API service

// Mock the entire marketApi service
vi.mock('@/services/marketApi', () => ({
  fetchMarketAssets: vi.fn(),
  fetchAssetDetail: vi.fn(),
}))

describe('Market Store', () => {
  // This ensures a fresh store for every test
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have correct initial state', () => {
    const store = useMarketStore()
    expect(store.assets).toEqual([])
    expect(store.searchQuery).toBe('')
    expect(store.isLoading).toBe(false)
  })

  it('fetchAssets action should update state on success', async () => {
    const store = useMarketStore()
    const mockAssets = [{ id: 'bitcoin', name: 'Bitcoin' }]

    // Tell our mocked function what to return when called
    vi.mocked(api.fetchMarketAssets).mockResolvedValue(mockAssets)

    // Call the action
    await store.fetchAssets()

    // Assert that the state was updated correctly
    expect(store.assets).toEqual(mockAssets)
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('fetchAssets action should handle errors', async () => {
    const store = useMarketStore()
    const errorMessage = 'API Error'

    // Tell our mocked function to reject with an error
    vi.mocked(api.fetchMarketAssets).mockRejectedValue(new Error(errorMessage))

    await store.fetchAssets()

    expect(store.assets).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(errorMessage)
  })
})
