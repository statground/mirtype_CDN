(function () {
  "use strict";

  var PREFERENCES_KEY = "mirtype.preferences.v1";
  var supportedLanguages = ["ko", "en", "ru"];
  var shellLocales = {
    ko: {
      htmlLang: "ko",
      metaTitleIntro: "MirType 소개",
      metaDescriptionIntro: "타자연습과 언어 공부를 동시에 할 수 있는 MirType 서비스 소개",
      brand: {
        homeAria: "MirType 홈",
        tagline: "타자연습과 언어 공부를 동시에"
      },
      aria: {
        menu: "MirType 메뉴",
        openMenu: "메뉴 열기",
        closeMenu: "메뉴 닫기",
        introMain: "MirType 소개",
        introToc: "MirType 소개 목차",
        peopleSocial: "Jae-seong Yoo SNS"
      },
      nav: {
        seat: "자리 연습",
        word: "단어 연습",
        sentence: "문장 연습",
        game: "타자게임",
        keyboard: "키보드 보기",
        keyboardShort: "키보드",
        history: "최근 기록",
        intro: "MirType 소개",
        statground: "통계마당",
        webr: "Web-R"
      },
      mobile: {
        practice: "Practice",
        links: "Links"
      },
      intro: {
        tocOverview: "서비스 소개",
        tocStory: "스토리",
        tocPeople: "만든 사람들",
        kicker: "Typing Practice + Language Learning",
        summary: "MirType은 타자연습과 언어 공부를 동시에 할 수 있도록 만드는 학습형 타자연습 서비스입니다. 자리, 단어, 문장, 키보드 배열을 한 흐름 안에서 익히며 한국어, 영어, 러시아어처럼 다른 문자 체계의 입력 감각까지 함께 다룹니다. 온 세상 사람들이 IT 환경과 조금 더 친숙해지도록 이 웹사이트는 평생 무료로 운영하는 것을 목표로 합니다.",
        ctaPractice: "바로 연습하기",
        ctaKeyboard: "키보드 보기",
        storyKicker: "Story",
        storyTitle: "MirType의 스토리",
        storySummary: "처음에는 CEO의 개인적인 언어 학습을 위해 만든 작은 도구였지만, 지금은 누구나 부담 없이 타자와 언어를 함께 익히는 열린 연습 공간으로 확장하고 있습니다.",
        storyOneTitle: "타자를 익히는 시간은 언어를 익히는 시간이기도 합니다.",
        storyOneBody: "단순히 빠르게 치는 연습을 넘어, 문자를 보고 손가락이 움직이는 과정을 언어 학습과 연결합니다. MirType은 자리 연습에서 시작해 단어와 문장으로 확장되며, 사용자가 새로운 언어의 키보드 배열과 리듬을 자연스럽게 익히는 방향을 지향합니다.",
        storyTwoTitle: "PC와 모바일에서 모두 같은 학습 흐름을 유지합니다.",
        storyTwoBody: "PC에서는 물리 키보드와 넓은 화면을, 모바일에서는 터치와 가상 키보드가 차지하는 viewport를 함께 고려합니다. 글자가 보이는 공간, 커서, 키보드 패널, 결과 팝업은 화면 크기에 따라 재배치되지만 연습의 핵심 흐름은 끊기지 않아야 합니다.",
        storyThreeTitle: "매일 돌아오는 작은 연습을 오래 이어가게 만듭니다.",
        storyThreeBody: "MirType은 부담 없이 시작하고, 눈앞의 한 문장을 끝내며, 다시 다음 연습으로 넘어가는 감각을 중요하게 봅니다. 앞으로도 타자게임, 문장 학습, 언어별 키보드, 기록 기반 연습을 차근차근 고도화해 나가겠습니다.",
        peopleKicker: "People",
        peopleTitle: "만든 사람들",
        peopleSummary: "MirType은 타자와 언어를 같은 흐름에서 익히는 작은 연습 경험으로 시작합니다.",
        roleCeo: "CEO"
      },
      footer: {
        company: "주식회사 통계마당",
        ceo: "대표, 개인정보보호책임자: 유재성",
        business: "사업자등록번호: 795-88-02574",
        commerce: "통신판매업신고번호: 2024-서울강남-06145",
        address: "서울특별시 강남구 테헤란로70길 12, 402-106A호",
        phone: "대표전화: 0507-1300-9704"
      }
    },
    en: {
      htmlLang: "en",
      metaTitleIntro: "About MirType",
      metaDescriptionIntro: "About MirType, a service for typing practice and language learning together",
      brand: {
        homeAria: "MirType home",
        tagline: "Typing practice and language learning together"
      },
      aria: {
        menu: "MirType menu",
        openMenu: "Open menu",
        closeMenu: "Close menu",
        introMain: "About MirType",
        introToc: "About MirType sections",
        peopleSocial: "Jae-seong Yoo social links"
      },
      nav: {
        seat: "Key Practice",
        word: "Word Practice",
        sentence: "Sentence Practice",
        game: "Typing Games",
        keyboard: "Keyboard View",
        keyboardShort: "Keyboard",
        history: "Recent Records",
        intro: "About MirType",
        statground: "Statground",
        webr: "Web-R"
      },
      mobile: {
        practice: "Practice",
        links: "Links"
      },
      intro: {
        tocOverview: "Overview",
        tocStory: "Story",
        tocPeople: "People",
        kicker: "Typing Practice + Language Learning",
        summary: "MirType is a learning typing practice service built for practicing typing and studying languages at the same time. It brings key positions, words, sentences, and keyboard layouts into one flow, including the feel of typing Korean, English, Russian, and other writing systems. Guided by the hope that people everywhere can feel more at home in IT environments, this website is planned to remain free for life.",
        ctaPractice: "Start Practicing",
        ctaKeyboard: "View Keyboard",
        storyKicker: "Story",
        storyTitle: "The Story of MirType",
        storySummary: "It began, quite honestly, as a small tool for the CEO's own language learning. It is now growing into an open practice space where anyone can learn typing and language together without pressure.",
        storyOneTitle: "Time spent learning to type can also be time spent learning a language.",
        storyOneBody: "Beyond typing faster, MirType connects the act of seeing characters and moving your fingers with language learning. It starts with key positions, expands into words and sentences, and helps users get used to the layout and rhythm of a new language.",
        storyTwoTitle: "The same learning flow should hold on desktop and mobile.",
        storyTwoBody: "On desktop, MirType considers a physical keyboard and a wider screen. On mobile, it considers touch input and the viewport taken by the virtual keyboard. Text space, caret, keyboard panel, and result popups may reflow, but the core practice flow should stay intact.",
        storyThreeTitle: "Small daily practice should be easy to keep returning to.",
        storyThreeBody: "MirType values the feeling of starting lightly, finishing the sentence in front of you, and moving into the next round. Typing games, sentence learning, language-specific keyboards, and record-based practice will continue to grow step by step.",
        peopleKicker: "People",
        peopleTitle: "Creator",
        peopleSummary: "MirType begins as a small practice experience where typing and language learning move together.",
        roleCeo: "CEO"
      },
      footer: {
        company: "Statground Co., Ltd.",
        ceo: "CEO and Privacy Officer: Jae-seong Yoo",
        business: "Business Registration No.: 795-88-02574",
        commerce: "Mail-order Business Report No.: 2024-Seoul Gangnam-06145",
        address: "402-106A, 12 Teheran-ro 70-gil, Gangnam-gu, Seoul, Republic of Korea",
        phone: "Main phone: 0507-1300-9704"
      }
    },
    ru: {
      htmlLang: "ru",
      metaTitleIntro: "О MirType",
      metaDescriptionIntro: "О MirType, сервисе для тренировки печати и изучения языков одновременно",
      brand: {
        homeAria: "Главная MirType",
        tagline: "Тренировка печати и изучение языков вместе"
      },
      aria: {
        menu: "Меню MirType",
        openMenu: "Открыть меню",
        closeMenu: "Закрыть меню",
        introMain: "О MirType",
        introToc: "Разделы о MirType",
        peopleSocial: "Социальные ссылки Jae-seong Yoo"
      },
      nav: {
        seat: "Клавиши",
        word: "Слова",
        sentence: "Предложения",
        game: "Игры",
        keyboard: "Клавиатура",
        keyboardShort: "Клавиатура",
        history: "Последние записи",
        intro: "О MirType",
        statground: "Statground",
        webr: "Web-R"
      },
      mobile: {
        practice: "Тренировка",
        links: "Ссылки"
      },
      intro: {
        tocOverview: "Обзор",
        tocStory: "История",
        tocPeople: "Люди",
        kicker: "Тренировка печати + изучение языков",
        summary: "MirType — учебный сервис для тренировки печати и изучения языков одновременно. Он объединяет позиции клавиш, слова, предложения и раскладки клавиатуры в один поток, помогая привыкать к вводу корейского, английского, русского и других письменностей. Сайт планируется оставить бесплатным на всю жизнь, чтобы людям по всему миру было проще чувствовать себя уверенно в IT-среде.",
        ctaPractice: "Начать тренировку",
        ctaKeyboard: "Посмотреть клавиатуру",
        storyKicker: "История",
        storyTitle: "История MirType",
        storySummary: "Честно говоря, все началось как небольшой инструмент для личного изучения языков генеральным директором. Теперь MirType развивается как открытое пространство, где любой может спокойно тренировать печать и язык вместе.",
        storyOneTitle: "Время тренировки печати может быть временем изучения языка.",
        storyOneBody: "MirType идет дальше простой скорости печати и связывает восприятие символов, движение пальцев и изучение языка. Сервис начинается с позиций клавиш, затем переходит к словам и предложениям, помогая привыкнуть к раскладке и ритму нового языка.",
        storyTwoTitle: "Один и тот же учебный поток должен сохраняться на ПК и мобильных устройствах.",
        storyTwoBody: "На ПК MirType учитывает физическую клавиатуру и широкий экран. На мобильных устройствах — сенсорный ввод и место, которое занимает виртуальная клавиатура. Область текста, курсор, панель клавиатуры и результаты могут перестраиваться, но основной поток тренировки не должен прерываться.",
        storyThreeTitle: "К небольшой ежедневной тренировке должно быть легко возвращаться.",
        storyThreeBody: "MirType ценит ощущение легкого старта, завершения текущего предложения и перехода к следующему раунду. Игры, предложения, языковые клавиатуры и тренировка по записям будут развиваться постепенно.",
        peopleKicker: "Люди",
        peopleTitle: "Создатель",
        peopleSummary: "MirType начинается как небольшой опыт тренировки, где печать и изучение языка движутся вместе.",
        roleCeo: "CEO"
      },
      footer: {
        company: "Statground Co., Ltd.",
        ceo: "CEO и ответственный за защиту персональных данных: Jae-seong Yoo",
        business: "Регистрационный номер бизнеса: 795-88-02574",
        commerce: "Номер регистрации электронной торговли: 2024-Seoul Gangnam-06145",
        address: "402-106A, 12 Teheran-ro 70-gil, Gangnam-gu, Seoul, Republic of Korea",
        phone: "Основной телефон: 0507-1300-9704"
      }
    }
  };

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
      return;
    }
    fn();
  }

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function closeMobileMenu() {
    var menu = qs("#siteMobileMenu");
    var toggle = qs("[data-mobile-menu-toggle]");
    if (!menu) {
      return;
    }
    menu.classList.remove("is-open");
    document.body.classList.remove("mirtype-menu-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  function openMobileMenu() {
    var menu = qs("#siteMobileMenu");
    var toggle = qs("[data-mobile-menu-toggle]");
    if (!menu) {
      return;
    }
    menu.classList.add("is-open");
    document.body.classList.add("mirtype-menu-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
    }
  }

  function focusPracticeInput() {
    var input = qs("#typingInput");
    if (input && !input.disabled && !input.hidden) {
      input.focus();
    }
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function normalizeLanguage(value) {
    var normalized = String(value || "").toLowerCase().split("-")[0];
    return supportedLanguages.indexOf(normalized) >= 0 ? normalized : "ko";
  }

  function preferredLanguage() {
    var stored = "";
    try {
      var parsed = JSON.parse(window.localStorage.getItem(PREFERENCES_KEY) || "{}");
      stored = parsed.uiLanguage || parsed.nativeLanguage || "";
    } catch (error) {
      stored = "";
    }
    if (stored) {
      return normalizeLanguage(stored);
    }
    return normalizeLanguage(window.navigator && (window.navigator.language || window.navigator.userLanguage));
  }

  function valueAtPath(source, path) {
    return String(path || "").split(".").reduce(function (current, part) {
      return current && Object.prototype.hasOwnProperty.call(current, part) ? current[part] : "";
    }, source);
  }

  function setText(selector, value) {
    qsa(selector).forEach(function (node) {
      node.textContent = value;
    });
  }

  function localizeNodes(copy) {
    qsa("[data-shell-i18n]").forEach(function (node) {
      var value = valueAtPath(copy, node.getAttribute("data-shell-i18n"));
      if (value !== "") {
        node.textContent = value;
      }
    });
    qsa("[data-shell-i18n-aria]").forEach(function (node) {
      var value = valueAtPath(copy, node.getAttribute("data-shell-i18n-aria"));
      if (value !== "") {
        node.setAttribute("aria-label", value);
      }
    });
    qsa("[data-shell-i18n-title]").forEach(function (node) {
      var value = valueAtPath(copy, node.getAttribute("data-shell-i18n-title"));
      if (value !== "") {
        node.setAttribute("title", value);
      }
    });
  }

  function localizeIntroMeta(copy) {
    if (!qs(".intro-page")) {
      return;
    }
    document.title = copy.metaTitleIntro;
    var description = qs("meta[name='description']");
    var ogTitle = qs("meta[property='og:title']");
    var ogDescription = qs("meta[property='og:description']");
    if (description) {
      description.setAttribute("content", copy.metaDescriptionIntro);
    }
    if (ogTitle) {
      ogTitle.setAttribute("content", copy.metaTitleIntro);
    }
    if (ogDescription) {
      ogDescription.setAttribute("content", copy.metaDescriptionIntro);
    }
  }

  function applyShellLocale(language) {
    var key = normalizeLanguage(language || preferredLanguage());
    var copy = shellLocales[key] || shellLocales.ko;
    document.documentElement.lang = copy.htmlLang;
    localizeNodes(copy);
    localizeIntroMeta(copy);
    setText("[data-shell-mode='seat']", copy.nav.seat);
    setText("[data-shell-mode='word']", copy.nav.word);
    setText("[data-shell-mode='sentence']", copy.nav.sentence);
    setText("[data-shell-mode='game']", copy.nav.game);
    setText("[data-shell-mode='keyboard']", copy.nav.keyboard);
    return key;
  }

  window.MirtypeShellLocale = {
    apply: applyShellLocale,
    preferredLanguage: preferredLanguage
  };

  ready(function () {
    var toggle = qs("[data-mobile-menu-toggle]");
    var close = qs("[data-mobile-menu-close]");
    var menu = qs("#siteMobileMenu");

    applyShellLocale();
    refreshIcons();

    if (toggle) {
      toggle.addEventListener("click", function () {
        if (menu && menu.classList.contains("is-open")) {
          closeMobileMenu();
        } else {
          openMobileMenu();
        }
      });
    }

    if (close) {
      close.addEventListener("click", closeMobileMenu);
    }

    if (menu) {
      menu.addEventListener("click", function (event) {
        if (event.target === menu || event.target.hasAttribute("data-mobile-menu-backdrop")) {
          closeMobileMenu();
        }
      });
    }

    qsa("#siteMobileMenu button, #siteMobileMenu a").forEach(function (node) {
      node.addEventListener("click", closeMobileMenu);
    });

    qsa("[data-focus-practice]").forEach(function (node) {
      node.addEventListener("click", focusPracticeInput);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });

    window.addEventListener("storage", function (event) {
      if (event.key === PREFERENCES_KEY) {
        applyShellLocale();
      }
    });
  });
})();
