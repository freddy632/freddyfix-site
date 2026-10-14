/**
 * Bygger JSON-payloaden som sendes til backend (Wix Velo http-functions,
 * se ../../../../src/backend/http-functions.js). Feltnavnene er kontrakten
 * mot backend/leads.jsw – endres de her, må backend oppdateres.
 *
 * Rene funksjoner – testes i tests/lead.test.mjs.
 */

import { features, productCounts, labelOf } from '../content/options.mjs';
import { paymentModes } from '../content/packages.mjs';
import { normalizeUrl } from './validation.mjs';

const t = (v, max = 5000) => String(v == null ? '' : v).trim().slice(0, max);

/**
 * @param {object} d  skjemadata fra pristilbudet
 * @param {{ page?: string, elapsedMs?: number }} meta
 */
export function buildQuotePayload(d, meta = {}) {
  const featureIds = Array.isArray(d.funksjoner) ? d.funksjoner : [];
  const hasShop = featureIds.includes('nettbutikk') || d.goal === 'salg';
  const mode = paymentModes.find((m) => m.id === d.betaling);
  return {
    kilde: 'pristilbud',
    fornavn: t(d.fornavn, 60),
    etternavn: t(d.etternavn, 60),
    epost: t(d.epost, 200),
    telefon: t(d.telefon, 40),
    bedrift: t(d.bedrift, 120),
    bransje: t(d.bransje, 60),
    nettside: normalizeUrl(d.nettside),
    goal: t(d.goal, 60),
    pakke: t(d.pakke, 40),
    betaling: mode && d.pakke !== 'custom' ? mode.label : '',
    funksjoner: featureIds.map((id) => labelOf(features, id)).filter(Boolean),
    produkter: hasShop ? labelOf(productCounts, d.produkter) : '',
    sider: t(d.sider, 20),
    frist: t(d.frist, 20),
    beskrivelse: t(d.beskrivelse, 5000),
    inspirasjon: t(d.inspirasjon, 2000),
    best_tid: t(d.best_tid, 30),
    _honey: t(d.website_url, 200),
    _t: Math.max(0, Math.round(meta.elapsedMs || 0)),
    page: t(meta.page, 300),
  };
}

export function buildContactPayload(d, meta = {}) {
  return {
    kilde: 'kontakt',
    fornavn: t(d.fornavn, 60),
    etternavn: t(d.etternavn, 60),
    epost: t(d.epost, 200),
    telefon: t(d.telefon, 40),
    tjeneste: t(d.tjeneste, 80),
    emne: t(d.emne, 200),
    melding: t(d.melding, 5000),
    _honey: t(d.website_url, 200),
    _t: Math.max(0, Math.round(meta.elapsedMs || 0)),
    page: t(meta.page, 300),
  };
}

/**
 * Tolker svaret fra backend.
 *   200            -> ok
 *   502 + wix_id   -> lagret i Wix, men videresending (CRM/varsel) feilet.
 *                     Henvendelsen ER mottatt, så brukeren får bekreftelse.
 *   alt annet      -> feil med kode
 */
export function interpretResponse(status, body) {
  const b = body && typeof body === 'object' ? body : {};
  if (status === 200 && b.ok !== false) return { ok: true, id: b.wix_id || '' };
  if (status === 502 && b.wix_id) return { ok: true, id: b.wix_id, degraded: true };
  return { ok: false, code: b.error || (status === 0 ? 'network' : 'http_' + status) };
}
