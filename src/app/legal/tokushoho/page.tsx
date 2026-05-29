import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | Spirituals',
  description: '特定商取引法に基づく表記',
};

export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-amber-50/50 py-16 md:py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-12 tracking-wide">
          特定商取引法に基づく表記
        </h1>

        <div className="space-y-8 text-amber-800 leading-relaxed">
          <section>
            <h2 className="font-medium text-amber-900 mb-3 text-sm tracking-wider uppercase">販売事業者</h2>
            <p>株式会社liberate</p>
          </section>

          <section>
            <h2 className="font-medium text-amber-900 mb-3 text-sm tracking-wider uppercase">運営責任者</h2>
            <p>長沼 竜平</p>
          </section>

          <section>
            <h2 className="font-medium text-amber-900 mb-3 text-sm tracking-wider uppercase">所在地</h2>
            <p>〒811-1102</p>
            <p>福岡県福岡市早良区東入部1丁目37番9号</p>
          </section>

          <section>
            <h2 className="font-medium text-amber-900 mb-3 text-sm tracking-wider uppercase">お問い合わせ</h2>
            <p>メール: liberate0619@gmail.com</p>
            <p>電話: 092-836-7523</p>
          </section>

          <section>
            <h2 className="font-medium text-amber-900 mb-3 text-sm tracking-wider uppercase">営業時間</h2>
            <p>9:00〜17:00（日曜・祝日を除く）</p>
          </section>

          <section>
            <h2 className="font-medium text-amber-900 mb-3 text-sm tracking-wider uppercase">販売価格</h2>
            <p>各サービスページに記載</p>
          </section>

          <section>
            <h2 className="font-medium text-amber-900 mb-3 text-sm tracking-wider uppercase">支払方法</h2>
            <p>クレジットカード決済</p>
          </section>

          <section>
            <h2 className="font-medium text-amber-900 mb-3 text-sm tracking-wider uppercase">支払時期</h2>
            <p>サービス申込時</p>
          </section>

          <section>
            <h2 className="font-medium text-amber-900 mb-3 text-sm tracking-wider uppercase">サービス提供時期</h2>
            <p>決済完了後、即時または指定期日</p>
          </section>

          <section>
            <h2 className="font-medium text-amber-900 mb-3 text-sm tracking-wider uppercase">返品・キャンセルについて</h2>
            <p className="mb-2">デジタルコンテンツの性質上、サービス提供後の返品・返金はお受けできません。</p>
            <p>ただし、サービス提供前のキャンセルについてはお問い合わせください。</p>
          </section>
        </div>
      </div>
    </main>
  );
}
