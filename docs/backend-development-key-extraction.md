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

### API 總數：125 個

| 優先序 | 數量 | 百分比 | 說明 |
|---|---|---|---|
| **P0** | 27 個 | 21.6% | 核心基礎設施 + Auth + 會員 + 財務必要操作 |
| **P1** | 76 個 | 60.8% | 業務主流程擴展 + 報表 + 三方整合 |
| **P2** | 22 個 | 17.6% | 內容管理 + 官網 + 支付配置 |

### P0 API 清單（27 個）

**基礎設施（5 個）**
1. `POST /auth/login` — 後台登入
2. `POST /auth/logout` — 後台登出
3. `GET /permissions` — 取得權限清單
4. `GET /roles` — 取得角色清單
5. `GET /audit-logs` — 查詢審計日誌

**操作人員（3 個）**
6. `GET /operators` — 查詢操作人員列表
7. `GET /operators/{id}` — 取得操作人員詳情
8. `PATCH /operators/{id}/status` — 更新操作人員狀態

**會員（3 個）**
9. `GET /members` — 查詢會員列表
10. `GET /members/{id}` — 取得會員詳情
11. `PATCH /members/{id}/status` — 更新會員狀態

**財務（10 個）**
12. `GET /dashboard/summary` ⚠️ **注：此為聚合查詢，實際為一個大 API**
13. `GET /members/{id}/bank-accounts` — 查詢會員提款帳戶 ⭐ **新增**
14. `POST /members/{id}/bank-accounts` — 新增會員提款帳戶 ⭐ **新增**
15. `PATCH /members/{id}/bank-accounts/{bankAccountId}` — 編輯提款帳戶 ⭐ **新增**
16. `DELETE /members/{id}/bank-accounts/{bankAccountId}` — 刪除提款帳戶 ⭐ **新增**
17. `GET /finance/summary` — 財務總覽
18. `GET /manual-deposits` — 查詢手工存款單列表
19. `GET /manual-deposits/{id}` — 取得手工存款單詳情
20. `GET /online-deposits` — 查詢在線存款單列表
21. `GET /withdrawals` — 查詢提款單列表
22. `GET /withdrawals/{id}` — 取得提款單詳情

**其他系統（6 個）**
23. `PATCH /operators/{id}/roles` — 指派操作人員角色
24. `POST /operator-groups` — 建立操作群組
25. `GET /system-settings` — 取得系統設定
26. `POST /operators/{id}/audit-check` — 對操作人員進行審計檢查
27. `GET /login-logs` — 查詢登入紀錄

---

## 四、後端開發工作清單統計

### 工作總數：72 項

| 類別 | P0 | P1 | P2 | 合計 |
|---|---|---|---|---|
| 基礎平台 | 5 | — | — | 5 |
| Auth / Token | 3 | — | — | 3 |
| RBAC | 2 | 2 | — | 4 |
| Audit | 2 | 2 | — | 4 |
| Security | 1 | 1 | — | 2 |
| Queue / Export | — | 2 | — | 2 |
| Operators | 2 | 3 | — | 5 |
| Members | 3 | 4 | — | 7 ⭐ **+1 提款帳戶** |
| Finance | 7 | 4 | — | 11 ⭐ **+1 提款帳戶** |
| System Settings | — | 3 | — | 3 |
| Messages | — | 3 | — | 3 |
| Agents | — | 4 | — | 4 |
| Games | — | 4 | — | 4 |
| Promotions | — | 3 | — | 3 |
| Reports | — | 2 | — | 2 |
| Layout | — | — | 3 | 3 |
| Official Site | — | — | 2 | 2 |
| Payments | — | — | 3 | 3 |
| Integration | — | 2 | 2 | 4 |
| Quality | — | 3 | — | 3 |
| Delivery | — | 1 | — | 1 |
| **總計** | **26** | **39** | **10** | **75** |

### 優先序分布

```
P0 (26 項) ━━━━━━━━━━━━━━━━━ 35%
   └─ 基礎設施 5 + Auth 3 + RBAC 2 + Audit 2 + Security 1 + Operators 2 + Members 3 + Finance 7 + 其他 1

P1 (39 項) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 52%
   └─ 業務主流程擴展、報表、整合、測試品質

P2 (10 項) ━━━━━ 13%
   └─ 內容管理、官網、支付管理
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

### 第二階段推進（P1 優先順序建議）

#### 優先度 1：業務主流程（完成 P0 後立即啟動）
- 會員標籤、等級、備註系統
- 代理與佣金系統
- 點數調整與批次任務

#### 優先度 2：系統與運營
- 系統設定
- 公告管理
- 訊息模板與發送

#### 優先度 3：遊戲與活動
- 遊戲平台管理
- 優惠與成就

#### 優先度 4：質量與交付
- 單元 / 整合 / 流程測試
- 效能優化（查詢、索引、快取）
- 監控與告警
- API 文件完善

---

## 六、關鍵里程碑建議

### 時間線估算（基於 5 人後端團隊）

| 里程碑 | 目標 | 預期耗時 | 交付物 |
|---|---|---|---|
| **M1：基礎交付** | 前端可串接核心業務 API | 2.5 周 | 基礎設施 + Auth + Operators + Members 主檔 |
| **M2：財務上線** | 完整存提款流程 | +2.5 周 | 存款、提款、流水、訂單鎖、餘額快照 |
| **M3：P0 完成** | 後台能獨立營運 | +4.5 周 | 審計、IP 白名單、所有 P0 工作項 |
| **M4：業務擴展** | 代理、成就、活動上線 | +4 周 | 代理結算、優惠、成就系統 |
| **M5：功能完整** | 遊戲、官網、報表上線 | +3 周 | 內容管理、官網、報表匯出 |
| **M6：質量達標** | 測試覆蓋 + 優化完成 | +2 周 | 測試套件 + 監控告警 + 性能報告 |

**總預期：18.5 周（約 4.5 個月）**

> 💡 此為理想情況，未考慮學習曲線、第三方整合延遲、變更需求等因素。建議設定 20-24 周的實際預期。

---

## 七、資源分配建議（5 人團隊）

### 分工模型

| 人員 | 分工 | P0 工作項 | P1 延伸 |
|---|---|---|---|
| **後端 Lead** | 架構設計 + Core API | 基礎設施、Auth、Finance | 報表、監控、交付文件 |
| **後端 A** | 會員 + 代理模組 | Members、Operators | Agents、Settlement |
| **後端 B** | 財務 + 金流 | Finance、Order Lock | Payments Integration、Settlement |
| **後端 C** | 系統 + 質量 | Audit、IP Whitelist | Testing、Performance、Messaging |
| **後端 D** | 內容 + 遊戲 | 基礎架構協助 | Games、Layout、Content |

### 工作項掛載示例

```
基礎設施（5 項）→ Lead + C 協作
Auth（3 項） → Lead
Members（7 項） → A
Finance（11 項） → B + Lead
Operators（5 項） → C
Audit（4 項） → C
...
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

