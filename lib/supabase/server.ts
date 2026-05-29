import { createClient } from '@supabase/supabase-js';

/**
 * サーバー用Supabaseクライアント（Service Role Key使用）
 * API Routes、Server Componentsで使用
 * RLSをバイパスして全データにアクセス可能
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
