import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 設定為 './' 讓資源路徑變為相對路徑，
  // 這樣無論您的 repo 名稱是什麼，部署到 GitHub Pages 時都能正確讀取資源
  base: './', 
});