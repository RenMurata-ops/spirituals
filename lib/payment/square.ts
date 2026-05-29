// Square 決済クライアント（env駆動・キー未投入なら isConfigured() が false）。
// 必要env: SQUARE_ACCESS_TOKEN, SQUARE_LOCATION_ID, SQUARE_ENV(sandbox|production)
import { randomUUID } from 'node:crypto';

const TOKEN = process.env.SQUARE_ACCESS_TOKEN || '';
const LOCATION = process.env.SQUARE_LOCATION_ID || '';
const ENV = process.env.SQUARE_ENV === 'production' ? 'production' : 'sandbox';
const BASE =
  ENV === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';
const VERSION = '2025-01-23';

export function isConfigured(): boolean {
  return Boolean(TOKEN && LOCATION);
}

async function api(path: string, method: string, body?: unknown) {
  if (!isConfigured()) throw new Error('Square is not configured');
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Square-Version': VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Square ${path} failed: ${res.status} ${JSON.stringify(json.errors || json)}`);
  }
  return json;
}

export interface CheckoutArgs {
  amount: number;
  currency: string;
  orderId: string; // = serial（reference_id に載せる）
  productName: string;
  redirectUrl: string;
}

// Square のホスト型決済リンクを作成。決済URLと Square 側 order_id を返す。
export async function createCheckout(
  args: CheckoutArgs
): Promise<{ url: string; squareOrderId: string }> {
  const json = await api('/v2/online-checkout/payment-links', 'POST', {
    idempotency_key: randomUUID(),
    order: {
      location_id: LOCATION,
      reference_id: args.orderId,
      line_items: [
        {
          name: args.productName,
          quantity: '1',
          // JPY はゼロ小数通貨なので amount = 円そのまま
          base_price_money: { amount: args.amount, currency: args.currency },
        },
      ],
    },
    checkout_options: {
      redirect_url: args.redirectUrl,
      ask_for_shipping_address: false,
    },
  });
  const link = json.payment_link;
  return { url: link.url, squareOrderId: link.order_id };
}

// 決済完了の検証。Square の order を取得し、支払い済みかと reference_id(=serial) を返す。
export async function getOrderStatus(
  squareOrderId: string
): Promise<{ paid: boolean; referenceId: string | null }> {
  const json = await api(`/v2/orders/${squareOrderId}`, 'GET');
  const order = json.order;
  if (!order) return { paid: false, referenceId: null };
  const paid =
    order.state === 'COMPLETED' ||
    (Array.isArray(order.tenders) && order.tenders.length > 0) ||
    order.net_amount_due_money?.amount === 0;
  return { paid, referenceId: order.reference_id ?? null };
}
