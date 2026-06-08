(function () {
    function queryAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function setupMobileNav() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function setupHeroSlider() {
        var slider = document.querySelector('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = queryAll('.hero-slide', slider);
        var dots = queryAll('.hero-dot', slider);
        var previous = slider.querySelector('[data-hero-prev]');
        var next = slider.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, position) {
                slide.classList.toggle('is-active', position === current);
            });
            dots.forEach(function (dot, position) {
                dot.classList.toggle('is-active', position === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 6500);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                start();
            });
        });

        if (previous) {
            previous.addEventListener('click', function () {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                start();
            });
        }

        slider.addEventListener('mouseenter', stop);
        slider.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupFilters() {
        var inputs = queryAll('[data-search-input]');
        inputs.forEach(function (input) {
            var scopeSelector = input.getAttribute('data-search-scope');
            var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
            var regionSelect = scope ? scope.querySelector('[data-region-filter]') : null;
            var typeSelect = scope ? scope.querySelector('[data-type-filter]') : null;
            var cards = scope ? queryAll('[data-filter-card]', scope) : [];

            function valueOf(card, name) {
                return (card.getAttribute(name) || '').toLowerCase();
            }

            function apply() {
                var keyword = input.value.trim().toLowerCase();
                var region = regionSelect ? regionSelect.value.toLowerCase() : '';
                var type = typeSelect ? typeSelect.value.toLowerCase() : '';
                cards.forEach(function (card) {
                    var text = [
                        valueOf(card, 'data-title'),
                        valueOf(card, 'data-tags'),
                        valueOf(card, 'data-region'),
                        valueOf(card, 'data-type'),
                        valueOf(card, 'data-year')
                    ].join(' ');
                    var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
                    var matchRegion = !region || valueOf(card, 'data-region') === region;
                    var matchType = !type || valueOf(card, 'data-type') === type;
                    card.classList.toggle('is-hidden', !(matchKeyword && matchRegion && matchType));
                });
            }

            input.addEventListener('input', apply);
            if (regionSelect) {
                regionSelect.addEventListener('change', apply);
            }
            if (typeSelect) {
                typeSelect.addEventListener('change', apply);
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileNav();
        setupHeroSlider();
        setupFilters();
    });
})();

window.MoviePlayer = (function () {
    function mount(source) {
        var player = document.querySelector('[data-stream-player]');
        if (!player) {
            return;
        }
        var video = player.querySelector('[data-stream-video]');
        var cover = player.querySelector('[data-player-cover]');
        var trigger = player.querySelector('[data-stream-start]');
        var startLinks = document.querySelectorAll('[data-start-play]');
        var loaded = false;
        var hls = null;

        function load() {
            if (loaded || !video) {
                return;
            }
            loaded = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function play() {
            load();
            player.classList.add('is-playing');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (trigger) {
            trigger.addEventListener('click', play);
        }
        if (cover) {
            cover.addEventListener('click', play);
        }
        startLinks.forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                player.scrollIntoView({ behavior: 'smooth', block: 'center' });
                window.setTimeout(play, 320);
            });
        });
        if (video) {
            video.addEventListener('play', function () {
                player.classList.add('is-playing');
            });
        }
    }

    return {
        mount: mount
    };
})();
