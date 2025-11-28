import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 使用相對路徑 './' 可以自動適應任何儲存庫名稱，解決白畫面問題
  base: './', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});