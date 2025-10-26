// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    base: '/JournAffinity/', // prepends this to all assets in the build
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});
