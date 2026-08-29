import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      // Rolled back: the prototype serves the homepage again while its visual
      // design is ported into the database-backed pages. Those pages are still
      // live at /[suburb]/[home] — this only changes what "/" shows.
      beforeFiles: [{ source: "/", destination: "/prototype.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
