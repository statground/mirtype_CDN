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
  var preferenceKey = "mirtype.preferences.v1";
  var languageChangeEvent = "mirtype:languagechange";
  var lastPayload = null;
  var lastRenderer = null;

  var locales = {
    ko: {
      locale: "ko-KR",
      loading: "강의를 불러오는 중입니다.",
      slowLoading: "강의를 불러오는 데 시간이 조금 걸리고 있습니다.",
      requestError: "요청을 처리하지 못했습니다.",
      timeoutError: "강의 목록을 불러오는 데 시간이 오래 걸리고 있습니다. 잠시 후 다시 시도해 주세요.",
      networkError: "강의 목록을 불러오지 못했습니다. 네트워크 상태를 확인해 주세요.",
      fallbackError: "일시적으로 강의 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.",
      languages: "Languages",
      majorLanguages: "주요 언어",
      highlights: "Highlights",
      representative: "언어별 대표 강의",
      language: "Language",
      lectureUnit: "개 강의",
      listKicker: "Language Lectures",
      listTitle: "{language} 강의",
      genericLanguage: "언어",
      empty: "조건에 맞는 강의를 아직 찾지 못했습니다.",
      filtersAria: "강의 필터",
      purpose: "목적",
      level: "난이도",
      year: "출시연도",
      sort: "정렬",
      reset: "필터 해제",
      all: "전체",
      paginationAria: "강의 목록 페이지",
      previous: "이전",
      next: "다음",
      back: "강의 목록",
      coverFallback: "Lecture",
      sourceFallback: "Inflearn",
      detailFallback: "언어 학습 강의",
      openInflearn: "Inflearn에서 보기",
      affiliateAlt: "이 글의 홍보링크로 구매하시면 수수료를 제공받습니다.",
      stats: "강의 정보",
      students: "수강생",
      likes: "좋아요",
      reviews: "리뷰",
      rating: "평점",
      units: "강의 수",
      previewUnits: "미리보기",
      runtime: "러닝타임",
      published: "출시일",
      updated: "업데이트",
      category: "분야",
      provider: "제공처",
      instructor: "지식공유자",
      instructors: "지식공유자",
      targetLanguage: "학습 언어",
      targetPurpose: "학습 목적",
      price: "가격",
      regularPrice: "정가",
      free: "무료",
      features: "제공 항목",
      certificate: "수료증",
      answer: "질문 답변",
      inquiry: "문의",
      keywords: "키워드",
      curriculum: "커리큘럼",
      curriculumSummary: "{sections}개 섹션 · {units}강",
      video: "영상",
      preview: "미리보기",
      attachment: "자료",
      moreUnits: "{n}개 강의를 더 생략했습니다.",
      description: "강의 소개",
      more: "더 보기",
      people: "명",
      lessons: "강",
      hour: "시간",
      minute: "분"
    },
    en: {
      locale: "en-US",
      loading: "Loading lectures.",
      slowLoading: "Loading lectures is taking a little longer.",
      requestError: "We couldn't process the request.",
      timeoutError: "Loading lectures is taking too long. Please try again shortly.",
      networkError: "We couldn't load lectures. Please check your network connection.",
      fallbackError: "We couldn't load the lecture list for a moment. Please try again shortly.",
      languages: "Languages",
      majorLanguages: "Major Languages",
      highlights: "Highlights",
      representative: "Representative Lectures by Language",
      language: "Language",
      lectureUnit: "lectures",
      listKicker: "Language Lectures",
      listTitle: "{language} Lectures",
      genericLanguage: "Language",
      empty: "No lectures match these filters yet.",
      filtersAria: "Lecture filters",
      purpose: "Purpose",
      level: "Level",
      year: "Release Year",
      sort: "Sort",
      reset: "Clear Filters",
      all: "All",
      paginationAria: "Lecture list pages",
      previous: "Previous",
      next: "Next",
      back: "Lecture List",
      coverFallback: "Lecture",
      sourceFallback: "Inflearn",
      detailFallback: "Language Learning Lecture",
      openInflearn: "Open on Inflearn",
      affiliateAlt: "If you purchase through this promotional link, we may receive a commission.",
      stats: "Lecture Details",
      students: "Students",
      likes: "Likes",
      reviews: "Reviews",
      rating: "Rating",
      units: "Lessons",
      previewUnits: "Previews",
      runtime: "Runtime",
      published: "Published",
      updated: "Updated",
      category: "Category",
      provider: "Provider",
      instructor: "Instructor",
      instructors: "Instructors",
      targetLanguage: "Target Language",
      targetPurpose: "Purpose",
      price: "Price",
      regularPrice: "Regular Price",
      free: "Free",
      features: "Included",
      certificate: "Certificate",
      answer: "Q&A",
      inquiry: "Inquiry",
      keywords: "Keywords",
      curriculum: "Curriculum",
      curriculumSummary: "{sections} sections · {units} lessons",
      video: "Video",
      preview: "Preview",
      attachment: "Attachment",
      moreUnits: "{n} more lessons are hidden.",
      description: "Course Introduction",
      more: "View More",
      people: "students",
      lessons: "lessons",
      hour: "h",
      minute: "m"
    },
    ru: {
      locale: "ru-RU",
      loading: "Загружаем курсы.",
      slowLoading: "Загрузка курсов занимает чуть больше времени.",
      requestError: "Не удалось обработать запрос.",
      timeoutError: "Загрузка курсов занимает слишком много времени. Повторите попытку позже.",
      networkError: "Не удалось загрузить курсы. Проверьте подключение к сети.",
      fallbackError: "Временно не удалось загрузить список курсов. Повторите попытку позже.",
      languages: "Языки",
      majorLanguages: "Основные языки",
      highlights: "Подборка",
      representative: "Курсы по языкам",
      language: "Язык",
      lectureUnit: "курсов",
      listKicker: "Языковые курсы",
      listTitle: "Курсы: {language}",
      genericLanguage: "Язык",
      empty: "Пока нет курсов под выбранные фильтры.",
      filtersAria: "Фильтры курсов",
      purpose: "Цель",
      level: "Уровень",
      year: "Год выпуска",
      sort: "Сортировка",
      reset: "Сбросить фильтры",
      all: "Все",
      paginationAria: "Страницы списка курсов",
      previous: "Назад",
      next: "Далее",
      back: "Список курсов",
      coverFallback: "Lecture",
      sourceFallback: "Inflearn",
      detailFallback: "Курс для изучения языка",
      openInflearn: "Открыть на Inflearn",
      affiliateAlt: "Если вы купите по этой рекламной ссылке, мы можем получить комиссию.",
      stats: "Информация о курсе",
      students: "Студенты",
      likes: "Лайки",
      reviews: "Отзывы",
      rating: "Рейтинг",
      units: "Уроки",
      previewUnits: "Превью",
      runtime: "Время",
      published: "Опубликовано",
      updated: "Обновлено",
      category: "Категория",
      provider: "Платформа",
      instructor: "Преподаватель",
      instructors: "Преподаватели",
      targetLanguage: "Язык изучения",
      targetPurpose: "Цель",
      price: "Цена",
      regularPrice: "Обычная цена",
      free: "Бесплатно",
      features: "Включено",
      certificate: "Сертификат",
      answer: "Ответы",
      inquiry: "Вопросы",
      keywords: "Ключевые слова",
      curriculum: "Программа",
      curriculumSummary: "{sections} разделов · {units} уроков",
      video: "Видео",
      preview: "Превью",
      attachment: "Материалы",
      moreUnits: "Скрыто еще {n} уроков.",
      description: "Описание курса",
      more: "Показать еще",
      people: "чел.",
      lessons: "уроков",
      hour: "ч",
      minute: "мин"
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

  var levelNames = {
    beginner: { ko: "입문", en: "Beginner", ru: "Введение" },
    basic: { ko: "초급", en: "Basic", ru: "Базовый" },
    intermediate: { ko: "중급", en: "Intermediate", ru: "Средний" },
    advanced: { ko: "고급", en: "Advanced", ru: "Продвинутый" }
  };

  var sortNames = {
    featured: { ko: "추천순", en: "Featured", ru: "Рекомендованные" },
    recent: { ko: "최신순", en: "Newest", ru: "Новые" },
    popular: { ko: "수강생순", en: "Most Students", ru: "По студентам" },
    rating: { ko: "평점순", en: "Top Rated", ru: "По рейтингу" },
    title: { ko: "제목순", en: "Title", ru: "По названию" }
  };

  var inflearnLogo = "https://cdn.jsdelivr.net/gh/statground/Statground_CDN@5f8f811181b3c850103b0eab7dc90719e66f0a10/images/data/lecture/inflearn.svg";
  var adpickLogo = "https://cdn.jsdelivr.net/gh/statground/Statground_CDN@5f8f811181b3c850103b0eab7dc90719e66f0a10/images/common/affiliates/adpick.png";

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

  function levelName(code, fallback) {
    return translatedName(levelNames, code, fallback);
  }

  function sortName(code, fallback) {
    return translatedName(sortNames, code, fallback);
  }

  function filterName(axis, filter) {
    if (!filter) return "";
    if (axis === "purpose") return purposeName(filter.Code, filter.Name);
    if (axis === "level") return levelName(filter.Code, filter.Name);
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

  function localizedLectureCount(value) {
    return formatCount(value) + (currentUILanguage() === "ko" ? "" : " ") + copy().lectureUnit;
  }

  function localizedPeople(value) {
    if (!value) return "";
    return formatCount(value) + (currentUILanguage() === "ko" ? "" : " ") + copy().people;
  }

  function localizedLessons(value) {
    if (!value) return "";
    return formatCount(value) + (currentUILanguage() === "ko" ? "" : " ") + copy().lessons;
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
    var lectures = payload.lectures || {};
    var languages = lectures.LanguageFilters || [];
    var groups = lectures.Groups || [];

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
      body.appendChild(el("small", "", localizedLectureCount(language.Count)));
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
    head.appendChild(el("span", "", localizedLectureCount(group.Count)));
    section.appendChild(head);
    var grid = el("div", "books-grid books-grid--language");
    (group.Items || []).slice(0, 4).forEach(function (item) {
      grid.appendChild(renderLectureCard(item));
    });
    section.appendChild(grid);
    section.appendChild(link("books-more-link", group.MoreURL || group.URL, copy().more));
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
    title.appendChild(el("p", "", copy().listKicker));
    title.appendChild(el("h2", "", copy().listTitle.replace("{language}", languageName(lectures.LanguageCode, lectures.LanguageName || copy().genericLanguage))));
    title.appendChild(el("span", "", localizedLectureCount(total)));
    intro.appendChild(title);
    root.appendChild(intro);

    root.appendChild(renderFilters(lectures));

    var list = el("div", "books-list");
    var items = lectures.Items || [];
    if (!items.length) {
      list.appendChild(el("div", "books-empty", copy().empty));
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
    panel.setAttribute("aria-label", copy().filtersAria);
    panel.appendChild(renderFilterRow("purpose", copy().purpose, lectures.PurposeFilters || [], buildPath(copyState({ purpose: "", page: 1 })), lectures.PurposeCode));
    panel.appendChild(renderFilterRow("level", copy().level, lectures.LevelFilters || [], buildPath(copyState({ level: "", page: 1 })), lectures.LevelCode));
    panel.appendChild(renderFilterRow("year", copy().year, lectures.YearFilters || [], buildPath(copyState({ year: "", page: 1 })), lectures.YearCode));
    panel.appendChild(renderFilterRow("sort", copy().sort, lectures.SortFilters || [], buildPath(copyState({ sort: "featured", page: 1 })), lectures.SortCode));
    panel.appendChild(link("books-filter-reset", buildPath({ language: lectures.LanguageCode || state.language, sort: "featured", page: 1 }), copy().reset));
    return panel;
  }

  function renderFilterRow(axis, label, filters, allURL, activeCode) {
    var row = el("div", "books-filter-row");
    row.appendChild(el("span", "books-filter-label", label));
    row.appendChild(link("book-filter-chip" + (!activeCode || activeCode === "featured" ? " is-active" : ""), allURL, copy().all));
    filters.forEach(function (filter) {
      var chip = link("book-filter-chip" + (filter.Active ? " is-active" : ""), filter.URL, filterName(axis, filter));
      if (filter.Count) chip.appendChild(el("small", "", formatCount(filter.Count)));
      row.appendChild(chip);
    });
    return row;
  }

  function renderPagination(lectures, page) {
    var nav = el("nav", "books-pagination");
    nav.setAttribute("aria-label", copy().paginationAria);
    if (lectures.PrevURL) nav.appendChild(link("site-menu-action", lectures.PrevURL, copy().previous));
    nav.appendChild(el("span", "", String(page || 1)));
    if (lectures.NextURL) nav.appendChild(link("site-menu-action", lectures.NextURL, copy().next));
    return nav;
  }

  function renderDetail(payload) {
    setStatus("");
    clear(root);
    var item = payload.lecture || {};
    var article = el("article", "book-detail lecture-detail");
    article.appendChild(link("books-back-link", item.TargetLanguageCode ? "/lectures/" + encodeSegment(item.TargetLanguageCode) + "/" : "/lectures/", copy().back));
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
      cover.appendChild(el("span", "", copy().coverFallback));
    }
    grid.appendChild(cover);
    var body = el("div", "book-detail-body");
    body.appendChild(el("p", "book-source", [languageName(item.TargetLanguageCode, item.TargetLanguageName), purposeName(item.TargetPurposeCode, item.TargetPurposeName)].filter(Boolean).join(" · ") || copy().sourceFallback));
    body.appendChild(el("h2", "", item.Title || copy().detailFallback));
    body.appendChild(el("p", "book-meta", item.ProviderSummaryLine || copy().sourceFallback));
    if (item.Description) body.appendChild(el("p", "book-description", item.Description));
    body.appendChild(renderAffiliateCards(item));
    body.appendChild(renderFacts(item));
    body.appendChild(renderFeatureSection(item));
    body.appendChild(renderInstructorSection(item));
    body.appendChild(renderCurriculumSection(item));
    body.appendChild(renderKeywordSection(item));
    grid.appendChild(body);
    article.appendChild(grid);
    root.appendChild(article);
  }

  function renderAffiliateCards(item) {
    var wrap = el("div", "book-marketplaces lecture-marketplaces");
    wrap.setAttribute("aria-label", copy().openInflearn);
    var cta = el("a", "book-marketplace-card is-affiliate");
    cta.href = item.AffiliateURL || (item.CourseID ? "/lectures/affiliate/inflearn/" + encodeSegment(item.CourseID) + "/" : (item.CourseURL || "https://www.inflearn.com/"));
    cta.target = "_blank";
    cta.rel = "sponsored nofollow noopener";
    var logo = el("img", "");
    logo.src = inflearnLogo;
    logo.alt = "Inflearn";
    logo.loading = "lazy";
    logo.decoding = "async";
    cta.appendChild(logo);
    cta.appendChild(el("span", "", copy().openInflearn));
    wrap.appendChild(cta);
    var notice = el("div", "book-marketplace-card book-marketplace-card--notice");
    var noticeImg = el("img", "");
    noticeImg.src = adpickLogo;
    noticeImg.alt = copy().affiliateAlt;
    noticeImg.loading = "lazy";
    noticeImg.decoding = "async";
    notice.appendChild(noticeImg);
    wrap.appendChild(notice);
    return wrap;
  }

  function renderFacts(item) {
    var facts = el("dl", "book-facts");
    addFact(facts, copy().provider, item.ProviderName || copy().sourceFallback);
    addFact(facts, copy().targetLanguage, languageName(item.TargetLanguageCode, item.TargetLanguageName));
    addFact(facts, copy().targetPurpose, purposeName(item.TargetPurposeCode, item.TargetPurposeName));
    addFact(facts, copy().students, localizedPeople(item.StudentCount));
    addFact(facts, copy().likes, item.LikeCount ? formatCount(item.LikeCount) : "");
    addFact(facts, copy().reviews, item.ReviewCount ? formatCount(item.ReviewCount) : "");
    addFact(facts, copy().rating, item.AverageStar ? Number(item.AverageStar).toFixed(1) : "");
    addFact(facts, copy().units, localizedLessons(item.LectureUnitCount));
    addFact(facts, copy().previewUnits, localizedLessons(item.PreviewUnitCount));
    addFact(facts, copy().runtime, item.RuntimeSummary);
    addFact(facts, copy().level, levelName(item.LevelCode, item.LevelCode));
    addFact(facts, copy().published, item.PublishedDate);
    addFact(facts, copy().updated, item.LastUpdatedDate);
    addFact(facts, copy().category, [item.CategoryMainTitle, item.CategorySubTitle].filter(Boolean).join(" · "));
    addFact(facts, copy().instructor, item.InstructorNames);
    addFact(facts, copy().price, priceText(item));
    if (Number(item.KRWRegularPrice || 0) > 0 && Number(item.KRWPayPrice || 0) > 0 && Number(item.KRWRegularPrice) > Number(item.KRWPayPrice)) {
      addFact(facts, copy().regularPrice, "₩" + formatCount(item.KRWRegularPrice));
    }
    return facts;
  }

  function priceText(item) {
    var regular = Number(item && item.KRWRegularPrice ? item.KRWRegularPrice : 0);
    var pay = Number(item && item.KRWPayPrice ? item.KRWPayPrice : 0);
    if (pay > 0) {
      var text = "₩" + formatCount(pay);
      if (item && item.DiscountRate) text += " · -" + formatCount(item.DiscountRate) + "%";
      return text;
    }
    if (regular > 0) return "₩" + formatCount(regular);
    return copy().free;
  }

  function renderFeatureSection(item) {
    var features = [];
    if (item.ProvidesCertificate) features.push(copy().certificate);
    if (item.ProvidesInstructorAnswer) features.push(copy().answer);
    if (item.ProvidesInquiry) features.push(copy().inquiry);
    if (!features.length) return el("span", "");
    var wrap = el("section", "book-detail-section");
    wrap.appendChild(el("h3", "", copy().features));
    var chips = el("div", "books-filter-row");
    features.forEach(function (feature) {
      chips.appendChild(el("span", "book-filter-chip is-active", feature));
    });
    wrap.appendChild(chips);
    return wrap;
  }

  function renderInstructorSection(item) {
    var instructors = Array.isArray(item.Instructors) ? item.Instructors : [];
    if (!instructors.length) return el("span", "");
    var wrap = el("section", "book-detail-section lecture-detail-section");
    wrap.appendChild(el("h3", "", copy().instructors));
    var grid = el("div", "book-grid book-grid--compact");
    instructors.slice(0, 8).forEach(function (instructor) {
      var card = el("article", "book-card book-card--list");
      var avatar = el("span", "book-card-cover");
      if (instructor.ThumbnailURL || instructor.thumbnail_url) {
        var image = el("img", "");
        image.src = instructor.ThumbnailURL || instructor.thumbnail_url;
        image.alt = "";
        image.loading = "lazy";
        image.decoding = "async";
        avatar.appendChild(image);
      } else {
        avatar.appendChild(el("span", "", copy().instructor));
      }
      var body = el("span", "book-card-body");
      body.appendChild(el("strong", "", instructor.Name || instructor.name || copy().instructor));
      if (instructor.Role || instructor.role) body.appendChild(el("span", "", instructor.Role || instructor.role));
      if (instructor.IntroduceText || instructor.introduce_text) {
        body.appendChild(el("span", "", instructor.IntroduceText || instructor.introduce_text));
      }
      card.appendChild(avatar);
      card.appendChild(body);
      grid.appendChild(card);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function renderCurriculumSection(item) {
    var rows = Array.isArray(item.Curriculum) ? item.Curriculum : [];
    if (!rows.length) return el("span", "");
    var wrap = el("section", "book-detail-section lecture-detail-section");
    wrap.appendChild(el("h3", "", copy().curriculum));
    var summary = copy().curriculumSummary
      .replace("{sections}", formatCount(item.CurriculumSectionCount || countCurriculumSections(rows)))
      .replace("{units}", formatCount(item.CurriculumUnitCount || rows.length));
    wrap.appendChild(el("p", "book-meta", summary));
    var groups = [];
    var byKey = {};
    rows.forEach(function (unit) {
      var key = String(unit.SectionID || unit.section_id || 0) + ":" + String(unit.SectionTitle || unit.section_title || "");
      if (!byKey[key]) {
        byKey[key] = { title: unit.SectionTitle || unit.section_title || copy().curriculum, units: [] };
        groups.push(byKey[key]);
      }
      byKey[key].units.push(unit);
    });
    var shown = 0;
    var maxUnits = 80;
    groups.forEach(function (group) {
      if (shown >= maxUnits) return;
      var section = el("div", "lecture-curriculum-section");
      section.appendChild(el("h4", "", group.title));
      var list = el("div", "lecture-curriculum-list");
      group.units.forEach(function (unit) {
        if (shown >= maxUnits) return;
        shown += 1;
        var row = el("div", "lecture-curriculum-unit");
        row.appendChild(el("strong", "", unit.UnitTitle || unit.unit_title || "-"));
        var meta = [];
        var seconds = Number(unit.RuntimeSec || unit.runtime_sec || 0);
        if (seconds > 0) meta.push(formatDuration(seconds));
        if (unit.IsPreview || unit.is_preview) meta.push(copy().preview);
        if (unit.HasVideo || unit.has_video) meta.push(copy().video);
        if (unit.HasAttachment || unit.has_attachment) meta.push(copy().attachment);
        if (meta.length) row.appendChild(el("span", "", meta.join(" · ")));
        list.appendChild(row);
      });
      section.appendChild(list);
      wrap.appendChild(section);
    });
    if (rows.length > maxUnits) {
      wrap.appendChild(el("p", "book-meta", copy().moreUnits.replace("{n}", formatCount(rows.length - maxUnits))));
    }
    return wrap;
  }

  function countCurriculumSections(rows) {
    var seen = {};
    rows.forEach(function (unit) {
      seen[String(unit.SectionID || unit.section_id || 0) + ":" + String(unit.SectionTitle || unit.section_title || "")] = true;
    });
    return Object.keys(seen).length;
  }

  function formatDuration(seconds) {
    var total = Math.max(0, Math.round(Number(seconds || 0)));
    var hours = Math.floor(total / 3600);
    var minutes = Math.floor((total % 3600) / 60);
    var parts = [];
    if (hours > 0) parts.push(formatCount(hours) + copy().hour);
    if (minutes > 0) parts.push(formatCount(minutes) + copy().minute);
    if (!parts.length && total > 0) parts.push("1" + copy().minute);
    return parts.join(" ");
  }

  function renderKeywordSection(item) {
    var words = splitKeywords(item.Keywords);
    if (!words.length) return el("span", "");
    var wrap = el("section", "book-detail-section");
    wrap.appendChild(el("h3", "", copy().keywords));
    var chips = el("div", "books-filter-row");
    words.slice(0, 18).forEach(function (word) {
      chips.appendChild(el("span", "book-filter-chip", word));
    });
    wrap.appendChild(chips);
    return wrap;
  }

  function splitKeywords(value) {
    var seen = {};
    return String(value || "").split(/[,#;|]/).map(function (word) {
      return word.trim();
    }).filter(function (word) {
      if (!word || seen[word]) return false;
      seen[word] = true;
      return true;
    });
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
      cover.appendChild(el("span", "", copy().coverFallback));
    }
    return cover;
  }

  function renderLectureBody(item) {
    var body = el("span", "book-card-body");
    if (item.TargetPurposeName || item.TargetPurposeCode) body.appendChild(el("em", "", purposeName(item.TargetPurposeCode, item.TargetPurposeName)));
    body.appendChild(el("strong", "", item.Title || copy().detailFallback));
    body.appendChild(el("span", "", item.ProviderSummaryLine || copy().sourceFallback));
    var stats = [];
    if (item.StudentCount) stats.push(localizedPeople(item.StudentCount));
    if (item.AverageStar) stats.push(copy().rating + " " + Number(item.AverageStar).toFixed(1));
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
    return n.toLocaleString(copy().locale);
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
