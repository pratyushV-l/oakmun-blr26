import type { APIRoute } from 'astro';
import { clearAdminSessionCookie, json } from '../../../lib/attendance';

export const POST: APIRoute = () => new Response(JSON.stringify({ ok: true }), {
  headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'set-cookie': clearAdminSessionCookie() },
});
