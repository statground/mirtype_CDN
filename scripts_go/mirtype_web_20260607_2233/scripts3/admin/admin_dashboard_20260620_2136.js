(function () {
  "use strict";

  const DATA_ID = "mirtype-admin-traffic-data";
  const CHART_ID = "mirtype-admin-traffic-chart";
  const TAB_SELECTOR = "[data-admin-chart-tab]";
  const ACTIVE_CLASS = "site-menu-action is-active";
  const INACTIVE_CLASS = "site-menu-action";
  let chart = null;
  let resizeBound = false;
  let resizeObserver = null;

  function parseData() {
    const node = document.getElementById(DATA_ID);
    if (!node) return {};
    try {
      return JSON.parse(node.textContent || "{}");
    } catch (_) {
      return {};
    }
  }

  function rowsFor(data, mode) {
    const key = mode === "yearly" ? "YearlyRows" : mode === "monthly" ? "MonthlyRows" : "DailyRows";
    return Array.isArray(data[key]) ? data[key] : [];
  }

  function numberValue(value) {
    const parsed = Number(value || 0);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("ko-KR").format(numberValue(value));
  }

  function setTabs(activeMode) {
    document.querySelectorAll(TAB_SELECTOR).forEach((button) => {
      const active = button.getAttribute("data-admin-chart-tab") === activeMode;
      button.className = active ? ACTIVE_CLASS : INACTIVE_CLASS;
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
  }

  function chartOption(rows, mode) {
    const categories = rows.map((row) => row.Date || "");
    const visitors = rows.map((row) => numberValue(row.Visitors));
    const pageviews = rows.map((row) => numberValue(row.Pageviews));
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
    const data = parseData();
    const el = document.getElementById(CHART_ID);
    if (!el || !window.echarts) return;
    setTabs(mode);

    const previous = window.echarts.getInstanceByDom(el);
    if (previous) previous.dispose();
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    chart = window.echarts.init(el, null, { renderer: "canvas" });
    chart.setOption(chartOption(rowsFor(data, mode), mode));

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

  function boot(attempt) {
    if (!document.getElementById(CHART_ID)) return;
    if (!window.echarts) {
      if (attempt < 40) window.setTimeout(() => boot(attempt + 1), 75);
      return;
    }
    draw("daily");
    document.querySelectorAll(TAB_SELECTOR).forEach((button) => {
      button.addEventListener("click", () => draw(button.getAttribute("data-admin-chart-tab") || "daily"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => boot(0), { once: true });
  } else {
    boot(0);
  }
})();
