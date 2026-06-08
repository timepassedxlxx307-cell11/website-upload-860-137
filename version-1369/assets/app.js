(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
  var params = new URLSearchParams(window.location.search);
  var query = (params.get('q') || '').trim();

  panels.forEach(function (panel) {
    var input = panel.querySelector('[data-filter-input]');
    var chips = Array.prototype.slice.call(panel.querySelectorAll('[data-filter-chip]'));
    var activeChip = '';
    var list = document.querySelector('[data-filter-list]');

    if (input && query) {
      input.value = query;
    }

    function apply() {
      var term = input ? input.value.trim().toLowerCase() : '';
      var items = list ? Array.prototype.slice.call(list.querySelectorAll('[data-search]')) : [];

      items.forEach(function (item) {
        var haystack = (item.getAttribute('data-search') || '').toLowerCase();
        var matchTerm = !term || haystack.indexOf(term) !== -1;
        var matchChip = !activeChip || haystack.indexOf(activeChip) !== -1;
        item.hidden = !(matchTerm && matchChip);
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeChip = chip.getAttribute('data-filter-chip') || '';
        chips.forEach(function (item) {
          item.classList.toggle('is-active', item === chip);
        });
        apply();
      });
    });

    apply();
  });
})();
