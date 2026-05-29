export type GateType = 'heart' | 'wisdom' | 'energy' | 'time';

export type SoulType =
  | 'healer' // 心の門が弱い
  | 'mystic' // 叡智の門が弱い
  | 'warrior' // 活力の門が弱い
  | 'sage'; // 時の門が弱い

export type Rank =
  | 'awakened' // 覚醒者 (90+)
  | 'guardian' // 守護者 (70-89)
  | 'practitioner' // 修行者 (50-69)
  | 'seeker' // 探求者 (30-49)
  | 'awakening'; // 目覚めの時 (0-29)

export interface Scores {
  heart: number;
  wisdom: number;
  energy: number;
  time: number;
}

export interface FullAnswers {
  [key: string]: number; // 各質問の回答 (1-5)
}

/**
 * 回答からスコアを計算
 * 各門に対応する質問の回答を集計
 */
export function calculateScores(answers: FullAnswers): Scores {
  const scores: Scores = { heart: 0, wisdom: 0, energy: 0, time: 0 };

  // 質問番号と門の対応（q1-q5: heart, q6-q10: wisdom, q11-q15: energy, q16-q20: time）
  const gateMapping: Record<string, GateType> = {};
  for (let i = 1; i <= 5; i++) gateMapping[`q${i}`] = 'heart';
  for (let i = 6; i <= 10; i++) gateMapping[`q${i}`] = 'wisdom';
  for (let i = 11; i <= 15; i++) gateMapping[`q${i}`] = 'energy';
  for (let i = 16; i <= 20; i++) gateMapping[`q${i}`] = 'time';

  for (const [key, value] of Object.entries(answers)) {
    const gate = gateMapping[key];
    if (gate) {
      scores[gate] += value;
    }
  }

  return scores;
}

/**
 * 最も弱い門を判定
 */
export function determineWeakestGate(scores: Scores): GateType {
  const entries = Object.entries(scores) as [GateType, number][];
  return entries.sort((a, b) => a[1] - b[1])[0][0];
}

/**
 * 最も強い門を判定
 */
export function determineStrongestGate(scores: Scores): GateType {
  const entries = Object.entries(scores) as [GateType, number][];
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

/**
 * 最弱の門からソウルタイプを判定
 */
export function determineSoulType(weakestGate: GateType): SoulType {
  const soulTypeMap: Record<GateType, SoulType> = {
    heart: 'healer',
    wisdom: 'mystic',
    energy: 'warrior',
    time: 'sage',
  };
  return soulTypeMap[weakestGate];
}

/**
 * 合計スコアからランクを判定
 * スコア計算式: 100 - (合計 - 5) × 4
 * ランク判定: 90+覚醒者, 70+守護者, 50+修行者, 30+探求者, それ以下目覚めの時
 */
export function determineRank(totalScore: number): Rank {
  // スコア計算: 100 - (合計 - 5) × 4
  // 最小合計 = 20 (各門5点×4) → 100 - (20-5)*4 = 100-60 = 40
  // 最大合計 = 100 (各門25点×4) → 100 - (100-5)*4 = 100-380 = -280
  // 注: 仕様に従い、渡されたtotalScoreを変換してランク判定
  const score = 100 - (totalScore - 5) * 4;

  if (score >= 90) return 'awakened';
  if (score >= 70) return 'guardian';
  if (score >= 50) return 'practitioner';
  if (score >= 30) return 'seeker';
  return 'awakening';
}

/**
 * スコアの合計を計算
 */
export function calculateTotalScore(scores: Scores): number {
  return scores.heart + scores.wisdom + scores.energy + scores.time;
}
