import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { visualizer } from 'rollup-plugin-visualizer'
import federation from '@originjs/vite-plugin-federation'

const isProduction = process.env.NODE_ENV === 'production'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'shell_app',
      exposes: {
        './baseTheme': './src/assets/base.css',
      },
      remotes: {
        portfolio_app: isProduction
          ? 'https://elegant-cupcake-d6a16d.netlify.app/assets/remoteEntry.js'
          : 'http://localhost:5001/assets/remoteEntry.js',
      },
      shared: ['vue'],
    }),
    visualizer({
      open: true, // Automatically open the report in your browser after build
      filename: 'dist/stats.html', // Output file
      gzipSize: true, // Show gzipped sizes
      brotliSize: true, // Show brotli compressed sizes
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
