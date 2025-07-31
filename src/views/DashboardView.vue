<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AssetCard from '../components/AssetCard.vue'
import type { MarketAsset } from '../components/AssetCard.vue'

const assetList = ref<MarketAsset[]>([])
const isLoading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1'
    )
    if (!response.ok) throw new Error('Failed to fetch assets')
    assetList.value = await response.json()
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <h2>Market Dashboard</h2>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <!-- Loop over the assetList and render an AssetCard for each one -->
      <AssetCard
        v-for="asset in assetList"
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
