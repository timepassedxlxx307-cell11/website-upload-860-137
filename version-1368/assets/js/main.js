(function () {
    var mobileToggle = document.querySelector('[data-mobile-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var active = 0;
        var timer = null;

        var setSlide = function (index) {
            if (!slides.length) {
                return;
            }

            active = (index + slides.length) % slides.length;

            slides.forEach(function (slide, current) {
                slide.classList.toggle('is-active', current === active);
            });

            dots.forEach(function (dot, current) {
                dot.classList.toggle('is-active', current === active);
            });
        };

        var move = function (step) {
            setSlide(active + step);
        };

        var start = function () {
            if (timer) {
                window.clearInterval(timer);
            }

            timer = window.setInterval(function () {
                move(1);
            }, 5200);
        };

        if (prev) {
            prev.addEventListener('click', function () {
                move(-1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                move(1);
                start();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                setSlide(index);
                start();
            });
        });

        start();
    }

    var params = new URLSearchParams(window.location.search);
    var queryValue = params.get('q') || '';
    var filterInput = document.querySelector('[data-filter-input]');
    var querySync = document.querySelector('[data-query-sync]');
    var typeFilter = document.querySelector('[data-type-filter]');
    var yearFilter = document.querySelector('[data-year-filter]');
    var categoryFilter = document.querySelector('[data-category-filter]');
    var clearButton = document.querySelector('[data-clear-filters]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-search-card]'));
    var emptyState = document.querySelector('[data-empty]');

    var normalize = function (value) {
        return (value || '').toString().trim().toLowerCase();
    };

    var cardText = function (card) {
        return normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-year'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags'),
            card.textContent
        ].join(' '));
    };

    var runFilter = function () {
        if (!cards.length) {
            return;
        }

        var keyword = normalize(filterInput ? filterInput.value : '');
        var type = normalize(typeFilter ? typeFilter.value : '');
        var year = normalize(yearFilter ? yearFilter.value : '');
        var category = normalize(categoryFilter ? categoryFilter.value : '');
        var visible = 0;

        cards.forEach(function (card) {
            var text = cardText(card);
            var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchType = !type || normalize(card.getAttribute('data-type')).indexOf(type) !== -1;
            var matchYear = !year || normalize(card.getAttribute('data-year')) === year;
            var matchCategory = !category || normalize(card.getAttribute('data-category')) === category;
            var show = matchKeyword && matchType && matchYear && matchCategory;

            card.hidden = !show;

            if (show) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.hidden = visible !== 0;
        }
    };

    if (filterInput) {
        if (querySync && queryValue) {
            filterInput.value = queryValue;
        }

        filterInput.addEventListener('input', runFilter);
    }

    [typeFilter, yearFilter, categoryFilter].forEach(function (control) {
        if (control) {
            control.addEventListener('change', runFilter);
        }
    });

    if (clearButton) {
        clearButton.addEventListener('click', function () {
            if (filterInput) {
                filterInput.value = '';
            }
            if (typeFilter) {
                typeFilter.value = '';
            }
            if (yearFilter) {
                yearFilter.value = '';
            }
            if (categoryFilter) {
                categoryFilter.value = '';
            }
            runFilter();
        });
    }

    runFilter();

    var player = document.querySelector('[data-player]');

    if (player) {
        var video = player.querySelector('video');
        var trigger = player.querySelector('[data-play-trigger]');
        var src = player.getAttribute('data-video');
        var hlsInstance = null;

        var loadVideo = function () {
            if (!video || !src) {
                return;
            }

            if (trigger) {
                trigger.classList.add('is-hidden');
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                if (!video.getAttribute('src')) {
                    video.setAttribute('src', src);
                }
                video.play().catch(function () {});
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                if (!hlsInstance) {
                    hlsInstance = new window.Hls();
                    hlsInstance.loadSource(src);
                    hlsInstance.attachMedia(video);
                }
                video.play().catch(function () {});
                return;
            }

            if (!video.getAttribute('src')) {
                video.setAttribute('src', src);
            }
            video.play().catch(function () {});
        };

        if (trigger) {
            trigger.addEventListener('click', loadVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    loadVideo();
                }
            });
        }
    }
})();
