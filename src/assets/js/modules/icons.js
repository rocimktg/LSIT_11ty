const initIcons = () => {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  } else {
    document.addEventListener(
      "lucide:ready",
      () => {
        if (window.lucide?.createIcons) {
          window.lucide.createIcons();
        }
      },
      { once: true }
    );
  }
};

export default initIcons;
