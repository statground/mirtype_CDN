(function () {
  "use strict";

  if (!window.MirtypeContentAPI || typeof window.MirtypeContentAPI.fetchCourse !== "function") {
    return;
  }

  function dispatchCourseContentReady(payload) {
    var detail = {
      bundles: !!(payload && payload.bundles),
      lexicon: !!(payload && payload.lexicon)
    };
    try {
      window.dispatchEvent(new CustomEvent("mirtype:coursecontentready", { detail: detail }));
    } catch (error) {
      window.dispatchEvent(new Event("mirtype:coursecontentready"));
    }
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
    dispatchCourseContentReady(payload);
  }).catch(function () {
    window.MirtypeCourseBundles = window.MirtypeCourseBundles || null;
  });
})();
