// --- 1. LOGIKA THEME TOGGLE (Dark/Light Mode) ---
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');

const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') themeIcon.className = 'fas fa-sun';
}

themeToggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light' || !theme) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
});

// Palet warna untuk border kartu
const colorPalette = ['#007bff', '#2ecc71', '#9b59b6', '#e67e22', '#e74c3c', '#0ea5e9', '#f43f5e'];

// --- 2. FETCH, FILTER, & RENDER DATA JSON ---
async function loadPortfolioData() {
    try {
        const [profileRes, organisasiRes, prestasiRes, webinarRes] = await Promise.all([
            fetch('profil.json'),
            fetch('organisasi.json'),
            fetch('sertifikat.json'),
            fetch('webinar.json')
        ]);

        const profileData = await profileRes.json();
        const organisasiData = await organisasiRes.json();
        const prestasiData = await prestasiRes.json();
        const webinarData = await webinarRes.json();

        // --- RENDER 1 & 2: PENGHARGAAN VS PESERTA SAINS ---
        const juaraContainer = document.getElementById('juara-container');
        const pesertaSainsContainer = document.getElementById('peserta-sains-container');

        if(prestasiData) {
            prestasiData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                
                // Cek kategori juara
                let isJuara = item.nama_penghargaan.toLowerCase().includes('piagam') || 
                              item.nama_penghargaan.toLowerCase().includes('juara') || 
                              item.nama_penghargaan.toLowerCase().includes('peringkat') ||
                              item.nama_penghargaan.toLowerCase().includes('harapan');

                // REVISI: Ganti kata Piagam/Sertifikat menjadi kata kerja aktif
                let judulBersih = item.nama_penghargaan
                    .replace(/Piagam:\s*/gi, 'Memperoleh ')
                    .replace(/Sertifikat:\s*/gi, 'Menjadi ');

                let cardHTML = `
                    <div class="list-card" style="--card-accent: ${accentColor};" onclick="this.classList.toggle('active')">
                        <h4>${judulBersih} <i class="fas fa-chevron-down icon-chevron"></i></h4>
                        <div class="list-meta">
                            <span><i class="fas fa-building"></i> ${item.pemberi_penghargaan}</span>
                            <span><i class="fas fa-calendar-alt"></i> ${item.tahun}</span>
                        </div>
                        <div class="list-desc">${item.deskripsi}</div>
                    </div>
                `;

                if(isJuara) { juaraContainer.innerHTML += cardHTML; } 
                else { pesertaSainsContainer.innerHTML += cardHTML; }
            });
        }

        // --- RENDER 3, 4, & 6: ORGANISASI VS EVENT VS KEPANITIAAN ---
        const organisasiContainer = document.getElementById('organisasi-container');
        const eventContainer = document.getElementById('event-container');
        const pelatihanContainer = document.getElementById('pelatihan-container');

        if(organisasiData) {
            organisasiData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                let peranLower = item.peran.toLowerCase();
                
                // REVISI: Cek apakah ini tingkatan Pramuka (Garuda, Laksana, Bantara)
                let isTingkatan = peranLower.includes('garuda') || 
                                  peranLower.includes('laksana') || 
                                  peranLower.includes('bantara');

                let iconMeta = isTingkatan ? 'fa-layer-group' : 'fa-users';
                let labelMeta = isTingkatan ? 'Tingkatan yang Diperoleh' : item.nama_organisasi;

                let isPanitia = peranLower.includes('panitia') || peranLower.includes('koordinator');
                let isEvent = peranLower.includes('peserta') || peranLower.includes('partisipan');

                let cardHTML = `
                    <div class="list-card" style="--card-accent: ${accentColor};" onclick="this.classList.toggle('active')">
                        <h4>${item.peran} <i class="fas fa-chevron-down icon-chevron"></i></h4>
                        <div class="list-meta">
                            <span><i class="fas ${iconMeta}"></i> ${labelMeta}</span>
                            <span><i class="fas fa-clock"></i> ${item.tahun}</span>
                        </div>
                        <div class="list-desc">${item.deskripsi}</div>
                    </div>
                `;

                if(isPanitia) { pelatihanContainer.innerHTML += cardHTML; } 
                else if(isEvent) { eventContainer.innerHTML += cardHTML; } 
                else { organisasiContainer.innerHTML += cardHTML; }
            });
        }

        // --- RENDER 5 & 6: SEMINAR VS PELATIHAN ---
        const seminarContainer = document.getElementById('seminar-container');

        if(webinarData) {
            webinarData.forEach((item, index) => {
                let accentColor = colorPalette[(index + 4) % colorPalette.length]; 
                let judulLower = item.judul_acara.toLowerCase();

                // REVISI: Ganti kata Seminar/Webinar jadi "Menjadi" sesuai instruksi
                let judulBersih = item.judul_acara
                    .replace(/Seminar\s+/gi, 'Menjadi ')
                    .replace(/Webinar\s+/gi, 'Menjadi ')
                    .replace(/Visiting Lecture:\s*/gi, 'Mengikuti Kuliah Tamu: ');

                let isPelatihan = judulLower.includes('pelatihan') || judulLower.includes('bimtek') || judulLower.includes('workshop');

                let cardHTML = `
                    <div class="list-card" style="--card-accent: ${accentColor};" onclick="this.classList.toggle('active')">
                        <h4>${judulBersih} <i class="fas fa-chevron-down icon-chevron"></i></h4>
                        <div class="list-meta">
                            <span><i class="fas fa-chalkboard-teacher"></i> ${item.penyelenggara}</span>
                            <span><i class="fas fa-calendar-check"></i> ${item.tahun}</span>
                        </div>
                        <div class="list-desc">${item.keterangan}</div>
                    </div>
                `;

                if(isPelatihan) { pelatihanContainer.innerHTML += cardHTML; } 
                else { seminarContainer.innerHTML += cardHTML; }
            });
        }

        // --- RENDER DATA JEJARING ---
        const networkContainer = document.getElementById('network-container');
        if(profileData.network) {
            profileData.network.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                networkContainer.innerHTML += `
                    <div class="card" style="border-top: 4px solid ${accentColor};">
                        <span class="tech-tag" style="color:${accentColor}; border-color:${accentColor}; background:transparent;">${item.tipe}</span>
                        <h3>${item.nama_kegiatan}</h3>
                        <p><strong>${item.platform_atau_tempat}</strong> | ${item.tahun}</p>
                        <p style="margin-top: 10px; color: var(--text-muted); font-size: 0.9rem;">${item.deskripsi}</p>
                    </div>
                `;
            });
        }

        // --- RENDER DATA PORTOFOLIO WEB ---
        const portfolioContainer = document.getElementById('portfolio-container');
        if(profileData.portofolio) {
            profileData.portofolio.forEach(item => {
                portfolioContainer.innerHTML += `
                    <div class="card">
                        <h3>${item.judul}</h3>
                        <span class="tech-tag">${item.kategori}</span>
                        <p><strong>Masalah:</strong> ${item.konteks_masalah}</p>
                        <p><strong>Solusi:</strong> ${item.solusi_teknis}</p>
                        <a href="${item.link}" target="_blank" style="display:inline-block; margin-top:1rem; color: var(--accent-color); font-weight: bold;">Lihat Case Study &rarr;</a>
                    </div>
                `;
            });
        }

        // --- RENDER DATA INNOVATION LAB ---
        const labContainer = document.getElementById('lab-container');
        if(profileData.innovation_lab) {
            profileData.innovation_lab.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                labContainer.innerHTML += `
                    <div class="card" style="border-left: 4px solid ${accentColor};">
                        <h3>${item.judul_riset}</h3>
                        <span class="tech-tag" style="background-color: var(--bg-alt); color: ${accentColor}; border: 1px solid ${accentColor};">${item.status}</span>
                        <p style="margin-top: 10px; color: var(--text-muted); font-size: 0.9rem;">${item.deskripsi}</p>
                    </div>
                `;
            });
        }

    } catch (error) {
        console.error("Gagal memuat data:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadPortfolioData);