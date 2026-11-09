# AGENTS.md

本專案的 AI 規則只維護一份：**[`CLAUDE.md`](CLAUDE.md)**。
Codex、Cursor 或其他 agent 開始工作前，請依序閱讀 `CLAUDE.md` → `NOTES.md`（現在做到哪）→ `log.md`，並遵守 `CLAUDE.md` 的所有規則。

這份檔案只是入口。如果它和 `CLAUDE.md` 有衝突，以 `CLAUDE.md` 為準。

## 最重要的 6 條（摘要）

1. 讀者是**完全沒碰過 3D 列印的人**：一頁回答一個問題，標題用問句，正文 400 字內，每頁都要有動畫、互動元件或圖。像影片裡的簡報：不加副標、元件標題或說明小字，讓畫面自己說話。
2. 純靜態 HTML／CSS／JS，不加外部依賴，路徑一律相對；講義頁不寫自己的 `<script>`，互動只用 `site.js` 的元件。
3. 講義清單只維護 `assets/js/lessons.js`，首頁卡片不要手寫。
4. 新增講義依照 SOP：`notes/<slug>.md` → 從 `lessons/_template/` 複製頁面 → 登記 `lessons.js` → `python tools/check_site.py` → `log.md` → 收工前更新 `NOTES.md`。
5. 每頁固定五個區塊：`header.lesson-hero`、`#idea.split`（左文右圖）、`#points`、`#quiz`（一題）、`#sources`。
6. 數字只能是「官方數值（附拓竹中文 Wiki 來源）」或「經驗起點（在資料來源標明相對比較）」，不捏造作品、照片或數據。
