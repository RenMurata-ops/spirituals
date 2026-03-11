import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isGithubPages ? '/spirituals' : '',
  assetPrefix: isGithubPages ? '/spirituals/' : '',
};

export default nextConfig;
