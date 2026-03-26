# Go 微服務模板分析報告 — 與 YOTA 後台專案整合評估

> 分析日期：2026-03-26
> 分析對象：`template-main.zip`（後端夥伴提供的 Go 微服務起始模板）

---

## 一、模板架構總覽

### 技術棧

| 元件 | 套件 | 說明 |
|---|---|---|
| 語言 | Go 1.25.x | |
| RPC 框架 | ConnectRPC | 非傳統 REST，需評估（詳見第七點） |
| 資料庫 ORM | GORM + PostgreSQL | pgx v5 驅動 |
| 設定管理 | Viper | 支援 env / .env / json / yaml / toml，優先序清晰 |
| 日誌 | Zap | 禁止直接呼叫，須透過封裝的 `logger` package |
| 訊息佇列 | RabbitMQ (`amqp091-go`) | 支援自動重連、心跳 |
| 快取 / 分散式鎖 | Redis (`go-redis v9`) + Redsync | 已封裝，開箱即用 |
| 物件存儲 | AWS S3 SDK v2 | 支援 compatible 服務如 rustfs |
| 排程器 | cron v3 + 自製 Scheduler | 內建 Redis 分散式鎖選主 |
| 事件中心 | 內部套件 (RabbitMQ + Protobuf) | Pub/Sub 強型別事件系統 |
| CLI | Cobra | `database migrate` / `config create` 等子命令 |

### Bootstrap 啟動流程

```
main.go → cmd → bootstrap.Run()
  ├── initConfig()
  ├── loggerSetup()
  ├── databaseSetup() → AutoMigrate → SeedDefault
  ├── redisSetup()
  ├── s3Setup()
  ├── rabbitMQSetup()
  ├── eventCenterSetup()
  ├── schedulerSetup()
  └── serverStart()  ← goroutine，失敗時 cancel context
```

優雅關機透過 `signal.NotifyContext` + `context.WithCancelCause` 實現，所有元件有對應的 `defer close()`。

---

## 二、各元件與 YOTA 需求的對應分析

### ✅ 可直接對應，幾乎不需修改

#### 1. Redis 分散式鎖 → Finance Order Lock

`internal/utils/redis/lock.go` 已封裝好 `NewMutex(name, options...)`，基於 Redsync 實作。

與 YOTA `order_locks` 的對應：

```go
mutex := redis.NewMutex("order_lock:withdrawal:" + orderID)
if err := mutex.Lock(); err != nil {
    return ErrOrderLocked
}
defer mutex.Unlock()
```

可直接用於提款審核的防重複提交與鎖單機制，**無需另外設計**。

---

#### 2. IP 白名單型別 → 操作人員 IP 白名單

`internal/utils/types/ip_whitelist.go` 已實作 `IPWhitelist.CanUse(ip string) bool`，支援：

- 精確 IP 比對
- CIDR 網段比對（如 `192.168.1.0/24`）
- 空白名單時自動拒絕

**直接對應** YOTA docs 中的 `admin_ip_whitelist_rules` 欄位型別。後端在 `admin_users` 或 `operator_groups` 的 Model 中用此型別存白名單陣列即可。

---

#### 3. Permission 型別 → RBAC 權限系統

`internal/utils/types/permission.go` 實作了 `HasOnePermission(list, p)` 函式，支援：

- 完整路徑比對：`admin.finance.deposit.approve`
- 通配符：`admin.finance.*` 可覆蓋所有 finance 子操作
- 格式：`群組.模塊.操作[.細項]`

**直接對應** YOTA docs 中 Permission 的設計方向。建議 YOTA 的權限字串格式統一使用：

```
admin.{module}.{action}[.{detail}]

// 範例：
admin.finance.withdrawal.approve
admin.members.*
admin.agents.commission.view
```

---

#### 4. Scheduler → 批次任務 / 報表匯出 / 結算

`internal/utils/scheduler/scheduler.go` 提供：

- Redis 選主（同一時間只有一個服務節點執行排程）
- Watchdog 自動續期（避免鎖過期後失去選主）
- Panic recovery（任務崩潰不影響排程器本身）
- 優雅停止（等待進行中任務完成）

**對應 YOTA 的應用場景：**

| 排程任務 | cron 表達式 | 對應模組 |
|---|---|---|
| 代理結算週期產生 | `0 0 1 * *`（每月初） | Finance / Agent |
| 報表匯出任務清理 | `0 3 * * *`（每日凌晨） | Reporting |
| 批次通知任務 | `@every 1m` | Messaging |
| 在線金流狀態同步 | `@every 5m` | Payments |

---

#### 5. S3 → file_assets 附件存儲

模板已整合 AWS S3 SDK v2，對應 YOTA docs 中 `file_assets` 的設計（手工存款單附件、報表匯出檔等），規範也明確要求**所有檔案一律走 S3**，直接沿用即可。

---

#### 6. Event Center → 非同步跨服務事件

基於 RabbitMQ + Protobuf 的強型別 Pub/Sub 系統。

**對應 YOTA 的潛在事件：**

| 事件 Key 建議 | 觸發時機 | 消費方 |
|---|---|---|
| `backstage.v1.member.status_changed` | 會員狀態變更 | Audit, Messaging |
| `backstage.v1.withdrawal.approved` | 提款審核通過 | Finance, Messaging |
| `backstage.v1.notification.job_created` | 建立批次通知任務 | Messaging worker |
| `backstage.v1.report.export_requested` | 報表匯出請求 | Reporting worker |

> 注意：需在 `event_center` 專案中定義對應的 `.proto` 事件結構，才能使用強型別發布/訂閱。

---

### ⚠️ 需要補充或調整的部分

#### 7. ConnectRPC vs REST — 關鍵決策

這是最需要與後端夥伴對齊的核心問題。

模板使用 **ConnectRPC**（一種基於 Protobuf 的 RPC 框架），但 YOTA 的 docs 設計的是標準 **REST API**（`GET /members/{id}`、`POST /auth/login` 等）。

ConnectRPC 同時支援 HTTP/1.1 + HTTP/2，也可以用 HTTP JSON 模式呼叫（等同 REST），但：

- 路由定義方式不同（`.proto` 定義 service，而非手寫路由）
- 前端串接方式可能需要調整
- Response 格式不完全是標準 REST JSON 結構

**建議方案（二選一）：**

| 方案 | 說明 | 適合情境 |
|---|---|---|
| **A：沿用 ConnectRPC** | 前端使用 ConnectRPC client 或 HTTP JSON 模式，全部定義在 `.proto` | 若微服務間也需要 gRPC 通訊 |
| **B：改用 REST Router** | 在 `server.go` 基礎上加入 HTTP router（如 `chi` 或 `net/http` mux），棄用 ConnectRPC handler 部分 | 若前端直接串接 REST，且只有一個後台 service |

對於 YOTA 後台管理系統（前端 + 後端直接串接），**建議方案 B** 更為直觀，也與目前 docs 的 API 設計完全吻合。

---

#### 8. JWT 認證中介層 — 模板未包含

模板沒有 JWT/Session 的任何實作。需要自行加入：

- JWT 生成與驗證（建議使用 `golang-jwt/jwt`）
- Auth middleware（從 Header 取 token → 驗證 → 注入 AdminUser 到 context）
- Refresh Token 流程
- Context 工具（模板已有 `internal/utils/context.go` 的 TraceID 模式，可比照擴充 `AdminUserKey`）

---

#### 9. GORM AutoMigrate vs 正式 Migration 管理

模板的 `database migrate` 命令使用 **GORM AutoMigrate**，適合開發階段，但生產環境有風險：

- AutoMigrate 只會新增欄位，不會刪除或修改
- 缺乏 migration version 管理（無法回滾）

**建議**：開發期用 AutoMigrate 快速驗證，正式交付前替換為 `golang-migrate` 或 `atlas` 管理 migration 版本。

---

#### 10. 私有依賴需要內網存取權限

`go.mod` 中有多個 `git.elitepro.ltd` 的私有套件：

- `git.elitepro.ltd/micro-services/event_center`
- `git.elitepro.ltd/micro-services/protobuf`
- `git.elitepro.ltd/micro-services/template-proto`（本地 replace 指向 `../template-proto`）

**需要確認：**

1. 開發環境是否已設定 SSH key 或 HTTPS token 存取 `git.elitepro.ltd`
2. `template-proto` 倉庫是否需要同時 clone 放在 sibling 目錄
3. CI/CD 環境是否能存取上述私有倉庫

---

## 三、Model 規範與 YOTA docs 的對齊確認

模板 README 中的 Model 規範與 YOTA `backend-entity-draft.md` 的設計高度一致，主要對齊點如下：

| 規範 | 模板要求 | YOTA docs 現況 | 狀態 |
|---|---|---|---|
| 主鍵類型 | `uuid.UUID` + `uuidV7`（有索引時） | 定義為 `uuid`，待確認 v7 | ✅ 待確認 |
| 浮點欄位 | `decimal.Decimal`，`type:numeric(20,8)` | 財務欄位用 `decimal` | ✅ 已對齊 |
| 字串預設 | `TEXT`，有長度限制才 `VARCHAR` | 部分欄位有 `string` 但無 size 說明 | ⚠️ 需補 size 標記 |
| 整數預設 | `BIGINT` | 多數欄位用 `int`，未指定 DB 型別 | ⚠️ 需統一 |
| Soft delete | 必須有 `deleted_at gorm.DeletedAt` | 部分 table 未列 `deleted_at` | ⚠️ 需補充 |
| 表名規範 | `TableName()` 方法回傳表名 | docs 已定義表名，需實作對應方法 | ✅ 容易實作 |
| 索引命名 | unique 以 `uidx_` 開頭，一般以 `idx_` 開頭 | docs 有索引說明但無命名規範 | ⚠️ 需補充 |

---

## 四、整合建議行動清單

### P0 — 串接前準備

- [ ] **確認私有套件存取權**：確保開發環境可 clone `git.elitepro.ltd` 的套件，並 clone `template-proto` 至正確路徑
- [ ] **Fork 模板並重命名模組**：將 `go.mod` 的 module name 改為 YOTA 專案的 module 路徑
- [ ] **決定 ConnectRPC vs REST**：與前後端對齊，若選 REST 則在 `bootstrap/server.go` 階段加入 HTTP router
- [ ] **擴充 Config struct**：加入 JWT secret、token TTL、服務名稱等 YOTA 專屬設定
- [ ] **補充 docs 的 Model 細節**：依模板規範，在 `backend-entity-draft.md` 補齊 `deleted_at`、整數型別 `BIGINT`、索引命名前綴 `uidx_`/`idx_`

### P0 — 第一波模組落地

- [ ] **實作 JWT middleware**：參考 `internal/utils/context.go` 的 TraceID 模式，擴充 AdminUser context key
- [ ] **建立 IAM Model**：`admin_users`、`roles`、`permissions`、`operator_groups`，使用模板的 `IPWhitelist` 和 `Permission` 型別
- [ ] **建立 Finance Model**：`withdrawal_orders` 直接使用 Redis `NewMutex()` 實作 order lock
- [ ] **定義 YOTA Event 的 proto**：在 `event_center` 專案中新增 `backstage` domain 事件

### P1 之後

- [ ] **替換 AutoMigrate 為 migration 管理工具**：引入 `golang-migrate` 或 `atlas`，建立版本化 migration 檔
- [ ] **加入通用 middleware**：Request ID、CORS、Rate Limit、Audit Log interceptor
- [ ] **定義 Scheduler 任務清單**：依 YOTA 的 `notification_jobs`、`report_export_jobs` 建立對應排程

---

## 五、總結

這份模板品質相當高，基礎設施元件完整，且有嚴格的開發規範。與 YOTA 的整合程度評估如下：

| 面向 | 評分 | 說明 |
|---|---|---|
| 基礎設施覆蓋率 | ⭐⭐⭐⭐⭐ | PostgreSQL / Redis / RabbitMQ / S3 全覆蓋 |
| YOTA 業務需求契合度 | ⭐⭐⭐⭐ | IPWhitelist、Permission、Scheduler、DistributedLock 高度契合 |
| 開箱即用程度 | ⭐⭐⭐ | 需補 JWT、REST router、YOTA Config 段 |
| 私有依賴風險 | ⚠️ | `git.elitepro.ltd` 套件需要內網存取，需在 CI/CD 環境確認 |
| ConnectRPC 相容性 | ⚠️ | 最大不確定因子，建議優先與後端夥伴對齊 |

**最需要在開始串接前確認的只有兩件事：**

1. 私有套件存取權（`git.elitepro.ltd`）
2. ConnectRPC vs REST 的選擇

其餘部分都可以在開發過程中逐步對齊。
