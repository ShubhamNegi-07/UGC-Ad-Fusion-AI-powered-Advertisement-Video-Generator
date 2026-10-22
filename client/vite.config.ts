import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tailwindcss(),
        react(),
        process.env.ANALYZE === '1' &&
            visualizer({
                filename: 'bundle-stats.html',
                gzipSize: true,
                brotliSize: true,
                open: false,
            }),
    ].filter(Boolean),
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        host: true,
        port: 5173,
        strictPort: true,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return;
                    if (id.includes('@clerk')) return 'vendor-clerk';
                    if (id.includes('framer-motion')) return 'vendor-motion';
                    if (id.includes('@hugeicons')) return 'vendor-icons';
                    // Keep react, react-dom, and react-router in the main graph — splitting them
                    // caused a blank prod shell (Activity / duplicate React runtime).
                },
            },
        },
    },
});
