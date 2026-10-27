/* Tabs (hash-routed), theme toggle, and boot. */
(function () {
  const TABS = ['about', 'technical', 'policy', 'cv', 'links'];
  const LABELS = { about: 'About', technical: 'Technical Work', policy: 'Policy Work', cv: 'CV', links: 'Links' };

  function tabFromHash(hash) {
    const id = String(hash || '').replace(/^#/, '').split('?')[0];
    return TABS.includes(id) ? id : 'about';
  }

  function showTab(id) {
    // Sections are id="tab-<name>" so the browser never fragment-scrolls to them on load.
    document.querySelectorAll('.tab').forEach(s => { s.hidden = s.id !== `tab-${id}`; });
    document.querySelectorAll('.nav__link').forEach(a => {
      const on = a.dataset.tab === id;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.title = id === 'about' ? 'Coleman Breen' : `Coleman Breen · ${LABELS[id]}`;
  }

  function systemDark() {
    return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function effectiveTheme() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t === 'light' || t === 'dark') return t;
    return systemDark() ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'light' || theme === 'dark') root.setAttribute('data-theme', theme);
    else root.removeAttribute('data-theme');
    try {
      if (theme) localStorage.setItem('theme', theme); else localStorage.removeItem('theme');
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: effectiveTheme() } }));
  }

  function render() {
    const C = window.SITE_CONTENT || {};
    const R = window.SiteRender;
    const put = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
    if (C.about) put('about-body', R.renderAbout(C.about));
    if (C.technical) put('technical-cards', R.renderCards(C.technical, 'technical'));
    if (C.policy) put('policy-cards', R.renderCards(C.policy, 'policy'));
    if (C.links) put('links-list', R.renderLinks(C.links));
  }

  function boot() {
    render();

    document.querySelectorAll('.nav__link').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const hash = a.getAttribute('href');
        history.pushState(null, '', hash);
        showTab(tabFromHash(hash));
      });
    });
    window.addEventListener('popstate', () => showTab(tabFromHash(location.hash)));
    window.addEventListener('hashchange', () => showTab(tabFromHash(location.hash)));
    showTab(tabFromHash(location.hash));

    const toggle = document.querySelector('.theme-toggle');
    if (toggle) toggle.addEventListener('click', () => applyTheme(effectiveTheme() === 'dark' ? 'light' : 'dark'));

    const canvas = document.querySelector('.hero-bg');
    if (canvas && window.Dogwood) window.Dogwood.mount(canvas);
  }

  window.SiteMain = { tabFromHash, showTab, applyTheme, boot };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }
})();
