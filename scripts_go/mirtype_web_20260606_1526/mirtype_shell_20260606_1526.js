(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
      return;
    }
    fn();
  }

  ready(function () {
    var root = document.querySelector("[data-mirtype-shell]");
    if (!root) {
      return;
    }

    root.dataset.jsReady = "1";

    var health = document.querySelector("[data-mirtype-health]");
    if (!health) {
      return;
    }

    fetch("/healthz", {
      method: "GET",
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("health check failed");
        }
        return response.json();
      })
      .then(function (payload) {
        health.textContent = payload && payload.ok ? "ready" : "checking";
      })
      .catch(function () {
        health.textContent = "checking";
      });
  });
})();
