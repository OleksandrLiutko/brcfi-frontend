import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { createServer } from 'https'
import { readFileSync } from 'fs'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // 👈 optimizedeps
    esbuildOptions: {
      target: "esnext",
      // Node.js global to browser globalThis
      define: {
        global: "globalThis",
      },
      supported: {
        bigint: true,
      },
    },
  },
  build: {
    target: "esnext"
  }
  // server: {
  //   https: {
  //     key: readFileSync('key.pem'),
  //     cert: readFileSync('cert.pem'),
  //   }
  // }
});
