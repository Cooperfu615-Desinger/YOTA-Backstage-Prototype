<template>
  <div class="dark min-h-screen bg-surface-950 text-surface-0">
    <!-- Top Navigation Bar -->
    <header class="fixed top-0 left-0 right-0 h-14 bg-surface-900 border-b border-surface-700 z-50 flex items-center px-4">
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

        <!-- User Menu -->
        <div class="flex items-center gap-2 pl-3 border-l border-surface-700">
          <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <i class="pi pi-user text-sm"></i>
          </div>
          <div class="hidden sm:block">
            <div class="text-sm font-medium">Admin</div>
            <div class="text-xs text-surface-400">超級管理員</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed top-14 left-0 bottom-0 bg-surface-900 border-r border-surface-700 transition-all duration-300 z-40 overflow-y-auto',
        sidebarCollapsed ? 'w-16' : 'w-60'
      ]"
    >
      <nav class="py-4">
        <ul class="space-y-1 px-2">
          <li v-for="item in menuItems" :key="item.path">
            <router-link
              :to="item.path"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive(item.path) 
                  ? 'bg-primary text-white' 
                  : 'text-surface-300 hover:bg-surface-800 hover:text-surface-0'
              ]"
              :title="item.title"
            >
              <i :class="['pi', item.icon, 'text-lg']"></i>
              <span 
                v-if="!sidebarCollapsed" 
                class="text-sm font-medium whitespace-nowrap"
              >
                {{ item.title }}
              </span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main 
      :class="[
        'pt-14 min-h-screen transition-all duration-300',
        sidebarCollapsed ? 'pl-16' : 'pl-60'
      ]"
    >
      <div class="p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebarCollapsed = ref(false)

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const menuItems = [
  { path: '/dashboard', title: '儀表板', icon: 'pi-chart-bar' },
  { path: '/operators', title: '操作員管理', icon: 'pi-users' },
  { path: '/system-settings', title: '系統設定', icon: 'pi-cog' },
  { path: '/messages', title: '訊息管理', icon: 'pi-envelope' },
  { path: '/members', title: '會員管理', icon: 'pi-user' },
  { path: '/layout', title: '版面設定', icon: 'pi-palette' },
  { path: '/game-maintenance', title: '遊戲管理', icon: 'pi-play' },
  { path: '/agents', title: '代理管理', icon: 'pi-sitemap' },
  { path: '/financials', title: '財務管理', icon: 'pi-wallet' },
  { path: '/promotions', title: '推廣活動', icon: 'pi-gift' },
  { path: '/reports', title: '報表管理', icon: 'pi-chart-line' },
  { path: '/cash-flow', title: '金流平台', icon: 'pi-credit-card' },
]
</script>
