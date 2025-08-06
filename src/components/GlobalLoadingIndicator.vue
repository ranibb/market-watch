<template>
  <div class="loading-overlay">
    <div class="spinner"></div>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  /* 
    FIX 1: Use our custom --app-surface-color variable for the background.
    The 'cc' at the end adds 80% alpha transparency. 
  */
  background-color: var(--app-surface-color, #ffffff);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  /* Add a smooth transition for the background color change */
  transition: background-color 0.3s ease;
}

.spinner {
  /* 
    FIX 2: Use PrimeVue's theme variables for the spinner colors.
    --p-surface-300 is a slightly darker shade of the surface color.
    --p-primary-color is the main theme color (e.g., green).
  */
  border: 4px solid var(--p-surface-300, #e0e0e0);
  border-top-color: var(--p-primary-color, #42b883);

  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

p {
  /* Use our custom text color variable */
  color: var(--app-text-color-secondary, #666);
  margin-top: 1rem;
  font-weight: 500;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
