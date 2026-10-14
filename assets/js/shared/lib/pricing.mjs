/**
 * Prisberegninger. Rene funksjoner uten DOM – testes i tests/pricing.test.mjs.
 *
 * Betalingsalternativer (to separate modeller, bekreftet av Freddy Fix):
 *   engang: engangspris, 50 % ved oppstart + 50 % ved levering
 *   maaned: oppstartsbeløp + fast månedspris, 1 års binding
 *
 * Alle beløp i hele kroner eks. mva. `withVat` gir beløp inkl. 25 % mva.
 */

import { packages, VAT_RATE } from '../content/packages.mjs';

export function getPackage(id) {
  return packages.find((p) => p.id === id) || null;
}

/** Legger på mva og runder til nærmeste hele krone. */
export function withVat(amount, rate = VAT_RATE) {
  return Math.round(amount * (1 + rate));
}

/** Formaterer heltall som norsk beløp: 17900 -> «17 900 kr». */
export function formatNok(amount, { suffix = ' kr' } = {}) {
  const n = Math.round(Number(amount) || 0);
  const s = String(Math.abs(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
  return (n < 0 ? '−' : '') + s + suffix;
}

/**
 * Beregner prisoppsettet for en pakke og betalingsmåte.
 * @param {string} packageId  starter | vekst | premium
 * @param {'engang'|'maaned'} mode
 * @param {{ inclVat?: boolean }} [opts]
 * @returns {null | {
 *   packageId: string, name: string, mode: string, inclVat: boolean,
 *   lines: { label: string, amount: number, unit?: string }[],
 *   headline: { amount: number, unit: string },
 *   vatNote: string
 * }}
 */
export function quote(packageId, mode, { inclVat = false } = {}) {
  const pkg = getPackage(packageId);
  if (!pkg) return null;
  const v = (a) => (inclVat ? withVat(a) : a);
  const vatNote = inclVat ? 'Inkl. 25 % mva.' : 'Eks. mva.';

  if (mode === 'maaned') {
    return {
      packageId: pkg.id,
      name: pkg.name,
      mode,
      inclVat,
      headline: { amount: v(pkg.monthly), unit: 'kr/mnd' },
      lines: [
        { label: 'Oppstart', amount: v(pkg.monthlyStartup) },
        { label: 'Deretter per måned', amount: v(pkg.monthly), unit: 'kr/mnd' },
      ],
      terms: '1 års binding',
      vatNote,
    };
  }

  // Engangsbetaling 50/50. Ved oddetall legges øret på siste del, slik at summen alltid stemmer.
  const total = v(pkg.oneTime);
  const first = Math.floor(total / 2);
  return {
    packageId: pkg.id,
    name: pkg.name,
    mode: 'engang',
    inclVat,
    headline: { amount: total, unit: 'kr' },
    lines: [
      { label: 'Ved oppstart (50 %)', amount: first },
      { label: 'Ved levering (50 %)', amount: total - first },
    ],
    terms: 'Totalpris, betales 50/50',
    vatNote,
  };
}

/** Normaliserer betalingsmåte fra URL/skjema. */
export function normalizeMode(value) {
  return value === 'maaned' ? 'maaned' : 'engang';
}

/** Normaliserer pakke-id fra URL/skjema. Tom streng hvis ukjent. */
export function normalizePackage(value) {
  const id = String(value || '').toLowerCase();
  if (id === 'custom') return 'custom';
  return getPackage(id) ? id : '';
}
