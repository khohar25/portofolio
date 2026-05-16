/* ==========================================================================
   AIFORA PORTFOLIO - JS MURNI (SCROLL PAKSA & ANTI MACET)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    // --- 1. LOGIKA SCROLL PAKSA & SCROLLSPY ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            let targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault(); 
                let targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    window.scrollTo({ top: targetSection.offsetTop, behavior: 'smooth' });
                }
                
                if (document.body.classList.contains('mobile-nav-active')) {
                    document.body.classList.remove('mobile-nav-active');
                    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
                    if(mobileNavToggle){
                        mobileNavToggle.classList.remove('fa-times');
                        mobileNavToggle.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // --- 2. THEME LOGIC ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    let savedTheme = localStorage.getItem('savedTheme') || 'light';

    document.documentElement.setAttribute('data-theme', savedTheme);
    if(themeIcon) themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    themeBtn?.addEventListener('click', () => {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('savedTheme', newTheme);
    });

    // --- 3. LANGUAGE LOGIC (NATIVE) ---
    const langBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    let currentLang = localStorage.getItem('prefLang') || 'id';

    function applyLanguage(lang) {
        // Ganti Teks Statis
        document.querySelectorAll('[data-id]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) el.innerText = text;
        });

        // Update Label Tombol
        if(langText) langText.innerText = lang.toUpperCase() === 'ID' ? 'ID / EN' : 'EN / ID';

        // Simpan Memori
        localStorage.setItem('prefLang', lang);
        currentLang = lang;

        // Panggil Ulang Supabase dengan Bahasa yang Dipilih
        loadPortfolioData(lang);
    }

    langBtn?.addEventListener('click', () => {
        const nextLang = currentLang === 'id' ? 'en' : 'id';
        applyLanguage(nextLang);
    });

    // --- 4. UI MISC ---
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            document.body.classList.toggle('mobile-nav-active');
            this.classList.toggle('fa-bars');
            this.classList.toggle('fa-times');
        });
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Event Delegasi untuk Accordion (karena isi kontennya dinamis)
    document.querySelector('.track-record-grid').addEventListener('click', function(e) {
        const header = e.target.closest('.accordion-header');
        if (header) {
            header.parentElement.classList.toggle('active');
        }
    });

    // Inisialisasi Pertama Kali
    applyLanguage(currentLang);
});

// --- 5. SUPABASE DATA LOGIC ---
const SUPABASE_URL = 'https://xwwlegzacxevmlmtceqh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3d2xlZ3phY3hldm1sbXRjZXFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MDA2NzEsImV4cCI6MjA5Mzk3NjY3MX0.C9qCfFVN9j8gtvsLVBFGh4I28gIRvJkYlp546-ssEgw';
const headers = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };
const colorPalette = ['#007bff', '#2ecc71', '#9b59b6', '#e67e22', '#e74c3c', '#0ea5e9', '#f43f5e'];

// Modifikasi fungsi agar menerima parameter bahasa (lang)
async function loadPortfolioData(lang = 'id') {
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
        if(juaraContainer) juaraContainer.innerHTML = '';
        if(pesertaSainsContainer) pesertaSainsContainer.innerHTML = '';

        if(sertifikatData && sertifikatData.length > 0) {
            sertifikatData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                let isJuara = item.nama_penghargaan.toLowerCase().includes('piagam') || item.nama_penghargaan.toLowerCase().includes('juara') || item.nama_penghargaan.toLowerCase().includes('peringkat') || item.nama_penghargaan.toLowerCase().includes('harapan');
                
                let judulBersih = item.nama_penghargaan;
                if(lang === 'id') {
                    judulBersih = judulBersih.replace(/Piagam:\s*/gi, 'Memperoleh ').replace(/Sertifikat:\s*/gi, 'Menjadi ');
                } else {
                    judulBersih = judulBersih.replace(/Piagam:\s*/gi, 'Obtained ').replace(/Sertifikat:\s*/gi, 'Became ');
                }

                // Logika ganti bahasa database
                let descFinal = (lang === 'en' && item.deskripsi_en) ? item.deskripsi_en : item.deskripsi;

                // --- LOGIKA PATCH OTOMATIS MENGUBAH TEKS "PROGRAM STUDI FISIKA" ---
                if (descFinal) {
                    descFinal = descFinal.replace(/program studi Fisika/gi, 'program studi D4 Teknik Informatika, pada bidang lomba Fisika');
                    // Jika ada teks bahasa Inggrisnya yang salah juga
                    descFinal = descFinal.replace(/Physics study program/gi, 'D4 Informatics Engineering study program, in the Physics category');
                }

                let cardHTML = `<div class="list-card" style="--card-accent: ${accentColor};" onclick="this.classList.toggle('active')"><h4>${judulBersih} <i class="fas fa-chevron-down icon-chevron"></i></h4><div class="list-meta"><span><i class="fas fa-building"></i> ${item.pemberi_penghargaan}</span><span><i class="fas fa-calendar-alt"></i> ${item.tahun}</span></div><div class="list-desc">${descFinal || '-'}</div></div>`;

                if(isJuara && juaraContainer) { juaraContainer.innerHTML += cardHTML; } else if(pesertaSainsContainer) { pesertaSainsContainer.innerHTML += cardHTML; }
            });
        }

        const organisasiContainer = document.getElementById('organisasi-container');
        const eventContainer = document.getElementById('event-container');
        const pelatihanContainer = document.getElementById('pelatihan-container');
        if(organisasiContainer) organisasiContainer.innerHTML = '';
        if(eventContainer) eventContainer.innerHTML = '';
        if(pelatihanContainer) pelatihanContainer.innerHTML = '';

        if(organisasiData && organisasiData.length > 0) {
            organisasiData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                let peranLower = item.peran.toLowerCase();
                let isTingkatan = peranLower.includes('garuda') || peranLower.includes('laksana') || peranLower.includes('bantara');
                let iconMeta = isTingkatan ? 'fa-layer-group' : 'fa-users';
                
                let labelMetaTitle = isTingkatan ? (lang === 'en' ? 'Rank Obtained' : 'Tingkatan yang Diperoleh') : item.nama_organisasi;
                let isPanitia = peranLower.includes('panitia') || peranLower.includes('koordinator');
                let isEvent = peranLower.includes('peserta') || peranLower.includes('partisipan');
                
                let descFinal = (lang === 'en' && item.deskripsi_en) ? item.deskripsi_en : item.deskripsi;

                let cardHTML = `<div class="list-card" style="--card-accent: ${accentColor};" onclick="this.classList.toggle('active')"><h4>${item.peran} <i class="fas fa-chevron-down icon-chevron"></i></h4><div class="list-meta"><span><i class="fas ${iconMeta}"></i> ${labelMetaTitle}</span><span><i class="fas fa-clock"></i> ${item.tahun}</span></div><div class="list-desc">${descFinal || '-'}</div></div>`;

                if(isPanitia && pelatihanContainer) { pelatihanContainer.innerHTML += cardHTML; } else if(isEvent && eventContainer) { eventContainer.innerHTML += cardHTML; } else if(organisasiContainer) { organisasiContainer.innerHTML += cardHTML; }
            });
        }

        const seminarContainer = document.getElementById('seminar-container');
        if(seminarContainer) seminarContainer.innerHTML = '';

        if(webinarData && webinarData.length > 0) {
            webinarData.forEach((item, index) => {
                let accentColor = colorPalette[(index + 4) % colorPalette.length]; 
                let judulLower = item.judul_acara.toLowerCase();
                
                let judulBersih = item.judul_acara;
                if(lang === 'id') {
                    judulBersih = judulBersih.replace(/Seminar\s+/gi, 'Menjadi ').replace(/Webinar\s+/gi, 'Menjadi ').replace(/Visiting Lecture:\s*/gi, 'Mengikuti Kuliah Tamu: ');
                } else {
                    judulBersih = judulBersih.replace(/Seminar\s+/gi, 'Attended ').replace(/Webinar\s+/gi, 'Attended ').replace(/Visiting Lecture:\s*/gi, 'Attended Guest Lecture: ');
                }

                let isPelatihan = judulLower.includes('pelatihan') || judulLower.includes('bimtek') || judulLower.includes('workshop');
                let descFinal = (lang === 'en' && item.keterangan_en) ? item.keterangan_en : item.keterangan;

                let cardHTML = `<div class="list-card" style="--card-accent: ${accentColor};" onclick="this.classList.toggle('active')"><h4>${judulBersih} <i class="fas fa-chevron-down icon-chevron"></i></h4><div class="list-meta"><span><i class="fas fa-chalkboard-teacher"></i> ${item.penyelenggara}</span><span><i class="fas fa-calendar-check"></i> ${item.tahun}</span></div><div class="list-desc">${descFinal || '-'}</div></div>`;

                if(isPelatihan && pelatihanContainer) { pelatihanContainer.innerHTML += cardHTML; } else if(seminarContainer) { seminarContainer.innerHTML += cardHTML; }
            });
        }

        if(sertifikasiData && sertifikasiData.length > 0) {
            sertifikasiData.forEach((item, index) => {
                let accentColor = colorPalette[(index + 2) % colorPalette.length];
                let labelDesc = lang === 'en' ? 'Professional License / Certification.' : 'Lisensi / Sertifikasi Profesional.';
                let labelVerif = lang === 'en' ? 'Verify Credential' : 'Verifikasi Kredensial';

                let cardHTML = `<div class="list-card" style="--card-accent: ${accentColor};" onclick="this.classList.toggle('active')"><h4>${item.nama_sertifikasi} <i class="fas fa-chevron-down icon-chevron"></i></h4><div class="list-meta"><span><i class="fas fa-certificate"></i> ${item.penerbit}</span><span><i class="fas fa-calendar-alt"></i> ${item.tanggal_terbit}</span></div><div class="list-desc">${labelDesc}${item.link_kredensial ? `<br><br><a href="${item.link_kredensial}" target="_blank" style="color: ${accentColor}; text-decoration: none; font-weight: bold;"><i class="fas fa-external-link-alt"></i> ${labelVerif}</a>` : ''}</div></div>`;
                if(pelatihanContainer) { pelatihanContainer.innerHTML += cardHTML; } 
            });
        }

        const networkContainer = document.getElementById('network-container');
        if(networkContainer) networkContainer.innerHTML = '';
        if(networkData && networkData.length > 0 && networkContainer) {
            networkData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                let descFinal = (lang === 'en' && item.deskripsi_en) ? item.deskripsi_en : item.deskripsi;
                networkContainer.innerHTML += `<div class="card" style="border-top: 4px solid ${accentColor}; padding: 1.5rem; background: var(--card-bg); border-radius: 12px; box-shadow: var(--shadow); backdrop-filter: blur(10px);"><span class="tech-tag" style="color:${accentColor}; border: 1px solid ${accentColor}; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem;">${item.tipe}</span><h3 style="margin: 15px 0 5px 0; color: var(--text-color);">${item.nama_kegiatan}</h3><p style="margin:0; font-size: 0.9rem;"><strong>${item.platform_atau_tempat}</strong> | ${item.tahun}</p><p style="margin-top: 15px; color: var(--text-muted); font-size: 0.95rem;">${descFinal || ''}</p></div>`;
            });
        }

        const portfolioContainer = document.getElementById('portfolio-container');
        if(portfolioContainer) portfolioContainer.innerHTML = '';
        if(portofolioData && portofolioData.length > 0 && portfolioContainer) {
            portofolioData.forEach((item, index) => {
                let accentColor = colorPalette[index % colorPalette.length];
                let masalahFinal = (lang === 'en' && item.konteks_masalah_en) ? item.konteks_masalah_en : item.konteks_masalah;
                let solusiFinal = (lang === 'en' && item.solusi_teknis_en) ? item.solusi_teknis_en : item.solusi_teknis;
                let lblMasalah = lang === 'en' ? 'Problem:' : 'Masalah:';
                let lblSolusi = lang === 'en' ? 'Solution:' : 'Solusi:';
                let lblLink = lang === 'en' ? 'View Case Study' : 'Lihat Case Study';

                portfolioContainer.innerHTML += `<div class="card" style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; border-left: 4px solid ${accentColor}; box-shadow: var(--shadow); backdrop-filter: blur(10px);"><h3 style="margin-top:0; color: var(--text-color);">${item.judul}</h3><span class="tech-tag" style="background: rgba(20,157,221,0.1); color: var(--accent-color); padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">${item.kategori}</span><div style="margin-top: 15px;"><p style="font-size: 0.95rem; margin-bottom: 8px;"><strong style="color:var(--text-color);">${lblMasalah}</strong> <span style="color:var(--text-muted);">${masalahFinal || '-'}</span></p><p style="font-size: 0.95rem;"><strong style="color:var(--text-color);">${lblSolusi}</strong> <span style="color:var(--text-muted);">${solusiFinal || '-'}</span></p></div>${item.link ? `<a href="${item.link}" target="_blank" style="display:inline-block; margin-top:1.5rem; color: var(--accent-color); font-weight: bold;"><i class="fas fa-external-link-alt"></i> ${lblLink}</a>` : ''}</div>`;
            });
        }

        const labContainer = document.getElementById('lab-container');
        if(labContainer) labContainer.innerHTML = '';
        if(labData && labData.length > 0 && labContainer) {
            labData.forEach((item, index) => {
                let accentColor = colorPalette[(index + 2) % colorPalette.length];
                let descFinal = (lang === 'en' && item.deskripsi_en) ? item.deskripsi_en : (item.deskripsi || item.Deskripsi);
                labContainer.innerHTML += `<div class="card" style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; border-left: 4px solid ${accentColor}; box-shadow: var(--shadow); backdrop-filter: blur(10px);"><h3 style="margin-top:0; color: var(--text-color);">${item.judul_riset}</h3><span class="tech-tag" style="color: ${accentColor}; border: 1px solid ${accentColor}; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem;">${item.status}</span><p style="margin-top: 15px; color: var(--text-muted); font-size: 0.95rem;">${descFinal || '-'}</p></div>`;
            });
        }

        const libraryContainer = document.getElementById('library-container');
        if(libraryContainer) libraryContainer.innerHTML = '';
        if(libraryData && libraryData.length > 0 && libraryContainer) {
            libraryData.forEach((item, index) => {
                let accentColor = colorPalette[(index + 3) % colorPalette.length];
                let descFinal = (lang === 'en' && item.deskripsi_en) ? item.deskripsi_en : item.deskripsi;
                let lblRead = lang === 'en' ? 'Read Work' : 'Baca Karya';

                libraryContainer.innerHTML += `<div class="card" style="background: var(--card-bg); padding: 1.5rem; border-radius: 12px; border-top: 4px solid ${accentColor}; box-shadow: var(--shadow); backdrop-filter: blur(10px);"><h3 style="margin-top:0; color: var(--text-color);">${item.judul}</h3><span class="tech-tag" style="color: ${accentColor}; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; background: rgba(0,0,0,0.05);">${item.kategori}</span><p style="margin-top: 15px; color: var(--text-muted); font-size: 0.95rem;">${descFinal || '-'}</p>${item.link ? `<a href="${item.link}" target="_blank" style="display:inline-block; margin-top:1.5rem; color: ${accentColor}; font-weight: bold;"><i class="fas fa-book-reader"></i> ${lblRead}</a>` : ''}</div>`;
            });
        }
    } catch (error) { console.error("Gagal memuat data:", error); }
}
