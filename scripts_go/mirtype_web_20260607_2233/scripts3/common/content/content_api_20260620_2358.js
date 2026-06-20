(function () {
  "use strict";

  var root = window.MirtypeContentAPI || {};

  function fetchJSON(url) {
    return fetch(url, {
      credentials: "same-origin",
      headers: { Accept: "application/json" }
    }).then(function (response) {
      if (!response.ok) {
        throw new Error("content request failed");
      }
      return response.json();
    });
  }

  root.fetchPractice = function () {
    if (!root.practicePromise) {
      root.practicePromise = fetchJSON("/api/content/practice/");
    }
    return root.practicePromise;
  };

  root.fetchCourse = function () {
    if (!root.coursePromise) {
      root.coursePromise = fetchJSON("/api/content/course/");
    }
    return root.coursePromise;
  };

  window.MirtypeContentAPI = root;
})();
