import Anthropic from '@anthropic-ai/sdk';

// Types
export type GateType = 'crown' | 'third_eye' | 'throat' | 'heart' | 'solar_plexus' | 'sacral' | 'root';
export type AgeGroup = '10s' | '20s' | '30s' | '40s' | '50s' | '60s_plus';
export type Gender = 'male' | 'female' | 'other';
export type SoulType = 'healer' | 'warrior' | 'sage' | 'creator' | 'guardian' | 'visionary' | 'connector';
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

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const GATE_NAMES: Record<GateType, string> = {
  crown: '頂門（クラウン）',
  third_eye: '眉間（サードアイ）',
  throat: '喉（スロート）',
  heart: '心臓（ハート）',
  solar_plexus: '太陽神経叢（ソーラープレクサス）',
  sacral: '仙骨（セイクラル）',
  root: '根（ルート）',
};

const SOUL_TYPE_NAMES: Record<SoulType, string> = {
  healer: 'ヒーラー',
  warrior: 'ウォリアー',
  sage: 'セージ',
  creator: 'クリエイター',
  guardian: 'ガーディアン',
  visionary: 'ヴィジョナリー',
  connector: 'コネクター',
};

const RANK_DESCRIPTIONS: Record<Rank, string> = {
  S: '最高ランク - 全てのゲートが調和',
  A: '優秀 - ほぼ全てのゲートが良好',
  B: '良好 - 改善の余地あり',
  C: '注意 - 複数のゲートに問題',
  D: '危険 - 早急な対処が必要',
};

function getToneByAgeGroup(ageGroup: AgeGroup): string {
  switch (ageGroup) {
    case '10s':
    case '20s':
      return '希望に満ちた前向きなトーン。未来の可能性を強調し、ワクワク感を与える。';
    case '30s':
    case '40s':
      return '実践的で解決志向のトーン。具体的なアクションと改善方法を提示する。';
    case '50s':
    case '60s_plus':
      return '危機感を持たせつつも解決策を示すトーン。今行動しないと手遅れになる可能性を伝える。';
    default:
      return '丁寧で共感的なトーン。';
  }
}

export async function generateFullResult(
  scores: Scores,
  weakestGate: GateType,
  strongestGate: GateType,
  soulType: SoulType,
  rank: Rank,
  ageGroup: AgeGroup,
  gender: Gender,
  occupation: string
): Promise<FullResult> {
  const tone = getToneByAgeGroup(ageGroup);
  const weakestGateName = GATE_NAMES[weakestGate];
  const strongestGateName = GATE_NAMES[strongestGate];
  const soulTypeName = SOUL_TYPE_NAMES[soulType];
  const rankDescription = RANK_DESCRIPTIONS[rank];

  const scoresDescription = Object.entries(scores)
    .map(([gate, score]) => `${GATE_NAMES[gate as GateType]}: ${score}点`)
    .join('\n');

  const prompt = `あなたはスピリチュアル診断の専門家です。以下の情報に基づいて、詳細な診断結果を生成してください。

## 診断対象者
- 年齢層: ${ageGroup}
- 性別: ${gender}
- 職業: ${occupation}

## 診断結果
- 総合ランク: ${rank} (${rankDescription})
- 魂タイプ: ${soulTypeName}
- 最も弱いゲート: ${weakestGateName}
- 最も強いゲート: ${strongestGateName}

## 各ゲートのスコア（100点満点）
${scoresDescription}

## トーン指示
${tone}

## 出力形式
以下のJSON形式で出力してください。JSON以外の文字は出力しないでください。

{
  "preview": {
    "headline": "50文字以内のインパクトのある見出し（魂タイプとランクを含む）",
    "soulTypeDescription": "100文字程度の魂タイプの説明",
    "rankDescription": "80文字程度のランクの意味説明",
    "weakestGateWarning": "100文字程度の最も弱いゲートについての警告",
    "strongestGateStrength": "80文字程度の最も強いゲートについての説明",
    "teaser": "詳細を見たくなるような50文字程度のティーザーテキスト"
  },
  "detail": {
    "overallAnalysis": "200文字程度の総合分析",
    "gateAnalysis": [
      各ゲートについて以下の形式で7つ:
      {
        "gate": "ゲートID",
        "gateName": "ゲート名",
        "score": スコア,
        "status": "良好/注意/危険のいずれか",
        "description": "100文字程度のゲートの状態説明",
        "improvement": "80文字程度の改善アドバイス"
      }
    ],
    "soulTypeDeepDive": "200文字程度の魂タイプの詳細説明",
    "lifePathGuidance": "200文字程度の人生の指針",
    "dailyPractices": ["毎日の実践項目を5つ、各30文字程度"],
    "warningMessage": "100文字程度の警告メッセージ（放置した場合のリスク）",
    "finalMessage": "100文字程度の締めのメッセージ"
  }
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from AI');
  }

  const result = JSON.parse(content.text) as FullResult;
  return result;
}
