# 開發紀錄

新紀錄寫在最上方。格式：日期｜做了什麼｜為什麼。

## 2026-11-09｜依 SOP 新增 03 從模型到成品要幾步？
- 驗證新版 CLAUDE.md 第 6 節 SOP：03 原本就是 planned，沿用 slug `03-model-to-print`。
- 先寫 `notes/03-model-to-print.md`，再從 `lessons/_template/` 複製頁面，只改 ★ 的地方；只用現有元件（picker、quiz），沒有改任何共用檔。
- 登記前跑檢查：腳本提示「planned 但已經有資料夾」；改成 published 後 217 項全部通過。375 px 沒有水平捲軸；首頁卡片和 02 的「下一頁」自動出現 03。
- 留下 TODO(作者)：自己在 Bambu Studio 切片的螢幕截圖。

## 2026-11-09｜改版成新手入門版
- **作者的糾正**：舊版 01–04 假設讀者已經懂 3D 列印，字很多、偏學術（參數名稱、切片設定、第一層排錯）。作者希望給完全沒接觸過的人看：講列印原理（噴頭動畫）、耗材怎麼分（比較表＋六角形雷達圖），字少圖多。
- 依「被糾正就寫進手冊」，把這次的糾正改成規則寫進 `CLAUDE.md`：讀者是完全新手、標題用問句、正文 400 字內、每頁 `#idea` 右邊一定要有元件或圖、不放參數名稱、術語用生活比喻解釋。
- 頁面結構從 8 個區塊簡化成 5 個：頁首、`#idea`（左文右圖）、`#points`、`#quiz`（一題）、`#sources`（摺疊）。
- `site.js`：移除 checklist、overhang-sim、fit-calc、layer-calc、目錄與閱讀進度；新增 `print-sim`（列印原理動畫，會同步標出左邊的步驟）和 `radar`（六角形雷達圖，一次看一種，對照組畫虛線）。
- `lessons.js`：移除 `stage`、`level`、`tags`，新增 `icon`。
- `tools/check_site.py`：改成檢查五個區塊、問句標題、字數上限、`#idea` 有沒有視覺、元件名稱是否存在、講義頁不得寫自己的 `<script>`。
- 經作者同意，移除舊版 01–04（網站上線不到一天，還沒有外部連結；內容保留在 git 歷史 commit `69c5ccc` 以前）。編號從 01 重新開始，這是一次性的例外。
- 網站名稱從「A竹 3D列印講義庫」改成「A竹 3D列印入門」。

## 2026-11-09｜加入 NOTES.md 與交辦範本
- 參考課堂示範講義庫（diveai-lessons）的做法，新增 `NOTES.md` 現況白板，記錄做到哪、下次從哪開始、待辦和要問作者的事。
- `CLAUDE.md`：開頭加讀檔順序和「一分鐘速覽」（這裡是什麼／我的習慣／不能做的事／做完要）；第 3 節加三份記憶檔的分工；8.1 加全形標點規則；第 6、11、12 節加「收工更新 NOTES.md」和「被糾正就寫進手冊」；第 13 節加交辦範本（成品／限制／驗收）。
- `tools/check_site.py`：根目錄必要檔案加入 `NOTES.md`。`AGENTS.md`、`README.md` 同步更新。
- 原因：AI 每開一個新對話都不記得上次的進度，把進度寫成檔案，下一次才能直接接手。

## 2026-11-09｜依 SOP 新增 04 第一層與附著
- 驗證 CLAUDE.md 第 6 節 SOP 是否可行：04 原本就是 planned 條目，沿用 slug `04-first-layer`。
- 步驟 2：先寫 `notes/04-first-layer.md`，官方數值標註 W2、W3、P2、P5、P6；經驗內容標「經驗通則／經驗起點」。
- 步驟 3：以 `lessons/_template/` 的 8 個固定區塊建立 `lessons/04-first-layer/index.html`，只用既有元件（picker、checklist、quiz），沒有改共用檔。
- 步驟 4–5：登記前執行檢查，腳本提示「planned 但已有資料夾」；把 `lessons.js` 的 status 改成 published 後重跑，301 項檢查全部通過。首頁卡片、03 的「下一篇」都自動出現 04。
- 留下 TODO(作者)：第一層好／壞的對照照片要由作者自己拍。
- 原因：確認新講義只需要動 notes、lessons/<slug>、lessons.js、log.md 四個地方。

## 2026-11-09｜建立講義庫框架與 01–03
- 建立 `CLAUDE.md`（專案規則）、`AGENTS.md`（給其他 agent 的入口）、`README.md`。
- 建立共用檔：`assets/css/style.css`（A竹 品牌 tokens）、`assets/js/lessons.js`（講義清單）、`assets/js/site.js`（首頁卡片、目錄、上下篇、元件）。
- 建立範本：`lessons/_template/index.html`、`notes/_template.md`；建立檢查腳本 `tools/check_site.py`。
- 依「內容先行」完成 01 FDM 工作流、02 為列印而設計、03 切片入門。官方數值來自拓竹 Wiki 與 Bambu Studio 預設檔（commit 79df7ae，擷取 2026-11-01），整理在 `sources/official-sources.md`。
- 04–06 先登記為 planned，之後依照 SOP 逐篇完成。
- 原因：讓之後新增講義時，只要照 SOP 走就能保持一致的格式、來源標準與視覺風格。
