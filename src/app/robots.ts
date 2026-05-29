import { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://spirituals.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // 個人の診断結果・API・エラーページはインデックス対象外
      disallow: ['/result/', '/api/', '/error/', '/diagnosis/loading', '/quick/result'],
    },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
