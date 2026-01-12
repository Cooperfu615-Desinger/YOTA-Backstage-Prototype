<![CDATA[<div align="center">

# ⚡ Antigravity

### 現代化 iGaming 後台管理系統

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vuedotjs)](https://vuejs.org/)
[![PrimeVue](https://img.shields.io/badge/PrimeVue-4.5-41B883?style=flat-square)](https://primevue.org/)
[![Pinia](https://img.shields.io/badge/Pinia-3.0-FFD859?style=flat-square)](https://pinia.vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)

</div>

---

## 📋 專案簡介

**Antigravity** 是一套專為 iGaming 產業設計的全功能後台管理系統原型。系統採用 Vue 3 Composition API 搭配 PrimeVue UI 框架與 Pinia 狀態管理，提供現代化、高效能的管理介面。

### ✨ 核心功能亮點

| 功能 | 說明 |
|------|------|
| 🔐 **RBAC 角色權限控制** | 基於角色的動態選單過濾，不同權限看到不同功能模組 |
| 🎨 **動態版型切換** | Login 獨立版面 vs Dashboard 完整側邊欄，透過路由 `meta.layout` 自動切換 |
| 📊 **雙軌制數據監控** | 直營 (In-App Purchase) 與包網代理雙模式數據追蹤 |
| 🎯 **高度客製化版面** | 拖曳排序、即時預覽、開屏廣告管理等豐富的版面配置功能 |

---

## 🛠️ 技術堆疊

| 類別 | 技術 |
|------|------|
| **核心框架** | Vue 3 (Composition API) |
| **建置工具** | Vite 7.2 |
| **程式語言** | TypeScript 5.9 |
| **狀態管理** | Pinia 3.0 |
| **路由管理** | Vue Router 4.6 |
| **UI 框架** | PrimeVue 4.5 (Aura Dark Theme) |
| **圖表視覺化** | Chart.js 4.5 |
| **CSS 框架** | Tailwind CSS 4.1 + Flexbox |
| **圖示** | PrimeIcons 7.0 |

---

## 🚀 快速開始

### 系統需求

- Node.js 18+
- npm 或 yarn

### 安裝與執行

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 瀏覽器開啟 http://localhost:5173
```

### 建置生產版本

```bash
# 建置
npm run build

# 預覽建置結果
npm run preview
```

---

## 👤 測試帳號

> 💡 **提示**：在登入頁面下方提供「開發測試帳號」表格，點擊任一列即可自動填入帳密。

| 角色 | 帳號 | 密碼 | 權限範圍 |
|------|------|------|----------|
| **超級管理員** | `admin` | `admin` | 全站功能 (上帝視角) — `permissions: ['*']` |
| **財務主管** | `finance` | `123456` | 儀表板、財務管理、報表中心 |
| **營運主管** | `ops` | `123456` | 儀表板、會員管理、遊戲、版面設定、優惠活動 |
| **產品經理** | `pm` | `123456` | 儀表板、系統設定、操作日誌 |
| **總代理** | `agent` | `123456` | 儀表板、代理中心、報表中心 |

---

## 📦 功能模組

### 儀表板 Dashboard
- 網站數據分析
- 營運數據追蹤 (直營 IAP / 包網代理)
- 玩家即時監控 (模擬器偵測、異常行為)
- 可自定義總覽

### 版面設定 Layout
- 首頁輪播設定
- 遊戲分類配置 (拖曳排序)
- 文章管理 (WebView)
- 支付版面 (APP/Web 分流)
- 開屏廣告 (互斥邏輯、排程控制)

### 人員管理 Operators
- 管理總覽
- 帳號維護 (IP 白名單)
- 群組權限
- 操作日誌

### 財務管理 Finance
- 手工/在線存款審核
- 提款審核 (流水驗證)
- 鎖單管理
- 資金流水紀錄

### 其他模組
- **會員管理**：會員列表、等級/標籤維護、360° 會員詳情
- **遊戲管理**：遊戲平台、遊戲列表、分類標籤
- **代理管理**：代理列表、等級制度、佣金設定、結算報表
- **推廣活動**：優惠管理、特定活動、成就設置
- **報表中心**：遊戲表現、現金/贈金報表、營運報表

---

## 🔐 權限機制

系統採用前端 **Mock RBAC** 模式：

1. 登入時驗證帳密，取得 `role` 與 `permissions` 陣列
2. Sidebar 選單根據 `permissions` 動態過濾顯示
3. `ADMIN` 角色擁有 `['*']` 全權限
4. 權限資訊儲存於 `localStorage`，支援重新整理後保持登入狀態

---

## 📄 文件導覽

| 文件 | 說明 |
|------|------|
| [PROJECT_SNAPSHOT.md](./PROJECT_SNAPSHOT.md) | 架構白皮書 — 目錄結構、關鍵架構決策、模組清單 |
| [CHANGELOG](#) | 版本更新紀錄 (規劃中) |

---

## 📝 開發狀態

**目前版本**：Phase 1 完成 (Mock Data Mode)

✅ **已完成**
- RBAC 權限登入系統
- 動態 Layout 切換
- 全模組頁面開發
- 響應式設計 (Desktop/Tablet/Mobile)

🚧 **下階段規劃**
- 串接真實 Backend API
- WebSocket 即時數據推播
- 多語系 (i18n) 支援
- 進階報表引擎

---

<div align="center">

**Built with ❤️ for modern iGaming operations**

</div>
]]>
