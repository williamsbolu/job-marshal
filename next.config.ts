import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "7aom1o5q85.ufs.sh",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default nextConfig;
