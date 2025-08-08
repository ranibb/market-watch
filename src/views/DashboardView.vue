<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketStore } from '@/stores/market'

// Import PrimeVue components
import DataTable, {
  type DataTablePageEvent,
  type DataTableRowSelectEvent,
} from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'

const marketStore = useMarketStore()
const router = useRouter()

// We use a local ref for the input, to control the debouncing
const localSearchQuery = ref(marketStore.searchQuery)
const debounceTimer = ref<number | null>(null)

// WATCH the local input. When it changes, start a timer.
watch(localSearchQuery, (newQuery) => {
  // Clear the previous timer if it exists
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  // Set a new timer
  debounceTimer.value = window.setTimeout(() => {
    // When the timer fires, call the store's search action
    marketStore.searchAssets(newQuery)
  }, 500) // 500ms delay
})

// This function will be called by the DataTable whenever the page or rows-per-page changes
const onPage = (event: DataTablePageEvent) => {
  // Trigger the store action with the event from the DataTable
  marketStore.loadAssets({ page: event.page, rows: event.rows })
}

const onRowSelect = (event: DataTableRowSelectEvent) => {
  // Navigate to detail page when a row is clicked
  router.push(`/asset/${event.data.id}`)
}

onMounted(() => {
  // The store already remembers the currentPage and rowsPerPage.
  // We just need to trigger the load action with the state it already holds.
  // The DataTable's page index is 0-based, so we subtract 1.
  marketStore.loadAssets({
    page: marketStore.currentPage - 1,
    rows: marketStore.rowsPerPage,
  })
})
</script>

<template>
  <div class="dashboard-view">
    <DataTable
      :value="marketStore.currentPageAssets"
      :loading="marketStore.isLoading"
      lazy
      paginator
      :rows="marketStore.rowsPerPage"
      :totalRecords="marketStore.totalRecords"
      :first="(marketStore.currentPage - 1) * marketStore.rowsPerPage"
      :rowsPerPageOptions="[5, 10, 20]"
      @page="onPage"
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
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="localSearchQuery"
              placeholder="Search assets..."
              class="p-inputtext-sm"
            />
          </span>
        </div>
      </template>

      <!-- The empty state template -->
      <template #empty>
        <div class="no-results">No assets found.</div>
      </template>

      <!-- Define the columns -->
      <Column field="market_cap_rank" header="Rank"></Column>

      <Column field="name" header="Name">
        <template #body="slotProps">
          <div class="name-cell">
            <img :src="slotProps.data.image" :alt="slotProps.data.name" class="asset-logo" />
            <span>{{ slotProps.data.name }} ({{ slotProps.data.symbol.toUpperCase() }})</span>
          </div>
        </template>
      </Column>

      <Column field="current_price" header="Price">
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
