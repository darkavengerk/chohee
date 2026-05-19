/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@chohee/ui', '@chohee/shared'],
  async headers() {
    // SharedArrayBuffer 활성화 — ffmpeg.wasm 실행에 필요
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
