---
title: "Adopsi Small Language Models (SLMs) di Sektor Perbankan"
slug: "adopsi-small-language-models-perbankan"
meta_description: "Kajian arsitektur Small Language Models (SLMs) on-premise di sektor perbankan: efisiensi biaya 90%, kedaulatan data UU PDP, dan kepatuhan OJK 2025/2026."
keywords:
  - "Small Language Models"
  - "SLM perbankan"
  - "AI finansial"
  - "kedaulatan data perbankan"
  - "LLM on-premise"
  - "Tata Kelola AI OJK"
  - "UU PDP"
  - "LoRA fine-tuning finansial"
language: "id-ID"
author: "Khohar Rohman"
date: "2026-10-01"
updated: "2026-10-01"
featured_image: "assets/slm-perbankan-onpremise-hero.jpg"
alternative_titles:
  - "Strategi Small Language Models (SLMs) untuk Bank Modern"
  - "Efisiensi SLMs On-Premise vs LLM Cloud pada Finansial"
---

# Adopsi Small Language Models (SLMs) di Sektor Perbankan

Oleh Khohar Rohman | Diperbarui: 1 Oktober 2026

![Pusat Data Komputasi SLM On-Premise Perbankan](assets/slm-perbankan-onpremise-hero.jpg)
*Gambar 1: Infrastruktur server on-premise modern memungkinkan bank menjalankan Small Language Models (SLMs) berlatensi rendah tanpa mentransfer data rahasia nasabah ke luar jaringan privat.*

> ### Key Takeaways
> *   **Efisiensi Biaya Operasional hingga 90%:** Menggantikan API *cloud* model bahasa besar (LLM) dengan *Small Language Models* (SLMs, $\le 10\text{B}$ parameter) yang disempurnakan secara spesifik mampu memangkas beban biaya komputasi rutin bank hingga 90% sekaligus mengeliminasi kejutan tagihan token (*token bill shock*).
> *   **Akurasi Unggul pada Tugas Spesifik:** Riset pemodelan empiris membuktikan bahwa SLM yang disempurnakan dengan metode LoRA/QLoRA pada korpus data keuangan internal menghasilkan skor akurasi dan presisi yang menandingi atau melampaui model raksasa serbaguna non-fine-tuned.
> *   **Jaminan Mutlak Kedaulatan Data:** Penggelaran SLM secara *on-premise* memastikan rekam transaksi nasabah tidak pernah melintasi batas jaringan privat bank, memenuhi kewajiban kedaulatan data berdasarkan UU Pelindungan Data Pribadi (UU PDP No. 27/2022) dan panduan Tata Kelola AI Perbankan dari OJK.
> *   **Arsitektur Piramida Bertingkat (*The Models Pyramid*):** Lembaga keuangan modern mengalokasikan 85–90% beban transaksi rutin bervolume tinggi ke armada SLM lokal, dan hanya menyisakan analisis penalaran makro yang kompleks untuk model komputasi awan terkelola.

---

## Titik Balik Ekonomi AI: Mengapa Bank Meninggalkan Frontier LLM Cloud?

Eforia awal implementasi kecerdasan artifisial generatif di sektor finansial sempat didominasi oleh ketergantungan pada *frontier Large Language Models* (LLM) berbasis komputasi awan publik [4]. Berbagai bank berlomba-lomba menghubungkan antarmuka obrolan dan asisten virtual internal ke penyedia model komersial raksasa. Namun, memasuki kuartal akhir tahun 2026, realitas ekonomi dan dinamika kepatuhan hukum memaksa para eksekutif perbankan (C-Level) melakukan reevaluasi arsitektur secara drastis [4, 7].

Penyebab utamanya adalah fenomena **kejutan tagihan token (*token bill shock*)** dan ketidakpastian biaya variabel operasional (*Opex*) [8]. Lembaga perbankan beroperasi dengan skala jutaan transaksi per hari: mulai dari verifikasi dokumen identitas *Know Your Customer* (KYC), ekstraksi data riwayat mutasi rekening, hingga analisis kesesuaian transaksi antipencucian uang (*Anti-Money Laundering* / AML) [4, 5]. Ketika setiap kueri memicu ribuan token ke penyedia API komputasi awan publik dengan skema tarif dinamis, biaya bulanan melonjak tanpa korelasi langsung terhadap kenaikan laba bersih perusahaan [8].

Sebagaimana telah dibahas dalam analisis [Transformasi Lanskap Kecerdasan Artifisial](Artikel%20Blog%20Pemanfaatan%20AI.md), organisasi yang sekadar "menempelkan" teknologi generatif tanpa merancang ulang fondasi arsitektur akan terjerumus ke dalam inefisiensi alokasi modal komputasi [8]. Lebih dari itu, sektor perbankan merupakan industri dengan toleransi risiko nol (*zero-risk tolerance*). Ketergantungan pada model *cloud* menghadirkan dua ancaman laten: latensi jaringan publik yang tidak dapat diprediksi untuk pemrosesan kartu kredit atau pembayaran instan, serta ancaman kebocoran data rahasia bank yang diatur secara ketat oleh hukum perbankan [4, 6].

Sebagai solusinya, sektor jasa keuangan global dan nasional kini memimpin gelombang migrasi ke arah **Small Language Models (SLMs) on-premise** [4, 7].

---

## Karakteristik Teknis Small Language Models (SLMs) untuk Finansial

Dalam taksonomi kecerdasan artifisial kontemporer, **Small Language Models (SLMs)** didefinisikan sebagai model bahasa dengan rentang ukuran parameter antara **270 juta hingga 10 miliar parameter ($\le 10\text{B}$)** [4, 5]. Dibandingkan dengan model frontier umum yang memiliki ratusan miliar hingga triliunan parameter, SLM dirancang dengan metodologi pelatihan berfokus: menggunakan data kurasi bermutu tinggi (*high-density curated data*) alih-alih merayapi seluruh data internet yang sarat distorsi [4, 5].

```
+-------------------------------------------------------------------------+
|                  ARUS PROSES PENYEMPURNAAN SLM PERBANKAN                |
+-------------------------------------------------------------------------+
| 1. Model Dasar Kompak (Base Model: 3B - 8B Parameter)                   |
|    - Ringan, efisien memori, mendukung arsitektur kuantisasi INT4/GGUF   |
+------------------------------------+------------------------------------+
                                     |
                                     v
| 2. Parameter-Efficient Fine-Tuning (PEFT via LoRA / QLoRA)              |
|    - Membekukan bobot inti model; melatih matriks rank rendah (Rank 8-64)|
|    - Dilatih pada korpus regulasi internal bank & data historis rahasia  |
+------------------------------------+------------------------------------+
                                     |
                                     v
| 3. Deploy On-Premise Berkeamanan Tinggi                                 |
|    - Ditempatkan di server GPU privat (Single Rack-Mount Server)         |
|    - Terkoneksi ke Core Banking melalui Model Context Protocol (MCP)    |
+-------------------------------------------------------------------------+
```

### 1. Mengapa Ukuran $\le 10\text{B}$ Menjadi Parameter Emas?
Model berukuran di bawah 10 miliar parameter memiliki keunggulan komputasi yang sangat radikal bagi infrastruktur perbankan [4, 5]:
*   **Efisiensi Memori VRAM:** Melalui teknik kuantisasi mutakhir (seperti 4-bit NormalFloat atau format GGUF/AWQ), model berukuran 7B atau 8B dapat dijalankan dengan alokasi memori grafis di bawah 6 hingga 8 GB [5]. Hal ini memungkinkan satu unit server rak komersial menjalankan beberapa instans model secara bersamaan [5].
*   **Latensi Super-Rendah (*Sub-150ms Response*):** Karena bobot parameter yang ringkas, proses inferensi berlangsung seketika tanpa *network round-trip* ke internet. Ini menjadikannya ideal untuk deteksi transaksi mencurigakan (*fraud triage*) yang menuntut keputusan dalam hitungan milidetik [6, 7].
*   **Deterministik dan Minim Halusinasi:** Karena ruang parameter yang lebih sempit dan difokuskan pada korpus domain keuangan, SLM cenderung lebih taat pada aturan instruksi (*rule-following*) dibanding model raksasa yang rentan memunculkan penalaran puitis atau spekulatif [4, 5].

### 2. Metodologi Adaptasi Presisi Berbasis LoRA dan QLoRA
Perbankan tidak perlu melatih model dari awal (*pre-training from scratch*) yang menelan biaya jutaan dolar [5]. Melalui metode **Low-Rank Adaptation (LoRA)** dan **Quantized LoRA (QLoRA)**, tim rekayasa AI bank dapat membekukan bobot asli model dasar dan hanya melatih lapisan adaptor kecil (*low-rank adapter weights*) yang mewakili kurang dari 1% dari total parameter [5].

Dalam publikasi ilmiah terbaru oleh Chen, Wu, & Zhao (September 2026) mengenai ekstraksi informasi finansial, fine-tuning model 3B hingga 8B menggunakan LoRA berhasil mencatatkan *F1-score* di atas 94% pada pembersihan data transaksi *merchant*, mengungguli model frontier tanpa fine-tuning yang membutuhkan biaya komputasi 40 kali lipat lebih mahal [5].

---

## Paradigma Arsitektur "The Models Pyramid" dalam Operasional Bank

Pendekatan modern perbankan tidak lagi bersandar pada satu model serbaguna (*one-size-fits-all*), melainkan menerapkan paradigma arsitektur bertingkat yang dikenal sebagai **The Models Pyramid** [7, 8].

![Arsitektur Piramida Model Finansial Enterprise](assets/arsitektur-model-pyramid-finansial.jpg)
*Gambar 2: Paradigma The Models Pyramid menempatkan model penalaran frontier di puncak piramida untuk analisis strategis yang jarang, didukung armada SLM khusus di lapisan operasional untuk volume harian bervolume tinggi.*

| Tingkatan Arsitektur | Kategori Model | Cakupan Parameter | Lingkungan Komputasi | Proporsi Beban Kerja | Contoh Penggunaan Perbankan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Puncak Piramida (*Strategic Apex*)** | Frontier Reasoning LLMs | > 100 Miliar | Dedicated VPC Cloud / Hybrid Sovereign | 10% - 15% | Analisis portofolio makroekonomi, formulasi strategi M&A, tinjauan hukum lintas yurisdiksi |
| **Tengah Piramida (*Operational Core*)** | Specialized Domain SLMs | 3B - 10B Parameter | Private On-Premise GPU Cluster | 50% - 60% | Analisis memo kredit (*credit underwriting*), deteksi fraud real-time, audit kepatuhan transaksi |
| **Dasar Piramida (*Edge & Real-Time*)** | Ultra-Lightweight Micro Models | 270M - 2B Parameter | Local Workstations / ATM Edge Nodes | 25% - 30% | Ekstraksi formulir KYC, klasifikasi teks tiket bantuan teller, validasi struktur data JSON |

Melalui integrasi standar terbuka seperti [Model Context Protocol (MCP)](model-context-protocol-multi-agent-enterprise.md), armada SLM operasional ini dapat dihubungkan ke sistem *Core Banking* tanpa membuka celah keamanan [10]. Agen orkestrator dapat mendelegasikan subtugas ekstraksi dan klasifikasi kepada SLM lokal, dan hanya memanggil model yang lebih besar apabila menghadapi kasus ambigu yang membutuhkan pertimbangan penalaran mendalam [7, 10].

---

## Kedaulatan Data Nasabah: Kepatuhan UU PDP dan Panduan AI OJK 2025

Bagi bank yang beroperasi di wilayah hukum Indonesia, pertimbangan mengadopsi model lokal bukan semata-mata kalkulasi efisiensi komputasi, melainkan kepatuhan hukum yang bersifat imperatif [1, 3].

![Kepatuhan dan Perlindungan Data Nasabah Perbankan](assets/kepatuhan-data-nasabah-bank.jpg)
*Gambar 3: Perlindungan kriptografis dan pemrosesan AI di dalam perimeter privat memastikan data sensitif perbankan memenuhi standar UU PDP dan auditabilitas OJK.*

### 1. Kepatuhan Penuh terhadap UU PDP No. 27/2022
Undang-Undang Pelindungan Data Pribadi (UU PDP) yang kini telah berada dalam fase penegakan hukum penuh memberikan batasan ketat mengenai transfer data pribadi [3]. Informasi finansial, nomor rekening, catatan transaksi, hingga data biometrik nasabah diklasifikasikan sebagai data pribadi spesifik yang memiliki konsekuensi hukum tinggi [3].

Mengunggah data transaksi nasabah ke server model AI pihak ketiga di luar yurisdiksi Indonesia tanpa persetujuan eksplisit (*explicit consent*) dan mekanisme transfer data lintas batas yang sah dapat dikategorikan sebagai pelanggaran pidana korporasi dengan ancaman denda administratif hingga **2% dari total pendapatan tahunan** [3]. Melalui penempatan SLM secara *on-premise* di dalam pusat data privat (*air-gapped environment*), risiko transmisi data lintas batas tereliminasi secara mutlak [4, 6].

### 2. Panduan Tata Kelola AI Perbankan OJK (29 April 2025)
Otoritas Jasa Keuangan (OJK) secara resmi menerbitkan pedoman **"Tata Kelola Kecerdasan Artifisial Perbankan Indonesia"** pada tanggal 29 April 2025 sebagai pedoman pelaksanaan dari POJK No. 11/POJK.03/2022 tentang Penyelenggaraan Teknologi Informasi oleh Bank Umum [1, 2]. Dokumen ini menetapkan standar prudensial yang mencakup [1]:
*   **Transparansi dan Keterjelasan (*Explainability*):** Bank dilarang menggunakan sistem AI berkarakteristik "kotak hitam" (*black-box*) untuk keputusan yang berdampak langsung pada hak nasabah, seperti penolakan fasilitas kredit atau penutupan rekening [1]. SLM yang disempurnakan dengan korpus terstruktur jauh lebih mudah diaudit jalurnya dibanding model raksasa [4, 6].
*   **Mitigasi Bias Penilaian Kredit (*Fairness in Lending*):** Algoritma penilaian kredit otomatis wajib diuji secara berkala untuk memastikan tidak terjadi diskriminasi gender, wilayah, atau latar belakang sosial demografi [1]. Dengan melatih SLM lokal pada data historis yang telah dibersihkan dari bias, bank memegang kendali penuh atas korpus pelatihan [4].
*   **Mandat Pengawasan Manusia (*Human-in-the-Loop*):** Selaras dengan Surat Edaran Menkominfo No. 9 Tahun 2023, keputusan pemberian kredit atau tindakan pembekuan rekening nasabah tidak boleh diputuskan secara sepihak oleh model AI tanpa adanya peninjauan dan otorisasi akhir oleh pejabat bank yang berwenang [1, 9].

---

## Kasus Penggunaan Riil: Dari Rekonsiliasi Transaksi hingga Triage Kredit

Penerapan Small Language Models di institusi keuangan modern mencatat hasil konkret pada berbagai lini operasional [4, 5]:

### 1. Ekstraksi dan Standardisasi Transaksi Pedagang (*Merchant Enrichment*)
Data transaksi kartu debit atau kartu kredit yang tercetak pada *core banking* kerap berantakan, terpotong, dan memuat kode alfanumerik yang membingungkan nasabah (misalnya: `TRX*9283-PT-GJK*JKT-ID`). Menggunakan SLM berukuran 3B parameter yang disempurnakan secara khusus, bank mampu mengurai kode tersebut secara instan menjadi format bersih: `"Gojek Service, Jakarta, Kategori: Transportasi & Logistik"`. Riset Chen et al. (2026) membuktikan bahwa akurasi pembersihan data transaksi ini melonjak dari 68% (menggunakan model berbasis aturan konvensional) menjadi 96,2% dengan SLM fine-tuned, memangkas komplain nasabah terkait transaksi tak dikenal hingga 40% [5].

### 2. Peringkasan Dokumen Legal dan Memo Penjaminan Kredit (*Credit Memo Drafting*)
Proses analisis permohonan kredit korporasi (*commercial lending*) membutuhkan telaah atas ratusan lembar laporan audit keuangan, rekening koran 6 bulan terakhir, dan akta pendirian. SLM berukuran 8B parameter yang ditempatkan di server internal mampu mengekstrak rasio keuangan utama, menandai klausul perjanjian berisiko tinggi (*covenants*), dan menyusun draf awal memo kredit bagi komite penjaminan hanya dalam waktu 3 menit, menghemat waktu analis dari 6 jam menjadi 30 menit per berkas [4, 7].

### 3. Asisten Cerdas Kepatuhan AML dan Pelaporan Transaksi Mencurigakan
Pemberitahuan transaksi mencurigakan (*Suspicious Transaction Report* / STR) menuntut kepatuhan terhadap format Pusat Pelaporan dan Analisis Transaksi Keuangan (PPATK). SLM lokal yang dilatih menggunakan regulasi kepatuhan dapat menganalisis rangkaian anomali transaksi dan secara otomatis menyusun draf narasi investigasi yang siap ditinjau oleh tim kepatuhan bank [1, 6].

---

## Roadmap 4 Fase Migrasi On-Premise bagi Arsitek TI Finansial

Bagi arsitek sistem dan pimpinan teknologi perbankan yang merencanakan transisi dari model cloud menuju kedaulatan data berbasis SLM, berikut adalah peta jalan implementasi bertahap [4, 7]:

```
+----------------------------------------------------------------------------+
| FASE 1: INVENTARISASI KORPUS DATA DOMAIN INTERNAL                          |
| Pembersihan & pelabelan 5.000 - 20.000 sampel data transaksi berkualitas.  |
+-------------------------------------+--------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
| FASE 2: PILIHAN BASE MODEL & BENCHMARK PEFT (LoRA)                         |
| Evaluasi model 3B - 8B parameter; uji kuantisasi INT4 pada GPU workstation |
+-------------------------------------+--------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
| FASE 3: AUDIT RISIKO MODEL SESUAI PANDUAN OJK                              |
| Pengujian bias algoritma, ketahanan adversarial, dan validasi explainability|
+-------------------------------------+--------------------------------------+
                                      |
                                      v
+----------------------------------------------------------------------------+
| FASE 4: INTEGRASI CORE BANKING DENGAN MCP & HITL                           |
| Penyambungan ke basis data via Model Context Protocol + verifikasi manusia. |
+----------------------------------------------------------------------------+
```

1.  **Fase 1: Kurasi Korpus Data Finansial Internal:** Mengidentifikasi data transaksi spesifik yang aman dan representatif, lalu melakukan pembersihan data (*data de-identification/masking*) untuk melenyapkan identitas riil nasabah pada fase pelatihan [6].
2.  **Fase 2: Benchmarking dan Adaptasi Efisien Parameter (LoRA):** Menguji performa beberapa model dasar *open-weights* berukuran 3B hingga 8B pada lingkungan pengujian terisolasi. Ukur metrik akurasi domain, *throughput* token per detik, serta penggunaan memori VRAM [5].
3.  **Fase 3: Audit Kepatuhan Model Independen (Sesuai Regulasi OJK 2025):** Melibatkan divisi *Model Risk Management* (MRM) internal untuk menguji ketahanan model terhadap manipulasi data, memverifikasi ketiadaan bias diskriminatif dalam penilaian, serta mendokumentasikan siklus hidup model sesuai amanat OJK [1].
4.  **Fase 4: Integrasi Produksi dengan Arsitektur Pengawasan Manusia (*HITL*):** Menghubungkan SLM ke alur kerja *core banking* menggunakan protokol terstandarisasi, memastikan seluruh rekomendasi kredit atau pelaporan transaksi tetap tunduk pada persetujuan analis manusia sebelum eksekusi final [1, 10].

---

## Kesimpulan dan Implikasi Manajerial

Sebagaimana diamati oleh Khohar Rohman dalam kajian manajemen teknologi institusional, evolusi kecerdasan artifisial perbankan telah melewati fase spekulatif di mana ukuran model raksasa diagung-agungkan. Efisiensi operasional dan keberlanjutan bisnis di sektor keuangan tidak ditentukan oleh seberapa besar parameter model yang disewa di komputasi awan, melainkan seberapa presisi model tersebut disesuaikan dengan proses bisnis internal, seberapa hemat konsumsi daya komputasinya, serta seberapa patuh arsitekturnya terhadap kedaulatan data nasabah [4, 8].

Small Language Models (SLMs) yang digelar secara *on-premise* memberikan jawaban komprehensif atas paradoks biaya dan kepatuhan yang selama ini membayangi transformasi digital perbankan [7]. Dengan memadukan efisiensi biaya hingga 90%, latensi transaksi di bawah 150 milidetik, kepatuhan mutlak terhadap UU PDP No. 27/2022, serta keterbukaan audit algoritma sesuai panduan Tata Kelola AI OJK 2025, SLM mentransformasikan kecerdasan artifisial dari beban biaya variabel yang membengkak menjadi aset kapabilitas inti yang bernilai strategis bagi perbankan modern [1, 3, 5].

---

## Pertanyaan yang Sering Diajukan (FAQ)

### 1. Apakah model bahasa kecil (SLM) mampu menandingi kemampuan penalaran model raksasa (LLM)?
Untuk tugas-tugas penalaran umum dan pengetahuan ensiklopedis dunia, model raksasa masih lebih unggul. Namun, untuk tugas-tugas domain finansial yang terikat aturan (*bounded domain*), seperti ekstraksi tabel mutasi rekening, penentuan rasio kredit, dan klasifikasi kepatuhan, riset empiris membuktikan bahwa SLM berukuran 3B–8B yang telah disempurnakan (*fine-tuned*) dengan LoRA menghasilkan akurasi yang setara atau bahkan mengungguli model raksasa umum [4, 5].

### 2. Berapa investasi perangkat keras minimal untuk menjalankan SLM On-Premise di perbankan?
Dengan teknologi kuantisasi 4-bit mutakhir, bank tidak memerlukan kluster superkomputer bernilai puluhan miliar rupiah. Sebuah server rak standar perbankan yang dilengkapi 2 hingga 4 unit GPU enterprise (masing-masing 24–48 GB VRAM) sudah cukup untuk melayani ribuan inferensi model 8B secara simultan dengan waktu respons milidetik, menghasilkan periode pengembalian modal (*payback period*) kurang dari 9 bulan dibanding biaya langganan API cloud [4, 8].

### 3. Mengapa OJK mewajibkan sistem AI perbankan bebas dari fenomena "kotak hitam" (*black-box*)?
Dalam industri perbankan yang berlandaskan prinsip kehati-hatian (*prudential banking*), setiap keputusan kredit atau sanksi pembatasan rekening berdampak langsung pada hak finansial nasabah. Panduan Tata Kelola AI Perbankan OJK 2025 mewajibkan transparansi agar jika terjadi penolakan fasilitas pinjaman atau pelaporan fraud keliru, bank dapat menjelaskan faktor data objektif yang mendasari keputusan tersebut kepada regulator dan nasabah [1, 2].

---

## Diskusi dan Tanggapan Anda

Bagaimana kesiapan institusi perbankan atau perusahaan teknologi finansial Anda dalam merespons panduan Tata Kelola AI OJK 2025 dan penegakan UU PDP? Apakah departemen teknologi Anda telah mulai mengeksplorasi penggelaran Small Language Models (SLMs) di lingkungan server *on-premise*, ataukah masih mengandalkan API komputasi awan pihak ketiga?

Sampaikan pandangan, tantangan arsitektur, dan pengalaman praktis Anda di kolom komentar di bawah ini untuk memperkaya diskursus teknologi finansial nasional.

---

## Tentang Penulis

**Khohar Rohman** adalah Direktur PT Aigarn Akademi Artificial dan mahasiswa aktif Politeknik Negeri Malang. Ia berfokus meneliti arsitektur kecerdasan artifisial enterprise, manajemen operasional berbasis teknologi, kedaulatan data komputasi, dan transformasi digital perbankan.

*Tautan Profil:* [LinkedIn](https://www.linkedin.com) | [GitHub](https://github.com/khohar25) | [Google Scholar](https://scholar.google.com)

*Keterbukaan Informasi:* Penulis adalah direktur PT Aigarn Akademi Artificial. Artikel ini disusun secara independen untuk tujuan edukasi profesional dan kajian arsitektur teknologi tanpa bentuk promosi komersial terselubung.

---

## Kredit Gambar

1.  **Nama File:** `assets/slm-perbankan-onpremise-hero.jpg`  
    **Deskripsi:** Visualisasi pusat data perbankan aman dengan infrastruktur komputasi Small Language Models (SLMs) on-premise yang memproses data finansial secara privat.  
    **Pembuat:** Tim Redaksi Artikel Khohar Rohman (AI-Generated via Custom Enterprise Prompt).  
    **Lisensi:** Domain Publik / Creative Commons Zero (CC0) Dedication. Aman digunakan untuk kebutuhan publikasi edukatif dan komersial bebas royalti.
2.  **Nama File:** `assets/arsitektur-model-pyramid-finansial.jpg`  
    **Deskripsi:** Ilustrasi arsitektur 3D The Models Pyramid dalam operasional perbankan yang membagi beban kerja antara model frontier strategis dan armada SLM lokal.  
    **Pembuat:** Tim Redaksi Artikel Khohar Rohman (AI-Generated via Custom Enterprise Prompt).  
    **Lisensi:** Domain Publik / Creative Commons Zero (CC0) Dedication. Aman digunakan untuk kebutuhan publikasi edukatif dan komersial bebas royalti.
3.  **Nama File:** `assets/kepatuhan-data-nasabah-bank.jpg`  
    **Deskripsi:** Konsep visual brankas digital pelindungan data nasabah yang merepresentasikan kepatuhan terhadap regulasi UU PDP dan panduan OJK 2025.  
    **Pembuat:** Tim Redaksi Artikel Khohar Rohman (AI-Generated via Custom Enterprise Prompt).  
    **Lisensi:** Domain Publik / Creative Commons Zero (CC0) Dedication. Aman digunakan untuk kebutuhan publikasi edukatif dan komersial bebas royalti.

---

## Sumber / Daftar Pustaka

1. Otoritas Jasa Keuangan. (2025). *Tata Kelola Kecerdasan Artifisial Perbankan Indonesia*. Departemen Pengaturan dan Pengembangan Perbankan OJK. Diterbitkan 29 April 2025. https://www.ojk.go.id. (Diakses: 1 Oktober 2026).
2. Otoritas Jasa Keuangan. (2022). *Peraturan Otoritas Jasa Keuangan Republik Indonesia Nomor 11/POJK.03/2022 tentang Penyelenggaraan Teknologi Informasi oleh Bank Umum*. Lembaran Otoritas Jasa Keuangan Republik Indonesia. https://jdih.ojk.go.id. (Diakses: 1 Oktober 2026).
3. Pemerintah Republik Indonesia. (2022). *Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi*. Lembaran Negara Republik Indonesia Tahun 2022 Nomor 196. https://peraturan.go.id. (Diakses: 1 Oktober 2026).
4. Infosys Knowledge Institute. (2025). *Smarter, Smaller, Safer: The Strategic Case for Small Language Models in Financial Services*. Infosys Technologies Whitepaper. https://www.infosys.com. (Diakses: 1 Oktober 2026).
5. Chen, L., Wu, T., & Zhao, Y. (2026). *How Small Can You Go? LoRA Fine-Tuning 270M-8B Models for Merchant Information Extraction in Financial Transactions*. arXiv preprint arXiv:2609.11204. https://doi.org/10.48550/arXiv.2609.11204. (Diakses: 1 Oktober 2026).
6. Zimmermann, M., & Al-Khatib, K. (2026). *On the Applicability of LLMs and SLMs for Privacy-Preserving Named Entity Recognition in Financial Applications*. Applied Sciences (MDPI), 16(6), 2814. https://doi.org/10.3390/app16062814. (Diakses: 1 Oktober 2026).
7. Quantiphi FinTech Research. (2026). *The Model Pyramid: Re-architecting Banking Operations with Small Language Models and Edge Computing*. Financial AI Insights Journal. https://quantiphi.com. (Diakses: 1 Oktober 2026).
8. E42 AI. (2026). *Breaking Token Bill Shock: Enterprise Economics of Domain-Specific Language Models*. Enterprise AI Economics Review. https://e42.ai. (Diakses: 1 Oktober 2026).
9. Kementerian Komunikasi dan Informatika Republik Indonesia. (2023). *Surat Edaran Menteri Komunikasi dan Informatika Nomor 9 Tahun 2023 tentang Etika Kecerdasan Artifisial*. JDIH Kominfo. https://jdih.komdigi.go.id. (Diakses: 1 Oktober 2026).
10. Rohman, K. (2026). *Model Context Protocol (MCP) dan Arsitektur Multi-Agent AI*. Artikel Khohar Rohman. https://artikel.khoharrohman.my.id/model-context-protocol-multi-agent-enterprise. (Diakses: 1 Oktober 2026).
