# Panduan Menambahkan / Mengganti Foto di Galeri Portofolio

Halo Khohar! Ruang dan layout Galeri Foto sudah dibuat permanen, estetik, dan responsif.
Anda **tidak perlu membuat kode layout, CSS, atau HTML baru lagi**. Cukup ikuti 2 langkah mudah berikut:

---

### Langkah 1: Masukkan File Foto ke Folder `gallery/`
Salin file foto Anda (format `.jpg`, `.jpeg`, `.png`, atau `.webp`) ke dalam folder ini:
`d:\portofolio-main\gallery\`

Contoh:
- `gallery/kegiatan_pmr_1.jpg`
- `gallery/musppanitra_dkc.jpg`
- `gallery/foto_kampus_polinema.jpg`
- `gallery/foto_olimpiade.jpg`

---

### Langkah 2: Daftarkan Foto di File `galeri.json`
Buka file `galeri.json` di folder root portofolio (`d:\portofolio-main\galeri.json`).
Ubah atau tambahkan item baru seperti contoh di bawah ini:

```json
{
  "id": "galeri-7",
  "category": "kegiatan",
  "category_name_id": "Kegiatan Lapangan",
  "category_name_en": "Field Activity",
  "title_id": "Nama Kegiatan atau Acara Anda",
  "title_en": "Your Activity or Event Name",
  "subtitle_id": "Peran atau Topik Acara",
  "subtitle_en": "Your Role or Event Topic",
  "date": "2026",
  "location_id": "Malang, Jawa Timur",
  "location_en": "Malang, East Java",
  "image_url": "gallery/kegiatan_pmr_1.jpg",
  "caption_id": "Deskripsi singkat tentang momen foto ini...",
  "caption_en": "Brief description of this photo moment...",
  "featured": false
}
```

#### Pilihan Kategori (`category`):
- `"kegiatan"` : Kegiatan & Aksi Lapangan
- `"organisasi"` : Organisasi, Relawan & Kepemimpinan
- `"akademik"` : Akademik, Lab & Kampus POLINEMA
- `"prestasi"` : Prestasi, Olimpiade & Konferensi
- `"pribadi"` : Potret Diri & Dokumentasi Pribadi

---

### Keunggulan Sistem Galeri Ini:
1. **Otomatis Terindeks**: Foto baru langsung muncul otomatis di web portofolio.
2. **Filter Interaktif**: Pengunjung dapat memfilter foto berdasarkan kategori.
3. **Lightbox / Fullscreen Modal**: Ketika foto diklik, akan muncul pop-up tampilan penuh dengan tombol Next/Prev dan keterangan lengkap.
4. **Bilingual (ID / EN)**: Mendukung dwibahasa Indonesia dan Inggris.
5. **Dark & Light Mode**: Desain otomatis menyesuaikan tema Genshin Impact yang sedang aktif.
