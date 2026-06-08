(function() {
    function ready(callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    }

    ready(function() {
        var header = document.querySelector(".site-header");
        var navToggle = document.querySelector(".nav-toggle");

        if (header && navToggle) {
            navToggle.addEventListener("click", function() {
                var isOpen = header.classList.toggle("nav-open");
                navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
            });
        }

        var sliders = document.querySelectorAll(".hero-slider");
        sliders.forEach(function(slider) {
            var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
            var current = 0;
            var timer = null;

            function show(index) {
                current = (index + slides.length) % slides.length;
                slides.forEach(function(slide, slideIndex) {
                    slide.classList.toggle("is-active", slideIndex === current);
                });
                dots.forEach(function(dot, dotIndex) {
                    dot.classList.toggle("is-active", dotIndex === current);
                });
            }

            function play() {
                if (timer) {
                    window.clearInterval(timer);
                }
                timer = window.setInterval(function() {
                    show(current + 1);
                }, 5200);
            }

            dots.forEach(function(dot) {
                dot.addEventListener("click", function() {
                    show(Number(dot.getAttribute("data-slide") || 0));
                    play();
                });
            });

            if (slides.length > 1) {
                play();
            }
        });

        var searchInputs = document.querySelectorAll(".card-search");
        searchInputs.forEach(function(input) {
            var scope = input.closest("main") || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

            input.addEventListener("input", function() {
                var query = input.value.trim().toLowerCase();
                cards.forEach(function(card) {
                    var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
                    card.classList.toggle("is-hidden", query && text.indexOf(query) === -1);
                });
            });
        });

        var chipGroups = document.querySelectorAll(".filter-chips");
        chipGroups.forEach(function(group) {
            var scope = group.closest("main") || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
            var buttons = Array.prototype.slice.call(group.querySelectorAll("button"));

            buttons.forEach(function(button) {
                button.addEventListener("click", function() {
                    var filter = button.getAttribute("data-filter") || "all";
                    buttons.forEach(function(item) {
                        item.classList.toggle("is-active", item === button);
                    });
                    cards.forEach(function(card) {
                        var text = card.getAttribute("data-search") || card.textContent || "";
                        card.classList.toggle("is-hidden", filter !== "all" && text.indexOf(filter) === -1);
                    });
                });
            });
        });
    });
})();
