/* Shared Indonesian/English preferences for the home page, archive and reader. */
(() => {
  'use strict';
  const valid = (value) => value === 'id' || value === 'en';
  let language = 'id';
  try { const saved = localStorage.getItem('prefLang'); if (valid(saved)) language = saved; } catch { /* Storage is optional. */ }
  const requested = new URL(location.href).searchParams.get('lang');
  if (valid(requested)) language = requested;
  const originalLinks = new WeakMap();

  function translate(root = document) {
    root.querySelectorAll('[data-id][data-en]').forEach((element) => {
      if (element.hasAttribute('data-language-text')) element.textContent = element.getAttribute(`data-${language}`);
      else element.innerHTML = element.getAttribute(`data-${language}`);
    });
    for (const [key, attribute] of [['placeholder','placeholder'], ['aria','aria-label'], ['title','title'], ['alt','alt'], ['content','content']]) {
      root.querySelectorAll(`[data-${key}-id][data-${key}-en]`).forEach((element) => {
        element.setAttribute(attribute, element.getAttribute(`data-${key}-${language}`));
      });
    }
    root.querySelectorAll('a[href]').forEach((link) => {
      if (!originalLinks.has(link)) originalLinks.set(link, link.getAttribute('href'));
      const original = originalLinks.get(link);
      if (!original || original.startsWith('#')) return;
      const url = new URL(original, location.href);
      if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) return;
      url.searchParams.set('lang', language);
      link.setAttribute('href', url.pathname + url.search + url.hash);
    });
  }
  function apply(next = language, updateUrl = false) {
    language = valid(next) ? next : 'id';
    document.documentElement.lang = language;
    window.currentPortfolioLang = language;
    try { localStorage.setItem('prefLang', language); } catch { /* Keep the language in links when storage is unavailable. */ }
    translate();
    document.querySelectorAll('#lang-toggle, [data-language-toggle]').forEach((button) => {
      button.setAttribute('aria-label', language === 'en' ? 'Switch to Indonesian' : 'Ganti ke bahasa Inggris');
      button.title = language === 'en' ? 'Switch to Indonesian' : 'Ganti ke bahasa Inggris';
      const label = button.querySelector('#lang-text, [data-language-label]');
      if (label) label.textContent = language === 'en' ? 'EN / ID' : 'ID / EN';
    });
    const locale = document.querySelector('meta[property="og:locale"]');
    if (locale) locale.content = language === 'en' ? 'en_US' : 'id_ID';
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('lang', language);
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    }
    window.ambientEngine?.updateBadgeUI();
    document.dispatchEvent(new CustomEvent('site:languagechange', { detail: { language } }));
  }
  function setText(element, id, en) {
    element.setAttribute('data-language-text', '');
    element.setAttribute('data-id', id);
    element.setAttribute('data-en', en);
    element.textContent = language === 'en' ? en : id;
  }
  window.SiteLanguage = { get current() { return language; }, apply, translate, setText };
  document.querySelectorAll('#lang-toggle, [data-language-toggle]').forEach((button) => {
    button.addEventListener('click', () => apply(language === 'en' ? 'id' : 'en', true));
  });
  apply();
})();
