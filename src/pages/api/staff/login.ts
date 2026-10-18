import type { APIRoute } from 'astro';
import { adminSessionCookie, json } from '../../../lib/attendance';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';
    const configuredPassword = (import.meta.env.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? 'oakmundagoat') as string;
    if (password !== configuredPassword) return json({ error: 'That password is incorrect.' }, 401);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'set-cookie': adminSessionCookie(request) },
    });
  } catch {
    return json({ error: 'Could not sign in.' }, 400);
  }
};
