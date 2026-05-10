module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Hanya menerima POST' });

    try {
        const { imageBase64, mimeType, manualText } = req.body;

        const basePrompt = `Kamu adalah Asisten AI canggih untuk ekstraksi data portofolio IT.
        Tugasmu: Analisis input (gambar atau teks) ini dan tentukan masuk ke HANYA SATU tabel yang paling relevan.
        Ekstrak datanya dan WAJIB gunakan nama kolom (key JSON) yang PERSIS seperti panduan ini:

        PILIHAN TABEL & KOLOM WAJIBNYA:
        1. 'sertifikat' -> nama_penghargaan, pemberi_penghargaan, tahun, deskripsi
        2. 'sertifikasi' -> nama_sertifikasi, penerbit, tanggal_terbit, link_kredensial
        3. 'webinar' -> judul_acara, penyelenggara, tahun, keterangan
        4. 'organisasi' -> nama_organisasi, peran, tahun, deskripsi
        5. 'portofolio' -> judul, kategori, konteks_masalah, solusi_teknis, link
        6. 'network' -> tipe, nama_kegiatan, platform_atau_tempat, tahun, deskripsi
        7. 'lab' -> judul_riset, status, deskripsi
        8. 'library' -> judul, kategori, deskripsi, link
        9. 'pendidikan' -> instansi, lokasi, jenjang_prodi, tahun

        ATURAN KETAT PEMISAHAN DATA:
        - KHUSUS MODE MANUAL TEKS: Jika di dalam 'Deskripsi' terdapat informasi campuran tentang teknologi yang dipakai (Tech Stack), masalah yang diselesaikan, atau URL link, JANGAN masukkan semuanya ke satu kolom! Pecah dan masukkan ke dalam kolom 'konteks_masalah', 'solusi_teknis', 'link_kredensial', atau 'link' sesuai tabel tujuannya.
        - Jika gambar hanya berisi piagam tanpa teks penjelasan, karanglah 1 kalimat deskripsi profesional.
        - Jika ada info yang kosong atau tidak disebutkan, kosongkan nilainya "".
        - KEMBALIKAN HANYA FORMAT JSON MURNI tanpa markdown blok kode \`\`\`json.
        
        FORMAT WAJIB:
        {
            "tabel_tujuan": "nama_tabel_pilihanmu",
            "data": {
                "kolom_sesuai_panduan": "isi ekstraksi"
            }
        }`;

        let contentsPayload;
        if (imageBase64) {
            contentsPayload = [{ parts: [{ text: basePrompt }, { inlineData: { mimeType, data: imageBase64 } }] }];
        } else if (manualText) {
            contentsPayload = [{ parts: [{ text: basePrompt + "\n\n--- DATA KETIKAN MANUAL DARI USER: ---\n" + manualText }] }];
        } else {
            return res.status(400).json({ error: "Data kosong." });
        }

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: contentsPayload })
        });

        const geminiData = await geminiResponse.json();
        
        // --- BAGIAN YANG DIREVISI UNTUK MENANGKAP ERROR ASLI GOOGLE ---
        if (!geminiData.candidates || geminiData.candidates.length === 0) {
            const pesanErrorAsli = geminiData.error ? geminiData.error.message : "Format respon Google berubah.";
            throw new Error(`Ditolak Google: ${pesanErrorAsli}`);
        }

        let aiText = geminiData.candidates[0].content.parts[0].text;
        aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
        const finalData = JSON.parse(aiText);

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

        if (!insertResponse.ok) throw new Error(await insertResponse.text());

        return res.status(200).json({ success: true, message: `Data diamankan ke laci '${finalData.tabel_tujuan}'` });

    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: error.message || 'Terjadi kesalahan sistem' });
    }
}
