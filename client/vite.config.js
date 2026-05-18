import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegisterSW: false,
      includeAssets: ['favicon.png', 'favicon.svg', 'hero.jpg', 'icons/*.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/serviceknock\.com\/api\//,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache', networkTimeoutSeconds: 10 },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-cache' },
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\//,
            handler: 'CacheFirst',
            options: { cacheName: 'unsplash-images', expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 } },
          },
        ],
      },
      manifest: {
        name: 'Service Knock — Home Services Pakistan',
        short_name: 'Service Knock',
        description: "Pakistan's trusted platform to book verified electricians, plumbers, AC technicians, carpenters, painters and more.",
        theme_color: '#0ea5e9',
        background_color: '#0ea5e9',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'en',
        categories: ['business', 'utilities', 'lifestyle'],
        icons: [
          { src: '/icons/icon-72x72.png',   sizes: '72x72',   type: 'image/png' },
          { src: '/icons/icon-96x96.png',   sizes: '96x96',   type: 'image/png' },
          { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-384x384.png', sizes: '384x384', type: 'image/png' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          {
            name: 'Book a Service',
            short_name: 'Book',
            description: 'Book a home service worker',
            url: '/book-service',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
          },
          {
            name: 'My Bookings',
            short_name: 'Bookings',
            description: 'View your bookings',
            url: '/my-bookings',
            icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
          },
        ],
        screenshots: [
          {
            src: '/hero.jpg',
            sizes: '1200x630',
            type: 'image/jpeg',
            form_factor: 'wide',
            label: 'Service Knock — Home Services Platform',
          },
        ],
      },
    }),
  ],
  base: '/',
  build: {
    outDir: '../public',
    emptyOutDir: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor-react';
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('react-icons')) return 'vendor-ui';
            if (id.includes('axios') || id.includes('react-hot-toast') || id.includes('react-helmet-async')) return 'vendor-utils';
            if (id.includes('@capacitor')) return 'vendor-cap';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
