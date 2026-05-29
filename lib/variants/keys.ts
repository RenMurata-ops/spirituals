// CLI事前生成バリアントのキー設計。
// ランタイムでAnthropic APIを呼ばず、ここで決まるキーで data.json をルックアップする。

export type GateType =
  | 'crown'
  | 'third_eye'
  | 'throat'
  | 'heart'
  | 'solar_plexus'
  | 'sacral'
  | 'root';

export type AgeGroup = '10s' | '20s' | '30s' | '40s' | '50s' | '60s_plus';

export type Gender = 'male' | 'female' | 'other';

// 年齢層 → トーンバケット（プロンプトの getToneByAgeGroup と同じ区分）
export type ToneBucket = 'hopeful' | 'practical' | 'urgent';

export function toneFromAge(ageGroup: AgeGroup): ToneBucket {
  switch (ageGroup) {
    case '10s':
    case '20s':
      return 'hopeful';
    case '30s':
    case '40s':
      return 'practical';
    case '50s':
    case '60s_plus':
      return 'urgent';
    default:
      return 'practical';
  }
}

export const TONE_INSTRUCTION: Record<ToneBucket, string> = {
  hopeful: '希望に満ちた前向きなトーン。未来の可能性を強調し、ワクワク感を与える。',
  practical: '実践的で解決志向のトーン。具体的なアクションと改善方法を提示する。',
  urgent: '危機感を持たせつつも解決策を示すトーン。今行動しないと手遅れになる可能性を伝える。',
};

// スコア（100点満点）→ ステータスバケット
export type StatusBucket = 'danger' | 'caution' | 'good';

export function statusFromScore(score: number): StatusBucket {
  if (score < 40) return 'danger';
  if (score < 70) return 'caution';
  return 'good';
}

export const STATUS_LABEL: Record<StatusBucket, string> = {
  danger: '危険',
  caution: '注意',
  good: '良好',
};

export const GATE_NAMES: Record<GateType, string> = {
  crown: '頂門（クラウン）',
  third_eye: '眉間（サードアイ）',
  throat: '喉（スロート）',
  heart: '心臓（ハート）',
  solar_plexus: '太陽神経叢（ソーラープレクサス）',
  sacral: '仙骨（セイクラル）',
  root: '根（ルート）',
};

// 全ゲート（gateAnalysis用）と、診断で実際に弱点/強みになりうる4ゲート
export const ALL_GATES: GateType[] = [
  'crown',
  'third_eye',
  'throat',
  'heart',
  'solar_plexus',
  'sacral',
  'root',
];

export const DIAGNOSIS_GATES: GateType[] = [
  'heart',
  'third_eye',
  'solar_plexus',
  'root',
];

export const TONES: ToneBucket[] = ['hopeful', 'practical', 'urgent'];
export const STATUSES: StatusBucket[] = ['danger', 'caution', 'good'];

export const quickKey = (gate: GateType, tone: ToneBucket) => `${gate}__${tone}`;
export const fullKey = (weakestGate: GateType, tone: ToneBucket) =>
  `${weakestGate}__${tone}`;
export const gateKey = (gate: GateType, status: StatusBucket) =>
  `${gate}__${status}`;
