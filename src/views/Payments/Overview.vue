<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-credit-card text-purple-500 dark:text-purple-400"></i>
      <span class="text-surface-500 dark:text-surface-300">金流平台</span>
      <span>></span>
      <span class="text-surface-900 dark:text-white font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
          <i class="pi pi-credit-card text-purple-500 dark:text-purple-400"></i>
          金流平台總覽
        </h1>
        <p class="text-surface-500 dark:text-surface-400 mt-1">Payment Overview - 即時監控金流通道穩定性與轉換率</p>
      </div>
      <div class="flex items-center gap-2 text-surface-500 dark:text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Core Monitoring Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Active Channels -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">運作中通道</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ stats.activeChannels }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag severity="info" :value="`負載 ${stats.loadPercentage}%`" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-server text-blue-500 dark:text-blue-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Deposit Success Rate -->
      <Card 
        class="border"
        :class="stats.depositSuccessRate < 80 
          ? 'bg-gradient-to-br from-red-900/30 to-surface-800/50 border-red-600/30' 
          : 'bg-surface-800/50 border-surface-700'"
      >
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">全站入金成功率</p>
              <p 
                class="text-3xl font-bold"
                :class="stats.depositSuccessRate < 80 ? 'text-red-400' : 'text-emerald-400'"
              >
                {{ stats.depositSuccessRate }}%
              </p>
              <div class="flex items-center gap-1 mt-2 text-sm text-surface-400">
                <i class="pi pi-chart-line"></i>
                <span>較昨日 {{ stats.successRateChange > 0 ? '+' : '' }}{{ stats.successRateChange }}%</span>
              </div>
            </div>
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="stats.depositSuccessRate < 80 ? 'bg-red-500/20' : 'bg-emerald-500/20'"
            >
              <i 
                class="pi text-xl"
                :class="stats.depositSuccessRate < 80 
                  ? 'pi-exclamation-triangle text-red-400' 
                  : 'pi-check-circle text-emerald-400'"
              ></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Today's Processing Fee -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">今日支付手續費</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(stats.todayFee) }}</p>
              <div class="flex items-center gap-1 mt-2 text-orange-500 dark:text-orange-400 text-sm">
                <i class="pi pi-arrow-up"></i>
                <span>+{{ stats.feeGrowth }}% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-percentage text-orange-500 dark:text-orange-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Anomaly Reports -->
      <Card class="bg-gradient-to-br from-amber-900/30 to-surface-800/50 border border-amber-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-amber-300 text-sm mb-1 font-medium">異常回報數</p>
              <p class="text-2xl font-bold text-amber-400">{{ stats.anomalyReports }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Badge :value="stats.pendingAnomalies" severity="warn" />
                <span class="text-surface-400">待處理</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center animate-pulse">
              <i class="pi pi-exclamation-circle text-amber-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Payment Type Distribution (Doughnut) -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-chart-pie text-purple-500 dark:text-purple-400"></i>
            支付類型佔比
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-500 dark:text-surface-400">入金流量分佈分析</span>
        </template>
        <template #content>
          <div class="flex items-center justify-center">
            <Chart type="doughnut" :data="doughnutData" :options="doughnutOptions" class="w-80 h-80" />
          </div>
        </template>
      </Card>

      <!-- Success Rate Trend (Line) -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-chart-line text-blue-500 dark:text-blue-400"></i>
            各時段成功率趨勢
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-500 dark:text-surface-400">24小時成功率波動</span>
        </template>
        <template #content>
          <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-72" />
        </template>
      </Card>
    </div>

    <!-- Gateway List DataTable -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white">
          <i class="pi pi-list text-cyan-500 dark:text-cyan-400"></i>
          商戶通道詳情列表
        </div>
      </template>
      <template #subtitle>
        <span class="text-surface-500 dark:text-surface-400">Gateway List - 各商戶通道即時狀態</span>
      </template>
      <template #content>
        <DataTable 
          :value="gatewayList" 
          stripedRows
          class="p-datatable-sm"
          :pt="{
            table: { class: 'min-w-full' },
            tbody: { class: 'text-surface-700 dark:text-surface-300' }
          }"
        >
          <!-- Merchant Name -->
          <Column field="merchantName" header="商戶名稱">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i :class="slotProps.data.icon" class="text-lg"></i>
                <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.merchantName }}</span>
              </div>
            </template>
          </Column>

          <!-- Channel Type -->
          <Column field="channelType" header="通道類型">
            <template #body="slotProps">
              <Tag 
                :severity="getChannelTypeSeverity(slotProps.data.channelType)" 
                :value="slotProps.data.channelType"
              />
            </template>
          </Column>

          <!-- Success Rate with ProgressBar -->
          <Column field="successRate" header="成功率" style="min-width: 220px">
            <template #body="slotProps">
              <div class="flex items-center gap-3">
                <ProgressBar 
                  :value="slotProps.data.successRate" 
                  :showValue="false"
                  class="flex-1 h-2"
                  :pt="{
                    value: { 
                      class: getProgressBarColor(slotProps.data.successRate)
                    }
                  }"
                />
                <span 
                  class="text-sm font-medium w-12 text-right"
                  :class="getSuccessRateColor(slotProps.data.successRate)"
                >
                  {{ slotProps.data.successRate }}%
                </span>
              </div>
            </template>
          </Column>

          <!-- Status Switch -->
          <Column field="status" header="狀態">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <InputSwitch v-model="slotProps.data.enabled" disabled />
                <span 
                  class="text-sm"
                  :class="slotProps.data.enabled ? 'text-emerald-400' : 'text-surface-500'"
                >
                  {{ slotProps.data.enabled ? '啟用' : '停用' }}
                </span>
              </div>
            </template>
          </Column>

          <!-- Average Time -->
          <Column field="avgTime" header="平均到帳時間">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i class="pi pi-clock text-surface-500 dark:text-surface-400"></i>
                <span class="text-surface-700 dark:text-surface-300">{{ slotProps.data.avgTime }}</span>
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressBar from 'primevue/progressbar'
import InputSwitch from 'primevue/inputswitch'

// Currency formatter
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

// Last update time
const lastUpdate = ref(new Date().toLocaleTimeString('zh-TW', { 
  hour: '2-digit', 
  minute: '2-digit',
  second: '2-digit'
}))

// ========================================
// Core Monitoring Stats Mock Data
// ========================================
const stats = ref({
  activeChannels: 12,
  loadPercentage: 68,
  depositSuccessRate: 87.5,
  successRateChange: 2.3,
  todayFee: 45832.50,
  feeGrowth: 8.7,
  anomalyReports: 7,
  pendingAnomalies: 4
})

// ========================================
// Payment Type Distribution (Doughnut Chart)
// ========================================
const doughnutData = computed(() => ({
  labels: ['USDT', '網銀', '支付寶', '第三方'],
  datasets: [
    {
      data: [35, 28, 22, 15],
      backgroundColor: [
        '#10b981', // USDT - emerald
        '#3b82f6', // 網銀 - blue
        '#06b6d4', // 支付寶 - cyan
        '#8b5cf6'  // 第三方 - purple
      ],
      borderColor: 'rgba(30, 41, 59, 1)',
      borderWidth: 3,
      hoverOffset: 10
    }
  ]
}))

const doughnutOptions = ref({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#94a3b8',
        padding: 20,
        usePointStyle: true,
        font: { size: 12 }
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: { label: string; raw: number }) => {
          return `${context.label}: ${context.raw}%`
        }
      }
    }
  },
  cutout: '60%'
})

// ========================================
// Success Rate Trend (Line Chart) - 24 Hours
// ========================================
const generateHourlySuccessRate = () => {
  const rates = []
  for (let i = 0; i < 24; i++) {
    // Simulate fluctuation between 75% and 98%
    rates.push(Math.floor(Math.random() * 23) + 75)
  }
  return rates
}

const hourlySuccessRates = generateHourlySuccessRate()

const lineChartData = computed(() => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  datasets: [
    {
      label: '成功率',
      data: hourlySuccessRates,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 6,
      pointBackgroundColor: '#10b981'
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
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: { parsed: { y: number } }) => {
          return `成功率: ${context.parsed.y}%`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#64748b',
        maxTicksLimit: 12
      }
    },
    y: {
      min: 50,
      max: 100,
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#64748b',
        callback: (value: number) => `${value}%`
      }
    }
  }
})

// ========================================
// Gateway List Mock Data
// ========================================
const gatewayList = ref([
  {
    merchantName: 'FastPay',
    icon: 'pi pi-bolt text-yellow-400',
    channelType: 'USDT',
    successRate: 98.5,
    enabled: true,
    avgTime: '45s'
  },
  {
    merchantName: 'CryptoTransfer',
    icon: 'pi pi-bitcoin text-emerald-400',
    channelType: 'USDT',
    successRate: 96.2,
    enabled: true,
    avgTime: '1m 20s'
  },
  {
    merchantName: 'BankDirect',
    icon: 'pi pi-building text-blue-400',
    channelType: '網銀',
    successRate: 92.8,
    enabled: true,
    avgTime: '2m 15s'
  },
  {
    merchantName: 'AliPayGateway',
    icon: 'pi pi-wallet text-cyan-400',
    channelType: '支付寶',
    successRate: 89.3,
    enabled: true,
    avgTime: '35s'
  },
  {
    merchantName: 'ThirdPartyPro',
    icon: 'pi pi-link text-purple-400',
    channelType: '第三方',
    successRate: 78.5,
    enabled: false,
    avgTime: '3m 45s'
  },
  {
    merchantName: 'QuickCrypto',
    icon: 'pi pi-send text-green-400',
    channelType: 'USDT',
    successRate: 94.1,
    enabled: true,
    avgTime: '55s'
  },
  {
    merchantName: 'NetBankPlus',
    icon: 'pi pi-credit-card text-indigo-400',
    channelType: '網銀',
    successRate: 85.7,
    enabled: true,
    avgTime: '4m 10s'
  }
])

// ========================================
// Helper Functions
// ========================================
const getChannelTypeSeverity = (type: string) => {
  const map: Record<string, string> = {
    'USDT': 'success',
    '網銀': 'info',
    '支付寶': 'secondary',
    '第三方': 'warn'
  }
  return map[type] || 'info'
}

const getProgressBarColor = (rate: number) => {
  if (rate >= 90) return '!bg-emerald-500'
  if (rate >= 80) return '!bg-amber-500'
  return '!bg-red-500'
}

const getSuccessRateColor = (rate: number) => {
  if (rate >= 90) return 'text-emerald-400'
  if (rate >= 80) return 'text-amber-400'
  return 'text-red-400'
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }

/* Light Mode Striped Rows */
:deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(even)) {
  background-color: #f9fafb !important; /* bg-surface-50 */
}

/* Dark Mode Striped Rows */
:global(.dark) :deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(even)) {
  background-color: rgba(30, 41, 59, 0.5) !important; /* bg-surface-800/50 */
}
</style>
