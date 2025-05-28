import { defineConfig } from 'vite'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    base: '/viz/',
    server: {
        open: '/viz/pages/curve/5/index.html'
    },
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                curve1: resolve(__dirname, 'pages/curve/1/index.html'),
                curve2: resolve(__dirname, 'pages/curve/2/index.html'),
                curve3: resolve(__dirname, 'pages/curve/3/index.html'),
                curve4: resolve(__dirname, 'pages/curve/4/index.html'),
                curve5: resolve(__dirname, 'pages/curve/5/index.html')
            }
        }
    }
})
