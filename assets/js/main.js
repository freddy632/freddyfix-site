/**
 * Felles for alle sider: mobilmeny.
 * - Lukkes med Escape, ved klikk utenfor og når skjermen blir bred.
 * - Fokus flyttes tilbake til knappen ved lukking med Escape.
 */
const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-nav-toggle]');

if (header && toggle) {
  const setOpen = (open) => {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.sr-only').textContent = open ? 'Lukk meny' : 'Meny';
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => e.matches && setOpen(false));
}
