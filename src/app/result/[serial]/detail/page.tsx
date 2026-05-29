import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { createServerClient } from '@/lib/supabase/server';
import { RankName } from '@/types/diagnosis';
import { ResultDetailClient } from './ResultDetailClient';

interface PageProps {
  params: Promise<{ serial: string }>;
  searchParams: Promise<{ token?: string }>;
}

interface GateAnalysisItem {
  gate: string;
  gateName: string;
  score: number;
  status: string;
  description: string;
  improvement: string;
}

interface DiagnosisDetailData {
  serial: string;
  token: string;
  last_name: string | null;
  first_name: string | null;
  scores: { heart: number; wisdom: number; energy: number; time: number; total: number } | null;
  rank: RankName | null;
  soul_type: string | null;
  paid_at: string | null;
  full_result: {
    detail?: {
      overallAnalysis: string;
      gateAnalysis: GateAnalysisItem[];
      soulTypeDeepDive: string;
      lifePathGuidance: string;
      dailyPractices: string[];
      warningMessage: string;
      finalMessage: string;
    };
  } | null;
  detail_viewed_at: string | null;
}

export const metadata: Metadata = {
  title: `詳細レポート | Spirituals`,
  description: '4つの門のバランス詳細分析結果をご確認ください。',
  robots: { index: false, follow: false },
};

async function getDiagnosis(serial: string, token: string): Promise<DiagnosisDetailData | null> {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('diagnoses')
    .select(
      'serial, token, last_name, first_name, scores, rank, soul_type, paid_at, full_result, detail_viewed_at'
    )
    .eq('serial', serial)
    .single();

  if (error || !data) return null;
  if (data.token !== token) return null;

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

  if (!token) redirect('/error/unauthorized');

  const diagnosis = await getDiagnosis(serial, token);
  if (!diagnosis || !diagnosis.scores || !diagnosis.rank) {
    redirect('/error/unauthorized');
  }

  const userName =
    diagnosis.last_name && diagnosis.first_name
      ? `${diagnosis.last_name} ${diagnosis.first_name}`
      : '診断者';

  return (
    <ResultDetailClient
      userName={userName}
      rank={diagnosis.rank}
      soulType={diagnosis.soul_type || ''}
      totalScore={diagnosis.scores.total}
      detail={diagnosis.full_result?.detail ?? null}
      unlocked={!!diagnosis.paid_at}
      purchaseHref={`/purchase/${serial}?token=${encodeURIComponent(token)}`}
    />
  );
}
