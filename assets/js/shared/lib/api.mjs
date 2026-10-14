/**
 * Nettleserklient mot lead-backend.
 *
 * Endepunktet settes ved bygg (LEAD_API_BASE) og ligger i
 * <body data-api-base="...">. Ingen hemmeligheter i frontend: backend
 * autentiserer mot CRM/Genspark/webhooks med nøkler i Wix Secrets Manager.
 */

import { interpretResponse } from './lead.mjs';

const TIMEOUT_MS = 20000;

export function apiBase() {
  return (document.body.dataset.apiBase || '').replace(/\/+$/, '');
}

/**
 * @param {'pristilbud'|'kontakt'} kind
 * @param {object} payload
 * @returns {Promise<{ok: boolean, id?: string, degraded?: boolean, code?: string}>}
 */
export async function submitLead(kind, payload) {
  const base = apiBase();
  if (!base) return { ok: false, code: 'not_configured' };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${base}/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: ctrl.signal,
    });
    let body = {};
    try {
      body = await res.json();
    } catch (e) {
      /* tomt eller ikke-JSON svar */
    }
    return interpretResponse(res.status, body);
  } catch (err) {
    return { ok: false, code: err && err.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    clearTimeout(timer);
  }
}
