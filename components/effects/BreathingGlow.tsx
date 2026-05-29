"use client";

interface BreathingGlowProps {
  children: React.ReactNode;
  color?: "violet" | "blue" | "mixed";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * グロー効果コンポーネント（控えめバージョン）
 *
 * 葬送のフリーレン風の繊細なデザイン
 * - グロー効果を大幅に抑制
 * - アニメーションなし（静的な淡い光）
 * - 呼び出し元との互換性を維持
 */

// 控えめな色（透明度を大幅に下げた）
const colorClasses = {
  violet: "bg-violet-400/5",
  blue: "bg-blue-400/5",
  mixed: "bg-gradient-to-r from-violet-400/5 to-blue-400/5",
};

// サイズは維持（互換性のため）
const sizeClasses = {
  sm: "w-32 h-32",
  md: "w-48 h-48",
  lg: "w-64 h-64",
};

export function BreathingGlow({
  children,
  color = "mixed",
  size = "md",
  className = "",
}: BreathingGlowProps) {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* グロー効果を控えめに: blur-xlからblur-mdに、透明度も下げた */}
      <div
        className={`absolute rounded-full blur-md ${colorClasses[color]} ${sizeClasses[size]}`}
        style={{
          // アニメーションなしの静的な淡い光
          opacity: 0.6,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
