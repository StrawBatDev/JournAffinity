import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    // base: '/JournAffinity/', // Use this base when *not* using a custom domain)
    base: '/', // Use this base when using a custom domain.
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                colorPicker: resolve(__dirname, 'src/colorPicker.html'),
                mentionPicker: resolve(__dirname, 'src/mentionPicker.html'),
                navigationPicker: resolve(__dirname, 'src/navigationPicker.html'),
            },
        },
    },
});
