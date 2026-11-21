const $ = (id) => document.getElementById(id);
const state = { pdf: null, page: 1, zoom: 'fit', text: false, expanded: false, render: null, queue: Promise.resolve() };
let storageKey;

const readerPhrases = {
  "Memuat buku…": "Loading book…",
  "Menyiapkan naskah": "Preparing the manuscript",
  "Memuat buku untuk dibaca di halaman ini.": "Loading the book for reading on this page.",
  "Tersedia untuk dibaca": "Available to read",
  "Baca naskah langsung melalui pembaca di bawah ini.": "Read the manuscript using the reader below.",
  "Pembaca belum dapat dibuka": "The reader could not be opened",
  "Silakan coba lagi atau gunakan tautan Buka PDF.": "Please try again or use the Open PDF link.",
  "Pilih buku": "Choose a book",
  "Buku tidak ditemukan": "Book not found",
  "Daftar karya": "Published works",
  "Pilih salah satu judul pada daftar karya di bawah ini.": "Choose a title from the list below.",
  "Ruang baca": "Reading room",
  "Halaman belum dapat dimuat": "This page could not be loaded",
  "Silakan muat ulang halaman atau kembali ke daftar karya.": "Please reload the page or return to the list of published works.",
  "Naskah belum tersedia": "Manuscript not yet available",
  "Naskah untuk dibaca langsung di situs ini belum ditambahkan. Anda tetap dapat membaca karya ini melalui Fizzo Novel.": "The manuscript has not yet been added to this website. You can still read this work on Fizzo Novel.",
  "Halaman ini berupa gambar. Teks tidak tersedia.": "This page is an image. Text is not available.",
  "Halaman gagal ditampilkan. Coba halaman lain atau buka berkas PDF.": "This page could not be displayed. Try another page or open the PDF file.",
  "Keluar layar penuh": "Exit full screen",
  "Layar penuh": "Full screen"
};
function english(text) {
  if (readerPhrases[text]) return readerPhrases[text];
  let match = /^Memuat halaman (\d+)…$/.exec(text);
  if (match) return `Loading page ${match[1]}…`;
  match = /^Halaman (\d+) dari (\d+)$/.exec(text);
  if (match) return `Page ${match[1]} of ${match[2]}`;
  match = /^Halaman (\d+) dari (\d+)\. Pilih Tampilan teks untuk membaca isi halaman dengan pembaca layar\.$/.exec(text);
  if (match) return `Page ${match[1]} of ${match[2]}. Select Text view to read this page with a screen reader.`;
  if (text.startsWith('Sampul ')) return 'Cover of ' + text.slice(7);
  return text.replace(' | Ruang Baca Khohar', ' | Khohar Reading Room');
}
function write(element, id, en = english(id)) { window.SiteLanguage.setText(element, id, en); }
function writeAttribute(element, attribute, id) {
  const key = attribute === 'aria-label' ? 'aria' : attribute;
  element.setAttribute(`data-${key}-id`, id);
  element.setAttribute(`data-${key}-en`, english(id));
  element.setAttribute(attribute, window.SiteLanguage.current === 'en' ? english(id) : id);
}


function message(title, text) {
  write($('availability-title'), title);
  write($('availability-message'), text);
}
function storedPage() {
  try { return Number(localStorage.getItem(storageKey)) || 1; } catch { return 1; }
}
function savePage() {
  try { localStorage.setItem(storageKey, String(state.page)); } catch { /* Reading works without browser storage. */ }
}
function localFile(path) {
  const url = new URL(path, location.href);
  if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) throw new Error('Berkas harus berasal dari situs ini.');
  return url.href;
}
function syncNavigation() {
  $('previous').disabled = state.page <= 1;
  $('next').disabled = state.page >= state.pdf.numPages;
  $('page-total').textContent = `/ ${state.pdf.numPages}`;
}
async function renderPage() {
  const pageNumber = state.page;
  const page = await state.pdf.getPage(pageNumber);
  const canvas = $('pdf-canvas');
  const stage = $('page-stage');
  stage.setAttribute('aria-busy', 'true');
  write($('reader-status'), `Memuat halaman ${pageNumber}…`);
  syncNavigation();
  try {
    const text = await page.getTextContent();
    const pageText = text.items.map((item) => item.str + (item.hasEOL ? '\n' : ' ')).join('');
    if (pageText.trim()) {
      $('page-text').removeAttribute('data-id');
      $('page-text').removeAttribute('data-en');
      $('page-text').textContent = pageText;
    } else write($('page-text'), 'Halaman ini berupa gambar. Teks tidak tersedia.');
    const base = page.getViewport({ scale: 1 });
    const padding = parseFloat(getComputedStyle(stage).paddingLeft) + parseFloat(getComputedStyle(stage).paddingRight);
    const fit = Math.max(0.1, (stage.clientWidth - padding) / base.width);
    const scale = state.zoom === 'fit' ? Math.min(fit, 1.5) : Number(state.zoom);
    const viewport = page.getViewport({ scale });
    const density = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(viewport.width * density);
    canvas.height = Math.floor(viewport.height * density);
    canvas.style.width = `${Math.floor(viewport.width)}px`;
    canvas.style.height = `${Math.floor(viewport.height)}px`;
    writeAttribute(canvas, 'aria-label', `Halaman ${pageNumber} dari ${state.pdf.numPages}. Pilih Tampilan teks untuk membaca isi halaman dengan pembaca layar.`);
    state.render = page.render({ canvasContext: canvas.getContext('2d'), viewport, transform: density === 1 ? null : [density, 0, 0, density, 0, 0] });
    await state.render.promise;
    write($('reader-status'), `Halaman ${pageNumber} dari ${state.pdf.numPages}`);
    savePage();
  } catch (error) {
    write($('reader-status'), 'Halaman gagal ditampilkan. Coba halaman lain atau buka berkas PDF.');
    console.error('PDF page render failed:', error);
  } finally { stage.setAttribute('aria-busy', 'false'); state.render = null; }
}
function queueRender() {
  state.queue = state.queue.catch(() => {}).then(renderPage);
  return state.queue;
}
function goToPage(number) {
  if (!state.pdf || !Number.isFinite(number)) return;
  state.page = Math.max(1, Math.min(state.pdf.numPages, Math.trunc(number)));
  $('page-number').value = state.page;
  return queueRender();
}
function setupControls() {
  $('previous').addEventListener('click', () => goToPage(state.page - 1));
  $('next').addEventListener('click', () => goToPage(state.page + 1));
  $('page-form').addEventListener('submit', (event) => { event.preventDefault(); goToPage(Number($('page-number').value)); });
  $('zoom').addEventListener('change', () => { state.zoom = $('zoom').value; queueRender(); });
  $('text-toggle').addEventListener('click', () => {
    state.text = !state.text;
    $('pdf-canvas').hidden = state.text;
    $('page-text').hidden = !state.text;
    $('text-toggle').setAttribute('aria-pressed', String(state.text));
  });
  function setExpanded(expanded) {
    state.expanded = expanded;
    $('reader').classList.toggle('is-expanded', expanded);
    document.body.classList.toggle('reader-open', expanded);
    write($('fullscreen'), expanded ? 'Keluar layar penuh' : 'Layar penuh');
    queueRender();
  }
  $('fullscreen').addEventListener('click', async () => {
    if (state.expanded) { setExpanded(false); return; }
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await $('reader').requestFullscreen();
    } catch { setExpanded(true); }
  });
  document.addEventListener('fullscreenchange', () => {
    write($('fullscreen'), document.fullscreenElement ? 'Keluar layar penuh' : 'Layar penuh');
    queueRender();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.expanded) setExpanded(false);
  });
  $('reader').addEventListener('keydown', (event) => {
    if (['INPUT','SELECT','TEXTAREA','BUTTON'].includes(event.target.tagName) || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      goToPage(state.page + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let resizeTimer;
  let lastWidth = $('page-stage').clientWidth;
  const observer = new ResizeObserver((entries) => {
    const width = entries[0].contentRect.width;
    if (Math.abs(width - lastWidth) < 1) return;
    lastWidth = width;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (state.zoom === 'fit') queueRender(); }, 180);
  });
  observer.observe($('page-stage'));
}
async function openPdf(book) {
  const pdfUrl = localFile(book.pdfUrl);
  $('pdf-link').href = pdfUrl;
  $('pdf-link').hidden = false;
  message('Menyiapkan naskah', 'Memuat buku untuk dibaca di halaman ini.');
  try {
    const pdfjs = await import('./vendor/pdfjs/build/pdf.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/build/pdf.worker.mjs', import.meta.url).href;
    state.pdf = await pdfjs.getDocument({ url: pdfUrl, cMapUrl: new URL('./vendor/pdfjs/cmaps/', import.meta.url).href, cMapPacked: true, standardFontDataUrl: new URL('./vendor/pdfjs/standard_fonts/', import.meta.url).href, wasmUrl: new URL('./vendor/pdfjs/wasm/', import.meta.url).href, isEvalSupported: false }).promise;
    storageKey = `khohar-reader:${book.slug}:${book.pdfUrl}`;
    state.page = Math.max(1, Math.min(state.pdf.numPages, storedPage()));
    $('page-number').max = state.pdf.numPages;
    $('page-number').value = state.page;
    $('reader-title').textContent = book.title;
    $('reader').hidden = false;
    setupControls();
    await queueRender();
    message('Tersedia untuk dibaca', 'Baca naskah langsung melalui pembaca di bawah ini.');
    $('start-reading').hidden = false;
    $('fizzo-link').classList.remove('primary');
  } catch (error) {
    $('reader').hidden = true;
    message('Pembaca belum dapat dibuka', 'Silakan coba lagi atau gunakan tautan Buka PDF.');
    console.error('PDF load failed:', error);
  }
}
async function init() {
  try {
    const response = await fetch('./buku.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Book list unavailable');
    const books = await response.json();
    const slug = new URLSearchParams(location.search).get('buku');
    const book = books.find((entry) => entry.slug === slug);
    for (const entry of books.filter((entry) => entry.slug !== slug)) {
      const link = document.createElement('a');
      link.href = `baca.html?buku=${encodeURIComponent(entry.slug)}`;
      link.textContent = entry.title;
      $('other-books').append(link);
    }
    window.SiteLanguage.translate($('other-books'));
    if (!book) {
      write($('book-title'), 'Pilih buku');
      message(slug ? 'Buku tidak ditemukan' : 'Daftar karya', 'Pilih salah satu judul pada daftar karya di bawah ini.');
      document.querySelector('.cover-frame').hidden = true;
      return;
    }
    write(document.querySelector('title'), `${book.title} | Ruang Baca Khohar`);
    write($('book-title'), book.title);
    $('book-author').textContent = book.author;
    write($('book-theme'), book.theme, book.themeEn || book.theme);
    write($('book-description'), book.description, book.descriptionEn || book.description);
    $('book-cover').src = localFile(book.cover);
    writeAttribute($('book-cover'), 'alt', `Sampul ${book.title}`);
    $('book-cover').hidden = false;
    if (book.fizzoUrl) {
      const fizzo = new URL(book.fizzoUrl);
      if (fizzo.protocol === 'https:' && ['www.fizzo.org', 'fizzo.org'].includes(fizzo.hostname)) {
        $('fizzo-link').href = fizzo.href;
        $('fizzo-link').hidden = false;
      }
    }
    if (book.pdfUrl) await openPdf(book);
    else message('Naskah belum tersedia', 'Naskah untuk dibaca langsung di situs ini belum ditambahkan. Anda tetap dapat membaca karya ini melalui Fizzo Novel.');
  } catch (error) {
    write($('book-title'), 'Ruang baca');
    message('Halaman belum dapat dimuat', 'Silakan muat ulang halaman atau kembali ke daftar karya.');
    console.error('Book page load failed:', error);
  }
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
