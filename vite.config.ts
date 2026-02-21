import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: ['.ngrok-free.app'], // разрешаем ngrok
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // локальный бекенд
        changeOrigin: true,
        secure: false,
      },
    },
  },
})