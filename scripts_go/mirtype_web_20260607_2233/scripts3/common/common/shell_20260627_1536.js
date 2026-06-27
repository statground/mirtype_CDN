(function () {
  "use strict";

  var PREFERENCES_KEY = "mirtype.preferences.v1";
  var STORAGE_KEY = "mirtype.results.v2";
  var originalLegalPages = {};
  var remotePreference = null;
  var remoteLearningStates = {};
  var remoteLearningResults = {};
  var remoteLearningRequests = {};
  var supportedLanguages = ["ko", "en", "ru"];
  var learningActivityKeys = ["practice", "course", "game"];
  var FLAG_CDN_BASE = "https://cdn.jsdelivr.net/npm/circle-flags@1.0.0/flags/";
  var languageOptions = {
    ko: { label: "한국어", country: "kr" },
    en: { label: "English", country: "us" },
    ru: { label: "Русский", country: "ru" }
  };
  var shellLocales = {
    ko: {
      htmlLang: "ko",
      metaTitleHome: "MirType",
      metaDescriptionHome: "타자연습과 언어 공부를 동시에 할 수 있는 MirType 시작 화면",
      metaTitlePractice: "MirType 타자연습",
      metaDescriptionPractice: "자리, 단어, 문장 연습을 고르는 MirType 타자연습 허브",
      metaTitleCourse: "MirType 언어 연습 코스",
      metaDescriptionCourse: "언어 능력, 입력 숙련, 복습 큐를 연결하는 MirType 언어 연습 코스",
      metaTitleIntro: "MirType 소개",
      metaDescriptionIntro: "타자연습과 언어 공부를 동시에 할 수 있는 MirType 서비스 소개",
      metaTitleBooks: "MirType 언어 학습 교재",
      metaDescriptionBooks: "언어 학습과 타자연습 흐름에 맞춘 MirType 추천 교재 목록",
      metaTitleLectures: "MirType 언어 학습 강의",
      metaDescriptionLectures: "언어 학습과 타자연습 흐름에 맞춘 MirType 추천 강의 목록",
      metaTitleMyInfo: "MirType 내 정보",
      metaDescriptionMyInfo: "MirType 계정 정보와 학습 진행 상태",
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
        peopleSocial: "Jae-seong Yoo SNS",
        history: "최근 기록",
        languageSetup: "언어 설정",
        closeHistory: "기록 닫기",
        closeSettings: "설정 닫기"
      },
      nav: {
        practiceGroup: "훈련",
        typingPractice: "타자연습",
        seat: "자리 연습",
        word: "단어 연습",
        sentence: "문장 연습",
        course: "언어 코스",
        game: "타자게임",
        keyboard: "키보드 테스트",
        keyboardShort: "키보드",
        history: "최근 기록",
        intro: "MirType 소개",
        books: "언어 학습 교재",
        lectures: "언어 학습 강의",
        terms: "서비스 이용약관",
        privacy: "개인정보 처리방침",
        statground: "통계마당",
        webr: "Web-R"
      },
      bottom: {
        aria: "MirType 하단 메뉴",
        home: "홈",
        practice: "훈련",
        course: "코스",
        myinfo: "내 정보",
        more: "더보기"
      },
      mobile: {
        today: "오늘",
        practice: "훈련",
        tools: "도구",
        account: "계정",
        service: "서비스"
      },
      learning: {
        guestRecordNotice: "로그인하지 않아도 이 브라우저 기준으로 기록이 저장됩니다. 로그인하면 계정 기준으로 이어집니다."
      },
      account: {
        mainAria: "MirType 계정",
        inputAria: "계정 입력",
        myAccount: "내 정보",
        login: "로그인",
        signup: "회원가입",
        logout: "로그아웃",
        loginKicker: "Account",
        signupKicker: "Create Account",
        loginTitle: "로그인",
        signupTitle: "회원가입",
        summary: "MirType은 통계마당과 Web-R 계정 체계를 함께 사용합니다. 같은 이메일 계정으로 학습 기록과 앞으로의 서비스 기능을 이어갈 수 있습니다.",
        signedIn: "Signed In",
        rolePrefix: "등급:",
        startPractice: "연습 시작",
        email: "이메일",
        password: "비밀번호",
        nickname: "닉네임",
        name: "이름",
        signupSubmit: "가입하고 시작",
        noAccount: "아직 계정이 없나요?"
      },
      progress: {
        levelLabel: "레벨",
        levelHint: "7일 연속 학습하면 다음 레벨로 올라갑니다.",
        levelValue: "Lv. %d",
        streakLabel: "연속 학습",
        streakHint: "오늘 또는 어제까지 이어진 학습일입니다.",
        streakUnit: "일",
        nextLabel: "다음 레벨까지",
        nextUnit: "일",
        sessionLabel: "완료한 연습",
        sessionUnit: "회"
      },
      languagePractice: {
        kicker: "Language Practice",
        title: "언어 연습 흐름",
        summary: "MirType는 타자 속도만 보지 않고, 목표 언어의 표현과 실제 입력 방식을 함께 연습합니다.",
        languageAxisTitle: "언어 능력",
        languageAxisBody: "무엇을 이해하고 말할 수 있는지 쌓아갑니다.",
        inputAxisTitle: "입력 숙련",
        inputAxisBody: "키배열, IME 조합, 정확도와 리듬을 목표 언어별로 익힙니다.",
        reviewAxisTitle: "복습 큐",
        reviewAxisBody: "오답, 약한 키, 헷갈린 표현을 다시 불러와 오래 기억하게 합니다.",
        loginHint: "로그인하면 레벨과 연속 학습을 내 계정 기준의 기록으로 이어갈 수 있습니다.",
        courseCta: "언어 코스 보기",
        loginCta: "로그인하고 기록 이어가기"
      },
      practice: {
        mainAria: "MirType 타자연습",
        languageLabel: "연습 언어",
        kicker: "Typing Studio",
        title: "오늘의 타자연습 작업대",
        titleLine1: "오늘의 타자연습",
        titleLine2: "",
        titleLine3: "작업대",
        summary: "자리, 단어, 문장 연습을 한 곳에 모았습니다. 오늘 필요한 상세 연습을 고르면 바로 해당 기능으로 이동합니다.",
        startSeat: "자리 연습으로 시작",
        startWord: "단어 연습으로 이어가기",
        changeLanguage: "연습 언어 바꾸기",
        detailKicker: "Practice Menu",
        detailTitle: "상세 연습 기능",
        detailSummary: "처음이면 자리 연습부터, 익숙하면 단어와 문장으로 이어가세요.",
        seatCardTitle: "자리 연습",
        seatCardBody: "손가락이 키 위치를 먼저 기억합니다.",
        wordCardTitle: "단어 연습",
        wordCardBody: "짧은 단어로 입력 리듬을 만듭니다.",
        sentenceShortCardTitle: "단문 연습",
        sentenceShortCardBody: "한 문장씩 끝내며 표현과 입력 리듬을 맞춥니다.",
        sentenceLongCardTitle: "장문 연습",
        sentenceLongCardBody: "여러 줄 문맥을 읽으며 오래 이어지는 흐름을 연습합니다.",
        sentenceCardTitle: "단문 연습",
        sentenceCardBody: "한 문장씩 끝내며 언어 감각을 익힙니다.",
        gameCardTitle: "타자게임",
        gameCardBody: "산성비, 침략자, 자원 캐기 중에서 고릅니다.",
        keyboardCardTitle: "키보드 테스트",
        keyboardCardBody: "언어별 배열과 입력 위치를 확인하고 자유 입력으로 점검합니다."
      },
      course: {
        mainAria: "MirType 언어 연습 코스",
        statusAria: "학습 상태",
        languageLabel: "코스 언어",
        kicker: "Language Course",
        title: "언어 연습 코스",
        summary: "목표 언어의 뜻과 발음 보조를 확인하며 차근차근 익히는 언어 코스입니다.",
        unitKicker: "MIRTYPE BRIDGE 01",
        unitTitle: "한 글자, 한 단어, 한 문장씩 익히기",
        todayCta: "언어 코스 시작",
        startWord: "오늘 카드 보기",
        startSentence: "문장 코스로 이어가기",
        changeLanguage: "연습 언어 바꾸기",
        levelPanelKicker: "Course Level",
        levelCaption: "다음 판단까지 %d일",
        levelCaptionReview: "이번 주 성취도 %d% · 정확도 85%를 넘기면 다음 레벨",
        prevLevel: "이전",
        currentLevel: "현재",
        nextLevel: "다음",
        weekRuleTitle: "7일 성취도 코스",
        weekRuleBody: "한 주 동안 같은 등급의 글자, 단어, 문장을 천천히 반복하고, 타자 속도와 소요 시간은 별도 타자연습에서 확인합니다.",
        mapKicker: "Bridge Map",
        mapTitle: "레벨을 건너는 오늘의 길",
        bundleKicker: "Difficulty Bundle",
        bundleTitle: "%s · Day %d / 7",
        bundleProgress: "%d일째 · 성취도 %d%",
        bundleFallbackTitle: "오늘의 묶음",
        bundleSummaryFallback: "현재 난이도의 글자, 단어, 문장을 차근차근 확인합니다.",
        todayLettersTitle: "오늘의 글자",
        todayLettersHint: "한 글자씩 소리와 모양을 확인합니다.",
        todayWordsTitle: "주요 단어",
        todaySentencesTitle: "주요 문장",
        dailyAdvanceHint: "한 문장까지 확인한 뒤 필요하면 타자연습에서 속도와 시간을 따로 점검합니다.",
        dailyReviewHint: "뜻이나 발음이 흐릿하면 같은 등급을 한 번 더 천천히 복습합니다.",
        itemMeaningLabel: "뜻",
        itemPronunciationLabel: "발음",
        practiceInputLabel: "따라 입력",
        practiceInputPlaceholder: "위 내용을 입력해 확인",
        practiceTextareaPlaceholder: "문장을 입력해 확인",
        practicePending: "입력해서 확인",
        practiceAgain: "다시 확인",
        practiceOk: "확인됨",
        typingProgress: "입력 확인 %d/%d",
        startBubble: "START",
        wordNodeAria: "단어 코스 시작",
        wordNodeLabel: "단어",
        wordNodeBody: "짧은 표현을 보고 목표 언어의 첫 리듬을 잡습니다.",
        seatNodeAria: "글자 익히기",
        seatNodeLabel: "글자",
        seatNodeBody: "한 글자씩 모양과 소리 단서를 확인합니다.",
        sentenceShortNodeAria: "단문 코스",
        sentenceShortNodeLabel: "단문",
        sentenceShortNodeBody: "한 문장을 완성하며 의미와 손의 흐름을 맞춥니다.",
        sentenceLongNodeAria: "장문 코스",
        sentenceLongNodeLabel: "장문",
        sentenceLongNodeBody: "여러 줄 문맥을 읽고 입력하는 지속력을 기릅니다.",
        sentenceNodeAria: "단문 코스",
        sentenceNodeLabel: "단문",
        sentenceNodeBody: "한 문장을 완성하며 의미와 입력을 맞춥니다.",
        gameNodeAria: "표현 반응 복습",
        gameNodeLabel: "반응",
        gameNodeBody: "속도보다 뜻을 떠올리는 순서를 먼저 확인합니다.",
        keyboardNodeAria: "글자 배열 복습",
        keyboardNodeLabel: "배열",
        keyboardNodeBody: "헷갈리는 글자와 입력 위치를 천천히 점검합니다.",
        reviewNodeAria: "복습 큐",
        reviewNodeLabel: "복습",
        reviewNodeBody: "완료 기록이 생기면 약한 리듬을 다시 불러옵니다.",
        stepLanguageTitle: "1. 언어 능력",
        stepLanguageBody: "오늘 익힐 표현을 보고 뜻과 쓰임을 확인합니다.",
        stepInputTitle: "2. 입력 숙련",
        stepInputBody: "키배열과 IME 조합을 실제 입력으로 익힙니다.",
        stepReviewTitle: "3. 복습 큐",
        stepReviewBody: "틀린 글자, 느린 키, 헷갈린 표현을 다음 연습으로 돌립니다.",
        wordCardTitle: "단어 코스",
        wordCardBody: "짧은 표현으로 목표 언어의 입력 리듬을 만듭니다.",
        sentenceCardTitle: "문장 코스",
        sentenceCardBody: "완성된 문장을 따라 치며 의미와 손의 흐름을 연결합니다.",
        keyboardCardTitle: "키보드 점검",
        keyboardCardBody: "목표 언어의 배열과 약한 키를 확인합니다.",
        myinfoCardTitle: "내 학습 상태",
        myinfoCardBody: "로그인 후 레벨과 연속 학습을 확인합니다."
      },
      myinfo: {
        mainAria: "MirType 내 정보",
        kicker: "My Info",
        title: "내 정보",
        summary: "닉네임과 이름을 관리하고, 브라우저에 저장된 MirType 학습 레벨, 연속 학습, 최근 기록을 확인합니다.",
        profileTitle: "계정 정보",
        progressTitle: "학습 상태",
        recordsTitle: "내 기록",
        recordsSummary: "DB에 저장된 최근 연습 결과를 확인합니다.",
        save: "정보 저장",
        saved: "정보가 저장되었습니다.",
        readonlyEmail: "이메일은 공통 계정 식별자로 사용되어 이 화면에서 수정하지 않습니다.",
        role: "등급",
        loginRequired: "내 정보를 보려면 로그인해 주세요."
      },
      home: {
        mainAria: "MirType 홈",
        kicker: "Start With Your Rhythm",
        title: "타자와 언어를 같은 리듬으로",
        titleLead: "타자와 언어를",
        titleTail: "같은 리듬으로",
        titleLine1: "타자와 언어를",
        titleLine2: "",
        titleLine3: "같은 리듬으로",
        summary: "내 언어로 화면을 보고, 원하는 언어의 키보드와 문장을 고릅니다. 오늘의 연습은 손가락이 먼저 기억하는 작은 흐름에서 시작합니다.",
        ctaSeat: "자리 연습 시작",
        ctaPractice: "타자연습 시작",
        ctaCourse: "언어 코스 시작",
        ctaSettings: "언어 설정",
        ctaIntro: "MirType 살펴보기",
        flowKicker: "Practice Flow",
        flowTitle: "지금 필요한 연습으로 바로 이동",
        cardPracticeTitle: "타자연습",
        cardPracticeBody: "자리, 단어, 문장 연습을 한 곳에서 고릅니다.",
        cardSeatTitle: "자리 연습",
        cardSeatBody: "손가락이 키 위치를 먼저 기억합니다.",
        cardWordTitle: "단어 연습",
        cardWordBody: "짧은 단어로 입력 리듬을 만듭니다.",
        cardSentenceTitle: "문장 연습",
        cardSentenceBody: "문장을 따라 치며 언어 감각을 익힙니다.",
        cardCourseTitle: "언어 코스",
        cardCourseBody: "언어 능력, 입력 숙련, 복습을 한 흐름으로 묶습니다.",
        cardGameTitle: "타자게임",
        cardGameBody: "짧은 몰입으로 반응 속도를 깨웁니다.",
        cardKeyboardTitle: "키보드 테스트",
        cardKeyboardBody: "언어별 배열과 입력 위치를 직접 점검합니다.",
        cardIntroTitle: "MirType 소개",
        cardIntroBody: "왜 만들고 어디로 가는지 살펴봅니다.",
        boardKicker: "Live Practice",
        boardGhost: "언어는 눈으로 읽고 손끝으로 기억합니다.",
        boardTyped: "언어는 눈으로 읽고",
        boardHint: "한국어 · English · Русский"
      },
      books: {
        mainAria: "언어 학습 교재",
        kicker: "Language Books",
        title: "언어 학습 교재",
        summary: "연습할 언어를 고르고 손으로 입력하는 흐름에 맞춰 볼 만한 교재를 모았습니다.",
        searchTitle: "교재 검색",
        searchCta: "검색",
        allCta: "전체 보기",
        detailCta: "자세히 보기",
        externalCta: "서점에서 보기",
        empty: "표시할 교재가 없습니다.",
        error: "교재 목록을 잠시 불러오지 못했습니다.",
        back: "교재 목록으로",
        prev: "이전",
        next: "다음",
        authorPublisher: "%s · %s",
        publisherOnly: "%s",
        published: "출간일",
        publisher: "출판사",
        author: "저자",
        isbn: "ISBN"
      },
      lectures: {
        mainAria: "언어 학습 강의",
        kicker: "Language Lectures",
        title: "언어 학습 강의",
        summary: "연습할 언어를 고르고 손으로 입력하는 흐름에 맞춰 볼 만한 강의를 모았습니다.",
        searchTitle: "강의 검색",
        searchCta: "검색"
      },
      intro: {
        tocOverview: "서비스 소개",
        tocStory: "스토리",
        tocPeople: "만든 사람들",
        kicker: "Typing Practice + Language Learning",
        summary: "MirType은 타자연습과 언어 공부를 동시에 할 수 있도록 만드는 학습형 타자연습 서비스입니다. 자리, 단어, 문장, 키보드 배열을 한 흐름 안에서 익히며 한국어, 영어, 러시아어처럼 다른 문자 체계의 입력 감각까지 함께 다룹니다. 온 세상 사람들이 IT 환경과 조금 더 친숙해지도록 이 웹사이트는 평생 무료로 운영하는 것을 목표로 합니다.",
        ctaPractice: "바로 연습하기",
        ctaKeyboard: "키보드 테스트",
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
      settings: {
        kicker: "Language Setup",
        title: "언어 설정",
        summary: "내 언어를 먼저 고르고, 이어서 연습할 언어를 선택합니다.",
        uiLanguage: "내 언어",
        practiceLanguage: "연습할 언어",
        save: "설정 저장"
      },
      history: {
        title: "최근 기록",
        clear: "비우기",
        empty: "아직 기록이 없습니다.",
        points: "점",
        modes: { seat: "자리 연습", word: "단어 연습", sentence: "문장 연습", sentenceShort: "단문 연습", sentenceLong: "장문 연습", game: "타자게임", keyboard: "키보드 테스트" },
        games: { rain: "산성비", invader: "침략자", mining: "자원 캐기" },
        languages: { ko: "한국어", en: "영어", ru: "러시아어" }
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
      metaTitleHome: "MirType",
      metaDescriptionHome: "Start MirType, a service for typing practice and language learning together",
      metaTitlePractice: "MirType Typing Practice",
      metaDescriptionPractice: "A MirType typing practice hub for key, word, and sentence practice",
      metaTitleCourse: "MirType Language Course",
      metaDescriptionCourse: "A MirType language course that connects language ability, input fluency, and review queues",
      metaTitleIntro: "About MirType",
      metaDescriptionIntro: "About MirType, a service for typing practice and language learning together",
      metaTitleBooks: "MirType Language Learning Books",
      metaDescriptionBooks: "Curated language learning books connected to MirType typing and course practice",
      metaTitleLectures: "MirType Language Learning Lectures",
      metaDescriptionLectures: "Curated language learning lectures connected to MirType typing and course practice",
      metaTitleMyInfo: "My MirType Info",
      metaDescriptionMyInfo: "MirType account information and learning progress",
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
        peopleSocial: "Jae-seong Yoo social links",
        history: "Recent Records",
        languageSetup: "Language Settings",
        closeHistory: "Close records",
        closeSettings: "Close settings"
      },
      nav: {
        practiceGroup: "Practice",
        typingPractice: "Typing Practice",
        seat: "Key Practice",
        word: "Word Practice",
        sentence: "Sentence Practice",
        course: "Language Course",
        game: "Typing Games",
        keyboard: "Keyboard Test",
        keyboardShort: "Keyboard",
        history: "Recent Records",
        intro: "About MirType",
        books: "Language Learning Books",
        lectures: "Language Learning Lectures",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        statground: "Statground",
        webr: "Web-R"
      },
      bottom: {
        aria: "MirType bottom menu",
        home: "Home",
        practice: "Train",
        course: "Course",
        myinfo: "My Info",
        more: "More"
      },
      mobile: {
        today: "Today",
        practice: "Training",
        tools: "Tools",
        account: "Account",
        service: "Service"
      },
      learning: {
        guestRecordNotice: "You can use MirType without logging in. Anonymous records are saved for this browser, and logging in keeps them under your account."
      },
      account: {
        mainAria: "MirType account",
        inputAria: "Account form",
        myAccount: "My Info",
        login: "Log In",
        signup: "Sign Up",
        logout: "Log Out",
        loginKicker: "Account",
        signupKicker: "Create Account",
        loginTitle: "Log In",
        signupTitle: "Sign Up",
        summary: "MirType uses the same account system as Statground and Web-R. With one email account, you can keep your practice records and future service features connected.",
        signedIn: "Signed In",
        rolePrefix: "Role:",
        startPractice: "Start Practice",
        email: "Email",
        password: "Password",
        nickname: "Nickname",
        name: "Name",
        signupSubmit: "Sign Up and Start",
        noAccount: "Need an account?"
      },
      progress: {
        levelLabel: "Level",
        levelHint: "Level up after a 7-day learning streak.",
        levelValue: "Lv. %d",
        streakLabel: "Streak",
        streakHint: "Practice days connected through today or yesterday.",
        streakUnit: "days",
        nextLabel: "To Next Level",
        nextUnit: "days",
        sessionLabel: "Completed Sessions",
        sessionUnit: "sessions"
      },
      languagePractice: {
        kicker: "Language Practice",
        title: "Language practice flow",
        summary: "MirType does not stop at typing speed. It practices target-language expression and the real input method together.",
        languageAxisTitle: "Language ability",
        languageAxisBody: "Build what you can understand and express, like Can-do progress.",
        inputAxisTitle: "Input fluency",
        inputAxisBody: "Learn layouts, IME composition, accuracy, and rhythm by target language.",
        reviewAxisTitle: "Review queue",
        reviewAxisBody: "Bring back mistakes, weak keys, and confusing expressions so they stick longer.",
        loginHint: "Log in to keep level and streak as account-based learning records.",
        courseCta: "View Language Course",
        loginCta: "Log in and keep progress"
      },
      practice: {
        mainAria: "MirType typing practice",
        languageLabel: "Practice Language",
        kicker: "Typing Studio",
        title: "Today's Typing Workbench",
        titleLine1: "Today's Typing",
        titleLine2: "",
        titleLine3: "Workbench",
        summary: "Key, word, and sentence practice are gathered in one place. Choose the detailed practice you need today and jump straight into it.",
        startSeat: "Start with Key Practice",
        startWord: "Continue to Word Practice",
        changeLanguage: "Change Practice Language",
        detailKicker: "Practice Menu",
        detailTitle: "Detailed Practice",
        detailSummary: "Start with keys if you are new, then move to words and sentences when ready.",
        seatCardTitle: "Key Practice",
        seatCardBody: "Let your fingers learn where each key lives.",
        wordCardTitle: "Word Practice",
        wordCardBody: "Build a steady rhythm with short words.",
        sentenceShortCardTitle: "Short Sentences",
        sentenceShortCardBody: "Finish one sentence at a time and match expression with rhythm.",
        sentenceLongCardTitle: "Long Passages",
        sentenceLongCardBody: "Read several lines of context and practice a sustained flow.",
        sentenceCardTitle: "Short Sentences",
        sentenceCardBody: "Finish one sentence at a time and feel the language.",
        gameCardTitle: "Typing Games",
        gameCardBody: "Choose Acid Rain, Invaders, or Resource Mining.",
        keyboardCardTitle: "Keyboard Test",
        keyboardCardBody: "Check layouts and input positions by language, then test with free typing."
      },
      course: {
        mainAria: "MirType language course",
        statusAria: "Learning status",
        languageLabel: "Course Language",
        kicker: "Language Course",
        title: "Language Course",
        summary: "Study the target language step by step with meaning and pronunciation clues.",
        unitKicker: "MIRTYPE BRIDGE 01",
        unitTitle: "Learn one letter, one word, one sentence",
        todayCta: "Start Language Course",
        startWord: "View Today's Cards",
        startSentence: "Continue to Sentence Course",
        changeLanguage: "Change Practice Language",
        levelPanelKicker: "Course Level",
        levelCaption: "%d days to next review",
        levelCaptionReview: "Weekly achievement %d% · reach 85% accuracy for the next level",
        prevLevel: "Previous",
        currentLevel: "Current",
        nextLevel: "Next",
        weekRuleTitle: "7-Day Achievement Course",
        weekRuleBody: "Repeat letters, words, and sentences slowly for one week. Typing speed and elapsed time belong in Typing Practice.",
        mapKicker: "Bridge Map",
        mapTitle: "Today's path across levels",
        bundleKicker: "Difficulty Bundle",
        bundleTitle: "%s · Day %d / 7",
        bundleProgress: "Day %d · achievement %d%",
        bundleFallbackTitle: "Today's Bundle",
        bundleSummaryFallback: "Study the letters, words, and sentences for the current difficulty.",
        todayLettersTitle: "Today's Letters",
        todayLettersHint: "Check shape and sound one letter at a time.",
        todayWordsTitle: "Key Words",
        todaySentencesTitle: "Key Sentences",
        dailyAdvanceHint: "After the sentence card, use Typing Practice separately when you want speed and time feedback.",
        dailyReviewHint: "If meaning or pronunciation still feels unclear, review this level slowly once more.",
        itemMeaningLabel: "Meaning",
        itemPronunciationLabel: "Pronunciation",
        practiceInputLabel: "Type it",
        practiceInputPlaceholder: "Type this item to check",
        practiceTextareaPlaceholder: "Type this sentence to check",
        practicePending: "Type to check",
        practiceAgain: "Check again",
        practiceOk: "Checked",
        typingProgress: "Typed %d/%d",
        startBubble: "START",
        wordNodeAria: "Start Word Course",
        wordNodeLabel: "Words",
        wordNodeBody: "Catch the first rhythm from short expressions.",
        seatNodeAria: "Letter study",
        seatNodeLabel: "Letters",
        seatNodeBody: "Check each letter's shape and sound clue.",
        sentenceShortNodeAria: "Short sentence course",
        sentenceShortNodeLabel: "Short",
        sentenceShortNodeBody: "Complete one sentence and align meaning with hand flow.",
        sentenceLongNodeAria: "Long passage course",
        sentenceLongNodeLabel: "Long",
        sentenceLongNodeBody: "Build stamina by reading and typing several connected lines.",
        sentenceNodeAria: "Short sentence course",
        sentenceNodeLabel: "Short",
        sentenceNodeBody: "Complete one sentence and align meaning with input.",
        gameNodeAria: "Expression recall",
        gameNodeLabel: "React",
        gameNodeBody: "Recall meaning first; speed can wait for practice mode.",
        keyboardNodeAria: "Letter layout review",
        keyboardNodeLabel: "Layout",
        keyboardNodeBody: "Slowly check confusing letters and input positions.",
        reviewNodeAria: "Review Queue",
        reviewNodeLabel: "Review",
        reviewNodeBody: "When records appear, weak rhythms come back here.",
        stepLanguageTitle: "1. Language ability",
        stepLanguageBody: "Preview today's expressions and check meaning and usage.",
        stepInputTitle: "2. Input fluency",
        stepInputBody: "Practice layouts and IME composition through real typing.",
        stepReviewTitle: "3. Review queue",
        stepReviewBody: "Send wrong letters, slow keys, and confusing expressions into the next practice.",
        wordCardTitle: "Word Course",
        wordCardBody: "Build target-language input rhythm with short expressions.",
        sentenceCardTitle: "Sentence Course",
        sentenceCardBody: "Type complete sentences and connect meaning with hand flow.",
        keyboardCardTitle: "Keyboard Check",
        keyboardCardBody: "Check the target-language layout and weak keys.",
        myinfoCardTitle: "My Learning Status",
        myinfoCardBody: "Log in to check your level and streak."
      },
      myinfo: {
        mainAria: "My MirType Info",
        kicker: "My Info",
        title: "My Info",
        summary: "Manage your nickname and name, and check the MirType level, streak, and recent records saved in this browser.",
        profileTitle: "Account Info",
        progressTitle: "Learning Status",
        recordsTitle: "My Records",
        recordsSummary: "Review recent practice results saved in the service database.",
        save: "Save Info",
        saved: "Your information has been saved.",
        readonlyEmail: "Email is used as the shared account identifier and cannot be edited here.",
        role: "Role",
        loginRequired: "Please log in to view your information."
      },
      legal: {
        terms: {
          kind: "Terms of Service",
          title: "Terms of Service",
          description: "These are the basic terms that apply when you use MirType's typing practice, language learning, account, and record features.",
          effective: "Effective date: June 10, 2026",
          sections: [
            {
              title: "Article 1. Purpose",
              paragraphs: ["These Terms set out the conditions for using the typing practice, language learning, keyboard view, typing games, account, and record-related services provided by MirType, operated by Statground Inc., and define the rights, obligations, and responsibilities of the company and users."]
            },
            {
              title: "Article 2. Definitions",
              items: [
                "MirType is a web-based service that provides typing practice and language learning for Korean, English, Russian, and other languages.",
                "A user means any member or visitor who accesses and uses MirType.",
                "A member means a person who signs up or logs in through the shared Statground/Web-R account system and uses MirType's account-based features.",
                "Practice records mean information created when a user completes typing practice or a game, such as accuracy, CPM, WPM, elapsed time, score, practice language, and related data."
              ]
            },
            {
              title: "Article 3. Posting and Changes to the Terms",
              items: [
                "The company posts these Terms on the service screen or a linked screen so that users can easily review them.",
                "The company may revise these Terms within the scope permitted by applicable laws.",
                "Changes that are unfavorable to users will generally be announced 30 days before the effective date. Other changes may be announced 7 days before the effective date.",
                "If a user continues to use the service after the effective date of the changed Terms, the user may be deemed to have agreed to the changed Terms."
              ]
            },
            {
              title: "Article 4. Provision of the Service",
              items: [
                "Typing practice features such as key practice, word practice, sentence practice, keyboard view and free input, and typing games",
                "Multilingual learning features that separate the interface language from the practice language",
                "Sign-up, login, logout, and account-based service features",
                "Database-backed practice record storage, viewing, and future learning flow recommendations",
                "Other features added by the company in line with MirType's purpose"
              ]
            },
            {
              title: "Article 5. Free Operation and Service Changes",
              paragraphs: ["MirType aims to remain free for life so that people around the world can become more comfortable with IT environments. However, some features may be changed or temporarily suspended for service improvement, security, operational changes, legal compliance, or similar reasons."],
              items: [
                "MirType currently does not provide paid products, separate payments, or refundable items.",
                "If paid features are added in the future, fees, payment terms, and refund standards will be announced through a separate notice or policy.",
                "The company may temporarily suspend the service when necessary for regular maintenance, incident response, security measures, external CDN or database failures, and similar reasons."
              ]
            },
            {
              title: "Article 6. Sign-up and Accounts",
              items: [
                "Members may sign up by entering the required information, such as email, password, name, or nickname, in the form provided by the company.",
                "A MirType account may be linked with the shared Statground/Web-R account system, and users may access related services with the same email account.",
                "Members must keep their account information accurate and must promptly notify the company if account misuse or password leakage is suspected.",
                "The company may refuse sign-up requests or restrict use when false information, misuse of another person's information, or interference with service operations is involved."
              ]
            },
            {
              title: "Article 7. User Obligations",
              items: [
                "Users must comply with applicable laws, these Terms, and notices shown on the service screen.",
                "Users must not misuse another person's account or enter false information.",
                "Users must not interfere with normal service operation through automation tools, excessive requests, malicious scripts, attempts to bypass security, or similar conduct.",
                "Users must not enter, store, or transmit content that offends others or violates laws or public order and morals.",
                "Users must not copy, distribute, sell, or commercially use the service source, data, design, trademarks, or similar assets without the company's permission."
              ]
            },
            {
              title: "Article 8. Use Restrictions and Withdrawal",
              items: [
                "If a user violates these Terms or applicable laws, the company may restrict service use or deactivate the account.",
                "Members may request account withdrawal or personal information processing at any time, and the company will handle the request according to applicable laws and internal standards.",
                "Information necessary for investigating misuse, responding to security incidents or disputes, or meeting legal retention duties may be retained for the necessary period."
              ]
            },
            {
              title: "Article 9. Intellectual Property",
              items: [
                "Rights to MirType's service screens, logo, design, software, learning content, and operational materials belong to the company or the lawful rights holder.",
                "Users do not acquire intellectual property rights to the service or content by using the service.",
                "Rights to sentences or practice content entered directly by users remain with the users, but such content may be processed as necessary for service operation, security, statistics, and error improvement."
              ]
            },
            {
              title: "Article 10. Limitation of Liability",
              items: [
                "Because the service is provided free of charge, the company limits warranties regarding service results to the extent permitted by law.",
                "The company is not responsible for damages caused by reasons difficult for the company to control, such as the user's network environment, browser settings, device issues, or external CDN failures.",
                "If the company acts intentionally or with gross negligence, it will bear responsibility under applicable laws."
              ]
            },
            {
              title: "Article 11. Contact",
              paragraphs: ["Questions about service use, accounts, personal information, or these Terms may be submitted through Statground Inc.'s public contact channels or the guidance provided within the service."]
            }
          ]
        },
        privacy: {
          kind: "Privacy Policy",
          title: "Privacy Policy",
          description: "This policy explains what personal information and practice records MirType collects, why they are used, and how they are protected.",
          effective: "Effective date: June 10, 2026",
          sections: [
            {
              title: "Article 1. Purposes of Processing Personal Information",
              paragraphs: ["Statground Inc. processes personal information only to the extent necessary to provide MirType, manage accounts, maintain security, respond to user inquiries, and improve service quality."],
              items: [
                "Sign-up, login, account identification, and maintaining membership status",
                "Providing services such as typing practice, language settings, keyboard view, and typing games",
                "Saving practice records, showing recent records, and improving future learning flows",
                "Preventing misuse, responding to security incidents, and analyzing service failures",
                "Sending notices, responding to inquiries, and informing users of changes to terms or policies"
              ]
            },
            {
              title: "Article 2. Personal Information Processed",
              items: [
                "Sign-up and account management: email, password hash, nickname, name, account status, sign-up date, and last login time",
                "Shared account linkage: shared Statground/Web-R account identifier, role or grade, active or blocked status",
                "Practice and settings information: interface language, practice language, practice type, accuracy, CPM, WPM, elapsed time, score, mistakes, completion time",
                "Automatically generated information: IP address, User-Agent, access time, request path, cookies, error logs, or security event logs",
                "Information directly provided by users for inquiries, such as name, email, inquiry content, and attachments"
              ]
            },
            {
              title: "Article 3. Retention and Use Period",
              items: [
                "Account information is retained until membership withdrawal or until the processing purpose is achieved.",
                "Practice records may be retained while the account remains active to provide record lookup and improve learning flows.",
                "Language settings, game difficulty, practice records, and learning state may be stored in the service database; browser storage is limited to initial display and failure-tolerant cache use.",
                "Access logs and security logs are retained for the period necessary for service stability, misuse prevention, and legal dispute response.",
                "Information that must be retained under applicable laws is kept for the period required by those laws."
              ]
            },
            {
              title: "Article 4. Provision to Third Parties",
              paragraphs: ["The company uses personal information only within the scope of the processing purposes and does not provide it to third parties unless the user consents or a law specifically requires it."]
            },
            {
              title: "Article 5. Outsourcing and External Services",
              paragraphs: ["The company may use external services for infrastructure, CDN, databases, log processing, email delivery, and similar operations. When necessary, the company discloses the processor and outsourced work and manages the processing so that personal information is handled securely."],
              items: [
                "CDNs such as jsDelivr may be used to provide static files.",
                "Account information is linked with the shared Statground/Web-R account database.",
                "Service operation logs and analytics data may be processed in separate storage for security and quality improvement."
              ]
            },
            {
              title: "Article 6. Destruction of Personal Information",
              items: [
                "Personal information is destroyed without delay when the retention period expires or the processing purpose is achieved.",
                "Electronic files are deleted so that recovery is difficult, and paper documents are shredded or incinerated.",
                "Information subject to legal retention duties or needed to prevent misuse may be separated and stored for the necessary period."
              ]
            },
            {
              title: "Article 7. User Rights",
              items: [
                "Users may request access, correction, deletion, or suspension of processing for their personal information.",
                "Requests for account changes, withdrawal, or record deletion may be made through service features or the company's public contact channels.",
                "Some requests may be restricted when legal retention duties apply or when they may harm the rights or safety of others."
              ]
            },
            {
              title: "Article 8. Cookies and browser cache",
              items: [
                "MirType may use HTTP-only cookies to maintain login sessions and non-member learning continuity.",
                "Language settings, game difficulty, recent practice records, course day, and grade are stored in the service database whenever possible, and browser localStorage is limited to initial display or failure-tolerant cache use.",
                "Users may delete cookies or localStorage through browser settings, in which case some convenience features for non-member use may be reset."
              ]
            },
            {
              title: "Article 9. Security Measures",
              items: [
                "Passwords are stored as Django-compatible one-way hashes, not in plain text.",
                "Session cookies are issued as signed values, and security settings are strengthened in the production environment.",
                "Access to personal information is limited to necessary people and systems, and service errors are not exposed to users with internal database information.",
                "The company continuously maintains logs, tests, code reviews, and operational guides to reduce security vulnerabilities and failures."
              ]
            },
            {
              title: "Article 10. Personal Information Protection Officer",
              items: [
                "Company: Statground Inc.",
                "Representative and Personal Information Protection Officer: Jae-seong Yoo",
                "Address: 402-106A, 12, Teheran-ro 70-gil, Gangnam-gu, Seoul, Republic of Korea",
                "Phone: 0507-1300-9704"
              ]
            },
            {
              title: "Article 11. Changes to This Policy",
              paragraphs: ["This Privacy Policy applies from the effective date. If laws, service features, or personal information processing methods change, the company will announce the changes through the service screen or linked screens."]
            }
          ]
        }
      },
      home: {
        mainAria: "MirType home",
        kicker: "Start With Your Rhythm",
        title: "Typing and language in one rhythm",
        titleLead: "Typing and language",
        titleTail: "in one rhythm",
        titleLine1: "Typing and",
        titleLine2: "language",
        titleLine3: "in one rhythm",
        summary: "Read the screen in your language, then practice the keyboard and sentences you want to learn. Today's session starts with a small rhythm your fingers can remember.",
        ctaSeat: "Start Key Practice",
        ctaPractice: "Start Typing Practice",
        ctaCourse: "Start Language Course",
        ctaSettings: "Language Settings",
        ctaIntro: "About MirType",
        flowKicker: "Practice Flow",
        flowTitle: "Jump into the practice you need now",
        cardPracticeTitle: "Typing Practice",
        cardPracticeBody: "Choose key, word, and sentence practice in one place.",
        cardSeatTitle: "Key Practice",
        cardSeatBody: "Let your fingers learn where each key lives.",
        cardWordTitle: "Word Practice",
        cardWordBody: "Build a steady rhythm with short words.",
        cardSentenceTitle: "Sentence Practice",
        cardSentenceBody: "Type full sentences and feel the language.",
        cardCourseTitle: "Language Course",
        cardCourseBody: "Connect language ability, input fluency, and review in one flow.",
        cardGameTitle: "Typing Games",
        cardGameBody: "Wake up reaction speed with a short round.",
        cardKeyboardTitle: "Keyboard Test",
        cardKeyboardBody: "Check layouts and input positions by language with free typing.",
        cardIntroTitle: "About MirType",
        cardIntroBody: "See why it exists and where it is headed.",
        boardKicker: "Live Practice",
        boardGhost: "Language is read by the eyes and remembered by the fingertips.",
        boardTyped: "Language is read by the eyes",
        boardHint: "Korean · English · Russian"
      },
      books: {
        mainAria: "Language Learning Books",
        kicker: "Language Books",
        title: "Language Learning Books",
        summary: "Books selected for the language you want to practice, connected to MirType's typing and learning rhythm.",
        searchTitle: "Search books",
        searchCta: "Search",
        allCta: "All books",
        detailCta: "Details",
        externalCta: "View at bookstore",
        empty: "No books are available yet.",
        error: "The book list could not be loaded for a moment.",
        back: "Back to books",
        prev: "Previous",
        next: "Next",
        authorPublisher: "%s · %s",
        publisherOnly: "%s",
        published: "Published",
        publisher: "Publisher",
        author: "Author",
        isbn: "ISBN"
      },
      lectures: {
        mainAria: "Language Learning Lectures",
        kicker: "Language Lectures",
        title: "Language Learning Lectures",
        summary: "Lectures selected for the language you want to practice, connected to MirType's typing and learning rhythm.",
        searchTitle: "Search lectures",
        searchCta: "Search"
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
      settings: {
        kicker: "Language Setup",
        title: "Language Settings",
        summary: "Choose your language first, then choose the language you want to practice.",
        uiLanguage: "My Language",
        practiceLanguage: "Practice Language",
        save: "Save Settings"
      },
      history: {
        title: "Recent Records",
        clear: "Clear",
        empty: "No records yet.",
        points: "pts",
        modes: { seat: "Key Practice", word: "Word Practice", sentence: "Sentence Practice", sentenceShort: "Short Sentences", sentenceLong: "Long Passages", game: "Typing Games", keyboard: "Keyboard Test" },
        games: { rain: "Acid Rain", invader: "Invaders", mining: "Resource Mining" },
        languages: { ko: "Korean", en: "English", ru: "Russian" }
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
      metaTitleHome: "MirType",
      metaDescriptionHome: "Начальная страница MirType, сервиса для тренировки печати и изучения языков одновременно",
      metaTitlePractice: "Тренировка печати MirType",
      metaDescriptionPractice: "Центр MirType для тренировки клавиш, слов и предложений",
      metaTitleCourse: "Языковой курс MirType",
      metaDescriptionCourse: "Языковой курс MirType, который соединяет языковой навык, навык ввода и очередь повторения",
      metaTitleIntro: "О MirType",
      metaDescriptionIntro: "О MirType, сервисе для тренировки печати и изучения языков одновременно",
      metaTitleBooks: "Учебники языков MirType",
      metaDescriptionBooks: "Подборка учебников для изучения языков, связанная с практикой печати MirType",
      metaTitleLectures: "Курсы языков MirType",
      metaDescriptionLectures: "Подборка курсов для изучения языков, связанная с практикой печати MirType",
      metaTitleMyInfo: "Моя информация MirType",
      metaDescriptionMyInfo: "Информация аккаунта MirType и учебный прогресс",
      brand: {
        homeAria: "Главная MirType",
        tagline: "Печать и языки вместе"
      },
      aria: {
        menu: "Меню MirType",
        openMenu: "Открыть меню",
        closeMenu: "Закрыть меню",
        introMain: "О MirType",
        introToc: "Разделы о MirType",
        peopleSocial: "Социальные ссылки Jae-seong Yoo",
        history: "Последние записи",
        languageSetup: "Настройка языка",
        closeHistory: "Закрыть записи",
        closeSettings: "Закрыть настройки"
      },
      nav: {
        practiceGroup: "Тренировка",
        typingPractice: "Печать",
        seat: "Клавиши",
        word: "Слова",
        sentence: "Предложения",
        course: "Языковой курс",
        game: "Игры",
        keyboard: "Проверка клавиатуры",
        keyboardShort: "Клавиатура",
        history: "Последние записи",
        intro: "О MirType",
        books: "Учебники языков",
        lectures: "Курсы языков",
        terms: "Условия сервиса",
        privacy: "Политика конфиденциальности",
        statground: "Statground",
        webr: "Web-R"
      },
      bottom: {
        aria: "Нижнее меню MirType",
        home: "Главная",
        practice: "Тренинг",
        course: "Курс",
        myinfo: "Профиль",
        more: "Еще"
      },
      mobile: {
        today: "Сегодня",
        practice: "Тренинг",
        tools: "Инструменты",
        account: "Аккаунт",
        service: "Сервис"
      },
      learning: {
        guestRecordNotice: "Можно пользоваться без входа. Анонимные записи сохраняются для этого браузера, а после входа ведутся в аккаунте."
      },
      account: {
        mainAria: "Аккаунт MirType",
        inputAria: "Форма аккаунта",
        myAccount: "Моя информация",
        login: "Войти",
        signup: "Регистрация",
        logout: "Выйти",
        loginKicker: "Аккаунт",
        signupKicker: "Создать аккаунт",
        loginTitle: "Вход",
        signupTitle: "Регистрация",
        summary: "MirType использует общую систему аккаунтов Statground и Web-R. С одной электронной почтой можно сохранить историю тренировок и будущие функции сервиса.",
        signedIn: "Вход выполнен",
        rolePrefix: "Роль:",
        startPractice: "Начать тренировку",
        email: "Электронная почта",
        password: "Пароль",
        nickname: "Никнейм",
        name: "Имя",
        signupSubmit: "Зарегистрироваться и начать",
        noAccount: "Нет аккаунта?"
      },
      progress: {
        levelLabel: "Уровень",
        levelHint: "Новый уровень открывается после серии в 7 дней.",
        levelValue: "Ур. %d",
        streakLabel: "Серия",
        streakHint: "Дни тренировки, продолжающиеся до сегодня или вчера.",
        streakUnit: "дн.",
        nextLabel: "До след. уровня",
        nextUnit: "дн.",
        sessionLabel: "Завершенные тренировки",
        sessionUnit: "раз"
      },
      languagePractice: {
        kicker: "Language Practice",
        title: "Поток языковой практики",
        summary: "MirType смотрит не только на скорость печати: вы тренируете выражения целевого языка и реальный способ ввода вместе.",
        languageAxisTitle: "Языковой навык",
        languageAxisBody: "Постепенно накапливайте то, что можете понимать и выражать.",
        inputAxisTitle: "Навык ввода",
        inputAxisBody: "Осваивайте раскладки, IME, точность и ритм для каждого языка.",
        reviewAxisTitle: "Очередь повторения",
        reviewAxisBody: "Ошибки, слабые клавиши и путающиеся выражения возвращаются в повторение.",
        loginHint: "Войдите, чтобы уровень и серия стали учебными записями вашего аккаунта.",
        courseCta: "Открыть языковой курс",
        loginCta: "Войти и продолжить прогресс"
      },
      practice: {
        mainAria: "Тренировка печати MirType",
        languageLabel: "Язык тренировки",
        kicker: "Typing Studio",
        title: "Рабочее место печати на сегодня",
        titleLine1: "Рабочее место",
        titleLine2: "печати",
        titleLine3: "на сегодня",
        summary: "Клавиши, слова и предложения собраны в одном месте. Выберите нужную тренировку на сегодня и сразу перейдите к ней.",
        startSeat: "Начать с клавиш",
        startWord: "Продолжить словами",
        changeLanguage: "Сменить язык тренировки",
        detailKicker: "Practice Menu",
        detailTitle: "Подробные тренировки",
        detailSummary: "Если вы начинаете, выберите клавиши; если уже привыкли, переходите к словам и предложениям.",
        seatCardTitle: "Клавиши",
        seatCardBody: "Пальцы сначала запоминают расположение клавиш.",
        wordCardTitle: "Слова",
        wordCardBody: "Короткие слова помогают найти ритм.",
        sentenceShortCardTitle: "Короткие фразы",
        sentenceShortCardBody: "Завершайте по одной фразе и соединяйте выражение с ритмом.",
        sentenceLongCardTitle: "Длинные тексты",
        sentenceLongCardBody: "Читайте несколько строк контекста и тренируйте устойчивый поток.",
        sentenceCardTitle: "Короткие фразы",
        sentenceCardBody: "Печатайте по одной фразе и чувствуйте язык.",
        gameCardTitle: "Игры",
        gameCardBody: "Выберите кислотный дождь, захватчиков или добычу ресурсов.",
        keyboardCardTitle: "Клавиатура",
        keyboardCardBody: "Проверьте раскладки и позиции ввода, затем попробуйте свободный ввод."
      },
      course: {
        mainAria: "Языковой курс MirType",
        statusAria: "Учебный статус",
        languageLabel: "Язык курса",
        kicker: "Language Course",
        title: "Языковой курс",
        summary: "Изучайте целевой язык постепенно: значение, подсказка произношения, затем фраза.",
        unitKicker: "MIRTYPE BRIDGE 01",
        unitTitle: "По одной букве, слову и фразе",
        todayCta: "Начать языковой курс",
        startWord: "Открыть карточки дня",
        startSentence: "Продолжить предложениями",
        changeLanguage: "Сменить язык тренировки",
        levelPanelKicker: "Course Level",
        levelCaption: "%d дн. до проверки",
        levelCaptionReview: "Результат недели %d% · для нового уровня нужна точность 85%",
        prevLevel: "Прошлый",
        currentLevel: "Текущий",
        nextLevel: "Следующий",
        weekRuleTitle: "Курс достижений на 7 дней",
        weekRuleBody: "В течение недели буквы, слова и фразы повторяются спокойно. Скорость печати и время остаются в режиме тренировки печати.",
        mapKicker: "Bridge Map",
        mapTitle: "Сегодняшний путь по уровням",
        bundleKicker: "Difficulty Bundle",
        bundleTitle: "%s · День %d / 7",
        bundleProgress: "День %d · результат %d%",
        bundleFallbackTitle: "Блок на сегодня",
        bundleSummaryFallback: "Изучайте буквы, слова и фразы текущей сложности.",
        todayLettersTitle: "Буквы дня",
        todayLettersHint: "Проверяйте форму и звук по одной букве.",
        todayWordsTitle: "Ключевые слова",
        todaySentencesTitle: "Ключевые фразы",
        dailyAdvanceHint: "После фразы переходите в тренировку печати отдельно, если нужны скорость и время.",
        dailyReviewHint: "Если значение или произношение еще неясны, повторите этот уровень медленно.",
        itemMeaningLabel: "Значение",
        itemPronunciationLabel: "Произношение",
        practiceInputLabel: "Напечатайте",
        practiceInputPlaceholder: "Введите карточку для проверки",
        practiceTextareaPlaceholder: "Введите фразу для проверки",
        practicePending: "Введите для проверки",
        practiceAgain: "Проверьте еще раз",
        practiceOk: "Проверено",
        typingProgress: "Ввод %d/%d",
        startBubble: "START",
        wordNodeAria: "Начать курс слов",
        wordNodeLabel: "Слова",
        wordNodeBody: "Поймайте первый ритм в коротких выражениях.",
        seatNodeAria: "Изучение букв",
        seatNodeLabel: "Буквы",
        seatNodeBody: "Проверяйте форму и звуковую подсказку каждой буквы.",
        sentenceShortNodeAria: "Курс коротких фраз",
        sentenceShortNodeLabel: "Фразы",
        sentenceShortNodeBody: "Завершайте одну фразу и связывайте смысл с движением рук.",
        sentenceLongNodeAria: "Курс длинных текстов",
        sentenceLongNodeLabel: "Текст",
        sentenceLongNodeBody: "Читайте и печатайте несколько связанных строк без спешки.",
        sentenceNodeAria: "Курс коротких фраз",
        sentenceNodeLabel: "Фразы",
        sentenceNodeBody: "Завершайте одну фразу и связывайте смысл с вводом.",
        gameNodeAria: "Повторение смысла",
        gameNodeLabel: "Реакция",
        gameNodeBody: "Сначала вспоминайте значение; скорость подождет до тренировки.",
        keyboardNodeAria: "Повторение раскладки букв",
        keyboardNodeLabel: "Раскладка",
        keyboardNodeBody: "Медленно проверьте сложные буквы и позиции ввода.",
        reviewNodeAria: "Очередь повторения",
        reviewNodeLabel: "Повтор",
        reviewNodeBody: "Когда появятся записи, слабые ритмы вернутся сюда.",
        stepLanguageTitle: "1. Языковой навык",
        stepLanguageBody: "Посмотрите выражения на сегодня и проверьте значение и употребление.",
        stepInputTitle: "2. Навык ввода",
        stepInputBody: "Тренируйте раскладку и IME через реальный ввод.",
        stepReviewTitle: "3. Очередь повторения",
        stepReviewBody: "Ошибочные буквы, медленные клавиши и сложные выражения идут в следующую тренировку.",
        wordCardTitle: "Курс слов",
        wordCardBody: "Создавайте ритм ввода целевого языка на коротких выражениях.",
        sentenceCardTitle: "Курс предложений",
        sentenceCardBody: "Печатайте полные предложения и соединяйте смысл с движением рук.",
        keyboardCardTitle: "Проверка клавиатуры",
        keyboardCardBody: "Проверьте раскладку целевого языка и слабые клавиши.",
        myinfoCardTitle: "Мой учебный статус",
        myinfoCardBody: "Войдите, чтобы увидеть уровень и серию."
      },
      myinfo: {
        mainAria: "Моя информация MirType",
        kicker: "My Info",
        title: "Моя информация",
        summary: "Управляйте никнеймом и именем, а также смотрите уровень MirType, серию и последние записи, сохраненные в этом браузере.",
        profileTitle: "Информация аккаунта",
        progressTitle: "Учебный статус",
        recordsTitle: "Мои записи",
        recordsSummary: "Посмотрите последние результаты тренировок, сохраненные в базе сервиса.",
        save: "Сохранить",
        saved: "Информация сохранена.",
        readonlyEmail: "Электронная почта используется как общий идентификатор аккаунта и здесь не редактируется.",
        role: "Роль",
        loginRequired: "Войдите, чтобы увидеть свою информацию."
      },
      legal: {
        terms: {
          kind: "Условия сервиса",
          title: "Условия сервиса",
          description: "Основные условия, которые применяются при использовании функций MirType для тренировки печати, изучения языков, аккаунта и записей.",
          effective: "Дата вступления в силу: 10 июня 2026 г.",
          sections: [
            {
              title: "Статья 1. Цель",
              paragraphs: ["Эти условия определяют порядок использования функций тренировки печати, изучения языков, просмотра клавиатуры, игр, аккаунта и записей, предоставляемых MirType, сервисом компании Statground Inc., а также права, обязанности и ответственность компании и пользователей."]
            },
            {
              title: "Статья 2. Определения",
              items: [
                "MirType — веб-сервис для тренировки печати и изучения корейского, английского, русского и других языков.",
                "Пользователь — участник или посетитель, который заходит в MirType и пользуется сервисом.",
                "Участник — человек, который регистрируется или входит через общую систему аккаунтов Statground/Web-R и использует функции MirType, связанные с аккаунтом.",
                "Записи тренировки — данные, создаваемые после завершения тренировки или игры: точность, CPM, WPM, время, счет, язык тренировки и связанные сведения."
              ]
            },
            {
              title: "Статья 3. Публикация и изменение условий",
              items: [
                "Компания размещает эти условия на экране сервиса или на связанной странице, чтобы пользователи могли легко их проверить.",
                "Компания может изменять эти условия в пределах, разрешенных применимым законодательством.",
                "Изменения, неблагоприятные для пользователей, как правило, объявляются за 30 дней до вступления в силу. Остальные изменения могут объявляться за 7 дней.",
                "Если пользователь продолжает пользоваться сервисом после даты вступления изменений в силу, считается, что он согласился с измененными условиями."
              ]
            },
            {
              title: "Статья 4. Предоставление сервиса",
              items: [
                "Функции тренировки печати: клавиши, слова, предложения, просмотр клавиатуры, свободный ввод и игры",
                "Многоязычные учебные функции, где язык интерфейса и язык тренировки выбираются отдельно",
                "Регистрация, вход, выход и функции сервиса, связанные с аккаунтом",
                "Сохранение и просмотр записей тренировки в браузере или аккаунте, а также будущие рекомендации учебного потока",
                "Другие функции, которые компания добавляет в соответствии с целью MirType"
              ]
            },
            {
              title: "Статья 5. Бесплатная работа и изменения сервиса",
              paragraphs: ["MirType стремится оставаться бесплатным на всю жизнь, чтобы людям по всему миру было проще привыкать к IT-среде. Однако отдельные функции могут изменяться или временно приостанавливаться для улучшения сервиса, безопасности, операционных изменений, соблюдения закона и похожих причин."],
              items: [
                "Сейчас MirType не предоставляет платные продукты, отдельные платежи или объекты возврата.",
                "Если в будущем появятся платные функции, стоимость, условия оплаты и правила возврата будут объявлены отдельным уведомлением или политикой.",
                "Компания может временно приостанавливать сервис при регулярном обслуживании, реагировании на инциденты, мерах безопасности, сбоях внешнего CDN или базы данных и подобных обстоятельствах."
              ]
            },
            {
              title: "Статья 6. Регистрация и аккаунты",
              items: [
                "Участник может зарегистрироваться, введя обязательные данные, такие как электронная почта, пароль, имя или никнейм, в форме, предоставленной компанией.",
                "Аккаунт MirType может быть связан с общей системой аккаунтов Statground/Web-R, и пользователь может получать доступ к связанным сервисам с той же электронной почтой.",
                "Участник должен поддерживать данные аккаунта точными и своевременно уведомлять компанию при подозрении на неправомерное использование аккаунта или утечку пароля.",
                "Компания может отказать в регистрации или ограничить использование при ложной информации, использовании чужих данных или вмешательстве в работу сервиса."
              ]
            },
            {
              title: "Статья 7. Обязанности пользователей",
              items: [
                "Пользователь должен соблюдать применимые законы, эти условия и инструкции на экране сервиса.",
                "Пользователь не должен использовать чужой аккаунт или вводить ложную информацию.",
                "Пользователь не должен мешать нормальной работе сервиса автоматическими инструментами, чрезмерными запросами, вредоносными скриптами, попытками обхода безопасности и похожими действиями.",
                "Пользователь не должен вводить, хранить или передавать контент, который оскорбляет других или нарушает закон, общественный порядок и мораль.",
                "Пользователь не должен копировать, распространять, продавать или коммерчески использовать исходный код, данные, дизайн, товарные знаки и похожие активы сервиса без разрешения компании."
              ]
            },
            {
              title: "Статья 8. Ограничение использования и выход",
              items: [
                "Если пользователь нарушает эти условия или применимые законы, компания может ограничить использование сервиса или деактивировать аккаунт.",
                "Участник может в любое время запросить удаление аккаунта или обработку персональных данных, и компания обработает запрос согласно применимым законам и внутренним стандартам.",
                "Информация, необходимая для расследования злоупотреблений, реагирования на инциденты безопасности или споры, а также для законных обязанностей хранения, может сохраняться в течение необходимого периода."
              ]
            },
            {
              title: "Статья 9. Интеллектуальная собственность",
              items: [
                "Права на экраны MirType, логотип, дизайн, программное обеспечение, учебный контент и операционные материалы принадлежат компании или законному правообладателю.",
                "Пользователь не получает права интеллектуальной собственности на сервис или контент только из-за использования сервиса.",
                "Права на предложения или тренировочный контент, который пользователь вводит самостоятельно, остаются у пользователя, но такой контент может обрабатываться в пределах, необходимых для работы сервиса, безопасности, статистики и улучшения ошибок."
              ]
            },
            {
              title: "Статья 10. Ограничение ответственности",
              items: [
                "Поскольку сервис предоставляется бесплатно, компания ограничивает гарантии относительно результатов использования сервиса в пределах, разрешенных законом.",
                "Компания не несет ответственности за ущерб, вызванный причинами, которые трудно контролировать компании, такими как сеть пользователя, настройки браузера, проблемы устройства или сбои внешнего CDN.",
                "Если компания действует умышленно или с грубой неосторожностью, она несет ответственность согласно применимому законодательству."
              ]
            },
            {
              title: "Статья 11. Контакты",
              paragraphs: ["Вопросы об использовании сервиса, аккаунтах, персональных данных или этих условиях можно направлять через публичные контакты Statground Inc. или инструкции, предоставленные внутри сервиса."]
            }
          ]
        },
        privacy: {
          kind: "Политика конфиденциальности",
          title: "Политика конфиденциальности",
          description: "Эта политика объясняет, какие персональные данные и записи тренировки собирает MirType, зачем они используются и как защищаются.",
          effective: "Дата вступления в силу: 10 июня 2026 г.",
          sections: [
            {
              title: "Статья 1. Цели обработки персональных данных",
              paragraphs: ["Statground Inc. обрабатывает персональные данные только в пределах, необходимых для предоставления MirType, управления аккаунтами, поддержания безопасности, ответа на запросы пользователей и улучшения качества сервиса."],
              items: [
                "Регистрация, вход, идентификация аккаунта и поддержание статуса участника",
                "Предоставление функций: тренировка печати, настройки языка, просмотр клавиатуры и игры",
                "Сохранение записей тренировки, показ последних записей и улучшение будущих учебных потоков",
                "Предотвращение злоупотреблений, реагирование на инциденты безопасности и анализ сбоев сервиса",
                "Отправка уведомлений, ответы на запросы и информирование об изменениях условий или политик"
              ]
            },
            {
              title: "Статья 2. Обрабатываемые персональные данные",
              items: [
                "Регистрация и управление аккаунтом: электронная почта, hash пароля, никнейм, имя, статус аккаунта, дата регистрации и время последнего входа",
                "Связь с общей системой аккаунтов: идентификатор общего аккаунта Statground/Web-R, роль или уровень, активный или заблокированный статус",
                "Данные тренировки и настроек: язык интерфейса, язык тренировки, тип тренировки, точность, CPM, WPM, время, счет, ошибки, время завершения",
                "Автоматически создаваемая информация: IP-адрес, User-Agent, время доступа, путь запроса, cookies, журналы ошибок или событий безопасности",
                "Информация, которую пользователь напрямую предоставляет для запросов: имя, электронная почта, содержание запроса и вложения"
              ]
            },
            {
              title: "Статья 3. Период хранения и использования",
              items: [
                "Данные аккаунта хранятся до выхода из членства или до достижения цели обработки.",
                "Записи тренировки могут храниться, пока аккаунт активен, чтобы предоставлять просмотр записей и улучшать учебные потоки.",
                "Языковые настройки, сложность игры, записи тренировки и учебное состояние могут храниться в базе данных сервиса; хранилище браузера используется только для первичного отображения и резервного cache при сбоях.",
                "Журналы доступа и безопасности хранятся в течение периода, необходимого для стабильности сервиса, предотвращения злоупотреблений и реагирования на правовые споры.",
                "Информация, которую необходимо хранить по применимым законам, хранится в течение периода, требуемого такими законами."
              ]
            },
            {
              title: "Статья 4. Передача третьим лицам",
              paragraphs: ["Компания использует персональные данные только в рамках целей обработки и не передает их третьим лицам, если пользователь не дал согласие или закон прямо не требует такой передачи."]
            },
            {
              title: "Статья 5. Передача обработки и внешние сервисы",
              paragraphs: ["Компания может использовать внешние сервисы для инфраструктуры, CDN, баз данных, обработки журналов, доставки электронной почты и похожих операций. При необходимости компания раскрывает обработчика и переданную работу и управляет обработкой так, чтобы персональные данные обрабатывались безопасно."],
              items: [
                "Для предоставления статических файлов могут использоваться CDN, такие как jsDelivr.",
                "Данные аккаунта связаны с общей базой аккаунтов Statground/Web-R.",
                "Операционные журналы сервиса и аналитические данные могут обрабатываться в отдельном хранилище для безопасности и улучшения качества."
              ]
            },
            {
              title: "Статья 6. Уничтожение персональных данных",
              items: [
                "Персональные данные уничтожаются без задержки после истечения срока хранения или достижения цели обработки.",
                "Электронные файлы удаляются так, чтобы восстановление было затруднено, а бумажные документы измельчаются или сжигаются.",
                "Информация, подлежащая законному хранению или необходимая для предотвращения злоупотреблений, может быть отделена и храниться в течение необходимого периода."
              ]
            },
            {
              title: "Статья 7. Права пользователей",
              items: [
                "Пользователь может запросить доступ, исправление, удаление или приостановку обработки своих персональных данных.",
                "Запросы на изменение аккаунта, выход или удаление записей можно направлять через функции сервиса или публичные контакты компании.",
                "Некоторые запросы могут быть ограничены, если применяются обязанности законного хранения или если запрос может повредить правам или безопасности других лиц."
              ]
            },
            {
              title: "Статья 8. Cookies и cache браузера",
              items: [
                "MirType может использовать HTTP-only cookies для поддержания сеансов входа и непрерывности обучения без входа.",
                "Языковые настройки, сложность игры, последние записи тренировки, день курса и уровень по возможности хранятся в базе данных сервиса, а localStorage браузера используется только для первичного отображения или резервного cache при сбоях.",
                "Пользователь может удалить cookies или localStorage через настройки браузера, и в этом случае некоторые удобные функции для использования без входа могут быть сброшены."
              ]
            },
            {
              title: "Статья 9. Меры безопасности",
              items: [
                "Пароли хранятся как односторонние hash, совместимые с Django, а не в открытом виде.",
                "Session cookies выпускаются как подписанные значения, а в production-среде настройки безопасности усиливаются.",
                "Доступ к персональным данным ограничивается необходимыми людьми и системами, а ошибки сервиса не показывают пользователям внутреннюю информацию базы данных.",
                "Компания постоянно поддерживает журналы, тесты, code review и операционные guides, чтобы уменьшать уязвимости и сбои."
              ]
            },
            {
              title: "Статья 10. Ответственный за защиту персональных данных",
              items: [
                "Компания: Statground Inc.",
                "Представитель и ответственный за защиту персональных данных: Jae-seong Yoo",
                "Адрес: 402-106A, 12, Teheran-ro 70-gil, Gangnam-gu, Seoul, Republic of Korea",
                "Телефон: 0507-1300-9704"
              ]
            },
            {
              title: "Статья 11. Изменения этой политики",
              paragraphs: ["Эта Политика конфиденциальности применяется с даты вступления в силу. Если изменятся законы, функции сервиса или способы обработки персональных данных, компания объявит изменения на экране сервиса или связанных страницах."]
            }
          ]
        }
      },
      home: {
        mainAria: "Главная MirType",
        kicker: "Start With Your Rhythm",
        title: "Печать и язык в одном ритме",
        titleLead: "Печать и язык",
        titleTail: "в одном ритме",
        titleLine1: "Печать и язык",
        titleLine2: "",
        titleLine3: "в одном ритме",
        summary: "Смотрите интерфейс на своем языке и тренируйте клавиатуру, слова и предложения на языке, который хотите освоить. Сегодняшняя практика начинается с маленького ритма, который запоминают пальцы.",
        ctaSeat: "Начать с клавиш",
        ctaPractice: "Начать печать",
        ctaCourse: "Начать языковой курс",
        ctaSettings: "Настроить языки",
        ctaIntro: "О MirType",
        flowKicker: "Practice Flow",
        flowTitle: "Выберите нужную тренировку",
        cardPracticeTitle: "Печать",
        cardPracticeBody: "Выберите клавиши, слова и предложения в одном месте.",
        cardSeatTitle: "Клавиши",
        cardSeatBody: "Пальцы сначала запоминают расположение клавиш.",
        cardWordTitle: "Слова",
        cardWordBody: "Короткие слова помогают найти ритм.",
        cardSentenceTitle: "Предложения",
        cardSentenceBody: "Печатайте фразы и чувствуйте язык.",
        cardCourseTitle: "Языковой курс",
        cardCourseBody: "Соедините языковой навык, ввод и повторение в один поток.",
        cardGameTitle: "Игры",
        cardGameBody: "Короткий раунд пробуждает реакцию.",
        cardKeyboardTitle: "Проверка клавиатуры",
        cardKeyboardBody: "Проверьте раскладки и позиции ввода свободным набором.",
        cardIntroTitle: "О MirType",
        cardIntroBody: "Узнайте, зачем создан сервис и куда он движется.",
        boardKicker: "Live Practice",
        boardGhost: "Язык читают глазами и запоминают кончиками пальцев.",
        boardTyped: "Язык читают глазами",
        boardHint: "Корейский · English · Русский"
      },
      books: {
        mainAria: "Учебники языков",
        kicker: "Language Books",
        title: "Учебники языков",
        summary: "Книги для языка, который вы хотите практиковать, связаны с ритмом печати и обучения MirType.",
        searchTitle: "Поиск книг",
        searchCta: "Искать",
        allCta: "Все книги",
        detailCta: "Подробнее",
        externalCta: "Открыть в магазине",
        empty: "Книги пока недоступны.",
        error: "Список книг временно не удалось загрузить.",
        back: "К списку книг",
        prev: "Назад",
        next: "Далее",
        authorPublisher: "%s · %s",
        publisherOnly: "%s",
        published: "Дата выхода",
        publisher: "Издатель",
        author: "Автор",
        isbn: "ISBN"
      },
      lectures: {
        mainAria: "Курсы языков",
        kicker: "Language Lectures",
        title: "Курсы языков",
        summary: "Курсы для языка, который вы хотите практиковать, связаны с ритмом печати и обучения MirType.",
        searchTitle: "Поиск курсов",
        searchCta: "Искать"
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
      settings: {
        kicker: "Language Setup",
        title: "Настройка языка",
        summary: "Сначала выберите свой язык, затем язык для тренировки.",
        uiLanguage: "Мой язык",
        practiceLanguage: "Язык тренировки",
        save: "Сохранить"
      },
      history: {
        title: "Последние записи",
        clear: "Очистить",
        empty: "Записей пока нет.",
        points: "очк.",
        modes: { seat: "Клавиши", word: "Слова", sentence: "Предложения", sentenceShort: "Короткие фразы", sentenceLong: "Длинные тексты", game: "Игры", keyboard: "Проверка клавиатуры" },
        games: { rain: "Кислотный дождь", invader: "Захватчики", mining: "Добыча ресурсов" },
        languages: { ko: "Корейский", en: "Английский", ru: "Русский" }
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

  function languageMeta(value) {
    var key = normalizeLanguage(value);
    return languageOptions[key] || languageOptions.ko;
  }

  function languageFlagURL(value) {
    var meta = languageMeta(value);
    var country = String(meta.country || "kr").toLowerCase().replace(/[^a-z-]/g, "") || "kr";
    return FLAG_CDN_BASE + country + ".svg";
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
      if (value !== "" || node.hasAttribute("data-shell-i18n-empty")) {
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
    qsa("[data-shell-i18n-placeholder]").forEach(function (node) {
      var value = valueAtPath(copy, node.getAttribute("data-shell-i18n-placeholder"));
      if (value !== "") {
        node.setAttribute("placeholder", value);
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

  function localizeHomeMeta(copy) {
    if (!qs(".home-page[data-shell-i18n-aria='home.mainAria']")) {
      return;
    }
    document.title = copy.metaTitleHome;
    var description = qs("meta[name='description']");
    var ogTitle = qs("meta[property='og:title']");
    var ogDescription = qs("meta[property='og:description']");
    if (description) {
      description.setAttribute("content", copy.metaDescriptionHome);
    }
    if (ogTitle) {
      ogTitle.setAttribute("content", copy.metaTitleHome);
    }
    if (ogDescription) {
      ogDescription.setAttribute("content", copy.metaDescriptionHome);
    }
  }

  function localizePracticeMeta(copy) {
    if (!qs(".practice-page")) {
      return;
    }
    document.title = copy.metaTitlePractice;
    var description = qs("meta[name='description']");
    var ogTitle = qs("meta[property='og:title']");
    var ogDescription = qs("meta[property='og:description']");
    if (description) {
      description.setAttribute("content", copy.metaDescriptionPractice);
    }
    if (ogTitle) {
      ogTitle.setAttribute("content", copy.metaTitlePractice);
    }
    if (ogDescription) {
      ogDescription.setAttribute("content", copy.metaDescriptionPractice);
    }
  }

  function localizeBooksMeta(copy) {
    if (!qs(".books-page") || qs(".lectures-page") || qs(".book-detail")) {
      return;
    }
    document.title = copy.metaTitleBooks;
    var description = qs("meta[name='description']");
    var ogTitle = qs("meta[property='og:title']");
    var ogDescription = qs("meta[property='og:description']");
    if (description) {
      description.setAttribute("content", copy.metaDescriptionBooks);
    }
    if (ogTitle) {
      ogTitle.setAttribute("content", copy.metaTitleBooks);
    }
    if (ogDescription) {
      ogDescription.setAttribute("content", copy.metaDescriptionBooks);
    }
  }

  function localizeLecturesMeta(copy) {
    if (!qs(".lectures-page") || qs(".lecture-detail")) {
      return;
    }
    document.title = copy.metaTitleLectures;
    var description = qs("meta[name='description']");
    var ogTitle = qs("meta[property='og:title']");
    var ogDescription = qs("meta[property='og:description']");
    if (description) {
      description.setAttribute("content", copy.metaDescriptionLectures);
    }
    if (ogTitle) {
      ogTitle.setAttribute("content", copy.metaTitleLectures);
    }
    if (ogDescription) {
      ogDescription.setAttribute("content", copy.metaDescriptionLectures);
    }
  }

  function localizeCourseMeta(copy) {
    if (!qs(".course-page")) {
      return;
    }
    document.title = copy.metaTitleCourse;
    var description = qs("meta[name='description']");
    var ogTitle = qs("meta[property='og:title']");
    var ogDescription = qs("meta[property='og:description']");
    if (description) {
      description.setAttribute("content", copy.metaDescriptionCourse);
    }
    if (ogTitle) {
      ogTitle.setAttribute("content", copy.metaTitleCourse);
    }
    if (ogDescription) {
      ogDescription.setAttribute("content", copy.metaDescriptionCourse);
    }
  }

  function localizeMyInfoMeta(copy) {
    if (!qs(".myinfo-page")) {
      return;
    }
    document.title = copy.metaTitleMyInfo;
    var description = qs("meta[name='description']");
    var ogTitle = qs("meta[property='og:title']");
    var ogDescription = qs("meta[property='og:description']");
    if (description) {
      description.setAttribute("content", copy.metaDescriptionMyInfo);
    }
    if (ogTitle) {
      ogTitle.setAttribute("content", copy.metaTitleMyInfo);
    }
    if (ogDescription) {
      ogDescription.setAttribute("content", copy.metaDescriptionMyInfo);
    }
  }

  function legalNodeText(node) {
    return node ? String(node.textContent || "").trim() : "";
  }

  function readLegalPageFromDOM(page, key) {
    return {
      kind: legalNodeText(qs("[data-legal-kind]", page)),
      title: legalNodeText(qs("[data-legal-title]", page)),
      description: legalNodeText(qs("[data-legal-description]", page)),
      effective: legalNodeText(qs("[data-legal-effective]", page)),
      sections: qsa("[data-legal-section]", page).map(function (section) {
        return {
          title: legalNodeText(qs("[data-legal-section-title]", section)),
          paragraphs: qsa("[data-legal-paragraph]", section).map(legalNodeText),
          items: qsa("[data-legal-item]", section).map(legalNodeText)
        };
      }),
      key: key
    };
  }

  function ensureOriginalLegalPage(page, key) {
    if (!originalLegalPages[key]) {
      originalLegalPages[key] = readLegalPageFromDOM(page, key);
    }
    return originalLegalPages[key];
  }

  function setLegalText(root, selector, value) {
    var node = qs(selector, root);
    if (node && value) {
      node.textContent = value;
    }
  }

  function updateLegalTextList(nodes, values) {
    var list = Array.isArray(values) ? values : [];
    nodes.forEach(function (node, index) {
      if (typeof list[index] === "string") {
        node.textContent = list[index];
      }
    });
  }

  function updateLegalMeta(legal) {
    var title = legal.title || "";
    var descriptionText = legal.description || "";
    var description = qs("meta[name='description']");
    var ogTitle = qs("meta[property='og:title']");
    var ogDescription = qs("meta[property='og:description']");
    if (title) {
      document.title = title;
      if (ogTitle) {
        ogTitle.setAttribute("content", title);
      }
    }
    if (descriptionText) {
      if (description) {
        description.setAttribute("content", descriptionText);
      }
      if (ogDescription) {
        ogDescription.setAttribute("content", descriptionText);
      }
    }
  }

  function applyLegalPageContent(page, legal) {
    setLegalText(page, "[data-legal-kind]", legal.kind);
    setLegalText(page, "[data-legal-title]", legal.title);
    setLegalText(page, "[data-legal-description]", legal.description);
    setLegalText(page, "[data-legal-effective]", legal.effective);
    if (legal.title) {
      page.setAttribute("aria-label", legal.aria || legal.title);
    }
    qsa("[data-legal-section]", page).forEach(function (section, index) {
      var sectionCopy = legal.sections && legal.sections[index];
      if (!sectionCopy) {
        return;
      }
      setLegalText(section, "[data-legal-section-title]", sectionCopy.title);
      updateLegalTextList(qsa("[data-legal-paragraph]", section), sectionCopy.paragraphs);
      updateLegalTextList(qsa("[data-legal-item]", section), sectionCopy.items);
    });
    updateLegalMeta(legal);
  }

  function localizeLegalPage(copy) {
    var page = qs("[data-legal-page]");
    if (!page) {
      return;
    }
    var key = page.getAttribute("data-legal-page") || "";
    var original = ensureOriginalLegalPage(page, key);
    var legal = (copy.legal && copy.legal[key]) || original;
    if (legal) {
      applyLegalPageContent(page, legal);
    }
  }

  function applyShellLocale(language) {
    var key = normalizeLanguage(language || preferredLanguage());
    var copy = shellLocales[key] || shellLocales.ko;
    document.documentElement.lang = copy.htmlLang;
    localizeNodes(copy);
    localizeIntroMeta(copy);
    localizeHomeMeta(copy);
    localizePracticeMeta(copy);
    localizeBooksMeta(copy);
    localizeLecturesMeta(copy);
    localizeCourseMeta(copy);
    localizeMyInfoMeta(copy);
    localizeLegalPage(copy);
    setText("[data-shell-mode='seat']", copy.nav.seat);
    setText("[data-shell-mode='word']", copy.nav.word);
    setText("[data-shell-mode='sentence']", copy.nav.sentence);
    setText("[data-shell-mode='game']", copy.nav.game);
    setText("[data-shell-mode='keyboard']", copy.nav.keyboard);
    syncLanguageSummary(key, currentPreferenceState().practiceLanguage);
    renderLearningSummary(copy);
    renderMyInfoRecords(copy);
    return key;
  }

  function readCachedPreferences() {
    var preferences = {};
    try {
      preferences = JSON.parse(window.localStorage.getItem(PREFERENCES_KEY) || "{}") || {};
    } catch (error) {
      preferences = {};
    }
    return preferences;
  }

  function preferenceUpdatedTime(preferences) {
    if (!preferences) {
      return 0;
    }
    var value = preferences.updatedAt || preferences.clientUpdatedAt || "";
    var time = Date.parse(value);
    return Number.isFinite(time) ? time : 0;
  }

  function hasPreferenceLanguages(preferences) {
    return !!(preferences && (preferences.uiLanguage || preferences.nativeLanguage || preferences.practiceLanguage || preferences.language || preferences.targetLanguage));
  }

  function normalizePreferencePayload(preferences) {
    var uiLanguage = normalizeLanguage((preferences && (preferences.uiLanguage || preferences.nativeLanguage)) || preferredLanguage());
    var practiceLanguage = normalizeLanguage((preferences && (preferences.practiceLanguage || preferences.targetLanguage || preferences.language)) || uiLanguage);
    var gameDifficulty = Number(preferences && preferences.gameDifficulty);
    return {
      nativeLanguage: uiLanguage,
      uiLanguage: uiLanguage,
      practiceLanguage: practiceLanguage,
      gameDifficulty: Number.isFinite(gameDifficulty) ? Math.max(0, Math.min(10, Math.round(gameDifficulty))) : 3,
      updatedAt: (preferences && (preferences.updatedAt || preferences.clientUpdatedAt)) || new Date().toISOString()
    };
  }

  function preferencesDiffer(left, right) {
    if (!left || !right) {
      return false;
    }
    var a = normalizePreferencePayload(left);
    var b = normalizePreferencePayload(right);
    return a.uiLanguage !== b.uiLanguage || a.practiceLanguage !== b.practiceLanguage || a.gameDifficulty !== b.gameDifficulty;
  }

  function cachePreferences(preferences) {
    try {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      // Browser cache may be unavailable; ClickHouse-backed preference saving still carries the state.
    }
  }

  function shouldKeepCachedPreference(localPreference, serverPreference) {
    if (!hasPreferenceLanguages(localPreference)) {
      return false;
    }
    if (!serverPreference || !serverPreference.ready) {
      return true;
    }
    if (!preferencesDiffer(localPreference, serverPreference)) {
      return false;
    }
    var localTime = preferenceUpdatedTime(localPreference);
    var serverTime = preferenceUpdatedTime(serverPreference);
    return localTime > 0 && (!serverTime || localTime > serverTime + 1000);
  }

  function readPreferences() {
    var preferences = readCachedPreferences();
    if (remotePreference && remotePreference.ready) {
      if (!shouldKeepCachedPreference(preferences, remotePreference)) {
        preferences.nativeLanguage = normalizeLanguage(remotePreference.nativeLanguage || remotePreference.uiLanguage || preferences.nativeLanguage);
        preferences.uiLanguage = normalizeLanguage(remotePreference.uiLanguage || preferences.uiLanguage);
        preferences.practiceLanguage = normalizeLanguage(remotePreference.practiceLanguage || preferences.practiceLanguage);
        if (Number.isFinite(Number(remotePreference.gameDifficulty))) {
          preferences.gameDifficulty = Number(remotePreference.gameDifficulty);
        }
        if (remotePreference.updatedAt) {
          preferences.updatedAt = remotePreference.updatedAt;
        }
      }
    }
    return preferences;
  }

  function writePreferences(preferences) {
    var payload = normalizePreferencePayload(Object.assign({}, preferences || {}, { updatedAt: new Date().toISOString() }));
    remotePreference = Object.assign({}, remotePreference || {}, payload, { ready: true });
    cachePreferences(payload);
    saveRemotePreferences(payload);
  }

  function currentPreferenceState() {
    var preferences = readPreferences();
    var uiLanguage = normalizeLanguage(preferences.uiLanguage || preferences.nativeLanguage || preferredLanguage());
    return {
      uiLanguage: uiLanguage,
      practiceLanguage: normalizeLanguage(preferences.practiceLanguage || preferences.targetLanguage || preferences.language || uiLanguage)
    };
  }

  function fetchJSON(url, options) {
    if (!window.fetch) {
      return Promise.reject(new Error("fetch unavailable"));
    }
    var config = Object.assign({
      credentials: "same-origin",
      headers: { "Accept": "application/json" }
    }, options || {});
    if (config.body && !config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }
    return window.fetch(url, config).then(function (response) {
      if (!response.ok) {
        throw new Error("request failed");
      }
      return response.json();
    });
  }

  function saveRemotePreferences(preferences) {
    var payload = normalizePreferencePayload(preferences || {});
    fetchJSON("/api/learning/preferences/", {
      method: "POST",
      body: JSON.stringify(payload)
    }).then(function (saved) {
      if (saved && saved.ready) {
        remotePreference = saved;
        cachePreferences(normalizePreferencePayload(saved));
      }
    }).catch(function () {
      // The local page can continue; server-backed preferences will retry on the next change.
    });
  }

  function requestRemotePreferences() {
    return fetchJSON("/api/learning/preferences/").then(function (preference) {
      var cached = readCachedPreferences();
      if (!preference || !preference.ready) {
        if (hasPreferenceLanguages(cached)) {
          var cachedPayload = normalizePreferencePayload(cached);
          remotePreference = Object.assign({}, cachedPayload, { ready: true });
          syncLanguageControls(cachedPayload.uiLanguage, cachedPayload.practiceLanguage);
          applyShellLocale(cachedPayload.uiLanguage);
          saveRemotePreferences(cachedPayload);
          requestLearningState();
          requestMyInfoLearningStates();
          return remotePreference;
        }
        return preference;
      }
      if (shouldKeepCachedPreference(cached, preference)) {
        var payload = normalizePreferencePayload(cached);
        remotePreference = Object.assign({}, payload, { ready: true });
        syncLanguageControls(payload.uiLanguage, payload.practiceLanguage);
        applyShellLocale(payload.uiLanguage);
        saveRemotePreferences(payload);
        requestLearningState();
        requestMyInfoLearningStates();
        return remotePreference;
      }
      remotePreference = preference;
      cachePreferences(normalizePreferencePayload(preference));
      syncLanguageControls(preference.uiLanguage, preference.practiceLanguage);
      applyShellLocale(preference.uiLanguage);
      requestLearningState();
      requestMyInfoLearningStates();
      return preference;
    }).catch(function () {
      return null;
    });
  }

  function syncLanguageControls(uiLanguage, practiceLanguage) {
    var state = currentPreferenceState();
    if (uiLanguage) {
      state.uiLanguage = normalizeLanguage(uiLanguage);
    }
    if (practiceLanguage) {
      state.practiceLanguage = normalizeLanguage(practiceLanguage);
    }
    qsa("[data-ui-language]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-ui-language") === state.uiLanguage);
    });
    qsa("[data-practice-language]").forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-practice-language") === state.practiceLanguage);
    });
    syncLanguageSummary(state.uiLanguage, state.practiceLanguage);
  }

  function syncLanguageSummary(language, practiceLanguage) {
    var key = normalizeLanguage(language);
    var meta = languageMeta(key);
    var practiceKey = normalizeLanguage(practiceLanguage || currentPreferenceState().practiceLanguage || key);
    var practiceMeta = languageMeta(practiceKey);
    qsa("[data-ui-language-current-label]").forEach(function (node) {
      node.textContent = meta.label;
    });
    qsa("[data-language-pair-current-label]").forEach(function (node) {
      node.textContent = meta.label + " | " + practiceMeta.label;
    });
    qsa("[data-ui-language-current-flag]").forEach(function (image) {
      image.setAttribute("src", languageFlagURL(key));
      image.setAttribute("alt", "");
    });
    qsa("[data-ui-language-toggle]").forEach(function (button) {
      button.setAttribute("aria-label", meta.label);
      button.setAttribute("title", meta.label);
    });
    qsa("[data-practice-language-current-label]").forEach(function (node) {
      node.textContent = practiceMeta.label;
    });
    qsa("[data-practice-language-current-flag]").forEach(function (image) {
      image.setAttribute("src", languageFlagURL(practiceKey));
      image.setAttribute("alt", "");
    });
  }

  function saveLanguagePreference(kind, language) {
    var preferences = readPreferences();
    var normalized = normalizeLanguage(language);
    var previousUiLanguage = normalizeLanguage(preferences.uiLanguage || preferences.nativeLanguage || preferredLanguage());
    if (kind === "ui") {
      preferences.nativeLanguage = normalized;
      preferences.uiLanguage = normalized;
      applyShellLocale(normalized);
    } else {
      preferences.practiceLanguage = normalized;
    }
    writePreferences(preferences);
    syncLanguageControls();
    requestLearningState();
    requestMyInfoLearningStates();
    renderShellHistory();
    renderMyInfoRecords();
    renderLearningSummary();
    if (kind === "ui" && previousUiLanguage !== normalized) {
      try {
        window.dispatchEvent(new CustomEvent("mirtype:languagechange", { detail: { uiLanguage: normalized } }));
      } catch (err) {
        window.dispatchEvent(new Event("mirtype:languagechange"));
      }
    }
  }

  function setLanguagePopoverOpen(open) {
    var popover = qs("#uiLanguagePopover");
    if (!popover) {
      return;
    }
    if (open) {
      setShellSettingsOpen(false);
      setShellHistoryOpen(false);
      syncLanguageControls();
    }
    popover.hidden = !open;
    qsa("[data-ui-language-toggle]").forEach(function (button) {
      button.setAttribute("aria-expanded", String(open));
    });
  }

  function setShellSettingsOpen(open) {
    var popover = qs("#settingsPopover");
    if (!popover) {
      return;
    }
    if (open) {
      setLanguagePopoverOpen(false);
      setShellHistoryOpen(false);
      syncLanguageControls();
    }
    popover.hidden = !open;
    qsa("[data-settings-toggle]").forEach(function (button) {
      button.setAttribute("aria-expanded", String(open));
    });
  }

  function readResults() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function languagePairKey(uiLanguage, practiceLanguage) {
    return normalizeLanguage(uiLanguage) + "->" + normalizeLanguage(practiceLanguage);
  }

  function currentLanguagePairKey() {
    var state = currentPreferenceState();
    return languagePairKey(state.uiLanguage, state.practiceLanguage);
  }

  function scopeCacheKey(pairKey, activityKey) {
    return String(pairKey || currentLanguagePairKey()) + "::" + String(activityKey || currentActivityKey() || "practice");
  }

  function resultLanguagePairKey(result) {
    if (result && typeof result.languagePairKey === "string" && result.languagePairKey.indexOf("->") > 0) {
      var parts = result.languagePairKey.split("->");
      return languagePairKey(parts[0], parts[1]);
    }
    var state = currentPreferenceState();
    var uiLanguage = (result && (result.uiLanguage || result.nativeLanguage)) || state.uiLanguage;
    var practiceLanguage = (result && (result.practiceLanguage || result.targetLanguage || result.language)) || state.practiceLanguage;
    return languagePairKey(uiLanguage, practiceLanguage);
  }

  function normalizeResultMode(value) {
    var legacyModes = {
      "언어 코스": "course",
      "Language Course": "course",
      "Языковой курс": "course",
      "자리 연습": "seat",
      "단어 연습": "word",
      "문장 연습": "sentenceShort",
      "단문 연습": "sentenceShort",
      "장문 연습": "sentenceLong",
      "타자게임": "game",
      "키보드 보기": "keyboard",
      "키보드 테스트": "keyboard",
      "Keyboard Test": "keyboard",
      "Проверка клавиатуры": "keyboard"
    };
    var mode = String(value || "");
    if (legacyModes[mode]) {
      return legacyModes[mode];
    }
    if (mode === "sentence") {
      return "sentenceShort";
    }
    return mode;
  }

  function activityKeyFor(mode, game) {
    var normalized = normalizeResultMode(mode);
    if (normalized === "course") {
      return "course";
    }
    if (normalized === "game") {
      return "game";
    }
    if (["seat", "word", "sentenceShort", "sentenceLong", "keyboard"].indexOf(normalized) >= 0) {
      return "practice";
    }
    return normalized ? "practice" : "";
  }

  function resultActivityKey(result) {
    if (result && typeof result.activityKey === "string" && result.activityKey) {
      if (result.activityKey.indexOf("game:") === 0) {
        return "game";
      }
      if (result.activityKey.indexOf("practice:") === 0) {
        return "practice";
      }
      return result.activityKey;
    }
    return activityKeyFor(result && result.mode, result && result.game);
  }

  function currentActivityKey() {
    var shell = qs(".app-shell");
    if (!shell) {
      return "";
    }
    return activityKeyFor(shell.getAttribute("data-initial-mode"), shell.getAttribute("data-initial-game"));
  }

  function scopedResults(options) {
    var config = options || {};
    var pairKey = config.pairKey || currentLanguagePairKey();
    var activityKey = Object.prototype.hasOwnProperty.call(config, "activityKey") ? config.activityKey : currentActivityKey();
    if (activityKey === "") {
      var combined = [];
      learningActivityKeys.forEach(function (key) {
        var bucket = remoteLearningResults[scopeCacheKey(pairKey, key)];
        if (Array.isArray(bucket)) {
          combined = combined.concat(bucket);
        }
      });
      if (combined.length) {
        return sortResultsByCompletedAt(combined);
      }
    }
    var cached = remoteLearningResults[scopeCacheKey(pairKey, activityKey)];
    if (Array.isArray(cached)) {
      return cached.slice();
    }
    return readResults().filter(function (result) {
      if (resultLanguagePairKey(result) !== pairKey) {
        return false;
      }
      if (activityKey && resultActivityKey(result) !== activityKey) {
        return false;
      }
      return true;
    });
  }

  function writeResults(results) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.isArray(results) ? results : []));
    } catch (error) {
      // Browser storage errors should not block the shell UI.
    }
  }

  function removeLocalResultsForScope(pairKey, activityKey) {
    writeResults(readResults().filter(function (result) {
      if (resultLanguagePairKey(result) !== pairKey) {
        return true;
      }
      if (activityKey && resultActivityKey(result) !== activityKey) {
        return true;
      }
      return false;
    }));
  }

  function limitResultsForScope(results, scope, limit) {
    var pairKey = resultLanguagePairKey(scope);
    var activityKey = resultActivityKey(scope);
    var seen = 0;
    return (results || []).filter(function (result) {
      if (resultLanguagePairKey(result) !== pairKey || resultActivityKey(result) !== activityKey) {
        return true;
      }
      seen += 1;
      return seen <= limit;
    });
  }

  function sortResultsByCompletedAt(results) {
    return (results || []).slice().sort(function (left, right) {
      var leftTime = Date.parse((left && left.completedAt) || "") || 0;
      var rightTime = Date.parse((right && right.completedAt) || "") || 0;
      return rightTime - leftTime;
    });
  }

  function mergeRemoteLearningState(payload) {
    if (!payload || !payload.languagePairKey || !payload.activityKey) {
      return;
    }
    var key = scopeCacheKey(payload.languagePairKey, payload.activityKey);
    remoteLearningStates[key] = payload;
    if (Array.isArray(payload.results)) {
      remoteLearningResults[key] = sortResultsByCompletedAt(payload.results);
    }
    renderLearningSummary();
    renderShellHistory();
    renderMyInfoRecords();
  }

  function currentLearningScopePayload(options) {
    var config = options || {};
    var state = currentPreferenceState();
    var activityKey = Object.prototype.hasOwnProperty.call(config, "activityKey") ? config.activityKey : currentActivityKey();
    return {
      uiLanguage: normalizeLanguage(config.uiLanguage || state.uiLanguage),
      nativeLanguage: normalizeLanguage(config.uiLanguage || state.uiLanguage),
      practiceLanguage: normalizeLanguage(config.practiceLanguage || state.practiceLanguage),
      activityKey: activityKey || "practice",
      activityDetailKey: config.activityDetailKey || activityKey || "practice"
    };
  }

  function requestLearningState(options) {
    var payload = currentLearningScopePayload(options);
    var pairKey = languagePairKey(payload.uiLanguage, payload.practiceLanguage);
    var cacheKey = scopeCacheKey(pairKey, payload.activityKey);
    if (remoteLearningRequests[cacheKey]) {
      return remoteLearningRequests[cacheKey];
    }
    var params = new URLSearchParams();
    params.set("ui_language", payload.uiLanguage);
    params.set("practice_language", payload.practiceLanguage);
    params.set("activity_key", payload.activityKey);
    params.set("activity_detail_key", payload.activityDetailKey);
    remoteLearningRequests[cacheKey] = fetchJSON("/api/learning/state/?" + params.toString()).then(function (state) {
      mergeRemoteLearningState(state);
      remoteLearningRequests[cacheKey] = null;
      return state;
    }).catch(function () {
      remoteLearningRequests[cacheKey] = null;
      return null;
    });
    return remoteLearningRequests[cacheKey];
  }

  function hasMyInfoRecordsMount() {
    return !!qs("[data-myinfo-records]");
  }

  function requestMyInfoLearningStates() {
    if (!hasMyInfoRecordsMount()) {
      return;
    }
    learningActivityKeys.forEach(function (activityKey) {
      requestLearningState({
        activityKey: activityKey,
        activityDetailKey: activityKey
      });
    });
  }

  function remoteStateForScope(options) {
    var config = options || {};
    var pairKey = config.pairKey || currentLanguagePairKey();
    var activityKey = Object.prototype.hasOwnProperty.call(config, "activityKey") ? config.activityKey : currentActivityKey();
    return remoteLearningStates[scopeCacheKey(pairKey, activityKey)] || null;
  }

  function postLearningResult(result) {
    if (!result || typeof result !== "object") {
      return;
    }
    result.languagePairKey = resultLanguagePairKey(result);
    result.activityKey = resultActivityKey(result) || "practice";
    var cacheKey = scopeCacheKey(result.languagePairKey, result.activityKey);
    var current = remoteLearningResults[cacheKey] || scopedResults({
      pairKey: result.languagePairKey,
      activityKey: result.activityKey
    });
    remoteLearningResults[cacheKey] = limitResultsForScope([result].concat(current), result, 10).filter(function (item) {
      return resultLanguagePairKey(item) === result.languagePairKey && resultActivityKey(item) === result.activityKey;
    });
    renderLearningSummary();
    renderShellHistory();
    renderMyInfoRecords();
    fetchJSON("/api/learning/event/", {
      method: "POST",
      body: JSON.stringify(result)
    }).then(mergeRemoteLearningState).catch(function () {
      // The in-memory result remains visible; the next successful event/state fetch will reconcile it.
    });
  }

  function clearScopedResults(options) {
    var config = options || {};
    var pairKey = config.pairKey || currentLanguagePairKey();
    var activityKey = Object.prototype.hasOwnProperty.call(config, "activityKey") ? config.activityKey : currentActivityKey();
    if (activityKey === "") {
      removeLocalResultsForScope(pairKey, "");
      learningActivityKeys.forEach(function (key) {
        remoteLearningResults[scopeCacheKey(pairKey, key)] = [];
        fetchJSON("/api/learning/clear/", {
          method: "POST",
          body: JSON.stringify(currentLearningScopePayload({ activityKey: key, activityDetailKey: key }))
        }).then(mergeRemoteLearningState).catch(function () {
          // Clearing one activity should not block the rest of the visible history.
        });
      });
      renderLearningSummary();
      renderShellHistory();
      renderMyInfoRecords();
      return;
    }
    removeLocalResultsForScope(pairKey, activityKey);
    remoteLearningResults[scopeCacheKey(pairKey, activityKey)] = [];
    fetchJSON("/api/learning/clear/", {
      method: "POST",
      body: JSON.stringify(currentLearningScopePayload({ activityKey: activityKey }))
    }).then(mergeRemoteLearningState).catch(function () {
      // Clearing local visible state should not fail the UI if the API is temporarily unavailable.
    });
    renderLearningSummary();
    renderShellHistory();
    renderMyInfoRecords();
  }

  function formatCopy(template, value) {
    return String(template || "").replace("%d", String(value));
  }

  function formatCopyValues(template, values) {
    var index = 0;
    return String(template || "").replace(/%[sd]/g, function () {
      var value = values[index];
      index += 1;
      return value == null ? "" : String(value);
    });
  }

  function dayKey(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function addDays(date, offset) {
    var next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    next.setDate(next.getDate() + offset);
    return next;
  }

  var courseBundles = {
    ko: [
      {
        name: "초급 1",
        days: [
          { title: "날짜와 날씨", summary: "오늘, 내일, 요일, 월, 날씨를 묶어 하루를 설명합니다.", words: ["오늘", "내일", "월요일", "5월", "맑음", "비", "바람"], sentences: ["오늘은 월요일입니다.", "내일은 비가 옵니다.", "지금은 5월이고 날씨가 맑습니다."] },
          { title: "인사와 첫 만남", summary: "처음 만난 사람에게 인사하고 천천히 대화를 시작합니다.", words: ["안녕하세요", "안녕", "처음 뵙겠습니다", "오랜만이에요", "미소", "악수"], sentences: ["안녕하세요, 처음 뵙겠습니다.", "오랜만이에요.", "친구에게는 미소와 함께 인사합니다."] },
          { title: "나와 이것", summary: "대명사와 지시어로 사람과 물건을 가리킵니다.", words: ["나", "너", "우리", "이것", "저것", "이들", "저들"], sentences: ["이것은 내 책입니다.", "저 사람은 내 친구입니다.", "이 사람들은 우리 가족입니다."] },
          { title: "가족과 감정", summary: "가족 호칭과 기본 감정으로 자기소개 문장을 만듭니다.", words: ["엄마", "아빠", "형제", "자매", "기쁨", "걱정", "차분함"], sentences: ["우리 가족은 집에 있습니다.", "나는 오늘 기쁩니다.", "그는 조금 걱정합니다."] },
          { title: "숫자와 수량", summary: "수량을 말하며 주문과 요청 문장으로 이어갑니다.", words: ["하나", "둘", "셋", "열", "백", "하나만", "조금만"], sentences: ["하나만 주세요.", "조금만 주세요.", "물 한 잔 주세요."] },
          { title: "기본 질문", summary: "누구, 무엇, 어디, 언제, 왜, 어떻게로 짧은 질문을 만듭니다.", words: ["누구", "무엇", "어디", "언제", "왜", "어떻게", "얼마"], sentences: ["이게 뭐예요?", "어디에서 왔어요?", "얼마예요?"] },
          { title: "오감 기초", summary: "보고, 듣고, 냄새 맡고, 맛보고, 만지는 표현을 익힙니다.", words: ["보다", "듣다", "냄새", "맛", "만지다", "달다", "차갑다"], sentences: ["잘 보여요.", "좋은 냄새가 납니다.", "이 케이크는 너무 달아요."] }
        ]
      },
      {
        name: "초급 2",
        days: [
          { title: "위치 전치사", summary: "위, 아래, 옆, 근처 같은 위치 표현으로 장면을 설명합니다.", words: ["책상 위", "집 안", "문 밖", "아래에", "옆에", "근처", "앞에"], sentences: ["책은 책상 위에 있습니다.", "고양이는 탁자 아래에 있습니다.", "가게는 지하철 옆에 있습니다."] },
          { title: "식당 들어가기", summary: "인사하고 메뉴를 부탁하는 첫 주문 흐름을 연습합니다.", words: ["식당", "메뉴", "추천", "주문", "물", "차", "커피"], sentences: ["메뉴 좀 주세요.", "추천 메뉴가 있나요?", "물 한 잔 주세요."] },
          { title: "주문과 계산", summary: "음식을 주문하고 카드나 현금으로 계산합니다.", words: ["이것 주세요", "포장", "여기서", "계산서", "카드", "현금", "영수증"], sentences: ["이걸 주문할게요.", "여기서 먹을게요.", "카드로 결제할게요."] },
          { title: "집안일", summary: "청소, 설거지, 빨래처럼 매일 반복하는 동사를 묶습니다.", words: ["청소하다", "설거지하다", "빨래하다", "요리하다", "쓰레기", "정리", "장보기"], sentences: ["나는 아침에 청소합니다.", "저녁에는 설거지를 합니다.", "오늘은 집안일이 많습니다."] },
          { title: "스포츠와 반응", summary: "스포츠 이름과 빠른 반응을 말합니다.", words: ["축구", "농구", "배구", "하키", "스키", "수영", "반응"], sentences: ["축구는 빠른 반응이 필요합니다.", "하키 경기는 겨울에 자주 봅니다.", "나는 주말에 수영합니다."] },
          { title: "공휴일과 축하", summary: "명절, 기념일, 새해 인사를 말합니다.", words: ["새해", "크리스마스", "명절", "기념일", "축하", "가족", "선물"], sentences: ["새해에는 가족에게 인사합니다.", "기념일에는 선물을 준비합니다.", "명절에는 함께 식사합니다."] },
          { title: "소리와 움직임", summary: "의성어와 의태어로 짧은 장면을 만듭니다.", words: ["똑똑", "째깍째깍", "반짝반짝", "쿵", "톡톡", "살금살금", "조용히"], sentences: ["문을 똑똑 두드립니다.", "별빛이 반짝반짝 빛납니다.", "조용히 방으로 들어갑니다."] }
        ]
      },
      {
        name: "중급",
        days: [
          { title: "도시와 지명", summary: "주요 지역과 장소를 말하며 이동 문장을 만듭니다.", words: ["모스크바", "상트페테르부르크", "시베리아", "바이칼", "지하철", "시장", "광장"], sentences: ["모스크바에는 지하철이 많습니다.", "바이칼은 아주 큰 호수입니다.", "시장 근처에서 친구를 만납니다."] },
          { title: "시간과 약속", summary: "어제, 오늘, 내일과 식사 후 시간을 연결합니다.", words: ["어제", "오늘", "내일", "나중에", "곧", "점심 후", "내일까지"], sentences: ["점심 후에 만나요.", "내일까지 답을 보낼게요.", "곧 다시 이야기합시다."] },
          { title: "방향과 출발", summary: "어디에서 왔고 어디로 가는지 말합니다.", words: ["에서", "에게", "부터", "쪽으로", "통해서", "없이", "대하여"], sentences: ["나는 한국에서 왔습니다.", "의사에게 갑니다.", "우리는 러시아에 대해 이야기합니다."] },
          { title: "문화와 인사", summary: "처음엔 진지해 보여도 인사로 분위기가 부드러워지는 흐름을 읽습니다.", words: ["진지한 표정", "눈맞춤", "문턱", "악수", "포옹", "따뜻함", "마음"], sentences: ["문턱에서 악수하지 않습니다.", "눈맞춤은 존중을 보여줍니다.", "마음을 열면 표정이 따뜻해집니다."] },
          { title: "감각 묘사", summary: "장면을 오감으로 자세히 묘사합니다.", words: ["선명하게", "희미하게", "시끄럽게", "조용하게", "좋은 냄새", "쓴맛", "거칠다"], sentences: ["여기는 조용합니다.", "레몬은 시어요.", "얼음은 차갑고 곰 인형은 부드럽습니다."] },
          { title: "생활 흐름", summary: "집안일, 식사, 이동을 이어 하루의 흐름으로 만듭니다.", words: ["아침", "청소기", "바닥", "저녁", "설거지", "쓰레기", "정리"], sentences: ["아침에는 청소기를 돌립니다.", "저녁에는 설거지를 합니다.", "쓰레기를 버리고 방을 정리합니다."] },
          { title: "복습 연결", summary: "약한 단어와 느린 키를 다시 불러와 다음 레벨을 준비합니다.", words: ["복습", "약한 표현", "느린 키", "오답", "다시", "기억", "다음 레벨"], sentences: ["어려운 표현은 다시 연습합니다.", "느린 키를 천천히 확인합니다.", "7일을 이어가면 다음 레벨로 갑니다."] }
        ]
      },
      {
        name: "기초 600",
        days: [
          { title: "핵심 동사", summary: "시작하다, 말하다, 가다, 보다처럼 문장을 움직이는 단어를 반복합니다.", words: ["시작", "있다", "말하다", "가다", "보다", "읽다", "쓰다"], sentences: ["오늘은 같은 동사를 단어와 문장으로 다시 만납니다.", "말하고 읽고 쓰는 흐름을 천천히 반복합니다.", "7일 동안 정확도가 안정되면 다음 등급으로 갑니다."] },
          { title: "사람과 관계", summary: "가족, 친구, 사람, 이름을 짧은 자기소개 문장으로 연결합니다.", words: ["사람", "이름", "가족", "어머니", "아버지", "친구", "아이"], sentences: ["내 이름을 천천히 말합니다.", "친구와 가족을 소개합니다.", "사람과 관계 단어는 매일 다시 나옵니다."] },
          { title: "장소와 이동", summary: "집, 학교, 거리, 도시, 나라를 이동 동사와 함께 익힙니다.", words: ["집", "학교", "거리", "도시", "나라", "오다", "가다"], sentences: ["나는 집에서 학교로 갑니다.", "도시와 거리를 보며 장소 단어를 익힙니다.", "짧은 이동 문장을 여러 방식으로 반복합니다."] },
          { title: "시간과 반복", summary: "오늘, 내일, 아침, 밤, 주, 달, 해를 한 주 흐름 안에서 사용합니다.", words: ["오늘", "내일", "아침", "밤", "주", "달", "해"], sentences: ["오늘의 단어는 내일 다시 나옵니다.", "아침과 밤의 문장을 번갈아 입력합니다.", "한 주 동안 같은 단어가 다른 문장으로 돌아옵니다."] },
          { title: "식당과 생활", summary: "물, 차, 빵, 가게, 식당, 계산 같은 실제 장면 단어를 묶습니다.", words: ["물", "차", "빵", "가게", "식당", "계산", "카드"], sentences: ["식당에서 물과 빵을 주문합니다.", "가게에서 카드로 계산합니다.", "생활 단어는 짧은 주문 문장으로 익힙니다."] },
          { title: "감정과 판단", summary: "좋다, 어렵다, 느리다, 빠르다, 걱정 같은 성취도 판단 단어를 익힙니다.", words: ["좋다", "어렵다", "쉽다", "느리다", "빠르다", "걱정", "차분함"], sentences: ["오늘의 정확도를 차분히 봅니다.", "어려운 단어는 빠르게 넘기지 않습니다.", "느린 키와 헷갈린 단어를 다시 연습합니다."] },
          { title: "주간 성취도", summary: "한 주 동안 반복한 단어와 문장을 다시 입력하고 다음 등급 준비를 확인합니다.", words: ["성취도", "정확도", "복습", "등급", "반복", "기억", "다음"], sentences: ["7일째에는 이번 주 정확도를 확인합니다.", "성취도가 부족하면 같은 등급을 더 복습합니다.", "손가락이 먼저 기억하면 다음 단계가 쉬워집니다."] }
        ]
      }
    ],
    en: [
      {
        name: "Starter 1",
        days: [
          { title: "Dates and Weather", summary: "Describe a day with today, tomorrow, weekdays, months, and weather.", words: ["today", "tomorrow", "Monday", "May", "sunny", "rain", "wind"], sentences: ["Today is Monday.", "It will rain tomorrow.", "It is May and the weather is sunny."] },
          { title: "Greetings", summary: "Start a calm first meeting with short greetings.", words: ["hello", "hi", "nice to meet you", "long time no see", "smile", "handshake"], sentences: ["Hello, nice to meet you.", "Long time no see.", "Friends greet each other with a smile."] },
          { title: "Me and This", summary: "Use pronouns and demonstratives to point to people and things.", words: ["I", "you", "we", "this", "that", "these", "those"], sentences: ["This is my book.", "That person is my friend.", "These people are my family."] },
          { title: "Family and Feelings", summary: "Build simple self-introduction sentences with family and emotions.", words: ["mother", "father", "brother", "sister", "joy", "worry", "calm"], sentences: ["My family is at home.", "I am happy today.", "He is a little worried."] },
          { title: "Numbers and Amounts", summary: "Move from numbers into requests and orders.", words: ["one", "two", "three", "ten", "hundred", "only one", "a little"], sentences: ["Only one, please.", "A little, please.", "A glass of water, please."] },
          { title: "Basic Questions", summary: "Ask short questions with who, what, where, when, why, and how.", words: ["who", "what", "where", "when", "why", "how", "how much"], sentences: ["What is this?", "Where are you from?", "How much is it?"] },
          { title: "Five Senses", summary: "Practice seeing, hearing, smelling, tasting, and touching.", words: ["see", "hear", "smell", "taste", "touch", "sweet", "cold"], sentences: ["I can see well.", "It smells good.", "This cake is too sweet."] }
        ]
      },
      {
        name: "Starter 2",
        days: [
          { title: "Place Words", summary: "Describe scenes with on, in, out, under, next to, and near.", words: ["on the table", "in the house", "out the door", "under", "next to", "near", "in front of"], sentences: ["The book is on the table.", "The cat is under the table.", "The shop is next to the metro."] },
          { title: "Entering a Restaurant", summary: "Greet and ask for the menu before ordering.", words: ["restaurant", "menu", "recommendation", "order", "water", "tea", "coffee"], sentences: ["May I have the menu, please?", "What do you recommend?", "A glass of water, please."] },
          { title: "Ordering and Paying", summary: "Order food and pay by card or in cash.", words: ["this please", "to go", "eat here", "bill", "card", "cash", "receipt"], sentences: ["I will order this.", "I will eat here.", "I will pay by card."] },
          { title: "Chores", summary: "Group daily verbs like cleaning, dishes, laundry, and cooking.", words: ["clean", "wash dishes", "do laundry", "cook", "trash", "tidy up", "shopping"], sentences: ["I clean in the morning.", "I wash dishes in the evening.", "There are many chores today."] },
          { title: "Sports and Reaction", summary: "Name sports and talk about quick response.", words: ["football", "basketball", "volleyball", "hockey", "skiing", "swimming", "reaction"], sentences: ["Football needs a quick reaction.", "I often watch hockey in winter.", "I swim on weekends."] },
          { title: "Holidays", summary: "Talk about holidays, anniversaries, and New Year greetings.", words: ["New Year", "Christmas", "holiday", "anniversary", "celebration", "family", "gift"], sentences: ["On New Year, I greet my family.", "I prepare a gift for the anniversary.", "On holidays, we eat together."] },
          { title: "Sounds and Motion", summary: "Use sound and motion words to create short scenes.", words: ["knock knock", "tick tock", "sparkle", "thud", "tap tap", "quietly", "softly"], sentences: ["I knock on the door.", "The stars sparkle.", "I enter the room quietly."] }
        ]
      },
      {
        name: "Intermediate",
        days: [
          { title: "Cities and Places", summary: "Use major places and movement sentences.", words: ["Moscow", "Saint Petersburg", "Siberia", "Baikal", "metro", "market", "square"], sentences: ["There are many metro stations in Moscow.", "Baikal is a very large lake.", "I meet a friend near the market."] },
          { title: "Time and Plans", summary: "Connect yesterday, today, tomorrow, and after lunch.", words: ["yesterday", "today", "tomorrow", "later", "soon", "after lunch", "until tomorrow"], sentences: ["See you after lunch.", "I will send an answer by tomorrow.", "Let's talk again soon."] },
          { title: "Direction and Origin", summary: "Say where you are from and where you are going.", words: ["from", "to", "from mother", "toward", "through", "without", "about"], sentences: ["I am from Korea.", "I am going to the doctor.", "We are talking about Russia."] },
          { title: "Culture and Greeting", summary: "Read how a serious first face can become warmer through greetings.", words: ["serious face", "eye contact", "doorway", "handshake", "hug", "warmth", "heart"], sentences: ["Do not shake hands across a doorway.", "Eye contact shows respect.", "When people open their hearts, their faces become warm."] },
          { title: "Sense Description", summary: "Describe a scene with the five senses.", words: ["clearly", "dimly", "loudly", "quietly", "good smell", "bitter", "rough"], sentences: ["It is quiet here.", "The lemon is sour.", "Ice is cold and the teddy bear is soft."] },
          { title: "Daily Flow", summary: "Connect chores, meals, and movement into a day.", words: ["morning", "vacuum", "floor", "evening", "dishes", "trash", "tidy"], sentences: ["In the morning I vacuum.", "In the evening I wash dishes.", "I take out the trash and tidy the room."] },
          { title: "Review Link", summary: "Bring weak words and slow keys back before the next level.", words: ["review", "weak expression", "slow key", "mistake", "again", "memory", "next level"], sentences: ["I practice difficult expressions again.", "I check slow keys carefully.", "After 7 days, I move to the next level."] }
        ]
      },
      {
        name: "Basic 600",
        days: [
          { title: "Core Verbs", summary: "Repeat words that move a sentence: start, speak, go, see, read, and write.", words: ["start", "be", "speak", "go", "see", "read", "write"], sentences: ["Today the same verbs return as words and sentences.", "I repeat speaking, reading, and writing slowly.", "After 7 steady days, the next level opens."] },
          { title: "People and Relations", summary: "Connect person, name, family, mother, father, friend, and child.", words: ["person", "name", "family", "mother", "father", "friend", "child"], sentences: ["I say my name slowly.", "I introduce a friend and my family.", "Relation words come back every day."] },
          { title: "Places and Movement", summary: "Practice home, school, street, city, and country with movement verbs.", words: ["home", "school", "street", "city", "country", "come", "go"], sentences: ["I go from home to school.", "I learn place words through streets and cities.", "Short movement sentences repeat in different ways."] },
          { title: "Time and Repetition", summary: "Use today, tomorrow, morning, night, week, month, and year in a weekly flow.", words: ["today", "tomorrow", "morning", "night", "week", "month", "year"], sentences: ["Today's words return tomorrow.", "I type morning and night sentences in turn.", "The same words return in new sentences for a week."] },
          { title: "Restaurant and Daily Life", summary: "Group real scene words like water, tea, bread, shop, restaurant, bill, and card.", words: ["water", "tea", "bread", "shop", "restaurant", "bill", "card"], sentences: ["I order water and bread at a restaurant.", "I pay by card at a shop.", "Daily words become short order sentences."] },
          { title: "Feeling and Judgment", summary: "Practice words for good, hard, easy, slow, fast, worry, and calm.", words: ["good", "hard", "easy", "slow", "fast", "worry", "calm"], sentences: ["I check today's accuracy calmly.", "I do not rush past difficult words.", "I practice slow keys and confusing words again."] },
          { title: "Weekly Achievement", summary: "Retype the week's words and sentences, then check readiness for the next level.", words: ["achievement", "accuracy", "review", "level", "repeat", "memory", "next"], sentences: ["On day 7, I check this week's accuracy.", "If achievement is low, I review the same level again.", "When my fingers remember first, the next step is easier."] }
        ]
      }
    ],
    ru: [
      {
        name: "Старт 1",
        days: [
          { title: "Дата и погода", summary: "Опишите день через сегодня, завтра, дни недели, месяцы и погоду.", words: ["сегодня", "завтра", "понедельник", "май", "солнечно", "дождь", "ветер"], sentences: ["Сегодня понедельник.", "Завтра будет дождь.", "Сейчас май, и погода солнечная."] },
          { title: "Приветствие", summary: "Начинайте первую встречу с коротких приветствий.", words: ["здравствуйте", "привет", "очень приятно", "давно не виделись", "улыбка", "рукопожатие"], sentences: ["Здравствуйте, очень приятно.", "Давно не виделись.", "Друзья здороваются с улыбкой."] },
          { title: "Я и это", summary: "Используйте местоимения и указательные слова для людей и вещей.", words: ["я", "ты", "мы", "это", "то", "эти", "те"], sentences: ["Это моя книга.", "Тот человек - мой друг.", "Эти люди - моя семья."] },
          { title: "Семья и эмоции", summary: "Стройте простые фразы о себе через семью и чувства.", words: ["мама", "папа", "брат", "сестра", "радость", "тревога", "спокойствие"], sentences: ["Моя семья дома.", "Сегодня мне радостно.", "Он немного волнуется."] },
          { title: "Числа и количество", summary: "Переходите от чисел к просьбам и заказам.", words: ["один", "два", "три", "десять", "сто", "только один", "немного"], sentences: ["Только один, пожалуйста.", "Немного, пожалуйста.", "Стакан воды, пожалуйста."] },
          { title: "Вопросы", summary: "Задавайте короткие вопросы с кто, что, где, когда, почему и как.", words: ["кто", "что", "где", "когда", "почему", "как", "сколько"], sentences: ["Что это?", "Откуда вы?", "Сколько это стоит?"] },
          { title: "Пять чувств", summary: "Тренируйте видеть, слышать, нюхать, пробовать и трогать.", words: ["видеть", "слышать", "запах", "вкус", "трогать", "сладкий", "холодный"], sentences: ["Хорошо видно.", "Пахнет хорошо.", "Этот торт слишком сладкий."] }
        ]
      },
      {
        name: "Старт 2",
        days: [
          { title: "Место", summary: "Описывайте сцену через на, в, из, под, возле и около.", words: ["на столе", "в доме", "из двери", "под", "возле", "около", "перед"], sentences: ["Книга на столе.", "Кот под столом.", "Магазин возле метро."] },
          { title: "В ресторане", summary: "Поздоровайтесь и попросите меню перед заказом.", words: ["ресторан", "меню", "рекомендация", "заказ", "вода", "чай", "кофе"], sentences: ["Можно меню, пожалуйста?", "Что вы рекомендуете?", "Стакан воды, пожалуйста."] },
          { title: "Заказ и оплата", summary: "Заказывайте еду и платите картой или наличными.", words: ["мне это", "с собой", "здесь", "счет", "карта", "наличные", "чек"], sentences: ["Я закажу это.", "Я буду есть здесь.", "Я заплачу картой."] },
          { title: "Домашние дела", summary: "Группируйте ежедневные глаголы: уборка, посуда, стирка и готовка.", words: ["убирать", "мыть посуду", "стирать", "готовить", "мусор", "наводить порядок", "покупки"], sentences: ["Утром я убираюсь.", "Вечером я мою посуду.", "Сегодня много домашних дел."] },
          { title: "Спорт и реакция", summary: "Называйте спорт и говорите о быстрой реакции.", words: ["футбол", "баскетбол", "волейбол", "хоккей", "лыжи", "плавание", "реакция"], sentences: ["Футбол требует быстрой реакции.", "Зимой я часто смотрю хоккей.", "По выходным я плаваю."] },
          { title: "Праздники", summary: "Говорите о праздниках, годовщинах и новогодних поздравлениях.", words: ["Новый год", "Рождество", "праздник", "годовщина", "поздравление", "семья", "подарок"], sentences: ["На Новый год я поздравляю семью.", "К годовщине я готовлю подарок.", "В праздник мы едим вместе."] },
          { title: "Звуки и движение", summary: "Создавайте короткие сцены через звук и движение.", words: ["тук-тук", "тик-так", "блестеть", "бух", "тук-тук", "тихо", "мягко"], sentences: ["Я стучу в дверь.", "Звезды блестят.", "Я тихо вхожу в комнату."] }
        ]
      },
      {
        name: "Средний",
        days: [
          { title: "Города и места", summary: "Используйте важные места и фразы движения.", words: ["Москва", "Санкт-Петербург", "Сибирь", "Байкал", "метро", "рынок", "площадь"], sentences: ["В Москве много станций метро.", "Байкал - очень большое озеро.", "Я встречаю друга около рынка."] },
          { title: "Время и планы", summary: "Соединяйте вчера, сегодня, завтра и после обеда.", words: ["вчера", "сегодня", "завтра", "потом", "скоро", "после обеда", "до завтра"], sentences: ["Увидимся после обеда.", "Я пришлю ответ до завтра.", "Скоро поговорим снова."] },
          { title: "Направление", summary: "Говорите, откуда вы и куда идете.", words: ["из", "к", "от мамы", "к", "через", "без", "о"], sentences: ["Я из Кореи.", "Я иду к врачу.", "Мы говорим о России."] },
          { title: "Культура приветствий", summary: "Читайте, как серьезное лицо становится теплее через приветствие.", words: ["серьезное лицо", "зрительный контакт", "порог", "рукопожатие", "объятие", "тепло", "сердце"], sentences: ["Через порог руку не пожимают.", "Зрительный контакт показывает уважение.", "Когда люди открывают сердце, лицо становится теплым."] },
          { title: "Описание чувств", summary: "Описывайте сцену через пять чувств.", words: ["ясно", "нечетко", "громко", "тихо", "приятный запах", "горький", "шершавый"], sentences: ["Здесь тихо.", "Лимон кислый.", "Лед холодный, а мишка мягкий."] },
          { title: "Бытовой поток", summary: "Соединяйте дела, еду и движение в один день.", words: ["утро", "пылесос", "пол", "вечер", "посуда", "мусор", "порядок"], sentences: ["Утром я пылесошу.", "Вечером я мою посуду.", "Я выбрасываю мусор и навожу порядок."] },
          { title: "Повторение", summary: "Возвращайте слабые слова и медленные клавиши перед новым уровнем.", words: ["повторение", "слабая фраза", "медленная клавиша", "ошибка", "снова", "память", "следующий уровень"], sentences: ["Я снова тренирую трудные выражения.", "Я внимательно проверяю медленные клавиши.", "После 7 дней я перехожу на следующий уровень."] }
        ]
      },
      {
        name: "База 600",
        days: [
          { title: "Главные глаголы", summary: "Повторяйте слова, которые двигают фразу: начать, быть, говорить, идти, видеть, читать и писать.", words: ["начало", "быть", "говорить", "идти", "видеть", "читать", "писать"], sentences: ["Сегодня те же глаголы возвращаются как слова и фразы.", "Я медленно повторяю говорить, читать и писать.", "Через 7 устойчивых дней открывается следующий уровень."] },
          { title: "Люди и отношения", summary: "Соединяйте человек, имя, семья, мама, папа, друг и ребенок.", words: ["человек", "имя", "семья", "мама", "папа", "друг", "ребенок"], sentences: ["Я медленно называю свое имя.", "Я представляю друга и семью.", "Слова отношений возвращаются каждый день."] },
          { title: "Места и движение", summary: "Тренируйте дом, школу, улицу, город и страну вместе с глаголами движения.", words: ["дом", "школа", "улица", "город", "страна", "приходить", "идти"], sentences: ["Я иду из дома в школу.", "Я учу места через улицы и города.", "Короткие фразы движения повторяются по-разному."] },
          { title: "Время и повтор", summary: "Используйте сегодня, завтра, утро, ночь, неделю, месяц и год в недельном потоке.", words: ["сегодня", "завтра", "утро", "ночь", "неделя", "месяц", "год"], sentences: ["Сегодняшние слова вернутся завтра.", "Я печатаю утренние и ночные фразы по очереди.", "Одни и те же слова возвращаются в новых фразах всю неделю."] },
          { title: "Ресторан и быт", summary: "Соберите слова настоящих ситуаций: вода, чай, хлеб, магазин, ресторан, счет и карта.", words: ["вода", "чай", "хлеб", "магазин", "ресторан", "счет", "карта"], sentences: ["В ресторане я заказываю воду и хлеб.", "В магазине я плачу картой.", "Бытовые слова становятся короткими фразами заказа."] },
          { title: "Чувство и оценка", summary: "Тренируйте хороший, трудный, легкий, медленный, быстрый, тревога и спокойствие.", words: ["хороший", "трудный", "легкий", "медленный", "быстрый", "тревога", "спокойствие"], sentences: ["Я спокойно проверяю сегодняшнюю точность.", "Я не пролистываю трудные слова слишком быстро.", "Я снова тренирую медленные клавиши и похожие слова."] },
          { title: "Недельный результат", summary: "Напечатайте слова и фразы недели еще раз и проверьте готовность к следующему уровню.", words: ["достижение", "точность", "повторение", "уровень", "повтор", "память", "следующий"], sentences: ["На 7-й день я проверяю точность недели.", "Если результат слабый, я повторяю тот же уровень.", "Когда пальцы помнят первыми, следующий шаг становится легче."] }
        ]
      }
    ]
  };

  function isMeaningfulResult(result) {
    if (!result || !result.completedAt) {
      return false;
    }
    var mode = String(result.mode || "");
    var knownModes = ["course", "seat", "word", "sentence", "sentenceShort", "sentenceLong", "game", "keyboard", "언어 코스", "Language Course", "Языковой курс", "자리 연습", "단어 연습", "문장 연습", "단문 연습", "장문 연습", "타자게임", "키보드 보기", "키보드 테스트", "Keyboard Test", "Проверка клавиатуры"];
    if (knownModes.indexOf(mode) < 0) {
      return false;
    }
    return [result.score, result.accuracy, result.cpm, result.wpm, result.elapsedSeconds].some(function (value) {
      return Number(value) > 0;
    });
  }

  function completedDayStats(results) {
    var days = {};
    results.forEach(function (result) {
      if (!isMeaningfulResult(result)) {
        return;
      }
      var raw = result.completedAt;
      var date = raw ? new Date(raw) : null;
      if (date && !Number.isNaN(date.getTime())) {
        var key = dayKey(date);
        var stats = days[key] || { sessions: 0, accuracyTotal: 0, accuracyCount: 0 };
        var accuracy = Number(result.accuracy);
        stats.sessions += 1;
        if (Number.isFinite(accuracy) && accuracy > 0) {
          stats.accuracyTotal += Math.max(0, Math.min(100, accuracy));
          stats.accuracyCount += 1;
        }
        days[key] = stats;
      }
    });
    return days;
  }

  function currentStreakKeys(days) {
    var today = new Date();
    var cursor = days[dayKey(today)] ? today : addDays(today, -1);
    var keys = [];
    while (days[dayKey(cursor)]) {
      keys.unshift(dayKey(cursor));
      cursor = addDays(cursor, -1);
    }
    return keys;
  }

  function summarizeDayKeys(days, keys, daysPerLevel) {
    var sessions = 0;
    var accuracyTotal = 0;
    var accuracyCount = 0;
    (keys || []).forEach(function (key) {
      var stats = days[key] || {};
      sessions += Number(stats.sessions) || 0;
      accuracyTotal += Number(stats.accuracyTotal) || 0;
      accuracyCount += Number(stats.accuracyCount) || 0;
    });
    var averageAccuracy = accuracyCount ? Math.round(accuracyTotal / accuracyCount) : 0;
    var dayRatio = Math.min(1, ((keys || []).length) / daysPerLevel);
    var achievement = averageAccuracy ? Math.round((dayRatio * 35) + (averageAccuracy * 0.65)) : Math.round(dayRatio * 100);
    return {
      days: (keys || []).length,
      sessions: sessions,
      averageAccuracy: averageAccuracy,
      achievementPercent: Math.max(0, Math.min(100, achievement))
    };
  }

  function calculateLearningSummary(options) {
    var remoteState = remoteStateForScope(options);
    if (remoteState && remoteState.ready) {
      var sessions = Number(remoteState.sessionCount) || 0;
      var completedInLevel = sessions > 0 && sessions % 7 === 0 ? 7 : sessions % 7;
      var currentStep = Number.isFinite(Number(remoteState.currentDayIndex)) ? Number(remoteState.currentDayIndex) : 0;
      return {
        level: Math.max(1, Number(remoteState.currentLevel) || 1),
        sessions: sessions,
        streak: Math.max(0, Number(remoteState.streakDays) || 0),
        nextCount: Math.max(0, Number(remoteState.nextCount) || (7 - completedInLevel)),
        completedInLevel: completedInLevel,
        sessionsPerLevel: 7,
        daysPerLevel: 7,
        targetAccuracy: 85,
        averageAccuracy: Math.max(0, Number(remoteState.averageAccuracy) || 0),
        achievementPercent: Math.max(0, Math.min(100, Number(remoteState.achievementPercent) || 0)),
        needsReview: false,
        currentStep: Math.max(0, Math.min(6, currentStep)),
        progressPercent: Math.min(100, Math.round((completedInLevel / 7) * 100))
      };
    }
    requestLearningState(options);
    var results = scopedResults(options).filter(isMeaningfulResult);
    var daysPerLevel = 7;
    var targetAccuracy = 85;
    var days = completedDayStats(results);
    var streakKeys = currentStreakKeys(days);
    var streak = streakKeys.length;
    var fullBlocks = Math.floor(streak / daysPerLevel);
    var qualifiedWeeks = 0;
    for (var block = 0; block < fullBlocks; block += 1) {
      var blockKeys = streakKeys.slice(block * daysPerLevel, (block + 1) * daysPerLevel);
      if (summarizeDayKeys(days, blockKeys, daysPerLevel).averageAccuracy >= targetAccuracy) {
        qualifiedWeeks += 1;
      }
    }
    var remainder = streak % daysPerLevel;
    var activeKeys = remainder > 0
      ? streakKeys.slice(fullBlocks * daysPerLevel)
      : (fullBlocks > 0 ? streakKeys.slice((fullBlocks - 1) * daysPerLevel, fullBlocks * daysPerLevel) : []);
    var activeSummary = summarizeDayKeys(days, activeKeys, daysPerLevel);
    var needsReview = fullBlocks > 0 && remainder === 0 && activeSummary.averageAccuracy < targetAccuracy;
    var completedInLevel = needsReview ? daysPerLevel : remainder;
    var nextCount = needsReview ? 0 : daysPerLevel - completedInLevel;
    return {
      level: Math.max(1, qualifiedWeeks + 1),
      sessions: results.length,
      streak: streak,
      nextCount: nextCount,
      completedInLevel: completedInLevel,
      sessionsPerLevel: daysPerLevel,
      daysPerLevel: daysPerLevel,
      targetAccuracy: targetAccuracy,
      averageAccuracy: activeSummary.averageAccuracy,
      achievementPercent: activeSummary.achievementPercent,
      needsReview: needsReview,
      currentStep: completedInLevel,
      progressPercent: Math.min(100, Math.round((completedInLevel / daysPerLevel) * 100))
    };
  }

  function courseBundlesForLanguage(language) {
    var externalBundles = window.MirtypeCourseBundles && typeof window.MirtypeCourseBundles === "object" ? window.MirtypeCourseBundles : {};
    var key = normalizeLanguage(language);
    var bundles = externalBundles[key] || courseBundles[key] || courseBundles.ko;
    if (!Array.isArray(bundles) || !bundles.length) {
      bundles = courseBundles[key] || [];
    }
    bundles = sanitizeCourseBundlesForLanguage(bundles, key);
    if (!bundles.length && externalBundles[key]) {
      bundles = sanitizeCourseBundlesForLanguage(courseBundles[key] || [], key);
    }
    if (!bundles.length && key === "ko") {
      bundles = sanitizeCourseBundlesForLanguage(courseBundles.ko || [], "ko");
    }
    return bundles;
  }

  function courseBundleForSummary(summary) {
    var state = currentPreferenceState();
    var language = normalizeLanguage(state.practiceLanguage);
    var nativeLanguage = normalizeLanguage(state.uiLanguage);
    var bundles = courseBundlesForLanguage(language);
    var bundleIndex = Math.min(bundles.length - 1, Math.max(0, (summary.level || 1) - 1));
    var bundle = bundles[bundleIndex] || bundles[0];
    var dayIndex = Math.min(6, Math.max(0, summary.currentStep || 0));
    var day = (bundle.days && bundle.days[dayIndex]) || (bundle.days && bundle.days[0]) || {};
    var nativeBundles = courseBundlesForLanguage(nativeLanguage);
    var nativeBundle = nativeBundles[bundleIndex] || nativeBundles[0] || {};
    var nativeDay = (nativeBundle.days && nativeBundle.days[dayIndex]) || (nativeBundle.days && nativeBundle.days[0]) || {};
    return {
      bundle: bundle,
      day: day,
      dayNumber: dayIndex + 1,
      language: language,
      nativeLanguage: nativeLanguage,
      nativeDay: nativeDay
    };
  }

  function courseItemText(item) {
    if (item && typeof item === "object") {
      return String(item.text || item.value || item.label || "").trim();
    }
    return String(item || "").trim();
  }

  function courseTextMatchesLanguage(language, value) {
    var text = String(value || "").trim();
    var key = normalizeLanguage(language);
    if (!text) {
      return false;
    }
    if (key === "ko") {
      return /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(text) && !/[A-Za-zА-Яа-яЁё]/.test(text);
    }
    if (key === "en") {
      return /[A-Za-z]/.test(text) && !/[가-힣ㄱ-ㅎㅏ-ㅣА-Яа-яЁё]/.test(text);
    }
    if (key === "ru") {
      return /[А-Яа-яЁё]/.test(text) && !/[A-Za-z가-힣ㄱ-ㅎㅏ-ㅣ]/.test(text);
    }
    return true;
  }

  function filterCourseItemsForLanguage(items, language) {
    return (items || []).filter(function (item) {
      return courseTextMatchesLanguage(language, courseItemText(item));
    });
  }

  function sanitizeCourseBundlesForLanguage(bundles, language) {
    return (bundles || []).map(function (bundle) {
      var copied = Object.assign({}, bundle);
      copied.days = (bundle.days || []).map(function (day) {
        return Object.assign({}, day, {
          words: filterCourseItemsForLanguage(day.words || [], language),
          sentences: filterCourseItemsForLanguage(day.sentences || [], language),
          longs: filterCourseItemsForLanguage(day.longs || [], language)
        });
      }).filter(function (day) {
        return (day.words && day.words.length) || (day.sentences && day.sentences.length) || (day.longs && day.longs.length);
      });
      return copied;
    }).filter(function (bundle) {
      return bundle.days && bundle.days.length;
    });
  }

  function courseItemMeaning(item, nativeLanguage) {
    if (!item || typeof item !== "object") {
      return "";
    }
    var key = normalizeLanguage(nativeLanguage);
    var meanings = item.meanings && typeof item.meanings === "object" ? item.meanings : {};
    return String(meanings[key] || item["meaning_" + key] || item["meaning" + key.toUpperCase()] || item.meaning || item.translation || "").trim();
  }

  function courseItemPronunciation(item) {
    if (!item || typeof item !== "object") {
      return "";
    }
    return String(item.ipa || item.phonetic || item.pronunciation || item.pronunciationGuide || item.romanization || "").trim();
  }

  function courseLexiconEntry(language, text) {
    var lexicon = window.MirtypeCourseLexicon && typeof window.MirtypeCourseLexicon === "object" ? window.MirtypeCourseLexicon : {};
    var entries = lexicon[normalizeLanguage(language)] || {};
    return entries[text] || null;
  }

  function courseSiblingMeaning(items, index, currentText) {
    var sibling = courseItemText((items || [])[index]);
    return sibling && sibling !== currentText ? sibling : "";
  }

  function shouldUseCourseSiblingMeaning(nativeLanguage, practiceLanguage) {
    var nativeKey = normalizeLanguage(nativeLanguage);
    var practiceKey = normalizeLanguage(practiceLanguage);
    return !!nativeKey && !!practiceKey && nativeKey !== practiceKey;
  }

  function stripRussianStress(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").normalize("NFC").replace(/[́̀]/g, "");
  }

  function courseLexiconAccent(language, text) {
    var entry = courseLexiconEntry(language, text);
    if (!entry || typeof entry !== "object") {
      return "";
    }
    var meanings = entry.meanings && typeof entry.meanings === "object" ? entry.meanings : {};
    return String(entry.pronunciation || meanings.ru || "").trim();
  }

  function russianWordParts(text) {
    return String(text || "").match(/[А-Яа-яЁё]+/g) || [];
  }

  var russianPronunciationOverrides = {
    "я": { ipa: "ja", latin: "ya", ko: "야", en: "ya" },
    "повторяю": { ipa: "pəftɐˈrʲajʊ", latin: "povtoryayu", ko: "빠프따랴유", en: "puhf-tah-RYAH-yu" },
    "слово": { ipa: "ˈsɫovə", latin: "slovo", ko: "슬로바", en: "SLOH-vuh" },
    "сегодня": { ipa: "sʲɪˈvodnʲə", latin: "segodnya", ko: "시보드냐", en: "see-VOD-nyuh" },
    "мои": { ipa: "mɐˈi", latin: "moi", ko: "마이", en: "mah-EE" },
    "слова": { ipa: "slɐˈva", latin: "slova", ko: "슬라바", en: "sluh-VAH" },
    "через": { ipa: "ˈtɕerʲɪs", latin: "cherez", ko: "체레스", en: "CHEH-rees" },
    "семь": { ipa: "sʲemʲ", latin: "sem", ko: "셈", en: "syem" },
    "дней": { ipa: "dnʲej", latin: "dney", ko: "드녜이", en: "dnyey" },
    "проверяю": { ipa: "prəvʲɪˈrʲajʊ", latin: "proveryayu", ko: "쁘라비랴유", en: "pruh-vee-RYAH-yu" },
    "точность": { ipa: "ˈtotɕnəsʲtʲ", latin: "tochnost", ko: "또치나스찌", en: "TOCH-nuhst" },
    "земля": { ipa: "zʲɪˈmlʲa", latin: "zemlya", ko: "지믈랴", en: "zem-LYAH" },
    "море": { ipa: "ˈmorʲe", latin: "more", ko: "모레", en: "MOH-rye" },
    "река": { ipa: "rʲɪˈka", latin: "reka", ko: "리카", en: "ree-KAH" },
    "начало": { ipa: "nɐˈtɕaɫə", latin: "nachalo", ko: "나찰라", en: "nah-CHAH-luh" },
    "жизнь": { ipa: "ʐɨzʲnʲ", latin: "zhizn", ko: "쥐즌", en: "zhizn" },
    "быть": { ipa: "bɨtʲ", latin: "byt", ko: "븨티", en: "bit" }
  };

  var russianLatinMap = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
  };

  var russianIpaMap = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "je", ё: "jo", ж: "ʐ", з: "z", и: "i", й: "j", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "x", ц: "ts", ч: "tɕ", ш: "ʂ", щ: "ɕː", ъ: "", ы: "ɨ", ь: "ʲ", э: "e", ю: "ju", я: "ja"
  };

  var russianKoreanMap = {
    а: "아", б: "브", в: "브", г: "그", д: "드", е: "예", ё: "요", ж: "즈", з: "즈", и: "이", й: "이", к: "크", л: "르", м: "므", н: "느", о: "오", п: "프", р: "르", с: "스", т: "트", у: "우", ф: "프", х: "흐", ц: "츠", ч: "치", ш: "시", щ: "시", ъ: "", ы: "의", ь: "", э: "에", ю: "유", я: "야"
  };

  function mapRussianLetters(text, table) {
    return Array.from(stripRussianStress(text)).map(function (letter) {
      var lower = letter.toLowerCase();
      var mapped = table[lower];
      if (mapped === undefined) {
        return letter;
      }
      if (letter !== lower && mapped) {
        return mapped.charAt(0).toUpperCase() + mapped.slice(1);
      }
      return mapped;
    }).join("").replace(/\s+/g, " ").trim();
  }

  function russianWordGuide(word, nativeLanguage, key) {
    var clean = stripRussianStress(word).toLowerCase();
    var override = russianPronunciationOverrides[clean];
    if (override && override[key]) {
      return override[key];
    }
    if (key === "ipa") {
      return mapRussianLetters(word, russianIpaMap);
    }
    if (key === "latin") {
      return mapRussianLetters(word, russianLatinMap);
    }
    if (normalizeLanguage(nativeLanguage) === "ko") {
      return mapRussianLetters(word, russianKoreanMap);
    }
    return mapRussianLetters(word, russianLatinMap);
  }

  function replaceRussianWords(text, nativeLanguage, key) {
    return String(text || "").replace(/[А-Яа-яЁё]+/g, function (word) {
      var accented = courseLexiconAccent("ru", stripRussianStress(word).toLowerCase()) || word;
      return russianWordGuide(accented, nativeLanguage, key);
    }).replace(/\s+/g, " ").trim();
  }

  function coursePhraseMeaning(practiceLanguage, text, nativeLanguage) {
    if (normalizeLanguage(practiceLanguage) !== "ru") {
      return "";
    }
    var nativeKey = normalizeLanguage(nativeLanguage);
    var source = String(text || "").trim();
    if (!source) {
      return "";
    }
    if (source.indexOf("\n") >= 0) {
      return source.split(/\n+/).map(function (line) {
        return coursePhraseMeaning(practiceLanguage, line, nativeLanguage);
      }).filter(Boolean).join("\n");
    }
    var repeat = source.match(/^Я\s+повторяю\s+слово\s+(.+?)\.$/i);
    if (repeat) {
      var word = repeat[1].trim();
      if (nativeKey === "ko") {
        return "나는 " + word + "라는 단어를 반복합니다.";
      }
      if (nativeKey === "en") {
        return "I repeat the word " + word + ".";
      }
    }
    var words = source.match(/^Сегодня\s+мои\s+слова:\s*(.+?)\.$/i);
    if (words) {
      var list = words[1].trim();
      if (nativeKey === "ko") {
        return "오늘의 단어는 " + list + "입니다.";
      }
      if (nativeKey === "en") {
        return "Today's words are " + list + ".";
      }
    }
    if (/^Через\s+семь\s+дней\s+я\s+проверяю\s+точность\.$/i.test(source)) {
      if (nativeKey === "ko") {
        return "7일 후에 정확도를 확인합니다.";
      }
      if (nativeKey === "en") {
        return "After seven days, I check accuracy.";
      }
    }
    return "";
  }

  function coursePronunciationBundle(practiceLanguage, text, nativeLanguage) {
    if (normalizeLanguage(practiceLanguage) !== "ru" || !russianWordParts(text).length) {
      return {};
    }
    return {
      ipa: replaceRussianWords(text, nativeLanguage, "ipa"),
      romanization: replaceRussianWords(text, nativeLanguage, "latin"),
      native: replaceRussianWords(text, nativeLanguage, "native")
    };
  }

  function coursePhrasePronunciation(language, text) {
    if (normalizeLanguage(language) !== "ru" || !text) {
      return "";
    }
    var changed = false;
    var rendered = String(text).split(/(\s+)/).map(function (token) {
      var clean = token.replace(/^[.,!?;:()[\]{}"'`~\-_/\\|]+|[.,!?;:()[\]{}"'`~\-_/\\|]+$/g, "");
      if (!clean) {
        return token;
      }
      var entry = courseLexiconEntry(language, clean);
      var pronunciation = entry && (entry.ipa || entry.pronunciation);
      if (!pronunciation || pronunciation === clean) {
        return token;
      }
      changed = true;
      return token.replace(clean, pronunciation);
    }).join("");
    return changed ? rendered : "";
  }

  function courseItemAssist(item, options) {
    var text = courseItemText(item);
    var nativeLanguage = normalizeLanguage(options.nativeLanguage);
    var practiceLanguage = normalizeLanguage(options.practiceLanguage);
    if (!text || nativeLanguage === practiceLanguage) {
      return {};
    }
    var entry = courseLexiconEntry(practiceLanguage, text);
    var entryMeanings = entry && entry.meanings && typeof entry.meanings === "object" ? entry.meanings : {};
    var meaning = courseItemMeaning(item, nativeLanguage) || coursePhraseMeaning(practiceLanguage, text, nativeLanguage) || String(entryMeanings[nativeLanguage] || "").trim();
    if (!meaning && shouldUseCourseSiblingMeaning(nativeLanguage, practiceLanguage)) {
      meaning = courseSiblingMeaning(options.nativeItems, options.index, text);
    }
    var pronunciations = coursePronunciationBundle(practiceLanguage, text, nativeLanguage);
    var pronunciation = courseItemPronunciation(item) || String((entry && entry.ipa) || "").trim() || pronunciations.ipa || coursePhrasePronunciation(practiceLanguage, text);
    return {
      meaning: meaning,
      pronunciation: pronunciation,
      pronunciations: pronunciations
    };
  }

  function normalizeCoursePracticeValue(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function refreshCourseTypingProgress(courseCopy) {
    var inputs = qsa("[data-course-practice-input]");
    var total = inputs.length;
    var done = inputs.filter(function (input) {
      return input.getAttribute("data-course-complete") === "true";
    }).length;
    setText("[data-course-typing-progress]", formatCopyValues((courseCopy && courseCopy.typingProgress) || "Typed %d/%d", [done, total]));
  }

  function updateCoursePracticeState(input, status, targetText, courseCopy) {
    var current = normalizeCoursePracticeValue(input.value);
    var target = normalizeCoursePracticeValue(targetText);
    var complete = !!current && current === target;
    var started = !!current;
    var item = input.closest ? input.closest("[data-course-practice-item]") : null;
    input.setAttribute("data-course-complete", complete ? "true" : "false");
    input.setAttribute("aria-invalid", started && !complete ? "true" : "false");
    if (item) {
      item.classList.toggle("is-started", started);
      item.classList.toggle("is-complete", complete);
    }
    if (status) {
      status.textContent = complete ? (courseCopy.practiceOk || "Checked") : (started ? (courseCopy.practiceAgain || "Check again") : (courseCopy.practicePending || "Type to check"));
    }
    refreshCourseTypingProgress(courseCopy);
  }

  function appendCoursePracticeControl(item, text, config) {
    var courseCopy = config.courseCopy || {};
    var field = config.multiline ? document.createElement("textarea") : document.createElement("input");
    var wrapper = document.createElement("label");
    var label = document.createElement("span");
    var status = document.createElement("span");
    wrapper.className = "course-item-practice";
    label.className = "course-item-practice-label";
    label.textContent = courseCopy.practiceInputLabel || "Type it";
    field.className = "course-item-practice-input";
    field.setAttribute("data-course-practice-input", "");
    field.setAttribute("data-course-complete", "false");
    field.setAttribute("autocomplete", "off");
    field.setAttribute("autocapitalize", "off");
    field.setAttribute("spellcheck", "false");
    field.setAttribute("aria-label", label.textContent + ": " + text);
    field.setAttribute("placeholder", config.multiline ? (courseCopy.practiceTextareaPlaceholder || courseCopy.practiceInputPlaceholder || "Type this item to check") : (courseCopy.practiceInputPlaceholder || "Type this item to check"));
    if (config.multiline) {
      field.setAttribute("rows", "2");
    } else {
      field.setAttribute("type", "text");
      if (Array.from(text).length === 1) {
        field.setAttribute("maxlength", "2");
        field.setAttribute("inputmode", "text");
      }
    }
    status.className = "course-item-practice-status";
    status.textContent = courseCopy.practicePending || "Type to check";
    field.addEventListener("input", function () {
      updateCoursePracticeState(field, status, text, courseCopy);
    });
    wrapper.appendChild(label);
    wrapper.appendChild(field);
    wrapper.appendChild(status);
    item.appendChild(wrapper);
  }

  function appendCourseAssistRow(root, label, value) {
    if (!value) {
      return;
    }
    var row = document.createElement("span");
    row.className = "course-item-assist-row";
    var labelNode = document.createElement("span");
    labelNode.className = "course-item-assist-label";
    labelNode.textContent = label;
    var valueNode = document.createElement("span");
    valueNode.className = "course-item-assist-value";
    valueNode.textContent = value;
    row.appendChild(labelNode);
    row.appendChild(valueNode);
    root.appendChild(row);
  }

  function renderCourseList(selector, items, options) {
    var config = options || {};
    qsa(selector).forEach(function (list) {
      list.replaceChildren();
      (items || []).slice(0, config.limit || 7).forEach(function (sourceItem, index) {
        var text = courseItemText(sourceItem);
        if (!text) {
          return;
        }
        var item = document.createElement("li");
        item.setAttribute("data-course-practice-item", "");
        var main = document.createElement("span");
        main.className = "course-item-main";
        main.textContent = text;
        item.appendChild(main);
        var assist = courseItemAssist(sourceItem, {
          practiceLanguage: config.practiceLanguage,
          nativeLanguage: config.nativeLanguage,
          nativeItems: config.nativeItems,
          index: index
        });
        if (assist.meaning || assist.pronunciation) {
          var assistNode = document.createElement("span");
          assistNode.className = "course-item-assist";
          appendCourseAssistRow(assistNode, config.meaningLabel || "Meaning", assist.meaning);
          appendCourseAssistRow(assistNode, config.pronunciationLabel || "Pronunciation", assist.pronunciation);
          item.appendChild(assistNode);
        }
        appendCoursePracticeControl(item, text, {
          courseCopy: config.courseCopy || {},
          multiline: !!config.multiline
        });
        list.appendChild(item);
      });
    });
  }

  function courseLettersFromItems(items) {
    var letters = [];
    var seen = {};
    (items || []).forEach(function (item) {
      Array.from(courseItemText(item)).forEach(function (letter) {
        var clean = String(letter || "").trim();
        if (!clean || /[\s.,!?;:()[\]{}"'`~\-_/\\|]/.test(clean) || seen[clean]) {
          return;
        }
        seen[clean] = true;
        letters.push(clean);
      });
    });
    return letters.slice(0, 7);
  }

  function renderCourseBundle(summary, courseCopy) {
    if (!qs("[data-course-bundle]")) {
      return;
    }
    var active = courseBundleForSummary(summary);
    setText("[data-course-difficulty-title]", formatCopyValues(courseCopy.bundleTitle || "%s · Day %d / 7", [active.bundle.name || courseCopy.bundleFallbackTitle, active.dayNumber]));
    setText("[data-course-week-progress]", formatCopyValues(courseCopy.bundleProgress || "Day %d · achievement %d%", [active.dayNumber, summary.achievementPercent || 0]));
    setText("[data-course-typing-progress]", formatCopyValues(courseCopy.typingProgress || "Typed %d/%d", [0, 0]));
    setText("[data-course-bundle-summary]", active.day.summary || courseCopy.bundleSummaryFallback || "");
    setText("[data-course-day-title]", active.day.title || courseCopy.bundleFallbackTitle || "");
    setText("[data-course-daily-hint]", summary.needsReview ? (courseCopy.dailyReviewHint || courseCopy.dailyAdvanceHint || "") : (courseCopy.dailyAdvanceHint || ""));
    var listOptions = {
      practiceLanguage: active.language,
      nativeLanguage: active.nativeLanguage,
      meaningLabel: courseCopy.itemMeaningLabel || "Meaning",
      pronunciationLabel: courseCopy.itemPronunciationLabel || "Pronunciation",
      courseCopy: courseCopy
    };
    renderCourseList("[data-course-letters]", courseLettersFromItems(active.day.words), Object.assign({}, listOptions, { limit: 7 }));
    renderCourseList("[data-course-words]", active.day.words, Object.assign({}, listOptions, { nativeItems: active.nativeDay.words }));
    renderCourseList("[data-course-sentences]", active.day.sentences, Object.assign({}, listOptions, { nativeItems: active.nativeDay.sentences, multiline: true }));
    refreshCourseTypingProgress(courseCopy);
  }

  function courseLevelCaption(summary, courseCopy) {
    if (summary.needsReview) {
      return formatCopy(courseCopy.levelCaptionReview || courseCopy.levelCaption || "", summary.achievementPercent || 0);
    }
    return formatCopy(courseCopy.levelCaption || "", summary.nextCount);
  }

  function renderLearningSummary(copy) {
    var progressCopy = (copy && copy.progress) || (shellLocales[preferredLanguage()] || shellLocales.ko).progress;
    var courseCopy = (copy && copy.course) || (shellLocales[preferredLanguage()] || shellLocales.ko).course;
    var summary = calculateLearningSummary();
    setText("[data-progress-level]", formatCopy(progressCopy.levelValue, summary.level));
    setText("[data-progress-streak]", String(summary.streak));
    setText("[data-progress-streak-unit]", progressCopy.streakUnit);
    setText("[data-progress-next-count]", String(summary.nextCount));
    setText("[data-progress-next-unit]", progressCopy.nextUnit || progressCopy.sessionUnit);
    setText("[data-progress-session-count]", String(summary.sessions));
    setText("[data-progress-session-unit]", progressCopy.sessionUnit);
    setText("[data-course-prev-level]", formatCopy(progressCopy.levelValue, Math.max(0, summary.level - 1)));
    setText("[data-course-next-level]", formatCopy(progressCopy.levelValue, summary.level + 1));
    setText("[data-course-level-caption]", courseLevelCaption(summary, courseCopy));
    qsa("[data-progress-fill]").forEach(function (node) {
      node.style.width = summary.progressPercent + "%";
    });
    updateCourseNodes(summary);
    renderCourseBundle(summary, courseCopy);
  }

  function updateCourseNodes(summary) {
    var nodes = qsa("[data-course-node]");
    if (!nodes.length) {
      return;
    }
    var current = Math.min(nodes.length - 1, Math.max(0, summary.currentStep || 0));
    var currentHref = "";
    nodes.forEach(function (node, index) {
      node.classList.toggle("is-complete", index < current);
      node.classList.toggle("is-current", index === current);
      node.classList.toggle("is-next", index > current);
      if (index === current) {
        currentHref = node.getAttribute("href") || "";
      }
    });
    if (currentHref) {
      qsa("[data-course-current-link]").forEach(function (link) {
        link.setAttribute("href", currentHref);
      });
    }
  }

  function formatSeconds(seconds) {
    var safe = Math.max(0, Math.round(Number(seconds) || 0));
    var minutes = Math.floor(safe / 60);
    var rest = safe % 60;
    return String(minutes).padStart(2, "0") + ":" + String(rest).padStart(2, "0");
  }

  function historyModeLabel(result, copy) {
    var mode = result && result.mode;
    var legacyModes = {
      "자리 연습": "seat",
      "단어 연습": "word",
      "문장 연습": "sentenceShort",
      "단문 연습": "sentenceShort",
      "장문 연습": "sentenceLong",
      "타자게임": "game",
      "키보드 보기": "keyboard",
      "키보드 테스트": "keyboard",
      "Keyboard Test": "keyboard",
      "Проверка клавиатуры": "keyboard"
    };
    if ((mode === "game" || mode === "타자게임") && result && result.game && copy.history.games[result.game]) {
      return copy.history.modes.game + " · " + copy.history.games[result.game];
    }
    if (copy.history.modes[mode]) {
      return copy.history.modes[mode];
    }
    if (legacyModes[mode]) {
      return copy.history.modes[legacyModes[mode]];
    }
    return mode || copy.history.modes.sentence;
  }

  function historyLanguageLabel(value, copy) {
    var legacyLanguages = {
      "한국어": "ko",
      English: "en",
      "Русский": "ru"
    };
    var normalized = legacyLanguages[value] || normalizeLanguage(value || currentPreferenceState().practiceLanguage);
    return copy.history.languages[normalized] || value || copy.history.languages.ko;
  }

  function appendHistoryCell(item, text, strong) {
    var cell = document.createElement(strong ? "strong" : "span");
    cell.textContent = text;
    item.appendChild(cell);
  }

  function renderHistoryRows(list, copy, options) {
    if (!list) {
      return;
    }
    list.replaceChildren();
    var results = scopedResults(options);
    if (!results.length) {
      var empty = document.createElement("li");
      empty.className = "empty-history";
      empty.textContent = copy.history.empty;
      list.appendChild(empty);
      return;
    }
    results.forEach(function (result) {
      var item = document.createElement("li");
      appendHistoryCell(item, historyModeLabel(result, copy) + " · " + historyLanguageLabel((result && (result.practiceLanguage || result.language)) || "", copy), true);
      appendHistoryCell(item, String((result && result.accuracy) || 0) + "%", false);
      appendHistoryCell(item, String((result && result.cpm) || 0) + " CPM", false);
      appendHistoryCell(item, String((result && result.wpm) || 0) + " WPM", false);
      appendHistoryCell(item, formatSeconds(result && result.elapsedSeconds), false);
      appendHistoryCell(item, String((result && result.score) || 0) + " " + copy.history.points, false);
      list.appendChild(item);
    });
  }

  function ensureShellHistoryPanel(copy) {
    var mount = qs("#historyPopoverMount");
    if (!mount) {
      return null;
    }
    var panel = qs(".shell-history-panel", mount);
    if (panel) {
      return panel;
    }
    panel = document.createElement("section");
    panel.className = "history-panel shell-history-panel";
    panel.setAttribute("aria-labelledby", "historyTitle");
    panel.innerHTML = '<div class="history-header"><h2 id="historyTitle"></h2><button class="text-button" type="button" data-shell-history-clear></button></div><ol class="history-list" id="historyList"></ol>';
    mount.appendChild(panel);
    var clear = qs("[data-shell-history-clear]", panel);
    if (clear) {
      clear.addEventListener("click", function () {
        clearScopedResults();
        renderShellHistory();
        renderMyInfoRecords();
        renderLearningSummary();
      });
    }
    return panel;
  }

  function renderShellHistory() {
    var language = normalizeLanguage(preferredLanguage());
    var copy = shellLocales[language] || shellLocales.ko;
    var panel = ensureShellHistoryPanel(copy);
    if (!panel) {
      return;
    }
    var title = qs("#historyTitle", panel);
    var clear = qs("[data-shell-history-clear]", panel);
    var list = qs("#historyList", panel);
    if (title) {
      title.textContent = copy.history.title;
    }
    if (clear) {
      clear.textContent = copy.history.clear;
    }
    if (!list) {
      return;
    }
    renderHistoryRows(list, copy);
  }

  function ensureMyInfoRecordsPanel(mount) {
    var panel = qs(".shell-myinfo-records-panel", mount);
    if (panel) {
      return panel;
    }
    panel = document.createElement("section");
    panel.className = "history-panel shell-myinfo-records-panel";
    panel.innerHTML = '<div class="history-header"><h2 data-myinfo-records-heading></h2><button class="text-button" type="button" data-myinfo-records-clear></button></div><ol class="history-list"></ol>';
    mount.appendChild(panel);
    var clear = qs("[data-myinfo-records-clear]", panel);
    if (clear) {
      clear.addEventListener("click", function () {
        clearScopedResults({ activityKey: "" });
        renderShellHistory();
        renderMyInfoRecords();
        renderLearningSummary();
      });
    }
    return panel;
  }

  function renderMyInfoRecords(copyOverride) {
    var language = normalizeLanguage(preferredLanguage());
    var copy = copyOverride || shellLocales[language] || shellLocales.ko;
    qsa("[data-myinfo-records]").forEach(function (mount) {
      var panel = ensureMyInfoRecordsPanel(mount);
      var title = qs("[data-myinfo-records-heading]", panel);
      var clear = qs("[data-myinfo-records-clear]", panel);
      var list = qs(".history-list", panel);
      if (title) {
        title.textContent = copy.history.title;
      }
      if (clear) {
        clear.textContent = copy.history.clear;
      }
      renderHistoryRows(list, copy, { activityKey: "" });
    });
  }

  function setShellHistoryOpen(open) {
    var popover = qs("#historyPopover");
    if (!popover) {
      return;
    }
    if (open) {
      setLanguagePopoverOpen(false);
      setShellSettingsOpen(false);
      renderShellHistory();
    }
    popover.hidden = !open;
    qsa("[data-history-toggle]").forEach(function (button) {
      button.setAttribute("aria-expanded", String(open));
    });
  }

  function initShellPopovers() {
    if (qs(".app-shell")) {
      return;
    }
    syncLanguageControls();
    qsa("[data-settings-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        var popover = qs("#settingsPopover");
        setShellSettingsOpen(!popover || popover.hidden);
      });
    });
    qsa("[data-settings-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        setShellSettingsOpen(false);
      });
    });
    qsa("[data-history-toggle]").forEach(function (button) {
      button.addEventListener("click", function () {
        var popover = qs("#historyPopover");
        setShellHistoryOpen(!popover || popover.hidden);
      });
    });
    qsa("[data-history-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        setShellHistoryOpen(false);
      });
    });
    qsa("[data-ui-language]").forEach(function (button) {
      button.addEventListener("click", function () {
        saveLanguagePreference("ui", button.getAttribute("data-ui-language"));
      });
    });
    qsa("[data-practice-language]").forEach(function (button) {
      button.addEventListener("click", function () {
        saveLanguagePreference("practice", button.getAttribute("data-practice-language"));
      });
    });
    qsa("[data-language-setup-done]").forEach(function (button) {
      button.addEventListener("click", function () {
        setShellSettingsOpen(false);
      });
    });
    document.addEventListener("click", function (event) {
      if (event.target === qs("#settingsPopover")) {
        setShellSettingsOpen(false);
      }
      if (event.target === qs("#historyPopover")) {
        setShellHistoryOpen(false);
      }
    });
  }

  function initLanguagePopover() {
    syncLanguageControls();
    qsa("[data-ui-language-toggle]").forEach(function (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var popover = qs("#uiLanguagePopover");
        setLanguagePopoverOpen(!popover || popover.hidden);
      });
    });
    qsa("[data-ui-language-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        setLanguagePopoverOpen(false);
      });
    });
    var popover = qs("#uiLanguagePopover");
    if (popover) {
      popover.addEventListener("click", function (event) {
        if (event.target === popover) {
          setLanguagePopoverOpen(false);
        }
      });
    }
  }

  function resetAccountSubmitForm(form) {
    form.removeAttribute("data-account-submitting");
    var button = qs("[data-account-submit]", form);
    if (!button) {
      return;
    }
    button.disabled = false;
    button.removeAttribute("aria-busy");
    button.style.cursor = "";
    button.style.opacity = "";
    var spinner = qs("[data-account-submit-spinner]", button);
    if (spinner) {
      spinner.hidden = true;
    }
  }

  function setAccountSubmitFormLoading(form) {
    if (form.getAttribute("data-account-submitting") === "true") {
      return false;
    }
    form.setAttribute("data-account-submitting", "true");
    var button = qs("[data-account-submit]", form);
    if (button) {
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      button.style.cursor = "wait";
      button.style.opacity = "0.82";
      var spinner = qs("[data-account-submit-spinner]", button);
      if (spinner) {
        spinner.hidden = false;
      }
    }
    return true;
  }

  function initAccountSubmitSpinners() {
    qsa("[data-account-form]").forEach(function (form) {
      resetAccountSubmitForm(form);
      form.addEventListener("submit", function (event) {
        if (!setAccountSubmitFormLoading(form)) {
          event.preventDefault();
        }
      });
    });
    window.addEventListener("pageshow", function () {
      qsa("[data-account-form]").forEach(resetAccountSubmitForm);
    });
  }

  window.MirtypeShellLocale = {
    apply: applyShellLocale,
    preferredLanguage: preferredLanguage
  };

  window.MirtypeCourseRuntime = {
    calculateLearningSummary: calculateLearningSummary,
    bundleForSummary: courseBundleForSummary,
    bundlesForLanguage: courseBundlesForLanguage,
    currentActivityKey: currentActivityKey,
    currentLanguagePairKey: currentLanguagePairKey,
    scopedResults: scopedResults,
    resultActivityKey: resultActivityKey,
    resultLanguagePairKey: resultLanguagePairKey,
    refreshLearningSummary: renderLearningSummary,
    itemText: courseItemText,
    itemAssist: courseItemAssist,
    lettersFromItems: courseLettersFromItems
  };

  window.MirtypeLearningStore = {
    readResults: readResults,
    scopedResults: scopedResults,
    saveResult: postLearningResult,
    clearScopedResults: clearScopedResults,
    requestState: requestLearningState,
    requestPreferences: requestRemotePreferences,
    savePreferences: writePreferences,
    readPreferences: readPreferences,
    currentPreferenceState: currentPreferenceState
  };

  window.MirtypeLanguagePicker = {
    close: function () {
      setLanguagePopoverOpen(false);
    },
    sync: syncLanguageControls
  };

  ready(function () {
    var toggle = qs("[data-mobile-menu-toggle]");
    var close = qs("[data-mobile-menu-close]");
    var menu = qs("#siteMobileMenu");

    applyShellLocale();
    initLanguagePopover();
    initShellPopovers();
    initAccountSubmitSpinners();
    refreshIcons();
    requestRemotePreferences();
    requestLearningState();
    requestMyInfoLearningStates();

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
        setLanguagePopoverOpen(false);
        setShellSettingsOpen(false);
        setShellHistoryOpen(false);
      }
    });

    window.addEventListener("storage", function (event) {
      if (event.key === PREFERENCES_KEY) {
        applyShellLocale();
        syncLanguageControls();
        requestLearningState();
        requestMyInfoLearningStates();
      }
      if (event.key === STORAGE_KEY && !qs(".app-shell")) {
        renderShellHistory();
        renderMyInfoRecords();
        renderLearningSummary();
      }
    });
  });
})();
