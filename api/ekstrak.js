module.exports = async function handler(req, res) {
    // 1. SURAT IZIN CORS (Ditaruh langsung di sini, jadi gak butuh vercel.json)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // 2. CEGAT PREFLIGHT REQUEST DARI BROWSER
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') return res.status(405).json({ error: 'Hanya menerima POST' });

    try {
        const { imageBase64, mimeType, manualText } = req.body;

        // 3. PROMPT AI TERBARU
        const basePrompt = `Kamu adalah Asisten AI canggih untuk ekstraksi data portofolio IT.
        Tugasmu: Analisis input (gambar/teks) ini dan masukkan ke HANYA SATU tabel yang paling tepat.
        
        PILIHAN TABEL & KOLOM WAJIB:
        1. 'sertifikat' -> nama_penghargaan, pemberi_penghargaan, tahun, deskripsi, deskripsi_en
        2. 'sertifikasi' -> nama_sertifikasi, penerbit, tanggal_terbit, link_kredensial
        3. 'webinar' -> judul_acara, penyelenggara, tahun, keterangan, keterangan_en
        4. 'organisasi' -> nama_organisasi, peran, tahun, deskripsi, deskripsi_en
        5. 'portofolio' -> judul, kategori, konteks_masalah, konteks_masalah_en, solusi_teknis, solusi_teknis_en, link
        6. 'network' -> tipe, nama_kegiatan, platform_atau_tempat, tahun, deskripsi, deskripsi_en
        7. 'lab' -> judul_riset, status, deskripsi, deskripsi_en
        8. 'library' -> judul, kategori, deskripsi, deskripsi_en, link
        9. 'pendidikan' -> instansi, lokasi, jenjang_prodi, tahun
        10. 'tabel_artikel' -> judul, kategori, deskripsi, deskripsi_en, link

        ATURAN KETAT:
        - KHUSUS 'sertifikat': Jika ada info Tanggal/Lokasi, gabungkan di awal isi 'deskripsi'.
        - TRANSLASI: Kolom berakhiran '_en' WAJIB diisi terjemahan Bahasa Inggris yang sangat profesional dari kolom aslinya.
        - Kembalikan HANYA format JSON murni tanpa markdown/teks awalan apapun.
        
        FORMAT OUTPUT:
        {
            "tabel_tujuan": "nama_tabel",
            "data": { "kolom": "isi", "kolom_en": "isi inggris" }
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

        const supabaseUrl = "https://xwwlegzacxevmlmtceqh.supabase.co";
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3d2xlZ3phY3hldm1sbXRjZXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MDA2NzEsImV4cCI6MjA5Mzk3NjY3MX0.C9qCfFVN9j8gtvsLVBFGh4I28gIRvJkYlp546-ssEgw";

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
