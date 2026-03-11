"use client";

import Link from "next/link";

const CURRENT_YEAR = new Date().getFullYear();

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="text-stone-500 hover:text-stone-700 transition-colors text-sm"
    >
      {children}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-stone-100/50 border-t border-stone-200/50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <nav className="flex flex-wrap justify-center gap-6 mb-6">
          <FooterLink href="/legal/tokushoho">特定商取引法</FooterLink>
          <FooterLink href="/legal/privacy">プライバシーポリシー</FooterLink>
          <FooterLink href="/legal/terms">利用規約</FooterLink>
        </nav>
        <div className="text-center text-stone-400 text-xs">
          <p>&copy; {CURRENT_YEAR} Spirituals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
