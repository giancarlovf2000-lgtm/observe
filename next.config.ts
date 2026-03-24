import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Transpile deck.gl and its dependencies (they ship ESM)
  transpilePackages: [
    'deck.gl',
    '@deck.gl/core',
    '@deck.gl/layers',
    '@deck.gl/react',
    '@deck.gl/aggregation-layers',
    '@deck.gl/geo-layers',
    '@luma.gl/core',
    '@luma.gl/engine',
    '@luma.gl/webgl',
    '@luma.gl/shadertools',
    '@math.gl/core',
    '@math.gl/web-mercator',
    '@loaders.gl/core',
    '@loaders.gl/loader-utils',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
