type SheetSyncResult = {
  ok: boolean;
  warning?: string;
};

type SheetPayload = {
  action: 'upsert_delegate' | 'record_attendance' | 'delete_delegate';
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(config.url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, secret: config.secret }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!response.ok) return { ok: false, warning: `Google Sheets sync failed with status ${response.status}.` };
    const result = await response.json() as { ok?: boolean; error?: string };
    if (!result.ok) return { ok: false, warning: `Google Sheets sync was rejected${result.error ? `: ${result.error}` : '.'}` };
    return { ok: true };
  } catch (error) {
    console.error('Google Sheets sync failed.', error);
    return { ok: false, warning: error instanceof DOMException && error.name === 'AbortError' ? 'Google Sheets sync timed out after 15 seconds.' : 'Google Sheets sync could not be reached.' };
  }
}
