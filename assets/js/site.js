/* =========================================================
   A竹 3D列印入門｜共用互動
   - 首頁：依 lessons.js 產生講義卡片
   - 講義頁：編號、上一頁／下一頁、已讀標記
   - 元件：依 data-widget 啟用（新增元件請登記在 WIDGETS 與 CLAUDE.md 第 10 節）
   ========================================================= */
(function () {
  "use strict";

  var LESSONS = window.AZUL_LESSONS || [];
  var NS = "http://www.w3.org/2000/svg";
  var REDUCE = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

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
  function svgEl(tag, attrs, parent) {
    var node = document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (parent) parent.appendChild(node);
    return node;
  }
  var store = {
    get: function (key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
    set: function (key, value) { try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; } }
  };
  function published() { return LESSONS.filter(function (l) { return l.status === "published"; }); }
  function lerp(a, b, p) { return a + (b - a) * p; }
  function stepsOf(root) {
    var list = document.getElementById(root.getAttribute("data-steps") || "");
    return list ? $$("li", list) : [];
  }
  // 簡單補間動畫：同一個元件一次只跑一段；減少動態時直接跳到結果
  function makeTween() {
    var raf = 0;
    return { run: function (dur, fn) {
      window.cancelAnimationFrame(raf);
      if (REDUCE || !dur) { fn(1); return; }
      var start = performance.now();
      (function step(now) {
        var p = Math.max(0, Math.min(1, (now - start) / dur));
        fn(p);
        if (p < 1) raf = window.requestAnimationFrame(step);
      })(start);
    } };
  }

  /* ---------- 首頁 ---------- */
  function renderHome() {
    var grid = $("#lesson-grid");
    if (!grid) return;
    var count = $("#lesson-count");
    if (count) {
      var p = published().length;
      count.textContent = "已完成 " + p + " 頁・準備中 " + (LESSONS.length - p) + " 頁";
    }
    grid.textContent = "";
    LESSONS.forEach(function (lesson) {
      var planned = lesson.status !== "published";
      var card = el("article", { className: "lesson-card" + (planned ? " is-planned" : "") });
      card.appendChild(el("span", { className: "icon", "aria-hidden": "true" }, lesson.icon));
      card.appendChild(el("span", { className: "no" }, "講義 " + lesson.no));
      var h3 = el("h3");
      if (planned) h3.textContent = lesson.title;
      else h3.appendChild(el("a", { href: "lessons/" + lesson.slug + "/" }, lesson.title));
      card.appendChild(h3);
      var meta = el("div", { className: "meta" });
      meta.appendChild(el("span", { className: "tag" + (planned ? " planned" : "") }, planned ? "準備中" : "約 " + lesson.minutes + " 分鐘"));
      card.appendChild(meta);
      if (!planned && store.get("azul:read:" + lesson.slug)) card.appendChild(el("span", { className: "read-mark" }, "看過了"));
      grid.appendChild(card);
    });
  }

  /* ---------- 講義頁 ---------- */
  function renderLesson() {
    var slug = document.body.getAttribute("data-lesson");
    if (!slug) return;
    var lesson = LESSONS.filter(function (l) { return l.slug === slug; })[0];
    if (!lesson) { console.warn("[講義庫] lessons.js 找不到 slug：" + slug); return; }

    var noEl = $("[data-lesson-no]");
    if (noEl) noEl.textContent = "講義 " + lesson.no + "・約 " + lesson.minutes + " 分鐘";

    // 上一頁／下一頁（只連到已完成的講義）
    var pager = $("[data-pager]");
    if (pager) {
      var list = published();
      var i = list.map(function (l) { return l.slug; }).indexOf(slug);
      var prev = list[i - 1], next = list[i + 1];
      if (prev) {
        var a = el("a", { href: "../" + prev.slug + "/", className: "prev", rel: "prev" });
        a.appendChild(el("small", null, "← 上一頁"));
        a.appendChild(document.createTextNode(prev.title));
        pager.appendChild(a);
      }
      var b;
      if (next) {
        b = el("a", { href: "../" + next.slug + "/", className: "next", rel: "next" });
        b.appendChild(el("small", null, "下一頁 →"));
        b.appendChild(document.createTextNode(next.title));
      } else {
        b = el("a", { href: "../../", className: "next" });
        b.appendChild(el("small", null, "這是目前最後一頁"));
        b.appendChild(document.createTextNode("回首頁看看還有什麼"));
      }
      pager.appendChild(b);
    }

    // 看到「資料來源」就標記看過了
    var sources = $("#sources");
    if (sources && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (e) { return e.isIntersecting; })) { store.set("azul:read:" + slug, "1"); io.disconnect(); }
      });
      io.observe(sources);
    }
  }

  /* ---------- 元件 ---------- */
  var WIDGETS = {
    /* 選擇題：正確選項有 data-correct */
    quiz: function (root) {
      var buttons = $$(".quiz-options button", root);
      var explain = $(".quiz-explain", root);
      if (explain) explain.setAttribute("aria-live", "polite");
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var right = btn.hasAttribute("data-correct");
          buttons.forEach(function (x) {
            x.disabled = true;
            if (x.hasAttribute("data-correct")) x.classList.add("is-correct");
          });
          if (!right) btn.classList.add("is-wrong");
          if (explain) {
            explain.hidden = false;
            explain.insertBefore(el("strong", null, right ? "答對了！" : "差一點："), explain.firstChild);
          }
        });
      });
    },

    /* 情境選擇器：按鈕 data-pick ↔ 面板 data-panel，預設選第一個 */
    picker: function (root) {
      var buttons = $$("[data-pick]", root);
      var panels = $$("[data-panel]", root);
      function select(id) {
        buttons.forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-pick") === id)); });
        panels.forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== id; });
      }
      buttons.forEach(function (x) {
        x.classList.add("chip-btn");
        x.addEventListener("click", function () { select(x.getAttribute("data-pick")); });
      });
      if (buttons[0]) select(buttons[0].getAttribute("data-pick"));
    },

    /* 列印動畫：噴頭融化塑膠線，一層一層疊出小花瓶（放大示意）。
       data-steps 填左邊步驟清單 <ol> 的 id，動畫會同步標出目前步驟。 */
    "print-sim": function (root) {
      var stepList = document.getElementById(root.getAttribute("data-steps") || "");
      var stepItems = stepList ? $$("li", stepList) : [];
      var BED = 252, LH = 14, CX = 160;
      var HALF = [72, 64, 57, 52, 49, 48, 50, 54, 60, 67];
      var N = HALF.length;
      function tipY(i) { return BED - LH * (i + 1); }
      function startX(i) { return i % 2 === 0 ? CX - HALF[i] : CX + HALF[i]; }
      function endX(i) { return i % 2 === 0 ? CX + HALF[i] : CX - HALF[i]; }

      var svg = svgEl("svg", { viewBox: "0 0 320 290", class: "ps-svg", role: "img" });
      svgEl("title", null, svg).textContent = "列印動畫：噴頭把塑膠線融化，一層一層疊出一個小花瓶";
      svgEl("rect", { x: 20, y: BED, width: 280, height: 10, rx: 3, class: "ps-bed" }, svg);
      svgEl("text", { x: 300, y: BED + 28, "text-anchor": "end", class: "ps-bed-label" }, svg).textContent = "列印板";
      var layerG = svgEl("g", null, svg);
      var rects = HALF.map(function (h, i) {
        return svgEl("rect", { x: CX, y: tipY(i), width: 0, height: LH - 2, rx: (LH - 2) / 2, class: "ps-line" }, layerG);
      });
      var head = svgEl("g", null, svg);
      var filament = svgEl("line", { x1: 0, y1: -150, x2: 0, y2: -60, class: "ps-filament" }, head);
      svgEl("rect", { x: -14, y: -62, width: 28, height: 30, rx: 4, class: "ps-body" }, head);
      var heater = svgEl("rect", { x: -20, y: -32, width: 40, height: 20, rx: 4, class: "ps-heater" }, head);
      svgEl("polygon", { points: "-9,-12 9,-12 3,0 -3,0", class: "ps-nozzle" }, head);
      var melt = svgEl("circle", { cx: 0, cy: 4, r: 4, class: "ps-melt" }, head);
      svgEl("text", { x: 12, y: -110, class: "ps-label" }, head).textContent = "塑膠線";
      svgEl("text", { x: 26, y: -18, class: "ps-label" }, head).textContent = "加熱";
      svgEl("text", { x: -14, y: -2, "text-anchor": "end", class: "ps-label" }, head).textContent = "噴嘴";
      root.appendChild(svg);

      var status = el("p", { className: "sr-only", "aria-live": "polite" });
      var controls = el("div", { className: "widget-controls" });
      var playBtn = el("button", { type: "button", className: "btn" }, "▶ 播放");
      var nextBtn = el("button", { type: "button", className: "btn ghost" }, "下一步 ›");
      var resetBtn = el("button", { type: "button", className: "btn ghost" }, "↺ 重來");
      controls.appendChild(playBtn); controls.appendChild(nextBtn); controls.appendChild(resetBtn);
      root.appendChild(status);
      root.appendChild(controls);

      // 時間軸：送線 → 加熱 → (畫線 → 上移) × N → 完成
      var timeline = [{ type: "feed", dur: 1400 }, { type: "heat", dur: 1400 }];
      HALF.forEach(function (h, i) {
        timeline.push({ type: "draw", layer: i, dur: 700 + h * 12 });
        if (i < N - 1) timeline.push({ type: "up", layer: i, dur: 450 });
      });
      timeline.push({ type: "done", dur: 0 });

      var k = 0, t = 0, flow = 0, playing = false, last = 0, raf = 0, lastMsg = "";
      var MSG = {
        feed: ["①", "齒輪把塑膠線往下推進噴頭。"],
        heat: ["②", "加熱塊把塑膠加熱到約 220 °C，變得像牙膏一樣軟。"],
        draw: ["③", ""],
        up: ["④", "這一層畫完了，噴頭往上移一層。"],
        done: ["", ""]
      };
      var STEP = { feed: 0, heat: 1, draw: 2, up: 3 };

      function setStatus(strong, text) {
        var key = strong + text;
        if (key === lastMsg) return;
        lastMsg = key;
        status.textContent = "";
        if (strong) status.appendChild(el("strong", null, strong + " "));
        status.appendChild(document.createTextNode(text));
      }

      function render() {
        var ph = timeline[k];
        var p = ph.dur ? Math.min(1, t / ph.dur) : 1;
        var layer = ph.type === "feed" || ph.type === "heat" ? -1 : ph.layer;
        var x, y;
        if (ph.type === "feed" || ph.type === "heat") { x = startX(0); y = tipY(0) - 24; }
        else if (ph.type === "draw") { x = lerp(startX(layer), endX(layer), p); y = tipY(layer); }
        else if (ph.type === "up") { x = endX(layer); y = lerp(tipY(layer), tipY(layer + 1), p); }
        else { x = endX(N - 1); y = tipY(N - 1) - 40; layer = N; }

        rects.forEach(function (r, i) {
          var x0 = CX - HALF[i], w = HALF[i] * 2;
          if (i < layer || (i === layer && ph.type === "up")) { r.setAttribute("x", x0); r.setAttribute("width", w); }
          else if (i === layer && ph.type === "draw") {
            var a = startX(i), cur = Math.abs(x - a);
            r.setAttribute("x", Math.min(a, x)); r.setAttribute("width", cur);
          } else { r.setAttribute("width", 0); }
          r.classList.toggle("is-current", i === layer && ph.type === "draw");
        });
        head.setAttribute("transform", "translate(" + x.toFixed(1) + "," + y.toFixed(1) + ")");
        heater.classList.toggle("is-hot", ph.type !== "feed");
        melt.classList.toggle("is-on", ph.type === "draw");
        filament.setAttribute("stroke-dashoffset", (-flow * 0.03).toFixed(1));

        var active = ph.type in STEP ? STEP[ph.type] : -1;
        stepItems.forEach(function (li, idx) { li.classList.toggle("is-active", idx === active); });
        if (ph.type === "draw") setStatus("③", "噴嘴擠出細細一條，邊走邊畫：第 " + (layer + 1) + " / " + N + " 層。");
        else if (ph.type === "done") setStatus("完成！", "一共疊了 " + N + " 層，小花瓶印好了。");
        else setStatus(MSG[ph.type][0], MSG[ph.type][1]);
        playBtn.textContent = playing ? "⏸ 暫停" : (ph.type === "done" ? "↺ 再看一次" : "▶ 播放");
      }

      function tick(now) {
        var dt = Math.min(64, now - last);
        last = now;
        if (playing) {
          t += dt;
          var type = timeline[k].type;
          if (type === "feed" || type === "draw") flow += dt;
          while (k < timeline.length - 1 && t >= timeline[k].dur) { t -= timeline[k].dur; k += 1; }
          if (timeline[k].type === "done") playing = false;
        }
        render();
        if (playing) raf = window.requestAnimationFrame(tick);
      }
      function play() {
        if (timeline[k].type === "done") { k = 0; t = 0; }
        playing = true;
        last = performance.now();
        window.cancelAnimationFrame(raf);
        raf = window.requestAnimationFrame(tick);
      }
      function pause() { playing = false; window.cancelAnimationFrame(raf); render(); }
      var auto = null;
      function stopAuto() { if (auto) { auto.disconnect(); auto = null; } }

      playBtn.addEventListener("click", function () { stopAuto(); if (playing) pause(); else play(); });
      nextBtn.addEventListener("click", function () {
        stopAuto();
        pause();
        if (timeline[k].type === "done") return;
        if (t >= timeline[k].dur) { k = Math.min(k + 1, timeline.length - 1); t = timeline[k].dur; }
        else { t = timeline[k].dur; }
        flow += 300;
        render();
      });
      resetBtn.addEventListener("click", function () { stopAuto(); pause(); k = 0; t = 0; render(); });

      render();
      if (!REDUCE && "IntersectionObserver" in window) {
        // 捲到動畫時自動播放一次；使用者自己按過按鈕就不再自動播放
        auto = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) { stopAuto(); play(); }
        }, { threshold: 0.4 });
        auto.observe(svg);
      }
    },

    /* 流程圖 flow：五個畫面輪播（找模型 → 切片 → 送去印 → 等它印 → 取下來）。
       data-steps 填左邊步驟清單 <ol> 的 id；點左邊步驟也能切換畫面。 */
    flow: function (root) {
      var stepItems = stepsOf(root);
      var svg = svgEl("svg", { viewBox: "0 0 320 240", class: "fl-svg", role: "img" });
      var title = svgEl("title", null, svg);
      var VASE = [36, 32, 28, 26, 24, 24, 25, 27, 30, 33];
      var tw = makeTween();
      function tween(d, fn) { tw.run(d, fn); }
      function vase(parent, cx, baseY, lh, cls) {
        return VASE.map(function (h, i) {
          return svgEl("rect", { x: cx - h, y: baseY - lh * (i + 1), width: h * 2, height: lh - 2, rx: (lh - 2) / 2, class: cls }, parent);
        });
      }
      function printer(parent, x) {
        var g = svgEl("g", { transform: "translate(" + x + ",0)" }, parent);
        svgEl("rect", { x: 0, y: 206, width: 150, height: 12, rx: 3, class: "fl-frame" }, g);
        svgEl("rect", { x: 136, y: 40, width: 10, height: 168, rx: 3, class: "fl-frame" }, g);
        svgEl("rect", { x: 6, y: 40, width: 140, height: 10, rx: 3, class: "fl-frame" }, g);
        var plate = svgEl("rect", { x: 10, y: 198, width: 112, height: 8, rx: 2, class: "fl-plate" }, g);
        var head = svgEl("g", { transform: "translate(66,60)" }, g);
        svgEl("rect", { x: -11, y: 0, width: 22, height: 22, rx: 3, class: "fl-head" }, head);
        svgEl("polygon", { points: "-6,22 6,22 2,30 -2,30", class: "fl-nozzle" }, head);
        return { g: g, plate: plate, head: head };
      }
      var scenes = [];
      function scene(name, build) {
        var g = svgEl("g", { class: "fl-scene" }, svg);
        var s = build(g) || {};
        s.g = g; s.name = name;
        scenes.push(s);
      }

      // ① 找模型：螢幕上出現一個模型
      scene("找模型：在電腦上找到一個花瓶模型", function (g) {
        svgEl("rect", { x: 50, y: 24, width: 220, height: 146, rx: 10, class: "fl-screen" }, g);
        svgEl("rect", { x: 150, y: 170, width: 20, height: 22, class: "fl-frame" }, g);
        svgEl("rect", { x: 112, y: 192, width: 96, height: 10, rx: 4, class: "fl-frame" }, g);
        var model = svgEl("g", null, g);
        vase(model, 160, 150, 11, "fl-wire");
        var arrow = svgEl("g", null, g);
        svgEl("line", { x1: 236, y1: 40, x2: 236, y2: 78, class: "fl-arrow" }, arrow);
        svgEl("polyline", { points: "226,68 236,80 246,68", class: "fl-arrow" }, arrow);
        return { enter: function () {
          tween(900, function (p) {
            model.setAttribute("transform", "translate(160,150) scale(" + (0.85 + 0.15 * p).toFixed(3) + ") translate(-160,-150)");
            arrow.setAttribute("transform", "translate(0," + (-12 + 12 * p).toFixed(1) + ")");
          });
        } };
      });

      // ② 切片：模型被切成一層一層
      scene("切片：模型被切成一層一層", function (g) {
        var layers = vase(g, 160, 214, 14, "fl-layer");
        var knife = svgEl("line", { x1: 100, x2: 220, y1: 0, y2: 0, class: "fl-knife" }, g);
        return { enter: function () {
          tween(1600, function (p) {
            var a = Math.min(1, p / 0.55), b = Math.max(0, (p - 0.55) / 0.45);
            knife.setAttribute("transform", "translate(0," + lerp(66, 214, a).toFixed(1) + ")");
            knife.setAttribute("opacity", p < 0.6 ? "1" : "0");
            layers.forEach(function (r, i) {
              r.setAttribute("transform", "translate(0," + (-i * 5 * b).toFixed(1) + ")");
            });
          });
        } };
      });

      // ③ 送去印：檔案從電腦飛到印表機
      scene("送去印：檔案從電腦傳到印表機", function (g) {
        svgEl("rect", { x: 10, y: 100, width: 104, height: 68, rx: 6, class: "fl-screen" }, g);
        svgEl("polygon", { points: "2,176 122,176 114,168 10,168", class: "fl-frame" }, g);
        vase(svgEl("g", { transform: "translate(62,156) scale(0.4) translate(-160,-150)" }, g), 160, 150, 11, "fl-wire");
        printer(g, 165);
        svgEl("path", { d: "M100,96 C140,40 190,40 222,80", class: "fl-path" }, g);
        var file = svgEl("g", null, g);
        svgEl("polygon", { points: "-9,-12 4,-12 9,-7 9,12 -9,12", class: "fl-file" }, file);
        svgEl("line", { x1: -5, y1: -3, x2: 5, y2: -3, class: "fl-file-line" }, file);
        svgEl("line", { x1: -5, y1: 3, x2: 5, y2: 3, class: "fl-file-line" }, file);
        function bez(t) {
          var u = 1 - t;
          return [u * u * u * 100 + 3 * u * u * t * 140 + 3 * u * t * t * 190 + t * t * t * 222,
                  u * u * u * 96 + 3 * u * u * t * 40 + 3 * u * t * t * 40 + t * t * t * 80];
        }
        return { enter: function () {
          tween(1400, function (p) {
            var q = bez(1 - Math.pow(1 - p, 2));
            file.setAttribute("transform", "translate(" + q[0].toFixed(1) + "," + q[1].toFixed(1) + ")");
          });
        } };
      });

      // ④ 等它印：一層一層長出來
      scene("等它印：噴頭一層一層疊出花瓶", function (g) {
        var pr = printer(g, 90);
        var layers = vase(pr.g, 66, 198, 12, "fl-layer");
        var clock = svgEl("g", { transform: "translate(42,64)" }, g);
        svgEl("circle", { r: 20, class: "fl-clock" }, clock);
        var hand = svgEl("line", { x1: 0, y1: 0, x2: 0, y2: -13, class: "fl-hand" }, clock);
        svgEl("line", { x1: 0, y1: 0, x2: 8, y2: 0, class: "fl-hand" }, clock);
        return { enter: function () {
          tween(2800, function (p) {
            var n = VASE.length, f = p * n, k = Math.min(n - 1, Math.floor(f));
            layers.forEach(function (r, i) { r.setAttribute("opacity", i < f ? "1" : "0"); });
            var w = VASE[k], part = p >= 1 ? 1 : f - k;
            var x = 66 + (k % 2 ? 1 : -1) * lerp(w, -w, part);
            pr.head.setAttribute("transform", "translate(" + x.toFixed(1) + "," + (198 - 12 * (k + 1) - 32).toFixed(1) + ")");
            hand.setAttribute("transform", "rotate(" + (p * 720).toFixed(0) + ")");
          });
        } };
      });

      // ⑤ 取下來：列印板變涼，再把成品拿起來
      scene("取下來：等列印板涼了，把花瓶拿起來", function (g) {
        var plate = svgEl("rect", { x: 70, y: 210, width: 180, height: 10, rx: 3, class: "fl-plate" }, g);
        var obj = svgEl("g", null, g);
        vase(obj, 160, 210, 15, "fl-layer");
        var arrow = svgEl("g", { opacity: "0" }, g);
        svgEl("line", { x1: 240, y1: 150, x2: 240, y2: 90, class: "fl-arrow" }, arrow);
        svgEl("polyline", { points: "230,100 240,88 250,100", class: "fl-arrow" }, arrow);
        return { enter: function () {
          tween(2200, function (p) {
            plate.classList.toggle("is-hot", p < 0.45);
            var b = Math.max(0, (p - 0.5) / 0.5), e = 1 - Math.pow(1 - b, 3);
            obj.setAttribute("transform", "translate(0," + (-40 * e).toFixed(1) + ")");
            arrow.setAttribute("opacity", b > 0 ? "1" : "0");
          });
        } };
      });

      root.appendChild(svg);
      var controls = el("div", { className: "widget-controls fl-controls" });
      var prevBtn = el("button", { type: "button", className: "btn ghost", "aria-label": "上一步" }, "‹");
      var nextBtn = el("button", { type: "button", className: "btn ghost", "aria-label": "下一步" }, "›");
      var dots = el("div", { className: "fl-dots" });
      var dotBtns = scenes.map(function (s, i) {
        var d = el("button", { type: "button", className: "fl-dot", "aria-label": "第 " + (i + 1) + " 步" });
        d.addEventListener("click", function () { stopAuto(); show(i); });
        dots.appendChild(d);
        return d;
      });
      controls.appendChild(prevBtn); controls.appendChild(dots); controls.appendChild(nextBtn);
      root.appendChild(controls);

      var cur = 0, timer = 0, auto = false;
      function show(i) {
        cur = (i + scenes.length) % scenes.length;
        scenes.forEach(function (s, k) { s.g.setAttribute("visibility", k === cur ? "visible" : "hidden"); });
        dotBtns.forEach(function (d, k) { d.setAttribute("aria-current", k === cur ? "step" : "false"); });
        stepItems.forEach(function (li, k) { li.classList.toggle("is-active", k === cur); });
        title.textContent = scenes[cur].name;
        if (scenes[cur].enter) scenes[cur].enter();
        window.clearTimeout(timer);
        if (auto && !REDUCE) timer = window.setTimeout(function () { show(cur + 1); }, 3800);
      }
      function stopAuto() { auto = false; window.clearTimeout(timer); }
      prevBtn.addEventListener("click", function () { stopAuto(); show(cur - 1); });
      nextBtn.addEventListener("click", function () { stopAuto(); show(cur + 1); });
      stepItems.forEach(function (li, k) {
        li.classList.add("is-clickable");
        li.addEventListener("click", function () { stopAuto(); show(k); });
      });
      show(0);
      if (!REDUCE && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); auto = true; show(cur); }
        }, { threshold: 0.4 });
        io.observe(svg);
      }
    },

    /* 模型剖面 parts：外牆、填充、支撐、橋接，點按鈕（或左邊步驟）亮起那一部分。
       按鈕寫 data-part（walls / infill / support / bridge），順序要和左邊步驟一樣；data-steps 同上。 */
    parts: function (root) {
      var stepItems = stepsOf(root);
      var buttons = $$("[data-part]", root);
      if (!buttons.length) return;
      var svg = svgEl("svg", { viewBox: "0 0 320 250", class: "pt-svg", role: "img" });
      var title = svgEl("title", null, svg);
      var OUT = "M40,226 V60 H292 V100 H232 V226 H176 V100 H104 V226 Z";
      var defs = svgEl("defs", null, svg);
      var clip = svgEl("clipPath", { id: "pt-clip" }, defs);
      svgEl("path", { d: OUT }, clip);
      svgEl("rect", { x: 16, y: 228, width: 288, height: 8, rx: 3, class: "pt-bed" }, svg);
      svgEl("path", { d: OUT, class: "pt-body" }, svg);
      var groups = {};
      groups.infill = svgEl("g", { "clip-path": "url(#pt-clip)", class: "pt-part pt-infill" }, svg);
      for (var d = -200; d < 320; d += 16) {
        svgEl("line", { x1: d, y1: 226, x2: d + 170, y2: 56 }, groups.infill);
        svgEl("line", { x1: d, y1: 56, x2: d + 170, y2: 226 }, groups.infill);
      }
      groups.support = svgEl("g", { class: "pt-part pt-support" }, svg);
      for (var x = 240; x <= 286; x += 9) svgEl("line", { x1: x, y1: 108, x2: x, y2: 226 }, groups.support);
      svgEl("line", { x1: 237, y1: 108, x2: 288, y2: 108 }, groups.support);
      groups.walls = svgEl("path", { d: OUT, class: "pt-part pt-walls" }, svg);
      groups.bridge = svgEl("g", { class: "pt-part pt-bridge" }, svg);
      svgEl("rect", { x: 106, y: 90, width: 68, height: 8, rx: 2 }, groups.bridge);
      svgEl("path", { d: "M106,112 Q140,124 174,112", class: "pt-gap" }, groups.bridge);
      root.insertBefore(svg, root.firstChild);

      var names = buttons.map(function (b) { return b.getAttribute("data-part"); });
      var cur = 0, timer = 0, auto = false;
      function show(i) {
        cur = (i + names.length) % names.length;
        var id = names[cur];
        Object.keys(groups).forEach(function (k) {
          groups[k].classList.toggle("is-on", k === id);
          groups[k].classList.toggle("is-dim", k !== id);
        });
        buttons.forEach(function (b, k) { b.setAttribute("aria-pressed", String(k === cur)); });
        stepItems.forEach(function (li, k) { li.classList.toggle("is-active", k === cur); });
        title.textContent = "模型剖面圖，亮起的是：" + buttons[cur].textContent;
        window.clearTimeout(timer);
        if (auto && !REDUCE) timer = window.setTimeout(function () { show(cur + 1); }, 2600);
      }
      function stopAuto() { auto = false; window.clearTimeout(timer); }
      buttons.forEach(function (b, k) {
        b.classList.add("chip-btn");
        b.addEventListener("click", function () { stopAuto(); show(k); });
      });
      stepItems.forEach(function (li, k) {
        li.classList.add("is-clickable");
        li.addEventListener("click", function () { stopAuto(); show(k); });
      });
      show(0);
      if (!REDUCE && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          if (entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); auto = true; show(cur); }
        }, { threshold: 0.4 });
        io.observe(svg);
      }
    },

    /* 六角形雷達圖：一次看一種材料，虛線是對照組（data-ref）。
       按鈕寫 data-series（名稱）、data-values（分數，順序同 data-axes）、data-note（一句話結論）。 */
    radar: function (root) {
      var axes = (root.getAttribute("data-axes") || "").split(",");
      var max = Number(root.getAttribute("data-max") || 5);
      var refName = root.getAttribute("data-ref") || "";
      var buttons = $$("[data-series]", root);
      if (!axes.length || !buttons.length) return;
      var series = buttons.map(function (b) {
        return {
          name: b.getAttribute("data-series"),
          values: b.getAttribute("data-values").split(",").map(Number),
          note: b.getAttribute("data-note") || "",
          button: b
        };
      });
      var ref = series.filter(function (s) { return s.name === refName; })[0];
      var CX = 170, CY = 150, R = 100, n = axes.length;
      function pt(i, v) {
        var a = -Math.PI / 2 + (i * 2 * Math.PI) / n, r = (R * v) / max;
        return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
      }
      function pts(values) { return values.map(function (v, i) { return pt(i, v).map(function (c) { return c.toFixed(1); }).join(","); }).join(" "); }

      var svg = svgEl("svg", { viewBox: "0 0 340 300", class: "rd-svg", role: "img" });
      var title = svgEl("title", null, svg);
      for (var lv = 1; lv <= max; lv++) {
        svgEl("polygon", { points: pts(axes.map(function () { return lv; })), class: "rd-grid" + (lv === max ? " is-outer" : "") }, svg);
      }
      axes.forEach(function (name, i) {
        var o = pt(i, max);
        svgEl("line", { x1: CX, y1: CY, x2: o[0].toFixed(1), y2: o[1].toFixed(1), class: "rd-axis" }, svg);
        var l = pt(i, max * (R + 16) / R);
        var dx = l[0] - CX;
        var anchor = Math.abs(dx) < 4 ? "middle" : dx > 0 ? "start" : "end";
        var y = l[1] + (l[1] < CY - 40 ? -2 : l[1] > CY + 40 ? 12 : 4);
        svgEl("text", { x: l[0].toFixed(1), y: y.toFixed(1), "text-anchor": anchor, class: "rd-label" }, svg).textContent = name;
      });
      var refPoly = svgEl("polygon", { class: "rd-ref" }, svg);
      var shape = svgEl("polygon", { class: "rd-shape" }, svg);
      var dots = axes.map(function () {
        var g = svgEl("g", null, svg);
        var dot = svgEl("circle", { r: 4.5, class: "rd-dot" }, g);
        var hit = svgEl("circle", { r: 14, class: "rd-hit" }, g);
        var tip = svgEl("title", null, hit);
        return { dot: dot, hit: hit, tip: tip };
      });

      var legend = el("p", { className: "rd-legend" });
      var summary = el("p", { className: "sr-only", "aria-live": "polite" });
      var scores = el("ul", { className: "rd-scores", "aria-label": "各項分數" });
      var options = $(".radar-options", root) || buttons[0].parentNode;
      options.insertAdjacentElement("afterend", svg);
      svg.insertAdjacentElement("afterend", legend);
      legend.insertAdjacentElement("afterend", summary);
      summary.insertAdjacentElement("afterend", scores);

      var cur = series[0].values.slice(), raf = 0;
      function draw(values, s) {
        shape.setAttribute("points", pts(values));
        values.forEach(function (v, i) {
          var p = pt(i, v);
          dots[i].dot.setAttribute("cx", p[0].toFixed(1)); dots[i].dot.setAttribute("cy", p[1].toFixed(1));
          dots[i].hit.setAttribute("cx", p[0].toFixed(1)); dots[i].hit.setAttribute("cy", p[1].toFixed(1));
          dots[i].tip.textContent = s.name + "｜" + axes[i] + "：" + s.values[i] + " / " + max;
        });
      }
      function select(s) {
        series.forEach(function (x) { x.button.setAttribute("aria-pressed", String(x === s)); });
        var showRef = ref && ref !== s;
        refPoly.setAttribute("points", ref ? pts(ref.values) : "");
        refPoly.setAttribute("visibility", showRef ? "visible" : "hidden");
        title.textContent = s.name + " 的能力六角形：" + axes.map(function (a, i) { return a + " " + s.values[i]; }).join("、");

        legend.textContent = "";
        var k1 = el("span"); k1.appendChild(el("span", { className: "rd-key", "aria-hidden": "true" })); k1.appendChild(document.createTextNode("實線：" + s.name));
        legend.appendChild(k1);
        if (showRef) {
          var k2 = el("span"); k2.appendChild(el("span", { className: "rd-key is-ref", "aria-hidden": "true" })); k2.appendChild(document.createTextNode("虛線：" + ref.name + "（對照）"));
          legend.appendChild(k2);
        }
        summary.textContent = "";
        summary.appendChild(el("strong", null, s.name + "："));
        summary.appendChild(document.createTextNode(s.note));
        scores.textContent = "";
        axes.forEach(function (a, i) {
          var li = el("li");
          li.appendChild(el("span", null, a));
          var v = s.values[i];
          li.appendChild(el("span", { className: "rd-meter", "aria-label": v + " / " + max }, new Array(v + 1).join("●") + new Array(max - v + 1).join("○")));
          scores.appendChild(li);
        });

        window.cancelAnimationFrame(raf);
        var from = cur.slice(), start = performance.now(), D = REDUCE ? 0 : 350;
        (function step(now) {
          var p = D ? Math.min(1, (now - start) / D) : 1;
          var e = 1 - Math.pow(1 - p, 3);
          cur = from.map(function (v, i) { return lerp(v, s.values[i], e); });
          draw(cur, s);
          if (p < 1) raf = window.requestAnimationFrame(step);
        })(start);
      }
      series.forEach(function (s) {
        s.button.classList.add("chip-btn");
        s.button.addEventListener("click", function () { select(s); });
      });
      select(series[0]);
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
