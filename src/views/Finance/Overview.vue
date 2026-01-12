<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-wallet text-emerald-500 dark:text-emerald-400"></i>
      <span class="text-surface-500 dark:text-surface-300">財務管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-surface-900 dark:text-white flex items-center gap-3">
          <i class="pi pi-chart-line text-emerald-500 dark:text-emerald-400"></i>
          財務管理總覽
        </h1>
        <p class="text-surface-500 dark:text-surface-400 mt-1">Financial Overview - 即時監控平台財務數據與交易狀態</p>
      </div>
      <div class="flex items-center gap-2 text-surface-500 dark:text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Today Deposit -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">今日總入金</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(stats.todayDeposit) }}</p>
              <div class="flex items-center gap-1 mt-2 text-emerald-500 dark:text-emerald-400 text-sm">
                <i class="pi pi-arrow-up"></i>
                <span>+{{ stats.depositGrowth }}% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
              <i class="pi pi-download text-emerald-500 dark:text-emerald-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Today Withdrawal -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">今日總出金</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(stats.todayWithdrawal) }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag severity="success" :value="`成功率 ${stats.withdrawalSuccessRate}%`" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-upload text-orange-500 dark:text-orange-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Net Profit (GGR) -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">淨獲利 (GGR)</p>
              <p class="text-2xl font-bold text-emerald-500 dark:text-emerald-400">{{ formatCurrency(stats.netProfit) }}</p>
              <div class="flex items-center gap-1 mt-2 text-surface-500 dark:text-surface-400 text-sm">
                <i class="pi pi-percentage"></i>
                <span>毛利率 {{ stats.marginRate }}%</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-wallet text-blue-500 dark:text-blue-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Pending Amount -->
      <Card class="bg-gradient-to-br from-amber-900/30 to-surface-800/50 border border-amber-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-amber-300 text-sm mb-1 font-medium">待審核總額</p>
              <p class="text-2xl font-bold text-amber-400">{{ formatCurrency(stats.pendingAmount) }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Badge :value="stats.pendingCount" severity="warn" />
                <span class="text-surface-400">筆待處理</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center animate-pulse">
              <i class="pi pi-exclamation-triangle text-amber-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts & Tables Row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Trend Chart -->
      <Card class="xl:col-span-2 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-chart-line text-blue-500 dark:text-blue-400"></i>
            今日存提款趨勢
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-500 dark:text-surface-400">24小時即時數據</span>
        </template>
        <template #content>
          <Chart type="line" :data="chartData" :options="chartOptions" class="h-72" />
        </template>
      </Card>

      <!-- Risk Alert Timeline -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-shield text-red-500 dark:text-red-400"></i>
            風控預警
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-500 dark:text-surface-400">大額提款審核</span>
        </template>
        <template #content>
          <Timeline :value="riskAlerts" class="custom-timeline">
            <template #marker="slotProps">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center"
                :class="getAlertMarkerClass(slotProps.item.severity)"
              >
                <i class="pi pi-exclamation text-sm"></i>
              </div>
            </template>
            <template #content="slotProps">
              <div class="bg-surface-100 dark:bg-surface-700/50 rounded-lg p-3 mb-3">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-surface-900 dark:text-white font-medium">{{ slotProps.item.member }}</span>
                  <Tag 
                    :severity="slotProps.item.status === 'pending' ? 'warn' : 'info'" 
                    :value="slotProps.item.statusText" 
                  />
                </div>
                <p class="text-lg font-bold text-red-500 dark:text-red-400">{{ formatCurrency(slotProps.item.amount) }}</p>
                <p class="text-surface-500 dark:text-surface-400 text-xs mt-1">{{ slotProps.item.time }}</p>
              </div>
            </template>
          </Timeline>
        </template>
      </Card>
    </div>

    <!-- Payment Channel Monitor -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white">
          <i class="pi pi-server text-purple-500 dark:text-purple-400"></i>
          支付通道監控
        </div>
      </template>
      <template #subtitle>
        <span class="text-surface-500 dark:text-surface-400">各通道即時狀態與成功率</span>
      </template>
      <template #content>
        <DataTable 
          :value="paymentChannels" 
          stripedRows
          class="p-datatable-sm"
          :pt="{
            table: { class: 'min-w-full' },
            tbody: { class: 'text-surface-700 dark:text-surface-300' }
          }"
        >
          <Column field="name" header="通道名稱">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i :class="slotProps.data.icon" class="text-lg"></i>
                <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.name }}</span>
              </div>
            </template>
          </Column>
          <Column field="status" header="狀態">
            <template #body="slotProps">
              <Tag 
                :severity="getChannelStatusSeverity(slotProps.data.status)" 
                :value="slotProps.data.statusText"
              >
                <template #icon>
                  <i :class="getChannelStatusIcon(slotProps.data.status)" class="mr-1"></i>
                </template>
              </Tag>
            </template>
          </Column>
          <Column field="avgTime" header="平均到帳時間">
            <template #body="slotProps">
              <span class="text-surface-300">{{ slotProps.data.avgTime }}</span>
            </template>
          </Column>
          <Column field="successRate" header="成功率" style="min-width: 200px">
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
          <Column field="todayVolume" header="今日交易量">
            <template #body="slotProps">
              <span class="text-surface-500 dark:text-surface-300">{{ formatCurrency(slotProps.data.todayVolume) }}</span>
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
import Timeline from 'primevue/timeline'
import { useTheme } from '@/composables/useTheme'

const { chartColors } = useTheme()

// Currency formatter with thousand separators
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

// Stats Mock Data
const stats = ref({
  todayDeposit: 2847653.80,
  depositGrowth: 12.5,
  todayWithdrawal: 1523890.45,
  withdrawalSuccessRate: 94.8,
  netProfit: 1323763.35,
  marginRate: 46.5,
  pendingAmount: 489500.00,
  pendingCount: 23
})

// Generate 24-hour mock data for chart
const generateHourlyData = () => {
  const deposits = []
  const withdrawals = []
  for (let i = 0; i < 24; i++) {
    deposits.push(Math.floor(Math.random() * 150000) + 50000)
    withdrawals.push(Math.floor(Math.random() * 100000) + 30000)
  }
  return { deposits, withdrawals }
}

const hourlyData = generateHourlyData()

// Chart Configuration
const chartData = computed(() => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  datasets: [
    {
      label: '入金',
      data: hourlyData.deposits,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6
    },
    {
      label: '出金',
      data: hourlyData.withdrawals,
      borderColor: '#f97316',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        color: chartColors.value.legendColor,
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: chartColors.value.tooltipBg,
      titleColor: chartColors.value.tooltipTitle,
      bodyColor: chartColors.value.tooltipBody,
      borderColor: chartColors.value.tooltipBorder,
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: { dataset: { label: string }; parsed: { y: number } }) => {
          return `${context.dataset.label}: ${formatCurrency(context.parsed.y)}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: chartColors.value.gridColor
      },
      ticks: {
        color: chartColors.value.textColorLight,
        maxTicksLimit: 12
      }
    },
    y: {
      grid: {
        color: chartColors.value.gridColor
      },
      ticks: {
        color: chartColors.value.textColorLight,
        callback: (value: number) => {
          if (value >= 1000) {
            return `$${(value / 1000).toFixed(0)}K`
          }
          return `$${value}`
        }
      }
    }
  }
}))

// Payment Channels Mock Data
const paymentChannels = ref([
  {
    name: 'Alipay 支付寶',
    icon: 'pi pi-wallet text-blue-400',
    status: 'online',
    statusText: '正常運行',
    avgTime: '< 1 分鐘',
    successRate: 98.5,
    todayVolume: 892450.00
  },
  {
    name: 'WeChat Pay 微信',
    icon: 'pi pi-comments text-green-400',
    status: 'online',
    statusText: '正常運行',
    avgTime: '< 2 分鐘',
    successRate: 96.2,
    todayVolume: 756320.00
  },
  {
    name: 'USDT TRC20',
    icon: 'pi pi-bitcoin text-emerald-400',
    status: 'online',
    statusText: '正常運行',
    avgTime: '3-5 分鐘',
    successRate: 99.1,
    todayVolume: 1245680.00
  },
  {
    name: '銀行卡快捷',
    icon: 'pi pi-credit-card text-purple-400',
    status: 'slow',
    statusText: '回應緩慢',
    avgTime: '5-10 分鐘',
    successRate: 87.3,
    todayVolume: 423500.00
  },
  {
    name: 'UnionPay 銀聯',
    icon: 'pi pi-building text-red-400',
    status: 'maintenance',
    statusText: '維護中',
    avgTime: '--',
    successRate: 0,
    todayVolume: 0
  }
])

// Helper functions for channel status
const getChannelStatusSeverity = (status: string) => {
  const map: Record<string, string> = {
    online: 'success',
    slow: 'warn',
    maintenance: 'danger',
    offline: 'danger'
  }
  return map[status] || 'info'
}

const getChannelStatusIcon = (status: string) => {
  const map: Record<string, string> = {
    online: 'pi pi-check-circle',
    slow: 'pi pi-clock',
    maintenance: 'pi pi-wrench',
    offline: 'pi pi-times-circle'
  }
  return map[status] || 'pi pi-info-circle'
}

const getProgressBarColor = (rate: number) => {
  if (rate >= 95) return '!bg-emerald-500'
  if (rate >= 85) return '!bg-amber-500'
  return '!bg-red-500'
}

const getSuccessRateColor = (rate: number) => {
  if (rate >= 95) return 'text-emerald-400'
  if (rate >= 85) return 'text-amber-400'
  return 'text-red-400'
}

// Risk Alerts Mock Data
const riskAlerts = ref([
  {
    member: 'VIP_高雄王先生',
    amount: 280000,
    status: 'pending',
    statusText: '待審核',
    severity: 'high',
    time: '2 分鐘前'
  },
  {
    member: 'Diamond_李董',
    amount: 150000,
    status: 'reviewing',
    statusText: '審核中',
    severity: 'medium',
    time: '15 分鐘前'
  },
  {
    member: 'Gold_張先生',
    amount: 88000,
    status: 'pending',
    statusText: '待審核',
    severity: 'low',
    time: '32 分鐘前'
  }
])

const getAlertMarkerClass = (severity: string) => {
  const map: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-amber-500/20 text-amber-400',
    low: 'bg-blue-500/20 text-blue-400'
  }
  return map[severity] || 'bg-surface-600 text-surface-300'
}
</script>

<style scoped>
/* Custom Timeline styling for dark mode */
:deep(.p-timeline-event-opposite) {
  display: none;
}

:deep(.p-timeline-event-connector) {
  background-color: rgba(148, 163, 184, 0.2);
}

:deep(.p-card .p-card-body) {
  padding: 1rem;
}

:deep(.p-card .p-card-content) {
  padding: 0;
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
}

:deep(.p-progressbar) {
  background-color: rgba(71, 85, 105, 0.5);
  border-radius: 9999px;
}
</style>
