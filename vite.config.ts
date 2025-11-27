import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 非常重要：這必須匹配您的 GitHub Repository 名稱
  base: '/HTP-GAMES/', 
  build: {
    outDir: 'dist',
  }
});