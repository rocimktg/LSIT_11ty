(() => {
  const autoPlayHero = () => {
    const video = document.querySelector('.hero__video');
    const wrap = video?.closest('.video-wrap');
    if (!video || !wrap) return;

    const desktopQuery = window.matchMedia('(min-width: 768px)');

    const markPlaying = (isPlaying) => {
      if (isPlaying) {
        wrap.classList.add('is-playing');
      } else {
        wrap.classList.remove('is-playing');
      }
    };

    const markReady = () => {
      wrap.classList.add('is-ready');
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
        markPlaying(false);
        return;
      }
      ensureInline();
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => markPlaying(true))
          .catch(() => markPlaying(false));
      }
    };

    const pauseVideo = () => {
      video.pause();
      markPlaying(false);
    };

    markPlaying(false);
    tryPlay();

    video.addEventListener('loadeddata', markReady, { once: true });
    video.addEventListener('canplay', markReady, { once: true });
    video.addEventListener('playing', () => markPlaying(true));
    video.addEventListener('pause', () => markPlaying(false));
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      tryPlay();
    });
    video.addEventListener('error', () => markPlaying(false));
    video.addEventListener('stalled', tryPlay);

    // Pause when offscreen, play when onscreen
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          pauseVideo();
        }
      });
    }, { root: null, threshold: 0.35 });

    observer.observe(video);

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
