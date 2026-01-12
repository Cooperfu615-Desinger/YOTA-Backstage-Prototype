<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-cog text-slate-400"></i>
      <span class="text-surface-300">系統設定</span>
      <span>></span>
      <span class="text-white font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-cog text-slate-400"></i>
          系統設定總覽
        </h1>
        <p class="text-surface-400 mt-1">System Overview - 系統架構健康度與核心開關監控</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Health Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Server Load with Knob -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">伺服器負載</p>
              <p class="text-xl font-bold text-white">CPU {{ stats.cpuUsage }}%</p>
              <p class="text-sm text-surface-400 mt-1">RAM {{ stats.ramUsage }}%</p>
            </div>
            <Knob 
              v-model="stats.cpuUsage" 
              :size="80" 
              :strokeWidth="8"
              :readonly="true"
              valueColor="#10b981"
              rangeColor="rgba(71, 85, 105, 0.5)"
              textColor="#fff"
            />
          </div>
        </template>
      </Card>

      <!-- API Latency -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">API 平均延遲</p>
              <p 
                class="text-2xl font-bold"
                :class="stats.apiLatency <= 100 ? 'text-emerald-400' : stats.apiLatency <= 300 ? 'text-amber-400' : 'text-red-400'"
              >
                {{ stats.apiLatency }} ms
              </p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag :severity="stats.apiLatency <= 100 ? 'success' : 'warn'" :value="stats.apiLatency <= 100 ? '極速' : '正常'" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <i class="pi pi-bolt text-cyan-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Security Level -->
      <Card class="bg-gradient-to-br from-emerald-900/30 to-surface-800/50 border border-emerald-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-emerald-300 text-sm mb-1 font-medium">安全防禦等級</p>
              <p class="text-xl font-bold text-emerald-400">{{ stats.securityLevel }}</p>
              <div class="flex items-center gap-1 mt-2 text-emerald-400 text-sm">
                <i class="pi pi-shield"></i>
                <span>全部防護啟用</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <i class="pi pi-lock text-emerald-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- System Errors -->
      <Card class="bg-gradient-to-br from-red-900/30 to-surface-800/50 border border-red-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-red-300 text-sm mb-1 font-medium">系統錯誤警報</p>
              <p class="text-2xl font-bold text-red-400">{{ stats.systemErrors }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Badge :value="stats.criticalErrors" severity="danger" />
                <span class="text-surface-400">嚴重</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center animate-pulse">
              <i class="pi pi-exclamation-triangle text-red-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Feature Toggles Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white">
          <i class="pi pi-sliders-h text-violet-400"></i>
          核心功能開關
        </div>
      </template>
      <template #subtitle>
        <span class="text-surface-400">Feature Toggles - 系統功能即時控制</span>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div 
            v-for="toggle in featureToggles" 
            :key="toggle.key"
            class="flex items-center justify-between p-4 bg-surface-700/30 rounded-lg border border-surface-600/50"
          >
            <div class="flex items-center gap-3">
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="toggle.enabled ? 'bg-emerald-500/20' : 'bg-surface-600/50'"
              >
                <i 
                  :class="[toggle.icon, 'text-lg', toggle.enabled ? 'text-emerald-400' : 'text-surface-400']"
                ></i>
              </div>
              <div>
                <p class="text-white font-medium">{{ toggle.name }}</p>
                <p class="text-surface-400 text-xs">{{ toggle.description }}</p>
              </div>
            </div>
            <InputSwitch v-model="toggle.enabled" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Charts & Service Status Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- API Traffic Line Chart -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-line text-blue-400"></i>
            API 流量走勢
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">今日請求量高低峰分析</span>
        </template>
        <template #content>
          <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-72" />
        </template>
      </Card>

      <!-- Third-party Service Status -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-server text-orange-400"></i>
            第三方服務狀態
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">External Services - 外部連線監控</span>
        </template>
        <template #content>
          <DataTable 
            :value="serviceStatus" 
            class="p-datatable-sm"
            :pt="{
              table: { class: 'min-w-full' },
              tbody: { class: 'text-surface-300' }
            }"
          >
            <!-- Service Name -->
            <Column field="name" header="服務名稱">
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <i :class="slotProps.data.icon" class="text-lg"></i>
                  <span class="font-medium text-white">{{ slotProps.data.name }}</span>
                </div>
              </template>
            </Column>

            <!-- Response Time -->
            <Column field="responseTime" header="響應時間">
              <template #body="slotProps">
                <span 
                  class="font-medium"
                  :class="slotProps.data.responseTime ? 'text-surface-300' : 'text-surface-500'"
                >
                  {{ slotProps.data.responseTime || '--' }}
                </span>
              </template>
            </Column>

            <!-- Status -->
            <Column field="status" header="狀態">
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <span 
                    class="w-2.5 h-2.5 rounded-full animate-pulse"
                    :class="slotProps.data.status === 'online' ? 'bg-emerald-400' : 'bg-red-400'"
                  ></span>
                  <Tag 
                    :severity="slotProps.data.status === 'online' ? 'success' : 'danger'" 
                    :value="slotProps.data.status === 'online' ? '正常' : '斷線'"
                  />
                </div>
              </template>
            </Column>

            <!-- Last Check -->
            <Column field="lastCheck" header="上次檢測">
              <template #body="slotProps">
                <span class="text-surface-400 text-sm">{{ slotProps.data.lastCheck }}</span>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Knob from 'primevue/knob'
import InputSwitch from 'primevue/inputswitch'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

// Last update time
const lastUpdate = ref(new Date().toLocaleTimeString('zh-TW', { 
  hour: '2-digit', 
  minute: '2-digit',
  second: '2-digit'
}))

// ========================================
// Health Stats Mock Data
// ========================================
const stats = ref({
  cpuUsage: 42,
  ramUsage: 68,
  apiLatency: 85,
  securityLevel: '最高等級',
  systemErrors: 12,
  criticalErrors: 3
})

// ========================================
// Feature Toggles Mock Data
// ========================================
const featureToggles = ref([
  {
    key: 'registration',
    name: '前台註冊',
    description: '開放新用戶註冊',
    icon: 'pi pi-user-plus',
    enabled: true
  },
  {
    key: 'auto-deposit',
    name: '自動入款',
    description: '自動金流入帳功能',
    icon: 'pi pi-money-bill',
    enabled: true
  },
  {
    key: 'app-download',
    name: 'App 下載',
    description: '顯示 App 下載連結',
    icon: 'pi pi-mobile',
    enabled: true
  },
  {
    key: 'internal-message',
    name: '站內信功能',
    description: '玩家私訊系統',
    icon: 'pi pi-envelope',
    enabled: true
  },
  {
    key: 'live-chat',
    name: '即時客服',
    description: '線上客服對話',
    icon: 'pi pi-comments',
    enabled: false
  },
  {
    key: 'promotion-popup',
    name: '優惠彈窗',
    description: '首頁優惠廣告彈窗',
    icon: 'pi pi-gift',
    enabled: true
  }
])

// ========================================
// API Traffic Line Chart
// ========================================
const generateHourlyTraffic = () => {
  const data = []
  for (let i = 0; i < 24; i++) {
    // Simulate higher traffic during peak hours
    const base = i >= 10 && i <= 22 ? 8000 : 3000
    data.push(Math.floor(Math.random() * 4000) + base)
  }
  return data
}

const hourlyTraffic = generateHourlyTraffic()

const lineChartData = computed(() => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  datasets: [
    {
      label: 'API 請求量',
      data: hourlyTraffic,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 6,
      pointBackgroundColor: '#3b82f6'
    }
  ]
}))

const lineChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: { parsed: { y: number } }) => {
          return `請求量: ${context.parsed.y.toLocaleString()} 次`
        }
      }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      ticks: { color: '#64748b', maxTicksLimit: 12 }
    },
    y: {
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      ticks: {
        color: '#64748b',
        callback: (value: number) => {
          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
          return value
        }
      }
    }
  }
})

// ========================================
// Third-party Service Status
// ========================================
const serviceStatus = ref([
  {
    name: 'SMS 簡訊平台',
    icon: 'pi pi-mobile text-green-400',
    responseTime: '45ms',
    status: 'online',
    lastCheck: '1 分鐘前'
  },
  {
    name: '雲端儲存 (S3)',
    icon: 'pi pi-cloud text-blue-400',
    responseTime: '120ms',
    status: 'online',
    lastCheck: '2 分鐘前'
  },
  {
    name: 'CDN 負載分配',
    icon: 'pi pi-globe text-purple-400',
    responseTime: '28ms',
    status: 'online',
    lastCheck: '30 秒前'
  },
  {
    name: '郵件系統 (SMTP)',
    icon: 'pi pi-envelope text-orange-400',
    responseTime: null,
    status: 'offline',
    lastCheck: '5 分鐘前'
  }
])
</script>

<style scoped>
/* Card styling */
:deep(.p-card .p-card-body) {
  padding: 1rem;
}

:deep(.p-card .p-card-content) {
  padding: 0;
}

/* DataTable dark mode styling */
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: rgba(30, 41, 59, 0.5);
  color: #94a3b8;
  border-color: rgba(71, 85, 105, 0.5);
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: transparent;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-color: rgba(71, 85, 105, 0.3);
  padding: 0.75rem 1rem;
}

/* Knob text styling */
:deep(.p-knob-text) {
  font-weight: 600;
}
</style>
