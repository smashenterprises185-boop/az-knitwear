/* ==========================================================================
   THREAD & VIBE — interactive behaviour
   1. Mobile menu toggle
   2. Sticky header shadow on scroll
   3. Smooth scroll + close mobile menu on nav click
   4. Reviews carousel (prev/next + dots)
   5. Newsletter form handling (front-end only demo)
   6. Footer year auto-fill
   7. Scroll-reveal for [data-reveal] elements
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1 & 3. Mobile menu ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMenu() {
    mobileNav.classList.remove('is-open');
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
  }

  function openMenu() {
    mobileNav.hidden = false;
    requestAnimationFrame(function () {
      mobileNav.classList.add('is-open');
    });
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', function () {
      var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      isOpen ? closeMenu() : openMenu();
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
      }
    });
  }

  /* ---------- 2. Sticky header shadow ---------- */
  var siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    var toggleHeaderShadow = function () {
      siteHeader.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    toggleHeaderShadow();
    window.addEventListener('scroll', toggleHeaderShadow, { passive: true });
  }

  /* ---------- 3. Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      var headerOffset = siteHeader ? siteHeader.offsetHeight : 0;
      var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset - 12;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });

      window.setTimeout(function () {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }, 400);
    });
  });

  /* ---------- 4. Reviews carousel ---------- */
  var track = document.getElementById('reviewsTrack');
  var prevBtn = document.getElementById('reviewsPrev');
  var nextBtn = document.getElementById('reviewsNext');
  var dotsWrap = document.getElementById('reviewsDots');

  if (track && prevBtn && nextBtn && dotsWrap) {
    var cards = Array.prototype.slice.call(track.children);
    var currentIndex = 0;

    cards.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'reviews-nav__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Show review ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function visibleCount() {
      var trackWidth = track.parentElement.clientWidth;
      var cardWidth = cards[0].getBoundingClientRect().width + 20;
      return Math.max(1, Math.round(trackWidth / cardWidth));
    }

    function maxIndex() { return Math.max(0, cards.length - visibleCount()); }

    function updateDots() {
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === currentIndex);
      });
    }

    function goTo(index) {
      currentIndex = Math.min(Math.max(index, 0), maxIndex());
      var offset = cards[0].getBoundingClientRect().width + 20;
      track.style.transform = 'translateX(-' + (offset * currentIndex) + 'px)';
      updateDots();
    }

    prevBtn.addEventListener('click', function () { goTo(currentIndex - 1); });
    nextBtn.addEventListener('click', function () { goTo(currentIndex + 1); });
    window.addEventListener('resize', function () { goTo(0); });

    goTo(0);
  }

  /* ---------- 5. Newsletter form (front-end demo only) ---------- */
  var joinForm = document.getElementById('joinForm');
  var joinNote = document.getElementById('joinNote');

  if (joinForm && joinNote) {
    joinForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailField = document.getElementById('joinEmail');
      var email = emailField.value.trim();
      var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!isValid) {
        joinNote.textContent = 'That email doesn\u2019t look right \u2014 give it another check.';
        joinNote.style.color = '#c0392b';
        emailField.focus();
        return;
      }

      joinNote.textContent = 'You\u2019re on the list \u2014 look out for the first drop email.';
      joinNote.style.color = '';
      joinForm.reset();
    });
  }

  /* ---------- 6. Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- 7. Scroll-reveal for [data-reveal] elements ---------- */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback for browsers without IntersectionObserver support
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

});