/* ==========================================================================
   AIFORA PORTFOLIO - JS MURNI (ULTRA-FAST & ZERO-LAG ARCHITECTURE)
   ATMOSPHERIC AMBIENT ENGINE (ANTI-AI-SLOP 60FPS CANVAS & CELESTIAL HORIZON)
   ========================================================================== */

class AmbientAtmosphere {
    constructor() {
        this.canvas = document.getElementById('ambient-canvas');
        this.flashEl = document.getElementById('lightning-flash');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.mode = localStorage.getItem('portfolioAtmosphere') || (prefersReducedMotion ? 'off' : 'fusion');
        this.isRunning = false;
        this.animationId = null;
        this.lightningTimer = null;
        this.shootingStarTimer = null;

        this.width = 0;
        this.height = 0;
        this.dpr = 1;

        this.drops = [];
        this.motes = [];
        this.ripples = [];
        this.shootingStars = [];

        // Genshin Elemental Palette: Hydro/Sky Cyan, Fontaine/Anemo Teal, Inazuma Violet, Geo/Starlight Amber
        this.colors = [
            { r: 56, g: 189, b: 248 },
            { r: 45, g: 212, b: 191 },
            { r: 168, g: 85, b: 247 },
            { r: 250, g: 204, b: 21 }
        ];

        this.init();
    }

    init() {
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());

        // Respect battery & hidden tabs
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else if (this.mode !== 'off') {
                this.startAnimation();
            }
        });

        // Set initial state
        this.applyMode(this.mode, false);
    }

    handleResize() {
        if (!this.canvas) return;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = Math.floor(this.width * this.dpr);
        this.canvas.height = Math.floor(this.height * this.dpr);
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;

        if (this.ctx) {
            this.ctx.setTransform(1, 0, 0, 1, 0, 0);
            this.ctx.scale(this.dpr, this.dpr);
        }

        this.repopulate();
    }

    repopulate() {
        const isMobile = this.width <= 768;
        const dropCount = isMobile ? 35 : 75;
        const moteCount = isMobile ? 18 : 38;

        // Populate Drops (Multi-depth rain)
        this.drops = [];
        for (let i = 0; i < dropCount; i++) {
            const layer = Math.random() < 0.45 ? 1 : (Math.random() < 0.8 ? 2 : 3);
            this.drops.push({
                x: Math.random() * (this.width + 120) - 60,
                y: Math.random() * this.height,
                layer: layer,
                speed: layer === 1 ? 7 + Math.random() * 3 : (layer === 2 ? 13 + Math.random() * 4 : 21 + Math.random() * 5),
                len: layer === 1 ? 14 + Math.random() * 10 : (layer === 2 ? 26 + Math.random() * 12 : 44 + Math.random() * 18),
                alpha: layer === 1 ? 0.16 : (layer === 2 ? 0.28 : 0.42),
                thickness: layer === 3 ? 1.3 : 1.0,
                wind: 1.2 + Math.random() * 0.7
            });
        }

        // Populate Motes (Celestial Elemental Spores)
        this.motes = [];
        for (let i = 0; i < moteCount; i++) {
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            this.motes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                baseRadius: 1.2 + Math.random() * 2.2,
                speedY: 0.25 + Math.random() * 0.55,
                angle: Math.random() * Math.PI * 2,
                angleSpeed: 0.012 + Math.random() * 0.02,
                color: color,
                pulseSpeed: 1.2 + Math.random() * 1.8,
                baseAlpha: 0.35 + Math.random() * 0.45
            });
        }

        this.ripples = [];
        this.shootingStars = [];
    }

    triggerLightning() {
        if (!this.flashEl || (this.mode !== 'fusion' && this.mode !== 'tempest')) return;

        // Realistic multi-stage lightning flash sequence:
        // 1. Initial faint horizon flicker
        this.flashEl.style.transition = 'opacity 0.04s ease-out';
        this.flashEl.style.opacity = '0.35';

        setTimeout(() => {
            if (!this.flashEl) return;
            // 2. Micro dip
            this.flashEl.style.opacity = '0.12';

            setTimeout(() => {
                if (!this.flashEl) return;
                // 3. Main soft horizon illumination
                this.flashEl.style.opacity = '0.68';

                setTimeout(() => {
                    if (!this.flashEl) return;
                    // 4. Smooth cinematic dissipate
                    this.flashEl.style.transition = 'opacity 0.38s ease-out';
                    this.flashEl.style.opacity = '0';
                }, 75);
            }, 35);
        }, 45);

        this.scheduleNextLightning();
    }

    scheduleNextLightning() {
        clearTimeout(this.lightningTimer);
        if (this.mode !== 'fusion' && this.mode !== 'tempest') return;
        const delay = 8000 + Math.random() * 11000;
        this.lightningTimer = setTimeout(() => {
            this.triggerLightning();
        }, delay);
    }

    spawnShootingStar() {
        if (this.mode !== 'fusion' && this.mode !== 'celestia') return;
        const startX = Math.random() * (this.width * 0.7);
        const startY = Math.random() * (this.height * 0.35);
        this.shootingStars.push({
            x: startX,
            y: startY,
            len: 80 + Math.random() * 60,
            speed: 14 + Math.random() * 8,
            angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
            alpha: 0.85,
            decay: 0.016 + Math.random() * 0.01
        });

        this.scheduleNextShootingStar();
    }

    scheduleNextShootingStar() {
        clearTimeout(this.shootingStarTimer);
        if (this.mode !== 'fusion' && this.mode !== 'celestia') return;
        const delay = 12000 + Math.random() * 16000;
        this.shootingStarTimer = setTimeout(() => {
            this.spawnShootingStar();
        }, delay);
    }

    startAnimation() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.scheduleNextLightning();
        this.scheduleNextShootingStar();
        this.loop();
    }

    stopAnimation() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        clearTimeout(this.lightningTimer);
        clearTimeout(this.shootingStarTimer);
        if (this.flashEl) this.flashEl.style.opacity = '0';
        if (this.ctx) this.ctx.clearRect(0, 0, this.width, this.height);
    }

    loop() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.width, this.height);

        const now = Date.now() * 0.001;
        const showRain = (this.mode === 'fusion' || this.mode === 'tempest');
        const showMotes = (this.mode === 'fusion' || this.mode === 'celestia');

        // 1. Draw Rain Drops
        if (showRain) {
            for (let i = 0; i < this.drops.length; i++) {
                const d = this.drops[i];
                d.y += d.speed;
                d.x += d.wind;

                if (d.y > this.height) {
                    if (Math.random() < 0.22 && this.ripples.length < 25) {
                        this.ripples.push({
                            x: d.x,
                            y: this.height - 4,
                            r: 1,
                            maxR: 8 + Math.random() * 7,
                            alpha: 0.35,
                            decay: 0.035
                        });
                    }
                    d.y = -d.len - 5;
                    d.x = Math.random() * (this.width + 120) - 60;
                }

                this.ctx.strokeStyle = `rgba(186, 230, 253, ${d.alpha})`;
                this.ctx.lineWidth = d.thickness;
                this.ctx.lineCap = 'round';
                this.ctx.beginPath();
                this.ctx.moveTo(d.x, d.y);
                this.ctx.lineTo(d.x + d.wind * (d.len / d.speed) * 1.5, d.y + d.len);
                this.ctx.stroke();
            }

            // Draw Splashes / Ripples
            for (let i = this.ripples.length - 1; i >= 0; i--) {
                const r = this.ripples[i];
                r.r += (r.maxR - r.r) * 0.12 + 0.3;
                r.alpha -= r.decay;

                if (r.alpha <= 0) {
                    this.ripples.splice(i, 1);
                    continue;
                }

                this.ctx.strokeStyle = `rgba(186, 230, 253, ${r.alpha})`;
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.ellipse(r.x, r.y, r.r, r.r * 0.32, 0, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }

        // 2. Draw Celestial Motes
        if (showMotes) {
            for (let i = 0; i < this.motes.length; i++) {
                const m = this.motes[i];
                m.angle += m.angleSpeed;
                m.y -= m.speedY;
                m.x += Math.sin(m.angle) * 0.45;

                if (m.y < -20) {
                    m.y = this.height + 15;
                    m.x = Math.random() * this.width;
                }

                const pulse = Math.sin(now * m.pulseSpeed + m.angle) * 0.25 + 0.75;
                const currentAlpha = m.baseAlpha * pulse;
                const r = m.baseRadius * (0.85 + pulse * 0.25);

                // Soft outer glowing aura
                const radGlow = r * 3.2;
                const grad = this.ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, radGlow);
                grad.addColorStop(0, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, ${currentAlpha * 0.5})`);
                grad.addColorStop(0.5, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, ${currentAlpha * 0.18})`);
                grad.addColorStop(1, `rgba(${m.color.r}, ${m.color.g}, ${m.color.b}, 0)`);

                this.ctx.fillStyle = grad;
                this.ctx.beginPath();
                this.ctx.arc(m.x, m.y, radGlow, 0, Math.PI * 2);
                this.ctx.fill();

                // Bright inner particle core
                this.ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`;
                this.ctx.beginPath();
                this.ctx.arc(m.x, m.y, r * 0.65, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }

        // 3. Draw Shooting Stars
        for (let i = this.shootingStars.length - 1; i >= 0; i--) {
            const s = this.shootingStars[i];
            const cos = Math.cos(s.angle);
            const sin = Math.sin(s.angle);
            s.x += cos * s.speed;
            s.y += sin * s.speed;
            s.alpha -= s.decay;

            if (s.alpha <= 0 || s.x > this.width || s.y > this.height) {
                this.shootingStars.splice(i, 1);
                continue;
            }

            const tailX = s.x - cos * s.len;
            const tailY = s.y - sin * s.len;

            const grad = this.ctx.createLinearGradient(tailX, tailY, s.x, s.y);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(0.7, `rgba(186, 230, 253, ${s.alpha * 0.4})`);
            grad.addColorStop(1, `rgba(255, 255, 255, ${s.alpha})`);

            this.ctx.strokeStyle = grad;
            this.ctx.lineWidth = 1.6;
            this.ctx.beginPath();
            this.ctx.moveTo(tailX, tailY);
            this.ctx.lineTo(s.x, s.y);
            this.ctx.stroke();
        }

        this.animationId = requestAnimationFrame(() => this.loop());
    }

    applyMode(mode, save = true) {
        this.mode = mode;
        if (save) localStorage.setItem('portfolioAtmosphere', mode);

        if (this.canvas) {
            if (mode === 'off') {
                this.canvas.classList.add('ambient-hidden');
                this.stopAnimation();
            } else {
                this.canvas.classList.remove('ambient-hidden');
                if (!this.isRunning) this.startAnimation();
                else {
                    this.scheduleNextLightning();
                    this.scheduleNextShootingStar();
                }
            }
        }

        this.updateBadgeUI();
    }

    cycleMode() {
        const modes = ['fusion', 'celestia', 'tempest', 'off'];
        const nextIndex = (modes.indexOf(this.mode) + 1) % modes.length;
        this.applyMode(modes[nextIndex], true);
    }

    updateBadgeUI() {
        const prefLang = localStorage.getItem('prefLang') || 'en';
        const labels = {
            fusion: { en: 'Ethereal', id: 'Ethereal', icon: 'fas fa-wand-magic-sparkles' },
            celestia: { en: 'Celestia', id: 'Celestia', icon: 'fas fa-sparkles' },
            tempest: { en: 'Tempest', id: 'Badai', icon: 'fas fa-cloud-bolt' },
            off: { en: 'Off', id: 'Mati', icon: 'fas fa-power-off' }
        };

        const config = labels[this.mode] || labels.fusion;
        const text = prefLang === 'id' ? config.id : config.en;

        const badgeDesktop = document.getElementById('ambient-text');
        const iconDesktop = document.getElementById('ambient-icon');
        const badgeMobile = document.getElementById('mobile-ambient-text');
        const iconMobile = document.getElementById('mobile-ambient-icon');

        if (badgeDesktop) badgeDesktop.textContent = text;
        if (iconDesktop) iconDesktop.className = config.icon;
        if (badgeMobile) badgeMobile.textContent = text;
        if (iconMobile) iconMobile.className = config.icon;
    }
}

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

    // --- 3. THEME LOGIC ---
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

    // --- 4. LANGUAGE LOGIC (NATIVE - INSTANT ZERO-LAG) ---
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

        // Update Ambient Badge Language
        window.ambientEngine?.updateBadgeUI();
    }

    langBtn?.addEventListener('click', () => {
        const nextLang = currentLang === 'en' ? 'id' : 'en';
        applyLanguage(nextLang);
    });

    // --- 5. ATMOSPHERIC AMBIENT TOGGLE CONTROLS ---
    window.ambientEngine = new AmbientAtmosphere();
    const ambientBtn = document.getElementById('ambient-toggle');
    const mobileAmbientBtn = document.getElementById('mobile-ambient-toggle');

    ambientBtn?.addEventListener('click', () => {
        window.ambientEngine?.cycleMode();
    });

    mobileAmbientBtn?.addEventListener('click', () => {
        window.ambientEngine?.cycleMode();
    });

    // --- 6. REVEAL OBSERVER ---
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

// --- 7. DATA & ARTICLE SYNC LOGIC (ANTI-MACET / NON-BLOCKING) ---
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
