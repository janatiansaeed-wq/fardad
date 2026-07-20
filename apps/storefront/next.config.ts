import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["@fardad/config", "@fardad/types", "@fardad/ui", "@fardad/utils"],
};

export default nextConfig;
