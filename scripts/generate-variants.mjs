// CLI駆動・API不使用のバリアント生成。
// claude -p（Claude Code CLI headless）で診断コピーを生成し lib/variants/data.json に集約する。
// 冪等: 既存 data.json を読み、欠けているキーだけ生成して書き戻す。
// 使い方: node scripts/generate-variants.mjs [--force]
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'lib', 'variants', 'data.json');
const FORCE = process.argv.includes('--force');

const GATE_NAMES = {
  crown: '頂門（クラウン）',
  third_eye: '眉間（サードアイ）',
  throat: '喉（スロート）',
  heart: '心臓（ハート）',
  solar_plexus: '太陽神経叢（ソーラープレクサス）',
  sacral: '仙骨（セイクラル）',
  root: '根（ルート）',
};
const ALL_GATES = ['crown', 'third_eye', 'throat', 'heart', 'solar_plexus', 'sacral', 'root'];
const DIAGNOSIS_GATES = ['heart', 'third_eye', 'solar_plexus', 'root'];
const TONES = ['hopeful', 'practical', 'urgent'];
const STATUSES = ['danger', 'caution', 'good'];
const TONE_INSTRUCTION = {
  hopeful: '希望に満ちた前向きなトーン。未来の可能性を強調し、ワクワク感を与える。',
  practical: '実践的で解決志向のトーン。具体的なアクションと改善方法を提示する。',
  urgent: '危機感を持たせつつも解決策を示すトーン。今行動しないと手遅れになる可能性を伝える。',
};
const STATUS_LABEL = { danger: '危険（40点未満）', caution: '注意（40〜69点）', good: '良好（70点以上）' };

const BRAND = `サービス「Spirituals」は精神構造診断。世界観のコピーは「波動を上げる時代は終わった。波動を守る時代が来た。」。神秘性と神経科学の信頼感を融合した落ち着いた語り口。`;
const RULES = `## 最重要ルール
- ユーザーが自覚していない深層心理・無意識の行動パターン・隠れた思考のクセを言い当てる
- 「あ、それ自分だ」と思わせる具体的・日常的な描写
- 専門用語を避け、誰でもわかる言葉で
- 占い的な断定でなく、内省を促す表現`;

function callClaude(prompt) {
  const out = execFileSync('claude', ['-p', prompt, '--output-format', 'text'], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024 * 10,
    timeout: 180000,
  });
  let t = out.trim();
  const m = t.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (m) t = m[1].trim();
  // 先頭/末尾の余分を除去して最初の { から最後の } までを取る
  const s = t.indexOf('{');
  const e = t.lastIndexOf('}');
  if (s >= 0 && e > s) t = t.slice(s, e + 1);
  return JSON.parse(t);
}

function callWithRetry(prompt, label) {
  for (let i = 1; i <= 3; i++) {
    try {
      return callClaude(prompt);
    } catch (err) {
      console.error(`  [retry ${i}/3] ${label}: ${err.message.split('\n')[0]}`);
    }
  }
  throw new Error(`failed after 3 tries: ${label}`);
}

const data = existsSync(DATA_PATH)
  ? JSON.parse(readFileSync(DATA_PATH, 'utf8'))
  : {};
data.quick ??= {};
data.full ??= {};
data.strength ??= {};
data.gate ??= {};

let generated = 0;
const need = (obj, key) => FORCE || !obj[key];

// 1. QUICK: gateごとに3トーンまとめて生成
for (const gate of DIAGNOSIS_GATES) {
  const keys = TONES.map((t) => `${gate}__${t}`);
  if (!keys.some((k) => need(data.quick, k))) continue;
  const prompt = `${BRAND}
あなたは心理分析の専門家。10秒診断（簡易診断）の結果コピーを作る。
最も弱っているゲート: ${GATE_NAMES[gate]}
${RULES}

3つのトーンそれぞれで結果を作り、JSONのみを出力（他の文字禁止）:
{
${TONES.map(
  (t) => `  "${t}": { "headline": "30文字以内・本人が気づいていない特性を指摘する見出し", "description": "120文字程度・無意識の行動パターンを具体描写", "advice": "80文字程度・対処法", "ctaText": "無料診断へ誘導する20文字以内" }  // ${TONE_INSTRUCTION[t]}`
).join('\n')}
}`;
  console.log(`QUICK ${gate} ...`);
  const res = callWithRetry(prompt, `quick ${gate}`);
  for (const t of TONES) {
    if (res[t]) {
      data.quick[`${gate}__${t}`] = {
        headline: res[t].headline,
        description: res[t].description,
        advice: res[t].advice,
        ctaText: res[t].ctaText,
      };
      generated++;
    }
  }
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// 2. FULL narrative: 弱点ゲートごとに3トーンまとめて生成
for (const gate of DIAGNOSIS_GATES) {
  const keys = TONES.map((t) => `${gate}__${t}`);
  if (!keys.some((k) => need(data.full, k))) continue;
  const prompt = `${BRAND}
あなたはスピリチュアル診断の専門家。20問の無料診断の「詳細結果」の物語部分を作る。
最も弱いゲート: ${GATE_NAMES[gate]}
${RULES}

3つのトーンそれぞれで作り、JSONのみ出力（他の文字禁止）:
{
${TONES.map(
  (t) => `  "${t}": {
    "headline": "50文字以内のインパクトある見出し",
    "soulTypeDescription": "100文字程度・魂タイプの説明",
    "weakestGateWarning": "100文字程度・最も弱いゲートへの警告",
    "teaser": "続きを見たくなる50文字程度",
    "overallAnalysis": "200文字程度の総合分析",
    "soulTypeDeepDive": "200文字程度・魂タイプの詳細",
    "lifePathGuidance": "200文字程度・人生の指針",
    "dailyPractices": ["毎日の実践を5つ・各30文字程度"],
    "warningMessage": "100文字程度・放置した場合のリスク",
    "finalMessage": "100文字程度・締め（世界観コピーを織り込む）"
  }  // ${TONE_INSTRUCTION[t]}`
).join('\n')}
}`;
  console.log(`FULL ${gate} ...`);
  const res = callWithRetry(prompt, `full ${gate}`);
  for (const t of TONES) {
    if (res[t]) {
      data.full[`${gate}__${t}`] = res[t];
      generated++;
    }
  }
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// 3. STRENGTH: 最強ゲートの説明（全ゲート一括）
if (FORCE || ALL_GATES.some((g) => !data.strength[g])) {
  const prompt = `${BRAND}
各ゲートが「最も強いゲート」だった場合の、その人の強みの説明を作る。
${RULES}
各ゲートにつき80文字程度。JSONのみ出力:
{
${ALL_GATES.map((g) => `  "${g}": "${GATE_NAMES[g]}が強みである人への説明"`).join(',\n')}
}`;
  console.log('STRENGTH (all gates) ...');
  const res = callWithRetry(prompt, 'strength');
  for (const g of ALL_GATES) {
    if (res[g]) {
      data.strength[g] = res[g];
      generated++;
    }
  }
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// 4. GATE ANALYSIS: ゲートごとに3ステータスまとめて生成
for (const gate of ALL_GATES) {
  const keys = STATUSES.map((s) => `${gate}__${s}`);
  if (!keys.some((k) => need(data.gate, k))) continue;
  const prompt = `${BRAND}
診断の各ゲート分析欄のコピーを作る。対象ゲート: ${GATE_NAMES[gate]}
${RULES}
スコア帯ごとに説明と改善アドバイスを作り、JSONのみ出力:
{
${STATUSES.map(
  (s) => `  "${s}": { "description": "100文字程度・${STATUS_LABEL[s]}のときのこのゲートの状態説明", "improvement": "80文字程度・改善アドバイス" }`
).join(',\n')}
}`;
  console.log(`GATE ${gate} ...`);
  const res = callWithRetry(prompt, `gate ${gate}`);
  for (const s of STATUSES) {
    if (res[s]) {
      data.gate[`${gate}__${s}`] = { description: res[s].description, improvement: res[s].improvement };
      generated++;
    }
  }
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

console.log(`\nDone. generated/updated ${generated} variant entries.`);
console.log(
  `counts: quick=${Object.keys(data.quick).length} full=${Object.keys(data.full).length} strength=${Object.keys(data.strength).length} gate=${Object.keys(data.gate).length}`
);
