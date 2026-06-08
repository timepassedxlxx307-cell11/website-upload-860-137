(function() {
    function setupMoviePlayer(source) {
        var video = document.getElementById("movieVideo");
        var shell = document.querySelector(".player-shell");
        var button = document.querySelector(".player-start");
        var loaded = false;
        var hlsInstance = null;

        if (!video || !shell || !button || !source) {
            return;
        }

        function attachSource() {
            if (loaded) {
                shell.classList.add("is-playing");
                video.play().catch(function() {});
                return;
            }

            loaded = true;
            shell.classList.add("is-playing");

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }

            video.play().catch(function() {});
        }

        button.addEventListener("click", function(event) {
            event.preventDefault();
            attachSource();
        });

        shell.addEventListener("click", function(event) {
            if (event.target === shell) {
                attachSource();
            }
        });

        video.addEventListener("click", function() {
            if (!loaded) {
                attachSource();
            }
        });

        video.addEventListener("play", function() {
            shell.classList.add("is-playing");
        });

        window.addEventListener("beforeunload", function() {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.setupMoviePlayer = setupMoviePlayer;
})();
