/* ═══════════════════════════════════════════════════════════
   HAPPY GIRLFRIEND'S DAY – CINEMATIC ROMANTIC ENGINE v2
   Premium polish: 60fps, ambient particles, enhanced FX,
   sound effects, smoother animations, performance optimized
   ═══════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ──────────────────────────────────────────
     ✏️  CONFIGURATION – Easy to customize!
     ────────────────────────────────────────── */
  const CONFIG = {
    // ✏️ Your name (appears in the love letter & finale)
    yourName: '[Your Name]',

    // ✏️ Her name (appears in the finale)
    herName: '[Her Name]',

    // ✏️ Relationship start date (Year, Month-1, Day)
    //    Month is 0-indexed: Jan=0, Feb=1 … Dec=11
    startDate: new Date(2024, 0, 1), // January 1, 2024

    // Love letter lines
    letterLines: [
      'Happy Girlfriend\'s Day.',
      '',
      'You are the most beautiful chapter of my life.',
      'Every smile of yours makes my day brighter.',
      'Every moment with you becomes a memory I never want to lose.',
      '',
      'Thank you for loving me, supporting me, and making me a better person.',
      '',
      'No matter what happens, I\'ll always choose you.',
      '',
      'I love you more than words can ever express.'
    ],

    // "I Love You" in many languages
    loveLanguages: [
      'I Love You', 'Te Amo', 'Je t\'aime', 'Ich liebe dich',
      'Ti amo', '사랑해요', '愛してる', 'Я тебя люблю',
      'Eu te amo', 'Σ\'αγαπώ', 'Seni seviyorum', 'أحبك',
      'Ik hou van je', 'Jag älskar dig', 'Mahal kita',
      'मैं तुमसे प्यार करता हूँ', 'ฉันรักคุณ', 'Tôi yêu bạn',
      'Kocham Cię', 'Miluji tě', 'Aloha wau iā ʻoe',
    ],

    // Floating particle emojis
    floatingEmojis: ['🌹', '💖', '✨', '🦋', '💗', '🌸', '💕', '❤️', '🌺', '💫', '🩷'],
  };

  /* ──────────────────────────────────────────
     STATE
     ────────────────────────────────────────── */
  let musicPlaying = false;
  let surpriseTriggered = false;
  let audioCtx = null;
  let sfxEnabled = false; // Sound FX disabled by default

  /* ──────────────────────────────────────────
     UTILITY: Throttle for scroll handlers
     ────────────────────────────────────────── */
  function throttleRAF(fn) {
    let ticking = false;
    return function (...args) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        fn.apply(this, args);
        ticking = false;
      });
    };
  }

  /* ══════════════════════════════════════════
     1. LOADING SCREEN
     ══════════════════════════════════════════ */
  function initLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    if (!loader) return;

    function dismiss() {
      loader.classList.add('hidden');
      startEntranceAnimations();
    }

    if (document.readyState === 'complete') {
      setTimeout(dismiss, 3000);
    } else {
      window.addEventListener('load', () => setTimeout(dismiss, 3000));
    }
  }

  function startEntranceAnimations() {
    const hero = document.querySelector('.hero-content');
    if (hero) {
      hero.classList.add('visible');
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0)';
    }
    const player = document.getElementById('music-player');
    if (player) {
      setTimeout(() => player.classList.add('visible'), 800);
    }
  }

  /* ══════════════════════════════════════════
     2. TWINKLING STARS (Canvas – optimized)
     ══════════════════════════════════════════ */
  function initStars() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    const COUNT = 200;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.scale(dpr, dpr);
    }

    function create() {
      stars = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (let i = 0; i < COUNT; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.5 + 0.3,
          alpha: Math.random(),
          speed: Math.random() * 0.012 + 0.003,
          dir: Math.random() > 0.5 ? 1 : -1,
          hue: Math.random() > 0.8 ? 320 + Math.random() * 40 : 0,
        });
      }
    }

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        s.alpha += s.speed * s.dir;
        if (s.alpha >= 1) { s.alpha = 1; s.dir = -1; }
        if (s.alpha <= 0.05) { s.alpha = 0.05; s.dir = 1; }

        // Star point
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        if (s.hue > 0) {
          ctx.fillStyle = `hsla(${s.hue}, 70%, 85%, ${s.alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        }
        ctx.fill();

        // Soft glow — only for brighter stars
        if (s.alpha > 0.4) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 200, 240, ${s.alpha * 0.1})`;
          ctx.fill();
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    create();
    draw();

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => { resize(); create(); }, 200);
    });
  }

  /* ══════════════════════════════════════════
     3. FLOATING EFFECTS (Enhanced physics)
     ══════════════════════════════════════════ */
  function initFloatingEffects() {
    const canvas = document.getElementById('floating-effects-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const MAX = 25;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawn() {
      if (particles.length >= MAX) return;
      const emoji = CONFIG.floatingEmojis[Math.floor(Math.random() * CONFIG.floatingEmojis.length)];
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 50,
        size: Math.random() * 14 + 16,
        vy: -(Math.random() * 0.55 + 0.2),
        vx: (Math.random() - 0.5) * 0.3,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 0.8,
        alpha: 0,
        targetAlpha: 0.5 + Math.random() * 0.4,
        emoji,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleFreq: Math.random() * 0.008 + 0.005,
        wobbleAmp: Math.random() * 0.6 + 0.3,
        life: 0,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.y += p.vy;
        p.wobblePhase += p.wobbleFreq;
        p.x += p.vx + Math.sin(p.wobblePhase) * p.wobbleAmp;
        p.rot += p.rotSpeed;

        // Smooth fade in/out
        if (p.life < 60) {
          p.alpha = Math.min(p.targetAlpha, p.alpha + 0.015);
        }
        if (p.y < canvas.height * 0.15) {
          p.alpha = Math.max(0, p.alpha - 0.008);
        }

        if (p.y < -60 || p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.emoji, 0, 0);
        ctx.restore();
      }
      requestAnimationFrame(draw);
    }

    resize();
    draw();
    setInterval(spawn, 900);
    window.addEventListener('resize', resize);
  }

  /* ══════════════════════════════════════════
     3b. AMBIENT PARTICLES (Soft glowing dots)
     ══════════════════════════════════════════ */
  function initAmbientParticles() {
    const canvas = document.getElementById('ambient-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let dots = [];
    const COUNT = 50;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function create() {
      dots = [];
      for (let i = 0; i < COUNT; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          alpha: Math.random() * 0.25 + 0.05,
          alphaDir: Math.random() > 0.5 ? 1 : -1,
          alphaSpeed: Math.random() * 0.003 + 0.001,
          hue: 310 + Math.random() * 60,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        d.alpha += d.alphaSpeed * d.alphaDir;

        if (d.alpha >= 0.35) d.alphaDir = -1;
        if (d.alpha <= 0.03) d.alphaDir = 1;

        // Wrap around
        if (d.x < 0) d.x = canvas.width;
        if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height;
        if (d.y > canvas.height) d.y = 0;

        // Soft glow dot
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue}, 60%, 75%, ${d.alpha})`;
        ctx.fill();

        // Glow halo
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${d.hue}, 60%, 75%, ${d.alpha * 0.15})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    create();
    draw();
    window.addEventListener('resize', () => { resize(); create(); });
  }

  /* ══════════════════════════════════════════
     4. CUSTOM CURSOR (Performance optimized)
     ══════════════════════════════════════════ */
  function initCursor() {
    const cursor = document.getElementById('cursor-heart');
    if (!cursor) return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouch) { cursor.style.display = 'none'; return; }

    let cursorX = 0, cursorY = 0;
    let currentX = 0, currentY = 0;
    let moving = false;

    document.addEventListener('mousemove', e => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      if (!moving) {
        moving = true;
        updateCursor();
      }
    }, { passive: true });

    function updateCursor() {
      // Smooth lerp for premium feel
      currentX += (cursorX - currentX) * 0.35;
      currentY += (cursorY - currentY) * 0.35;

      cursor.style.left = currentX + 'px';
      cursor.style.top = currentY + 'px';

      if (Math.abs(cursorX - currentX) > 0.1 || Math.abs(cursorY - currentY) > 0.1) {
        requestAnimationFrame(updateCursor);
      } else {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        moving = false;
      }
    }

    document.addEventListener('click', e => {
      const emojis = ['💖', '💗', '❤️', '💕', '💝', '🩷', '✨', '🌸'];
      for (let i = 0; i < 7; i++) {
        const h = document.createElement('div');
        h.className = 'cursor-click-heart';
        h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        h.style.left = e.clientX + 'px';
        h.style.top = e.clientY + 'px';
        const angle = (Math.PI * 2 / 7) * i + (Math.random() - 0.5) * 0.5;
        const dist = 30 + Math.random() * 35;
        h.style.setProperty('--x', Math.cos(angle) * dist + 'px');
        h.style.setProperty('--y', Math.sin(angle) * dist + 'px');
        h.style.setProperty('--r', (Math.random() - 0.5) * 90 + 'deg');
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 700);
      }

      // Subtle click sound
      playSFX('click');
    });
  }

  /* ══════════════════════════════════════════
     5. SOUND EFFECTS (Web Audio API – muted by default)
     ══════════════════════════════════════════ */
  function playSFX(type) {
    if (!sfxEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
        g.gain.setValueAtTime(0.03, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'whoosh') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.4);
        g.gain.setValueAtTime(0.02, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'sparkle') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(4000, now + 0.06);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.15);
        g.gain.setValueAtTime(0.02, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // Silently ignore audio errors
    }
  }

  /* ══════════════════════════════════════════
     6. MUSIC (Web Audio API Synth)
     ══════════════════════════════════════════ */
  function initMusic() {
    const toggleBtn = document.getElementById('music-toggle');
    if (!toggleBtn) return;
    const playIcon = toggleBtn.querySelector('.play-icon');
    const pauseIcon = toggleBtn.querySelector('.pause-icon');
    const visualizer = document.querySelector('.music-visualizer');
    const volumeSlider = document.getElementById('volume-slider');

    let gainNode = null;
    let isSetup = false;
    let timeoutId = null;

    // Gentle romantic melody
    const melody = [
      { f: 523.25, d: 900 },  { f: 659.25, d: 900 },  { f: 783.99, d: 1300 },
      { f: 698.46, d: 900 },  { f: 659.25, d: 900 },  { f: 523.25, d: 1300 },
      { f: 587.33, d: 900 },  { f: 523.25, d: 900 },  { f: 493.88, d: 1300 },
      { f: 440.00, d: 900 },  { f: 523.25, d: 900 },  { f: 587.33, d: 1800 },
      { f: 523.25, d: 900 },  { f: 659.25, d: 900 },  { f: 698.46, d: 1300 },
      { f: 783.99, d: 900 },  { f: 659.25, d: 1800 },
    ];

    function setup() {
      if (isSetup) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = audioCtx.createGain();
      gainNode.gain.value = (volumeSlider ? volumeSlider.value : 40) / 100 * 0.12;
      gainNode.connect(audioCtx.destination);
      isSetup = true;
      sfxEnabled = true;
    }

    function playNote(freq, dur, t) {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // Vibrato
      const vib = audioCtx.createOscillator();
      const vibG = audioCtx.createGain();
      vib.frequency.value = 4.5;
      vibG.gain.value = 1.5;
      vib.connect(vibG);
      vibG.connect(osc.frequency);
      vib.start(t);
      vib.stop(t + dur / 1000);

      // Smooth envelope
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.22, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.1, t + dur / 2000);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur / 1000);

      osc.connect(g);
      g.connect(gainNode);
      osc.start(t);
      osc.stop(t + dur / 1000 + 0.05);
    }

    function playMelody() {
      if (!audioCtx || !musicPlaying) return;
      let t = audioCtx.currentTime + 0.1;
      for (const n of melody) {
        playNote(n.f, n.d, t);
        playNote(n.f / 2, n.d * 1.2, t); // harmony
        t += n.d / 1000;
      }
      const total = melody.reduce((s, n) => s + n.d, 0);
      timeoutId = setTimeout(playMelody, total + 200);
    }

    function start() {
      setup();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      musicPlaying = true;
      playMelody();
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'inline';
      if (visualizer) visualizer.classList.add('playing');
    }

    function stop() {
      musicPlaying = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (playIcon) playIcon.style.display = 'inline';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (visualizer) visualizer.classList.remove('playing');
    }

    toggleBtn.addEventListener('click', () => musicPlaying ? stop() : start());

    if (volumeSlider) {
      volumeSlider.addEventListener('input', () => {
        if (gainNode) gainNode.gain.value = volumeSlider.value / 100 * 0.12;
      });
    }

    // Expose for auto-start on "Open My Heart"
    window.__startMusic = start;
  }

  /* ══════════════════════════════════════════
     7. LOVE LETTER – ENVELOPE + TYPEWRITER
     ══════════════════════════════════════════ */
  function initLoveLetter() {
    const openBtn = document.getElementById('open-heart-btn');
    const section = document.getElementById('love-letter');
    const envelope = document.getElementById('envelope');
    const typewriterEl = document.getElementById('typewriter-text');
    const continueBtn = document.getElementById('continue-btn');
    const sign = document.querySelector('.letter-sign');
    const scrollHint = document.getElementById('scroll-hint');

    if (!openBtn || !section || !envelope) return;

    // Set name
    const nameEl = document.querySelector('.letter-name');
    if (nameEl) nameEl.textContent = CONFIG.yourName;

    openBtn.addEventListener('click', () => {
      section.style.display = 'flex';
      // Smooth scroll with longer duration feel
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Play whoosh SFX
      playSFX('whoosh');

      // Auto-start music
      if (!musicPlaying && window.__startMusic) window.__startMusic();

      // Hide scroll hint with fade
      if (scrollHint) {
        scrollHint.style.transition = 'opacity 0.5s';
        scrollHint.style.opacity = '0';
        setTimeout(() => { scrollHint.style.display = 'none'; }, 500);
      }

      // Open envelope
      setTimeout(() => {
        envelope.classList.add('open');
        playSFX('whoosh');
      }, 900);

      // Typewriter
      if (typewriterEl) {
        setTimeout(() => {
          typewriter(typewriterEl, CONFIG.letterLines, () => {
            if (sign) sign.classList.add('visible');
            if (continueBtn) {
              setTimeout(() => {
                continueBtn.style.display = 'inline-flex';
                continueBtn.style.animation = 'overlayIn 0.8s ease-out';
              }, 600);
            }
          });
        }, 2400);
      }
    });

    if (continueBtn) {
      continueBtn.addEventListener('click', () => {
        playSFX('click');
        const counter = document.getElementById('counter');
        if (counter) counter.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function typewriter(el, lines, cb) {
    let li = 0, ci = 0, text = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';

    function tick() {
      if (li >= lines.length) { cursor.remove(); cb?.(); return; }
      const line = lines[li];
      if (ci < line.length) {
        text += line[ci];
        el.innerHTML = text.split('\n')
          .map(l => l === '' ? '<br/>' : `<span>${l}</span>`)
          .join('');
        el.appendChild(cursor);
        ci++;
        setTimeout(tick, 28 + Math.random() * 25);
      } else {
        text += '\n';
        li++;
        ci = 0;
        setTimeout(tick, 160);
      }
    }
    tick();
  }

  /* ══════════════════════════════════════════
     8. LOVE COUNTER (with smooth number transitions)
     ══════════════════════════════════════════ */
  function initCounter() {
    const els = {
      days: document.getElementById('counter-days'),
      hours: document.getElementById('counter-hours'),
      minutes: document.getElementById('counter-minutes'),
      seconds: document.getElementById('counter-seconds'),
    };

    if (!els.days) return;

    function update() {
      const diff = Date.now() - CONFIG.startDate.getTime();
      const newVals = {
        days: Math.floor(diff / 86400000).toLocaleString(),
        hours: Math.floor(diff / 3600000).toLocaleString(),
        minutes: Math.floor(diff / 60000).toLocaleString(),
        seconds: Math.floor(diff / 1000).toLocaleString(),
      };

      for (const key of Object.keys(els)) {
        if (els[key] && els[key].textContent !== newVals[key]) {
          els[key].textContent = newVals[key];
        }
      }
    }

    update();
    setInterval(update, 1000);
  }

  /* ══════════════════════════════════════════
     9. SCROLL ANIMATIONS (IntersectionObserver)
     ══════════════════════════════════════════ */
  function initScrollAnimations() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');

        if (entry.target.getAttribute('data-animate') === 'stagger') {
          const children = entry.target.children;
          for (let i = 0; i < children.length; i++) {
            children[i].style.transitionDelay = `${i * 0.12}s`;
          }
        }

        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
  }

  /* ══════════════════════════════════════════
     10. SCROLL PROGRESS BAR (throttled)
     ══════════════════════════════════════════ */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    window.addEventListener('scroll', throttleRAF(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.pageYOffset / h) * 100 : 0;
      bar.style.width = pct + '%';
    }), { passive: true });
  }

  /* ══════════════════════════════════════════
     11. TIMELINE FILL ANIMATION (throttled)
     ══════════════════════════════════════════ */
  function initTimelineFill() {
    const fill = document.getElementById('timeline-fill');
    const section = document.getElementById('timeline');

    if (!fill || !section) return;

    window.addEventListener('scroll', throttleRAF(() => {
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (viewH - rect.top) / (sectionH + viewH)));
      fill.style.height = (progress * 100) + '%';
    }), { passive: true });
  }

  /* ══════════════════════════════════════════
     12. "I LOVE YOU" FLOATING LANGUAGES
     ══════════════════════════════════════════ */
  function initLoveLanguages() {
    const container = document.getElementById('love-languages');
    if (!container) return;

    function spawn() {
      const txt = CONFIG.loveLanguages[Math.floor(Math.random() * CONFIG.loveLanguages.length)];
      const el = document.createElement('div');
      el.className = 'love-lang-text';
      el.textContent = txt;
      el.style.left = Math.random() * 85 + 5 + '%';
      el.style.fontSize = (Math.random() * 12 + 13) + 'px';
      el.style.setProperty('--rot', (Math.random() - 0.5) * 25 + 'deg');
      el.style.animationDuration = (Math.random() * 12 + 22) + 's';
      container.appendChild(el);
      setTimeout(() => el.remove(), 35000);
    }

    // Initial batch staggered
    for (let i = 0; i < 4; i++) setTimeout(spawn, i * 2500);
    setInterval(spawn, 4000);
  }

  /* ══════════════════════════════════════════
     13. SURPRISE – CINEMATIC FINALE
     Enhanced: sparkle trails, heart rain, multiple
     firework types, glow rings, staggered waves
     ══════════════════════════════════════════ */
  function initSurprise() {
    const btn = document.getElementById('surprise-btn');
    const overlay = document.getElementById('surprise-overlay');
    const canvas = document.getElementById('fireworks-canvas');
    if (!btn || !overlay || !canvas) return;

    const ctx = canvas.getContext('2d');
    let fireworks = [];
    let confetti = [];
    let sparkles = [];
    let heartRain = [];
    let running = false;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    btn.addEventListener('click', () => {
      if (surpriseTriggered) return;
      surpriseTriggered = true;
      playSFX('sparkle');

      // Show overlay
      overlay.style.display = 'flex';
      resize();
      running = true;

      // Staggered wave bursts (more cinematic timing)
      const burstTimes = [0, 300, 600, 1000, 1500, 2200, 3000];
      burstTimes.forEach(t => setTimeout(launchBurst, t));

      // Continuous fireworks
      const fwInterval = setInterval(() => {
        if (!running) { clearInterval(fwInterval); return; }
        launchBurst();
        spawnHeartRainWave(8);
      }, 2000);

      // Initial heart rain
      spawnHeartRainWave(25);

      // Heart flood DOM
      spawnHeartFlood();

      animate();
    });

    function launchBurst() {
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          createFirework(
            Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
            Math.random() * canvas.height * 0.45 + canvas.height * 0.08
          );
          playSFX('sparkle');
        }, i * 180);
      }
    }

    function createFirework(x, y) {
      const palettes = [
        ['#ff4d8d', '#ff69b4', '#e91e63', '#f48fb1', '#ffcdd2'],
        ['#ce93d8', '#ba68c8', '#e1bee7', '#f3e5f5', '#ab47bc'],
        ['#ffd54f', '#ffecb3', '#fff8e1', '#ffab91', '#ffe082'],
        ['#ffffff', '#fce4ec', '#f8bbd0', '#ff80ab', '#ff4081'],
      ];
      const colors = palettes[Math.floor(Math.random() * palettes.length)];
      const n = 60 + Math.floor(Math.random() * 30);
      const type = Math.random();

      for (let i = 0; i < n; i++) {
        let angle, speed;
        if (type < 0.3) {
          // Ring burst
          angle = (Math.PI * 2 / n) * i;
          speed = 2.5 + Math.random() * 0.5;
        } else if (type < 0.6) {
          // Random scatter
          angle = Math.random() * Math.PI * 2;
          speed = Math.random() * 4 + 1;
        } else {
          // Star burst with varying speeds
          angle = (Math.PI * 2 / n) * i;
          speed = (i % 2 === 0 ? 3.5 : 2) + Math.random() * 1;
        }

        fireworks.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2.5 + 1,
          life: 1,
          decay: 0.01 + Math.random() * 0.008,
          trail: [],
        });
      }

      // Sparkle layer on explosion
      for (let i = 0; i < 15; i++) {
        sparkles.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 40,
          r: Math.random() * 3 + 1,
          life: 1,
          decay: 0.015 + Math.random() * 0.01,
          color: colors[0],
        });
      }

      // Confetti
      for (let i = 0; i < 15; i++) {
        confetti.push({
          x: Math.random() * canvas.width,
          y: -10 - Math.random() * 60,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 5 + 3,
          rot: Math.random() * 360,
          rotSpd: (Math.random() - 0.5) * 6,
          alpha: 1,
        });
      }
    }

    function spawnHeartRainWave(count) {
      const hearts = ['💖', '❤️', '💗', '💕', '💝', '🩷', '✨', '💫'];
      for (let i = 0; i < count; i++) {
        heartRain.push({
          x: Math.random() * canvas.width,
          y: -20 - Math.random() * 200,
          vy: Math.random() * 1.5 + 0.5,
          vx: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 16 + 12,
          rot: Math.random() * 360,
          rotSpd: (Math.random() - 0.5) * 2,
          alpha: 0.5 + Math.random() * 0.5,
          emoji: hearts[Math.floor(Math.random() * hearts.length)],
          wobble: Math.random() * Math.PI * 2,
        });
      }
    }

    function animate() {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Firework particles with trails
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const p = fireworks[i];
        p.trail.push({ x: p.x, y: p.y, alpha: p.life });
        if (p.trail.length > 5) p.trail.shift();

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035;
        p.vx *= 0.99;
        p.life -= p.decay;

        if (p.life <= 0) { fireworks.splice(i, 1); continue; }

        // Draw trail
        for (let t = 0; t < p.trail.length; t++) {
          const tr = p.trail[t];
          ctx.beginPath();
          ctx.arc(tr.x, tr.y, p.size * (t / p.trail.length) * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = tr.alpha * 0.2 * (t / p.trail.length);
          ctx.fill();
        }

        // Main particle
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Inner glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.08;
        ctx.fill();
      }

      // Sparkles
      for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.life -= s.decay;
        if (s.life <= 0) { sparkles.splice(i, 1); continue; }

        ctx.globalAlpha = s.life;
        ctx.beginPath();
        // 4-point star shape
        const r = s.r;
        for (let p = 0; p < 4; p++) {
          const a = (p / 4) * Math.PI * 2 - Math.PI / 2;
          ctx.lineTo(s.x + Math.cos(a) * r * 2, s.y + Math.sin(a) * r * 2);
          const a2 = a + Math.PI / 4;
          ctx.lineTo(s.x + Math.cos(a2) * r * 0.5, s.y + Math.sin(a2) * r * 0.5);
        }
        ctx.closePath();
        ctx.fillStyle = s.color;
        ctx.fill();
      }

      // Confetti
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.rotSpd;
        c.alpha -= 0.002;

        if (c.alpha <= 0 || c.y > canvas.height + 20) { confetti.splice(i, 1); continue; }

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rot * Math.PI) / 180);
        ctx.globalAlpha = c.alpha;
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.6);
        ctx.restore();
      }

      // Heart rain (canvas-drawn emojis falling)
      for (let i = heartRain.length - 1; i >= 0; i--) {
        const h = heartRain[i];
        h.y += h.vy;
        h.wobble += 0.02;
        h.x += h.vx + Math.sin(h.wobble) * 0.5;
        h.rot += h.rotSpd;

        if (h.y > canvas.height + 30) { heartRain.splice(i, 1); continue; }

        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate((h.rot * Math.PI) / 180);
        ctx.globalAlpha = h.alpha;
        ctx.font = `${h.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(h.emoji, 0, 0);
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      requestAnimationFrame(animate);
    }

    function spawnHeartFlood() {
      const emojis = ['💖', '❤️', '💗', '💕', '💝', '🩷', '✨'];
      for (let i = 0; i < 60; i++) {
        setTimeout(() => {
          const h = document.createElement('div');
          h.className = 'cursor-click-heart';
          h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
          h.style.left = Math.random() * window.innerWidth + 'px';
          h.style.top = Math.random() * window.innerHeight + 'px';
          h.style.fontSize = Math.random() * 24 + 10 + 'px';
          h.style.setProperty('--x', (Math.random() - 0.5) * 140 + 'px');
          h.style.setProperty('--y', -(Math.random() * 140 + 50) + 'px');
          h.style.setProperty('--r', (Math.random() - 0.5) * 90 + 'deg');
          h.style.zIndex = '8500';
          document.body.appendChild(h);
          setTimeout(() => h.remove(), 1200);
        }, i * 45);
      }
    }

    window.addEventListener('resize', () => {
      if (running) resize();
    });
  }

  /* ══════════════════════════════════════════
     14. PARALLAX (throttled)
     ══════════════════════════════════════════ */
  function initParallax() {
    const moon = document.querySelector('.moon');
    const moonGlow = document.querySelector('.moon-glow');
    if (!moon && !moonGlow) return;

    window.addEventListener('scroll', throttleRAF(() => {
      const y = window.pageYOffset * 0.08;
      if (moon) moon.style.transform = `translate3d(0, ${-y}px, 0)`;
      if (moonGlow) moonGlow.style.transform = `translate3d(0, ${-y}px, 0)`;
    }), { passive: true });
  }

  /* ══════════════════════════════════════════
     15. SECTION FADE TRANSITIONS
     Adds smooth fade between sections on scroll
     ══════════════════════════════════════════ */
  function initSectionFades() {
    const sections = document.querySelectorAll('.section');
    if (!sections.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const ratio = entry.intersectionRatio;
        const el = entry.target;
        // Smooth opacity based on how visible the section is
        if (ratio > 0) {
          const opacity = Math.min(1, ratio * 2.5);
          el.style.opacity = opacity;
        }
      });
    }, {
      threshold: Array.from({ length: 20 }, (_, i) => i / 20),
      rootMargin: '0px'
    });

    sections.forEach(s => {
      s.style.transition = 'opacity 0.3s ease-out';
      observer.observe(s);
    });
  }

  /* ══════════════════════════════════════════
     16. FINALE – SET NAMES & DATE
     ══════════════════════════════════════════ */
  function initFinale() {
    const name1 = document.getElementById('finale-name-1');
    const name2 = document.getElementById('finale-name-2');
    const dateEl = document.getElementById('finale-date');

    if (name1) name1.textContent = CONFIG.yourName;
    if (name2) name2.textContent = CONFIG.herName;

    if (dateEl) {
      const opts = { year: 'numeric', month: 'long', day: 'numeric' };
      dateEl.textContent = 'Together since ' + CONFIG.startDate.toLocaleDateString('en-US', opts);
    }
  }

  /* ══════════════════════════════════════════
     INIT
     ══════════════════════════════════════════ */
  function init() {
    initLoadingScreen();
    initStars();
    initFloatingEffects();
    initAmbientParticles();
    initCursor();
    initMusic();
    initLoveLetter();
    initCounter();
    initScrollAnimations();
    initScrollProgress();
    initTimelineFill();
    initLoveLanguages();
    initSurprise();
    initParallax();
    initSectionFades();
    initFinale();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
