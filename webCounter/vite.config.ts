import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = process.env.VITE_APP_BASE || '/webCounter/'

export default defineConfig({
  base,
  plugins: [react()],
})
