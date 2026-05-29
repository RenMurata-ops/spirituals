import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * ブラウザ用Supabaseクライアント
 * クライアントコンポーネントで使用
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
