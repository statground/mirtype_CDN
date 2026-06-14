(function () {
  "use strict";

  var PREFERENCES_KEY = "mirtype.preferences.v1";
  var STORAGE_KEY = "mirtype.results.v2";
  var originalLegalPages = {};
  var supportedLanguages = ["ko", "en", "ru"];
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
      metaDescriptionPractice: "자리, 단어, 문장, 게임, 키보드 보기를 한 곳에서 고르는 MirType 타자연습 허브",
      metaTitleCourse: "MirType 언어 연습 코스",
      metaDescriptionCourse: "언어 능력, 입력 숙련, 복습 큐를 연결하는 MirType 언어 연습 코스",
      metaTitleIntro: "MirType 소개",
      metaDescriptionIntro: "타자연습과 언어 공부를 동시에 할 수 있는 MirType 서비스 소개",
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
        practiceGroup: "연습",
        typingPractice: "타자연습",
        seat: "자리 연습",
        word: "단어 연습",
        sentence: "문장 연습",
        course: "언어 코스",
        game: "타자게임",
        keyboard: "키보드 보기",
        keyboardShort: "키보드",
        history: "최근 기록",
        intro: "MirType 소개",
        terms: "서비스 이용약관",
        privacy: "개인정보 처리방침",
        statground: "통계마당",
        webr: "Web-R"
      },
      bottom: {
        aria: "MirType 하단 메뉴",
        home: "홈",
        practice: "연습",
        course: "코스",
        myinfo: "내 정보",
        more: "더보기"
      },
      mobile: {
        today: "오늘",
        practice: "연습",
        tools: "도구",
        account: "계정",
        service: "서비스"
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
        levelHint: "기록이 쌓이면 자동으로 올라갑니다.",
        levelValue: "Lv. %d",
        streakLabel: "연속 학습",
        streakHint: "오늘 또는 어제까지 이어진 학습일입니다.",
        streakUnit: "일",
        xpLabel: "학습 XP",
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
        kicker: "Typing Practice",
        title: "타자연습 모드",
        summary: "자리, 단어, 문장, 게임, 키보드 보기를 한 곳에 모았습니다. 오늘 필요한 상세 연습을 고르면 바로 해당 기능으로 이동합니다.",
        startSeat: "자리 연습으로 시작",
        startWord: "단어 연습으로 이어가기",
        changeLanguage: "연습 언어 바꾸기",
        detailKicker: "Practice Menu",
        detailTitle: "상세 연습 기능",
        detailSummary: "처음이면 자리 연습부터, 익숙하면 단어와 문장, 짧게 몰입하고 싶으면 게임으로 들어가세요.",
        seatCardTitle: "자리 연습",
        seatCardBody: "손가락이 키 위치를 먼저 기억합니다.",
        wordCardTitle: "단어 연습",
        wordCardBody: "짧은 단어로 입력 리듬을 만듭니다.",
        sentenceCardTitle: "문장 연습",
        sentenceCardBody: "문장을 따라 치며 언어 감각을 익힙니다.",
        gameCardTitle: "타자게임",
        gameCardBody: "산성비, 침략자, 자원 캐기 중에서 고릅니다.",
        keyboardCardTitle: "키보드 보기",
        keyboardCardBody: "언어별 배열과 입력 위치를 확인하고 자유 입력으로 점검합니다."
      },
      course: {
        mainAria: "MirType 언어 연습 코스",
        statusAria: "학습 상태",
        kicker: "Language Course",
        title: "언어 연습 코스",
        summary: "목표 언어를 읽고, 실제 키보드로 입력하고, 약한 표현을 다시 복습하는 흐름입니다. 지금은 코스 지도로 시작하고, 이후 계정 기록과 복습 큐를 연결합니다.",
        unitKicker: "SECTION 1, UNIT 1",
        unitTitle: "목표 언어로 첫 문장을 입력하기",
        todayCta: "언어 코스 시작",
        startWord: "단어 코스로 시작",
        startSentence: "문장 코스로 이어가기",
        changeLanguage: "연습 언어 바꾸기",
        mapKicker: "Course Map",
        mapTitle: "오늘의 언어 연습 지도",
        startBubble: "START",
        wordNodeAria: "단어 코스 시작",
        wordNodeLabel: "단어",
        seatNodeAria: "자리 연습",
        seatNodeLabel: "자리",
        sentenceNodeAria: "문장 코스",
        sentenceNodeLabel: "문장",
        gameNodeAria: "타자게임",
        gameNodeLabel: "게임",
        keyboardNodeAria: "키보드 점검",
        keyboardNodeLabel: "키보드",
        reviewNodeAria: "복습 큐",
        reviewNodeLabel: "복습",
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
        summary: "닉네임과 이름을 관리하고, 브라우저에 저장된 MirType 학습 레벨과 연속 학습 상태를 확인합니다.",
        profileTitle: "계정 정보",
        progressTitle: "학습 상태",
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
        summary: "내 언어로 화면을 보고, 원하는 언어의 키보드와 문장을 고릅니다. 오늘의 연습은 손가락이 먼저 기억하는 작은 흐름에서 시작합니다.",
        ctaSeat: "자리 연습 시작",
        ctaPractice: "타자연습 시작",
        ctaCourse: "언어 코스 시작",
        ctaSettings: "언어 설정",
        ctaIntro: "MirType 살펴보기",
        flowKicker: "Practice Flow",
        flowTitle: "지금 필요한 연습으로 바로 이동",
        cardPracticeTitle: "타자연습",
        cardPracticeBody: "자리, 단어, 문장, 게임, 키보드 보기를 한 곳에서 고릅니다.",
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
        cardKeyboardTitle: "키보드 보기",
        cardKeyboardBody: "언어별 배열과 입력 위치를 확인합니다.",
        cardIntroTitle: "MirType 소개",
        cardIntroBody: "왜 만들고 어디로 가는지 살펴봅니다.",
        boardKicker: "Live Practice",
        boardGhost: "언어는 눈으로 읽고 손끝으로 기억합니다.",
        boardTyped: "언어는 눈으로 읽고",
        boardHint: "한국어 · English · Русский"
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
      settings: {
        kicker: "Language Setup",
        title: "언어 설정",
        summary: "타자 연습에 사용할 언어를 선택합니다.",
        uiLanguage: "내 언어",
        practiceLanguage: "연습할 언어",
        save: "설정 저장"
      },
      history: {
        title: "최근 기록",
        clear: "비우기",
        empty: "아직 기록이 없습니다.",
        points: "점",
        modes: { seat: "자리 연습", word: "단어 연습", sentence: "문장 연습", game: "타자게임", keyboard: "키보드 보기" },
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
      metaDescriptionPractice: "A MirType typing practice hub for key, word, sentence, game, and keyboard-view practice",
      metaTitleCourse: "MirType Language Course",
      metaDescriptionCourse: "A MirType language course that connects language ability, input fluency, and review queues",
      metaTitleIntro: "About MirType",
      metaDescriptionIntro: "About MirType, a service for typing practice and language learning together",
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
        keyboard: "Keyboard View",
        keyboardShort: "Keyboard",
        history: "Recent Records",
        intro: "About MirType",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        statground: "Statground",
        webr: "Web-R"
      },
      bottom: {
        aria: "MirType bottom menu",
        home: "Home",
        practice: "Practice",
        course: "Course",
        myinfo: "My Info",
        more: "More"
      },
      mobile: {
        today: "Today",
        practice: "Practice",
        tools: "Tools",
        account: "Account",
        service: "Service"
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
        levelHint: "Levels rise automatically as records build up.",
        levelValue: "Lv. %d",
        streakLabel: "Streak",
        streakHint: "Practice days connected through today or yesterday.",
        streakUnit: "days",
        xpLabel: "Learning XP",
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
        kicker: "Typing Practice",
        title: "Typing Practice Modes",
        summary: "Key practice, words, sentences, games, and keyboard view are gathered in one place. Choose the detailed practice you need today and jump straight into it.",
        startSeat: "Start with Key Practice",
        startWord: "Continue to Word Practice",
        changeLanguage: "Change Practice Language",
        detailKicker: "Practice Menu",
        detailTitle: "Detailed Practice",
        detailSummary: "Start with keys if you are new, move to words and sentences when ready, or choose games for a short focused round.",
        seatCardTitle: "Key Practice",
        seatCardBody: "Let your fingers learn where each key lives.",
        wordCardTitle: "Word Practice",
        wordCardBody: "Build a steady rhythm with short words.",
        sentenceCardTitle: "Sentence Practice",
        sentenceCardBody: "Type full sentences and feel the language.",
        gameCardTitle: "Typing Games",
        gameCardBody: "Choose Acid Rain, Invaders, or Resource Mining.",
        keyboardCardTitle: "Keyboard View",
        keyboardCardBody: "Check layouts and input positions by language, then test with free typing."
      },
      course: {
        mainAria: "MirType language course",
        statusAria: "Learning status",
        kicker: "Language Course",
        title: "Language Course",
        summary: "Read the target language, type it with the real keyboard, and bring weak expressions back for review. It starts as a course map now and will connect to account records and review queues later.",
        unitKicker: "SECTION 1, UNIT 1",
        unitTitle: "Type your first sentence in the target language",
        todayCta: "Start Language Course",
        startWord: "Start with Word Course",
        startSentence: "Continue to Sentence Course",
        changeLanguage: "Change Practice Language",
        mapKicker: "Course Map",
        mapTitle: "Today's language practice map",
        startBubble: "START",
        wordNodeAria: "Start Word Course",
        wordNodeLabel: "Words",
        seatNodeAria: "Key Practice",
        seatNodeLabel: "Keys",
        sentenceNodeAria: "Sentence Course",
        sentenceNodeLabel: "Sentences",
        gameNodeAria: "Typing Games",
        gameNodeLabel: "Games",
        keyboardNodeAria: "Keyboard Check",
        keyboardNodeLabel: "Keyboard",
        reviewNodeAria: "Review Queue",
        reviewNodeLabel: "Review",
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
        summary: "Manage your nickname and name, and check the MirType level and streak saved in this browser.",
        profileTitle: "Account Info",
        progressTitle: "Learning Status",
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
                "Browser-based or account-based practice record storage, viewing, and future learning flow recommendations",
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
                "Settings and recent records stored in browser localStorage are saved on the user's device and can be deleted directly by the user.",
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
              title: "Article 8. Cookies and localStorage",
              items: [
                "MirType may use HTTP-only cookies to maintain login sessions.",
                "Some information, such as language settings, keyboard visibility, and recent practice records, may be stored in the user's browser localStorage.",
                "Users may delete cookies or localStorage through browser settings, in which case some convenience features may be reset."
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
        summary: "Read the screen in your language, then practice the keyboard and sentences you want to learn. Today's session starts with a small rhythm your fingers can remember.",
        ctaSeat: "Start Key Practice",
        ctaPractice: "Start Typing Practice",
        ctaCourse: "Start Language Course",
        ctaSettings: "Language Settings",
        ctaIntro: "About MirType",
        flowKicker: "Practice Flow",
        flowTitle: "Jump into the practice you need now",
        cardPracticeTitle: "Typing Practice",
        cardPracticeBody: "Choose key, word, sentence, game, or keyboard-view practice in one place.",
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
        cardKeyboardTitle: "Keyboard View",
        cardKeyboardBody: "Check layouts and input positions by language.",
        cardIntroTitle: "About MirType",
        cardIntroBody: "See why it exists and where it is headed.",
        boardKicker: "Live Practice",
        boardGhost: "Language is read by the eyes and remembered by the fingertips.",
        boardTyped: "Language is read by the eyes",
        boardHint: "Korean · English · Russian"
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
        summary: "Choose the language for typing practice.",
        uiLanguage: "My Language",
        practiceLanguage: "Practice Language",
        save: "Save Settings"
      },
      history: {
        title: "Recent Records",
        clear: "Clear",
        empty: "No records yet.",
        points: "pts",
        modes: { seat: "Key Practice", word: "Word Practice", sentence: "Sentence Practice", game: "Typing Games", keyboard: "Keyboard View" },
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
      metaDescriptionPractice: "Центр MirType для выбора клавиш, слов, предложений, игр и просмотра клавиатуры",
      metaTitleCourse: "Языковой курс MirType",
      metaDescriptionCourse: "Языковой курс MirType, который соединяет языковой навык, навык ввода и очередь повторения",
      metaTitleIntro: "О MirType",
      metaDescriptionIntro: "О MirType, сервисе для тренировки печати и изучения языков одновременно",
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
        keyboard: "Клавиатура",
        keyboardShort: "Клавиатура",
        history: "Последние записи",
        intro: "О MirType",
        terms: "Условия сервиса",
        privacy: "Политика конфиденциальности",
        statground: "Statground",
        webr: "Web-R"
      },
      bottom: {
        aria: "Нижнее меню MirType",
        home: "Главная",
        practice: "Печать",
        course: "Курс",
        myinfo: "Профиль",
        more: "Еще"
      },
      mobile: {
        today: "Сегодня",
        practice: "Тренировка",
        tools: "Инструменты",
        account: "Аккаунт",
        service: "Сервис"
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
        levelHint: "Уровень растет автоматически по мере накопления записей.",
        levelValue: "Ур. %d",
        streakLabel: "Серия",
        streakHint: "Дни тренировки, продолжающиеся до сегодня или вчера.",
        streakUnit: "дн.",
        xpLabel: "Учебный XP",
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
        kicker: "Typing Practice",
        title: "Режимы печати",
        summary: "Клавиши, слова, предложения, игры и просмотр клавиатуры собраны в одном месте. Выберите нужную тренировку на сегодня и сразу перейдите к ней.",
        startSeat: "Начать с клавиш",
        startWord: "Продолжить словами",
        changeLanguage: "Сменить язык тренировки",
        detailKicker: "Practice Menu",
        detailTitle: "Подробные тренировки",
        detailSummary: "Если вы начинаете, выберите клавиши; если уже привыкли, переходите к словам и предложениям, а для короткой концентрации выберите игру.",
        seatCardTitle: "Клавиши",
        seatCardBody: "Пальцы сначала запоминают расположение клавиш.",
        wordCardTitle: "Слова",
        wordCardBody: "Короткие слова помогают найти ритм.",
        sentenceCardTitle: "Предложения",
        sentenceCardBody: "Печатайте фразы и чувствуйте язык.",
        gameCardTitle: "Игры",
        gameCardBody: "Выберите кислотный дождь, захватчиков или добычу ресурсов.",
        keyboardCardTitle: "Клавиатура",
        keyboardCardBody: "Проверьте раскладки и позиции ввода, затем попробуйте свободный ввод."
      },
      course: {
        mainAria: "Языковой курс MirType",
        statusAria: "Учебный статус",
        kicker: "Language Course",
        title: "Языковой курс",
        summary: "Читайте целевой язык, вводите его реальной клавиатурой и возвращайте слабые выражения в повторение. Сейчас это карта курса, позже она будет связана с аккаунтом и очередью повторения.",
        unitKicker: "SECTION 1, UNIT 1",
        unitTitle: "Введите первое предложение на целевом языке",
        todayCta: "Начать языковой курс",
        startWord: "Начать со слов",
        startSentence: "Продолжить предложениями",
        changeLanguage: "Сменить язык тренировки",
        mapKicker: "Course Map",
        mapTitle: "Карта языковой практики на сегодня",
        startBubble: "START",
        wordNodeAria: "Начать курс слов",
        wordNodeLabel: "Слова",
        seatNodeAria: "Тренировка клавиш",
        seatNodeLabel: "Клавиши",
        sentenceNodeAria: "Курс предложений",
        sentenceNodeLabel: "Фразы",
        gameNodeAria: "Игры печати",
        gameNodeLabel: "Игры",
        keyboardNodeAria: "Проверка клавиатуры",
        keyboardNodeLabel: "Клавиатура",
        reviewNodeAria: "Очередь повторения",
        reviewNodeLabel: "Повтор",
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
        summary: "Управляйте никнеймом и именем, а также смотрите уровень MirType и серию, сохраненные в этом браузере.",
        profileTitle: "Информация аккаунта",
        progressTitle: "Учебный статус",
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
                "Настройки и последние записи, сохраненные в localStorage браузера, хранятся на устройстве пользователя и могут быть удалены пользователем напрямую.",
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
              title: "Статья 8. Cookies и localStorage",
              items: [
                "MirType может использовать HTTP-only cookies для поддержания сеансов входа.",
                "Некоторая информация, такая как языковые настройки, отображение клавиатуры и последние записи тренировки, может сохраняться в localStorage браузера пользователя.",
                "Пользователь может удалить cookies или localStorage через настройки браузера, и в этом случае некоторые удобные функции могут быть сброшены."
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
        summary: "Смотрите интерфейс на своем языке и тренируйте клавиатуру, слова и предложения на языке, который хотите освоить. Сегодняшняя практика начинается с маленького ритма, который запоминают пальцы.",
        ctaSeat: "Начать с клавиш",
        ctaPractice: "Начать печать",
        ctaCourse: "Начать языковой курс",
        ctaSettings: "Настроить языки",
        ctaIntro: "О MirType",
        flowKicker: "Practice Flow",
        flowTitle: "Выберите нужную тренировку",
        cardPracticeTitle: "Печать",
        cardPracticeBody: "Выберите клавиши, слова, предложения, игру или клавиатуру в одном месте.",
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
        cardKeyboardTitle: "Клавиатура",
        cardKeyboardBody: "Проверьте раскладки и позиции ввода.",
        cardIntroTitle: "О MirType",
        cardIntroBody: "Узнайте, зачем создан сервис и куда он движется.",
        boardKicker: "Live Practice",
        boardGhost: "Язык читают глазами и запоминают кончиками пальцев.",
        boardTyped: "Язык читают глазами",
        boardHint: "Корейский · English · Русский"
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
        summary: "Выберите язык для тренировки печати.",
        uiLanguage: "Мой язык",
        practiceLanguage: "Язык тренировки",
        save: "Сохранить"
      },
      history: {
        title: "Последние записи",
        clear: "Очистить",
        empty: "Записей пока нет.",
        points: "очк.",
        modes: { seat: "Клавиши", word: "Слова", sentence: "Предложения", game: "Игры", keyboard: "Клавиатура" },
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
    return key;
  }

  function readPreferences() {
    try {
      return JSON.parse(window.localStorage.getItem(PREFERENCES_KEY) || "{}") || {};
    } catch (error) {
      return {};
    }
  }

  function writePreferences(preferences) {
    try {
      window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
      // Storage may be unavailable in private browsing; the visible UI can still update.
    }
  }

  function currentPreferenceState() {
    var preferences = readPreferences();
    var uiLanguage = normalizeLanguage(preferences.uiLanguage || preferences.nativeLanguage || preferredLanguage());
    return {
      uiLanguage: uiLanguage,
      practiceLanguage: normalizeLanguage(preferences.practiceLanguage || uiLanguage)
    };
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
    if (kind === "ui") {
      preferences.nativeLanguage = normalized;
      preferences.uiLanguage = normalized;
      applyShellLocale(normalized);
    } else {
      preferences.practiceLanguage = normalized;
    }
    writePreferences(preferences);
    syncLanguageControls();
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

  function formatCopy(template, value) {
    return String(template || "").replace("%d", String(value));
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

  function completedDaySet(results) {
    var days = {};
    results.forEach(function (result) {
      var raw = result && (result.completedAt || result.createdAt || result.date);
      var date = raw ? new Date(raw) : null;
      if (date && !Number.isNaN(date.getTime())) {
        days[dayKey(date)] = true;
      }
    });
    return days;
  }

  function calculateStreak(results) {
    var days = completedDaySet(results);
    var today = new Date();
    var cursor = days[dayKey(today)] ? today : addDays(today, -1);
    var streak = 0;
    while (days[dayKey(cursor)]) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }
    return streak;
  }

  function calculateLearningSummary() {
    var results = readResults();
    var xp = results.reduce(function (sum, result) {
      var score = Number(result && result.score) || 0;
      var accuracy = Number(result && result.accuracy) || 0;
      var cpm = Number(result && result.cpm) || 0;
      return sum + Math.max(10, score) + Math.round(accuracy / 2) + Math.round(cpm / 10);
    }, 0);
    var level = Math.max(1, Math.floor(xp / 500) + 1);
    return {
      level: level,
      xp: xp,
      sessions: results.length,
      streak: calculateStreak(results),
      progressPercent: Math.min(100, Math.round(((xp % 500) / 500) * 100))
    };
  }

  function renderLearningSummary(copy) {
    var progressCopy = (copy && copy.progress) || (shellLocales[preferredLanguage()] || shellLocales.ko).progress;
    var summary = calculateLearningSummary();
    setText("[data-progress-level]", formatCopy(progressCopy.levelValue, summary.level));
    setText("[data-progress-streak]", String(summary.streak));
    setText("[data-progress-streak-unit]", progressCopy.streakUnit);
    setText("[data-progress-xp]", String(summary.xp));
    setText("[data-progress-session-count]", String(summary.sessions));
    setText("[data-progress-session-unit]", progressCopy.sessionUnit);
    qsa("[data-progress-fill]").forEach(function (node) {
      node.style.width = summary.progressPercent + "%";
    });
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
      "단문 연습": "sentence",
      "장문 연습": "sentence",
      "타자게임": "game",
      "키보드 보기": "keyboard"
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
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
          // Clearing records should never block the popup interaction.
        }
        renderShellHistory();
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
    list.replaceChildren();
    var results = readResults();
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
        if (button.hasAttribute("data-ui-language-option")) {
          setLanguagePopoverOpen(false);
        }
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
      }
      if (event.key === STORAGE_KEY && !qs(".app-shell")) {
        renderShellHistory();
        renderLearningSummary();
      }
    });
  });
})();
