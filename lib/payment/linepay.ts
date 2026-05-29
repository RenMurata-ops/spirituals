// LINE Pay v3 クライアント（env駆動・キー未投入なら isConfigured() が false）。
// 必要env: LINEPAY_CHANNEL_ID, LINEPAY_CHANNEL_SECRET, LINEPAY_ENV(sandbox|production)
import { createHmac, randomUUID } from 'node:crypto';

const CHANNEL_ID = process.env.LINEPAY_CHANNEL_ID || '';
const CHANNEL_SECRET = process.env.LINEPAY_CHANNEL_SECRET || '';
const ENV = process.env.LINEPAY_ENV === 'production' ? 'production' : 'sandbox';

const BASE =
  ENV === 'production'
    ? 'https://api-pay.line.me'
    : 'https://sandbox-api-pay.line.me';

export function isConfigured(): boolean {
  return Boolean(CHANNEL_ID && CHANNEL_SECRET);
}

// LINE Pay の署名: HMAC-SHA256(secret, secret + uri + body + nonce) を base64
function sign(uri: string, body: string, nonce: string): string {
  return createHmac('sha256', CHANNEL_SECRET)
    .update(CHANNEL_SECRET + uri + body + nonce)
    .digest('base64');
}

async function call(uri: string, payload: unknown) {
  if (!isConfigured()) {
    throw new Error('LINE Pay is not configured');
  }
  const nonce = randomUUID();
  const body = JSON.stringify(payload);
  const res = await fetch(`${BASE}${uri}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-LINE-ChannelId': CHANNEL_ID,
      'X-LINE-Authorization-Nonce': nonce,
      'X-LINE-Authorization': sign(uri, body, nonce),
    },
    body,
  });
  const json = await res.json();
  return json as { returnCode: string; returnMessage: string; info?: Record<string, unknown> };
}

export interface RequestArgs {
  amount: number;
  currency: string;
  orderId: string; // = serial
  productName: string;
  confirmUrl: string;
  cancelUrl: string;
}

// 決済リクエスト。成功時 paymentUrl(web) と transactionId を返す。
export async function requestPayment(
  args: RequestArgs
): Promise<{ paymentUrl: string; transactionId: string }> {
  const payload = {
    amount: args.amount,
    currency: args.currency,
    orderId: args.orderId,
    packages: [
      {
        id: 'pkg-1',
        amount: args.amount,
        name: args.productName,
        products: [
          { name: args.productName, quantity: 1, price: args.amount },
        ],
      },
    ],
    redirectUrls: { confirmUrl: args.confirmUrl, cancelUrl: args.cancelUrl },
  };
  const json = await call('/v3/payments/request', payload);
  if (json.returnCode !== '0000' || !json.info) {
    throw new Error(`LINE Pay request failed: ${json.returnCode} ${json.returnMessage}`);
  }
  const info = json.info as {
    transactionId: number | string;
    paymentUrl: { web: string; app: string };
  };
  return {
    paymentUrl: info.paymentUrl.web,
    transactionId: String(info.transactionId),
  };
}

// 決済確定。redirect後に transactionId と amount で確定する。
export async function confirmPayment(
  transactionId: string,
  amount: number,
  currency: string
): Promise<boolean> {
  const json = await call(`/v3/payments/${transactionId}/confirm`, {
    amount,
    currency,
  });
  return json.returnCode === '0000';
}
