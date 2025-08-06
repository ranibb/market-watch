<script setup lang="ts">
import Skeleton from 'primevue/skeleton'
import Card from 'primevue/card'
</script>

<template>
  <Card class="skeleton-card">
    <template #content>
      <div class="skeleton-info">
        <Skeleton shape="circle" size="40px" />
        <div class="skeleton-details">
          <Skeleton width="150px" height="1.2rem" class="p-mb-2" />
          <Skeleton width="100px" height="1rem" />
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.skeleton-card {
  margin-bottom: 1rem;
}
.skeleton-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.skeleton-details {
  flex-grow: 1;
}
.p-mb-2 {
  margin-bottom: 0.5rem;
}
</style>
