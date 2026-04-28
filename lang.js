// lang.js — единый скрипт переключения языка + анимация скролла

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
    initScrollAnim();
  });
})();

function initScrollAnim() {
  // Только на внутренних страницах (не index.html)
  const cards = document.querySelectorAll('.anim-up');
  if (!cards.length) return;

  // Убираем CSS-анимацию которая срабатывает сразу
  cards.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    // Убираем animation чтобы не конфликтовала
    el.style.animation = 'none';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Небольшая задержка для каждой карточки по порядку
        const delay = el.classList.contains('anim-up-1') ? 0 :
                      el.classList.contains('anim-up-2') ? 100 :
                      el.classList.contains('anim-up-3') ? 200 :
                      el.classList.contains('anim-up-4') ? 300 :
                      el.classList.contains('anim-up-5') ? 400 : 0;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  cards.forEach(el => observer.observe(el));
}
