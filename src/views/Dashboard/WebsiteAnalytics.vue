<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-chart-bar text-blue-400"></i>
      <span class="text-surface-300">儀表板</span>
      <span>></span>
      <span class="text-white font-medium">網站數據</span>
    </div>

    <!-- Page Header with Toolbar -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-chart-line text-blue-400"></i>
          網站數據
        </h1>
        <p class="text-surface-400 mt-1">Website Analytics - 技術運維與流量監控</p>
      </div>
      
      <!-- Toolbar Controls -->
      <div class="flex items-center gap-4">
        <!-- Auto Refresh Toggle -->
        <div class="flex items-center gap-2">
          <label class="text-sm text-surface-300">即時監控</label>
          <InputSwitch v-model="autoRefresh" />
        </div>
        
        <!-- Manual Refresh Button -->
        <Button 
          icon="pi pi-refresh" 
          :loading="isRefreshing"
          @click="handleRefresh"
          severity="secondary"
          rounded
        />
      </div>
    </div>

    <!-- Real-time Stats Cards (Grid cols-4) -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- CCU Card -->
      <Card class="stat-card">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">即時在線 (CCU)</p>
              <p class="text-3xl font-bold text-white mb-2">{{ formatNumber(realtimeStats.ccu.total) }}</p>
              <div class="flex items-center gap-3 text-xs text-surface-400">
                <span><i class="pi pi-apple mr-1"></i>{{ realtimeStats.ccu.ios }}%</span>
                <span><i class="pi pi-android mr-1"></i>{{ realtimeStats.ccu.android }}%</span>
                <span><i class="pi pi-globe mr-1"></i>{{ realtimeStats.ccu.web }}%</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/20">
              <i class="pi pi-users text-xl text-blue-400"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- DAU Card -->
      <Card class="stat-card">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">今日活躍 (DAU)</p>
              <p class="text-3xl font-bold text-white mb-2">{{ formatNumber(realtimeStats.dau.total) }}</p>
              <div class="flex items-center gap-1 text-sm text-green-400">
                <i class="pi pi-arrow-up text-xs"></i>
                <span>{{ realtimeStats.dau.change }}</span>
                <span class="text-surface-500">vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/20">
              <i class="pi pi-user-plus text-xl text-green-400"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- New Registrations Card -->
      <Card class="stat-card">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">今日註冊</p>
              <p class="text-3xl font-bold text-white mb-2">{{ formatNumber(realtimeStats.newUsers.total) }}</p>
              <div 
                class="flex items-center gap-1 text-sm"
                :class="realtimeStats.newUsers.isPositive ? 'text-green-400' : 'text-red-400'"
              >
                <i :class="['pi text-xs', realtimeStats.newUsers.isPositive ? 'pi-arrow-up' : 'pi-arrow-down']"></i>
                <span>{{ realtimeStats.newUsers.change }}</span>
                <span class="text-surface-500">vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/20">
              <i class="pi pi-user-plus text-xl text-purple-400"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- API Latency Card -->
      <Card class="stat-card">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">API 平均延遲</p>
              <p 
                class="text-3xl font-bold mb-2"
                :class="realtimeStats.apiLatency.value > 200 ? 'text-red-400' : 'text-white'"
              >
                {{ realtimeStats.apiLatency.value }}ms
              </p>
              <div class="flex items-center gap-1 text-sm">
                <Tag 
                  :value="realtimeStats.apiLatency.value > 200 ? '警告' : '正常'"
                  :severity="realtimeStats.apiLatency.value > 200 ? 'danger' : 'success'"
                />
              </div>
            </div>
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :class="realtimeStats.apiLatency.value > 200 ? 'bg-red-500/20' : 'bg-cyan-500/20'"
            >
              <i 
                class="pi pi-bolt text-xl"
                :class="realtimeStats.apiLatency.value > 200 ? 'text-red-400' : 'text-cyan-400'"
              ></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Traffic Chart -->
    <Card class="chart-card">
      <template #title>
        <div class="flex items-center justify-between">
          <span>流量走勢圖 - 每小時在線人數</span>
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-blue-400"></span>
              <span class="text-surface-400">今日</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-surface-500"></span>
              <span class="text-surface-400">昨日</span>
            </div>
          </div>
        </div>
      </template>
      <template #content>
        <Chart type="line" :data="trafficChartData" :options="trafficChartOptions" class="h-80" />
      </template>
    </Card>

    <!-- Device & Environment Analysis (Grid cols-2) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Device Distribution (Doughnut) -->
      <Card class="chart-card">
        <template #title>
          <span>裝置分佈</span>
        </template>
        <template #content>
          <div class="flex items-center justify-center">
            <Chart type="doughnut" :data="deviceChartData" :options="doughnutChartOptions" class="w-72 h-72" />
          </div>
        </template>
      </Card>

      <!-- APP Version Distribution (Bar) -->
      <Card class="chart-card">
        <template #title>
          <span>APP 版本分佈</span>
        </template>
        <template #content>
          <Chart type="bar" :data="versionChartData" :options="barChartOptions" class="h-72" />
        </template>
      </Card>
    </div>

    <!-- System Health Table -->
    <Card class="chart-card">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-server text-blue-400"></i>
          <span>系統健康度</span>
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="systemHealthData" 
          :pt="{
            root: { class: 'border-0' },
            tableContainer: { class: 'border-0' },
            header: { class: 'border-0 bg-transparent' },
            thead: { class: 'border-0' },
            tbody: { class: 'border-0' },
            row: { class: 'border-0 border-b border-surface-700 last:border-0' }
          }"
          class="compact-table"
        >
          <Column field="name" header="服務名稱">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <i :class="['pi', data.icon, 'text-surface-400']"></i>
                <span>{{ data.name }}</span>
              </div>
            </template>
          </Column>
          <Column field="status" header="狀態">
            <template #body="{ data }">
              <Tag 
                :value="data.status" 
                :severity="getStatusSeverity(data.status)"
              />
            </template>
          </Column>
          <Column field="responseTime" header="回應時間"></Column>
          <Column field="errorRate" header="錯誤率 (1h)"></Column>
          <Column field="lastCheck" header="最後檢查"></Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Button from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useTheme } from '@/composables/useTheme'

const { chartColors } = useTheme()

// ========================================
// Toolbar State
// ========================================
const autoRefresh = ref(true)
const isRefreshing = ref(false)
let refreshInterval: ReturnType<typeof setInterval> | null = null

const handleRefresh = async () => {
  isRefreshing.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))
  isRefreshing.value = false
}

// Auto refresh logic
onMounted(() => {
  if (autoRefresh.value) {
    refreshInterval = setInterval(() => {
      // Simulate data refresh
    }, 30000) // 30 seconds
  }
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})

// ========================================
// Helper Functions
// ========================================
const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

const getStatusSeverity = (status: string): "success" | "warn" | "danger" | "info" | "secondary" | "contrast" | undefined => {
  switch (status) {
    case '正常': return 'success'
    case '警告': return 'warn'
    case '異常': return 'danger'
    default: return 'info'
  }
}

// ========================================
// Mock Data - Real-time Stats
// ========================================
const realtimeStats = ref({
  ccu: {
    total: 12450,
    ios: 42,
    android: 38,
    web: 20
  },
  dau: {
    total: 85632,
    change: '+8.2%'
  },
  newUsers: {
    total: 1234,
    change: '+12.5%',
    isPositive: true
  },
  apiLatency: {
    value: 85
  }
})

// ========================================
// Mock Data - Traffic Chart (Hourly)
// ========================================
const trafficChartData = computed(() => ({
  labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
           '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
  datasets: [
    {
      label: '今日',
      data: [3200, 2800, 2100, 1500, 1200, 1800, 3500, 5800, 8200, 9500, 10200, 11500, 
             12450, 11800, 10500, 9800, 10200, 11200, 13500, 14200, 13800, 12500, 10200, 7500],
      fill: true,
      borderColor: 'rgb(96, 165, 250)',
      backgroundColor: 'rgba(96, 165, 250, 0.1)',
      tension: 0.4,
      pointBackgroundColor: 'rgb(96, 165, 250)',
      pointBorderColor: 'rgb(96, 165, 250)',
      pointHoverRadius: 6
    },
    {
      label: '昨日',
      data: [3100, 2700, 2000, 1400, 1100, 1700, 3400, 5600, 7800, 9200, 9800, 11000, 
             11800, 11200, 10000, 9500, 9800, 10800, 12800, 13500, 13200, 12000, 9800, 7200],
      fill: false,
      borderColor: 'rgb(148, 163, 184)',
      borderDash: [5, 5],
      tension: 0.4,
      pointBackgroundColor: 'rgb(148, 163, 184)',
      pointBorderColor: 'rgb(148, 163, 184)',
      pointHoverRadius: 6
    }
  ]
}))

const trafficChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
      backgroundColor: chartColors.value.tooltipBg,
      titleColor: chartColors.value.tooltipTitle,
      bodyColor: chartColors.value.tooltipBody,
      borderColor: chartColors.value.tooltipBorder,
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: { dataset: { label: string }; raw: number }) => {
          return `${context.dataset.label}: ${context.raw.toLocaleString()} 人`
        }
      }
    }
  },
  scales: {
    x: {
      grid: { color: chartColors.value.gridColor, drawBorder: false },
      ticks: { color: chartColors.value.textColor, maxTicksLimit: 12 }
    },
    y: {
      grid: { color: chartColors.value.gridColor, drawBorder: false },
      ticks: {
        color: chartColors.value.textColor,
        callback: (value: number) => {
          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
          return value.toString()
        }
      }
    }
  },
  interaction: { mode: 'nearest' as const, axis: 'x' as const, intersect: false }
}))

// ========================================
// Mock Data - Device Distribution (Doughnut)
// ========================================
const deviceChartData = computed(() => ({
  labels: ['iOS', 'Android', 'Web H5', 'PC Web'],
  datasets: [{
    data: [42, 38, 12, 8],
    backgroundColor: [
      'rgba(96, 165, 250, 0.8)',
      'rgba(74, 222, 128, 0.8)',
      'rgba(251, 191, 36, 0.8)',
      'rgba(167, 139, 250, 0.8)'
    ],
    borderColor: [
      'rgb(96, 165, 250)',
      'rgb(74, 222, 128)',
      'rgb(251, 191, 36)',
      'rgb(167, 139, 250)'
    ],
    borderWidth: 2,
    hoverOffset: 8
  }]
}))

const doughnutChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { color: chartColors.value.legendColor, padding: 16 }
    },
    tooltip: {
      backgroundColor: chartColors.value.tooltipBg,
      titleColor: chartColors.value.tooltipTitle,
      bodyColor: chartColors.value.tooltipBody,
      borderColor: chartColors.value.tooltipBorder,
      borderWidth: 1,
      callbacks: {
        label: (context: { label: string; raw: number }) => `${context.label}: ${context.raw}%`
      }
    }
  },
  cutout: '60%'
}))

// ========================================
// Mock Data - APP Version Distribution (Bar)
// ========================================
const versionChartData = computed(() => ({
  labels: ['v1.0.0', 'v1.0.1', 'v1.0.2', 'v1.1.0', 'v1.1.1', 'v1.2.0'],
  datasets: [{
    label: '使用者數',
    data: [1200, 3500, 8200, 15600, 28500, 42500],
    backgroundColor: [
      'rgba(148, 163, 184, 0.6)',
      'rgba(148, 163, 184, 0.6)',
      'rgba(148, 163, 184, 0.6)',
      'rgba(96, 165, 250, 0.6)',
      'rgba(96, 165, 250, 0.8)',
      'rgba(74, 222, 128, 0.8)'
    ],
    borderColor: [
      'rgb(148, 163, 184)',
      'rgb(148, 163, 184)',
      'rgb(148, 163, 184)',
      'rgb(96, 165, 250)',
      'rgb(96, 165, 250)',
      'rgb(74, 222, 128)'
    ],
    borderWidth: 1,
    borderRadius: 4
  }]
}))

const barChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'x' as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: chartColors.value.tooltipBg,
      titleColor: chartColors.value.tooltipTitle,
      bodyColor: chartColors.value.tooltipBody,
      borderColor: chartColors.value.tooltipBorder,
      borderWidth: 1,
      callbacks: {
        label: (context: { raw: number }) => `${context.raw.toLocaleString()} 人`
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: chartColors.value.textColor }
    },
    y: {
      grid: { color: chartColors.value.gridColor, drawBorder: false },
      ticks: {
        color: chartColors.value.textColor,
        callback: (value: number) => {
          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
          return value.toString()
        }
      }
    }
  }
}))

// ========================================
// Mock Data - System Health
// ========================================
const systemHealthData = ref([
  {
    name: '主資料庫',
    icon: 'pi-database',
    status: '正常',
    responseTime: '12ms',
    errorRate: '0.01%',
    lastCheck: '09:41:32'
  },
  {
    name: 'Redis 快取',
    icon: 'pi-bolt',
    status: '正常',
    responseTime: '3ms',
    errorRate: '0.00%',
    lastCheck: '09:41:30'
  },
  {
    name: '簡訊閘道',
    icon: 'pi-mobile',
    status: '警告',
    responseTime: '185ms',
    errorRate: '2.35%',
    lastCheck: '09:41:28'
  },
  {
    name: 'CDN 節點',
    icon: 'pi-globe',
    status: '正常',
    responseTime: '28ms',
    errorRate: '0.05%',
    lastCheck: '09:41:25'
  },
  {
    name: '三方遊戲 API',
    icon: 'pi-play',
    status: '正常',
    responseTime: '95ms',
    errorRate: '0.12%',
    lastCheck: '09:41:20'
  }
])
</script>

<style scoped>
.stat-card :deep(.p-card-body) {
  padding: 1.25rem;
}

.chart-card :deep(.p-card-body) {
  padding: 1.25rem;
}

.chart-card :deep(.p-card-title) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.compact-table :deep(.p-datatable-table) {
  border-collapse: collapse;
}

.compact-table :deep(.p-datatable-tbody > tr) {
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.compact-table :deep(.p-datatable-tbody > tr:last-child) {
  border-bottom: none;
}

.compact-table :deep(.p-datatable-thead > tr > th) {
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: #94a3b8;
}

.compact-table :deep(.p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  border: none;
}
</style>
