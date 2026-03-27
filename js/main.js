class SlideController {
  constructor() {
    this.totalSlides = 22;
    this.currentSlide = 1;
    this.isAnimating = false;
    this.slideNames = [
      '',
      '01-cover',
      '02-intro',
      '03-part1',
      '04-what-is-bug',
      '05-types-of-errors',
      '06-detection-correction',
      '07-part2',
      '08-error-vs-failure',
      '09-fmea',
      '10-rca',
      '11-part3',
      '12-the-chain',
      '13-hazard-vs-risk',
      '14-risk-matrix',
      '15-risk-response',
      '16-risk-register',
      '17-part4',
      '18-case-study-knight',
      '19-case-study-team',
      '20-pmbok',
      '21-closing',
      '22-seminar'
    ];
    this.slideLabels = [
      '',
      'Cover',
      'The $440 Million Bug',
      'Part 1 — Understanding System Errors',
      'What is a Bug?',
      'Three Types of System Errors',
      'Detection & Correction Strategies',
      'Part 2 — Identifying & Managing Failures',
      'Error vs Failure',
      'FMEA',
      'RCA: 5 Whys',
      'Part 3 — Risks and Hazards',
      'The Complete Chain',
      'Hazard vs Risk',
      'Risk Assessment Matrix',
      'Risk Response Strategies',
      'Risk Register',
      'Part 4 — Case Studies',
      'Knight Capital Disaster',
      'Group Activity: Your Product',
      'Connection to PMBOK',
      'Post-Class Reflection',
      'Seminar & Preview'
    ];
    this.sectionSlides = new Set([3, 7, 11, 17]);
    this.navOpen = false;
    this.init();
  }

  init() {
    this.bindToDocument(document);
    this.bindNavigation();
    this.buildNavigator();
    this.updateUI();
  }

  /* Attach keyboard + touch handlers to any document (parent or iframe) */
  bindToDocument(doc) {
    doc.addEventListener('keydown', (e) => {
      const map = {
        ArrowRight: () => this.next(),
        ArrowDown:  () => this.next(),
        ' ':        () => this.next(),
        PageDown:   () => this.next(),
        ArrowLeft:  () => this.prev(),
        ArrowUp:    () => this.prev(),
        PageUp:     () => this.prev(),
        Home:       () => this.goTo(1),
        End:        () => this.goTo(this.totalSlides),
        f:          () => this.toggleFullscreen(),
        F:          () => this.toggleFullscreen(),
        Escape:     () => this.closeNavigator(),
      };
      if (map[e.key]) { e.preventDefault(); map[e.key](); }
    });

    let sx = 0;
    doc.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    doc.addEventListener('touchend', e => {
      const dx = sx - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50) dx > 0 ? this.next() : this.prev();
    });
  }

  bindNavigation() {
    document.getElementById('prevBtn')?.addEventListener('click', () => this.prev());
    document.getElementById('nextBtn')?.addEventListener('click', () => this.next());
    document.getElementById('fsBtn')?.addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('pageNum')?.addEventListener('click', () => this.toggleNavigator());
    document.getElementById('navOverlay')?.addEventListener('click', () => this.closeNavigator());
  }

  /* Build slide navigator drawer */
  buildNavigator() {
    const drawer = document.getElementById('navDrawer');
    if (!drawer) return;
    let html = '';
    for (let i = 1; i <= this.totalSlides; i++) {
      const isSection = this.sectionSlides.has(i);
      const cls = isSection ? 'nav-item section-item' : 'nav-item';
      html += `<button class="${cls}" data-slide="${i}">
        <span class="nav-num">${String(i).padStart(2, '0')}</span>
        <span class="nav-label">${this.slideLabels[i]}</span>
      </button>`;
    }
    drawer.innerHTML = html;
    drawer.addEventListener('click', (e) => {
      const item = e.target.closest('.nav-item');
      if (!item) return;
      const n = parseInt(item.dataset.slide, 10);
      this.closeNavigator();
      if (n !== this.currentSlide) this.goTo(n);
    });
  }

  toggleNavigator() {
    this.navOpen ? this.closeNavigator() : this.openNavigator();
  }

  openNavigator() {
    this.navOpen = true;
    document.getElementById('navOverlay')?.classList.add('open');
    document.getElementById('navDrawer')?.classList.add('open');
    this.highlightNavItem();
  }

  closeNavigator() {
    if (!this.navOpen) return;
    this.navOpen = false;
    document.getElementById('navOverlay')?.classList.remove('open');
    document.getElementById('navDrawer')?.classList.remove('open');
  }

  highlightNavItem() {
    const drawer = document.getElementById('navDrawer');
    if (!drawer) return;
    drawer.querySelectorAll('.nav-item').forEach(el => {
      const n = parseInt(el.dataset.slide, 10);
      el.classList.toggle('active', n === this.currentSlide);
    });
    const active = drawer.querySelector('.nav-item.active');
    if (active) active.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  next() { if (!this.isAnimating && this.currentSlide < this.totalSlides) this.goTo(this.currentSlide + 1); }
  prev() { if (!this.isAnimating && this.currentSlide > 1) this.goTo(this.currentSlide - 1); }

  goTo(n) {
    if (n < 1 || n > this.totalSlides || n === this.currentSlide || this.isAnimating) return;
    this.isAnimating = true;
    const frame = document.getElementById('slideFrame');
    frame.style.opacity = '0';
    setTimeout(() => {
      frame.src = `slides/${this.slideNames[n]}.html`;
      this.currentSlide = n;
      this.updateUI();
      frame.onload = () => {
        frame.style.opacity = '1';
        this.isAnimating = false;
        try {
          this.bindToDocument(frame.contentDocument);
        } catch (_) {}
      };
    }, 160);
  }

  updateUI() {
    document.getElementById('pageNum').textContent = `${this.currentSlide} / ${this.totalSlides}`;
    const prev = document.getElementById('prevBtn');
    const next = document.getElementById('nextBtn');
    if (prev) prev.disabled = this.currentSlide === 1;
    if (next) next.disabled = this.currentSlide === this.totalSlides;
    if (this.navOpen) this.highlightNavItem();
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ctrl = new SlideController();
  const frame = document.getElementById('slideFrame');
  if (frame) {
    frame.addEventListener('load', function onFirstLoad() {
      try { window.ctrl.bindToDocument(frame.contentDocument); } catch (_) {}
      frame.removeEventListener('load', onFirstLoad);
    });
  }
});

