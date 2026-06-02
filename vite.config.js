import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const scriptUrl = env.VITE_APPS_SCRIPT_URL || ''
  let proxy

  if (scriptUrl) {
    const targetUrl = new URL(scriptUrl)
    proxy = {
      '/api': {
        target: targetUrl.origin,
        changeOrigin: true,
        secure: true,
        rewrite: () => targetUrl.pathname,
      },
    }
  }

  return {
    plugins: [react()],
    server: {
      proxy,
    },
  }
})
