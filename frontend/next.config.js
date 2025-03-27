/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'backend',
      }
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  webpack: (config) => {
    config.externals = [...(config.externals || []), { bufferutil: 'bufferutil', 'utf-8-validate': 'utf-8-validate' }];
    return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'backend:3001'],
    },
    optimizePackageImports: ['@heroicons/react'],
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
