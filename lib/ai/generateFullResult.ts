// CLI駆動・API不使用。事前生成した data.json をルックアップし、
// rank説明・各ゲートの実スコア・最強ゲートをランタイムで合成する。
// 型と関数シグネチャは従来と同一なので、呼び出し側（APIルート）は変更不要。
import variants from '@/lib/variants/data.json';
import {
  GateType,
  AgeGroup,
  Gender as KeyGender,
  toneFromAge,
  fullKey,
  gateKey,
  statusFromScore,
  STATUS_LABEL,
  ALL_GATES,
  GATE_NAMES,
} from '@/lib/variants/keys';

export type { GateType, AgeGroup };
export type Gender = KeyGender;
export type SoulType =
  | 'healer'
  | 'warrior'
  | 'sage'
  | 'creator'
  | 'guardian'
  | 'visionary'
  | 'connector';
export type Rank = 'S' | 'A' | 'B' | 'C' | 'D';

export interface Scores {
  crown: number;
  third_eye: number;
  throat: number;
  heart: number;
  solar_plexus: number;
  sacral: number;
  root: number;
}

export interface FullResultPreview {
  headline: string;
  soulTypeDescription: string;
  rankDescription: string;
  weakestGateWarning: string;
  strongestGateStrength: string;
  teaser: string;
}

export interface FullResultDetail {
  overallAnalysis: string;
  gateAnalysis: {
    gate: GateType;
    gateName: string;
    score: number;
    status: string;
    description: string;
    improvement: string;
  }[];
  soulTypeDeepDive: string;
  lifePathGuidance: string;
  dailyPractices: string[];
  warningMessage: string;
  finalMessage: string;
}

export interface FullResult {
  preview: FullResultPreview;
  detail: FullResultDetail;
}

const RANK_DESCRIPTIONS: Record<Rank, string> = {
  S: '最高ランク。全てのゲートが調和し、あなたの精神は安定した循環の中にあります。',
  A: '優秀。ほぼ全てのゲートが良好で、わずかな調整でさらに整います。',
  B: '良好。土台はできていますが、いくつかのゲートに改善の余地があります。',
  C: '注意。複数のゲートに滞りが見られ、今の状態が習慣化しつつあります。',
  D: '危険。早急な対処が必要な状態です。放置すると消耗が加速します。',
};

interface FullNarrative {
  headline: string;
  soulTypeDescription: string;
  weakestGateWarning: string;
  teaser: string;
  overallAnalysis: string;
  soulTypeDeepDive: string;
  lifePathGuidance: string;
  dailyPractices: string[];
  warningMessage: string;
  finalMessage: string;
}

interface GateSnippet {
  description: string;
  improvement: string;
}

const fullVariants = variants.full as Record<string, FullNarrative>;
const strengthVariants = variants.strength as Record<string, string>;
const gateVariants = variants.gate as Record<string, GateSnippet>;

function narrativeFallback(weakestGateName: string): FullNarrative {
  return {
    headline: `${weakestGateName}を起点に、あなたの精神構造が動き始めています`,
    soulTypeDescription:
      'あなたは他者の感情を敏感に受け取り、それを自分の責任として抱えやすい魂の持ち主です。',
    weakestGateWarning: `${weakestGateName}が弱っているとき、あなたは自分の限界に気づく前に動き続けてしまいます。`,
    teaser: 'この続きに、あなたが繰り返してきたパターンの核心があります。',
    overallAnalysis:
      'あなたの精神は、強い部分で弱い部分を補い続けることで均衡を保ってきました。その代償が静かに蓄積しています。',
    soulTypeDeepDive:
      'あなたの魂は本来、与えることで満たされるタイプです。ただし与える前に、自分の器を満たす順序を取り戻す必要があります。',
    lifePathGuidance:
      'これからのあなたは「守る」を軸に選択するとき、最も力を発揮します。広げるより、深める方向へ。',
    dailyPractices: [
      '朝、呼吸を3回だけ意識して整える',
      '一日一度、自分の本音を一言メモする',
      '夜、今日守れた小さな境界を振り返る',
      '週に一度、誰のためでもない時間を確保する',
      '「やらないこと」を一つ決めて手放す',
    ],
    warningMessage:
      'この状態を放置すると、あなたは「できるのに動けない」感覚に支配されていきます。',
    finalMessage:
      '波動を上げる時代は終わりました。いまは、あなたの中心を守る時代です。',
  };
}

export async function generateFullResult(
  scores: Scores,
  weakestGate: GateType,
  strongestGate: GateType,
  soulType: SoulType,
  rank: Rank,
  ageGroup: AgeGroup,
  _gender: Gender,
  _occupation: string
): Promise<FullResult> {
  const tone = toneFromAge(ageGroup);
  const weakestGateName = GATE_NAMES[weakestGate];
  const strongestGateName = GATE_NAMES[strongestGate];

  const narr =
    fullVariants[fullKey(weakestGate, tone)] ?? narrativeFallback(weakestGateName);

  const strongestGateStrength =
    strengthVariants[strongestGate] ??
    `${strongestGateName}はあなたの支柱です。迷ったとき、この力が必ず立て直してくれます。`;

  const gateAnalysis = ALL_GATES.map((gate) => {
    const score = scores[gate];
    const bucket = statusFromScore(score);
    const snippet = gateVariants[gateKey(gate, bucket)] ?? {
      description: `${GATE_NAMES[gate]}は現在${STATUS_LABEL[bucket]}の状態です。`,
      improvement: 'まずは今の状態を観察し、無理に変えようとしないことから始めましょう。',
    };
    return {
      gate,
      gateName: GATE_NAMES[gate],
      score,
      status: STATUS_LABEL[bucket],
      description: snippet.description,
      improvement: snippet.improvement,
    };
  });

  return {
    preview: {
      headline: narr.headline,
      soulTypeDescription: narr.soulTypeDescription,
      rankDescription: RANK_DESCRIPTIONS[rank],
      weakestGateWarning: narr.weakestGateWarning,
      strongestGateStrength,
      teaser: narr.teaser,
    },
    detail: {
      overallAnalysis: narr.overallAnalysis,
      gateAnalysis,
      soulTypeDeepDive: narr.soulTypeDeepDive,
      lifePathGuidance: narr.lifePathGuidance,
      dailyPractices: narr.dailyPractices,
      warningMessage: narr.warningMessage,
      finalMessage: narr.finalMessage,
    },
  };
}
