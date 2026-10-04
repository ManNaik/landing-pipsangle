import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      { source: "/forex-signals", destination: "/automated-forex-trading", permanent: true },
      { source: "/forex-signals/:path*", destination: "/automated-forex-trading", permanent: true },
      { source: "/careers", destination: "/about", permanent: true },
      { source: "/managementadmin", destination: "/admin", permanent: true },
      { source: "/managementadmin/:path*", destination: "/admin/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
