(function () {
  "use strict";

  var root = document.querySelector("[data-rankings-root]");
  var status = document.querySelector("[data-rankings-status]");
  if (!root) return;

  var preferenceKey = "mirtype.preferences.v1";
  var languageChangeEvent = "mirtype:languagechange";
  var requestTimeoutMs = 8000;
  var cacheTTL = 60 * 1000;
  var flagAssetVersion = "20260630_2146";
  var flagAssetBase = (function () {
    var script = document.currentScript && document.currentScript.src ? document.currentScript.src : "";
    if (script) {
      return script.replace(/scripts3\/rankings\/[^/]+$/, "assets/flags/");
    }
    var marker = document.querySelector("[data-cdn-version][data-asset-root]");
    if (marker) {
      var version = marker.getAttribute("data-cdn-version") || "";
      var root = String(marker.getAttribute("data-asset-root") || "").replace(/^\/+|\/+$/g, "");
      if (version && root) {
        return "https://cdn.jsdelivr.net/gh/statground/mirtype_CDN@" + version + "/" + root + "/assets/flags/";
      }
    }
    return "https://cdn.jsdelivr.net/gh/statground/mirtype_CDN@7922ddfab66573c49673ca4eb5ae6b6a29279ddd/scripts_go/mirtype_web_20260607_2233/assets/flags/";
  })();
  var loadSequence = 0;
  var memoryCache = {};
  var lastPayload = null;
  var state = {
    period: "weekly",
    uiLanguage: "",
    practiceLanguage: "",
    activityKey: "",
    limit: 50
  };

  var locales = {
    ko: {
      locale: "ko-KR",
      loading: "랭킹을 불러오는 중입니다.",
      slowLoading: "랭킹 집계를 준비하고 있습니다.",
      requestError: "랭킹을 잠시 불러오지 못했습니다.",
      empty: "아직 표시할 기록이 없습니다.",
      period: "기간",
      learnerLanguage: "내 언어",
      practiceLanguage: "연습 언어",
      activity: "활동",
      all: "전체",
      periods: { weekly: "주간", monthly: "월간", yearly: "연간", total: "Total" },
      activities: { course: "언어 코스", practice: "타자연습", game: "타자게임" },
      identity: { member: "회원", guest: "익명" },
      score: "점수",
      sessions: "완료",
      accuracy: "정확도",
      bestCpm: "최고 CPM",
      bestWpm: "최고 WPM",
      time: "시간"
    },
    en: {
      locale: "en-US",
      loading: "Loading rankings.",
      slowLoading: "Preparing ranking totals.",
      requestError: "Rankings could not be loaded for a moment.",
      empty: "No records to rank yet.",
      period: "Period",
      learnerLanguage: "My Language",
      practiceLanguage: "Practice Language",
      activity: "Activity",
      all: "All",
      periods: { weekly: "Weekly", monthly: "Monthly", yearly: "Yearly", total: "Total" },
      activities: { course: "Language Course", practice: "Typing Practice", game: "Typing Games" },
      identity: { member: "Member", guest: "Guest" },
      score: "Score",
      sessions: "Done",
      accuracy: "Accuracy",
      bestCpm: "Best CPM",
      bestWpm: "Best WPM",
      time: "Time"
    },
    ru: {
      locale: "ru-RU",
      loading: "Загружаем рейтинг.",
      slowLoading: "Готовим итоги рейтинга.",
      requestError: "Временно не удалось загрузить рейтинг.",
      empty: "Пока нет записей для рейтинга.",
      period: "Период",
      learnerLanguage: "Мой язык",
      practiceLanguage: "Язык практики",
      activity: "Активность",
      all: "Все",
      periods: { weekly: "Неделя", monthly: "Месяц", yearly: "Год", total: "Всего" },
      activities: { course: "Языковой курс", practice: "Печать", game: "Игры" },
      identity: { member: "Пользователь", guest: "Гость" },
      score: "Очки",
      sessions: "Готово",
      accuracy: "Точность",
      bestCpm: "Макс. CPM",
      bestWpm: "Макс. WPM",
      time: "Время"
    }
  };

  var languageNames = {
    ko: { ko: "한국어", en: "Korean", ru: "Корейский" },
    en: { ko: "영어", en: "English", ru: "Английский" },
    ru: { ko: "러시아어", en: "Russian", ru: "Русский" }
  };

  var flagCountries = { ko: "kr", en: "us", ru: "ru" };

  function normalizeUILanguage(value) {
    var key = String(value || "").trim().toLowerCase();
    if (key.indexOf("-") > 0) key = key.split("-")[0];
    if (key === "en" || key === "ru" || key === "ko") return key;
    return "ko";
  }

  function readPreferences() {
    try {
      if (!window.localStorage) return {};
      return JSON.parse(window.localStorage.getItem(preferenceKey) || "{}") || {};
    } catch (err) {
      return {};
    }
  }

  function currentUILanguage() {
    var prefs = readPreferences();
    return normalizeUILanguage(prefs.uiLanguage || prefs.nativeLanguage || document.documentElement.lang || navigator.language || "ko");
  }

  function copy() {
    return locales[currentUILanguage()] || locales.ko;
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function number(value) {
    var n = Number(value || 0);
    try {
      return new Intl.NumberFormat(copy().locale).format(n);
    } catch (err) {
      return String(n);
    }
  }

  function languageLabel(code) {
    var ui = currentUILanguage();
    var key = String(code || "").trim().toLowerCase();
    return (languageNames[key] && languageNames[key][ui]) || key || copy().all;
  }

  function flagHTML(code) {
    var country = flagCountries[String(code || "").trim().toLowerCase()];
    if (!country) return "";
    return '<img class="ranking-flag" src="' + flagAssetBase + country + "_" + flagAssetVersion + '.svg" alt="" loading="lazy" decoding="async">';
  }

  function formatDuration(seconds) {
    var total = Math.max(0, Number(seconds || 0));
    var hours = Math.floor(total / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    if (hours > 0) return hours + "h " + minutes + "m";
    if (minutes > 0) return minutes + "m";
    return Math.floor(total % 60) + "s";
  }

  function cacheKey() {
    return [state.period, state.uiLanguage, state.practiceLanguage, state.activityKey, state.limit].join("|");
  }

  function setStatus(message, error) {
    if (!status) return;
    status.hidden = false;
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(error));
  }

  function hideStatus() {
    if (status) status.hidden = true;
  }

  function buttonHTML(group, value, label, active, extraHTML) {
    return '<button class="ranking-chip' + (active ? " is-active" : "") + '" type="button" data-ranking-group="' + group + '" data-ranking-value="' + escapeHTML(value) + '">' + (extraHTML || "") + '<span>' + escapeHTML(label) + "</span></button>";
  }

  function controlsHTML() {
    var t = copy();
    var periods = ["weekly", "monthly", "yearly", "total"];
    var languages = ["", "ko", "en", "ru"];
    var activities = ["", "course", "practice", "game"];
    var html = '<section class="ranking-controls" aria-label="Ranking filters">';
    html += '<div class="ranking-filter-row"><strong>' + escapeHTML(t.period) + "</strong>";
    periods.forEach(function (period) {
      html += buttonHTML("period", period, t.periods[period], state.period === period);
    });
    html += "</div>";
    html += '<div class="ranking-filter-row"><strong>' + escapeHTML(t.learnerLanguage) + "</strong>";
    languages.forEach(function (language) {
      html += buttonHTML("uiLanguage", language, language ? languageLabel(language) : t.all, state.uiLanguage === language, flagHTML(language));
    });
    html += "</div>";
    html += '<div class="ranking-filter-row"><strong>' + escapeHTML(t.practiceLanguage) + "</strong>";
    languages.forEach(function (language) {
      html += buttonHTML("practiceLanguage", language, language ? languageLabel(language) : t.all, state.practiceLanguage === language, flagHTML(language));
    });
    html += "</div>";
    html += '<div class="ranking-filter-row"><strong>' + escapeHTML(t.activity) + "</strong>";
    activities.forEach(function (activity) {
      html += buttonHTML("activityKey", activity, activity ? t.activities[activity] : t.all, state.activityKey === activity);
    });
    html += "</div></section>";
    return html;
  }

  function metricHTML(label, value) {
    return '<span class="ranking-metric"><small>' + escapeHTML(label) + '</small><strong>' + escapeHTML(value) + "</strong></span>";
  }

  function rowHTML(item) {
    var t = copy();
    var activity = t.activities[item.activityKey] || item.activityKey || "";
    var identity = t.identity[item.identityType] || item.identityType || "";
    var pair = languageLabel(item.uiLanguage) + " -> " + languageLabel(item.practiceLanguage);
    var metrics = [
      metricHTML(t.score, number(item.totalScore)),
      metricHTML(t.sessions, number(item.sessionCount)),
      metricHTML(t.accuracy, number(item.averageAccuracy) + "%"),
      metricHTML(t.bestCpm, number(item.bestCpm)),
      metricHTML(t.bestWpm, number(item.bestWpm)),
      metricHTML(t.time, formatDuration(item.totalElapsedSeconds))
    ].join("");
    return '<article class="ranking-row">' +
      '<span class="ranking-rank">' + escapeHTML(item.rank || "") + "</span>" +
      '<span class="ranking-main">' +
        '<span class="ranking-badge">' + escapeHTML(identity) + "</span>" +
        "<strong>" + escapeHTML(item.displayName || identity) + "</strong>" +
        "<span>" + escapeHTML(pair + " · " + activity) + "</span>" +
      "</span>" +
      '<span class="ranking-metrics">' + metrics + "</span>" +
    "</article>";
  }

  function listHTML(payload) {
    var t = copy();
    var items = payload && Array.isArray(payload.items) ? payload.items : [];
    if (!items.length) {
      return '<div class="ranking-empty">' + escapeHTML(t.empty) + "</div>";
    }
    return '<section class="ranking-list">' + items.map(rowHTML).join("") + "</section>";
  }

  function render(payload) {
    lastPayload = payload || lastPayload;
    root.innerHTML = controlsHTML() + listHTML(lastPayload);
    bindControls();
  }

  function renderLoadingShell() {
    root.innerHTML = controlsHTML();
    bindControls();
  }

  function bindControls() {
    root.querySelectorAll("[data-ranking-group]").forEach(function (button) {
      button.addEventListener("click", function () {
        var group = button.getAttribute("data-ranking-group") || "";
        if (!Object.prototype.hasOwnProperty.call(state, group)) return;
        state[group] = button.getAttribute("data-ranking-value") || "";
        load();
      });
    });
  }

  function load() {
    var seq = ++loadSequence;
    var key = cacheKey();
    var cached = memoryCache[key];
    if (cached && Date.now() - cached.createdAt < cacheTTL) {
      hideStatus();
      render(cached.payload);
      return;
    }
    renderLoadingShell();
    setStatus(copy().loading, false);
    var controller = new AbortController();
    var timer = window.setTimeout(function () {
      controller.abort();
    }, requestTimeoutMs);
    window.fetch("/rankings/api/summary/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      signal: controller.signal,
      body: JSON.stringify(state)
    }).then(function (response) {
      return response.json();
    }).then(function (payload) {
      if (seq !== loadSequence) return;
      if (!payload || payload.ok !== true || !payload.rankings) {
        throw new Error("ranking_unavailable");
      }
      memoryCache[key] = { createdAt: Date.now(), payload: payload.rankings };
      hideStatus();
      render(payload.rankings);
    }).catch(function () {
      if (seq !== loadSequence) return;
      setStatus(copy().requestError, true);
      render(lastPayload || { items: [] });
    }).finally(function () {
      window.clearTimeout(timer);
    });
  }

  window.addEventListener(languageChangeEvent, function () {
    if (lastPayload) {
      render(lastPayload);
    } else {
      renderLoadingShell();
    }
    if (status && !status.hidden && !status.classList.contains("is-error")) {
      status.textContent = copy().loading;
    }
  });

  load();
})();
