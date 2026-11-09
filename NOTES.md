# NOTES.md：現在做到哪

> 這份是「目前進度」的白板，不是規則。**每次收工前都要更新**，讓下一個對話（不管是人還是 AI）不用翻聊天紀錄就能接手。
>
> - 長期規則 → `CLAUDE.md`（很少改）
> - 已經做了、會影響之後的決定 → `log.md`（只在最上方新增，不刪）
> - 現況、下一步、待辦、還沒決定的事 → **本檔**（隨時改寫，保持短，做完就刪）

最後更新：2026-11-09

---

## 目前狀態

| 編號 | slug | `notes/` | 頁面 | `lessons.js` |
|---|---|---|---|---|
| 01 | `01-fdm-workflow` | ✅ | ✅ | published |
| 02 | `02-design-for-printing` | ✅ | ✅ | published |
| 03 | `03-slicing-basics` | ✅ | ✅ | published |
| 04 | `04-first-layer` | ✅ | ✅ | published |
| 05 | `05-choosing-filament` | — | — | planned |
| 06 | `06-post-processing` | — | — | planned |

- `python tools/check_site.py`：全部通過（2026-11-09）。
- 網站：已上線 https://blind-us.github.io/azul-3dprint-notes/ （GitHub Pages，`main`／根目錄，2026-11-09 開啟）。

## 下次從這裡開始

- 依 `CLAUDE.md` 第 6 節新增 05「耗材怎麼選」：先查官方資料、寫 notes 大綱給作者看，再做頁面。

## 待辦

- [ ] 作者補照片（頁面裡的 `TODO(作者)`）：01 從建模到成品的實際流程、02 作品或配合件、04 第一層「正常／太低／太高」對照。
- [ ] 05：先把 PLA、PETG、TPU 的官方資料登記到 `sources/official-sources.md`，再寫 `notes/05-choosing-filament.md`。
- [ ] 06：等作者說明實際用的後處理工具與步驟再寫，不要自己補。

## 還沒決定／要問作者

- 05 要不要放 TPU 的列印參數？要先確認 A1 的官方 TPU 預設，還有作者自己有沒有印過。
