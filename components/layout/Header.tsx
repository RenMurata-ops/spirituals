"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200/50">
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="group">
          <h1 className="text-xl font-semibold text-stone-800 tracking-wide group-hover:text-stone-600 transition-colors">
            Spirituals
          </h1>
        </Link>
        <nav className="hidden sm:flex items-center gap-8">
          <Link
            href="/quick"
            className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            10秒診断
          </Link>
          <Link
            href="/diagnosis"
            className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
          >
            3分診断
          </Link>
        </nav>
      </div>
    </header>
  );
}
