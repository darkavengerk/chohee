import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    // ffmpeg.wasm용 SharedArrayBuffer를 dev에서도 쓸 수 있도록 cross-origin isolation.
    // 운영에서는 hooks.server.ts에서 같은 헤더를 매 응답마다 설정.
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-site',
    },
  },
});
