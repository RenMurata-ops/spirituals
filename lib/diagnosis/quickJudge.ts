export type GateType = 'heart' | 'wisdom' | 'energy' | 'time';

export interface QuickAnswers {
  q1: boolean;
  q2: boolean;
  q3: boolean;
  q4: boolean;
  q5: boolean;
}

interface GateScores {
  heart: number;
  wisdom: number;
  energy: number;
  time: number;
}

/**
 * 10秒診断の門判定ロジック
 * 回答に基づいて最も強い門を判定する
 */
export function judgeQuickGate(answers: QuickAnswers): GateType {
  const scores: GateScores = { heart: 0, wisdom: 0, energy: 0, time: 0 };

  if (answers.q1) scores.heart += 1;
  if (answers.q2) scores.wisdom += 1;
  if (answers.q3) scores.energy += 1;
  if (answers.q4) scores.time += 1;
  if (answers.q5) {
    scores.heart += 0.5;
    scores.energy += 0.5;
  }

  // 最高スコアの門を返す
  const entries = Object.entries(scores) as [GateType, number][];
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}
