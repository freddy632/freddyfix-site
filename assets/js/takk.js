/** Takk-siden: viser referanse-id fra innsendingen og ev. varsel om forsinket videresending. */
let info = null;
try {
  info = JSON.parse(sessionStorage.getItem('ff-innsendt') || 'null');
  sessionStorage.removeItem('ff-innsendt');
} catch (e) {
  /* ignorer */
}
if (info && info.id) {
  document.querySelector('[data-ref-id]').textContent = info.id.slice(0, 8).toUpperCase();
  document.querySelector('[data-ref]').hidden = false;
}
if (info && info.degraded) document.querySelector('[data-degraded]').hidden = false;
