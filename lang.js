// lang.js — язык + все визуальные эффекты

// ── Язык ──
function setLang(lang) {
  localStorage.setItem('lang', lang);
  const btnRu = document.getElementById('btn-ru');
  const btnEn = document.getElementById('btn-en');
  if (btnRu) btnRu.classList.toggle('active', lang === 'ru');
  if (btnEn) btnEn.classList.toggle('active', lang === 'en');
  document.querySelectorAll('[data-ru]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val !== null) el.innerHTML = val;
  });
  document.documentElement.lang = lang;
}

(function() {
  const lang = localStorage.getItem('lang') || 'ru';
  document.addEventListener('DOMContentLoaded', function() {
    setLang(lang);
    initCardAnim();
    initScrollTop();
    initScrollProgress();
    initParallax();
    initTypewriter();
    initParticles();
    initComets();
  });
})();

// ── Анимация карточек при загрузке ──
function initCardAnim() {
  const cards = document.querySelectorAll('.anim-up');
  if (!cards.length) return;
  cards.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'none';
    el.style.animation = 'none';
    setTimeout(() => {
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 150 + i * 120);
  });
}

// ── Кнопка "наверх" ──
function initScrollTop() {
  const btn = document.createElement('button');
  btn.id = 'scroll-top-btn';
  btn.innerHTML = '↑';
  btn.style.cssText = `
    position: fixed; bottom: 28px; right: 28px; z-index: 999;
    width: 44px; height: 44px; border-radius: 50%;
    background: rgba(15, 45, 100, 0.7);
    border: 1px solid rgba(0, 229, 255, 0.3);
    color: #00e5ff; font-size: 1.2rem;
    cursor: pointer; opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.1);
  `;
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'translateY(-3px)';
    btn.style.boxShadow = '0 0 30px rgba(0, 229, 255, 0.25)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translateY(0)';
    btn.style.boxShadow = '0 0 20px rgba(0, 229, 255, 0.1)';
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.style.opacity = '1';
      btn.style.pointerEvents = 'auto';
    } else {
      btn.style.opacity = '0';
      btn.style.pointerEvents = 'none';
    }
  });
}

// ── Полоса прогресса скролла ──
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px; width: 0%;
    background: linear-gradient(90deg, #ff3cac, #00e5ff);
    z-index: 9999; transition: width 0.1s linear;
    box-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  });
}

// ── Параллакс орбов за курсором (только десктоп) ──
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 12;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      orb.style.transition = 'transform 0.8s ease';
    });
  });
}

// ── Печатающийся текст в заголовке главной ──
function initTypewriter() {
  const h1 = document.querySelector('.header h1');
  if (!h1) return;

  const lang = localStorage.getItem('lang') || 'ru';
  const text = lang === 'ru' ? 'Портфолио' : 'Portfolio';

  h1.textContent = '';
  h1.style.borderRight = '2px solid #00e5ff';

  let i = 0;
  const interval = setInterval(() => {
    h1.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      setTimeout(() => { h1.style.borderRight = 'none'; }, 500);
    }
  }, 80);
}

// ── Частицы на фоне с сохранением позиций ──
function initParticles() {
  const c = document.createElement('canvas');
  c.id = 'bg-canvas-particles';
  c.style.cssText = `
    position: fixed; inset: 0; z-index: 1;
    pointer-events: none; opacity: 0.5;
  `;
  document.body.appendChild(c);
  runParticles(c);
}

function runParticles(canvas) {
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const COUNT = window.innerWidth < 600 ? 30 : 60;

  // Восстанавливаем позиции из sessionStorage если есть
  let saved = null;
  try {
    const raw = sessionStorage.getItem('particles');
    if (raw) saved = JSON.parse(raw);
  } catch(e) {}

  const particles = Array.from({ length: COUNT }, (_, idx) => {
    if (saved && saved[idx]) {
      return { ...saved[idx] };
    }
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.6 + 0.2,
    };
  });

  // Сохраняем позиции при уходе со страницы
  window.addEventListener('pagehide', () => {
    try {
      sessionStorage.setItem('particles', JSON.stringify(particles));
    } catch(e) {}
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
    });
    requestAnimationFrame(draw);
  }
  draw();
}


// ── Плавное появление страницы ──
(function() {
  const style = document.createElement('style');
  style.textContent = `
    body { opacity: 0; transition: opacity 0.4s ease; }
    body.page-ready { opacity: 1; }
  `;
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', () => {
    requestAnimationFrame(() => document.body.classList.add('page-ready'));
  });
})();


// ── Кометы ──
function initComets() {
  const canvas = document.getElementById('bg-canvas-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function spawnComet() {
    const W = canvas.width;
    const H = canvas.height;

    // Стартуем с верхнего или левого края
    const fromTop = Math.random() > 0.5;
    const x = fromTop ? Math.random() * W : 0;
    const y = fromTop ? 0 : Math.random() * H * 0.5;

    const angle = (Math.PI / 180) * (30 + Math.random() * 20); // ~30-50 градусов
    const speed = 8 + Math.random() * 6;
    const length = 80 + Math.random() * 120;
    const alpha = { val: 0 };

    let cx = x, cy = y;
    let frame = 0;
    const maxFrames = Math.round((Math.max(W, H) * 1.5) / speed);

    function drawComet() {
      frame++;
      cx += Math.cos(angle) * speed;
      cy += Math.sin(angle) * speed;

      // Fade in/out
      if (frame < 15) alpha.val = frame / 15;
      else if (frame > maxFrames - 15) alpha.val = (maxFrames - frame) / 15;
      else alpha.val = 1;

      alpha.val = Math.max(0, Math.min(1, alpha.val));

      // Хвост кометы
      const tailX = cx - Math.cos(angle) * length;
      const tailY = cy - Math.sin(angle) * length;

      const grad = ctx.createLinearGradient(tailX, tailY, cx, cy);
      grad.addColorStop(0, `rgba(0, 229, 255, 0)`);
      grad.addColorStop(0.7, `rgba(0, 229, 255, ${alpha.val * 0.3})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${alpha.val * 0.9})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(cx, cy);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Яркая головка
      ctx.beginPath();
      ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.val})`;
      ctx.fill();

      if (frame < maxFrames && cx < W + length && cy < H + length) {
        requestAnimationFrame(drawComet);
      }
    }

    drawComet();

    // Следующая комета через 15-35 секунд
    setTimeout(spawnComet, 15000 + Math.random() * 20000);
  }

  // Первая комета через 3-8 секунд после загрузки
  setTimeout(spawnComet, 3000 + Math.random() * 5000);
}
