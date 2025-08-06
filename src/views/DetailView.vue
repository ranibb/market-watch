<script setup lang="ts">
import Chart from 'primevue/chart'
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useMarketStore } from '@/stores/market'
import { useFormatter } from '@/composables/useFormatter'

// Import PrimeVue components
import Panel from 'primevue/panel'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Card from 'primevue/card'

const route = useRoute()
const marketStore = useMarketStore()
const assetId = route.params.id as string

const assetDetails = computed(() => marketStore.getAssetDetailsById(assetId))
const chartData = ref()
const chartOptions = ref({
  plugins: { legend: { display: false } },
  scales: { x: { ticks: { display: false } }, y: { ticks: { display: true } } },
})

const { formatCurrency } = useFormatter()

// This 'watch' will update the chart data whenever the asset details are loaded/updated
watch(
  assetDetails,
  (newDetails) => {
    if (newDetails?.chartData?.prices) {
      chartData.value = {
        labels: newDetails.chartData.prices.map((p) => new Date(p[0]).toLocaleDateString()),
        datasets: [
          {
            label: 'Price (USD)',
            data: newDetails.chartData.prices.map((p) => p[1]),
            borderColor: '#42b883',
            tension: 0.4,
          },
        ],
      }
    }
  },
  { immediate: true },
)

onMounted(() => {
  marketStore.fetchAssetDetailsIfNeeded(assetId)
})
</script>

<template>
  <div class="detail-view">
    <RouterLink to="/">
      <Button label="Back to Dashboard" icon="pi pi-arrow-left" text />
    </RouterLink>

    <div v-if="marketStore.isLoading" class="loading">Loading details...</div>
    <div v-else-if="!assetDetails && !marketStore.isLoading" class="error-message">
      <h2>Error</h2>
      <p>Could not load details for asset with ID "{{ assetId }}".</p>
    </div>

    <div v-else-if="assetDetails" class="asset-details-container">
      <div class="asset-header">
        <Avatar :image="assetDetails.image.large" size="xlarge" shape="circle" />
        <div class="header-text">
          <h1>{{ assetDetails.name }}</h1>
          <Tag :value="assetDetails.symbol.toUpperCase()" severity="success" />
        </div>
      </div>

      <div class="asset-metrics">
        <Card class="metric-card">
          <template #title>
            <div class="metric-label">Price</div>
          </template>
          <template #content>
            <div class="metric-value">
              <!-- Use the clean formatter function -->
              {{ formatCurrency(assetDetails.market_data.current_price.usd) }}
            </div>
          </template>
        </Card>

        <Card class="metric-card">
          <template #title>
            <div class="metric-label">Market Cap</div>
          </template>
          <template #content>
            <div class="metric-value">
              {{ formatCurrency(assetDetails.market_data.market_cap.usd) }}
            </div>
          </template>
        </Card>
      </div>

      <Divider />

      <Panel header="7-Day Price Chart" toggleable>
        <Chart type="line" :data="chartData" :options="chartOptions" />
      </Panel>

      <Divider />

      <!-- The Panel component provides a clean, toggleable container for the description -->
      <Panel header="About" toggleable>
        <div class="asset-description" v-html="assetDetails.description.en"></div>
      </Panel>
    </div>
  </div>
</template>

<style scoped>
.detail-view {
  max-width: 900px;
  margin: 0 auto;
}

.asset-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 2rem 0;
}

.header-text h1 {
  margin: 0 0 0.5rem 0;
  color: var(--app-text-color);
}

.asset-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Style the new Card component */
.metric-card :deep(.p-card-title) {
  font-size: 1rem;
  font-weight: 500;
  color: var(--p-text-color-secondary);
  margin-bottom: 0.5rem;
}

.metric-card :deep(.p-card-content) {
  padding: 0;
}

.metric-label {
  /* This is now the title of the card, but we style it like a label */
  font-size: 1rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 600;
  color: var(--p-text-color);
}

.asset-description :deep(a) {
  color: var(--p-primary-color);
}
</style>
