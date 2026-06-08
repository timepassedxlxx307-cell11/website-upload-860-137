(function () {
    var mobileButton = document.querySelector('[data-mobile-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (mobileButton && mobileNav) {
        mobileButton.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    var searchInput = document.querySelector('[data-search-input]');
    var clearButton = document.querySelector('[data-search-clear]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function filterCards() {
        var query = normalize(searchInput && searchInput.value);

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags')
            ].join(' '));
            card.classList.toggle('is-hidden', query && haystack.indexOf(query) === -1);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }

    if (clearButton) {
        clearButton.addEventListener('click', function () {
            if (searchInput) {
                searchInput.value = '';
                filterCards();
                searchInput.focus();
            }
        });
    }

    var hlsLoaderPromise = null;

    function loadHlsScript() {
        if (window.Hls) {
            return Promise.resolve(window.Hls);
        }

        if (!hlsLoaderPromise) {
            hlsLoaderPromise = new Promise(function (resolve, reject) {
                var script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js';
                script.async = true;
                script.onload = function () {
                    resolve(window.Hls);
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        return hlsLoaderPromise;
    }

    function attachStream(video, streamUrl) {
        if (!streamUrl) {
            return Promise.reject(new Error('empty stream'));
        }

        if (video.dataset.ready === '1') {
            return Promise.resolve();
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = streamUrl;
            video.dataset.ready = '1';
            return Promise.resolve();
        }

        return loadHlsScript().then(function (Hls) {
            if (Hls && Hls.isSupported()) {
                var hls = new Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
                video._hlsInstance = hls;
                video.dataset.ready = '1';
                return;
            }
            video.src = streamUrl;
            video.dataset.ready = '1';
        });
    }

    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play-button]');

        if (!video || !button) {
            return;
        }

        function playVideo() {
            var streamUrl = video.getAttribute('data-stream');
            attachStream(video, streamUrl).then(function () {
                player.classList.add('is-ready');
                return video.play();
            }).then(function () {
                player.classList.add('is-playing');
                button.classList.add('hidden');
            }).catch(function () {
                button.querySelector('em').textContent = '视频加载失败，请刷新后重试';
            });
        }

        button.addEventListener('click', playVideo);
        video.addEventListener('play', function () {
            player.classList.add('is-playing');
            button.classList.add('hidden');
        });
        video.addEventListener('pause', function () {
            player.classList.remove('is-playing');
        });
    });
})();
