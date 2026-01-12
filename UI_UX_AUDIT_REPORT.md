# 🔍 Antigravity 全站 UI/UX 深度檢視報告

> **Generated**: 2026-01-12  
> **Scope**: `/src/views` 全部模組

---

## 📊 審計摘要

| 維度 | 發現問題數 | 嚴重度 |
|:-----|:----------|:-------|
| 視覺一致性 | 8 項 | 🟡 中 |
| 元件統一性 | 6 項 | 🟠 中高 |
| 交互體驗 | 5 項 | 🟡 中 |
| 程式碼簡潔度 | 4 項 | 🟢 低 |

---

## 🎨 視覺一致性 (Visual Consistency)

### [視覺-1] 大量寫死的 HEX 色碼

**影響範圍**: 50+ 個檔案  
**嚴重度**: 🟠 中高

發現多個頁面直接使用寫死的 hex 色碼，而非 Tailwind 的 surface/semantic 色彩類別：

| 檔案 | 問題色碼 | 建議替換 |
|:-----|:---------|:---------|
| `Login.vue` | `#0f172a`, `#1e293b`, `#3b82f6` | `bg-surface-900`, `bg-primary-500` |
| `WebsiteAnalytics.vue` | `#94a3b8` | `text-surface-400` |
| `PlayerMonitoring.vue` | `#94a3b8` | `text-surface-400` |
| `OperationAnalytics.vue` | `#94a3b8` | `text-surface-400` |
| `Promotions/Overview.vue` | `#22c55e`, `#3b82f6`, `#eab308` | `text-green-500`, `text-blue-500`, `text-yellow-500` |
| `Members/Overview.vue` | 11 個 VIP 色碼 | 建議抽取為常量 |
| `Members/Tags.vue` | 8+ 個標籤色碼 | 建議建立 color palette |

**建議**：建立 `src/constants/colors.ts` 統一管理色彩變數。

---

### [視覺-2] Chart.js 圖表色彩未統一

**影響範圍**: Dashboard, Members, Promotions 模組  
**嚴重度**: 🟡 中

所有 Chart.js 圖表配置中的 `backgroundColor`, `borderColor`, `titleColor` 等屬性皆使用寫死的 hex 值。

**建議**：建立 `src/utils/chartTheme.ts` 統一圖表主題配色。

---

### [視覺-3] Offers.vue 自訂 Switch 色彩

**位置**: `Promotions/Offers.vue:127`  
**嚴重度**: 🟢 低

```css
:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) { background: #3b82f6; }
```

**建議**：使用 PrimeVue theme preset 或 CSS variable。

---

### [視覺-4] Column min-width 使用 inline style

**影響範圍**: 所有 DataTable (400+ 處)  
**嚴重度**: 🟡 中

```vue
<Column field="date" header="日期" style="min-width: 120px">
```

**建議**：定義 CSS class 如 `.col-date { min-width: 120px }` 以便統一管理。

---

### [視覺-5] 輸入欄位寬度不一致

**影響範圍**: Games, Platforms 模組  
**嚴重度**: 🟡 中

大部分頁面遵循 `w-[220px]` 標準，但以下例外：

| 檔案 | 實際寬度 | 應為 |
|:-----|:---------|:-----|
| `GameList.vue` | `w-[180px]`, `w-[140px]` | `w-[220px]` |
| `Platforms.vue` | `w-[200px]`, `w-[150px]` | `w-[220px]` |

---

### [視覺-6] Breadcrumb 僅有註解佔位符

**影響範圍**: 64 個頁面  
**嚴重度**: 🟢 低

所有頁面都有 `<!-- Breadcrumb -->` 註解，但實際上未渲染 Breadcrumb 元件。

**建議**：統一實作或移除註解。

---

### [視覺-7] Login 頁面 scoped style 過於客製化

**位置**: `Pages/Login.vue`  
**嚴重度**: 🟢 低 (可接受)

Login 頁面使用了大量自訂 CSS (glow effects, gradient backgrounds)，與其他頁面風格明顯不同。作為獨立登入體驗，這是設計決策而非缺陷。

---

### [視覺-8] SpecialEvents.vue 殘留註解 CSS

**位置**: `Promotions/SpecialEvents.vue:364-366`  
**嚴重度**: 🟢 低

```css
/* :deep(.p-selectbutton .p-button.p-highlight) { background: #3b82f6; ... } */
```

**建議**：移除已註解的無用程式碼。

---

## 🧩 元件統一性 (Component Uniformity)

### [元件-1] Dialog Footer 按鈕排列無規範

**影響範圍**: 34 個使用 Dialog 的檔案  
**嚴重度**: 🟠 中高

目前各 Dialog Footer 的按鈕排列方式不一致 (有的左對齊、有的右對齊、有的兩端分散)。

**建議**：建立 Dialog Footer 設計規範：

```
取消按鈕 (secondary)  |  確認按鈕 (primary)
```

統一右對齊，主按鈕放右側。

---

### [元件-2] ConfirmDialog 未全站啟用

**影響範圍**: 僅 6 個檔案使用  
**嚴重度**: 🟡 中

目前只有 Finance 模組和 Layout/Overview 有使用 `ConfirmDialog`，其他刪除/危險操作未一致使用。

**建議**：所有刪除、停用、強制解鎖等操作統一使用 `ConfirmDialog`。

---

### [元件-3] 無統一的 Empty State 元件

**影響範圍**: 全站  
**嚴重度**: 🟠 中高

- 未使用 DataTable 的 `emptyMessage` 屬性
- 無 "資料為空" 的視覺回饋
- 無統一的空狀態插圖/文字

**建議**：建立 `EmptyState.vue` 共用元件，包含：

- 空資料插圖
- 「尚無資料」文字
- 可選的 CTA 按鈕

---

### [元件-4] 無 Skeleton 載入效果

**影響範圍**: 全站  
**嚴重度**: 🟡 中

目前使用 `:loading` 在 Button 和 DataTable 上，但無骨架屏 (Skeleton) 用於初次載入的過渡效果。

**建議**：為 Overview 頁面的統計卡片添加 Skeleton 載入效果。

---

### [元件-5] Toast 使用一致但無集中管理

**影響範圍**: 45+ 個檔案  
**嚴重度**: 🟢 低

每個頁面都獨立 `import { useToast }` 並使用，這是正確做法。但 Toast 的 `summary` 和 `detail` 文案缺乏統一規範。

**建議**：建立 Toast 文案規範文件，統一操作成功/失敗的用語。

---

### [元件-6] Paginator 使用不一致

**影響範圍**: 19 個檔案  
**嚴重度**: 🟡 中

部分頁面使用 DataTable 內建 paginator，部分使用獨立的 Paginator 元件，每頁條數設定也不統一 (10/20/50)。

**建議**：統一使用內建 paginator 並設定預設 `rows="20"`。

---

## 🖱️ 交互體驗 (Interaction Experience)

### [UX-1] 搜尋按鈕標籤不一致

**影響範圍**: 多個模組  
**嚴重度**: 🟢 低

| 模組類型 | 按鈕文字 |
|:---------|:---------|
| Finance 模組 | `搜尋` |
| Reports 模組 | `查詢` |

**建議**：統一使用「查詢」或「搜尋」。

---

### [UX-2] 部分頁面缺少快捷鍵支援

**影響範圍**: 全站  
**嚴重度**: 🟢 低

- 搜尋欄位無 Enter 提交
- Dialog 無 ESC 關閉 (部分)
- 表格無鍵盤導航

**建議**：Phase 2 考慮增加。

---

### [UX-3] 鎖單超時無音效/震動提醒

**位置**: `Finance/OrderLocks.vue`  
**嚴重度**: 🟢 低

目前超時僅有顏色變化，無額外警示。

**建議**：可選添加 browser notification 或音效。

---

### [UX-4] 表格排序狀態未持久化

**影響範圍**: 所有 DataTable  
**嚴重度**: 🟢 低

用戶的排序選擇在頁面切換後會重置。

**建議**：Phase 2 使用 localStorage 持久化排序偏好。

---

### [UX-5] 無導出功能

**影響範圍**: Reports, Finance 模組  
**嚴重度**: 🟡 中

報表頁面無 CSV/Excel 匯出按鈕。

**建議**：Phase 2 實作 Export 功能。

---

## 🧹 程式碼簡潔度 (Code Quality)

### [程式碼-1] Breadcrumb 註解佔位符冗餘

**影響範圍**: 64 個檔案  
**嚴重度**: 🟢 低

```vue
<!-- Breadcrumb -->
```

**建議**：要嘛實作 Breadcrumb，要嘛移除註解。

---

### [程式碼-2] 重複的 DataTable :pt 配置

**影響範圍**: 30+ 個檔案  
**嚴重度**: 🟡 中

```vue
:pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }"
```

**建議**：在 `main.ts` 中全域配置 PrimeVue passthrough。

---

### [程式碼-3] Mock 資料生成邏輯分散

**影響範圍**: Members, Finance, Agents 等模組  
**嚴重度**: 🟢 低

每個頁面都有自己的 `ref([...])` mock data，未抽取至共用 composable。

**建議**：建立 `src/composables/useMockData.ts` 集中管理。

---

### [程式碼-4] 註解掉的 CSS 規則

**位置**: `SpecialEvents.vue`  
**嚴重度**: 🟢 低

**建議**：移除無用的註解程式碼。

---

## ✅ 優化建議優先級

### 🔴 高優先 (Phase 1.5 修復)

1. **[視覺-1]** 建立 colors 常量檔案，替換 30+ 處寫死色碼
2. **[元件-3]** 實作 EmptyState 共用元件
3. **[元件-1]** 統一 Dialog Footer 按鈕排列規範

### 🟠 中優先 (建議修復)

4. **[視覺-5]** 統一 Games 模組輸入欄位寬度
2. **[程式碼-2]** 全域配置 DataTable passthrough
3. **[元件-2]** 擴大 ConfirmDialog 使用範圍

### 🟢 低優先 (可延後)

7. **[視覺-6]** Breadcrumb 實作或移除
2. **[視覺-2]** Chart.js 主題抽取
3. **[UX-1]** 統一按鈕文案

---

*此報告由 Antigravity 自動生成，僅供參考用途。*
