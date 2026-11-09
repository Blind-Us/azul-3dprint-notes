# A竹 3D列印講義庫

「A竹's 3D列印實驗室」的公開講義網站。內容依照實際的 3D 列印工作流（建模 → 切片 → 列印 → 排錯 → 後處理）整理，以 Bambu Lab A1 為例，一篇講義只解決一個問題。

- 網站：https://blind-us.github.io/azul-3dprint-notes/
- 姊妹站（作品與客製）：https://blind-us.github.io/azul-3dlab/
- AI 協作規則：[`CLAUDE.md`](CLAUDE.md)（其他 agent 請看 [`AGENTS.md`](AGENTS.md)）
- 目前進度與待辦：[`NOTES.md`](NOTES.md)

## 目前的講義

| 編號 | 主題 | 狀態 |
|---|---|---|
| 01 | 從點子到成品：FDM 列印工作流 | 已發布 |
| 02 | 為列印而設計：懸空、方向與配合間隙 | 已發布 |
| 03 | 切片入門：看懂 0.20mm Standard | 已發布 |
| 04 | 第一層與附著：列印失敗先查這裡 | 已發布 |
| 05 | 耗材怎麼選：PLA、PETG、TPU | 規劃中 |
| 06 | 後處理：去支撐、打磨與試裝 | 規劃中 |

最新狀態以 [`assets/js/lessons.js`](assets/js/lessons.js) 為準。

## 這個專案的設計重點

這個專案不只是做出一個網頁，而是建立一套規則，讓 AI 之後能照同一套方式持續增加講義：

1. **一份清單管全站**：`assets/js/lessons.js` 是唯一資料來源。首頁卡片、篩選、上一篇／下一篇都從這裡自動產生。
2. **固定的頁面骨架**：每篇講義都從 `lessons/_template/` 複製，固定有 8 個區塊（學完你會、觀念、動手做、檢查清單、常見問題、自我檢查、來源）。
3. **內容先行**：先在 `notes/<slug>.md` 寫好文字和來源，再做成網頁。
4. **數值要有來源**：官方數值附上拓竹 Wiki 或 Bambu Studio 預設檔的連結；經驗值標明「經驗起點」。
5. **可以自動檢查**：`python tools/check_site.py` 會檢查清單、段落順序、連結和技術限制，不合規則就會失敗。

## 新增一篇講義（摘要）

```text
notes/_template.md        → 複製成 notes/NN-slug.md，先寫內容與來源
lessons/_template/        → 複製成 lessons/NN-slug/，填入內容
assets/js/lessons.js      → 新增或更新條目，status 改成 "published"
python tools/check_site.py → 全部通過
log.md                    → 在最上方寫紀錄
NOTES.md                  → 更新狀態、下一步和待辦
```

完整規則見 [`CLAUDE.md`](CLAUDE.md) 第 6 節。

## 本機預覽

不需要安裝任何東西。直接用瀏覽器打開 `index.html` 即可；或在專案根目錄執行：

```bash
python -m http.server 8000
```

然後打開 http://localhost:8000 。

## 技術

純靜態 HTML／CSS／JavaScript，沒有框架、建置工具或外部依賴，以 GitHub Pages（`main` 分支根目錄）部署。

## 來源與授權說明

講義中的官方數值來自 Bambu Lab 官方 Wiki 與 Bambu Studio 官方預設檔，詳見 [`sources/official-sources.md`](sources/official-sources.md)。本站只引用數值並改寫說明，原文版權屬於 Bambu Lab。
