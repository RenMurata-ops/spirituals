// CLI駆動・API不使用。事前生成した data.json をルックアップして返す。
// 型と関数シグネチャは従来と同一なので、呼び出し側（APIルート）は変更不要。
import variants from '@/lib/variants/data.json';
import {
  GateType,
  AgeGroup,
  Gender as KeyGender,
  toneFromAge,
  quickKey,
  GATE_NAMES,
} from '@/lib/variants/keys';

export type { GateType, AgeGroup };
export type Gender = KeyGender;

export interface QuickResult {
  gate: GateType;
  gateName: string;
  headline: string;
  description: string;
  advice: string;
  ctaText: string;
}

interface QuickVariant {
  headline: string;
  description: string;
  advice: string;
  ctaText: string;
}

const quickVariants = variants.quick as Record<string, QuickVariant>;

function fallback(gateName: string): QuickVariant {
  return {
    headline: `${gateName}に、いま小さな滞りが見えています`,
    description:
      'あなたは無意識のうちに、自分の感覚より周囲の期待を優先してしまう瞬間があります。その積み重ねが、本来の調子を少しずつ鈍らせています。',
    advice:
      '一日のなかで「自分は本当はどうしたいか」を一度だけ言葉にしてみてください。それだけで流れが変わり始めます。',
    ctaText: '無料診断で深層を見る',
  };
}

export async function generateQuickResult(
  gate: GateType,
  ageGroup: AgeGroup,
  _gender: Gender,
  _occupation: string
): Promise<QuickResult> {
  const gateName = GATE_NAMES[gate];
  const tone = toneFromAge(ageGroup);
  const variant = quickVariants[quickKey(gate, tone)] ?? fallback(gateName);
  return {
    gate,
    gateName,
    ...variant,
  };
}
