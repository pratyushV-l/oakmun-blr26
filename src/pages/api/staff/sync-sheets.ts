import type { APIRoute } from 'astro';
import { isAdminRequest, json, supabaseAdmin } from '../../../lib/attendance';
import { syncToGoogleSheets } from '../../../lib/google-sheets';

export const POST: APIRoute = async ({ request }) => {
  if (!isAdminRequest(request)) return json({ error: 'Admin sign-in required.' }, 401);
  const { data: delegates, error } = await supabaseAdmin().from('delegates').select('name,email,attendance(conference_day,checked_in_at)');
  if (error) return json({ error: 'Could not load delegates to sync.' }, 500);

  let synced = 0;
  for (const delegate of delegates ?? []) {
    const result = await syncToGoogleSheets({ action: 'upsert_delegate', name: delegate.name, email: delegate.email });
    if (!result.ok) return json({ error: result.warning ?? 'Google Sheets sync failed.', synced }, 502);
    for (const attendance of delegate.attendance ?? []) {
      const attendanceResult = await syncToGoogleSheets({
        action: 'record_attendance',
        name: delegate.name,
        email: delegate.email,
        day: attendance.conference_day,
        checkedInAt: attendance.checked_in_at,
      });
      if (!attendanceResult.ok) return json({ error: attendanceResult.warning ?? 'Google Sheets attendance sync failed.', synced }, 502);
    }
    synced += 1;
  }
  return json({ ok: true, synced });
};
