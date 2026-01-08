import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    // ========================================
    // 1. 儀表板 (Dashboard)
    // ========================================
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: '儀表板', icon: 'pi-chart-bar' }
    },
    {
        path: '/dashboard/overview',
        name: 'DashboardOverview',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: '儀表板總覽', icon: 'pi-chart-bar', parent: 'Dashboard' }
    },
    {
        path: '/dashboard/website-data',
        name: 'WebsiteData',
        component: () => import('@/views/Dashboard/WebsiteData.vue'),
        meta: { title: '網站數據', icon: 'pi-globe', parent: 'Dashboard' }
    },
    {
        path: '/dashboard/operational-data',
        name: 'OperationalData',
        component: () => import('@/views/Dashboard/OperationalData.vue'),
        meta: { title: '營運數據', icon: 'pi-chart-bar', parent: 'Dashboard' }
    },
    {
        path: '/dashboard/game-monitor',
        name: 'MemberGameMonitor',
        component: () => import('@/views/Dashboard/MemberGameMonitor.vue'),
        meta: { title: '玩家遊戲監控', icon: 'pi-eye', parent: 'Dashboard' }
    },

    // ========================================
    // 2. 操作員管理 (Operators)
    // ========================================
    {
        path: '/operators',
        name: 'Operators',
        component: () => import('@/views/Operators/index.vue'),
        meta: { title: '操作員管理', icon: 'pi-users' }
    },
    {
        path: '/operators/overview',
        name: 'OperatorsOverview',
        component: () => import('@/views/Operators/Overview.vue'),
        meta: { title: '操作員總覽', icon: 'pi-shield', parent: 'Operators' }
    },
    {
        path: '/operators/maintenance',
        name: 'OperatorMaintenance',
        component: () => import('@/views/Operators/Maintenance.vue'),
        meta: { title: '操作員維護', icon: 'pi-user-edit', parent: 'Operators' }
    },
    {
        path: '/operators/groups',
        name: 'OperatorGroups',
        component: () => import('@/views/Operators/Groups.vue'),
        meta: { title: '群組維護', icon: 'pi-users', parent: 'Operators' }
    },
    {
        path: '/operators/logs',
        name: 'OperatorLogs',
        component: () => import('@/views/Operators/Logs.vue'),
        meta: { title: '操作員日誌', icon: 'pi-history', parent: 'Operators' }
    },
    {
        path: '/operators/exports',
        name: 'OperatorExports',
        component: () => import('@/views/Operators/Exports.vue'),
        meta: { title: '匯出管理', icon: 'pi-download', parent: 'Operators' }
    },

    // ========================================
    // 3. 系統設定 (System Settings)
    // ========================================
    {
        path: '/system-settings',
        name: 'SystemSettings',
        component: () => import('@/views/SystemSettings/index.vue'),
        meta: { title: '系統設定', icon: 'pi-cog' }
    },
    {
        path: '/system-settings/overview',
        name: 'SystemSettingsOverview',
        component: () => import('@/views/SystemSettings/Overview.vue'),
        meta: { title: '系統總覽', icon: 'pi-chart-pie', parent: 'SystemSettings' }
    },
    {
        path: '/system-settings/announcements',
        name: 'Announcements',
        component: () => import('@/views/SystemSettings/Announcements.vue'),
        meta: { title: '公告管理', icon: 'pi-megaphone', parent: 'SystemSettings' }
    },
    {
        path: '/system-settings/parameters',
        name: 'Parameters',
        component: () => import('@/views/SystemSettings/Parameters.vue'),
        meta: { title: '系統參數設定', icon: 'pi-sliders-h', parent: 'SystemSettings' }
    },
    {
        path: '/system-settings/bank-wallet',
        name: 'BankWallet',
        component: () => import('@/views/SystemSettings/BankWallet.vue'),
        meta: { title: '銀行與錢包', icon: 'pi-building-columns', parent: 'SystemSettings' }
    },

    // ========================================
    // 4. 訊息管理 (Messages)
    // ========================================
    {
        path: '/messages',
        name: 'Messages',
        component: () => import('@/views/Messages/index.vue'),
        meta: { title: '訊息管理', icon: 'pi-envelope' }
    },
    {
        path: '/messages/overview',
        name: 'MessagesOverview',
        component: () => import('@/views/Messages/Overview.vue'),
        meta: { title: '訊息總覽', icon: 'pi-chart-pie', parent: 'Messages' }
    },
    {
        path: '/messages/templates',
        name: 'MessageTemplates',
        component: () => import('@/views/Messages/Templates.vue'),
        meta: { title: '訊息模板', icon: 'pi-file-edit', parent: 'Messages' }
    },
    {
        path: '/messages/system-notify',
        name: 'SystemNotify',
        component: () => import('@/views/Messages/SystemNotify.vue'),
        meta: { title: '系統通知', icon: 'pi-bell', parent: 'Messages' }
    },
    {
        path: '/messages/records',
        name: 'MessageRecords',
        component: () => import('@/views/Messages/Records.vue'),
        meta: { title: '即時訊息紀錄', icon: 'pi-inbox', parent: 'Messages' }
    },

    // ========================================
    // 5. 會員管理 (Members)
    // ========================================
    {
        path: '/members',
        name: 'Members',
        component: () => import('@/views/Members/index.vue'),
        meta: { title: '會員管理', icon: 'pi-user' }
    },
    {
        path: '/members/overview',
        name: 'MembersOverview',
        component: () => import('@/views/Members/Overview.vue'),
        meta: { title: '會員總覽', icon: 'pi-chart-line', parent: 'Members' }
    },
    {
        path: '/members/list',
        name: 'MemberList',
        component: () => import('@/views/Members/List.vue'),
        meta: { title: '會員列表', icon: 'pi-users', parent: 'Members' }
    },
    {
        path: '/members/memo-record',
        name: 'MemoRecord',
        component: () => import('@/views/Members/Logs.vue'),
        meta: { title: '會員日誌', icon: 'pi-book', parent: 'Members' }
    },
    {
        path: '/members/logs',
        redirect: '/members/memo-record'
    },
    {
        path: '/members/level-settings',
        name: 'LevelSettings',
        component: () => import('@/views/Members/LevelSettings.vue'),
        meta: { title: '等級維護', icon: 'pi-star', parent: 'Members' }
    },
    {
        path: '/members/tags',
        name: 'MemberTags',
        component: () => import('@/views/Members/Tags.vue'),
        meta: { title: '標籤管理', icon: 'pi-tag', parent: 'Members' }
    },

    // ========================================
    // 6. 版面設定 (Layout)
    // ========================================
    {
        path: '/layout',
        name: 'Layout',
        component: () => import('@/views/Layout/index.vue'),
        meta: { title: '版面設定', icon: 'pi-palette' }
    },
    {
        path: '/layout/overview',
        name: 'LayoutOverview',
        component: () => import('@/views/Layout/Overview.vue'),
        meta: { title: '版面總覽', icon: 'pi-chart-pie', parent: 'Layout' }
    },
    {
        path: '/layout/homepage',
        name: 'Homepage',
        component: () => import('@/views/Layout/Homepage.vue'),
        meta: { title: '首頁設定', icon: 'pi-home', parent: 'Layout' }
    },
    {
        path: '/layout/games',
        name: 'LayoutGames',
        component: () => import('@/views/Layout/Games.vue'),
        meta: { title: '遊戲版面', icon: 'pi-th-large', parent: 'Layout' }
    },
    {
        path: '/layout/articles',
        name: 'Articles',
        component: () => import('@/views/Layout/Articles.vue'),
        meta: { title: '文章管理', icon: 'pi-file', parent: 'Layout' }
    },
    {
        path: '/layout/payment',
        name: 'PaymentSettings',
        component: () => import('@/views/Layout/Payment.vue'),
        meta: { title: '支付管理', icon: 'pi-credit-card', parent: 'Layout' }
    },
    {
        path: '/layout/popup-ads',
        name: 'PopupAds',
        component: () => import('@/views/Layout/PopupAds.vue'),
        meta: { title: '彈跳廣告', icon: 'pi-window-maximize', parent: 'Layout' }
    },

    // ========================================
    // 7. 遊戲管理 (Game Maintenance)
    // ========================================
    {
        path: '/game-maintenance',
        name: 'GameMaintenance',
        component: () => import('@/views/GameMaintenance/index.vue'),
        meta: { title: '遊戲管理', icon: 'pi-play' }
    },
    {
        path: '/game-maintenance/overview',
        name: 'GameMaintenanceOverview',
        component: () => import('@/views/GameMaintenance/Overview.vue'),
        meta: { title: '遊戲總覽', icon: 'pi-chart-pie', parent: 'GameMaintenance' }
    },
    {
        path: '/game-maintenance/platforms',
        name: 'GamePlatforms',
        component: () => import('@/views/GameMaintenance/Platforms.vue'),
        meta: { title: '遊戲平台', icon: 'pi-server', parent: 'GameMaintenance' }
    },
    {
        path: '/game-maintenance/game-list',
        name: 'GameList',
        component: () => import('@/views/GameMaintenance/GameList.vue'),
        meta: { title: '遊戲列表', icon: 'pi-list', parent: 'GameMaintenance' }
    },
    {
        path: '/game-maintenance/game-tags',
        name: 'GameTags',
        component: () => import('@/views/GameMaintenance/GameTags.vue'),
        meta: { title: '遊戲標籤', icon: 'pi-tags', parent: 'GameMaintenance' }
    },

    // ========================================
    // 8. 代理管理 (Agents)
    // ========================================
    {
        path: '/agents',
        name: 'Agents',
        component: () => import('@/views/Agents/index.vue'),
        meta: { title: '代理管理', icon: 'pi-sitemap' }
    },
    {
        path: '/agents/overview',
        name: 'AgentsOverview',
        component: () => import('@/views/Agents/Overview.vue'),
        meta: { title: '代理總覽', icon: 'pi-chart-pie', parent: 'Agents' }
    },
    {
        path: '/agent/list',
        name: 'AgentList',
        component: () => import('@/views/Agents/AgentList.vue'),
        meta: { title: '代理列表', icon: 'pi-users', parent: 'Agents' }
    },
    {
        path: '/agent/levels',
        name: 'AgentLevels',
        component: () => import('@/views/Agents/AgentLevels.vue'),
        meta: { title: '代理等級', icon: 'pi-star', parent: 'Agents' }
    },
    {
        path: '/agent/commission',
        name: 'AgentCommission',
        component: () => import('@/views/Agents/CommissionSettings.vue'),
        meta: { title: '佣金設定', icon: 'pi-percentage', parent: 'Agents' }
    },
    {
        path: '/agent/maintenance',
        name: 'AgentMaintenance',
        component: () => import('@/views/Agents/AgentMaintenance.vue'),
        meta: {
            title: '代理商維護'
        }
    },
    {
        path: '/agent/settlement',
        name: 'SettlementReport',
        component: () => import('@/views/Agents/SettlementReport.vue'),
        meta: { title: '佣金結算報表', icon: 'pi-calculator', parent: 'Agents' }
    },
    {
        path: '/agents/maintenance',
        name: 'AgentMaintenance',
        component: () => import('@/views/Agents/AgentMaintenance.vue'),
        meta: { title: '代理商維護', icon: 'pi-sitemap', parent: 'Agents' }
    },
    {
        path: '/agents/promotion',
        name: 'PromotionMaintenance',
        component: () => import('@/views/Agents/PromotionMaintenance.vue'),
        meta: { title: '推廣維護', icon: 'pi-link', parent: 'Agents' }
    },

    // ========================================
    // 9. 財務管理 (Financials)
    // ========================================
    {
        path: '/finance',
        name: 'Finance',
        component: () => import('@/views/Finance/index.vue'),
        meta: { title: '財務管理', icon: 'pi-wallet' }
    },
    {
        path: '/finance/overview',
        name: 'FinanceOverview',
        component: () => import('@/views/Finance/Overview.vue'),
        meta: { title: '財務總覽', icon: 'pi-chart-line', parent: 'Finance' }
    },
    {
        path: '/finance/records',
        name: 'FinanceRecords',
        component: () => import('@/views/Finance/Records.vue'),
        meta: { title: '紀錄類', icon: 'pi-file-edit', parent: 'Finance' }
    },
    {
        path: '/finance/betting-records',
        name: 'BettingRecords',
        component: () => import('@/views/Finance/BettingRecords.vue'),
        meta: { title: '下注紀錄', icon: 'pi-th-large', parent: 'Finance' }
    },
    {
        path: '/finance/points-rewards',
        name: 'PointsRewards',
        component: () => import('@/views/Finance/PointsRewards.vue'),
        meta: { title: '點數與獎勵', icon: 'pi-star-fill', parent: 'Finance' }
    },
    {
        path: '/finance/auto-payment',
        name: 'AutoPayment',
        component: () => import('@/views/Finance/AutoPayment.vue'),
        meta: { title: '自動金流', icon: 'pi-sync', parent: 'Finance' }
    },
    // ========================================
    // 12. 財務審核管理 (Finance Audit)
    // ========================================
    {
        path: '/finance/manual-deposit',
        name: 'ManualDeposit',
        component: () => import('@/views/Finance/ManualDeposit.vue'),
        meta: { title: '手工存款審核', icon: 'pi-file-edit', parent: 'Financials' }
    },
    {
        path: '/finance/online-deposit',
        name: 'OnlineDeposit',
        component: () => import('@/views/Finance/OnlineDeposit.vue'),
        meta: { title: '在線存款查詢', icon: 'pi-search', parent: 'Financials' }
    },
    {
        path: '/finance/withdrawals',
        name: 'Withdrawals',
        component: () => import('@/views/Finance/Withdrawals.vue'),
        meta: { title: '提款審核', icon: 'pi-wallet', parent: 'Financials' }
    },
    {
        path: '/finance/order-locks',
        name: 'OrderLocks',
        component: () => import('@/views/Finance/OrderLocks.vue'),
        meta: { title: '鎖單管理', icon: 'pi-lock', parent: 'Financials' }
    },
    {
        path: '/finance/balance-logs',
        name: 'BalanceLogs',
        component: () => import('@/views/Finance/BalanceLogs.vue'),
        meta: { title: '資金流水紀錄', icon: 'pi-list', parent: 'Financials' }
    },
    {
        path: '/finance/adjustment-logs',
        name: 'AdjustmentLogs',
        component: () => import('@/views/Finance/AdjustmentLogs.vue'),
        meta: { title: '人工存提紀錄', icon: 'pi-pencil', parent: 'Financials' }
    },

    // ========================================
    // 10. 推廣活動 (Promotions)
    // ========================================
    {
        path: '/promotions',
        name: 'Promotions',
        component: () => import('@/views/Promotions/index.vue'),
        meta: { title: '推廣活動', icon: 'pi-gift' }
    },
    {
        path: '/promotions/overview',
        name: 'PromotionsOverview',
        component: () => import('@/views/Promotions/Overview.vue'),
        meta: { title: '推廣總覽', icon: 'pi-chart-pie', parent: 'Promotions' }
    },
    {
        path: '/promotions/offers',
        name: 'Offers',
        component: () => import('@/views/Promotions/Offers.vue'),
        meta: { title: '優惠管理', icon: 'pi-percentage', parent: 'Promotions' }
    },
    {
        path: '/promotions/special-events',
        name: 'SpecialEvents',
        component: () => import('@/views/Promotions/SpecialEvents.vue'),
        meta: { title: '特定活動', icon: 'pi-trophy', parent: 'Promotions' }
    },
    {
        path: '/promotions/lottery',
        name: 'Lottery',
        component: () => import('@/views/Promotions/Lottery.vue'),
        meta: { title: '抽獎系統', icon: 'pi-ticket', parent: 'Promotions' }
    },

    // ========================================
    // 11. 報表管理 (Reports)
    // ========================================
    {
        path: '/reports',
        name: 'Reports',
        component: () => import('@/views/Reports/index.vue'),
        meta: { title: '報表管理', icon: 'pi-chart-line' }
    },
    {
        path: '/reports/overview',
        name: 'ReportsOverview',
        component: () => import('@/views/Reports/Overview.vue'),
        meta: { title: '報表總覽', icon: 'pi-chart-pie', parent: 'Reports' }
    },
    {
        path: '/reports/game-performance',
        name: 'GamePerformance',
        component: () => import('@/views/Reports/GamePerformance.vue'),
        meta: { title: '遊戲表現', icon: 'pi-chart-bar', parent: 'Reports' }
    },
    {
        path: '/reports/cash',
        name: 'CashReports',
        component: () => import('@/views/Reports/Cash.vue'),
        meta: { title: '現金報表', icon: 'pi-money-bill', parent: 'Reports' }
    },
    {
        path: '/reports/deposit',
        name: 'DepositReports',
        component: () => import('@/views/Reports/Deposit.vue'),
        meta: { title: '在線存款', icon: 'pi-credit-card', parent: 'Reports' }
    },
    {
        path: '/reports/bonus',
        name: 'BonusReports',
        component: () => import('@/views/Reports/Bonus.vue'),
        meta: { title: '贈金報表', icon: 'pi-gift', parent: 'Reports' }
    },
    {
        path: '/reports/operations',
        name: 'OperationsReports',
        component: () => import('@/views/Reports/Operations.vue'),
        meta: { title: '營運報表', icon: 'pi-chart-line', parent: 'Reports' }
    },

    // ========================================
    // 12. 金流平台 (Payments)
    // ========================================
    {
        path: '/payments',
        name: 'Payments',
        component: () => import('@/views/Payments/Overview.vue'),
        meta: { title: '金流平台', icon: 'pi-credit-card' }
    },
    {
        path: '/payments/overview',
        name: 'PaymentsOverview',
        component: () => import('@/views/Payments/Overview.vue'),
        meta: { title: '金流平台總覽', icon: 'pi-chart-pie', parent: 'Payments' }
    },
    {
        path: '/payments/merchants',
        name: 'Merchants',
        component: () => import('@/views/CashFlow/Merchants.vue'),
        meta: { title: '商號管理', icon: 'pi-building', parent: 'Payments' }
    },
    {
        path: '/payments/banks',
        name: 'Banks',
        component: () => import('@/views/Payments/Banks.vue'),
        meta: { title: '銀行管理', icon: 'pi-building-columns', parent: 'Payments' }
    },
    {
        path: '/payments/app-purchase',
        name: 'AppPurchase',
        component: () => import('@/views/Payments/AppPurchase.vue'),
        meta: { title: '行動支付管理', icon: 'pi-apple', parent: 'Payments' }
    }
]

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes
})

export default router
