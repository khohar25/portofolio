/* ==========================================================================
   AIFORA PORTFOLIO - JS MURNI (ULTRA-FAST & ZERO-LAG ARCHITECTURE)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileDrawerClose = document.getElementById('mobile-drawer-close');
    const mobileDrawerBackdrop = document.getElementById('mobile-drawer-backdrop');

    // --- 1. MOBILE DRAWER NAVIGATION LOGIC ---
    function openMobileMenu() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.add('active');
        document.body.classList.add('mobile-nav-active');
        if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'true');
        mobileDrawer.setAttribute('aria-hidden', 'false');
    }

    function closeMobileMenu() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('active');
        document.body.classList.remove('mobile-nav-active');
        if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
    }

    mobileMenuToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (mobileDrawer?.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileDrawerClose?.addEventListener('click', closeMobileMenu);
    mobileDrawerBackdrop?.addEventListener('click', closeMobileMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // --- 2. LOGIKA SCROLL PAKSA & SCROLLSPY ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            let targetId = this.getAttribute('href');
            
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault(); 
                closeMobileMenu();
                let targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offset = 80; // offset for floating navbar
                    const bodyRect = document.body.getBoundingClientRect().top;
                    const elementRect = targetSection.getBoundingClientRect().top;
                    const elementPosition = elementRect - bodyRect;
                    const offsetPosition = elementPosition - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}` && current !== '') {
                link.classList.add('active');
            }
        });
    });

    // --- 2. THEME LOGIC ---
    const themeBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    let savedTheme = localStorage.getItem('savedTheme') || 'dark';

    document.documentElement.setAttribute('data-theme', savedTheme);
    if(themeIcon) themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

    themeBtn?.addEventListener('click', () => {
        let currentTheme = document.documentElement.getAttribute('data-theme');
        let newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        if(themeIcon) themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('savedTheme', newTheme);
    });

    // --- 3. LANGUAGE LOGIC (NATIVE - INSTANT ZERO-LAG) ---
    const langBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');
    let currentLang = localStorage.getItem('prefLang') || 'en';

    function applyLanguage(lang) {
        // Ganti Teks Statis Seketika (0 ms)
        document.querySelectorAll('[data-id]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) el.innerHTML = text;
        });

        // Update Label Tombol
        if(langText) langText.innerText = lang.toUpperCase() === 'EN' ? 'EN / ID' : 'ID / EN';

        // Simpan Memori
        localStorage.setItem('prefLang', lang);
        currentLang = lang;

        // Muat / Segarkan Artikel Sesuai Bahasa (Non-blocking & Cepat)
        loadDynamicArticles(lang);
    }

    langBtn?.addEventListener('click', () => {
        const nextLang = currentLang === 'en' ? 'id' : 'en';
        applyLanguage(nextLang);
    });

    // --- 4. REVEAL OBSERVER ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) {
                entry.target.classList.add('active'); 
            }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // Inisialisasi Pertama Kali (Instan)
    applyLanguage(currentLang);
});

// --- 5. DATA & ARTICLE SYNC LOGIC (ANTI-MACET / NON-BLOCKING) ---
const SUPABASE_URL = 'https://whbmyhxjinbyakwyuxnrd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoYm15aHhpbmJ5YWt3eXV4bnJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0NDQxMzksImV4cCI6MjEwNjAyMDEzOX0.XsSwtCZCdIviu1opTvGynnvECrYKrGIRugy2CiN_gec';
const headers = { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json' };

// Helper fetch dengan timeout ketat (AbortController) agar web tidak pernah freeze/macet
async function fetchSafeWithTimeout(url, options = {}, timeoutMs = 1200) {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(timer);
        if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) return data;
        }
    } catch (e) {
        // Network timeout / DNS offline
    }
    return null;
}

// Fungsi Muat Artikel Cepat (Local-First + Background Supabase Revalidation)
async function loadDynamicArticles(lang = 'en') {
    const articleContainer = document.getElementById('article-preview-container');
    if (!articleContainer) return;

    // 1. Ambil data lokal terlebih dahulu (Instan < 5ms)
    let localArticles = null;
    try {
        const res = await fetch('artikel.json');
        if (res.ok) {
            localArticles = await res.json();
        }
    } catch (e) {
        // Abaikan jika offline
    }

    // Jika container masih kosong atau ingin dirender ulang sesuai bahasa
    if (localArticles && localArticles.length > 0) {
        renderArticles(localArticles, lang);
    }

    // 2. Coba fetch dari Supabase di background dengan batas waktu 1.2 detik
    try {
        let remoteArticles = await fetchSafeWithTimeout(`${SUPABASE_URL}/rest/v1/tabel_artikel?select=*&order=created_at.desc`, { headers }, 1200);
        if (!remoteArticles || remoteArticles.length === 0) {
            remoteArticles = await fetchSafeWithTimeout(`${SUPABASE_URL}/rest/v1/artikel?select=*&order=created_at.desc`, { headers }, 1200);
        }

        if (remoteArticles && remoteArticles.length > 0) {
            renderArticles(remoteArticles, lang);
        }
    } catch (err) {
        // Silent fallback jika Supabase belum aktif / sedang pause
    }
}

// Helper Render Kartu Artikel Sesuai Standar Desain Bento Modern
function renderArticles(articleList, lang = 'en') {
    const articleContainer = document.getElementById('article-preview-container');
    if (!articleContainer || !Array.isArray(articleList) || articleList.length === 0) return;

    articleContainer.innerHTML = '';
    articleList.slice(0, 4).forEach(item => {
        const title = (lang === 'en' && item.judul_en) ? item.judul_en : item.judul;
        const excerpt = (lang === 'en' && item.deskripsi_en) ? item.deskripsi_en : item.deskripsi;
        const readLabel = lang === 'en' ? 'Read Article' : 'Baca Selengkapnya';
        const articleLink = item.link || 'https://khohar25.github.io/artikel/';

        const card = document.createElement('div');
        card.className = 'article-entry-card reveal active';
        card.innerHTML = `
            <span class="article-cat">${item.kategori || 'Article'}</span>
            <h4 class="article-heading notranslate">${title}</h4>
            <p class="article-excerpt">${excerpt || ''}</p>
            <a href="${articleLink}" target="_blank" class="project-footer-link">
                <span>${readLabel}</span> <i class="fas fa-arrow-right"></i>
            </a>
        `;
        articleContainer.appendChild(card);
    });
}
