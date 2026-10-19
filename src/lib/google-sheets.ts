type SheetSyncResult = {
  ok: boolean;
  warning?: string;
};

type SheetPayload = {
  action: 'upsert_delegate' | 'record_attendance';
  name: string;
  email: string;
  day?: number;
  checkedInAt?: string;
};

function sheetsConfig() {
  const astroEnv = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;
  return {
    url: process.env.GOOGLE_SHEETS_WEBHOOK_URL ?? astroEnv?.GOOGLE_SHEETS_WEBHOOK_URL,
    secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET ?? astroEnv?.GOOGLE_SHEETS_WEBHOOK_SECRET,
  };
}

export async function syncToGoogleSheets(payload: SheetPayload): Promise<SheetSyncResult> {
  const config = sheetsConfig();
  if (!config.url || !config.secret) {
    return { ok: false, warning: 'Google Sheets sync is not configured.' };
  }

  try {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, secret: config.secret }),
    });
    if (!response.ok) return { ok: false, warning: `Google Sheets sync failed with status ${response.status}.` };
    return { ok: true };
  } catch (error) {
    console.error('Google Sheets sync failed.', error);
    return { ok: false, warning: 'Google Sheets sync could not be reached.' };
  }
}
