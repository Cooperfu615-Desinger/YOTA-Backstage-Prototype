# YOTA Backstage Prototype 資料表 / Domain Model 初稿

> 文件目的：依照目前已交付的 Vue 後台原型，整理後端接手時的核心 domain model 草稿。
>  
> 使用情境：用於與後端、SA、PM 討論系統邊界、核心實體、資料責任與模組切分。

---

## 1. 文件定位

這份文件聚焦在「domain model」，不是資料庫欄位明細，也不是最終 entity schema。

它主要回答以下問題：

- 系統中有哪些核心實體
- 這些實體分屬哪個業務模組
- 實體與實體之間的關聯是什麼
- 哪些是主資料、哪些是交易資料、哪些是設定資料
- 哪些內容應該優先拆成獨立 domain

建議和以下文件搭配使用：

- [backend-api-module-plan.md](/Users/cooperfu/Desktop/Yota_Prototype/docs/backend-api-module-plan.md)
- [backend-development-worklist.md](/Users/cooperfu/Desktop/Yota_Prototype/docs/backend-development-worklist.md)

---

## 2. 建模原則

### 2.1 建模基準

- 以目前前端原型中的頁面、欄位、流程、角色與操作行為為主
- 不直接把 demo 假資料內容視為正式 schema
- 先定義實體與關聯，再往 entity / table 落地

### 2.2 建模視角

本文件中的資料實體分成四類：

- 主資料：相對穩定、被多模組引用的核心資料
- 交易資料：具流程、狀態流、歷程的業務資料
- 設定資料：系統或內容配置資料
- 審計資料：追蹤操作、登入、異動歷程的紀錄資料

### 2.3 命名原則

此文件使用英文 domain 名稱搭配中文說明，方便後續銜接：

- API 命名
- entity 命名
- migration 命名
- 文件命名

---

## 3. Domain 總覽

建議後端至少拆成以下核心 domain：

1. IAM Domain
2. Member Domain
3. Finance Domain
4. Agent Domain
5. Catalog Domain
6. Promotion Domain
7. Messaging Domain
8. CMS / Content Domain
9. Reporting Domain
10. Integration Domain

---

## 4. IAM Domain

IAM 指 Identity and Access Management，負責後台登入、帳號、群組、角色與權限。

### 4.1 核心實體

- `AdminUser`
  - 後台操作人員主體
- `Role`
  - 角色定義
- `Permission`
  - 權限點定義
- `OperatorGroup`
  - 操作群組
- `AdminSession`
  - 後台登入 session / refresh token 資訊
- `AdminIpWhitelistRule`
  - IP 白名單規則

### 4.2 關聯

- `AdminUser` 對 `OperatorGroup`：多對一或多對多，依實際權限策略決定
- `OperatorGroup` 對 `Role`：多對一或多對多
- `Role` 對 `Permission`：多對多
- `AdminUser` 對 `AdminSession`：一對多
- `AdminUser` 對 `AdminIpWhitelistRule`：一對多

### 4.3 資料責任

IAM domain 應負責：

- 認證
- 授權
- 後台人員帳號生命週期
- 權限定義與綁定
- 登入限制

---

## 5. Audit Domain

雖然可視為 IAM 延伸，但因重要性高，建議獨立看待。

### 5.1 核心實體

- `AuditLog`
  - 後台操作日誌
- `LoginLog`
  - 登入與登出記錄
- `ResourceChangeLog`
  - 關鍵資料異動前後值
- `ApprovalActionLog`
  - 審核動作紀錄

### 5.2 關聯

- `AuditLog` 對 `AdminUser`：多對一
- `ApprovalActionLog` 對 `AdminUser`：多對一
- `ApprovalActionLog` 可關聯 `WithdrawalOrder`、`ManualDepositOrder`、`Announcement` 等資源

### 5.3 資料責任

- 記錄誰做了什麼
- 記錄何時做
- 記錄操作對象
- 記錄狀態變化與原因

---

## 6. Member Domain

對應前端中的會員列表、會員詳情、標籤、等級與會員日誌。

### 6.1 核心實體

- `Member`
  - 會員主資料
- `MemberProfile`
  - 會員補充資料，可視情況與 `Member` 合併
- `MemberBankAccount`
  - 會員提款帳戶（銀行帳號、電子錢包等），供提款申請時關聯使用
- `MemberTag`
  - 標籤主資料
- `MemberTagAssignment`
  - 會員與標籤關聯
- `MemberLevel`
  - 會員等級定義
- `MemberLevelAdjustment`
  - 會員等級調整紀錄
- `MemberNote`
  - 後台人工備註
- `MemberLog`
  - 會員操作 / 行為紀錄
- `MemberStatusHistory`
  - 狀態變更歷程

### 6.2 關聯

- `Member` 對 `MemberTag`：多對多，透過 `MemberTagAssignment`
- `Member` 對 `MemberLevel`：多對一
- `Member` 對 `MemberLevelAdjustment`：一對多
- `Member` 對 `MemberNote`：一對多
- `Member` 對 `MemberLog`：一對多
- `Member` 對 `MemberBankAccount`：一對多
- `MemberNote` 對 `AdminUser`：多對一
- `MemberLevelAdjustment` 對 `AdminUser`：多對一

### 6.3 資料責任

- 會員主檔
- 會員標籤與等級體系
- 後台對會員的操作留痕
- 會員提款帳戶維護

---

## 7. Finance Domain

這是整個後端最重要的業務 domain 之一，需高度重視狀態流、鎖單、審核、稽核與一致性。

### 7.1 核心實體

- `ManualDepositOrder`
  - 手工存款申請 / 審核資料
- `OnlineDepositOrder`
  - 線上入款訂單
- `WithdrawalOrder`
  - 提款申請單
- `OrderLock`
  - 審核作業鎖
- `BalanceLedger`
  - 資金流水主體
- `ManualAdjustment`
  - 人工存提 / 調整作業
- `PointAdjustment`
  - 點數調整紀錄
- `PointAdjustmentBatchTask`
  - 批次點數任務
- `BetRecord`
  - 下注紀錄
- `AutoPaymentStatusSnapshot`
  - 自動金流狀態快照或聚合結果

### 7.2 關聯

- `ManualDepositOrder` 對 `Member`：多對一
- `OnlineDepositOrder` 對 `Member`：多對一
- `WithdrawalOrder` 對 `Member`：多對一
- `OrderLock` 對 `WithdrawalOrder`：一對一或一對多歷史
- `OrderLock` 對 `AdminUser`：多對一
- `BalanceLedger` 對 `Member`：多對一
- `ManualAdjustment` 對 `Member`：多對一
- `ManualAdjustment` 對 `AdminUser`：多對一
- `PointAdjustment` 對 `Member`：多對一
- `PointAdjustmentBatchTask` 對 `AdminUser`：多對一
- `BetRecord` 對 `Member`：多對一

### 7.3 建模注意事項

- `BalanceLedger` 建議作為資金變動的最終帳本層
- 存款 / 提款 / 點數調整都應能映射到 ledger
- `OrderLock` 不只是畫面狀態，而是正式業務控制物件
- 審核流程需要有狀態機概念
- **餘額快照機制**：`BalanceLedger` 雖是唯一真實來源，但直接 SUM 流水查詢當前餘額效能有限。建議在 `Member` 主表或獨立 `MemberWallet` 實體中維護 `balance` 快照欄位，每次寫入 ledger 時，於同一 transaction 內同步更新快照，確保資料一致性。

**`ManualDepositOrder` 與 `ManualAdjustment` 的邊界：**
- `ManualDepositOrder`：由**會員申請**觸發、須走後台人員**審核流程**的入款（如：玩家轉帳後請求人工到帳）
- `ManualAdjustment`：由**後台主動發起**、不需審核的直接餘額調整（如：後台補分、扣分、系統誤差修正）

### 7.4 狀態型資料

建議在 Finance domain 中明確定義：

- 訂單狀態
- 審核狀態
- 鎖定狀態
- 派發狀態
- callback 狀態

---

## 8. Agent Domain

對應代理商管理、代理等級、佣金設定與結算報表。

### 8.1 核心實體

- `Agent`
  - 代理主資料
- `AgentProfile`
  - 代理補充資料
- `AgentLevel`
  - 代理等級
- `AgentRelationship`
  - 上下線關係
- `CommissionScheme`
  - 佣金方案
- `AgentCommissionRule`
  - 佣金規則明細
- `SettlementPeriod`
  - 結算期間
- `AgentSettlement`
  - 結算結果

### 8.2 關聯

- `Agent` 對 `AgentLevel`：多對一
- `AgentRelationship` 自關聯 `Agent`（上下線結構）
- `Agent` 對 `CommissionScheme`：多對一（透過 `agents.commission_scheme_id` FK 綁定）
- `SettlementPeriod` 對 `AgentSettlement`：一對多
- `AgentSettlement` 對 `Agent`：多對一

### 8.3 資料責任

- 代理主檔
- 代理層級與組織關係
- 佣金規則
- 結算週期與結算結果

---

## 9. Catalog Domain

對應遊戲平台、遊戲清單與遊戲分類。

### 9.1 核心實體

- `GamePlatform`
  - 遊戲平台主資料
- `GamePlatformMaintenanceWindow`
  - 平台維護時段
- `Game`
  - 遊戲主資料
- `GameCategory`
  - 遊戲分類
- `GameCategoryAssignment`
  - 遊戲與分類關聯
- `GameTag`
  - 若後續需要細化遊戲標籤，可再拆

### 9.2 關聯

- `Game` 對 `GamePlatform`：多對一
- `Game` 對 `GameCategory`：多對多，透過 `GameCategoryAssignment`
- `GamePlatform` 對 `GamePlatformMaintenanceWindow`：一對多

### 9.3 資料責任

- 遊戲主檔
- 平台狀態
- 分類與展示結構

---

## 10. Promotion Domain

對應優惠活動、特殊活動與成就設定。

### 10.1 核心實體

- `Promotion`
  - 優惠活動主體
- `PromotionRule`
  - 活動規則
- `SpecialEvent`
  - 特殊活動
- `Achievement`
  - 成就或任務設定
- `AchievementReward`
  - 成就獎勵

### 10.2 關聯

- `Promotion` 對 `PromotionRule`：一對多
- `Achievement` 對 `AchievementReward`：一對多
- `SpecialEvent` 可關聯 `Game`、`MemberLevel`、`MessageTemplate`

### 10.3 資料責任

- 活動主檔
- 活動規則
- 任務與獎勵條件

---

## 11. Messaging Domain

對應訊息模板、通道設定與發送紀錄。

### 11.1 核心實體

- `MessageTemplate`
  - 訊息模板
- `MessageChannelConfig`
  - 通道設定
- `MessageSendLog`
  - 發送紀錄
- `MessageTestSendLog`
  - 測試發送紀錄，可視情況與 send log 共用
- `NotificationJob`
  - 批次通知任務

### 11.2 關聯

- `MessageSendLog` 可關聯 `MessageTemplate`
- `MessageSendLog` 可關聯 `Member`、`Agent` 或純外部收件人
- `NotificationJob` 對 `AdminUser`：多對一

### 11.3 資料責任

- 模板管理
- provider 設定
- 發送結果留痕

---

## 12. CMS / Content Domain

這個 domain 包含 Layout 與 Official Site 兩類內容型模組。若團隊希望簡化，也可以視為單一 CMS domain。

### 12.1 核心實體

- `HomepageConfig`
  - 首頁設定主體
- `HomepageSection`
  - 首頁區塊
- `GameDisplayBlock`
  - 遊戲展示區塊
- `ContentPage`
  - 靜態頁 / 文章頁
- `PaymentLayoutConfig`
  - 支付版型設定
- `SplashAd`
  - 開屏廣告
- `HeroConfig`
  - 官網首圖
- `WebsiteBanner`
  - 官網輪播
- `NewsArticle`
  - 官網新聞
- `GameShowcase`
  - 官網遊戲展示
- `SeoSetting`
  - SEO 與站點資訊

### 12.2 關聯

- `HomepageConfig` 對 `HomepageSection`：一對多
- `GameDisplayBlock` 可關聯 `GameCategory`、`Game`
- `ContentPage` 可關聯上傳素材
- `SplashAd` 可關聯 `Promotion`、`ContentPage` 或外部 URL
- `GameShowcase` 對 `Game`：多對一

### 12.3 建模注意事項

- 內容型資料通常需要：
  - 草稿狀態
  - 發布狀態
  - 排程
  - 上下架時間
- `NewsArticle` 與 `ContentPage` 是否合併，需依內容策略決定

---

## 13. Payments Domain

雖然部分支付資訊與 Finance 有關，但前端目前獨立了 Payments 模組，建議在 domain 上保留其配置與主檔責任。

### 13.1 核心實體

- `Merchant`
  - 商號主檔
- `PaymentBankAccount`
  - 金流專用銀行帳號
- `AppPurchaseOrder`
  - 行動支付 / app purchase 訂單
- `PaymentProvider`
  - 支付提供者主檔

### 13.2 關聯

- `Merchant` 對 `PaymentProvider`：多對一
- `AppPurchaseOrder` 可關聯 `Member`
- `PaymentBankAccount` 可關聯 `Merchant`

### 13.3 資料責任

- 商號主資料
- 金流配置主資料
- 行動支付相關訂單查詢

### 13.4 與 Finance 的邊界

建議區分如下：

- `Payments Domain`：處理商號、支付主檔、通道設定、配置類資料
- `Finance Domain`：處理入款、出款、審核、流水、鎖單、帳務結果

---

## 14. Dashboard（無獨立 Domain）

Dashboard 模組（`/dashboard/*`）屬於**跨 Domain 聚合查詢**，不擁有獨立主資料表。

其 API 所需資料來源包括：
- Finance Domain：財務摘要、待審核訂單數
- Member Domain：新增會員數、異常狀態會員
- Agent Domain：結算待辦
- Audit Domain：異常登入與操作警告

建議實作為獨立的 `DashboardQueryService`，由後端聚合上述 domain 資料後回傳，**不另建 migration**。

---

## 15. Reporting Domain

報表通常不是單一資料來源，而是聚合多個 domain 的查詢結果。

### 15.1 核心實體

報表 domain 可不一定擁有太多主資料，但可考慮以下物件：

- `ReportDefinition`
  - 報表定義
- `ReportExportJob`
  - 報表匯出任務
- `ReportSnapshot`
  - 若需保留某時點聚合資料，可做快照

### 15.2 資料來源

- Members
- Finance
- Agents
- Games
- Promotions
- Messaging

### 15.3 建模原則

- 報表 domain 以 query service 為主
- 若查詢昂貴，可做 materialized data 或 snapshot

---

## 16. Integration Domain

這個 domain 用來承接第三方系統互動，不一定直接對應前端畫面，但正式系統很重要。

### 16.1 核心實體

- `PaymentCallbackLog`
  - 金流 callback 紀錄
- `ExternalSyncJob`
  - 外部同步任務
- `ProviderWebhookEvent`
  - 外部 webhook 事件
- `FileAsset`
  - 上傳資產

### 16.2 資料責任

- 第三方回調留痕
- 同步任務狀態
- 錯誤重試
- 媒體檔案管理

---

## 17. 核心關聯總結

以下是目前最重要的跨 domain 關聯：

- `AdminUser` -> 幾乎所有審計、審核、人工操作類資料
- `Member` -> Finance、Messaging、Promotion、AppPurchaseOrder
- `Agent` -> Member、Settlement、Commission
- `Game` -> Catalog、Promotion、Content、Reporting
- `Promotion` -> SplashAd、Achievement、可能的通知模板
- `MessageTemplate` -> Messaging、Promotion、Announcement 類延伸場景

---

## 18. 優先建模建議

若後端要先做第一版，建議先建模以下實體群：

### P0 Domain Model

- `AdminUser`
- `Role`
- `Permission`
- `OperatorGroup`
- `AuditLog`
- `Member`
- `MemberTag`
- `MemberLevel`
- `MemberBankAccount`
- `ManualDepositOrder`
- `OnlineDepositOrder`
- `WithdrawalOrder`
- `OrderLock`
- `BalanceLedger`

### P1 Domain Model

- `Announcement`
- `PaymentChannel`
- `BankAccount`
- `MessageTemplate`
- `MessageChannelConfig`
- `Agent`
- `AgentLevel`
- `CommissionScheme`
- `SettlementPeriod`
- `GamePlatform`
- `Game`
- `GameCategory`
- `Promotion`
- `Achievement`

### P2 Domain Model

- `HomepageConfig`
- `HomepageSection`
- `ContentPage`
- `SplashAd`
- `HeroConfig`
- `WebsiteBanner`
- `NewsArticle`
- `GameShowcase`
- `SeoSetting`
- `Merchant`
- `PaymentBankAccount`
- `AppPurchaseOrder`

---

## 19. 建模時需要先確認的決策

這些問題若能先定下來，之後做 entity 與資料表設計會順很多：

1. `AdminUser` 是直接綁 `Role`，還是先綁 `OperatorGroup` 再映射 `Role`
2. `MemberProfile` 是否與 `Member` 分表
3. `BalanceLedger` 是否作為唯一帳務真實來源
4. `OrderLock` 是單獨表，還是寫進訂單欄位
5. `NewsArticle` 與 `ContentPage` 是否共用一套內容模型
6. `Promotion` 與 `Achievement` 是否共用規則引擎
7. `Payments Domain` 與 `Finance Domain` 的責任邊界是否完全分開
8. 報表要即時計算、快照、還是混合方式

---

## 20. 下一步建議

這份文件完成後，最適合的下一步是做：

1. `資料表 / Entity 初稿`
2. `主要關聯 ER 草圖`
3. `P0 模組 migration 清單`

建議先從以下 domain 開始落 entity：

1. IAM
2. Audit
3. Member
4. Finance

---

## 20. 總結

這份 domain model 草稿的目的，是讓後端團隊先對齊這套後台系統的核心世界觀：

- 誰是主資料
- 誰是交易資料
- 誰是設定資料
- 誰負責流程
- 誰負責審計

若這一層先對齊，後面不論是 API、entity、migration、service 邊界，都會順很多。

以目前這個專案來看，最重要的 domain 仍然是：

1. IAM
2. Audit
3. Member
4. Finance

這四塊會是後端第一波建模與落地的核心。
