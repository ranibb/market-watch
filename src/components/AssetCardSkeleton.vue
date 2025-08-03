<template>
  <div class="skeleton-card">
    <div class="skeleton-info">
      <div class="skeleton-logo"></div>
      <div>
        <div class="skeleton-text skeleton-title"></div>
        <div class="skeleton-text skeleton-price"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0% {
    background-color: #e0e0e0;
  }
  50% {
    background-color: #d0d0d0;
  }
  100% {
    background-color: #e0e0e0;
  }
}

.skeleton-card {
  display: block;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  background-color: #f5f5f5;
}

.skeleton-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skeleton-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-text {
  height: 1rem;
  border-radius: 4px;
  animation: pulse 1.5s infinite ease-in-out;
}

.skeleton-title {
  width: 150px;
  height: 1.2rem;
  margin-bottom: 0.5rem;
}

.skeleton-price {
  width: 100px;
}
</style>
