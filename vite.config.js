// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                contact: resolve(__dirname, 'contact.html'),
                overons: resolve(__dirname, 'over-ons.html'),
                projecten: resolve(__dirname, 'projecten.html'),
            }
        }
    }
});