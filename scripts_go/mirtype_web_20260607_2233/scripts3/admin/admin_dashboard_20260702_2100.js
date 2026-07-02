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

  function chartOption(rows, mode) {
    const categories = rows.map((row) => valueFor(row, "Date") || "");
    const visitors = rows.map((row) => numberValue(valueFor(row, "Visitors")));
    const pageviews = rows.map((row) => numberValue(valueFor(row, "Pageviews")));
    const zoomStart = categories.length > 18 ? Math.max(0, 100 - Math.round((18 / categories.length) * 100)) : 0;
    const title = mode === "yearly" ? "연도별 방문 추이" : mode === "monthly" ? "월별 방문 추이" : "일별 방문 추이";

    return {
      title: {
        text: title,
        left: "center",
        top: 0,
        textStyle: { color: "#4B5563", fontSize: 22, fontWeight: 900 }
      },
      color: ["#6366F1", "#B8DE29"],
      legend: { data: ["방문자 수", "페이지 뷰"], top: 36, textStyle: { color: "#4B5563", fontWeight: 700 } },
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        valueFormatter: formatNumber
      },
      toolbox: {
        right: 10,
        top: 20,
        feature: { dataZoom: { yAxisIndex: "none" }, restore: {}, saveAsImage: {} }
      },
      grid: { left: 60, right: 64, top: 88, bottom: 72, containLabel: true },
      xAxis: { type: "category", data: categories, axisLabel: { color: "#6B7280", interval: "auto" } },
      yAxis: [
        { type: "value", name: "방문자 수", axisLabel: { color: "#6B7280", formatter: formatNumber } },
        { type: "value", name: "페이지 뷰", axisLabel: { color: "#6B7280", formatter: formatNumber } }
      ],
      dataZoom: [
        { type: "inside", xAxisIndex: 0, start: zoomStart, end: 100, zoomOnMouseWheel: true, moveOnMouseMove: true },
        { type: "slider", xAxisIndex: 0, start: zoomStart, end: 100, height: 28, bottom: 18 }
      ],
      series: [
        { name: "방문자 수", type: "bar", yAxisIndex: 0, data: visitors, barMaxWidth: 28 },
        { name: "페이지 뷰", type: "bar", yAxisIndex: 1, data: pageviews, barMaxWidth: 28 }
      ]
    };
  }

  function draw(mode) {
    const el = document.getElementById(CHART_ID);
    if (!el || !window.echarts || !isReady(dashboardData)) return;
    activeMode = mode;
    setTabs(mode);

    const previous = window.echarts.getInstanceByDom(el);
    if (previous) previous.dispose();
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    chart = window.echarts.init(el, null, { renderer: "canvas" });
    chart.setOption(chartOption(rowsFor(dashboardData, mode), mode));

    requestAnimationFrame(() => chart.resize());
    if (!resizeBound) {
      window.addEventListener("resize", () => {
        if (chart) chart.resize();
      }, { passive: true });
      resizeBound = true;
    }
    if ((el.offsetWidth === 0 || el.offsetHeight === 0) && "ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        if (el.offsetWidth > 0 && el.offsetHeight > 0) {
          resizeObserver.disconnect();
          resizeObserver = null;
          chart.resize();
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
    if (!window.echarts) {
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
