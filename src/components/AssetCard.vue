<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { MarketAsset } from '@/stores/market'
import Card from 'primevue/card'

const props = defineProps<MarketAsset>()
</script>

<template>
  <!-- The RouterLink makes the entire card a single navigation element -->
  <RouterLink :to="'/asset/' + props.id" class="asset-card-link">
    <!-- The Card component provides a professional, themed container -->
    <Card class="asset-card">
      <template #content>
        <div class="asset-info">
          <img :src="props.image" alt="MarketAsset Logo" class="asset-logo" />
          <div class="asset-details">
            <h3 class="asset-name">{{ props.name }} ({{ props.symbol.toUpperCase() }})</h3>
            <p class="asset-price">
              {{
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(props.current_price)
              }}
            </p>
          </div>
        </div>
      </template>
    </Card>
  </RouterLink>
</template>

<style scoped>
/* We keep our internal layout styles, but remove card-specific styles like border, shadow, etc. */
.asset-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  margin-bottom: 1rem;
}

.asset-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.asset-card-link:hover .asset-card {
  transform: translateY(-4px);
  /* Use PrimeVue's theme variables for a consistent look */
  box-shadow: 0 4px 12px var(--p-card-shadow);
}

.asset-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.asset-logo {
  width: 40px;
  height: 40px;
}

.asset-details {
  flex-grow: 1;
}

.asset-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.asset-price {
  margin: 0;
  font-size: 1rem;
}
</style>
