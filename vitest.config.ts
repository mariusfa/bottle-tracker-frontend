import { defineConfig, mergeConfig } from 'vitest/config'
import baseViteConfig from './vite.config'

export default mergeConfig(
  baseViteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      setupFiles: ['./testSetup.ts'], 
    },
  })
)
