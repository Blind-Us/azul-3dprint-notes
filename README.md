# A竹 3D列印入門

「A竹's 3D列印實驗室」的新手入門，寫給**完全沒碰過 3D 列印的人**。每頁只回答一個新手會問的問題，用動畫、圖表和一題小測驗帶你看懂。

## 一次帶你看完

👉 **[新手入門簡報：從一捲線到第一個成品](https://blind-us.github.io/azul-3dprint-notes/slides/)**

像投影片一樣一頁一頁翻（點右邊下一頁、點左邊上一頁，也可以用滾輪），十分鐘看完：

1. 3D 列印怎麼印出來？
2. 第一捲耗材怎麼選？（PLA、PETG、TPU、ABS 各一頁，最後一起比較）
3. 從模型到成品要幾步？
4. 模型裡有哪些部分？
5. 第一次列印要注意什麼？

最後附三題小測驗，以及「幕後」：AI 怎麼把我的資料變成這份簡報。

## 講義網站

想慢慢看、自己動手點的話，每個問題都有一頁互動講義：

- 網站首頁：https://blind-us.github.io/azul-3dprint-notes/
- [01 3D 列印怎麼印出來？](https://blind-us.github.io/azul-3dprint-notes/lessons/01-how-it-prints/)：噴頭動畫，一層一層印出小花瓶
- [02 耗材怎麼分？](https://blind-us.github.io/azul-3dprint-notes/lessons/02-filament-types/)：四種耗材的六角形雷達圖，可以疊在一起比
- [03 從模型到成品要幾步？](https://blind-us.github.io/azul-3dprint-notes/lessons/03-model-to-print/)：找模型、切片、送去印、等它印、取下來
- [04 模型裡有哪些部分？](https://blind-us.github.io/azul-3dprint-notes/lessons/04-model-parts/)：外牆、填充、支撐、橋接的剖面圖
- [05 第一次列印要注意什麼？](https://blind-us.github.io/azul-3dprint-notes/lessons/05-first-print-tips/)：開印前依序檢查的五個地方

## 作品與客製化

想看我印過的作品，或想請我幫你印、幫你設計：

- 作品與客製網站：https://blind-us.github.io/azul-3dlab/
- Instagram：[@azul_3dlab](https://www.instagram.com/azul_3dlab/)

## 我怎麼和 AI 一起做這些內容

分成兩步：

1. **先整理成知識庫**：和 AI 討論讀者是誰、要回答哪些問題，再把拓竹官方 Wiki 整理成 5 篇筆記（[`notes/`](notes/)），每句重點都標上來源。
2. **再一頁一頁做出來**：每個問題跑一輪「查筆記 → 寫重點並標來源 → 做成頁面 → 自動檢查 → 用新手的眼光試讀 → 我確認」，不通過就退回該修的那一步。

幾個一直遵守的原則：

- **寫給新手**：標題用問句、字少圖多，每頁都要有一張圖或一個互動元件。
- **像簡報一樣**：標題加畫面就夠了，讓畫面自己說話。
- **每句話都有出處**：官方說法、自己算的、自己的經驗，三種分開標清楚。
- **被糾正就寫成規則**：我改過的地方寫進 [`CLAUDE.md`](CLAUDE.md)，下一頁 AI 就會照做；修改過程記在 [`log.md`](log.md)。

## 部署

純靜態網頁，以 GitHub Pages（`main` 分支根目錄）部署，推上 `main` 就會更新網站。

## 來源與授權說明

官方說法和數字來自拓竹（Bambu Lab）官方 Wiki 中文版，詳見 [`sources/official-sources.md`](sources/official-sources.md)。本站只引用數字並用自己的話改寫，原文版權屬於 Bambu Lab。
