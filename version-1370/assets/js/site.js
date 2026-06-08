(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
            return;
        }
        callback();
    }

    ready(function () {
        var navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', function () {
                var opened = document.body.classList.toggle('menu-open');
                navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
            });
        }

        var hero = document.querySelector('[data-hero]');
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
            var previous = hero.querySelector('[data-hero-prev]');
            var next = hero.querySelector('[data-hero-next]');
            var current = 0;
            var timer = null;

            function show(index) {
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
            }

            function restart() {
                window.clearInterval(timer);
                timer = window.setInterval(function () {
                    show(current + 1);
                }, 5600);
            }

            dots.forEach(function (dot, index) {
                dot.addEventListener('click', function () {
                    show(index);
                    restart();
                });
            });

            if (previous) {
                previous.addEventListener('click', function () {
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

            show(0);
            restart();
        }

        var quickSearch = document.querySelector('[data-quick-search]');
        if (quickSearch) {
            quickSearch.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = quickSearch.querySelector('input');
                var query = input ? input.value.trim() : '';
                if (query) {
                    window.location.href = 'search.html?q=' + encodeURIComponent(query);
                } else {
                    window.location.href = 'search.html';
                }
            });
        }

        var grid = document.querySelector('[data-filter-grid]');
        if (grid) {
            var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-title]'));
            var keyword = document.querySelector('[data-filter-keyword]');
            var category = document.querySelector('[data-filter-category]');
            var year = document.querySelector('[data-filter-year]');
            var status = document.querySelector('[data-filter-status]');
            var empty = document.querySelector('[data-empty-state]');
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get('q');

            if (initialQuery && keyword) {
                keyword.value = initialQuery;
            }

            function applyFilter() {
                var words = keyword ? keyword.value.trim().toLowerCase() : '';
                var selectedCategory = category ? category.value : '';
                var selectedYear = year ? year.value : '';
                var visible = 0;

                cards.forEach(function (card) {
                    var haystack = (card.getAttribute('data-meta') || '').toLowerCase();
                    var categoryValue = card.getAttribute('data-category') || '';
                    var yearValue = card.getAttribute('data-year') || '';
                    var matchesWords = !words || haystack.indexOf(words) !== -1;
                    var matchesCategory = !selectedCategory || categoryValue === selectedCategory;
                    var matchesYear = !selectedYear || yearValue === selectedYear;
                    var keep = matchesWords && matchesCategory && matchesYear;
                    card.style.display = keep ? '' : 'none';
                    if (keep) {
                        visible += 1;
                    }
                });

                if (status) {
                    status.textContent = visible ? '已筛选出相关影片' : '没有匹配的影片';
                }
                if (empty) {
                    empty.style.display = visible ? 'none' : 'block';
                }
            }

            [keyword, category, year].forEach(function (node) {
                if (node) {
                    node.addEventListener('input', applyFilter);
                    node.addEventListener('change', applyFilter);
                }
            });

            applyFilter();
        }
    });
})();
