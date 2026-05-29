import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ホーム直下の package-lock.json により workspace root が誤検出されるのを防ぐ。
  // root を固定しないと型生成が next を別ツリーから解決し next/server.js が解決不能になる。
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
