# YOTA Backstage Prototype 資料表 / Entity 初稿

> 文件目的：依照目前已交付的 Vue 後台原型，整理後端第一版可落地的 entity / table 草稿。
>  
> 使用情境：用於後端討論 migration、資料表拆分、主要欄位、索引與關聯鍵設計。

---

## 1. 文件定位

這份文件是介於 `domain model` 與 `正式 schema` 之間的草稿，目標是幫助後端團隊先把主要資料表輪廓定出來。

它主要回答：

- 這個系統第一版可能會有哪些資料表
- 每張表的主鍵、主要欄位與用途是什麼
- 哪些欄位建議建立索引
- 哪些表彼此有關聯
- 哪些欄位屬於後續再細化即可

本文件不是最終 migration 檔，也不是完整 DDL。

---

## 2. 設計原則

### 2.1 範圍控制

- 以 P0 / P1 模組優先
- 先列出實際會用到的主欄位
- 避免一開始就把所有展示欄位全部固化

### 2.2 共用欄位建議

以下欄位建議多數主表共用：

- `id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`

若需要軟刪除：

- `deleted_at`
- `deleted_by`

若需要啟用 / 停用：

- `status`
- `is_enabled`

### 2.3 型別說明方式

本文件中型別用偏資料庫無關的通用描述：

- `uuid`
- `string`
- `text`
- `int`
- `decimal`
- `boolean`
- `datetime`
- `json`

實際落地可依技術棧調整。

---

## 3. P0 Entity 草稿

---

## 4. IAM / Auth

### 4.1 `admin_users`

用途：

- 後台操作人員主表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `account` | `string` | 登入帳號，建議 unique |
| `name` | `string` | 顯示名稱 |
| `email` | `string` | Email，可為空 |
| `phone` | `string` | 手機，可為空 |
| `password_hash` | `string` | 密碼雜湊 |
| `status` | `string` | 啟用、停用、鎖定等狀態 |
| `last_login_at` | `datetime` | 最後登入時間 |
| `last_login_ip` | `string` | 最後登入 IP |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

建議索引：

- unique index: `account`
- index: `status`

### 4.2 `roles`

用途：

- 角色主表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `code` | `string` | 角色代碼，建議 unique |
| `name` | `string` | 角色名稱 |
| `description` | `text` | 角色說明 |
| `status` | `string` | 啟用狀態 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 4.3 `permissions`

用途：

- 權限定義表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `code` | `string` | 權限代碼，建議 unique |
| `name` | `string` | 權限名稱 |
| `module` | `string` | 所屬模組 |
| `action` | `string` | 動作類型，如 read, write, approve |
| `description` | `text` | 權限說明 |

### 4.4 `operator_groups`

用途：

- 操作群組主表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `code` | `string` | 群組代碼 |
| `name` | `string` | 群組名稱 |
| `description` | `text` | 群組說明 |
| `status` | `string` | 狀態 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 4.5 `admin_user_operator_groups`

用途：

- 後台人員與群組關聯表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `admin_user_id` | `uuid` | FK -> `admin_users.id` |
| `operator_group_id` | `uuid` | FK -> `operator_groups.id` |
| `created_at` | `datetime` | 建立時間 |

### 4.6 `role_permissions`

用途：

- 角色與權限關聯表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `role_id` | `uuid` | FK -> `roles.id` |
| `permission_id` | `uuid` | FK -> `permissions.id` |
| `created_at` | `datetime` | 建立時間 |

### 4.7 `operator_group_roles`

用途：

- 群組與角色關聯表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `operator_group_id` | `uuid` | FK -> `operator_groups.id` |
| `role_id` | `uuid` | FK -> `roles.id` |
| `created_at` | `datetime` | 建立時間 |

### 4.8 `admin_sessions`

用途：

- refresh token / session 記錄

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `admin_user_id` | `uuid` | FK -> `admin_users.id` |
| `refresh_token_hash` | `string` | refresh token 雜湊 |
| `device_info` | `string` | 裝置資訊 |
| `ip_address` | `string` | 登入 IP |
| `expired_at` | `datetime` | 過期時間 |
| `revoked_at` | `datetime` | 作廢時間 |
| `created_at` | `datetime` | 建立時間 |

### 4.9 `admin_ip_whitelist_rules`

用途：

- 後台人員 IP 白名單規則

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `admin_user_id` | `uuid` | FK -> `admin_users.id` |
| `ip_range` | `string` | 單一 IP 或 CIDR |
| `note` | `string` | 備註 |
| `created_at` | `datetime` | 建立時間 |

---

## 5. Audit

### 5.1 `audit_logs`

用途：

- 後台通用審計日誌

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `admin_user_id` | `uuid` | FK -> `admin_users.id` |
| `action` | `string` | 動作類型 |
| `resource_type` | `string` | 資源類型 |
| `resource_id` | `uuid` | 資源主鍵 |
| `summary` | `string` | 操作摘要 |
| `metadata` | `json` | 額外資訊 |
| `ip_address` | `string` | 操作者 IP |
| `created_at` | `datetime` | 發生時間 |

建議索引：

- index: `admin_user_id`
- index: `resource_type`, `resource_id`
- index: `created_at`

### 5.2 `login_logs`

用途：

- 登入與登出歷程

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `admin_user_id` | `uuid` | FK -> `admin_users.id`，失敗時可為空 |
| `account` | `string` | 嘗試登入帳號 |
| `result` | `string` | success / failed |
| `reason` | `string` | 失敗原因 |
| `ip_address` | `string` | IP |
| `user_agent` | `text` | UA |
| `created_at` | `datetime` | 發生時間 |

### 5.3 `resource_change_logs`

用途：

- 關鍵欄位變更前後值

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `resource_type` | `string` | 資源類型 |
| `resource_id` | `uuid` | 資源主鍵 |
| `changed_by` | `uuid` | FK -> `admin_users.id` |
| `before_data` | `json` | 異動前 |
| `after_data` | `json` | 異動後 |
| `created_at` | `datetime` | 發生時間 |

### 5.4 `approval_action_logs`

用途：

- 審核與駁回動作留痕

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `resource_type` | `string` | 如 withdrawal_order |
| `resource_id` | `uuid` | 資源主鍵 |
| `action` | `string` | approve, reject, reverse |
| `result` | `string` | 成功或失敗 |
| `reason` | `text` | 駁回或補充說明 |
| `admin_user_id` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 發生時間 |

---

## 6. Members

### 6.1 `member_levels`

用途：

- 會員等級主表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `code` | `string` | 等級代碼 |
| `name` | `string` | 等級名稱 |
| `sort_order` | `int` | 排序 |
| `status` | `string` | 啟用狀態 |
| `display_config` | `json` | UI 顏色、樣式等展示設定 |
| `rule_config` | `json` | 升等、維持條件 |
| `reward_config` | `json` | 等級獎勵 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 6.2 `members`

用途：

- 會員主表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `account` | `string` | 會員帳號，建議 unique |
| `nickname` | `string` | 暱稱 |
| `status` | `string` | 正常、停用、凍結等 |
| `member_level_id` | `uuid` | FK -> `member_levels.id` |
| `agent_id` | `uuid` | FK -> `agents.id`，可為空 |
| `register_ip` | `string` | 註冊 IP |
| `last_login_ip` | `string` | 最後登入 IP |
| `registered_at` | `datetime` | 註冊時間 |
| `last_login_at` | `datetime` | 最後登入時間 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

建議索引：

- unique index: `account`
- index: `status`
- index: `member_level_id`
- index: `agent_id`

### 6.3 `member_profiles`

用途：

- 會員補充資訊，可視情況與 `members` 合併

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `member_id` | `uuid` | FK -> `members.id` |
| `real_name` | `string` | 真實姓名 |
| `phone` | `string` | 手機 |
| `email` | `string` | Email |
| `birthday` | `datetime` | 生日 |
| `country` | `string` | 國家或區域 |
| `metadata` | `json` | 延伸欄位 |
| `updated_at` | `datetime` | 更新時間 |

### 6.4 `member_tags`

用途：

- 標籤主表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `code` | `string` | 標籤代碼 |
| `name` | `string` | 標籤名稱 |
| `type` | `string` | 標籤類型 |
| `description` | `text` | 說明 |
| `status` | `string` | 狀態 |
| `created_by` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 6.5 `member_tag_assignments`

用途：

- 會員與標籤關聯

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `member_id` | `uuid` | FK -> `members.id` |
| `member_tag_id` | `uuid` | FK -> `member_tags.id` |
| `assigned_by` | `uuid` | FK -> `admin_users.id` |
| `assigned_at` | `datetime` | 指派時間 |

### 6.6 `member_notes`

用途：

- 會員備註 / memo

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `member_id` | `uuid` | FK -> `members.id` |
| `admin_user_id` | `uuid` | FK -> `admin_users.id` |
| `content` | `text` | 備註內容 |
| `created_at` | `datetime` | 建立時間 |

### 6.7 `member_level_adjustments`

用途：

- 會員等級人工調整紀錄

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `member_id` | `uuid` | FK -> `members.id` |
| `from_level_id` | `uuid` | FK -> `member_levels.id` |
| `to_level_id` | `uuid` | FK -> `member_levels.id` |
| `reason` | `text` | 調整原因 |
| `adjusted_by` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 建立時間 |

### 6.8 `member_logs`

用途：

- 會員相關行為或後台查詢紀錄

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `member_id` | `uuid` | FK -> `members.id` |
| `log_type` | `string` | 行為類型 |
| `summary` | `string` | 摘要 |
| `metadata` | `json` | 詳細資訊 |
| `created_at` | `datetime` | 發生時間 |

### 6.9 `member_status_histories`

用途：

- 會員狀態異動歷程

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `member_id` | `uuid` | FK -> `members.id` |
| `from_status` | `string` | 異動前狀態 |
| `to_status` | `string` | 異動後狀態 |
| `reason` | `text` | 異動原因 |
| `changed_by` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 異動時間 |

### 6.10 `member_bank_accounts`

用途：

- 會員提款帳戶主表，記錄會員登記的銀行帳號、電子錢包或加密貨幣地址

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `member_id` | `uuid` | FK -> `members.id` |
| `account_type` | `string` | bank / wallet / crypto |
| `bank_name` | `string` | 銀行名稱 |
| `account_name` | `string` | 戶名 |
| `account_no` | `string` | 帳號 |
| `is_primary` | `boolean` | 是否為主要提款帳戶 |
| `status` | `string` | 啟用 / 停用 |
| `created_by` | `uuid` | FK -> `admin_users.id`，後台人員建立時使用 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

建議索引：

- index: `member_id`
- index: `status`

---

## 7. Finance

### 7.1 `manual_deposit_orders`

用途：

- 手工存款單

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `order_no` | `string` | 訂單編號，建議 unique |
| `member_id` | `uuid` | FK -> `members.id` |
| `type` | `string` | 人工入款、活動贈送、系統補分等 |
| `amount` | `decimal` | 金額 |
| `status` | `string` | 訂單狀態 |
| `remark` | `text` | 備註 |
| `applicant_name` | `string` | 申請人或來源描述 |
| `attachment_asset_id` | `uuid` | 附件檔案 id，可為空；P0 階段先為純欄位不建 FK，待 `file_assets` 建立後（P2）補上外鍵約束 |
| `approved_by` | `uuid` | FK -> `admin_users.id`，可為空 |
| `approved_at` | `datetime` | 審核時間 |
| `rejected_by` | `uuid` | FK -> `admin_users.id`，可為空 |
| `rejected_at` | `datetime` | 拒絕時間 |
| `reject_reason` | `text` | 駁回原因 |
| `created_at` | `datetime` | 建立時間 |

建議索引：

- unique index: `order_no`
- index: `member_id`
- index: `status`

### 7.2 `online_deposit_orders`

用途：

- 線上存款單

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `order_no` | `string` | 訂單編號 |
| `member_id` | `uuid` | FK -> `members.id` |
| `merchant_id` | `uuid` | FK -> `merchants.id`，可為空 |
| `payment_channel` | `string` | 渠道類型 |
| `amount` | `decimal` | 金額 |
| `fee` | `decimal` | 手續費 |
| `actual_amount` | `decimal` | 實收金額 |
| `status` | `string` | 訂單狀態 |
| `callback_status` | `string` | callback 狀態 |
| `dispatch_status` | `string` | 派發狀態 |
| `raw_callback_payload` | `json` | 原始回調資料 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 7.3 `withdrawal_orders`

用途：

- 提款單

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `order_no` | `string` | 訂單編號 |
| `member_id` | `uuid` | FK -> `members.id` |
| `member_bank_account_id` | `uuid` | FK -> `member_bank_accounts.id`，可為空（提款目的地帳戶） |
| `bank_name_snapshot` | `string` | 提款時快照銀行名稱，防帳戶後續變更影響紀錄 |
| `account_name_snapshot` | `string` | 提款時快照戶名 |
| `account_no_snapshot` | `string` | 提款時快照帳號 |
| `amount` | `decimal` | 提款金額 |
| `fee` | `decimal` | 手續費 |
| `actual_amount` | `decimal` | 實際出款金額 |
| `status` | `string` | 訂單狀態 |
| `rollover_required` | `decimal` | 需求流水 |
| `rollover_current` | `decimal` | 目前流水 |
| `processor_id` | `uuid` | FK -> `admin_users.id`，可為空 |
| `approved_by` | `uuid` | FK -> `admin_users.id`，可為空 |
| `approved_at` | `datetime` | 核准時間 |
| `rejected_by` | `uuid` | FK -> `admin_users.id`，可為空 |
| `rejected_at` | `datetime` | 駁回時間 |
| `reject_reason` | `text` | 駁回原因 |
| `reversed_by` | `uuid` | FK -> `admin_users.id`，可為空 |
| `reversed_at` | `datetime` | 沖正時間 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

建議索引：

- unique index: `order_no`
- index: `member_id`
- index: `status`
- index: `processor_id`

### 7.4 `order_locks`

用途：

- 審核作業鎖

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `resource_type` | `string` | 如 withdrawal_order |
| `resource_id` | `uuid` | 對應訂單 id |
| `locked_by` | `uuid` | FK -> `admin_users.id` |
| `locked_at` | `datetime` | 鎖定時間 |
| `expired_at` | `datetime` | 鎖定逾時時間 |
| `released_at` | `datetime` | 解鎖時間 |
| `status` | `string` | active, released, expired |
| `created_at` | `datetime` | 建立時間 |

建議索引：

- index: `resource_type`, `resource_id`
- index: `locked_by`
- index: `status`

### 7.5 `balance_ledgers`

用途：

- 資金帳本與流水紀錄

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `member_id` | `uuid` | FK -> `members.id` |
| `entry_type` | `string` | deposit, withdrawal, adjustment, reward |
| `direction` | `string` | credit / debit |
| `amount` | `decimal` | 異動金額 |
| `balance_before` | `decimal` | 異動前餘額 |
| `balance_after` | `decimal` | 異動後餘額 |
| `reference_type` | `string` | 對應來源資源 |
| `reference_id` | `uuid` | 對應來源主鍵 |
| `remark` | `text` | 說明 |
| `created_at` | `datetime` | 建立時間 |

建議索引：

- index: `member_id`
- index: `reference_type`, `reference_id`
- index: `created_at`

> **餘額快照說明：** `balance_ledgers` 為帳務異動的唯一真實來源，但以流水 SUM 即時計算當前餘額會隨資料量增長而影響效能。建議在 `members` 表加入 `balance` 快照欄位（或另建 `member_wallets` 表），每次寫入 `balance_ledgers` 時，於同一 transaction 內同步更新快照餘額，確保一致性。

### 7.6 `manual_adjustments`

用途：

- 人工存提 / 餘額調整紀錄

> **與 `manual_deposit_orders` 的邊界說明：**
> - `manual_deposit_orders`：**會員申請**觸發、需要走後台審核流程的手工入款（例如：玩家轉帳後申請人工到帳）
> - `manual_adjustments`：**後台主動執行**、不需會員申請的人工調整（例如：後台補分、扣分、系統誤差調整）

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `member_id` | `uuid` | FK -> `members.id` |
| `adjustment_type` | `string` | 調整類型 |
| `amount` | `decimal` | 調整金額 |
| `reason` | `text` | 原因 |
| `status` | `string` | 狀態 |
| `created_by` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 建立時間 |

### 7.7 `point_adjustments`

用途：

- 單筆點數調整

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `member_id` | `uuid` | FK -> `members.id` |
| `amount` | `decimal` | 調整值 |
| `adjustment_type` | `string` | 類型 |
| `reason` | `text` | 原因 |
| `created_by` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 建立時間 |

### 7.8 `point_adjustment_batch_tasks`

用途：

- 批次點數任務

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `task_name` | `string` | 任務名稱 |
| `target_type` | `string` | 目標對象類型 |
| `rule_config` | `json` | 批次規則 |
| `status` | `string` | 任務狀態 |
| `created_by` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 建立時間 |
| `completed_at` | `datetime` | 完成時間 |

### 7.9 `bet_records`

用途：

- 下注紀錄查詢資料

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `bet_no` | `string` | 注單號 |
| `member_id` | `uuid` | FK -> `members.id` |
| `game_id` | `uuid` | FK -> `games.id` |
| `game_platform_id` | `uuid` | FK -> `game_platforms.id` |
| `bet_amount` | `decimal` | 下注金額 |
| `win_amount` | `decimal` | 派彩金額 |
| `status` | `string` | 狀態 |
| `settled_at` | `datetime` | 結算時間 |
| `created_at` | `datetime` | 建立時間 |

### 7.10 `auto_payment_status_snapshots`

用途：

- 自動金流聚合快照

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `provider_name` | `string` | 提供者名稱 |
| `status` | `string` | 狀態 |
| `summary_data` | `json` | 聚合資訊 |
| `captured_at` | `datetime` | 快照時間 |

---

## 8. P1 Entity 草稿

---

## 9. System Settings / Messages

### 9.1 `announcements`

用途：

- 公告與通知內容

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `title` | `string` | 標題 |
| `announcement_type` | `string` | 類型 |
| `content` | `text` | 內容 |
| `target_config` | `json` | 對象設定 |
| `publish_status` | `string` | 草稿、發布、停用 |
| `schedule_start_at` | `datetime` | 上架時間 |
| `schedule_end_at` | `datetime` | 下架時間 |
| `created_by` | `uuid` | FK -> `admin_users.id` |
| `updated_by` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 9.2 `system_settings`

用途：

- 系統級設定 key-value 或分群設定

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `setting_group` | `string` | 分類，如 site, security |
| `setting_key` | `string` | 設定 key |
| `setting_value` | `json` | 設定值 |
| `updated_by` | `uuid` | FK -> `admin_users.id` |
| `updated_at` | `datetime` | 更新時間 |

### 9.3 `payment_channels`

用途：

- 支付通道設定

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `channel_type` | `string` | bank, wallet, gateway, crypto |
| `name` | `string` | 通道名稱 |
| `provider_name` | `string` | 提供者名稱 |
| `status` | `string` | 狀態 |
| `config` | `json` | 通道配置 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 9.4 `bank_accounts`

用途：

- 系統設定中的銀行 / 錢包配置

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `account_type` | `string` | bank 或 wallet |
| `bank_name` | `string` | 銀行名稱 |
| `account_name` | `string` | 戶名 |
| `account_no` | `string` | 帳號 |
| `status` | `string` | 狀態 |
| `config` | `json` | 補充設定 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 9.5 `message_templates`

用途：

- 訊息模板主表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `code` | `string` | 模板代碼 |
| `name` | `string` | 模板名稱 |
| `channel_type` | `string` | email, sms, telegram |
| `subject` | `string` | 主旨，可為空 |
| `content` | `text` | 內容 |
| `status` | `string` | 啟用狀態 |
| `created_by` | `uuid` | FK -> `admin_users.id` |
| `updated_by` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 9.6 `message_channel_configs`

用途：

- Email / SMS / Telegram 設定

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `channel_type` | `string` | email, sms, telegram |
| `provider_name` | `string` | 提供者名稱 |
| `status` | `string` | 啟用狀態 |
| `config` | `json` | 通道配置 |
| `updated_by` | `uuid` | FK -> `admin_users.id` |
| `updated_at` | `datetime` | 更新時間 |

### 9.7 `message_send_logs`

用途：

- 訊息發送紀錄

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `template_id` | `uuid` | FK -> `message_templates.id`，可為空 |
| `channel_type` | `string` | 發送通道 |
| `recipient_type` | `string` | member, agent, external |
| `recipient_id` | `uuid` | 收件對象 id，可為空 |
| `recipient_value` | `string` | 手機、email、chat id 等 |
| `status` | `string` | success, failed, pending |
| `provider_message_id` | `string` | 外部 provider 訊息 id |
| `error_message` | `text` | 失敗原因 |
| `sent_at` | `datetime` | 發送時間 |
| `created_at` | `datetime` | 建立時間 |

---

## 10. Agents / Games / Promotions / Reports

### 10.1 `agent_levels`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `code` | `string` | 等級代碼 |
| `name` | `string` | 等級名稱 |
| `sort_order` | `int` | 排序 |
| `status` | `string` | 狀態 |
| `config` | `json` | 等級設定 |

### 10.2 `agents`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `account` | `string` | 代理帳號 |
| `name` | `string` | 名稱 |
| `status` | `string` | 狀態 |
| `agent_level_id` | `uuid` | FK -> `agent_levels.id` |
| `parent_agent_id` | `uuid` | FK -> `agents.id`，可為空（上線代理） |
| `commission_scheme_id` | `uuid` | FK -> `commission_schemes.id`，可為空（綁定佣金方案） |
| `contact_info` | `json` | 聯絡資訊 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 10.3 `commission_schemes`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `name` | `string` | 方案名稱 |
| `settlement_cycle` | `string` | 結算週期 |
| `status` | `string` | 狀態 |
| `config` | `json` | 規則內容 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 10.4 `settlement_periods`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `period_key` | `string` | 如 2026-03 |
| `started_at` | `datetime` | 起始時間 |
| `ended_at` | `datetime` | 結束時間 |
| `status` | `string` | open, generated, closed |

### 10.5 `agent_settlements`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `agent_id` | `uuid` | FK -> `agents.id` |
| `settlement_period_id` | `uuid` | FK -> `settlement_periods.id` |
| `commission_scheme_id` | `uuid` | FK -> `commission_schemes.id` |
| `summary_data` | `json` | 結算彙總 |
| `status` | `string` | 狀態 |
| `generated_at` | `datetime` | 產生時間 |

### 10.6 `game_platforms`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `code` | `string` | 平台代碼 |
| `name` | `string` | 平台名稱 |
| `status` | `string` | 啟用狀態 |
| `wallet_type` | `string` | 錢包模式 |
| `logo_url` | `string` | logo |
| `config` | `json` | 平台配置 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 10.7 `game_platform_maintenance_windows`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `game_platform_id` | `uuid` | FK -> `game_platforms.id` |
| `started_at` | `datetime` | 開始時間 |
| `ended_at` | `datetime` | 結束時間 |
| `reason` | `text` | 原因 |
| `public_message` | `text` | 對玩家公告 |

### 10.8 `games`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `game_code` | `string` | 遊戲代碼 |
| `name` | `string` | 遊戲名稱 |
| `game_platform_id` | `uuid` | FK -> `game_platforms.id` |
| `status` | `string` | 上下架狀態 |
| `game_type` | `string` | 遊戲類型 |
| `volatility` | `string` | 波動率 |
| `thumbnail_url` | `string` | 圖片 |
| `metadata` | `json` | 補充資訊 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 10.9 `game_categories`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `parent_id` | `uuid` | FK -> `game_categories.id`，可為空 |
| `name` | `string` | 分類名稱 |
| `slug` | `string` | 分類代碼 |
| `icon` | `string` | icon |
| `sort_order` | `int` | 排序 |
| `status` | `string` | 狀態 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 10.10 `game_category_assignments`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `game_id` | `uuid` | FK -> `games.id` |
| `game_category_id` | `uuid` | FK -> `game_categories.id` |

### 10.11 `promotions`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `code` | `string` | 活動代碼 |
| `name` | `string` | 活動名稱 |
| `promotion_type` | `string` | 活動類型 |
| `status` | `string` | 狀態 |
| `rule_config` | `json` | 規則設定 |
| `reward_config` | `json` | 獎勵設定 |
| `started_at` | `datetime` | 開始時間 |
| `ended_at` | `datetime` | 結束時間 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 10.12 `special_events`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `name` | `string` | 活動名稱 |
| `status` | `string` | 狀態 |
| `config` | `json` | 條件與內容 |
| `started_at` | `datetime` | 開始時間 |
| `ended_at` | `datetime` | 結束時間 |

### 10.13 `achievements`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `name` | `string` | 成就名稱 |
| `status` | `string` | 狀態 |
| `condition_config` | `json` | 條件 |
| `reward_config` | `json` | 獎勵 |
| `message_template_id` | `uuid` | FK -> `message_templates.id`，可為空 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 10.14 `report_export_jobs`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `report_type` | `string` | 報表類型 |
| `filter_payload` | `json` | 篩選條件 |
| `status` | `string` | 任務狀態 |
| `file_asset_id` | `uuid` | FK -> `file_assets.id`，可為空 |
| `created_by` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 建立時間 |
| `completed_at` | `datetime` | 完成時間 |

### 10.15 `notification_jobs`

用途：

- 批次通知任務，對應 Messaging Domain 中的 `NotificationJob`（Domain Model 草稿已定義，此為對應 entity）

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `template_id` | `uuid` | FK -> `message_templates.id`，可為空 |
| `channel_type` | `string` | email, sms, telegram |
| `target_type` | `string` | all_members, level, tag, agent, custom |
| `target_config` | `json` | 發送對象條件設定 |
| `status` | `string` | pending, processing, completed, failed |
| `total_count` | `int` | 預計發送數量 |
| `sent_count` | `int` | 已發送數量 |
| `failed_count` | `int` | 失敗數量 |
| `created_by` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 建立時間 |
| `completed_at` | `datetime` | 完成時間 |

---

## 11. P2 Entity 草稿

### 11.1 `homepage_configs`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `name` | `string` | 配置名稱 |
| `status` | `string` | 草稿 / 發布 |
| `config` | `json` | 首頁設定 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 11.2 `homepage_sections`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `homepage_config_id` | `uuid` | FK -> `homepage_configs.id` |
| `section_type` | `string` | 區塊類型 |
| `title` | `string` | 區塊標題 |
| `sort_order` | `int` | 排序 |
| `config` | `json` | 區塊設定 |

### 11.3 `content_pages`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `page_key` | `string` | 頁面 key |
| `title` | `string` | 標題 |
| `content` | `text` | 內容 |
| `meta_title` | `string` | SEO title |
| `meta_description` | `text` | SEO description |
| `status` | `string` | 草稿 / 發布 |
| `published_at` | `datetime` | 發布時間 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 11.4 `payment_layout_configs`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `layout_type` | `string` | app / web |
| `name` | `string` | 名稱 |
| `config` | `json` | 版型設定 |
| `status` | `string` | 狀態 |

### 11.5 `splash_ads`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `name` | `string` | 廣告名稱 |
| `image_asset_id` | `uuid` | FK -> `file_assets.id` |
| `target_type` | `string` | promo, page, url |
| `target_id` | `uuid` | 目標主鍵，可為空 |
| `external_url` | `string` | 外部連結，可為空 |
| `status` | `string` | 啟用狀態 |
| `schedule_start_at` | `datetime` | 上架時間 |
| `schedule_end_at` | `datetime` | 下架時間 |
| `created_at` | `datetime` | 建立時間 |
| `updated_at` | `datetime` | 更新時間 |

### 11.6 `hero_configs`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `theme_name` | `string` | 主題名稱 |
| `main_title` | `string` | 主標 |
| `sub_title` | `string` | 副標 |
| `image_asset_id` | `uuid` | FK -> `file_assets.id` |
| `status` | `string` | 狀態 |
| `schedule_start_at` | `datetime` | 上架時間 |
| `schedule_end_at` | `datetime` | 下架時間 |

### 11.7 `website_banners`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `title` | `string` | 標題 |
| `image_asset_id` | `uuid` | FK -> `file_assets.id` |
| `link_url` | `string` | 連結 |
| `status` | `string` | 狀態 |
| `sort_order` | `int` | 排序 |

### 11.8 `news_articles`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `category` | `string` | 分類 |
| `title` | `string` | 標題 |
| `content` | `text` | 內容 |
| `publish_at` | `datetime` | 發布時間 |
| `status` | `string` | 狀態 |

### 11.9 `game_showcases`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `game_id` | `uuid` | FK -> `games.id` |
| `marketing_name` | `string` | 行銷名稱 |
| `description` | `text` | 行銷描述 |
| `status` | `string` | 狀態 |
| `sort_order` | `int` | 排序 |

### 11.10 `seo_settings`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `site_title` | `string` | 站點標題 |
| `keywords` | `text` | 關鍵字 |
| `description` | `text` | 站點描述 |
| `social_links` | `json` | 社群連結 |
| `footer_config` | `json` | footer 資訊 |
| `updated_at` | `datetime` | 更新時間 |

### 11.11 `merchants`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `code` | `string` | 商號代碼 |
| `name` | `string` | 商號名稱 |
| `group_name` | `string` | 分組 |
| `status` | `string` | 狀態 |
| `config` | `json` | 商號設定 |

### 11.12 `payment_bank_accounts`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `merchant_id` | `uuid` | FK -> `merchants.id` |
| `bank_name` | `string` | 銀行名稱 |
| `account_name` | `string` | 戶名 |
| `account_no` | `string` | 帳號 |
| `status` | `string` | 狀態 |

### 11.13 `app_purchase_orders`

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `order_no` | `string` | 訂單號 |
| `member_id` | `uuid` | FK -> `members.id` |
| `platform` | `string` | iOS / Android |
| `amount` | `decimal` | 金額 |
| `status` | `string` | 狀態 |
| `created_at` | `datetime` | 建立時間 |

---

## 12. Integration / File Asset

### 12.1 `file_assets`

用途：

- 上傳檔案與圖片主表

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `bucket` | `string` | 儲存位置 |
| `path` | `string` | 檔案路徑 |
| `original_name` | `string` | 原始檔名 |
| `mime_type` | `string` | MIME 類型 |
| `size` | `int` | 檔案大小 |
| `uploaded_by` | `uuid` | FK -> `admin_users.id` |
| `created_at` | `datetime` | 上傳時間 |

### 12.2 `payment_callback_logs`

用途：

- 金流 callback 原始記錄

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `provider_name` | `string` | 支付提供者 |
| `event_type` | `string` | 事件類型 |
| `reference_no` | `string` | 參考訂單號 |
| `payload` | `json` | 原始資料 |
| `received_at` | `datetime` | 接收時間 |

### 12.3 `external_sync_jobs`

用途：

- 外部同步或批次作業任務

主要欄位：

| 欄位 | 型別 | 說明 |
|---|---|---|
| `id` | `uuid` | 主鍵 |
| `job_type` | `string` | 任務類型 |
| `status` | `string` | 任務狀態 |
| `payload` | `json` | 任務輸入 |
| `result_payload` | `json` | 任務結果 |
| `created_at` | `datetime` | 建立時間 |
| `completed_at` | `datetime` | 完成時間 |

---

## 13. 第一版建表優先順序

### P0 建議先落 migration

1. `admin_users`
2. `roles`
3. `permissions`
4. `operator_groups`
5. `admin_user_operator_groups`
6. `role_permissions`
7. `operator_group_roles`
8. `admin_sessions`
9. `audit_logs`
10. `login_logs`
11. `resource_change_logs`
12. `approval_action_logs`
13. `member_levels`
14. `members`
15. `member_profiles`
16. `member_tags`
17. `member_tag_assignments`
18. `member_notes`
19. `member_level_adjustments`
20. `member_logs`
21. `member_status_histories`
22. `member_bank_accounts`
23. `manual_deposit_orders`
23. `online_deposit_orders`
24. `withdrawal_orders`
25. `order_locks`
26. `balance_ledgers`
27. `manual_adjustments`
28. `point_adjustments`
29. `point_adjustment_batch_tasks`

### P1 第二波建議

1. `announcements`
2. `system_settings`
3. `payment_channels`
4. `bank_accounts`
5. `message_templates`
6. `message_channel_configs`
7. `message_send_logs`
8. `agent_levels`
9. `agents`
10. `commission_schemes`
11. `settlement_periods`
12. `agent_settlements`
13. `game_platforms`
14. `game_platform_maintenance_windows`
15. `games`
16. `game_categories`
17. `game_category_assignments`
18. `promotions`
19. `special_events`
20. `achievements`
21. `report_export_jobs`
22. `notification_jobs`

### P2 第三波建議

1. `homepage_configs`
2. `homepage_sections`
3. `content_pages`
4. `payment_layout_configs`
5. `splash_ads`
6. `hero_configs`
7. `website_banners`
8. `news_articles`
9. `game_showcases`
10. `seo_settings`
11. `merchants`
12. `payment_bank_accounts`
13. `app_purchase_orders`
14. `file_assets`
15. `payment_callback_logs`
16. `external_sync_jobs`

---

## 14. 尚待確認的欄位與決策

以下項目建議在正式 migration 前與後端再確認：

1. 主鍵是否統一採 `uuid`
2. `system_settings` 要採 key-value 還是拆分主題表
3. `member_profiles` 是否需要獨立分表
4. `member_logs` 與 `audit_logs` 的責任邊界（前者為會員行為紀錄，後者為後台人員操作紀錄，建議分開）
5. `order_locks` 是否保留歷史紀錄
6. `balance_ledgers` 是否作為唯一帳務真實來源；以及是否在 `members` 或獨立 `member_wallets` 表維護餘額快照
7. 訊息配置中的敏感資料是否加密存放
8. 內容模組是否需要 versioning
9. `promotions`、`special_events`、`achievements` 是否共用規則模型
10. `file_assets` 是否需支援多 bucket / CDN
11. `member_bank_accounts` 是否允許會員自行維護，或僅由後台操作
12. IP 白名單驗證的啟用時機：建議 P0 先建表 `admin_ip_whitelist_rules`，P1 再啟用 middleware 驗證邏輯

---

## 15. 下一步建議

這份 entity 草稿完成後，後續最適合接著做的內容是：

1. `P0 migration 規劃`
2. `主要關聯 ER 圖`
3. `欄位唯一鍵 / 索引清單`
4. `狀態 enum 清單`
5. `審核流程狀態圖`

---

## 16. 總結

這份文件的目的是讓後端從「抽象的 domain」往「可落地的資料表」前進一步，但仍保留調整空間。

如果以實際開發順序來看，最適合先落地的資料主體仍然是：

1. IAM / Auth
2. Audit
3. Members
4. Finance

這四塊會決定整個後台第一波能不能開始正式串接與驗證。
