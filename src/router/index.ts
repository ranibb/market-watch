import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DashboardView from '../views/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }, // <-- Mark this route as protected
    },
    {
      path: '/asset/:id',
      name: 'asset-detail',
      component: () => import('../views/DetailView.vue'), // We will create this file next
      meta: { requiresAuth: true }, // <-- Mark this route as protected
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: () => import('../views/PortfolioView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.currentUser) {
    next('/login')
  } else if (to.name === 'login' && authStore.currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
