(function () {
  function selectAll(selector, parent) {
    return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
  }

  function setupSearchForms() {
    selectAll('[data-site-search]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = form.querySelector('input[name="q"]');
        var query = input ? input.value.trim() : '';
        var target = './search.html';
        if (query) {
          target += '?q=' + encodeURIComponent(query);
        }
        window.location.href = target;
      });
    });
  }

  function setupMobileMenu() {
    var toggle = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!toggle || !panel) {
      return;
    }
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero]');
    if (!root) {
      return;
    }
    var slides = selectAll('.hero-slide', root);
    var dots = selectAll('.hero-dot', root);
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function start() {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(dotIndex);
        start();
      });
    });

    show(0);
    start();
  }

  function setupFilters() {
    var panel = document.querySelector('[data-filter-panel]');
    if (!panel) {
      return;
    }
    var cards = selectAll('.movie-card');
    var searchInput = panel.querySelector('[data-card-search]');
    var selects = selectAll('[data-filter]', panel);
    var chips = selectAll('[data-genre-chip]', panel);
    var empty = document.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (searchInput && query) {
      searchInput.value = query;
    }

    function activeGenre() {
      var active = panel.querySelector('[data-genre-chip].active');
      return active ? active.getAttribute('data-genre-chip') || '' : '';
    }

    function apply() {
      var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
      var genre = activeGenre();
      var visible = 0;
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search') || '').toLowerCase();
        var region = card.getAttribute('data-region') || '';
        var type = card.getAttribute('data-type') || '';
        var year = card.getAttribute('data-year') || '';
        var genreText = card.getAttribute('data-genre') || '';
        var matched = true;
        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }
        selects.forEach(function (select) {
          var value = select.value;
          var key = select.getAttribute('data-filter');
          if (!value) {
            return;
          }
          if (key === 'region' && region !== value) {
            matched = false;
          }
          if (key === 'type' && type !== value) {
            matched = false;
          }
          if (key === 'year' && year !== value) {
            matched = false;
          }
        });
        if (genre && text.indexOf(genre.toLowerCase()) === -1 && genreText.indexOf(genre) === -1 && type.indexOf(genre) === -1) {
          matched = false;
        }
        card.classList.toggle('hidden-card', !matched);
        if (matched) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', apply);
    }
    selects.forEach(function (select) {
      select.addEventListener('change', apply);
    });
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (other) {
          other.classList.remove('active');
        });
        chip.classList.add('active');
        apply();
      });
    });
    apply();
  }

  window.initializeVideoPlayer = function (streamUrl) {
    var video = document.getElementById('video-player');
    var overlay = document.querySelector('[data-player-overlay]');
    var button = document.querySelector('[data-play-button]');
    var attached = false;

    if (!video || !streamUrl) {
      return;
    }

    function attachStream() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function play() {
      attachStream();
      if (overlay) {
        overlay.classList.add('hidden');
      }
      var result = video.play();
      if (result && typeof result.catch === 'function') {
        result.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }
    if (overlay) {
      overlay.addEventListener('click', play);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setupSearchForms();
    setupMobileMenu();
    setupHero();
    setupFilters();
  });
})();
