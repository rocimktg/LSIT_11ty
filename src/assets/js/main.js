import initNavigation from "./modules/navigation.js";
import initTenets from "./modules/tenets.js";
import autoplayHeroVideo from "./modules/hero-video.js";
import initForms from "./modules/forms.js";
import initLazyMap from "./modules/map.js";
import initIcons from "./modules/icons.js";
import initAccordion from "./modules/accordion.js";
import initScrollSpy from "./modules/scrollspy.js";

const init = () => {
  initNavigation();
  autoplayHeroVideo();
  initForms();
  initLazyMap();
  initTenets();
  initIcons();
  initAccordion();
  initScrollSpy();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
