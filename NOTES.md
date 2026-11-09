# NOTES.md：現在做到哪

> 這份是「目前進度」的白板，不是規則。**每次收工前都要更新**，讓下一個對話（不管是人還是 AI）不用翻聊天紀錄就能接手。
>
> - 長期規則 → `CLAUDE.md`（很少改）
> - 已經做了、會影響之後的決定 → `log.md`（只在最上方新增，不刪）
> - 現況、下一步、待辦、還沒決定的事 → **本檔**（隨時改寫，保持短，做完就刪）

最後更新：2026-11-10

---

## 目前狀態

| 編號 | slug | `notes/` | 頁面 | `lessons.js` | 右邊的圖 |
|---|---|---|---|---|---|
| 01 | `01-how-it-prints` | ✅ | ✅ | published | `print-sim` 噴頭動畫 |
| 02 | `02-filament-types` | ✅ | ✅ | published | `radar` 六角形雷達圖 |
| 03 | `03-model-to-print` | ✅ | ✅ | published | `flow` 五格畫面輪播 |
| 04 | `04-model-parts` | ✅ | ✅ | published | `parts` 模型剖面 |
| 05 | `05-first-print-tips` | — | — | planned | 還沒決定 |

- 2026-11-10：照作者回饋改成「簡報式」：拿掉副標、小標題、元件標題和說明小字；01 拿掉「注意安全」；03 改用畫面輪播；新增 04；來源全部換成拓竹中文 Wiki（原因見 `log.md`）。
- `python tools/check_site.py`：全部通過。
- 網站：https://blind-us.github.io/azul-3dprint-notes/

## 下次從這裡開始

- 依 `CLAUDE.md` 第 6 節新增 05「第一次列印要注意什麼？」（作者說「列印注意事項一樣保持」）。開工前先給作者看 notes 大綱，並問右邊要畫什麼。
- 中文 Wiki 可能用得到的頁面：`/zh/a1/manual/faq`（取件、耗材）、`/zh/software/bambu-studio/layer-height`（層高，W9 還沒用）。

## 待辦

- [ ] 作者補照片或影片（頁面裡的 `TODO(作者)`）：01 實際列印、02 四種耗材實物、03 Bambu Studio 切片截圖、04 切開的模型。
- [ ] 作者依自己的經驗確認 02 六角形的分數。

## 還沒決定／要問作者

- 05 要不要加「第一層長怎樣才對」的照片對照？需要作者自己拍。
