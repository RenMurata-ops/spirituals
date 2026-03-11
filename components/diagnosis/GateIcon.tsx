'use client';

import { GateType, GATE_CONFIG } from '../../types/diagnosis';

interface GateIconProps {
  type: GateType;
  size?: number;
  className?: string;
}

// くすみカラーへの変換
function getMutedColor(color: string): string {
  const mutedColors: Record<string, string> = {
    '#c026d3': '#9a7b9c', // heart: くすみパープル
    '#3b82f6': '#7a8fa8', // wisdom: くすみブルー
    '#2dd4bf': '#7fa8a0', // energy: くすみティール
    '#d4af37': '#b8a67a', // time: くすみゴールド
  };
  return mutedColors[color] || color;
}

// Heart Gate: Vesica Piscis (two overlapping circles)
function HeartIcon({ size, color }: { size: number; color: string }) {
  const r = size * 0.35;
  const offset = size * 0.18;
  const mutedColor = getMutedColor(color);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2 - offset}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={mutedColor}
        strokeWidth="1.5"
        opacity="0.8"
      />
      <circle
        cx={size / 2 + offset}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={mutedColor}
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* Vesica Piscis center fill */}
      <path
        d={`M ${size / 2} ${size / 2 - r * 0.85}
            A ${r} ${r} 0 0 1 ${size / 2} ${size / 2 + r * 0.85}
            A ${r} ${r} 0 0 1 ${size / 2} ${size / 2 - r * 0.85}`}
        fill={mutedColor}
        fillOpacity="0.15"
      />
    </svg>
  );
}

// Wisdom Gate: Hexagonal network (honeycomb)
function WisdomIcon({ size, color }: { size: number; color: string }) {
  const hexSize = size * 0.18;
  const cx = size / 2;
  const cy = size / 2;
  const mutedColor = getMutedColor(color);

  const hexPoints = (x: number, y: number, s: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      points.push(`${x + s * Math.cos(angle)},${y + s * Math.sin(angle)}`);
    }
    return points.join(' ');
  };

  const hexOffsets = [
    { x: 0, y: 0 },
    { x: hexSize * 1.5, y: -hexSize * 0.87 },
    { x: hexSize * 1.5, y: hexSize * 0.87 },
    { x: -hexSize * 1.5, y: -hexSize * 0.87 },
    { x: -hexSize * 1.5, y: hexSize * 0.87 },
    { x: 0, y: -hexSize * 1.73 },
    { x: 0, y: hexSize * 1.73 },
  ];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {hexOffsets.map((offset, i) => (
        <polygon
          key={i}
          points={hexPoints(cx + offset.x, cy + offset.y, hexSize * 0.9)}
          fill="none"
          stroke={mutedColor}
          strokeWidth="1.5"
          opacity={0.7 - i * 0.05}
        />
      ))}
    </svg>
  );
}

// Energy Gate: Concentric ripples
function EnergyIcon({ size, color }: { size: number; color: string }) {
  const cx = size / 2;
  const cy = size / 2;
  const radii = [size * 0.12, size * 0.22, size * 0.32, size * 0.42];
  const mutedColor = getMutedColor(color);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {radii.map((r, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={mutedColor}
          strokeWidth="1.5"
          opacity={0.8 - i * 0.15}
        />
      ))}
      <circle cx={cx} cy={cy} r={size * 0.04} fill={mutedColor} opacity="0.6" />
    </svg>
  );
}

// Time Gate: Fibonacci spiral
function TimeIcon({ size, color }: { size: number; color: string }) {
  const cx = size / 2;
  const cy = size / 2;
  const mutedColor = getMutedColor(color);

  // Golden spiral approximation using arcs
  const scale = size * 0.008;
  const spiralPath = `
    M ${cx} ${cy}
    A ${1 * scale} ${1 * scale} 0 0 1 ${cx + 1 * scale} ${cy - 1 * scale}
    A ${2 * scale} ${2 * scale} 0 0 1 ${cx + 3 * scale} ${cy + 1 * scale}
    A ${3 * scale} ${3 * scale} 0 0 1 ${cx} ${cy + 4 * scale}
    A ${5 * scale} ${5 * scale} 0 0 1 ${cx - 5 * scale} ${cy - 1 * scale}
    A ${8 * scale} ${8 * scale} 0 0 1 ${cx + 3 * scale} ${cy - 9 * scale}
    A ${13 * scale} ${13 * scale} 0 0 1 ${cx + 16 * scale} ${cy + 4 * scale}
    A ${21 * scale} ${21 * scale} 0 0 1 ${cx - 5 * scale} ${cy + 25 * scale}
  `;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path
        d={spiralPath}
        fill="none"
        stroke={mutedColor}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx={cx} cy={cy} r={size * 0.03} fill={mutedColor} opacity="0.6" />
    </svg>
  );
}

export function GateIcon({ type, size = 48, className = '' }: GateIconProps) {
  const config = GATE_CONFIG[type];

  const IconComponent = {
    heart: HeartIcon,
    wisdom: WisdomIcon,
    energy: EnergyIcon,
    time: TimeIcon,
  }[type];

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <IconComponent size={size} color={config.color} />
    </div>
  );
}

export default GateIcon;
