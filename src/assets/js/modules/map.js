const initLazyMap = () => {
  const iframe = document.querySelector(".contact-map__frame iframe[data-src]");
  if (!iframe) return;

  const activateMap = () => {
    iframe.src = iframe.dataset.src;
    iframe.removeAttribute("data-src");
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          activateMap();
          observer.disconnect();
        }
      },
      { rootMargin: "50px" }
    );
    observer.observe(iframe);
  } else {
    activateMap();
  }
};

export default initLazyMap;
