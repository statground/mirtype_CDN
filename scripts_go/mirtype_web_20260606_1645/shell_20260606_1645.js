(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
      return;
    }
    fn();
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function closeMobileMenu() {
    var menu = qs("#siteMobileMenu");
    var toggle = qs("[data-mobile-menu-toggle]");
    if (!menu) {
      return;
    }
    menu.classList.remove("is-open");
    document.body.classList.remove("mirtype-menu-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  function openMobileMenu() {
    var menu = qs("#siteMobileMenu");
    var toggle = qs("[data-mobile-menu-toggle]");
    if (!menu) {
      return;
    }
    menu.classList.add("is-open");
    document.body.classList.add("mirtype-menu-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
    }
  }

  function clickPracticeMode(mode) {
    var target = qs('.mode-tab[data-mode="' + mode + '"]');
    if (target) {
      target.click();
    }
    var surface = qs("#practiceSurface");
    if (surface && surface.scrollIntoView) {
      surface.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    closeMobileMenu();
  }

  function clickLanguage(language) {
    var target = qs('.segmented-button[data-language="' + language + '"]');
    if (target) {
      target.click();
    }
    closeMobileMenu();
  }

  function syncActiveButtons() {
    var activeMode = qs(".mode-tab.is-active");
    var activeLanguage = qs('.segmented-button[data-language].is-active');
    var mode = activeMode ? activeMode.getAttribute("data-mode") : "";
    var language = activeLanguage ? activeLanguage.getAttribute("data-language") : "";

    qsa("[data-menu-mode]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-menu-mode") === mode);
    });
    qsa("[data-menu-language]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-menu-language") === language);
    });
  }

  ready(function () {
    var toggle = qs("[data-mobile-menu-toggle]");
    var close = qs("[data-mobile-menu-close]");
    var menu = qs("#siteMobileMenu");

    if (toggle) {
      toggle.addEventListener("click", function () {
        if (menu && menu.classList.contains("is-open")) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }

    if (close) {
      close.addEventListener("click", closeMobileMenu);
    }

    if (menu) {
      menu.addEventListener("click", function (event) {
        if (event.target === menu || event.target.hasAttribute("data-mobile-menu-backdrop")) {
          closeMobileMenu();
        }
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    qsa("[data-menu-mode]").forEach(function (button) {
      button.addEventListener("click", function () {
        clickPracticeMode(button.getAttribute("data-menu-mode"));
        setTimeout(syncActiveButtons, 0);
      });
    });

    qsa("[data-menu-language]").forEach(function (button) {
      button.addEventListener("click", function () {
        clickLanguage(button.getAttribute("data-menu-language"));
        setTimeout(syncActiveButtons, 0);
      });
    });

    qsa(".site-mobile-menu a").forEach(function (link) {
      link.addEventListener("click", closeMobileMenu);
    });

    document.addEventListener("click", function (event) {
      if (event.target.closest("[data-mode], [data-language]")) {
        setTimeout(syncActiveButtons, 0);
      }
    });

    syncActiveButtons();
  });
})();
