<![CDATA[# Antigravity — 架構白皮書

> **Generated**: 2026-01-12  
> **Version**: Phase 1 Complete (Stable & Polished)  
> **Last Updated**: 2026-01-12

---

## 目前進度 Current Status

| 階段 | 狀態 | 說明 |
|------|------|------|
| **Phase 1** | ✅ 已完成 | Mock Data Mode — 全模組 UI 開發完成，前端權限系統建立 |
| **Phase 1.5** | ✅ 已完成 | UI/UX 深度優化 — 一致性色碼、EmptyState 元件、Dialog 規範 |
| Phase 2 | 🔜 規劃中 | Backend API 串接 |
| Phase 3 | 📋 待排程 | WebSocket 即時更新、多語系支援 |

---

## 目錄結構 Directory Structure

```
src/
├── App.vue                   # 根元件，動態 Layout 切換
├── main.ts                   # 應用程式進入點
├── router/
│   └── index.ts              # 路由定義 + Navigation Guards
├── stores/
│   └── auth.ts               # Pinia 認證 Store (Mock RBAC)
├── layout/
│   ├── AppLayout.vue         # Dashboard 主佈局 (Sidebar + Header)
│   ├── AppMenu.vue           # 側邊欄選單 (權限過濾)
│   └── AppTopbar.vue         # 頂部工具列
└── views/
    ├── Dashboard/            # 儀表板模組
    │   ├── index.vue         # 預設導向
    │   ├── Overview.vue      # 總覽頁面
    │   ├── WebsiteAnalytics.vue
    │   ├── OperationAnalytics.vue
    │   └── PlayerMonitoring.vue
    ├── Operators/            # 人員管理
    │   ├── Overview.vue
    │   ├── StaffMaintenance.vue   # 帳號維護 (含 IP 白名單)
    │   ├── GroupMaintenance.vue   # 群組權限
    │   ├── OperationLogs.vue      # 操作日誌
    │   └── ExportManager.vue      # 匯出中心
    ├── Members/              # 會員管理
    │   ├── Overview.vue
    │   ├── List.vue          # 會員列表 + 詳情 Modal
    │   ├── Logs.vue          # 會員日誌
    │   ├── LevelSettings.vue # 等級維護
    │   └── Tags.vue          # 標籤管理
    ├── Layout/               # 版面設定
    │   ├── Overview.vue
    │   ├── HomeSettings.vue       # 首頁設定
    │   ├── GameConfiguration.vue  # 遊戲配置 (拖曳排序)
    │   ├── ArticleManagement.vue  # 文章管理 (WebView)
    │   ├── PaymentLayout.vue      # 支付版面 (APP/Web)
    │   └── SplashAds.vue          # 開屏廣告 (互斥邏輯)
    ├── Finance/              # 財務管理
    │   ├── Overview.vue
    │   ├── ManualDeposit.vue      # 手工存款審核
    │   ├── OnlineDeposit.vue      # 在線存款查詢
    │   ├── Withdrawals.vue        # 提款審核 (流水驗證)
    │   ├── OrderLocks.vue         # 鎖單管理
    │   ├── BalanceLogs.vue        # 資金流水紀錄
    │   ├── AdjustmentLogs.vue     # 人工存提紀錄
    │   ├── BettingRecords.vue     # 下注紀錄
    │   ├── PointsRewards.vue      # 點數與獎勵
    │   └── AutoPayment.vue        # 自動金流
    ├── Agents/               # 代理管理
    │   ├── Overview.vue
    │   ├── AgentList.vue
    │   ├── AgentLevels.vue
    │   ├── CommissionSettings.vue
    │   ├── AgentMaintenance.vue
    │   └── SettlementReport.vue
    ├── Games/                # 遊戲管理
    │   ├── Overview.vue
    │   ├── Platforms.vue
    │   ├── GameList.vue
    │   └── Categories.vue
    ├── Promotions/           # 推廣活動
    │   ├── Overview.vue
    │   ├── Offers.vue             # 優惠管理 (單一列表)
    │   ├── SpecialEvents.vue
    │   └── Achievements.vue
    ├── Reports/              # 報表管理
    │   ├── Overview.vue
    │   ├── GamePerformance.vue
    │   ├── Cash.vue
    │   ├── OnlineDeposit.vue
    │   ├── Bonus.vue
    │   └── Operations.vue
    ├── Payments/             # 金流平台
    │   ├── Overview.vue
    │   ├── Banks.vue
    │   └── AppPurchase.vue
    ├── Messages/             # 訊息管理
    │   ├── Overview.vue
    │   ├── Templates.vue
    │   ├── Settings.vue
    │   └── Logs.vue
    ├── SystemSettings/       # 系統設定
    │   ├── index.vue              # 系統導覽 (System Guide)
    │   ├── Announcements.vue
    │   ├── Parameters.vue
    │   └── PaymentChannels.vue
    └── Pages/                # 系統頁面
        └── Login.vue         # 登入頁 (含自動填入功能)
```

---

## 關鍵架構決策 Architecture Decisions

### 1. 路由守衛 (Navigation Guards)

**檔案**：`src/router/index.ts`

```typescript
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('auth_token')

  // 登入頁特殊處理
  if (to.path === '/login') {
    if (token) {
      next('/dashboard/overview')  // 已登入則跳轉首頁
    } else {
      next()
    }
    return
  }

  // 其他頁面需驗證
  if (!token) {
    next('/login')  // 未登入導向登入頁
    return
  }

  next()
})
```

**要點**：
- 透過 `localStorage.auth_token` 判斷登入狀態
- 未登入訪問任何頁面均重導至 `/login`
- 已登入訪問 `/login` 自動跳轉 `/dashboard/overview`

---

### 2. 動態 Layout 切換

**檔案**：`src/App.vue`

```vue
<template>
  <AppLayout v-if="useAppLayout">
    <router-view />
  </AppLayout>
  <router-view v-else />
</template>

<script setup>
const useAppLayout = computed(() => {
  return route.meta.layout !== 'empty'
})
</script>
```

**機制**：
- 路由設定 `meta: { layout: 'empty' }` 的頁面 (如 Login) 直接渲染，不套用 AppLayout
- 其他頁面自動包裹 `AppLayout`，顯示完整 Sidebar + Header

---

### 3. 前端 Mock RBAC 權限體系

**檔案**：`src/stores/auth.ts`

```typescript
const MOCK_USERS = {
  admin: {
    password: 'admin',
    user: {
      name: '超級管理員',
      role: 'ADMIN',
      permissions: ['*']  // 全權限
    }
  },
  finance: {
    password: '123456',
    user: {
      name: '財務主管',
      role: 'FINANCE',
      permissions: ['Dashboard', 'Finance', 'Report']
    }
  },
  // ... 其他角色
}
```

**權限檢查邏輯**：
```typescript
const hasPermission = computed(() => (permission: string) => {
  if (!user.value) return false
  if (user.value.permissions.includes('*')) return true
  return user.value.permissions.includes(permission)
})
```

**運作方式**：
1. 登入時比對 `MOCK_USERS` 驗證帳密
2. 成功後將 `token` 與 `user` 存入 `localStorage`
3. 側邊欄 `AppMenu.vue` 依據 `permissions` 過濾顯示選單項目
4. `ADMIN` 角色 (`permissions: ['*']`) 可見所有功能

---

## 功能模組清單 Module Manifest

### 📊 儀表板 Dashboard

| 頁面 | 路徑 | 說明 |
|------|------|------|
| 網站數據 | `/dashboard/website-analytics` | 流量、UV/PV、裝置分佈 |
| 營運數據 | `/dashboard/operations` | **雙軌制**：直營 IAP 模式 / 包網代理模式切換 |
| 玩家監控 | `/dashboard/monitoring` | 即時在線、**模擬器偵測**、異常行為警示 |
| 自定義總覽 | `/dashboard/overview` | 可拖曳卡片排序的個人化首頁 |

### 🎨 版面設定 Layout

| 頁面 | 路徑 | 說明 |
|------|------|------|
| 首頁設定 | `/layout/homepage` | 輪播橫幅、快捷入口配置 |
| 遊戲配置 | `/layout/game-config` | 遊戲分類排序、熱門推薦 (拖曳排序) |
| 文章管理 | `/layout/articles` | **WebView** 內嵌頁面管理 |
| 支付版面 | `/layout/payment` | **APP / Web 分流**邏輯配置 |
| 開屏廣告 | `/layout/splash-ads` | 全屏廣告管理 (**互斥邏輯**：同時僅一則啟用) |

### 👥 人員管理 Operators

| 頁面 | 路徑 | 說明 |
|------|------|------|
| 管理總覽 | `/operators/overview` | 人員統計、權限分佈圖表 |
| 帳號維護 | `/operators/maintenance` | 新增/編輯帳號、**IP 白名單**設定 |
| 群組權限 | `/operators/groups` | 權限群組 CRUD、權限項目勾選 |
| 操作日誌 | `/operators/logs` | 全站操作記錄、可依操作類型/人員篩選 |

### 🔐 系統核心 Pages

| 頁面 | 路徑 | 說明 |
|------|------|------|
| 登入頁 | `/login` | 帳號/密碼/驗證碼表單，**開發測試帳號一鍵填入** |
| 404 頁面 | (規劃中) | 頁面不存在提示 |

### 💰 財務管理 Finance

- **審核類**：手工存款、在線存款查詢、提款審核
- **查詢類**：資金流水紀錄、人工存提紀錄、下注紀錄
- **工具類**：點數與獎勵 (手動派發)、自動金流 (規則引擎)
- **特殊**：鎖單管理 (防止並行審核)

### ⚙️ 系統設定 System

| 頁面 | 路徑 | 說明 |
|------|------|------|
| 系統導覽 | `/system/overview` | 提供系統基礎資訊與操作指引 |
| 公告管理 | `/system/announcements` | 系統公告維護 |
| 參數設定 | `/system/parameters` | 全域參數配置 |
| 支付通道 | `/system/payment-channels` | 支付通道配置 |

### 🎁 推廣活動 Promotions

| 頁面 | 路徑 | 說明 |
|------|------|------|
| 優惠管理 | `/promotions/offers` | 優惠活動單一列表管理 |
| 特殊活動 | `/promotions/special-events` | 限時活動配置 |
| 成就系統 | `/promotions/achievements` | 玩家成就管理 |

### 🧩 共用元件 Shared Components

| 元件 | 路徑 | 說明 |
|------|------|------|
| EmptyState.vue | `src/components/Common/` | 空狀態插圖元件 (標準化空列表顯示) |
| AppLayout.vue | `src/layout/` | Dashboard 主佈局 (含 AppTopbar 登出/用戶資訊) |

---

## 待辦事項 Next Steps

### Phase 2: Backend Integration

- [ ] 設計 RESTful API 規格 (OpenAPI)
- [ ] 串接真實認證 (JWT Token)
- [ ] 替換所有 Mock Data 為 API 呼叫
- [ ] 實作統一錯誤處理與 Loading 狀態

### Phase 3: Real-Time Features

- [ ] WebSocket 建立即時連線
- [ ] 玩家監控即時數據推播
- [ ] 審核單狀態即時同步
- [ ] 通知中心即時訊息

### Phase 4: Internationalization

- [ ] Vue I18n 整合
- [ ] 繁中 / 簡中 / 英文語系檔案
- [ ] 語系切換 UI

---

## UI 設計規範 Design Specifications

### 輸入欄位

- **搜尋欄位固定寬度**：`w-[220px]` (220px)
- **百分比輸入**：無按鈕 InputNumber，寬度 100px，置中對齊

### 色彩編碼

| 用途 | Light Mode | Dark Mode |
|------|------------|-----------|
| 正數金額 (增點/派彩) | `text-green-600` | `text-green-400` |
| 負數金額 (扣點/提款) | `text-red-600` | `text-red-400` |
| 狀態標籤 | Success/Warning/Danger/Info | 同配色系統 |

### 響應式斷點

- **Desktop** (≥1024px)：多欄 Grid 佈局
- **Tablet** (768-1023px)：雙欄佈局
- **Mobile** (<768px)：單欄堆疊

---

## Mock Data 生成策略

- **量體**：50+ 交易紀錄、100+ 會員資料、15+ 金流通道
- **多樣性**：隨機金額/時間戳/狀態，涵蓋異常情境
- **集中管理**：`useFinanceData.ts` 等 Composables 維護共用狀態

---

*Last Updated: 2026-01-12*

---

## ✨ Phase 1.5 優化摘要 UI/UX Enhancement Summary

- **一致性色碼**：統一正負金額、狀態標籤配色規範
- **EmptyState 元件**：新增空狀態插圖，提升空列表視覺體驗
- **Dialog 規範**：統一 Modal 與對話框樣式規範
- **選單命名優化**：系統設定 Overview → 系統導覽 (System Guide)
- **AppTopbar 強化**：完善登出功能與用戶資訊顯示
]]>
