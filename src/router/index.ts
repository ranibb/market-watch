import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
// Make sure the file exists at this path, or update the path if necessary


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/asset/:id',
      name: 'asset-detail',
      component: () => import('../views/DetailView.vue') // We will create this file next
    }
  ]
})

export default router