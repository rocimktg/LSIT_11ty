(() => {
  const autoPlayHero = () => {
    const video = document.querySelector('.hero__video');
    const wrap = video?.closest('.video-wrap');
    if (!video || !wrap) return;

    const desktopQuery = window.matchMedia('(min-width: 768px)');
    const source = video.querySelector('source');

    const loadSource = () => {
      if (source?.dataset.src) {
        source.src = source.dataset.src;
      }
      video.load();
    };

    const unloadSource = () => {
      if (source) {
        source.removeAttribute('src');
      }
      video.load();
    };

    const markPlaying = (isPlaying) => {
      if (isPlaying) {
        wrap.classList.add('is-playing');
      } else {
        wrap.classList.remove('is-playing');
      }
    };

    const ensureInline = () => {
      video.muted = true;
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.removeAttribute('controls');
    };

    const tryPlay = () => {
      if (!desktopQuery.matches) {
        unloadSource();
        markPlaying(false);
        return;
      }
      loadSource();
      ensureInline();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => markPlaying(true))
          .catch(() => markPlaying(false));
      }
    };

    const resetToPoster = () => {
      markPlaying(false);
      video.setAttribute('poster', 'img/fallback.jpg');
    };

    markPlaying(false);
    tryPlay();

    video.addEventListener('playing', () => markPlaying(true));
    video.addEventListener('pause', () => markPlaying(false));
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      tryPlay();
    });
    video.addEventListener('error', resetToPoster);
    video.addEventListener('stalled', tryPlay);

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        tryPlay();
      } else {
        markPlaying(false);
      }
    });

    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', tryPlay);
    } else if (typeof desktopQuery.addListener === 'function') {
      desktopQuery.addListener(tryPlay);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoPlayHero);
  } else {
    autoPlayHero();
  }
})();
