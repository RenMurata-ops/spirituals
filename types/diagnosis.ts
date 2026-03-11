// 診断・結果関連の型定義

// === 基本型 ===
export type GateType = 'heart' | 'wisdom' | 'energy' | 'time';
export type AgeGroup = '18-24' | '25-34' | '35-44' | '45-54' | '55+';
export type Gender = 'male' | 'female' | 'other';
export type SoulType = '共鳴の魂' | '探究の魂' | '感応の魂' | '遍歴の魂';

export interface GateScore {
  type: GateType;
  score: number; // 0-100
  label: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'yesno' | 'likert';
  gateType: GateType;
}

export type RankName = '覚醒者' | '守護者' | '修行者' | '探求者' | '目覚めの時';

export interface DiagnosisResult {
  totalScore: number;
  rank: RankName;
  gates: GateScore[];
  strongestGate: GateType;
  weakestGate: GateType;
}

export const GATE_CONFIG: Record<GateType, { label: string; color: string; colorClass: string }> = {
  heart: { label: '心門', color: '#c026d3', colorClass: 'text-fuchsia-600' },
  wisdom: { label: '智門', color: '#3b82f6', colorClass: 'text-blue-500' },
  energy: { label: '気門', color: '#2dd4bf', colorClass: 'text-teal-400' },
  time: { label: '時門', color: '#d4af37', colorClass: 'text-amber-500' },
};

export const RANK_CONFIG: Record<RankName, { minScore: number; color: string; colorClass: string }> = {
  '覚醒者': { minScore: 90, color: '#ffd700', colorClass: 'bg-gradient-to-r from-amber-400 to-yellow-300' },
  '守護者': { minScore: 70, color: '#c0c0c0', colorClass: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
  '修行者': { minScore: 50, color: '#cd7f32', colorClass: 'bg-gradient-to-r from-blue-500 to-cyan-400' },
  '探求者': { minScore: 30, color: '#2dd4bf', colorClass: 'bg-gradient-to-r from-teal-500 to-emerald-400' },
  '目覚めの時': { minScore: 0, color: '#94a3b8', colorClass: 'bg-gradient-to-r from-slate-400 to-gray-400' },
};

// タスク指定の型名エイリアス
export type Rank = RankName;

// === 10秒診断用 ===
export interface QuickAnswers {
  q1: boolean;
  q2: boolean;
  q3: boolean;
  q4: boolean;
  q5: boolean;
}

// === 無料診断用 ===
export interface FullAnswers {
  [key: string]: number; // q1-q20: 1-5
}

// === スコア ===
export interface Scores {
  heart: number;
  wisdom: number;
  energy: number;
  time: number;
  total: number;
}

// === 10秒診断結果 ===
export interface QuickResult {
  gate_name: string;
  gate_description: string;
  user_trait: string;
  risk_timeframe: string;
  risks: string[];
  cta_message: string;
}

// === 無料診断結果プレビュー ===
export interface FullResultPreview {
  soul_type: SoulType;
  dominant_gate: GateType;
  scores: Scores;
  summary: string;
}

// === 無料診断結果詳細 ===
export interface FullResultDetail {
  rank: Rank;
  soul_description: string;
  gate_analysis: {
    [K in GateType]: {
      score: number;
      status: string;
      advice: string;
    };
  };
  overall_advice: string;
  next_steps: string[];
}

// === 無料診断結果 ===
export interface FullResult {
  preview: FullResultPreview;
  detail: FullResultDetail;
}

// === 診断全体 ===
export interface Diagnosis {
  id: string;
  type: 'quick' | 'full';
  created_at: string;
  user_attributes: {
    age_group: AgeGroup;
    gender: Gender;
    occupation?: string;
  };
  answers: QuickAnswers | FullAnswers;
  scores?: Scores;
  result: QuickResult | FullResult;
}

// === ストア用型定義 ===
export interface QuickDiagnosisState {
  step: number;
  answers: Record<string, boolean>;
  attributes: {
    ageGroup: AgeGroup | null;
    gender: Gender | null;
    occupation: string;
  };
  setAnswer: (questionId: string, value: boolean) => void;
  setAttribute: <K extends keyof QuickDiagnosisState['attributes']>(
    key: K,
    value: QuickDiagnosisState['attributes'][K]
  ) => void;
  nextStep: () => void;
  reset: () => void;
}

export interface FullDiagnosisState {
  currentScreen: number; // 1-5
  answers: Record<string, number>;
  setAnswer: (questionId: string, value: number) => void;
  nextScreen: () => void;
  prevScreen: () => void;
  reset: () => void;
}
