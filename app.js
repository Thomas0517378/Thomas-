(() => {
  const years = ["第1年", "第2年", "第3年", "第4年", "第5年"];
  const data = {
    revenue: [6.8, 22, 53, 100, 168],
    product: [5.6, 15.5, 31.8, 56, 88],
    subscription: [.8, 3, 8, 18, 37],
    b2b: [.2, 2, 8.5, 20, 36],
    other: [.2, 1.5, 4.7, 6, 7],
    cost: [2.72, 8.14, 18.55, 33, 53.76],
    grossProfit: [4.08, 13.86, 34.45, 67, 114.24],
    expenses: [11.48, 19.26, 29.75, 46.6, 68.74],
    team: [6, 9, 14, 18, 20],
    marketing: [1.6, 2.6, 4.5, 7, 10],
    operations: [1.8, 3.5, 5.2, 7.8, 12],
    impact: [1.2, 2.2, 3.5, 5.4, 7],
    otherExpense: [.88, 1.96, 2.55, 8.4, 19.74],
    netProfit: [-7.4, -5.4, 4.7, 20.4, 45.5],
    cashStart: [7, 5.6, 3.7, 6.4, 23.8],
    operatingCash: [-.2, -5.9, 4.2, 19.2, 42.9],
    investingCash: [-1.2, -1, -1.5, -1.8, -2.4],
    financingCash: [0, 5, 0, 0, 0],
    cashEnd: [5.6, 3.7, 6.4, 23.8, 64.3]
  };

  const fmt = (value, digits = 1) => `${value < 0 ? "−" : ""}${Math.abs(value).toFixed(digits)}`;
  const pct = (value, digits = 1) => `${(value * 100).toFixed(digits)}%`;
  const row = (label, values, options = {}) => {
    const cells = values.map(value => `<td class="${value < 0 ? "negative" : ""}">${options.percent ? pct(value) : fmt(value)}${options.unit ? `<small>${options.unit}</small>` : ""}</td>`).join("");
    return `<tr class="${options.total ? "total" : ""}"><td>${label}</td>${cells}</tr>`;
  };
  const setHTML = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };

  setHTML("profit-table", [
    row("营业收入", data.revenue, { total: true }),
    row("减：营业成本", data.cost),
    row("毛利润", data.grossProfit, { total: true }),
    row("减：期间费用", data.expenses),
    row("净利润", data.netProfit, { total: true }),
    row("净利率", data.netProfit.map((v, i) => v / data.revenue[i]), { percent: true })
  ].join(""));

  setHTML("revenue-table", [
    row("产品销售（非遗材料包）", data.product),
    row("订阅服务", data.subscription),
    row("B端机构服务", data.b2b),
    row("其他收入", data.other),
    row("收入合计", data.revenue, { total: true })
  ].join(""));

  setHTML("cost-table", [
    row("原材料与加工", data.cost.map(v => v * .62)),
    row("包装与物流", data.cost.map(v => v * .18)),
    row("供应链合作费用", data.cost.map(v => v * .2)),
    row("营业成本合计", data.cost, { total: true })
  ].join(""));

  setHTML("expense-table", [
    row("团队人力成本", data.team),
    row("市场与获客", data.marketing),
    row("平台与运营", data.operations),
    row("公益与项目投入", data.impact),
    row("管理、税费及其他", data.otherExpense),
    row("期间费用合计", data.expenses, { total: true })
  ].join(""));

  setHTML("cash-table", [
    row("期初现金", data.cashStart),
    row("经营活动现金流", data.operatingCash),
    row("投资活动现金流", data.investingCash),
    row("筹资活动现金流", data.financingCash),
    row("期末现金", data.cashEnd, { total: true })
  ].join(""));

  const svg = (width, height, body) => `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="五年财务趋势图">${body}</svg>`;
  const grid = (width, height, left = 34, right = 12, top = 16, bottom = 30, max = 180, min = 0) => {
    let out = "";
    [0, .25, .5, .75, 1].forEach((ratio) => {
      const y = top + (height - top - bottom) * ratio;
      const value = max - (max - min) * ratio;
      out += `<line x1="${left}" x2="${width - right}" y1="${y}" y2="${y}" stroke="#e8ede8" stroke-width="1"/>`;
      out += `<text x="${left - 8}" y="${y + 3}" fill="#8a948c" font-size="9" text-anchor="end">${value.toFixed(0)}</text>`;
    });
    return out;
  };
  const points = (values, width, height, max, left = 34, right = 12, top = 16, bottom = 30, min = 0) => {
    const plotW = width - left - right;
    const plotH = height - top - bottom;
    const range = max - min;
    return values.map((v, i) => {
      const clipped = Math.max(min, Math.min(max, v));
      return `${left + plotW * i / (values.length - 1)},${top + plotH * (1 - (clipped - min) / range)}`;
    }).join(" ");
  };
  const labels = (width, height, left = 34, right = 12, bottom = 30) => years.map((year, i) => `<text x="${left + (width - left - right) * i / 4}" y="${height - 8}" fill="#8a948c" font-size="10" text-anchor="middle">${year.replace("第", "").replace("年", "年")}</text>`).join("");

  function drawOverviewChart() {
    const w = 720, h = 245, max = 180;
    const min = -10;
    const revenuePoints = points(data.revenue, w, h, max, 34, 12, 16, 30, min);
    const profitPoints = points(data.netProfit, w, h, max, 34, 12, 16, 30, min);
    const yZero = 16 + (h - 16 - 30) * (1 - (0 - min) / (max - min));
    const circles = (values, color) => values.map((v, i) => {
      const [x, y] = points(values, w, h, max, 34, 12, 16, 30, min).split(" ")[i].split(",");
      return `<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="${color}" stroke-width="2"><title>${years[i]}：${fmt(v)}万元</title></circle>`;
    }).join("");
    setHTML("overview-chart", svg(w, h, `${grid(w,h,34,12,16,30,max,min)}<line x1="34" x2="708" y1="${yZero}" y2="${yZero}" stroke="#cfd9cf"/><polyline points="${revenuePoints}" fill="none" stroke="#4e9b72" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${profitPoints}" fill="none" stroke="#735b91" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="5 5"/>${circles(data.revenue,"#4e9b72")}${circles(data.netProfit,"#735b91")}${labels(w,h)}`));
  }

  function drawCashChart() {
    const w = 720, h = 245, max = 70, left = 34, right = 12, top = 16, bottom = 30;
    const pts = points(data.cashEnd, w, h, max, left, right, top, bottom);
    const area = `${left},${h-bottom} ${pts} ${w-right},${h-bottom}`;
    const dots = data.cashEnd.map((v, i) => {
      const [x, y] = pts.split(" ")[i].split(",");
      return `<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="#4e9b72" stroke-width="2"><title>${years[i]}：${fmt(v)}万元</title></circle>`;
    }).join("");
    setHTML("cash-chart", svg(w,h,`${grid(w,h,left,right,top,bottom,max)}<polygon points="${area}" fill="#dcefe1" opacity=".72"/><polyline points="${pts}" fill="none" stroke="#4e9b72" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>${dots}${labels(w,h,left,right,bottom)}`));
  }

  function drawRevenueChart() {
    const max = 180;
    const series = [["product", data.product], ["subscribe", data.subscription], ["b2b", data.b2b], ["other", data.other]];
    const blocks = data.revenue.map((total, i) => {
      let html = `<div class="bar-group" title="${years[i]}：${fmt(total)}万元">`;
      series.forEach(([kind, values]) => { html += `<div class="bar ${kind}" style="height:${Math.max(2, values[i] / max * 220)}px"></div>`; });
      return `${html}<span class="bar-label">${years[i]}</span></div>`;
    }).join("");
    setHTML("revenue-chart", blocks);
  }

  function selectPage(id) {
    document.querySelectorAll(".section").forEach(section => section.classList.toggle("active", section.id === id));
    document.querySelectorAll(".nav").forEach(nav => nav.classList.toggle("active", nav.dataset.go === id));
    const titles = { overview: "项目概览", finance: "财务总览", revenue: "收入结构", cost: "成本与费用", cash: "利润与现金", risk: "风险防范" };
    document.getElementById("title").textContent = titles[id] || titles.overview;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-go], [data-jump]").forEach(el => el.addEventListener("click", () => selectPage(el.dataset.go || el.dataset.jump)));
  const modal = document.getElementById("modal");
  document.getElementById("method").addEventListener("click", () => modal.classList.add("open"));
  document.getElementById("close").addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", event => { if (event.target === modal) modal.classList.remove("open"); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") modal.classList.remove("open"); });

  drawOverviewChart();
  drawCashChart();
  drawRevenueChart();
})();
