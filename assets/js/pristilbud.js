/**
 * Flertrinns pristilbud (4 steg: bedrift → prosjekt → kontakt → oppsummering).
 *
 *  - Validering per steg (shared/lib/validation.mjs), feil knyttes til feltene
 *  - Tilbake/neste uten å miste data; utkast lagres i sessionStorage
 *  - Forhåndsvalg fra URL (?pakke=vekst&betaling=maaned&funksjoner=blogg&tjeneste=seo-geo)
 *  - Dynamiske felt: betalingsmåte skjules ved «Vet ikke ennå»,
 *    antall produkter vises ved nettbutikk / mål «salg»
 *  - Ekte innsending til backend; videre til takk-siden først når backend har bekreftet
 */
import { validate, quoteSteps, todayIso, serverErrors, normalizeUrl } from './shared/lib/validation.mjs';
import { buildQuotePayload } from './shared/lib/lead.mjs';
import { submitLead } from './shared/lib/api.mjs';
import { normalizeMode, normalizePackage, formatNok, getPackage } from './shared/lib/pricing.mjs';
import { industries, goals, features, pageCounts, productCounts, bestTimes, labelOf } from './shared/content/options.mjs';
import { paymentModes } from './shared/content/packages.mjs';
import { services } from './shared/content/services.mjs';
import { readFields, writeFields, showErrors, showAlert, clearOnInput, busy, submitErrorText } from './form-ui.js';
import { renderSummary, markIncluded } from './price-summary.js';

const DRAFT_KEY = 'ff-pristilbud-utkast';
const STEP_NAMES = ['Om bedriften', 'Prosjektet', 'Kontaktinfo', 'Oppsummering'];
const LAST = STEP_NAMES.length;

const form = document.querySelector('[data-quote-form]');
const panels = [...form.querySelectorAll('[data-step]')];
const progress = form.querySelector('[data-progress]');
const progressStatus = form.querySelector('[data-progress-status]');
const alertEl = form.querySelector('[data-form-alert]');
const btnPrev = form.querySelector('[data-prev]');
const btnNext = form.querySelector('[data-next]');
const btnSubmit = form.querySelector('[data-submit]');
const summaryEl = document.querySelector('[data-quote-summary]');
const startedAt = Date.now();
let step = 1;

// ---------- Tilstand ----------
const data = () => readFields(form);

function saveDraft() {
  try {
    const d = data();
    delete d.website_url;
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ d, step }));
  } catch (e) {
    /* privat modus o.l. */
  }
}

function loadDraft() {
  try {
    return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
  } catch (e) {
    return null;
  }
}

function applyUrlPresets() {
  const p = new URLSearchParams(location.search);
  const preset = {};
  const pakke = normalizePackage(p.get('pakke'));
  if (pakke) preset.pakke = pakke;
  if (p.get('betaling')) preset.betaling = normalizeMode(p.get('betaling'));
  const f = p.getAll('funksjoner').filter((id) => features.some((x) => x[0] === id));
  if (f.length) preset.funksjoner = f;
  const tj = services.find((s) => s.id === p.get('tjeneste'));
  if (tj) {
    preset.tjeneste = tj.id;
    if (tj.id === 'nettbutikk') preset.funksjoner = [...new Set([...(preset.funksjoner || []), 'nettbutikk'])];
  }
  return preset;
}

// ---------- Dynamiske felt og oppsummering ----------
function updateDynamic() {
  const d = data();
  const custom = d.pakke === 'custom';
  form.querySelector('[data-payment-field]').hidden = custom;
  const shop = (d.funksjoner || []).includes('nettbutikk') || d.goal === 'salg';
  form.querySelector('[data-products-field]').hidden = !shop;
  markIncluded(form, d.pakke);
  // Vis riktig pris (engang/mnd) på pakkevalgene
  const mode = normalizeMode(d.betaling);
  form.querySelectorAll('[data-pkg-price]').forEach((el) => {
    const pkg = getPackage(el.dataset.pkgPrice);
    el.textContent = mode === 'maaned' ? `${formatNok(pkg.monthly)}/mnd` : formatNok(pkg.oneTime);
  });
  if (d.pakke) renderSummary(summaryEl, { pakke: d.pakke, betaling: mode, funksjoner: d.funksjoner });
  const count = form.querySelector('[data-count-for="beskrivelse"]');
  if (count) count.textContent = String((d.beskrivelse || '').length);
}

// ---------- Steg ----------
function show(n, { focus = true } = {}) {
  step = Math.min(Math.max(1, n), LAST);
  panels.forEach((p) => (p.hidden = Number(p.dataset.step) !== step));
  form.querySelectorAll('[data-step-indicator]').forEach((li) => {
    const i = Number(li.dataset.stepIndicator);
    li.dataset.state = i < step ? 'done' : i === step ? 'current' : 'todo';
    if (i === step) li.setAttribute('aria-current', 'step');
    else li.removeAttribute('aria-current');
  });
  progressStatus.textContent = `Steg ${step} av ${LAST}: ${STEP_NAMES[step - 1]}`;
  btnPrev.hidden = step === 1;
  btnNext.hidden = step === LAST;
  btnSubmit.hidden = step !== LAST;
  if (step === LAST) renderReview();
  showAlert(alertEl, []);
  saveDraft();
  if (focus) {
    const h = form.querySelector(`[data-step="${step}"] h2`);
    form.scrollIntoView({ block: 'start' });
    h && h.focus({ preventScroll: true });
  }
}

function idFor(name) {
  return name;
}

function validateStep(n) {
  const fields = quoteSteps[n] || [];
  const res = validate(fields, data());
  const first = showErrors(form.querySelector(`[data-step="${n}"]`), res.errors, idFor);
  if (!res.valid) {
    showAlert(alertEl, Object.values(res.errors));
    (first || alertEl).focus();
  }
  return res.valid;
}

// ---------- Oppsummering ----------
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function renderReview() {
  const d = data();
  const pkg = getPackage(d.pakke);
  const shop = (d.funksjoner || []).includes('nettbutikk') || d.goal === 'salg';
  const groups = [
    [1, 'Om bedriften', [
      ['Bedrift', d.bedrift],
      ['Bransje', labelOf(industries, d.bransje)],
      ['Nettside i dag', normalizeUrl(d.nettside) || 'Ingen'],
      ['Viktigste mål', labelOf(goals, d.goal)],
    ]],
    [2, 'Prosjektet', [
      ['Pakke', pkg ? `${pkg.name} – ${formatNok(pkg.oneTime)} eks. mva.` : 'Vet ikke ennå'],
      ['Betaling', pkg ? (paymentModes.find((m) => m.id === normalizeMode(d.betaling)) || {}).label : ''],
      ['Funksjoner', (d.funksjoner || []).map((f) => labelOf(features, f)).join(', ') || 'Ingen valgt'],
      ['Antall produkter', shop ? labelOf(productCounts, d.produkter) : ''],
      ['Antall sider', labelOf(pageCounts, d.sider)],
      ['Ønsket ferdig', d.frist ? new Date(d.frist + 'T12:00').toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Ikke oppgitt'],
      ['Beskrivelse', d.beskrivelse],
      ['Inspirasjon', d.inspirasjon],
    ]],
    [3, 'Kontaktinfo', [
      ['Navn', `${d.fornavn} ${d.etternavn}`.trim()],
      ['E-post', d.epost],
      ['Mobil / WhatsApp', d.telefon || 'Ikke oppgitt'],
      ['Beste tid', labelOf(bestTimes, d.best_tid)],
    ]],
  ];
  form.querySelector('[data-review]').innerHTML = groups
    .map(([n, title, rows]) => `<div class="review__group">
      <div class="review__head"><h3>${esc(title)}</h3><button type="button" class="btn btn--ghost btn--sm" data-goto="${n}">Endre<span class="sr-only"> ${esc(title.toLowerCase())}</span></button></div>
      <dl>${rows.filter(([, v]) => v).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
    </div>`)
    .join('');
}

// ---------- Innsending ----------
async function submit() {
  // Valider alle steg på nytt (i tilfelle noe er endret)
  for (let n = 1; n < LAST; n++) {
    const res = validate(quoteSteps[n], data());
    if (!res.valid) {
      show(n);
      validateStep(n);
      return;
    }
  }
  const payload = buildQuotePayload(data(), { page: location.href, elapsedMs: Date.now() - startedAt });
  const reset = busy(btnSubmit);
  const res = await submitLead('pristilbud', payload);
  if (res.ok) {
    try {
      sessionStorage.removeItem(DRAFT_KEY);
      sessionStorage.setItem('ff-innsendt', JSON.stringify({ kind: 'pristilbud', id: res.id, degraded: !!res.degraded }));
    } catch (e) {
      /* ignorer */
    }
    location.assign(form.dataset.success);
    return;
  }
  reset();
  showAlert(alertEl, [submitErrorText(res.code, serverErrors)]);
  alertEl.focus();
}

// ---------- Oppstart ----------
function init() {
  form.classList.add('is-enhanced');
  progress.hidden = false;
  form.querySelector('#frist').min = todayIso();

  const draft = loadDraft();
  const preset = applyUrlPresets();
  if (draft && draft.d) writeFields(form, draft.d);
  writeFields(form, preset); // URL-valg vinner over utkast
  if (preset.tjeneste) {
    let hidden = form.querySelector('input[name="tjeneste"]');
    if (!hidden) {
      hidden = Object.assign(document.createElement('input'), { type: 'hidden', name: 'tjeneste' });
      form.appendChild(hidden);
    }
    hidden.value = preset.tjeneste;
  }

  clearOnInput(form, idFor);
  form.addEventListener('input', () => {
    updateDynamic();
    saveDraft();
  });
  form.addEventListener('change', () => {
    updateDynamic();
    saveDraft();
  });
  btnNext.addEventListener('click', () => validateStep(step) && show(step + 1));
  btnPrev.addEventListener('click', () => show(step - 1));
  form.addEventListener('click', (e) => {
    const go = e.target.closest('[data-goto]');
    if (go) show(Number(go.dataset.goto));
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (step < LAST) {
      // Enter i et felt = neste steg
      if (validateStep(step)) show(step + 1);
      return;
    }
    submit();
  });

  updateDynamic();
  // Gjenoppta på lagret steg, men aldri lenger enn første ugyldige steg
  let resume = draft && draft.step ? Math.min(draft.step, LAST) : 1;
  for (let n = 1; n < resume; n++) {
    if (!validate(quoteSteps[n], data()).valid) {
      resume = n;
      break;
    }
  }
  show(resume, { focus: false });
}

init();
