import { createClient } from '@supabase/supabase-js';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

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

const sessionCookie = 'oakmun-admin-session';
const sessionDuration = 8 * 60 * 60 * 1000;

function secret(name: string): Buffer {
  const astroEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  const value = process.env[name] ?? astroEnv?.[name] ?? (name === 'ADMIN_SESSION_SECRET' ? 'oakmun-admin-session-secret' : undefined);
  if (!value) throw new Error(`Missing ${name}`);
  return createHash('sha256').update(value).digest();
}

export function adminSessionCookie(request: Request): string {
  const timestamp = Date.now().toString();
  const signature = createHmac('sha256', secret('ADMIN_SESSION_SECRET')).update(timestamp).digest('base64url');
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${sessionCookie}=${timestamp}.${signature}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${sessionDuration / 1000}${secure}`;
}

export function clearAdminSessionCookie(): string {
  return `${sessionCookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function isAdminRequest(request: Request): boolean {
  const value = request.headers.get('cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${sessionCookie}=`))?.slice(sessionCookie.length + 1);
  if (!value) return false;
  const [timestamp, suppliedSignature] = value.split('.');
  if (!timestamp || !suppliedSignature || Date.now() - Number(timestamp) > sessionDuration || Date.now() < Number(timestamp)) return false;
  const expectedSignature = createHmac('sha256', secret('ADMIN_SESSION_SECRET')).update(timestamp).digest();
  const supplied = Buffer.from(suppliedSignature, 'base64url');
  return supplied.length === expectedSignature.length && timingSafeEqual(supplied, expectedSignature);
}
