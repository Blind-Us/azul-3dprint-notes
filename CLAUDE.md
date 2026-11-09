# CLAUDE.md：A竹 3D列印入門

> 給 AI 的專案說明書。開工前依序讀：**本文件 → `NOTES.md`（現在做到哪、下一步）→ `log.md` 最上面幾筆（最近改了什麼）**。
> 讀完後，你應該能做到：不用再問結構問題，就照固定格式新增一頁講義，並確認沒有弄壞其他頁面。

## 一分鐘速覽

| 問題 | 簡答 | 細節 |
|---|---|---|
| 這裡是什麼？ | 給**完全沒碰過 3D 列印**的人看的入門網站，純靜態，部署在 GitHub Pages | 第 1–3 節 |
| 我的習慣？ | 一頁回答一個問題；標題用問句；**像影片裡的簡報：畫面自己說話，不加副標和說明小字**；內容先寫在 `notes/`；講義清單只改 `lessons.js` | 第 4–7、9–10 節 |
| 不能做的事？ | 不寫成論文或參數手冊；不捏造作品、照片和數據；沒有來源的數字不寫成保證；不加外部依賴；官方資料只引用拓竹中文 Wiki | 第 2、8、11 節 |
| 做完要？ | `python tools/check_site.py` 全部通過、看過手機寬度、寫 `log.md`、更新 `NOTES.md` | 第 6、12 節 |

---

## 1. 專案目的與讀者

「A竹 3D列印入門」是品牌「A竹's 3D列印實驗室」的入門網站。目標只有一個：**讓完全沒碰過 3D 列印的人，3 分鐘看懂一件事。**

- **讀者**：沒看過 3D 印表機的人，國中生也要看得懂。不要假設讀者知道任何術語。
- **一頁只回答一個新手會問的問題**，標題就是那個問題，例如「3D 列印怎麼印出來？」。
- **字少圖多**：每頁都要有一個動畫、互動元件或圖解，讓讀者「看」懂，而不是「讀」懂。
- **像簡報一樣**：想像這頁是影片裡播的投影片。標題＋畫面就夠了，不用另外解釋「這張圖在做什麼」或「這一頁為什麼存在」。
- **這個網站不是**參數手冊、論文、產品型錄或報價頁。進階的參數調整不放在這裡。

正式網址：`https://blind-us.github.io/azul-3dprint-notes/`
姊妹站（作品與客製）：`https://blind-us.github.io/azul-3dlab/`

---

## 2. 技術限制（不可違反）

1. **只用純靜態 HTML／CSS／JavaScript。** 不用框架、建置工具或 npm 套件，也不載入外部字型、CDN 或追蹤碼。
2. **部署方式**：GitHub Pages，`main` 分支、根目錄。根目錄必須保留 `.nojekyll`。
3. **路徑一律相對。** 網站在子路徑 `/azul-3dprint-notes/` 下運作，所以**不要用 `fetch()` 讀資料**；講義清單放在 `assets/js/lessons.js`，用 `<script>` 載入。
4. **互動只寫在 `site.js`。** 講義頁不寫自己的 `<script>`，要用第 10 節的元件。
5. **儲存只用 `localStorage`**（已讀標記），每次讀寫都包在 `try/catch` 裡。不得有表單送出、登入或後端呼叫。

---

## 3. 資料夾結構

```text
azul-3dprint-notes/
├── CLAUDE.md               ← 本文件：AI 規則（唯一版本）
├── AGENTS.md               ← 給 Codex 等其他 agent 的入口，指向本文件
├── README.md               ← 給人看的專案介紹
├── NOTES.md                ← 現況白板：做到哪、下次從哪開始、待辦
├── log.md                  ← 開發紀錄，新紀錄寫在最上方
├── index.html              ← 首頁（講義卡片由 lessons.js 自動產生）
├── .nojekyll
├── assets/
│   ├── css/style.css       ← 全站唯一樣式表，色彩 tokens 在 :root
│   ├── js/lessons.js       ← ★ 講義清單：唯一資料來源
│   ├── js/site.js          ← 共用互動：首頁卡片、上一頁／下一頁、所有元件
│   └── img/                ← logo、favicon
├── lessons/
│   ├── _template/index.html        ← 新講義的頁面範本（不要刪）
│   └── NN-slug/index.html          ← 每頁講義一個資料夾
├── notes/
│   ├── _template.md        ← 內容草稿範本
│   └── NN-slug.md          ← 每頁講義的文字與來源（內容先行）
├── sources/official-sources.md     ← 官方來源與代號（W1、P2…）
└── tools/check_site.py     ← 結構檢查腳本（Python 標準函式庫，不需安裝套件）
```

**三份「記憶」檔的分工**：AI 每開一個新對話都不記得上次的事，所以要寫進檔案。

| 檔案 | 放什麼 | 怎麼改 |
|---|---|---|
| `CLAUDE.md` | 長期規則和慣例 | 很少改；改了要記一筆 `log.md` |
| `log.md` | 做了什麼、為什麼（會影響之後的決定） | 只在最上方新增，不刪舊紀錄 |
| `NOTES.md` | 目前狀態、下次從哪開始、待辦、要問作者的事 | 每次收工前改寫，做完的就刪掉 |

---

## 4. 命名規則

| 項目 | 規則 | 例子 |
|---|---|---|
| 講義 slug | `NN-英文小寫-連字號`，NN 是兩位數編號，不用中文、空白或底線 | `03-model-to-print` |
| 同一頁的檔案 | 下面四個地方都用同一個 slug | 見下方 |
| Commit 訊息 | `lesson: add NN 標題`、`lesson: update NN 標題`、`site: 說明`、`docs: 說明` | `lesson: add 03 從模型到成品要幾步？` |

同一個 slug 必須同時出現在：`notes/<slug>.md`、`lessons/<slug>/index.html`、`lessons.js` 的 `slug`、講義 HTML 的 `<body data-lesson="<slug>">`。

**編號只增不改。** 已發布的講義不要重新編號；新主題一律用下一個號碼。

---

## 5. 講義清單 `assets/js/lessons.js`（唯一資料來源）

首頁卡片、講義編號和「上一頁／下一頁」都由這份清單自動產生。**絕對不要在 `index.html` 手寫講義卡片。**
陣列內容**必須是合法 JSON**（鍵加雙引號、沒有結尾逗號、陣列裡不寫註解），檢查腳本會用 JSON 讀取。

```json
{
  "no": "05",
  "slug": "05-first-print-tips",
  "icon": "✅",
  "title": "第一次列印要注意什麼？",
  "summary": "開印前檢查三件事，避免第一次就失敗。",
  "minutes": 3,
  "status": "planned",
  "updated": "2026-11-10"
}
```

| 欄位 | 規則 |
|---|---|
| `no` | 兩位數字串，等於清單中的順序，也等於 slug 開頭 |
| `icon` | 一個 emoji，當首頁卡片的小圖示 |
| `title` | **問句**，以全形「？」結尾；必須與講義頁 `<h1>` 完全一致，`<title>` 也要以它開頭 |
| `summary` | 一句話，30 字內（英文單字算 1 字）；只當作 meta description（給搜尋引擎），**首頁卡片不顯示**；兩邊要完全相同 |
| `minutes` | 1–5 的整數。超過 5 分鐘代表內容太多，要拆成兩頁 |
| `status` | `planned`（首頁顯示「準備中」，不能點）或 `published` |
| `updated` | 最後一次實質修改的日期，`YYYY-MM-DD` |

陣列順序就是閱讀順序，新條目加在最後。

---

## 6. 新增一頁的流程（SOP）

依序執行，不要跳步：

1. **確認主題**：是不是一個「新手會問的問題」？先讀 `lessons.js` 確認沒有重複。如果主題已經是 `planned`，沿用它的 slug 和編號。
2. **內容先行**：複製 `notes/_template.md` 成 `notes/<slug>.md`，先寫完所有文字、要用的元件和來源。
3. **建立頁面**：複製 `lessons/_template/` 成 `lessons/<slug>/`，把 notes 的內容填進五個固定區塊（第 7 節），把所有 ★ 換掉。
4. **登記**：在 `lessons.js` 新增或更新條目，`status` 改成 `published`，填上 `updated`。
5. **驗證**：執行 `python tools/check_site.py`，必須全部通過。再用瀏覽器打開首頁和新頁面，在 375 px 手機寬度下檢查，不能出現水平捲軸。
6. **紀錄**：在 `log.md` 最上方新增一筆；更新 `NOTES.md` 的狀態表、下一步和待辦。
7. **提交**：commit 訊息用 `lesson: add NN 標題`。

修改既有講義：先改 `notes/<slug>.md`，再改頁面，讓兩邊一致；有實質修改時更新 `updated`。

---

## 7. 講義頁的固定結構（五個區塊）

每頁都從 `lessons/_template/index.html` 複製，**區塊順序和 id 不能改，也不能多加區塊**，`tools/check_site.py` 會檢查。

| 順序 | 區塊 | 選擇器 | 內容規則 |
|---|---|---|---|
| 1 | 頁首 | `header.lesson-hero` | **只放** `<h1>` 問句標題，不加副標。編號和閱讀時間由 JS 帶入 |
| 2 | 一張圖看懂 | `section#idea.split` | **左文右圖**：左邊 `ol.steps` 3–5 步，每步「`<strong>`兩到四個字`</strong>`＋一句話」；右邊 `.split-visual` 一定要放互動元件、SVG 圖或 `<figure>`。**不加小標題 `<h2>`、元件標題或圖下說明** |
| 3 | 重點 | `section#points` | 2–4 張 `.card`（emoji＋標題＋兩行內說明），**或**一張比較表 |
| 4 | 考考你 | `section#quiz` | **剛好一題**選擇題，附一句話解說 |
| 5 | 資料來源 | `section#sources` | 放在 `<details class="sources">` 裡摺起來，至少一個外部連結 |

頁尾的「上一頁／下一頁」（`[data-pager]`）由 JS 根據 `lessons.js` 自動產生，不用手寫。

---

## 8. 內容與寫作規則

### 8.1 寫給新手（最重要）

- **畫面自己說話（作者 2026-11-10 的糾正）。** 不加副標（`.lesson-lead`）、`#idea` 小標題、元件標題（`.widget-title`）、圖下說明小字（`.note`）或「點這裡看看」之類的操作提示。檢查腳本會擋。
- **圖要真的畫出那件事。** 右邊的圖要讓人看到「這一步長什麼樣子」，不能只是 emoji 加一段文字（03 原本的 emoji 選擇器就是反例）。
- **能用圖就不用字。** 每頁正文（不含資料來源）**最多 400 個中文字**，超過就刪字或改成圖、表、動畫。
- **術語要翻成白話。** 第一次出現的術語要用生活比喻解釋，例如「噴頭就像熱熔膠槍」「耗材就是一捲塑膠線」。
- **不放參數名稱。** `wall_loops`、`layer_height` 這種設定名稱不出現在網頁上；要提數字時，只提新手需要知道的一個（例如「一層約 0.2 mm」），並用比喻讓它有感覺。
- **句子短。** 一句不超過 25 字，一段不超過 2 行。用「你」跟讀者說話。
- 使用繁體中文和台灣用語（列印、耗材、噴頭、列印板）；中文一律全形標點，程式碼、網址和英文維持半形。

### 8.2 數字分三類

| 類別 | 定義 | 寫法 |
|---|---|---|
| **官方數值** | 來自**拓竹官方 Wiki 中文版**（網址有 `/zh/`，例如 `https://wiki.bambulab.com/zh/a1/manual/faq`） | 直接寫，並在 `#sources` 列出處（代號見 `sources/official-sources.md`） |
| **經驗起點／比較** | 一般常見的說法或相對比較，例如六角形雷達圖的 1–5 分 | 在 `#sources` 寫「經驗起點：相對比較，不是實驗數據」（不要在圖下面加小字） |
| **禁止** | 沒有來源、卻寫得像保證的數字 | 不准出現。不確定就不寫，或在回覆中問作者 |

### 8.3 不可捏造

- 不捏造 A竹 的作品、照片、實驗數據、客人回饋或個人經歷。
- 需要作者親身經驗或照片的地方，留下 `<!-- TODO(作者): 說明要補什麼 -->`，並寫進 `NOTES.md` 待辦。
- 機型以 Bambu Lab A1 為例；提到其他機型只寫「概念相同，數值以該機型官方資料為準」。

### 8.4 安全

只有真的有風險的內容（例如 ABS、ASA 的刺激性氣體）才加一個 `.callout.warn`。**不要每頁都放「注意安全」**；高溫這類提醒寫進步驟裡就好（例如 03 的「等列印板涼了再拿」）。

---

## 9. 視覺風格

- **調性**：A竹 的竹葉綠搭配米白，親切、乾淨、留白多。
- **字型**：只用系統字型（已寫在 `--font`），不載入網路字型。
- **配色**：只用 `style.css` `:root` 的 tokens。**講義頁不得寫死色碼，也不得用 inline style**。

| Token | 色碼 | 用途 |
|---|---|---|
| `--bg` | `#F7F8F2` | 頁面米白底 |
| `--surface` | `#FFFFFF` | 卡片、元件底 |
| `--ink` | `#19352B` | 主要文字 |
| `--muted` | `#617268` | 次要文字、對照組虛線 |
| `--brand` | `#315E43` | 品牌綠：按鈕、強調、圖表主色 |
| `--lime` / `--lime-soft` | `#D9EDAA` / `#EEF6DA` | 淺綠：步驟編號、提示底 |
| `--border` | `#DCE3D7` | 邊框、圖表格線 |
| `--accent` | `#EDB97B` | 橘：安全提示、準備中 |
| `--hot` | `#D9623B` | 加熱、融化（只用在跟「熱」有關的圖） |

- **圖解**：用 inline SVG 或 `site.js` 的元件，顏色用 CSS class。不使用 AI 生成的假照片。
- **emoji** 可以當卡片小圖示，但每頁的主要視覺（`#idea` 右邊）必須是元件或 SVG 圖。
- **版面**：桌面版 `#idea` 左文右圖；860 px 以下改成上下排。

---

## 10. 可用元件（複製即用）

`site.js` 依 `data-widget` 自動啟用元件。**新頁面優先用現有元件**；檢查腳本會擋下不存在的元件名稱。

**步驟（`#idea` 左邊）**——`id` 讓動畫可以同步標出目前步驟

```html
<ol class="steps" id="idea-steps">
  <li><strong>送線</strong>齒輪把塑膠線往噴頭裡推。</li>
</ol>
```

**重點卡片**

```html
<div class="cards">
  <article class="card"><p class="card-icon" aria-hidden="true">📏</p><h3>標題</h3><p>兩行內說明</p></article>
</div>
```

**比較表**（手機上會自動縮小間距）

```html
<div class="table-wrap"><table>
  <thead><tr><th>材料</th><th>摸起來像</th></tr></thead>
  <tbody><tr><td>PLA</td><td>硬硬的塑膠玩具</td></tr></tbody>
</table></div>
```

**提示框**

```html
<aside class="callout tip"><p class="callout-title">A竹提醒</p><p>…</p></aside>
<aside class="callout warn"><p class="callout-title">注意安全</p><p>…</p></aside>
```

**選擇題 `quiz`**（正確選項加 `data-correct`）

```html
<div class="quiz" data-widget="quiz">
  <p class="quiz-q">題目</p>
  <div class="quiz-options">
    <button type="button" data-correct>正確答案</button>
    <button type="button">錯誤答案</button>
  </div>
  <p class="quiz-explain" hidden>一句話解說</p>
</div>
```

**情境選擇器 `picker`**（點按鈕切換面板；面板不要加 `hidden`）

```html
<div class="widget picker" data-widget="picker">
  <div class="picker-options" role="group" aria-label="選擇步驟">
    <button type="button" data-pick="a">選項 A</button>
    <button type="button" data-pick="b">選項 B</button>
  </div>
  <div class="picker-panel" data-panel="a"><p class="panel-icon" aria-hidden="true">🧩</p><h3>…</h3><p>…</p></div>
  <div class="picker-panel" data-panel="b">…</div>
</div>
```

**列印動畫 `print-sim`**：噴頭融化塑膠線、一層一層疊出小花瓶；有播放、下一步、重來按鈕。`data-steps` 填左邊 `ol.steps` 的 id，動畫會依序標出第 1–4 步（送線、融化、畫線、疊層）。

```html
<div class="widget" data-widget="print-sim" data-steps="idea-steps"></div>
```

**六角形雷達圖 `radar`**：一次顯示一個項目，`data-ref` 的項目會畫成虛線當對照。分數放在按鈕上，順序和 `data-axes` 一樣；`data-note` 是一句話結論。

```html
<div class="widget" data-widget="radar" data-axes="好印程度,硬挺,耐摔,耐熱,彈性,便宜" data-max="5" data-ref="PLA">
  <div class="radar-options" role="group" aria-label="選擇耗材">
    <button type="button" data-series="PLA" data-values="5,4,2,1,1,5" data-note="一句話結論">PLA</button>
  </div>
</div>
```

`data-note` 只給螢幕閱讀器讀，畫面上不顯示。

**流程圖 `flow`**：五格畫面輪播（找模型 → 切片 → 送去印 → 等它印 → 取下來），像簡報動畫；左邊步驟會同步標出，點步驟也能切換。

```html
<div class="widget" data-widget="flow" data-steps="idea-steps"></div>
```

**模型剖面 `parts`**：剖面圖一次亮一個部分（外牆、填充、支撐、橋接）。按鈕順序要和左邊步驟一樣。

```html
<div class="widget" data-widget="parts" data-steps="idea-steps">
  <div class="parts-options" role="group" aria-label="選擇部分">
    <button type="button" data-part="walls">外牆</button>
    <button type="button" data-part="infill">填充</button>
    <button type="button" data-part="support">支撐</button>
    <button type="button" data-part="bridge">橋接</button>
  </div>
</div>
```

| `data-widget` | 用途 | 用在 |
|---|---|---|
| `print-sim` | 列印原理動畫 | 01 |
| `radar` | 六角形能力比較（最多 6 個軸，一次看一個） | 02 |
| `flow` | 五步流程畫面輪播 | 03 |
| `parts` | 模型剖面（外牆、填充、支撐、橋接） | 04 |
| `picker` | 點選項切換說明面板（只在文字真的比圖清楚時用） | 目前沒用到 |
| `quiz` | 考考你 | 每一頁 |

要新增元件時：在 `site.js` 的 `WIDGETS` 加一個函式，用 `data-widget="新名稱"` 啟用，在本節登記用法，並在 `log.md` 說明原因。

---

## 11. AI 修改守則

1. **先讀再改**：依序讀本文件 → `NOTES.md` → `lessons.js` → 要改的 `notes/` 和頁面。
2. **最小範圍**：只改任務需要的檔案。修改共用檔（`style.css`、`site.js`、`lessons.js` 的欄位）時，要在 `log.md` 寫原因，並跑檢查確認舊頁面沒壞。
3. **不刪除已發布的講義。** 要下架或改名前，先問作者。
4. **不新增外部依賴。** 不加追蹤碼、表單送出或外部 script。
5. **事實不確定時，先問。** 在回覆中列出問題，不要自己補數字。
6. **完成後回報**：說明改了哪些檔案、`python tools/check_site.py` 的結果，以及還沒驗證的部分。
7. **收工前更新 `NOTES.md`**：做到哪、下次從哪開始、新的待辦。作者說「之後要改」「下次記得」的事，當場寫進待辦。
8. **被糾正就寫進手冊**：作者這次糾正你的地方，如果以後都適用，整理成規則寫進本文件，並在 `log.md` 記一筆。

---

## 12. 完成定義（Definition of Done）

- [ ] `notes/<slug>.md` 與頁面內容一致，所有數字都有來源或標明「經驗起點」
- [ ] 頁面剛好五個區塊、順序正確，`#idea` 右邊有元件或圖
- [ ] 標題是問句，正文 400 字內，沒有副標、元件標題或說明小字
- [ ] `lessons.js` 已登記，`status: "published"`
- [ ] `python tools/check_site.py` 全部通過
- [ ] 首頁出現新卡片、上一頁／下一頁正確，375 px 寬沒有水平捲軸
- [ ] `log.md` 已新增紀錄，`NOTES.md` 已更新

---

## 13. 常見任務範例

| 作者說 | AI 應該做 |
|---|---|
| 「新增 05 第一次列印要注意什麼」 | 05 已是 planned → 沿用 `05-first-print-tips`，照第 6 節 SOP 完成 |
| 「我想加一頁講怎麼選噴嘴」 | 先確認新手真的會問 → 用下一個編號、問句標題建新條目 → 照 SOP 完成 |
| 「這頁字太多了」 | 先刪重複或進階的內容；還是太多就把文字改成表格、卡片或元件 |
| 「想要一個新的動畫」 | 在 `site.js` 加元件、在第 10 節登記、在 `log.md` 說明，並跑檢查 |
| 「更新 NOTES.md」 | 改寫狀態表和「下次從這裡開始」，刪掉做完的待辦，加上新待辦 |

### 交辦範本（作者可以直接複製）

交辦時講清楚三件事：**成品、限制、驗收**。

> 請依照 CLAUDE.md 新增「05 第一次列印要注意什麼？」。
> **成品**：`notes/05-first-print-tips.md` 和 `lessons/05-first-print-tips/index.html`，`lessons.js` 改成 published。
> **限制**：寫給完全沒碰過 3D 列印的人；像簡報一樣，不加副標和說明小字；右邊要有一張真的畫出內容的圖或元件；數字只能用拓竹中文 Wiki 或標明「經驗起點」；需要我親身經驗的地方留 TODO。
> **驗收**：開工前先給我看 notes 大綱；做完 `python tools/check_site.py` 全部通過、375 px 沒有水平捲軸，`log.md` 和 `NOTES.md` 都已更新。
