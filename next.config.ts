import type { NextConfig } from "next";

// Bundle analyzer (optional - run with ANALYZE=true npm run build)
let withBundleAnalyzer: any = (config: NextConfig) => config;
if (process.env.ANALYZE === "true") {
  withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  });
}

const nextConfig: NextConfig = {
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
    config.optimization = {
      ...config.optimization,
      usedExports: true, // Mark unused exports
      sideEffects: false, // Assume no side effects unless specified in package.json
    };

    // Ensure proper module resolution for tree shaking
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
