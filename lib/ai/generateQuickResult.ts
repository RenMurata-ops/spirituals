import Anthropic from '@anthropic-ai/sdk';

// Types
export type GateType = 'crown' | 'third_eye' | 'throat' | 'heart' | 'solar_plexus' | 'sacral' | 'root';
export type AgeGroup = '10s' | '20s' | '30s' | '40s' | '50s' | '60s_plus';
export type Gender = 'male' | 'female' | 'other';

export interface QuickResult {
  gate: GateType;
  gateName: string;
  headline: string;
  description: string;
  advice: string;
  ctaText: string;
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

export async function generateQuickResult(
  gate: GateType,
  ageGroup: AgeGroup,
  gender: Gender,
  occupation: string
): Promise<QuickResult> {
  const gateName = GATE_NAMES[gate];
  const tone = getToneByAgeGroup(ageGroup);

  const prompt = `あなたは心理分析の専門家です。以下の情報に基づいて、10秒診断の結果を生成してください。

## 診断対象者
- 年齢層: ${ageGroup}
- 性別: ${gender}
- 職業: ${occupation}

## 診断結果
- 最も弱っているゲート（チャクラ）: ${gateName}

## トーン指示
${tone}

## 最重要ルール
- ユーザーが質問で答えた内容（「人と会うと疲れる」「考えすぎる」等）をそのまま繰り返すのは絶対に禁止
- ユーザー自身が気づいていない「深層心理」「無意識の行動パターン」「隠れた思考のクセ」を言い当てること
- 例：質問が「人と会うと疲れる」→ 結果は「あなたは相手の表情の微妙な変化を無意識に読み取り、自分のせいだと処理してしまうタイプです」のように、本人が自覚していない切り口で指摘する
- 「あ、それ自分だ」と思わせるような具体的・日常的な描写を使うこと
- 専門用語は使わず、誰でもわかる言葉で書くこと

## 出力形式
以下のJSON形式で出力してください。JSON以外の文字は出力しないでください。

{
  "gate": "${gate}",
  "gateName": "${gateName}",
  "headline": "30文字以内。本人が気づいていない特性を端的に指摘する見出し",
  "description": "120文字程度。ユーザーが無意識にやっている行動パターンを具体的に描写する。質問の内容を繰り返さず、本人が「なぜそうなるのか」を初めて理解できるような深い指摘をする",
  "advice": "80文字程度。その深層パターンに対する具体的な対処法",
  "ctaText": "無料診断に誘導する20文字以内のCTAテキスト"
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
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

  // AIがマークダウンコードブロックで返す場合があるため、JSONを抽出
  let jsonText = content.text.trim();

  // ```json ... ``` または ``` ... ``` を除去
  const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonText = jsonMatch[1].trim();
  }

  const result = JSON.parse(jsonText) as QuickResult;
  return result;
}
