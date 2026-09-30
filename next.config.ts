import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build autonome (server.js + node_modules minimaux) : idéal pour o2switch (Passenger) et Docker
  output: "standalone",
  poweredByHeader: false,
};

export default nextConfig;
