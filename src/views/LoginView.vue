<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/services/firebase'

const router = useRouter()
const email = ref('test@market-watch.com')
const password = ref('test@market-watch.com')
const errorMessage = ref<string | null>(null)

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
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Login</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">Log In</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <p class="info-text"></p>
    </form>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
}
.login-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  background-color: #42b883;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.error-message {
  color: #d83a3a;
  margin-top: 1rem;
}
.info-text {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin-top: 1rem;
}
</style>
