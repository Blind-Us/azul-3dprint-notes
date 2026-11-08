---
slug: 03-slicing-basics
title: 切片入門：看懂 0.20mm Standard
stage: 切片
level: 入門
minutes: 10
status: published
updated: 2026-11-09
---

# 切片入門：看懂 0.20mm Standard

## 一句話摘要
從 Bambu Studio 官方預設檔認識層高、牆、頂底層和填充，知道什麼時候該改。

## 這篇要解決的問題
切片軟體的參數有好幾百個，新手不知道哪些重要、哪些不要動。先看懂官方預設，再一次只改一個。

## 學完你會（#goals）
- 比較 0.12 Fine、0.20 Standard、0.28 Extra Draft 三種層高
- 讀懂 0.20mm Standard 裡最重要的 10 個參數
- 依照用途決定先改哪一個參數
- 分清楚「製程設定」和「耗材設定」

## 觀念段落
### 層高：外觀和時間的取捨（id: layer-height）
- A1 0.4 mm 噴嘴：最小層高 0.08 mm、最大 0.28 mm（P1 min_layer_height / max_layer_height）
- 官方預設：0.12mm Fine（P3）、0.20mm Standard（P2）、0.28mm Extra Draft（P4）
- 層越薄：斜面、曲面的階梯紋越細，但層數越多、時間越長

### 0.20mm Standard 參數一次看懂（id: profile）
| 參數 | 值（P2） | 白話 |
|---|---|---|
| layer_height | 0.2 | 每層 0.2 mm |
| initial_layer_print_height | 0.2 | 第一層高度 |
| line_width | 0.42 | 一條線的寬度 |
| initial_layer_line_width | 0.5 | 第一層線較寬，黏得更牢 |
| wall_loops | 2 | 外牆圈數 |
| top_shell_layers / top_shell_thickness | 5 / 1.0 | 頂面實心層數／最小厚度 |
| bottom_shell_layers | 3 | 底面實心層數 |
| sparse_infill_density | 15% | 內部填充密度 |
| sparse_infill_pattern | grid | 填充圖案 |
| initial_layer_speed | 50 | 第一層速度 mm/s |
| outer_wall_speed | 200 | 外牆速度 mm/s |
| support_type | tree(auto) | 支撐類型 |

### 依用途先改哪一個（id: what-to-change）
- 外觀件：層高往 0.12 方向調（經驗起點）
- 受力件：先加牆層數（例如 3–4 圈），再考慮填充（經驗起點）
- 只是驗證尺寸的草稿：0.28 Extra Draft
- 一次只改一個參數，並記錄結果

### 製程設定 vs 耗材設定（id: filament）
| 項目 | PLA Basic（P5） | PETG HF（P6） |
|---|---|---|
| 噴嘴溫度 | 220 °C（範圍 190–240） | 240 °C，第一層 230 °C（範圍 230–270） |
| 紋理 PEI 板溫度 | 65 °C | 70 °C |
| 最大體積流量 | 21 mm³/s | 18 mm³/s |
| 冷卻風扇最大 | 80% | 50% |
- 新手先用官方耗材預設，不要一開始就自己調溫度

## 動手做（#practice）
- layer-calc：輸入模型高度，比較三種層高的層數
- 步驟：同一個模型切三次，記錄預估時間

## 列印前檢查清單（#checklist）
- [ ] 印表機選 Bambu Lab A1 0.4 nozzle
- [ ] 耗材選對應的官方預設
- [ ] 製程選對用途（Fine／Standard／Extra Draft）
- [ ] 一次只改一個參數，並寫下改了什麼
- [ ] 切片後用預覽檢查支撐和第一層
- [ ] 確認預估時間和耗材量可以接受

## 常見問題（#troubleshoot）
| 症狀 | 可能原因 | 先試什麼 |
|---|---|---|
| 斜面階梯紋明顯 | 層高太大 | 改 0.12 Fine，或調整擺放方向 |
| 頂面有破洞、凹凸 | 頂層不夠 | 增加頂層數 |
| 零件太弱 | 牆太少 | 先加牆層數 |
| 時間太長 | 層高太小或填充太高 | 草稿用 0.28 Extra Draft |
| 改了很多參數變更糟 | 同時改太多 | 回到官方預設，一次改一個 |

## 自我檢查（#quiz）
1. 想讓零件更堅固，先改什麼？（O）牆層數
2. 30 mm 高、層高 0.2 mm，約幾層？（O）150 層

## 來源（#sources）
- P1、P2、P3、P4、P5、P6（見 sources/official-sources.md）
- 「先加牆再加填充」「外觀件用細層高」為經驗起點
