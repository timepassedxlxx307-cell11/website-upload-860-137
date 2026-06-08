(function () {
    window.initMoviePlayer = function (streamUrl) {
        function ready(callback) {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', callback);
                return;
            }
            callback();
        }

        ready(function () {
            var player = document.querySelector('[data-player]');
            if (!player || !streamUrl) {
                return;
            }

            var video = player.querySelector('video');
            var layer = player.querySelector('.play-layer');
            var attached = false;
            var hls = null;

            function attachStream() {
                if (attached || !video) {
                    return;
                }
                attached = true;

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: false
                    });
                    hls.loadSource(streamUrl);
                    hls.attachMedia(video);
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = streamUrl;
                } else {
                    video.src = streamUrl;
                }
            }

            function play() {
                attachStream();
                if (layer) {
                    layer.classList.add('is-hidden');
                }
                var promise = video.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(function () {});
                }
            }

            if (layer) {
                layer.addEventListener('click', play);
            }

            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                } else {
                    video.pause();
                }
            });

            video.addEventListener('play', function () {
                if (layer) {
                    layer.classList.add('is-hidden');
                }
            });
        });
    };
})();
