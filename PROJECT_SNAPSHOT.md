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

---

## Route Mapping

### Dashboard (儀表板)

- `/dashboard/overview` - Dashboard Overview
- `/dashboard/website-data` - Website Data
- `/dashboard/operational-data` - Operational Data
- `/dashboard/game-monitor` - Game Monitor

### Operators (操作員管理)

- `/operators/overview` - Operators Overview
- `/operators/maintenance` - Operator Maintenance
- `/operators/groups` - Group Maintenance
- `/operators/logs` - Operator Logs
- `/operators/exports` - Data Export

### Members (會員管理)

- `/members/overview` - Members Overview
- `/members/list` - Member List
- `/members/memo-record` - Member Logs
- `/members/level-settings` - Level Settings
- `/members/tags` - Tag Management

### Finance Core (財務核心)

- `/finance` - Finance Dashboard
- `/finance/overview` - Finance Overview
- `/finance/records` - Transaction Records

### Finance Audit Management (財務審核管理)

- `/finance/manual-deposit` - Manual Deposit Audit
- `/finance/online-deposit` - Online Deposit Query
- `/finance/withdrawals` - Withdrawal Audit
- `/finance/order-locks` - Lock Order Management

### Finance Records (財務紀錄查詢)

- `/finance/betting-records` - Betting Records (下注紀錄)
- `/finance/balance-logs` - Balance Transaction Logs
- `/finance/adjustment-logs` - Manual Adjustment Logs

### Finance Tools (財務工具)

- `/finance/points-rewards` - Points and Rewards Management
- `/finance/auto-payment` - Auto Payment Configuration

### Game Management (遊戲管理)

- `/game-maintenance/overview` - Game Overview
- `/game-maintenance/platforms` - Game Platforms
- `/game-maintenance/game-list` - Game List
- `/game-maintenance/game-tags` - Game Tags

### Messages (訊息管理)

- `/messages/overview` - Messages Overview
- `/messages/records` - Message Records
- `/messages/system-notify` - System Notifications

### Payments (支付管理)

- `/payments/overview` - Payments Overview
- `/payments/banks` - Bank Management
- `/payments/merchants` - Merchant Management

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
