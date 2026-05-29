import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
// 送信元。独自ドメイン検証後は RESEND_FROM を設定すると任意の宛先へ配信できる。
// 未設定時は Resend のテスト送信元（アカウント所有者にしか届かない）。
const FROM = process.env.RESEND_FROM || 'Spirituals <onboarding@resend.dev>';

// Types matching the database schema
export interface Diagnosis {
  id: string;
  serial: string;
  token: string;
  last_name: string | null;
  first_name: string | null;
  middle_name: string | null;
  email: string | null;
  quick_result: {
    headline: string;
    description: string;
  } | null;
  full_result: {
    preview: {
      headline: string;
      soulTypeDescription: string;
      rankDescription: string;
    };
    detail: {
      overallAnalysis: string;
      finalMessage: string;
    };
  } | null;
}

function getFullName(diagnosis: Diagnosis): string {
  const parts = [diagnosis.last_name, diagnosis.first_name, diagnosis.middle_name].filter(Boolean);
  return parts.length > 0 ? parts.join(' ') : 'お客';
}

function generateEmailBody(diagnosis: Diagnosis, detailUrl: string): string {
  const name = getFullName(diagnosis);
  const preview = diagnosis.full_result?.preview;
  const detail = diagnosis.full_result?.detail;

  return `${name}様

この度は「Spirituals」の診断をご利用いただき、誠にありがとうございます。
お待たせいたしました。あなただけの診断レポートが完成しました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 診断結果サマリー
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${preview?.headline || '診断結果が準備できました'}

${preview?.soulTypeDescription || ''}

${preview?.rankDescription || ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 詳細レポートを確認
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

詳しい診断結果とアドバイスは、以下のリンクからご確認いただけます。

▼ 診断詳細ページ
${detailUrl}

※ このリンクはあなた専用です。他の方と共有しないでください。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 総合分析より
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${detail?.overallAnalysis || '詳細ページで全ての分析結果をご確認いただけます。'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${detail?.finalMessage || 'あなたの人生がより良い方向へ進むことを願っています。'}

--
Spirituals スピリチュアル診断サービス
https://spirituals.jp

※ このメールは自動送信されています。
※ ご質問がございましたら、info@spirituals.jp までご連絡ください。
`;
}

export interface SendResultEmailOptions {
  email: string;
  diagnosis: Diagnosis;
  baseUrl?: string;
}

export interface SendResultEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendResultEmail(
  email: string,
  diagnosis: Diagnosis
): Promise<SendResultEmailResult> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const detailUrl = `${baseUrl}/result/${diagnosis.serial}?token=${diagnosis.token}`;
  const name = getFullName(diagnosis);

  const emailBody = generateEmailBody(diagnosis, detailUrl);

  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `【Spirituals】${name}様の診断レポートが完成しました`,
      text: emailBody,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
