import type { NextConfig } from "next";

// Bundle analyzer (optional - run with ANALYZE=true npm run build)
let withBundleAnalyzer: any = (config: NextConfig) => config;
if (process.env.ANALYZE === "true") {
  try {
    withBundleAnalyzer = require("@next/bundle-analyzer")({
      enabled: true,
    });
  } catch (e) {
    // Bundle analyzer not installed, skip it
    console.warn(
      "Bundle analyzer not available. Install with: npm install --save-dev @next/bundle-analyzer"
    );
  }
}

const nextConfig: NextConfig = {
  // Turbopack configuration (required to avoid build errors with Next.js 16+)
  turbopack: {},

  // Optimize production builds
  compiler: {
    // Remove console logs in production (optional)
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Webpack configuration for better tree shaking
  webpack: (config, { isServer }) => {
    // Enable tree shaking for all modules
    if (!config.optimization) {
      config.optimization = {};
    }

    config.optimization = {
      ...config.optimization,
      usedExports: true, // Mark unused exports
      sideEffects: false, // Assume no side effects unless specified in package.json
    };

    // Ensure proper module resolution for tree shaking
    if (!config.resolve) {
      config.resolve = {};
    }

    config.resolve = {
      ...config.resolve,
      mainFields: ["module", "main"], // Prefer ES modules for better tree shaking
    };

    return config;
  },

  // Experimental features for better optimization
  experimental: {
    optimizePackageImports: [
      "lucide-react", // Optimize lucide-react imports
      "recharts", // Optimize recharts imports
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
