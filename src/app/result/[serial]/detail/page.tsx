import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { GateType, RankName, GATE_CONFIG } from '@/types/diagnosis';
import { gates } from '@/data/gates';
import { ResultDetailClient } from './ResultDetailClient';

interface PageProps {
  params: Promise<{ serial: string }>;
  searchParams: Promise<{ token?: string }>;
}

// DBから取得した診断データの型
interface DiagnosisDetailData {
  serial: string;
  token: string;
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
  full_result: {
    weakest_analysis?: {
      reason: string;
      steps: string[];
      daily_practice: string;
    };
    strongest_analysis?: {
      analysis: string;
      use_cases: string[];
      advice: string;
    };
    next_steps?: string[];
  } | null;
  detail_viewed_at: string | null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { serial } = await params;
  return {
    title: `詳細レポート | Spirituals`,
    description: '4つの門のバランス詳細分析結果をご確認ください。',
  };
}

async function getDiagnosis(serial: string, token: string): Promise<DiagnosisDetailData | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('diagnoses')
    .select('serial, token, last_name, first_name, scores, rank, soul_type, strongest_gate, weakest_gate, full_result, detail_viewed_at')
    .eq('serial', serial)
    .single();

  if (error || !data) {
    return null;
  }

  // トークン検証
  if (data.token !== token) {
    return null;
  }

  // 初回閲覧時刻を記録
  if (!data.detail_viewed_at) {
    await supabase
      .from('diagnoses')
      .update({ detail_viewed_at: new Date().toISOString() })
      .eq('serial', serial);
  }

  return data as DiagnosisDetailData;
}

export default async function ResultDetailPage({ params, searchParams }: PageProps) {
  const { serial } = await params;
  const { token } = await searchParams;

  // トークンがない場合
  if (!token) {
    redirect('/error/unauthorized');
  }

  const diagnosis = await getDiagnosis(serial, token);

  // 診断データが見つからない or トークン不一致
  if (!diagnosis || !diagnosis.scores || !diagnosis.rank) {
    redirect('/error/unauthorized');
  }

  // ユーザー名
  const userName = diagnosis.last_name && diagnosis.first_name
    ? `${diagnosis.last_name} ${diagnosis.first_name}`
    : '診断者';

  // 弱点の門と強みの門のデータ
  const weakestGate = diagnosis.weakest_gate;
  const strongestGate = diagnosis.strongest_gate;
  const weakestGateData = weakestGate ? gates[weakestGate] : null;
  const strongestGateData = strongestGate ? gates[strongestGate] : null;

  // AI生成の詳細分析
  const fullResult = diagnosis.full_result || {};
  const weakestAnalysis = fullResult.weakest_analysis || {
    reason: weakestGateData?.description || '',
    steps: weakestGateData?.risks || [],
    daily_practice: weakestGateData?.advice || '',
  };
  const strongestAnalysis = fullResult.strongest_analysis || {
    analysis: strongestGateData?.description || '',
    use_cases: strongestGateData?.traits || [],
    advice: strongestGateData?.advice || '',
  };
  const nextSteps = fullResult.next_steps || [
    '定期的な自己診断で状態を確認する',
    '弱点の門を意識した生活習慣を取り入れる',
    '強みの門を活かせる場面を増やす',
  ];

  return (
    <ResultDetailClient
      userName={userName}
      rank={diagnosis.rank}
      soulType={diagnosis.soul_type || ''}
      totalScore={diagnosis.scores.total}
      weakestGate={weakestGate}
      strongestGate={strongestGate}
      weakestGateData={weakestGateData}
      strongestGateData={strongestGateData}
      weakestAnalysis={weakestAnalysis}
      strongestAnalysis={strongestAnalysis}
      nextSteps={nextSteps}
    />
  );
}
