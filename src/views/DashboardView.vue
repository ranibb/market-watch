<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketStore } from '@/stores/market'

// Import PrimeVue components
import DataTable, { type DataTableRowSelectEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'

const marketStore = useMarketStore()
const router = useRouter()

const searchQuery = computed({
  get: () => marketStore.searchQuery,
  set: (value) => marketStore.setSearchQuery(value),
})

const onRowSelect = (event: DataTableRowSelectEvent) => {
  // Navigate to detail page when a row is clicked
  router.push(`/asset/${event.data.id}`)
}

onMounted(() => {
  if (marketStore.assets.length === 0) {
    marketStore.fetchAssets()
  }
})
</script>

<template>
  <div class="dashboard-view">
    <DataTable
      :value="marketStore.filteredAssets"
      :loading="marketStore.isLoading && marketStore.assets.length === 0"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20]"
      sortMode="multiple"
      selectionMode="single"
      @rowSelect="onRowSelect"
      dataKey="id"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
    >
      <!-- The header template for the table -->
      <template #header>
        <div class="table-header">
          <h2>Market Dashboard</h2>
          <div class="search-bar-container">
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="searchQuery"
                placeholder="Search assets..."
                class="p-inputtext-sm"
              />
            </span>
          </div>
        </div>
      </template>

      <!-- The empty state template -->
      <template #empty>
        <div class="no-results">No assets found.</div>
      </template>

      <!-- Define the columns -->
      <Column field="market_cap_rank" header="Rank" :sortable="true"></Column>

      <Column field="name" header="Name" :sortable="true">
        <template #body="slotProps">
          <div class="name-cell">
            <img :src="slotProps.data.image" :alt="slotProps.data.name" class="asset-logo" />
            <span>{{ slotProps.data.name }} ({{ slotProps.data.symbol.toUpperCase() }})</span>
          </div>
        </template>
      </Column>

      <Column field="current_price" header="Price" :sortable="true">
        <template #body="slotProps">
          {{
            new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
              slotProps.data.current_price,
            )
          }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.search-bar-container .p-input-icon-left {
  position: relative;
  display: inline-block;
}

.search-bar-container .pi {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  transform: translateY(-50%);
  color: var(--p-text-color-secondary);
}

.search-bar-container .p-inputtext-sm {
  width: 300px;
  border-radius: 20px;
  padding-left: 2.5rem;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.asset-logo {
  width: 24px;
  height: 24px;
}
.no-results {
  text-align: center;
  padding: 3rem;
}

/* Make rows clickable */
:deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}
</style>
