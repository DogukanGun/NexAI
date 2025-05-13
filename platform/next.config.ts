import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer, webpack }) => {
    config.externals = [...(config.externals || []), 'pino-pretty', 'lokijs', 'encoding'];
    return config;
  },
};

export default nextConfig;
