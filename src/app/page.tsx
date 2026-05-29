'use client';

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { GateIcon } from "@/components/diagnosis/GateIcon";
import { Button } from "@/components/ui/Button";
import { GateType, GATE_CONFIG } from "@/types/diagnosis";

const GATE_ORDER: GateType[] = ['heart', 'wisdom', 'energy', 'time'];

// セクション区切り
function SectionDivider() {
  return <div className="h-px bg-stone-200 my-16 md:my-24" />;
}

// セクションタイトル
function SectionTitle({ children, subtitle }: { children: React.ReactNode; subtitle?: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-xl md:text-2xl font-medium text-stone-800 mb-4">
        {children}
      </h2>
      {subtitle && (
        <p className="text-stone-500 text-sm">{subtitle}</p>
      )}
    </div>
  );
}

// チェックアイコン（SVG）
function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

// 問題提起カード
function ProblemCard({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-4 p-5 bg-stone-100/50 rounded-lg">
      <CheckIcon />
      <p className="text-stone-700 leading-relaxed">{text}</p>
    </div>
  );
}

// 機能アイコン（SVG）
function ScienceIcon() {
  return (
    <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function SpeedIcon() {
  return (
    <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg className="w-8 h-8 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

// 機能カード
function FeatureCard({ iconType, title, description }: { iconType: 'science' | 'speed' | 'report'; title: string; description: string }) {
  return (
    <div className="text-center p-6 bg-white rounded-xl border border-stone-200 shadow-sm">
      <div className="flex justify-center mb-4">
        {iconType === 'science' && <ScienceIcon />}
        {iconType === 'speed' && <SpeedIcon />}
        {iconType === 'report' && <ReportIcon />}
      </div>
      <h3 className="font-medium text-stone-800 mb-2">{title}</h3>
      <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ユーザーの声カード
function TestimonialCard({ quote, author, attribute }: { quote: string; author: string; attribute: string }) {
  return (
    <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-sm">
      <p className="text-stone-700 leading-relaxed mb-4 italic">&ldquo;{quote}&rdquo;</p>
      <div className="text-sm">
        <p className="font-medium text-stone-800">{author}</p>
        <p className="text-stone-500">{attribute}</p>
      </div>
    </div>
  );
}

// FAQアイテム
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b border-stone-200 py-6 last:border-b-0">
      <h3 className="font-medium text-stone-800 mb-3">Q. {question}</h3>
      <p className="text-stone-600 leading-relaxed">A. {answer}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* ===== セクション1: ヒーロー ===== */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="text-center space-y-10">
            {/* 4つの門アイコン */}
            <div className="flex justify-center">
              <div className="flex gap-6 md:gap-10">
                {GATE_ORDER.map((gate) => (
                  <div key={gate} className="flex flex-col items-center">
                    <GateIcon type={gate} size={36} />
                    <p className="text-xs text-stone-400 mt-2">{GATE_CONFIG[gate].label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* メインコピー（損失回避フレーミング） */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium text-stone-800 leading-relaxed">
              あなたのエネルギーを
              <br />
              奪っているものの正体。
            </h1>

            {/* サブコピー（具体的ベネフィット） */}
            <p className="text-stone-600 max-w-md mx-auto leading-relaxed">
              「断れない」「気を遣いすぎる」「考えが止まらない」
              <br />
              その原因は性格ではなく、<span className="text-stone-800 font-medium">心の構造</span>にあります。
              <br className="hidden md:block" />
              5つの質問で、あなたの消耗パターンを特定します。
            </p>

            {/* CTAボタン */}
            <div className="pt-4">
              <Link href="/quick">
                <Button
                  variant="primary"
                  size="lg"
                  className="text-base px-10 py-4 bg-stone-800 hover:bg-stone-700 text-white border-0"
                >
                  10秒で自分の消耗パターンを知る
                </Button>
              </Link>
              <p className="text-stone-400 text-xs mt-4">※ 登録不要・完全無料</p>
            </div>

            {/* 価格アンカリング */}
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="text-stone-400 line-through">通常 5,000円相当</span>
              <span className="bg-red-50 text-red-600 font-medium px-3 py-1 rounded-full text-xs border border-red-200">今だけ無料</span>
            </div>
          </div>
        </Container>
      </section>

      <SectionDivider />

      {/* ===== セクション2: 問題提起（損失回避フレーム） ===== */}
      <section className="py-16 md:py-20">
        <Container size="md">
          <SectionTitle subtitle="放っておくと、どんどん消耗していきます">
            こんなことに心当たりはありませんか？
          </SectionTitle>

          <div className="space-y-4">
            <ProblemCard text="人と会った後、ぐったり疲れて何もできなくなる。でも断れない" />
            <ProblemCard text="相手の顔色が気になって、本音を飲み込んでしまう" />
            <ProblemCard text="休日に休んでいるはずなのに、月曜にはもう限界" />
            <ProblemCard text="夜中に考え事が止まらず、朝まで眠れない日がある" />
          </div>

          <div className="text-center mt-10 space-y-4">
            <p className="text-stone-700 leading-relaxed font-medium">
              これらは「性格の問題」ではありません。
            </p>
            <p className="text-stone-600 leading-relaxed">
              あなたの心には4つの領域があり、そのバランスの偏りが
              <br className="hidden md:block" />
              <span className="text-stone-800 font-medium">無意識のエネルギー漏れ</span>を引き起こしています。
            </p>
          </div>
        </Container>
      </section>

      <SectionDivider />

      {/* ===== セクション3: 解決策（4つの門） ===== */}
      <section className="py-16 md:py-20">
        <Container>
          <SectionTitle subtitle="心理学 × 東洋思想に基づく4領域分析">
            あなたの心の「消耗ポイント」を特定する
          </SectionTitle>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {GATE_ORDER.map((gate) => (
              <div
                key={gate}
                className="text-center p-6 bg-white rounded-xl border border-stone-200 shadow-sm"
              >
                <GateIcon type={gate} size={48} className="mx-auto" />
                <h3 className="font-medium text-stone-800 mt-4 mb-2">
                  {GATE_CONFIG[gate].label}
                </h3>
                <p className="text-stone-500 text-xs leading-relaxed">
                  {gate === 'heart' && '断れない・気を遣いすぎる'}
                  {gate === 'wisdom' && '考えすぎ・決められない'}
                  {gate === 'energy' && '場の空気に疲れる・回復しない'}
                  {gate === 'time' && '過去に囚われる・動けない'}
                </p>
              </div>
            ))}
          </div>

          <p className="text-center text-stone-600 mt-10 leading-relaxed max-w-lg mx-auto">
            診断では、あなたが<span className="text-stone-800 font-medium">最もエネルギーを失っている領域</span>を特定し、
            <br />
            なぜ疲れるのか・どう対処すればいいかを具体的にお伝えします。
          </p>
        </Container>
      </section>

      <SectionDivider />

      {/* ===== セクション4: 具体的にわかること ===== */}
      <section className="py-16 md:py-20">
        <Container>
          <SectionTitle subtitle="通常5,000円相当の診断が無料">
            この診断でわかること
          </SectionTitle>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              iconType="science"
              title="消耗の根本原因"
              description="なぜあなたは人と会うと疲れるのか。性格ではなく、心の構造から原因を特定します。"
            />
            <FeatureCard
              iconType="speed"
              title="無意識の行動パターン"
              description="あなたが気づいていない「自動反応」を可視化。気を遣いすぎる・考えすぎるクセの正体がわかります。"
            />
            <FeatureCard
              iconType="report"
              title="具体的な対処法"
              description="「明日から何をすればいいか」がわかる、あなた専用の改善アクションをお伝えします。"
            />
          </div>
        </Container>
      </section>

      <SectionDivider />

      {/* ===== セクション5: 社会的証明 ===== */}
      <section className="py-16 md:py-20 bg-stone-100/50">
        <Container>
          <div className="text-center mb-10">
            <p className="text-3xl md:text-4xl font-medium text-stone-800">3,000+</p>
            <p className="text-stone-500 mt-2">名が診断を受けて「原因がわかった」と回答</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="ずっと「自分が弱いから疲れる」と思っていたけど、心の構造の問題だとわかって救われました。対処法を実践したら、人と会った後の疲労感が明らかに減りました。"
              author="M.S.さん"
              attribute="34歳・会社員・女性"
            />
            <TestimonialCard
              quote="「考えすぎ」の正体がわかった。頭では分かっていたけど、具体的に何を変えればいいか初めて明確になった。夜の考え事ループが減りました。"
              author="K.T.さん"
              attribute="28歳・エンジニア・男性"
            />
            <TestimonialCard
              quote="占いかと思って軽い気持ちで受けたら、心理学ベースのしっかりした内容でびっくり。自分の「断れないパターン」が可視化されて、対策が立てやすくなりました。"
              author="Y.N.さん"
              attribute="41歳・自営業・女性"
            />
          </div>
        </Container>
      </section>

      <SectionDivider />

      {/* ===== セクション6: FAQ ===== */}
      <section className="py-16 md:py-20">
        <Container size="md">
          <SectionTitle>よくある質問</SectionTitle>

          <div className="bg-white rounded-xl border border-stone-200 p-6 md:p-8">
            <FAQItem
              question="本当に無料ですか？"
              answer="はい、完全無料です。10秒診断も3分の詳細診断も、費用は一切かかりません。通常5,000円相当の内容を、現在は無料で提供しています。"
            />
            <FAQItem
              question="占いとは何が違うのですか？"
              answer="本診断は心理学・神経科学の知見をベースに開発されています。感覚的な占いではなく、あなたの回答パターンから心の構造を分析し、具体的な消耗原因と対処法をお伝えします。"
            />
            <FAQItem
              question="診断結果は保存されますか？"
              answer="診断結果はメールでお送りするため、いつでも見返すことができます。"
            />
            <FAQItem
              question="診断にどれくらい時間がかかりますか？"
              answer="まず10秒の簡易診断（5問）であなたの消耗タイプを特定します。さらに詳しく知りたい方は、3分の詳細診断（20問）で具体的な対処法まで確認できます。"
            />
          </div>
        </Container>
      </section>

      <SectionDivider />

      {/* ===== セクション7: ファイナルCTA ===== */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="text-center space-y-8">
            <h2 className="text-xl md:text-2xl font-medium text-stone-800 leading-relaxed">
              「なぜ自分だけ、こんなに疲れるのか」
              <br />
              その答えが、10秒でわかります。
            </h2>

            <p className="text-stone-600 max-w-md mx-auto">
              原因がわからないまま我慢し続けると、
              <br />
              ある日突然、心が動かなくなることがあります。
              <br />
              <span className="text-stone-800 font-medium">まずは自分の消耗パターンを知ることから。</span>
            </p>

            <div className="pt-4 space-y-3">
              <Link href="/quick">
                <Button
                  variant="primary"
                  size="lg"
                  className="text-lg px-12 py-5 bg-stone-800 hover:bg-stone-700 text-white border-0"
                >
                  無料で消耗パターンを診断する
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-3 text-sm">
                <span className="text-stone-400 line-through">通常 5,000円相当</span>
                <span className="bg-red-50 text-red-600 font-medium px-3 py-1 rounded-full text-xs border border-red-200">今だけ無料</span>
              </div>
            </div>

            {/* 免責事項 */}
            <div className="pt-8 text-stone-400 text-xs max-w-md mx-auto space-y-1">
              <p>※ 本診断は医療行為ではありません。</p>
              <p>※ 診断結果は参考情報としてご活用ください。</p>
              <p>※ 深刻な症状がある場合は、専門家にご相談ください。</p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
