"""Build the curated news pages from berita.json; no external dependencies."""
from pathlib import Path
from datetime import date
import html, json, re
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'berita.json').read_text(encoding='utf-8'))
items = sorted(data['items'], key=lambda item: item['publishedAt'], reverse=True)
checked = date.fromisoformat(data['checkedAt'])
months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
esc = lambda value: html.escape(str(value), quote=True)
def formatted(value):
    day = date.fromisoformat(value)
    return f'{day.day} {months[day.month-1]} {day.year}'
assert len({item['slug'] for item in items}) == len(items)
for item in items:
    assert re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', item['slug'])
    assert date.fromisoformat(item['publishedAt']) <= checked
    assert urlsplit(item['sourceUrl']).scheme == 'https'
    assert item['paragraphs'] and all(isinstance(p,str) and p.strip() for p in item['paragraphs'])

def entries(prefix):
    return '\n'.join(f'''<article class="news-item" lang="id">
  <div class="news-date"><time datetime="{esc(item['publishedAt'])}">{formatted(item['publishedAt'])}</time><span class="news-category">{esc(item['category'])}</span></div>
  <div><h3 class="news-title"><a href="{prefix}{item['slug']}.html">{esc(item['title'])}</a></h3>
    <p class="news-excerpt">{esc(item['excerpt'])}</p>
    <div class="news-source"><span>Ringkasan · {esc(item['source'])}</span><a href="{esc(item['sourceUrl'])}" target="_blank" rel="noopener noreferrer">Sumber asli<span class="sr-only"> (tab baru)</span></a></div>
  </div>
</article>''' for item in items)

section = f'''<!-- NEWS-SECTION:START -->
        <section id="articles" class="section editorial-section" aria-labelledby="news-heading">
            <div class="container">
                <div class="section-header reveal">
                    <span class="section-tag" data-id="Bagian III · Berita &amp; Artikel" data-en="Section III · News &amp; Articles">Bagian III · Berita &amp; Artikel</span>
                    <h2 id="news-heading" class="section-title" data-id="Berita &amp; Artikel Terkini" data-en="News &amp; Articles">Berita &amp; Artikel Terkini</h2>
                    <p class="section-desc" data-id="Bacaan pilihan tentang hukum tata negara dan tata kelola teknologi. Setiap ringkasan mencantumkan tanggal terbit serta sumber aslinya." data-en="Selected reading on constitutional law and technology governance. Each Indonesian-language summary includes its source and publication date.">Bacaan pilihan tentang hukum tata negara dan tata kelola teknologi. Setiap ringkasan mencantumkan tanggal terbit serta sumber aslinya.</p>
                </div>
                <div class="news-heading-row"><p class="news-checked" data-id="Sumber terakhir diperiksa: {formatted(data['checkedAt'])}" data-en="Sources last checked: {checked.strftime('%d %B %Y').lstrip('0')}">Sumber terakhir diperiksa: {formatted(data['checkedAt'])}</p></div>
                <div class="news-list">{entries('artikel/')}</div>
                <div class="news-bottom"><a href="artikel/" data-id="Lihat semua bacaan" data-en="View all reading">Lihat semua bacaan</a><a href="artikel/#tulisan-pribadi" data-id="Tulisan pribadi" data-en="Personal writing">Tulisan pribadi</a></div>
                <div class="personal-placeholder"><h3 data-id="Tulisan Pribadi" data-en="Personal Writing">Tulisan Pribadi</h3><p data-id="Belum ada tulisan pribadi yang diterbitkan." data-en="No personal essays have been published yet.">Belum ada tulisan pribadi yang diterbitkan.</p></div>
            </div>
        </section>
        <!-- NEWS-SECTION:END -->'''
index = (ROOT / 'index.html').read_text(encoding='utf-8')
if '<!-- NEWS-SECTION:START -->' in index:
    index = re.sub(r'<!-- NEWS-SECTION:START -->.*?<!-- NEWS-SECTION:END -->', lambda _: section, index, flags=re.S)
else:
    index = index.replace('        <!-- 5. KORESPONDENSI -->',section+'\n\n        <!-- 5. KORESPONDENSI -->')
    for class_name,label in [('nav-link','Artikel'),('mobile-nav-link','Berita &amp; Artikel')]:
        marker=f'                <li><a href="#contact" class="{class_name}"'
        if class_name == 'nav-link':
            new='                <li><a href="#articles" class="nav-link" data-id="Artikel" data-en="Articles">Artikel</a></li>\n'
        else:
            new='                <li><a href="#articles" class="mobile-nav-link"><span class="nav-title" data-id="Berita &amp; Artikel" data-en="News &amp; Articles">Berita &amp; Artikel</span></a></li>\n'
        assert marker in index
        index=index.replace(marker,new+marker,1)
    footer_marker='                        <li><a href="#contact" data-id="Korespondensi"'
    assert footer_marker in index
    index=index.replace(footer_marker,'                        <li><a href="#articles" data-id="Berita &amp; Artikel" data-en="News &amp; Articles">Berita &amp; Artikel</a></li>\n'+footer_marker,1)
    index=index.replace('    <link rel="stylesheet" href="style.css?v=53">','    <link rel="stylesheet" href="style.css?v=53">\n    <link rel="stylesheet" href="artikel.css?v=1">')
index=index.replace('data-en="Section III &bull; Correspondence" data-id="Bagian III &bull; Korespondensi">Bagian III &bull; Korespondensi','data-en="Section IV &bull; Correspondence" data-id="Bagian IV &bull; Korespondensi">Bagian IV &bull; Korespondensi')
index=index.replace('Memuat biografi, karya fiksi, riwayat pendidikan, dan pengalaman organisasi.','Memuat biografi, karya fiksi, riwayat pendidikan, pengalaman organisasi, serta bacaan hukum dan teknologi.')
(ROOT/'index.html').write_text(index,encoding='utf-8')

def shell(title, description, canonical, content, schema=None):
    structured = '<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False).replace('<','\\u003c')+'</script>' if schema else ''
    return f'''<!DOCTYPE html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(title)} | Khohar Rohman</title><meta name="description" content="{esc(description)}"><meta name="robots" content="index,follow">
<link rel="canonical" href="https://khoharrohman.my.id/{canonical}"><link rel="icon" href="../favicon.png" type="image/png">
<link rel="stylesheet" href="../reader.css?v=1"><link rel="stylesheet" href="../artikel.css?v=1">{structured}
</head><body class="news-page"><a class="skip-link" href="#content">Lewati ke isi</a>
<header class="masthead"><a class="author" href="../">Khohar Muhamad Fatahurrohman<span>Laman resmi · Berita &amp; artikel</span></a><a class="back-link" href="../#articles">Kembali ke beranda</a></header>
{content}
<footer>Khohar Muhamad Fatahurrohman<span>Malang, Jawa Timur</span></footer></body></html>\n'''

archive=f'''<main id="content"><div class="page-intro"><p class="eyebrow">Bacaan pilihan</p><h1>Berita &amp; Artikel</h1><p>Ringkasan berita hukum tata negara dan tata kelola teknologi, disertai sumber asli. Tulisan pribadi tersedia pada bagian tersendiri.</p><p class="news-checked">Sumber terakhir diperiksa: {formatted(data['checkedAt'])}</p><a href="#tulisan-pribadi">Ke tulisan pribadi</a></div>
<section aria-labelledby="curated-title"><h2 id="curated-title">Ringkasan berita</h2><div class="news-list">{entries('')}</div></section>
<section id="tulisan-pribadi" class="personal-placeholder" aria-labelledby="personal-title"><p class="eyebrow">Khohar Muhamad Fatahurrohman</p><h2 id="personal-title">Tulisan Pribadi</h2><p>Belum ada tulisan pribadi yang diterbitkan.</p></section></main>'''
(ROOT/'artikel'/'index.html').write_text(shell('Berita & Artikel','Ringkasan berita hukum tata negara dan tata kelola teknologi beserta sumber aslinya.','artikel/',archive),encoding='utf-8')

for item in items:
    body=''.join('<p>'+esc(paragraph)+'</p>' for paragraph in item['paragraphs'])
    content=f'''<main id="content" class="news-detail"><article aria-labelledby="article-title"><p class="eyebrow">Ringkasan berita · {esc(item['category'])}</p><h1 id="article-title">{esc(item['title'])}</h1>
<div class="article-meta"><span>Sumber terbit: <time datetime="{item['publishedAt']}">{formatted(item['publishedAt'])}</time></span><span>Ringkasan diperbarui: <time datetime="{data['checkedAt']}">{formatted(data['checkedAt'])}</time></span></div>
<p class="article-lead">{esc(item['excerpt'])}</p><div class="article-body">{body}</div>
<aside class="source-note" aria-label="Sumber ringkasan"><h2>Sumber bacaan</h2><p>{esc(item['source'])} · {formatted(item['publishedAt'])}</p><p><a href="{esc(item['sourceUrl'])}" target="_blank" rel="noopener noreferrer">{esc(item['sourceTitle'])}<span class="sr-only"> (tab baru)</span></a></p><p>Ringkasan bacaan berdasarkan laporan lembaga di atas. Sumber asli memuat konteks pemberitaan selengkapnya.</p></aside>
<nav class="article-end" aria-label="Navigasi artikel"><a href="./">Kembali ke semua bacaan</a></nav></article></main>'''
    canonical='artikel/'+item['slug']+'.html'
    schema={'@context':'https://schema.org','@type':'WebPage','name':item['title'],'url':'https://khoharrohman.my.id/'+canonical,'description':item['excerpt'],'inLanguage':'id','dateModified':data['checkedAt'],'citation':{'@type':'CreativeWork','name':item['sourceTitle'],'url':item['sourceUrl'],'datePublished':item['publishedAt']}}
    (ROOT/canonical).write_text(shell(item['title'],item['excerpt'],canonical,content,schema),encoding='utf-8')

sitemap='''<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'''
for path in ['', 'artikel/']+['artikel/'+item['slug']+'.html' for item in items]:
    sitemap+=f'  <url><loc>https://khoharrohman.my.id/{path}</loc><lastmod>{data["checkedAt"]}</lastmod></url>\n'
(ROOT/'sitemap.xml').write_text(sitemap+'</urlset>\n',encoding='utf-8')
print(f'Built {len(items)} sourced news pages, homepage section, archive, and empty personal-writing section.')
