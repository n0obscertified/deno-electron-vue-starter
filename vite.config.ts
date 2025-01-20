import { fileURLToPath, URL } from 'node:url'
import process from "node:process"
import { defineConfig, loadEnv, UserConfig, ConfigEnv } from 'vite'

import { nodePolyfills } from 'vite-plugin-node-polyfills'
import vue from '@vitejs/plugin-vue'

import vuetify from 'vite-plugin-vuetify'
// import config from './src/lib/config'
// https://vitejs.dev/config/
console.log(process.cwd())
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {

  const env = loadEnv(mode, process.cwd(), '')
  return  {

    server: {
        port: 3000,
    },
    preview: {
        port: 2025,
    },
    root: "./vue",
    base: "./",
    
    
    build: {
      
      sourcemap: true,
      outDir: '../dist/vue',
      
    },
    plugins: [
      vue({
        // template: { transformAssetUrls }
      }),
      vuetify({
        autoImport: { labs: true }
      }),
      nodePolyfills({
        // Whether to polyfill `node:` protocol imports.
        protocolImports: true
      })
      // babel()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./vue', import.meta.url))
      }
    }
  
  } as UserConfig

 })
