(function () {
  "use strict";

  const DATA_ID = "mirtype-admin-traffic-data";
  const CHART_ID = "mirtype-admin-traffic-chart";
  const ROOT_SELECTOR = "[data-admin-dashboard-root]";
  const STATUS_SELECTOR = "[data-admin-dashboard-status]";
  const TAB_SELECTOR = "[data-admin-chart-tab]";
  const ACTIVE_CLASS = "site-menu-action is-active";
  const INACTIVE_CLASS = "site-menu-action";
  const METRIC_KEYS = [
    "PageviewToday",
    "PageviewYesterday",
    "PageviewMonth",
    "PageviewYear",
    "PageviewTotal",
    "VisitorToday",
    "VisitorYesterday",
    "VisitorMonth",
    "VisitorYear",
    "VisitorTotal"
  ];
  let dashboardData = {};
  let activeMode = "daily";
  let chart = null;
  let domainNavigator = null;
  let resizeBound = false;
  let resizeObserver = null;

  function lowerCamel(key) {
    return key ? key.charAt(0).toLowerCase() + key.slice(1) : key;
  }

  function valueFor(object, key) {
    if (!object || typeof object !== "object") return undefined;
    if (Object.prototype.hasOwnProperty.call(object, key)) return object[key];
    return object[lowerCamel(key)];
  }

  function parseSeedData() {
    const node = document.getElementById(DATA_ID);
    if (!node) return {};
    try {
      return normalizeDashboard(JSON.parse(node.textContent || "{}"));
    } catch (_) {
      return {};
    }
  }

  function normalizeDashboard(payload) {
    if (!payload || typeof payload !== "object") return {};
    const data = payload.dashboard || payload.Admin || payload;
    return data && typeof data === "object" ? data : {};
  }

  function isReady(data) {
    return Boolean(valueFor(data, "Ready"));
  }

  function rowsFor(data, mode) {
    const key = mode === "yearly" ? "YearlyRows" : mode === "monthly" ? "MonthlyRows" : "DailyRows";
    const rows = valueFor(data, key);
    return Array.isArray(rows) ? rows : [];
  }

  function numberValue(value) {
    const parsed = Number(value || 0);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("ko-KR").format(numberValue(value));
  }

  function setStatus(kind, message) {
    const status = document.querySelector(STATUS_SELECTOR);
    if (!status) return;
    if (kind === "hidden") {
      status.hidden = true;
      return;
    }
    status.hidden = false;
    status.textContent = message;
    status.className = kind === "error"
      ? "mt-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-black text-amber-700"
      : "mt-5 rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-black text-app-primary";
  }

  function setRootState(state) {
    const root = document.querySelector(ROOT_SELECTOR);
    if (root) root.setAttribute("data-admin-dashboard-state", state);
  }

  function updateMetrics(data) {
    METRIC_KEYS.forEach((key) => {
      document.querySelectorAll(`[data-admin-metric="${key}"]`).forEach((node) => {
        node.textContent = formatNumber(valueFor(data, key));
      });
    });
  }

  function setTabs(mode) {
    document.querySelectorAll(TAB_SELECTOR).forEach((button) => {
      const active = button.getAttribute("data-admin-chart-tab") === mode;
      button.className = active ? ACTIVE_CLASS : INACTIVE_CLASS;
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function chartSpec(rows, mode) {
    const title = mode === "yearly" ? "연도별 방문 추이" : mode === "monthly" ? "월별 방문 추이" : "일별 방문 추이";
    const data = rows.map((row) => ({
      label: String(valueFor(row, "Date") || ""),
      visitors: numberValue(valueFor(row, "Visitors")),
      pageviews: numberValue(valueFor(row, "Pageviews"))
    }));
    const numberFormat = { type: "number", useGrouping: true };
    const valueScale = data.length ? { zero: true, nice: true } : { domain: [0, 1], zero: true, nice: true };
    return {
      width: "container",
      height: "container",
      data,
      title: { text: title, align: "center" },
      padding: { left: 91, right: 114, top: 6, bottom: 92 },
      locale: "ko-KR",
      theme: {
        colors: { text: "#4B5563", mutedText: "#6B7280", palette: ["#6366F1", "#B8DE29"] },
        typography: { titleSize: 22, titleWeight: 900, legendLabelWeight: 700 },
        legend: { surfaceOpacity: 0, borderWidth: 0 }
      },
      axes: {
        x: { title: false, grid: false, labels: { color: "#6B7280" } },
        y: { title: "방문자 수", position: "left", format: numberFormat, grid: true },
        y2: { title: { text: "페이지 뷰", padding: 72 }, position: "right", format: numberFormat, grid: false }
      },
      layers: [
        {
          id: "visitors",
          mark: { type: "bar", position: "group", maxThickness: 28, cornerRadius: 0, fill: "#6366F1" },
          x: { field: "label", type: "ordinal" },
          y: { field: "visitors", type: "quantitative", axisId: "y", title: "방문자 수", scale: valueScale }
        },
        {
          id: "pageviews",
          mark: { type: "bar", position: "group", maxThickness: 28, cornerRadius: 0, fill: "#B8DE29" },
          x: { field: "label", type: "ordinal" },
          y: { field: "pageviews", type: "quantitative", axisId: "y2", title: "페이지 뷰", scale: valueScale }
        }
      ],
      legend: {
        mode: "layers", position: "top", align: "center", orientation: "horizontal", interactive: true,
        items: [
          { id: "visitors", label: "방문자 수", color: "#6366F1", layerId: "visitors" },
          { id: "pageviews", label: "페이지 뷰", color: "#B8DE29", layerId: "pageviews" }
        ],
        labels: { show: "표시", hide: "숨기기" }
      },
      interaction: {
        hover: true,
        tooltip: {
          trigger: "axis", axis: "x", shared: true, titleField: "label", pointer: "shadow",
          fields: [
            { field: "visitors", label: "방문자 수", format: "number" },
            { field: "pageviews", label: "페이지 뷰", format: "number" }
          ]
        },
        domainNavigation: { axes: ["x"], wheel: "always", drag: true, keyboard: true },
        controls: false
      },
      accessibility: {
        label: title,
        description: "방문자 수는 왼쪽 축, 페이지 뷰는 오른쪽 축을 사용합니다.",
        table: true,
        navigation: true
      }
    };
  }

  function destroyChart() {
    if (domainNavigator) {
      domainNavigator.destroy();
      domainNavigator = null;
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (chart) {
      chart.destroy();
      chart = null;
    }
  }

  function draw(mode) {
    const el = document.getElementById(CHART_ID);
    const graflume = window.Graflume;
    if (!el || !graflume || !isReady(dashboardData)) return;
    activeMode = mode;
    setTabs(mode);
    destroyChart();

    const rows = rowsFor(dashboardData, mode);
    const zoomStart = rows.length > 18 ? Math.max(0, 100 - Math.round((18 / rows.length) * 100)) : 0;
    // Preserve the inclusive first category of the original percentage window.
    const initialStart = rows.length ? Math.round((zoomStart / 100) * (rows.length - 1)) / rows.length : 0;
    const currentChart = graflume.create(el, chartSpec(rows, mode), { autoResize: true, adaptive: false });
    chart = currentChart;
    domainNavigator = graflume.attachDomainNavigator(currentChart, {
      target: el,
      axis: "x",
      initialWindow: { start: initialStart, end: 1 },
      slider: true,
      controls: { boxZoom: true, back: true, reset: true, export: true },
      labels: {
        boxZoom: "영역 확대", back: "확대 이전", reset: "처음으로", exportPng: "이미지 저장",
        rangeStart: "시작 범위", rangeEnd: "끝 범위", range: "표시 범위", controls: "차트 도구"
      },
      filename: (mode === "yearly" ? "연도별 방문 추이" : mode === "monthly" ? "월별 방문 추이" : "일별 방문 추이") + ".png"
    });

    requestAnimationFrame(() => {
      if (chart === currentChart) currentChart.resize();
    });
    if (!resizeBound) {
      window.addEventListener("resize", () => {
        if (chart) chart.resize();
      }, { passive: true });
      window.addEventListener("pagehide", (event) => {
        if (!event.persisted) destroyChart();
      });
      resizeBound = true;
    }
    if ((el.offsetWidth === 0 || el.offsetHeight === 0) && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        if (el.offsetWidth > 0 && el.offsetHeight > 0) {
          resizeObserver.disconnect();
          resizeObserver = null;
          if (chart === currentChart) currentChart.resize();
        }
      });
      resizeObserver.observe(el);
    }
  }

  function dashboardURL() {
    const root = document.querySelector(ROOT_SELECTOR);
    return root && root.getAttribute("data-admin-dashboard-url") ? root.getAttribute("data-admin-dashboard-url") : "/admin/api/dashboard/";
  }

  async function fetchDashboard() {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(dashboardURL(), {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
      const payload = await response.json().catch(() => ({}));
      const next = normalizeDashboard(payload);
      if (!response.ok || !payload.ok || !isReady(next)) {
        throw new Error("dashboard_unavailable");
      }
      dashboardData = next;
      updateMetrics(dashboardData);
      setRootState("ready");
      setStatus("hidden", "");
      draw(activeMode);
    } catch (_) {
      setRootState("error");
      setStatus("error", "집계 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      if (isReady(dashboardData)) {
        updateMetrics(dashboardData);
        draw(activeMode);
      }
    } finally {
      window.clearTimeout(timer);
    }
  }

  function boot(attempt) {
    if (!document.getElementById(CHART_ID)) return;
    if (!window.Graflume || !window.Graflume.attachDomainNavigator) {
      if (attempt < 40) window.setTimeout(() => boot(attempt + 1), 75);
      return;
    }
    dashboardData = parseSeedData();
    setTabs(activeMode);
    if (isReady(dashboardData)) {
      updateMetrics(dashboardData);
      setStatus("hidden", "");
      draw(activeMode);
    }
    document.querySelectorAll(TAB_SELECTOR).forEach((button) => {
      button.addEventListener("click", () => draw(button.getAttribute("data-admin-chart-tab") || "daily"));
    });
    fetchDashboard();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => boot(0), { once: true });
  } else {
    boot(0);
  }
})();
