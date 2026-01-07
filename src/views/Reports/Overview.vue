<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-chart-line text-blue-400"></i>
      <span class="text-surface-300">報表管理</span>
      <span>></span>
      <span class="text-white font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-chart-line text-blue-400"></i>
          報表管理總覽
        </h1>
        <p class="text-surface-400 mt-1">Reports Overview - 全站損益分析與營收決策看板</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Revenue Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- GGR (Today's Gross Gaming Revenue) -->
      <Card 
        class="border"
        :class="stats.ggr >= 0 
          ? 'bg-surface-800/50 border-surface-700' 
          : 'bg-gradient-to-br from-red-900/30 to-surface-800/50 border-red-600/30'"
      >
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">今日總盈虧 (GGR)</p>
              <p 
                class="text-3xl font-bold"
                :class="stats.ggr >= 0 ? 'text-emerald-400' : 'text-red-400'"
              >
                {{ stats.ggr >= 0 ? '+' : '' }}{{ formatCurrency(stats.ggr) }}
              </p>
              <div class="flex items-center gap-1 mt-2 text-sm" :class="stats.ggrChange >= 0 ? 'text-emerald-400' : 'text-red-400'">
                <i :class="stats.ggrChange >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                <span>{{ stats.ggrChange >= 0 ? '+' : '' }}{{ stats.ggrChange }}% vs 昨日</span>
              </div>
            </div>
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="stats.ggr >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'"
            >
              <i 
                class="pi text-xl"
                :class="stats.ggr >= 0 ? 'pi-trending-up text-emerald-400' : 'pi-trending-down text-red-400'"
              ></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- NGR (Net Gaming Revenue) -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">淨利潤 (NGR)</p>
              <p 
                class="text-2xl font-bold"
                :class="stats.ngr >= 0 ? 'text-emerald-400' : 'text-red-400'"
              >
                {{ stats.ngr >= 0 ? '+' : '' }}{{ formatCurrency(stats.ngr) }}
              </p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag severity="info" :value="`成本扣減 ${formatCurrency(stats.costDeduction)}`" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-wallet text-blue-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- ARPU (Average Revenue Per User) -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">ARPU (人均貢獻)</p>
              <p class="text-2xl font-bold text-white">{{ formatCurrency(stats.arpu) }}</p>
              <div class="flex items-center gap-1 mt-2 text-purple-400 text-sm">
                <i class="pi pi-users"></i>
                <span>活躍玩家 {{ stats.activeUsers.toLocaleString() }} 人</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-user text-purple-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Kill Rate -->
      <Card class="bg-gradient-to-br from-amber-900/30 to-surface-800/50 border border-amber-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-amber-300 text-sm mb-1 font-medium">全站殺率</p>
              <p class="text-3xl font-bold text-amber-400">{{ stats.killRate }}%</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag :severity="stats.killRate >= 3 ? 'success' : 'warn'" :value="stats.killRate >= 3 ? '正常範圍' : '偏低警示'" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <i class="pi pi-percentage text-amber-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Comprehensive Profit Trend (Area Chart) -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-line text-emerald-400"></i>
            綜合損益趨勢
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">24小時入金、出金、淨獲利波動</span>
        </template>
        <template #content>
          <Chart type="line" :data="areaChartData" :options="areaChartOptions" class="h-72" />
        </template>
      </Card>

      <!-- Product Performance (Horizontal Bar) -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-bar text-cyan-400"></i>
            產品線盈利排行
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">各遊戲類別盈虧數值</span>
        </template>
        <template #content>
          <Chart type="bar" :data="barChartData" :options="barChartOptions" class="h-72" />
        </template>
      </Card>
    </div>

    <!-- Anomaly Data Table -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white">
          <i class="pi pi-exclamation-triangle text-red-400"></i>
          最近數據警示
        </div>
      </template>
      <template #subtitle>
        <span class="text-surface-400">Anomaly Alerts - 異常數據監控與預警</span>
      </template>
      <template #content>
        <DataTable 
          :value="anomalyList" 
          stripedRows
          class="p-datatable-sm"
          :pt="{
            table: { class: 'min-w-full' },
            tbody: { class: 'text-surface-300' }
          }"
        >
          <!-- Item Name -->
          <Column field="itemName" header="項目名稱">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i :class="slotProps.data.icon" class="text-lg"></i>
                <span class="font-medium text-white">{{ slotProps.data.itemName }}</span>
              </div>
            </template>
          </Column>

          <!-- Anomaly Type -->
          <Column field="anomalyType" header="異常類型">
            <template #body="slotProps">
              <span class="text-surface-300">{{ slotProps.data.anomalyType }}</span>
            </template>
          </Column>

          <!-- Value -->
          <Column field="value" header="數值">
            <template #body="slotProps">
              <span 
                class="font-medium"
                :class="slotProps.data.isNegative ? 'text-red-400' : 'text-amber-400'"
              >
                {{ slotProps.data.value }}
              </span>
            </template>
          </Column>

          <!-- Time -->
          <Column field="time" header="時間">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i class="pi pi-clock text-surface-500"></i>
                <span class="text-surface-400">{{ slotProps.data.time }}</span>
              </div>
            </template>
          </Column>

          <!-- Severity -->
          <Column field="severity" header="嚴重程度">
            <template #body="slotProps">
              <Tag 
                :severity="getSeverityColor(slotProps.data.severity)" 
                :value="slotProps.data.severityText"
              >
                <template #icon>
                  <i :class="getSeverityIcon(slotProps.data.severity)" class="mr-1"></i>
                </template>
              </Tag>
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
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useTheme } from '@/composables/useTheme'

const { chartColors } = useTheme()

// Currency formatter
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Last update time
const lastUpdate = ref(new Date().toLocaleTimeString('zh-TW', { 
  hour: '2-digit', 
  minute: '2-digit',
  second: '2-digit'
}))

// ========================================
// Revenue Stats Mock Data
// ========================================
const stats = ref({
  ggr: 1856320,
  ggrChange: 15.8,
  ngr: 1425680,
  costDeduction: 430640,
  arpu: 128.50,
  activeUsers: 14452,
  killRate: 4.2
})

// ========================================
// Area Chart - Comprehensive Profit Trend
// ========================================
const generateHourlyData = () => {
  const deposits = []
  const withdrawals = []
  const netProfit = []
  for (let i = 0; i < 24; i++) {
    const deposit = Math.floor(Math.random() * 200000) + 100000
    const withdrawal = Math.floor(Math.random() * 150000) + 50000
    deposits.push(deposit)
    withdrawals.push(withdrawal)
    netProfit.push(deposit - withdrawal)
  }
  return { deposits, withdrawals, netProfit }
}

const hourlyData = generateHourlyData()

const areaChartData = computed(() => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  datasets: [
    {
      label: '入金',
      data: hourlyData.deposits,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6
    },
    {
      label: '出金',
      data: hourlyData.withdrawals,
      borderColor: '#f97316',
      backgroundColor: 'rgba(249, 115, 22, 0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6
    },
    {
      label: '淨獲利',
      data: hourlyData.netProfit,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6
    }
  ]
}))

const areaChartOptions = computed(() => ({
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
      grid: { color: chartColors.value.gridColor },
      ticks: { color: chartColors.value.textColorLight, maxTicksLimit: 12 }
    },
    y: {
      grid: { color: chartColors.value.gridColor },
      ticks: {
        color: chartColors.value.textColorLight,
        callback: (value: number) => {
          if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
          if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
          return `$${value}`
        }
      }
    }
  }
}))

// ========================================
// Horizontal Bar Chart - Product Performance
// ========================================
const barChartData = computed(() => ({
  labels: ['真人娛樂', '電子遊戲', '體育投注', '彩票遊戲'],
  datasets: [
    {
      label: '盈虧金額',
      data: [856000, 623000, 245000, 132320],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(249, 115, 22, 0.8)'
      ],
      borderColor: [
        '#10b981',
        '#3b82f6',
        '#a855f7',
        '#f97316'
      ],
      borderWidth: 1,
      borderRadius: 4,
      barThickness: 28
    }
  ]
}))

const barChartOptions = computed(() => ({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: chartColors.value.tooltipBg,
      titleColor: chartColors.value.tooltipTitle,
      bodyColor: chartColors.value.tooltipBody,
      borderColor: chartColors.value.tooltipBorder,
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: { parsed: { x: number } }) => {
          return `盈虧: ${formatCurrency(context.parsed.x)}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: { color: chartColors.value.gridColor },
      ticks: {
        color: chartColors.value.textColorLight,
        callback: (value: number) => {
          if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
          if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
          return `$${value}`
        }
      }
    },
    y: {
      grid: { display: false },
      ticks: { color: chartColors.value.textColorWhite, font: { weight: 500 } }
    }
  }
}))

// ========================================
// Anomaly Data Table
// ========================================
const anomalyList = ref([
  {
    itemName: '真人百家樂 A廳',
    icon: 'pi pi-video text-purple-400',
    anomalyType: '賠付過高',
    value: '-$125,800',
    isNegative: true,
    time: '10 分鐘前',
    severity: 'high',
    severityText: '高風險'
  },
  {
    itemName: 'USDT 入金通道',
    icon: 'pi pi-bitcoin text-emerald-400',
    anomalyType: '成功率下降',
    value: '76.5%',
    isNegative: false,
    time: '25 分鐘前',
    severity: 'medium',
    severityText: '中風險'
  },
  {
    itemName: '電子老虎機 #2387',
    icon: 'pi pi-star text-yellow-400',
    anomalyType: 'RTP 異常',
    value: '98.2%',
    isNegative: false,
    time: '1 小時前',
    severity: 'medium',
    severityText: '中風險'
  },
  {
    itemName: '體育投注 - 足球',
    icon: 'pi pi-flag text-green-400',
    anomalyType: '單邊注過重',
    value: '$89,500',
    isNegative: false,
    time: '2 小時前',
    severity: 'low',
    severityText: '低風險'
  },
  {
    itemName: 'VIP 會員 #8892',
    icon: 'pi pi-user text-blue-400',
    anomalyType: '大額提款申請',
    value: '$250,000',
    isNegative: false,
    time: '3 小時前',
    severity: 'high',
    severityText: '高風險'
  }
])

// Helper functions
const getSeverityColor = (severity: string) => {
  const map: Record<string, string> = {
    high: 'danger',
    medium: 'warn',
    low: 'info'
  }
  return map[severity] || 'info'
}

const getSeverityIcon = (severity: string) => {
  const map: Record<string, string> = {
    high: 'pi pi-exclamation-circle',
    medium: 'pi pi-exclamation-triangle',
    low: 'pi pi-info-circle'
  }
  return map[severity] || 'pi pi-info-circle'
}
</script>

<style scoped>
/* Card styling for dark mode */
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

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
  background-color: rgba(30, 41, 59, 0.3);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-color: rgba(71, 85, 105, 0.3);
  padding: 0.75rem 1rem;
}
</style>
