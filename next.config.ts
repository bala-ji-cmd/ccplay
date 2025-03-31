import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Increase as needed
    },
    responseLimit: '100mb', // Add this for response size limit
  },
};

export default nextConfig;
