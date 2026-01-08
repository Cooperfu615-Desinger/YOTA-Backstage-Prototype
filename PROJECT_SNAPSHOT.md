# YOTA Backstage Prototype - Project Snapshot

**Generated**: 2026-01-07  
**Version**: 1.0

## Naming Convention

### Route Path Standards

- **Format**: Singular, lowercase, kebab-case (e.g., `/finance/`, `/member/`, `/operator/`)
- **NOT**: Plural forms (`/financials/`), mixed case, or underscores
- **Consistency**: All routes follow `/module/sub-page` pattern

### Why Singular?

- Cleaner URLs and easier to remember
- Consistent with modern web standards
- Avoids confusion between plural/singular forms
- Better for i18n and localization

---

## UI Design Specifications

### Input Field Standards

- **Fixed Width**: All search input fields use `w-[220px]` (220px) for consistency
- **Layout**: Left-aligned with consistent gap spacing (`gap-4`)

### Responsive Design - Three-Tier Adaptive Layout

1. **Desktop** (≥1024px): Full multi-column grid layouts
2. **Tablet** (768px-1023px): Reduced columns, maintained readability
3. **Mobile** (<768px): Single column, stacked vertically

### Color Coding Conventions

- **Positive amounts**: `text-green-400` (增點, 派彩, 存款)
- **Negative amounts**: `text-red-400` (扣點, 投注, 提款)
- **Status badges**: Success (green), Warning (yellow), Danger (red), Info (blue)

### Numeric Input Standards

**Percentage/Ratio Inputs**: All percentage or ratio inputs (commission rates, bonuses, adjustments) must follow:

- **Layout**: Use `buttonLayout="horizontal"` with increment/decrement buttons
- **Width Constraint**: Wrap InputNumber in `<div style="width: 100px">` container, apply `class="w-full"` to InputNumber
  - *Rationale*: 100px provides the most compact visual presentation, ideal for 0-100 range values like commission rates and fees
  - *Gap Elimination*: Must apply deep CSS to remove internal gaps and padding for seamless `[-][00%][+]` visual structure
- **Text Alignment**: Use `inputClass="text-center"` for centered display
- **Deep CSS**: Apply horizontal button mode deep selectors from AgentList.vue pattern if needed

**Currency Inputs**: Use `w-[220px]` for amount fields with proper locale formatting

---

## Route Mapping

### Dashboard (儀表板)

- `/dashboard/overview` - Dashboard Overview (儀表板總覽)
- `/dashboard/website-data` - Website Data (網站數據)
- `/dashboard/operational-data` - Operational Data (營運數據)
- `/dashboard/game-monitor` - Game Monitor (遊戲監控)

### Operators (操作員管理)

- `/operators/overview` - Operator Overview (操作員總覽)
- `/operators/maintenance` - Operator Maintenance (操作員維護)
- `/operators/groups` - Group Maintenance (權限群組維護)
- `/operators/logs` - Operator Logs (操作員日誌)
- `/operators/exports` - Data Export (數據匯出)

### Members (會員管理)

- `/members/overview` - Member Overview (會員總覽)
- `/members/list` - Member List (會員列表)
- `/members/memo-record` - Member Logs (會員日誌)
- `/members/level-settings` - Member Levels (會員等級)
- `/members/tags` - Member Tags (會員標籤)

### Agents (代理管理)

- `/agents/overview` - Agent Overview (代理總覽)
- `/agent/list` - Agent List (代理列表)
- `/agent/levels` - Agent Levels (代理等級)
- `/agent/commission` - Commission Settings (佣金設定)
- `/agent/settlement` - Settlement Report (佣金結算報表)

### Finance Core (財務核心)

- `/finance` - Finance Dashboard (財務儀表板)
- `/finance/overview` - Finance Overview (財務總覽)
- `/finance/records` - Transaction Records (交易紀錄)

### Finance Audit Management (財務審核管理)

- `/finance/manual-deposit` - Manual Deposit Audit (手工存款審核)
- `/finance/online-deposit` - Online Deposit Inquiry (在線存款查詢)
- `/finance/withdrawals` - Withdrawal Audit (提款審核)
- `/finance/order-locks` - Order Lock Management (鎖單管理)

### Finance Records (財務紀錄查詢)

- `/finance/betting-records` - Betting Records (下注紀錄)
- `/finance/balance-logs` - Balance Transaction Logs (資金流水紀錄)
- `/finance/adjustment-logs` - Manual Adjustment Logs (人工存提紀錄)

### Finance Tools (財務工具)

- `/finance/points-rewards` - Points & Rewards Management (點數與獎勵管理)
- `/finance/auto-payment` - Auto Payment Configuration (自動金流配置)

### Game Management (遊戲管理)

- `/game-maintenance/overview` - Game Overview (遊戲總覽)
- `/game-maintenance/platforms` - Game Platforms (遊戲平台)
- `/game-maintenance/game-list` - Game List (遊戲列表)
- `/game-maintenance/game-tags` - Game Tags (遊戲標籤)

### Messages (訊息管理)

- `/messages/overview` - Messages Overview (訊息總覽)
- `/messages/records` - Message Records (訊息紀錄)
- `/messages/system-notify` - System Notifications (系統通知)

### Payments (支付管理)

- `/payments/overview` - Payments Overview (支付總覽)
- `/payments/banks` - Bank Management (銀行管理)
- `/payments/merchants` - Merchant Management (商號管理)

---

## Key Implementation Logic

### 1. Lock Order System

**Location**: `useFinanceData.ts` composable

**Purpose**: Prevent concurrent processing of financial orders

**Mechanism**:

- `lockOrder(orderId, processor)`: Sets order status to '審核中', assigns processor
- `unlockOrder(orderId)`: Reverts to '待審核', clears processor
- `lockedOrders`: Computed property filters all locked orders

**UI Integration**:

- Withdrawal Audit: "我要審核" button locks order
- Lock Order Management: Displays all locked orders with timeout warnings (>15min)
- Force unlock available for supervisors

### 2. Member Tag Linking System

**Location**: `Members/Tags.vue`

**Features**:

- Dynamic tag creation with color selection
- Real-time tag application to members
- Tag-based filtering in member lists
- Risk tags (高風險, VIP) display in audit modals

### 3. Rollover Verification

**Location**: Withdrawal audit modal

**Logic**:

```typescript
rolloverPercentage = (current / required) * 100
autoApprove = rolloverPercentage >= 100 && amount <= maxAmount && vipLevel >= minLevel
```

**Visual Feedback**:

- Green progress bar: ≥100% (eligible for auto-approval)
- Red progress bar: <100% (requires manual review)

### 4. Deposit Anomaly Detection

**Location**: `OnlineDeposit.vue`

**Scenarios**:

- Payment successful but dispatch failed
- Callback received but balance not updated
- Re-issue mechanism for failed dispatches

**Indicators**:

- Callback Status Light (green/gray)
- Dispatch Status tag
- "Re-issue" button for anomalies

### 5. Approval Workflow

**Location**: `PointsRewards.vue`, `ManualDeposit.vue`

**Thresholds**:

- Amount > $10,000: Requires secondary approval
- High-risk members: Mandatory supervisor review
- Frequent manual deposits: Warning alert

**Process**:

1. Operator submits → Status: 待審核
2. Supervisor reviews → Approve/Reject
3. If approved → Balance updated, Status: 已完成

### 6. Auto-Payment Configuration

**Location**: `AutoPayment.vue`

**Rules Engine**:

- Max amount limit (e.g., ≤ $5,000)
- Min VIP level requirement
- Rollover completion percentage (e.g., ≥ 100%)

**Gateway Balancing**:

- Weight-based distribution
- Success rate monitoring
- Auto-failover on threshold breach

### 7. Valid Bet Tracking

**Location**: `BettingRecords.vue`

**Purpose**: Track effective wagering for rollover requirements

**Logic**:

- `validBet` may be less than `betAmount` for hedged or cancelled bets
- Warning indicator shown when `validBet < betAmount`
- Used for rollover completion calculations

**Visual Indicators**:

- Yellow warning icon for partial validity
- Tooltip explaining the discrepancy
- Highlighted in detail dialog

### 8. Agent Level System

**Location**: `AgentLevels.vue`

**Purpose**: Define tier-based promotion system with automatic qualification checking

**Tier Structure**:

- 5 levels: 實習代理 → 銅牌 → 銀牌 → 金牌 → 鑽石總代
- Progressive thresholds for active members and team P/L
- Commission bonuses increase by tier (0% → 25%)

**Promotion Criteria**:

- Active members threshold (5, 20, 50, 100, 200)
- Team monthly P/L threshold ($10K → $1M)
- Both conditions must be met for automatic promotion

**Features**:

- CRUD operations for level management
- Enable/disable level status
- Real-time agent count per level
- Icon and color customization

**Manual Level Override**:

- Administrators can manually lock an agent's level
- Bypasses automatic promotion system
- Requires reason for audit trail
- Prevents system from auto-adjusting based on performance

### 9. Commission Schemes

**Location**: `CommissionSettings.vue`

**Purpose**: Define profit-sharing models with tiered structures and cost allocation

**Scheme Components**:

- Settlement cycle (daily/weekly/monthly)
- Tiered commission rates based on profit brackets
- Game category bonus adjustments (+/- percentages)
- Cost sharing toggles (bonus deduction, platform fees)

**Mock Schemes**:

1. **全能代理 A 方案**: 4-tier structure (30%→45%), 50% bonus deduction, 20% platform fee
2. **電子遊戲專攻方案**: Fixed 45% commission, +10% slot bonus, -5% live/-10% sports penalty

**Dynamic Features**:

- Add/remove profit tiers on-the-fly
- Independent adjustments per game category
- Flexible cost sharing percentages

---

## Mock Data Strategy

### Centralized State Management

- `useFinanceData.ts`: Finance audit operations
- Component-level: Page-specific data (balance logs, tasks)

### Data Characteristics

- **Realistic scenarios**: Anomalies, timeouts, high-risk cases
- **Varied statuses**: Pending, approved, rejected, locked
- **Time-based**: Recent records sorted by timestamp
- **Randomized**: Amounts, member IDs, operators for diversity

---

## Technical Highlights

### State Management

- Vue 3 Composition API with reactive refs
- Singleton composables for shared state
- Computed properties for derived data

### Component Architecture

- PrimeVue for UI components
- Modular page structure
- Reusable search panels and data tables

### User Experience

- Toast notifications for all operations
- Confirmation dialogs for destructive actions
- Real-time duration updates (lock management)
- Color-coded financial indicators

---

## Development Notes

### Code Conventions

- TypeScript for type safety
- Consistent naming: camelCase for variables, PascalCase for components
- 220px input fields across all search panels
- Standardized card layouts with icons

### Future Enhancements

- Real API integration
- WebSocket for real-time updates
- Advanced filtering and sorting
- Export functionality for reports
