/**
 * Rendrer prisoppsummering (brukes av pakkevelgeren og pristilbudet).
 */
import { quote, formatNok } from './shared/lib/pricing.mjs';
import { features, labelOf } from './shared/content/options.mjs';
import { includedFeatures } from './shared/content/packages.mjs';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/**
 * @param {HTMLElement} el
 * @param {{ pakke: string, betaling: string, funksjoner?: string[], inclVat?: boolean }} sel
 */
export function renderSummary(el, sel) {
  if (sel.pakke === 'custom') {
    el.innerHTML = `<p class="small">Du har valgt <strong>Vet ikke ennå</strong>. Vi anbefaler riktig pakke ut fra behovene dine og sender en konkret pris i tilbudet.</p>`;
    return;
  }
  const q = quote(sel.pakke, sel.betaling, { inclVat: !!sel.inclVat });
  if (!q) {
    el.innerHTML = '<p class="small muted">Velg pakke for å se prisen.</p>';
    return;
  }
  const included = includedFeatures[sel.pakke] || [];
  const chosen = sel.funksjoner || [];
  const inc = chosen.filter((f) => included.includes(f));
  const extra = chosen.filter((f) => !included.includes(f));
  const unit = (l) => (l.unit === 'kr/mnd' ? formatNok(l.amount) + '/mnd' : formatNok(l.amount));
  const total = q.mode === 'engang' ? `<div class="summary__line summary__line--total"><dt>Totalt</dt><dd>${formatNok(q.headline.amount)}</dd></div>` : '';

  el.innerHTML = `
    <p class="small"><strong>${esc(q.name)}</strong> · ${q.mode === 'maaned' ? 'Månedlig, 1 års binding' : 'Engangsbetaling 50/50'}</p>
    <dl class="summary__lines">
      ${q.lines.map((l) => `<div class="summary__line"><dt>${esc(l.label)}</dt><dd>${unit(l)}</dd></div>`).join('')}
      ${total}
    </dl>
    <p class="summary__note">${esc(q.vatNote)}${q.mode === 'maaned' ? ' · Månedsprisen gjelder i bindingstiden på 12 måneder.' : ''}</p>
    ${inc.length ? `<p class="xs muted">Inkludert i pakken:</p><ul class="tags" role="list">${inc.map((f) => `<li>${esc(labelOf(features, f))}</li>`).join('')}</ul>` : ''}
    ${extra.length ? `<p class="xs muted" style="margin-top:var(--space-3)">Tillegg (prises i tilbudet):</p><ul class="tags" role="list">${extra.map((f) => `<li>${esc(labelOf(features, f))}</li>`).join('')}</ul>` : ''}
  `;
}

/** Merker «inkludert i pakken» på tilleggsvalg. */
export function markIncluded(root, pakke) {
  const included = includedFeatures[pakke] || [];
  root.querySelectorAll('[data-feature]').forEach((label) => {
    label.dataset.included = String(included.includes(label.dataset.feature));
  });
}
