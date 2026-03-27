# 後端開發工作 — 關鍵資訊提取

> 來源：5 份 docs md 檔的結構化資訊彙總
> 用途：支援進度規劃、資源分配、里程碑設定

---

## 一、資料表清單彙總

### P0 建表（優先建立）—— 15 張表

**Member Domain**
1. `admin_users` — 後台操作人員主表
2. `roles` — 角色定義表
3. `permissions` — 權限定義表
4. `operator_groups` — 操作人員群組表
5. `members` — 會員主表
6. `member_tags` — 會員標籤定義表
7. `member_tag_assignments` — 會員與標籤的關聯表
8. `member_levels` — 會員等級定義表
9. `member_profiles` — 會員補充資料表
10. `member_logs` — 會員行為日誌表
11. `member_status_histories` — 會員狀態變更歷史表
12. `member_bank_accounts` — 會員提款帳戶表 ⭐ **新增**

**Finance Domain**
13. `manual_deposit_orders` — 手工存款單表
14. `withdrawal_orders` — 提款單表
15. `balance_ledgers` — 資金流水帳本表

**Audit Domain**
16. `audit_logs` — 審計日誌表

### P1 建表（第二階段）—— 22 張表

**Finance Domain**
1. `online_deposit_orders` — 在線存款單表
2. `order_locks` — 訂單鎖定表
3. `manual_adjustments` — 人工調整紀錄表
4. `balance_ledger_snapshots` — 餘額快照表

**IAM / Operators**
5. `admin_ip_whitelist_rules` — 後台操作人員 IP 白名單表
6. `admin_login_logs` — 後台登入日誌表
7. `admin_operation_logs` — 後台操作日誌表

**System & Settings**
8. `system_settings` — 系統設定表
9. `announcements` — 公告表
10. `message_templates` — 訊息模板表
11. `message_channel_settings` — 訊息通道設定表

**Agent Domain**
12. `agents` — 代理主表
13. `agent_levels` — 代理等級表
14. `commission_schemes` — 佣金方案表
15. `settlements` — 代理結算表
16. `settlement_details` — 結算明細表

**Games Domain**
17. `game_platforms` — 遊戲平台表
18. `games` — 遊戲主表
19. `game_categories` — 遊戲分類表

**Promotions Domain**
20. `promotions` — 優惠活動表
21. `special_events` — 特殊事件表
22. `achievements` — 成就定義表

**Messaging Domain**
23. `notification_jobs` — 批次通知任務表 ⭐ **新增**

**Reporting Domain**
24. `report_export_jobs` — 報表匯出任務表

### P2 建表（第三階段）—— 12 張表

**Content & Layout Domain**
1. `homepage_configs` — 首頁版面配置表
2. `layout_sections` — 版面區塊表
3. `content_pages` — 文章或靜態頁面表
4. `payment_layouts` — 支付版型表
5. `splash_ads` — 開屏廣告表

**Official Site Domain**
6. `hero_configs` — 官網首圖配置表
7. `website_banners` — 官網輪播表
8. `news_articles` — 官網新聞表
9. `website_seo_settings` — 網站 SEO 設定表
10. `website_configs` — 官網基本設定表

**Payments Domain**
11. `merchants` — 商號表
12. `payment_bank_accounts` — 支付用銀行帳號表
13. `app_purchase_orders` — App 內購訂單表

**Integration**
14. `file_assets` — 檔案資產表
15. `payment_callback_logs` — 金流 callback 日誌表
16. `external_sync_jobs` — 外部同步任務表

---

## 二、核心實體與優先序（Domain Model）

### P0 Domain Model —— 14 個核心實體

```
IAM Domain
├─ AdminUser
├─ Role
├─ Permission
└─ OperatorGroup

Member Domain
├─ Member
├─ MemberTag
├─ MemberLevel
└─ MemberBankAccount ⭐ **新增**

Finance Domain
├─ ManualDepositOrder
├─ OnlineDepositOrder
├─ WithdrawalOrder
├─ OrderLock
└─ BalanceLedger

Audit Domain
└─ AuditLog
```

### P1 新增實體 —— 17 個實體

```
Finance Domain
├─ ManualAdjustment
└─ BalanceLedgerSnapshot

Agents Domain
├─ Agent
├─ AgentLevel
├─ CommissionScheme
└─ Settlement

Messaging Domain
├─ MessageTemplate
├─ MessageChannelSettings
└─ NotificationJob ⭐ **新增**

System Domain
├─ SystemSettings
└─ Announcement

Reporting Domain
└─ ReportExportJob
```

### P2 新增實體 —— 7 個實體

```
Content Domain
├─ ContentPage
├─ HomepageConfig
└─ SplashAd

Official Site Domain
├─ HeroConfig
└─ NewsArticle

Payments Domain
├─ Merchant
└─ AppPurchaseOrder
```

---

## 三、API 統計與優先序分布

### API 總數：184 個

| 優先序 | 數量 | 百分比 | 說明 |
|---|---|---|---|
| **P0** | 29 個 | 16.3% | 核心基礎設施 + Auth + 會員 + 財務必要操作 |
| **P1** | 119 個 | 67.0% | 業務主流程擴展 + 代理 + 遊戲 + 報表 + 三方整合 |
| **P2** | 40 個 | 22.5% | 內容管理 + 官網 + 支付配置 |

### P0 API 清單（29 個）

**Auth（5 個）**
1. `POST /auth/login` — 後台登入
2. `POST /auth/logout` — 後台登出
3. `POST /auth/refresh` — 刷新 token
4. `GET /auth/me` — 取得當前登入者資訊
5. `POST /auth/change-password` — 修改密碼

**RBAC（3 個）**
6. `GET /permissions` — 取得系統權限定義清單
7. `GET /roles` — 取得角色列表
8. `GET /operator-groups` — 取得操作群組列表

**Audit（1 個）**
9. `GET /audit-logs` — 查詢後台審計日誌

**Operators（3 個）**
10. `GET /operators` — 查詢後台操作人員列表
11. `GET /operators/{id}` — 取得操作人員詳情
12. `PATCH /operators/{id}/status` — 啟用、停用或鎖定帳號

**Members（3 個）**
13. `GET /members` — 查詢會員列表
14. `GET /members/{id}` — 取得會員詳情
15. `PATCH /members/{id}/status` — 更新會員狀態

**Finance（14 個）** ⭐ **核心模組**
16. `GET /finance/summary` — 查詢財務總覽資料
17. `GET /manual-deposit-orders` — 查詢手工存款單列表
18. `GET /manual-deposit-orders/{id}` — 取得手工存款單詳情
19. `POST /manual-deposit-orders/{id}/approve` — 通過手工存款審核
20. `POST /manual-deposit-orders/{id}/reject` — 拒絕手工存款審核
21. `GET /online-deposit-orders` — 查詢在線存款單列表
22. `GET /online-deposit-orders/{id}` — 取得在線存款單詳情
23. `GET /withdrawal-orders` — 查詢提款單列表
24. `GET /withdrawal-orders/{id}` — 取得提款單詳情
25. `POST /withdrawal-orders/{id}/lock` — 鎖定提款單供審核
26. `POST /withdrawal-orders/{id}/unlock` — 解除提款單鎖定
27. `POST /withdrawal-orders/{id}/approve` — 通過提款審核
28. `POST /withdrawal-orders/{id}/reject` — 拒絕提款審核
29. `GET /balance-logs` — 查詢資金流水紀錄

---

## 四、後端開發工作清單統計

### 工作總數：73 項

| 類別 | P0 | P0/P1 | P1 | P2 | 合計 |
|---|---|---|---|---|---|
| 基礎平台 | 5 | — | — | — | 5 |
| Auth | 3 | — | — | — | 3 |
| RBAC | 2 | — | 2 | — | 4 |
| Audit | 2 | — | 2 | — | 4 |
| Security | — | 1 | — | — | 1 |
| Queue / Export | — | — | 2 | — | 2 |
| Operators | 2 | — | 2 | — | 4 |
| Members | 3 | — | 4 | — | 7 |
| Finance | 7 | — | 5 | — | 12 |
| System Settings | — | — | 3 | — | 3 |
| Messages | — | — | 3 | — | 3 |
| Agents | — | — | 4 | — | 4 |
| Games | — | — | 4 | — | 4 |
| Promotions | — | — | 3 | — | 3 |
| Reports | — | — | 2 | — | 2 |
| Layout | — | — | — | 3 | 3 |
| Official Site | — | — | — | 2 | 2 |
| Payments | — | — | — | 3 | 3 |
| Integration | — | — | 2 | 2 | 4 |
| Quality | — | — | 3 | — | 3 |
| Delivery | — | — | 1 | — | 1 |
| **總計** | **24** | **1** | **38** | **10** | **73** |

### 優先序分布

```
P0 (24 項) ━━━━━━━━━━━━━━━ 33%
   └─ 基礎設施 5 + Auth 3 + RBAC 2 + Audit 2 + Operators 2 + Members 3 + Finance 7

P0/P1 (1 項) ━ 1%
   └─ Security（IP 白名單 P0 建表 + P1 middleware）

P1 (38 項) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 52%
   └─ Finance 5 + Members 4 + Operators 2 + Agents 4 + Games 4
      Promotions 3 + System Settings 3 + Messages 3 + Queue 2
      Reports 2 + Integration 2 + Quality 3 + Delivery 1

P2 (10 項) ━━━━━ 14%
   └─ Layout 3 + Official 2 + Payments 3 + Integration 2
```

---

## 五、模組化分組建議

### 第一階段推進順序（P0 優先完成）

根據工作項依賴關係，建議分 **5 個子階段並行推進**：

#### 子階段 A：基礎設施 (1 周)
- 專案骨架、DB、logging、exception handling、health check、API 文件

#### 子階段 B：認證與授權 (2 周)
- Token / Session、JWT middleware
- 角色與權限模型
- 操作人員帳號系統

#### 子階段 C：審計系統 (1.5 周)
- 審計日誌表與 API
- 登入日誌
- IP 白名單驗證（P0 建表，P1 middleware）

#### 子階段 D：會員模組 (2 周)
- 會員主檔、狀態管理
- **會員提款帳戶** ⭐
- 會員日誌查詢

#### 子階段 E：財務模組 (3 周) ⭐ **最複雜**
- 存款單（手工 + 在線）
- **提款單 + 提款帳戶串接**
- 資金流水 + 鎖單機制
- 餘額快照機制

**小計：P0 總工時約 9.5 周**

### 第二階段推進（P1 分波策略）

P1 共 **38 項工作 / 119 支 API**，體量大，需再細拆為 4 波並行推進：

#### P1 第一波（完成 P0 後立即啟動，2-3 周）
**目標：讓財務流程完整 + 會員系統可運營**

| 工作項 | 類別 | 對應 API 數 |
|---|---|---|
| 會員備註 / 標籤 / 等級管理 | Members | 7 支 |
| 會員提款帳戶擴充（驗證、預設邏輯） | Finance | 2 支 |
| 財務：提款沖正、鎖單查詢 | Finance | 2 支 |
| 財務：人工存提、下注紀錄、點數調整 | Finance | 6 支 |
| IP 白名單 middleware 啟用 | Security | 1 支 |
| 操作人員 IP 白名單、操作日誌 | Operators | 3 支 |

#### P1 第二波（約 3-4 周）
**目標：代理系統 + 系統運營 + 訊息通知**

| 工作項 | 類別 | 對應 API 數 |
|---|---|---|
| 代理基本資料、等級、佣金方案 | Agents | 9 支 |
| 代理結算生成與查詢 | Agents | 3 支 |
| 系統設定（站點、營運、安全） | System Settings | 4 支 |
| 公告管理 CRUD | Announcements | 5 支 |
| 訊息模板 + 通道設定 | Messages | 10 支 |
| 匯出任務機制 | Queue / Export | 5 支 |

#### P1 第三波（約 3-4 周）
**目標：遊戲 + 活動 + 報表**

| 工作項 | 類別 | 對應 API 數 |
|---|---|---|
| 遊戲平台管理（含維護排程） | Games | 5 支 |
| 遊戲清單 + 分類管理 | Games | 8 支 |
| 優惠活動 + 特殊活動 | Promotions | 8 支 |
| 成就管理 | Promotions | 3 支 |
| 報表查詢（6 種報表）+ 匯出 | Reports | 7 支 |
| 第三方金流串接 + 通知服務串接 | Integration | — |

#### P1 第四波（2-3 周，可與第三波部分並行）
**目標：質量達標 + 技術交付**

| 工作項 | 類別 | 內容 |
|---|---|---|
| 單元 / 整合 / 流程測試 | Quality | 測試覆蓋率 |
| 效能優化（索引、快取） | Quality | 查詢效能 |
| 監控與告警設置 | Quality | 服務 + 金流監控 |
| API 文件 + 交接說明 | Delivery | Swagger + 環境文件 |

---

## 六、關鍵里程碑建議

### 時間線估算（基於 5 人後端團隊）

| 里程碑 | 目標 | 累積工時 | 交付物 |
|---|---|---|---|
| **M1：基礎可串接** | 前端可開始第一輪 API 串接 | 第 3 周 | 基礎設施 + Auth + RBAC + Operators 主檔 |
| **M2：財務核心上線** | 完整存提款審核流程可用 | 第 6 周 | Members + Finance P0（29 支 API）|
| **M3：P0 全部完成** | 後台可獨立運作 + 審計可查 | 第 10 周 | Audit + IP 白名單 + 所有 P0 工作項（24 項）|
| **M4：P1 第一波** | 財務流程完整 + 會員系統可運營 | 第 13 周 | Finance P1 + Members P1 + Security P1 |
| **M5：P1 第二波** | 代理系統 + 系統運營 + 通知可用 | 第 17 周 | Agents + System Settings + Messages + Export |
| **M6：P1 第三波** | 遊戲 + 活動 + 報表上線 | 第 21 周 | Games + Promotions + Reports + Integration |
| **M7：質量達標** | 測試覆蓋 + 監控 + 文件齊全 | 第 24 周 | 測試套件 + 監控告警 + API 文件 |
| **M8：P2 完成** | 全功能交付 | 第 28 周 | Layout + Official + Payments（40 支 API）|

**總預期：28 周（約 7 個月）**

> ⚠️ **與原始估算 18.5 周的差異說明：**
> 主要差距來自 P1 API 數量被低估——修正後 P1 有 119 支 API（原估 76 支），P2 有 40 支（原估 22 支）。即使 5 人並行開發，P1 的純開發工時就超過 12 周，加上依賴關係、review、測試、整合的 overhead，合理預期為 14-16 周。
>
> 💡 若希望縮短整體工期，可考慮：
> - P2 模組推遲至 v2.0 版本，集中在 P0 + P1 核心功能（可縮至約 22 周）
> - 增加人力（+1 後端）到 6 人，可縮短約 2-3 周
> - 部分 P1 模組（如 Official、Reports）可以低優先度並行開發，不阻塞主流程

---

## 七、資源分配建議（5 人團隊）

### 分工模型

| 人員 | 分工領域 | P0 負責 | P1 延伸 | P2 |
|---|---|---|---|---|
| **後端 Lead** | 架構 + 財務核心 | 基礎設施、Auth、RBAC、Finance 架構 | Finance P1、Integration、監控 | — |
| **後端 A** | 會員 + 代理 | Members（7 項）、Operators | Agents（4 項）、Settlement | — |
| **後端 B** | 財務 + 金流 | Finance P0（7 項）、Order Lock | Finance P1（5 項）、Payment Integration | Payments |
| **後端 C** | 系統 + 質量 | Audit（2 項）、IP Whitelist | System Settings、Messages、Quality（3 項） | — |
| **後端 D** | 遊戲 + 內容 | 基礎架構協助 | Games（4 項）、Promotions（3 項）、Reports | Layout、Official |

### 工作項掛載（依里程碑）

```
=== M1-M3 (P0 階段) ===
Lead  → 基礎設施 5 項 + Auth 3 項 + RBAC 2 項
A     → Members 3 項 + Operators 2 項
B     → Finance 7 項
C     → Audit 2 項 + Security(P0 建表)
D     → 協助 Lead / 提前設計 Games schema

=== M4-M6 (P1 階段) ===
Lead  → Finance P1（5 項）+ Integration + 監控設計
A     → Members P1（4 項）+ Agents（4 項）
B     → Queue/Export（2 項）+ Payment Integration
C     → Messages（3 項）+ System Settings（3 項）+ Quality
D     → Games（4 項）+ Promotions（3 項）+ Reports（2 項）

=== M8 (P2 階段) ===
B+D   → Payments（3 項）
D     → Layout（3 項）+ Official（2 項）
C     → Integration（2 項）
```

---

## 八、高風險或高複雜項目識別

### 🔴 高優先度 + 高複雜度

| 項目 | 複雜度 | 原因 | 建議對策 |
|---|---|---|---|
| **Finance 模組** | 🔴 超高 | 涉及鎖單、流水、餘額一致性、狀態流、多表聯動 | Lead 參與架構設計，提前設計狀態機 |
| **Order Lock 機制** | 🔴 高 | 分散式鎖、Redis 依賴、併發控制 | 使用模板的 Redis mutex，單獨 code review |
| **餘額快照機制** | 🟠 中高 | Transaction 一致性、snapshot 同步、性能 | 事先檢視 balance_ledgers 設計，確認 transaction 邊界 |
| **代理結算系統** | 🟠 中高 | 佣金計算複雜、多層級、周期結算 | 待 P1，但 P0 須先建 agent / commission_scheme 表 |

### 🟡 技術選型建議

| 議題 | 建議方案 | 備註 |
|---|---|---|
| **分散式鎖** | 使用模板的 Redsync wrapper | 已驗證，無需重造 |
| **IP 白名單驗證** | 使用模板的 IPWhitelist 型別 | P0 建表 + P1 middleware |
| **事件驅動** | 使用模板的 Event Center (RabbitMQ) | 待確認 proto 定義 |
| **排程任務** | 使用模板的 Scheduler (Redis 選主) | 支援 notification_jobs、report_export_jobs |

---

## 九、已追加的新增項（vs 舊版 docs）

### 會員提款帳戶 `member_bank_accounts`

- **狀態**：P0 建表 + P1 API
- **新增工作項**：#27-1
- **新增 API**：4 個（查詢、新增、編輯、刪除）
- **設計考量**：提款訂單須關聯帳戶，帳戶欄位快照防後續變更影響審計

### 批次通知任務 `notification_jobs`

- **狀態**：P1 建表 + API
- **新增工作項**：在 Messaging 模組
- **對應事件**：`backstage.v1.notification.job_created`
- **使用模板**：Scheduler + RabbitMQ

### IP 白名單 `admin_ip_whitelist_rules`

- **狀態**：P0 建表，P1 middleware
- **分階段**：P0 就建表、儲存規則；P1 啟用 middleware 驗證
- **使用模板**：IPWhitelist 型別

---

## 十、交付物清單（供後端 checklist）

### P0 交付物
- [ ] Backend baseline（skeleton + config）
- [ ] Database + migration framework
- [ ] API 共用規範（response、error、validation）
- [ ] Logger + Exception handler
- [ ] Auth API + token flow
- [ ] RBAC schema + middleware
- [ ] Audit log tables + APIs
- [ ] Operators 管理 APIs
- [ ] Members 主檔 + 狀態管理 APIs
- [ ] Member bank accounts tables + APIs ⭐
- [ ] Finance APIs (deposit, withdrawal, lock, ledger)
- [ ] IP whitelist table + validation logic (P0/P1)

### P1 交付物
- [ ] 會員標籤、等級、備註系統
- [ ] 代理與佣金系統
- [ ] 報表匯出機制
- [ ] 訊息模板 + 批次通知系統
- [ ] 系統設定、公告、銀行帳戶配置
- [ ] 金流 callback + 狀態同步
- [ ] 測試套件（單元 / 整合 / 流程）
- [ ] 性能優化報告
- [ ] API 文件（Swagger）

---

## 補充說明

### 為何 member_bank_accounts 提早到 P0？

原因在於 `withdrawal_orders` 審核流程需要查詢提款目的地帳號，若 P0 沒有帳戶資料，提款審核就無法完成。因此建議：

- **P0**：建立 `member_bank_accounts` 表 + 基本增刪改查 API
- **P1**：擴充帳戶驗證、默認帳戶邏輯、帳戶狀態流程

### ConnectRPC vs REST 的決策

根據 `backend-template-integration-report.md`，模板預設使用 **ConnectRPC**，但 YOTA docs 規劃的是 **REST**。建議：

- 與後端夥伴確認是否改用 REST router（更適合前端直連）
- 或在模板基礎上保留 ConnectRPC 但提供 HTTP JSON 模式相容
- 此決策會影響前端串接方式，**務必提早確認**

