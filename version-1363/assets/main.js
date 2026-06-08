(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var heroIndex = 0;

  function showHeroSlide(index) {
    if (!slides.length) {
      return;
    }

    heroIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, position) {
      slide.classList.toggle('active', position === heroIndex);
    });

    dots.forEach(function (dot, position) {
      dot.classList.toggle('active', position === heroIndex);
    });
  }

  dots.forEach(function (dot, position) {
    dot.addEventListener('click', function () {
      showHeroSlide(position);
    });
  });

  if (slides.length > 1) {
    showHeroSlide(0);
    window.setInterval(function () {
      showHeroSlide(heroIndex + 1);
    }, 5200);
  }

  function filterCards(value) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var query = String(value || '').trim().toLowerCase();

    cards.forEach(function (card) {
      var keywords = String(card.getAttribute('data-keywords') || '').toLowerCase();
      var matched = !query || keywords.indexOf(query) !== -1;
      card.classList.toggle('hidden-by-filter', !matched);
    });
  }

  var filterInputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));

  filterInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      filterCards(input.value);
    });
  });

  var chipButtons = Array.prototype.slice.call(document.querySelectorAll('[data-chip-filter]'));

  chipButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var value = button.getAttribute('data-chip-filter') || '';
      filterInputs.forEach(function (input) {
        input.value = value;
      });
      filterCards(value);
    });
  });
})();
