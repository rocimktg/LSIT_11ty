const ensureInlinePlayback = (video) => {
  video.muted = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.removeAttribute("controls");
};

const autoplayHeroVideo = () => {
  const video = document.querySelector(".hero__video");
  const wrap = video?.closest(".video-wrap");
  if (!video || !wrap) return;

  const markPlaying = (isPlaying) => {
    wrap.classList.toggle("is-playing", Boolean(isPlaying));
  };

  const tryPlay = () => {
    ensureInlinePlayback(video);
    const playPromise = video.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => markPlaying(true))
        .catch(() => markPlaying(false));
    }
  };

  const resetToPoster = () => {
    markPlaying(false);
    video.setAttribute("poster", "/assets/img/fallback.jpg");
  };

  markPlaying(false);
  tryPlay();

  video.addEventListener("playing", () => markPlaying(true));
  video.addEventListener("pause", () => markPlaying(false));
  video.addEventListener("ended", () => {
    video.currentTime = 0;
    tryPlay();
  });
  video.addEventListener("error", resetToPoster);
  video.addEventListener("stalled", tryPlay);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      tryPlay();
    } else {
      markPlaying(false);
    }
  });
};

export default autoplayHeroVideo;
