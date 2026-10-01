# Panduan & Dokumentasi Galeri Foto Portofolio

Halo Khohar! Seluruh 17 foto dokumentasi autentik dari Google Drive Anda telah berhasil dioptimasi, dikonversi ke format WebP performa tinggi, dan diintegrasikan ke galeri portofolio (`#gallery`).

---

### Daftar Foto Dokumentasi yang Telah Terpasang (18 Item):

1. **`gallery/khohar_suit_ibm_portrait.webp`** *(Prestasi & Profil)*: Potret resmi jas formal dengan latar dinding sertifikasi keahlian IBM SkillsBuild.
2. **`gallery/polinema_lab_komputasi.webp`** *(Akademik)*: Aktivitas praktikum di laboratorium komputer Politeknik Negeri Malang (POLINEMA) mengenakan seragam kebanggaan kampus.
3. **`gallery/musywil_xxiv_ipm_jatim.webp`** *(Organisasi)*: Bertugas sebagai Perangkat Musyawarah Wilayah XXIV PW IPM Jawa Timur.
4. **`gallery/ipm_committee_vest.webp`** *(Organisasi)*: Dokumentasi di balik layar kepanitiaan Musywil XXIV PW IPM Jatim mengenakan rompi panitia dan tanda pengenal.
5. **`gallery/workshop_teknologi_pengolahan.webp`** *(Akademik)*: Kelulusan workshop teknologi pengolahan hasil pertanian bersama rekan pelatihan.
6. **`gallery/angkatan_sekolah_menengah.webp`** *(Akademik)*: Potret kebersamaan rekan satu almamater sekolah menengah berseragam batik di depan gerbang utama dan masjid sekolah.
7. **`gallery/blk_madiun_pelatihan.webp`** *(Kegiatan)*: Foto bersama peserta dan instruktur pelatihan vokasi UPT Balai Latihan Kerja (BLK) Madiun.
8. **`gallery/praktik_baking_pastry.webp`** *(Kegiatan)*: Praktik laboratorium kuliner & pastry menunjukkan hasil olahan kue higienis bersama rekan tim.
9. **`gallery/lab_pengolahan_kuliner.webp`** *(Kegiatan)*: Sesi pengolahan dan uji mutu makanan di laboratorium produksi berstandar industri stainless steel.
10. **`gallery/kebersamaan_rekan_studi.webp`** *(Kegiatan)*: Momen ramah tamah dan santap malam bersama rekan-rekan seperjuangan pelatihan berseragam biru.
11. **`gallery/literasi_buku_sahabat.webp`** *(Kegiatan)*: Eksplorasi literasi dan berburu buku referensi bersama sahabat.
12. **`gallery/perjalanan_kereta_api.webp`** *(Kegiatan)*: Dokumentasi perjalanan fajar antar-kota Jawa Timur menaiki Kereta Api Indonesia (KAI).
13. **`aku.jpeg`** *(Pribadi)*: Potret profil rekayasa perangkat lunak dan riset komputasi terapan.
14. **`gallery/keluarga_idul_fitri.webp`** *(Pribadi)*: Momen Idul Fitri penuh kehangatan bersama kedua orang tua dan adik tercinta di Karangjati, Ngawi.
15. **`gallery/usaha_keluarga_kripik_tempe.webp`** *(Pribadi)*: Berdiri bangga di depan plang usaha rumah tangga mandiri keluarga "Kripik Tempe Kharisma" di Ringinanom, Karangjati, Ngawi.
16. **`gallery/potret_batik_tradisi.webp`** *(Pribadi)*: Potret tradisi berbusana batik dan sarung di bawah pohon rindang pedesaan Ngawi.
17. **`gallery/memori_masa_kecil_pohon.webp`** *(Pribadi)*: Memori nostalgia masa kecil memanjat pohon pekarangan rumah bersama saudara.
18. **`gallery/memori_masa_kecil_keluarga.webp`** *(Pribadi)*: Kenangan manis masa kanak-kanak bersama adik perempuan tercinta.

*Catatan: Seluruh file asli resolusi tinggi dari Google Drive tersimpan aman sebagai arsip di `gallery/drive_photos/`.*

---

### Cara Menambahkan atau Mengubah Foto Baru di Masa Mendatang:

1. **Letakkan File Foto**: Masukkan file gambar Anda ke dalam folder `gallery/`.
2. **Daftarkan di `galeri.json`**: Tambahkan objek JSON baru di file `galeri.json`:
   ```json
   {
     "id": "galeri-19",
     "category": "kegiatan",
     "category_name_id": "Kategori Bahasa Indonesia",
     "category_name_en": "English Category",
     "title_id": "Judul Bahasa Indonesia",
     "title_en": "English Title",
     "subtitle_id": "Subjudul Bahasa Indonesia",
     "subtitle_en": "English Subtitle",
     "date": "2026",
     "location_id": "Lokasi ID",
     "location_en": "Location EN",
     "image_url": "gallery/nama_foto.webp",
     "object_position": "center center",
     "caption_id": "Deskripsi lengkap...",
     "caption_en": "Full description...",
     "featured": false
   }
   ```
3. **Selesai**: Web akan langsung merender foto secara otomatis lengkap dengan filter kategori, efek animasi, dan lightbox fullscreen pop-up.
