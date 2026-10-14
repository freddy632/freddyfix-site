/**
 * Tjenester – kilde: 02-tjenester.html (ZIP) + markedsføringstjenestene på
 * Wix-referansen («Slik hjelper vi deg»). `id` brukes som ankerlenke
 * (tjenester/#<id>) fra forside, footer og meny.
 */

export const services = [
  {
    id: 'nettside-design',
    icon: 'palette',
    label: 'Nettside-design',
    title: 'Nettside-design',
    heading: 'En nettside som skiller seg ut og selger',
    short: 'Skreddersydd design som gjenspeiler merkevaren din. Responsivt og mobiltilpasset fra dag én.',
    text: 'Vi designer skreddersydde nettsider som ser profesjonelle ut, laster raskt og gjør besøkende til kunder. Hvert design er unikt og bygget rundt merkevaren din.',
    points: ['Unikt design – ingen ferdigmaler', 'Responsivt og mobiltilpasset', 'Rask lastetid og god brukeropplevelse', 'Struktur som leder til kontakt og salg', 'Integrert kontaktskjema og tydelige handlingsknapper'],
  },
  {
    id: 'wix-studio',
    icon: 'code',
    label: 'Wix Studio',
    title: 'Wix Studio-utvikling',
    heading: 'Avansert Wix Studio-utvikling',
    short: 'Som Wix Legend Partner bygger vi avanserte Wix Studio-løsninger med egendefinert kode og animasjoner.',
    text: 'Vi jobber kun med Wix. Det gir dyp kompetanse i Wix Studio, og vi bygger løsninger med egendefinert kode (Velo), databaser og avanserte interaksjoner når prosjektet trenger det.',
    points: ['Egendefinert kode med Velo (JavaScript)', 'Avanserte animasjoner og interaksjoner', 'Integrasjon med tredjepartstjenester', 'Medlemsområde og bruker-innlogging', 'Dashbord og databaser'],
  },
  {
    id: 'seo-geo',
    icon: 'search',
    label: 'SEO og GEO',
    title: 'SEO og GEO',
    heading: 'Bli funnet – på Google og i AI-søk',
    short: 'Teknisk SEO, lokal synlighet og innhold som både søkemotorer og AI-baserte søk forstår.',
    text: 'Vi optimaliserer nettsiden for søkemotorer fra dag én. Vi kombinerer teknisk SEO med lokal optimalisering (Google Business Profile, lokale søk) og tydelig, faktabasert innhold som også AI-baserte søketjenester kan gjengi riktig.',
    points: ['Teknisk SEO-gjennomgang og retting', 'Søkeordsanalyse for bransje og område', 'Meta-titler, beskrivelser og strukturert data (Schema)', 'Google Business Profile og Search Console', 'Hastighet og Core Web Vitals'],
  },
  {
    id: 'nettbutikk',
    icon: 'cart',
    label: 'Nettbutikk',
    title: 'Nettbutikk',
    heading: 'Selg produkter og tjenester på nett',
    short: 'Nettbutikk med Vipps, Stripe og kortbetaling – klar til å ta imot bestillinger fra dag én.',
    text: 'Vi bygger komplette nettbutikker med betalingsløsning, produktoppsett og et design som gjør det enkelt å handle.',
    points: ['Vipps, Stripe og kortbetaling', 'Produktkatalog og kategorier', 'Ordrehåndtering og varsler', 'Frakt og lagerstyring', 'Optimalisert handlekurv og kasse'],
  },
  {
    id: 'annonsering',
    icon: 'megaphone',
    label: 'Annonsering',
    title: 'Annonsering og vekst',
    heading: 'Google Ads og Meta Ads med retning',
    short: 'Google- og Meta-kampanjer som tar utgangspunkt i tjenestene, målene og markedet ditt.',
    text: 'Vi kobler annonsering, landingssider og oppfølging i en gjennomtenkt plan. Målet er relevante henvendelser – ikke bare flere klikk.',
    points: ['Google-annonsering (søk, display, shopping)', 'Meta og sosiale medier (Facebook og Instagram)', 'Remarketing med avklaringer rundt samtykke og sporing', 'Landingssider med tydelig tilbud og neste steg', 'Konverteringssporing og månedlig rapportering'],
  },
  {
    id: 'digital-strategi',
    icon: 'compass',
    label: 'Digital strategi',
    title: 'Digital strategi',
    heading: 'Én plan for nettside, synlighet og vekst',
    short: 'Fra målgruppe og posisjonering til kanalvalg og innholdsplan – samlet i én plan.',
    text: 'En god nettside er starten – ikke målet. Vi hjelper deg med en tydelig digital strategi som samler nettside, SEO, annonsering og innhold mot konkrete mål.',
    points: ['Målgruppe- og konkurrentanalyse', 'Kanalstrategi (organisk og betalt)', 'Innholdsplan og redaksjonell kalender', 'Mål og måltall (KPI-er)', 'Faste strategigjennomganger'],
  },
  {
    id: 'vedlikehold',
    icon: 'wrench',
    label: 'Vedlikehold',
    title: 'Vedlikehold og oppfølging',
    heading: '3 måneder gratis oppfølging',
    short: 'Vi forsvinner ikke etter lansering. Alle pakker har 3 måneder gratis oppfølging.',
    text: 'Alle pakker inkluderer 3 måneder gratis support, oppdateringer og mindre justeringer etter lansering. Større endringer faktureres etter timepris.',
    points: ['3 måneder gratis support', 'Innholdsoppdateringer og mindre justeringer', 'Teknisk support og feilretting', 'Overvåking av ytelse', 'Råd om videre vekst'],
  },
];

/** Tilleggstjenester (02-tjenester.html «Andre tjenester vi tilbyr»). */
export const extraServices = [
  { icon: 'target', title: 'Landingssider', text: 'Landingssider for kampanjer og leadgenerering, med ett tydelig budskap og neste steg.' },
  { icon: 'users', title: 'Sosiale medier', text: 'Oppsett og innholdsstrategi for LinkedIn, Instagram og Facebook – tilpasset bransjen din.' },
  { icon: 'link', title: 'Integrasjoner', text: 'Kobling til booking-systemer, CRM, nyhetsbrev og andre verktøy du bruker.' },
  { icon: 'pen', title: 'Innhold og tekst', text: 'Tekster og innhold som engasjerer leserne og er skrevet for å bli funnet.' },
  { icon: 'chart', title: 'Analyse og rapportering', text: 'Google Analytics 4, Search Console og rapporter om trafikk og henvendelser.' },
  { icon: 'tag', title: 'Merkevare og logo', text: 'Enkel merkevarebygging og logodesign som passer til den nye nettsiden.' },
];
