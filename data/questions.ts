// 診断質問データ
import type { Question, GateType } from '../types/diagnosis';

// === 10秒診断（5問）===
export const quickQuestions: Question[] = [
  {
    id: 'q1',
    text: '人と会った後、理由もなくぐったりすることがある',
    type: 'yesno',
    gateType: 'heart',
  },
  {
    id: 'q2',
    text: '情報を集めれば集めるほど、かえって迷うことがある',
    type: 'yesno',
    gateType: 'wisdom',
  },
  {
    id: 'q3',
    text: '場所や人によって、自分のテンションが大きく変わる',
    type: 'yesno',
    gateType: 'energy',
  },
  {
    id: 'q4',
    text: '過去の出来事を、ふとした瞬間に何度も思い出す',
    type: 'yesno',
    gateType: 'time',
  },
  {
    id: 'q5',
    text: '他人の機嫌が気になって、自分の意見を言えないことがある',
    type: 'yesno',
    gateType: 'heart',
  },
];

// === 無料診断（20問）===
// NOTE: 仕様書セクション8.4が見つからなかったため、
// 各門5問ずつの構成で暫定的に作成。正式な質問文は仕様書確認後に差し替え要。
export const fullQuestions: Question[] = [
  // 心門（heart）- 5問
  {
    id: 'q1',
    text: '他人の感情に強く影響されやすい',
    type: 'likert',
    gateType: 'heart',
  },
  {
    id: 'q2',
    text: '人の悩みを聞くと、自分のことのように感じる',
    type: 'likert',
    gateType: 'heart',
  },
  {
    id: 'q3',
    text: '初対面の人の本質を直感的に見抜くことがある',
    type: 'likert',
    gateType: 'heart',
  },
  {
    id: 'q4',
    text: '人混みにいると疲れやすい',
    type: 'likert',
    gateType: 'heart',
  },
  {
    id: 'q5',
    text: '相手の気持ちを優先して、自分を後回しにしがち',
    type: 'likert',
    gateType: 'heart',
  },

  // 智門（wisdom）- 5問
  {
    id: 'q6',
    text: '物事の本質や真理を追求したくなる',
    type: 'likert',
    gateType: 'wisdom',
  },
  {
    id: 'q7',
    text: '直感やひらめきで答えが浮かぶことがある',
    type: 'likert',
    gateType: 'wisdom',
  },
  {
    id: 'q8',
    text: '情報を集めすぎて決断が遅くなることがある',
    type: 'likert',
    gateType: 'wisdom',
  },
  {
    id: 'q9',
    text: '夢で見たことが現実になった経験がある',
    type: 'likert',
    gateType: 'wisdom',
  },
  {
    id: 'q10',
    text: '深く考えすぎて眠れないことがある',
    type: 'likert',
    gateType: 'wisdom',
  },

  // 気門（energy）- 5問
  {
    id: 'q11',
    text: '特定の場所で気分が変わることがある',
    type: 'likert',
    gateType: 'energy',
  },
  {
    id: 'q12',
    text: '体調の変化を敏感に感じ取れる',
    type: 'likert',
    gateType: 'energy',
  },
  {
    id: 'q13',
    text: '自然の中にいると心身が回復する感覚がある',
    type: 'likert',
    gateType: 'energy',
  },
  {
    id: 'q14',
    text: '電化製品が自分の近くで誤作動することがある',
    type: 'likert',
    gateType: 'energy',
  },
  {
    id: 'q15',
    text: 'エネルギーの流れや波動を感じることがある',
    type: 'likert',
    gateType: 'energy',
  },

  // 時門（time）- 5問
  {
    id: 'q16',
    text: '過去の出来事が鮮明によみがえることがある',
    type: 'likert',
    gateType: 'time',
  },
  {
    id: 'q17',
    text: 'デジャヴ（既視感）を頻繁に経験する',
    type: 'likert',
    gateType: 'time',
  },
  {
    id: 'q18',
    text: '未来のことを漠然と感じ取れることがある',
    type: 'likert',
    gateType: 'time',
  },
  {
    id: 'q19',
    text: '古い場所や物に強く惹かれる',
    type: 'likert',
    gateType: 'time',
  },
  {
    id: 'q20',
    text: '時間の感覚が他の人と違うと感じることがある',
    type: 'likert',
    gateType: 'time',
  },
];

// 質問IDから門タイプを取得
export const getGateTypeByQuestionId = (questionId: string): GateType | null => {
  const question = [...quickQuestions, ...fullQuestions].find(q => q.id === questionId);
  return question?.gateType ?? null;
};
