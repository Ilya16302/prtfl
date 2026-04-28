// lang.js — единый скрипт переключения языка
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
  });
})();
