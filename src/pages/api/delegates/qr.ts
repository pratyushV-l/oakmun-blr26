import type { APIRoute } from 'astro';
import { json, supabaseAdmin } from '../../../lib/attendance';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Enter a valid email address.' }, 400);
    const { data, error } = await supabaseAdmin().from('delegates').select('name,email').eq('email', email).maybeSingle();
    if (error) return json({ error: 'Could not look up your QR code.' }, 500);
    if (!data) return json({ error: 'No delegate registration was found for that email.' }, 404);
    return json({ delegate: { name: data.name, email: data.email } });
  } catch {
    return json({ error: 'The delegate service is not configured yet.' }, 503);
  }
};
