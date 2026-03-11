import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { GateType, GateScore, RankName, GATE_CONFIG } from '@/types/diagnosis';
import { gates } from '@/data/gates';
import { ResultPreviewClient } from './ResultPreviewClient';

interface PageProps {
  params: Promise<{ serial: string }>;
}

// DBから取得した診断データの型
interface DiagnosisData {
  serial: string;
  last_name: string | null;
  first_name: string | null;
  scores: {
    heart: number;
    wisdom: number;
    energy: number;
    time: number;
    total: number;
  } | null;
  rank: RankName | null;
  soul_type: string | null;
  strongest_gate: GateType | null;
  weakest_gate: GateType | null;
  preview_viewed_at: string | null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serial } = await params;
  return {
    title: `診断結果 | Spirituals`,
    description: '4つの門があなたの精神の秘密を解き明かす。診断結果をご確認ください。',
    openGraph: {
      title: '私の精神分析結果 | Spirituals',
      description: '4つの門（心・知・氣・時）のバランスを診断しました。',
    },
  };
}

async function getDiagnosis(serial: string): Promise<DiagnosisData | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('diagnoses')
    .select('serial, last_name, first_name, scores, rank, soul_type, strongest_gate, weakest_gate, preview_viewed_at')
    .eq('serial', serial)
    .single();

  if (error || !data) {
    return null;
  }

  // 初回閲覧時刻を記録
  if (!data.preview_viewed_at) {
    await supabase
      .from('diagnoses')
      .update({ preview_viewed_at: new Date().toISOString() })
      .eq('serial', serial);
  }

  return data as DiagnosisData;
}

export default async function ResultPreviewPage({ params }: PageProps) {
  const { serial } = await params;
  const diagnosis = await getDiagnosis(serial);

  if (!diagnosis || !diagnosis.scores || !diagnosis.rank) {
    redirect('/error/not-found');
  }

  // GateScore配列を作成
  const gateScores: GateScore[] = (['heart', 'wisdom', 'energy', 'time'] as GateType[]).map((type) => ({
    type,
    score: diagnosis.scores![type],
    label: GATE_CONFIG[type].label,
  }));

  // ユーザー名
  const userName = diagnosis.last_name && diagnosis.first_name
    ? `${diagnosis.last_name} ${diagnosis.first_name}`
    : '診断者';

  // 弱点の門と強みの門の説明
  const weakestGateData = diagnosis.weakest_gate ? gates[diagnosis.weakest_gate] : null;
  const strongestGateData = diagnosis.strongest_gate ? gates[diagnosis.strongest_gate] : null;

  // シェアテキスト
  const shareText = `私の精神分析の結果は「${diagnosis.soul_type}」でした！総合スコア: ${diagnosis.scores.total}点 #Spirituals`;

  return (
    <ResultPreviewClient
      userName={userName}
      totalScore={diagnosis.scores.total}
      rank={diagnosis.rank}
      soulType={diagnosis.soul_type || ''}
      gateScores={gateScores}
      strongestGate={diagnosis.strongest_gate}
      weakestGate={diagnosis.weakest_gate}
      strongestGateData={strongestGateData}
      weakestGateData={weakestGateData}
      shareText={shareText}
      serial={serial}
    />
  );
}
