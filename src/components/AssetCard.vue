<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { MarketAsset } from '@/stores/market'
const props = defineProps<MarketAsset>()
</script>

<template>
  <RouterLink :to="'/asset/' + props.id" class="asset-card">
    <div class="asset-info">
      <img :src="props.image" alt="MarketAsset Logo" class="asset-logo" />
      <div>
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
  </RouterLink>
</template>

<style scoped>
/* 3. 'scoped' styles mean these CSS rules only apply to this component. */
/* This prevents styles from leaking out and affecting other parts of your app. */
.asset-card {
  display: block;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
  background-color: #f9f9f9;
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.asset-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.asset-name {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.asset-price {
  margin: 0;
  font-size: 1rem;
  color: #333;
}
</style>
