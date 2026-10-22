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
                    if (id.includes('@hugeicons/react')) return 'vendor-icons';
                    if (id.includes('radix-ui') || id.includes('@radix-ui')) return 'vendor-radix';
                    if (id.includes('axios')) return 'vendor-axios';
                    if (id.includes('react-hot-toast')) return 'vendor-toast';
                    // Do not bucket @hugeicons/core-free-icons — that barrel is 7MB+.
                    // Icons are deep-imported from src/icons.ts so only used files ship.
                    // Keep react, react-dom, and react-router in the main graph — splitting them
                    // caused a blank prod shell (Activity / duplicate React runtime).
                },
            },
        },
    },
});
