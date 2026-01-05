import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard/index.vue'),
        meta: { title: '儀表板', icon: 'pi-chart-bar' }
    },
    {
        path: '/operators',
        name: 'Operators',
        component: () => import('@/views/Operators/index.vue'),
        meta: { title: '操作員管理', icon: 'pi-users' }
    },
    {
        path: '/system-settings',
        name: 'SystemSettings',
        component: () => import('@/views/SystemSettings/index.vue'),
        meta: { title: '系統設定', icon: 'pi-cog' }
    },
    {
        path: '/messages',
        name: 'Messages',
        component: () => import('@/views/Messages/index.vue'),
        meta: { title: '訊息管理', icon: 'pi-envelope' }
    },
    {
        path: '/members',
        name: 'Members',
        component: () => import('@/views/Members/index.vue'),
        meta: { title: '會員管理', icon: 'pi-user' }
    },
    {
        path: '/layout',
        name: 'Layout',
        component: () => import('@/views/Layout/index.vue'),
        meta: { title: '版面設定', icon: 'pi-palette' }
    },
    {
        path: '/game-maintenance',
        name: 'GameMaintenance',
        component: () => import('@/views/GameMaintenance/index.vue'),
        meta: { title: '遊戲管理', icon: 'pi-play' }
    },
    {
        path: '/agents',
        name: 'Agents',
        component: () => import('@/views/Agents/index.vue'),
        meta: { title: '代理管理', icon: 'pi-sitemap' }
    },
    {
        path: '/financials',
        name: 'Financials',
        component: () => import('@/views/Financials/index.vue'),
        meta: { title: '財務管理', icon: 'pi-wallet' }
    },
    {
        path: '/promotions',
        name: 'Promotions',
        component: () => import('@/views/Promotions/index.vue'),
        meta: { title: '推廣活動', icon: 'pi-gift' }
    },
    {
        path: '/reports',
        name: 'Reports',
        component: () => import('@/views/Reports/index.vue'),
        meta: { title: '報表管理', icon: 'pi-chart-line' }
    },
    {
        path: '/cash-flow',
        name: 'CashFlow',
        component: () => import('@/views/CashFlow/index.vue'),
        meta: { title: '金流平台', icon: 'pi-credit-card' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
