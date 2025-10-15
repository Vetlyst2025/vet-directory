import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    allowedDevOrigins: ['smart-pots-tickle.lindy.site'],
  },
};

export default nextConfig;
