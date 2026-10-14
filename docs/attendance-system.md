# OAKMUN delegate QR and attendance

The prototype adds a simple, unlinked admin page at `/staff`. It lets anyone with the URL add delegates by name and email, download their QR images, review the roster, and scan check-ins on conference days 1–3. No admin account or email sender is required. QR tokens are random credentials; only their SHA-256 hashes are stored in Supabase.

## One-time setup

1. Create a Supabase project and run `supabase/migrations/202610140001_attendance.sql` in its SQL editor.
2. Add these server environment variables in the local environment and the Vercel project settings:

   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=...
   ```

   Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never use a `PUBLIC_` prefix for it. The `/staff` page has no login because this is a prototype; do not use it for real delegate records without adding access control.
3. Open `/staff`. Add delegates and download each QR, then use the attendance scanner on the same page. Camera scanning requires HTTPS and browser camera permission. The scanner also accepts a QR image upload.

## Operations

- Add a delegate from `/staff`. The QR is shown on screen immediately; download it before moving on.
- Choose Day 1, Day 2, or Day 3 before scanning. Duplicate scans show the original check-in and do not create a second record.

The conference dates are not currently wired to the three day labels; the labels intentionally remain Day 1–3 until the organizer supplies the exact date mapping.
