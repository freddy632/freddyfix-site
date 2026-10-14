/**
 * Pakkesiden:
 *  - Betalingsbryter (50/50 ↔ månedlig) oppdaterer prisene i pakkeoversikten
 *  - Mva-bryter viser beløp inkl./eks. mva.
 *  - Pakkevelger med tillegg og live prisoppsummering
 *  - «Velg …»-knappene og «Gå videre» sender valgene til pristilbudet via URL
 * Tilstanden speiles i URL-en (?betaling=maaned&mva=1) så lenken kan deles.
 */
import { quote, formatNok, normalizeMode, normalizePackage } from './shared/lib/pricing.mjs';
import { paymentModes, packages } from './shared/content/packages.mjs';
import { renderSummary, markIncluded } from './price-summary.js';

const params = new URLSearchParams(location.search);
const state = {
  betaling: normalizeMode(params.get('betaling')),
  inclVat: params.get('mva') === '1',
};

const modeBtns = document.querySelectorAll('[data-mode]');
const vatSwitch = document.querySelector('[data-vat-switch]');
const modeDesc = document.querySelector('[data-mode-desc]');
const form = document.querySelector('[data-configurator]');
const summaryEl = document.querySelector('[data-summary]');

function renderPlans() {
  packages.forEach((p) => {
    const q = quote(p.id, state.betaling, { inclVat: state.inclVat });
    const price = document.querySelector(`[data-price="${p.id}"]`);
    price.querySelector('[data-amount]').textContent = formatNok(q.headline.amount, { suffix: '' });
    price.querySelector('[data-unit]').textContent = q.headline.unit;
    const terms = document.querySelector(`[data-terms="${p.id}"]`);
    terms.textContent =
      q.mode === 'maaned'
        ? `${q.vatNote} · ${formatNok(q.lines[0].amount)} i oppstart, deretter ${formatNok(q.lines[1].amount)}/mnd · 1 års binding`
        : `${q.vatNote} · ${formatNok(q.lines[0].amount)} ved oppstart og ${formatNok(q.lines[1].amount)} ved levering`;
    const choose = document.querySelector(`[data-choose="${p.id}"]`);
    choose.href = choose.href.split('?')[0] + `?pakke=${p.id}&betaling=${state.betaling}`;
  });
  modeBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === state.betaling)));
  modeDesc.textContent = paymentModes.find((m) => m.id === state.betaling).description;
  vatSwitch.checked = state.inclVat;
}

function readConfig() {
  const fd = new FormData(form);
  return {
    pakke: normalizePackage(fd.get('pakke')) || 'vekst',
    betaling: normalizeMode(fd.get('betaling')),
    funksjoner: fd.getAll('funksjoner'),
    inclVat: state.inclVat,
  };
}

function renderConfig() {
  const sel = readConfig();
  markIncluded(form, sel.pakke);
  renderSummary(summaryEl, sel);
  document.querySelectorAll('[data-plan]').forEach((el) => el.classList.toggle('is-selected', el.dataset.plan === sel.pakke));
}

function syncUrl() {
  const u = new URL(location.href);
  state.betaling === 'maaned' ? u.searchParams.set('betaling', 'maaned') : u.searchParams.delete('betaling');
  state.inclVat ? u.searchParams.set('mva', '1') : u.searchParams.delete('mva');
  history.replaceState(null, '', u);
}

function setMode(mode) {
  state.betaling = normalizeMode(mode);
  const radio = form.querySelector(`input[name="betaling"][value="${state.betaling}"]`);
  if (radio) radio.checked = true;
  renderPlans();
  renderConfig();
  syncUrl();
}

modeBtns.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
vatSwitch.addEventListener('change', () => {
  state.inclVat = vatSwitch.checked;
  renderPlans();
  renderConfig();
  syncUrl();
});
form.addEventListener('change', (e) => {
  if (e.target.name === 'betaling') setMode(e.target.value);
  else renderConfig();
});

// Startverdi fra URL
const preset = normalizePackage(params.get('pakke'));
if (preset && preset !== 'custom') {
  const r = form.querySelector(`input[name="pakke"][value="${preset}"]`);
  if (r) r.checked = true;
}
setMode(state.betaling);
