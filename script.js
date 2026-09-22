(() => {
  const html = document.documentElement;

  const savedTheme = localStorage.getItem("portfolio-theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const initialTheme =
    savedTheme || (systemPrefersDark ? "dark" : "light");

  html.setAttribute("data-theme", initialTheme);

  function getThemeButton() {
    return document.querySelector(".theme-toggle");
  }

  function updateThemeButton() {
    const button = getThemeButton();

    if (!button) return;

    const currentTheme =
      html.getAttribute("data-theme") || "light";

    const isDark = currentTheme === "dark";

    button.innerHTML = isDark ? "☀️" : "🌙";

    button.setAttribute(
      "aria-label",
      isDark
        ? "Mudar para Light Mode"
        : "Mudar para Dark Mode"
    );

    button.setAttribute(
      "title",
      isDark
        ? "Mudar para Light Mode"
        : "Mudar para Dark Mode"
    );

    button.setAttribute("aria-pressed", String(isDark));
  }

  function createThemeButton() {
    const navContainer = document.querySelector(".nav");

    if (!navContainer || getThemeButton()) {
      updateThemeButton();
      return;
    }

    const button = document.createElement("button");

    button.type = "button";
    button.className = "theme-toggle";
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
      const currentTheme =
        html.getAttribute("data-theme") || "light";

      const nextTheme =
        currentTheme === "dark" ? "light" : "dark";

      html.setAttribute("data-theme", nextTheme);
      localStorage.setItem("portfolio-theme", nextTheme);

      updateThemeButton();
    });

    const navToggle = navContainer.querySelector(".nav-toggle");

    if (navToggle) {
      navContainer.insertBefore(button, navToggle);
    } else {
      navContainer.appendChild(button);
    }

    updateThemeButton();
  }

  createThemeButton();

  /* MENU MOBILE */

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#main-nav");

  navToggle?.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");

    navToggle.setAttribute(
      "aria-expanded",
      String(opened)
    );
  });

  document.querySelectorAll("#main-nav a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");

      navToggle?.setAttribute(
        "aria-expanded",
        "false"
      );
    });
  });

  document.querySelectorAll('a[href^="projects/"]').forEach(link => {
  link.addEventListener("click", () => {
    if (typeof gtag === "function") {
      gtag("event", "project_click", {
        project_url: link.getAttribute("href"),
        project_name: link.closest(".project-card")
          ?.querySelector("h3")
          ?.textContent
          .trim() || "Projecto não identificado"
      });
    }
  });
});

  /* ANO DO RODAPÉ */

  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();