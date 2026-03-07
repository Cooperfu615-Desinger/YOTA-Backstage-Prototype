# Architecture Review & Remediation Planning
>
> **專案**：Yota iGaming 後台管理系統 Prototype  
> **匯出時間**：2026-03-07 22:32  
> **目標**：整理成可交付給前端夥伴接手的 baseline

---

## A. 專案現況總結

**整體評估**：結構基本完整，核心架構（單一 `AppLayout.vue`、Vue Router Hash Mode、Pinia Auth Store、PrimeVue Aura Dark）選擇合理。主要問題集中在 **「開發過程中殘留的歷史碎片」**——幾個模組留下空殼目錄、router 與 sidebar 有名稱不對稱、文件嚴重落後於程式碼。

**規模**：17 個 view 目錄、595 行 router、~115 個 `.vue` 檔案、1 個 composable、1 個 Pinia store

**Build 狀態**：Vite bundle 成功（Exit 0），但 `vue-tsc` 有反覆出現的 `TypeError: Cannot read properties of undefined (reading 'ns')`，為 **vue-language-core 的 known bug**，不阻擋 runtime，需記錄。

---

## B. 模組總表

| # | Sidebar 標題 | Router 前綴 | Views 目錄 | 狀態 |
|---|-------------|------------|-----------|------|
| 1 | 儀表板 | `/dashboard` | `Dashboard/` | ✅ 完整 |
| 2 | 人員管理 | `/operators` | `Operators/` | ✅ 完整 |
| 3 | 系統設定 | `/system-settings` | `SystemSettings/` | ✅ 完整 |
| 4 | 訊息管理 | `/messages` | `Messages/` | ✅ 完整 |
| 5 | 會員管理 | `/members` | `Members/` | ✅ 完整 |
| 6 | 版面設定 | `/layout` | `Layout/` | ⚠️ 含 5 個孤兒 stub |
| 7 | 官網管理 | `/official` | `Official/` | ✅ 完整 (最新模組) |
| 8 | 代理管理 | `/agents` | `Agents/` | ✅ 完整 |
| 9 | 財務管理 | `/finance` | `Finance/` | ⚠️ 含 1 stub；router parent 混用 |
| 10 | 遊戲管理 | `/games` | `Games/` | ✅ 完整 |
| 11 | 推廣活動 | `/promotions` | `Promotions/` | ✅ 完整 |
| 12 | 報表管理 | `/reports` | `Reports/` | ✅ 完整 |
| 13 | 金流平台 | `/payments` | `Payments/` | ⚠️ 借用 `CashFlow/Merchants.vue` |
| ❌ | 無 Sidebar 入口 | `/game-maintenance` | `GameMaintenance/` | 🔴 Router 有 4 條路由但 sidebar 無入口，3 個是 stub |
| ❌ | 無 Sidebar 入口 | —— | `CashFlow/` | 🔴 3 個檔案，只有 Merchants.vue 被借用 |
| ❌ | 無 Sidebar 入口 | —— | `Financials/` | 🔴 3 個純 stub，無任何 router 引用 |

---

## C. 問題清單

### 🔴 P0：交付前必修

| ID | 問題 | 位置 | 說明 |
|----|------|------|------|
| P0-1 | **孤兒目錄 `Financials/`** | `src/views/Financials/` | 3 stubs (Audit, AutoFlow, Points) 完全未被 router 引用，純歷史殘留 |
| P0-2 | **`GameMaintenance/` router 有但 sidebar 無** | `src/views/GameMaintenance/` | 4 條 `/game-maintenance/*` 路由存在，但 sidebar 無入口，使用者進不去，其中 3 個是 stub |
| P0-3 | **`CashFlow/` 目錄責任模糊** | `src/views/CashFlow/` | `Merchants.vue` 被 `/payments/merchants` 借用，其餘 2 個是 stub。此目錄邊界不清 |
| P0-4 | **router `meta.parent` 混用** | `src/router/index.ts` | 審核類路由用 `parent: 'Financials'`，其他用 `parent: 'Finance'`，側邊欄展開會出錯 |
| P0-5 | **`Finance/Records.vue` 是 stub 但有路由** | `router/index.ts` | `/finance/records` 指向空殼且 sidebar 無入口 |
| P0-6 | **`PROJECT_SNAPSHOT.md` 嚴重過時** | 根目錄 | 缺 `Official/`、`Agents/`、`Messages/`；路徑與實際不符 |
| P0-7 | **`README.md` 結構樹缺 12 個模組** | 根目錄 | 實際 17 個模組，README 只列 6 個 |

### 🟡 P1：建議交付前處理

| ID | 問題 | 位置 | 說明 |
|----|------|------|------|
| P1-1 | **`Layout/` 含 5 個舊名 stub** | `src/views/Layout/` | 舊命名殘留檔案（如 Articles.vue），應刪除 |
| P1-2 | **`Games/` 與 `GameMaintenance/` 概念重疊** | 兩個目錄 | 職責邊界不明 |
| P1-3 | **財務相關目錄職責不清** | Finance/Payments/CashFlow | 需要清晰的 Domain 定義 |
| P1-4 | **`Layout/ArticleManagement` vs `Official/NewsList`** | 兩個目錄 | 都在做文章管理，區別不直觀 |
| P1-5 | **沒有 404 頁面** | `src/views/Pages/` | 訪問不存在路徑靜默失敗 |
| P1-6 | **`vue-tsc` TypeError 每次 build 出現** | Node Modules | Known bug，影響型別檢查信賴度 |
| P1-7 | **RBAC 選單過濾未實際生效** | `src/layout/AppLayout.vue` | 選單渲染未套用 `hasPermission` |

---

## D. 建議修改方案（分批次）

### Batch 0 — 決策前置 (不修改程式碼)

- 確認 `GameMaintenance/` 與 `CashFlow/` 的定位
- 確認 `/finance/records` 路由去留
- 書面定義內容管理頁面的業務邊界

### Batch 1 — 清理孤兒檔案 (低風險)

- 刪除 `Financials/` 目錄
- 刪除 `Layout/` 與 `CashFlow/` 下的無用 stub 檔案

### Batch 2 — 修復 Router 配置

- 統一 `meta.parent` 為 `Finance`
- 移除死路由

### Batch 3 — 文件對齊

- 更新 `README.md` 與 `PROJECT_SNAPSHOT.md`

### Batch 4 — 補齊基礎功能

- 新增 404 頁面與路由

### Batch 5 — RBAC 選單過濾

- 實作選單動態渲染

---

## E. 需 PM/架構師拍板的決策點

1. `GameMaintenance/` 模組：保留/合併/作廢？
2. `CashFlow/` 定位：歷史遺留/未來功能？
3. `/finance/records` 路由：是否需保留開發空間？
4. 業務邊界說明：`Official/NewsList` vs `Layout/ArticleManagement`
5. `GameMaintenance/Overview.vue`（有內容）的入口掛載點
6. RBAC 權限粒度設計確認

---
*Review by Antigravity — 2026-03-07*
