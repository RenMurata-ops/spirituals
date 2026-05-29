'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense, useState, useEffect } from 'react';
import { GateIcon } from '../../../../components/diagnosis/GateIcon';
import { Button } from '../../../../components/ui/Button';
import { Loading } from '../../../../components/ui/Loading';
import type { GateType } from '../../../../types/diagnosis';
import { GATE_CONFIG } from '../../../../types/diagnosis';

// 門名からGateTypeを取得
function getGateTypeFromName(gateName: string): GateType {
  const gateMap: Record<string, GateType> = {
    '心門': 'heart',
    '智門': 'wisdom',
    '気門': 'energy',
    '時門': 'time',
  };
  return gateMap[gateName] || 'heart';
}

// 門別の具体的・日常的なメッセージ
const GATE_MESSAGES: Record<GateType, {
  status: string;
  insight: string;
  pattern: string;
  risk: string;
  hidden: string;
}> = {
  heart: {
    status: 'あなたの心は今、だいぶ無理をしている状態です',
    insight: 'あなたは相手の表情やしぐさの微妙な変化を、無意識に読み取ってしまうタイプです。会話中、相手が一瞬だけ見せた不機嫌な顔——周りは気づかなくても、あなたの脳はそれをキャッチして「自分のせいかも」と処理し続けています。',
    pattern: 'さらに、あなたには「相手が求める自分」を無意識に演じてしまうクセがあります。本当は断りたいのに笑顔で引き受ける、興味がない話にも「わかる！」と返してしまう。この"自動変換"が、あなたの心を静かにすり減らしています。',
    risk: 'このまま放っておくと、ある日突然「もう誰にも会いたくない」となる可能性があります',
    hidden: '10秒診断でわかるのはここまでです。詳細診断では、この消耗パターンの根本原因と、明日からできる具体的な対処法を3つ特定します',
  },
  wisdom: {
    status: 'あなたの頭は今、だいぶ無理をしている状態です',
    insight: 'あなたは「最悪のケース」を先に想像してしまうタイプです。何か決断する時、うまくいくパターンより失敗するパターンを無意識に数え上げてしまう。これは能力が高い人ほど陥りやすい思考の罠です。',
    pattern: 'また、あなたには「完璧に理解してからでないと動けない」という隠れたルールがあります。調べものを始めると止まらない、準備が終わらないと不安になる。実は、この"念入りさ"が決断を遅らせている最大の原因です。',
    risk: 'このまま放っておくと、「考えているだけで何もできない自分」に自己嫌悪を感じるようになる可能性があります',
    hidden: '10秒診断でわかるのはここまでです。詳細診断では、思考ループを止める具体的な方法と、あなたの決断スピードを上げる3つの対処法を特定します',
  },
  energy: {
    status: 'あなたは今、充電しても回復しない状態になりかけています',
    insight: 'あなたは周囲の「空気」に自分の状態を左右されやすいタイプです。職場のピリピリした雰囲気、電車内のイライラした人——その場にいるだけで、あなたの体は無意識に緊張し、エネルギーを消費しています。',
    pattern: 'さらに、あなたには「休んでいるのに休めていない」パターンがあります。休日にゴロゴロしていても頭の中では仕事のことを考えている、動画を見ていても次に何をすべきか気になっている。"体は休んでいても脳が休めていない"状態です。',
    risk: 'このまま放っておくと、週末休んでも月曜にはもう限界、という慢性疲労のループにはまる可能性があります',
    hidden: '10秒診断でわかるのはここまでです。詳細診断では、あなたのエネルギー漏れの正確な場所と、本当に回復できる休み方を3つ特定します',
  },
  time: {
    status: 'あなたは今、無意識に「過去の自分」に縛られています',
    insight: 'あなたは「あの時ああしていれば」と考える時、実は過去の出来事そのものではなく、"その時感じた悔しさや恥ずかしさ"を何度も追体験しています。記憶を思い出すたびに、脳はその感情をリアルタイムで再生してしまうのです。',
    pattern: 'また、あなたには「次こそ失敗しないように」という無意識の警戒モードが常にONになっています。新しいことに挑戦しようとすると、過去の失敗が自動的にフラッシュバックして足がすくむ。これは"記憶の誤作動"です。',
    risk: 'このまま放っておくと、新しいことに挑戦する気力がどんどん失われていきます',
    hidden: '10秒診断でわかるのはここまでです。詳細診断では、あなたを縛る記憶パターンの正体と、過去の呪縛を解く具体的な方法を3つ特定します',
  },
};

function QuickResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showHidden, setShowHidden] = useState(false);

  // URLパラメータから結果を取得
  const gateName = searchParams.get('gate') || '心門';
  const description = searchParams.get('desc') || '';

  const gateType = getGateTypeFromName(gateName);
  const gateConfig = GATE_CONFIG[gateType];
  const messages = GATE_MESSAGES[gateType];

  // 3秒後に隠しメッセージを表示
  useEffect(() => {
    const timer = setTimeout(() => setShowHidden(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // 3分診断へ遷移
  const handleStartFullDiagnosis = () => {
    router.push('/diagnosis');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-lg mx-auto px-6 py-12">
        {/* 警告ヘッダー */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-700 text-sm font-medium">要注意の結果が出ました</span>
          </div>
        </motion.div>

        {/* 門の表示 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="relative">
            <GateIcon type={gateType} size={80} />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
          <p className="text-stone-500 text-sm mt-4">{gateConfig.label}</p>
        </motion.div>

        {/* 状態説明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-xl font-bold text-stone-800 leading-relaxed">
            {messages.status}
          </h1>
        </motion.div>

        {/* 深層心理の指摘 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4 mb-8"
        >
          {/* 本人が気づいていない特性 */}
          <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-stone-800 mb-3">あなたの隠れた特性</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {messages.insight}
            </p>
          </div>

          {/* 無意識の行動パターン */}
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
            <h3 className="text-sm font-bold text-amber-800 mb-3">無意識の行動パターン</h3>
            <p className="text-amber-700 text-sm leading-relaxed">
              {messages.pattern}
            </p>
          </div>

          {/* リスク警告 */}
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <p className="text-red-700 text-sm leading-relaxed font-medium">
              {messages.risk}
            </p>
          </div>
        </motion.div>

        {/* AI診断の補足（あれば） */}
        {description && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-stone-100 border border-stone-200 rounded-xl p-4 mb-6"
          >
            <p className="text-stone-600 text-sm leading-relaxed">
              {description}
            </p>
          </motion.div>
        )}

        {/* 隠されたメッセージ */}
        {showHidden && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="bg-stone-800 text-white p-5 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-stone-200 text-sm leading-relaxed">
                  {messages.hidden}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* メインCTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-4"
        >
          <div className="bg-gradient-to-b from-stone-800 to-stone-900 rounded-xl p-6 shadow-lg">
            <p className="text-stone-300 text-sm mb-4 text-center">
              10秒診断では消耗タイプの特定まで。
              <br />
              詳細診断（3分）では、以下がわかります：
            </p>

            {/* 具体的にわかることリスト */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-sm mt-0.5">1.</span>
                <p className="text-white text-sm">あなたの<span className="text-amber-400 font-medium">4領域すべてのスコア</span>とバランス</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-sm mt-0.5">2.</span>
                <p className="text-white text-sm">エネルギーが漏れている<span className="text-amber-400 font-medium">正確な場所</span>と原因</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-amber-400 text-sm mt-0.5">3.</span>
                <p className="text-white text-sm">明日からできる<span className="text-amber-400 font-medium">具体的な対処法</span>3つ</p>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold border-0 shadow-none"
              onClick={handleStartFullDiagnosis}
            >
              無料で詳しく診断する（3分）
            </Button>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="text-stone-500 text-xs line-through">通常 5,000円相当</span>
              <span className="text-amber-400 text-xs font-medium">今だけ無料</span>
            </div>
          </div>

          {/* 社会的証明 */}
          <div className="text-center py-2">
            <p className="text-stone-500 text-xs leading-relaxed">
              3,000人以上が受けて「原因がわかった」と回答
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full text-center text-stone-400 text-xs hover:text-stone-500 transition-colors py-2"
          >
            診断せずに戻る
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function QuickResultPage() {
  return (
    <Suspense fallback={<Loading size="lg" message="結果を分析中..." className="min-h-screen bg-stone-50" />}>
      <QuickResultContent />
    </Suspense>
  );
}
