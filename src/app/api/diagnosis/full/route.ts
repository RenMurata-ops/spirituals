import { NextRequest, NextResponse } from 'next/server';
import {
  calculateScores,
  determineWeakestGate,
  determineStrongestGate,
  determineSoulType,
  determineRank,
  calculateTotalScore,
  FullAnswers,
  GateType as DiagnosisGateType,
  Rank as DiagnosisRank,
  SoulType as DiagnosisSoulType,
  Scores as DiagnosisScores,
} from '@/lib/diagnosis/calculateScore';
import {
  generateFullResult,
  GateType as AIGateType,
  Rank as AIRank,
  SoulType as AISoulType,
  Scores as AIScores,
  AgeGroup,
  Gender,
} from '@/lib/ai/generateFullResult';
import { calculateScheduledSendAt } from '@/lib/utils/delay';
import { createServerClient } from '@/lib/supabase/server';

interface FullDiagnosisRequest {
  serial: string;
  answers: FullAnswers;
}

// GateType変換マッピング
const gateTypeMapping: Record<DiagnosisGateType, AIGateType> = {
  heart: 'heart',
  wisdom: 'third_eye',
  energy: 'solar_plexus',
  time: 'root',
};

// Rank変換マッピング
const rankMapping: Record<DiagnosisRank, AIRank> = {
  awakened: 'S',
  guardian: 'A',
  practitioner: 'B',
  seeker: 'C',
  awakening: 'D',
};

// SoulType変換マッピング
const soulTypeMapping: Record<DiagnosisSoulType, AISoulType> = {
  healer: 'healer',
  mystic: 'visionary',
  warrior: 'warrior',
  sage: 'sage',
};

// Scores変換（4門 → 7門、欠けている門はデフォルト値）
function convertScores(diagnosisScores: DiagnosisScores): AIScores {
  return {
    crown: 50, // デフォルト
    third_eye: diagnosisScores.wisdom,
    throat: 50, // デフォルト
    heart: diagnosisScores.heart,
    solar_plexus: diagnosisScores.energy,
    sacral: 50, // デフォルト
    root: diagnosisScores.time,
  };
}

// ageGroupの変換
function normalizeAgeGroup(ageGroup: string | null): AgeGroup {
  if (!ageGroup) return '30s';
  const mapping: Record<string, AgeGroup> = {
    '10-19': '10s',
    '20-24': '20s',
    '25-34': '20s',
    '35-44': '30s',
    '45-54': '40s',
    '55-64': '50s',
    '65+': '60s_plus',
  };
  return mapping[ageGroup] || '30s';
}

// genderの変換
function normalizeGender(gender: string | null): Gender {
  if (!gender) return 'other';
  const mapping: Record<string, Gender> = {
    male: 'male',
    female: 'female',
    other: 'other',
  };
  return mapping[gender] || 'other';
}

export async function POST(request: NextRequest) {
  try {
    const body: FullDiagnosisRequest = await request.json();
    const { serial, answers } = body;

    const supabase = createServerClient();

    // 1. serialでDBから診断データ取得
    const { data: diagnosis, error: fetchError } = await supabase
      .from('diagnoses')
      .select('*')
      .eq('serial', serial)
      .single();

    if (fetchError || !diagnosis) {
      return NextResponse.json(
        { error: 'Diagnosis not found' },
        { status: 404 }
      );
    }

    // 2. calculateScores でスコア計算
    const scores = calculateScores(answers);

    // 3. determineWeakestGate, determineStrongestGate
    const weakestGate = determineWeakestGate(scores);
    const strongestGate = determineStrongestGate(scores);

    // 4. determineSoulType, determineRank
    const soulType = determineSoulType(weakestGate);
    const totalScore = calculateTotalScore(scores);
    const rank = determineRank(totalScore);

    // 5. 型変換
    const aiScores = convertScores(scores);
    const aiWeakestGate = gateTypeMapping[weakestGate];
    const aiStrongestGate = gateTypeMapping[strongestGate];
    const aiSoulType = soulTypeMapping[soulType];
    const aiRank = rankMapping[rank];
    const ageGroup = normalizeAgeGroup(diagnosis.age_group);
    const gender = normalizeGender(diagnosis.gender);

    // 6. generateFullResult でAI結果生成
    const result = await generateFullResult(
      aiScores,
      aiWeakestGate,
      aiStrongestGate,
      aiSoulType,
      aiRank,
      ageGroup,
      gender,
      diagnosis.occupation || ''
    );

    // 7. メール送信予定時刻を計算
    const scheduledSendAt = calculateScheduledSendAt();

    // 7.5 表示ドメインへ正規化（結果ページ/詳細/メールはこの形を読む）
    const RANK_NAME: Record<DiagnosisRank, string> = {
      awakened: '覚醒者',
      guardian: '守護者',
      practitioner: '修行者',
      seeker: '探求者',
      awakening: '目覚めの時',
    };
    const SOUL_DISPLAY: Record<DiagnosisSoulType, string> = {
      healer: '共鳴の魂',
      mystic: '探究の魂',
      warrior: '感応の魂',
      sage: '遍歴の魂',
    };
    const rankName = RANK_NAME[rank];
    const soulTypeName = SOUL_DISPLAY[soulType];
    const scoresWithTotal = { ...scores, total: totalScore };

    // 8. DBを更新
    const { error: updateError } = await supabase
      .from('diagnoses')
      .update({
        full_answers: answers,
        scores: scoresWithTotal,
        weakest_gate: weakestGate,
        strongest_gate: strongestGate,
        soul_type: soulTypeName,
        rank: rankName,
        full_result: result,
        scheduled_send_at: scheduledSendAt.toISOString(),
      })
      .eq('serial', serial);

    if (updateError) {
      console.error('Failed to update diagnosis:', updateError);
      return NextResponse.json(
        { error: 'Failed to update diagnosis' },
        { status: 500 }
      );
    }

    // 9. 結果を返却
    return NextResponse.json({
      serial,
      scores,
      weakestGate,
      strongestGate,
      soulType,
      rank,
      result,
    });
  } catch (error) {
    console.error('Full diagnosis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
