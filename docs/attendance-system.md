# OAKMUN delegate QR and attendance

The public `/qr` page lets delegates retrieve a QR by registered email. The admin page is intentionally unlisted at `/qrcodeadmindashboard` and protected by an admin password. Authorized staff can add delegates by name and email, review the roster, download QR images, and scan check-ins on conference days 1–3. Existing random QR tokens continue to be stored as SHA-256 hashes; delegate-retrieved QRs use the registered email as their lookup value.

## One-time setup

1. Create a Supabase project and run `supabase/migrations/202610140001_attendance.sql` in its SQL editor.
2. Add these server environment variables in the local environment and the Vercel project settings:

   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=...
   ADMIN_PASSWORD=...
   ADMIN_SESSION_SECRET=...
   ```

   Keep `SUPABASE_SERVICE_ROLE_KEY` and all four admin/token secrets server-only. Never use a `PUBLIC_` prefix for them.
3. Open `/qrcodeadmindashboard`. Sign in with `oakmundagoat`, add delegates, and download each QR. Delegates can use `/qr` to retrieve their QR with their registered email. Use the attendance scanner on the admin page to check them in. Camera scanning requires HTTPS and browser camera permission. The scanner also accepts a QR image upload.

## Operations

- Add a delegate from the admin page. The QR is shown on screen immediately; download it before moving on.
- Choose Day 1, Day 2, or Day 3 before scanning. Duplicate scans show the original check-in and do not create a second record.

The conference dates are not currently wired to the three day labels; the labels intentionally remain Day 1–3 until the organizer supplies the exact date mapping.
