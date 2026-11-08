# CLAUDE.md：A竹 3D列印講義庫

> 給 AI 的專案說明書。動手修改任何檔案前，請完整讀完本文件。
> 讀完後，你應該能做到：不用再問結構問題，就照固定格式新增或修改一篇講義，並確認沒有弄壞其他頁面。

---

## 1. 專案目的

「A竹 3D列印講義庫」是品牌「A竹's 3D列印實驗室」的公開學習網站。
它把 A竹 實際使用的 3D 列印工作流（**建模 → 切片 → 列印 → 排錯 → 後處理**）拆成一篇篇講義，每篇可以單獨閱讀。

- **讀者**：剛拿到 FDM 印表機的新手（以 Bambu Lab A1、0.4 mm 噴嘴為主要例子）、想把點子做成實物的玩家，以及 A竹 的客人。
- **每篇講義只解決一個問題**，就是「實際做東西時會卡住的地方」。讀者讀完要能馬上動手。
- **這個網站不是**產品型錄、報價頁或論壇。它不保證任何參數一定成功。

正式網址：`https://blind-us.github.io/azul-3dprint-notes/`
姊妹站（作品與客製）：`https://blind-us.github.io/azul-3dlab/`

---

## 2. 技術限制（不可違反）

1. **只用純靜態 HTML／CSS／JavaScript。** 不用框架、建置工具或 npm 套件，也不載入外部字型、CDN 或追蹤碼。
2. **部署方式**：GitHub Pages，`main` 分支、根目錄。根目錄必須保留 `.nojekyll`。
3. **路徑一律相對。** 網站要能在子路徑 `/azul-3dprint-notes/` 下運作，也要能直接雙擊 `index.html` 打開。所以**不要用 `fetch()` 讀 JSON**；講義清單放在 `assets/js/lessons.js`，用 `<script>` 載入。
4. **儲存只用 `localStorage`**（勾選清單、已讀標記），而且每次讀寫都要包在 `try/catch` 裡。儲存失敗時，頁面仍要正常使用。
5. **不得有表單送出、登入或後端呼叫。**

---

## 3. 資料夾結構

```text
azul-3dprint-notes/
├── CLAUDE.md               ← 本文件：AI 規則（唯一版本）
├── AGENTS.md               ← 給 Codex 等其他 agent 的入口，指向本文件
├── README.md               ← 給人看的專案介紹
├── index.html              ← 首頁：講義庫（卡片由 lessons.js 自動產生）
├── .nojekyll
├── assets/
│   ├── css/style.css       ← 全站唯一樣式表，設計 tokens 在 :root
│   ├── js/lessons.js       ← ★ 講義清單：唯一資料來源
│   ├── js/site.js          ← 共用互動：首頁卡片、目錄、上下篇、元件
│   └── img/                ← 全站共用圖片（logo、favicon）
├── lessons/
│   ├── _template/index.html        ← 新講義的頁面範本（不要刪）
│   └── NN-slug/index.html          ← 每篇講義一個資料夾
│       └── assets/                 ← 只屬於這篇講義的圖片（選用）
├── notes/
│   ├── _template.md        ← 講義文字草稿範本
│   └── NN-slug.md          ← 每篇講義的內容草稿與來源（內容先行）
├── sources/official-sources.md     ← 全站引用的官方來源與擷取日期
├── tools/check_site.py     ← 結構檢查腳本（Python 標準函式庫，不需安裝套件）
└── log.md                  ← 開發紀錄，新紀錄寫在最上方
```

---

## 4. 命名規則

| 項目 | 規則 | 例子 |
|---|---|---|
| 講義 slug | `NN-英文小寫-連字號`。NN 是兩位數編號，不用中文、空白或底線 | `04-first-layer` |
| 同一篇的檔案 | 下面四個地方都用同一個 slug | 見下方 |
| 講義專屬圖片 | `lessons/<slug>/assets/<slug>-<描述>.svg/png/jpg` | `02-design-for-printing-overhang.svg` |
| 共用圖片 | 只放 `assets/img/`，檔名英文小寫 | `logo.png` |
| Commit 訊息 | `lesson: add NN 主題`、`lesson: update NN 主題`、`site: 說明`、`docs: 說明` | `lesson: add 04 第一層與附著` |

同一個 slug 必須同時出現在這四個地方：

1. `notes/<slug>.md`
2. `lessons/<slug>/index.html`
3. `assets/js/lessons.js` 裡的 `slug` 欄位
4. 講義 HTML 的 `<body data-lesson="<slug>">`

**編號只增不改。** 已發布的講義不要重新編號，否則外部連結會失效。新主題一律用下一個號碼。

---

## 5. 講義清單 `assets/js/lessons.js`（唯一資料來源）

首頁卡片、講義頁的資訊標籤和「上一篇／下一篇」都由這份清單自動產生。
**絕對不要在 `index.html` 手寫講義卡片。**

兩個陣列（`AZUL_STAGES`、`AZUL_LESSONS`）的內容**必須是合法 JSON**：鍵要加雙引號、不要有結尾逗號、陣列裡不要寫註解。檢查腳本會用 JSON 方式讀取。

```json
{
  "no": "05",
  "slug": "05-choosing-filament",
  "title": "耗材怎麼選：PLA、PETG、TPU",
  "summary": "依用途選材料：外觀、韌性、耐熱與彈性的取捨。",
  "stage": "材料",
  "level": "入門",
  "minutes": 10,
  "tags": ["PLA", "PETG", "TPU"],
  "status": "planned",
  "updated": "2026-11-09"
}
```

| 欄位 | 規則 |
|---|---|
| `no` | 兩位數字串，等於清單中的順序，也等於 slug 開頭 |
| `slug` | 見第 4 節 |
| `title` | 必須與講義頁 `<h1>` 完全一致，`<title>` 也要以它開頭 |
| `summary` | 一句話，40 字內，說明讀完能解決什麼；同時當作 meta description |
| `stage` | 只能用 `AZUL_STAGES` 裡的值 |
| `level` | `入門` 或 `進階` |
| `minutes` | 預估閱讀分鐘數（數字） |
| `tags` | 2–4 個關鍵字 |
| `status` | `planned`（規劃中）或 `published`（已發布） |
| `updated` | 最後一次實質修改的日期，格式 `YYYY-MM-DD` |

- 階段 `AZUL_STAGES` 固定為：`總覽`、`建模`、`切片`、`列印`、`材料`、`後處理`。要新增階段，必須同時改 `lessons.js` 與本文件。
- 陣列順序就是學習順序，新條目加在最後。
- `planned` 的條目會在首頁顯示成「規劃中」卡片，不能點開，也不需要資料夾。

---

## 6. 新增一篇講義的流程（SOP）

依序執行，不要跳步：

1. **確認主題**：一篇只解決一個問題。先讀 `lessons.js`，確認沒有重複主題。如果主題已經是 `planned` 條目，沿用它的 slug 和編號。
2. **內容先行**：複製 `notes/_template.md` 成 `notes/<slug>.md`，先寫完所有文字、數值和來源。每個數值都要在「來源」區找得到出處（見第 8 節）。
3. **建立頁面**：複製 `lessons/_template/` 成 `lessons/<slug>/`，把 notes 的內容填進固定段落（見第 7 節）。必須改的地方：`<title>`、`<meta name="description">`、`data-lesson`、`<h1>`、各段內容。
4. **登記**：在 `lessons.js` 新增或更新條目，`status` 改成 `published`，填上 `updated` 日期。
5. **驗證**：執行 `python tools/check_site.py`，必須全部通過。接著用瀏覽器打開首頁和新講義，在 390 px 手機寬度下檢查，不能出現水平捲軸。
6. **紀錄**：在 `log.md` 最上方新增一筆，寫日期、改了什麼和原因。
7. **提交**：commit 訊息用 `lesson: add NN 主題`。

### 修改既有講義

- 先改 `notes/<slug>.md`，再改頁面，讓兩邊內容一致。
- 有實質內容修改時，更新 `lessons.js` 的 `updated`。
- 官方數值有更新時，同時更新 `sources/official-sources.md` 的擷取日期。

---

## 7. 講義頁面的固定結構

每篇講義都從 `lessons/_template/index.html` 複製出來，**段落順序和 id 不能改**，`tools/check_site.py` 會檢查。

| 順序 | 區塊 | 選擇器 | 必要 | 內容規則 |
|---|---|---|---|---|
| 1 | 頁首 | `header.lesson-hero` | 必要 | `<h1>` 與 `lessons.js` 的 title 完全相同，加一句 `.lesson-lead` 摘要。編號和標籤由 JS 自動帶入 |
| 2 | 學完你會 | `section#goals` | 必要 | 3–4 點，以動詞開頭（看懂…、判斷…、設定…） |
| 3 | 觀念段落 | `section.lesson-section`，id 自訂英文 | 至少 2 段 | 每段一個 `<h2>`，段內可用第 10 節的元件 |
| 4 | 動手做 | `section#practice` | 必要 | 至少一個互動元件，或一組 `ol.steps` 步驟 |
| 5 | 列印前檢查清單 | `section#checklist` | 必要 | `ul.checklist`，4–8 項，每項是可以打勾的具體動作 |
| 6 | 常見問題 | `section#troubleshoot` | 必要 | 三欄表格：症狀／可能原因／先試什麼 |
| 7 | 自我檢查 | `section#quiz` | 必要 | 1–3 題選擇題，每題都要有解說 |
| 8 | 來源 | `section#sources` | 必要 | 列出本篇所有官方數值的外部連結和擷取日期 |

- 頁面右側目錄（`[data-toc]`）由 JS 根據各段的 `<h2>` 自動產生，不用手寫。
- 頁尾的「上一篇／下一篇」（`[data-pager]`）由 JS 根據 `lessons.js` 自動產生，不用手寫。

---

## 8. 內容與寫作規則

### 8.1 語言與語氣

- 使用繁體中文和台灣用語：列印、耗材、熱床、噴嘴、切片軟體、支撐、列印板。
- 英文術語第一次出現時，用括號附上原文，例如「懸空（overhang）」。
- 語氣像學長在工作桌旁講解：用「你」，句子短，一段不超過 4 行。
- 先寫結論，再寫原因。

### 8.2 數值分三類（最重要的規則）

| 類別 | 定義 | 寫法 |
|---|---|---|
| **官方數值** | 來自拓竹官方 Wiki 或 Bambu Studio 官方預設檔 | 放進 `.callout.official` 或參數表，並在 `#sources` 列出處 |
| **經驗起點** | 社群常用的起點（例如懸空 45°、配合間隙 0.2 mm） | 文字標明「經驗起點」，並提醒讀者要先印測試件驗證 |
| **禁止** | 沒有來源、卻寫得像保證的數字 | 不准出現。不確定就不寫，或在回覆中問作者 |

### 8.3 不可捏造

- 不捏造 A竹 的作品、照片、實驗數據、客人回饋或個人經歷。
- 需要作者親身經驗的地方，留下 `<!-- TODO(作者): 說明要補什麼 -->`，由作者自己補。
- 機型以 Bambu Lab A1（0.4 mm 噴嘴）為主要例子。提到其他機型時，只能寫「概念相同，數值以該機型官方資料為準」。

### 8.4 安全

內容涉及高溫、拆裝噴頭或 ABS／ASA 的氣味時，必須加上 `.callout.warn`。

---

## 9. 視覺風格

- **調性**：A竹 的竹葉綠搭配米白，乾淨，像一本工程筆記本。
- **字型**：只用系統字型堆疊（已寫在 `--font`），不載入網路字型。
- **配色**：只用 `style.css` 的 `:root` tokens。**講義頁不得寫死色碼，也不得用 inline style**（SVG 圖內的屬性例外）。

| Token | 色碼 | 用途 |
|---|---|---|
| `--bg` | `#F7F8F2` | 頁面米白底 |
| `--surface` | `#FFFFFF` | 卡片、元件底 |
| `--ink` | `#19352B` | 主要文字（深綠黑） |
| `--muted` | `#617268` | 次要文字 |
| `--brand` | `#315E43` | 品牌綠：連結、按鈕、強調 |
| `--lime` | `#D9EDAA` | 淺綠：標籤、提示底 |
| `--border` | `#DCE3D7` | 邊框 |
| `--accent` | `#EDB97B` | 橘：警告、規劃中 |
| `--error` | `#A32C32` | 錯誤、答錯 |

- **版面**：內文最大寬度 72ch。桌面版是「內文＋右側目錄」兩欄，900 px 以下改成單欄。
- **圖解**：用 inline SVG 繪製，顏色用 `currentColor` 或 CSS 變數，並加 `<title>` 和 `role="img"`。不使用 AI 生成的假照片。

---

## 10. 可用元件（複製即用）

`site.js` 依照 `data-widget` 屬性自動啟用元件。**新增講義時優先用現有元件**，不要自己寫新的 `<script>`。

**提示框**

```html
<aside class="callout tip"><p class="callout-title">A竹提醒</p><p>…</p></aside>
<aside class="callout warn"><p class="callout-title">注意安全</p><p>…</p></aside>
<aside class="callout official"><p class="callout-title">官方數值｜來源名稱</p><p>…</p></aside>
```

**參數表**（手機會橫向捲動）

```html
<div class="table-wrap"><table class="param-table">
  <thead><tr><th>參數</th><th>官方預設</th><th>白話解釋</th></tr></thead>
  <tbody><tr><td><code>wall_loops</code></td><td>2</td><td>…</td></tr></tbody>
</table></div>
```

**步驟**

```html
<ol class="steps"><li><strong>動作</strong>：說明</li></ol>
```

**檢查清單**（勾選狀態存在 localStorage，`data-store` 填 slug）

```html
<ul class="checklist" data-widget="checklist" data-store="NN-slug">
  <li><label><input type="checkbox"> 具體動作</label></li>
</ul>
```

**選擇題**（正確選項加 `data-correct`）

```html
<div class="quiz" data-widget="quiz">
  <p class="quiz-q">題目</p>
  <div class="quiz-options">
    <button type="button" data-correct>正確答案</button>
    <button type="button">錯誤答案</button>
  </div>
  <p class="quiz-explain" hidden>解說</p>
</div>
```

**情境選擇器**（點按鈕，顯示對應的面板；面板不要加 `hidden`，JS 會預設選第一個，沒有 JS 時全部面板都看得到）

```html
<div class="picker" data-widget="picker">
  <div class="picker-options" role="group" aria-label="選擇情境">
    <button type="button" data-pick="a">情境 A</button>
    <button type="button" data-pick="b">情境 B</button>
  </div>
  <div class="picker-panel" data-panel="a">…</div>
  <div class="picker-panel" data-panel="b">…</div>
</div>
```

**專用元件的容器**（內容由 JS 產生，HTML 只要放空殼）

```html
<div class="widget" data-widget="fit-calc"><p class="widget-title">元件標題</p></div>
```

**專用計算／模擬元件**（`data-widget` 值）

| 值 | 用途 | 所在講義 |
|---|---|---|
| `overhang-sim` | 拖動角度，看懸空需不需要支撐（經驗起點） | 02 |
| `fit-calc` | 軸徑＋單邊間隙 → 孔的設計尺寸 | 02 |
| `layer-calc` | 模型高度 → 三種層高的層數比較 | 03 |

要新增元件時：在 `site.js` 的 `WIDGETS` 物件加一個函式，用 `data-widget="新名稱"` 啟用，並在本節表格登記。

---

## 11. AI 修改守則

1. **先讀再改**：依序讀本文件 → `lessons.js` → 要改的 `notes/` 和頁面。
2. **最小範圍**：只改任務需要的檔案。修改共用檔（`style.css`、`site.js`、`lessons.js` 的欄位結構）時，必須在 `log.md` 寫明原因，並跑檢查，確認舊講義沒壞。
3. **不刪除已發布的講義。** 要下架或改名前，先問作者。
4. **不新增外部依賴。** 不加追蹤碼、表單送出或外部 script。
5. **事實不確定時，先問。** 在回覆中列出問題，不要自己補數字。
6. **完成後回報**：說明改了哪些檔案、`python tools/check_site.py` 的結果，以及還沒驗證的部分（例如沒在手機上看過）。

---

## 12. 完成定義（Definition of Done）

下面每一項都要成立，才算完成：

- [ ] `notes/<slug>.md` 與頁面內容一致，所有數值都有來源或標明「經驗起點」
- [ ] 頁面有第 7 節的 8 個區塊，順序正確
- [ ] `lessons.js` 已登記，`status: "published"`，title 與 `<h1>` 一致
- [ ] `python tools/check_site.py` 全部通過
- [ ] 首頁出現新卡片，上一篇／下一篇正確，390 px 寬沒有水平捲軸
- [ ] `log.md` 已新增紀錄

---

## 13. 常見任務範例

| 作者說 | AI 應該做 |
|---|---|
| 「新增 05 耗材怎麼選」 | 05 已是 planned → 沿用 `05-choosing-filament`，照第 6 節 SOP 完成，`status` 改成 `published` |
| 「我想加一篇講間隙測試件」 | 確認沒有重複主題 → 用下一個編號建新條目 → 照 SOP 完成 |
| 「Bambu Studio 更新了，03 的預設值要換」 | 依新來源更新 `notes/03-…`、頁面參數表、`sources/official-sources.md` 擷取日期，以及 `updated` |
| 「首頁想多一個篩選方式」 | 改 `site.js` 和 `index.html`，在 `log.md` 說明，並跑檢查確認所有講義正常 |
