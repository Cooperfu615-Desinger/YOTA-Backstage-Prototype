# YOTA Backstage Prototype 後端 API 模組規劃

> 文件目的：依照目前已交付的 Vue 後台原型，整理後端接手開發時所需的 API 模組規劃。
>  
> 適用範圍：以現有前端頁面與操作流程為主，不包含尚未確認的新功能延伸。

---

## 1. 文件定位

這份文件不是最終 API 規格書，也不是資料表詳細設計稿，而是提供後端團隊接手時的模組拆分方向，讓開發能依照目前前端原型的內容，快速建立：

- 後端服務邊界
- 核心資源模型
- API 開發優先順序
- 各模組應承接的主要責任

目前前端原型已完成大部分頁面與操作流程展示，因此後端工作的核心，不是重新定義需求，而是把已確認的畫面與流程落成為正式的資料、規則與 API。

---

## 2. API 規劃原則

### 2.1 規劃基準

- 以現有前端模組與頁面結構為基準
- 以後台管理需求為主，不以前台玩家端 API 為主體
- 以可營運、可審計、可擴充為目標
- 保留前端原型中的 demo 操作感，但後端需補上正式權限、驗證、狀態流與資料一致性

### 2.2 建議 API 風格

- Base path 建議：`/api/admin/v1`
- 以資源導向 REST 為主
- 複雜流程可搭配 action 型 endpoint
- 所有列表 API 應支援：
  - 分頁
  - 排序
  - 篩選
  - 匯出任務建立

### 2.3 共用回應格式建議

```json
{
  "success": true,
  "data": {},
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 200
  },
  "message": "ok"
}
```

錯誤格式建議：

```json
{
  "success": false,
  "error": {
    "code": "FINANCE_ORDER_LOCKED",
    "message": "訂單目前已被其他管理員鎖定"
  }
}
```

---

## 3. 後端共用基礎模組

這些模組雖然不一定直接對應左側選單，但屬於所有後台功能的共同底座，建議優先開發。

### 3.1 Auth / Session

責任：

- 管理員登入
- 登出
- Token 驗證與續期
- 取得當前登入者資訊
- 密碼修改與重設
- 帳號狀態管理

建議 API：

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /auth/me`
- `POST /auth/change-password`
- `POST /auth/reset-password`

### 3.2 RBAC / Permission

責任：

- 角色、群組、功能權限
- 資料級權限與操作級權限
- 選單可見性不應只靠前端控制

建議 API：

- `GET /permissions`
- `GET /roles`
- `POST /roles`
- `PATCH /roles/{id}`
- `GET /operator-groups`
- `POST /operator-groups`
- `PATCH /operator-groups/{id}`

### 3.3 Audit / Operation Log

責任：

- 後台所有關鍵操作留痕
- 登入記錄
- 重要欄位變更歷史
- 審核動作軌跡

建議 API：

- `GET /audit-logs`
- `GET /login-logs`
- `GET /resource-change-logs`

### 3.4 Export Center

責任：

- 大量資料匯出任務
- 非同步報表下載
- 匯出任務狀態追蹤

建議 API：

- `POST /exports`
- `GET /exports`
- `GET /exports/{id}`
- `GET /exports/{id}/download`

### 3.5 Upload / Media

責任：

- 圖片、附件、公告素材、banner 素材上傳
- 後台內容管理模組共用

建議 API：

- `POST /uploads`
- `GET /uploads/{id}`
- `DELETE /uploads/{id}`

---

## 4. 後端 API 模組規劃

以下模組以目前前端畫面為基礎，依業務領域拆分。

---

## 5. Dashboard 模組

對應前端：

- `/dashboard/overview`
- `/dashboard/website-analytics`
- `/dashboard/operations`
- `/dashboard/monitoring`

主要責任：

- 首頁摘要卡片
- 流量與營運統計
- 玩家監控與風控提示
- 待辦事項彙整

建議資源：

- dashboard summary
- website analytics
- operation analytics
- player monitoring
- risk alerts
- pending tasks

建議 API：

- `GET /dashboard/summary`
- `GET /dashboard/website-analytics`
- `GET /dashboard/operation-analytics`
- `GET /dashboard/player-monitoring`
- `GET /dashboard/risk-alerts`
- `GET /dashboard/pending-tasks`

備註：

- 此模組多為彙總查詢 API，**無獨立主資料表**，由後端聚合 Finance、Member、Agent、Audit 等 domain 資料後回傳
- 建議實作為獨立的 `DashboardQueryService`，不另建 migration
- 後續若需即時監控，可再拆 WebSocket 或 SSE

---

## 6. Operators 模組

對應前端：

- `/operators/overview`
- `/operators/maintenance`
- `/operators/groups`
- `/operators/logs`
- `/operators/exports`

主要責任：

- 後台操作人員管理
- 群組與權限維護
- IP 白名單
- 操作日誌查詢
- 匯出任務管理

建議資源：

- operators
- operator profiles
- operator groups
- role bindings
- whitelist rules
- operation logs

建議 API：

- `GET /operators`
- `POST /operators`
- `GET /operators/{id}`
- `PATCH /operators/{id}`
- `PATCH /operators/{id}/status`
- `PATCH /operators/{id}/password`
- `GET /operators/{id}/ip-whitelist`
- `PUT /operators/{id}/ip-whitelist`
- `GET /operator-groups`
- `POST /operator-groups`
- `PATCH /operator-groups/{id}`
- `GET /operator-operation-logs`

---

## 7. System Settings 模組

對應前端：

- `/system-settings/overview`
- `/system-settings/announcements`
- `/system-settings/parameters`
- `/system-settings/bank-wallet`

主要責任：

- 系統級參數
- 公告與通知內容
- 站點設定
- 支付通道、銀行與錢包配置

建議資源：

- site settings
- operation settings
- security settings
- announcements
- bank channels
- wallet channels
- payment gateways

建議 API：

- `GET /system-settings`
- `PATCH /system-settings/site`
- `PATCH /system-settings/operation`
- `PATCH /system-settings/security`
- `GET /announcements`
- `POST /announcements`
- `GET /announcements/{id}`
- `PATCH /announcements/{id}`
- `PATCH /announcements/{id}/publish-status`
- `GET /payment-channels`
- `POST /payment-channels`
- `PATCH /payment-channels/{id}`
- `GET /bank-accounts`
- `POST /bank-accounts`
- `PATCH /bank-accounts/{id}`

---

## 8. Messages 模組

對應前端：

- `/messages/overview`
- `/messages/templates`
- `/messages/settings`
- `/messages/logs`

主要責任：

- 訊息模板管理
- 郵件 / 簡訊 / Telegram 等通道設定
- 發送紀錄查詢
- 後續可延伸為訊息任務中心

建議資源：

- message templates
- message channels
- provider configs
- send logs
- notification jobs

建議 API：

- `GET /message-templates`
- `POST /message-templates`
- `GET /message-templates/{id}`
- `PATCH /message-templates/{id}`
- `GET /message-channel-settings`
- `PATCH /message-channel-settings/email`
- `PATCH /message-channel-settings/sms`
- `PATCH /message-channel-settings/telegram`
- `GET /message-logs`
- `POST /messages/send-test`

備註：

- 正式環境應搭配 queue 機制處理批次通知與重試

---

## 9. Members 模組

對應前端：

- `/members/overview`
- `/members/list`
- `/members/memo-record`
- `/members/levels`
- `/members/tags`

主要責任：

- 會員列表與詳情
- 會員標籤
- 會員等級
- 備註與日誌
- 會員狀態管理

建議資源：

- members
- member profiles
- member tags
- member levels
- member notes
- member logs
- member snapshots

建議 API：

- `GET /members`
- `POST /members`
- `GET /members/{id}`
- `PATCH /members/{id}`
- `PATCH /members/{id}/status`
- `GET /members/{id}/notes`
- `POST /members/{id}/notes`
- `GET /members/{id}/logs`
- `GET /member-tags`
- `POST /member-tags`
- `PATCH /member-tags/{id}`
- `GET /member-levels`
- `POST /member-levels`
- `PATCH /member-levels/{id}`
- `POST /members/{id}/level-adjustments`
- `GET /members/{id}/bank-accounts`
- `POST /members/{id}/bank-accounts`
- `PATCH /members/{id}/bank-accounts/{bankAccountId}`
- `DELETE /members/{id}/bank-accounts/{bankAccountId}`

備註：

- 會員列表頁通常會是查詢量最大的模組之一
- 等級調整與標籤異動需有完整審計紀錄
- 會員銀行帳戶為提款審核的必要資料，建議在 P0 / P1 階段與提款模組一起落地

---

## 10. Layout 模組

對應前端：

- `/layout/overview`
- `/layout/homepage`
- `/layout/game-config`
- `/layout/articles`
- `/layout/payment`
- `/layout/splash-ads`

主要責任：

- App / Web 版面設定
- 首頁區塊配置
- 遊戲展示排序
- 文章頁面管理
- 支付入口版型設定
- 開屏廣告與排程

建議資源：

- homepage sections
- carousel banners
- game display blocks
- content pages
- payment layouts
- splash ads

建議 API：

- `GET /layout/homepage`
- `PUT /layout/homepage`
- `GET /layout/game-config`
- `PUT /layout/game-config`
- `GET /content-pages`
- `POST /content-pages`
- `GET /content-pages/{id}`
- `PATCH /content-pages/{id}`
- `GET /payment-layouts`
- `PUT /payment-layouts/{id}`
- `GET /splash-ads`
- `POST /splash-ads`
- `PATCH /splash-ads/{id}`
- `PATCH /splash-ads/{id}/status`

備註：

- 這類模組適合支援草稿、排程、發布三種狀態

---

## 11. Official Site 模組

對應前端：

- `/official/hero`
- `/official/banners`
- `/official/news`
- `/official/games`
- `/official/seo`

主要責任：

- 官網首圖
- 廣告輪播
- 最新消息
- 官網遊戲展示
- SEO 與站點資訊

建議資源：

- hero themes
- website banners
- news articles
- game showcases
- seo settings
- social links

建議 API：

- `GET /official/hero-configs`
- `POST /official/hero-configs`
- `PATCH /official/hero-configs/{id}`
- `GET /official/banners`
- `POST /official/banners`
- `PATCH /official/banners/{id}`
- `GET /official/news`
- `POST /official/news`
- `GET /official/news/{id}`
- `PATCH /official/news/{id}`
- `GET /official/game-showcases`
- `POST /official/game-showcases`
- `PATCH /official/game-showcases/{id}`
- `GET /official/seo-settings`
- `PUT /official/seo-settings`

備註：

- 與 Layout 模組同屬內容管理領域，可視團隊習慣合併為 CMS domain

---

## 12. Finance 模組

對應前端：

- `/finance/overview`
- `/finance/manual-deposit`
- `/finance/online-deposit`
- `/finance/withdrawals`
- `/finance/order-locks`
- `/finance/balance-logs`
- `/finance/adjustment-logs`
- `/finance/betting-records`
- `/finance/points-rewards`
- `/finance/auto-payment`

主要責任：

- 入款、出款、調整、查詢、鎖單
- 審核流轉
- 點數 / 餘額 / 流水查詢
- 自動金流狀態

建議資源：

- manual deposit orders
- online deposit orders
- withdrawal orders
- order locks
- balance logs
- adjustment logs
- betting records
- points adjustments
- reward tasks
- auto payment monitors

建議 API：

- `GET /finance/summary`
- `GET /manual-deposit-orders`
- `GET /manual-deposit-orders/{id}`
- `POST /manual-deposit-orders`
- `POST /manual-deposit-orders/{id}/approve`
- `POST /manual-deposit-orders/{id}/reject`
- `GET /online-deposit-orders`
- `GET /online-deposit-orders/{id}`
- `GET /withdrawal-orders`
- `GET /withdrawal-orders/{id}`
- `POST /withdrawal-orders/{id}/lock`
- `POST /withdrawal-orders/{id}/unlock`
- `POST /withdrawal-orders/{id}/approve`
- `POST /withdrawal-orders/{id}/reject`
- `POST /withdrawal-orders/{id}/reverse`
- `GET /order-locks`
- `GET /balance-logs`
- `GET /adjustment-logs`
- `GET /betting-records`
- `GET /points-adjustments`
- `POST /points-adjustments`
- `POST /points-adjustments/bulk-tasks`
- `GET /auto-payment-status`

重點說明：

- Finance 為最高優先級核心模組
- 所有審核型 API 都必須支援：
  - 操作鎖
  - 狀態驗證
  - 重複提交防護
  - 審計紀錄
  - 權限檢查

---

## 13. Agents 模組

對應前端：

- `/agent/overview`
- `/agent/list`
- `/agent/levels`
- `/agent/commission`
- `/agent/maintenance`
- `/agent/settlement`

主要責任：

- 代理商資料管理
- 代理層級與上下線結構
- 佣金方案
- 結算週期與報表

建議資源：

- agents
- agent levels
- commission schemes
- settlement periods
- settlement reports
- agent maintenance logs

建議 API：

- `GET /agents`
- `POST /agents`
- `GET /agents/{id}`
- `PATCH /agents/{id}`
- `PATCH /agents/{id}/status`
- `GET /agent-levels`
- `POST /agent-levels`
- `PATCH /agent-levels/{id}`
- `GET /commission-schemes`
- `POST /commission-schemes`
- `PATCH /commission-schemes/{id}`
- `GET /agent-settlements`
- `POST /agent-settlements/generate`
- `GET /agent-settlements/{id}`

備註：

- 若代理制度較複雜，建議獨立為單一 domain service

---

## 14. Games 模組

對應前端：

- `/games/overview`
- `/games/platforms`
- `/games/list`
- `/games/categories`

主要責任：

- 遊戲平台管理
- 遊戲清單
- 遊戲分類
- 上下架與維護排程

建議資源：

- game platforms
- games
- game categories
- game tags
- maintenance windows

建議 API：

- `GET /game-platforms`
- `POST /game-platforms`
- `GET /game-platforms/{id}`
- `PATCH /game-platforms/{id}`
- `POST /game-platforms/{id}/maintenance`
- `GET /games`
- `POST /games`
- `GET /games/{id}`
- `PATCH /games/{id}`
- `PATCH /games/{id}/status`
- `GET /game-categories`
- `POST /game-categories`
- `PATCH /game-categories/{id}`

---

## 15. Promotions 模組

對應前端：

- `/promotions/overview`
- `/promotions/offers`
- `/promotions/special-events`
- `/promotions/achievements`

主要責任：

- 優惠活動管理
- 特殊活動設定
- 任務 / 成就規則
- 活動條件與獎勵配置

建議資源：

- promotions
- campaign rules
- special events
- achievements
- reward settings

建議 API：

- `GET /promotions`
- `POST /promotions`
- `GET /promotions/{id}`
- `PATCH /promotions/{id}`
- `PATCH /promotions/{id}/status`
- `GET /special-events`
- `POST /special-events`
- `PATCH /special-events/{id}`
- `GET /achievements`
- `POST /achievements`
- `PATCH /achievements/{id}`

---

## 16. Reports 模組

對應前端：

- `/reports/overview`
- `/reports/game-performance`
- `/reports/cash`
- `/reports/deposit`
- `/reports/bonus`
- `/reports/operations`

主要責任：

- 報表查詢
- 聚合統計
- 匯出任務
- 多條件篩選

建議資源：

- report dashboards
- game performance reports
- cash reports
- deposit reports
- bonus reports
- operation reports

建議 API：

- `GET /reports/overview`
- `GET /reports/game-performance`
- `GET /reports/cash`
- `GET /reports/deposits`
- `GET /reports/bonus`
- `GET /reports/operations`
- `POST /reports/exports`

備註：

- 實作上通常依資料來源拆 query service，不一定要做成單一大模組

---

## 17. Payments 模組

對應前端：

- `/payments/overview`
- `/payments/merchants`
- `/payments/banks`
- `/payments/app-purchase`

主要責任：

- 支付商號管理
- 銀行帳號管理
- 行動支付 / app purchase 設定與訂單查詢

建議資源：

- merchants
- bank accounts
- app purchase orders
- payment providers

建議 API：

- `GET /payments/overview`
- `GET /merchants`
- `POST /merchants`
- `PATCH /merchants/{id}`
- `GET /payment-bank-accounts`
- `POST /payment-bank-accounts`
- `PATCH /payment-bank-accounts/{id}`
- `GET /app-purchase-orders`
- `GET /app-purchase-orders/{id}`

備註：

- 若與 Finance 共用支付資料來源，需明確定義 Payments 與 Finance 的責任邊界

---

## 18. 模組優先級建議

### P0：最優先，後台可用性的基礎

- Auth / Session
- RBAC / Permission
- Audit / Operation Log
- Operators
- Members
- Finance

### P1：高優先，營運管理主流程

- System Settings
- Messages
- Agents
- Games
- Reports

### P2：次優先，內容與展示管理

- Layout
- Official Site
- Payments
- Upload / Media

---

## 19. 建議資料與流程層拆法

為了避免後端一開始就把所有頁面各自做成零散 API，建議至少先整理以下核心 domain：

- IAM Domain
  - auth
  - operators
  - roles
  - permissions
  - audit logs

- Member Domain
  - members
  - member tags
  - member levels
  - member notes
  - member logs

- Finance Domain
  - deposit orders
  - withdrawal orders
  - adjustment orders
  - balance ledger
  - order locks

- Agent Domain
  - agents
  - hierarchies
  - commissions
  - settlements

- Content Domain
  - announcements
  - articles
  - homepage configs
  - banners
  - splash ads
  - seo settings

- Catalog Domain
  - game platforms
  - games
  - categories

- Messaging Domain
  - templates
  - channel configs
  - send logs

---

## 20. 開發交接建議

在正式開發前，建議後端先與產品 / 前端一起確認以下內容：

1. 哪些頁面是純展示查詢，哪些頁面有正式寫入流程
2. 哪些欄位是 demo 假資料，哪些欄位是正式必填資料
3. 哪些按鈕只是前端展示操作，哪些需要真正落地成業務流程
4. 各模組列表頁的篩選條件是否都要支援
5. 匯出是同步下載還是非同步任務
6. 權限粒度是到頁面、按鈕、還是資料操作層級
7. Finance 與 Payments 的責任邊界
8. Layout 與 Official 是否合併為 CMS 類模組

---

## 21. 總結

以目前這份 Vue 原型來看，後端 API 規劃可以明確分成三層：

- 基礎層：登入、權限、審計、匯出、上傳
- 核心營運層：會員、財務、人員、代理、報表、遊戲、訊息、系統設定
- 內容管理層：版面、官網、公告、文章、SEO、廣告素材

若以實際交付順序來看，最建議先落地的模組為：

1. Auth / RBAC / Audit
2. Members
3. Finance
4. Operators
5. System Settings

以上完成後，整個後台才會從「可展示原型」正式進入「可串接、可營運、可審計」的後端開發階段。

---

## 22. 建議 API 總表

> 說明：
> - 這張表是目前建議的第一版 API 清單總覽，方便與後端討論範圍。
> - **所有 API 均以 `/api/admin/v1` 為 base path 前綴，表格中省略不寫。**
>   - 範例：`POST /auth/login` 完整路徑為 `POST /api/admin/v1/auth/login`
> - 優先序定義：
>   - `P0`：先做，缺少會影響後台主流程
>   - `P1`：重要，建議在核心模組完成後接續開發
>   - `P2`：次優先，可依排程補完

| 編號 | API 類別 | API 名稱 | 說明 | 優先序 |
|---:|---|---|---|---|
| 1 | Auth | `POST /auth/login` | 管理員登入 | P0 |
| 2 | Auth | `POST /auth/logout` | 管理員登出 | P0 |
| 3 | Auth | `POST /auth/refresh` | Token 續期 | P0 |
| 4 | Auth | `GET /auth/me` | 取得當前登入者資訊 | P0 |
| 5 | Auth | `POST /auth/change-password` | 修改登入密碼 | P0 |
| 6 | Auth | `POST /auth/reset-password` | 重設後台帳號密碼 | P1 |
| 7 | RBAC | `GET /permissions` | 取得系統權限定義清單 | P0 |
| 8 | RBAC | `GET /roles` | 取得角色列表 | P0 |
| 9 | RBAC | `POST /roles` | 建立角色 | P1 |
| 10 | RBAC | `PATCH /roles/{id}` | 編輯角色與權限 | P1 |
| 11 | RBAC | `GET /operator-groups` | 取得操作群組列表 | P0 |
| 12 | RBAC | `POST /operator-groups` | 建立操作群組 | P1 |
| 13 | RBAC | `PATCH /operator-groups/{id}` | 編輯操作群組權限 | P1 |
| 14 | Audit | `GET /audit-logs` | 查詢後台審計日誌 | P0 |
| 15 | Audit | `GET /login-logs` | 查詢登入紀錄 | P1 |
| 16 | Audit | `GET /resource-change-logs` | 查詢資源異動歷程 | P1 |
| 17 | Export | `POST /exports` | 建立匯出任務 | P1 |
| 18 | Export | `GET /exports` | 取得匯出任務列表 | P1 |
| 19 | Export | `GET /exports/{id}` | 取得單一匯出任務狀態 | P1 |
| 20 | Export | `GET /exports/{id}/download` | 下載匯出檔案 | P1 |
| 21 | Upload | `POST /uploads` | 上傳圖片或附件 | P1 |
| 22 | Upload | `GET /uploads/{id}` | 取得上傳檔案資訊 | P1 |
| 23 | Upload | `DELETE /uploads/{id}` | 刪除上傳檔案 | P2 |
| 24 | Dashboard | `GET /dashboard/summary` | 首頁摘要卡片資料 | P1 |
| 25 | Dashboard | `GET /dashboard/website-analytics` | 網站數據統計 | P1 |
| 26 | Dashboard | `GET /dashboard/operation-analytics` | 營運數據統計 | P1 |
| 27 | Dashboard | `GET /dashboard/player-monitoring` | 玩家監控清單與狀態 | P1 |
| 28 | Dashboard | `GET /dashboard/risk-alerts` | 風控提示與異常警報 | P1 |
| 29 | Dashboard | `GET /dashboard/pending-tasks` | 後台待辦事項彙總 | P1 |
| 30 | Operators | `GET /operators` | 查詢後台操作人員列表 | P0 |
| 31 | Operators | `POST /operators` | 建立操作人員帳號 | P1 |
| 32 | Operators | `GET /operators/{id}` | 取得操作人員詳情 | P0 |
| 33 | Operators | `PATCH /operators/{id}` | 編輯操作人員資料 | P1 |
| 34 | Operators | `PATCH /operators/{id}/status` | 啟用、停用或鎖定帳號 | P0 |
| 35 | Operators | `PATCH /operators/{id}/password` | 重設操作人員密碼 | P1 |
| 36 | Operators | `GET /operators/{id}/ip-whitelist` | 查詢 IP 白名單 | P1 |
| 37 | Operators | `PUT /operators/{id}/ip-whitelist` | 更新 IP 白名單 | P1 |
| 38 | Operators | `GET /operator-operation-logs` | 查詢操作人員行為日誌 | P1 |
| 39 | System Settings | `GET /system-settings` | 取得系統設定彙總 | P1 |
| 40 | System Settings | `PATCH /system-settings/site` | 更新站點基本設定 | P1 |
| 41 | System Settings | `PATCH /system-settings/operation` | 更新營運相關設定 | P1 |
| 42 | System Settings | `PATCH /system-settings/security` | 更新安全與風控設定 | P1 |
| 43 | Announcements | `GET /announcements` | 查詢公告列表 | P1 |
| 44 | Announcements | `POST /announcements` | 建立公告 | P1 |
| 45 | Announcements | `GET /announcements/{id}` | 取得公告詳情 | P1 |
| 46 | Announcements | `PATCH /announcements/{id}` | 編輯公告 | P1 |
| 47 | Announcements | `PATCH /announcements/{id}/publish-status` | 切換公告發布狀態 | P1 |
| 48 | Payment Channels | `GET /payment-channels` | 查詢支付通道列表 | P1 |
| 49 | Payment Channels | `POST /payment-channels` | 建立支付通道 | P1 |
| 50 | Payment Channels | `PATCH /payment-channels/{id}` | 編輯支付通道 | P1 |
| 51 | Bank Accounts | `GET /bank-accounts` | 查詢銀行帳號與錢包設定 | P1 |
| 52 | Bank Accounts | `POST /bank-accounts` | 建立銀行帳號或錢包配置 | P1 |
| 53 | Bank Accounts | `PATCH /bank-accounts/{id}` | 編輯銀行帳號或錢包配置 | P1 |
| 54 | Messages | `GET /message-templates` | 查詢訊息模板列表 | P1 |
| 55 | Messages | `POST /message-templates` | 建立訊息模板 | P1 |
| 56 | Messages | `GET /message-templates/{id}` | 取得訊息模板詳情 | P1 |
| 57 | Messages | `PATCH /message-templates/{id}` | 編輯訊息模板 | P1 |
| 58 | Messages | `GET /message-channel-settings` | 取得訊息通道設定 | P1 |
| 59 | Messages | `PATCH /message-channel-settings/email` | 更新 Email 通道設定 | P1 |
| 60 | Messages | `PATCH /message-channel-settings/sms` | 更新 SMS 通道設定 | P1 |
| 61 | Messages | `PATCH /message-channel-settings/telegram` | 更新 Telegram 通道設定 | P1 |
| 62 | Messages | `GET /message-logs` | 查詢訊息發送紀錄 | P1 |
| 63 | Messages | `POST /messages/send-test` | 發送測試訊息 | P1 |
| 64 | Members | `GET /members` | 查詢會員列表 | P0 |
| 65 | Members | `POST /members` | 建立會員資料 | P2 |
| 66 | Members | `GET /members/{id}` | 取得會員詳情 | P0 |
| 67 | Members | `PATCH /members/{id}` | 編輯會員資料 | P1 |
| 68 | Members | `PATCH /members/{id}/status` | 更新會員狀態 | P0 |
| 69 | Members | `GET /members/{id}/notes` | 查詢會員備註 | P1 |
| 70 | Members | `POST /members/{id}/notes` | 新增會員備註 | P1 |
| 71 | Members | `GET /members/{id}/logs` | 查詢會員行為日誌 | P1 |
| 72 | Member Tags | `GET /member-tags` | 查詢會員標籤 | P1 |
| 73 | Member Tags | `POST /member-tags` | 建立會員標籤 | P1 |
| 74 | Member Tags | `PATCH /member-tags/{id}` | 編輯會員標籤 | P1 |
| 75 | Member Levels | `GET /member-levels` | 查詢會員等級設定 | P1 |
| 76 | Member Levels | `POST /member-levels` | 建立會員等級 | P1 |
| 77 | Member Levels | `PATCH /member-levels/{id}` | 編輯會員等級 | P1 |
| 78 | Member Levels | `POST /members/{id}/level-adjustments` | 執行會員等級調整 | P1 |
| 78-1 | Member Bank Accounts | `GET /members/{id}/bank-accounts` | 查詢會員提款帳戶列表 | P1 |
| 78-2 | Member Bank Accounts | `POST /members/{id}/bank-accounts` | 新增會員提款帳戶 | P1 |
| 78-3 | Member Bank Accounts | `PATCH /members/{id}/bank-accounts/{bankAccountId}` | 編輯會員提款帳戶 | P1 |
| 78-4 | Member Bank Accounts | `DELETE /members/{id}/bank-accounts/{bankAccountId}` | 停用或刪除會員提款帳戶 | P1 |
| 79 | Layout | `GET /layout/homepage` | 取得首頁版面設定 | P2 |
| 80 | Layout | `PUT /layout/homepage` | 更新首頁版面設定 | P2 |
| 81 | Layout | `GET /layout/game-config` | 取得遊戲展示配置 | P2 |
| 82 | Layout | `PUT /layout/game-config` | 更新遊戲展示配置 | P2 |
| 83 | Content Pages | `GET /content-pages` | 查詢文章或靜態頁面列表 | P2 |
| 84 | Content Pages | `POST /content-pages` | 建立文章或靜態頁面 | P2 |
| 85 | Content Pages | `GET /content-pages/{id}` | 取得文章或靜態頁面詳情 | P2 |
| 86 | Content Pages | `PATCH /content-pages/{id}` | 編輯文章或靜態頁面 | P2 |
| 87 | Layout Payments | `GET /payment-layouts` | 查詢支付版型設定 | P2 |
| 88 | Layout Payments | `PUT /payment-layouts/{id}` | 更新支付版型設定 | P2 |
| 89 | Splash Ads | `GET /splash-ads` | 查詢開屏廣告列表 | P2 |
| 90 | Splash Ads | `POST /splash-ads` | 建立開屏廣告 | P2 |
| 91 | Splash Ads | `PATCH /splash-ads/{id}` | 編輯開屏廣告 | P2 |
| 92 | Splash Ads | `PATCH /splash-ads/{id}/status` | 切換開屏廣告啟用狀態 | P2 |
| 93 | Official | `GET /official/hero-configs` | 查詢官網首圖設定 | P2 |
| 94 | Official | `POST /official/hero-configs` | 建立官網首圖設定 | P2 |
| 95 | Official | `PATCH /official/hero-configs/{id}` | 編輯官網首圖設定 | P2 |
| 96 | Official | `GET /official/banners` | 查詢官網輪播列表 | P2 |
| 97 | Official | `POST /official/banners` | 建立官網輪播內容 | P2 |
| 98 | Official | `PATCH /official/banners/{id}` | 編輯官網輪播內容 | P2 |
| 99 | Official | `GET /official/news` | 查詢官網新聞列表 | P2 |
| 100 | Official | `POST /official/news` | 建立官網新聞 | P2 |
| 101 | Official | `GET /official/news/{id}` | 取得官網新聞詳情 | P2 |
| 102 | Official | `PATCH /official/news/{id}` | 編輯官網新聞 | P2 |
| 103 | Official | `GET /official/game-showcases` | 查詢官網遊戲展示內容 | P2 |
| 104 | Official | `POST /official/game-showcases` | 建立官網遊戲展示內容 | P2 |
| 105 | Official | `PATCH /official/game-showcases/{id}` | 編輯官網遊戲展示內容 | P2 |
| 106 | Official | `GET /official/seo-settings` | 取得官網 SEO 設定 | P2 |
| 107 | Official | `PUT /official/seo-settings` | 更新官網 SEO 設定 | P2 |
| 108 | Finance | `GET /finance/summary` | 查詢財務總覽資料 | P0 |
| 109 | Finance | `GET /manual-deposit-orders` | 查詢手工存款單列表 | P0 |
| 110 | Finance | `GET /manual-deposit-orders/{id}` | 取得手工存款單詳情 | P0 |
| 111 | Finance | `POST /manual-deposit-orders` | 建立手工存款單 | P1 |
| 112 | Finance | `POST /manual-deposit-orders/{id}/approve` | 通過手工存款審核 | P0 |
| 113 | Finance | `POST /manual-deposit-orders/{id}/reject` | 拒絕手工存款審核 | P0 |
| 114 | Finance | `GET /online-deposit-orders` | 查詢在線存款單列表 | P0 |
| 115 | Finance | `GET /online-deposit-orders/{id}` | 取得在線存款單詳情 | P0 |
| 116 | Finance | `GET /withdrawal-orders` | 查詢提款單列表 | P0 |
| 117 | Finance | `GET /withdrawal-orders/{id}` | 取得提款單詳情 | P0 |
| 118 | Finance | `POST /withdrawal-orders/{id}/lock` | 鎖定提款單供審核 | P0 |
| 119 | Finance | `POST /withdrawal-orders/{id}/unlock` | 解除提款單鎖定 | P0 |
| 120 | Finance | `POST /withdrawal-orders/{id}/approve` | 通過提款審核 | P0 |
| 121 | Finance | `POST /withdrawal-orders/{id}/reject` | 拒絕提款審核 | P0 |
| 122 | Finance | `POST /withdrawal-orders/{id}/reverse` | 執行提款沖正 | P1 |
| 123 | Finance | `GET /order-locks` | 查詢鎖單清單 | P1 |
| 124 | Finance | `GET /balance-logs` | 查詢資金流水紀錄 | P0 |
| 125 | Finance | `GET /adjustment-logs` | 查詢人工存提紀錄 | P1 |
| 126 | Finance | `GET /betting-records` | 查詢下注紀錄 | P1 |
| 127 | Finance | `GET /points-adjustments` | 查詢點數調整紀錄 | P1 |
| 128 | Finance | `POST /points-adjustments` | 建立單筆點數調整 | P1 |
| 129 | Finance | `POST /points-adjustments/bulk-tasks` | 建立批次點數任務 | P1 |
| 130 | Finance | `GET /auto-payment-status` | 查詢自動金流狀態 | P1 |
| 131 | Agents | `GET /agents` | 查詢代理列表 | P1 |
| 132 | Agents | `POST /agents` | 建立代理資料 | P1 |
| 133 | Agents | `GET /agents/{id}` | 取得代理詳情 | P1 |
| 134 | Agents | `PATCH /agents/{id}` | 編輯代理資料 | P1 |
| 135 | Agents | `PATCH /agents/{id}/status` | 更新代理狀態 | P1 |
| 136 | Agents | `GET /agent-levels` | 查詢代理等級 | P1 |
| 137 | Agents | `POST /agent-levels` | 建立代理等級 | P1 |
| 138 | Agents | `PATCH /agent-levels/{id}` | 編輯代理等級 | P1 |
| 139 | Agents | `GET /commission-schemes` | 查詢佣金方案 | P1 |
| 140 | Agents | `POST /commission-schemes` | 建立佣金方案 | P1 |
| 141 | Agents | `PATCH /commission-schemes/{id}` | 編輯佣金方案 | P1 |
| 142 | Agents | `GET /agent-settlements` | 查詢代理結算列表 | P1 |
| 143 | Agents | `POST /agent-settlements/generate` | 產生代理結算資料 | P1 |
| 144 | Agents | `GET /agent-settlements/{id}` | 查詢單筆代理結算詳情 | P1 |
| 145 | Games | `GET /game-platforms` | 查詢遊戲平台列表 | P1 |
| 146 | Games | `POST /game-platforms` | 建立遊戲平台 | P1 |
| 147 | Games | `GET /game-platforms/{id}` | 取得遊戲平台詳情 | P1 |
| 148 | Games | `PATCH /game-platforms/{id}` | 編輯遊戲平台 | P1 |
| 149 | Games | `POST /game-platforms/{id}/maintenance` | 建立平台維護排程 | P1 |
| 150 | Games | `GET /games` | 查詢遊戲列表 | P1 |
| 151 | Games | `POST /games` | 建立遊戲資料 | P1 |
| 152 | Games | `GET /games/{id}` | 取得遊戲詳情 | P1 |
| 153 | Games | `PATCH /games/{id}` | 編輯遊戲資料 | P1 |
| 154 | Games | `PATCH /games/{id}/status` | 更新遊戲上下架狀態 | P1 |
| 155 | Games | `GET /game-categories` | 查詢遊戲分類列表 | P1 |
| 156 | Games | `POST /game-categories` | 建立遊戲分類 | P1 |
| 157 | Games | `PATCH /game-categories/{id}` | 編輯遊戲分類 | P1 |
| 158 | Promotions | `GET /promotions` | 查詢優惠活動列表 | P1 |
| 159 | Promotions | `POST /promotions` | 建立優惠活動 | P1 |
| 160 | Promotions | `GET /promotions/{id}` | 取得優惠活動詳情 | P1 |
| 161 | Promotions | `PATCH /promotions/{id}` | 編輯優惠活動 | P1 |
| 162 | Promotions | `PATCH /promotions/{id}/status` | 切換優惠活動狀態 | P1 |
| 163 | Promotions | `GET /special-events` | 查詢特殊活動列表 | P1 |
| 164 | Promotions | `POST /special-events` | 建立特殊活動 | P1 |
| 165 | Promotions | `PATCH /special-events/{id}` | 編輯特殊活動 | P1 |
| 166 | Promotions | `GET /achievements` | 查詢成就設定列表 | P1 |
| 167 | Promotions | `POST /achievements` | 建立成就設定 | P1 |
| 168 | Promotions | `PATCH /achievements/{id}` | 編輯成就設定 | P1 |
| 169 | Reports | `GET /reports/overview` | 查詢報表總覽 | P1 |
| 170 | Reports | `GET /reports/game-performance` | 查詢遊戲表現報表 | P1 |
| 171 | Reports | `GET /reports/cash` | 查詢現金報表 | P1 |
| 172 | Reports | `GET /reports/deposits` | 查詢存款報表 | P1 |
| 173 | Reports | `GET /reports/bonus` | 查詢贈金報表 | P1 |
| 174 | Reports | `GET /reports/operations` | 查詢營運報表 | P1 |
| 175 | Reports | `POST /reports/exports` | 建立報表匯出任務 | P1 |
| 176 | Payments | `GET /payments/overview` | 查詢金流平台總覽 | P2 |
| 177 | Payments | `GET /merchants` | 查詢商號列表 | P2 |
| 178 | Payments | `POST /merchants` | 建立商號 | P2 |
| 179 | Payments | `PATCH /merchants/{id}` | 編輯商號 | P2 |
| 180 | Payments | `GET /payment-bank-accounts` | 查詢金流用銀行帳號 | P2 |
| 181 | Payments | `POST /payment-bank-accounts` | 建立金流用銀行帳號 | P2 |
| 182 | Payments | `PATCH /payment-bank-accounts/{id}` | 編輯金流用銀行帳號 | P2 |
| 183 | Payments | `GET /app-purchase-orders` | 查詢行動支付訂單列表 | P2 |
| 184 | Payments | `GET /app-purchase-orders/{id}` | 查詢行動支付訂單詳情 | P2 |
