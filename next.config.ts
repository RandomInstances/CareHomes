import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Serve the prototype at the root while the production app is built.
      // `beforeFiles` so this wins over the App Router's own "/" route.
      beforeFiles: [
        { source: "/", destination: "/prototype.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
