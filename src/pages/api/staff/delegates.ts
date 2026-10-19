import type { APIRoute } from 'astro';
import { hashToken, isAdminRequest, json, newQrToken, supabaseAdmin } from '../../../lib/attendance';
import { syncToGoogleSheets } from '../../../lib/google-sheets';

export const GET: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) return json({ error: 'Admin sign-in required.' }, 401);
  const { data, error } = await supabaseAdmin().from('delegates').select('id,name,email,created_at,attendance(conference_day,checked_in_at)').order('created_at', { ascending: false }).limit(500);
  if (error) return json({ error: 'Could not load delegate list.' }, 500);
  return json({ delegates: data });
};

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) return json({ error: 'Admin sign-in required.' }, 401);
  try {
    const { name, email } = await request.json();
    if (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 120) return json({ error: 'Enter a delegate name (1–120 characters).' }, 400);
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return json({ error: 'Enter a valid email address.' }, 400);
    const cleanEmail = email.trim().toLowerCase();
    const token = newQrToken();
    const db = supabaseAdmin();
    const { data, error } = await db.from('delegates').insert({ name: name.trim(), email: cleanEmail, qr_token_hash: hashToken(token) }).select('id,name,email,created_at').single();
    if (error?.code === '23505') return json({ error: 'A delegate with that email already exists.' }, 409);
    if (error || !data) return json({ error: 'Could not save this delegate.' }, 500);
    const sync = await syncToGoogleSheets({ action: 'upsert_delegate', name: data.name, email: data.email });
    return json({ delegate: data, qrToken: token, syncWarning: sync.warning }, 201);
  } catch {
    return json({ error: 'The delegate service is not configured yet.' }, 503);
  }
};
