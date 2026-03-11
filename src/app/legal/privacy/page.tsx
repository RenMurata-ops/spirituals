import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー | Spirituals',
  description: 'プライバシーポリシー',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-amber-50/50 py-16 md:py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900 mb-12 tracking-wide">
          プライバシーポリシー
        </h1>

        <div className="space-y-10 text-amber-800 leading-relaxed">
          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              1. 個人情報の収集について
            </h2>
            <p className="mb-3">
              当社は、サービス提供にあたり、以下の個人情報を収集することがあります。
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-amber-700">
              <li>メールアドレス</li>
              <li>診断結果に関する情報</li>
              <li>お問い合わせ内容</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              2. 個人情報の利用目的
            </h2>
            <p className="mb-3">収集した個人情報は、以下の目的で利用します。</p>
            <ul className="list-disc list-inside space-y-2 ml-4 text-amber-700">
              <li>診断結果のメール送信</li>
              <li>サービスに関するお知らせの配信</li>
              <li>お問い合わせへの対応</li>
              <li>サービス改善のための分析</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              3. 個人情報の第三者提供
            </h2>
            <p>
              当社は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              4. 個人情報の安全管理
            </h2>
            <p>
              当社は、個人情報の漏洩、滅失、毀損を防止するため、適切なセキュリティ対策を講じます。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              5. Cookieの使用について
            </h2>
            <p>
              当サイトでは、サービス向上のためCookieを使用することがあります。
              ブラウザの設定によりCookieを無効にすることも可能ですが、一部機能が制限される場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              6. プライバシーポリシーの変更
            </h2>
            <p>
              本ポリシーは予告なく変更されることがあります。
              変更後のポリシーは、当サイトに掲載した時点で効力を生じます。
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-amber-900 mb-4">
              7. お問い合わせ先
            </h2>
            <p>個人情報に関するお問い合わせは、以下までご連絡ください。</p>
            <div className="mt-4 text-amber-700">
              <p>株式会社liberate</p>
              <p>メール: liberate0619@gmail.com</p>
              <p>電話: 092-836-7523</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
