import type { APIRoute } from 'astro';
import { hashToken, isAdminRequest, json, supabaseAdmin } from '../../../lib/attendance';
import { syncToGoogleSheets } from '../../../lib/google-sheets';

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) return json({ error: 'Admin sign-in required.' }, 401);
  try {
    const { token, day } = await request.json();
    if (typeof token !== 'string' || ![1, 2, 3].includes(Number(day))) return json({ error: 'That QR code or conference day is invalid.' }, 400);
    const db = supabaseAdmin();
    const emailToken = token.startsWith('email:') ? token.slice(6).trim().toLowerCase() : '';
    const { data: delegate, error: lookupError } = emailToken
      ? await db.from('delegates').select('id,name,email').eq('email', emailToken).maybeSingle()
      : await db.from('delegates').select('id,name,email').eq('qr_token_hash', hashToken(token)).maybeSingle();
    if (lookupError || !delegate) return json({ error: 'QR code not recognized. Ask the delegate to contact registration.' }, 404);
    const { data: prior } = await db.from('attendance').select('checked_in_at').eq('delegate_id', delegate.id).eq('conference_day', Number(day)).maybeSingle();
    if (prior) return json({ status: 'already_checked_in', delegate: { name: delegate.name, email: delegate.email }, checkedInAt: prior.checked_in_at });
    const { data: checkIn, error } = await db.from('attendance').insert({ delegate_id: delegate.id, conference_day: Number(day), checked_in_by: 'prototype' }).select('checked_in_at').single();
    if (error?.code === '23505') return json({ status: 'already_checked_in', delegate: { name: delegate.name, email: delegate.email } });
    if (error || !checkIn) return json({ error: 'Could not record attendance. Please try again.' }, 500);
    const sync = await syncToGoogleSheets({
      action: 'record_attendance',
      name: delegate.name,
      email: delegate.email,
      day: Number(day),
      checkedInAt: checkIn.checked_in_at,
    });
    return json({ status: 'checked_in', delegate: { name: delegate.name, email: delegate.email }, checkedInAt: checkIn.checked_in_at, syncWarning: sync.warning });
  } catch {
    return json({ error: 'The attendance service is not configured yet.' }, 503);
  }
};
