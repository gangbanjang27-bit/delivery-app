import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'www.themealdb.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'recipe1.ezmember.co.kr',
      }
    ],
  },
};

export default nextConfig;

// Force Next.js dev server restart
// Trigger another restart
// And another one
// One more for full flush
// Final flush
// Real final flush
// Restart requested by user
// 10000recipe refresh
