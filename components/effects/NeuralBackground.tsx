"use client";

import { useEffect, useRef } from "react";

/**
 * 背景エフェクトコンポーネント
 *
 * 葬送のフリーレン風の控えめで繊細なデザイン
 * - 淡いグラデーション背景
 * - 微細なドットパターン（静的）
 * - 穏やかな光の揺らぎ
 */
export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      // 静的なドットパターンを描画
      drawDotPattern(ctx, rect.width, rect.height);
    };

    const drawDotPattern = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);

      // 微細なドットパターン
      const dotSpacing = 40;
      const dotSize = 1;
      const dotColor = "rgba(139, 115, 85, 0.08)"; // 淡いセピア調

      for (let x = 0; x < width; x += dotSpacing) {
        for (let y = 0; y < height; y += dotSpacing) {
          // 少しランダムなオフセットで自然な印象に
          const offsetX = (Math.sin(x * 0.01 + y * 0.01) * 5);
          const offsetY = (Math.cos(x * 0.01 + y * 0.01) * 5);

          ctx.beginPath();
          ctx.fillStyle = dotColor;
          ctx.arc(x + offsetX, y + offsetY, dotSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* 淡いグラデーション背景 */}
      <div
        className="fixed inset-0 -z-20 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(139, 115, 85, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(100, 130, 150, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(180, 160, 140, 0.02) 0%, transparent 70%)
          `,
        }}
      />
      {/* 微細なドットパターン */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none -z-10"
        style={{ width: "100%", height: "100%" }}
      />
    </>
  );
}
