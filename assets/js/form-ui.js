/**
 * Felles skjema-UI: lese verdier, vise/fjerne feil på felt, samlet feilboks.
 * Brukes av pristilbud.js og kontakt.js.
 */

/** Leser alle navngitte felt i en container til et objekt. Avkrysningsbokser -> array. */
export function readFields(root) {
  const data = {};
  root.querySelectorAll('input[name], select[name], textarea[name]').forEach((el) => {
    if (el.type === 'checkbox') {
      if (!data[el.name]) data[el.name] = [];
      if (el.checked) data[el.name].push(el.value);
    } else if (el.type === 'radio') {
      if (el.checked) data[el.name] = el.value;
      else if (!(el.name in data)) data[el.name] = '';
    } else {
      data[el.name] = el.value;
    }
  });
  return data;
}

/** Skriver verdier tilbake (gjenoppretting fra sessionStorage / URL). */
export function writeFields(root, data) {
  Object.entries(data || {}).forEach(([name, value]) => {
    root.querySelectorAll(`[name="${CSS.escape(name)}"]`).forEach((el) => {
      if (el.type === 'checkbox') el.checked = Array.isArray(value) && value.includes(el.value);
      else if (el.type === 'radio') el.checked = el.value === value;
      else if (typeof value === 'string' && el.name !== 'website_url') el.value = value;
    });
  });
}

/**
 * Viser feil per felt. `idFor(name)` gir id-prefikset til feltet (for kontaktskjemaets «k-»).
 * Returnerer første ugyldige element (for fokus).
 */
export function showErrors(root, errors, idFor = (n) => n) {
  let first = null;
  root.querySelectorAll('[data-error-for]').forEach((p) => (p.textContent = ''));
  root.querySelectorAll('[aria-invalid="true"]').forEach((el) => el.removeAttribute('aria-invalid'));
  root.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));

  Object.entries(errors).forEach(([name, msg]) => {
    const id = idFor(name);
    const errEl = root.querySelector(`[data-error-for="${id}"]`);
    if (errEl) errEl.textContent = msg;
    const group = root.querySelector(`[data-group="${name}"]`);
    if (group) {
      group.classList.add('is-invalid');
      const firstRadio = group.querySelector('input');
      if (!first) first = firstRadio;
      return;
    }
    const field = root.querySelector('#' + CSS.escape(id));
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      if (!first) first = field;
    }
  });
  return first;
}

/** Samlet feilboks øverst i skjemaet. Tom liste skjuler boksen. */
export function showAlert(alertEl, messages, { title = 'Rett opp følgende:' } = {}) {
  if (!alertEl) return;
  if (!messages || !messages.length) {
    alertEl.innerHTML = '';
    return;
  }
  if (messages.length === 1) {
    alertEl.textContent = messages[0];
  } else {
    alertEl.innerHTML = '';
    const p = document.createElement('p');
    p.textContent = title;
    const ul = document.createElement('ul');
    messages.forEach((m) => {
      const li = document.createElement('li');
      li.textContent = m;
      ul.appendChild(li);
    });
    alertEl.append(p, ul);
  }
}

/** Fjerner feilmarkering på et felt så snart brukeren retter det. */
export function clearOnInput(root, idFor = (n) => n) {
  root.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.name) return;
    const errEl = root.querySelector(`[data-error-for="${idFor(el.name)}"]`);
    if (errEl) errEl.textContent = '';
    el.removeAttribute('aria-invalid');
    const group = el.closest('[data-group]');
    if (group) group.classList.remove('is-invalid');
  });
}

/** Setter knapp i «sender»-tilstand og returnerer en funksjon som tilbakestiller. */
export function busy(btn, label = 'Sender …') {
  const html = btn.innerHTML;
  btn.disabled = true;
  btn.setAttribute('aria-busy', 'true');
  btn.textContent = label;
  return () => {
    btn.disabled = false;
    btn.removeAttribute('aria-busy');
    btn.innerHTML = html;
  };
}

/** Feiltekst for innsendingsfeil, med WhatsApp som reserve. */
export function submitErrorText(code, serverErrors) {
  if (serverErrors[code]) return serverErrors[code];
  if (code === 'network') return 'Fikk ikke kontakt med serveren. Sjekk nettforbindelsen og prøv igjen.';
  if (code === 'timeout') return 'Serveren brukte for lang tid på å svare. Prøv igjen om litt.';
  if (code === 'not_configured') return 'Skjemaet er ikke koblet til en server i denne forhåndsvisningen. Send oss heller en melding på WhatsApp.';
  return 'Noe gikk galt under innsendingen. Prøv igjen, eller send oss en melding på WhatsApp.';
}
