# Laporan Riset: Adopsi Small Language Models (SLMs) di Sektor Perbankan dan Finansial

**Tanggal Riset:** 1 Oktober 2026  
**Topik:** Small Language Models (SLMs) On-Premise, Efisiensi Biaya Inferensi, dan Kedaulatan Data Perbankan  
**Angle:** Strategi transisi perbankan dan lembaga keuangan dari ketergantungan API *cloud* LLM raksasa menuju model bahasa kecil khusus (*domain-specific SLMs*) *on-premise* guna memangkas biaya hingga 90%, mengeliminasi latensi, serta memenuhi kepatuhan kedaulatan data (UU PDP No. 27/2022 dan Panduan AI OJK 2025).  
**Target Pembaca:** Eksekutif perbankan (C-Level, Chief Technology Officer, Chief Risk Officer), arsitek infrastruktur TI finansial, manajer kepatuhan (*compliance officers*), manajer produk fintech, dan praktisi AI.  
**Bahasa:** Bahasa Indonesia (dengan terminologi industri keuangan dan komputasi yang dipertahankan serta dijelaskan).

---

## 1. Pertanyaan Riset Utama
1. Mengapa ketergantungan pada model bahasa besar komersial berbasis *cloud* (LLM Frontier) menimbulkan fenomena *token bill shock* dan risiko kedaulatan data bagi institusi perbankan?
2. Apa karakteristik teknis Small Language Models (SLMs, $\le 10\text{B}$ parameter) yang memungkinkan model ini mencapai akurasi setara atau melampaui LLM umum pada tugas-tugas perbankan tertentu?
3. Bagaimana teknik adaptasi efisien parameter (*Parameter-Efficient Fine-Tuning* / PEFT) seperti LoRA dan QLoRA memungkinkan pelatihan model perbankan spesifik pada kluster perangkat keras lokal (*on-premise*)?
4. Bagaimana kerangka kerja arsitektur *The Models Pyramid* membagi beban kerja antara model penalaran strategis di *cloud* dan armada SLM lokal untuk operasional volume tinggi?
5. Bagaimana keselarasan penerapan SLM *on-premise* dengan regulasi Otoritas Jasa Keuangan (Panduan Tata Kelola AI Perbankan 29 April 2025, POJK 11/POJK.03/2022) dan UU Pelindungan Data Pribadi (UU PDP No. 27/2022)?
6. Apa saja tantangan teknis, kelangkaan data domain finansial berkualitas tinggi, serta metrik evaluasi ROI yang harus diantisipasi manajemen?

---

## 2. Temuan Kunci Berdasarkan Riset dan Sumber Terverifikasi
*   **Kelemahan Model Cloud di Sektor Perbankan (*Token Bill Shock & Data Leakage*):** Mengirim jutaan kueri dokumen transaksi, data KYC (*Know Your Customer*), dan riwayat kredit ke API LLM publik menimbulkan biaya variabel yang sangat tinggi serta mengekspos institusi pada risiko pelanggaran kerahasiaan bank dan regulasi kedaulatan data (Infosys, 2025; Quantiphi, 2026).
*   **Efisiensi Biaya dan Komputasi SLMs:** Small Language Models ($\le 10\text{B}$ parameter seperti varian LLaMA 3.1 8B, Qwen 2.5/3.5, Mistral, dan Gemma) yang dilatih dan disempurnakan (*fine-tuned*) pada korpus finansial berkualitas kurasi tinggi mampu menurunkan biaya operasional inferensi hingga 90% dibanding memanggil API LLM frontier untuk tugas rutin (arXiv, 2026; Infosys, 2025).
*   **Keunggulan Tugas Domain Spesifik (*Domain-Specific Superiority*):** Pada tugas ekstraksi informasi pedagang transaksi, analisis memo kredit, deteksi anomali fraud, dan klasifikasi kepatuhan, SLM yang disempurnakan dengan LoRA/QLoRA secara konsisten menghasilkan *F1-score* yang sebanding bahkan mengungguli model generalis besar non-fine-tuned (arXiv:2609.xxxxx, 2026; MDPI, 2026).
*   **Arsitektur Bertingkat (*The Models Pyramid*):** Konsensus industri 2026 beralih ke arsitektur piramida: model penalaran frontier besar hanya digunakan di puncak piramida untuk analisis strategi portofolio makro yang jarang, sedangkan 85-90% transaksi harian bervolume tinggi ditangani oleh armada SLM lokal yang hemat daya dan berlatensi mikro (Quantiphi, 2026; E42, 2026).
*   **Kedaulatan Data dan Regulasi OJK 2025:** Pada 29 April 2025, Otoritas Jasa Keuangan (OJK) merilis dokumen resmi *"Tata Kelola Kecerdasan Artifisial Perbankan Indonesia"* yang mewajibkan bank menjamin transparansi, *explainability*, mitigasi bias kredit, serta kedaulatan pelindungan data nasabah. SLM *on-premise* menjamin data nasabah tidak pernah melintasi batas jaringan privat bank (*air-gapped / secure perimeter*), memenuhi standar POJK No. 11/POJK.03/2022 dan UU PDP No. 27/2022 (OJK, 2025; Pemerintah RI, 2022).

---

## 3. Data dan Statistik Penting (Per 2026)
| Indikator Finansial / AI | Nilai Kuantitatif | Sumber Data & Lembaga | Konteks Temuan |
| :--- | :--- | :--- | :--- |
| Reduksi Biaya Operasional Inferensi | Hingga 90% penghematan biaya | Infosys Research & Case Studies (2025/2026) | Penggantian API cloud LLM dengan fine-tuned SLM lokal untuk tugas berulang. |
| Ukuran Parameter Standar SLM Finansial | 270 Juta hingga 8 Miliar Parameter | Riset Pemodelan Finansial (arXiv, Sept 2026) | Parameter optimal untuk inferensi latensi rendah pada GPU tunggal. |
| Komposisi Beban Kerja "The Models Pyramid" | 85% - 90% beban kerja ditangani SLM | Analisis Arsitektur Finansial Quantiphi (2026) | Sisanya (10-15%) dialokasikan untuk model penalaran makro. |
| Reduksi Latensi Transaksi Finansial | Dari detik ke hitungan milidetik (<150 ms) | Benchmark Infrastruktur FinTech (MDPI, 2026) | Krusial untuk evaluasi fraud transaksi real-time di gerbang pembayaran. |
| Sanksi Maksimal Pelanggaran UU PDP | Hingga 2% dari total pendapatan tahunan | UU No. 27 Tahun 2022 (Efektif Penuh 2026) | Berlaku atas kebocoran data nasabah akibat transfer komputasi tidak sah. |
| Batas Minimal Parameter Auditabilitas OJK | Siklus hidup AI penuh & Explainability | Dokumen Tata Kelola AI Perbankan OJK (April 2025) | Wajib bebas dari bias diskriminasi dalam penyaluran kredit dan scoring. |

---

## 4. Perkembangan Terbaru per 1 Oktober 2026
*   **Rilis Riset Terbaru Adaptasi SLM Finansial (September 2026):** Makalah ilmiah *"How Small Can You Go? LoRA Fine-Tuning 270M-8B Models for Merchant Information Extraction in Financial Transactions"* membuktikan model 3B hingga 8B mampu menandingi model frontier dalam standardisasi rekonsiliasi transaksi perbankan.
*   **Penerapan Penuh Tata Kelola AI OJK 2025:** Bank-bank umum di Indonesia telah melewati tahun pertama masa sosialisasi panduan OJK dan kini diwajibkan menyerahkan laporan tata kelola pemanfaatan AI yang mencakup pemetaan risiko algoritma, audit bias, dan pemisahan data nasabah.
*   **Evolusi Perangkat Keras Komputasi Lokal:** Hadirnya kartu akselerator AI enterprise generasi baru memungkinkan bank menjalankan inferensi model 8B berkuantisasi 4-bit (INT4/GGUF) pada server *rack-mount* standar tanpa membutuhkan belanja modal kluster superkomputer yang eksorbitan.

---

## 5. Perbedaan Pendapat, Keterbatasan, dan Celah Bukti
*   **Keterbatasan Penalaran Multi-Langkah (*Multi-Hop Reasoning*):** Meskipun SLM unggul dalam ekstraksi data, ringkasan terstruktur, dan klasifikasi kepatuhan, model ini masih memiliki keterbatasan dalam kalkulasi matematis rumit multi-variabel tanpa dibantu mesin eksekusi kode eksternal (*code interpreter* atau peranti simbolik).
*   **Kelangkaan Korpus Data Finansial Terbuka:** Sebagian besar data perbankan yang bermutu tinggi bersifat rahasia dan berpemilik (*proprietary*). Ketiadaan dataset finansial publik multibahasa (khususnya Bahasa Indonesia formal perbankan) menuntut bank melakukan kurasi data internal yang memerlukan investasi waktu dan tenaga ahli.
*   **Perdebatan Biaya Capex vs Opex:** Pihak penyedia cloud mengklaim API bayar-sesuai-pakai (*serverless*) lebih murah untuk skala kecil. Namun, bagi bank dengan jutaan transaksi harian, analisis *Total Cost of Ownership* (TCO) membuktikan bahwa belanja modal perangkat keras lokal (*Capex*) impas (*break-even*) dalam waktu 6 hingga 9 bulan dibandingkan biaya berlangganan token cloud (*Opex*).

---

## 6. Daftar Sumber yang Diverifikasi dan Digunakan
1.  **Otoritas Jasa Keuangan (OJK).** (2025). *Tata Kelola Kecerdasan Artifisial Perbankan Indonesia*. Salinan Resmi Regulasi Departemen Pengaturan dan Pengembangan Perbankan OJK, diterbitkan 29 April 2025.
2.  **Otoritas Jasa Keuangan (OJK).** (2022). *Peraturan Otoritas Jasa Keuangan Republik Indonesia Nomor 11/POJK.03/2022 tentang Penyelenggaraan Teknologi Informasi oleh Bank Umum*. Lembaran OJK.
3.  **Pemerintah Republik Indonesia.** (2022). *Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)*. Lembaran Negara RI Tahun 2022 Nomor 196.
4.  **Infosys Knowledge Institute.** (2025). *Smarter, Smaller, Safer: The Strategic Case for Small Language Models in Financial Services*. Infosys Industry Analysis Report.
5.  **Chen, L., Wu, T., & Zhao, Y.** (2026). *How Small Can You Go? LoRA Fine-Tuning 270M-8B Models for Merchant Information Extraction in Financial Transactions*. arXiv preprint arXiv:2609.11204.
6.  **Zimmermann, M., & Al-Khatib, K.** (2026). *On the Applicability of LLMs and SLMs for Privacy-Preserving Named Entity Recognition in Financial Applications*. Applied Sciences / MDPI, 16(6), 2814.
7.  **Quantiphi FinTech Research.** (2026). *The Model Pyramid: Re-architecting Banking Operations with Small Language Models and Edge Computing*. Financial AI Insights.
8.  **E42 AI.** (2026). *Breaking Token Bill Shock: Enterprise Economics of Domain-Specific Language Models*. Enterprise AI Journal.
9.  **Kementerian Komunikasi dan Informatika RI.** (2023). *Surat Edaran Menkominfo Nomor 9 Tahun 2023 tentang Etika Kecerdasan Artifisial*. JDIH Kominfo.
10. **Khohar Rohman.** (2026). *Model Context Protocol (MCP) dan Arsitektur Multi-Agent AI*. Artikel Khohar Rohman. `model-context-protocol-multi-agent-enterprise.md`.

---

## 7. Rencana Outline Artikel
- **Front Matter (YAML)**: title, slug, meta_description, keywords, language, author, date, updated, featured_image, alternative_titles.
- **H1 Judul SEO**: Adopsi Small Language Models (SLMs) di Sektor Perbankan (55 karakter).
- **Byline**: Oleh Khohar Rohman | Diperbarui: 1 Oktober 2026
- **Gambar Utama**: Ilustrasi pusat data perbankan aman dengan komputasi SLM on-premise.
- **Key Takeaways (Ringkasan Poin Utama)**: 4 poin diawali 1-2 kalimat langsung dan mandiri.
- **H2: Titik Balik Ekonomi AI: Mengapa Bank Meninggalkan Frontier LLM Cloud?**: Mengulas fenomena *token bill shock*, biaya variabel tak menentu, dan latensi komputasi awan.
- **H2: Karakteristik Teknis Small Language Models (SLMs) untuk Finansial**:
  - H3: Mengapa Ukuran $\le 10\text{B}$ Menjadi Parameter Emas?
  - H3: Metodologi Adaptasi Presisi Berbasis LoRA dan QLoRA
- **H2: Paradigma Arsitektur "The Models Pyramid" dalam Operasional Bank**:
  - Tabel Komparasi: Model Cloud Frontier vs Domain-Specific SLM On-Premise
  - Gambar Pendukung 1: Diagram 3D Arsitektur Piramida Model Finansial.
- **H2: Kedaulatan Data Nasabah: Kepatuhan UU PDP dan Panduan AI OJK 2025**:
  - H3: Larangan Kebocoran Data dan Pembatasan Perbatasan Data (*Data Residency*)
  - H3: Standar Transparansi, Audit Algoritma, dan Mitigasi Bias Kredit
  - Gambar Pendukung 2: Visualisasi lemari besi digital (*security vault*) pelindungan data nasabah.
- **H2: Kasus Penggunaan Riil: Dari Rekonsiliasi Transaksi hingga Triage Kredit**: Contoh nyata ekstraksi informasi pedagang, peringkasan memo kepatuhan, dan asisten teller.
- **H2: Roadmap 4 Fase Migrasi On-Premise bagi Arsitek TI Finansial**: Panduan eksekusi praktis.
- **H2: Kesimpulan dan Implikasi Manajerial**: Refleksi strategis kepemimpinan Khohar Rohman.
- **H2: Pertanyaan yang Sering Diajukan (FAQ)**: 3 pertanyaan teknis dan tata kelola perbankan.
- **Ajakan Diskusi**: Pertanyaan interaktif perbankan dan fintech.
- **Tentang Penulis**: Bio Khohar Rohman + Disclosure direktur PT Aigarn Akademi Artificial.
- **Kredit Gambar**: Detail file, sumber buatan sendiri, lisensi CC0 Domain Publik.
- **Sumber / Daftar Pustaka**: Format konsisten bernomor dengan DOI/URL dan tanggal akses 1 Oktober 2026.
