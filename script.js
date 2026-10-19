(function () {
  'use strict';

  /* Efek glitter hijau lembut mengikuti kursor */
  var canTrack = window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
                 !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canTrack) {
    var last = 0;
    document.addEventListener('mousemove', function (e) {
      var now = performance.now();
      if (now - last < 45) return;           // batasi agar ringan
      last = now;
      var n = 1 + Math.floor(Math.random() * 2);
      for (var i = 0; i < n; i++) spawn(e.clientX, e.clientY);
    });
  }

  function spawn(x, y) {
    var s = document.createElement('span');
    var size = 5 + Math.random() * 9;
    s.className = 'glitter' + (Math.random() > 0.55 ? ' star' : '');
    s.style.width = s.style.height = size + 'px';
    s.style.left = (x - size / 2 + (Math.random() * 16 - 8)) + 'px';
    s.style.top = (y - size / 2 + (Math.random() * 16 - 8)) + 'px';
    s.style.setProperty('--x', (Math.random() * 44 - 22) + 'px');
    s.style.setProperty('--y', (Math.random() * 44 + 6) + 'px');
    s.style.setProperty('--d', (700 + Math.random() * 600) + 'ms');
    document.body.appendChild(s);
    setTimeout(function () { s.remove(); }, 1400);
  }

  /* Animasi muncul saat scroll */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 90 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  /* Bayangan navbar saat scroll */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
})();

/* Galeri: filter + lightbox */
(function () {
  'use strict';
  var figs = Array.prototype.slice.call(document.querySelectorAll('.gallery figure')), cur = figs;
  var btns = document.querySelectorAll('.filters button');
  var lb = document.getElementById('lightbox');
  if (!figs.length || !lb) return;
  var img = lb.querySelector('img'), cap = lb.querySelector('figcaption'), idx = 0;

  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      btns.forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var f = b.getAttribute('data-filter');
      figs.forEach(function (fig) {
        if (!fig.hasAttribute('data-cat')) return;
        fig.classList.toggle('hide', f !== 'all' && fig.getAttribute('data-cat') !== f);
      });
    });
  });

  function visible() { return cur.filter(function (f) { return !f.classList.contains('hide'); }); }
  function show(list, i) {
    idx = (i + list.length) % list.length;
    var fig = list[idx];
    img.src = fig.querySelector('img').src;
    img.alt = fig.querySelector('img').alt;
    cap.textContent = fig.querySelector('figcaption').textContent;
  }
  function open(fig) {
    cur = Array.prototype.slice.call(fig.parentNode.querySelectorAll('figure'));
    var list = visible();
    show(list, list.indexOf(fig));
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  figs.forEach(function (fig) { fig.addEventListener('click', function () { open(fig); }); });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.prev').addEventListener('click', function () { show(visible(), idx - 1); });
  lb.querySelector('.next').addEventListener('click', function () { show(visible(), idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(visible(), idx - 1);
    if (e.key === 'ArrowRight') show(visible(), idx + 1);
  });
})();
