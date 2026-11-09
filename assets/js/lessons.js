/* =========================================================
   講義清單：全站唯一資料來源（CLAUDE.md 第 5 節）
   - 首頁卡片、講義頁編號、上一頁／下一頁都從這裡產生。
   - 陣列內容必須是合法 JSON（鍵加雙引號、沒有結尾逗號、陣列裡不寫註解），
     因為 tools/check_site.py 會用 JSON 讀取。
   - 順序就是閱讀順序，新條目加在最後。
   ========================================================= */
window.AZUL_LESSONS = [
  {
    "no": "01",
    "slug": "01-how-it-prints",
    "icon": "🖨️",
    "title": "3D 列印怎麼印出來？",
    "summary": "看噴頭把塑膠線融化，一層一層疊成立體的東西。",
    "minutes": 3,
    "status": "published",
    "updated": "2026-11-10"
  },
  {
    "no": "02",
    "slug": "02-filament-types",
    "icon": "🧵",
    "title": "耗材怎麼分？",
    "summary": "PLA、PETG、TPU、ABS 差在哪？用六角形圖比比看。",
    "minutes": 4,
    "status": "published",
    "updated": "2026-11-10"
  },
  {
    "no": "03",
    "slug": "03-model-to-print",
    "icon": "🧩",
    "title": "從模型到成品要幾步？",
    "summary": "找模型、切片、列印、取下，五步看懂整個流程。",
    "minutes": 3,
    "status": "published",
    "updated": "2026-11-10"
  },
  {
    "no": "04",
    "slug": "04-model-parts",
    "icon": "🧱",
    "title": "模型裡有哪些部分？",
    "summary": "外牆、填充、支撐、橋接，切開來一次看懂。",
    "minutes": 3,
    "status": "published",
    "updated": "2026-11-10"
  },
  {
    "no": "05",
    "slug": "05-first-print-tips",
    "icon": "✅",
    "title": "第一次列印要注意什麼？",
    "summary": "開印前檢查五件事，避免第一次就失敗。",
    "minutes": 3,
    "status": "published",
    "updated": "2026-11-10"
  }
];
