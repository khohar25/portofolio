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
        setTimeout(dismissLoader, 700);
    } else {
        window.addEventListener('load', () => {
            setTimeout(dismissLoader, 600);
        });
        // Absolute fail-safe timeout
        setTimeout(dismissLoader, 2200);
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
        visibleItems.forEach((item) => {
            const title = (lang === 'en' && item.title_en) ? item.title_en : item.title_id;
            const starsHtml = '<i class="fas fa-star"></i>'.repeat(item.stars || 5);
            const previewPlateHtml = item.thumb_img 
                ? `
                    <div class="tome-doc-preview-plate">
                        <img src="${escapeHtml(item.thumb_img)}" alt="${escapeHtml(title)}" class="tome-doc-thumb" loading="lazy">
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
                "image_url": "gallery/khohar_suit_ibm_portrait.webp",
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
                "subtitle_id": "D4 Teknik Informatika &bull; Politeknik Negeri Malang",
                "subtitle_en": "Informatics Engineering &bull; State Polytechnic of Malang",
                "date": "2025 - 2026",
                "location_id": "Laboratorium Komputer POLINEMA, Malang",
                "location_en": "POLINEMA Computer Laboratory, Malang",
                "image_url": "gallery/polinema_lab_komputasi.webp",
                "caption_id": "Dokumentasi keaktifan perkuliahan dan pendampingan teknis praktikum di laboratorium komputer Politeknik Negeri Malang (POLINEMA) mengenakan seragam dinas kebanggaan almamater.",
                "caption_en": "Academic lab session and technical mentorship at the State Polytechnic of Malang (POLINEMA) computing facility wearing the official institutional laboratory uniform.",
                "featured": true,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-3",
                "category": "organisasi",
                "category_name_id": "Kepemimpinan & Organisasi",
                "category_name_en": "Leadership & Organization",
                "title_id": "Musyawarah Wilayah XXIV PW IPM Jawa Timur",
                "title_en": "24th Regional Assembly (Musywil XXIV) PW IPM East Java",
                "subtitle_id": "Perangkat Musywil XXIV &bull; Ikatan Pelajar Muhammadiyah",
                "subtitle_en": "Assembly Steering Committee &bull; Muhammadiyah Student Association",
                "date": "Juli 2026",
                "location_id": "Arena Musywil XXIV IPM Jawa Timur",
                "location_en": "Musywil XXIV IPM Arena, East Java",
                "image_url": "gallery/musywil_xxiv_ipm_jatim.webp",
                "caption_id": "Mengemban amanah sebagai Perangkat Musyawarah Wilayah XXIV Pimpinan Wilayah Ikatan Pelajar Muhammadiyah (PW IPM) Jawa Timur, mengawal jalannya permusyawaratan tertinggi pelajar tingkat provinsi.",
                "caption_en": "Serving as official steering committee member for the 24th Regional Assembly of the East Java Muhammadiyah Student Association (PW IPM Jatim), orchestrating parliamentary and regional youth leadership proceedings.",
                "featured": true,
                "object_position": "center 22%"
        },
        {
                "id": "galeri-4",
                "category": "organisasi",
                "category_name_id": "Dedikasi Panitia & Lapangan",
                "category_name_en": "Field Committee Dedication",
                "title_id": "Behind The Scenes Musywil XXIV PW IPM Jatim",
                "title_en": "Behind the Scenes — Musywil XXIV Steering Team",
                "subtitle_id": "Kesiapsiagaan Tim Pengarah & Manajemen Acara",
                "subtitle_en": "Steering Team Preparedness & Event Operations",
                "date": "Juli 2026",
                "location_id": "Jawa Timur, Indonesia",
                "location_en": "East Java, Indonesia",
                "image_url": "gallery/ipm_committee_vest.webp",
                "caption_id": "Dokumentasi di balik layar kepanitiaan mengenakan rompi dinas Perangkat Musywil XXIV PW IPM Jawa Timur, memastikan kelancaran teknis operasional dan protokol persidangan sepanjang malam.",
                "caption_en": "Behind-the-scenes committee snapshot wearing the official Musywil XXIV PW IPM East Java vest and credentials during operational overnight setup and coordination.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-5",
                "category": "akademik",
                "category_name_id": "Akademik & Pelatihan Vokasi",
                "category_name_en": "Academic & Vocational Workshop",
                "title_id": "Workshop Teknologi Pengolahan & Hilirisasi Pertanian",
                "title_en": "Agricultural Processing Technology & Agro-Industry Workshop",
                "subtitle_id": "Pelatihan Terapan & Rekayasa Produk Pangan Lokal",
                "subtitle_en": "Applied Processing & Local Agro-Commodity Engineering",
                "date": "Juli 2026",
                "location_id": "Pusat Pelatihan Vokasi, Jawa Timur",
                "location_en": "Vocational Training Center, East Java",
                "image_url": "gallery/workshop_teknologi_pengolahan.webp",
                "caption_id": "Momentum kelulusan dan apresiasi pelatihan pengolahan hasil pertanian bersama rekan-rekan peserta workshop membawa buket kehormatan atas keberhasilan menyelesaikan kurikulum terapan.",
                "caption_en": "Celebration and completion milestone of the agro-processing technology workshop with fellow peers, commemorating successful completion of the hands-on vocational curriculum.",
                "featured": false,
                "object_position": "center 28%"
        },
        {
                "id": "galeri-6",
                "category": "akademik",
                "category_name_id": "Almamater & Jejak Studi",
                "category_name_en": "Alma Mater & Academic Foundation",
                "title_id": "Kebersamaan Angkatan Sekolah Menengah",
                "title_en": "Secondary School Cohort & Academic Comrades",
                "subtitle_id": "Fondasi Awal Karakter, Disiplin, & Persahabatan",
                "subtitle_en": "Early Foundations of Discipline, Character & Fellowship",
                "date": "2024",
                "location_id": "Jawa Timur, Indonesia",
                "location_en": "East Java, Indonesia",
                "image_url": "gallery/angkatan_sekolah_menengah.webp",
                "caption_id": "Potret kebersamaan rekan satu almamater sekolah menengah dengan seragam batik biru kebanggaan di depan gerbang utama dan masjid sekolah, memupuk semangat juang menuntut ilmu.",
                "caption_en": "Commemorative group photo with high school classmates wearing blue school uniform batiks in front of the main campus archway and mosque, honoring foundational formative years.",
                "featured": false,
                "object_position": "center 40%"
        },
        {
                "id": "galeri-7",
                "category": "kegiatan",
                "category_name_id": "Pelatihan Vokasi & Ketenagakerjaan",
                "category_name_en": "Vocational Skills Training",
                "title_id": "Pelatihan Kompetensi Kejuruan UPT BLK Madiun",
                "title_en": "Vocational Competency Cohort at UPT BLK Madiun",
                "subtitle_id": "Balai Latihan Kerja &bull; Dinas Tenaga Kerja Provinsi Jatim",
                "subtitle_en": "Work Training Center &bull; Provincial Manpower Agency",
                "date": "Juli 2026",
                "location_id": "UPT BLK Madiun, Jawa Timur",
                "location_en": "UPT BLK Madiun, East Java",
                "image_url": "gallery/blk_madiun_pelatihan.webp",
                "caption_id": "Foto bersama seluruh peserta pelatihan berbasis kompetensi, instruktur, dan pimpinan UPT Balai Latihan Kerja (BLK) Madiun di halaman gedung utama dinas ketenagakerjaan.",
                "caption_en": "Official cohort group photograph with vocational instructors, administrators, and peers at the UPT Balai Latihan Kerja (BLK) Madiun front headquarters.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-8",
                "category": "kegiatan",
                "category_name_id": "Laboratorium Terapan & Produksi",
                "category_name_en": "Applied Kitchen & Production Lab",
                "title_id": "Praktik Produksi Kue & Pastry Laboratorium Kuliner",
                "title_en": "Pastry & Baking Production Lab Practicum",
                "subtitle_id": "Standar Higienitas, Resep Terukur, & Kerja Sama Tim",
                "subtitle_en": "Hygiene Standards, Formulations & Team Dynamics",
                "date": "Juli 2026",
                "location_id": "Laboratorium Pengolahan Pangan, Jawa Timur",
                "location_en": "Food Processing Laboratory, East Java",
                "image_url": "gallery/praktik_baking_pastry.webp",
                "caption_id": "Dokumentasi hasil praktik laboratorium pengolahan makanan menunjukkan karya cake dan bakery higienis bersama rekan satu meja produksi.",
                "caption_en": "Culinary production lab session demonstrating hands-on bakery outcomes, recipe precision, and teamwork in food processing.",
                "featured": false,
                "object_position": "center 30%"
        },
        {
                "id": "galeri-9",
                "category": "kegiatan",
                "category_name_id": "Teknologi Pangan & Laboratorium",
                "category_name_en": "Food Technology Laboratory",
                "title_id": "Sesi Uji Mutu & Pengolahan Makanan Standar Industri",
                "title_en": "Quality Assurance & Food Production in Industrial Kitchen Lab",
                "subtitle_id": "Peralatan Stainless Steel & Standar Keamanan Pangan",
                "subtitle_en": "Food Grade Stainless Equipment & Production Safety",
                "date": "Agustus 2026",
                "location_id": "Fasilitas Pengolahan Pangan Industri",
                "location_en": "Industrial Food Processing Facility",
                "image_url": "gallery/lab_pengolahan_kuliner.webp",
                "caption_id": "Swafoto kebersamaan kelompok pelatihan di dalam laboratorium produksi yang dilengkapi peralatan food-grade stainless steel berstandar industri.",
                "caption_en": "Team selfie inside the food production laboratory featuring industrial-grade stainless equipment, celebrating productive teamwork.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-10",
                "category": "kegiatan",
                "category_name_id": "Kekeluargaan & Jejaring",
                "category_name_en": "Fellowship & Networking",
                "title_id": "Malam Ramah Tamah & Temu Rekan Sejawat Pelatihan",
                "title_en": "Cohort Fellowship & Networking Dinner",
                "subtitle_id": "Solidaritas, Pertukaran Cerita, & Kolaborasi Masa Depan",
                "subtitle_en": "Camaraderie, Shared Ambitions & Future Alliances",
                "date": "2026",
                "location_id": "Jawa Timur, Indonesia",
                "location_en": "East Java, Indonesia",
                "image_url": "gallery/kebersamaan_rekan_studi.webp",
                "caption_id": "Momen kehangatan santap malam dan diskusi santai bersama rekan-rekan seperjuangan pelatihan kejuruan berseragam biru, merajut persaudaraan erat.",
                "caption_en": "Warm dinner gathering and lively conversation with vocational peers wearing signature blue cohort uniforms, building lasting friendships.",
                "featured": false,
                "object_position": "center 35%"
        },
        {
                "id": "galeri-11",
                "category": "kegiatan",
                "category_name_id": "Literasi & Wawasan",
                "category_name_en": "Literacy & Intellectual Pursuit",
                "title_id": "Eksplorasi Buku & Literasi Bersama Sahabat",
                "title_en": "Bookstore Exploration & Knowledge Gathering with Friends",
                "subtitle_id": "Kultur Membaca, Diskusi Gagasan, & Inspirasi Karya",
                "subtitle_en": "Reading Culture, Idea Exchange & Creative Inspiration",
                "date": "September 2025",
                "location_id": "Toko Buku / Perpustakaan, Jawa Timur",
                "location_en": "Bookstore / Library Hub, East Java",
                "image_url": "gallery/literasi_buku_sahabat.webp",
                "caption_id": "Swafoto penuh keceriaan bersama kawan-kawan saat berburu buku referensi dan bahan bacaan, menumbuhkan kecintaan terhadap literasi dan wawasan baru.",
                "caption_en": "Joyful group selfie with close friends during a book hunting and literature exploration session, fostering a shared love for reading and learning.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-12",
                "category": "kegiatan",
                "category_name_id": "Jejak Mobilitas Lapangan",
                "category_name_en": "Mobility & Transit Journal",
                "title_id": "Perjalanan Fajar Antar-Kota Jawa Timur via Kereta Api",
                "title_en": "Intercity Transit Across East Java via Railway",
                "subtitle_id": "Mobilitas Antara Ngawi, Madiun, & Malang Menuju Agenda Tugas",
                "subtitle_en": "Commuting Between Ngawi, Madiun & Malang for Study and Missions",
                "date": "Juni 2026",
                "location_id": "Kereta Api Indonesia, Lintasan Jawa Timur",
                "location_en": "Indonesian Railways (KAI), East Java Route",
                "image_url": "gallery/perjalanan_kereta_api.webp",
                "caption_id": "Dokumentasi perjalanan dini hari menaiki kereta api melintasi jalur Jawa Timur menuju lokasi kegiatan akademik dan organisasi di berbagai kota.",
                "caption_en": "Early-dawn travel documentation aboard Indonesian Railways train traversing East Java routes connecting Ngawi, Madiun, and Malang for academic and civic duties.",
                "featured": false,
                "object_position": "center 30%"
        },
        {
                "id": "galeri-13",
                "category": "pribadi",
                "category_name_id": "Potret Profil & Riset",
                "category_name_en": "Professional & Engineering",
                "title_id": "Khohar Muhamad Fatahurrohman — Profil Rekayasa",
                "title_en": "Khohar Muhamad Fatahurrohman — Engineering Profile",
                "subtitle_id": "Software & Applied AI Specialist",
                "subtitle_en": "Software & Applied AI Specialist",
                "date": "2026",
                "location_id": "Malang, Jawa Timur",
                "location_en": "Malang, East Java",
                "image_url": "gallery/khohar_profil_rekayasa.webp",
                "caption_id": "Potret kerja dan dedikasi dalam rekayasa perangkat lunak, eksplorasi kecerdasan buatan terapan, dan pengembangan sistem web modern.",
                "caption_en": "Dedicated to software engineering excellence, applied AI architectures, and modern responsive web systems.",
                "featured": false,
                "object_position": "center 20%"
        },
        {
                "id": "galeri-14",
                "category": "pribadi",
                "category_name_id": "Keluarga & Nilai Luhur",
                "category_name_en": "Family & Core Heritage",
                "title_id": "Kehangatan Idul Fitri Bersama Keluarga Tercinta",
                "title_en": "Cherished Eid al-Fitr Family Gathering",
                "subtitle_id": "Mohon Maaf Lahir & Batin &bull; Karangjati, Ngawi",
                "subtitle_en": "Traditional Eid Greetings &bull; Karangjati, Ngawi",
                "date": "Maret 2026",
                "location_id": "Ringinanom, Karangjati, Ngawi",
                "location_en": "Ringinanom, Karangjati, Ngawi",
                "image_url": "gallery/keluarga_idul_fitri.webp",
                "caption_id": "Potret penuh berkah momen Idul Fitri bersama kedua orang tua dan adik tercinta di depan kediaman, bersyukur atas kerukunan, doa, dan restu keluarga.",
                "caption_en": "Blessed Eid al-Fitr portrait with beloved parents and younger sister in front of home, offering heartfelt greetings and celebrating unconditional family support.",
                "featured": false,
                "object_position": "center 28%"
        },
        {
                "id": "galeri-15",
                "category": "pribadi",
                "category_name_id": "Akar Budaya & Usaha Keluarga",
                "category_name_en": "Family Heritage & Entrepreneurship",
                "title_id": "Kripik Tempe Kharisma — Dedikasi Usaha Mandiri Keluarga",
                "title_en": "Kripik Tempe Kharisma — Family Micro-Enterprise Heritage",
                "subtitle_id": "Kripik Tempe Khas Karangjati Ngawi &bull; Gurih & Renyah",
                "subtitle_en": "Authentic Tempe Chips of Karangjati Ngawi",
                "date": "Maret 2026",
                "location_id": "Templek, Ringinanom, Karangjati, Ngawi",
                "location_en": "Templek, Ringinanom, Karangjati, Ngawi",
                "image_url": "gallery/usaha_keluarga_kripik_tempe.webp",
                "caption_id": "Keluarga berdiri bangga di depan plang usaha rumah tangga 'Kripik Tempe Kharisma' di Karangjati, Ngawi. Sumber inspirasi kerja keras, ketulusan, dan integritas hidup.",
                "caption_en": "Family standing proudly before their home-based micro-enterprise 'Kripik Tempe Kharisma' banner in Karangjati, Ngawi — the living root of dedication, grit, and humility.",
                "featured": false,
                "object_position": "center 25%"
        },
        {
                "id": "galeri-16",
                "category": "pribadi",
                "category_name_id": "Potret Diri & Identitas",
                "category_name_en": "Portrait & Identity",
                "title_id": "Nuansa Tradisi — Busana Batik & Suasana Pagi Desa",
                "title_en": "Echoes of Heritage — Traditional Batik & Rural Morning",
                "subtitle_id": "Ketenteraman Pedesaan Ringinanom &bull; Ngawi Ramah",
                "subtitle_en": "Serenity of Ringinanom &bull; Ngawi, East Java",
                "date": "Maret 2026",
                "location_id": "Ringinanom, Karangjati, Ngawi",
                "location_en": "Ringinanom, Karangjati, Ngawi",
                "image_url": "gallery/potret_batik_tradisi.webp",
                "caption_id": "Potret pribadi berbusana batik bercorak parang dan sarung di bawah semilir pohon rindang pedesaan Ngawi, merawat ketenangan batin di tengah dinamika dunia teknologi.",
                "caption_en": "Reflective personal portrait wearing traditional batik and sarong under a tall village tree in peaceful Ngawi, grounding high-tech aspirations in cultural wisdom.",
                "featured": false,
                "object_position": "center 20%"
        },
        {
                "id": "galeri-17",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Memori Masa Kecil — Jiwa Petualang di Atas Dahan",
                "title_en": "Childhood Memory — Free-Spirited Explorer in the Trees",
                "subtitle_id": "Keberanian Masa Kecil & Kenangan Tak Terlupakan",
                "subtitle_en": "Fearless Childhood Days & Cherished Memories",
                "date": "Masa Kecil",
                "location_id": "Karangjati, Ngawi, Jawa Timur",
                "location_en": "Karangjati, Ngawi, East Java",
                "image_url": "gallery/memori_masa_kecil_pohon.webp",
                "caption_id": "Rekaman nostalgia masa kanak-kanak memanjat pohon rindang bersama saudara di pekarangan rumah, mengingatkan pada keberanian dan rasa ingin tahu yang tak pernah padam.",
                "caption_en": "Nostalgic childhood snapshot climbing a leafy tree with a sibling, embodying early fearlessness, curiosity, and joyful discovery in rural nature.",
                "featured": false,
                "object_position": "center center"
        },
        {
                "id": "galeri-18",
                "category": "pribadi",
                "category_name_id": "Memori & Jejak Langkah",
                "category_name_en": "Childhood Memory & Roots",
                "title_id": "Kasih Sayang Masa Kanak-Kanak Bersama Adik",
                "title_en": "Childhood Warmth & Sibling Bond",
                "subtitle_id": "Tumbuh Bersama dalam Kesederhanaan & Kehangatan",
                "subtitle_en": "Growing Up with Sibling Love & Warmth",
                "date": "Masa Kecil",
                "location_id": "Karangjati, Ngawi, Jawa Timur",
                "location_en": "Karangjati, Ngawi, East Java",
                "image_url": "gallery/memori_masa_kecil_keluarga.webp",
                "caption_id": "Kenangan masa kecil menggendong dan menemani adik perempuan tersayang di beranda rumah, simbol kasih sayang persaudaraan yang senantiasa dijaga selamanya.",
                "caption_en": "Treasured vintage childhood photo holding hands and caring for his beloved younger sister, an enduring emblem of unconditional sibling love and family protection.",
                "featured": false,
                "object_position": "center 28%"
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
                <div class="gallery-cover-frame ${themeClass}">
                    <img src="${escapeHtml(item.image_url)}" alt="${escapeHtml(title)}" class="gallery-cover-real-img" ${item.object_position ? `style="object-position: ${escapeHtml(item.object_position)};"` : ''} loading="lazy">
                    <div class="gallery-cover-glare"></div>
                    <span class="gallery-cover-cat-badge ${themeClass}">${escapeHtml(categoryName)}</span>
                </div>
                <div class="gallery-info-content">
                    <div class="gallery-meta-top">
                        <span class="gallery-genre ${themeClass}">
                            <i class="fas fa-gem"></i> ${escapeHtml(categoryName)}
                        </span>
                        <span class="gallery-date-pill">
                            <i class="far fa-calendar-alt"></i> ${escapeHtml(item.date)}
                        </span>
                    </div>
                    <h4 class="gallery-card-title notranslate">${escapeHtml(title)}</h4>
                    <p class="gallery-card-subtitle notranslate">${escapeHtml(subtitle)}</p>
                    <p class="gallery-card-synopsis">${escapeHtml(caption)}</p>
                    <div class="gallery-card-footer">
                        <span class="gallery-card-loc" title="${escapeHtml(location)}">
                            <i class="fas fa-map-marker-alt"></i> ${escapeHtml(location)}
                        </span>
                        <button class="gallery-view-btn" type="button" aria-label="${lang === 'en' ? 'View Photo' : 'Lihat Foto'}">
                            <i class="fas fa-expand-alt"></i>
                            <span>${lang === 'en' ? 'View Photo' : 'Lihat Foto'}</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
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

    // Fetch galeri.json
    fetch('galeri.json?v=' + Date.now())
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

    articleContainer.innerHTML = '';
    articleList.slice(0, 4).forEach(item => {
        const title = (lang === 'en' && item.judul_en) ? item.judul_en : item.judul;
        const excerpt = (lang === 'en' && item.deskripsi_en) ? item.deskripsi_en : item.deskripsi;
        const readLabel = lang === 'en' ? 'Read Technical Publication' : 'Baca Publikasi Lengkap';
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
