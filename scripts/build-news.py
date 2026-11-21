"""Build personal news & writing pages from berita.json; no external dependencies.

Schema for berita.json:
{
  "updatedAt": "YYYY-MM-DD",
  "items": [
    {
      "slug": "judul-tulisan",
      "category": "Kabar Pribadi",
      "title": "Judul Berita atau Tulisan Pribadi",
      "publishedAt": "YYYY-MM-DD",
      "updatedAt": "YYYY-MM-DD",                # optional
      "excerpt": "Ringkasan singkat 1-2 kalimat.",
      "image": "artikel/images/sampul.webp",    # optional local image
      "imageAlt": "Deskripsi singkat gambar",   # required when "image" is set
      "imageCaption": "Keterangan foto",        # optional
      "paragraphs": [
        "Paragraf teks biasa...",
        {
          "type": "heading",
          "text": "Subjudul Opsional"
        },
        {
          "type": "image",
          "src": "artikel/images/ilustrasi-1.webp",
          "alt": "Deskripsi ilustrasi",
          "caption": "Keterangan ilustrasi (opsional)"
        },
        "Paragraf berikutnya..."
      ]
    }
  ]
}
"""
from datetime import date
import html
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
ARTIKEL_DIR = ROOT / 'artikel'
SITE_URL = 'https://khoharrohman.my.id'
AUTHOR_NAME = 'Khohar Muhamad Fatahurrohman'
CSS_VERSION = '3'

months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]


def esc(value):
    return html.escape(str(value), quote=True)


def formatted(value):
    day = date.fromisoformat(value)
    return f'{day.day} {months[day.month - 1]} {day.year}'


def validate_local_image(root, rel_path):
    assert isinstance(rel_path, str) and rel_path.strip(), 'Image path must be a non-empty string'
    normalized = rel_path.replace('\\', '/').strip()
    assert not normalized.startswith(('http://', 'https://', '/', 'data:', 'javascript:')), (
        f'Image path must be a local relative path inside the repository: {rel_path}'
    )
    parts = Path(normalized).parts
    assert '..' not in parts, f'Image path cannot traverse parent directories: {rel_path}'
    full_path = (root / normalized).resolve()
    assert full_path.is_file(), f'Image file not found: {normalized}'
    return normalized


def image_href(rel_path, in_artikel_dir=False):
    if not in_artikel_dir:
        return rel_path
    if rel_path.startswith('artikel/'):
        return rel_path[len('artikel/'):]
    return '../' + rel_path


def render_entries(entry_items, prefix, in_artikel_dir=False):
    cards = []
    for item in entry_items:
        has_img = bool(item.get('image'))
        cls = 'news-item has-thumb' if has_img else 'news-item'
        href = f'{prefix}{esc(item["slug"])}.html'
        thumb = ''
        if has_img:
            src = image_href(item['image'], in_artikel_dir=in_artikel_dir)
            thumb = (
                f'\n  <a class="news-thumb" href="{href}">'
                f'<img src="{esc(src)}" alt="{esc(item["imageAlt"])}" loading="lazy" decoding="async"></a>'
            )
        cards.append(
            f'''<article class="{cls}" lang="id">
  <div class="news-date"><time datetime="{esc(item['publishedAt'])}">{formatted(item['publishedAt'])}</time><span class="news-category">{esc(item['category'])}</span></div>
  <div><h3 class="news-title"><a href="{href}">{esc(item['title'])}</a></h3>
    <p class="news-excerpt">{esc(item['excerpt'])}</p>
  </div>{thumb}
</article>'''
        )
    return '\n'.join(cards)


def render_body_blocks(blocks):
    rendered = []
    for block in blocks:
        if isinstance(block, str):
            rendered.append(f'<p>{esc(block)}</p>')
        elif block['type'] == 'heading':
            rendered.append(f'<h2>{esc(block["text"])}</h2>')
        elif block['type'] == 'image':
            src = image_href(block['src'], in_artikel_dir=True)
            caption = (
                f'<figcaption>{esc(block["caption"])}</figcaption>'
                if block.get('caption')
                else ''
            )
            rendered.append(
                f'<figure class="article-figure">'
                f'<img src="{esc(src)}" alt="{esc(block["alt"])}" loading="lazy" decoding="async">'
                f'{caption}</figure>'
            )
    return ''.join(rendered)



ARCHIVE_TRANSLATIONS = {'Berita & Tulisan Pribadi': 'Personal News & Writing', 'Kabar pribadi, catatan kegiatan, dan tulisan asli Khohar Muhamad Fatahurrohman.': 'Personal updates, activity notes, and original writing by Khohar Muhamad Fatahurrohman.', 'Kabar kegiatan, pembaruan karya, dan tulisan asli yang diterbitkan langsung oleh Khohar Muhamad Fatahurrohman.': 'Updates on activities, new work, and original writing by Khohar Muhamad Fatahurrohman.', 'Arsip Pribadi': 'Personal Archive', 'Belum ada berita atau tulisan yang diterbitkan.': 'No personal news or writing has been published yet.', 'Kabar kegiatan, pembaruan karya, serta tulisan pribadi akan dimuat pada halaman ini setelah tersedia.': 'Activity updates, new work, and personal writing will appear here once published.', 'Laman resmi · Berita & tulisan pribadi': 'Official website · Personal news & writing', 'Kembali ke beranda': 'Back to home', 'Lewati ke isi': 'Skip to content', 'Malang, Jawa Timur': 'Malang, East Java', 'Kembali ke arsip berita & tulisan': 'Back to the news & writing archive', 'Daftar berita dan tulisan': 'News & writing archive', 'Ruang Baca | Khohar Muhamad Fatahurrohman': 'Reading Room | Khohar Muhamad Fatahurrohman', 'Halaman buku dan ruang baca karya Khohar Muhamad Fatahurrohman.': 'Book details and online reading room for works by Khohar Muhamad Fatahurrohman.', 'Lewati ke buku': 'Skip to book details', 'Laman resmi · Karya tulis': 'Official website · Published works', 'Kembali ke karya tulis': 'Back to published works', 'Ruang baca': 'Reading room', 'Memuat buku…': 'Loading book…', 'Menyiapkan halaman buku': 'Preparing book details', 'Mohon tunggu sebentar.': 'Please wait a moment.', 'Baca di Fizzo Novel': 'Read on Fizzo Novel', '(tab baru)': '(opens in a new tab)', 'Mulai membaca': 'Start reading', 'Buka PDF': 'Open PDF', 'Baca buku': 'Read the book', 'Posisi baca tersimpan di peramban ini.': 'Your reading position is saved in this browser.', 'Sebelumnya': 'Previous', 'Berikutnya': 'Next', 'Halaman': 'Page', 'Buka': 'Go', 'Ukuran': 'Zoom', 'Sesuai layar': 'Fit to screen', 'Tampilan teks': 'Text view', 'Layar penuh': 'Full screen', 'Gunakan tombol Sebelumnya/Berikutnya atau panah kiri/kanan pada keyboard.': 'Use Previous/Next or the left and right arrow keys to turn pages.', 'Karya lainnya': 'Other works', 'Lihat daftar karya dan tautan Fizzo.': 'View published works and Fizzo links.', 'Forum Remaja Palang Merah Indonesia (FORPIS) PMI Kab. Ngawi': 'Indonesian Red Cross Youth Forum (FORPIS), Ngawi Regency', 'Dewan Kerja Cabang (DKC) Gerakan Pramuka Kab. Ngawi': 'Scout Rover Council (DKC), Ngawi Regency', 'Pimpinan Daerah Ikatan Pelajar Muhammadiyah (PD IPM) Kab. Ngawi': 'Muhammadiyah Student Association (PD IPM), Ngawi Regency'}
ARCHIVE_TRANSLATIONS['Berita & Tulisan Pribadi | Khohar Rohman'] = 'Personal News & Writing | Khohar Rohman'

def translate_archive_markup(source):
    def leaf(match):
        opening, text, closing = match.groups()
        value = html.unescape(text).strip()
        if value in ARCHIVE_TRANSLATIONS and 'data-id=' not in opening:
            opening = opening[:-1] + f' data-id="{esc(value)}" data-en="{esc(ARCHIVE_TRANSLATIONS[value])}">'
        return opening + text + closing
    source = re.sub(r'(<(?:h1|h2|h3|p|span|a|title)\b[^>]*>)([^<>]+)(</(?:h1|h2|h3|p|span|a|title)>)', leaf, source)
    def meta(match):
        tag = match.group(0)
        content = re.search(r'(?<![\w-])content="([^"]*)"', tag)
        if content:
            value = html.unescape(content.group(1))
            en = ARCHIVE_TRANSLATIONS.get(value)
            if not en and value.endswith(' | Khohar Rohman'):
                title = value.removesuffix(' | Khohar Rohman')
                if title in ARCHIVE_TRANSLATIONS: en = ARCHIVE_TRANSLATIONS[title] + ' | Khohar Rohman'
            if en: tag = tag[:-1] + f' data-content-id="{esc(value)}" data-content-en="{esc(en)}">'
        return tag
    return re.sub(r'<meta\b[^>]*>', meta, source)


def shell(title, description, canonical, content, robots='index,follow', schema=None, og_image=None, og_type='website'):
    structured = (
        '<script type="application/ld+json">'
        + json.dumps(schema, ensure_ascii=False).replace('<', '\\u003c')
        + '</script>'
        if schema
        else ''
    )
    canonical_url = f'{SITE_URL}/{canonical}'
    social_meta = (
        f'<meta property="og:type" content="{esc(og_type)}">'
        f'<meta property="og:title" content="{esc(title)} | Khohar Rohman">'
        f'<meta property="og:description" content="{esc(description)}">'
        f'<meta property="og:url" content="{esc(canonical_url)}">'
    )
    if og_image:
        image_url = f'{SITE_URL}/{og_image}'
        social_meta += (
            f'<meta property="og:image" content="{esc(image_url)}">'
            '<meta name="twitter:card" content="summary_large_image">'
            f'<meta name="twitter:image" content="{esc(image_url)}">'
        )
    else:
        social_meta += '<meta name="twitter:card" content="summary">'

    return translate_archive_markup(
        '<!DOCTYPE html>\n'
        '<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">\n'
        f'<title>{esc(title)} | Khohar Rohman</title>'
        f'<meta name="description" content="{esc(description)}">'
        f'<meta name="robots" content="{esc(robots)}">\n'
        f'<link rel="canonical" href="{esc(canonical_url)}">'
        f'{social_meta}\n'
        '<link rel="icon" href="../favicon.png" type="image/png">\n'
        f'<link rel="stylesheet" href="../reader.css?v=1"><link rel="stylesheet" href="../artikel.css?v={CSS_VERSION}">{structured}\n'
        '<script defer src="../language.js?v=1"></script></head><body class="news-page"><a class="skip-link" href="#content">Lewati ke isi</a>\n'
        f'<header class="masthead"><a class="author" href="../">{AUTHOR_NAME}<span>Laman resmi · Berita &amp; tulisan pribadi</span></a>'
        '<a class="back-link" href="../#articles">Kembali ke beranda</a><button class="button" type="button" data-language-toggle aria-label="Ganti ke bahasa Inggris"><span data-language-label>ID / EN</span></button></header>\n'
        f'{content}\n'
        f'<footer>{AUTHOR_NAME}<span>Malang, Jawa Timur</span></footer></body></html>\n'
    )


def build(root=ROOT):
    artikel_dir = root / 'artikel'
    data = json.loads((root / 'berita.json').read_text(encoding='utf-8'))
    raw_items = data.get('items', [])
    assert isinstance(raw_items, list), 'berita.json "items" must be a list'

    updated_at = data.get('updatedAt') or date.today().isoformat()
    date.fromisoformat(updated_at)

    items = sorted(raw_items, key=lambda item: item['publishedAt'], reverse=True)
    assert len({item['slug'] for item in items}) == len(items), 'Duplicate slug in berita.json'

    normalized_items = []
    for raw in items:
        item = dict(raw)
        assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', item['slug']), f"Invalid slug: {item['slug']}"
        assert isinstance(item.get('category'), str) and item['category'].strip()
        assert isinstance(item.get('title'), str) and item['title'].strip()
        assert isinstance(item.get('excerpt'), str) and item['excerpt'].strip()
        date.fromisoformat(item['publishedAt'])
        if item.get('updatedAt'):
            date.fromisoformat(item['updatedAt'])

        if item.get('image'):
            item['image'] = validate_local_image(root, item['image'])
            assert isinstance(item.get('imageAlt'), str) and item['imageAlt'].strip(), (
                f"Item '{item['slug']}' with image must include non-empty imageAlt"
            )
            if item.get('imageCaption') is not None:
                assert isinstance(item['imageCaption'], str)

        raw_blocks = item.get('paragraphs')
        assert isinstance(raw_blocks, list) and raw_blocks, f"Item '{item['slug']}' needs non-empty paragraphs"
        clean_blocks = []
        for block in raw_blocks:
            if isinstance(block, str):
                assert block.strip(), f"Empty paragraph string in '{item['slug']}'"
                clean_blocks.append(block.strip())
            elif isinstance(block, dict):
                btype = block.get('type')
                if btype == 'heading':
                    assert isinstance(block.get('text'), str) and block['text'].strip()
                    clean_blocks.append({'type': 'heading', 'text': block['text'].strip()})
                elif btype == 'image':
                    src = validate_local_image(root, block.get('src'))
                    assert isinstance(block.get('alt'), str) and block['alt'].strip(), (
                        f"Inline image in '{item['slug']}' must include non-empty alt"
                    )
                    caption = block.get('caption', '').strip() if isinstance(block.get('caption'), str) else ''
                    clean_blocks.append({'type': 'image', 'src': src, 'alt': block['alt'].strip(), 'caption': caption})
                else:
                    raise AssertionError(f"Unsupported block type in '{item['slug']}': {btype}")
            else:
                raise AssertionError(f"Paragraph entries in '{item['slug']}' must be string or block object")
        item['paragraphs'] = clean_blocks
        normalized_items.append(item)

    items = normalized_items

    if items:
        home_body = (
            f'                <div class="news-list reveal">{render_entries(items[:5], "artikel/", in_artikel_dir=False)}</div>\n'
            '                <div class="news-bottom reveal"><a href="artikel/" data-id="Lihat semua berita &amp; tulisan" data-en="View all news &amp; writing">Lihat semua berita &amp; tulisan</a></div>'
        )
    else:
        home_body = '''                <div class="news-empty-state reveal">
                    <p class="news-empty-label" data-id="Arsip Pribadi" data-en="Personal Archive">Arsip Pribadi</p>
                    <h3 data-id="Belum ada berita atau tulisan yang diterbitkan." data-en="No personal news or writing has been published yet.">Belum ada berita atau tulisan yang diterbitkan.</h3>
                    <p data-id="Kabar kegiatan, pembaruan karya, dan tulisan pribadi akan dimuat di sini setelah diterbitkan." data-en="Personal updates, new releases, and original writing will appear here once published.">Kabar kegiatan, pembaruan karya, dan tulisan pribadi akan dimuat di sini setelah diterbitkan.</p>
                    <div class="news-empty-actions"><a href="artikel/" data-id="Buka halaman arsip" data-en="View archive">Buka halaman arsip</a></div>
                </div>'''

    section = f'''<!-- NEWS-SECTION:START -->
        <section id="articles" class="section editorial-section" aria-labelledby="news-heading">
            <div class="container">
                <div class="section-header reveal">
                    <span class="section-tag" data-id="Bagian III &bull; Berita &amp; Tulisan" data-en="Section III &bull; News &amp; Writing">Bagian III &bull; Berita &amp; Tulisan</span>
                    <h2 id="news-heading" class="section-title" data-id="Berita &amp; Tulisan Pribadi" data-en="Personal News &amp; Writing">Berita &amp; Tulisan Pribadi</h2>
                    <p class="section-desc" data-id="Ruang kabar pribadi, catatan kegiatan, dan tulisan asli Khohar Muhamad Fatahurrohman." data-en="Personal updates, activity notes, and original writing by Khohar Muhamad Fatahurrohman.">Ruang kabar pribadi, catatan kegiatan, dan tulisan asli Khohar Muhamad Fatahurrohman.</p>
                </div>
{home_body}
            </div>
        </section>
        <!-- NEWS-SECTION:END -->'''

    index_path = root / 'index.html'
    index_html = index_path.read_text(encoding='utf-8')
    assert '<!-- NEWS-SECTION:START -->' in index_html and '<!-- NEWS-SECTION:END -->' in index_html
    index_html = re.sub(
        r'<!-- NEWS-SECTION:START -->.*?<!-- NEWS-SECTION:END -->',
        lambda _: section,
        index_html,
        flags=re.S,
    )
    index_html = re.sub(r'artikel\.css\?v=\d+', f'artikel.css?v={CSS_VERSION}', index_html)
    index_path.write_text(index_html, encoding='utf-8')

    artikel_dir.mkdir(exist_ok=True)
    active_files = {'index.html'} | {f"{item['slug']}.html" for item in items}
    removed = []
    for existing in artikel_dir.glob('*.html'):
        if existing.name not in active_files:
            existing.unlink()
            removed.append(existing.name)

    if items:
        archive_content = (
            '<main id="content">'
            '<div class="page-intro"><p class="eyebrow">Khohar Muhamad Fatahurrohman</p>'
            '<h1>Berita &amp; Tulisan Pribadi</h1>'
            '<p>Kabar kegiatan, pembaruan karya, dan tulisan asli yang diterbitkan langsung oleh Khohar Muhamad Fatahurrohman.</p></div>\n'
            f'<section aria-labelledby="archive-list-title"><h2 id="archive-list-title" class="sr-only">Daftar berita dan tulisan</h2>'
            f'<div class="news-list">{render_entries(items, "", in_artikel_dir=True)}</div></section>'
            '</main>'
        )
        archive_robots = 'index,follow'
    else:
        archive_content = (
            '<main id="content">'
            '<div class="page-intro"><p class="eyebrow">Khohar Muhamad Fatahurrohman</p>'
            '<h1>Berita &amp; Tulisan Pribadi</h1>'
            '<p>Kabar kegiatan, pembaruan karya, dan tulisan asli yang diterbitkan langsung oleh Khohar Muhamad Fatahurrohman.</p></div>\n'
            '<section class="news-empty-state" aria-labelledby="empty-title">'
            '<p class="news-empty-label">Arsip Pribadi</p>'
            '<h2 id="empty-title">Belum ada berita atau tulisan yang diterbitkan.</h2>'
            '<p>Kabar kegiatan, pembaruan karya, serta tulisan pribadi akan dimuat pada halaman ini setelah tersedia.</p>'
            '</section></main>'
        )
        archive_robots = 'noindex,follow'

    (artikel_dir / 'index.html').write_text(
        shell(
            'Berita & Tulisan Pribadi',
            'Kabar pribadi, catatan kegiatan, dan tulisan asli Khohar Muhamad Fatahurrohman.',
            'artikel/',
            archive_content,
            robots=archive_robots,
        ),
        encoding='utf-8',
    )

    for item in items:
        body = render_body_blocks(item['paragraphs'])
        modified = item.get('updatedAt') or item['publishedAt']
        meta_updated = (
            f'<span>Diperbarui: <time datetime="{esc(modified)}">{formatted(modified)}</time></span>'
            if item.get('updatedAt') and item['updatedAt'] != item['publishedAt']
            else ''
        )
        cover_html = ''
        if item.get('image'):
            cover_src = image_href(item['image'], in_artikel_dir=True)
            cover_caption = (
                f'<figcaption>{esc(item["imageCaption"])}</figcaption>'
                if item.get('imageCaption')
                else ''
            )
            cover_html = (
                f'\n<figure class="article-cover">'
                f'<img src="{esc(cover_src)}" alt="{esc(item["imageAlt"])}" decoding="async">'
                f'{cover_caption}</figure>'
            )

        content = (
            f'<main id="content" class="news-detail"><article aria-labelledby="article-title">'
            f'<p class="eyebrow">{esc(item["category"])}</p>'
            f'<h1 id="article-title">{esc(item["title"])}</h1>\n'
            f'<div class="article-meta"><span>Oleh {AUTHOR_NAME}</span>'
            f'<span>Terbit: <time datetime="{esc(item["publishedAt"])}">{formatted(item["publishedAt"])}</time></span>'
            f'{meta_updated}</div>\n'
            f'<p class="article-lead">{esc(item["excerpt"])}</p>'
            f'{cover_html}\n'
            f'<div class="article-body">{body}</div>\n'
            '<nav class="article-end" aria-label="Navigasi artikel"><a href="./">Kembali ke arsip berita &amp; tulisan</a></nav>'
            '</article></main>'
        )
        canonical = f"artikel/{item['slug']}.html"
        schema = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            'headline': item['title'],
            'description': item['excerpt'],
            'url': f'{SITE_URL}/{canonical}',
            'inLanguage': 'id',
            'datePublished': item['publishedAt'],
            'dateModified': modified,
            'author': {
                '@type': 'Person',
                'name': AUTHOR_NAME,
                'url': f'{SITE_URL}/',
            },
            'publisher': {
                '@type': 'Person',
                'name': AUTHOR_NAME,
                'url': f'{SITE_URL}/',
            },
        }
        if item.get('image'):
            schema['image'] = f'{SITE_URL}/{item["image"]}'

        (root / canonical).write_text(
            shell(
                item['title'],
                item['excerpt'],
                canonical,
                content,
                schema=schema,
                og_image=item.get('image'),
                og_type='article',
            ),
            encoding='utf-8',
        )

    sitemap_urls = ['']
    if items:
        sitemap_urls.append('artikel/')
        sitemap_urls.extend(f"artikel/{item['slug']}.html" for item in items)

    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    for path in sitemap_urls:
        sitemap += f'  <url><loc>{SITE_URL}/{path}</loc><lastmod>{updated_at}</lastmod></url>\n'
    (root / 'sitemap.xml').write_text(sitemap + '</urlset>\n', encoding='utf-8')

    print(
        f'Built personal news section ({len(items)} published items), archive, sitemap'
        + (f'; removed {len(removed)} stale file(s): {", ".join(sorted(removed))}' if removed else '.')
    )


if __name__ == '__main__':
    build()
