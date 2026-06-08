(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('.movie-player-wrap'));

  players.forEach(function (wrap) {
    var video = wrap.querySelector('video');
    var overlay = wrap.querySelector('.player-overlay');
    var stream = wrap.getAttribute('data-stream');
    var ready = false;
    var hls = null;

    function setup() {
      if (ready || !video || !stream) {
        return;
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    }

    function start() {
      setup();
      hideOverlay();

      if (video) {
        var promise = video.play();

        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      }
    }

    if (overlay) {
      overlay.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });

      video.addEventListener('play', hideOverlay);
      video.addEventListener('ended', function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hls && typeof hls.destroy === 'function') {
        hls.destroy();
      }
    });
  });
})();
