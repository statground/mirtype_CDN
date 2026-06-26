(function () {
  "use strict";

  var root = document.querySelector("[data-lectures-root]");
  var status = document.querySelector("[data-lectures-status]");
  var form = document.querySelector("[data-lectures-search-form]");
  var searchInput = document.querySelector("[data-lectures-search-input]");
  var hiddenLanguage = document.querySelector("[data-lectures-search-language]");
  var hiddenPurpose = document.querySelector("[data-lectures-search-purpose]");
  var hiddenLevel = document.querySelector("[data-lectures-search-level]");
  var hiddenYear = document.querySelector("[data-lectures-search-year]");
  var hiddenSort = document.querySelector("[data-lectures-search-sort]");
  var pathKeys = { search: true, purpose: true, level: true, year: true, sort: true, page: true };
  var state = parsePath(window.location.pathname);
  var requestTimeoutMs = 10000;
  var loadingNoticeMs = 4200;
  var cacheTTL = 24 * 60 * 60 * 1000;
  var loadSequence = 0;

  if (!root) return;

  function setStatus(message, kind) {
    if (!status) return;
    status.textContent = message || "";
    status.hidden = !message;
    status.classList.toggle("is-error", kind === "error");
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function link(className, href, text) {
    var node = el("a", className, text);
    node.href = href || "/lectures/";
    node.setAttribute("data-lectures-link", "");
    return node;
  }

  function decodeSegment(value) {
    try {
      return decodeURIComponent(String(value || ""));
    } catch (err) {
      return "";
    }
  }

  function encodeSegment(value) {
    return encodeURIComponent(String(value || "").trim()).replace(/%2F/gi, "");
  }

  function parsePath(pathname) {
    var parts = String(pathname || "/lectures/").split("/").filter(Boolean);
    if (parts[0] === "lectures") parts.shift();
    var parsed = { mode: "landing", language: "", courseID: 0, purpose: "", level: "", year: "", sort: "featured", query: "", page: 1 };
    if (!parts.length) return parsed;
    parsed.language = decodeSegment(parts.shift()).toLowerCase();
    if (parts.length && !pathKeys[parts[0]]) {
      parsed.mode = "detail";
      parsed.courseID = Math.max(0, parseInt(decodeSegment(parts.shift()), 10) || 0);
      return parsed;
    }
    parsed.mode = "list";
    for (var i = 0; i < parts.length; i += 2) {
      var key = parts[i];
      var value = decodeSegment(parts[i + 1] || "");
      if (key === "search") parsed.query = value;
      if (key === "purpose") parsed.purpose = value;
      if (key === "level") parsed.level = value;
      if (key === "year") parsed.year = value;
      if (key === "sort") parsed.sort = value || "featured";
      if (key === "page") parsed.page = Math.max(1, parseInt(value, 10) || 1);
    }
    return parsed;
  }

  function buildPath(next) {
    var language = String(next.language || "").trim().toLowerCase();
    if (!language) return "/lectures/";
    var parts = ["lectures", language];
    if (next.query) parts.push("search", next.query);
    if (next.purpose) parts.push("purpose", next.purpose);
    if (next.level) parts.push("level", next.level);
    if (next.year) parts.push("year", next.year);
    if (next.sort && next.sort !== "featured") parts.push("sort", next.sort);
    if (next.page && next.page > 1) parts.push("page", String(next.page));
    return "/" + parts.map(encodeSegment).join("/") + "/";
  }

  function postJSON(url, payload) {
    var controller = window.AbortController ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () {
      controller.abort();
    }, requestTimeoutMs) : null;
    var options = {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {})
    };
    if (controller) options.signal = controller.signal;
    return fetch(url, options).then(function (response) {
      if (timer) window.clearTimeout(timer);
      return response.json().catch(function () {
        return { ok: false, message: "요청을 처리하지 못했습니다." };
      }).then(function (data) {
        if (!response.ok || data.ok === false) {
          throw new Error(data.message || "요청을 처리하지 못했습니다.");
        }
        return data;
      });
    }, function (error) {
      if (timer) window.clearTimeout(timer);
      if (error && error.name === "AbortError") {
        throw new Error("강의 목록을 불러오는 데 시간이 오래 걸리고 있습니다. 잠시 후 다시 시도해 주세요.");
      }
      throw new Error("강의 목록을 불러오지 못했습니다. 네트워크 상태를 확인해 주세요.");
    });
  }

  function syncForm() {
    if (searchInput) searchInput.value = state.query || "";
    if (hiddenLanguage) hiddenLanguage.value = state.language || "";
    if (hiddenPurpose) hiddenPurpose.value = state.purpose || "";
    if (hiddenLevel) hiddenLevel.value = state.level || "";
    if (hiddenYear) hiddenYear.value = state.year || "";
    if (hiddenSort) hiddenSort.value = state.sort || "featured";
  }

  function requestForState() {
    if (state.mode === "detail") {
      return {
        url: "/lectures/api/detail/",
        payload: { language: state.language, course_id: state.courseID },
        render: renderDetail
      };
    }
    if (state.mode === "list") {
      return {
        url: "/lectures/api/list/",
        payload: {
          language: state.language,
          purpose: state.purpose,
          level: state.level,
          year: state.year,
          sort: state.sort,
          query: state.query,
          page: state.page
        },
        render: renderList
      };
    }
    return {
      url: "/lectures/api/landing/",
      payload: {},
      render: renderLanding
    };
  }

  function cacheKey(request) {
    return "mirtype:lectures:v1:" + request.url + ":" + JSON.stringify(request.payload || {});
  }

  function readCachedPayload(key) {
    try {
      if (!window.localStorage) return null;
      var raw = window.localStorage.getItem(key);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.payload || !parsed.createdAt) return null;
      if (Date.now() - Number(parsed.createdAt) > cacheTTL) return null;
      return parsed.payload;
    } catch (err) {
      return null;
    }
  }

  function writeCachedPayload(key, payload) {
    try {
      if (!window.localStorage || !payload || payload.ok === false) return;
      window.localStorage.setItem(key, JSON.stringify({ createdAt: Date.now(), payload: payload }));
    } catch (err) {
      // Storage can be unavailable in private or locked-down browser modes.
    }
  }

  function load() {
    var sequence = loadSequence + 1;
    loadSequence = sequence;
    state = parsePath(window.location.pathname);
    syncForm();
    clear(root);
    var request = requestForState();
    var key = cacheKey(request);
    var cached = readCachedPayload(key);
    var noticeTimer = null;
    if (cached) {
      request.render(cached);
    } else {
      setStatus("강의를 불러오는 중입니다.");
      noticeTimer = window.setTimeout(function () {
        if (loadSequence === sequence) {
          setStatus("강의를 불러오는 데 시간이 조금 걸리고 있습니다.");
        }
      }, loadingNoticeMs);
    }
    return postJSON(request.url, request.payload).then(function (payload) {
      if (noticeTimer) window.clearTimeout(noticeTimer);
      if (loadSequence !== sequence) return;
      writeCachedPayload(key, payload);
      request.render(payload);
    }).catch(function (error) {
      if (noticeTimer) window.clearTimeout(noticeTimer);
      if (loadSequence !== sequence) return;
      if (cached) {
        setStatus("");
        return;
      }
      renderError(error);
    });
  }

  function navigate(path) {
    if (!path || path === window.location.pathname) return;
    history.pushState({}, "", path);
    load();
  }

  function renderError(error) {
    clear(root);
    setStatus(error && error.message ? error.message : "일시적으로 강의 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.", "error");
  }

  function renderLanding(payload) {
    setStatus("");
    clear(root);
    var lectures = payload.lectures || {};
    var languages = lectures.LanguageFilters || [];
    var groups = lectures.Groups || [];

    var languageSection = el("section", "books-featured-languages");
    var languageHead = el("header", "books-section-head");
    languageHead.appendChild(el("p", "", "Languages"));
    languageHead.appendChild(el("h2", "", "주요 언어"));
    languageSection.appendChild(languageHead);
    var languageGrid = el("div", "books-language-cards");
    languages.forEach(function (language) {
      var card = link("books-language-card", language.URL, "");
      if (language.FlagURL) {
        var flag = el("img", "books-language-flag");
        flag.src = language.FlagURL;
        flag.alt = "";
        flag.loading = "lazy";
        flag.decoding = "async";
        card.appendChild(flag);
      }
      var body = el("span", "books-language-card-body");
      body.appendChild(el("strong", "", language.Name || language.Code));
      body.appendChild(el("small", "", formatCount(language.Count) + "개 강의"));
      card.appendChild(body);
      languageGrid.appendChild(card);
    });
    languageSection.appendChild(languageGrid);
    root.appendChild(languageSection);

    var representative = el("section", "books-language-stack");
    var repHead = el("header", "books-section-head");
    repHead.appendChild(el("p", "", "Highlights"));
    repHead.appendChild(el("h2", "", "언어별 대표 강의"));
    representative.appendChild(repHead);
    groups.forEach(function (group) {
      representative.appendChild(renderLanguagePreview(group));
    });
    root.appendChild(representative);
  }

  function renderLanguagePreview(group) {
    var section = el("section", "book-language-section");
    var head = el("header", "book-language-head");
    var title = el("div", "book-language-title");
    if (group.FlagURL) {
      var flag = el("img", "books-language-flag");
      flag.src = group.FlagURL;
      flag.alt = "";
      flag.loading = "lazy";
      flag.decoding = "async";
      title.appendChild(flag);
    }
    var titleText = el("span", "");
    titleText.appendChild(el("p", "", "Language"));
    titleText.appendChild(el("h2", "", group.Name || group.Code));
    title.appendChild(titleText);
    head.appendChild(title);
    head.appendChild(el("span", "", formatCount(group.Count) + "개 강의"));
    section.appendChild(head);
    var grid = el("div", "books-grid books-grid--language");
    (group.Items || []).slice(0, 4).forEach(function (item) {
      grid.appendChild(renderLectureCard(item));
    });
    section.appendChild(grid);
    section.appendChild(link("books-more-link", group.MoreURL || group.URL, "더 보기"));
    return section;
  }

  function renderList(payload) {
    setStatus("");
    clear(root);
    var lectures = payload.lectures || {};
    var page = lectures.Page || state.page || 1;
    var total = lectures.Total || 0;
    state.language = lectures.LanguageCode || state.language;
    state.purpose = lectures.PurposeCode || state.purpose;
    state.level = lectures.LevelCode || state.level;
    state.year = lectures.YearCode || state.year;
    state.sort = lectures.SortCode || state.sort || "featured";
    state.query = lectures.Query || state.query;
    syncForm();

    var intro = el("section", "books-list-intro");
    if (lectures.LanguageFlagURL) {
      var flag = el("img", "books-language-flag");
      flag.src = lectures.LanguageFlagURL;
      flag.alt = "";
      flag.loading = "lazy";
      flag.decoding = "async";
      intro.appendChild(flag);
    }
    var title = el("div", "");
    title.appendChild(el("p", "", "Language Lectures"));
    title.appendChild(el("h2", "", (lectures.LanguageName || "언어") + " 강의"));
    title.appendChild(el("span", "", formatCount(total) + "개 강의"));
    intro.appendChild(title);
    root.appendChild(intro);

    root.appendChild(renderFilters(lectures));

    var list = el("div", "books-list");
    var items = lectures.Items || [];
    if (!items.length) {
      list.appendChild(el("div", "books-empty", "조건에 맞는 강의를 아직 찾지 못했습니다."));
    } else {
      items.forEach(function (item) {
        list.appendChild(renderLectureListItem(item));
      });
    }
    root.appendChild(list);
    root.appendChild(renderPagination(lectures, page));
  }

  function renderFilters(lectures) {
    var panel = el("nav", "books-filter-panel");
    panel.setAttribute("aria-label", "강의 필터");
    panel.appendChild(renderFilterRow("목적", lectures.PurposeFilters || [], buildPath(copyState({ purpose: "", page: 1 })), lectures.PurposeCode));
    panel.appendChild(renderFilterRow("난이도", lectures.LevelFilters || [], buildPath(copyState({ level: "", page: 1 })), lectures.LevelCode));
    panel.appendChild(renderFilterRow("출시연도", lectures.YearFilters || [], buildPath(copyState({ year: "", page: 1 })), lectures.YearCode));
    panel.appendChild(renderFilterRow("정렬", lectures.SortFilters || [], buildPath(copyState({ sort: "featured", page: 1 })), lectures.SortCode));
    panel.appendChild(link("books-filter-reset", buildPath({ language: lectures.LanguageCode || state.language, sort: "featured", page: 1 }), "필터 해제"));
    return panel;
  }

  function renderFilterRow(label, filters, allURL, activeCode) {
    var row = el("div", "books-filter-row");
    row.appendChild(el("span", "books-filter-label", label));
    row.appendChild(link("book-filter-chip" + (!activeCode || activeCode === "featured" ? " is-active" : ""), allURL, "전체"));
    filters.forEach(function (filter) {
      var chip = link("book-filter-chip" + (filter.Active ? " is-active" : ""), filter.URL, filter.Name || filter.Code);
      if (filter.Count) chip.appendChild(el("small", "", formatCount(filter.Count)));
      row.appendChild(chip);
    });
    return row;
  }

  function renderPagination(lectures, page) {
    var nav = el("nav", "books-pagination");
    nav.setAttribute("aria-label", "강의 목록 페이지");
    if (lectures.PrevURL) nav.appendChild(link("site-menu-action", lectures.PrevURL, "이전"));
    nav.appendChild(el("span", "", String(page || 1)));
    if (lectures.NextURL) nav.appendChild(link("site-menu-action", lectures.NextURL, "다음"));
    return nav;
  }

  function renderDetail(payload) {
    setStatus("");
    clear(root);
    var item = payload.lecture || {};
    var article = el("article", "book-detail lecture-detail");
    article.appendChild(link("books-back-link", item.TargetLanguageCode ? "/lectures/" + encodeSegment(item.TargetLanguageCode) + "/" : "/lectures/", "강의 목록"));
    var grid = el("div", "book-detail-grid");
    var cover = el("div", "book-cover");
    if (item.ThumbnailURL) {
      var img = el("img", "");
      img.src = item.ThumbnailURL;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      cover.appendChild(img);
    } else {
      cover.appendChild(el("span", "", "Lecture"));
    }
    grid.appendChild(cover);
    var body = el("div", "book-detail-body");
    body.appendChild(el("p", "book-source", [item.TargetLanguageName, item.TargetPurposeName].filter(Boolean).join(" · ") || "Inflearn"));
    body.appendChild(el("h2", "", item.Title || "언어 학습 강의"));
    body.appendChild(el("p", "book-meta", item.ProviderSummaryLine || "Inflearn"));
    if (item.Description) body.appendChild(el("p", "book-description", item.Description));
    body.appendChild(renderFacts(item));
    if (item.CourseURL) {
      var cta = el("a", "site-menu-action is-active");
      cta.href = item.CourseURL;
      cta.target = "_blank";
      cta.rel = "nofollow noopener";
      cta.textContent = "Inflearn에서 보기";
      body.appendChild(cta);
    }
    grid.appendChild(body);
    article.appendChild(grid);
    root.appendChild(article);
  }

  function renderFacts(item) {
    var facts = el("dl", "book-facts");
    addFact(facts, "수강생", item.StudentCount ? formatCount(item.StudentCount) + "명" : "");
    addFact(facts, "평점", item.AverageStar ? Number(item.AverageStar).toFixed(1) : "");
    addFact(facts, "강의 수", item.LectureUnitCount ? formatCount(item.LectureUnitCount) + "강" : "");
    addFact(facts, "러닝타임", item.RuntimeSummary);
    addFact(facts, "출시일", item.PublishedDate);
    addFact(facts, "업데이트", item.LastUpdatedDate);
    addFact(facts, "분야", [item.CategoryMainTitle, item.CategorySubTitle].filter(Boolean).join(" · "));
    return facts;
  }

  function addFact(parent, label, value) {
    if (!value) return;
    var row = el("div", "");
    row.appendChild(el("dt", "", label));
    row.appendChild(el("dd", "", value));
    parent.appendChild(row);
  }

  function renderLectureCard(item) {
    var card = link("book-card", item.DetailURL, "");
    card.appendChild(renderCover(item));
    card.appendChild(renderLectureBody(item));
    return card;
  }

  function renderLectureListItem(item) {
    var card = link("book-card book-card--list", item.DetailURL, "");
    card.appendChild(renderCover(item));
    card.appendChild(renderLectureBody(item));
    return card;
  }

  function renderCover(item) {
    var cover = el("span", "book-card-cover");
    if (item.ThumbnailURL) {
      var img = el("img", "");
      img.src = item.ThumbnailURL;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      cover.appendChild(img);
    } else {
      cover.appendChild(el("span", "", "Lecture"));
    }
    return cover;
  }

  function renderLectureBody(item) {
    var body = el("span", "book-card-body");
    if (item.TargetPurposeName) body.appendChild(el("em", "", item.TargetPurposeName));
    body.appendChild(el("strong", "", item.Title || "언어 학습 강의"));
    body.appendChild(el("span", "", item.ProviderSummaryLine || "Inflearn"));
    var stats = [];
    if (item.StudentCount) stats.push(formatCount(item.StudentCount) + "명");
    if (item.AverageStar) stats.push("평점 " + Number(item.AverageStar).toFixed(1));
    if (item.RuntimeSummary) stats.push(item.RuntimeSummary);
    if (stats.length) body.appendChild(el("span", "book-card-date", stats.join(" · ")));
    if (item.Description) body.appendChild(el("small", "", item.Description));
    return body;
  }

  function copyState(overrides) {
    var next = {
      language: state.language,
      purpose: state.purpose,
      level: state.level,
      year: state.year,
      sort: state.sort || "featured",
      query: state.query,
      page: state.page || 1
    };
    Object.keys(overrides || {}).forEach(function (key) {
      next[key] = overrides[key];
    });
    return next;
  }

  function formatCount(value) {
    var n = Number(value || 0);
    if (!Number.isFinite(n)) return "0";
    return n.toLocaleString("ko-KR");
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var query = searchInput ? searchInput.value.trim() : "";
      var language = state.language || "all";
      navigate(buildPath(copyState({ language: language, query: query, page: 1 })));
    });
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-lectures-link]");
    if (!target) return;
    var url = new URL(target.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname.indexOf("/lectures/") !== 0) return;
    event.preventDefault();
    navigate(url.pathname);
  });

  window.addEventListener("popstate", load);
  try {
    load();
  } catch (error) {
    renderError(error);
  }
})();
