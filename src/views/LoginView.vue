<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/services/firebase'

// Import PrimeVue components
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

const router = useRouter()
const email = ref('test@market-watch.com')
const password = ref('test@market-watch.com')
const errorMessage = ref<string | null>(null)
const isLoading = ref(false)

const handleLogin = async () => {
  errorMessage.value = null
  try {
    // Use the imported 'auth' instance directly
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/')
  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = error.message = error.message
    } else {
      errorMessage.value = 'An unexpected error occurred'
    }
  }
}
</script>

<template>
  <div class="login-view">
    <!-- Use the Card component for a clean layout -->
    <Card class="login-card">
      <template #title>
        <h2>Login</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email</label>
            <!-- Use the InputText component -->
            <InputText id="email" type="email" v-model="email" class="p-inputtext-lg" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <!-- Use the InputText component -->
            <InputText id="password" type="password" v-model="password" class="p-inputtext-lg" />
          </div>
          <!-- Use the Button component, complete with loading spinner icon! -->
          <Button
            type="submit"
            label="Log In"
            :loading="isLoading"
            class="p-button-lg p-button-success"
            style="width: 100%"
          />
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
      </template>
    </Card>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.login-card {
  width: 100%;
  max-width: 450px;
}
.form-group {
  margin-bottom: 1.5rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}
.p-inputtext-lg {
  width: 100%;
}
.error-message {
  color: var(--p-red-500); /* Use PrimeVue theme colors */
  margin-top: 1rem;
  text-align: center;
}
.info-text {
  font-size: 0.9rem;
  color: var(--p-text-color-secondary);
  text-align: center;
  margin-top: 1.5rem;
}
</style>
