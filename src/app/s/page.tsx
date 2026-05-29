import { Metadata } from 'next';
import Link from 'next/link';
import { CONCERNS, GATE_LABEL, ConcernGate } from '@/data/pseo/concerns';

export const metadata: Metadata = {
  title: '悩みから診断する | Spirituals 精神構造診断',
  description:
    '人間関係・恋愛・考えすぎ・無気力・将来不安——その悩みを4つの門（心門・智門・氣門・時門）の精神構造から無料診断。波動を守る時代の自己分析。',
  alternates: { canonical: '/s' },
};

const GATE_ORDER: ConcernGate[] = ['heart', 'wisdom', 'energy', 'time'];
const GATE_THEME: Record<ConcernGate, string> = {
  heart: '感情・人間関係',
  wisdom: '思考・判断',
  energy: '活力・自己肯定',
  time: '基盤・人生の方向',
};

export default function ConcernHubPage() {
  return (
    <main className="min-h-screen bg-amber-50/50">
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-6 tracking-wide">
          悩みから、精神構造を診る
        </h1>
        <p className="text-amber-800 leading-relaxed mb-12">
          いま感じている悩みは、4つの門のどこかの滞りとして現れています。
          近いものを選ぶと、その背景にある精神構造の読み解きと、無料診断への入口が開きます。
        </p>

        <div className="space-y-10">
          {GATE_ORDER.map((gate) => (
            <section key={gate}>
              <h2 className="text-base font-medium text-amber-900 mb-1">
                {GATE_LABEL[gate]}
              </h2>
              <p className="text-sm text-amber-700/70 mb-4">{GATE_THEME[gate]}</p>
              <ul className="space-y-2">
                {CONCERNS.filter((c) => c.gate === gate).map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/s/${c.slug}`}
                      className="text-amber-700 hover:text-amber-900 underline underline-offset-4"
                    >
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/quick"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-lg bg-[#8b7355] text-white hover:bg-[#9d8465] transition-colors"
          >
            悩みが定まらない人は10秒診断から
          </Link>
        </div>
      </div>
    </main>
  );
}
