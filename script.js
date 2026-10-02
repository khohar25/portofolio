/* ==========================================================================
   AIFORA PORTFOLIO - JS MURNI (ULTRA-FAST & ZERO-LAG ARCHITECTURE)
   ATMOSPHERIC AMBIENT ENGINE (ANTI-AI-SLOP 60FPS CANVAS & CELESTIAL HORIZON)
   ========================================================================== */

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

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

// --- PAGE ENTRY PRELOADER CONTROLLER ---
let pageLoaderInitialized = false;
function initPageLoader() {
    if (pageLoaderInitialized) return;
    pageLoaderInitialized = true;

    const loader = document.getElementById('page-loader');
    if (!loader) return;

    const progressBar = document.getElementById('loader-progress-bar');
    const statusText = document.getElementById('loader-status-text');

    const prefLang = localStorage.getItem('prefLang') || 'en';
    const isId = prefLang === 'id';
    
    // Smooth progress simulation
    let progress = 18;
    if (progressBar) progressBar.style.width = '18%';

    const progressTimer = setInterval(() => {
        if (progress < 85) {
            progress += Math.floor(Math.random() * 14) + 8;
            if (progress > 85) progress = 85;
            if (progressBar) progressBar.style.width = `${progress}%`;
        }
    }, 110);

    let finished = false;
    function dismissLoader() {
        if (finished) return;
        finished = true;
        clearInterval(progressTimer);

        if (progressBar) progressBar.style.width = '100%';
        if (statusText) statusText.textContent = isId ? 'Repositori Siap! Membuka sistem...' : 'System Ready! Launching environment...';

        setTimeout(() => {
            loader.classList.add('loader-hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 550);
        }, 320);
    }

    if (document.readyState === 'complete') {
        setTimeout(dismissLoader, 180);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(dismissLoader, 250);
        });
        window.addEventListener('load', () => {
            setTimeout(dismissLoader, 280);
        });
        // Absolute fail-safe timeout
        setTimeout(dismissLoader, 900);
    }
}

// --- FICTION & NOVEL CAROUSEL SLIDER (GENSHIN ARCHIVE STYLE) ---
function initFictionSlider() {
    const track = document.getElementById('fiction-slider-track');
    const prevBtn = document.getElementById('fiction-prev-btn');
    const nextBtn = document.getElementById('fiction-next-btn');
    const dots = document.querySelectorAll('.fiction-dot');

    if (!track) return;

    const cards = track.querySelectorAll('.book-slide-card');
    if (!cards.length) return;

    function getCardStep() {
        if (cards.length > 1) {
            return cards[1].offsetLeft - cards[0].offsetLeft;
        }
        return (cards[0] ? cards[0].offsetWidth : 300) + 22;
    }

    function updateSliderState() {
        const scrollLeft = track.scrollLeft;
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        const step = getCardStep();
        const activeIndex = scrollLeft >= maxScroll - 30
            ? cards.length - 1
            : Math.min(cards.length - 1, Math.max(0, Math.round(scrollLeft / (step || 1))));

        // Update pagination dots
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === activeIndex);
        });

        // Continuous Loop: buttons are always enabled and never disabled
        if (prevBtn) {
            prevBtn.disabled = false;
            prevBtn.classList.remove('disabled');
        }
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.classList.remove('disabled');
        }
    }

    // Prev / Next button click handlers with infinite wrap-around
    prevBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollLeft = track.scrollLeft;
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        const step = getCardStep();

        // If at the beginning, wrap to the end
        if (scrollLeft <= Math.max(25, step * 0.25)) {
            track.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: -step, behavior: 'smooth' });
        }
    });

    nextBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollLeft = track.scrollLeft;
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        const step = getCardStep();

        // If at the end or within remaining step from end, wrap around to the beginning
        if (scrollLeft >= maxScroll - Math.max(30, step * 0.75)) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: step, behavior: 'smooth' });
        }
    });

    // Dot indicators click
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            const targetCard = cards[idx];
            if (targetCard) {
                const targetLeft = targetCard.offsetLeft - track.offsetLeft;
                track.scrollTo({ left: targetLeft, behavior: 'smooth' });
            }
        });
    });

    // Drag-to-scroll support for desktop mouse users
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;

    track.addEventListener('mousedown', (e) => {
        if (e.target.closest('a') || e.target.closest('button')) return;
        isDown = true;
        track.classList.add('is-dragging');
        startX = e.pageX - track.offsetLeft;
        scrollStart = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        track.classList.remove('is-dragging');
        setTimeout(updateSliderState, 150);
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.35;
        if (Math.abs(walk) > 4) {
            e.preventDefault();
            track.scrollLeft = scrollStart - walk;
        }
    });

    // Scroll listener (throttled via requestAnimationFrame)
    let ticking = false;
    track.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateSliderState();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Initial state after layout settles
    setTimeout(updateSliderState, 120);
    window.addEventListener('resize', updateSliderState);
}

// --- THE GRAND CODEX ARCHIVE (BOOKSHELF SYSTEM) ---
function initBookshelfArchive() {
    const grid = document.getElementById('bookshelf-display-grid');
    const tabs = document.querySelectorAll('.shelf-tab-btn');
    const searchInput = document.getElementById('shelf-search-input');
    const searchClear = document.getElementById('shelf-search-clear');
    const shownCountEl = document.getElementById('bookshelf-shown-count');
    const loadRow = document.getElementById('bookshelf-load-row');
    const loadBtn = document.getElementById('bookshelf-load-more-btn');
    const modalBackdrop = document.getElementById('codex-modal-backdrop');
    const modalCloseBtn = document.getElementById('codex-modal-close-btn');
    const modalBody = document.getElementById('codex-modal-body');

    if (!grid) return;

    let certificates = [];
    let activeCategory = 'all';
    let searchQuery = '';
    let displayLimit = 24;

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // Modal Controller
    function openModal(item) {
        if (!modalBackdrop || !modalBody) return;
        const lang = window.currentPortfolioLang || localStorage.getItem('prefLang') || 'en';
        const title = (lang === 'en' && item.title_en) ? item.title_en : item.title_id;
        const catName = (lang === 'en' && item.category_name_en) ? item.category_name_en : item.category_name_id;
        const desc = (lang === 'en' && item.desc_en) ? item.desc_en : item.desc_id;
        const openLabel = lang === 'en' ? 'Verify Original Credential' : 'Verifikasi Dokumen Asli';
        const dateLabel = lang === 'en' ? 'Date / Conferred' : 'Tanggal / Periode Perolehan';
        const issuerLabel = lang === 'en' ? 'Issuing Authority' : 'Lembaga / Institusi Penerbit';
        const statusLabel = lang === 'en' ? 'Credential Status' : 'Status Keabsahan Kredensial';
        const starsHtml = '<i class="fas fa-star"></i>'.repeat(item.stars || 5);

        modalBody.innerHTML = `
            <div class="modal-detail-header">
                <div class="modal-crest-icon tome-crest-circle theme-${item.color_theme}">
                    <i class="${escapeHtml(item.icon)}"></i>
                </div>
                <div class="modal-header-meta">
                    <span class="modal-cat-chip theme-${item.color_theme}">${escapeHtml(catName)}</span>
                    <div class="modal-stars-row">${starsHtml}</div>
                    <h3 class="modal-title notranslate" id="codex-modal-title">${escapeHtml(title)}</h3>
                    <div class="modal-issuer-row">
                        <i class="fas fa-award"></i> <span>${escapeHtml(item.issuer)}</span>
                    </div>
                </div>
            </div>

            ${item.thumb_img ? `
            <div class="modal-cert-preview-wrap" onclick="window.open('${escapeHtml(item.file_url)}', '_blank')">
                <img src="${escapeHtml(item.thumb_img)}" alt="${escapeHtml(title)}" class="modal-cert-preview-img" loading="lazy">
                <div class="modal-cert-preview-badge">
                    <i class="fas fa-wand-magic-sparkles"></i> <span>${lang === 'en' ? 'Activity Concept Art &bull; Click to View Official Document' : 'Ilustrasi Konsep Kegiatan &bull; Klik Buka Dokumen Asli'}</span>
                </div>
            </div>
            ` : ''}

            <div class="modal-info-grid">
                <div class="modal-info-item">
                    <span>${issuerLabel}</span>
                    <strong>${escapeHtml(item.issuer)}</strong>
                </div>
                <div class="modal-info-item">
                    <span>${dateLabel}</span>
                    <strong>${escapeHtml(item.date)}</strong>
                </div>
                <div class="modal-info-item">
                    <span>${statusLabel}</span>
                    <strong style="color: #10b981;"><i class="fas fa-check-circle"></i> ${escapeHtml(item.badge_text || 'Terverifikasi')}</strong>
                </div>
                <div class="modal-info-item">
                    <span>Format File</span>
                    <strong>${escapeHtml(item.file_type.toUpperCase())} Digital Credential</strong>
                </div>
            </div>

            <div class="modal-desc-box">
                <h5>${lang === 'en' ? 'Competency Scope & Archival Abstract' : 'Cakupan Kompetensi & Abstrak Arsip'}</h5>
                <p>${escapeHtml(desc)}</p>
            </div>

            <div class="modal-actions-row">
                <a href="${escapeHtml(item.file_url)}" target="_blank" rel="noopener noreferrer" class="modal-verify-btn">
                    <i class="fas fa-external-link-alt"></i> <span>${openLabel} (${escapeHtml(item.file_type.toUpperCase())})</span>
                </a>
            </div>
        `;

        modalBackdrop.classList.add('active');
        modalBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.remove('active');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    modalCloseBtn?.addEventListener('click', closeModal);
    modalBackdrop?.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) {
            closeModal();
        }
    });

    // Update Counter Badges
    function updateCounters() {
        const counts = { all: certificates.length, olim: 0, profesi: 0, ibm: 0, seminar: 0 };
        certificates.forEach(c => {
            if (counts[c.category] !== undefined) {
                counts[c.category]++;
            }
        });
        const cAll = document.getElementById('count-all');
        const cOlim = document.getElementById('count-olim');
        const cProf = document.getElementById('count-profesi');
        const cIbm = document.getElementById('count-ibm');
        const cSem = document.getElementById('count-seminar');
        if (cAll) cAll.textContent = counts.all;
        if (cOlim) cOlim.textContent = counts.olim;
        if (cProf) cProf.textContent = counts.profesi;
        if (cIbm) cIbm.textContent = counts.ibm;
        if (cSem) cSem.textContent = counts.seminar;
    }

    // Render Shelf Tomes
    function renderShelves() {
        const lang = window.currentPortfolioLang || localStorage.getItem('prefLang') || 'en';
        const q = searchQuery.toLowerCase().trim();

        const filtered = certificates.filter(item => {
            const matchesCat = (activeCategory === 'all' || item.category === activeCategory);
            if (!matchesCat) return false;
            if (!q) return true;
            const titleId = (item.title_id || '').toLowerCase();
            const titleEn = (item.title_en || '').toLowerCase();
            const issuer = (item.issuer || '').toLowerCase();
            const badge = (item.badge_text || '').toLowerCase();
            const desc = ((item.desc_id || '') + ' ' + (item.desc_en || '')).toLowerCase();
            return titleId.includes(q) || titleEn.includes(q) || issuer.includes(q) || badge.includes(q) || desc.includes(q);
        });

        if (shownCountEl) shownCountEl.textContent = filtered.length;

        const visibleItems = (q || activeCategory !== 'all') ? filtered : filtered.slice(0, displayLimit);

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="bookshelf-empty-state">
                    <i class="fas fa-search"></i>
                    <h4>${lang === 'en' ? 'No Credentials Found' : 'Tidak Ada Dokumen Ditemukan'}</h4>
                    <p>${lang === 'en' ? 'Try adjusting your search query or switching categories.' : 'Coba ubah kata kunci pencarian atau pilih kategori lain.'}</p>
                </div>
            `;
            if (loadRow) loadRow.style.display = 'none';
            return;
        }

        grid.innerHTML = '';
        visibleItems.forEach((item, index) => {
            const title = (lang === 'en' && item.title_en) ? item.title_en : item.title_id;
            const starsHtml = '<i class="fas fa-star"></i>'.repeat(item.stars || 5);
            const previewPlateHtml = item.thumb_img 
                ? `
                    <div class="tome-doc-preview-plate">
                        <img src="${escapeHtml(item.thumb_img)}" alt="${escapeHtml(title)}" class="tome-doc-thumb" loading="${index < 16 ? 'eager' : 'lazy'}" decoding="async" onerror="this.onerror=null;this.src='cert_covers/ai_art/art_ai_agentic.webp';">
                        <div class="tome-doc-glare"></div>
                        <div class="tome-doc-crest theme-${item.color_theme}">
                            <i class="${escapeHtml(item.icon)}"></i>
                        </div>
                    </div>
                  `
                : `
                    <div class="tome-crest-circle">
                        <i class="${escapeHtml(item.icon)}"></i>
                    </div>
                  `;

            const tome = document.createElement('div');
            tome.className = `shelf-tome-item theme-${item.color_theme} reveal active`;
            tome.setAttribute('tabindex', '0');
            tome.setAttribute('role', 'button');
            tome.setAttribute('aria-label', title);

            tome.innerHTML = `
                <div class="shelf-tome-cover">
                    <div class="shelf-tome-spine"></div>
                    <div class="shelf-tome-ribbon"></div>
                    <div class="tome-top-row">
                        <div class="tome-stars">${starsHtml}</div>
                        <span class="tome-type-badge">${escapeHtml(item.badge_text || 'ARSIP')}</span>
                    </div>
                    ${previewPlateHtml}
                    <div class="tome-bottom-content">
                        <h4 class="tome-title notranslate">${escapeHtml(title)}</h4>
                        <div class="tome-issuer notranslate">${escapeHtml(item.issuer)}</div>
                        <div class="tome-footer-meta">
                            <span class="tome-date"><i class="far fa-calendar-alt"></i> ${escapeHtml(item.date)}</span>
                            <div class="tome-inspect-prompt">
                                <span>${lang === 'en' ? 'Inspect' : 'Tinjau'}</span> <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            tome.addEventListener('click', () => openModal(item));
            tome.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openModal(item);
                }
            });

            grid.appendChild(tome);
        });

        // Load More button visibility
        if (loadRow) {
            if (!q && activeCategory === 'all' && displayLimit < filtered.length) {
                loadRow.style.display = 'flex';
            } else {
                loadRow.style.display = 'none';
            }
        }
    }

    window.renderBookshelf = renderShelves;

    // Filter tab clicks
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            activeCategory = this.getAttribute('data-category') || 'all';
            displayLimit = 24;
            renderShelves();
        });
    });

    // Search input with debounce
    let searchTimer = null;
    searchInput?.addEventListener('input', (e) => {
        const val = e.target.value;
        if (searchClear) searchClear.style.display = val ? 'block' : 'none';
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            searchQuery = val;
            renderShelves();
        }, 150);
    });

    searchClear?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        searchClear.style.display = 'none';
        searchQuery = '';
        renderShelves();
        searchInput?.focus();
    });

    // Load More click
    loadBtn?.addEventListener('click', () => {
        displayLimit += 24;
        renderShelves();
    });

    // Fetch certificates.json
    fetch('certificates.json?v=33')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                certificates = data;
                updateCounters();
                renderShelves();
            }
        })
        .catch(err => {
            console.warn('Failed to load certificates.json', err);
        });
}

// ==========================================================================
// 0.3 PHOTO DOCUMENTATION & ACTIVITY GALLERY ENGINE (UNIFIED INFINITE CAROUSEL)
// ==========================================================================
function initPhotoGallery() {
    const track = document.getElementById('gallery-slider-track');
    if (!track) return;

    const prevBtn = document.getElementById('gallery-prev-btn');
    const nextBtn = document.getElementById('gallery-next-btn');
    const dotsContainer = document.getElementById('gallery-slider-dots');

    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxBackdrop = document.getElementById('gallery-lightbox-backdrop');
    const lightboxClose = document.getElementById('gallery-lightbox-close');
    const lightboxPrev = document.getElementById('gallery-lightbox-prev');
    const lightboxNext = document.getElementById('gallery-lightbox-next');
    const lightboxImg = document.getElementById('gallery-lightbox-img');
    const lightboxCat = document.getElementById('gallery-lightbox-category');
    const lightboxDate = document.getElementById('gallery-lightbox-date');
    const lightboxLoc = document.getElementById('gallery-lightbox-loc');
    const lightboxTitle = document.getElementById('gallery-lightbox-title');
    const lightboxSubtitle = document.getElementById('gallery-lightbox-subtitle');
    const lightboxDesc = document.getElementById('gallery-lightbox-desc');

    let galleryItems = [];
    let currentLightboxIndex = 0;

    // Helper to map category to Genshin elemental theme class
    function getThemeClass(cat) {
        switch ((cat || '').toLowerCase()) {
            case 'prestasi': return 'geo';
            case 'akademik': return 'electro';
            case 'organisasi': return 'anemo';
            case 'kegiatan': return 'pyro';
            case 'pribadi': return 'hydro';
            default: return 'geo';
        }
    }

    function cleanText(str) {
        if (!str) return '';
        return String(str).replace(/&bull;/g, '•');
    }

    function getCardStep() {
        const cards = track.querySelectorAll('.gallery-slide-card');
        if (cards.length > 1) {
            return cards[1].offsetLeft - cards[0].offsetLeft;
        }
        return (cards[0] ? cards[0].offsetWidth : 320) + 20;
    }

    function updateSliderState() {
        const cards = track.querySelectorAll('.gallery-slide-card');
        if (!cards.length) return;
        const scrollLeft = track.scrollLeft;
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        const step = getCardStep();
        const activeIndex = scrollLeft >= maxScroll - Math.max(30, step * 0.75)
            ? cards.length - 1
            : Math.min(cards.length - 1, Math.max(0, Math.round(scrollLeft / (step || 1))));

        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.gallery-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === activeIndex);
            });
        }

        // Infinite Continuous Loop: Navigation buttons are never disabled
        if (prevBtn) {
            prevBtn.disabled = false;
            prevBtn.classList.remove('disabled');
        }
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.classList.remove('disabled');
        }
    }

    // Fallback embedded data (guarantees instant display even if fetch is blocked)
    const fallbackGallery = [
        {
                "id": "galeri-1",
                "category": "prestasi",
                "category_name_id": "Prestasi & Kredensial Global",
                "category_name_en": "Achievements & Global Credentials",
                "title_id": "Khohar Muhamad Fatahurrohman — Potret Profesional & Dinding Kredensial IBM",
                "title_en": "Khohar Muhamad Fatahurrohman — Professional Studio & IBM Credential Wall",
                "subtitle_id": "Rekayasa Komputasi & Kompetensi Industri Digital",
                "subtitle_en": "Computational Engineering & Digital Industry Competency",
                "date": "2026",
                "location_id": "Studio Profesional, Jawa Timur",
                "location_en": "Professional Studio, East Java",
                "image_url": "gallery/img-20260712-wa0009.webp",
                "caption_id": "Potret resmi berbusana jas formal dengan latar belakang jajaran sertifikasi keahlian teknologi IBM SkillsBuild, merepresentasikan komitmen berkelanjutan dalam penguasaan rekayasa perangkat lunak, AI, dan standar industri global.",
                "caption_en": "Official formal studio portrait in suit with the IBM SkillsBuild credential wall backdrop, demonstrating enduring dedication to software engineering mastery, artificial intelligence, and global industry standards.",
                "featured": true,
                "object_position": "center 20%"
        },
        {
                "id": "galeri-2",
                "category": "akademik",
                "category_name_id": "Akademik & Kampus",
                "category_name_en": "Academic & Labs",
                "title_id": "Praktikum Laboratorium Komputasi & Informatika POLINEMA",
                "title_en": "Informatics & Computing Laboratory Practicum POLINEMA",
                "subtitle_id": "D4 Teknik Informatika • Politeknik Negeri Malang",
                "subtitle_en": "Informatics Engineering • State Polytechnic of Malang",
                "date": "2025 - 2026",
                "location_id": "Laboratorium Komputer POLINEMA, Malang",
                "location_en": "POLINEMA Computer Laboratory, Malang",
                "image_url": "gallery/img_20260810_104726_385.webp",
                "caption_id": "Dokumentasi keaktifan perkuliahan dan pendampingan teknis praktikum di laboratorium komputer Politeknik Negeri Malang (POLINEMA) mengenakan seragam dinas kebanggaan almamater.",
                "caption_en": "Academic lab session and technical mentorship at the State Polytechnic of Malang (POLINEMA) computing facility wearing the official institutional laboratory uniform.",
                "featured": true,
                "object_position": "center center"
        },
        {
                "id": "galeri-3",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Musyawarah Wilayah XXIV PW IPM Jawa Timur",
                "title_en": "24th Regional Assembly (Musywil XXIV) PW IPM Jawa Timur",
                "subtitle_id": "Pimpinan Wilayah Ikatan Pelajar Muhammadiyah Jawa Timur",
                "subtitle_en": "East Java Regional Board of Muhammadiyah Students Association",
                "date": "Juli 2026",
                "location_id": "Arena Utama Musywil XXIV IPM Jatim",
                "location_en": "Main Arena Musywil XXIV IPM East Java",
                "image_url": "gallery/img-20260705-wa0028_1.webp",
                "caption_id": "Kebersamaan jajaran pimpinan dan kader persyarikatan di panggung kehormatan Musyawarah Wilayah XXIV Ikatan Pelajar Muhammadiyah (PW IPM) Jawa Timur, merumuskan arah gerak dakwah pelajar berkemajuan.",
                "caption_en": "Leadership cohort on the commemorative stage of the 24th Regional Assembly of the East Java Muhammadiyah Students Association (PW IPM Jatim), orchestrating youth empowerment.",
                "featured": true,
                "object_position": "center 30%"
        },
        {
                "id": "galeri-4",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Kesiapsiagaan Panitia & Tim Pengarah Musywil XXIV IPM",
                "title_en": "Organizing Committee Readiness — Musywil XXIV IPM",
                "subtitle_id": "Dedikasi & Tanggung Jawab Operasional Kepanitiaan",
                "subtitle_en": "Dedication & Operational Excellence of the Steering Committee",
                "date": "Juli 2026",
                "location_id": "Posko Panitia Musywil XXIV, Jawa Timur",
                "location_en": "Musywil XXIV Committee Center, East Java",
                "image_url": "gallery/img_20260703_224626_292.webp",
                "caption_id": "Dokumentasi kebersamaan mengenakan rompi dinas kepanitiaan IPM saat koordinasi teknis penyelenggaraan persidangan permusyawaratan tingkat wilayah.",
                "caption_en": "Operational briefing and technical coordination wearing the official IPM committee vest during the regional deliberative congress.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-5",
                "category": "kegiatan",
                "category_name_id": "Vokasi & Pengabdian Masyarakat",
                "category_name_en": "Vocational & Community Service",
                "title_id": "Workshop Teknologi Pengolahan & Hilirisasi Pertanian",
                "title_en": "Agricultural Processing Technology & Agro-Industrial Workshop",
                "subtitle_id": "Pemberdayaan Teknologi Hilirisasi Hasil Bumi Lokal",
                "subtitle_en": "Local Crop Value-Addition & Food Processing Innovation",
                "date": "Juli 2026",
                "location_id": "Gedung Workshop Teknologi Pengolahan Pertanian",
                "location_en": "Agricultural Processing Technology Center",
                "image_url": "gallery/img-20260729-wa0046.webp",
                "caption_id": "Foto bersama delegasi pelatihan teknologi pengolahan hasil pertanian di depan gedung workshop, memperkuat wawasan agroteknologi dan industrialisasi pangan mandiri.",
                "caption_en": "Cohort group photo in front of the agricultural processing technology center, championing food tech industrialization and value-chain enhancement.",
                "featured": true,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-6",
                "category": "kegiatan",
                "category_name_id": "Vokasi & Pengabdian Masyarakat",
                "category_name_en": "Vocational & Community Service",
                "title_id": "Laboratorium Pengolahan Pangan & Inovasi Kuliner",
                "title_en": "Food Technology Laboratory & Culinary Innovation",
                "subtitle_id": "Praktikum Mutu Pangan & Pengolahan Produk Bernilai Tambah",
                "subtitle_en": "Food Quality Science & Value-Added Production Lab",
                "date": "Agustus 2026",
                "location_id": "Laboratorium Pengolahan Kuliner Terpadu",
                "location_en": "Integrated Food Science & Culinary Lab",
                "image_url": "gallery/img-20260805-wa0033.webp",
                "caption_id": "Dokumentasi keceriaan dan sinergi bersama kelompok praktikum di laboratorium tata boga setelah berhasil memproduksi aneka olahan kue kering higienis bermutu tinggi.",
                "caption_en": "Joyful camaraderie with the vocational practicum team showcasing freshly baked artisanal pastries produced according to hygiene standards.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-7",
                "category": "kegiatan",
                "category_name_id": "Vokasi & Pengabdian Masyarakat",
                "category_name_en": "Vocational & Community Service",
                "title_id": "Praktik Vokasi Pengolahan Roti & Pastry",
                "title_en": "Artisanal Baking & Pastry Practicum",
                "subtitle_id": "Penguasaan Teknik Fermentasi & Keterampilan Kuliner",
                "subtitle_en": "Fermentation Science & Culinary Baking Craftsmanship",
                "date": "Juli 2026",
                "location_id": "Dapur Uji Baking & Pastry Modern",
                "location_en": "Modern Bakery & Pastry Test Kitchen",
                "image_url": "gallery/img-20260714-wa0031.webp",
                "caption_id": "Momen kebersamaan rekan tim praktik mengolah hidangan roti dan kue, melatih ketelitian formulasi bahan, manajemen waktu, dan kerja sama tim.",
                "caption_en": "Hands-on culinary practicum creating fine bread and pastry creations, honing recipe formulation precision, timing, and teamwork.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-8",
                "category": "prestasi",
                "category_name_id": "Prestasi & Kredensial Global",
                "category_name_en": "Achievements & Global Credentials",
                "title_id": "Pelatihan Vokasi & Sertifikasi Kompetensi BLK Madiun",
                "title_en": "Vocational Competency Training & Certification — BLK Madiun",
                "subtitle_id": "UPT Balai Latihan Kerja Madiun • Disnakertrans Jatim",
                "subtitle_en": "Madiun Vocational Training Center • East Java Gov",
                "date": "Juli 2026",
                "location_id": "Kampus UPT Balai Latihan Kerja Madiun",
                "location_en": "Madiun Vocational Training Center Campus",
                "image_url": "gallery/img-20260730-wa0016.webp",
                "caption_id": "Dokumentasi wisuda dan foto bersama peserta pelatihan kejuruan vokasi di pelataran UPT BLK Madiun, memperkuat keahlian teknis siap kerja berstandar BNSP.",
                "caption_en": "Commemorative cohort gathering at UPT BLK Madiun, celebrating the completion of competency-based vocational training aligned with national certification standards.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-9",
                "category": "kegiatan",
                "category_name_id": "Vokasi & Pengabdian Masyarakat",
                "category_name_en": "Vocational & Community Service",
                "title_id": "Usaha Mandiri UMKM Keripik Tempe An-Ni'mah Ngawi",
                "title_en": "Family Enterprise: An-Ni'mah Artisan Tempeh Chips Ngawi",
                "subtitle_id": "Kewirausahaan Pangan Lokal & Hilirisasi Kedelai Tradisional",
                "subtitle_en": "Local Food Entrepreneurship & Artisan Agro-Processing",
                "date": "Maret 2026",
                "location_id": "Sentra Produksi An-Ni'mah, Karangjati, Ngawi",
                "location_en": "An-Ni'mah Production Hub, Karangjati, Ngawi",
                "image_url": "gallery/img_20260321_074420_081.webp",
                "caption_id": "Potret keluarga bersama kedua orang tua tercinta di depan etalase usaha produksi keripik tempe khas Ngawi 'An-Ni'mah', fondasi etos kerja keras dan nilai kemandirian hidup.",
                "caption_en": "Cherished family portrait alongside beloved parents at the An-Ni'mah artisan tempeh chips center in Ngawi, instilling enduring values of hard work and self-reliance.",
                "featured": true,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-10",
                "category": "pribadi",
                "category_name_id": "Potret Diri & Identitas",
                "category_name_en": "Portrait & Identity",
                "title_id": "Momentum Hangat Silaturahmi Idul Fitri Keluarga",
                "title_en": "Cherished Eid Al-Fitr Family Gathering & Harmony",
                "subtitle_id": "Kehangatan, Doa Restu & Fondasi Kekuatan Moral",
                "subtitle_en": "Blessings, Parental Support & Enduring Moral Grounding",
                "date": "Maret 2026",
                "location_id": "Karangjati, Ngawi, Jawa Timur",
                "location_en": "Karangjati, Ngawi, East Java",
                "image_url": "gallery/img_20260321_074529_158.webp",
                "caption_id": "Momen penuh keberkahan bersimpuh memohon maaf dan doa restu kepada ayah dan ibu di hari kemenangan Idul Fitri, sumber inspirasi spiritual dan integritas utama.",
                "caption_en": "Heartfelt family blessing on Eid Al-Fitr with parents in Karangjati, Ngawi, receiving parental guidance and spiritual strength that anchor all endeavors.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-11",
                "category": "akademik",
                "category_name_id": "Akademik & Kampus",
                "category_name_en": "Academic & Labs",
                "title_id": "Ikatan Sahabat Sekolah & Generasi Muda Almamater",
                "title_en": "High School Brotherhood & Lifelong Cohort",
                "subtitle_id": "Kebersamaan Tiga Sahabat di Gerbang Almamater",
                "subtitle_en": "Companionship and Aspirations at the School Gates",
                "date": "2024",
                "location_id": "Gerbang Almamater Sekolah Menengah, Ngawi",
                "location_en": "High School Alma Mater Gates, Ngawi",
                "image_url": "gallery/b386b87820ae3acb5d887c555094b145.webp",
                "caption_id": "Kenangan berseragam sekolah bersama sahabat di depan pintu gerbang almamater, melangkah bersama menjemput mimpi dan menempuh pendidikan tinggi teknologi.",
                "caption_en": "Nostalgic snapshot with close schoolmates standing proud before the alma mater gates, embodying shared ambitions toward future technological leadership.",
                "featured": false,
                "object_position": "center 30%"
        },
        {
                "id": "galeri-12",
                "category": "akademik",
                "category_name_id": "Akademik & Kampus",
                "category_name_en": "Academic & Labs",
                "title_id": "Sinergi Sahabat & Rekan Belajar SMK Negeri 1 Ngawi",
                "title_en": "Peer Fellowship & Collaboration at SMK Negeri 1 Ngawi",
                "subtitle_id": "Kiprah Vokasi & Solidaritas Generasi Muda",
                "subtitle_en": "Vocational Camaraderie & Youth Solidarity",
                "date": "Oktober 2024",
                "location_id": "SMK Negeri 1 Ngawi",
                "location_en": "SMK Negeri 1 Ngawi Campus",
                "image_url": "gallery/img-20241002-wa0050.webp",
                "caption_id": "Foto bersama rekan satu almamater di aula pertemuan dengan pose jempol optimisme, membuktikan semangat kolaboratif dalam menuntut ilmu terapan.",
                "caption_en": "Collaborative spirit and peer encouragement in the main hall of SMK Negeri 1 Ngawi, reflecting solidarity in technical vocational studies.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-13",
                "category": "akademik",
                "category_name_id": "Akademik & Kampus",
                "category_name_en": "Academic & Labs",
                "title_id": "Seminar & Edukasi Teknologi di Aula SMK Negeri 1 Ngawi",
                "title_en": "Technology & Innovation Seminar at SMK Negeri 1 Ngawi",
                "subtitle_id": "Penyampaian Materi Inspiratif & Wawasan Masa Depan",
                "subtitle_en": "Inspirational Keynotes & Industry Preparation",
                "date": "Oktober 2024",
                "location_id": "Aula Pertemuan SMK Negeri 1 Ngawi",
                "location_en": "Auditorium SMK Negeri 1 Ngawi",
                "image_url": "gallery/img-20241002-wa0033.webp",
                "caption_id": "Suasana khidmat pemaparan materi di panggung aula sekolah, memperluas cakrawala peserta didik menghadapi era transformasi digital modern.",
                "caption_en": "Engaging technical presentation from the auditorium stage, broadening students' perspectives on navigating digital transformation.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-14",
                "category": "akademik",
                "category_name_id": "Akademik & Kampus",
                "category_name_en": "Academic & Labs",
                "title_id": "Forum Sosialisasi & Presentasi Gagasan Pelajar",
                "title_en": "Student Idea Forum & Technical Briefing",
                "subtitle_id": "Komunikasi Efektif & Keberanian Berpendapat di Muka Publik",
                "subtitle_en": "Effective Public Communication & Youth Ideation",
                "date": "Oktober 2024",
                "location_id": "Aula Pertemuan SMK Negeri 1 Ngawi",
                "location_en": "Auditorium SMK Negeri 1 Ngawi",
                "image_url": "gallery/img-20241002-wa0036.webp",
                "caption_id": "Dokumentasi sesi presentasi gagasan dan sosialisasi program pelajar, mengasah kepercayaan diri dan keterampilan public speaking.",
                "caption_en": "Presentation session on student program ideation, sharpening public speaking confidence and persuasive technical communication.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-15",
                "category": "kegiatan",
                "category_name_id": "Vokasi & Pengabdian Masyarakat",
                "category_name_en": "Vocational & Community Service",
                "title_id": "Gerakan Literasi & Bedah Buku Sahabat",
                "title_en": "Youth Literacy Drive & Book Discussion",
                "subtitle_id": "Membudayakan Minat Baca & Dialektika Intelektual Pelajar",
                "subtitle_en": "Cultivating Reading Culture & Intellectual Dialogue",
                "date": "September 2025",
                "location_id": "Pusat Kegiatan Belajar Mengajar, Ngawi",
                "location_en": "Learning & Reading Center, Ngawi",
                "image_url": "gallery/img-20250910-wa0000.webp",
                "caption_id": "Momen bertukar buku biografi dan wawasan kepemimpinan bersama sahabat sebaya, menanamkan nilai bahwa membaca adalah pintu gerbang kemajuan peradaban.",
                "caption_en": "Discussing biography literature and leadership insights with peer students, reaffirming that deep reading fuels enduring civilized growth.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-16",
                "category": "kegiatan",
                "category_name_id": "Vokasi & Pengabdian Masyarakat",
                "category_name_en": "Vocational & Community Service",
                "title_id": "Eksplorasi Khazanah Pustaka & Budaya Membaca",
                "title_en": "Bookstore Literary Discovery & Intellectual Curiosity",
                "subtitle_id": "Menjelajahi Rak Buku & Kedalaman Gagasan Penulis",
                "subtitle_en": "Exploring Bookshelves & Authors' Enduring Wisdom",
                "date": "April 2025",
                "location_id": "Toko Buku Gramedia, Jawa Timur",
                "location_en": "Gramedia Bookstore, East Java",
                "image_url": "gallery/img_20250427_235056_227.webp",
                "caption_id": "Kunjungan ke toko buku untuk menyerap literatur sains, teknologi, dan sejarah, memperkaya khazanah penulisan novel fiksi dan wawasan komputasi.",
                "caption_en": "Browsing science, computing, and historical literature in a major bookstore, feeding narrative imagination and technological depth.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-17",
                "category": "akademik",
                "category_name_id": "Akademik & Kampus",
                "category_name_en": "Academic & Labs",
                "title_id": "Studi Mandiri & Refleksi Malam Bersama Lembaran Buku",
                "title_en": "Late-Night Independent Study & Book Reflection",
                "subtitle_id": "Kedisiplinan Membaca & Menempa Daya Analitis",
                "subtitle_en": "Reading Discipline & Analytical Focus in Solitude",
                "date": "April 2025",
                "location_id": "Ruang Belajar Mandiri, Ngawi",
                "location_en": "Private Study Desk, Ngawi",
                "image_url": "gallery/img_20250424_205542_604.webp",
                "caption_id": "Momen hening menelaah buku bacaan di malam hari, melatih ketekunan berpikir mendalam dan kecintaan murni pada ilmu pengetahuan.",
                "caption_en": "Quiet late-night reading session deepening analytical thinking, focus, and a sincere lifelong passion for learning.",
                "featured": false,
                "object_position": "center 30%"
        },
        {
                "id": "galeri-18",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Dedikasi Kepanduan di Tengah Mandala Bunga Melati",
                "title_en": "Scout Honor & Contemplation in Floral Mandala",
                "subtitle_id": "Kesucian Janji Tri Satya & Dasa Darma Pramuka",
                "subtitle_en": "Purity of Scout Code: Tri Satya & Dasa Darma",
                "date": "Februari 2025",
                "location_id": "Pusat Pendidikan Kepramukaan, Jawa Timur",
                "location_en": "Scout Training Grounds, East Java",
                "image_url": "gallery/img_20250208_131535_587.webp",
                "caption_id": "Duduk bersila dengan baret kepanduan di tengah formasi untaian bunga melati suci, merefleksikan janji setia membela bangsa, kejujuran, dan kesederhanaan.",
                "caption_en": "Sitting in calm reflection inside a jasmine floral mandala wearing the scout beret, meditating on the sacred scout oath of honor and integrity.",
                "featured": true,
                "object_position": "center center"
        },
        {
                "id": "galeri-19",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Apel Akbar & Kirab Kontingen Pramuka Penegak",
                "title_en": "Grand Scout Rally & Contingent Parade",
                "subtitle_id": "Disiplin Baris-Berbaris & Kekompakan Pandu Indonesia",
                "subtitle_en": "Marching Discipline & National Scout Camaraderie",
                "date": "Oktober 2024",
                "location_id": "Halaman Utama Balai Kota / Pemda",
                "location_en": "Civic Center Grand Plaza, East Java",
                "image_url": "gallery/img_20241019_171950_255.webp",
                "caption_id": "Kirab kehormatan dan parade kontingen pramuka penegak dalam balutan seragam lengkap berhasduk merah putih, memperkuat jiwa patriotisme generasi muda.",
                "caption_en": "Grand scout contingent parade in full uniform and red-and-white neckerchiefs, fostering patriotic pride and youth civic leadership.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-20",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Formasi Kontingen Lapangan & Semangat Kepanduan",
                "title_en": "Field Contingent Formation & Scout Spirit",
                "subtitle_id": "Kekuatan Karakter & Kebersamaan Lintas Daerah",
                "subtitle_en": "Character Building & Regional Scout Solidarity",
                "date": "Oktober 2024",
                "location_id": "Gelanggang Olahraga & Lapangan Upacara",
                "location_en": "Ceremonial Grounds, East Java",
                "image_url": "gallery/img_20241018_171403_171.webp",
                "caption_id": "Dokumentasi kebersamaan kontingen pramuka di lapangan rumput hijau usai upacara peringatan akbar, mencerminkan ketangguhan fisik dan mental.",
                "caption_en": "Contingent scout cohort on the green field following an official ceremonial assembly, embodying physical stamina and mental tenacity.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-21",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Barisan Sangga Pramuka Berprestasi di Lingkungan Sekolah",
                "title_en": "Distinguished Scout Patrol Assembly at School Grounds",
                "subtitle_id": "Kesiapan Menghadapi Lomba & Kemah Bakti Pelajar",
                "subtitle_en": "Competition Preparation & Community Camping Readiness",
                "date": "Oktober 2024",
                "location_id": "Pelataran Sekolah Menengah, Ngawi",
                "location_en": "School Courtyard, Ngawi",
                "image_url": "gallery/img_20241005_073009_186.webp",
                "caption_id": "Barisan regu pandu penegak berfoto bersama di halaman sekolah sebelum keberangkatan menuju perkemahan bakti pramuka tingkat kabupaten.",
                "caption_en": "Scout squad gathering in the school courtyard prior to departure for the inter-district scout championship camp.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-22",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Sambutan Kontingen Kegiatan Kemah Bakti Pramuka",
                "title_en": "Welcome Banner Assembly — Scout Community Camp",
                "subtitle_id": "Gerbang Kehormatan Peserta & Semangat Bertemu Sahabat Baru",
                "subtitle_en": "Honor Gate Welcoming Participants & New Friendships",
                "date": "September 2024",
                "location_id": "Gerbang Bumi Perkemahan Pelajar",
                "location_en": "Scout Campsite Honor Gate",
                "image_url": "gallery/img_20240920_224206_225.webp",
                "caption_id": "Dokumentasi di depan spanduk selamat datang peserta kemah pramuka, menandai dimulainya rangkaian petualangan kepemimpinan lapangan.",
                "caption_en": "Portrait before the welcoming arch of the regional scout camp, marking the kickoff of youth leadership field challenges.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-23",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Upacara & Pengukuhan Dewan Kehormatan Pramuka",
                "title_en": "Scout Council Honor Guard & Official Ceremony",
                "subtitle_id": "Tanggung Jawab Pemimpin Muda & Janji Bhakti Nusa Bangsa",
                "subtitle_en": "Youth Leadership Accountability & Civic Duty",
                "date": "Agustus 2024",
                "location_id": "Ruang Upacara Utama",
                "location_en": "Ceremonial Assembly Chamber",
                "image_url": "gallery/img_20240823_110505_958.webp",
                "caption_id": "Menjalankan tugas barisan kehormatan dalam upacara pelantikan pengurus ambalan kepramukaan dengan penuh ketertiban dan keteguhan sikap.",
                "caption_en": "Serving on the scout honor guard during the official council investiture ceremony, maintaining exemplary posture and decorum.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-24",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Malam Keakraban Api Unggun & Penghargaan Regu Terbaik",
                "title_en": "Campfire Brotherhood Night & Best Patrol Honor",
                "subtitle_id": "Kehangatan Persaudaraan di Bawah Gemintang Malam",
                "subtitle_en": "Nocturnal Fellowship Under Starlit Skies",
                "date": "Juni 2024",
                "location_id": "Bumi Perkemahan Lapangan Hijau",
                "location_en": "Open Campsite Grounds",
                "image_url": "gallery/img_20240624_221339_442.webp",
                "caption_id": "Malam puncak perkemahan dengan api unggun yang menyala hangat, merayakan keberhasilan regu meraih panji kehormatan dan kekompakan.",
                "caption_en": "Campfire finale celebrating troop achievements under starry night skies, honoring resilience and collaborative excellence.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-25",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Semarak Malam Kehormatan Pramuka di Gerbang Lampu",
                "title_en": "Illuminated Night Assembly — Scout Honor Gate",
                "subtitle_id": "Kebanggaan Korp Pramuka di Bawah Cahaya Lampu Hias",
                "subtitle_en": "Troop Pride Under Decorative Evening Lights",
                "date": "Januari 2025",
                "location_id": "Kompleks Pendidikan Kepramukaan",
                "location_en": "Scout Educational Campus",
                "image_url": "gallery/img_20250110_222512_488.webp",
                "caption_id": "Kebersamaan seluruh anggota regu berseragam pramuka lengkap berfoto di depan gapura berhias lampu malam dengan ekspresi gembira dan bangga.",
                "caption_en": "Full squad gathering before an illuminated ceremonial gate during evening activities, radiating joy and pride in scout brotherhood.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-26",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Kebersamaan Regu Pramuka dalam Harmoni Malam",
                "title_en": "Scout Patrol Night Fellowship & Harmony",
                "subtitle_id": "Solidaritas Tanpa Batas Antar Anggota Regu",
                "subtitle_en": "Unconditional Solidarity Across Patrol Members",
                "date": "Januari 2025",
                "location_id": "Kompleks Pendidikan Kepramukaan",
                "location_en": "Scout Educational Campus",
                "image_url": "gallery/img_20250110_222513_262.webp",
                "caption_id": "Dokumentasi keakraban regu pramuka di malam hari seusai penutupan kegiatan, memupuk persaudaraan yang abadi melintasi masa studi.",
                "caption_en": "Late-evening cohort celebration following the conclusion of annual camp events, strengthening bonds that endure beyond graduation.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-27",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Potret Tegap Pandu di Dinding Tebing Alam Wisata",
                "title_en": "Steadfast Scout Stature by Natural Rock Formations",
                "subtitle_id": "Eksplorasi Keindahan Alam & Ketahanan Jiwa Pandu",
                "subtitle_en": "Nature Appreciation & Enduring Stature",
                "date": "Oktober 2024",
                "location_id": "Taman Wisata Alam Berbatu, Jawa Timur",
                "location_en": "Natural Rock Park, East Java",
                "image_url": "gallery/img_20241017_083538_330.webp",
                "caption_id": "Potret tegap berdiri di depan tebing batu bertingkat mengenakan seragam pramuka lengkap, menyatu harmonis dengan keelokan alam Nusantara.",
                "caption_en": "Standing resolute beside tiered natural rock cliffs in full scout regalia, expressing harmony with Indonesia's natural landscape.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-28",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Keceriaan & Persaudaraan Pandu di Alam Terbuka",
                "title_en": "Joyful Outdoor Scout Camaraderie",
                "subtitle_id": "Tawa Riang & Kebahagiaan Menjelajah Bersama Sahabat",
                "subtitle_en": "Laughter & Open-Air Wilderness Exploration",
                "date": "Oktober 2024",
                "location_id": "Taman Wisata Alam Berbatu, Jawa Timur",
                "location_en": "Natural Rock Park, East Java",
                "image_url": "gallery/img_20241017_083704_694.webp",
                "caption_id": "Pose ceria bersama sahabat pramuka di bawah rindang pepohonan tebing, membuktikan bahwa kepanduan mendidik jiwa yang gembira dalam segala keadaan.",
                "caption_en": "Playful pose with a scout companion beside cliff foliage, illustrating the scout principle of facing every adventure with cheerful optimism.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-29",
                "category": "kegiatan",
                "category_name_id": "Vokasi & Pengabdian Masyarakat",
                "category_name_en": "Vocational & Community Service",
                "title_id": "Eksplorasi Bahari Bersama Rekan di Pesisir Pantai",
                "title_en": "Coastal Maritime Exploration with Peer Cohort",
                "subtitle_id": "Menikmati Deburan Ombak & Kehangatan Pasir Pantai",
                "subtitle_en": "Embracing Coastal Waves & Sandy Shores",
                "date": "Oktober 2024",
                "location_id": "Pantai Pesisir Selatan Jawa Timur",
                "location_en": "Southern East Java Coastline",
                "image_url": "gallery/img_20241017_140653_587.webp",
                "caption_id": "Kebersamaan di tepian pantai berpasir luas bersama sahabat karib, meregangkan pikiran setelah berminggu-minggu berkutat dengan tugas akademik.",
                "caption_en": "Beach excursion with close companions along the sandy coastline, unwinding after weeks of intensive academic and organizational work.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-30",
                "category": "pribadi",
                "category_name_id": "Potret Diri & Identitas",
                "category_name_en": "Portrait & Identity",
                "title_id": "Siluet Senja Emas di Tepian Cakrawala Pantai",
                "title_en": "Golden Sunset Horizon Silhouette at Coastline",
                "subtitle_id": "Menatap Pendar Jingga Matahari Terbenam",
                "subtitle_en": "Gazing into the Amber Sunset Horizon",
                "date": "Oktober 2024",
                "location_id": "Pesisir Pantai Selatan, Jawa Timur",
                "location_en": "South Coastline Beach, East Java",
                "image_url": "gallery/img_20241017_172435_292.webp",
                "caption_id": "Siluet anggun berdiri di tepi pantai dengan latar langit keemasan saat senja tiba, merenungi perjalanan hidup dan target besar masa depan.",
                "caption_en": "Reflective silhouette standing against golden evening waves at dusk, contemplating life's horizon and ambitious future goals.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-31",
                "category": "pribadi",
                "category_name_id": "Potret Diri & Identitas",
                "category_name_en": "Portrait & Identity",
                "title_id": "Hening Refleksi Jiwa di Cakrawala Matahari Terbenam",
                "title_en": "Tranquil Soul Reflection at Twilight Horizon",
                "subtitle_id": "Ketenteraman Hati di Bawah Semburat Cahaya Langit",
                "subtitle_en": "Inner Peace Under Twilight's Gentle Glow",
                "date": "Oktober 2024",
                "location_id": "Pesisir Pantai Selatan, Jawa Timur",
                "location_en": "South Coastline Beach, East Java",
                "image_url": "gallery/img_20241017_172706_408.webp",
                "caption_id": "Momen hening menatap lembayung senja, mensyukuri napas kehidupan dan rahmat Tuhan yang membentang tanpa batas di alam semesta.",
                "caption_en": "Quiet moment of gratitude gazing at the twilight sky, grounding high ambitions in humble appreciation for life's wonders.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-32",
                "category": "pribadi",
                "category_name_id": "Potret Diri & Identitas",
                "category_name_en": "Portrait & Identity",
                "title_id": "Gelak Tawa Kebersamaan Rekan Seperjuangan di Waktu Senja",
                "title_en": "Laughter & Companionship of Comrades at Dusk",
                "subtitle_id": "Sahabat Sejati yang Senantiasa Berbagi Cerita",
                "subtitle_en": "True Companions Sharing Genuine Smiles and Stories",
                "date": "Oktober 2024",
                "location_id": "Pesisir Wisata Jawa Timur",
                "location_en": "Coastal Retreat, East Java",
                "image_url": "gallery/img_20241017_180706_317.webp",
                "caption_id": "Foto swafoto penuh keceriaan bersama kawan-kawan saat malam mulai turun, mengabadikan canda tawa dan persahabatan yang tulus apa adanya.",
                "caption_en": "Spontaneous selfie snapshot filled with radiant smiles as night sets in, capturing authentic companionship that weathers all seasons.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-33",
                "category": "akademik",
                "category_name_id": "Akademik & Kampus",
                "category_name_en": "Academic & Labs",
                "title_id": "Sosialisasi Program Pendidikan & Inspirasi Mahasiswa Baru",
                "title_en": "Higher Education Socialization & Student Mentorship",
                "subtitle_id": "Berbagi Pengalaman Kuliah & Motivasi Belajar Berprestasi",
                "subtitle_en": "Sharing Academic Pathways & Motivation for Aspirants",
                "date": "Agustus 2024",
                "location_id": "Auditorium Pendidikan Terpadu",
                "location_en": "Educational Assembly Auditorium",
                "image_url": "gallery/img_20240823_114732_893.webp",
                "caption_id": "Menghadiri sesi sosialisasi kampus dan pengenalan dunia perkuliahan vokasi bersama rombongan mahasiswa berjas biru di aula pertemuan.",
                "caption_en": "Participating in higher education guidance and academic orientation in the central hall alongside fellow student delegates.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-34",
                "category": "akademik",
                "category_name_id": "Akademik & Kampus",
                "category_name_en": "Academic & Labs",
                "title_id": "Kunjungan Edukasi Kampus Expo & Pameran Inovasi",
                "title_en": "Campus Expo Visit & Higher Education Innovation Fair",
                "subtitle_id": "Menelusuri Stan Universitas & Peluang Riset Teknologi",
                "subtitle_en": "Exploring University Booths & Tech Innovation Tracks",
                "date": "Januari 2025",
                "location_id": "Arena Pameran Pendidikan Jawa Timur",
                "location_en": "Education Expo Convention, East Java",
                "image_url": "gallery/img_20250115_121500_302.webp",
                "caption_id": "Menjelajahi aneka stan pameran kampus dengan tas ransel dan ID card peserta, mencari informasi mendalam tentang kurikulum informatika terkemuka.",
                "caption_en": "Exploring university pavilions at the annual education fair with delegate lanyard and backpack, discovering top informatics curricula.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-35",
                "category": "akademik",
                "category_name_id": "Akademik & Kampus",
                "category_name_en": "Academic & Labs",
                "title_id": "Potret Semangat Kepemudaan Pelajar Ngawi",
                "title_en": "Youthful Focus & Aspirations of Ngawi Students",
                "subtitle_id": "Karakter Mandiri & Integritas Generasi Penerus",
                "subtitle_en": "Independent Character & Integrity of the Rising Generation",
                "date": "Maret 2025",
                "location_id": "Ngawi, Jawa Timur",
                "location_en": "Ngawi, East Java",
                "image_url": "gallery/img_20250324_165958_735.webp",
                "caption_id": "Potret wajah penuh keramahan dan optimisme berbusana jaket biru almamater, memancarkan kesungguhan belajar untuk masa depan cerah.",
                "caption_en": "Portrait reflecting sincerity and optimism in student attire, embodying the drive to excel through relentless dedication.",
                "featured": false,
                "object_position": "center 20%"
        },
        {
                "id": "galeri-36",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Potret Jas Almamater Kuning Kebanggaan Organisasi",
                "title_en": "Yellow Leadership Blazer & Organizational Pride",
                "subtitle_id": "Kesiapan Menjalankan Amanah Kepemimpinan Pelajar",
                "subtitle_en": "Readiness to Fulfill Student Leadership Mandate",
                "date": "November 2024",
                "location_id": "Ruang Representasi Pemuda, Jawa Timur",
                "location_en": "Youth Representation Chamber, East Java",
                "image_url": "gallery/img_20241109_093954_579.webp",
                "caption_id": "Mengenakan jas kuning dinas organisasi pelajar berkemajuan, simbol integritas, dedikasi intelektual, dan kesiapan melayani ummat.",
                "caption_en": "Wearing the distinctive yellow leadership blazer, a hallmark of progressive student governance, intellectual discipline, and service.",
                "featured": false,
                "object_position": "center 20%"
        },
        {
                "id": "galeri-37",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Wibawa Generasi Muda Pembelajar Berkemajuan",
                "title_en": "Stature of the Progressive Youth Scholar",
                "subtitle_id": "Meneguhkan Janji Berorganisasi Demi Kemaslahatan",
                "subtitle_en": "Affirming Organizational Responsibility for the Greater Good",
                "date": "November 2024",
                "location_id": "Ruang Representasi Pemuda, Jawa Timur",
                "location_en": "Youth Representation Chamber, East Java",
                "image_url": "gallery/img_20241109_093958_067.webp",
                "caption_id": "Kesiapan mental dan penampilan rapi sebelum melangkah menghadiri rapat kerja wilayah kepemimpinan pelajar Jawa Timur.",
                "caption_en": "Preparedness and neat personal presentation before attending the regional youth governance deliberative session.",
                "featured": false,
                "object_position": "center 20%"
        },
        {
                "id": "galeri-38",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Dokumentasi Seragam Jas Kehormatan Organisasi",
                "title_en": "Formal Attire & Identity Documentation",
                "subtitle_id": "Disiplin Tampilan & Representasi Profesional Pemuda",
                "subtitle_en": "Sartorial Discipline & Professional Youth Representation",
                "date": "November 2024",
                "location_id": "Ruang Representasi Pemuda, Jawa Timur",
                "location_en": "Youth Representation Chamber, East Java",
                "image_url": "gallery/img_20241109_094006_572.webp",
                "caption_id": "Dokumentasi seragam jas kehormatan yang mencerminkan ketertiban diri dan rasa bangga bernaung di bawah payung ikatan gerakan pelajar.",
                "caption_en": "Archival documentation in the formal organization blazer, symbolizing self-discipline and institutional pride.",
                "featured": false,
                "object_position": "center 20%"
        },
        {
                "id": "galeri-39",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Punggung Tangguh Pejuang Cita dalam Balutan Almamater",
                "title_en": "Resolute Stature of the Aspiration Bearer",
                "subtitle_id": "Memikul Harapan & Melangkah Mantap Menatap Hari Depan",
                "subtitle_en": "Bearing Hopes & Stepping Confidently into Tomorrow",
                "date": "September 2025",
                "location_id": "Jawa Timur",
                "location_en": "East Java",
                "image_url": "gallery/img_20250903_180040_349.webp",
                "caption_id": "Pose tegap membelakangi cermin memperlihatkan siluet punggung pemuda berjas kuning yang siap memikul tanggung jawab peradaban masa depan.",
                "caption_en": "Firm silhouette standing tall in yellow blazer, reflecting the willingness to carry the responsibilities of tomorrow's technological world.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-40",
                "category": "prestasi",
                "category_name_id": "Prestasi & Kredensial Global",
                "category_name_en": "Achievements & Global Credentials",
                "title_id": "Keteguhan Sikap & Disiplin Diri Insan Akademik",
                "title_en": "Academic Poise & Sartorial Precision",
                "subtitle_id": "Standar Formalitas Profesional Berstandar Industri",
                "subtitle_en": "Industry-Standard Professional Formality",
                "date": "September 2025",
                "location_id": "Studio Persiapan, Jawa Timur",
                "location_en": "Preparation Studio, East Java",
                "image_url": "gallery/img_20250901_122404_850.webp",
                "caption_id": "Mengenakan setelan jas formal hitam rapi, merefleksikan transformasi kedewasaan profesional menuju panggung rekayasa teknologi modern.",
                "caption_en": "Formal dark suit attire reflecting professional maturity and readiness for global technological industry engagements.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-41",
                "category": "akademik",
                "category_name_id": "Akademik & Kampus",
                "category_name_en": "Academic & Labs",
                "title_id": "Siang Ceria di Halaman Sekolah Menengah Ngawi",
                "title_en": "Noon Moments at High School Courtyard, Ngawi",
                "subtitle_id": "Dinamika Hari Belajar Penuh Keceriaan & Persahabatan",
                "subtitle_en": "Vibrant School Day Memories & Daily Fellowship",
                "date": "November 2024",
                "location_id": "Halaman Sekolah Menengah, Ngawi",
                "location_en": "School Courtyard, Ngawi",
                "image_url": "gallery/img_20241129_131320_882.webp",
                "caption_id": "Swafoto santai di pelataran sekolah saat jam istirahat siang, merekam kenangan bersahaja di tengah rutinitas belajar yang dinamis.",
                "caption_en": "Courtyard selfie during school recess, preserving unpretentious memories amidst rigorous technical studies.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-42",
                "category": "pribadi",
                "category_name_id": "Potret Diri & Identitas",
                "category_name_en": "Portrait & Identity",
                "title_id": "Jamuan Hangat & Cengkrama Akrab Rekan Seperjuangan",
                "title_en": "Warm Feast & Authentic Table Camaraderie",
                "subtitle_id": "Mensyukuri Hidangan Bersama Sahabat Terdekat",
                "subtitle_en": "Breaking Bread Together & Sharing Heartfelt Stories",
                "date": "2026",
                "location_id": "Resto & Rumah Makan Santai, Jawa Timur",
                "location_en": "Community Dining Spot, East Java",
                "image_url": "gallery/motion_photo_4189568636415030766.webp",
                "caption_id": "Duduk bersama di meja perjamuan menikmati sajian hangat setelah rangkaian kegiatan panjang, mempererat tali persaudaraan yang tulus.",
                "caption_en": "Sharing a meal around the dinner table following intensive collaborative projects, strengthening mutual trust and camaraderie.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-43",
                "category": "kegiatan",
                "category_name_id": "Vokasi & Pengabdian Masyarakat",
                "category_name_en": "Vocational & Community Service",
                "title_id": "Perjalanan Pagi & Semangat Menuntut Ilmu Kereta Api",
                "title_en": "Dawn Rail Journey & The Quest for Knowledge",
                "subtitle_id": "Menembus Fajar Perjalanan Antar Kota Jawa Timur",
                "subtitle_en": "Inter-City Rail Travel Across East Java at Sunrise",
                "date": "Juni 2026",
                "location_id": "Rangkaian Kereta Api Menuju Kampus",
                "location_en": "East Java Rail Corridor",
                "image_url": "gallery/img_20260624_045658_781.webp",
                "caption_id": "Memulai perjalanan di subuh hari menggunakan moda transportasi kereta api, bukti tekad bulat yang tidak pernah surut demi menggapai cita-cita.",
                "caption_en": "Embarking on early-morning train travel across East Java, driven by relentless resolve to seek knowledge and master computing skills.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-44",
                "category": "pribadi",
                "category_name_id": "Potret Diri & Identitas",
                "category_name_en": "Portrait & Identity",
                "title_id": "Nuansa Luhur Tradisi — Busana Batik & Kedamaian Desa Ngawi",
                "title_en": "Echoes of Heritage — Traditional Batik & Rural Peace, Ngawi",
                "subtitle_id": "Ketenteraman Pedesaan Ringinanom • Karangjati Ramah",
                "subtitle_en": "Serenity of Ringinanom • Karangjati, Ngawi",
                "date": "Maret 2026",
                "location_id": "Ringinanom, Karangjati, Ngawi",
                "location_en": "Ringinanom, Karangjati, Ngawi",
                "image_url": "gallery/img_20260321_074110_751.webp",
                "caption_id": "Potret pribadi berbusana batik bercorak parang dan sarung di bawah semilir pohon rindang pedesaan Ngawi, merawat ketenangan batin di tengah dinamika dunia teknologi.",
                "caption_en": "Reflective personal portrait wearing traditional batik and sarong under village foliage in peaceful Ngawi, grounding high-tech aspirations in cultural wisdom.",
                "featured": false,
                "object_position": "center 20%"
        },
        {
                "id": "galeri-45",
                "category": "pribadi",
                "category_name_id": "Potret Diri & Identitas",
                "category_name_en": "Portrait & Identity",
                "title_id": "Senyum Ramah Salam Hangat & Sikap Rendah Hati",
                "title_en": "Warm Namaste Greeting & Sincere Humility",
                "subtitle_id": "Menjunjung Tinggi Adab Kesopanan & Silaturahmi",
                "subtitle_en": "Upholding Polite Demeanor & Friendly Respect",
                "date": "2024",
                "location_id": "Karangjati, Ngawi",
                "location_en": "Karangjati, Ngawi",
                "image_url": "gallery/6942491316333724674_avatar.png.webp",
                "caption_id": "Potret bersahaja dengan pose menangkupkan kedua tangan tanda salam penghormatan dan keramahan hati kepada siapa pun yang dijumpai.",
                "caption_en": "Gentle portrait with folded hands in respectful greeting, embodying core values of humility, polite manners, and warm hospitality.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-46",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Memori Masa Kecil — Petualangan Berani di Dahan Pohon",
                "title_en": "Childhood Memory — Free-Spirited Explorer in the Trees",
                "subtitle_id": "Keberanian Masa Kecil & Kenangan Tak Terlupakan",
                "subtitle_en": "Fearless Childhood Days & Cherished Memories",
                "date": "Masa Kecil",
                "location_id": "Karangjati, Ngawi, Jawa Timur",
                "location_en": "Karangjati, Ngawi, East Java",
                "image_url": "gallery/fb_img_1758366169009.webp",
                "caption_id": "Rekaman nostalgia masa kanak-kanak memanjat pohon rindang bersama saudara di pekarangan rumah, mengingatkan pada keberanian dan rasa ingin tahu yang tak pernah padam.",
                "caption_en": "Nostalgic childhood snapshot climbing a leafy tree with a sibling, embodying early fearlessness, curiosity, and joyful discovery in rural nature.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-47",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Kasih Sayang Murni Masa Kecil Bersama Adik Tersayang",
                "title_en": "Childhood Warmth & Unconditional Sibling Love",
                "subtitle_id": "Tumbuh Bersama dalam Kesederhanaan & Kehangatan Keluarga",
                "subtitle_en": "Growing Up with Sibling Love & Warmth in Rural Java",
                "date": "Masa Kecil",
                "location_id": "Karangjati, Ngawi, Jawa Timur",
                "location_en": "Karangjati, Ngawi, East Java",
                "image_url": "gallery/fb_img_1758366184838.webp",
                "caption_id": "Kenangan masa kecil menggendong dan menemani adik perempuan tersayang di beranda rumah, simbol kasih sayang persaudaraan yang senantiasa dijaga selamanya.",
                "caption_en": "Treasured vintage childhood photo holding and caring for his beloved younger sister, an enduring emblem of unconditional sibling love and family protection.",
                "featured": false,
                "object_position": "center 28%"
        },
        {
                "id": "galeri-48",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Jejak Petualang Cilik Menyusuri Karang Pantai",
                "title_en": "Little Explorer Navigating Rocky Seashores",
                "subtitle_id": "Kekaguman Pertama Pada Luasnya Samudra",
                "subtitle_en": "First Wonders Before the Vast Ocean Waters",
                "date": "Masa Kecil",
                "location_id": "Pantai Karang Jawa Timur",
                "location_en": "Rocky Seashore, East Java",
                "image_url": "gallery/fb_img_1758365904497.webp",
                "caption_id": "Potret masa kecil bertelanjang kaki berpetualang di atas batu karang pantai, menyerap rasa kagum pada ciptaan alam sejak usia dini.",
                "caption_en": "Childhood snapshot wading along rocky coastal tidal pools, nurturing early wonder and exploratory boldness.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-49",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Masa Kecil Penuh Semangat & Kebebasan Bermain",
                "title_en": "Vibrant Childhood Days & Playful Free Spirit",
                "subtitle_id": "Senyum Polos nan Tulus di Bawah Langit Terbuka",
                "subtitle_en": "Innocent Smile Under Open Village Skies",
                "date": "Masa Kecil",
                "location_id": "Karangjati, Ngawi",
                "location_en": "Karangjati, Ngawi",
                "image_url": "gallery/fb_img_1758366060499.webp",
                "caption_id": "Potret masa kecil berkaus merah dengan senyum khas yang riang, menggambarkan masa kanak-kanak yang bahagia dan penuh keceriaan alami.",
                "caption_en": "Joyful childhood picture in red shirt radiating boundless optimism and the happy innocence of rural upbringing.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-50",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Kehangatan Kasih Ibu & Keutuhan Rumah Keluarga",
                "title_en": "Maternal Tenderness & Childhood Hearth",
                "subtitle_id": "Dekapan Kasih Ibu yang Menjadi Lentera Kehidupan",
                "subtitle_en": "Mother's Embrace Lighting the Pathway of Life",
                "date": "Masa Kecil",
                "location_id": "Rumah Kediaman Karangjati, Ngawi",
                "location_en": "Family Residence, Karangjati, Ngawi",
                "image_url": "gallery/fb_img_1758366163752.webp",
                "caption_id": "Dokumentasi masa kecil di rumah bersama ibunda tercinta dan adik tersayang, pondasi cinta kasih tak bersyarat yang menemani setiap langkah perjuangan.",
                "caption_en": "Precious childhood home memory embraced by beloved mother with sister, the foundational source of empathy and enduring resolve.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-51",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Kilas Balik Momen Bersejarah — Pengabdian Kepengurusan",
                "title_en": "Historic Milestones — Leadership Service Flashback",
                "subtitle_id": "Rekaman Jejak Langkah Organisasi Pelajar Berprestasi",
                "subtitle_en": "Chronicle of Student Leadership & Community Contribution",
                "date": "November 2024",
                "location_id": "Dokumentasi Wilayah Jawa Timur",
                "location_en": "East Java Regional Records",
                "image_url": "gallery/screenshot_20241109-170130.webp",
                "caption_id": "Tangkapan dokumentasi momentum pengabdian kepengurusan pemuda, mengabadikan dedikasi waktu dan tenaga untuk kemajuan bersama.",
                "caption_en": "Archived screenshot commemorating dedicated leadership tenure and youth organizational service across East Java.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-52",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Kenangan Manis Senyum Riang Masa Kanak-Kanak",
                "title_en": "Sweet Memories: Cheerful Childhood Smile",
                "subtitle_id": "Kepolosan Hati yang Menjadi Pengingat Keikhlasan",
                "subtitle_en": "Pure Hearted Innocence Reminding Enduring Sincerity",
                "date": "Masa Kecil",
                "location_id": "Arsip Pribadi, Ngawi",
                "location_en": "Personal Family Archive, Ngawi",
                "image_url": "gallery/screenshot_20250920-175920.webp",
                "caption_id": "Arsip foto kenangan masa kecil tersenyum lebar dengan sorot mata berbinar, mengingatkan untuk selalu menjaga ketulusan hati dalam setiap karya.",
                "caption_en": "Archival childhood portrait with glowing eyes and radiant smile, a lifelong reminder to approach all creations with genuine sincerity.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-53",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Foto Kenangan Berharga Bersaudara Sejak Dini",
                "title_en": "Precious Bond: Sibling Nurturance in Childhood",
                "subtitle_id": "Menjaga dan Mengayomi Adik Sejak Usia Kanak-Kanak",
                "subtitle_en": "Caring for Younger Sibling from Earliest Years",
                "date": "Masa Kecil",
                "location_id": "Arsip Pribadi, Ngawi",
                "location_en": "Personal Family Archive, Ngawi",
                "image_url": "gallery/screenshot_20250920-175928.webp",
                "caption_id": "Arsip kenangan duduk bersama adik di kamar tidur bersahaja, membina rasa tanggung jawab persaudaraan yang mengakar kuat sepanjang masa.",
                "caption_en": "Childhood archival memory tending to baby sister, building a profound sense of protective brotherly care and familial duty.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-54",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Tawa Riang & Kebahagiaan Bersaudara nan Bersahaja",
                "title_en": "Innocent Laughter & Modest Childhood Happiness",
                "subtitle_id": "Momen Sederhana yang Menjadi Memori Abadi",
                "subtitle_en": "Unpretentious Moments Forming Timeless Memories",
                "date": "Masa Kecil",
                "location_id": "Arsip Pribadi, Ngawi",
                "location_en": "Personal Family Archive, Ngawi",
                "image_url": "gallery/screenshot_20250920-175935.webp",
                "caption_id": "Dokumentasi arsip kebersamaan saudara tersenyum berseri di kasur sederhana, membuktikan bahwa kebahagiaan sejati bertumpu pada kasih sayang keluarga.",
                "caption_en": "Sibling snapshot smiling together on simple bedding, proving that authentic human happiness rests firmly upon family love.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-55",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Dokumentasi Foto Kalender Masa Kecil di Alam Bebas",
                "title_en": "Vintage Calendar Archive — Outdoor Childhood Days",
                "subtitle_id": "Kenangan Bersejarah Berlatar Alam Desa yang Hijau",
                "subtitle_en": "Historical Snapshot Framed by Lush Village Greens",
                "date": "25 Januari",
                "location_id": "Pekarangan Asri, Karangjati, Ngawi",
                "location_en": "Verdant Village Greens, Karangjati, Ngawi",
                "image_url": "gallery/screenshot_20250920-175945.webp",
                "caption_id": "Arsip cetak kalender nostalgia masa kanak-kanak berpose di antara rerimbunan pohon hijau desa, jejak langkah awal yang membentuk pribadi tangguh.",
                "caption_en": "Vintage calendar photo keepsake posing amidst lush village greenery, a reminder of early roots shaping lifelong resilience.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-56",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Kenangan Masa Kecil Bermotor Bersama Keluarga",
                "title_en": "Childhood Motorcycle Journey with Sibling",
                "subtitle_id": "Keceriaan Petualangan Mengelilingi Jalanan Pedesaan",
                "subtitle_en": "Delightful Rides Exploring Quiet Village Lanes",
                "date": "Masa Kecil",
                "location_id": "Karangjati, Ngawi, Jawa Timur",
                "location_en": "Karangjati, Ngawi, East Java",
                "image_url": "gallery/screenshot_20250920-180218.webp",
                "caption_id": "Foto kenangan masa kecil berdiri di samping sepeda motor keluarga bersama adik kecil, simbol keberanian bertualang menyusuri jalanan desa.",
                "caption_en": "Nostalgic snapshot standing beside the family motorcycle with younger sister, capturing the innocent joy of discovering village roads.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-57",
                "category": "prestasi",
                "category_name_id": "Prestasi & Kredensial Global",
                "category_name_en": "Achievements & Global Credentials",
                "title_id": "Khohar M.F. — Rekayasa Perangkat Lunak & Kecerdasan Artifisial",
                "title_en": "Khohar M.F. — Software Engineering & Applied Artificial Intelligence",
                "subtitle_id": "Penerima 8 Medali Emas Olimpiade Sains Nasional • Peneliti AI",
                "subtitle_en": "8x National Science Olympiad Gold Medalist • AI Engineer",
                "date": "2026",
                "location_id": "Malang & Ngawi, Jawa Timur",
                "location_en": "Malang & Ngawi, East Java",
                "image_url": "gallery/khohar_profil_rekayasa.webp",
                "caption_id": "Potret visual profil utama melambangkan dedikasi mutlak dalam arsitektur komputasi modern, optimasi latensi rendah, riset model kecerdasan artifisial, dan narasi sastra budaya.",
                "caption_en": "Signature visual avatar encapsulating absolute dedication to modern computational architecture, low-latency engineering, and cultural literature.",
                "featured": true,
                "object_position": "center 20%"
        }
];

    function renderGallery() {
        const lang = window.currentPortfolioLang || localStorage.getItem('prefLang') || 'en';
        track.innerHTML = '';
        if (dotsContainer) dotsContainer.innerHTML = '';

        if (!galleryItems || galleryItems.length === 0) {
            track.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted); width: 100%;">
                    <i class="fas fa-camera-retro" style="font-size: 2rem; margin-bottom: 12px; display: block; opacity: 0.5;"></i>
                    <p>${lang === 'en' ? 'No photos in the gallery yet. You can add them to gallery/ anytime!' : 'Belum ada foto dalam galeri. Anda dapat menambahkannya ke folder gallery/ kapan saja!'}</p>
                </div>
            `;
            return;
        }

        galleryItems.forEach((item, index) => {
            const title = (lang === 'en' && item.title_en) ? item.title_en : item.title_id;
            const subtitle = cleanText((lang === 'en' && item.subtitle_en) ? item.subtitle_en : item.subtitle_id);
            const categoryName = (lang === 'en' && item.category_name_en) ? item.category_name_en : item.category_name_id;
            const location = cleanText((lang === 'en' && item.location_en) ? item.location_en : item.location_id);
            const caption = cleanText((lang === 'en' && item.caption_en) ? item.caption_en : item.caption_id);
            const themeClass = getThemeClass(item.category);

            const card = document.createElement('div');
            card.className = 'gallery-slide-card genshin-card reveal active';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', title);

            card.innerHTML = `
                <div class="gallery-cover-frame ${themeClass}" style="height: 100%; border-radius: 16px; overflow: hidden;">
                    <img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(title)}" class="gallery-cover-real-img" style="width:100%;height:100%;object-fit:cover;${item.object_position ? `object-position:${escapeHtml(item.object_position)};` : ''}" loading="${index < 4 ? 'eager' : 'lazy'}" decoding="async" onerror="this.onerror=null;this.style.display='none';">
                    <div class="gallery-cover-glare"></div>
                </div>
            `;

            // Card click & keyboard navigation to open Lightbox (ignoring drag movement)
            card.addEventListener('click', () => {
                if (track.classList.contains('was-dragged')) return;
                openLightbox(index);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(index);
                }
            });

            track.appendChild(card);

            // Generate diamond pagination pip
            if (dotsContainer) {
                const dot = document.createElement('button');
                dot.className = `gallery-dot ${index === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Go to photo ${index + 1}`);
                dot.setAttribute('title', `${lang === 'en' ? 'Photo' : 'Foto'} ${index + 1}: ${title}`);
                dot.addEventListener('click', () => {
                    const targetLeft = card.offsetLeft - track.offsetLeft;
                    track.scrollTo({ left: targetLeft, behavior: 'smooth' });
                });
                dotsContainer.appendChild(dot);
            }
        });

        setTimeout(updateSliderState, 120);
    }

    // Prev / Next button click handlers with infinite wrap-around (cyclic loop)
    prevBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollLeft = track.scrollLeft;
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        const step = getCardStep();

        // If at the beginning, wrap to the end
        if (scrollLeft <= Math.max(25, step * 0.25)) {
            track.scrollTo({ left: maxScroll, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: -step, behavior: 'smooth' });
        }
    });

    nextBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        const scrollLeft = track.scrollLeft;
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
        const step = getCardStep();

        // If at the end or within remaining step from end, wrap around to the beginning
        if (scrollLeft >= maxScroll - Math.max(30, step * 0.75)) {
            track.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: step, behavior: 'smooth' });
        }
    });

    // Drag-to-scroll support for desktop mouse users
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let dragDistance = 0;

    track.addEventListener('mousedown', (e) => {
        isDown = true;
        dragDistance = 0;
        track.classList.add('is-dragging');
        track.classList.remove('was-dragged');
        startX = e.pageX - track.offsetLeft;
        scrollStart = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        track.classList.remove('is-dragging');
        if (dragDistance > 6) {
            track.classList.add('was-dragged');
            setTimeout(() => track.classList.remove('was-dragged'), 220);
        }
        setTimeout(updateSliderState, 150);
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.35;
        dragDistance = Math.abs(x - startX);
        if (dragDistance > 4) {
            e.preventDefault();
            track.scrollLeft = scrollStart - walk;
        }
    });

    // Throttled scroll listener
    let ticking = false;
    track.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateSliderState();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', updateSliderState);

    // Lightbox modal functionality
    function openLightbox(index) {
        if (!lightbox || !galleryItems[index]) return;
        currentLightboxIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function updateLightboxContent() {
        const item = galleryItems[currentLightboxIndex];
        if (!item) return;
        const lang = window.currentPortfolioLang || localStorage.getItem('prefLang') || 'en';

        const title = (lang === 'en' && item.title_en) ? item.title_en : item.title_id;
        const subtitle = cleanText((lang === 'en' && item.subtitle_en) ? item.subtitle_en : item.subtitle_id);
        const categoryName = (lang === 'en' && item.category_name_en) ? item.category_name_en : item.category_name_id;
        const location = cleanText((lang === 'en' && item.location_en) ? item.location_en : item.location_id);
        const caption = cleanText((lang === 'en' && item.caption_en) ? item.caption_en : item.caption_id);

        if (lightboxImg) {
            lightboxImg.src = item.image_url;
            lightboxImg.alt = title;
        }
        if (lightboxCat) lightboxCat.textContent = categoryName;
        if (lightboxDate) lightboxDate.innerHTML = `<i class="far fa-calendar-alt"></i> ${escapeHtml(item.date)}`;
        if (lightboxLoc) lightboxLoc.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${escapeHtml(location)}`;
        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxSubtitle) lightboxSubtitle.textContent = subtitle;
        if (lightboxDesc) lightboxDesc.textContent = caption;

        if (lightboxPrev) lightboxPrev.style.display = galleryItems.length > 1 ? 'flex' : 'none';
        if (lightboxNext) lightboxNext.style.display = galleryItems.length > 1 ? 'flex' : 'none';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function nextPhoto() {
        if (galleryItems.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
        updateLightboxContent();
    }

    function prevPhoto() {
        if (galleryItems.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxBackdrop?.addEventListener('click', closeLightbox);
    lightboxPrev?.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });
    lightboxNext?.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });

    // Touch swipe gesture support for seamless mobile photo navigation
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    lightbox?.addEventListener('touchstart', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox?.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        // Check if horizontal gesture was dominant and reached threshold (> 40px)
        if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
            if (diffX < 0) {
                nextPhoto(); // Swiped left -> Next photo
            } else {
                prevPhoto(); // Swiped right -> Previous photo
            }
        }
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextPhoto();
        if (e.key === 'ArrowLeft') prevPhoto();
    });

    window.renderPhotoGallery = renderGallery;

    // Fetch galeri.json with stable versioned cache
    fetch('galeri.json?v=34')
        .then(res => {
            if (!res.ok) throw new Error('galeri.json load error');
            return res.json();
        })
        .then(data => {
            galleryItems = Array.isArray(data) && data.length > 0 ? data : fallbackGallery;
            renderGallery();
        })
        .catch(err => {
            console.info('Using fallback photo gallery data:', err.message);
            galleryItems = fallbackGallery;
            renderGallery();
        });
}

document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Initialize Page Entry Preloader
    initPageLoader();

    // 0.1 Initialize Fiction / Novel Slider
    initFictionSlider();

    // 0.2 Initialize The Grand Codex Bookshelf Archive
    initBookshelfArchive();

    // 0.3 Initialize Photo Documentation & Activity Gallery
    initPhotoGallery();
    
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
        window.currentPortfolioLang = lang;

        // Ganti Teks Statis Seketika (0 ms)
        document.querySelectorAll('[data-id]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) el.innerHTML = text;
        });

        // Ganti Placeholder Input Dinamis
        document.querySelectorAll('[data-placeholder-id]').forEach(el => {
            const ph = el.getAttribute(`data-placeholder-${lang}`);
            if (ph) el.placeholder = ph;
        });

        // Update Label Tombol
        if(langText) langText.innerText = lang.toUpperCase() === 'EN' ? 'EN / ID' : 'ID / EN';

        // Simpan Memori
        localStorage.setItem('prefLang', lang);
        currentLang = lang;

        // Segarkan Rak Buku Arsip Kredensial
        window.renderBookshelf?.();

        // Segarkan Galeri Foto Dokumentasi
        window.renderPhotoGallery?.();

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

    const articleImages = {
        'transformasi-lanskap-kecerdasan-artifisial': 'artikel/assets/transformasi-lanskap-ai-enterprise-hero.jpg',
        'adopsi-small-language-models-perbankan': 'artikel/assets/slm-perbankan-onpremise-hero.jpg',
        'model-context-protocol-multi-agent-enterprise': 'artikel/assets/mcp-arsitektur-enterprise-hero.jpg',
        'ai-agent-manajemen-rantai-pasok': 'artikel/assets/ai-agent-supply-chain-hero.jpg',
        'ai-agent-cybersecurity-soc-enterprise': 'artikel/assets/ai-soc-cybersecurity-hero.jpg',
        'ai-software-engineering-agents-sdlc': 'artikel/assets/ai-swe-agents-sdlc-hero.jpg',
        'manajemen-talenta-berbasis-ai-etika': 'artikel/assets/ai-talent-management-ethics-hero.jpg'
    };

    articleContainer.innerHTML = '';
    articleList.slice(0, 4).forEach((item, idx) => {
        const title = (lang === 'en' && item.judul_en) ? item.judul_en : item.judul;
        const excerpt = (lang === 'en' && item.deskripsi_en) ? item.deskripsi_en : item.deskripsi;
        const readLabel = lang === 'en' ? 'Read Technical Publication' : 'Baca Publikasi Lengkap';
        const articleLink = item.link || 'artikel/';
        const readingTime = item.reading_time || (lang === 'en' ? '15 min read' : '~15 menit baca');
        const dateStr = item.created_at || '2026-10-01';
        const thumbUrl = item.gambar || articleImages[item.id] || 'artikel/assets/transformasi-lanskap-ai-enterprise-hero.jpg';

        const card = document.createElement('div');
        card.className = 'article-entry-card reveal active featured-article';
        card.innerHTML = `
            <div class="article-thumb-frame">
                <img src="${escapeHtml(thumbUrl)}" alt="${escapeHtml(title)}" class="article-thumb-img" loading="${idx < 2 ? 'eager' : 'lazy'}" decoding="async" onerror="this.onerror=null;this.style.display='none';">
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
                <span class="article-cat" style="margin-bottom: 0;">${escapeHtml(item.kategori || 'Applied Artificial Intelligence')}</span>
                <span style="font-size: 0.78rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 6px;">
                    <i class="far fa-calendar-alt" style="color: var(--accent);"></i> ${escapeHtml(dateStr)} • ${escapeHtml(readingTime)}
                </span>
            </div>
            <h4 class="article-heading notranslate">${escapeHtml(title)}</h4>
            <p class="article-excerpt">${escapeHtml(excerpt || '')}</p>
            <a href="${articleLink}" class="project-footer-link">
                <span>${readLabel}</span> <i class="fas fa-arrow-right"></i>
            </a>
        `;
        articleContainer.appendChild(card);
    });
}

// ==========================================================================
// COUNT-UP ANIMATION FOR HERO STATS
// ==========================================================================
function initCountUpAnimation() {
    const counters = document.querySelectorAll('.stat-num');
    if (!counters.length) return;
    
    const animateCounter = (el) => {
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)(.*)/); 
        if (!match) return;
        const target = parseInt(match[1]);
        const suffix = match[2]; // '+', 'x', etc.
        const duration = 1500;
        const start = performance.now();
        
        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.round(target * eased);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat-num');
                stats.forEach(el => animateCounter(el));
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const heroCard = document.querySelector('.hero-stats-card, .stat-grid, .hero-card');
    if (heroCard) observer.observe(heroCard);
}

// Init on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCountUpAnimation);
} else {
    initCountUpAnimation();
}

// ==========================================================================
// KEYBOARD NAVIGATION SHORTCUTS
// ==========================================================================
(function initKeyboardShortcuts() {
    const sectionMap = {
        '1': 'hero',
        '2': 'projects', 
        '3': 'honors',
        '4': 'literary',
        '5': 'articles',
        '6': 'about',
        '7': 'gallery',
        '8': 'contact'
    };
    
    document.addEventListener('keydown', (e) => {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
        
        // Number keys to jump to sections
        if (sectionMap[e.key]) {
            e.preventDefault();
            const section = document.getElementById(sectionMap[e.key]);
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Escape to close any open modal
        if (e.key === 'Escape') {
            const codexModal = document.getElementById('codex-modal-backdrop');
            if (codexModal && codexModal.getAttribute('aria-hidden') === 'false') {
                document.getElementById('codex-modal-close-btn')?.click();
            }
            const lightbox = document.querySelector('.gallery-lightbox-backdrop.active');
            if (lightbox) {
                document.querySelector('.gallery-lightbox-close')?.click();
            }
        }
    });
})();
