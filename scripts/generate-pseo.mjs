// 悩み別pSEOページのコピーをCLI駆動・API不使用で生成し data/pseo/content.json に集約。
// 冪等: 既存を読み、欠けているslugだけ生成。使い方: node scripts/generate-pseo.mjs [--force]
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'data', 'pseo', 'content.json');
const FORCE = process.argv.includes('--force');

const GATE_LABEL = { heart: '心門', wisdom: '智門', energy: '氣門', time: '時門' };
const GATE_THEME = {
  heart: '感情の出入口。共感しすぎて自分の本音を後回しにする傾向',
  wisdom: '思考と判断の門。考えすぎ・直感の封印・決断疲れ',
  energy: '活力と自己肯定の門。輪郭が溶けて頑張れなくなる',
  time: '基盤と人生の方向の門。土台の消耗・漠然とした不安',
};

// concerns.ts と対応（slug/label/gate）
const CONCERNS = [
  ['relationships-tired', '人間関係に疲れた', 'heart'],
  ['love-struggle', '恋愛がうまくいかない', 'heart'],
  ['emotions-numb', '自分の気持ちがわからない', 'heart'],
  ['overthinking', '考えすぎて疲れる', 'wisdom'],
  ['indecisive', '決断できない', 'wisdom'],
  ['intuition-lost', '直感が信じられない', 'wisdom'],
  ['no-motivation', 'やる気が出ない', 'energy'],
  ['no-confidence', '自信が持てない', 'energy'],
  ['burnout', '燃え尽きてしまった', 'energy'],
  ['chronic-fatigue', '疲れが取れない', 'time'],
  ['future-anxiety', '将来が漠然と不安', 'time'],
  ['meaning-lost', '生きる意味を見失った', 'time'],
];

const BRAND = `サービス「Spirituals」は精神構造診断。世界観コピーは「波動を上げる時代は終わった。波動を守る時代が来た。」。4つの門（心門・智門・氣門・時門）で精神の構造を捉える。神秘性と神経科学の信頼感を融合した落ち着いた語り口。占い的断定でなく内省を促す。`;

function callClaude(prompt) {
  const out = execFileSync('claude', ['-p', prompt, '--output-format', 'text'], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10,
    timeout: 180000,
  });
  let t = out.trim();
  const m = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) t = m[1].trim();
  const s = t.indexOf('{');
  const e = t.lastIndexOf('}');
  if (s >= 0 && e > s) t = t.slice(s, e + 1);
  return JSON.parse(t);
}
function withRetry(prompt, label) {
  for (let i = 1; i <= 3; i++) {
    try {
      return callClaude(prompt);
    } catch (err) {
      console.error(`  [retry ${i}/3] ${label}: ${String(err.message).split('\n')[0]}`);
    }
  }
  throw new Error(`failed: ${label}`);
}

const data = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};
let n = 0;
for (const [slug, label, gate] of CONCERNS) {
  if (!FORCE && data[slug]) continue;
  const prompt = `${BRAND}
「${label}」という悩みで検索して来た人向けの、診断LPの導入コンテンツを書く。
この悩みが最も関係する門: ${GATE_LABEL[gate]}（${GATE_THEME[gate]}）。

無料診断（10秒/20問）への誘導が目的。煽りすぎず、でも「自分のことだ」と感じさせる。
JSONのみ出力（他の文字禁止）:
{
  "leadParagraph": "150文字程度。検索者の状態に寄り添い、表面的な対処では解決しない理由を示す導入",
  "symptoms": ["『こんな状態はありませんか』の具体例を5つ・各25文字程度"],
  "mechanism": "200文字程度。なぜそれが起きるのかを${GATE_LABEL[gate]}の観点で構造的に説明。本人が無意識にやっているパターンを言い当てる",
  "gateBridge": "150文字程度。${GATE_LABEL[gate]}と世界観コピー（波動を守る）に繋げ、精神構造を可視化する価値を示す",
  "ctaLead": "80文字程度。無料診断で何がわかるかを示し背中を押す",
  "faq": [ { "q": "この悩みに関するよくある質問", "a": "100文字程度の回答" } ]
}
faqは3つ。`;
  console.log(`PSEO ${slug} (${label}) ...`);
  const res = withRetry(prompt, slug);
  data[slug] = {
    leadParagraph: res.leadParagraph,
    symptoms: res.symptoms,
    mechanism: res.mechanism,
    gateBridge: res.gateBridge,
    ctaLead: res.ctaLead,
    faq: res.faq,
  };
  n++;
  writeFileSync(OUT, JSON.stringify(data, null, 2));
}
console.log(`\nDone. generated ${n} concern pages. total=${Object.keys(data).length}`);
