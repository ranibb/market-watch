<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

// Let's create a more detailed interface for our asset data
interface MarketAssetDetail {
  id: string
  symbol: string
  name: string
  image: {
    large: string
  }
  description: {
    en: string
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

// 1. Get access to the current route information
const route = useRoute()

// 2. Define our state variables using ref()
const asset = ref<MarketAssetDetail | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// 3. Get the asset ID from the URL parameters (e.g., the 'bitcoin' in '/asset/bitcoin')
const assetId = route.params.id

// 4. Fetch the data for this specific asset when the component is mounted
onMounted(async () => {
  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${assetId}`)
    if (!response.ok) {
      throw new Error(`Asset with ID "${assetId}" not found.`)
    }
    asset.value = await response.json()
  } catch (e: any) {
    error.value = e.message
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="detail-view">
    <!-- A link to go back to the main dashboard -->
    <RouterLink
      to="/"
      class="back-link"
      >← Back to Dashboard</RouterLink
    >

    <!-- 5. Conditionally render content based on the state -->
    <div
      v-if="isLoading"
      class="loading"
    >
      Loading asset details...
    </div>

    <div
      v-else-if="error"
      class="error-message"
    >
      <h2>Error</h2>
      <p>{{ error }}</p>
    </div>

    <div
      v-else-if="asset"
      class="asset-details"
    >
      <div class="asset-header">
        <img
          :src="asset.image.large"
          :alt="asset.name"
          class="asset-image-large"
        />
        <h1>{{ asset.name }} ({{ asset.symbol.toUpperCase() }})</h1>
      </div>

      <div class="asset-metrics">
        <div class="metric-item">
          <span class="metric-label">Price</span>
          <span class="metric-value">{{
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
              asset.market_data.current_price.usd
            )
          }}</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">Market Cap</span>
          <span class="metric-value">{{
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
              asset.market_data.market_cap.usd
            )
          }}</span>
        </div>
      </div>

      <div class="asset-description">
        <h3>About {{ asset.name }}</h3>
        <!-- 6. Use the v-html directive to render the description -->
        <!-- The API provides HTML content, so we use v-html. -->
        <!-- IMPORTANT: Only use v-html on content you trust. Using it on user-submitted -->
        <!-- content can expose you to security risks (XSS attacks). Since we trust -->
        <!-- the CoinGecko API, this is safe. -->
        <div v-html="asset.description.en"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #42b883;
  text-decoration: none;
  font-weight: 600;
}

.loading,
.error-message {
  text-align: center;
  font-size: 1.2rem;
  padding: 2rem;
}

.error-message {
  color: #d83a3a;
  border: 1px solid #d83a3a;
  border-radius: 8px;
  background-color: #fff5f5;
}

.asset-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.asset-image-large {
  width: 64px;
  height: 64px;
}

h1 {
  margin: 0;
}

.asset-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric-item {
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 8px;
}

.metric-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.metric-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
}

.asset-description {
  line-height: 1.6;
}

/* Styles for the content coming from v-html */
.asset-description :deep(a) {
  color: #42b883;
}
</style>
