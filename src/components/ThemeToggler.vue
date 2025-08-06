<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'

const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-theme')
  } else {
    document.documentElement.classList.remove('dark-theme')
  }
}

// Check the initial state when the component mounts
onMounted(() => {
  isDarkMode.value = document.documentElement.classList.contains('dark-theme')
})
</script>

<template>
  <Button
    :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
    @click="toggleTheme"
    text
    rounded
    aria-label="Theme Toggler"
  />
</template>
