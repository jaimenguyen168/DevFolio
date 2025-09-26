import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.convex.cloud",
        port: "",
        pathname: "/api/storage/**",
      },
      {
        protocol: "https",
        hostname: "**", // Allows all HTTPS hostnames
      },
      {
        protocol: "http",
        hostname: "**", // Allows all HTTP hostnames
      },
    ],
  },
};

export default nextConfig;
