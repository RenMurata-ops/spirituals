import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50/50">
      <div className="text-center px-6 py-12">
        <p className="text-5xl mb-8 text-amber-300">○</p>
        <h1 className="text-2xl font-bold text-amber-900 mb-4 tracking-wide">
          診断結果が見つかりません
        </h1>
        <p className="text-amber-700 mb-10 max-w-md mx-auto leading-relaxed">
          お探しの診断結果は存在しないか、
          <br />
          削除された可能性があります。
        </p>
        <Link
          href="/"
          className="inline-block bg-amber-800 hover:bg-amber-900 text-white font-medium py-3 px-10 rounded-full transition-colors"
        >
          無料で診断する
        </Link>
      </div>
    </div>
  );
}
