<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-chart-bar text-blue-400"></i>
      <span class="text-surface-300">儀表板</span>
      <span>></span>
      <span class="text-white font-medium">營運數據</span>
    </div>

    <!-- Page Header with Global Filter -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-dollar text-green-400"></i>
          營運數據
        </h1>
        <p class="text-surface-400 mt-1">Operation Analytics - 直營上架 vs 包網代理雙軌數據</p>
      </div>
      
      <!-- Global Filter Controls -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Date Range Picker -->
        <Calendar 
          v-model="dateRange" 
          selectionMode="range"
          :manualInput="false"
          :showIcon="false"
          placeholder="選擇日期範圍"
          dateFormat="yy/mm/dd"
          class="w-64"
        />
        
        <!-- Currency Dropdown -->
        <Dropdown 
          v-model="selectedCurrency" 
          :options="currencyOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="貨幣單位"
          class="w-32"
        />
        
        <!-- Export Button -->
        <Button 
          icon="pi pi-download" 
          label="匯出報表"
          severity="secondary"
          @click="handleExport"
        />
      </div>
    </div>

    <!-- TabView for Dual Track Data -->
    <TabView>
      <!-- Tab 1: 直營上架數據 (Direct / Store) -->
      <TabPanel value="0">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="pi pi-shopping-cart"></i>
            <span>直營上架數據</span>
          </div>
        </template>
        
        <div class="space-y-6 pt-4">
          <!-- KPI Cards for Direct -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <!-- IAP Total Revenue -->
            <Card class="stat-card">
              <template #content>
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-surface-400 text-sm mb-1">IAP 總營收</p>
                    <p class="text-3xl font-bold text-white mb-2">{{ formatCurrency(directStats.iapRevenue) }}</p>
                    <div class="flex items-center gap-1 text-sm text-green-400">
                      <i class="pi pi-arrow-up text-xs"></i>
                      <span>+12.5%</span>
                      <span class="text-surface-500">vs 昨日</span>
                    </div>
                  </div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/20">
                    <i class="pi pi-wallet text-xl text-green-400"></i>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Order Count -->
            <Card class="stat-card">
              <template #content>
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-surface-400 text-sm mb-1">訂單數</p>
                    <p class="text-3xl font-bold text-white mb-2">{{ formatNumber(directStats.orderCount) }}</p>
                    <div class="flex items-center gap-1 text-sm text-green-400">
                      <i class="pi pi-arrow-up text-xs"></i>
                      <span>+8.3%</span>
                      <span class="text-surface-500">vs 昨日</span>
                    </div>
                  </div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/20">
                    <i class="pi pi-shopping-bag text-xl text-blue-400"></i>
                  </div>
                </div>
              </template>
            </Card>

            <!-- ARPU -->
            <Card class="stat-card">
              <template #content>
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-surface-400 text-sm mb-1">ARPU (客單價)</p>
                    <p class="text-3xl font-bold text-white mb-2">{{ formatCurrency(directStats.arpu) }}</p>
                    <div class="flex items-center gap-1 text-sm text-green-400">
                      <i class="pi pi-arrow-up text-xs"></i>
                      <span>+3.2%</span>
                      <span class="text-surface-500">vs 昨日</span>
                    </div>
                  </div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-purple-500/20">
                    <i class="pi pi-chart-line text-xl text-purple-400"></i>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Refunds (Red Warning) -->
            <Card class="stat-card">
              <template #content>
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-surface-400 text-sm mb-1">惡意退款</p>
                    <p class="text-3xl font-bold text-red-400 mb-2">{{ formatCurrency(directStats.refunds) }}</p>
                    <div class="flex items-center gap-1 text-sm text-red-400">
                      <i class="pi pi-exclamation-triangle text-xs"></i>
                      <span>影響商店權重</span>
                    </div>
                  </div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-red-500/20">
                    <i class="pi pi-times-circle text-xl text-red-400"></i>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <!-- Charts for Direct -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Revenue Trend Line Chart -->
            <Card class="chart-card">
              <template #title>
                <div class="flex items-center gap-2">
                  <span>營收走勢</span>
                  <div class="flex items-center gap-4 text-sm ml-auto">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-green-400"></span>
                      <span class="text-surface-400">IAP 營收</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-blue-400"></span>
                      <span class="text-surface-400">活躍人數</span>
                    </div>
                  </div>
                </div>
              </template>
              <template #content>
                <Chart type="line" :data="directRevenueChartData" :options="dualAxisChartOptions" class="h-72" />
              </template>
            </Card>

            <!-- Top Products Bar Chart -->
            <Card class="chart-card">
              <template #title>
                <span>商品熱銷榜 (Top 5)</span>
              </template>
              <template #content>
                <Chart type="bar" :data="topProductsChartData" :options="horizontalBarOptions" class="h-72" />
              </template>
            </Card>
          </div>
        </div>
      </TabPanel>

      <!-- Tab 2: 包網代理數據 (Network / Agent) -->
      <TabPanel value="1">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="pi pi-sitemap"></i>
            <span>包網代理數據</span>
          </div>
        </template>
        
        <div class="space-y-6 pt-4">
          <!-- KPI Cards for Network -->
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <!-- Total Bet -->
            <Card class="stat-card">
              <template #content>
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-surface-400 text-sm mb-1">總投注流水</p>
                    <p class="text-3xl font-bold text-white mb-2">{{ formatCurrency(networkStats.totalBet) }}</p>
                    <div class="flex items-center gap-1 text-sm text-green-400">
                      <i class="pi pi-arrow-up text-xs"></i>
                      <span>+18.7%</span>
                      <span class="text-surface-500">vs 昨日</span>
                    </div>
                  </div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/20">
                    <i class="pi pi-bolt text-xl text-blue-400"></i>
                  </div>
                </div>
              </template>
            </Card>

            <!-- GGR -->
            <Card class="stat-card">
              <template #content>
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-surface-400 text-sm mb-1">總殺數 (GGR)</p>
                    <p class="text-3xl font-bold text-green-400 mb-2">{{ formatCurrency(networkStats.ggr) }}</p>
                    <div class="flex items-center gap-1 text-sm text-surface-400">
                      <span>投注 - 派彩</span>
                    </div>
                  </div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/20">
                    <i class="pi pi-money-bill text-xl text-green-400"></i>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Commission -->
            <Card class="stat-card">
              <template #content>
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-surface-400 text-sm mb-1">佣金支出</p>
                    <p class="text-3xl font-bold text-orange-400 mb-2">{{ formatCurrency(networkStats.commission) }}</p>
                    <div class="flex items-center gap-1 text-sm text-surface-400">
                      <span>預估發放</span>
                    </div>
                  </div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500/20">
                    <i class="pi pi-percentage text-xl text-orange-400"></i>
                  </div>
                </div>
              </template>
            </Card>

            <!-- NGR -->
            <Card class="stat-card">
              <template #content>
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-surface-400 text-sm mb-1">淨利 (NGR)</p>
                    <p class="text-3xl font-bold text-cyan-400 mb-2">{{ formatCurrency(networkStats.ngr) }}</p>
                    <div class="flex items-center gap-1 text-sm text-surface-400">
                      <span>GGR - 佣金</span>
                    </div>
                  </div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-cyan-500/20">
                    <i class="pi pi-chart-pie text-xl text-cyan-400"></i>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <!-- Charts and Table for Network -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Bet vs Payout Bar Chart -->
            <Card class="chart-card">
              <template #title>
                <div class="flex items-center gap-2">
                  <span>盈虧分析</span>
                  <div class="flex items-center gap-4 text-sm ml-auto">
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-blue-400"></span>
                      <span class="text-surface-400">投注</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="w-3 h-3 rounded-full bg-red-400"></span>
                      <span class="text-surface-400">派彩</span>
                    </div>
                  </div>
                </div>
              </template>
              <template #content>
                <Chart type="bar" :data="betPayoutChartData" :options="groupedBarOptions" class="h-72" />
              </template>
            </Card>

            <!-- Agent Contribution Pie Chart -->
            <Card class="chart-card">
              <template #title>
                <span>代理貢獻佔比 (Top 5)</span>
              </template>
              <template #content>
                <div class="flex items-center justify-center">
                  <Chart type="pie" :data="agentPieChartData" :options="pieChartOptions" class="w-72 h-72" />
                </div>
              </template>
            </Card>
          </div>

          <!-- Top Agent Table -->
          <Card class="chart-card">
            <template #title>
              <div class="flex items-center gap-2">
                <i class="pi pi-trophy text-yellow-400"></i>
                <span>Top 代理排行 (今日)</span>
              </div>
            </template>
            <template #content>
              <DataTable 
                :value="topAgentData" 
                :pt="{
                  root: { class: 'border-0' },
                  tableContainer: { class: 'border-0' },
                  thead: { class: 'border-0' },
                  tbody: { class: 'border-0' },
                  row: { class: 'border-0 border-b border-surface-700 last:border-0' }
                }"
                class="compact-table"
              >
                <Column field="rank" header="排名">
                  <template #body="{ data }">
                    <div class="flex items-center gap-2">
                      <span 
                        class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        :class="{
                          'bg-yellow-500/20 text-yellow-400': data.rank === 1,
                          'bg-surface-500/20 text-surface-300': data.rank === 2,
                          'bg-orange-500/20 text-orange-400': data.rank === 3,
                          'bg-surface-700 text-surface-400': data.rank > 3
                        }"
                      >
                        {{ data.rank }}
                      </span>
                    </div>
                  </template>
                </Column>
                <Column field="name" header="代理名稱">
                  <template #body="{ data }">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-user text-surface-400"></i>
                      <span>{{ data.name }}</span>
                    </div>
                  </template>
                </Column>
                <Column field="turnover" header="流水">
                  <template #body="{ data }">
                    <span class="text-blue-400 font-medium">{{ formatCurrency(data.turnover) }}</span>
                  </template>
                </Column>
                <Column field="profit" header="盈虧">
                  <template #body="{ data }">
                    <span :class="data.profit >= 0 ? 'text-green-400' : 'text-red-400'" class="font-medium">
                      {{ data.profit >= 0 ? '+' : '' }}{{ formatCurrency(data.profit) }}
                    </span>
                  </template>
                </Column>
                <Column field="commission" header="佣金">
                  <template #body="{ data }">
                    <span class="text-orange-400 font-medium">{{ formatCurrency(data.commission) }}</span>
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useTheme } from '@/composables/useTheme'

const { chartColors } = useTheme()

// ========================================
// Global Filter State
// ========================================
const dateRange = ref<Date[] | null>([new Date(), new Date()])
const selectedCurrency = ref('TWD')
const currencyOptions = ref([
  { label: 'TWD', value: 'TWD' },
  { label: 'USD', value: 'USD' },
  { label: 'Points', value: 'Points' }
])

const handleExport = () => {
  // TODO: Implement export functionality
  console.log('Exporting report...')
}

// ========================================
// Helper Functions
// ========================================
const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

const formatCurrency = (num: number): string => {
  const prefix = selectedCurrency.value === 'Points' ? '' : '$'
  if (num >= 1000000) {
    return `${prefix}${(num / 1000000).toFixed(2)}M`
  } else if (num >= 1000) {
    return `${prefix}${(num / 1000).toFixed(1)}K`
  }
  return `${prefix}${num.toLocaleString()}`
}

// ========================================
// Mock Data - Direct (IAP) Stats
// ========================================
const directStats = ref({
  iapRevenue: 2850000,
  orderCount: 12450,
  arpu: 228,
  refunds: 45600
})

// ========================================
// Mock Data - Network (Agent) Stats
// ========================================
const networkStats = ref({
  totalBet: 125800000,
  ggr: 8520000,
  commission: 2130000,
  ngr: 6390000
})

// ========================================
// Chart Data - Direct Revenue Trend (Dual Axis)
// ========================================
const directRevenueChartData = computed(() => ({
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [
    {
      label: 'IAP 營收',
      data: [120000, 85000, 180000, 320000, 480000, 650000, 850000],
      fill: true,
      borderColor: 'rgb(74, 222, 128)',
      backgroundColor: 'rgba(74, 222, 128, 0.1)',
      tension: 0.4,
      yAxisID: 'y'
    },
    {
      label: '活躍人數',
      data: [2800, 1500, 4200, 8500, 12000, 15000, 18000],
      fill: false,
      borderColor: 'rgb(96, 165, 250)',
      borderDash: [5, 5],
      tension: 0.4,
      yAxisID: 'y1'
    }
  ]
}))

const dualAxisChartOptions = computed(() => ({
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
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: { color: chartColors.value.gridColor, drawBorder: false },
      ticks: { color: chartColors.value.textColor }
    },
    y: {
      type: 'linear' as const,
      position: 'left' as const,
      grid: { color: chartColors.value.gridColor, drawBorder: false },
      ticks: {
        color: 'rgb(74, 222, 128)',
        callback: (value: number) => `$${(value / 1000).toFixed(0)}K`
      }
    },
    y1: {
      type: 'linear' as const,
      position: 'right' as const,
      grid: { display: false },
      ticks: {
        color: 'rgb(96, 165, 250)',
        callback: (value: number) => `${(value / 1000).toFixed(0)}K`
      }
    }
  }
}))

// ========================================
// Chart Data - Top Products (Horizontal Bar)
// ========================================
const topProductsChartData = computed(() => ({
  labels: ['金幣包 1000', '金幣包 500', '金幣包 2000', 'VIP 月卡', '首儲禮包'],
  datasets: [{
    label: '銷量',
    data: [4520, 3850, 2100, 1200, 980],
    backgroundColor: [
      'rgba(74, 222, 128, 0.8)',
      'rgba(96, 165, 250, 0.8)',
      'rgba(251, 191, 36, 0.8)',
      'rgba(167, 139, 250, 0.8)',
      'rgba(248, 113, 113, 0.8)'
    ],
    borderRadius: 4
  }]
}))

const horizontalBarOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: chartColors.value.tooltipBg,
      titleColor: chartColors.value.tooltipTitle,
      bodyColor: chartColors.value.tooltipBody,
      borderColor: chartColors.value.tooltipBorder,
      borderWidth: 1
    }
  },
  scales: {
    x: {
      grid: { color: chartColors.value.gridColor, drawBorder: false },
      ticks: { color: chartColors.value.textColor }
    },
    y: {
      grid: { display: false },
      ticks: { color: chartColors.value.textColor }
    }
  }
}))

// ========================================
// Chart Data - Bet vs Payout (Grouped Bar)
// ========================================
const betPayoutChartData = computed(() => ({
  labels: ['01/06', '01/07', '01/08', '01/09', '01/10', '01/11', '01/12'],
  datasets: [
    {
      label: '投注',
      data: [15200000, 18500000, 16800000, 19200000, 17500000, 20100000, 18000000],
      backgroundColor: 'rgba(96, 165, 250, 0.8)',
      borderRadius: 4
    },
    {
      label: '派彩',
      data: [14100000, 17200000, 15500000, 17800000, 16200000, 18600000, 16700000],
      backgroundColor: 'rgba(248, 113, 113, 0.8)',
      borderRadius: 4
    }
  ]
}))

const groupedBarOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index' as const,
      backgroundColor: chartColors.value.tooltipBg,
      titleColor: chartColors.value.tooltipTitle,
      bodyColor: chartColors.value.tooltipBody,
      borderColor: chartColors.value.tooltipBorder,
      borderWidth: 1,
      callbacks: {
        label: (context: { dataset: { label: string }; raw: number }) => {
          return `${context.dataset.label}: $${(context.raw / 1000000).toFixed(1)}M`
        }
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
        callback: (value: number) => `$${(value / 1000000).toFixed(0)}M`
      }
    }
  }
}))

// ========================================
// Chart Data - Agent Contribution (Pie)
// ========================================
const agentPieChartData = computed(() => ({
  labels: ['代理A線', '代理B線', '代理C線', '代理D線', '其他'],
  datasets: [{
    data: [35, 25, 18, 12, 10],
    backgroundColor: [
      'rgba(96, 165, 250, 0.8)',
      'rgba(74, 222, 128, 0.8)',
      'rgba(251, 191, 36, 0.8)',
      'rgba(167, 139, 250, 0.8)',
      'rgba(148, 163, 184, 0.5)'
    ],
    borderWidth: 0,
    hoverOffset: 8
  }]
}))

const pieChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { color: chartColors.value.legendColor, padding: 12 }
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
  }
}))

// ========================================
// Mock Data - Top Agent Table
// ========================================
const topAgentData = ref([
  { rank: 1, name: 'Agent_TW_001', turnover: 28500000, profit: 1850000, commission: 462500 },
  { rank: 2, name: 'Agent_HK_003', turnover: 22100000, profit: 1520000, commission: 380000 },
  { rank: 3, name: 'Agent_MY_008', turnover: 18600000, profit: 1280000, commission: 320000 },
  { rank: 4, name: 'Agent_SG_012', turnover: 15200000, profit: 980000, commission: 245000 },
  { rank: 5, name: 'Agent_TH_005', turnover: 12800000, profit: 850000, commission: 212500 }
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
