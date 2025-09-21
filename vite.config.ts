import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
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
    },
    server: {
        port: 3000,
        open: true,
        cors: true
    },
    build: {
        target: 'esnext',
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['vue', 'pinia'],
                    core: ['@/core'],
                    ai: ['@/ai']
                }
            }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom'
    }
})
