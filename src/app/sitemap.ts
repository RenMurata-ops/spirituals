import { MetadataRoute } from 'next';
import { CONCERNS } from '@/data/pseo/concerns';

const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://spirituals.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/s', '/quick', '/diagnosis', '/contact'].map((p) => ({
    url: `${BASE}${p || '/'}`,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.8,
  }));

  const concernPages = CONCERNS.map((c) => ({
    url: `${BASE}/s/${c.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const legalPages = ['/legal/terms', '/legal/privacy', '/legal/tokushoho'].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: 'yearly' as const,
    priority: 0.2,
  }));

  return [...staticPages, ...concernPages, ...legalPages];
}
