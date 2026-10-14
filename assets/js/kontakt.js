/**
 * Kontaktskjema: validering, ekte innsending til backend, videre til takk-siden.
 * ?emne=mote forhåndsvelger «Book gratis møte» (lenkes fra «Book gratis møte»-knappene).
 */
import { validate, contactFields, serverErrors } from './shared/lib/validation.mjs';
import { buildContactPayload } from './shared/lib/lead.mjs';
import { submitLead } from './shared/lib/api.mjs';
import { readFields, showErrors, showAlert, clearOnInput, busy, submitErrorText } from './form-ui.js';

const form = document.querySelector('[data-contact-form]');
const alertEl = form.querySelector('[data-form-alert]');
const btn = form.querySelector('[data-submit]');
const startedAt = Date.now();
const idFor = (name) => 'k-' + name;

const emne = new URLSearchParams(location.search).get('emne');
if (emne) {
  const sel = form.querySelector('#k-emne');
  if ([...sel.options].some((o) => o.value === emne)) sel.value = emne;
  if (emne === 'mote') {
    const msg = form.querySelector('#k-melding');
    if (!msg.value) msg.placeholder = 'Fortell kort hva du vil snakke om, og når det passer for deg.';
  }
}

clearOnInput(form, idFor);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const d = readFields(form);
  const res = validate(contactFields, d);
  const first = showErrors(form, res.errors, idFor);
  if (!res.valid) {
    showAlert(alertEl, Object.values(res.errors));
    (first || alertEl).focus();
    return;
  }
  showAlert(alertEl, []);
  const sel = form.querySelector('#k-emne');
  d.emne = sel.options[sel.selectedIndex].text;
  const reset = busy(btn);
  const out = await submitLead('kontakt', buildContactPayload(d, { page: location.href, elapsedMs: Date.now() - startedAt }));
  if (out.ok) {
    try {
      sessionStorage.setItem('ff-innsendt', JSON.stringify({ kind: 'kontakt', id: out.id, degraded: !!out.degraded }));
    } catch (err) {
      /* ignorer */
    }
    location.assign(form.dataset.success);
    return;
  }
  reset();
  showAlert(alertEl, [submitErrorText(out.code, serverErrors)]);
  alertEl.focus();
});
