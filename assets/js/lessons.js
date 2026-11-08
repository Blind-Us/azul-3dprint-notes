/* =========================================================
   講義清單：全站唯一資料來源（規則見 CLAUDE.md 第 5 節）
   - 首頁卡片、講義頁標籤、上一篇／下一篇都由這裡產生
   - 陣列順序 = 學習順序，新條目加在最後
   - status: "published" 已發布｜"planned" 規劃中（不需要資料夾）
   - 格式必須是合法 JSON（鍵加雙引號、不要結尾逗號、不要註解），檢查腳本才讀得到
   ========================================================= */

window.AZUL_STAGES = ["總覽", "建模", "切片", "列印", "材料", "後處理"];

window.AZUL_LESSONS = [
  {
    "no": "01",
    "slug": "01-fdm-workflow",
    "title": "從點子到成品：FDM 列印工作流",
    "summary": "先看懂整條路：建模、切片、列印、取件到後處理，每一步各自決定成品的什麼。",
    "stage": "總覽",
    "level": "入門",
    "minutes": 8,
    "tags": [
      "FDM",
      "Bambu A1",
      "工作流"
    ],
    "status": "published",
    "updated": "2026-11-09"
  },
  {
    "no": "02",
    "slug": "02-design-for-printing",
    "title": "為列印而設計：懸空、方向與配合間隙",
    "summary": "畫圖時就想好列印方向、懸空角度和孔軸間隙，少印幾次失敗品。",
    "stage": "建模",
    "level": "入門",
    "minutes": 12,
    "tags": [
      "Fusion 360",
      "懸空",
      "公差"
    ],
    "status": "published",
    "updated": "2026-11-09"
  },
  {
    "no": "03",
    "slug": "03-slicing-basics",
    "title": "切片入門：看懂 0.20mm Standard",
    "summary": "從 Bambu Studio 官方預設檔認識層高、牆、頂底層和填充，知道什麼時候該改。",
    "stage": "切片",
    "level": "入門",
    "minutes": 10,
    "tags": [
      "Bambu Studio",
      "層高",
      "填充"
    ],
    "status": "published",
    "updated": "2026-11-09"
  },
  {
    "no": "04",
    "slug": "04-first-layer",
    "title": "第一層與附著：列印失敗先查這裡",
    "summary": "第一層壞了整件就會壞。依症狀檢查板面、調平與噴頭固定。",
    "stage": "列印",
    "level": "入門",
    "minutes": 10,
    "tags": [
      "第一層",
      "PEI 板",
      "排錯"
    ],
    "status": "planned",
    "updated": "2026-11-09"
  },
  {
    "no": "05",
    "slug": "05-choosing-filament",
    "title": "耗材怎麼選：PLA、PETG、TPU",
    "summary": "依用途選材料：外觀、韌性、耐熱與彈性的取捨。",
    "stage": "材料",
    "level": "入門",
    "minutes": 10,
    "tags": [
      "PLA",
      "PETG",
      "TPU"
    ],
    "status": "planned",
    "updated": "2026-11-09"
  },
  {
    "no": "06",
    "slug": "06-post-processing",
    "title": "後處理：去支撐、打磨與試裝",
    "summary": "把印好的零件變成能交出去的成品。",
    "stage": "後處理",
    "level": "進階",
    "minutes": 12,
    "tags": [
      "支撐",
      "打磨",
      "試裝"
    ],
    "status": "planned",
    "updated": "2026-11-09"
  }
];
