<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-th-large text-blue-400"></i>
      <span class="text-surface-300">遊戲管理</span>
      <span>></span>
      <span class="text-white font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-play-circle text-green-400"></i>
          遊戲管理總覽
        </h1>
        <p class="text-surface-400 mt-1">Game Overview - 遊戲表現監控與供應商狀態追蹤</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Game Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Today Total Bets -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">今日總投注額</p>
              <p class="text-3xl font-bold text-white">${{ formatNumber(stats.totalBets) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-emerald-400">
                <i class="pi pi-arrow-up"></i>
                <span>+{{ stats.betsTrend }}% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-credit-card text-blue-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Today Payout -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">今日總派彩</p>
              <p class="text-3xl font-bold text-white">${{ formatNumber(stats.totalPayout) }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm text-surface-400">
                <span>投注比: {{ stats.payoutRatio }}%</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <i class="pi pi-money-bill text-cyan-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Average Hold % -->
      <Card class="bg-gradient-to-br from-amber-900/30 to-surface-800/50 border border-amber-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-amber-300 text-sm mb-1 font-medium">平均殺率 (Hold %)</p>
              <p class="text-3xl font-bold text-amber-400">{{ stats.holdPercent }}%</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag severity="warn" :value="`目標: ${stats.holdTarget}%`" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <i class="pi pi-percentage text-amber-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Gaming Now -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1 flex items-center gap-2">
                在線玩家
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </p>
              <p class="text-3xl font-bold text-green-400">{{ formatNumber(stats.gamingNow) }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm text-surface-400">
                <span>峰值: {{ formatNumber(stats.peakPlayers) }}</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-users text-green-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Game Revenue Distribution - Doughnut Chart -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-pie text-purple-400"></i>
            遊戲盈虧佔比
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">真人/電子/體育/彩票/捕魚</span>
        </template>
        <template #content>
          <Chart type="doughnut" :data="revenueChartData" :options="doughnutOptions" class="h-64" />
        </template>
      </Card>

      <!-- 24h Betting Trend - Line Chart -->
      <Card class="xl:col-span-2 bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-line text-cyan-400"></i>
            24 小時投注走勢
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">各時段投注總額波動</span>
        </template>
        <template #content>
          <Chart type="line" :data="bettingTrendData" :options="lineChartOptions" class="h-64" />
        </template>
      </Card>
    </div>

    <!-- Provider Monitor -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white">
          <i class="pi pi-server text-blue-400"></i>
          遊戲供應商監控
        </div>
      </template>
      <template #subtitle>
        <span class="text-surface-400">即時狀態與連線品質追蹤</span>
      </template>
      <template #content>
        <DataTable 
          :value="providers" 
          stripedRows
          class="p-datatable-sm"
          :pt="{
            table: { class: 'min-w-full' },
            tbody: { class: 'text-surface-300' }
          }"
        >
          <Column field="name" header="供應商名稱" style="min-width: 150px">
            <template #body="slotProps">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded bg-surface-700 flex items-center justify-center">
                  <i :class="['pi', slotProps.data.icon, 'text-surface-300']"></i>
                </div>
                <span class="text-white font-medium">{{ slotProps.data.name }}</span>
              </div>
            </template>
          </Column>
          <Column field="category" header="類型" style="min-width: 100px">
            <template #body="slotProps">
              <Tag :severity="getCategorySeverity(slotProps.data.category)" :value="slotProps.data.category" />
            </template>
          </Column>
          <Column field="status" header="當前狀態" style="min-width: 120px">
            <template #body="slotProps">
              <Tag 
                :severity="slotProps.data.status === '服務中' ? 'success' : 'warn'" 
                :value="slotProps.data.status"
              >
                <template #icon>
                  <i :class="['pi', slotProps.data.status === '服務中' ? 'pi-check-circle' : 'pi-wrench', 'mr-1']"></i>
                </template>
              </Tag>
            </template>
          </Column>
          <Column field="todayBets" header="今日投注量" style="min-width: 140px">
            <template #body="slotProps">
              <span class="text-emerald-400 font-medium">${{ formatNumber(slotProps.data.todayBets) }}</span>
            </template>
          </Column>
          <Column field="latency" header="連線品質" style="min-width: 180px">
            <template #body="slotProps">
              <div class="flex items-center gap-3">
                <ProgressBar 
                  :value="getLatencyProgress(slotProps.data.latency)" 
                  :showValue="false"
                  :class="['w-20 h-2', getLatencyColor(slotProps.data.latency)]"
                />
                <span :class="['text-sm font-mono', getLatencyTextColor(slotProps.data.latency)]">
                  {{ slotProps.data.latency }}ms
                </span>
              </div>
            </template>
          </Column>
          <Column field="uptime" header="可用率" style="min-width: 100px">
            <template #body="slotProps">
              <span class="text-surface-300">{{ slotProps.data.uptime }}%</span>
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
import ProgressBar from 'primevue/progressbar'

// Format number with thousand separators
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

// Last update time
const lastUpdate = ref(new Date().toLocaleTimeString('zh-TW', { 
  hour: '2-digit', 
  minute: '2-digit',
  second: '2-digit'
}))

// Game Stats Mock Data
const stats = ref({
  totalBets: 18567890,
  betsTrend: 12.3,
  totalPayout: 17234567,
  payoutRatio: 92.8,
  holdPercent: 7.2,
  holdTarget: 8.0,
  gamingNow: 4521,
  peakPlayers: 6832
})

// Revenue Distribution Chart Data
const revenueChartData = computed(() => ({
  labels: ['真人', '電子', '體育', '彩票', '捕魚'],
  datasets: [
    {
      data: [35, 28, 18, 12, 7],
      backgroundColor: [
        '#ef4444', // Red - Live
        '#8b5cf6', // Purple - Slots
        '#22c55e', // Green - Sports
        '#f97316', // Orange - Lottery
        '#06b6d4'  // Cyan - Fishing
      ],
      borderWidth: 0
    }
  ]
}))

const doughnutOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#94a3b8',
        usePointStyle: true,
        padding: 14,
        font: { size: 12 }
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
      callbacks: {
        label: (context: { label: string; parsed: number }) => {
          return `${context.label}: ${context.parsed}%`
        }
      }
    }
  },
  cutout: '55%'
})

// 24h Betting Trend Chart Data
const generateHourlyBettingData = () => {
  const data = []
  // Simulate betting patterns: low early morning, peak evening
  const pattern = [120, 80, 50, 40, 60, 100, 180, 320, 480, 520, 500, 450, 420, 480, 550, 620, 780, 920, 950, 880, 720, 550, 380, 220]
  for (let i = 0; i < 24; i++) {
    data.push(((pattern[i] || 0) + Math.floor(Math.random() * 50)) * 1000)
  }
  return data
}

const bettingTrendData = computed(() => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  datasets: [
    {
      label: '投注額 (千)',
      data: generateHourlyBettingData(),
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointHoverRadius: 6,
      pointBackgroundColor: '#8b5cf6'
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
          return `投注額: $${(context.parsed.y / 1000).toFixed(0)}K`
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
      grid: {
        color: 'rgba(148, 163, 184, 0.1)'
      },
      ticks: {
        color: '#64748b',
        callback: (value: number) => `$${(value / 1000).toFixed(0)}K`
      },
      beginAtZero: true
    }
  }
})

// Provider Mock Data
const providers = ref([
  { name: 'Evolution', icon: 'pi-video', category: '真人', status: '服務中', todayBets: 5234567, latency: 28, uptime: 99.9 },
  { name: 'PG Soft', icon: 'pi-box', category: '電子', status: '服務中', todayBets: 3456789, latency: 35, uptime: 99.8 },
  { name: 'JILI', icon: 'pi-star', category: '電子', status: '服務中', todayBets: 2876543, latency: 42, uptime: 99.7 },
  { name: 'Pragmatic Play', icon: 'pi-bolt', category: '電子', status: '服務中', todayBets: 2345678, latency: 38, uptime: 99.9 },
  { name: 'SA Gaming', icon: 'pi-desktop', category: '真人', status: '服務中', todayBets: 1987654, latency: 45, uptime: 99.6 },
  { name: 'Spadegaming', icon: 'pi-heart', category: '捕魚', status: '維護中', todayBets: 876543, latency: 120, uptime: 98.5 },
  { name: 'CMD368', icon: 'pi-globe', category: '體育', status: '服務中', todayBets: 1654321, latency: 52, uptime: 99.4 },
  { name: 'SABA Sports', icon: 'pi-flag', category: '體育', status: '服務中', todayBets: 1234567, latency: 48, uptime: 99.5 }
])

// Category severity helper
const getCategorySeverity = (category: string) => {
  const map: Record<string, string> = {
    '真人': 'danger',
    '電子': 'info',
    '體育': 'success',
    '彩票': 'warn',
    '捕魚': 'secondary'
  }
  return map[category] || 'secondary'
}

// Latency helpers
const getLatencyProgress = (latency: number) => {
  // Inverse: lower latency = higher progress (better)
  return Math.max(0, Math.min(100, 100 - (latency / 1.5)))
}

const getLatencyColor = (latency: number) => {
  if (latency < 50) return '[&_.p-progressbar-value]:!bg-emerald-500'
  if (latency < 80) return '[&_.p-progressbar-value]:!bg-amber-500'
  return '[&_.p-progressbar-value]:!bg-red-500'
}

const getLatencyTextColor = (latency: number) => {
  if (latency < 50) return 'text-emerald-400'
  if (latency < 80) return 'text-amber-400'
  return 'text-red-400'
}
</script>

<style scoped>
:deep(.p-card .p-card-body) {
  padding: 1rem;
}

:deep(.p-card .p-card-content) {
  padding: 0;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: rgba(30, 41, 59, 0.5);
  color: #94a3b8;
  border-color: rgba(71, 85, 105, 0.5);
  padding: 0.75rem 1rem;
  font-weight: 600;
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

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: rgba(59, 130, 246, 0.1);
}

:deep(.p-progressbar) {
  background-color: rgba(71, 85, 105, 0.5);
  border-radius: 9999px;
}

:deep(.p-progressbar .p-progressbar-value) {
  border-radius: 9999px;
}
</style>
