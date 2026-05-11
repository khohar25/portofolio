module.exports = async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Hanya menerima POST' });

    try {
        const { imageBase64, mimeType, manualText } = req.body;

        const basePrompt = `Kamu adalah Asisten AI canggih untuk ekstraksi data portofolio IT.
        Tugasmu: Analisis input (gambar atau teks) ini dan tentukan masuk ke HANYA SATU tabel yang paling relevan.
        Ekstrak datanya dan WAJIB gunakan nama kolom (key JSON) yang PERSIS seperti panduan ini (perhatikan huruf besar/kecilnya):

        PILIHAN TABEL (SESUAI DATABASE ASLI):
        1. 'sertifikat' -> nama_penghargaan, pemberi_penghargaan, tahun, deskripsi
        2. 'sertifikasi' -> nama_sertifikasi, penerbit, tanggal_terbit, link_kredensial
        3. 'webinar' -> judul_acara, penyelenggara, tahun, keterangan
        4. 'organisasi' -> nama_organisasi, peran, tahun, deskripsi
        5. 'portofolio' -> judul, kategori, konteks_masalah, solusi_teknis, link
        6. 'jaringan' -> tipe, nama_kegiatan, platform_atau_tempat, tahun, deskripsi
        7. 'laboratorium' -> judul_riset, status, Deskripsi
        8. 'perpustakaan' -> judul, kategori, deskripsi, link
        9. 'pendidikan' -> instansi, lokasi, jenjang_prodi, tahun

        ATURAN:
        - Jika manual teks, pecah info Tech Stack ke 'solusi_teknis' dan Link ke 'link'.
        - Kembalikan HANYA JSON murni tanpa markdown.
        
        {
            "tabel_tujuan": "nama_tabel",
            "data": { "kolom": "isi" }
        }`;

        let contentsPayload;
        if (imageBase64) {
            contentsPayload = [{ parts: [{ text: basePrompt }, { inlineData: { mimeType, data: imageBase64 } }] }];
        } else if (manualText) {
            contentsPayload = [{ parts: [{ text: basePrompt + "\n\nDATA USER:\n" + manualText }] }];
        } else {
            return res.status(400).json({ error: "Data kosong." });
        }

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: contentsPayload })
        });

        const geminiData = await geminiResponse.json();
        
        if (!geminiData.candidates || geminiData.candidates.length === 0) {
            const msg = geminiData.error ? geminiData.error.message : "Google API Error";
            throw new Error(`Ditolak Google: ${msg}`);
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

        if (!insertResponse.ok) {
            const errDb = await insertResponse.text();
            throw new Error(`Supabase Nolak: ${errDb}`);
        }

        return res.status(200).json({ success: true, message: `Data diamankan ke laci '${finalData.tabel_tujuan}'` });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
