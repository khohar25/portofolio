export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Hanya menerima POST' });

    try {
        const { imageBase64, mimeType } = req.body;

        // 1. SUPER PROMPT: INSTRUKSI RAHASIA UNTUK GEMINI AI
        const prompt = `Kamu adalah Asisten AI canggih untuk ekstraksi data portofolio.
        Tugasmu: Analisis dokumen/gambar ini dan tentukan masuk ke HANYA SATU tabel yang paling relevan.
        Lalu, ekstrak datanya dan WAJIB gunakan nama kolom (key JSON) yang PERSIS seperti panduan di bawah ini:

        PILIHAN TABEL & KOLOM WAJIBNYA:
        1. 'sertifikat' (Untuk Penghargaan, Lomba, Juara) -> nama_penghargaan, pemberi_penghargaan, tahun, deskripsi
        2. 'sertifikasi' (Untuk Lisensi IT Profesional, misal IBM/Cisco) -> nama_sertifikasi, penerbit, tanggal_terbit, link_kredensial
        3. 'webinar' (Untuk Seminar, Pelatihan, Workshop) -> judul_acara, penyelenggara, tahun, keterangan
        4. 'organisasi' (Untuk Kepanitiaan, Pramuka, Kepengurusan) -> nama_organisasi, peran, tahun, deskripsi
        5. 'portofolio' (Untuk Proyek Web/Study Case IT) -> judul, kategori, konteks_masalah, solusi_teknis, link
        6. 'network' (Untuk Jejaring, Komunitas, Relasi) -> tipe, nama_kegiatan, platform_atau_tempat, tahun, deskripsi
        7. 'lab' (Untuk Riset / Eksperimen Inovasi) -> judul_riset, status, deskripsi
        8. 'library' (Untuk Buku, Novel, Karya Tulis) -> judul, kategori, deskripsi, link
        9. 'pendidikan' (Untuk Ijazah/Identitas Kampus/Sekolah) -> instansi, lokasi, jenjang_prodi, tahun

        ATURAN KETAT:
        - Jika gambar hanya berisi sertifikat tanpa penjelasan panjang, BUATKAN 1-2 kalimat profesional dalam bahasa Indonesia untuk mengisi kolom 'deskripsi'/'keterangan'/'konteks_masalah'.
        - Jika ada kolom URL/Link yang tidak terbaca dari gambar (misal 'link_kredensial' atau 'link'), isi dengan string kosong "".
        - KEMBALIKAN HANYA FORMAT JSON MURNI tanpa teks pengantar dan tanpa markdown blok kode \`\`\`json.
        
        FORMAT WAJIB:
        {
            "tabel_tujuan": "nama_tabel_pilihanmu",
            "data": {
                "nama_kolom_sesuai_panduan": "isi hasil ekstraksi",
                "nama_kolom_lainnya": "isi hasil ekstraksi"
            }
        }`;

        // 2. MENGIRIM GAMBAR KE GEMINI 1.5 FLASH
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType, data: imageBase64 } }] }]
            })
        });

        const geminiData = await geminiResponse.json();
        
        // Cek jika API Gemini error/limit
        if (!geminiData.candidates || geminiData.candidates.length === 0) {
            console.error("Gemini Response Error:", geminiData);
            throw new Error("Gagal mendapatkan respon dari AI.");
        }

        let aiText = geminiData.candidates[0].content.parts[0].text;
        
        // Membersihkan format markdown bawaan AI agar bisa di-parse jadi JSON
        aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const finalData = JSON.parse(aiText);

        // 3. MENYIMPAN HASIL KE SUPABASE
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;
        
        const insertResponse = await fetch(`${supabaseUrl}/rest/v1/${finalData.tabel_tujuan}`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(finalData.data)
        });

        if (!insertResponse.ok) {
            const errorSupa = await insertResponse.text();
            console.error("Supabase Error:", errorSupa);
            throw new Error(`Gagal menyimpan ke Database: ${errorSupa}`);
        }

        return res.status(200).json({ success: true, message: `Data diamankan ke laci '${finalData.tabel_tujuan}'` });

    } catch (error) {
        console.error("Catch Error:", error);
        return res.status(500).json({ error: error.message || 'Terjadi kesalahan sistem' });
    }
}
