# A竹 3D列印入門

「A竹's 3D列印實驗室」的入門網站，寫給**完全沒碰過 3D 列印的人**。每頁只回答一個新手會問的問題，用動畫、圖表和一題小測驗帶你看懂，3 分鐘看完一頁。

- 網站：https://blind-us.github.io/azul-3dprint-notes/
- 姊妹站（作品與客製）：https://blind-us.github.io/azul-3dlab/
- AI 協作規則：[`CLAUDE.md`](CLAUDE.md)（其他 agent 請看 [`AGENTS.md`](AGENTS.md)）
- 目前進度與待辦：[`NOTES.md`](NOTES.md)

## 講義

講義列表和完成狀態只維護在 [`assets/js/lessons.js`](assets/js/lessons.js)，網站首頁會自動顯示；目前做到哪見 [`NOTES.md`](NOTES.md)。

## 這個專案的設計重點

這個專案的重點是那份規則手冊：寫清楚規則，讓 AI 之後能照同一套方式一直加新頁面。

1. **寫給誰看**：讀者是完全的新手，所以標題用問句、正文 400 字內、每頁都要有一張圖或一個互動元件。
2. **一份清單管全站**：`assets/js/lessons.js` 是唯一資料來源，首頁卡片和上一頁／下一頁都自動產生。
3. **固定的五個區塊**：問句標題 → 一張圖看懂（左文右圖）→ 重點 → 考考你 → 資料來源。
4. **內容先行**：先在 `notes/<slug>.md` 寫好文字和來源，再做成網頁。
5. **可以自動檢查**：`python tools/check_site.py` 會檢查結構、字數、元件名稱和連結，不合規則就會失敗。
6. **記得做到哪**：`NOTES.md` 記錄目前狀態和下一步，換一個對話也能接手。

## 新增一頁（摘要）

```text
notes/_template.md        → 複製成 notes/NN-slug.md，先寫內容與來源
lessons/_template/        → 複製成 lessons/NN-slug/，填入五個區塊
assets/js/lessons.js      → 新增或更新條目，status 改成 "published"
python tools/check_site.py → 全部通過
log.md                    → 在最上方寫紀錄
NOTES.md                  → 更新狀態、下一步和待辦
```

完整規則見 [`CLAUDE.md`](CLAUDE.md) 第 6 節。

## 本機預覽

不需要安裝任何東西。在專案根目錄執行：

```bash
python -m http.server 8000
```

然後打開 http://localhost:8000 。

## 技術

純靜態 HTML／CSS／JavaScript，沒有框架、建置工具或外部依賴，以 GitHub Pages（`main` 分支根目錄）部署。

## 來源與授權說明

官方說法和數字來自 Bambu Lab 官方 Wiki 與 Bambu Studio 官方預設檔，詳見 [`sources/official-sources.md`](sources/official-sources.md)。本站只引用數字並用自己的話改寫，原文版權屬於 Bambu Lab。
