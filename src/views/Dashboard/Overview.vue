<template>
  <div class="p-6 space-y-6">
    <!-- Welcome Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">{{ greeting }}，管理員</h1>
        <p class="text-surface-400 mt-1">{{ currentDate }}</p>
      </div>
      <Button 
        icon="pi pi-cog" 
        label="自定義儀表板"
        severity="secondary"
        @click="sidebarVisible = true"
      />
    </div>

    <!-- Widget Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <!-- Widget: Finance Snapshot -->
      <Card v-if="widgetConfig.finance" class="widget-card">
        <template #title>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="pi pi-wallet text-green-400"></i>
              <span>營收快照</span>
            </div>
            <router-link to="/dashboard/operations" class="text-surface-400 hover:text-blue-400 transition-colors">
              <i class="pi pi-external-link text-sm"></i>
            </router-link>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-surface-400 text-sm">今日充值</span>
              <span class="text-green-400 font-bold text-lg">$2,850,000</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-surface-400 text-sm">今日提現</span>
              <span class="text-red-400 font-bold text-lg">$1,520,000</span>
            </div>
            <div class="border-t border-surface-700 pt-3">
              <div class="flex items-center justify-between">
                <span class="text-surface-300 text-sm font-medium">淨現金流</span>
                <span class="text-cyan-400 font-bold text-xl">+$1,330,000</span>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Widget: Live Traffic -->
      <Card v-if="widgetConfig.traffic" class="widget-card">
        <template #title>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="pi pi-users text-blue-400"></i>
              <span>即時流量</span>
            </div>
            <router-link to="/dashboard/website-analytics" class="text-surface-400 hover:text-blue-400 transition-colors">
              <i class="pi pi-external-link text-sm"></i>
            </router-link>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-3 bg-surface-800 rounded-lg">
                <p class="text-3xl font-bold text-white">12,450</p>
                <p class="text-surface-400 text-xs mt-1">即時在線 (CCU)</p>
              </div>
              <div class="text-center p-3 bg-surface-800 rounded-lg">
                <p class="text-3xl font-bold text-green-400">1,234</p>
                <p class="text-surface-400 text-xs mt-1">今日註冊</p>
              </div>
            </div>
            <div class="h-12">
              <Chart type="line" :data="sparklineData" :options="sparklineOptions" class="h-full" />
            </div>
            <p class="text-surface-500 text-xs text-center">近 1 小時趨勢</p>
          </div>
        </template>
      </Card>

      <!-- Widget: Risk Radar -->
      <Card v-if="widgetConfig.risk" class="widget-card">
        <template #title>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="pi pi-exclamation-triangle text-red-400"></i>
              <span>風控警報</span>
            </div>
            <router-link to="/dashboard/monitoring" class="text-surface-400 hover:text-blue-400 transition-colors">
              <i class="pi pi-external-link text-sm"></i>
            </router-link>
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div class="flex items-center gap-2">
                <i class="pi pi-desktop text-red-400"></i>
                <span class="text-red-300 text-sm">模擬器嫌疑</span>
              </div>
              <Badge value="3" severity="danger" />
            </div>
            <div class="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div class="flex items-center gap-2">
                <i class="pi pi-money-bill text-orange-400"></i>
                <span class="text-orange-300 text-sm">大額出款</span>
              </div>
              <Badge value="2" severity="warn" />
            </div>
            <div class="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div class="flex items-center gap-2">
                <i class="pi pi-times-circle text-yellow-400"></i>
                <span class="text-yellow-300 text-sm">惡意退款</span>
              </div>
              <Badge value="1" severity="warn" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Widget: Quick Actions -->
      <Card v-if="widgetConfig.quickActions" class="widget-card">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-bolt text-yellow-400"></i>
            <span>快捷入口</span>
          </div>
        </template>
        <template #content>
          <div class="grid grid-cols-2 gap-3">
            <Button 
              icon="pi pi-envelope" 
              label="發送站內信" 
              severity="secondary" 
              class="w-full"
              size="small"
              @click="navigateTo('/messages/templates')"
            />
            <Button 
              icon="pi pi-megaphone" 
              label="新增公告" 
              severity="secondary" 
              class="w-full"
              size="small"
              @click="navigateTo('/system-settings/announcements')"
            />
            <Button 
              icon="pi pi-search" 
              label="查詢會員" 
              severity="secondary" 
              class="w-full"
              size="small"
              @click="navigateTo('/members/list')"
            />
            <Button 
              icon="pi pi-wallet" 
              label="人工存提" 
              severity="secondary" 
              class="w-full"
              size="small"
              @click="navigateTo('/finance/manual-deposit')"
            />
          </div>
        </template>
      </Card>

      <!-- Widget: System Status -->
      <Card v-if="widgetConfig.systemStatus" class="widget-card">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-server text-cyan-400"></i>
            <span>系統健康</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div v-for="service in systemServices" :key="service.name" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span 
                  class="w-2 h-2 rounded-full"
                  :class="{
                    'bg-green-400': service.status === 'healthy',
                    'bg-yellow-400': service.status === 'warning',
                    'bg-red-400': service.status === 'error'
                  }"
                ></span>
                <span class="text-surface-300 text-sm">{{ service.name }}</span>
              </div>
              <span class="text-surface-500 text-xs">{{ service.latency }}</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Widget: Pending Tasks -->
      <Card v-if="widgetConfig.pendingTasks" class="widget-card">
        <template #title>
          <div class="flex items-center gap-2">
            <i class="pi pi-clock text-orange-400"></i>
            <span>待辦事項</span>
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div 
              v-for="task in pendingTasks" 
              :key="task.label"
              class="flex items-center justify-between p-3 bg-surface-800 rounded-lg cursor-pointer hover:bg-surface-700 transition-colors"
              @click="navigateTo(task.link)"
            >
              <div class="flex items-center gap-2">
                <i :class="['pi', task.icon, 'text-surface-400']"></i>
                <span class="text-surface-300 text-sm">{{ task.label }}</span>
              </div>
              <Badge :value="task.count" :severity="task.count > 3 ? 'danger' : 'warn'" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Widget Configuration Sidebar -->
    <Sidebar v-model:visible="sidebarVisible" position="right" class="w-80">
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-cog text-blue-400"></i>
          <span class="font-semibold">自定義儀表板</span>
        </div>
      </template>
      
      <div class="space-y-4 p-4">
        <p class="text-surface-400 text-sm mb-4">選擇要顯示的小部件</p>
        
        <div v-for="widget in widgetList" :key="widget.key" class="flex items-center gap-3">
          <Checkbox 
            v-model="widgetConfig[widget.key]" 
            :binary="true"
            :inputId="widget.key"
            @change="saveConfig"
          />
          <label :for="widget.key" class="flex items-center gap-2 cursor-pointer">
            <i :class="['pi', widget.icon, widget.iconClass]"></i>
            <span>{{ widget.label }}</span>
          </label>
        </div>
        
        <div class="border-t border-surface-700 pt-4 mt-6">
          <Button 
            label="重置為預設" 
            severity="secondary" 
            size="small"
            class="w-full"
            @click="resetConfig"
          />
        </div>
      </div>
    </Sidebar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Sidebar from 'primevue/sidebar'
import Checkbox from 'primevue/checkbox'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
useTheme() // Initialize theme

// ========================================
// Greeting & Date
// ========================================
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早安'
  if (hour < 18) return '午安'
  return '晚安'
})

const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// ========================================
// Widget Configuration
// ========================================
const STORAGE_KEY = 'dashboard-widget-config'

interface WidgetConfig {
  finance: boolean
  traffic: boolean
  risk: boolean
  quickActions: boolean
  systemStatus: boolean
  pendingTasks: boolean
  [key: string]: boolean
}

const defaultConfig: WidgetConfig = {
  finance: true,
  traffic: true,
  risk: true,
  quickActions: true,
  systemStatus: true,
  pendingTasks: true
}

const widgetConfig = ref<WidgetConfig>({ ...defaultConfig })
const sidebarVisible = ref(false)

const widgetList = [
  { key: 'finance', label: '營收快照', icon: 'pi-wallet', iconClass: 'text-green-400' },
  { key: 'traffic', label: '即時流量', icon: 'pi-users', iconClass: 'text-blue-400' },
  { key: 'risk', label: '風控警報', icon: 'pi-exclamation-triangle', iconClass: 'text-red-400' },
  { key: 'quickActions', label: '快捷入口', icon: 'pi-bolt', iconClass: 'text-yellow-400' },
  { key: 'systemStatus', label: '系統健康', icon: 'pi-server', iconClass: 'text-cyan-400' },
  { key: 'pendingTasks', label: '待辦事項', icon: 'pi-clock', iconClass: 'text-orange-400' }
]

const loadConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      widgetConfig.value = { ...defaultConfig, ...JSON.parse(saved) }
    }
  } catch {
    widgetConfig.value = { ...defaultConfig }
  }
}

const saveConfig = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgetConfig.value))
}

const resetConfig = () => {
  widgetConfig.value = { ...defaultConfig }
  saveConfig()
}

onMounted(() => {
  loadConfig()
})

// ========================================
// Navigation
// ========================================
const navigateTo = (path: string) => {
  router.push(path)
}

// ========================================
// Sparkline Chart Data
// ========================================
const sparklineData = computed(() => ({
  labels: Array.from({ length: 12 }, (_, i) => `${i * 5}m`),
  datasets: [{
    data: [11200, 11500, 11800, 12100, 11900, 12300, 12000, 12200, 12450, 12300, 12500, 12450],
    fill: true,
    borderColor: 'rgb(96, 165, 250)',
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    tension: 0.4,
    pointRadius: 0,
    borderWidth: 2
  }]
}))

const sparklineOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false }
  },
  scales: {
    x: { display: false },
    y: { display: false }
  }
}))

// ========================================
// Mock Data - System Services
// ========================================
const systemServices = ref([
  { name: 'APP API', status: 'healthy', latency: '12ms' },
  { name: '主資料庫', status: 'healthy', latency: '8ms' },
  { name: 'Redis 快取', status: 'healthy', latency: '2ms' },
  { name: '第三方金流', status: 'healthy', latency: '85ms' },
  { name: 'CDN 節點', status: 'healthy', latency: '15ms' }
])

// ========================================
// Mock Data - Pending Tasks
// ========================================
const pendingTasks = ref([
  { label: '待審核提現', count: 5, icon: 'pi-wallet', link: '/finance/withdrawals' },
  { label: '待回覆客訴', count: 2, icon: 'pi-comments', link: '/messages/logs' },
  { label: '待處理公告', count: 1, icon: 'pi-megaphone', link: '/system-settings/announcements' }
])
</script>

<style scoped>
.widget-card :deep(.p-card-body) {
  padding: 1.25rem;
}

.widget-card :deep(.p-card-title) {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
