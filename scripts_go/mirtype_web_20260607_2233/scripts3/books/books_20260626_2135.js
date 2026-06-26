(function () {
  "use strict";

  var root = document.querySelector("[data-books-root]");
  var status = document.querySelector("[data-books-status]");
  var form = document.querySelector("[data-books-search-form]");
  var searchInput = document.querySelector("[data-books-search-input]");
  var hiddenLanguage = document.querySelector("[data-books-search-language]");
  var hiddenPurpose = document.querySelector("[data-books-search-purpose]");
  var hiddenYear = document.querySelector("[data-books-search-year]");
  var hiddenSort = document.querySelector("[data-books-search-sort]");
  var pathKeys = { search: true, purpose: true, year: true, sort: true, page: true };
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
    node.href = href || "/books/";
    node.setAttribute("data-books-link", "");
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
    var parts = String(pathname || "/books/").split("/").filter(Boolean);
    if (parts[0] === "books") parts.shift();
    var parsed = { mode: "landing", language: "", isbn: "", purpose: "", year: "", sort: "featured", query: "", page: 1 };
    if (!parts.length) return parsed;
    parsed.language = decodeSegment(parts.shift()).toLowerCase();
    if (parts.length && !pathKeys[parts[0]]) {
      parsed.mode = "detail";
      parsed.isbn = decodeSegment(parts.shift());
      return parsed;
    }
    parsed.mode = "list";
    for (var i = 0; i < parts.length; i += 2) {
      var key = parts[i];
      var value = decodeSegment(parts[i + 1] || "");
      if (key === "search") parsed.query = value;
      if (key === "purpose") parsed.purpose = value;
      if (key === "year") parsed.year = value;
      if (key === "sort") parsed.sort = value || "featured";
      if (key === "page") parsed.page = Math.max(1, parseInt(value, 10) || 1);
    }
    return parsed;
  }

  function buildPath(next) {
    var language = String(next.language || "").trim().toLowerCase();
    if (!language) return "/books/";
    var parts = ["books", language];
    if (next.query) parts.push("search", next.query);
    if (next.purpose) parts.push("purpose", next.purpose);
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
        throw new Error("교재 목록을 불러오는 데 시간이 오래 걸리고 있습니다. 잠시 후 다시 시도해 주세요.");
      }
      throw new Error("교재 목록을 불러오지 못했습니다. 네트워크 상태를 확인해 주세요.");
    });
  }

  function syncForm() {
    if (searchInput) searchInput.value = state.query || "";
    if (hiddenLanguage) hiddenLanguage.value = state.language || "";
    if (hiddenPurpose) hiddenPurpose.value = state.purpose || "";
    if (hiddenYear) hiddenYear.value = state.year || "";
    if (hiddenSort) hiddenSort.value = state.sort || "featured";
  }

  function requestForState() {
    if (state.mode === "detail") {
      return {
        url: "/books/api/detail/",
        payload: { language: state.language, isbn: state.isbn },
        render: renderDetail
      };
    }
    if (state.mode === "list") {
      return {
        url: "/books/api/list/",
        payload: {
          language: state.language,
          purpose: state.purpose,
          year: state.year,
          sort: state.sort,
          query: state.query,
          page: state.page
        },
        render: renderList
      };
    }
    return {
      url: "/books/api/landing/",
      payload: {},
      render: renderLanding
    };
  }

  function cacheKey(request) {
    return "mirtype:books:v2:" + request.url + ":" + JSON.stringify(request.payload || {});
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
      setStatus("교재를 불러오는 중입니다.");
      noticeTimer = window.setTimeout(function () {
        if (loadSequence === sequence) {
          setStatus("교재를 불러오는 데 시간이 조금 걸리고 있습니다.");
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
    setStatus(error && error.message ? error.message : "일시적으로 교재 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.", "error");
  }

  function renderLanding(payload) {
    setStatus("");
    clear(root);
    var books = payload.books || {};
    var languages = books.LanguageFilters || [];
    var groups = books.Groups || [];

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
      body.appendChild(el("small", "", formatCount(language.Count) + "권"));
      card.appendChild(body);
      languageGrid.appendChild(card);
    });
    languageSection.appendChild(languageGrid);
    root.appendChild(languageSection);

    var representative = el("section", "books-language-stack");
    var repHead = el("header", "books-section-head");
    repHead.appendChild(el("p", "", "Highlights"));
    repHead.appendChild(el("h2", "", "언어별 대표 교재"));
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
    head.appendChild(el("span", "", formatCount(group.Count) + "권"));
    section.appendChild(head);
    var grid = el("div", "books-grid books-grid--language");
    (group.Items || []).slice(0, 4).forEach(function (item) {
      grid.appendChild(renderBookCard(item));
    });
    section.appendChild(grid);
    section.appendChild(link("books-more-link", group.MoreURL || group.URL, "더 보기"));
    return section;
  }

  function renderList(payload) {
    setStatus("");
    clear(root);
    var books = payload.books || {};
    var page = books.Page || state.page || 1;
    var total = books.Total || 0;
    state.language = books.LanguageCode || state.language;
    state.purpose = books.PurposeCode || state.purpose;
    state.year = books.YearCode || state.year;
    state.sort = books.SortCode || state.sort || "featured";
    state.query = books.Query || state.query;
    syncForm();

    var intro = el("section", "books-list-intro");
    if (books.LanguageFlagURL) {
      var flag = el("img", "books-language-flag");
      flag.src = books.LanguageFlagURL;
      flag.alt = "";
      flag.loading = "lazy";
      flag.decoding = "async";
      intro.appendChild(flag);
    }
    var title = el("div", "");
    title.appendChild(el("p", "", "Language Books"));
    title.appendChild(el("h2", "", (books.LanguageName || "언어") + " 교재"));
    title.appendChild(el("span", "", formatCount(total) + "권"));
    intro.appendChild(title);
    root.appendChild(intro);

    root.appendChild(renderFilters(books));

    var list = el("div", "books-list");
    var items = books.Items || [];
    if (!items.length) {
      list.appendChild(el("div", "books-empty", "조건에 맞는 교재를 아직 찾지 못했습니다."));
    } else {
      items.forEach(function (item) {
        list.appendChild(renderBookListItem(item));
      });
    }
    root.appendChild(list);
    root.appendChild(renderPagination(books, page));
  }

  function renderFilters(books) {
    var panel = el("nav", "books-filter-panel");
    panel.setAttribute("aria-label", "교재 필터");
    panel.appendChild(renderFilterRow("목적", books.PurposeFilters || [], buildPath(copyState({ purpose: "", page: 1 })), books.PurposeCode));
    panel.appendChild(renderFilterRow("출간연도", books.YearFilters || [], buildPath(copyState({ year: "", page: 1 })), books.YearCode));
    panel.appendChild(renderFilterRow("정렬", books.SortFilters || [], buildPath(copyState({ sort: "featured", page: 1 })), books.SortCode));
    var reset = link("books-filter-reset", buildPath({ language: books.LanguageCode || state.language, sort: "featured", page: 1 }), "필터 해제");
    panel.appendChild(reset);
    return panel;
  }

  function renderFilterRow(label, filters, allURL, activeCode) {
    var row = el("div", "books-filter-row");
    row.appendChild(el("span", "books-filter-label", label));
    var all = link("book-filter-chip" + (!activeCode || activeCode === "featured" ? " is-active" : ""), allURL, "전체");
    row.appendChild(all);
    filters.forEach(function (filter) {
      var chip = link("book-filter-chip" + (filter.Active ? " is-active" : ""), filter.URL, filter.Name || filter.Code);
      if (filter.Count) chip.appendChild(el("small", "", formatCount(filter.Count)));
      row.appendChild(chip);
    });
    return row;
  }

  function renderPagination(books, page) {
    var nav = el("nav", "books-pagination");
    nav.setAttribute("aria-label", "교재 목록 페이지");
    if (books.PrevURL) nav.appendChild(link("site-menu-action", books.PrevURL, "이전"));
    nav.appendChild(el("span", "", String(page || 1)));
    if (books.NextURL) nav.appendChild(link("site-menu-action", books.NextURL, "다음"));
    return nav;
  }

  function renderDetail(payload) {
    setStatus("");
    clear(root);
    var item = payload.book || {};
    var article = el("article", "book-detail");
    article.appendChild(link("books-back-link", item.TargetLanguageCode ? "/books/" + encodeSegment(item.TargetLanguageCode) + "/" : "/books/", "교재 목록"));
    var grid = el("div", "book-detail-grid");
    var cover = el("div", "book-cover");
    if (item.Image) {
      var img = el("img", "");
      img.src = item.Image;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      cover.appendChild(img);
    } else {
      cover.appendChild(el("span", "", "Book"));
    }
    grid.appendChild(cover);
    var body = el("div", "book-detail-body");
    body.appendChild(el("p", "book-source", [item.TargetLanguageName, item.TargetPurposeName].filter(Boolean).join(" · ") || "NAVER Book"));
    body.appendChild(el("h2", "", item.Title || "언어 학습 교재"));
    body.appendChild(el("p", "book-meta", item.AuthorPublisherLine || "NAVER Book"));
    if (item.Description) body.appendChild(el("p", "book-description", item.Description));
    body.appendChild(renderFacts(item));
    body.appendChild(renderMarketplaces(item));
    grid.appendChild(body);
    article.appendChild(grid);
    root.appendChild(article);
  }

  function renderFacts(item) {
    var facts = el("dl", "book-facts");
    addFact(facts, "ISBN", item.ISBN);
    addFact(facts, "출판일", item.Pubdate);
    addFact(facts, "출판사", item.Publisher);
    addFact(facts, "저자", item.Author);
    return facts;
  }

  function addFact(parent, label, value) {
    if (!value) return;
    var row = el("div", "");
    row.appendChild(el("dt", "", label));
    row.appendChild(el("dd", "", value));
    parent.appendChild(row);
  }

  function renderMarketplaces(item) {
    var wrap = el("div", "book-marketplaces");
    wrap.setAttribute("aria-label", "교재 구매처");
    (item.Marketplaces || []).forEach(function (market) {
      var card = el("a", "book-marketplace-card" + (market.Affiliate ? " is-affiliate" : ""));
      card.href = market.URL || "#";
      card.target = "_blank";
      card.rel = market.Rel || "nofollow noopener";
      if (market.Logo) {
        var logo = el("img", "");
        logo.src = market.Logo;
        logo.alt = market.Name || "";
        logo.loading = "lazy";
        logo.decoding = "async";
        card.appendChild(logo);
      }
      card.appendChild(el("strong", "", market.Name || "서점"));
      card.appendChild(el("span", "", "서점에서 보기"));
      wrap.appendChild(card);
    });
    var notice = el("div", "book-marketplace-card book-marketplace-card--notice");
    var noticeImg = el("img", "");
    noticeImg.src = "https://cdn.jsdelivr.net/gh/statground/Statground_CDN/images/common/affiliates/adpick.png";
    noticeImg.alt = "이 글의 홍보링크로 구매하시면 수수료를 제공받습니다.";
    noticeImg.loading = "lazy";
    noticeImg.decoding = "async";
    notice.appendChild(noticeImg);
    wrap.appendChild(notice);
    return wrap;
  }

  function renderBookCard(item) {
    var card = link("book-card", item.DetailURL, "");
    card.appendChild(renderCover(item));
    card.appendChild(renderBookBody(item));
    return card;
  }

  function renderBookListItem(item) {
    var card = link("book-card book-card--list", item.DetailURL, "");
    card.appendChild(renderCover(item));
    card.appendChild(renderBookBody(item));
    return card;
  }

  function renderCover(item) {
    var cover = el("span", "book-card-cover");
    if (item.Image) {
      var img = el("img", "");
      img.src = item.Image;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      cover.appendChild(img);
    } else {
      cover.appendChild(el("span", "", "Book"));
    }
    return cover;
  }

  function renderBookBody(item) {
    var body = el("span", "book-card-body");
    if (item.TargetPurposeName) body.appendChild(el("em", "", item.TargetPurposeName));
    body.appendChild(el("strong", "", item.Title || "언어 학습 교재"));
    body.appendChild(el("span", "", item.AuthorPublisherLine || "NAVER Book"));
    if (item.Pubdate) body.appendChild(el("span", "book-card-date", item.Pubdate));
    if (item.Description) body.appendChild(el("small", "", item.Description));
    return body;
  }

  function copyState(overrides) {
    var next = {
      language: state.language,
      purpose: state.purpose,
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
      var path = buildPath(copyState({ language: language, query: query, page: 1 }));
      navigate(path);
    });
  }

  document.addEventListener("click", function (event) {
    var target = event.target.closest("[data-books-link]");
    if (!target) return;
    var url = new URL(target.href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname.indexOf("/books/") !== 0 || url.pathname.indexOf("/books/affiliate/") === 0) return;
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
