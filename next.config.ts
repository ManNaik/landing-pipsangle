import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.BACKEND_URL,
  },
};

export default nextConfig;
