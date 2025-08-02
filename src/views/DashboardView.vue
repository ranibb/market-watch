<script setup lang="ts">
import { onMounted } from 'vue'
import AssetCard from '../components/AssetCard.vue'
import { useMarketStore } from '@/stores/market'

// 2. Get an instance of the store. This is now our single source of truth.
const marketStore = useMarketStore()

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
     <!-- 4. Bind directly to the store's state -->
    <div v-if="marketStore.isLoading && marketStore.assets.length === 0">Loading...</div>
    <div v-else-if="marketStore.error">{{ marketStore.error }}</div>
    <div v-else>
      <!-- Loop over the assetList and render an AssetCard for each one -->
      <AssetCard
        v-for="asset in marketStore.assetList"
        :key="asset.id"
        :id="asset.id"
        :symbol="asset.symbol"
        :name="asset.name"
        :current_price="asset.current_price"
        :image="asset.image"
      />
    </div>
  </div>
</template>
