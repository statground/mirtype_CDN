(function () {
  "use strict";

  if (!window.MirtypeContentAPI || typeof window.MirtypeContentAPI.fetchCourse !== "function") {
    return;
  }

  window.MirtypeContentAPI.fetchCourse().then(function (payload) {
    if (!payload || !payload.bundles) {
      return;
    }
    window.MirtypeCourseBundles = payload.bundles;
    window.MirtypeCourseLexicon = payload.lexicon || {};
    if (window.MirtypeShellLocale && typeof window.MirtypeShellLocale.apply === "function") {
      window.MirtypeShellLocale.apply();
    }
  }).catch(function () {
    window.MirtypeCourseBundles = window.MirtypeCourseBundles || null;
  });
})();
