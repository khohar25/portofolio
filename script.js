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

// --- 2. KONFIGURASI SUPABASE ---
const SUPABASE_URL = 'https://xwwlegzacxevmlmtceqh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_XOx2kuvillkXt606CwAtiw_Vax_EvQL';

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
};

// --- 3. FETCH, FILTER, & RENDER DATA DARI SUPABASE ---
async function loadPortfolioData() {
    try {
        const [resSertifikat, resOrganisasi, resWebinar, resPortofolio, resLab, resNetwork, resLibrary] = await Promise.all([
            fetch(`${SUPABASE_URL}/rest/v1/sertifikat?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/organisasi?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/webinar?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/portofolio?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/lab?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/network?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/library?select=*`, { headers })
        ]);

        const sertifikatData = await resSertifikat.json();
        const organisasiData = await resOrganisasi.json();
        const webinarData = await resWebinar.json();
        const portofolioData = await resPortofolio.json();
        const labData = await resLab.json();
        const networkData = await resNetwork.json();
        const libraryData = await resLibrary.json();

        // --- RENDER 1 & 2: PENGHARGAAN VS PESERTA SAINS ---
        const juaraContainer = document.getElementById('juara-container');
        const pesertaSainsContainer = document.getElementById('peserta-sains-container');

        if(sertifikatData && sertifikatData.length > 0) {
            sertifikatData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                
                let isJuara = item.nama_penghargaan.toLowerCase().includes('piagam') || 
                              item.nama_penghargaan.toLowerCase().includes('juara') || 
                              item.nama_penghargaan.toLowerCase().includes('peringkat') ||
                              item.nama_penghargaan.toLowerCase().includes('harapan');

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
                        <div class="list-desc">${item.deskripsi || '-'}</div>
                    </div>
                `;

                if(isJuara && juaraContainer) { juaraContainer.innerHTML += cardHTML; } 
                else if(pesertaSainsContainer) { pesertaSainsContainer.innerHTML += cardHTML; }
            });
        }

        // --- RENDER 3, 4, & 6: ORGANISASI VS EVENT VS KEPANITIAAN ---
        const organisasiContainer = document.getElementById('organisasi-container');
        const eventContainer = document.getElementById('event-container');
        const pelatihanContainer = document.getElementById('pelatihan-container');

        if(organisasiData && organisasiData.length > 0) {
            organisasiData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                let peranLower = item.peran.toLowerCase();
                
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
                        <div class="list-desc">${item.deskripsi || '-'}</div>
                    </div>
                `;

                if(isPanitia && pelatihanContainer) { pelatihanContainer.innerHTML += cardHTML; } 
                else if(isEvent && eventContainer) { eventContainer.innerHTML += cardHTML; } 
                else if(organisasiContainer) { organisasiContainer.innerHTML += cardHTML; }
            });
        }

        // --- RENDER 5 & 6: SEMINAR VS PELATIHAN ---
        const seminarContainer = document.getElementById('seminar-container');

        if(webinarData && webinarData.length > 0) {
            webinarData.forEach((item, index) => {
                let accentColor = colorPalette[(index + 4) % colorPalette.length]; 
                let judulLower = item.judul_acara.toLowerCase();

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
                        <div class="list-desc">${item.keterangan || '-'}</div>
                    </div>
                `;

                if(isPelatihan && pelatihanContainer) { pelatihanContainer.innerHTML += cardHTML; } 
                else if(seminarContainer) { seminarContainer.innerHTML += cardHTML; }
            });
        }

        // --- RENDER DATA JEJARING (NETWORK) ---
        const networkContainer = document.getElementById('network-container');
        if(networkData && networkData.length > 0 && networkContainer) {
            networkData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                networkContainer.innerHTML += `
                    <div class="card" style="border-top: 4px solid ${accentColor}; padding: 1.5rem; background: var(--card-bg); border-radius: 12px; box-shadow: var(--shadow);">
                        <span class="tech-tag" style="color:${accentColor}; border: 1px solid ${accentColor}; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem;">${item.tipe}</span>
                        <h3 style="margin: 15px 0 5px 0; color: var(--text-color);">${item.nama_kegiatan}</h3>
                        <p style="margin:0; font-size: 0.9rem;"><strong>${item.platform_atau_tempat}</strong> | ${item.tahun}</p>
                        <p style="margin-top: 15px; color: var(--text-muted); font-size: 0.95rem;">${item.deskripsi || ''}</p>
                    </div>
                `;
            });
        }

        // --- RENDER DATA PORTOFOLIO WEB ---
        const portfolioContainer = document.getElementById('portfolio-container');
        if(portofolioData && portofolioData.length > 0 && portfolioContainer) {
            portofolioData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                portfolioContainer.innerHTML += `
                    <div class="card" style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; border-left: 4px solid ${accentColor}; box-shadow: var(--shadow);">
                        <h3 style="margin-top:0; color: var(--text-color);">${item.judul}</h3>
                        <span class="tech-tag" style="background: rgba(20,157,221,0.1); color: var(--accent-color); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">${item.kategori}</span>
                        <div style="margin-top: 15px;">
                            <p style="font-size: 0.95rem; margin-bottom: 8px;"><strong style="color:var(--text-color);">Masalah:</strong> <span style="color:var(--text-muted);">${item.konteks_masalah || '-'}</span></p>
                            <p style="font-size: 0.95rem;"><strong style="color:var(--text-color);">Solusi:</strong> <span style="color:var(--text-muted);">${item.solusi_teknis || '-'}</span></p>
                        </div>
                        ${item.link ? `<a href="${item.link}" target="_blank" style="display:inline-block; margin-top:1.5rem; color: var(--accent-color); font-weight: bold;"><i class="fas fa-external-link-alt"></i> Lihat Case Study</a>` : ''}
                    </div>
                `;
            });
        }

        // --- RENDER DATA INNOVATION LAB ---
        const labContainer = document.getElementById('lab-container');
        if(labData && labData.length > 0 && labContainer) {
            labData.forEach((item, index) => {
                let accentColor = colorPalette[(index + 2) % colorPalette.length];
                labContainer.innerHTML += `
                    <div class="card" style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; border-left: 4px solid ${accentColor}; box-shadow: var(--shadow);">
                        <h3 style="margin-top:0; color: var(--text-color);">${item.judul_riset}</h3>
                        <span class="tech-tag" style="color: ${accentColor}; border: 1px solid ${accentColor}; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">${item.status}</span>
                        <p style="margin-top: 15px; color: var(--text-muted); font-size: 0.95rem;">${item.deskripsi}</p>
                    </div>
                `;
            });
        }

        // --- RENDER DATA LIBRARY (KARYA TULIS) ---
        const libraryContainer = document.getElementById('library-container');
        if(libraryData && libraryData.length > 0 && libraryContainer) {
            libraryData.forEach((item, index) => {
                let accentColor = colorPalette[(index + 3) % colorPalette.length];
                libraryContainer.innerHTML += `
                    <div class="card" style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; border-top: 4px solid ${accentColor}; box-shadow: var(--shadow);">
                        <h3 style="margin-top:0; color: var(--text-color);">${item.judul}</h3>
                        <span class="tech-tag" style="color: ${accentColor}; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; background: rgba(0,0,0,0.05);">${item.kategori}</span>
                        <p style="margin-top: 15px; color: var(--text-muted); font-size: 0.95rem;">${item.deskripsi}</p>
                        ${item.link ? `<a href="${item.link}" target="_blank" style="display:inline-block; margin-top:1.5rem; color: ${accentColor}; font-weight: bold;"><i class="fas fa-book-reader"></i> Baca Karya</a>` : ''}
                    </div>
                `;
            });
        }

    } catch (error) {
        console.error("Gagal memuat data dari Supabase:", error);
    }
}

document.addEventListener('DOMContentLoaded', loadPortfolioData);
