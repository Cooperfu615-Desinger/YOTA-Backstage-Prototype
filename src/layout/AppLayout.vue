<template>
  <div :class="[isDark ? 'dark' : 'light', 'min-h-screen', isDark ? 'bg-surface-950 text-surface-0' : 'bg-gray-100 text-gray-900']">
    <!-- Top Navigation Bar -->
    <header :class="['fixed top-0 left-0 right-0 h-14 border-b z-[9999] flex items-center px-4 shadow-lg', isDark ? 'bg-[#0a0a0a] border-surface-700 shadow-black/50' : 'bg-white border-gray-200 shadow-gray-200/50']">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <button 
          @click="toggleSidebar" 
          class="p-2 rounded-lg hover:bg-surface-800 transition-colors"
        >
          <i class="pi pi-bars text-lg"></i>
        </button>
        <div class="flex items-center gap-2">
          <i class="pi pi-box text-xl text-primary"></i>
          <span class="font-bold text-lg hidden sm:block">iGaming Admin</span>
        </div>
      </div>

      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Right Side: Search, Notifications, User -->
      <div class="flex items-center gap-3">
        <!-- Search -->
        <div class="hidden md:flex items-center bg-surface-800 rounded-lg px-3 py-1.5">
          <i class="pi pi-search text-surface-400 mr-2"></i>
          <input 
            type="text" 
            placeholder="搜尋..."
            class="bg-transparent border-none outline-none text-sm w-40"
          />
        </div>

        <!-- Notifications -->
        <button class="p-2 rounded-lg hover:bg-surface-800 transition-colors relative">
          <i class="pi pi-bell text-lg"></i>
          <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- Theme Toggle (HIDDEN: Temporarily disabled for development stability) -->
        <button 
          v-if="false"
          @click="toggleTheme" 
          :class="['p-2 rounded-lg transition-colors', isDark ? 'hover:bg-surface-800' : 'hover:bg-gray-100']"
          :title="isDark ? '切換為淺色模式' : '切換為深色模式'"
        >
          <i :class="['pi text-lg', isDark ? 'pi-sun text-yellow-400' : 'pi-moon text-indigo-500']"></i>
        </button>

        <!-- User Menu -->
        <div :class="['flex items-center gap-2 pl-3 border-l', isDark ? 'border-surface-700' : 'border-gray-200']">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <i class="pi pi-user text-sm text-white"></i>
          </div>
          <div class="hidden sm:block">
            <div class="text-sm font-medium">Admin</div>
            <div :class="['text-xs', isDark ? 'text-surface-400' : 'text-gray-500']">超級管理員</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed top-14 left-0 bottom-0 border-r transition-all duration-300 z-[90] overflow-y-auto',
        isDark ? 'bg-[#0a0a0a] border-surface-700' : 'bg-white border-gray-200',
        sidebarCollapsed ? 'w-16' : 'w-64'
      ]"
    >
      <nav class="py-4">
        <ul class="space-y-1 px-2">
          <li v-for="item in menuItems" :key="item.path">
            <!-- Parent Menu Item -->
            <div
              @click="item.children ? toggleMenu(item.path) : navigateTo(item.path)"
              :class="[
                'flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors cursor-pointer',
                isActive(item.path) && !item.children
                  ? 'bg-primary text-white' 
                  : 'text-surface-300 hover:bg-surface-800 hover:text-surface-0'
              ]"
              :title="item.title"
            >
              <div class="flex items-center gap-3">
                <i :class="['pi', item.icon, 'text-lg']"></i>
                <span 
                  v-if="!sidebarCollapsed" 
                  class="text-sm font-medium whitespace-nowrap"
                >
                  {{ item.title }}
                </span>
              </div>
              <!-- Expand/Collapse Icon -->
              <i 
                v-if="item.children && !sidebarCollapsed" 
                :class="[
                  'pi text-xs transition-transform duration-200',
                  expandedMenus[item.path] ? 'pi-chevron-down' : 'pi-chevron-right'
                ]"
              ></i>
            </div>

            <!-- Children Menu Items -->
            <ul 
              v-if="item.children && !sidebarCollapsed"
              v-show="expandedMenus[item.path]"
              class="mt-1 ml-4 pl-3 border-l border-surface-700 space-y-1"
            >
              <li v-for="child in item.children" :key="child.path || child.title">
                <!-- Level 3 Parent -->
                <div v-if="child.children"
                  @click.stop="toggleMenu(child.path)"
                  :class="[
                    'flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer text-sm mb-1',
                    isActive(child.path)
                      ? 'text-white font-medium' 
                      : 'text-surface-400 hover:bg-surface-800 hover:text-surface-0'
                  ]"
                >
                  <div class="flex items-center gap-3">
                    <i :class="['pi', child.icon, 'text-sm']"></i>
                    <span class="whitespace-nowrap">{{ child.title }}</span>
                  </div>
                  <i 
                    :class="[
                      'pi text-[10px] transition-transform duration-200',
                      expandedMenus[child.path] ? 'pi-chevron-down' : 'pi-chevron-right'
                    ]"
                  ></i>
                </div>

                <!-- Level 3 Children -->
                <ul v-if="child.children" v-show="expandedMenus[child.path]" class="pl-3 border-l border-surface-700 space-y-1 ml-4 mb-2">
                   <li v-for="subChild in child.children" :key="subChild.path">
                      <router-link
                        :to="subChild.path"
                        :class="[
                          'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                          isActiveExact(subChild.path) 
                            ? 'bg-blue-500/20 text-blue-400 font-bold' 
                            : 'text-surface-400 hover:bg-surface-800 hover:text-surface-0'
                        ]"
                      >
                        <i :class="['pi', subChild.icon, 'text-sm']"></i>
                        <span class="whitespace-nowrap">{{ subChild.title }}</span>
                      </router-link>
                   </li>
                </ul>

                <!-- Level 2 Item (Standard) -->
                <router-link
                  v-else
                  :to="child.path"
                  :class="[
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm',
                    isActiveExact(child.path) 
                      ? 'bg-blue-500/20 text-blue-400 font-bold' 
                      : 'text-surface-400 hover:bg-surface-800 hover:text-surface-0'
                  ]"
                >
                  <i :class="['pi', child.icon, 'text-sm']"></i>
                  <span class="whitespace-nowrap">{{ child.title }}</span>
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main 
      :class="[
        'pt-14 min-h-screen transition-all duration-300 relative z-0',
        sidebarCollapsed ? 'pl-16' : 'pl-64'
      ]"
    >
      <div class="p-0">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const router = useRouter()
const { isDark, toggleTheme, initTheme } = useTheme()

const sidebarCollapsed = ref(false)
const expandedMenus = reactive<Record<string, boolean>>({})

// Initialize theme on mount
onMounted(() => {
  initTheme()
})

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const toggleMenu = (path: string) => {
  expandedMenus[path] = !expandedMenus[path]
}

const navigateTo = (path: string) => {
  router.push(path)
}

const isActive = (path: string) => {
  if (!path) return false
  return route.path.startsWith(path)
}

const isActiveExact = (path: string) => {
  return route.path === path
}

interface MenuItem {
  path: string
  title: string
  icon: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  { 
    path: '/dashboard', 
    title: '儀表板', 
    icon: 'pi-chart-bar',
    children: [
      { path: '/dashboard/overview', title: '儀表板總覽', icon: 'pi-chart-bar' },
      { path: '/dashboard/website-data', title: '網站數據', icon: 'pi-globe' },
      { path: '/dashboard/operational-data', title: '營運數據', icon: 'pi-chart-bar' },
      { path: '/dashboard/game-monitor', title: '玩家監控', icon: 'pi-eye' },
    ]
  },
  { 
    path: '/operators', 
    title: '操作員管理', 
    icon: 'pi-users',
    children: [
      { path: '/operators/overview', title: '操作員總覽', icon: 'pi-shield' },
      { path: '/operators/maintenance', title: '操作員維護', icon: 'pi-user-edit' },
      { path: '/operators/groups', title: '群組維護', icon: 'pi-users' },
      { path: '/operators/logs', title: '操作員日誌', icon: 'pi-history' },
      { path: '/operators/exports', title: '匯出管理', icon: 'pi-download' },
    ]
  },
  { 
    path: '/system-settings', 
    title: '系統設定', 
    icon: 'pi-cog',
    children: [
      { path: '/system-settings/overview', title: '總覽', icon: 'pi-chart-pie' },
      { path: '/system-settings/announcements', title: '公告管理', icon: 'pi-megaphone' },
      { path: '/system-settings/parameters', title: '系統參數', icon: 'pi-sliders-h' },
      { path: '/system-settings/bank-wallet', title: '銀行與錢包', icon: 'pi-building-columns' },
    ]
  },
  { 
    path: '/messages', 
    title: '訊息管理', 
    icon: 'pi-envelope',
    children: [
      { path: '/messages/overview', title: '總覽', icon: 'pi-chart-pie' },
      { path: '/messages/templates', title: '訊息模板', icon: 'pi-file-edit' },
      { path: '/messages/system-notify', title: '系統通知', icon: 'pi-bell' },
      { path: '/messages/records', title: '訊息紀錄', icon: 'pi-inbox' },
    ]
  },
  { 
    path: '/members', 
    title: '會員管理', 
    icon: 'pi-user',
    children: [
      { path: '/members/overview', title: '會員總覽', icon: 'pi-chart-line' },
      { path: '/members/list', title: '會員列表', icon: 'pi-users' },
      { path: '/members/memo-record', title: '會員日誌', icon: 'pi-book' },
      { path: '/members/level-settings', title: '等級維護', icon: 'pi-star' },
      { path: '/members/tags', title: '標籤管理', icon: 'pi-tag' },
    ]
  },
  { 
    path: '/layout', 
    title: '版面設定', 
    icon: 'pi-palette',
    children: [
      { path: '/layout/overview', title: '總覽', icon: 'pi-chart-pie' },
      { path: '/layout/homepage', title: '首頁設定', icon: 'pi-home' },
      { path: '/layout/games', title: '遊戲版面', icon: 'pi-th-large' },
      { path: '/layout/articles', title: '文章管理', icon: 'pi-file' },
      { path: '/layout/payment', title: '支付管理', icon: 'pi-credit-card' },
      { path: '/layout/popup-ads', title: '彈跳廣告', icon: 'pi-window-maximize' },
    ]
  },
  { 
    path: '/agents', 
    title: '代理管理', 
    icon: 'pi-sitemap',
    children: [
      { path: '/agent/overview', title: '代理總覽', icon: 'pi-chart-pie' },
      { path: '/agent/list', title: '代理列表', icon: 'pi-users' },
      { path: '/agent/levels', title: '代理等級', icon: 'pi-star' },
      { path: '/agent/commission', title: '佣金設定', icon: 'pi-percentage' },
      { path: '/agent/maintenance', title: '代理商維護', icon: 'pi-sitemap' },
      // { path: '/agent/promotion', title: '推廣維護', icon: 'pi-link' }, // Moved to Promotion Module
    ]
  },
  { 
    path: '/finance', 
    title: '財務管理', 
    icon: 'pi-wallet',
    children: [
      { path: '/finance/overview', title: '財務總覽', icon: 'pi-chart-line' },
      {
        path: '#',
        title: '審核管理',
        icon: 'pi-verified',
        children: [
          { path: '/finance/manual-deposit', title: '手工存款審核', icon: 'pi-file-edit' },
          { path: '/finance/online-deposit', title: '在線存款查詢', icon: 'pi-search' },
          { path: '/finance/withdrawals', title: '提款審核', icon: 'pi-money-bill' },
          { path: '/finance/order-locks', title: '鎖單管理', icon: 'pi-lock' },
        ]
      },
      {
        path: '#',
        title: '紀錄查詢',
        icon: 'pi-file-edit',
        children: [
          { path: '/finance/betting-records', title: '下注紀錄', icon: 'pi-th-large' },
          { path: '/finance/balance-logs', title: '資金流水紀錄', icon: 'pi-list' },
          { path: '/finance/adjustment-logs', title: '人工存提紀錄', icon: 'pi-pencil' },
        ]
      },
      { path: '/finance/points-rewards', title: '點數與獎勵', icon: 'pi-star-fill' },
      { path: '/finance/auto-payment', title: '自動金流', icon: 'pi-sync' },
    ]
  },
  { 
    path: '/games', 
    title: '遊戲管理', 
    icon: 'pi-play',
    children: [
      { path: '/games/platforms', title: '遊戲平台', icon: 'pi-server' },
    ]
  },
  { 
    path: '/promotions', 
    title: '推廣活動', 
    icon: 'pi-gift',
    children: [
      { path: '/promotions/overview', title: '推廣總覽', icon: 'pi-chart-pie' },
      { path: '/promotions/offers', title: '優惠管理', icon: 'pi-list' },
      { path: '/promotions/special-events', title: '活動設置', icon: 'pi-cog' },
      { path: '/promotions/achievements', title: '成就設置', icon: 'pi-star' },
    ]
  },
  { 
    path: '/reports', 
    title: '報表管理', 
    icon: 'pi-chart-line',
    children: [
      { path: '/reports/overview', title: '總覽', icon: 'pi-chart-pie' },
      { path: '/reports/game-performance', title: '遊戲表現', icon: 'pi-chart-bar' },
      { path: '/reports/cash', title: '現金報表', icon: 'pi-money-bill' },
      { path: '/reports/deposit', title: '在線存款', icon: 'pi-credit-card' },
      { path: '/reports/bonus', title: '贈金報表', icon: 'pi-gift' },
      { path: '/reports/operations', title: '營運報表', icon: 'pi-chart-line' },
    ]
  },
  { 
    path: '/payments', 
    title: '金流平台', 
    icon: 'pi-credit-card',
    children: [
      { path: '/payments/overview', title: '總覽', icon: 'pi-chart-pie' },
      { path: '/payments/merchants', title: '商號管理', icon: 'pi-building' },
      { path: '/payments/app-purchase', title: '行動支付管理', icon: 'pi-apple' },
      { path: '/payments/banks', title: '銀行管理', icon: 'pi-building-columns' },
    ]
  },
]

// Auto-expand parent menu when navigating to child
watch(() => route.path, (newPath) => {
  menuItems.forEach(item => {
    if (item.children) {
      // Check for Level 2 match (Standard)
      if (item.children.some(child => newPath.startsWith(child.path))) {
        expandedMenus[item.path] = true
      }
      
      // Check for Level 3 match (Deeply nested)
      item.children.forEach(child => {
        if (child.children && child.children.some(grandChild => newPath.startsWith(grandChild.path))) {
           expandedMenus[item.path] = true // Expand Parent (Level 1)
           expandedMenus[child.path] = true // Expand Child (Level 2)
        }
      })
    }
  })
}, { immediate: true })
</script>
