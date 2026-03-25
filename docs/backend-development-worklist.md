# YOTA Backstage Prototype 後端開發工作清單

> 文件目的：整理目前 Vue 後台原型交接給後端後，實際需要承接的工作內容。
>  
> 使用情境：用於與後端團隊溝通範圍、排定優先序、拆分階段、確認交付物。

---

## 1. 文件定位

這份文件不是 API 細節規格，也不是資料表設計書，而是從「後端開發工作」的角度，將目前原型轉成可以討論與排程的工作清單。

建議和 [backend-api-module-plan.md](/Users/cooperfu/Desktop/Yota_Prototype/docs/backend-api-module-plan.md) 搭配使用：

- `backend-api-module-plan.md`：回答「應該有哪些 API 模組」
- `backend-development-worklist.md`：回答「後端要實際完成哪些工作」

---

## 2. 工作拆分原則

### 2.1 拆分基準

- 以現有前端原型的頁面、流程、欄位、按鈕為主
- 以後台可實際串接與營運為目標
- 不把 demo 假資料直接當正式資料模型
- 不把前端顯示效果誤認成後端必要能力

### 2.2 優先序定義

- `P0`：缺少會直接影響後台核心功能上線
- `P1`：重要主流程，建議在基礎能力完成後接續開發
- `P2`：次優先，可依排程分批補完

### 2.3 建議交付觀念

後端每個工作項目最好都能對應以下其中一種交付物：

- API
- 資料表 / migration
- 業務規則
- 權限檢查
- 日誌 / 審計
- 排程 / 非同步任務
- 第三方串接
- 技術文件

---

## 3. 後端開發主工作流

建議後端工作從下列 6 條主線來推進：

1. 基礎平台能力
2. 認證與權限
3. 核心營運模組
4. 內容管理模組
5. 第三方整合
6. 維運與交付能力

---

## 4. 工作清單總覽

### 4.1 基礎平台能力

目標：

- 建立後端專案基礎骨架
- 建立統一的 API、錯誤處理、日誌、環境配置與 migration 流程

工作內容：

- 建立專案目錄與模組結構
- 建立環境設定與 secrets 管理方式
- 建立資料庫連線與 migration 機制
- 建立共用 API response / error 格式
- 建立 request validation 機制
- 建立 logging 機制
- 建立 exception handling
- 建立 health check endpoint
- 建立 OpenAPI / Swagger 或等效文件機制

交付物：

- 可啟動的後端專案 baseline
- API 基礎規範
- migration 流程
- 開發與部署環境說明

優先序：`P0`

### 4.2 認證與權限

目標：

- 將目前前端 mock login / mock role 轉成正式後端能力

工作內容：

- 管理員登入與登出
- access token / refresh token
- 取得當前登入者資訊
- 修改密碼 / 重設密碼
- 管理員帳號狀態管理
- 角色、權限、群組資料表設計
- 權限檢查 middleware / guard
- 頁面權限、操作權限、資料權限策略
- IP 白名單驗證（P0 先建 `admin_ip_whitelist_rules` 資料表，P1 啟用 middleware 驗證邏輯）
- 登入記錄與異常登入保留

交付物：

- Auth API
- RBAC API
- 權限 middleware
- 帳號與角色資料表

優先序：`P0`

### 4.3 審計與操作留痕

目標：

- 所有關鍵後台行為可追蹤、可追查、可審核

工作內容：

- 設計操作日誌模型
- 保留關鍵操作前後值
- 記錄審核動作、駁回原因、操作者
- 記錄登入與登出歷程
- 記錄狀態變更歷程
- 補上查詢 API

交付物：

- audit log table
- login log table
- audit log query API

優先序：`P0`

### 4.4 匯出與非同步任務機制

目標：

- 支援大表格匯出、報表匯出、批次通知、批次點數發放等需求

工作內容：

- 建立 export job 模型
- 建立 queue / worker 架構
- 支援匯出任務建立、查詢、下載
- 設計失敗重試與狀態管理
- 批次任務執行日誌

交付物：

- 匯出任務 API
- job queue 機制
- worker 執行流程

優先序：`P1`

---

## 5. 核心營運模組工作清單

這一區是最需要優先與後端對齊的主體。

### 5.1 Operators

目標：

- 支援後台操作人員與群組管理

工作內容：

- 操作人員 CRUD
- 群組 CRUD
- 群組與權限綁定
- 操作人員與群組關聯
- IP 白名單設定
- 操作日誌查詢
- 匯出中心資料來源

交付物：

- operators API
- operator groups API
- IP whitelist API
- operation logs API

優先序：`P0`

### 5.2 Members

目標：

- 將會員管理相關畫面落成正式後端資料與流程

工作內容：

- 會員列表與篩選查詢
- 會員詳情查詢
- 會員狀態更新
- 會員備註 / memo
- 會員標籤管理
- 會員等級管理
- 等級調整歷程
- 會員行為日誌查詢

交付物：

- members API
- member tags API
- member levels API
- member notes API
- member logs API

優先序：`P0`

### 5.3 Finance

目標：

- 建立入款、提款、鎖單、調整、流水查詢等核心財務能力

工作內容：

- 財務總覽資料彙總
- 手工存款單查詢與審核
- 在線存款單查詢
- **會員提款帳戶管理**（`member_bank_accounts`，提款審核的必要前置資料）
- 提款單查詢與審核
- 鎖單與解鎖機制
- 防重複審核與併發控制
- 拒絕 / 駁回原因紀錄
- 沖正流程
- **餘額快照機制**（`balance_ledgers` 為唯一帳務來源，但需在 `members` 或獨立表維護餘額快照以支援即時查詢）
- 資金流水紀錄
- 人工存提紀錄
- 下注紀錄查詢
- 點數調整
- 批次點數任務
- 自動金流狀態

交付物：

- finance summary API
- deposit / withdrawal / adjustment APIs
- member bank accounts API
- order lock 機制
- ledger / balance logs
- points adjustment APIs

優先序：`P0`

備註：

- 這是後端最重要的業務模組之一
- 所有審核型功能都必須搭配權限、審計、狀態流與交易一致性
- `member_bank_accounts` 建議與提款流程一起在 P0/P1 落地，避免提款審核時無帳戶資料可查

### 5.4 System Settings

目標：

- 將系統參數、公告與支付配置落成正式設定資料

工作內容：

- 站點設定
- 營運參數設定
- 安全設定
- 公告 CRUD
- 公告排程 / 發布狀態
- 支付通道設定
- 銀行與錢包設定

交付物：

- system settings API
- announcements API
- payment channels API
- bank accounts API

優先序：`P1`

### 5.5 Messages

目標：

- 支援模板管理、通道設定與訊息發送紀錄

工作內容：

- 訊息模板 CRUD
- Email / SMS / Telegram 通道設定
- 測試發送
- 發送紀錄查詢
- 後續如需批量發送，納入 queue

交付物：

- message templates API
- message channel settings API
- message logs API
- test send API

優先序：`P1`

### 5.6 Agents

目標：

- 支援代理商管理、佣金方案與結算

工作內容：

- 代理列表與詳情
- 代理狀態管理
- 代理等級
- 佣金方案
- 結算資料生成
- 結算報表查詢

交付物：

- agents API
- agent levels API
- commission schemes API
- settlement APIs

優先序：`P1`

### 5.7 Games

目標：

- 支援遊戲平台、遊戲清單、分類與維護排程

工作內容：

- 遊戲平台 CRUD
- 平台狀態與維護時段
- 遊戲 CRUD
- 遊戲上下架狀態
- 遊戲分類管理

交付物：

- game platforms API
- games API
- game categories API

優先序：`P1`

### 5.8 Promotions

目標：

- 支援優惠、活動與成就配置

工作內容：

- 優惠活動 CRUD
- 活動啟用與停用
- 特殊活動條件設定
- 成就與任務設定

交付物：

- promotions API
- special events API
- achievements API

優先序：`P1`

### 5.9 Reports

目標：

- 將報表頁面所需資料轉成正式聚合查詢能力

工作內容：

- 報表總覽彙總
- 遊戲表現報表
- 現金報表
- 存款報表
- 贈金報表
- 營運報表
- 報表匯出任務

交付物：

- reports query APIs
- reports export API

優先序：`P1`

---

## 6. 內容管理模組工作清單

### 6.1 Layout

目標：

- 支援首頁、遊戲展示、文章與支付版面等內容型設定

工作內容：

- 首頁版面設定
- 遊戲展示排序與區塊配置
- 文章 / 靜態頁內容管理
- 支付版型設定
- 開屏廣告管理與排程

交付物：

- homepage layout API
- game config API
- content pages API
- payment layouts API
- splash ads API

優先序：`P2`

### 6.2 Official Site

目標：

- 支援官網內容維護

工作內容：

- 首圖設定
- 官網輪播
- 新聞 / 最新消息
- 官網遊戲展示
- SEO 與站點資訊

交付物：

- official hero API
- official banners API
- official news API
- game showcase API
- SEO settings API

優先序：`P2`

### 6.3 Payments

目標：

- 支援商號、銀行與行動支付管理

工作內容：

- 商號管理
- 金流用銀行帳號管理
- 行動支付訂單查詢
- 支付提供者資料整理

交付物：

- merchants API
- payment bank accounts API
- app purchase order APIs

優先序：`P2`

---

## 7. 第三方整合工作清單

這部分未必會在第一階段全部完成，但建議先在架構上預留。

### 7.1 支付與金流整合

工作內容：

- 串接第三方支付 gateway
- callback / webhook 接收
- 支付狀態同步
- 派單 / 對帳 / 失敗補償

優先序：`P1`

### 7.2 通知服務整合

工作內容：

- Email provider
- SMS provider
- Telegram bot 或通知通道
- 發送重試與失敗記錄

優先序：`P1`

### 7.3 媒體與檔案儲存

工作內容：

- 圖片與附件儲存服務
- 權限控管
- URL 或檔案存取策略

優先序：`P2`

### 7.4 遊戲平台 / 外部資料源

工作內容：

- 遊戲平台主檔同步
- 狀態同步
- 遊戲列表更新

優先序：`P2`

---

## 8. 維運與品質工作清單

### 8.1 測試

工作內容：

- 單元測試
- 整合測試
- 權限測試
- 審核流程測試
- 匯出任務測試

優先序：`P1`

### 8.2 效能與查詢優化

工作內容：

- 列表查詢索引設計
- 報表查詢優化
- 分頁與排序效能檢查
- 熱資料快取

優先序：`P1`

### 8.3 監控與告警

工作內容：

- 錯誤監控
- queue 狀態監控
- 金流 / 審核異常告警
- 服務健康監控

優先序：`P1`

### 8.4 文件與交接

工作內容：

- API 文件
- 環境變數說明
- migration / seed 說明
- 權限模型說明
- 業務流程說明

優先序：`P1`

---

## 9. 建議開發階段

### Phase 1：後台可登入、可授權、可查詢

範圍：

- 基礎平台能力
- Auth / RBAC
- Audit 基礎
- Operators 基礎
- Members 基礎查詢
- Finance 基礎查詢

目標：

- 前端可正式登入
- 權限不再依賴 mock
- 核心列表頁可開始串接

### Phase 2：核心營運流程落地

範圍：

- Finance 審核流程
- Members 操作流程
- Operators 完整維護
- System Settings
- Messages

目標：

- 後台開始具備正式營運能力

### Phase 3：代理、遊戲、報表與內容管理

範圍：

- Agents
- Games
- Promotions
- Reports
- Layout
- Official
- Payments

目標：

- 補齊原型主要模組

### Phase 4：整合、優化、穩定化

範圍：

- 第三方整合
- queue / export / retry
- 效能優化
- 測試與監控

目標：

- 進入可正式維運狀態

---

## 10. 建議會議討論重點

這份文件最適合拿來跟後端討論以下問題：

1. 哪些工作要先做成 `P0`
2. 哪些頁面只需要查詢 API，哪些需要完整寫入流程
3. 哪些操作需要審核與鎖單
4. 哪些功能要先保留為 demo，不立即落成正式邏輯
5. 內容管理與營運管理是否要拆不同後端模組
6. 是否需要 queue、排程、重試機制
7. 第三方整合是否在第一期就納入
8. 權限粒度是頁面級還是操作級

---

## 11. 後端開發工作總表

| 編號 | 工作類別 | 工作項目 | 說明 | 主要交付物 | 優先序 |
|---:|---|---|---|---|---|
| 1 | 基礎平台 | 專案基礎骨架建立 | 建立後端專案、模組結構與環境設定 | backend baseline | P0 |
| 2 | 基礎平台 | 資料庫與 migration 機制 | 建立 DB 連線、migration、seed 流程 | db config, migrations | P0 |
| 3 | 基礎平台 | API 共用規範 | 建立 response、error、validation 標準 | API convention | P0 |
| 4 | 基礎平台 | logging / exception handling | 建立系統日誌與例外處理流程 | logger, exception handler | P0 |
| 5 | 基礎平台 | health check 與文件機制 | 建立健康檢查與 API 文件工具 | health endpoint, Swagger | P0 |
| 6 | Auth | 管理員登入 / 登出 | 正式取代前端 mock login | auth APIs | P0 |
| 7 | Auth | token 與 session 管理 | access token / refresh token 機制 | token flow | P0 |
| 8 | Auth | 密碼管理 | 修改密碼、重設密碼、狀態控管 | password APIs | P0 |
| 9 | RBAC | 角色與權限模型 | 建立 role / permission / group 架構 | RBAC schema | P0 |
| 10 | RBAC | 權限檢查機制 | 將權限控制落到後端 | auth guard / middleware | P0 |
| 11 | Security | IP 白名單機制 | P0 建立 `admin_ip_whitelist_rules` 資料表；P1 啟用 middleware 驗證邏輯 | whitelist table (P0), middleware (P1) | P0/P1 |
| 12 | Audit | 審計日誌模型 | 記錄關鍵操作與異動前後值 | audit tables | P0 |
| 13 | Audit | 登入與操作紀錄 API | 提供後台查詢登入與操作歷程 | audit APIs | P0 |
| 14 | Queue / Export | 匯出任務機制 | 處理大資料量匯出與下載 | export jobs | P1 |
| 15 | Queue / Export | 批次任務框架 | 支援批量通知與批次點數作業 | queue / worker | P1 |
| 16 | Operators | 操作人員管理 | 支援帳號列表、詳情、編輯與狀態管理 | operators APIs | P0 |
| 17 | Operators | 群組與權限綁定 | 支援群組維護與權限掛載 | operator groups APIs | P0 |
| 18 | Operators | IP 白名單設定 | 支援操作人員 IP 管理 | whitelist APIs | P1 |
| 19 | Operators | 人員操作日誌查詢 | 對應操作日誌頁面 | operation log APIs | P1 |
| 20 | Members | 會員列表與查詢 | 對應會員列表頁的條件篩選與分頁 | members list API | P0 |
| 21 | Members | 會員詳情 | 對應會員詳情、狀態與摘要資訊 | member detail API | P0 |
| 22 | Members | 會員狀態管理 | 支援啟用、停用、凍結等狀態切換 | member status API | P0 |
| 23 | Members | 會員備註 / memo | 支援人工備註與歷史紀錄 | notes APIs | P1 |
| 24 | Members | 會員標籤管理 | 支援標籤 CRUD 與掛載 | tag APIs | P1 |
| 25 | Members | 會員等級管理 | 支援等級設定與調整流程 | level APIs | P1 |
| 26 | Members | 會員日誌查詢 | 對應會員行為與操作日誌頁面 | member logs API | P1 |
| 27 | Finance | 財務總覽查詢 | 對應財務總覽與摘要卡 | finance summary API | P0 |
| 27-1 | Finance | 會員提款帳戶管理 | 建立 `member_bank_accounts`，供提款審核時查詢提款目的地 | member bank accounts API | P0 |
| 28 | Finance | 手工存款單流程 | 列表、詳情、審核、拒絕 | manual deposit APIs | P0 |
| 29 | Finance | 在線存款單查詢 | 訂單查詢與狀態展示 | online deposit APIs | P0 |
| 30 | Finance | 提款審核流程 | 列表、詳情、審核、拒絕、沖正 | withdrawal APIs | P0 |
| 31 | Finance | 鎖單 / 解鎖機制 | 防止多人同時處理同一張單 | order lock flow | P0 |
| 32 | Finance | 資金流水紀錄 | 對應 balance logs | ledger APIs | P0 |
| 33 | Finance | 人工存提紀錄 | 對應 adjustment logs | adjustment log APIs | P1 |
| 34 | Finance | 下注紀錄查詢 | 對應 betting records | betting record API | P1 |
| 35 | Finance | 點數調整 | 單筆點數增減與原因紀錄 | points adjustment API | P1 |
| 36 | Finance | 批次點數任務 | 批次獎勵或補點流程 | bulk points job | P1 |
| 37 | Finance | 自動金流狀態 | 對應自動金流頁面 | auto payment API | P1 |
| 38 | System Settings | 系統參數設定 | 站點、營運、安全參數維護 | settings APIs | P1 |
| 39 | System Settings | 公告管理 | 公告 CRUD、排程、發布狀態 | announcements APIs | P1 |
| 40 | System Settings | 銀行與錢包設定 | 支付通道、銀行與錢包配置 | payment channel APIs | P1 |
| 41 | Messages | 訊息模板管理 | 模板 CRUD | template APIs | P1 |
| 42 | Messages | 通道設定管理 | Email / SMS / Telegram 設定 | channel setting APIs | P1 |
| 43 | Messages | 測試發送與發送紀錄 | 測試通知與歷史查詢 | send test API, logs API | P1 |
| 44 | Agents | 代理基本資料管理 | 列表、詳情、狀態維護 | agents APIs | P1 |
| 45 | Agents | 代理等級管理 | 代理層級與條件維護 | agent levels APIs | P1 |
| 46 | Agents | 佣金方案管理 | 佣金規則與方案維護 | commission APIs | P1 |
| 47 | Agents | 結算資料生成與查詢 | 對應結算報表流程 | settlement APIs | P1 |
| 48 | Games | 遊戲平台管理 | 平台 CRUD 與狀態 | platform APIs | P1 |
| 49 | Games | 遊戲清單管理 | 遊戲資料 CRUD 與上下架 | games APIs | P1 |
| 50 | Games | 遊戲分類管理 | 遊戲分類與排序維護 | category APIs | P1 |
| 51 | Games | 平台維護排程 | 平台維護時段與公告 | maintenance APIs | P1 |
| 52 | Promotions | 優惠活動管理 | 優惠內容 CRUD 與狀態切換 | promotions APIs | P1 |
| 53 | Promotions | 特殊活動設定 | 條件與規則維護 | special event APIs | P1 |
| 54 | Promotions | 成就設定 | 任務、獎勵、模板關聯 | achievement APIs | P1 |
| 55 | Reports | 報表查詢能力 | 各類報表的聚合查詢 | report query APIs | P1 |
| 56 | Reports | 報表匯出 | 建立與下載報表匯出任務 | report export APIs | P1 |
| 57 | Layout | 首頁與遊戲版面設定 | 首頁區塊與遊戲展示配置 | layout APIs | P2 |
| 58 | Layout | 文章 / 靜態頁管理 | 對應文章管理內容 | content page APIs | P2 |
| 59 | Layout | 支付版型與開屏廣告 | 支付版型與 splash ads 管理 | payment layout, splash ads APIs | P2 |
| 60 | Official | 官網內容管理 | 首圖、輪播、新聞、遊戲展示 | official content APIs | P2 |
| 61 | Official | SEO 與站點資訊 | SEO、社群連結、頁尾資訊 | SEO APIs | P2 |
| 62 | Payments | 商號管理 | 對應 merchants 管理 | merchant APIs | P2 |
| 63 | Payments | 金流用銀行帳號管理 | 對應銀行帳戶管理 | payment bank account APIs | P2 |
| 64 | Payments | 行動支付訂單查詢 | 對應 app purchase 頁面 | app purchase APIs | P2 |
| 65 | Integration | 第三方金流串接 | gateway callback、狀態同步、補償機制 | payment integration | P1 |
| 66 | Integration | 通知服務串接 | Email / SMS / Telegram provider 串接 | message integrations | P1 |
| 67 | Integration | 檔案與媒體儲存 | 內容模組圖片與附件支援 | upload / media service | P2 |
| 68 | Integration | 遊戲平台資料同步 | 平台與遊戲主檔同步 | sync jobs | P2 |
| 69 | Quality | 測試補齊 | 單元測試、整合測試、流程測試 | test coverage | P1 |
| 70 | Quality | 效能優化 | 查詢效能、索引、快取 | performance tuning | P1 |
| 71 | Quality | 監控與告警 | 服務、任務、金流、錯誤監控 | monitoring setup | P1 |
| 72 | Delivery | 文件與交接 | API、環境、migration、權限模型說明 | technical docs | P1 |

---

## 12. 總結

如果要用一句話總結目前這個專案對後端的工作範圍：

後端不是從零猜需求，而是要把目前這份已確認過功能規格的 Vue 後台原型，落成為一套具備：

- 正式登入與授權
- 可查詢與可編輯資料
- 可執行審核流程
- 可追蹤與可審計
- 可支援匯出與批次作業
- 可整合第三方

的正式後台服務。

若以實務排程來看，最建議先鎖定的工作群組為：

1. 基礎平台能力
2. Auth / RBAC / Audit
3. Operators
4. Members
5. Finance

這五塊完成後，後端就能先支撐前端開始進行第一輪正式串接。
