const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev }) => {
    // Optimize watch options for development
    if (dev) {
      config.watchOptions = {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: 1000,
      };
      
      // Disable webpack cache in development to prevent cache-related issues
      config.cache = false;
    }
    
    return config;
  },
  experimental: {
    isrMemoryCacheSize: 0,
    serverActions: true
  },
  // Add proper error handling for API routes
  onError: (err) => {
    console.error('Next.js runtime error:', err);
  },
};

module.exports = nextConfig;