export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Hanya menerima POST' });

    try {
        const { imageBase64, mimeType } = req.body;

        // 1. INSTRUKSI RAHASIA UNTUK GEMINI AI
        const prompt = `Kamu adalah asisten ekstraksi data JSON. Analisis gambar ini. 
        Tentukan masuk ke tabel mana: 'pendidikan', 'organisasi', 'sertifikat', 'webinar', atau 'sertifikasi'.
        Lalu, buatkan 1-2 kalimat 'deskripsi'/'keterangan' dengan bahasa profesional.
        KEMBALIKAN HANYA FORMAT JSON MURNI SEPERTI INI (tanpa markdown blok kode \`\`\`json):
        {
            "tabel_tujuan": "nama_tabel",
            "data": {
                "kolom1": "isi",
                "kolom2": "isi"
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
        let aiText = geminiData.candidates[0].content.parts[0].text;
        
        // Membersihkan format markdown bawaan AI
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

        if (!insertResponse.ok) throw new Error("Gagal menyimpan ke Supabase");

        return res.status(200).json({ success: true, message: `Berhasil disimpan ke tabel ${finalData.tabel_tujuan}` });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Terjadi kesalahan sistem' });
    }
}
