(function () {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const nav = document.querySelector('[data-site-nav]');

    if (menuButton && nav) {
        menuButton.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        let current = 0;
        let timer = null;

        const showSlide = function (index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        const startTimer = function () {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        };

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                showSlide(dotIndex);
                startTimer();
            });
        });

        startTimer();
    }

    const filterBars = Array.from(document.querySelectorAll('.filter-bar'));

    filterBars.forEach(function (bar) {
        const input = bar.querySelector('[data-search-input]');
        const typeSelect = bar.querySelector('[data-filter-type]');
        const regionSelect = bar.querySelector('[data-filter-region]');
        const yearSelect = bar.querySelector('[data-filter-year]');
        const genreSelect = bar.querySelector('[data-filter-genre]');
        const section = bar.closest('.section') || document;
        const cards = Array.from(section.querySelectorAll('.movie-card'));

        const normalize = function (value) {
            return String(value || '').trim().toLowerCase();
        };

        const applyFilters = function () {
            const keyword = normalize(input ? input.value : '');
            const typeValue = normalize(typeSelect ? typeSelect.value : '');
            const regionValue = normalize(regionSelect ? regionSelect.value : '');
            const yearValue = normalize(yearSelect ? yearSelect.value : '');
            const genreValue = normalize(genreSelect ? genreSelect.value : '');

            cards.forEach(function (card) {
                const searchText = normalize(card.getAttribute('data-search'));
                const cardType = normalize(card.getAttribute('data-type'));
                const cardRegion = normalize(card.getAttribute('data-region'));
                const cardYear = normalize(card.getAttribute('data-year'));
                const cardGenre = normalize(card.getAttribute('data-genre'));

                const matchedKeyword = !keyword || searchText.indexOf(keyword) !== -1;
                const matchedType = !typeValue || cardType === typeValue;
                const matchedRegion = !regionValue || cardRegion === regionValue;
                const matchedYear = !yearValue || cardYear === yearValue;
                const matchedGenre = !genreValue || cardGenre === genreValue;

                card.classList.toggle('is-filtered-out', !(matchedKeyword && matchedType && matchedRegion && matchedYear && matchedGenre));
            });
        };

        [input, typeSelect, regionSelect, yearSelect, genreSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });
    });
})();
