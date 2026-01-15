
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'MyoTrack EMG Performance',
        short_name: 'MyoTrack',
        description: 'Profesyonel EMG tabanlı kas aktivasyon takip ve antrenman analiz uygulaması.',
        theme_color: '#090e1a',
        background_color: '#090e1a',
        display: 'standalone',
        icons: [
          {
            src: 'https://placehold.co/192x192/090e1a/22c55e?text=Myo',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://placehold.co/512x512/090e1a/22c55e?text=MyoTrack',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
