/**
 * Pakker og priser – kilde: Freddy Fix.zip (03-pakker.html, README «Priser (bekreftet)»).
 * Beløp er i hele kroner, eks. mva. IKKE endre uten beskjed fra Freddy Fix.
 *
 * To separate betalingsalternativer (bekreftet av Freddy Fix 14.10.2026):
 *   - «engang»:  engangspris, betales 50 % ved oppstart og 50 % ved levering
 *   - «maaned»:  oppstartsbeløp + fast månedspris med 1 års binding
 */

export const VAT_RATE = 0.25;
export const BINDING_MONTHS = 12;

export const paymentModes = [
  {
    id: 'engang',
    label: 'Engangsbetaling (50/50)',
    short: '50/50',
    description: 'Halvparten ved oppstart, resten ved ferdig levering.',
  },
  {
    id: 'maaned',
    label: 'Månedlig · 1 års binding',
    short: 'Månedlig',
    description: 'Et oppstartsbeløp og deretter fast månedspris med 1 års binding.',
  },
];

export const packages = [
  {
    id: 'starter',
    name: 'Starter',
    oneTime: 9900,
    monthly: 990,
    monthlyStartup: 2475,
    featured: false,
    tagline: 'For nyoppstartede og enkeltpersonforetak som trenger en profesjonell nettside raskt.',
    short: 'Opptil 5 sider, basis SEO, kontaktskjema',
    features: [
      ['Opptil 5 sider', true],
      ['Responsivt design', true],
      ['Kontaktskjema', true],
      ['Google Maps-integrasjon', true],
      ['Basis SEO-oppsett', true],
      ['Google Analytics', true],
      ['3 måneder support', true],
      ['7–10 virkedager levering', true],
      ['Nettbutikk', false],
      ['Egendefinert kode', false],
      ['Avanserte animasjoner', false],
    ],
    cta: 'Velg Starter',
  },
  {
    id: 'vekst',
    name: 'Vekst',
    oneTime: 17900,
    monthly: 1790,
    monthlyStartup: 4475,
    featured: true,
    badge: 'Mest populær',
    tagline: 'For bedrifter som vil vokse på nett. Avansert design, SEO og utvidede funksjoner.',
    short: 'Opptil 10 sider, nettbutikk, komplett SEO',
    features: [
      ['Opptil 10 sider', true],
      ['Premium responsivt design', true],
      ['Avanserte animasjoner', true],
      ['Nettbutikk (opptil 50 produkter)', true],
      ['Komplett SEO-pakke', true],
      ['Booking-system', true],
      ['Google Analytics og Search Console', true],
      ['3 måneder support', true],
      ['7–10 virkedager levering', true],
      ['Opplæring i Wix Studio', true],
      ['Egendefinert Velo-kode', false],
    ],
    cta: 'Velg Vekst',
  },
  {
    id: 'premium',
    name: 'Premium',
    oneTime: 29900,
    monthly: 2990,
    monthlyStartup: 7475,
    featured: false,
    tagline: 'Full bedriftspakke med egendefinert funksjonalitet, integrasjoner og prioritert support.',
    short: 'Ubegrenset antall sider, egendefinert kode, integrasjoner',
    features: [
      ['Ubegrenset antall sider', true],
      ['Skreddersydd premium-design', true],
      ['Egendefinert Velo-kode', true],
      ['Komplett nettbutikk', true],
      ['Avanserte integrasjoner (CRM, API)', true],
      ['Memberzone / bruker-innlogging', true],
      ['Komplett SEO-strategi', true],
      ['3 måneder prioritert support', true],
      ['7–10 virkedager levering', true],
      ['Opplæring og dokumentasjon', true],
      ['Månedlig ytelsesrapport', true],
    ],
    cta: 'Velg Premium',
  },
];

/** «Vet ikke ennå» – valg i pristilbudsskjemaet (fra ZIP). Har ingen pris. */
export const unsurePackage = {
  id: 'custom',
  name: 'Vet ikke ennå',
  short: 'Vi anbefaler riktig løsning basert på behovene dine',
};

/** Sammenligningstabell (03-pakker.html). Verdier: true = ✓, false = –, streng = tekst. */
export const comparison = [
  ['Antall sider', 'Opptil 5', 'Opptil 10', 'Ubegrenset'],
  ['Responsivt design', true, true, true],
  ['SEO-grunnoppsett', true, true, true],
  ['Komplett SEO-pakke', false, true, true],
  ['Nettbutikk', false, 'Opptil 50 produkter', 'Ubegrenset'],
  ['Egendefinert kode (Velo)', false, false, true],
  ['Avanserte animasjoner', false, true, true],
  ['Booking-system', false, true, true],
  ['Memberzone', false, false, true],
  ['Oppfølging etter lansering', '3 mnd', '3 mnd', '3 mnd prioritert'],
  ['Betaling', '50/50 eller månedlig', '50/50 eller månedlig', '50/50 eller månedlig'],
  ['Leveringstid', '7–10 virkedager', '7–10 virkedager', '7–10 virkedager'],
];

/** Inkludert i alle pakker (07-pristilbud.html sidebar). */
export const alwaysIncluded = [
  '3 måneder gratis oppfølging',
  '50/50 betaling eller månedlig med 1 års binding',
  '7–10 virkedager levering',
  'Responsivt design for alle enheter',
  'SEO-grunnoppsett',
  'Opplæring i å redigere siden',
];

/**
 * Tillegg (id-er fra options.mjs `features`) som allerede er inkludert i hver
 * pakke, utledet av pakkeinnholdet over. Brukes til å merke «inkludert i pakken»
 * i pakkevelgeren og pristilbudet.
 */
export const includedFeatures = {
  starter: ['kart'],
  vekst: ['nettbutikk', 'booking', 'kart'],
  premium: ['nettbutikk', 'booking', 'login', 'kart'],
};
