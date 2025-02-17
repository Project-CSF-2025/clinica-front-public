// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react', // Emotionを有効化
      babel: {
        plugins: ['@emotion/babel-plugin'], // EmotionのBabelプラグインを追加
      },
    }),
  ],
});