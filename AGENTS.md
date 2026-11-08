# AGENTS.md

本專案的 AI 規則只維護一份：**[`CLAUDE.md`](CLAUDE.md)**。
Codex、Cursor 或其他 agent 開始工作前，請先完整閱讀 `CLAUDE.md`，並遵守其中所有規則。

這份檔案只是入口。如果它和 `CLAUDE.md` 有衝突，以 `CLAUDE.md` 為準。

## 最重要的 6 條（摘要）

1. 純靜態 HTML／CSS／JS，不加任何外部依賴，所有路徑都用相對路徑。
2. 講義清單只維護 `assets/js/lessons.js`，首頁卡片不要手寫。
3. 新增講義依照 SOP：`notes/<slug>.md` → `lessons/<slug>/index.html`（從 `_template` 複製）→ 登記 `lessons.js` → `python tools/check_site.py` → `log.md`。
4. 講義頁固定 8 個區塊：`header.lesson-hero`、`#goals`、`.lesson-section`（至少 2 段）、`#practice`、`#checklist`、`#troubleshoot`、`#quiz`、`#sources`。
5. 數值只能是「官方數值（附來源）」或「經驗起點（標明要試印）」，不捏造作品、照片或數據。
6. 顏色只用 `style.css` 的 tokens，講義頁不寫 inline style。
