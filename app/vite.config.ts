import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    define: {
        'process.env': {},
        global: 'window',
    },
    server: {
        port: 3000,
    },
    build: {
        outDir: 'build',
    },
})
