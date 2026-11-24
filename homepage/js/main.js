/* ==========================================================================
   ISHARA — homepage interactions
   1. Mobile menu
   2. Scroll-spy + sliding orange nav indicator
   3. Smooth section navigation (locks the spy during programmatic scroll)
   4. Scroll reveals
   5. Hero "sign → text" caption cycle
   6. Small niceties (header shadow, year)
   No dependencies. Everything respects prefers-reduced-motion.
   ========================================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Mobile menu ---------- */
  var header = document.getElementById('siteHeader');
  var toggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMenu() {
    if (!toggle || !mobileNav) return;
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
  }

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileNav.classList.toggle('open', !open);
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
    document.addEventListener('click', function (e) {
      if (header && !header.contains(e.target)) closeMenu();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  /* ---------- 2. Scroll-spy + orange underline indicator ---------- */
  var nav = document.getElementById('mainNav');
  var indicator = document.getElementById('navIndicator');
  var links = nav ? Array.prototype.slice.call(nav.querySelectorAll('.nav-link')) : [];
  var sections = links
    .map(function (l) { return document.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  var currentId = null;
  // lock the spy while a click-triggered smooth scroll is in flight
  var spyLockUntil = 0;

  function moveIndicator(link, animate) {
    if (!indicator || !link) return;
    if (nav.offsetParent === null) return; // nav hidden (mobile) — nothing to do
    if (!animate) indicator.classList.add('no-anim');
    indicator.style.width = link.offsetWidth + 'px';
    indicator.style.transform = 'translateX(' + link.offsetLeft + 'px)';
    if (!animate) {
      // force reflow, then restore the transition
      void indicator.offsetWidth;
      requestAnimationFrame(function () {
        indicator.classList.remove('no-anim');
      });
    }
  }

  function setActive(id, animate) {
    if (id === currentId) return;
    currentId = id;
    links.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
        moveIndicator(link, animate !== false);
      } else {
        link.removeAttribute('aria-current');
      }
    });
    // mirror the state onto the mobile menu
    if (mobileNav) {
      Array.prototype.forEach.call(mobileNav.querySelectorAll('a'), function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  }

  function spy() {
    if (!sections.length) return;
    if (Date.now() < spyLockUntil) return;
    var probe = window.scrollY + header.offsetHeight + Math.min(window.innerHeight * 0.28, 230);
    var active = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= probe) active = sections[i];
    }
    setActive(active.id, true);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      spy();
      if (header) header.classList.toggle('scrolled', window.scrollY > 8);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  function reposition() {
    var link = links.filter(function (l) { return l.classList.contains('active'); })[0];
    if (link) moveIndicator(link, false);
  }
  window.addEventListener('resize', reposition);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(reposition);
  }
  window.addEventListener('load', reposition);

  /* ---------- 3. Smooth anchor navigation ---------- */
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    var target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    // lock the spy so the indicator doesn't hop through intermediate sections
    spyLockUntil = Date.now() + (reduceMotion ? 100 : 900);
    setActive(target.id, true);
    if ('scrollend' in window) {
      var done = function () { spyLockUntil = 0; window.removeEventListener('scrollend', done); };
      window.addEventListener('scrollend', done);
    }
    if (mobileNav && mobileNav.contains(anchor)) closeMenu();
  });

  /* ---------- 4. Scroll reveals ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- 5. Hero caption — the hand signs "Hello", Ishara writes "Hello" ---------- */
  // The caption stays on "Hello!" (that's the sign being shown). Each wave
  // cycle the "Understood" chip pops again to keep the demo feeling alive.
  var chip = document.getElementById('understandChip');
  var hero = document.getElementById('home');

  if (chip && !reduceMotion) {
    var heroVisible = true;
    if ('IntersectionObserver' in window && hero) {
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
      }, { threshold: 0.15 }).observe(hero);
    }
    setInterval(function () {
      if (!heroVisible || document.hidden) return;
      chip.classList.remove('pop');
      void chip.offsetWidth;
      chip.classList.add('pop');
    }, 3400);
  }

  /* ---------- 6. Niceties ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Set the initial state
  spy();
  reposition();
})();
