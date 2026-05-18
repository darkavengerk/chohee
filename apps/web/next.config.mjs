/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@chohee/ui', '@chohee/shared'],
  experimental: {
    typedRoutes: false,
  },
  async headers() {
    // SharedArrayBuffer 활성화 — ffmpeg.wasm 실행에 필요
    // 모든 페이지에 적용하면 일부 외부 임베드가 깨질 수 있어
    // 업로드 라우트만 격리할 수도 있음 (현재는 전 라우트 적용).
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { ...(config.resolve.fallback ?? {}), fs: false, path: false };
    return config;
  },
};

export default nextConfig;
