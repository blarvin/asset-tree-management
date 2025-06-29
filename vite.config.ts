import { defineConfig } from 'vite'

export default defineConfig({
  // Dev server configuration for HTML files
  server: {
    port: 3000,
    open: true
  },
  
  // Library build configuration
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es']
    },
    rollupOptions: {
      external: /^lit/
    }
  }
})