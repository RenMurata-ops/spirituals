import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CONCERNS, concernBySlug, GATE_LABEL } from '@/data/pseo/concerns';
import pseoContent from '@/data/pseo/content.json';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface ConcernContent {
  leadParagraph: string;
  symptoms: string[];
  mechanism: string;
  gateBridge: string;
  ctaLead: string;
  faq: { q: string; a: string }[];
}

const content = pseoContent as Record<string, ConcernContent>;

// 全悩みページを静的生成（pSEO）
export function generateStaticParams() {
  return CONCERNS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const concern = concernBySlug(slug);
  if (!concern) return {};
  const title = `${concern.label}のはなぜ？ ${GATE_LABEL[concern.gate]}から見る精神構造診断 | Spirituals`;
  const description = `「${concern.label}」の本当の理由を、4つの門の精神構造から無料診断。${concern.keywords.join('・')}。波動を守る時代の自己分析。`;
  const url = `/s/${concern.slug}`;
  return {
    title,
    description,
    keywords: concern.keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
    },
  };
}

export default async function ConcernPage({ params }: PageProps) {
  const { slug } = await params;
  const concern = concernBySlug(slug);
  if (!concern) notFound();

  const c = content[slug];
  const gateLabel = GATE_LABEL[concern.gate];
  const related = CONCERNS.filter(
    (x) => x.slug !== concern.slug && x.gate === concern.gate
  );
  const others = CONCERNS.filter((x) => x.gate !== concern.gate).slice(0, 4);

  const faqJsonLd = c?.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: c.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  return (
    <main className="min-h-screen bg-amber-50/50">
      <article className="max-w-2xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <p className="text-sm text-amber-700/80 mb-3 tracking-wide">
          {gateLabel}の悩み
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-8 leading-snug tracking-wide">
          {concern.label}——その理由は「{gateLabel}」にあるかもしれません
        </h1>

        <p className="text-amber-800 leading-relaxed mb-12">
          {c?.leadParagraph ??
            `${concern.label}と感じるとき、原因は表面の出来事ではなく、あなたの精神構造の偏りにあることがあります。`}
        </p>

        {c?.symptoms?.length ? (
          <section className="mb-12">
            <h2 className="text-base font-medium text-amber-900 mb-4">
              こんな状態はありませんか
            </h2>
            <ul className="space-y-3">
              {c.symptoms.map((s, i) => (
                <li key={i} className="flex gap-3 text-amber-800 leading-relaxed">
                  <span className="text-amber-500 shrink-0">◇</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {c?.mechanism ? (
          <section className="mb-12">
            <h2 className="text-base font-medium text-amber-900 mb-4">
              なぜ、それが起きるのか
            </h2>
            <p className="text-amber-800 leading-relaxed">{c.mechanism}</p>
          </section>
        ) : null}

        {c?.gateBridge ? (
          <section className="mb-12 border-l-4 border-amber-300 pl-5 py-1">
            <p className="text-amber-800 leading-relaxed">{c.gateBridge}</p>
          </section>
        ) : null}

        {/* CTA */}
        <section className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8 my-12 text-center">
          <p className="text-amber-800 leading-relaxed mb-6">
            {c?.ctaLead ??
              'あなたの4つの門のバランスを、無料で可視化できます。まずは10秒の簡易診断から。'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/quick"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg bg-[#8b7355] text-white hover:bg-[#9d8465] transition-colors"
            >
              10秒の無料診断を始める
            </Link>
            <Link
              href="/diagnosis"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg bg-white text-[#5c4d3d] border border-[#d4c4b0] hover:border-[#8b7355] transition-colors"
            >
              本格20問診断へ
            </Link>
          </div>
        </section>

        {c?.faq?.length ? (
          <section className="mb-12">
            <h2 className="text-base font-medium text-amber-900 mb-4">よくある質問</h2>
            <div className="space-y-6">
              {c.faq.map((f, i) => (
                <div key={i}>
                  <p className="font-medium text-amber-900 mb-2">Q. {f.q}</p>
                  <p className="text-amber-800 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* 内部リンク */}
        <nav className="border-t border-amber-200 pt-10 mt-12">
          {related.length ? (
            <div className="mb-8">
              <h2 className="text-sm font-medium text-amber-900 mb-4">
                {gateLabel}に関わる他の悩み
              </h2>
              <ul className="space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/s/${r.slug}`}
                      className="text-amber-700 hover:text-amber-900 underline underline-offset-4"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div>
            <h2 className="text-sm font-medium text-amber-900 mb-4">他の悩みから探す</h2>
            <ul className="space-y-2">
              {others.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/s/${r.slug}`}
                    className="text-amber-700 hover:text-amber-900 underline underline-offset-4"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/s"
              className="inline-block mt-6 text-amber-700 hover:text-amber-900 underline underline-offset-4"
            >
              すべての悩みを見る →
            </Link>
          </div>
        </nav>
      </article>

      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
    </main>
  );
}
