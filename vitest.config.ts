import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [vue()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts']
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@core': resolve(__dirname, 'src/core'),
            '@ai': resolve(__dirname, 'src/ai'),
            '@ui': resolve(__dirname, 'src/ui'),
            '@services': resolve(__dirname, 'src/services'),
            '@plugins': resolve(__dirname, 'src/plugins'),
            '@types': resolve(__dirname, 'src/types'),
            '@utils': resolve(__dirname, 'src/utils')
        }
    }
})
