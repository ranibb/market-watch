// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '@/services/firebase'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const currentUser = ref<User | null>(null)
  const isLoading = ref(true)

  // ACTIONS

  // This action will be called once to set up a listener
  const init = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, (user) => {
        currentUser.value = user
        isLoading.value = false
        resolve(user)
      })
    })
  }

  const logout = async () => {
    isLoading.value = true
    try {
      await signOut(auth)
      // On successful logout, navigate to the login page
      router.push('/login')
    } catch (error) {
      console.error('Error signing out: ', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    currentUser,
    isLoading,
    init,
    logout,
  }
})
