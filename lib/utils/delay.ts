/**
 * 指定ミリ秒の遅延を返すPromise
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 3分〜30分のランダムな遅延時間後の送信予定日時を計算
 */
export function calculateScheduledSendAt(): Date {
  const minDelay = 3 * 60 * 1000; // 3分
  const maxDelay = 30 * 60 * 1000; // 30分
  const delayMs =
    Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  return new Date(Date.now() + delayMs);
}
