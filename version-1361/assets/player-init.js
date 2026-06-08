(function () {
    const players = Array.from(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
        const video = player.querySelector('video[data-hls]');
        const overlay = player.querySelector('.play-overlay');
        let isReady = false;
        let hlsInstance = null;

        if (!video) {
            return;
        }

        const attachStream = function () {
            if (isReady) {
                return;
            }

            const url = video.getAttribute('data-hls');

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
                isReady = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                });
                hlsInstance.loadSource(url);
                hlsInstance.attachMedia(video);
                isReady = true;
                return;
            }

            video.src = url;
            isReady = true;
        };

        const startPlayback = function () {
            attachStream();

            if (overlay) {
                overlay.classList.add('is-hidden');
            }

            const playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    if (overlay) {
                        overlay.classList.remove('is-hidden');
                    }
                });
            }
        };

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                startPlayback();
            }
        });

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
