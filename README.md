# YOTA Backstage Prototype

> **iGaming Admin Platform Prototype** - A comprehensive backend management system for online gaming operations

## 📋 Project Overview

YOTA Backstage Prototype is a feature-rich administrative dashboard designed specifically for iGaming platforms. Built with modern web technologies, it provides operators with powerful tools for member management, financial operations, game administration, and real-time monitoring.

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) with Composition API
- **UI Library**: [PrimeVue](https://primevue.org/) (Aura Dark Theme)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Icons**: PrimeIcons

## ✨ Feature Map

### 📊 Dashboard (儀表板)

- Real-time operational metrics
- Website traffic analytics
- Player monitoring and alerts
- Performance indicators

### 👥 Member Management (會員管理)

- **Member List**: Comprehensive player database with advanced search
- **Level Settings**: VIP tier configuration and benefits
- **Tag Management**: Dynamic tagging system for categorization
- **Member Logs**: Activity tracking and audit trails
- **Member Detail Modal**: 360° view with financial history, risk assessment, and operator notes

### 💰 Finance Audit Management (財務審核管理)

- **Withdrawal Audit**: Multi-factor verification with rollover checks and risk scanning
- **Manual Deposit Audit**: Attachment preview, member risk snapshot, and dual verification
- **Online Deposit Query**: 3rd-party callback monitoring and manual re-issue for failed dispatches
- **Lock Order Management**: Real-time tracking with timeout warnings and force unlock capability

### 📝 Finance Records (財務紀錄查詢)

- **Balance Logs**: Comprehensive transaction history with color-coded amounts
- **Adjustment Logs**: Manual operation tracking with approval workflow

### 🎁 Finance Tools (財務工具)

- **Points & Rewards**: Manual adjustment console with bulk distribution tasks
- **Auto Payment**: Automated approval rules and gateway load balancing

### 🎮 Game Management (遊戲管理)

- Game platform integration
- Game library configuration
- Tag-based categorization
- Game performance analytics

### 💳 Payment Management (支付管理)

- Bank account configuration
- Payment merchant management
- Gateway weight distribution
- Success rate monitoring

### 📱 Other Modules

- **Operators**: Admin account management, permissions, and audit logs
- **Messages**: System notifications and communication center
- **Layout**: Homepage design, game presentation, promotional content
- **Agents**: Affiliate management and commission tracking
- **Promotions**: Campaign creation and bonus configuration
- **Reports**: Financial reports and player analytics
- **System Settings**: Platform parameters and configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Cooperfu615-Desinger/YOTA-Backstage-Prototype.git

# Navigate to project directory
cd YOTA-Backstage-Prototype

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Access at http://localhost:5173
```

### Build for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Design Principles

### UI Consistency

- **220px fixed-width inputs** for all search fields
- **Three-tier responsive design** (Desktop/Tablet/Mobile)
- **Color-coded financial indicators** (Green for positive, Red for negative)

### User Experience

- Toast notifications for all operations
- Confirmation dialogs for critical actions
- Real-time updates for time-sensitive data
- Visual feedback for all interactions

### Code Quality

- TypeScript for type safety
- Component-based architecture
- Centralized state management with composables
- Reusable utility functions

## 📦 Key Features

### 🔐 Lock Order System

Prevents concurrent processing of financial orders with real-time timeout monitoring and supervisor override capabilities.

### 🏷️ Dynamic Tagging

Flexible member categorization with color-coded tags that link across modules (member list → audit modals → reports).

### 🔄 Approval Workflows

Multi-level authorization for high-value transactions (>$10,000) with automated routing to supervisors.

### 📊 Real-Time Monitoring

Live duration tracking for locked orders, success rate monitoring for payment gateways, and instant alert notifications.

### 🤖 Automation

Configurable rules for auto-approval based on amount limits, VIP levels, and rollover completion.

## 📱 Responsive Design

Built with a mobile-first approach:

- **Desktop (≥1024px)**: Full multi-column layouts with sidebar navigation
- **Tablet (768px-1023px)**: Optimized 2-column grids
- **Mobile (<768px)**: Single-column stacked layout

## 🧪 Mock Data

The prototype includes comprehensive mock data generation for:

- 50+ withdrawal and deposit transactions
- 30+ bulk distribution tasks
- 20+ adjustment records
- 15+ payment gateways
- 100+ member profiles

## 📝 Documentation

- [PROJECT_SNAPSHOT.md](./PROJECT_SNAPSHOT.md) - Detailed technical documentation
- [Implementation Plans](/.gemini/antigravity/brain/) - Feature development history

## 🔧 Development Status

**Current Version**: 1.0 (Prototype)

✅ **Completed Modules**:

- Dashboard & Analytics
- Member Management
- Finance Audit System
- Payment Configuration
- Game Management

🚧 **Future Enhancements**:

- Real API integration
- WebSocket for live updates
- Advanced reporting engine
- Multi-language support

## 📄 License

This project is a prototype for demonstration purposes.

## 🤝 Contributing

This is a prototype project. For inquiries or collaboration, please contact the development team.

---

**Built with ❤️ for modern iGaming operations**
