import { NextRequest, NextResponse } from 'next/server';
import { judgeQuickGate, QuickAnswers, GateType as DiagnosisGateType } from '@/lib/diagnosis/quickJudge';
import { generateQuickResult, GateType as AIGateType, AgeGroup, Gender } from '@/lib/ai/generateQuickResult';
import { generateSerial, generateToken } from '@/lib/utils/nanoid';
import { createServerClient } from '@/lib/supabase/server';

interface QuickDiagnosisRequest {
  answers: QuickAnswers;
  ageGroup: string;
  gender: string;
  occupation: string;
}

// 診断用GateTypeからAI用GateTypeへの変換マッピング
const gateTypeMapping: Record<DiagnosisGateType, AIGateType> = {
  heart: 'heart',
  wisdom: 'third_eye',
  energy: 'solar_plexus',
  time: 'root',
};

// ageGroupの変換
function normalizeAgeGroup(ageGroup: string): AgeGroup {
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
function normalizeGender(gender: string): Gender {
  const mapping: Record<string, Gender> = {
    male: 'male',
    female: 'female',
    other: 'other',
  };
  return mapping[gender] || 'other';
}

export async function POST(request: NextRequest) {
  try {
    const body: QuickDiagnosisRequest = await request.json();
    const { answers, ageGroup, gender, occupation } = body;

    // 1. judgeQuickGate で門を判定
    const diagnosisGate = judgeQuickGate(answers);

    // 2. 型変換
    const aiGate = gateTypeMapping[diagnosisGate];
    const normalizedAgeGroup = normalizeAgeGroup(ageGroup);
    const normalizedGender = normalizeGender(gender);

    // 3. generateQuickResult でAI結果生成
    const result = await generateQuickResult(
      aiGate,
      normalizedAgeGroup,
      normalizedGender,
      occupation
    );

    // 4. generateSerial, generateToken で識別子生成
    const serial = generateSerial();
    const token = generateToken();

    // 5. Supabase に診断データ保存（失敗してもレスポンスは返す）
    const supabase = createServerClient();
    const { error: insertError } = await supabase.from('diagnoses').insert({
      serial,
      token,
      age_group: ageGroup,
      gender,
      occupation,
      quick_answers: answers,
      quick_gate: diagnosisGate,
      quick_result: result,
    });

    if (insertError) {
      // ログ出力するが、レスポンスは正常に返す（スキーマキャッシュ問題の一時対応）
      console.error('Failed to save diagnosis (continuing anyway):', insertError);
    }

    // 6. 結果を返却
    return NextResponse.json({
      serial,
      gate: diagnosisGate,
      result,
      saved: !insertError, // 保存成功したかどうかをレスポンスに含める
    });
  } catch (error) {
    console.error('Quick diagnosis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
