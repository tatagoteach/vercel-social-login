import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 建置優化
  build: {
    // 輸出目錄
    outDir: 'dist',
    
    // 生成 source map 用於除錯
    sourcemap: false,
    
    // 移除 console.log
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    
    // 分塊策略
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@heroicons/react']
        }
      }
    },
    
    // 資源大小警告閾值
    chunkSizeWarningLimit: 1000
  },
  
  // 開發伺服器配置
  server: {
    port: 3000,
    host: true
  },
  
  // 預覽伺服器配置
  preview: {
    port: 3000,
    host: true
  },
  
  // 路徑別名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@lib': resolve(__dirname, 'src/lib'),
      '@types': resolve(__dirname, 'src/types')
    }
  },
  
  // 環境變數前綴
  envPrefix: 'VITE_'
})
