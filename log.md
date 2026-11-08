# 開發紀錄

新紀錄寫在最上方。格式：日期｜做了什麼｜為什麼。

## 2026-11-09｜建立講義庫框架與 01–03
- 建立 `CLAUDE.md`（專案規則）、`AGENTS.md`（給其他 agent 的入口）、`README.md`。
- 建立共用檔：`assets/css/style.css`（A竹 品牌 tokens）、`assets/js/lessons.js`（講義清單）、`assets/js/site.js`（首頁卡片、目錄、上下篇、元件）。
- 建立範本：`lessons/_template/index.html`、`notes/_template.md`；建立檢查腳本 `tools/check_site.py`。
- 依「內容先行」完成 01 FDM 工作流、02 為列印而設計、03 切片入門。官方數值來自拓竹 Wiki 與 Bambu Studio 預設檔（commit 79df7ae，擷取 2026-11-01），整理在 `sources/official-sources.md`。
- 04–06 先登記為 planned，之後依照 SOP 逐篇完成。
- 原因：讓之後新增講義時，只要照 SOP 走就能保持一致的格式、來源標準與視覺風格。
