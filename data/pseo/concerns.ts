// 悩み別pSEOの起点データ。各悩みを4つの門の世界観に紐づける。
// slug はURL、keywords は検索ロングテール、gate は世界観上の主担当の門。

export type ConcernGate = 'heart' | 'wisdom' | 'energy' | 'time';

export interface Concern {
  slug: string;
  label: string; // 悩みの言い回し（H1・タイトルに使う）
  gate: ConcernGate;
  keywords: string[]; // メタ・検索意図
}

export const GATE_LABEL: Record<ConcernGate, string> = {
  heart: '心門',
  wisdom: '智門',
  energy: '氣門',
  time: '時門',
};

export const CONCERNS: Concern[] = [
  // 心門（heart）— 感情・人間関係
  {
    slug: 'relationships-tired',
    label: '人間関係に疲れた',
    gate: 'heart',
    keywords: ['人間関係 疲れた', '人といると疲れる', '人間関係 リセットしたい'],
  },
  {
    slug: 'love-struggle',
    label: '恋愛がうまくいかない',
    gate: 'heart',
    keywords: ['恋愛 うまくいかない', '同じ失敗 繰り返す 恋愛', '本音 言えない 恋愛'],
  },
  {
    slug: 'emotions-numb',
    label: '自分の気持ちがわからない',
    gate: 'heart',
    keywords: ['自分の気持ちがわからない', '感情が動かない', '何がしたいかわからない'],
  },
  // 智門（wisdom）— 思考・判断
  {
    slug: 'overthinking',
    label: '考えすぎて疲れる',
    gate: 'wisdom',
    keywords: ['考えすぎ 疲れる', '頭が休まらない', '思考が止まらない'],
  },
  {
    slug: 'indecisive',
    label: '決断できない',
    gate: 'wisdom',
    keywords: ['決断できない', '優柔不断 直したい', '選べない 性格'],
  },
  {
    slug: 'intuition-lost',
    label: '直感が信じられない',
    gate: 'wisdom',
    keywords: ['直感 鈍った', '自分の判断 自信ない', '正解 探してしまう'],
  },
  // 氣門（energy）— 活力・自己肯定
  {
    slug: 'no-motivation',
    label: 'やる気が出ない',
    gate: 'energy',
    keywords: ['やる気が出ない', '無気力 原因', '何もしたくない'],
  },
  {
    slug: 'no-confidence',
    label: '自信が持てない',
    gate: 'energy',
    keywords: ['自信がない', '自己肯定感 低い', '人と比べてしまう'],
  },
  {
    slug: 'burnout',
    label: '燃え尽きてしまった',
    gate: 'energy',
    keywords: ['燃え尽き症候群', 'バーンアウト 回復', '頑張れなくなった'],
  },
  // 時門（time）— 基盤・人生の方向
  {
    slug: 'chronic-fatigue',
    label: '疲れが取れない',
    gate: 'time',
    keywords: ['疲れが取れない', '休んでも回復しない', '慢性疲労 原因'],
  },
  {
    slug: 'future-anxiety',
    label: '将来が漠然と不安',
    gate: 'time',
    keywords: ['将来 不安', '漠然とした不安', 'この先どうなる 不安'],
  },
  {
    slug: 'meaning-lost',
    label: '生きる意味を見失った',
    gate: 'time',
    keywords: ['生きる意味 わからない', '何のために 生きる', '虚無感'],
  },
];

export const concernBySlug = (slug: string): Concern | undefined =>
  CONCERNS.find((c) => c.slug === slug);
