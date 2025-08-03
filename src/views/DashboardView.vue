<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AssetCard from '../components/AssetCard.vue'
import AssetCardSkeleton from '../components/AssetCardSkeleton.vue'
import { useMarketStore } from '@/stores/market'

// 2. Get an instance of the store. This is now our single source of truth.
const marketStore = useMarketStore()

// This is the elegant way to create a two-way binding with a Pinia store state
const searchQuery = computed({
  get: () => marketStore.searchQuery,
  set: (value) => marketStore.setSearchQuery(value),
})

// 3. When the component mounts, just call the store's action.
onMounted(() => {
  // Only fetch if the list is empty, to prevent re-fetching on navigation.
  if (marketStore.assets.length === 0) {
    marketStore.fetchAssets()
  }
})
</script>

<template>
  <div>
    <h2>Market Dashboard</h2>

    <!-- The new search input field -->
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search by name or symbol..."
      class="search-input"
    />

    <!-- Show 10 skeletons while loading -->
    <div v-if="marketStore.isLoading && marketStore.assets.length === 0">
      <AssetCardSkeleton v-for="n in 10" :key="n" />
    </div>

    <!-- 4. Bind directly to the store's state -->
    <div v-else-if="marketStore.filteredAssets.length > 0">
      <!-- Loop over the assetList and render an AssetCard for each one -->
      <AssetCard
        v-for="asset in marketStore.filteredAssets"
        :key="asset.id"
        :id="asset.id"
        :symbol="asset.symbol"
        :name="asset.name"
        :current_price="asset.current_price"
        :image="asset.image"
      />
    </div>
    <div v-else class="no-results">
      <p>No assets found for "{{ searchQuery }}"</p>
    </div>
  </div>
</template>

<style scoped>
.search-input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
