# 交付前最低限度驗證報告
>
> **驗證時間**：2026-03-07 22:46  
> **驗證版本**：commit `3da0142` (最新)  
> **Dev Server**：`http://localhost:5174/YOTA-Backstage-Prototype/`（Port 5173 已被其他專案佔用）

---

## A. 已驗證項目

| 項目 | 方法 | 結果 |
|------|------|------|
| **Dev server 啟動** | `npm run dev --force`（清除 `.vite` 快取後） | ✅ 正常啟動，HMR 可用 |
| **Build（vue-tsc + vite）** | `npm run build` | ✅ Exit 0，EmptyState CDATA bug 已修復 |
| **vue-tsc --noEmit 獨立型別檢查** | 直接執行 | ✅ Zero errors（無輸出） |
| **EmptyState.vue SFC 合規** | 直接讀檔 + 修復 CDATA 包裝 | ✅ 已修復，是合法 SFC |
| **登入頁面** | 瀏覽器開啟 `/#/login` | ✅ 正常渲染，快速填入功能可用 |
| **Admin 登入** | 帳密 `admin / admin` | ✅ 成功跳轉至 Dashboard |
| **Finance 角色登入** | 帳密 `finance / 123456` | ✅ 可登入，無崩潰 |
| **Dashboard 路由** | `/#/dashboard/overview` | ✅ 正常渲染 |
| **Finance 路由** | `/#/finance/overview` | ✅ 正常渲染 |
| **Agents 路由** | `/#/agents/overview` | ✅ 正常渲染（直接輸入 URL 可進入） |
| **Official/Banners 路由** | `/#/official/banners` | ✅ 正常渲染 |
| **Payments 路由** | `/#/payments/overview` | ✅ 正常渲染 |
| **BannerConfig 拖曳排序** | 拖曳 Row 2 至 Row 1 上方 | ✅ **可操作，順序即時更新，無 Runtime Error** |
| **router meta.parent 靜態分析** | grep router/index.ts | ✅ 確認 `Financials` vs `Finance` 不一致（6 條路由受影響）|

---

## B. 未驗證項目

| 項目 | 原因 |
|------|------|
| 所有路由的逐一瀏覽器點擊測試（ops/pm/agent 角色） | 時間限制，瀏覽器已測試 2 個角色 |
| 各模組 Dialog / 表單送出流程 | 超出本輪範圍 |
| Members 詳細 Modal、Finance 審核流程 | 超出本輪範圍 |
| WebSocket / API 串接 | 尚未實作（Phase 2） |

---

## C. 發現的問題

### 🔴 Critical — 影響交付

**C-1：Agents 側邊欄路徑與 Router 不一致**

| 位置 | 路徑 |
|------|------|
| `AppLayout.vue` 選單（L364–368） | `/agent/overview`、`/agent/list`… (`agent` 單數) |
| `router/index.ts`（L285+） | `/agents/overview`、`/agents/list`… (`agents` 複數) |

**效果**：從側邊欄點擊「代理總覽」→ 導向 `/#/agent/overview`（無路由） → 空白頁/靜默失敗  
但直接在網址列輸入 `/#/agents/overview` 可以正常進入。  
**這個 bug 對從 UI 操作的使用者是完全不可見的入口。**

---

### 🟡 已知但不阻擋 — 需標注

**C-2：RBAC 選單過濾未實作**  
Finance 角色登入後側邊欄顯示內容與 Admin **相同**，所有 13 個模組全部可見。  
→ **已知狀態，需在交付說明中明確標注「未實作」**

**C-3：router `meta.parent` 混用 `'Finance'` vs `'Financials'`**  
靜態分析確認：手工存款、在線存款、提款審核、鎖單、資金流水、人工存提（共 6 條路由）的 `parent: 'Financials'`，而 sidebar watch 邏輯比對的是 `'Finance'`，導致訪問這些子頁時「財務管理」父層不自動展開高亮。

**C-4：`InputSwitch` 元件棄用警告**  
Console 出現大量 `Deprecated since v4. Use ToggleSwitch component instead`（每個 InputSwitch 實例各一條）。不影響運行但 log 雜亂。

---

## D. 建議先修清單（低風險，交付前）

| 優先 | 問題 | 修改方式 | 風險 | 影響檔案 |
|------|------|---------|------|---------|
| 🔴 必修 | **Agents 側邊欄路徑** | 將 L364–369 的 `/agent/` 改為 `/agents/` | 🟢 低 | `AppLayout.vue` 6 行 |
| 🔴 必修 | **Finance meta.parent 混用** | 將 6 條路由的 `parent: 'Financials'` → `parent: 'Finance'` | 🟢 低 | `router/index.ts` 6 行 |
| 🟡 建議 | **移除 `/finance/records` 死路由** | 刪除 stub 路由定義 | 🟢 低 | `router/index.ts` 5 行 |
| 🟡 建議 | **文件更新**（README + SNAPSHOT） | 補上 17 個模組、修正路徑 | 🟢 零 | 2 個 .md |
| 🟢 可以後做 | InputSwitch → ToggleSwitch | 批量替換（影響所有 view） | 🟡 中 | ~20 個 .vue |

---

## E. 交付前端夥伴的影響評估

| 面向 | 狀態 | 說明 |
|------|------|------|
| **Build 穩定性** | ✅ 可交付 | Vite + vue-tsc 均乾淨通過 |
| **Dev server 啟動** | ✅ 可交付 | 需先清 `.vite` 快取（`--force`） |
| **核心頁面渲染** | ✅ 可交付 | Dashboard/Finance/Payments/Official 等均可正常渲染 |
| **代理管理 sidebar 入口** | 🔴 修復後可交付 | 目前點擊無效（路徑 bug） |
| **財務管理 sidebar 高亮** | 🔴 修復後可交付 | meta.parent 不一致，子頁不展開 |
| **RBAC 選單過濾** | ⚠️ 需隨附說明 | 標注「未實作，所有角色看到相同選單」 |
| **文件** | ⚠️ 需更新 | README/SNAPSHOT 落後現況 2 個月 |
| **BannerConfig 拖曳** | ✅ 可交付 | 實際測試可正常操作，無 runtime error |

### 結論

**2 個 Critical Bug（Agents 路徑 + Finance meta.parent）修復後即可交付**。  
這兩個 bug 都是 1 檔案 < 10 行的字串修正，風險極低，建議立即執行。

---

*驗證執行 by Antigravity — 2026-03-07 22:46*
