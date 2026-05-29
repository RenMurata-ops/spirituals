// LINE Messaging API のプッシュ送信（env駆動）。
// 必要env: LINE_CHANNEL_ACCESS_TOKEN。未設定なら isConfigured() が false。
const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';

export function isConfigured(): boolean {
  return Boolean(TOKEN);
}

export async function pushResult(
  lineUserId: string,
  text: string
): Promise<{ success: boolean; error?: string }> {
  if (!isConfigured()) {
    return { success: false, error: 'LINE_CHANNEL_ACCESS_TOKEN not configured' };
  }
  try {
    const res = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [{ type: 'text', text: text.slice(0, 4900) }],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { success: false, error: `LINE push failed: ${res.status} ${body}` };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
