import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
  },
  /* config options here */
  async redirects() {
    return [
      { source: "/about", destination: "/#sobre", permanent: true },
      { source: "/contact", destination: "/#contato", permanent: true },
      { source: "/projects", destination: "/#projetos", permanent: true },
    ];
  },
};

export default nextConfig;
