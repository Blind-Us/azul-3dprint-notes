/* =========================================================
   A竹 3D列印講義庫｜共用互動
   - 首頁：依 lessons.js 產生卡片與階段篩選
   - 講義頁：標籤、目錄、閱讀進度、上一篇／下一篇、已讀標記
   - 元件：依 data-widget 啟用（新增元件請登記在 WIDGETS 與 CLAUDE.md 第 10 節）
   ========================================================= */
(function () {
  "use strict";

  var LESSONS = window.AZUL_LESSONS || [];
  var STAGES = window.AZUL_STAGES || [];

  /* ---------- 小工具 ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "className") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    if (text != null) node.textContent = text;
    return node;
  }
  var store = {
    get: function (key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
    set: function (key, value) { try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; } },
    remove: function (key) { try { window.localStorage.removeItem(key); } catch (e) { /* 儲存受限時忽略 */ } }
  };
  function published() { return LESSONS.filter(function (l) { return l.status === "published"; }); }
  function tagsFor(lesson, opts) {
    var wrap = el("div", { className: "meta" });
    wrap.appendChild(el("span", { className: "tag stage" }, lesson.stage));
    wrap.appendChild(el("span", { className: "tag" }, lesson.level));
    wrap.appendChild(el("span", { className: "tag" }, "約 " + lesson.minutes + " 分鐘"));
    if (lesson.status === "planned") wrap.appendChild(el("span", { className: "tag planned" }, "規劃中"));
    if (opts && opts.updated) wrap.appendChild(el("span", { className: "tag" }, "更新 " + lesson.updated));
    return wrap;
  }

  /* ---------- 首頁 ---------- */
  function renderHome() {
    var grid = $("#lesson-grid");
    if (!grid) return;
    var filter = $("#stage-filter");
    var count = $("#lesson-count");
    var current = "全部";

    if (count) {
      var p = published().length;
      count.textContent = "已發布 " + p + " 篇・規劃中 " + (LESSONS.length - p) + " 篇";
    }

    function draw() {
      grid.textContent = "";
      LESSONS.filter(function (l) { return current === "全部" || l.stage === current; })
        .forEach(function (lesson) {
          var planned = lesson.status !== "published";
          var card = el("article", { className: "lesson-card" + (planned ? " is-planned" : "") });
          card.appendChild(el("span", { className: "no" }, "講義 " + lesson.no));
          var h3 = el("h3");
          if (planned) h3.textContent = lesson.title;
          else h3.appendChild(el("a", { href: "lessons/" + lesson.slug + "/" }, lesson.title));
          card.appendChild(h3);
          card.appendChild(el("p", null, lesson.summary));
          card.appendChild(tagsFor(lesson));
          if (!planned && store.get("azul:read:" + lesson.slug)) card.appendChild(el("span", { className: "read-mark" }, "已讀"));
          grid.appendChild(card);
        });
    }

    if (filter) {
      var used = STAGES.filter(function (s) { return LESSONS.some(function (l) { return l.stage === s; }); });
      ["全部"].concat(used).forEach(function (stage) {
        var btn = el("button", { type: "button", className: "chip-btn", "aria-pressed": String(stage === current) }, stage);
        btn.addEventListener("click", function () {
          current = stage;
          $$(".chip-btn", filter).forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
          draw();
        });
        filter.appendChild(btn);
      });
    }
    draw();
  }

  /* ---------- 講義頁 ---------- */
  function renderLesson() {
    var slug = document.body.getAttribute("data-lesson");
    if (!slug) return;
    var lesson = LESSONS.filter(function (l) { return l.slug === slug; })[0];
    if (!lesson) { console.warn("[講義庫] lessons.js 找不到 slug：" + slug); return; }

    var noEl = $("[data-lesson-no]");
    if (noEl) noEl.textContent = "講義 " + lesson.no + "｜" + lesson.stage;
    var metaEl = $("[data-lesson-meta]");
    if (metaEl) metaEl.appendChild(tagsFor(lesson, { updated: true }));

    // 目錄
    var toc = $("[data-toc]");
    var sections = $$(".lesson-body > section[id]");
    if (toc && sections.length) {
      toc.appendChild(el("p", null, "本篇目錄"));
      var ol = el("ol");
      sections.forEach(function (sec) {
        var h2 = $("h2", sec);
        if (!h2) return;
        var li = el("li");
        li.appendChild(el("a", { href: "#" + sec.id }, h2.textContent));
        ol.appendChild(li);
      });
      toc.appendChild(ol);
      if ("IntersectionObserver" in window) {
        var links = $$("a", toc);
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id); });
          });
        }, { rootMargin: "-20% 0px -70% 0px" });
        sections.forEach(function (s) { io.observe(s); });
      }
    }

    // 上一篇／下一篇（只連到已發布的講義）
    var pager = $("[data-pager]");
    if (pager) {
      var list = published();
      var i = list.map(function (l) { return l.slug; }).indexOf(slug);
      var prev = list[i - 1], next = list[i + 1];
      if (prev) {
        var a = el("a", { href: "../" + prev.slug + "/", className: "prev", rel: "prev" });
        a.appendChild(el("small", null, "← 上一篇"));
        a.appendChild(document.createTextNode(prev.no + " " + prev.title));
        pager.appendChild(a);
      }
      if (next) {
        var b = el("a", { href: "../" + next.slug + "/", className: "next", rel: "next" });
        b.appendChild(el("small", null, "下一篇 →"));
        b.appendChild(document.createTextNode(next.no + " " + next.title));
        pager.appendChild(b);
      } else {
        var home = el("a", { href: "../../", className: "next" });
        home.appendChild(el("small", null, "已經是最新一篇"));
        home.appendChild(document.createTextNode("回講義庫看規劃中的主題"));
        pager.appendChild(home);
      }
    }

    // 閱讀進度條
    var bar = $(".progress-bar");
    if (bar) {
      var onScroll = function () {
        var h = document.documentElement;
        var max = h.scrollHeight - h.clientHeight;
        bar.style.width = (max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0) + "%";
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    // 讀到「來源」段落就標記已讀
    var sources = $("#sources");
    if (sources && "IntersectionObserver" in window) {
      var readIo = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) {
          store.set("azul:read:" + slug, "1");
          readIo.disconnect();
        }
      });
      readIo.observe(sources);
    }
  }

  /* ---------- 元件 ---------- */
  var WIDGETS = {
    /* 檢查清單：勾選狀態存在 localStorage */
    checklist: function (root) {
      var key = "azul:check:" + (root.getAttribute("data-store") || "default");
      var boxes = $$("input[type=checkbox]", root);
      var saved = [];
      try { saved = JSON.parse(store.get(key) || "[]"); } catch (e) { saved = []; }
      boxes.forEach(function (b, i) { b.checked = saved.indexOf(i) !== -1; });

      var status = el("div", { className: "checklist-status" });
      var text = el("span", { "aria-live": "polite" });
      var reset = el("button", { type: "button", className: "text-btn" }, "全部取消勾選");
      status.appendChild(text);
      status.appendChild(reset);
      root.insertAdjacentElement("afterend", status);

      function update() {
        var done = [];
        boxes.forEach(function (b, i) { if (b.checked) done.push(i); });
        text.textContent = done.length === boxes.length ? "全部完成，可以開始列印了！" : "已完成 " + done.length + " / " + boxes.length;
        if (!store.set(key, JSON.stringify(done))) text.textContent += "（瀏覽器未開放儲存，重新整理後不會保留）";
      }
      boxes.forEach(function (b) { b.addEventListener("change", update); });
      reset.addEventListener("click", function () { boxes.forEach(function (b) { b.checked = false; }); update(); });
      update();
    },

    /* 選擇題：正確選項有 data-correct */
    quiz: function (root) {
      var buttons = $$(".quiz-options button", root);
      var explain = $(".quiz-explain", root);
      if (explain) explain.setAttribute("aria-live", "polite");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var right = btn.hasAttribute("data-correct");
          buttons.forEach(function (b) {
            b.disabled = true;
            if (b.hasAttribute("data-correct")) b.classList.add("is-correct");
          });
          if (!right) btn.classList.add("is-wrong");
          if (explain) {
            explain.hidden = false;
            explain.insertBefore(el("strong", null, right ? "答對了！" : "再想想："), explain.firstChild);
          }
        });
      });
    },

    /* 情境選擇器：按鈕 data-pick ↔ 面板 data-panel，預設選第一個 */
    picker: function (root) {
      var buttons = $$("[data-pick]", root);
      var panels = $$("[data-panel]", root);
      function select(id) {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-pick") === id)); });
        panels.forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== id; });
      }
      buttons.forEach(function (b) {
        b.classList.add("chip-btn");
        b.addEventListener("click", function () { select(b.getAttribute("data-pick")); });
      });
      if (buttons[0]) select(buttons[0].getAttribute("data-pick"));
    },

    /* 懸空模擬：角度從垂直方向量起（經驗起點） */
    "overhang-sim": function (root) {
      var NS = "http://www.w3.org/2000/svg";
      var field = el("div", { className: "field" });
      var id = "overhang-" + Math.random().toString(36).slice(2, 7);
      var label = el("label", { for: id }, "懸空角度（從垂直方向量起）：");
      var value = el("span", null, "30°");
      label.appendChild(value);
      var input = el("input", { type: "range", id: id, min: "0", max: "90", step: "5", value: "30" });
      field.appendChild(label);
      field.appendChild(input);

      var svg = document.createElementNS(NS, "svg");
      svg.setAttribute("viewBox", "0 0 360 150");
      svg.setAttribute("class", "diagram sim");
      svg.setAttribute("role", "img");
      var title = document.createElementNS(NS, "title");
      svg.appendChild(title);
      var result = el("div", { className: "result", "aria-live": "polite" });

      root.appendChild(field);
      root.appendChild(svg);
      root.appendChild(result);

      function draw() {
        var a = Number(input.value);
        value.textContent = a + "°";
        while (svg.childNodes.length > 1) svg.removeChild(svg.lastChild);
        var bed = document.createElementNS(NS, "rect");
        bed.setAttribute("x", "10"); bed.setAttribute("y", "132"); bed.setAttribute("width", "340"); bed.setAttribute("height", "8");
        bed.setAttribute("class", "sim-bed");
        svg.appendChild(bed);
        var layers = 9, lh = 13, w = 70, x0 = 40;
        var step = Math.min(Math.tan(a * Math.PI / 180) * lh, 30);
        for (var i = 0; i < layers; i++) {
          var r = document.createElementNS(NS, "rect");
          r.setAttribute("x", String(x0 + step * i));
          r.setAttribute("y", String(132 - lh * (i + 1)));
          r.setAttribute("width", String(w));
          r.setAttribute("height", String(lh - 2));
          r.setAttribute("rx", "4");
          r.setAttribute("class", "sim-layer");
          svg.appendChild(r);
        }
        var ref = document.createElementNS(NS, "line");
        ref.setAttribute("x1", String(x0)); ref.setAttribute("y1", "132");
        ref.setAttribute("x2", String(x0)); ref.setAttribute("y2", "10");
        ref.setAttribute("class", "sim-ref");
        svg.appendChild(ref);

        var level, msg;
        if (a <= 45) { level = ""; msg = "通常可以直接列印。每一層都有一半以上踩在下一層上。"; }
        else if (a <= 60) { level = "is-warn"; msg = "邊緣可能下垂或變粗糙。不在意外觀可以試印，在意就加支撐或改倒角。"; }
        else if (a < 90) { level = "is-bad"; msg = "建議加支撐、換列印方向，或把造型改成 45° 倒角。"; }
        else { level = "is-bad"; msg = "水平懸空：兩端都有支點時可以「架橋」（bridge），只有一端時一定要支撐。"; }
        result.className = "result " + level;
        svg.setAttribute("class", "diagram sim " + level);
        result.textContent = "";
        result.appendChild(el("strong", null, a + "°　"));
        result.appendChild(document.createTextNode(msg));
        title.textContent = "懸空 " + a + " 度時的層疊示意";
      }
      input.addEventListener("input", draw);
      draw();
      root.appendChild(el("p", { className: "note" }, "45° 是社群常用的經驗起點，實際極限會因材料、冷卻和速度而不同，請以試印為準。"));
    },

    /* 配合間隙計算：孔 = 軸 + 2 × 單邊間隙（經驗起點） */
    "fit-calc": function (root) {
      var idD = "fit-d-" + Math.random().toString(36).slice(2, 7);
      var idC = "fit-c-" + Math.random().toString(36).slice(2, 7);
      var f1 = el("div", { className: "field" });
      f1.appendChild(el("label", { for: idD }, "軸（或插銷）直徑 mm"));
      var d = el("input", { type: "number", id: idD, min: "1", max: "200", step: "0.1", value: "8", inputmode: "decimal" });
      f1.appendChild(d);
      var f2 = el("div", { className: "field" });
      f2.appendChild(el("label", { for: idC }, "單邊間隙（經驗起點）"));
      var c = el("select", { id: idC });
      [["0.1", "0.1 mm：緊配，可能要壓入或打磨"], ["0.2", "0.2 mm：一般滑配，建議從這裡開始"], ["0.3", "0.3 mm：鬆配，好組裝、會晃"]]
        .forEach(function (o) { var opt = el("option", { value: o[0] }, o[1]); if (o[0] === "0.2") opt.selected = true; c.appendChild(opt); });
      f2.appendChild(c);
      var result = el("div", { className: "result", "aria-live": "polite" });
      root.appendChild(f1); root.appendChild(f2); root.appendChild(result);

      function calc() {
        var dv = parseFloat(d.value), cv = parseFloat(c.value);
        result.textContent = "";
        if (!(dv > 0)) { result.className = "result is-warn"; result.textContent = "請輸入大於 0 的直徑。"; return; }
        result.className = "result";
        var hole = (dv + 2 * cv).toFixed(2).replace(/\.?0+$/, "");
        result.appendChild(document.createTextNode("孔的設計直徑："));
        result.appendChild(el("strong", null, hole + " mm"));
        result.appendChild(el("br"));
        result.appendChild(document.createTextNode("算法：" + dv + " + 2 × " + cv + "。如果孔的尺寸固定，就把軸畫成 " + (dv - 2 * cv).toFixed(2).replace(/\.?0+$/, "") + " mm。"));
      }
      d.addEventListener("input", calc);
      c.addEventListener("change", calc);
      calc();
      root.appendChild(el("p", { className: "note" }, "FDM 印出來的孔常常比設計小。正式零件前，先用同一台機器、同一種耗材印一個間隙測試件。"));
    },

    /* 層高比較：模型高度 → 約略層數 */
    "layer-calc": function (root) {
      var id = "layer-h-" + Math.random().toString(36).slice(2, 7);
      var f = el("div", { className: "field" });
      f.appendChild(el("label", { for: id }, "模型高度 mm"));
      var h = el("input", { type: "number", id: id, min: "1", max: "256", step: "1", value: "30", inputmode: "decimal" });
      f.appendChild(h);
      var wrap = el("div", { className: "table-wrap" });
      var table = el("table");
      var thead = el("thead");
      var tr = el("tr");
      ["官方預設", "層高", "約略層數", "相對 0.20"].forEach(function (t) { tr.appendChild(el("th", null, t)); });
      thead.appendChild(tr);
      var tbody = el("tbody", { "aria-live": "polite" });
      table.appendChild(thead); table.appendChild(tbody); wrap.appendChild(table);
      root.appendChild(f); root.appendChild(wrap);
      var presets = [["0.12mm Fine", 0.12], ["0.20mm Standard", 0.20], ["0.28mm Extra Draft", 0.28]];

      function calc() {
        var hv = parseFloat(h.value);
        tbody.textContent = "";
        if (!(hv > 0)) { var r0 = el("tr"); var td0 = el("td", { colspan: "4" }, "請輸入大於 0 的高度。"); r0.appendChild(td0); tbody.appendChild(r0); return; }
        var base = Math.ceil(hv / 0.2);
        presets.forEach(function (p) {
          var n = Math.ceil(hv / p[1] - 1e-9);
          var row = el("tr");
          row.appendChild(el("td", null, p[0]));
          row.appendChild(el("td", null, p[1].toFixed(2) + " mm"));
          row.appendChild(el("td", null, n + " 層"));
          row.appendChild(el("td", null, (n / base).toFixed(2) + " 倍"));
          tbody.appendChild(row);
        });
      }
      h.addEventListener("input", calc);
      calc();
      root.appendChild(el("p", { className: "note" }, "層數只是粗估（沒有計入第一層高度的差異）。列印時間大致跟著層數變，實際時間以切片軟體的預估為準。"));
    }
  };

  function initWidgets() {
    $$("[data-widget]").forEach(function (root) {
      var name = root.getAttribute("data-widget");
      if (WIDGETS[name]) WIDGETS[name](root);
      else console.warn("[講義庫] 未知的元件：" + name);
    });
  }

  function initCommon() {
    $$("[data-year]").forEach(function (n) { n.textContent = String(new Date().getFullYear()); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCommon();
    renderHome();
    renderLesson();
    initWidgets();
  });
})();
