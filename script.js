/* ==========================================================================
   AIFORA PORTFOLIO - MURNI JAVASCRIPT (LOGIKA UI & SUPABASE)
   ========================================================================== */

// --- 1. INISIALISASI GOOGLE TRANSLATE ---
window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
        pageLanguage: 'id', 
        includedLanguages: 'en,id', 
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
};

document.addEventListener('DOMContentLoaded', () => {

    // --- 2. LOGIKA TEMA (DARK/LIGHT) ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    let savedTheme = localStorage.getItem('savedTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if(themeIcon) themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    if(themeBtn) {
        themeBtn.addEventListener('click', () => {
            let currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            localStorage.setItem('savedTheme', newTheme);
        });
    }

    // --- 3. LOGIKA BAHASA (MURNI COOKIE, TANPA ALERT ERROR) ---
    const langBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');

    // Cek apakah cookie saat ini bahasa Inggris
    let currentCookie = document.cookie;
    let isEnglish = currentCookie.includes('/en') || currentCookie.includes('%2Fen');

    if (isEnglish && langText) {
        langText.innerText = 'EN / ID';
    }

    if(langBtn) {
        langBtn.addEventListener('click', () => {
            let targetLang = isEnglish ? 'id' : 'en';

            // Suntik cookie Google Translate
            document.cookie = `googtrans=/id/${targetLang}; path=/`;
            document.cookie = `googtrans=/auto/${targetLang}; path=/`;
            
            let domain = window.location.hostname;
            if (domain !== 'localhost' && domain !== '127.0.0.1') {
                 document.cookie = `googtrans=/id/${targetLang}; path=/; domain=.${domain}`;
            }
            
            // Langsung reload agar Google memuat bahasa baru
            window.location.reload();
        });
    }

    // --- 4. LOGIKA UI LAINNYA ---
    var bodyObj = document.getElementsByTagName('body')[0];
    if(bodyObj) { bodyObj.style.top = '0px'; }

    const mobileToggle = document.getElementById('mobile-nav-toggle');
    if(mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            document.body.classList.toggle('mobile-nav-active');
            this.classList.toggle('fa-bars');
            this.classList.toggle('fa-times');
        });
    }

    const revealCallback = (entries, observer) => { 
        entries.forEach(entry => { 
            if (entry.isIntersecting) { entry.target.classList.add('active'); }
        }); 
    };
    const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => { 
            header.parentElement.classList.toggle('active'); 
        });
    });

    // Panggil API Supabase
    loadPortfolioData();
});

// --- 5. LOGIKA DATABASE SUPABASE ---
const SUPABASE_URL = 'https://xwwlegzacxevmlmtceqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3d2xlZ3phY3hldm1sbXRjZXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MDA2NzEsImV4cCI6MjA5Mzk3NjY3MX0.C9qCfFVN9j8gtvsLVBFGh4I28gIRvJkYlp546-ssEgw';

const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json'
};

const colorPalette = ['#007bff', '#2ecc71', '#9b59b6', '#e67e22', '#e74c3c', '#0ea5e9', '#f43f5e'];

async function loadPortfolioData() {
    try {
        const [resSertifikat, resOrganisasi, resWebinar, resPortofolio, resLab, resNetwork, resLibrary, resSertifikasi] = await Promise.all([
            fetch(`${SUPABASE_URL}/rest/v1/sertifikat?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/organisasi?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/webinar?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/portofolio?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/lab?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/network?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/library?select=*`, { headers }),
            fetch(`${SUPABASE_URL}/rest/v1/sertifikasi?select=*`, { headers })
        ]);

        const sertifikatData = await resSertifikat.json();
        const organisasiData = await resOrganisasi.json();
        const webinarData = await resWebinar.json();
        const portofolioData = await resPortofolio.json();
        const labData = await resLab.json();
        const networkData = await resNetwork.json();
        const libraryData = await resLibrary.json();
        const sertifikasiData = await resSertifikasi.json(); 

        const juaraContainer = document.getElementById('juara-container');
        const pesertaSainsContainer = document.getElementById('peserta-sains-container');

        if(sertifikatData && sertifikatData.length > 0) {
            sertifikatData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                let isJuara = item.nama_penghargaan.toLowerCase().includes('piagam') || 
                              item.nama_penghargaan.toLowerCase().includes('juara') || 
                              item.nama_penghargaan.toLowerCase().includes('peringkat') ||
                              item.nama_penghargaan.toLowerCase().includes('harapan');
                let judulBersih = item.nama_penghargaan.replace(/Piagam:\s*/gi, 'Memperoleh ').replace(/Sertifikat:\s*/gi, 'Menjadi ');

                let cardHTML = `
                    <div class="list-card" style="--card-accent: ${accentColor};" onclick="this.classList.toggle('active')">
                        <h4>${judulBersih} <i class="fas fa-chevron-down icon-chevron"></i></h4>
                        <div class="list-meta">
                            <span><i class="fas fa-building"></i> ${item.pemberi_penghargaan}</span>
                            <span><i class="fas fa-calendar-alt"></i> ${item.tahun}</span>
                        </div>
                        <div class="list-desc">${item.deskripsi || '-'}</div>
                    </div>`;

                if(isJuara && juaraContainer) { juaraContainer.innerHTML += cardHTML; } 
                else if(pesertaSainsContainer) { pesertaSainsContainer.innerHTML += cardHTML; }
            });
        }

        const organisasiContainer = document.getElementById('organisasi-container');
        const eventContainer = document.getElementById('event-container');
        const pelatihanContainer = document.getElementById('pelatihan-container');

        if(organisasiData && organisasiData.length > 0) {
            organisasiData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                let peranLower = item.peran.toLowerCase();
                let isTingkatan = peranLower.includes('garuda') || peranLower.includes('laksana') || peranLower.includes('bantara');
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
                    </div>`;

                if(isPanitia && pelatihanContainer) { pelatihanContainer.innerHTML += cardHTML; } 
                else if(isEvent && eventContainer) { eventContainer.innerHTML += cardHTML; } 
                else if(organisasiContainer) { organisasiContainer.innerHTML += cardHTML; }
            });
        }

        const seminarContainer = document.getElementById('seminar-container');
        if(webinarData && webinarData.length > 0) {
            webinarData.forEach((item, index) => {
                let accentColor = colorPalette[(index + 4) % colorPalette.length]; 
                let judulLower = item.judul_acara.toLowerCase();
                let judulBersih = item.judul_acara.replace(/Seminar\s+/gi, 'Menjadi ').replace(/Webinar\s+/gi, 'Menjadi ').replace(/Visiting Lecture:\s*/gi, 'Mengikuti Kuliah Tamu: ');
                let isPelatihan = judulLower.includes('pelatihan') || judulLower.includes('bimtek') || judulLower.includes('workshop');

                let cardHTML = `
                    <div class="list-card" style="--card-accent: ${accentColor};" onclick="this.classList.toggle('active')">
                        <h4>${judulBersih} <i class="fas fa-chevron-down icon-chevron"></i></h4>
                        <div class="list-meta">
                            <span><i class="fas fa-chalkboard-teacher"></i> ${item.penyelenggara}</span>
                            <span><i class="fas fa-calendar-check"></i> ${item.tahun}</span>
                        </div>
                        <div class="list-desc">${item.keterangan || '-'}</div>
                    </div>`;

                if(isPelatihan && pelatihanContainer) { pelatihanContainer.innerHTML += cardHTML; } 
                else if(seminarContainer) { seminarContainer.innerHTML += cardHTML; }
            });
        }

        if(sertifikasiData && sertifikasiData.length > 0) {
            sertifikasiData.forEach((item, index) => {
                let accentColor = colorPalette[(index + 2) % colorPalette.length];
                let cardHTML = `
                    <div class="list-card" style="--card-accent: ${accentColor};" onclick="this.classList.toggle('active')">
                        <h4>${item.nama_sertifikasi} <i class="fas fa-chevron-down icon-chevron"></i></h4>
                        <div class="list-meta">
                            <span><i class="fas fa-certificate"></i> ${item.penerbit}</span>
                            <span><i class="fas fa-calendar-alt"></i> ${item.tanggal_terbit}</span>
                        </div>
                        <div class="list-desc">
                            Lisensi / Sertifikasi Profesional.
                            ${item.link_kredensial ? `<br><br><a href="${item.link_kredensial}" target="_blank" style="color: ${accentColor}; text-decoration: none; font-weight: bold;"><i class="fas fa-external-link-alt"></i> Verifikasi Kredensial</a>` : ''}
                        </div>
                    </div>`;
                if(pelatihanContainer) { pelatihanContainer.innerHTML += cardHTML; } 
            });
        }

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
                    </div>`;
            });
        }

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
                    </div>`;
            });
        }

        const labContainer = document.getElementById('lab-container');
        if(labData && labData.length > 0 && labContainer) {
            labData.forEach((item, index) => {
                let accentColor = colorPalette[(index + 2) % colorPalette.length];
                labContainer.innerHTML += `
                    <div class="card" style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; border-left: 4px solid ${accentColor}; box-shadow: var(--shadow);">
                        <h3 style="margin-top:0; color: var(--text-color);">${item.judul_riset}</h3>
                        <span class="tech-tag" style="color: ${accentColor}; border: 1px solid ${accentColor}; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">${item.status}</span>
                        <p style="margin-top: 15px; color: var(--text-muted); font-size: 0.95rem;">${item.deskripsi || item.Deskripsi || '-'}</p>
                    </div>`;
            });
        }

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
                    </div>`;
            });
        }
    } catch (error) {
        console.error("Gagal memuat data dari Supabase:", error);
    }
}
