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
  var preferenceKey = "mirtype.preferences.v1";
  var languageChangeEvent = "mirtype:languagechange";
  var lastPayload = null;
  var lastRenderer = null;

  var locales = {
    ko: {
      locale: "ko-KR",
      loading: "교재를 불러오는 중입니다.",
      slowLoading: "교재를 불러오는 데 시간이 조금 걸리고 있습니다.",
      requestError: "요청을 처리하지 못했습니다.",
      timeoutError: "교재 목록을 불러오는 데 시간이 오래 걸리고 있습니다. 잠시 후 다시 시도해 주세요.",
      networkError: "교재 목록을 불러오지 못했습니다. 네트워크 상태를 확인해 주세요.",
      fallbackError: "일시적으로 교재 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
      languages: "Languages",
      majorLanguages: "주요 언어",
      highlights: "Highlights",
      representative: "언어별 대표 교재",
      language: "Language",
      bookUnit: "권",
      listKicker: "Language Books",
      listTitle: "{language} 교재",
      genericLanguage: "언어",
      empty: "조건에 맞는 교재를 아직 찾지 못했습니다.",
      filtersAria: "교재 필터",
      purpose: "목적",
      year: "출간연도",
      sort: "정렬",
      reset: "필터 해제",
      all: "전체",
      paginationAria: "교재 목록 페이지",
      previous: "이전",
      next: "다음",
      back: "교재 목록",
      coverFallback: "Book",
      sourceFallback: "NAVER Book",
      detailFallback: "언어 학습 교재",
      isbn: "ISBN",
      pubdate: "출판일",
      publisher: "출판사",
      author: "저자",
      marketplacesAria: "교재 구매처",
      bookstore: "서점",
      openStore: "서점에서 보기",
      affiliateAlt: "이 글의 홍보링크로 구매하시면 수수료를 제공받습니다.",
      more: "더 보기"
    },
    en: {
      locale: "en-US",
      loading: "Loading books.",
      slowLoading: "Loading books is taking a little longer.",
      requestError: "We couldn't process the request.",
      timeoutError: "Loading books is taking too long. Please try again shortly.",
      networkError: "We couldn't load books. Please check your network connection.",
      fallbackError: "We couldn't load the book list for a moment. Please try again shortly.",
      languages: "Languages",
      majorLanguages: "Major Languages",
      highlights: "Highlights",
      representative: "Representative Books by Language",
      language: "Language",
      bookUnit: "books",
      listKicker: "Language Books",
      listTitle: "{language} Books",
      genericLanguage: "Language",
      empty: "No books match these filters yet.",
      filtersAria: "Book filters",
      purpose: "Purpose",
      year: "Publication Year",
      sort: "Sort",
      reset: "Clear Filters",
      all: "All",
      paginationAria: "Book list pages",
      previous: "Previous",
      next: "Next",
      back: "Book List",
      coverFallback: "Book",
      sourceFallback: "NAVER Book",
      detailFallback: "Language Learning Book",
      isbn: "ISBN",
      pubdate: "Published",
      publisher: "Publisher",
      author: "Author",
      marketplacesAria: "Bookstores",
      bookstore: "Bookstore",
      openStore: "View at bookstore",
      affiliateAlt: "If you purchase through this promotional link, we may receive a commission.",
      more: "View More"
    },
    ru: {
      locale: "ru-RU",
      loading: "Загружаем книги.",
      slowLoading: "Загрузка книг занимает чуть больше времени.",
      requestError: "Не удалось обработать запрос.",
      timeoutError: "Загрузка книг занимает слишком много времени. Повторите попытку позже.",
      networkError: "Не удалось загрузить книги. Проверьте подключение к сети.",
      fallbackError: "Временно не удалось загрузить список книг. Повторите попытку позже.",
      languages: "Языки",
      majorLanguages: "Основные языки",
      highlights: "Подборка",
      representative: "Книги по языкам",
      language: "Язык",
      bookUnit: "книг",
      listKicker: "Учебные книги",
      listTitle: "Книги: {language}",
      genericLanguage: "Язык",
      empty: "Пока нет книг под выбранные фильтры.",
      filtersAria: "Фильтры книг",
      purpose: "Цель",
      year: "Год издания",
      sort: "Сортировка",
      reset: "Сбросить фильтры",
      all: "Все",
      paginationAria: "Страницы списка книг",
      previous: "Назад",
      next: "Далее",
      back: "Список книг",
      coverFallback: "Book",
      sourceFallback: "NAVER Book",
      detailFallback: "Книга для изучения языка",
      isbn: "ISBN",
      pubdate: "Дата издания",
      publisher: "Издательство",
      author: "Автор",
      marketplacesAria: "Книжные магазины",
      bookstore: "Магазин",
      openStore: "Открыть в магазине",
      affiliateAlt: "Если вы купите по этой рекламной ссылке, мы можем получить комиссию.",
      more: "Показать еще"
    }
  };

  var languageNames = {
    en: { ko: "영어", en: "English", ru: "Английский" },
    ko: { ko: "한국어", en: "Korean", ru: "Корейский" },
    ja: { ko: "일본어", en: "Japanese", ru: "Японский" },
    zh: { ko: "중국어", en: "Chinese", ru: "Китайский" },
    ru: { ko: "러시아어", en: "Russian", ru: "Русский" },
    es: { ko: "스페인어", en: "Spanish", ru: "Испанский" },
    fr: { ko: "프랑스어", en: "French", ru: "Французский" },
    de: { ko: "독일어", en: "German", ru: "Немецкий" },
    it: { ko: "이탈리아어", en: "Italian", ru: "Итальянский" },
    pt: { ko: "포르투갈어", en: "Portuguese", ru: "Португальский" },
    vi: { ko: "베트남어", en: "Vietnamese", ru: "Вьетнамский" },
    th: { ko: "태국어", en: "Thai", ru: "Тайский" },
    ar: { ko: "아랍어", en: "Arabic", ru: "Арабский" },
    hi: { ko: "힌디어", en: "Hindi", ru: "Хинди" },
    id: { ko: "인도네시아어", en: "Indonesian", ru: "Индонезийский" },
    la: { ko: "라틴어", en: "Latin", ru: "Латинский" },
    all: { ko: "전체 언어", en: "All Languages", ru: "Все языки" }
  };

  var purposeNames = {
    exam: { ko: "시험 대비", en: "Exam Prep", ru: "Экзамены" },
    conversation: { ko: "회화", en: "Conversation", ru: "Разговор" },
    grammar: { ko: "문법", en: "Grammar", ru: "Грамматика" },
    vocabulary: { ko: "어휘", en: "Vocabulary", ru: "Лексика" },
    listening: { ko: "듣기", en: "Listening", ru: "Аудирование" },
    reading: { ko: "읽기", en: "Reading", ru: "Чтение" },
    writing: { ko: "쓰기", en: "Writing", ru: "Письмо" },
    pronunciation: { ko: "발음", en: "Pronunciation", ru: "Произношение" },
    business: { ko: "비즈니스", en: "Business", ru: "Бизнес" }
  };

  var sortNames = {
    featured: { ko: "추천순", en: "Featured", ru: "Рекомендованные" },
    recent: { ko: "최신 출간순", en: "Newest", ru: "Новые" },
    title: { ko: "제목순", en: "Title", ru: "По названию" }
  };

  if (!root) return;

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
    return normalizeUILanguage(prefs.uiLanguage || prefs.nativeLanguage || (navigator.languages && navigator.languages[0]) || navigator.language || "ko");
  }

  function copy() {
    return locales[currentUILanguage()] || locales.ko;
  }

  function translatedName(map, code, fallback) {
    var key = String(code || "").trim().toLowerCase();
    var lang = currentUILanguage();
    if (map[key] && map[key][lang]) return map[key][lang];
    return fallback || key || "";
  }

  function languageName(code, fallback) {
    return translatedName(languageNames, code, fallback);
  }

  function purposeName(code, fallback) {
    return translatedName(purposeNames, code, fallback);
  }

  function sortName(code, fallback) {
    return translatedName(sortNames, code, fallback);
  }

  function filterName(axis, filter) {
    if (!filter) return "";
    if (axis === "purpose") return purposeName(filter.Code, filter.Name);
    if (axis === "sort") return sortName(filter.Code, filter.Name);
    if (axis === "year") return localizedYear(filter.Code || filter.Name);
    return filter.Name || filter.Code;
  }

  function localizedYear(value) {
    var raw = String(value || "").trim();
    var match = raw.match(/\d{4}/);
    if (!match) return raw;
    return currentUILanguage() === "ko" ? match[0] + "년" : match[0];
  }

  function localizedBookCount(value) {
    return formatCount(value) + (currentUILanguage() === "ko" ? "" : " ") + copy().bookUnit;
  }

  function rerenderLocalized() {
    if (lastPayload && lastRenderer) {
      lastRenderer(lastPayload);
    }
  }

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
        return { ok: false };
      }).then(function (data) {
        if (!response.ok || data.ok === false) {
          throw new Error(copy().requestError);
        }
        return data;
      });
    }, function (error) {
      if (timer) window.clearTimeout(timer);
      if (error && error.name === "AbortError") {
        throw new Error(copy().timeoutError);
      }
      throw new Error(copy().networkError);
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
      lastPayload = cached;
      lastRenderer = request.render;
      request.render(cached);
    } else {
      setStatus(copy().loading);
      noticeTimer = window.setTimeout(function () {
        if (loadSequence === sequence) {
          setStatus(copy().slowLoading);
        }
      }, loadingNoticeMs);
    }
    return postJSON(request.url, request.payload).then(function (payload) {
      if (noticeTimer) window.clearTimeout(noticeTimer);
      if (loadSequence !== sequence) return;
      writeCachedPayload(key, payload);
      lastPayload = payload;
      lastRenderer = request.render;
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
    setStatus(error && error.message ? error.message : copy().fallbackError, "error");
  }

  function renderLanding(payload) {
    setStatus("");
    clear(root);
    var books = payload.books || {};
    var languages = books.LanguageFilters || [];
    var groups = books.Groups || [];

    var languageSection = el("section", "books-featured-languages");
    var languageHead = el("header", "books-section-head");
    languageHead.appendChild(el("p", "", copy().languages));
    languageHead.appendChild(el("h2", "", copy().majorLanguages));
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
      body.appendChild(el("strong", "", languageName(language.Code, language.Name)));
      body.appendChild(el("small", "", localizedBookCount(language.Count)));
      card.appendChild(body);
      languageGrid.appendChild(card);
    });
    languageSection.appendChild(languageGrid);
    root.appendChild(languageSection);

    var representative = el("section", "books-language-stack");
    var repHead = el("header", "books-section-head");
    repHead.appendChild(el("p", "", copy().highlights));
    repHead.appendChild(el("h2", "", copy().representative));
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
    titleText.appendChild(el("p", "", copy().language));
    titleText.appendChild(el("h2", "", languageName(group.Code, group.Name)));
    title.appendChild(titleText);
    head.appendChild(title);
    head.appendChild(el("span", "", localizedBookCount(group.Count)));
    section.appendChild(head);
    var grid = el("div", "books-grid books-grid--language");
    (group.Items || []).slice(0, 4).forEach(function (item) {
      grid.appendChild(renderBookCard(item));
    });
    section.appendChild(grid);
    section.appendChild(link("books-more-link", group.MoreURL || group.URL, copy().more));
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
    title.appendChild(el("p", "", copy().listKicker));
    title.appendChild(el("h2", "", copy().listTitle.replace("{language}", languageName(books.LanguageCode, books.LanguageName || copy().genericLanguage))));
    title.appendChild(el("span", "", localizedBookCount(total)));
    intro.appendChild(title);
    root.appendChild(intro);

    root.appendChild(renderFilters(books));

    var list = el("div", "books-list");
    var items = books.Items || [];
    if (!items.length) {
      list.appendChild(el("div", "books-empty", copy().empty));
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
    panel.setAttribute("aria-label", copy().filtersAria);
    panel.appendChild(renderFilterRow("purpose", copy().purpose, books.PurposeFilters || [], buildPath(copyState({ purpose: "", page: 1 })), books.PurposeCode));
    panel.appendChild(renderFilterRow("year", copy().year, books.YearFilters || [], buildPath(copyState({ year: "", page: 1 })), books.YearCode));
    panel.appendChild(renderFilterRow("sort", copy().sort, books.SortFilters || [], buildPath(copyState({ sort: "featured", page: 1 })), books.SortCode));
    var reset = link("books-filter-reset", buildPath({ language: books.LanguageCode || state.language, sort: "featured", page: 1 }), copy().reset);
    panel.appendChild(reset);
    return panel;
  }

  function renderFilterRow(axis, label, filters, allURL, activeCode) {
    var row = el("div", "books-filter-row");
    row.appendChild(el("span", "books-filter-label", label));
    var all = link("book-filter-chip" + (!activeCode || activeCode === "featured" ? " is-active" : ""), allURL, copy().all);
    row.appendChild(all);
    filters.forEach(function (filter) {
      var chip = link("book-filter-chip" + (filter.Active ? " is-active" : ""), filter.URL, filterName(axis, filter));
      if (filter.Count) chip.appendChild(el("small", "", formatCount(filter.Count)));
      row.appendChild(chip);
    });
    return row;
  }

  function renderPagination(books, page) {
    var nav = el("nav", "books-pagination");
    nav.setAttribute("aria-label", copy().paginationAria);
    if (books.PrevURL) nav.appendChild(link("site-menu-action", books.PrevURL, copy().previous));
    nav.appendChild(el("span", "", String(page || 1)));
    if (books.NextURL) nav.appendChild(link("site-menu-action", books.NextURL, copy().next));
    return nav;
  }

  function renderDetail(payload) {
    setStatus("");
    clear(root);
    var item = payload.book || {};
    var article = el("article", "book-detail");
    article.appendChild(link("books-back-link", item.TargetLanguageCode ? "/books/" + encodeSegment(item.TargetLanguageCode) + "/" : "/books/", copy().back));
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
      cover.appendChild(el("span", "", copy().coverFallback));
    }
    grid.appendChild(cover);
    var body = el("div", "book-detail-body");
    body.appendChild(el("p", "book-source", [languageName(item.TargetLanguageCode, item.TargetLanguageName), purposeName(item.TargetPurposeCode, item.TargetPurposeName)].filter(Boolean).join(" · ") || copy().sourceFallback));
    body.appendChild(el("h2", "", item.Title || copy().detailFallback));
    body.appendChild(el("p", "book-meta", item.AuthorPublisherLine || copy().sourceFallback));
    if (item.Description) body.appendChild(el("p", "book-description", item.Description));
    body.appendChild(renderFacts(item));
    body.appendChild(renderMarketplaces(item));
    grid.appendChild(body);
    article.appendChild(grid);
    root.appendChild(article);
  }

  function renderFacts(item) {
    var facts = el("dl", "book-facts");
    addFact(facts, copy().isbn, item.ISBN);
    addFact(facts, copy().pubdate, item.Pubdate);
    addFact(facts, copy().publisher, item.Publisher);
    addFact(facts, copy().author, item.Author);
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
    wrap.setAttribute("aria-label", copy().marketplacesAria);
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
      card.appendChild(el("strong", "", market.Name || copy().bookstore));
      card.appendChild(el("span", "", copy().openStore));
      wrap.appendChild(card);
    });
    var notice = el("div", "book-marketplace-card book-marketplace-card--notice");
    var noticeImg = el("img", "");
    noticeImg.src = "https://cdn.jsdelivr.net/gh/statground/Statground_CDN@5f8f811181b3c850103b0eab7dc90719e66f0a10/images/common/affiliates/adpick.png";
    noticeImg.alt = copy().affiliateAlt;
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
      cover.appendChild(el("span", "", copy().coverFallback));
    }
    return cover;
  }

  function renderBookBody(item) {
    var body = el("span", "book-card-body");
    if (item.TargetPurposeName || item.TargetPurposeCode) body.appendChild(el("em", "", purposeName(item.TargetPurposeCode, item.TargetPurposeName)));
    body.appendChild(el("strong", "", item.Title || copy().detailFallback));
    body.appendChild(el("span", "", item.AuthorPublisherLine || copy().sourceFallback));
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
    return n.toLocaleString(copy().locale);
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
  window.addEventListener(languageChangeEvent, rerenderLocalized);
  window.addEventListener("storage", function (event) {
    if (event.key === preferenceKey) rerenderLocalized();
  });
  try {
    load();
  } catch (error) {
    renderError(error);
  }
})();

