const setupAccordion = (accordion) => {
  if (accordion.dataset.init === "true") return;

  const items = Array.from(accordion.querySelectorAll(".accordion__item"));

  items.forEach((item) => {
    const button = item.querySelector(".accordion__button");
    const panel = item.querySelector(".accordion__panel");
    if (!button || !panel) return;

    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      items.forEach((node) => {
        const nodeButton = node.querySelector(".accordion__button");
        const nodePanel = node.querySelector(".accordion__panel");
        if (!nodeButton || !nodePanel) return;
        nodeButton.setAttribute("aria-expanded", "false");
        nodePanel.style.display = "none";
      });

      if (!isExpanded) {
        button.setAttribute("aria-expanded", "true");
        panel.style.display = "block";
      }
    });
  });

  accordion.dataset.init = "true";
};

const initAccordion = () => {
  document.querySelectorAll(".accordion").forEach(setupAccordion);
};

export default initAccordion;
