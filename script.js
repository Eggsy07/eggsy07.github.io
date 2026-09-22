(() => {
  const html = document.documentElement;

  /*
   * CONFIGURAÇÃO
   * Substituir pelo ID real da propriedade Google Analytics 4.
   */
  const GA_MEASUREMENT_ID = "G-1LMY5WL1TP";

  /* =========================
     TEMA LIGHT / DARK
  ========================= */

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

    button.textContent = isDark ? "☀️" : "🌙";

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

    button.setAttribute(
      "aria-pressed",
      String(isDark)
    );
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

  /* =========================
     MENU MOBILE
  ========================= */

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
      nav?.classList.remove("open");

      navToggle?.setAttribute(
        "aria-expanded",
        "false"
      );
    });
  });

  /* =========================
     ANO DO RODAPÉ
  ========================= */

  const yearElement = document.querySelector("#year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* =========================
     ANALYTICS E CONSENTIMENTO
  ========================= */

  const CONSENT_KEY = "portfolio-analytics-consent";

  const consentBanner =
    document.querySelector("#consent-banner");

  const acceptButton =
    document.querySelector("#consent-accept");

  const rejectButton =
    document.querySelector("#consent-reject");

  function loadGoogleAnalytics() {
    if (
      !GA_MEASUREMENT_ID ||
      GA_MEASUREMENT_ID === "G-1LMY5WL1TP"
    ) {
      console.warn(
        "Google Analytics não configurado: adicione o ID de medição."
      );

      return;
    }

    if (window.googleAnalyticsLoaded) {
      return;
    }

    window.googleAnalyticsLoaded = true;

    const script = document.createElement("script");

    script.async = true;
    script.src =
      "https://www.googletagmanager.com/gtag/js?id=" +
      encodeURIComponent(GA_MEASUREMENT_ID);

    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];

    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());

    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true
    });
  }

  function hideConsentBanner() {
    if (consentBanner) {
      consentBanner.hidden = true;
    }
  }

  function showConsentBanner() {
    if (consentBanner) {
      consentBanner.hidden = false;
    }
  }

  function saveConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
  }

  function acceptAnalytics() {
    saveConsent("accepted");
    hideConsentBanner();
    loadGoogleAnalytics();
  }

  function rejectAnalytics() {
    saveConsent("rejected");
    hideConsentBanner();
  }

  acceptButton?.addEventListener(
    "click",
    acceptAnalytics
  );

  rejectButton?.addEventListener(
    "click",
    rejectAnalytics
  );

  const storedConsent =
    localStorage.getItem(CONSENT_KEY);

  if (storedConsent === "accepted") {
    loadGoogleAnalytics();
  } else if (!storedConsent) {
    showConsentBanner();
  } else {
    hideConsentBanner();
  }

  /* =========================
     CLIQUES NOS PROJECTOS
  ========================= */

  document
    .querySelectorAll('a[href*="projects/"]')
    .forEach(link => {
      link.addEventListener("click", () => {
        if (typeof window.gtag !== "function") {
          return;
        }

        const projectName =
          link
            .closest(".project-card")
            ?.querySelector("h3")
            ?.textContent
            ?.trim() || "Projecto não identificado";

        window.gtag("event", "project_click", {
          project_name: projectName,
          project_url: link.getAttribute("href")
        });
      });
    });
})();