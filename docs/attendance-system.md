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
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/your-deployment-id/exec
   GOOGLE_SHEETS_WEBHOOK_SECRET=use-a-long-random-value
   ```

   Keep `SUPABASE_SERVICE_ROLE_KEY` and all four admin/token secrets server-only. Never use a `PUBLIC_` prefix for them.
3. Create a Google Sheet and an Apps Script web app using the script below. Set its `SHEET_NAME` and `SYNC_SECRET`, deploy it for anyone with the link, and copy its web-app URL into `GOOGLE_SHEETS_WEBHOOK_URL`. Set the same secret in `GOOGLE_SHEETS_WEBHOOK_SECRET`.
4. Open `/qrcodeadmindashboard`. Sign in with `oakmundagoat`, add delegates, and download each QR. Delegates can use `/qr` to retrieve their QR with their registered email. Use the attendance scanner on the admin page to check them in. Camera scanning requires HTTPS and browser camera permission. The scanner also accepts a QR image upload.

### Google Apps Script

```javascript
const SHEET_NAME = 'Delegates';
const SYNC_SECRET = 'replace-with-the-same-long-random-value';

function doPost(event) {
  const body = JSON.parse(event.postData.contents || '{}');
  if (body.secret !== SYNC_SECRET) return respond({ error: 'Unauthorized' }, 401);

  const sheet = getSheet();
  const row = findEmailRow(sheet, body.email);
  if (body.action === 'upsert_delegate') {
    if (row === -1) sheet.appendRow([body.name, body.email, '', '', '', new Date()]);
    else sheet.getRange(row, 1, 1, 2).setValues([[body.name, body.email]]);
  } else if (body.action === 'record_attendance') {
    if (row === -1) sheet.appendRow([body.name, body.email, '', '', '', new Date()]);
    const targetRow = row === -1 ? sheet.getLastRow() : row;
    const column = { 1: 3, 2: 4, 3: 5 }[body.day];
    if (!column) return respond({ error: 'Invalid day' }, 400);
    sheet.getRange(targetRow, column).setValue(body.checkedInAt || new Date());
  } else {
    return respond({ error: 'Invalid action' }, 400);
  }
  return respond({ ok: true });
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.appendRow(['Name', 'Email', 'Day 1', 'Day 2', 'Day 3', 'Registered']);
  return sheet;
}

function findEmailRow(sheet, email) {
  const values = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1).getValues();
  const index = values.findIndex((row) => String(row[0]).toLowerCase() === String(email).toLowerCase());
  return index === -1 ? -1 : index + 2;
}

function respond(body, status) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Operations

- Add a delegate from the admin page. The QR is shown on screen immediately; download it before moving on.
- Choose Day 1, Day 2, or Day 3 before scanning. Duplicate scans show the original check-in and do not create a second record.

The conference dates are not currently wired to the three day labels; the labels intentionally remain Day 1–3 until the organizer supplies the exact date mapping.
