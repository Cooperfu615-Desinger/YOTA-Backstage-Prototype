# ⚡ Antigravity

> **現代化 iGaming 後台管理系統**  
> Vue 3 + PrimeVue + Pinia + TypeScript

Antigravity 是一套專為 iGaming 產業設計的全功能後台管理系統原型。  
系統採用 Vue 3 Composition API 搭配 PrimeVue UI 框架與 Pinia 狀態管理，提供極致流暢的操作體驗與高度可擴展的架構。

---

## ✨ 核心功能亮點

| 功能模組 | 特色說明 |
|:---------|:---------|
| 🔐 **RBAC 角色權限** | 基於角色的動態選單過濾，不同職級看到不同功能 |
| 🎨 **動態版型切換** | 支援 Login 與 Dashboard 的動態 Layout 切換機制 |
| 📊 **雙軌數據監控** | 區分 **直營 (IAP)** 與 **包網 (Agent)** 雙軌數據分析 |
| 🛠️ **高度客製化版面** | 拖曳排序、即時預覽、開屏廣告管理 |
| 📱 **RWD 響應式設計** | 完美適配桌面、平板與手機操作介面 |

---

## 🛠️ 技術堆疊

| 類別 | 技術 |
|:-----|:-----|
| 核心框架 | Vue 3 (Composition API + Script Setup) |
| 建置工具 | Vite 7.2 |
| 程式語言 | TypeScript 5.9 |
| 狀態管理 | Pinia 3.0 |
| 路由管理 | Vue Router 4.6 (含 Navigation Guards) |
| UI 框架 | PrimeVue 4.5 (Aura Dark Theme) |
| 圖表視覺 | Chart.js 4.5 |
| 樣式工具 | Tailwind CSS 4.1 |

---

## 🚀 快速開始

### 環境需求

- Node.js 18+
- npm 或 yarn

### 安裝與執行

```bash
# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev
```

開啟瀏覽器前往 **<http://localhost:5173>**

### 建置生產版本

```bash
npm run build    # 建置專案
npm run preview  # 預覽建置結果
```

---

## 👤 測試帳號

> 💡 **提示**：登入頁面下方已提供「開發者快速通道」，點擊任一列即可自動填入帳密。

| 角色 | 帳號 | 密碼 | 權限範圍 |
|:-----|:-----|:-----|:---------|
| 👑 超級管理員 | `admin` | `admin` | 全站功能 (無限制) |
| 💰 財務主管 | `finance` | `123456` | 財務管理、營運數據 |
| 🎮 營運主管 | `ops` | `123456` | 會員、遊戲、版面、優惠 |
| 📈 產品經理 | `pm` | `123456` | 網站數據、系統設定、日誌 |
| 🤝 總代理 | `agent` | `123456` | 代理中心、報表中心 |

---

## 📂 專案結構

```
src/
├── assets/          # 靜態資源
├── components/      # 共用元件
├── layout/          # 佈局元件 (AppMenu, AppTopbar)
├── router/          # 路由設定 (含權限守衛)
├── stores/          # Pinia 狀態管理 (Auth, Layout)
├── views/           # 頁面視圖
│   ├── Dashboard/   # 儀表板模組
│   ├── Finance/     # 財務管理模組
│   ├── Layout/      # 版面設定模組
│   ├── Members/     # 會員管理模組
│   ├── Operators/   # 人員管理模組
│   └── Pages/       # 系統頁面 (登入、404)
└── App.vue          # 根元件 (動態 Layout 切換)
```

---

## 📋 開發狀態

| 階段 | 狀態 | 說明 |
|:-----|:-----|:-----|
| Phase 1 | ✅ 完成 | Mock Data Mode - 全模組 UI 開發完成 |
| Phase 2 | 🔜 規劃中 | Backend API 串接 |
| Phase 3 | 📋 待排程 | WebSocket 即時更新、多語系支援 |

---

## 📄 相關文件

- [架構白皮書 (PROJECT_SNAPSHOT.md)](./PROJECT_SNAPSHOT.md)

---

<div align="center">

**Built with ❤️ for modern iGaming operations**

</div>
