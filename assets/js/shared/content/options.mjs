/**
 * Valglister brukt i skjemaene (kilde: 07-pristilbud.html og 06-kontakt.html i ZIP).
 * Verdiene (`value`) må samsvare med backend/leads.jsw (LABELS) – ikke endre uten
 * å oppdatere backend.
 */

export const industries = [
  ['handel', 'Handel og detaljhandel'],
  ['restaurant', 'Restaurant og servering'],
  ['hotell', 'Hotell og overnatting'],
  ['haandverk', 'Håndverk og bygg'],
  ['helse', 'Helse og velvære'],
  ['teknologi', 'Teknologi og IT'],
  ['konsulent', 'Konsulent og rådgivning'],
  ['utdanning', 'Utdanning og kurs'],
  ['kultur', 'Kultur og underholdning'],
  ['annet', 'Annet'],
];

export const goals = [
  ['leads', 'Flere henvendelser og leads', 'Kontaktskjema, telefon, booking'],
  ['salg', 'Selge produkter/tjenester online', 'Nettbutikk og e-handel'],
  ['merkevare', 'Styrke merkevare og tillit', 'Profesjonell presentasjon'],
  ['synlighet', 'Bli funnet på Google (SEO)', 'Organisk trafikk og synlighet'],
];

/**
 * Funksjoner/tillegg. Brukes både som «tillegg» i pakkevelgeren og som
 * «Hvilke funksjoner ønsker du?» i pristilbudet. Tilleggene har ingen fast
 * pris i grunnlaget – de prises i tilbudet.
 */
export const features = [
  ['nettbutikk', 'Nettbutikk'],
  ['booking', 'Booking-system'],
  ['blogg', 'Blogg'],
  ['flersprak', 'Flerspråklig'],
  ['login', 'Bruker-innlogging'],
  ['kalkulator', 'Priskalkulator'],
  ['chat', 'Live chat'],
  ['kart', 'Google Maps'],
];

export const pageCounts = [
  ['1-5', '1–5 sider'],
  ['6-10', '6–10 sider'],
  ['11-20', '11–20 sider'],
  ['20+', 'Mer enn 20 sider'],
  ['vet-ikke', 'Vet ikke'],
];

/** Dynamisk felt: vises når nettbutikk er valgt eller målet er salg. */
export const productCounts = [
  ['1-50', 'Opptil 50 produkter'],
  ['51-200', '51–200 produkter'],
  ['200+', 'Mer enn 200 produkter'],
  ['vet-ikke', 'Vet ikke ennå'],
];

export const bestTimes = [
  ['morgen', 'Morgen (08–10)'],
  ['formiddag', 'Formiddag (10–12)'],
  ['ettermiddag', 'Ettermiddag (13–16)'],
  ['fleksibelt', 'Fleksibelt'],
];

/** Kontaktskjemaets «Hva er du interessert i?» (06-kontakt.html). */
export const contactServices = [
  ['nettside', 'Nettside-design'],
  ['nettbutikk', 'Nettbutikk'],
  ['wix-studio', 'Wix Studio-utvikling'],
  ['seo', 'SEO og GEO'],
  ['annonsering', 'Digital annonsering'],
  ['strategi', 'Digital strategi'],
  ['vedlikehold', 'Vedlikehold og support'],
  ['annet', 'Annet'],
];

export function labelOf(list, value) {
  const hit = list.find((o) => o[0] === value);
  return hit ? hit[1] : '';
}
