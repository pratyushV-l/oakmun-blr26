import { createClient } from '@supabase/supabase-js';
import { createHash, randomBytes } from 'node:crypto';

function requiredEnv(name: string): string {
  const astroEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const value = process.env[name] ?? astroEnv?.[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

export function supabaseAdmin() {
  return createClient(requiredEnv('SUPABASE_URL'), requiredEnv('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');
export const newQrToken = () => randomBytes(32).toString('base64url');
