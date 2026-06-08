(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileNav() {
    var button = $('[data-mobile-toggle]');
    var nav = $('#mobileNav');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function setupHero() {
    var carousel = $('[data-hero-carousel]');
    if (!carousel) {
      return;
    }
    var slides = $all('.hero-slide', carousel);
    var dots = $all('[data-hero-dot]', carousel);
    var prev = $('[data-hero-prev]', carousel);
    var next = $('[data-hero-next]', carousel);
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
        restart();
      });
    });
    show(0);
    restart();
  }

  function setupFilters() {
    var panel = $('[data-filter-panel]');
    if (!panel) {
      return;
    }
    var search = $('[data-filter-search]', panel);
    var type = $('[data-filter-type]', panel);
    var region = $('[data-filter-region]', panel);
    var year = $('[data-filter-year]', panel);
    var reset = $('[data-filter-reset]', panel);
    var cards = $all('.movie-card');
    var empty = $('[data-empty-message]');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && search) {
      search.value = q;
    }

    function textOf(card) {
      return [
        card.getAttribute('data-title'),
        card.getAttribute('data-type'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.textContent
      ].join(' ').toLowerCase();
    }

    function apply() {
      var keyword = search ? search.value.trim().toLowerCase() : '';
      var selectedType = type ? type.value : '';
      var selectedRegion = region ? region.value : '';
      var selectedYear = year ? year.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var ok = true;
        if (keyword && textOf(card).indexOf(keyword) === -1) {
          ok = false;
        }
        if (selectedType && card.getAttribute('data-type') !== selectedType) {
          ok = false;
        }
        if (selectedRegion && card.getAttribute('data-region') !== selectedRegion) {
          ok = false;
        }
        if (selectedYear && card.getAttribute('data-year') !== selectedYear) {
          ok = false;
        }
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    [search, type, region, year].forEach(function (element) {
      if (element) {
        element.addEventListener('input', apply);
        element.addEventListener('change', apply);
      }
    });
    if (reset) {
      reset.addEventListener('click', function () {
        if (search) search.value = '';
        if (type) type.value = '';
        if (region) region.value = '';
        if (year) year.value = '';
        apply();
      });
    }
    apply();
  }

  function setupPlayers() {
    $all('[data-player]').forEach(function (wrap, index) {
      var video = $('video[data-source]', wrap);
      var button = $('[data-play-button]', wrap);
      if (!video) {
        return;
      }
      var source = video.getAttribute('data-source');
      var ready = false;

      function init() {
        if (ready || !source) {
          return;
        }
        ready = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          video._hls = hls;
        } else {
          video.src = source;
        }
      }

      function play() {
        init();
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }

      video.addEventListener('play', function () {
        wrap.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        wrap.classList.remove('is-playing');
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          play();
        }
      });
      if (button) {
        button.addEventListener('click', play);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileNav();
    setupHero();
    setupFilters();
    setupPlayers();
  });
})();
