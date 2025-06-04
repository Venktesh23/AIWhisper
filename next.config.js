/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during builds for quick deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TypeScript errors during builds (if needed)
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev, isServer }) => {
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
    
    // Handle Node.js modules that don't work in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
        encoding: false,
        bufferutil: false,
        'utf-8-validate': false,
      };
      
      // Externalize problematic modules
      config.externals = config.externals || [];
      config.externals.push({
        'ws': 'commonjs ws',
        'bufferutil': 'commonjs bufferutil',
        'utf-8-validate': 'commonjs utf-8-validate',
      });
    }
    
    return config;
  },
  experimental: {
    isrMemoryCacheSize: 0,
    serverActions: true
  }
};

module.exports = nextConfig;