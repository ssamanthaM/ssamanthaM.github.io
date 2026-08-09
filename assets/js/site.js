/* Samantha Vargas-Markham — site behaviour: nav, reveal, gallery, lightbox. */
(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.setAttribute('data-open', 'false');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Mark current page in nav ---------- */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a[href]').forEach(function (a) {
    var target = a.getAttribute('href').split('/').pop();
    if (target === here) a.setAttribute('aria-current', 'page');
  });

  /* ---------- Reveal on scroll ----------
     The hidden state lives behind .js on <html>, added below, so a failure
     anywhere above this point leaves the page fully visible rather than blank. */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('js');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0 });
    reveals.forEach(function (el) { io.observe(el); });
    // Belt and braces: nothing stays hidden for more than a second and a half.
    setTimeout(function () {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
    }, 1500);
  }

  /* ---------- Gallery ---------- */
  var grid = document.getElementById('photo-grid');
  if (grid) {
    var CAT_LABEL = {
      all: 'Everything',
      government: 'Legislature & executive',
      diplomacy: 'Multilateral',
      district: 'District work',
      press: 'Press & platform',
      academic: 'Academic',
      animals: 'Animal welfare'
    };
    var ORDER = ['all', 'government', 'diplomacy', 'district', 'press', 'academic', 'animals'];
    var items = [];
    var visible = [];

    fetch('assets/js/gallery.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        items = data.filter(function (d) { return d.cat !== 'portrait'; });
        buildFilters();
        render('all');
      })
      .catch(function () {
        grid.innerHTML = '<p class="lede">The gallery could not be loaded.</p>';
      });

    function buildFilters() {
      var bar = document.getElementById('photo-filters');
      if (!bar) return;
      var present = ORDER.filter(function (c) {
        return c === 'all' || items.some(function (i) { return i.cat === c; });
      });
      bar.innerHTML = present.map(function (c, i) {
        return '<button class="filter" type="button" data-cat="' + c + '" aria-pressed="' +
          (i === 0 ? 'true' : 'false') + '">' + CAT_LABEL[c] + '</button>';
      }).join('');
      bar.addEventListener('click', function (e) {
        var b = e.target.closest('.filter');
        if (!b) return;
        bar.querySelectorAll('.filter').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        render(b.dataset.cat);
      });
    }

    function render(cat) {
      visible = cat === 'all' ? items : items.filter(function (i) { return i.cat === cat; });
      grid.innerHTML = visible.map(function (it, idx) {
        var ratio = (it.w && it.h) ? ' style="aspect-ratio:' + it.w + '/' + it.h + '"' : '';
        return '<button class="photo" type="button" data-idx="' + idx + '" aria-label="Open: ' + esc(it.caption) + '">' +
          '<img src="assets/img/' + it.slug + '-t.jpg" alt="' + esc(it.caption) + '" loading="lazy" decoding="async"' + ratio + '>' +
          '<figcaption>' + esc(it.caption) + '</figcaption>' +
          '</button>';
      }).join('');
    }

    /* ---------- Lightbox ---------- */
    var lb = document.getElementById('lightbox');
    var lbImg = lb && lb.querySelector('img');
    var lbCap = lb && lb.querySelector('figcaption');
    var cur = 0;
    var lastFocus = null;

    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.photo');
      if (!b) return;
      lastFocus = b;
      open(parseInt(b.dataset.idx, 10));
    });

    function open(i) {
      if (!lb || !visible.length) return;
      cur = (i + visible.length) % visible.length;
      var it = visible[cur];
      lbImg.src = 'assets/img/' + it.slug + '.jpg';
      lbImg.alt = it.caption;
      lbCap.textContent = it.caption;
      lb.setAttribute('data-open', 'true');
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lb__close').focus();
    }
    function close() {
      if (!lb) return;
      lb.setAttribute('data-open', 'false');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }
    if (lb) {
      lb.addEventListener('click', function (e) {
        if (e.target === lb || e.target.closest('.lb__close')) return close();
        if (e.target.closest('.lb__nav--prev')) return open(cur - 1);
        if (e.target.closest('.lb__nav--next')) return open(cur + 1);
      });
      document.addEventListener('keydown', function (e) {
        if (lb.getAttribute('data-open') !== 'true') return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') open(cur - 1);
        if (e.key === 'ArrowRight') open(cur + 1);
      });
    }
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
})();
