/**
 * Klientvalidering for skjemaene. Speiler reglene i backend/leads.jsw
 * (backend validerer alltid på nytt – dette er kun for god brukeropplevelse).
 * Rene funksjoner – testes i tests/validation.test.mjs.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^[+0-9 ()\-.]{6,40}$/;
export const URL_RE = /^https?:\/\/\S+\.\S+$/i;
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const trim = (v) => String(v == null ? '' : v).trim();

/** Gjør «dinbedrift.no» om til «https://dinbedrift.no». Tom streng forblir tom. */
export function normalizeUrl(value) {
  const v = trim(value);
  if (!v) return '';
  return /^https?:\/\//i.test(v) ? v : 'https://' + v;
}

/** Dagens dato som YYYY-MM-DD i lokal tid. */
export function todayIso(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

/**
 * Regler per felt. Hver regel returnerer en feilmelding eller ''.
 * `ctx` er hele dataobjektet (for avhengige felt).
 */
export const rules = {
  bedrift: (v) => (trim(v).length >= 2 ? '' : 'Skriv inn bedriftsnavnet.'),
  bransje: (v) => (trim(v) ? '' : 'Velg bransje.'),
  nettside: (v) => {
    const u = normalizeUrl(v);
    return !u || URL_RE.test(u) ? '' : 'Nettsideadressen ser ikke riktig ut (f.eks. dinbedrift.no).';
  },
  goal: (v) => (trim(v) ? '' : 'Velg det viktigste målet.'),
  pakke: (v) => (trim(v) ? '' : 'Velg en pakke, eller «Vet ikke ennå».'),
  beskrivelse: (v) => (trim(v).length >= 10 ? '' : 'Beskriv prosjektet med noen setninger (minst 10 tegn).'),
  frist: (v, ctx, now) => {
    const d = trim(v);
    if (!d) return '';
    if (!DATE_RE.test(d)) return 'Ugyldig dato.';
    return d < todayIso(now) ? 'Datoen kan ikke være tilbake i tid.' : '';
  },
  fornavn: (v) => (trim(v) ? '' : 'Skriv inn fornavn.'),
  etternavn: (v) => (trim(v) ? '' : 'Skriv inn etternavn.'),
  epost: (v) => {
    const e = trim(v);
    if (!e) return 'Skriv inn e-postadressen din.';
    return EMAIL_RE.test(e) && e.length <= 200 ? '' : 'Skriv inn en gyldig e-postadresse, f.eks. ola@bedrift.no.';
  },
  telefon: (v) => {
    const t = trim(v);
    return !t || PHONE_RE.test(t) ? '' : 'Telefonnummeret kan bare inneholde tall, mellomrom og +.';
  },
  melding: (v) => (trim(v).length >= 2 ? '' : 'Skriv en melding.'),
};

/** Feltene som valideres i hvert steg av pristilbudet (steg 4 = oppsummering). */
export const quoteSteps = {
  1: ['bedrift', 'bransje', 'nettside', 'goal'],
  2: ['pakke', 'beskrivelse', 'frist'],
  3: ['fornavn', 'etternavn', 'epost', 'telefon'],
};

export const contactFields = ['fornavn', 'etternavn', 'epost', 'telefon', 'melding'];

/**
 * Validerer en liste felt. Returnerer { valid, errors: { felt: melding } }.
 */
export function validate(fields, data, now = new Date()) {
  const errors = {};
  for (const f of fields) {
    const rule = rules[f];
    if (!rule) continue;
    const msg = rule(data[f], data, now);
    if (msg) errors[f] = msg;
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

/** Feilkoder fra backend/http-functions.js -> brukervennlig tekst. */
export const serverErrors = {
  navn_required: 'Fyll ut fornavn og etternavn.',
  epost_invalid: 'Skriv inn en gyldig e-postadresse.',
  telefon_invalid: 'Telefonnummeret ser ikke riktig ut.',
  nettside_invalid: 'Nettsideadressen må starte med http:// eller https://.',
  maal_required: 'Beskriv prosjektet med noen ord.',
  pakke_invalid: 'Velg en gyldig pakke.',
  frist_invalid: 'Ugyldig dato.',
  invalid_json: 'Skjemaet kunne ikke leses. Last siden på nytt og prøv igjen.',
  too_fast: 'Skjemaet ble sendt for raskt. Vent et øyeblikk og prøv igjen.',
  rate_limited: 'Vi har mottatt mange henvendelser fra deg på kort tid. Prøv igjen om noen minutter.',
  storage_failed: 'Vi klarte ikke å lagre forespørselen. Prøv igjen om litt, eller send oss en melding på WhatsApp.',
};
