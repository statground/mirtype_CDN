(function () {
  "use strict";

  if (!window.MirtypeContentAPI || typeof window.MirtypeContentAPI.fetchPractice !== "function") {
    return;
  }

  window.MirtypeContentAPI.fetchPractice().then(function (payload) {
    if (!payload || !payload.languages) {
      return;
    }
    window.MirtypePracticeContent = payload.languages;
    if (window.MirtypePracticeApp && typeof window.MirtypePracticeApp.applyContent === "function") {
      window.MirtypePracticeApp.applyContent(payload.languages);
    }
  }).catch(function () {
    window.MirtypePracticeContent = window.MirtypePracticeContent || null;
  });
})();
