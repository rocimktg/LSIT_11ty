const activatePill = (pill, pills) => {
  pills.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");
  });

  if (pill) {
    pill.classList.add("active");
    pill.setAttribute("aria-current", "true");
  }
};

const setupScrollSpy = (nav) => {
  const pills = Array.from(nav.querySelectorAll(".pill[href^='#']"));
  if (!pills.length) return;

  const sections = pills
    .map((pill) => {
      const id = pill.getAttribute("href").replace("#", "");
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (!sections.length) return;

  const hero = document.querySelector(".page-hero");
  const defaultPill = pills[0];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (hero && entry.target === hero) {
          activatePill(defaultPill, pills);
          return;
        }
        const pill = pills.find((link) => link.getAttribute("href") === `#${entry.target.id}`);
        if (pill) {
          activatePill(pill, pills);
        }
      });
    },
    { rootMargin: "-15% 0px -60% 0px", threshold: 0.1 }
  );

  sections.forEach((section) => observer.observe(section));
  if (hero) observer.observe(hero);

  pills.forEach((pill) =>
    pill.addEventListener("click", () => {
      pill.blur();
    })
  );
};

const initScrollSpy = () => {
  document.querySelectorAll(".loc-subnav").forEach(setupScrollSpy);
};

export default initScrollSpy;
