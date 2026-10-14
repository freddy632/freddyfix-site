/**
 * Sentral nettstedsinformasjon: navn, kontakt, navigasjon og innholdsflagg.
 * Alt som vises flere steder (header, footer, strukturert data) hentes herfra.
 *
 * FAKTA-REGEL: Her står kun opplysninger som er bekreftet av Freddy Fix.
 * Uverifiserte tall, kundeuttalelser og referanser skal IKKE legges inn her
 * før de er godkjent (se docs/INNHOLD.md).
 */

export const site = {
  name: 'Freddy Fix',
  tagline: 'Nettsiden først. Vekst etterpå.',
  slogan: 'Der gode ideer blir digitale realiteter.',
  description:
    'Freddy Fix er et norsk web- og markedsføringsbyrå i Valdres som lager komplette nettsider i Wix Studio – og hjelper deg videre med SEO, annonsering og vekst.',
  locale: 'nb_NO',
  lang: 'no',
  location: {
    region: 'Valdres',
    county: 'Innlandet',
    country: 'Norge',
    countryCode: 'NO',
    label: 'Valdres, Innlandet · Norge',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Valdres%2C+Innlandet',
  },
  hours: { label: 'Mandag–fredag: 08:00–17:00', note: 'Responstid i helger kan variere' },
  contact: {
    whatsappUrl: 'https://wa.me/4790643906',
    phone: '+47 906 43 906',
    email: 'freddy@freddyfix.com',
    // ZIP-kravet: telefon og e-post skal ikke vises som tekst på siden.
    // Wix-referansen viser dem i footeren – slå på her når det er bestemt.
    showPhone: false,
    showEmail: false,
  },
  partner: {
    status: 'Wix Legend Partner',
    partnerSince: 2020,
    legendSince: 2022,
  },
  // Plassholdere for kundeuttalelser og referanser (ekte innhold kommer senere).
  showPlaceholders: true,
};

/** Hovednavigasjon. `key` matcher `page.nav` i sidedefinisjonene. */
export const mainNav = [
  { key: 'tjenester', label: 'Tjenester', href: 'tjenester/' },
  { key: 'pakker', label: 'Pakker', href: 'pakker/' },
  { key: 'referanser', label: 'Prosjekter', href: 'referanser/' },
  { key: 'prosess', label: 'Prosess', href: 'prosess/' },
  { key: 'om-oss', label: 'Om oss', href: 'om-oss/' },
  { key: 'kontakt', label: 'Kontakt', href: 'kontakt/' },
];

export const primaryCta = { key: 'pristilbud', label: 'Få pristilbud', href: 'pristilbud/' };

export const footerNav = {
  explore: [
    { label: 'Forside', href: '' },
    { label: 'Pakker og priser', href: 'pakker/' },
    { label: 'Prosjekter', href: 'referanser/' },
    { label: 'Prosess', href: 'prosess/' },
    { label: 'Om oss', href: 'om-oss/' },
    { label: 'Kontakt', href: 'kontakt/' },
    { label: 'Få pristilbud', href: 'pristilbud/' },
  ],
  services: [
    { label: 'Nettsider og nettbutikk', href: 'tjenester/#nettside-design' },
    { label: 'Wix Studio-utvikling', href: 'tjenester/#wix-studio' },
    { label: 'SEO og GEO', href: 'tjenester/#seo-geo' },
    { label: 'Annonsering og vekst', href: 'tjenester/#annonsering' },
    { label: 'Strategisk rådgivning', href: 'tjenester/#digital-strategi' },
  ],
  legal: [
    { label: 'Personvern', href: 'personvern/' },
    { label: 'Tilgjengelighet', href: 'tilgjengelighet/' },
  ],
};
