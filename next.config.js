/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["omny.fm", "playerservices.streamtheworld.com"],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
    optimizeServerReact: true,
    serverMinification: true,
    esmExternals: true,
  },
  // Turbopack configuration (stable)
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
    reactRemoveProperties:
      process.env.NODE_ENV === "production"
        ? { properties: ["^data-testid$"] }
        : false,
    styledComponents: true,
  },
  // Bundle analyzer and optimization - improved for TBT
  webpack: (config, { isServer, dev }) => {
    // Optimize for faster loading and less blocking
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: "all",
        minSize: 10000,
        maxSize: 200000,
        maxAsyncRequests: 10,
        maxInitialRequests: 5,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            priority: -10,
            chunks: "all",
            maxSize: 200000,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "react",
            priority: 10,
            chunks: "all",
          },
          commons: {
            name: "commons",
            minChunks: 2,
            priority: 5,
            chunks: "all",
          },
        },
      },
    };

    // Performance optimizations
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }

    // Production optimizations
    if (!dev) {
      config.optimization.minimize = true;
      // Remove sideEffects line that causes issues
    }

    // Fix asset loading issues
    config.output = {
      ...config.output,
      publicPath: "/_next/",
    };

    return config;
  },
  // PWA Configuration and Security headers combined
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/img/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Compress and optimize for PWA
  compress: true,
  poweredByHeader: false,
};

module.exports = nextConfig;
