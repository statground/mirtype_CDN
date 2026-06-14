(function () {
  "use strict";

  var STORAGE_KEY = "mirtype.results.v2";
  var PREFERENCES_KEY = "mirtype.preferences.v1";
  var supportedLanguages = ["ko", "en", "ru"];
  var locales = {
    ko: {
      htmlLang: "ko",
      restart: "새 연습 시작",
      aria: {
        menu: "연습 메뉴",
        settings: "연습 설정",
        uiLanguage: "내 언어",
        practiceLanguage: "연습할 언어",
        languageSetup: "언어 설정",
        lesson: "자리 단계",
        duration: "시간",
        game: "게임",
        stats: "연습 지표",
        practice: "타자연습",
        keyboard: "키보드 배치"
      },
      modes: {
        seat: "자리 연습",
        word: "단어 연습",
        sentence: "문장 연습",
        game: "타자게임",
        keyboard: "키보드 보기"
      },
      languageNames: { ko: "한국어", en: "영어", ru: "러시아어" },
      games: { rain: "산성비", invader: "침략자", mining: "자원 캐기" },
      gameHubKicker: "Game Select",
      gameHubTitle: "타자게임 선택",
      gameHubSummary: "산성비, 침략자, 자원 캐기 중에서 지금 연습할 게임을 고르세요.",
      gameDescriptions: {
        rain: "떨어지는 단어를 놓치기 전에 입력합니다.",
        invader: "앞에서 다가오는 단어를 순서대로 막습니다.",
        mining: "흩어진 자원을 찾아 단어를 입력합니다."
      },
      lessons: { home: "기본 자리", top: "윗자리", bottom: "아랫자리", number: "숫자", mixed: "전체" },
      durations: { "30": "30초", "60": "60초", "120": "120초", "0": "자유" },
      time: "소요 시간",
      timeLeft: "남은 시간",
      accuracy: "정확도",
      score: "점수",
      mistakes: "오타",
      misses: "실패",
      keyboardName: "두벌식 키보드",
      keyboardSuffix: "키보드",
      resultKicker: "결과",
      resultTitle: "연습 완료",
      historyTitle: "최근 기록",
      clearHistory: "비우기",
      emptyHistory: "아직 기록이 없습니다.",
      uiLanguageLabel: "내 언어",
      practiceLanguageLabel: "연습할 언어",
      languageSetupKicker: "Language Setup",
      languageSetupTitle: "언어 설정",
      languageSetupSummary: "타자 연습에 사용할 언어를 선택합니다.",
      languageSetupDone: "설정 저장",
      closeSettings: "설정 닫기",
      closeHistory: "기록 닫기",
      hideKeyboard: "키보드 숨기기",
      showKeyboard: "키보드 보이기",
      points: "점"
    },
    en: {
      htmlLang: "en",
      restart: "Start new practice",
      aria: {
        menu: "Practice menu",
        settings: "Practice settings",
        uiLanguage: "My language",
        practiceLanguage: "Practice language",
        languageSetup: "Language setup",
        lesson: "Key lesson",
        duration: "Time",
        game: "Game",
        stats: "Practice stats",
        practice: "Typing practice",
        keyboard: "Keyboard layout"
      },
      modes: {
        seat: "Key Practice",
        word: "Word Practice",
        sentence: "Sentence Practice",
        game: "Typing Games",
        keyboard: "Keyboard View"
      },
      languageNames: { ko: "Korean", en: "English", ru: "Russian" },
      games: { rain: "Acid Rain", invader: "Invaders", mining: "Resource Mining" },
      gameHubKicker: "Game Select",
      gameHubTitle: "Choose a Typing Game",
      gameHubSummary: "Pick Acid Rain, Invaders, or Resource Mining for this round.",
      gameDescriptions: {
        rain: "Type falling words before they reach the ground.",
        invader: "Clear incoming words in order before they pass you.",
        mining: "Find scattered resources by typing their words."
      },
      lessons: { home: "Home Row", top: "Top Row", bottom: "Bottom Row", number: "Numbers", mixed: "All Keys" },
      durations: { "30": "30s", "60": "60s", "120": "120s", "0": "Free" },
      time: "Elapsed",
      timeLeft: "Time Left",
      accuracy: "Accuracy",
      score: "Score",
      mistakes: "Mistakes",
      misses: "Misses",
      keyboardName: "QWERTY Keyboard",
      keyboardSuffix: "Keyboard",
      resultKicker: "Result",
      resultTitle: "Practice Complete",
      historyTitle: "Recent Records",
      clearHistory: "Clear",
      emptyHistory: "No records yet.",
      uiLanguageLabel: "My language",
      practiceLanguageLabel: "Practice language",
      languageSetupKicker: "Language Setup",
      languageSetupTitle: "Language Settings",
      languageSetupSummary: "Choose the language for typing practice.",
      languageSetupDone: "Save Settings",
      closeSettings: "Close settings",
      closeHistory: "Close records",
      hideKeyboard: "Hide Keyboard",
      showKeyboard: "Show Keyboard",
      points: "pts"
    },
    ru: {
      htmlLang: "ru",
      restart: "Начать заново",
      aria: {
        menu: "Меню тренировки",
        settings: "Настройки тренировки",
        uiLanguage: "Мой язык",
        practiceLanguage: "Язык тренировки",
        languageSetup: "Настройка языка",
        lesson: "Урок клавиш",
        duration: "Время",
        game: "Игра",
        stats: "Показатели тренировки",
        practice: "Тренировка печати",
        keyboard: "Раскладка клавиатуры"
      },
      modes: {
        seat: "Клавиши",
        word: "Слова",
        sentence: "Предложения",
        game: "Игры",
        keyboard: "Клавиатура"
      },
      languageNames: { ko: "Корейский", en: "Английский", ru: "Русский" },
      games: { rain: "Кислотный дождь", invader: "Захватчики", mining: "Добыча ресурсов" },
      gameHubKicker: "Выбор игры",
      gameHubTitle: "Выберите игру",
      gameHubSummary: "Выберите кислотный дождь, захватчиков или добычу ресурсов.",
      gameDescriptions: {
        rain: "Печатайте падающие слова, пока они не достигли земли.",
        invader: "Останавливайте приближающиеся слова по порядку.",
        mining: "Находите ресурсы, набирая их слова."
      },
      lessons: { home: "Основной ряд", top: "Верхний ряд", bottom: "Нижний ряд", number: "Цифры", mixed: "Все клавиши" },
      durations: { "30": "30 с", "60": "60 с", "120": "120 с", "0": "Свободно" },
      time: "Время",
      timeLeft: "Осталось",
      accuracy: "Точность",
      score: "Счет",
      mistakes: "Ошибки",
      misses: "Пропуски",
      keyboardName: "Клавиатура ЙЦУКЕН",
      keyboardSuffix: "Клавиатура",
      resultKicker: "Результат",
      resultTitle: "Тренировка завершена",
      historyTitle: "Последние записи",
      clearHistory: "Очистить",
      emptyHistory: "Записей пока нет.",
      uiLanguageLabel: "Мой язык",
      practiceLanguageLabel: "Язык тренировки",
      languageSetupKicker: "Настройка языка",
      languageSetupTitle: "Настройки языка",
      languageSetupSummary: "Выберите язык для тренировки печати.",
      languageSetupDone: "Сохранить",
      closeSettings: "Закрыть настройки",
      closeHistory: "Закрыть записи",
      hideKeyboard: "Скрыть клавиатуру",
      showKeyboard: "Показать клавиатуру",
      points: "очк."
    }
  };

  var keyboardRows = [
    [
      ["Backquote", "`", "~"], ["Digit1", "1", "!"], ["Digit2", "2", "@"], ["Digit3", "3", "#"],
      ["Digit4", "4", "$"], ["Digit5", "5", "%"], ["Digit6", "6", "^"], ["Digit7", "7", "&"],
      ["Digit8", "8", "*"], ["Digit9", "9", "("], ["Digit0", "0", ")"], ["Minus", "-", "_"],
      ["Equal", "=", "+"], ["Backspace", "⌫", "", "is-wide"]
    ],
    [
      ["Tab", "Tab", "", "is-wide"], ["KeyQ", "Q"], ["KeyW", "W"], ["KeyE", "E"], ["KeyR", "R"],
      ["KeyT", "T"], ["KeyY", "Y"], ["KeyU", "U"], ["KeyI", "I"], ["KeyO", "O"], ["KeyP", "P"],
      ["BracketLeft", "[", "{"], ["BracketRight", "]", "}"], ["Backslash", "\\", "|"]
    ],
    [
      ["CapsLock", "Caps", "", "is-wide"], ["KeyA", "A"], ["KeyS", "S"], ["KeyD", "D"], ["KeyF", "F"],
      ["KeyG", "G"], ["KeyH", "H"], ["KeyJ", "J"], ["KeyK", "K"], ["KeyL", "L"],
      ["Semicolon", ";", ":"], ["Quote", "'", "\""], ["Enter", "Enter", "", "is-wide"]
    ],
    [
      ["ShiftLeft", "Shift", "", "is-wide"], ["KeyZ", "Z"], ["KeyX", "X"], ["KeyC", "C"], ["KeyV", "V"],
      ["KeyB", "B"], ["KeyN", "N"], ["KeyM", "M"], ["Comma", ",", "<"], ["Period", ".", ">"],
      ["Slash", "/", "?"], ["ShiftRight", "Shift", "", "is-wide"]
    ],
    [
      ["ControlLeft", "Ctrl"], ["AltLeft", "Alt"], ["Space", "Space", "", "is-space"], ["AltRight", "Alt"],
      ["ControlRight", "Ctrl"]
    ]
  ];

  var languageKeyLabels = {
    ko: {
      KeyQ: "ㅂ", KeyW: "ㅈ", KeyE: "ㄷ", KeyR: "ㄱ", KeyT: "ㅅ", KeyY: "ㅛ", KeyU: "ㅕ", KeyI: "ㅑ", KeyO: "ㅐ", KeyP: "ㅔ",
      KeyA: "ㅁ", KeyS: "ㄴ", KeyD: "ㅇ", KeyF: "ㄹ", KeyG: "ㅎ", KeyH: "ㅗ", KeyJ: "ㅓ", KeyK: "ㅏ", KeyL: "ㅣ",
      KeyZ: "ㅋ", KeyX: "ㅌ", KeyC: "ㅊ", KeyV: "ㅍ", KeyB: "ㅠ", KeyN: "ㅜ", KeyM: "ㅡ"
    },
    en: {},
    ru: {
      Backquote: ["ё", "Ё"],
      Digit1: ["1", "!"],
      Digit2: ["2", "\""],
      Digit3: ["3", "№"],
      Digit4: ["4", ";"],
      Digit5: ["5", "%"],
      Digit6: ["6", ":"],
      Digit7: ["7", "?"],
      Digit8: ["8", "*"],
      Digit9: ["9", "("],
      Digit0: ["0", ")"],
      Minus: ["-", "_"],
      Equal: ["=", "+"],
      KeyQ: ["й", "Й"],
      KeyW: ["ц", "Ц"],
      KeyE: ["у", "У"],
      KeyR: ["к", "К"],
      KeyT: ["е", "Е"],
      KeyY: ["н", "Н"],
      KeyU: ["г", "Г"],
      KeyI: ["ш", "Ш"],
      KeyO: ["щ", "Щ"],
      KeyP: ["з", "З"],
      BracketLeft: ["х", "Х"],
      BracketRight: ["ъ", "Ъ"],
      Backslash: ["\\", "/"],
      KeyA: ["ф", "Ф"],
      KeyS: ["ы", "Ы"],
      KeyD: ["в", "В"],
      KeyF: ["а", "А"],
      KeyG: ["п", "П"],
      KeyH: ["р", "Р"],
      KeyJ: ["о", "О"],
      KeyK: ["л", "Л"],
      KeyL: ["д", "Д"],
      Semicolon: ["ж", "Ж"],
      Quote: ["э", "Э"],
      KeyZ: ["я", "Я"],
      KeyX: ["ч", "Ч"],
      KeyC: ["с", "С"],
      KeyV: ["м", "М"],
      KeyB: ["и", "И"],
      KeyN: ["т", "Т"],
      KeyM: ["ь", "Ь"],
      Comma: ["б", "Б"],
      Period: ["ю", "Ю"],
      Slash: [".", ","]
    }
  };

  var data = buildContent();
  var modePaths = {
    seat: "/seat/",
    word: "/word/",
    sentence: "/sentence/",
    game: "/game/",
    keyboard: "/keyboard/"
  };
  var gamePaths = {
    rain: "/game/rain/",
    invader: "/game/invader/",
    mining: "/game/mining/"
  };
  var fontScaleStep = 0.1;
  var fontScaleMin = 0.75;
  var fontScaleMax = 1.45;
  var elements = {};
  var state = {
    mode: "seat",
    uiLanguage: "ko",
    practiceLanguage: "ko",
    preferencesSaved: false,
    lesson: "home",
    duration: 0,
    game: "",
    target: "",
    units: [],
    startedAt: 0,
    finished: false,
    composing: false,
    compositionBase: "",
    compositionText: "",
    timerId: 0,
    score: 0,
    misses: 0,
    gameState: null,
    keyboardVisible: true,
    fontScales: {
      seat: 1,
      word: 1,
      sentence: 1,
      game: 1,
      keyboard: 1
    }
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    elements.appShell = document.querySelector(".app-shell");
    elements.restartButton = document.getElementById("restartButton");
    elements.modeTabs = document.querySelector(".mode-tabs");
    elements.toolbar = document.querySelector(".toolbar");
    elements.settingsPopover = document.getElementById("settingsPopover");
    elements.historyPopover = document.getElementById("historyPopover");
    elements.historyPopoverMount = document.getElementById("historyPopoverMount");
    elements.languageSetupKicker = document.getElementById("languageSetupKicker");
    elements.languageSetupTitle = document.getElementById("languageSetupTitle");
    elements.languageSetupSummary = document.getElementById("languageSetupSummary");
    elements.languageSetupDone = document.getElementById("languageSetupDone");
    elements.modeKicker = document.getElementById("modeKicker");
    elements.surfaceTitle = document.getElementById("surfaceTitle");
    elements.nextPreview = document.getElementById("nextPreview");
    elements.practiceSurface = document.getElementById("practiceSurface");
    elements.gamePicker = document.getElementById("gamePicker");
    elements.gamePickerKicker = document.getElementById("gamePickerKicker");
    elements.gamePickerTitle = document.getElementById("gamePickerTitle");
    elements.gamePickerSummary = document.getElementById("gamePickerSummary");
    elements.prompt = document.getElementById("promptDisplay");
    elements.gameStage = document.getElementById("gameStage");
    elements.input = document.getElementById("typingInput");
    elements.statsGrid = document.querySelector(".stats-grid");
    elements.timeLabel = document.getElementById("timeLabel");
    elements.time = document.getElementById("timeValue");
    elements.speedLabel = document.getElementById("speedLabel");
    elements.accuracyLabel = document.getElementById("accuracyLabel");
    elements.accuracy = document.getElementById("accuracyValue");
    elements.cpm = document.getElementById("cpmValue");
    elements.mistakeLabel = document.getElementById("mistakeLabel");
    elements.mistakes = document.getElementById("mistakeValue");
    elements.progress = document.getElementById("progressBar");
    elements.resultPanel = document.getElementById("resultPanel");
    elements.resultKicker = document.getElementById("resultKicker");
    elements.resultTitle = document.getElementById("resultTitle");
    elements.resultAccuracy = document.getElementById("resultAccuracy");
    elements.resultAccuracyLabel = document.getElementById("resultAccuracyLabel");
    elements.resultCpm = document.getElementById("resultCpm");
    elements.resultWpm = document.getElementById("resultWpm");
    elements.resultTime = document.getElementById("resultTime");
    elements.resultTimeLabel = document.getElementById("resultTimeLabel");
    elements.resultScore = document.getElementById("resultScore");
    elements.resultScoreLabel = document.getElementById("resultScoreLabel");
    elements.historyPanel = document.querySelector(".history-panel");
    elements.historyHome = elements.historyPanel && elements.historyPanel.parentNode ? document.createComment("mirtype-history-home") : null;
    if (elements.historyHome) {
      elements.historyPanel.parentNode.insertBefore(elements.historyHome, elements.historyPanel);
    }
    elements.historyTitle = document.getElementById("historyTitle");
    elements.history = document.getElementById("historyList");
    elements.clearHistoryButton = document.getElementById("clearHistoryButton");
    elements.lessonControls = document.getElementById("lessonControls");
    elements.durationControls = document.getElementById("durationControls");
    elements.gameControls = document.getElementById("gameControls");
    elements.keyboardPanel = document.getElementById("keyboardPanel");
    elements.keyboard = document.getElementById("keyboard");
    elements.keyboardTitle = document.getElementById("keyboardTitle");
    elements.lastKey = document.getElementById("lastKeyValue");
    elements.keyboardToggleButton = document.getElementById("keyboardToggleButton");

    loadPreferences();
    state.mode = getInitialMode();
    state.game = state.mode === "game" ? getInitialGame() : "";

    bindButtons();
    syncLanguageButtons();
    applyLocale();
    applyFontScale();
    applyKeyboardVisibility();
    renderKeyboard();
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("resize", applyFontScale);
    window.addEventListener("popstate", function () {
      var nextMode = modeFromPath(window.location.pathname) || "seat";
      setMode(nextMode, false, { game: nextMode === "game" ? gameFromPath(window.location.pathname) : "" });
    });
    resetPractice();
    renderHistory();
  }

  function getInitialMode() {
    var mode = elements.appShell ? elements.appShell.dataset.initialMode : "";
    if (modePaths[mode]) {
      return mode;
    }
    return modeFromPath(window.location.pathname) || "seat";
  }

  function getInitialGame() {
    var game = elements.appShell ? elements.appShell.dataset.initialGame : "";
    if (isValidGame(game)) {
      return game;
    }
    return gameFromPath(window.location.pathname);
  }

  function modeFromPath(path) {
    var normalized = path || "/";
    if (normalized === "/") {
      return "seat";
    }
    if (normalized === "/game/" || gameFromPath(normalized)) {
      return "game";
    }
    return Object.keys(modePaths).find(function (mode) {
      return modePaths[mode] === normalized;
    }) || "";
  }

  function gameFromPath(path) {
    var normalized = path || "";
    return Object.keys(gamePaths).find(function (game) {
      return gamePaths[game] === normalized;
    }) || "";
  }

  function isValidGame(game) {
    return Object.prototype.hasOwnProperty.call(gamePaths, game);
  }

  function pathForMode(mode) {
    return modePaths[mode] || "/";
  }

  function pathForGame(game) {
    return gamePaths[game] || modePaths.game;
  }

  function setMode(mode, updateURL, options) {
    options = options || {};
    if (!modePaths[mode]) {
      return;
    }
    state.mode = mode;
    state.game = mode === "game" && isValidGame(options.game) ? options.game : "";
    syncActiveButton("[data-mode]", state.mode);
    syncActiveButton("[data-game]", state.game);
    if (updateURL && window.history && window.history.pushState) {
      var nextPath = state.mode === "game" && state.game ? pathForGame(state.game) : pathForMode(mode);
      if (window.location.pathname !== nextPath) {
        window.history.pushState({ mode: mode, game: state.game }, "", nextPath);
      }
    }
    resetPractice();
  }

  function bindButtons() {
    document.querySelectorAll("[data-mode]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        if (button.tagName === "A" && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
          return;
        }
        if (button.tagName === "A") {
          event.preventDefault();
        }
        setMode(button.dataset.mode, true);
      });
    });
    document.querySelectorAll("[data-font-size]").forEach(function (button) {
      button.addEventListener("click", function () {
        adjustFontScale(button.dataset.fontSize === "up" ? 1 : -1);
      });
    });
    if (elements.keyboardToggleButton) {
      elements.keyboardToggleButton.addEventListener("click", function () {
        state.keyboardVisible = !state.keyboardVisible;
        applyKeyboardVisibility();
        elements.input.focus();
      });
    }
    document.querySelectorAll("[data-history-toggle]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        setHistoryOpen(!elements.historyPopover || elements.historyPopover.hidden);
      });
    });
    document.querySelectorAll("[data-history-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        setHistoryOpen(false);
        elements.input.focus();
      });
    });
    document.querySelectorAll("[data-settings-toggle]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.stopPropagation();
        setSettingsOpen(!elements.settingsPopover || elements.settingsPopover.hidden);
      });
    });
    document.querySelectorAll("[data-settings-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        setSettingsOpen(false);
        elements.input.focus();
      });
    });
    document.querySelectorAll("[data-ui-language]").forEach(function (button) {
      button.addEventListener("click", function () {
        setUiLanguage(button.dataset.uiLanguage, true);
        if (button.hasAttribute("data-ui-language-option") && window.MirtypeLanguagePicker && typeof window.MirtypeLanguagePicker.close === "function") {
          window.MirtypeLanguagePicker.close();
        }
      });
    });
    document.querySelectorAll("[data-practice-language]").forEach(function (button) {
      button.addEventListener("click", function () {
        setPracticeLanguage(button.dataset.practiceLanguage, true);
      });
    });
    document.querySelectorAll("[data-language]").forEach(function (button) {
      button.addEventListener("click", function () {
        setPracticeLanguage(button.dataset.language, true);
      });
    });
    if (elements.languageSetupDone) {
      elements.languageSetupDone.addEventListener("click", function () {
        state.preferencesSaved = true;
        savePreferences();
        setSettingsOpen(false);
        elements.input.focus();
      });
    }
    document.querySelectorAll("[data-language-ready]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.preferencesSaved = true;
        savePreferences();
        setSettingsOpen(false);
        applyLocale();
        renderKeyboard();
        elements.input.focus();
      });
    });
    document.querySelectorAll("[data-lesson]").forEach(function (button) {
      button.addEventListener("click", function () {
        state.lesson = button.dataset.lesson;
        syncActiveButton("[data-lesson]", state.lesson);
        resetPractice();
      });
    });
    document.querySelectorAll("[data-game]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        if (button.tagName === "A" && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)) {
          return;
        }
        if (button.tagName === "A") {
          event.preventDefault();
        }
        setMode("game", true, { game: button.dataset.game });
      });
    });

    elements.restartButton.addEventListener("click", resetPractice);
    elements.clearHistoryButton.addEventListener("click", clearHistory);
    document.addEventListener("click", function (event) {
      if (elements.settingsPopover && !elements.settingsPopover.hidden) {
        if (!closestElement(event.target, ".settings-popover-panel") && !closestElement(event.target, "[data-settings-toggle]")) {
          setSettingsOpen(false);
        }
      }
      if (elements.historyPopover && !elements.historyPopover.hidden) {
        if (!closestElement(event.target, ".history-popover-panel") && !closestElement(event.target, "[data-history-toggle]")) {
          setHistoryOpen(false);
        }
      }
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setSettingsOpen(false);
        setHistoryOpen(false);
      }
    });
    elements.input.addEventListener("compositionstart", function () {
      state.composing = true;
      state.compositionBase = elements.input.value;
      state.compositionText = "";
    });
    elements.input.addEventListener("compositionupdate", function (event) {
      state.composing = true;
      state.compositionText = readCompositionText(event);
      updatePractice();
    });
    elements.input.addEventListener("compositionend", function () {
      state.composing = false;
      state.compositionBase = "";
      state.compositionText = "";
      updatePractice();
    });
    elements.input.addEventListener("input", function (event) {
      if (state.composing || event.isComposing) {
        state.compositionText = state.compositionText || readCompositionText(event);
      }
      updatePractice();
    });
  }

  function closestElement(target, selector) {
    if (!target || typeof target.closest !== "function") {
      return null;
    }
    return target.closest(selector);
  }

  function syncActiveButton(selector, value) {
    document.querySelectorAll(selector).forEach(function (button) {
      var buttonValue = button.dataset.mode || button.dataset.uiLanguage || button.dataset.practiceLanguage || button.dataset.language || button.dataset.lesson || button.dataset.duration || button.dataset.game;
      var active = buttonValue === value;
      button.classList.toggle("is-active", active);
      if (button.dataset.mode || button.dataset.game) {
        if (active && button.tagName === "A") {
          button.setAttribute("aria-current", "page");
        } else {
          button.removeAttribute("aria-current");
        }
      }
    });
  }

  function syncLanguageButtons() {
    syncActiveButton("[data-ui-language]", state.uiLanguage);
    syncActiveButton("[data-practice-language]", state.practiceLanguage);
    syncActiveButton("[data-language]", state.practiceLanguage);
    if (window.MirtypeLanguagePicker && typeof window.MirtypeLanguagePicker.sync === "function") {
      window.MirtypeLanguagePicker.sync(state.uiLanguage, state.practiceLanguage);
    }
  }

  function setUiLanguage(value, persist) {
    var next = normalizeLanguage(value, state.uiLanguage);
    if (state.uiLanguage === next && persist) {
      state.preferencesSaved = true;
      savePreferences();
      return;
    }
    state.uiLanguage = next;
    syncLanguageButtons();
    applyLocale();
    renderKeyboard();
    if (persist) {
      state.preferencesSaved = true;
      savePreferences();
    }
  }

  function setPracticeLanguage(value, persist) {
    var next = normalizeLanguage(value, state.practiceLanguage);
    if (state.practiceLanguage === next && persist) {
      state.preferencesSaved = true;
      savePreferences();
      return;
    }
    state.practiceLanguage = next;
    syncLanguageButtons();
    renderKeyboard();
    resetPractice();
    if (persist) {
      state.preferencesSaved = true;
      savePreferences();
    }
  }

  function setSettingsOpen(open) {
    if (!elements.settingsPopover) {
      return;
    }
    if (open) {
      setHistoryOpen(false);
    }
    elements.settingsPopover.hidden = !open;
    document.querySelectorAll("[data-settings-toggle]").forEach(function (button) {
      button.setAttribute("aria-expanded", String(open));
    });
  }

  function setHistoryOpen(open) {
    if (!elements.historyPopover || !elements.historyPopoverMount || !elements.historyPanel) {
      return;
    }
    if (open) {
      setSettingsOpen(false);
      renderHistory();
      elements.historyPopoverMount.appendChild(elements.historyPanel);
      elements.historyPanel.hidden = false;
      elements.historyPopover.hidden = false;
    } else {
      elements.historyPopover.hidden = true;
      elements.historyPanel.hidden = true;
      if (elements.historyHome && elements.historyHome.parentNode && elements.historyPanel.parentNode === elements.historyPopoverMount) {
        elements.historyHome.parentNode.insertBefore(elements.historyPanel, elements.historyHome.nextSibling);
      }
    }
    document.querySelectorAll("[data-history-toggle]").forEach(function (button) {
      button.setAttribute("aria-expanded", String(open));
    });
  }

  function normalizeLanguage(value, fallback) {
    var normalized = String(value || "").toLowerCase().split("-")[0];
    return supportedLanguages.indexOf(normalized) >= 0 ? normalized : (fallback || "ko");
  }

  function detectBrowserLanguage() {
    var candidates = [];
    if (window.navigator) {
      if (Array.isArray(window.navigator.languages)) {
        candidates = candidates.concat(window.navigator.languages);
      }
      if (window.navigator.language) {
        candidates.push(window.navigator.language);
      }
    }
    for (var i = 0; i < candidates.length; i += 1) {
      var normalized = normalizeLanguage(candidates[i], "");
      if (normalized) {
        return normalized;
      }
    }
    return "ko";
  }

  function loadPreferences() {
    var fallback = detectBrowserLanguage();
    state.uiLanguage = fallback;
    state.practiceLanguage = fallback;
    try {
      var raw = window.localStorage.getItem(PREFERENCES_KEY);
      if (!raw) {
        return;
      }
      var parsed = JSON.parse(raw);
      state.uiLanguage = normalizeLanguage(parsed.uiLanguage || parsed.nativeLanguage || parsed.language, fallback);
      state.practiceLanguage = normalizeLanguage(parsed.practiceLanguage || parsed.targetLanguage || parsed.language, state.uiLanguage);
      state.preferencesSaved = true;
    } catch (error) {
      state.uiLanguage = fallback;
      state.practiceLanguage = fallback;
      state.preferencesSaved = false;
    }
  }

  function savePreferences() {
    try {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify({
        nativeLanguage: state.uiLanguage,
        uiLanguage: state.uiLanguage,
        practiceLanguage: state.practiceLanguage
      }));
    } catch (error) {
      // Private browsing or storage quota errors should not block practice.
    }
  }

  function practiceLanguageKey() {
    return data[state.practiceLanguage] ? state.practiceLanguage : "ko";
  }

  function practiceData() {
    return data[practiceLanguageKey()] || data.ko;
  }

  function languageLabel(value) {
    var key = normalizeLanguage(value, practiceLanguageKey());
    var names = locale().languageNames || {};
    return names[key] || (data[key] && data[key].label) || key;
  }

  function locale() {
    return locales[state.uiLanguage] || locales.ko;
  }

  function applyLocale() {
    var copy = locale();
    document.documentElement.lang = copy.htmlLang;
    elements.restartButton.setAttribute("aria-label", copy.restart);
    elements.restartButton.title = copy.restart;
    elements.modeTabs.setAttribute("aria-label", copy.aria.menu);
    elements.toolbar.setAttribute("aria-label", copy.aria.settings);
    document.querySelectorAll("[data-language-control='ui']").forEach(function (node) {
      node.setAttribute("aria-label", copy.aria.uiLanguage);
    });
    document.querySelectorAll("[data-language-control='practice']").forEach(function (node) {
      node.setAttribute("aria-label", copy.aria.practiceLanguage);
    });
    if (elements.settingsPopover) {
      elements.settingsPopover.setAttribute("aria-label", copy.aria.languageSetup);
    }
    document.querySelectorAll("[data-settings-toggle]").forEach(function (button) {
      button.setAttribute("aria-label", copy.aria.languageSetup);
      button.title = copy.aria.languageSetup;
    });
    document.querySelectorAll("[data-settings-close]").forEach(function (button) {
      button.setAttribute("aria-label", copy.closeSettings);
      button.title = copy.closeSettings;
    });
    document.querySelectorAll("[data-history-toggle]").forEach(function (button) {
      button.setAttribute("aria-label", copy.historyTitle);
      button.title = copy.historyTitle;
    });
    document.querySelectorAll("[data-history-close]").forEach(function (button) {
      button.setAttribute("aria-label", copy.closeHistory);
      button.title = copy.closeHistory;
    });
    elements.lessonControls.setAttribute("aria-label", copy.aria.lesson);
    if (elements.durationControls) {
      elements.durationControls.setAttribute("aria-label", copy.aria.duration);
    }
    elements.gameControls.setAttribute("aria-label", copy.aria.game);
    document.querySelector(".stats-grid").setAttribute("aria-label", copy.aria.stats);
    elements.practiceSurface.setAttribute("aria-label", copy.aria.practice);
    elements.keyboardPanel.setAttribute("aria-label", copy.aria.keyboard);

    setButtonText("[data-mode]", copy.modes);
    setButtonText("[data-lesson]", copy.lessons);
    setButtonText("[data-game]", copy.games);
    renderGamePickerCopy(copy);

    elements.accuracyLabel.textContent = copy.accuracy;
    elements.resultKicker.textContent = copy.resultKicker;
    elements.resultTitle.textContent = copy.resultTitle;
    elements.resultAccuracyLabel.textContent = copy.accuracy;
    if (elements.resultTimeLabel) {
      elements.resultTimeLabel.textContent = copy.time;
    }
    elements.resultScoreLabel.textContent = copy.score;
    elements.historyTitle.textContent = copy.historyTitle;
    elements.clearHistoryButton.textContent = copy.clearHistory;
    setText("[data-ui-language-label]", copy.uiLanguageLabel);
    setText("[data-practice-language-label]", copy.practiceLanguageLabel);
    if (elements.languageSetupKicker) {
      elements.languageSetupKicker.textContent = copy.languageSetupKicker;
    }
    if (elements.languageSetupTitle) {
      elements.languageSetupTitle.textContent = copy.languageSetupTitle;
    }
    if (elements.languageSetupSummary) {
      elements.languageSetupSummary.textContent = copy.languageSetupSummary;
    }
    if (elements.languageSetupDone) {
      elements.languageSetupDone.textContent = copy.languageSetupDone;
    }
    refreshRuntimeCopy(copy);
    applyKeyboardVisibility();
    renderHistory();
    if (window.MirtypeShellLocale && typeof window.MirtypeShellLocale.apply === "function") {
      window.MirtypeShellLocale.apply(state.uiLanguage);
    }
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = text;
    });
  }

  function setButtonText(selector, labels) {
    document.querySelectorAll(selector).forEach(function (button) {
      var key = button.dataset.mode || button.dataset.lesson || button.dataset.game || button.dataset.duration;
      if (labels[key]) {
        button.textContent = labels[key];
      }
    });
  }

  function renderGamePickerCopy(copy) {
    if (!elements.gamePicker) {
      return;
    }
    if (elements.gamePickerKicker) {
      elements.gamePickerKicker.textContent = copy.gameHubKicker;
    }
    if (elements.gamePickerTitle) {
      elements.gamePickerTitle.textContent = copy.gameHubTitle;
    }
    if (elements.gamePickerSummary) {
      elements.gamePickerSummary.textContent = copy.gameHubSummary;
    }
    document.querySelectorAll("[data-game-card-title]").forEach(function (node) {
      var key = node.dataset.gameCardTitle;
      node.textContent = copy.games[key] || key;
    });
    document.querySelectorAll("[data-game-card-summary]").forEach(function (node) {
      var key = node.dataset.gameCardSummary;
      node.textContent = copy.gameDescriptions[key] || "";
    });
  }

  function refreshRuntimeCopy(copy) {
    copy = copy || locale();
    if (elements.modeKicker) {
      elements.modeKicker.textContent = copy.modes[state.mode];
    }
    if (elements.surfaceTitle) {
      elements.surfaceTitle.textContent = getSurfaceTitle();
    }
    if (elements.timeLabel) {
      elements.timeLabel.textContent = copy.time;
    }
    if (elements.speedLabel) {
      elements.speedLabel.textContent = state.mode === "game" ? copy.score : "CPM";
    }
    if (elements.mistakeLabel) {
      elements.mistakeLabel.textContent = state.mode === "game" ? copy.misses : copy.mistakes;
    }
  }

  function adjustFontScale(direction) {
    var current = state.fontScales[state.mode] || 1;
    var next = current + (direction * fontScaleStep);
    state.fontScales[state.mode] = Math.max(fontScaleMin, Math.min(fontScaleMax, Math.round(next * 100) / 100));
    applyFontScale();
    if (state.mode === "keyboard") {
      renderFreePrompt(currentTypedValue());
    } else if (state.mode !== "game") {
      renderPrompt(currentTypedValue());
    }
    elements.input.focus();
  }

  function applyFontScale() {
    if (!elements.prompt) {
      return;
    }
    var scale = state.fontScales[state.mode] || 1;
    elements.prompt.style.removeProperty("font-size");
    elements.gameStage.style.removeProperty("font-size");
    if (Math.abs(scale - 1) < 0.01) {
      return;
    }
    var promptSize = window.getComputedStyle(elements.prompt).fontSize;
    var gameSize = window.getComputedStyle(elements.gameStage).fontSize;
    elements.prompt.style.fontSize = scaledPixelSize(promptSize, scale);
    elements.gameStage.style.fontSize = scaledPixelSize(gameSize, scale);
  }

  function scaledPixelSize(value, scale) {
    var numeric = parseFloat(value);
    if (!Number.isFinite(numeric) || numeric <= 0) {
      numeric = 16;
    }
    return Math.round(numeric * scale * 100) / 100 + "px";
  }

  function applyKeyboardVisibility() {
    if (!elements.keyboardPanel) {
      return;
    }
    elements.keyboardPanel.hidden = (state.mode === "game" && !state.game) || !state.keyboardVisible;
    if (elements.keyboardToggleButton) {
      var copy = locale();
      elements.keyboardToggleButton.textContent = state.keyboardVisible ? copy.hideKeyboard : copy.showKeyboard;
      elements.keyboardToggleButton.setAttribute("aria-pressed", String(state.keyboardVisible));
    }
  }

  function resetPractice() {
    stopTimer();
    state.startedAt = 0;
    state.finished = false;
    state.composing = false;
    state.compositionBase = "";
    state.compositionText = "";
    state.score = 0;
    state.misses = 0;
    state.gameState = null;
    elements.input.value = "";
    elements.input.disabled = false;
    setHistoryOpen(false);
    hideCompletionPopup();
    var copy = locale();
    var isGameHub = state.mode === "game" && !state.game;
    setGameHubVisible(isGameHub);
    elements.prompt.classList.toggle("is-long", state.mode === "sentence");
    elements.prompt.classList.toggle("is-free", state.mode === "keyboard");
    elements.gameStage.classList.toggle("is-active", state.mode === "game" && !isGameHub);
    elements.prompt.hidden = state.mode === "game";
    elements.input.hidden = false;
    elements.lessonControls.hidden = state.mode !== "seat";
    if (elements.durationControls) {
      elements.durationControls.hidden = true;
    }
    elements.gameControls.hidden = state.mode !== "game" || isGameHub;
    applyFontScale();
    applyKeyboardVisibility();
    elements.modeKicker.textContent = copy.modes[state.mode];
    elements.surfaceTitle.textContent = getSurfaceTitle();
    elements.nextPreview.textContent = "";
    elements.timeLabel.textContent = copy.time;
    elements.speedLabel.textContent = state.mode === "game" ? copy.score : "CPM";
    elements.mistakeLabel.textContent = state.mode === "game" ? copy.misses : copy.mistakes;

    clearTargetKeys();
    if (isGameHub) {
      state.target = "";
      state.units = [];
      elements.input.disabled = true;
      elements.gameStage.replaceChildren();
      elements.prompt.replaceChildren();
      elements.progress.style.width = "0%";
      updateStats(emptyMetrics());
      return;
    }
    if (state.mode === "game") {
      startGame();
    } else if (state.mode === "keyboard") {
      state.target = "";
      state.units = [];
      renderFreePrompt("");
      elements.gameStage.replaceChildren();
      updateStats(freeTypingMetrics(""));
      elements.progress.style.width = "0%";
      elements.input.focus();
    } else {
      state.target = buildTarget();
      renderPrompt("");
      updateStats(getMetrics(""));
      updateNextPreview("");
      highlightTargetKey();
      elements.input.focus();
    }
  }

  function setGameHubVisible(visible) {
    if (elements.gamePicker) {
      elements.gamePicker.hidden = !visible;
    }
    if (elements.statsGrid) {
      elements.statsGrid.hidden = visible;
    }
    if (elements.practiceSurface) {
      elements.practiceSurface.hidden = visible;
    }
  }

  function getSurfaceTitle() {
    var copy = locale();
    if (state.mode === "seat") {
      return copy.lessons[state.lesson];
    }
    if (state.mode === "game") {
      return state.game ? copy.games[state.game] : copy.gameHubTitle;
    }
    if (state.mode === "keyboard") {
      return getKeyboardTitle();
    }
    return copy.modes[state.mode];
  }

  function getKeyboardTitle() {
    var copy = locale();
    if (state.uiLanguage === state.practiceLanguage && copy.keyboardName) {
      return copy.keyboardName;
    }
    return languageLabel(practiceLanguageKey()) + " " + copy.keyboardSuffix;
  }

  function buildTarget() {
    if (state.mode === "seat") {
      state.units = buildSeatUnits();
      return state.units.join(" ");
    }
    if (state.mode === "word") {
      state.units = sample(practiceData().words, 36);
      return state.units.join(" ");
    }
    if (state.mode === "sentence") {
      return buildSentenceTarget();
    }
    state.units = [];
    return "";
  }

  function buildSentenceTarget() {
    var languageData = practiceData();
    var shortCount = 8;
    var longCount = 2;
    var shortUnits = sample(languageData.shorts, shortCount);
    var longUnits = sample(languageData.longs, longCount);
    state.units = shortUnits.concat(longUnits);
    return state.units.join("\n\n");
  }

  function buildSeatUnits() {
    var languageData = practiceData();
    var lessonSet = languageData.seat[state.lesson] || languageData.seat.mixed;
    var units = [];
    for (var i = 0; i < 5; i += 1) {
      units = units.concat(shuffle(lessonSet).slice(0, lessonSet.length));
    }
    return units.slice(0, state.lesson === "number" ? 42 : 54);
  }

  function updatePractice() {
    if (state.finished) {
      return;
    }
    if (state.mode === "keyboard") {
      updateFreeTyping();
      return;
    }
    if (state.mode === "game") {
      updateGameInput();
      return;
    }

    var typed = currentTypedValue();
    if (!state.startedAt && typed.length > 0) {
      state.startedAt = Date.now();
      startTimer();
    }

    renderPrompt(typed);
    var metrics = getMetrics(typed);
    updateStats(metrics);
    updateNextPreview(typed);
    highlightTargetKey(typed);

    if (!state.composing && typed === state.target) {
      finishPractice(metrics);
    }
  }

  function updateFreeTyping() {
    var typed = currentTypedValue();
    if (!state.startedAt && typed.length > 0) {
      state.startedAt = Date.now();
      startTimer();
    }
    renderFreePrompt(typed);
    updateStats(freeTypingMetrics(typed));
    clearTargetKeys();
  }

  function startTimer() {
    stopTimer();
    state.timerId = window.setInterval(function () {
      if (state.finished) {
        stopTimer();
        return;
      }
      if (state.mode === "game") {
        tickGame();
        return;
      }
      var typed = currentTypedValue();
      var metrics = state.mode === "keyboard" ? freeTypingMetrics(typed) : getMetrics(typed);
      updateStats(metrics);
    }, state.mode === "game" ? 180 : 250);
  }

  function stopTimer() {
    if (state.timerId) {
      window.clearInterval(state.timerId);
      state.timerId = 0;
    }
  }

  function finishPractice(metrics) {
    if (state.finished) {
      return;
    }
    state.finished = true;
    stopTimer();
    elements.input.disabled = true;
    updateStats(metrics);
    saveResult(metrics);
    renderHistory();
    showResult(metrics);
    showHistoryPopup();
  }

  function getMetrics(typed) {
    var targetChars = Array.from(state.target);
    var typedChars = Array.from(typed);
    var correct = 0;
    var mistakes = 0;

    typedChars.forEach(function (char, index) {
      if (char === targetChars[index]) {
        correct += 1;
      } else {
        mistakes += 1;
      }
    });

    var elapsedSeconds = state.startedAt ? Math.max((Date.now() - state.startedAt) / 1000, 0.1) : 0;
    var minutes = Math.max(elapsedSeconds / 60, 1 / 60);
    var accuracy = typedChars.length ? Math.round((correct / typedChars.length) * 100) : 100;
    var cpm = state.startedAt ? Math.round(correct / minutes) : 0;
    var wpm = state.startedAt ? Math.round((correct / 5) / minutes) : 0;
    var progress = targetChars.length ? Math.min((typedChars.length / targetChars.length) * 100, 100) : 0;

    return {
      correct: correct,
      mistakes: mistakes,
      elapsedSeconds: elapsedSeconds,
      accuracy: accuracy,
      cpm: cpm,
      wpm: wpm,
      progress: progress,
      score: state.score
    };
  }

  function freeTypingMetrics(typed) {
    var typedLength = Array.from(typed || "").length;
    var elapsedSeconds = state.startedAt ? Math.max((Date.now() - state.startedAt) / 1000, 0.1) : 0;
    var minutes = Math.max(elapsedSeconds / 60, 1 / 60);
    var cpm = state.startedAt ? Math.round(typedLength / minutes) : 0;
    return {
      correct: typedLength,
      mistakes: 0,
      elapsedSeconds: elapsedSeconds,
      accuracy: 100,
      cpm: cpm,
      wpm: state.startedAt ? Math.round((typedLength / 5) / minutes) : 0,
      progress: 0,
      score: state.score
    };
  }

  function emptyMetrics() {
    return { correct: 0, mistakes: 0, elapsedSeconds: 0, accuracy: 100, cpm: 0, wpm: 0, progress: 0, score: state.score };
  }

  function updateStats(metrics) {
    var displaySeconds = Math.floor(metrics.elapsedSeconds);

    elements.time.textContent = formatSeconds(displaySeconds);
    elements.accuracy.textContent = metrics.accuracy + "%";
    elements.cpm.textContent = state.mode === "game" ? String(state.score) : String(metrics.cpm);
    elements.mistakes.textContent = state.mode === "game" ? String(state.misses) : String(metrics.mistakes);
    elements.progress.style.width = metrics.progress.toFixed(1) + "%";
  }

  function renderPrompt(typed) {
    var targetChars = Array.from(state.target);
    var typedChars = Array.from(typed);
    var fragment = document.createDocumentFragment();
    var maxLength = Math.max(targetChars.length, typedChars.length);

    for (var index = 0; index < maxLength; index += 1) {
      var span = document.createElement("span");
      var targetChar = targetChars[index];
      var typedChar = typedChars[index];

      span.className = "prompt-char";
      if (index >= targetChars.length) {
        span.classList.add("is-extra");
        appendPromptLayer(span, "typed", typedChar);
      } else {
        if (targetChar === "\n") {
          span.classList.add("is-linebreak");
        }
        appendPromptLayer(span, "ghost", targetChar);
        if (typedChar == null && index === typedChars.length && !state.finished) {
          span.classList.add("is-current");
        } else if (typedChar === targetChar) {
          span.classList.add("is-correct");
        } else if (typedChar != null) {
          span.classList.add("is-wrong");
        }
        if (typedChar != null) {
          span.classList.add("is-typed");
          appendPromptLayer(span, "typed", typedChar);
        }
      }
      fragment.appendChild(span);
    }

    elements.prompt.replaceChildren(fragment);
  }

  function renderFreePrompt(typed) {
    var typedChars = Array.from(typed || "");
    var fragment = document.createDocumentFragment();

    typedChars.forEach(function (typedChar) {
      var span = document.createElement("span");
      span.className = "prompt-char is-free-typed is-typed";
      if (typedChar === "\n") {
        span.classList.add("is-linebreak");
      }
      appendPromptLayer(span, "typed", typedChar);
      fragment.appendChild(span);
    });

    var caret = document.createElement("span");
    caret.className = "prompt-char is-current is-free-caret";
    appendPromptLayer(caret, "typed", "\u00a0");
    fragment.appendChild(caret);
    elements.prompt.replaceChildren(fragment);
  }

  function appendPromptLayer(parent, kind, charValue) {
    var layer = document.createElement("span");
    layer.className = "prompt-char__" + kind;
    layer.textContent = displayPromptChar(charValue);
    parent.appendChild(layer);
  }

  function displayPromptChar(charValue) {
    if (charValue === " ") {
      return "\u00a0";
    }
    if (charValue === "\n") {
      return "";
    }
    return charValue || "";
  }

  function updateNextPreview(typed) {
    var clean = normalize(typed);
    var nextUnit = "";
    if (state.mode === "word" || state.mode === "seat") {
      var typedUnits = clean.trim().split(/\s+/).filter(Boolean).length;
      nextUnit = state.units[typedUnits + 1] || "";
    }
    elements.nextPreview.textContent = nextUnit;
  }

  function showResult(metrics) {
    elements.resultAccuracy.textContent = metrics.accuracy + "%";
    elements.resultCpm.textContent = String(metrics.cpm);
    elements.resultWpm.textContent = String(metrics.wpm);
    if (elements.resultTime) {
      elements.resultTime.textContent = formatSeconds(Math.round(metrics.elapsedSeconds || 0));
    }
    elements.resultScore.textContent = String(metrics.score || state.score);
    elements.resultPanel.hidden = false;
  }

  function showHistoryPopup() {
    setHistoryOpen(false);
    var popup = ensureCompletionPopup();
    elements.historyPanel.hidden = false;
    popup.hidden = false;
    elements.practiceSurface.classList.add("has-completion");
    if (typeof elements.resultPanel.focus === "function") {
      elements.resultPanel.setAttribute("tabindex", "-1");
      elements.resultPanel.focus({ preventScroll: true });
    }
  }

  function ensureCompletionPopup() {
    if (elements.completionPopup) {
      return elements.completionPopup;
    }
    var popup = document.createElement("div");
    popup.className = "completion-popup";
    popup.hidden = true;
    popup.setAttribute("aria-live", "polite");
    popup.appendChild(elements.resultPanel);
    popup.appendChild(elements.historyPanel);
    elements.practiceSurface.appendChild(popup);
    elements.completionPopup = popup;
    return popup;
  }

  function hideCompletionPopup() {
    elements.practiceSurface.classList.remove("has-completion");
    if (elements.completionPopup) {
      elements.completionPopup.hidden = true;
    }
    elements.resultPanel.hidden = true;
    elements.historyPanel.hidden = true;
  }

  function saveResult(metrics) {
    var results = readResults();
    results.unshift({
      mode: state.mode,
      game: state.mode === "game" ? state.game : "",
      uiLanguage: state.uiLanguage,
      practiceLanguage: state.practiceLanguage,
      language: state.practiceLanguage,
      accuracy: metrics.accuracy,
      cpm: metrics.cpm,
      wpm: metrics.wpm,
      elapsedSeconds: Math.round(metrics.elapsedSeconds || 0),
      score: metrics.score || state.score,
      completedAt: new Date().toISOString()
    });
    writeResults(results.slice(0, 10));
  }

  function renderHistory() {
    var copy = locale();
    var results = readResults();
    elements.history.replaceChildren();

    if (!results.length) {
      var empty = document.createElement("li");
      empty.className = "empty-history";
      empty.textContent = copy.emptyHistory;
      elements.history.appendChild(empty);
      return;
    }

    results.forEach(function (result) {
      var item = document.createElement("li");
      appendHistoryCell(item, historyModeLabel(result.mode, result.game) + " · " + historyLanguageLabel(result.practiceLanguage || result.language), true);
      appendHistoryCell(item, result.accuracy + "%", false);
      appendHistoryCell(item, result.cpm + " CPM", false);
      appendHistoryCell(item, result.wpm + " WPM", false);
      appendHistoryCell(item, formatSeconds(Math.round(result.elapsedSeconds || 0)), false);
      appendHistoryCell(item, (result.score || 0) + " " + copy.points, false);
      elements.history.appendChild(item);
    });
  }

  function historyModeLabel(value, game) {
    var copy = locale();
    var legacyModes = {
      "자리 연습": "seat",
      "단어 연습": "word",
      "단문 연습": "sentence",
      "장문 연습": "sentence",
      "타자게임": "game",
      "키보드 보기": "keyboard"
    };
    if ((value === "game" || value === "타자게임") && game && copy.games[game]) {
      return copy.modes.game + " · " + copy.games[game];
    }
    if (copy.modes[value]) {
      return copy.modes[value];
    }
    if (legacyModes[value]) {
      return copy.modes[legacyModes[value]];
    }
    return value || copy.modes.sentence;
  }

  function historyLanguageLabel(value) {
    var legacyLanguages = {
      "한국어": "ko",
      English: "en",
      "Русский": "ru"
    };
    if (data[value]) {
      return languageLabel(value);
    }
    if (legacyLanguages[value]) {
      return languageLabel(legacyLanguages[value]);
    }
    return value || languageLabel(practiceLanguageKey());
  }

  function appendHistoryCell(item, text, strong) {
    var cell = document.createElement(strong ? "strong" : "span");
    cell.textContent = text;
    item.appendChild(cell);
  }

  function clearHistory() {
    window.localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  }

  function readResults() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function writeResults(results) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    } catch (error) {
      // Private browsing or storage quota errors should not block practice.
    }
  }

  function startGame() {
    if (!state.game) {
      resetPractice();
      return;
    }
    state.startedAt = Date.now();
    elements.input.disabled = false;
    elements.input.hidden = false;
    elements.prompt.hidden = true;
    elements.gameStage.replaceChildren();
    elements.input.focus();
    if (state.game === "rain") {
      setupRain();
    } else if (state.game === "invader") {
      setupInvader();
    } else {
      setupMining();
    }
    startTimer();
    tickGame();
  }

  function setupRain() {
    state.gameState = { tokens: [], spawn: 0, last: Date.now() };
  }

  function setupInvader() {
    var words = sample(practiceData().words, 28);
    state.gameState = { words: words, total: words.length, x: 0, y: 0, dir: 1, step: 0 };
  }

  function setupMining() {
    var words = sample(practiceData().words, 25);
    state.gameState = { words: words, total: words.length, cpu: 0, step: 0 };
  }

  function tickGame() {
    if (!state.startedAt || state.finished) {
      return;
    }
    var elapsed = Math.max((Date.now() - state.startedAt) / 1000, 0.1);
    if (state.game === "rain") {
      tickRain(elapsed);
    } else if (state.game === "invader") {
      tickInvader(elapsed);
    } else {
      tickMining(elapsed);
    }
    updateStats(gameMetrics(elapsed));
  }

  function gameMetrics(elapsed) {
    var attempts = Math.max(state.score + state.misses, 1);
    var accuracy = Math.round((state.score / attempts) * 100);
    return {
      correct: state.score,
      mistakes: state.misses,
      elapsedSeconds: elapsed,
      accuracy: accuracy,
      cpm: Math.round(state.score / Math.max(elapsed / 60, 1 / 60)),
      wpm: Math.round((state.score / 5) / Math.max(elapsed / 60, 1 / 60)),
      progress: gameProgress(),
      score: state.score
    };
  }

  function gameProgress() {
    if (state.game === "rain") {
      return Math.min((state.misses / 10) * 100, 100);
    }
    if (state.gameState && state.gameState.total) {
      return Math.min((state.score / state.gameState.total) * 100, 100);
    }
    return 0;
  }

  function tickRain() {
    var gs = state.gameState;
    gs.spawn += 1;
    if (gs.spawn % 7 === 0 && gs.tokens.length < 12) {
      gs.tokens.push({
        text: sample(practiceData().words, 1)[0],
        x: Math.floor(Math.random() * 78),
        y: -8,
        speed: 1.4 + Math.random() * 1.8 + state.score * 0.025,
        special: Math.random() < 0.12
      });
    }
    gs.tokens.forEach(function (token) {
      token.y += token.speed;
    });
    gs.tokens = gs.tokens.filter(function (token) {
      if (token.y > 101) {
        state.misses += 1;
        return false;
      }
      return true;
    });
    if (state.misses >= 10) {
      finishPractice(gameMetrics(Math.max((Date.now() - state.startedAt) / 1000, 0.1)));
      return;
    }
    renderRain();
  }

  function renderRain() {
    elements.gameStage.replaceChildren();
    state.gameState.tokens.forEach(function (token) {
      var node = document.createElement("span");
      node.className = "game-token" + (token.special ? " is-special" : "");
      node.textContent = token.text;
      node.style.left = token.x + "%";
      node.style.top = token.y + "%";
      elements.gameStage.appendChild(node);
    });
  }

  function tickInvader() {
    var gs = state.gameState;
    gs.step += 1;
    if (gs.step % 3 === 0) {
      gs.x += gs.dir * 3;
      if (gs.x > 18 || gs.x < -18) {
        gs.dir *= -1;
        gs.y += 7;
      }
    }
    if (gs.y > 58) {
      state.misses = 10;
      finishPractice(gameMetrics(Math.max((Date.now() - state.startedAt) / 1000, 0.1)));
      return;
    }
    renderInvader();
  }

  function renderInvader() {
    var gs = state.gameState;
    elements.gameStage.replaceChildren();
    gs.words.forEach(function (word, index) {
      var node = document.createElement("span");
      node.className = "game-token" + (index === 0 ? " is-target" : "");
      node.textContent = word;
      node.style.left = (8 + (index % 7) * 12 + gs.x) + "%";
      node.style.top = (8 + Math.floor(index / 7) * 12 + gs.y) + "%";
      elements.gameStage.appendChild(node);
    });
    if (!gs.words.length) {
      setupInvader();
    }
  }

  function tickMining() {
    var gs = state.gameState;
    gs.step += 1;
    if (gs.step % Math.max(7, 20 - Math.floor(state.score / 3)) === 0 && gs.words.length) {
      var index = Math.floor(Math.random() * gs.words.length);
      gs.words.splice(index, 1);
      gs.cpu += 1;
      state.misses = gs.cpu;
    }
    if (!gs.words.length) {
      finishPractice(gameMetrics(Math.max((Date.now() - state.startedAt) / 1000, 0.1)));
      return;
    }
    renderMining();
  }

  function renderMining() {
    elements.gameStage.replaceChildren();
    var grid = document.createElement("div");
    grid.className = "mining-grid";
    state.gameState.words.forEach(function (word) {
      var node = document.createElement("span");
      node.className = "mining-cell";
      node.textContent = word;
      grid.appendChild(node);
    });
    elements.gameStage.appendChild(grid);
  }

  function updateGameInput() {
    var typed = currentTypedValue().trim();
    if (!typed) {
      return;
    }
    if (state.composing) {
      updateStats(gameMetrics(Math.max((Date.now() - state.startedAt) / 1000, 0.1)));
      return;
    }
    if (state.game === "rain") {
      var tokenIndex = state.gameState.tokens.findIndex(function (token) {
        return token.text === typed;
      });
      if (tokenIndex >= 0) {
        var token = state.gameState.tokens[tokenIndex];
        state.score += token.special ? 5 : 1;
        if (token.special) {
          state.gameState.tokens = [];
          state.misses = Math.max(0, state.misses - 2);
        } else {
          state.gameState.tokens.splice(tokenIndex, 1);
        }
        elements.input.value = "";
        renderRain();
      }
    } else if (state.game === "invader") {
      if (state.gameState.words[0] === typed) {
        state.gameState.words.shift();
        state.score += 2;
        elements.input.value = "";
        renderInvader();
      }
    } else {
      var index = state.gameState.words.indexOf(typed);
      if (index >= 0) {
        state.gameState.words.splice(index, 1);
        state.score += 1;
        elements.input.value = "";
        renderMining();
      }
    }
    updateStats(gameMetrics(Math.max((Date.now() - state.startedAt) / 1000, 0.1)));
  }

  function renderKeyboard() {
    var labels = languageKeyLabels[practiceLanguageKey()] || languageKeyLabels.ko;
    elements.keyboard.replaceChildren();
    elements.keyboardTitle.textContent = getKeyboardTitle();
    keyboardRows.forEach(function (row) {
      var rowNode = document.createElement("div");
      rowNode.className = "keyboard-row";
      row.forEach(function (key) {
        var code = key[0];
        var layoutLabel = labels[code];
        var primary = key[1];
        var secondary = key[2] || "";
        if (Array.isArray(layoutLabel)) {
          primary = layoutLabel[0];
          secondary = layoutLabel[1] || "";
        } else if (layoutLabel) {
          primary = layoutLabel;
          secondary = key[1];
        }
        var node = document.createElement("button");
        var label = document.createElement("span");
        node.type = "button";
        node.className = ("keycap " + (key[3] || "") + " key-" + code.toLowerCase()).trim();
        node.dataset.keyCode = code;
        label.textContent = primary;
        node.appendChild(label);
        if (secondary) {
          var hint = document.createElement("small");
          hint.textContent = secondary;
          node.appendChild(hint);
        }
        rowNode.appendChild(node);
      });
      elements.keyboard.appendChild(rowNode);
    });
  }

  function handleKeyDown(event) {
    var key = document.querySelector("[data-key-code='" + event.code + "']");
    if (key) {
      key.classList.add("is-pressed");
      elements.lastKey.textContent = key.innerText.replace(/\n/g, " ");
    }
  }

  function handleKeyUp(event) {
    var key = document.querySelector("[data-key-code='" + event.code + "']");
    if (key) {
      key.classList.remove("is-pressed");
    }
  }

  function clearTargetKeys() {
    document.querySelectorAll(".keycap.is-target").forEach(function (key) {
      key.classList.remove("is-target");
    });
  }

  function highlightTargetKey(typed) {
    clearTargetKeys();
    var nextChar = Array.from(state.target)[Array.from(typed || "").length];
    var code = charToCode(nextChar);
    if (!code) {
      return;
    }
    var key = document.querySelector("[data-key-code='" + code + "']");
    if (key) {
      key.classList.add("is-target");
    }
  }

  function charToCode(char) {
    if (!char) {
      return "";
    }
    var lower = char.toLowerCase();
    var koMap = {
      "ㅂ": "KeyQ", "ㅈ": "KeyW", "ㄷ": "KeyE", "ㄱ": "KeyR", "ㅅ": "KeyT", "ㅛ": "KeyY", "ㅕ": "KeyU", "ㅑ": "KeyI", "ㅐ": "KeyO", "ㅔ": "KeyP",
      "ㅁ": "KeyA", "ㄴ": "KeyS", "ㅇ": "KeyD", "ㄹ": "KeyF", "ㅎ": "KeyG", "ㅗ": "KeyH", "ㅓ": "KeyJ", "ㅏ": "KeyK", "ㅣ": "KeyL",
      "ㅋ": "KeyZ", "ㅌ": "KeyX", "ㅊ": "KeyC", "ㅍ": "KeyV", "ㅠ": "KeyB", "ㅜ": "KeyN", "ㅡ": "KeyM"
    };
    var ruMap = {
      "й": "KeyQ", "ц": "KeyW", "у": "KeyE", "к": "KeyR", "е": "KeyT", "н": "KeyY", "г": "KeyU", "ш": "KeyI", "щ": "KeyO", "з": "KeyP",
      "х": "BracketLeft", "ъ": "BracketRight", "ё": "Backquote",
      "ф": "KeyA", "ы": "KeyS", "в": "KeyD", "а": "KeyF", "п": "KeyG", "р": "KeyH", "о": "KeyJ", "л": "KeyK", "д": "KeyL",
      "ж": "Semicolon", "э": "Quote",
      "я": "KeyZ", "ч": "KeyX", "с": "KeyC", "м": "KeyV", "и": "KeyB", "т": "KeyN", "ь": "KeyM", "б": "Comma", "ю": "Period"
    };
    var ruPunctuationMap = {
      ".": "Slash", ",": "Slash", ";": "Digit4", ":": "Digit6", "?": "Digit7", "\"": "Digit2", "№": "Digit3",
      "!": "Digit1", "(": "Digit9", ")": "Digit0", "-": "Minus", "_": "Minus", "%": "Digit5", "*": "Digit8",
      "=": "Equal", "+": "Equal", "/": "Backslash", "\\": "Backslash"
    };
    var punctuationMap = {
      "`": "Backquote", "~": "Backquote", "-": "Minus", "_": "Minus", "=": "Equal", "+": "Equal",
      "[": "BracketLeft", "{": "BracketLeft", "]": "BracketRight", "}": "BracketRight", "\\": "Backslash", "|": "Backslash",
      ";": "Semicolon", ":": "Semicolon", "'": "Quote", "\"": "Quote", ",": "Comma", "<": "Comma",
      ".": "Period", ">": "Period", "/": "Slash", "?": "Slash", "!": "Digit1", "@": "Digit2", "#": "Digit3",
      "$": "Digit4", "%": "Digit5", "^": "Digit6", "&": "Digit7", "*": "Digit8", "(": "Digit9", ")": "Digit0"
    };
    if (/[a-z]/.test(lower)) {
      return "Key" + lower.toUpperCase();
    }
    if (/[0-9]/.test(char)) {
      return "Digit" + char;
    }
    if (koMap[char]) {
      return koMap[char];
    }
    if (ruMap[lower]) {
      return ruMap[lower];
    }
    if (practiceLanguageKey() === "ru" && ruPunctuationMap[char]) {
      return ruPunctuationMap[char];
    }
    if (punctuationMap[char]) {
      return punctuationMap[char];
    }
    if (char === " ") {
      return "Space";
    }
    return "";
  }

  function buildContent() {
    var koWords = unique([
      "어머니", "나리", "마님", "앙", "가람", "구름", "바다", "사과", "학교", "연습", "키보드", "손끝", "리듬", "정확도", "속도",
      "문장", "단어", "자리", "기록", "집중", "차분", "호흡", "오늘", "내일", "아침", "저녁", "하늘", "바람", "노을", "햇살",
      "책상", "의자", "노트", "연필", "화면", "입력", "글자", "소리", "감각", "반복", "습관", "기초", "실력", "성장", "연결",
      "생각", "마음", "시간", "공부", "작업", "친구", "도시", "마을", "시장", "여행", "기차", "버스", "지하철", "공원", "도서관",
      "강물", "숲길", "달빛", "별빛", "새벽", "정원", "커피", "우유", "과일", "빵집", "편지", "사진", "음악", "노래", "영화",
      "수업", "문제", "해답", "자료", "보고서", "계획", "약속", "회의", "결과", "목표", "출발", "도착", "시작", "완성", "표현",
      "문해력", "어휘력", "순발력", "집중력", "안정감", "균형감", "두벌식", "받침", "모음", "자음", "초성", "중성", "종성", "낱말"
    ].concat(compound(["맑은", "빠른", "조용한", "단단한", "가벼운", "새로운", "정확한", "따뜻한"], ["손끝", "리듬", "문장", "기록", "연습", "마음", "호흡", "속도", "습관", "시작"])));

    var enWords = unique([
      "mother", "river", "garden", "focus", "keyboard", "practice", "rhythm", "steady", "letter", "screen", "typing", "cursor",
      "lesson", "story", "short", "long", "word", "memory", "habit", "speed", "accuracy", "calm", "bright", "morning", "evening",
      "window", "forest", "travel", "station", "library", "notebook", "coffee", "music", "picture", "project", "report", "meeting",
      "answer", "result", "balance", "signal", "future", "simple", "gentle", "motion", "finger", "thought", "quiet", "source", "target",
      "number", "letter", "phrase", "minute", "second", "finish", "record", "typing", "energy", "clarity", "school", "market", "garden",
      "bridge", "summer", "winter", "autumn", "spring", "friend", "family", "chance", "choice", "detail", "system", "public", "online",
      "typinggame", "rain", "invader", "mining", "resource", "challenge", "training", "progress", "control", "layout"
    ].concat(compound(["clear", "steady", "quick", "bright", "silent", "focused", "careful", "daily"], ["motion", "typing", "cursor", "lesson", "record", "signal", "habit", "focus", "rhythm", "practice"])));

    var ruWords = unique([
      "мама", "река", "сад", "город", "книга", "школа", "экран", "клавиша", "текст", "слово", "строка", "ритм", "точность", "скорость",
      "письмо", "память", "привычка", "урок", "утро", "вечер", "ветер", "свет", "лес", "море", "поезд", "рынок", "парк", "музыка",
      "фокус", "работа", "проект", "ответ", "вопрос", "результат", "начало", "финал", "цель", "путь", "друг", "семья", "окно", "стол",
      "кофе", "молоко", "фраза", "абзац", "игра", "дождь", "ресурс", "уровень", "буква", "навык", "тишина", "минута", "секунда", "выбор",
      "деталь", "система", "запись", "экзамен", "чтение", "мысль", "ясность", "энергия", "баланс", "сигнал", "клавиатура", "тренировка"
    ].concat(compound(["тихий", "точный", "быстрый", "ясный", "новый", "ровный", "легкий", "верный"], ["ритм", "текст", "урок", "навык", "ответ", "выбор", "путь", "фокус", "сигнал", "экран"])));

    return {
      ko: {
        label: "한국어",
        seat: {
          home: ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ"],
          top: ["ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ", "ㅛ", "ㅕ", "ㅑ", "ㅐ", "ㅔ"],
          bottom: ["ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ"],
          number: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
          mixed: ["ㅁ", "ㄴ", "ㅇ", "ㄹ", "ㅎ", "ㅗ", "ㅓ", "ㅏ", "ㅣ", "ㅂ", "ㅈ", "ㄷ", "ㄱ", "ㅅ", "ㅛ", "ㅕ", "ㅑ", "ㅐ", "ㅔ", "ㅋ", "ㅌ", "ㅊ", "ㅍ", "ㅠ", "ㅜ", "ㅡ"]
        },
        words: koWords,
        shorts: makeKoreanShorts(),
        longs: makeKoreanLongs()
      },
      en: {
        label: "English",
        seat: {
          home: ["a", "s", "d", "f", "j", "k", "l", ";"],
          top: ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
          bottom: ["z", "x", "c", "v", "b", "n", "m"],
          number: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
          mixed: ["a", "s", "d", "f", "j", "k", "l", ";", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "z", "x", "c", "v", "b", "n", "m"]
        },
        words: enWords,
        shorts: makeEnglishShorts(),
        longs: makeEnglishLongs()
      },
      ru: {
        label: "Русский",
        seat: {
          home: ["ф", "ы", "в", "а", "о", "л", "д", "ж"],
          top: ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з"],
          bottom: ["я", "ч", "с", "м", "и", "т", "ь"],
          number: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
          mixed: ["ф", "ы", "в", "а", "о", "л", "д", "ж", "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "я", "ч", "с", "м", "и", "т", "ь"]
        },
        words: ruWords,
        shorts: makeRussianShorts(),
        longs: makeRussianLongs()
      }
    };
  }

  function makeKoreanShorts() {
    var classics = [
      "가는 말이 고와야 오는 말이 곱다.",
      "가랑비에 옷 젖는 줄 모른다.",
      "가재는 게 편이다.",
      "간에 기별도 안 간다.",
      "같은 값이면 다홍치마.",
      "개구리 올챙이 적 생각 못 한다.",
      "거짓말도 방편이다.",
      "고래 싸움에 새우 등 터진다.",
      "고생 끝에 낙이 온다.",
      "공든 탑이 무너지랴.",
      "구슬이 서 말이라도 꿰어야 보배다.",
      "굼벵이도 구르는 재주가 있다.",
      "금강산도 식후경이다.",
      "급할수록 돌아가라.",
      "길고 짧은 것은 대어 보아야 안다.",
      "까마귀 날자 배 떨어진다.",
      "꿩 대신 닭이다.",
      "낮말은 새가 듣고 밤말은 쥐가 듣는다.",
      "내 코가 석 자다.",
      "누워서 떡 먹기다.",
      "늦게 배운 도둑질이 날 새는 줄 모른다.",
      "달면 삼키고 쓰면 뱉는다.",
      "닭 잡아먹고 오리발 내민다.",
      "도토리 키 재기다.",
      "돌다리도 두들겨 보고 건너라.",
      "등잔 밑이 어둡다.",
      "마른하늘에 날벼락이다.",
      "말 한마디에 천 냥 빚도 갚는다.",
      "모로 가도 서울만 가면 된다.",
      "믿는 도끼에 발등 찍힌다.",
      "바늘 도둑이 소 도둑 된다.",
      "백문이 불여일견이다.",
      "벼는 익을수록 고개를 숙인다.",
      "빈 수레가 요란하다.",
      "사공이 많으면 배가 산으로 간다.",
      "서당 개 삼 년이면 풍월을 읊는다.",
      "세 살 버릇 여든까지 간다.",
      "소 잃고 외양간 고친다.",
      "수박 겉 핥기다.",
      "시작이 반이다.",
      "아는 길도 물어가라.",
      "아니 땐 굴뚝에 연기 나랴.",
      "열 번 찍어 안 넘어가는 나무 없다.",
      "우물 안 개구리다.",
      "웃는 얼굴에 침 못 뱉는다.",
      "원숭이도 나무에서 떨어진다.",
      "윗물이 맑아야 아랫물이 맑다.",
      "작은 고추가 더 맵다.",
      "종로에서 뺨 맞고 한강에서 눈 흘긴다.",
      "쥐구멍에도 볕 들 날 있다.",
      "천 리 길도 한 걸음부터다.",
      "콩 심은 데 콩 나고 팥 심은 데 팥 난다.",
      "티끌 모아 태산이다.",
      "하늘은 스스로 돕는 자를 돕는다.",
      "호랑이 굴에 가야 호랑이 새끼를 잡는다.",
      "호미로 막을 것을 가래로 막는다.",
      "흐르는 물은 썩지 않는다.",
      "배움에는 끝이 없다.",
      "군자는 말보다 실천을 앞세운다.",
      "좋은 책은 오래된 벗과 같다.",
      "어진 사람은 산을 좋아하고 지혜로운 사람은 물을 좋아한다.",
      "지나친 것은 모자란 것과 같다.",
      "스스로 이기는 사람이 가장 강하다.",
      "오늘 할 일을 내일로 미루지 말라."
    ];
    var subjects = ["차분한 손끝은", "정확한 입력은", "짧은 반복은", "밝은 화면은", "오늘의 연습은", "새로운 문장은", "가벼운 호흡은", "꾸준한 기록은", "작은 오타는", "빠른 리듬은"];
    var verbs = ["속도를 단단하게 만든다.", "다음 문장을 쉽게 열어 준다.", "좋은 습관으로 이어진다.", "집중력을 조용히 키운다.", "키보드 위의 길을 보여 준다.", "마음을 안정시키는 기준이 된다."];
    return unique(classics.concat([
      "처음부터 빠르게 치려 하지 않아도 된다.",
      "오른쪽의 다음 글자를 미리 보면 리듬이 살아난다.",
      "기본 자리가 익숙해지면 단어가 한결 가볍다.",
      "문장 연습은 한 줄의 흐름을 놓치지 않는 연습이다.",
      "정확도는 속도가 자랄 수 있는 가장 좋은 바닥이다."
    ]).concat(sentencesFrom(subjects, verbs)));
  }

  function makeEnglishShorts() {
    var classics = [
      "A bad workman blames his tools.",
      "A bird in the hand is worth two in the bush.",
      "A chain is only as strong as its weakest link.",
      "A friend in need is a friend indeed.",
      "A journey of a thousand miles begins with a single step.",
      "A little learning is a dangerous thing.",
      "A penny saved is a penny earned.",
      "A stitch in time saves nine.",
      "Absence makes the heart grow fonder.",
      "Actions speak louder than words.",
      "All good things must come to an end.",
      "All that glitters is not gold.",
      "All roads lead to Rome.",
      "An apple a day keeps the doctor away.",
      "As you sow, so shall you reap.",
      "Beauty is in the eye of the beholder.",
      "Better late than never.",
      "Better safe than sorry.",
      "Brevity is the soul of wit.",
      "Charity begins at home.",
      "Cleanliness is next to godliness.",
      "Do not count your chickens before they hatch.",
      "Do not judge a book by its cover.",
      "Do not put all your eggs in one basket.",
      "Do not trouble trouble until trouble troubles you.",
      "Easy come, easy go.",
      "Every cloud has a silver lining.",
      "Experience is the best teacher.",
      "Faint heart never won fair lady.",
      "Fortune favors the brave.",
      "Good things come to those who wait.",
      "Half a loaf is better than none.",
      "Haste makes waste.",
      "Honesty is the best policy.",
      "If it is not broken, do not fix it.",
      "Knowledge is power.",
      "Let sleeping dogs lie.",
      "Look before you leap.",
      "Make hay while the sun shines.",
      "Necessity is the mother of invention.",
      "No pain, no gain.",
      "One good turn deserves another.",
      "Out of sight, out of mind.",
      "Practice makes perfect.",
      "Rome was not built in a day.",
      "Silence is golden.",
      "Slow and steady wins the race.",
      "Still waters run deep.",
      "The early bird catches the worm.",
      "The pen is mightier than the sword.",
      "The proof of the pudding is in the eating.",
      "The squeaky wheel gets the grease.",
      "There is no place like home.",
      "Time and tide wait for no man.",
      "To err is human, to forgive divine.",
      "To thine own self be true.",
      "Too many cooks spoil the broth.",
      "Two heads are better than one.",
      "United we stand, divided we fall.",
      "Where there is a will, there is a way.",
      "You reap what you sow.",
      "You cannot have your cake and eat it too.",
      "You must be the change you wish to see.",
      "Well begun is half done."
    ];
    var subjects = ["A steady hand", "Clear practice", "Every short line", "A quiet cursor", "Daily rhythm", "Careful typing", "Small progress", "The next word", "A focused minute", "Good accuracy"];
    var verbs = ["builds confident speed.", "keeps the sentence easy to finish.", "turns effort into motion.", "makes the keyboard feel familiar.", "helps the next attempt begin well.", "gives speed a reliable place to grow."];
    return unique(classics.concat([
      "Do not rush the first line of practice.",
      "Read the next word before the current word ends.",
      "Short sentences train rhythm without heavy pressure.",
      "Accuracy is the floor that lets speed rise.",
      "A calm pace often wins the longer session."
    ]).concat(sentencesFrom(subjects, verbs)));
  }

  function makeRussianShorts() {
    var classics = [
      "Аппетит приходит во время еды.",
      "Без труда не вытащишь и рыбку из пруда.",
      "Береженого Бог бережет.",
      "Близок локоть, да не укусишь.",
      "В гостях хорошо, а дома лучше.",
      "Век живи, век учись.",
      "Волков бояться - в лес не ходить.",
      "Всякому овощу свое время.",
      "Глаза боятся, а руки делают.",
      "Где родился, там и пригодился.",
      "Готовь сани летом, а телегу зимой.",
      "Делу время, потехе час.",
      "Доверяй, но проверяй.",
      "Дорога ложка к обеду.",
      "Друг познается в беде.",
      "За двумя зайцами погонишься - ни одного не поймаешь.",
      "Кашу маслом не испортишь.",
      "Клин клином вышибают.",
      "Кто ищет, тот всегда найдет.",
      "Кто не работает, тот не ест.",
      "Лес рубят - щепки летят.",
      "Лучше поздно, чем никогда.",
      "Любишь кататься, люби и саночки возить.",
      "Мал золотник, да дорог.",
      "Молчание - золото.",
      "Москва не сразу строилась.",
      "На безрыбье и рак рыба.",
      "На Бога надейся, а сам не плошай.",
      "На вкус и цвет товарища нет.",
      "Не все то золото, что блестит.",
      "Не говори гоп, пока не перепрыгнешь.",
      "Не имей сто рублей, а имей сто друзей.",
      "Не место красит человека, а человек место.",
      "Не откладывай на завтра то, что можно сделать сегодня.",
      "Не рой другому яму, сам в нее попадешь.",
      "Нет дыма без огня.",
      "Один в поле не воин.",
      "Один ум хорошо, а два лучше.",
      "От добра добра не ищут.",
      "Поспешишь - людей насмешишь.",
      "Повторение - мать учения.",
      "Правда глаза колет.",
      "Рыбак рыбака видит издалека.",
      "С волками жить - по-волчьи выть.",
      "Семь бед - один ответ.",
      "Семь раз отмерь, один раз отрежь.",
      "Слово не воробей, вылетит - не поймаешь.",
      "Старый друг лучше новых двух.",
      "Терпение и труд все перетрут.",
      "Тише едешь, дальше будешь.",
      "У семи нянек дитя без глазу.",
      "У страха глаза велики.",
      "Утро вечера мудренее.",
      "Хлеб всему голова.",
      "Хорошо там, где нас нет.",
      "Цыплят по осени считают.",
      "Что написано пером, не вырубишь топором.",
      "Что посеешь, то и пожнешь.",
      "Язык до Киева доведет.",
      "Ученье - свет, а неученье - тьма.",
      "Счастливые часов не наблюдают.",
      "Человек предполагает, а Бог располагает."
    ];
    var subjects = ["Спокойный темп", "Точная строка", "Каждая буква", "Короткая фраза", "Ровный ритм", "Новый урок", "Ясная цель", "Тихая минута", "Верный навык", "Быстрая мысль"];
    var verbs = ["помогает печатать увереннее.", "делает движение легче.", "укрепляет внимание.", "ведет к хорошей скорости.", "сохраняет ясность текста.", "готовит пальцы к длинной строке."];
    return unique(classics.concat([
      "Не нужно спешить с первой попытки.",
      "Следующее слово лучше видеть заранее.",
      "Короткая строка помогает найти ритм.",
      "Точность дает скорости надежную основу.",
      "Спокойное внимание уменьшает ошибки."
    ]).concat(sentencesFrom(subjects, verbs)));
  }

  function makeKoreanLongs() {
    return [
      "춘향전의 이야기는 남원 광한루에서 시작된다.\n춘향과 몽룡은 서로의 마음을 확인하지만, 신분과 세상의 규칙은 두 사람을 쉽게 놓아주지 않는다.\n변학도의 위협 앞에서도 춘향은 마음의 절개를 굽히지 않는다.\n마침내 암행어사가 된 몽룡이 돌아와 억울함을 풀어 주며 이야기는 밝은 결말로 나아간다.",
      "심청전에서 어린 심청은 앞을 보지 못하는 아버지를 위해 정성을 다한다.\n그녀는 어려운 형편 속에서도 효심을 잃지 않고, 큰 결심 끝에 인당수로 향한다.\n바다는 심청을 삼키는 듯하지만, 이야기는 연꽃과 궁궐의 기적으로 다시 열린다.\n끝내 아버지의 눈이 뜨이는 장면은 오래도록 효와 희생의 상징으로 남았다.",
      "흥부전의 흥부는 가난하지만 마음이 너그러운 사람으로 그려진다.\n다친 제비를 고쳐 주자 제비는 박씨 하나를 물고 돌아온다.\n흥부가 박을 타자 재물과 복이 쏟아지고, 형 놀부는 그 모습을 보고 욕심을 앞세운다.\n이 이야기는 선한 마음과 지나친 탐욕의 차이를 또렷하게 보여 준다.",
      "홍길동전의 길동은 뛰어난 재주를 지녔지만 서얼이라는 이유로 집안과 나라에서 제약을 받는다.\n그는 불의한 권력에 맞서 활빈당을 이끌고, 억울한 백성을 돕는 길을 택한다.\n이름을 마음껏 부르지 못하던 소년은 스스로의 세계를 만들어 간다.\n율도국을 세우는 결말은 오래된 사회 질서 밖의 새로운 상상으로 읽힌다.",
      "구운몽은 성진이라는 젊은 승려가 꿈속에서 양소유의 삶을 사는 이야기다.\n그는 벼슬과 사랑과 부귀를 모두 누리지만, 꿈이 끝나자 그 화려함이 덧없음을 깨닫는다.\n인생의 즐거움과 허무가 한 장의 꿈처럼 이어지는 구조가 이 작품의 큰 힘이다.\n독자는 긴 꿈을 따라가며 무엇이 참된 삶인지 다시 묻게 된다.",
      "별주부전에서 용왕은 병을 고치기 위해 토끼의 간이 필요하다는 말을 듣는다.\n자라는 토끼를 바다 궁궐로 데려가지만, 토끼는 꾀를 내어 간을 육지에 두고 왔다고 말한다.\n위기 속에서 침착하게 말을 고르는 토끼의 지혜가 이야기를 움직인다.\n바다와 육지를 오가는 이 우화는 권력과 꾀의 겨루기로도 읽힌다.",
      "장화홍련전은 억울하게 죽은 자매의 한을 따라가는 고전 소설이다.\n계모의 모함과 집안의 침묵은 어린 자매에게 돌이킬 수 없는 비극을 만든다.\n새로 부임한 사또가 이상한 사건을 파헤치며 감춰진 진실이 드러난다.\n이 작품은 가족 안의 불의와 억울함을 풀어 주는 정의의 서사를 남긴다.",
      "박씨전의 박씨 부인은 처음에는 못생긴 외모 때문에 홀대를 받는다.\n그러나 그는 뛰어난 지혜와 도술로 나라가 위기에 빠졌을 때 큰 공을 세운다.\n겉모습만 보고 사람을 판단하던 이들은 뒤늦게 그의 진가를 알게 된다.\n이야기는 능력과 인격이 외모보다 깊은 가치임을 분명하게 말한다.",
      "옹고집전의 옹고집은 인색하고 고집 센 사람으로 마을 사람들의 원성을 산다.\n어느 날 가짜 옹고집이 나타나 그의 자리와 재산을 모두 차지한다.\n진짜 옹고집은 자신을 증명하지 못하고 세상의 냉대를 겪으며 지난 삶을 돌아본다.\n고난 뒤에 마음을 고치는 과정이 이 풍자의 핵심이다.",
      "허생전의 허생은 글만 읽던 선비였지만, 장사에 나서자 놀라운 안목을 보인다.\n그는 시장의 흐름을 읽어 큰돈을 벌고, 그 돈으로 도적들을 섬에 모아 새 삶을 꾸리게 한다.\n이후 나라를 위한 방책을 말하지만, 현실 권력은 그의 생각을 제대로 받아들이지 못한다.\n박지원의 풍자는 학문과 현실, 이상과 제도의 간격을 날카롭게 드러낸다.",
      "양반전은 양반이라는 이름의 허위와 체면을 우스꽝스럽게 비춘다.\n돈으로 양반 신분을 사려는 사람이 문서를 받아 들지만, 그 안에는 끝없는 의무와 허례가 적혀 있다.\n겉보기에 높아 보이는 지위가 실제 삶에서는 얼마나 공허할 수 있는지 드러난다.\n웃음 속에 사회의 모순을 찌르는 힘이 살아 있는 작품이다.",
      "토끼전의 토끼는 힘이 센 존재가 아니라 말이 빠르고 생각이 날랜 존재다.\n그는 바다 궁궐의 낯선 질서 속에서도 두려움에만 머물지 않는다.\n살아남기 위해 필요한 것은 완력보다 상황을 읽는 눈과 적절한 말이다.\n그래서 이 이야기는 약자가 지혜로 위기를 넘는 서사로 오래 사랑받았다.",
      "금오신화의 이야기들은 낯선 만남과 기이한 사건 속에서 인간의 마음을 비춘다.\n죽은 이와 산 이가 만나고, 꿈과 현실의 경계가 흔들리며, 사랑과 이별이 한 장면 안에 놓인다.\n기이한 형식은 단순한 놀라움에 그치지 않고 삶의 덧없음과 그리움을 보여 준다.\n짧은 이야기 안에 깊은 정서가 머무는 것이 이 고전의 매력이다.",
      "사씨남정기에서 사씨는 억울한 모함을 받고 집에서 쫓겨난다.\n그러나 그는 품위를 잃지 않고 긴 고난을 견디며 진실이 밝혀질 날을 기다린다.\n교씨의 간계와 집안의 혼란은 결국 스스로 무너질 수밖에 없다.\n이 작품은 가정의 질서와 정의를 통해 당대 사회의 문제까지 비추었다.",
      "임진록은 전쟁의 큰 상처와 영웅들의 활약을 함께 담은 이야기다.\n나라가 위기에 놓였을 때 장수와 백성은 각자의 자리에서 버티고 싸운다.\n실제 역사와 상상력이 섞이며 고난을 이겨 내려는 마음이 긴 서사로 펼쳐진다.\n전쟁을 기억하는 문학은 승리보다도 견딘 사람들의 목소리를 오래 남긴다."
    ];
  }

  function makeEnglishLongs() {
    return [
      "In Pride and Prejudice, a country neighborhood becomes a stage for judgment, pride, and gradual understanding.\nElizabeth Bennet observes the manners around her with quick wit, while Mr. Darcy first appears distant and severe.\nTheir story changes as each learns to look beyond first impressions.\nThe novel remains familiar because it turns conversation and misunderstanding into a quiet drama of character.",
      "A Christmas Carol begins with Scrooge guarding his money and his solitude as if they were the only safe things in life.\nOn a cold night he is visited by spirits who show him memory, present suffering, and a possible future.\nThe journey frightens him because it makes his own heart visible.\nBy morning, generosity becomes not a decoration but a way to return to the human world.",
      "Alice in Wonderland follows a child who drops into a country where ordinary rules no longer hold.\nAnimals speak, sizes change, riddles refuse clear answers, and every conversation turns sideways.\nAlice survives the confusion by asking questions and keeping her curiosity awake.\nThe tale is playful, but its strange logic makes the reader feel how surprising language itself can be.",
      "In The Adventures of Sherlock Holmes, a small clue can open an entire hidden story.\nHolmes watches mud on a shoe, ash on a sleeve, or the shape of a hat with unusual patience.\nWatson records the case as a friend who is often amazed by such disciplined attention.\nThe pleasure of the stories lies in seeing order emerge from details that seemed ordinary.",
      "Moby-Dick sends a ship across the sea in pursuit of a white whale and an obsession that grows larger than the voyage.\nThe crew works under Captain Ahab, whose wounded pride turns command into a private war.\nThe ocean is not merely a setting but a vast mirror for fear, labor, knowledge, and fate.\nThe novel feels immense because every wave seems to carry another question.",
      "Jane Eyre begins with a lonely child who refuses to surrender her sense of self.\nAt school, at Thornfield, and in the wild country beyond, Jane learns how difficult independence can be.\nLove matters deeply to her, but conscience matters too.\nThe power of the novel comes from a voice that insists on dignity even when the world offers very little comfort.",
      "Treasure Island opens with a map, a secret, and the restless promise of the sea.\nJim Hawkins is drawn from the safety of an inn into a world of sailors, mutiny, and buried gold.\nLong John Silver is charming and dangerous at once, which makes every alliance uncertain.\nThe adventure endures because it lets courage and suspicion travel in the same boat.",
      "In Robinson Crusoe, a man alone on an island must turn survival into daily order.\nHe counts supplies, builds shelter, learns the weather, and slowly makes a strange home from necessity.\nThe story is famous not only for danger but for practical attention to work.\nEach small tool or habit becomes a sign that life can continue after disaster.",
      "The Odyssey follows a hero who wants nothing more steadily than to return home.\nOdysseus meets storms, monsters, enchantments, and temptations that delay his journey for years.\nHis strength matters, but his craft and endurance matter even more.\nThe poem remains powerful because home is treated not as a place already won, but as a promise that must be reached again.",
      "In Hamlet, a prince is asked to answer a crime that has poisoned the royal house.\nHe thinks, delays, speaks sharply, and turns suspicion over until the whole court feels unstable.\nThe tragedy is not only about revenge but about the weight of knowing too much and acting too late.\nIts scenes continue to echo because doubt itself becomes dramatic action.",
      "Macbeth shows ambition entering a brave soldier's mind like a spark in dry wood.\nA prophecy opens the door, but Macbeth and his wife choose the path that follows.\nOnce the crown is taken by blood, fear demands more blood to defend it.\nThe play is remembered because it makes power feel both dazzling and ruinous.",
      "A Tale of Two Cities moves between London and Paris while revolution gathers force.\nPrivate grief and public anger meet in crowded streets, courts, prisons, and homes.\nSome characters are carried by vengeance, while others search for mercy in a violent age.\nThe novel's lasting force comes from the question of what a person might give for love and renewal.",
      "The Scarlet Letter places Hester Prynne before a town that wants her shame to define her.\nShe bears the sign openly, raises her child, and lives under constant judgment.\nOver time the mark becomes less simple than the crowd intended, because endurance changes its meaning.\nThe story remains important because it asks who has the right to name another person's soul.",
      "The Wind in the Willows follows Mole, Rat, Badger, and Toad through riverbanks, roads, homes, and foolish adventures.\nThe book moves gently between friendship, mischief, and the pleasure of familiar places.\nToad's vanity causes trouble, but his friends keep working to bring him back to sense.\nIts world is loved because kindness and landscape share the same quiet rhythm.",
      "Frankenstein begins with a student who wants to command the secret of life.\nVictor succeeds in making a living being, but he refuses the responsibility that creation demands.\nThe creature learns language, loneliness, anger, and grief while searching for a place among humans.\nThe novel lasts because it asks whether knowledge without care can become a form of cruelty."
    ];
  }

  function makeRussianLongs() {
    return [
      "В Евгении Онегине молодой дворянин устает от света, разговоров и привычных развлечений.\nВ деревне он встречает Татьяну, чье чувство оказывается прямее и глубже его холодной вежливости.\nПисьмо Татьяны становится одним из самых узнаваемых жестов русской литературы.\nПозднее герои меняются местами, и упущенное чувство уже нельзя вернуть простым словом.",
      "В Капитанской дочке путь Петра Гринева начинается как обычная служба молодого дворянина.\nБуран, крепость, восстание и встреча с Пугачевым быстро делают его жизнь испытанием чести.\nМаша Миронова кажется тихой, но в решающий момент проявляет твердость и верность.\nПовесть запоминается тем, что человеческое достоинство сохраняется среди большой смуты.",
      "В Войне и мире частная жизнь дворянских семей постоянно соприкасается с движением истории.\nПьер ищет смысл, Андрей проходит через честолюбие и разочарование, Наташа взрослеет через радость и боль.\nВойна меняет дома, привычки, планы и сам взгляд на человека.\nРоман велик тем, что рядом с битвами оставляет место семейному разговору и внутреннему выбору.",
      "В Преступлении и наказании Раскольников пытается доказать себе право переступить нравственную границу.\nПосле убийства город становится для него тесным и душным пространством страха.\nСоня отвечает на его гордость состраданием, которое не оправдывает преступление, но зовет к признанию.\nРоман держится на напряжении между мыслью, совестью и возможностью духовного возвращения.",
      "В Шинели Акакий Акакиевич живет почти незаметно, переписывая бумаги и экономя на каждой мелочи.\nНовая шинель становится для него не роскошью, а знаком человеческого тепла и надежды.\nКогда ее отнимают, маленькая радость рушится вместе с верой в справедливость.\nПовесть Гоголя сильна тем, что заставляет увидеть человека там, где общество видело только должность.",
      "В Мертвых душах Чичиков путешествует по усадьбам и покупает странный товар - умерших крестьян, числящихся в списках.\nКаждый помещик раскрывает особый вид пустоты, жадности, мечтательности или беспорядка.\nДорога соединяет смешное и тревожное, а разговоры становятся зеркалом целой страны.\nГоголевская сатира смеется, но в этом смехе слышна серьезная боль.",
      "В Отцах и детях Базаров спорит с миром усадеб, привычек и старых представлений.\nОн верит в пользу, опыт и отрицание красивых слов, но жизнь ставит перед ним чувства, которые нельзя измерить просто.\nКонфликт поколений оказывается не только семейным, но и духовным испытанием.\nРоман помнит силу новых идей и их одиночество.",
      "В Герое нашего времени Печорин наблюдает за собой почти так же холодно, как за другими людьми.\nОн умен, смел и несчастлив, потому что превращает чувства в опыт и игру.\nРазные рассказчики показывают его с разных сторон, и цельный портрет остается тревожным.\nКлассический образ лишнего человека рождается из энергии, которой не найдено достойного дела.",
      "В Ревизоре маленький город пугается известия о тайном проверяющем.\nЧиновники спешат скрыть свои грехи и принимают пустого Хлестакова за важное лицо.\nСлучайная ошибка раскрывает порядок, где страх важнее правды, а чин важнее совести.\nКомедия смешна потому, что ее нелепость слишком легко узнается.",
      "В Вишневом саде старый дом и сад стоят на границе прошлого и будущего.\nРаневская любит красоту уходящей жизни, но не умеет удержать ее делом.\nЛопахин видит практический выход, однако его победа тоже не звучит как простое счастье.\nПьеса Чехова тиха, но в этой тишине слышен треск целой эпохи.",
      "В Тарасе Бульбе семейная история раскрывается на фоне суровой казацкой воли.\nТарас гордится сыновьями и хочет видеть в них продолжателей воинской чести.\nНо любовь, долг, жестокость и верность сталкиваются так резко, что победа перестает быть ясной.\nПовесть запоминается силой характера и трагической ценой этой силы.",
      "В Обломове герой чаще мечтает о жизни, чем решается жить.\nЕго мягкость и доброта соседствуют с неподвижностью, которая постепенно становится судьбой.\nШтольц зовет его к действию, Ольга пробуждает надежду, но старый покой оказывается слишком сильным.\nРоман сделал имя Обломова символом сладкой и опасной неподвижности.",
      "В Горе от ума Чацкий возвращается в московский дом с живой мыслью и резкой речью.\nОн сталкивается с обществом, где удобная привычка ценится выше правды.\nСофья, Фамусов и гости слышат в его словах угрозу своему спокойствию.\nКомедия стала классической потому, что ум в ней оказывается одиноким среди готовых мнений.",
      "В Братьях Карамазовых семейный разлад вырастает в спор о вере, свободе и ответственности.\nКаждый брат несет свою правду: страсть, разум, кротость или больное сомнение.\nПреступление в семье открывает вопросы, на которые нельзя ответить одним приговором.\nРоман звучит как большой разговор о том, что делает человека человеком.",
      "В Пиковой даме Германн верит, что тайна трех карт откроет ему дорогу к богатству.\nСначала это кажется расчетом, но расчет быстро превращается в наваждение.\nСтарый дом, графиня и карточный стол образуют мир, где желание управляет разумом.\nПовесть Пушкина коротка, но в ней точно показана опасность страсти к легкой победе."
    ];
  }

  function sentencesFrom(subjects, verbs) {
    var result = [];
    subjects.forEach(function (subject) {
      verbs.forEach(function (verb) {
        result.push(subject + " " + verb);
      });
    });
    return result;
  }

  function compound(left, right) {
    var result = [];
    left.forEach(function (a) {
      right.forEach(function (b) {
        result.push((a + b).replace(/\s+/g, ""));
      });
    });
    return result;
  }

  function sample(source, count) {
    return shuffle(source).slice(0, Math.min(count, source.length));
  }

  function shuffle(source) {
    var list = source.slice();
    for (var i = list.length - 1; i > 0; i -= 1) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = list[i];
      list[i] = list[j];
      list[j] = temp;
    }
    return list;
  }

  function unique(values) {
    return Array.from(new Set(values));
  }

  function currentTypedValue() {
    if (state.composing) {
      return normalize(state.compositionBase + state.compositionText);
    }
    return normalize(elements.input.value);
  }

  function readCompositionText(event) {
    var data = event && typeof event.data === "string" ? event.data : "";
    if (data) {
      return data;
    }
    if (elements.input.value.indexOf(state.compositionBase) === 0) {
      return elements.input.value.slice(state.compositionBase.length);
    }
    return "";
  }

  function normalize(value) {
    return value.normalize("NFC");
  }

  function formatSeconds(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    return String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0");
  }

}());
