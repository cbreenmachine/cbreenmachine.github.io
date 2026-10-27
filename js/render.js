/* Pure render functions: content in, HTML string out. No DOM access, so
   these also run under Node for tests. */
(function () {
  const LABEL = { technical: 'Technical', policy: 'Policy' };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function renderCard(card, kind) {
    const e = escapeHtml;
    const cls = `card card--${kind}${card.image ? '' : ' card--text'}`;
    const img = card.image
      ? `<img class="card__image" src="${e(card.image)}" alt="${e(card.imageAlt || '')}" loading="lazy">`
      : '';
    return `<a class="${cls}" href="${e(card.url)}" target="_blank" rel="noopener">` +
      img +
      `<span class="card__tag">${LABEL[kind] || e(kind)} · ${e(card.year)}</span>` +
      `<h3 class="card__title">${e(card.title)}</h3>` +
      `<p class="card__desc">${e(card.description)}</p>` +
      `<span class="card__venue">${e(card.venue)}</span>` +
      `</a>`;
  }

  function renderCards(cards, kind) {
    return `<div class="cards">${cards.map(c => renderCard(c, kind)).join('')}</div>`;
  }

  function host(url) {
    try { return new URL(url).host.replace(/^www\./, ''); } catch (_) { return url; }
  }

  function renderLinks(links) {
    const e = escapeHtml;
    const items = links.filter(l => !l.placeholder).map(l =>
      `<li><a href="${e(l.url)}" target="_blank" rel="noopener">${e(l.title)}</a> ` +
      `<span class="links__url">${e(host(l.url))}</span>` +
      (l.note ? ` <span class="links__note">${e(l.note)}</span>` : '') +
      `</li>`);
    return `<ul class="links">${items.join('')}</ul>`;
  }

  function renderAbout(about) {
    return about.paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  window.SiteRender = { escapeHtml, renderCard, renderCards, renderLinks, renderAbout };
  if (typeof module !== 'undefined') module.exports = window.SiteRender;
})();
