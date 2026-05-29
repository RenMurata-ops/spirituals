import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約 | Spirituals',
  description: '利用規約',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-amber-50/50 py-16 md:py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-12 tracking-wide">利用規約</h1>

        <div className="space-y-10 text-amber-800 leading-relaxed">
          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              第1条（適用）
            </h2>
            <p>
              本規約は、株式会社liberate（以下「当社」）が提供するサービス（以下「本サービス」）の利用に関する条件を定めるものです。
              ユーザーは、本規約に同意の上、本サービスを利用するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              第2条（サービス概要）
            </h2>
            <p>
              本サービスは、AIを活用したスピリチュアル診断サービスです。
              診断結果はエンターテインメント目的であり、医学的・科学的根拠に基づくものではありません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              第3条（禁止事項）
            </h2>
            <p className="mb-3">ユーザーは、以下の行為を行ってはなりません。</p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-amber-700">
              <li>法令または公序良俗に反する行為</li>
              <li>当社または第三者の知的財産権を侵害する行為</li>
              <li>サービスの運営を妨害する行為</li>
              <li>不正アクセスまたはこれを試みる行為</li>
              <li>他のユーザーになりすます行為</li>
              <li>当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              第4条（サービスの変更・中断・終了）
            </h2>
            <p>
              当社は、事前の通知なく本サービスの内容を変更し、または提供を中断・終了することができます。
              これによりユーザーに生じた損害について、当社は責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              第5条（免責事項）
            </h2>
            <ul className="list-disc list-inside space-y-3 ml-4 text-amber-700">
              <li>
                当社は、本サービスの診断結果の正確性、完全性、有用性を保証しません。
              </li>
              <li>
                診断結果に基づくユーザーの判断・行動について、当社は一切の責任を負いません。
              </li>
              <li>
                本サービスの利用により生じた損害について、当社の故意または重過失による場合を除き、責任を負いません。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              第6条（著作権）
            </h2>
            <p>
              本サービスに関するコンテンツの著作権は、当社または正当な権利者に帰属します。
              無断での複製、転載、改変等は禁止します。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              第7条（規約の変更）
            </h2>
            <p>
              当社は、必要に応じて本規約を変更することができます。
              変更後の規約は、当サイトに掲載した時点で効力を生じます。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              第8条（準拠法・管轄裁判所）
            </h2>
            <p>
              本規約は日本法に準拠し、本サービスに関する紛争については、福岡地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <section className="pt-6 border-t border-amber-200">
            <p className="text-sm text-amber-600">制定日: 2026年1月28日</p>
          </section>
        </div>
      </div>
    </main>
  );
}
