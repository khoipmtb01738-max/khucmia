import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Khi build: base = '/khucmia/' để chạy đúng trên GitHub Pages
// (https://khoipmtb01738-max.github.io/khucmia/).
// Khi chạy dev (npm run dev): base = '/' như bình thường.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/khucmia/' : '/',
  plugins: [react()],
}))
