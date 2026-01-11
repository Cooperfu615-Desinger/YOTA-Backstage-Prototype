<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-play text-purple-500 dark:text-purple-400"></i>
      <span class="text-surface-500 dark:text-surface-300">遊戲管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">遊戲總覽</span>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Bet Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總投注額</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">${{ kpiData.totalBet.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-green-500">
                <i class="pi pi-arrow-up"></i>
                <span>+12.5% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-wallet text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- GGR Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總損益 (GGR)</p>
              <p class="text-2xl font-bold text-green-500">${{ kpiData.ggr.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-orange-500">
                <i class="pi pi-percentage"></i>
                <span>RTP {{ kpiData.rtp }}%</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-chart-line text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Active Players Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">活躍玩家</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ kpiData.activePlayers.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-blue-500">
                <i class="pi pi-users"></i>
                <span>即時在線</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-user text-purple-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Maintenance Platforms Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">維護中平台</p>
              <p class="text-2xl font-bold text-red-500">{{ kpiData.maintenancePlatforms }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-red-500">
                <i class="pi pi-exclamation-triangle"></i>
                <span>需要關注</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <i class="pi pi-wrench text-red-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Platform Bet Distribution (Pie) -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-chart-pie text-purple-500"></i>
            平台投注佔比
          </div>
        </template>
        <template #content>
          <Chart type="pie" :data="pieChartData" :options="pieChartOptions" class="h-[300px]" />
        </template>
      </Card>

      <!-- Hourly GGR Trend (Bar) -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-chart-bar text-blue-500"></i>
            近 24 小時輸贏走勢
          </div>
        </template>
        <template #content>
          <Chart type="bar" :data="barChartData" :options="barChartOptions" class="h-[300px]" />
        </template>
      </Card>
    </div>

    <!-- Risk Monitor Table -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-exclamation-circle text-red-500"></i>
            今日高額派彩遊戲 TOP 5
            <Tag value="風險監控" severity="danger" />
          </div>
        </div>
      </template>
      <template #content>
        <DataTable :value="riskGames" stripedRows>
          <!-- Game Info Column -->
          <Column header="遊戲名稱" style="min-width: 220px">
            <template #body="slotProps">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold" :style="{ background: slotProps.data.color }">
                  {{ slotProps.data.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.name }}</p>
                  <p class="text-sm text-surface-500 font-mono">{{ slotProps.data.gameId }}</p>
                </div>
              </div>
            </template>
          </Column>

          <!-- Platform Column -->
          <Column field="platform" header="所屬平台" style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.platform" :severity="getPlatformSeverity(slotProps.data.platform)" />
            </template>
          </Column>

          <!-- Total Bet Column -->
          <Column field="totalBet" header="總投注" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="font-mono text-surface-700 dark:text-surface-300">${{ slotProps.data.totalBet.toLocaleString() }}</span>
            </template>
          </Column>

          <!-- Total Payout Column -->
          <Column field="totalPayout" header="總派彩" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="font-mono text-red-500 font-medium">${{ slotProps.data.totalPayout.toLocaleString() }}</span>
            </template>
          </Column>

          <!-- Today RTP Column -->
          <Column field="todayRtp" header="今日 RTP" sortable style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="`${slotProps.data.todayRtp}%`" :severity="slotProps.data.todayRtp > 100 ? 'danger' : 'success'" />
            </template>
          </Column>

          <!-- Actions Column -->
          <Column header="操作" style="min-width: 100px">
            <template #body>
              <Button icon="pi pi-external-link" label="前往控盤" severity="info" text size="small" @click="goToGameList" />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Platform Health Status -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white">
          <i class="pi pi-server text-green-500"></i>
          平台狀態快照
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div v-for="platform in platformHealth" :key="platform.code" class="flex items-center gap-3 p-3 rounded-lg bg-surface-100 dark:bg-surface-700">
            <span :class="['w-3 h-3 rounded-full', platform.status === 'normal' ? 'bg-green-500' : platform.status === 'maintenance' ? 'bg-red-500' : 'bg-yellow-500']"></span>
            <div>
              <p class="font-medium text-surface-900 dark:text-white text-sm">{{ platform.name }}</p>
              <p :class="['text-xs', platform.status === 'normal' ? 'text-green-500' : platform.status === 'maintenance' ? 'text-red-500' : 'text-yellow-500']">
                {{ platform.status === 'normal' ? '正常' : platform.status === 'maintenance' ? '維護中' : '異常' }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

const router = useRouter()

// KPI Data
const kpiData = ref({
  totalBet: 12450000,
  ggr: 450000,
  rtp: 96.4,
  activePlayers: 3248,
  maintenancePlatforms: 2
})

// Pie Chart Data
const pieChartData = ref({
  labels: ['PG Soft', 'JDB', 'Pragmatic Play', 'JILI', 'Evolution', '其他'],
  datasets: [{
    data: [40, 25, 15, 10, 6, 4],
    backgroundColor: ['#6366f1', '#f59e0b', '#ef4444', '#10b981', '#ec4899', '#64748b'],
    borderWidth: 0
  }]
})

const pieChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: { color: '#94a3b8', font: { size: 12 } }
    }
  }
})

// Bar Chart Data (24 hours GGR)
const barChartData = ref({
  labels: ['00', '02', '04', '06', '08', '10', '12', '14', '16', '18', '20', '22'],
  datasets: [{
    label: 'GGR ($)',
    data: [15000, 12000, 8000, 5000, 18000, 35000, 42000, 38000, 45000, 52000, 48000, 32000],
    backgroundColor: (ctx: { raw: number }) => ctx.raw >= 0 ? '#22c55e' : '#ef4444',
    borderRadius: 4
  }]
})

const barChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
    y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8', callback: (value: number) => `$${(value / 1000).toFixed(0)}K` } }
  }
})

// Risk Games Data
interface RiskGame {
  id: number
  gameId: string
  name: string
  platform: string
  totalBet: number
  totalPayout: number
  todayRtp: number
  color: string
}

const riskGames = ref<RiskGame[]>([
  { id: 1, gameId: 'PG001', name: 'Gates of Olympus', platform: 'PG', totalBet: 850000, totalPayout: 1020000, todayRtp: 120.0, color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { id: 2, gameId: 'PP002', name: 'Sweet Bonanza', platform: 'PP', totalBet: 620000, totalPayout: 707000, todayRtp: 114.0, color: 'linear-gradient(135deg, #ef4444, #f97316)' },
  { id: 3, gameId: 'JILI001', name: 'Super Ace', platform: 'JILI', totalBet: 480000, totalPayout: 523000, todayRtp: 109.0, color: 'linear-gradient(135deg, #10b981, #14b8a6)' },
  { id: 4, gameId: 'PG002', name: 'Mahjong Ways', platform: 'PG', totalBet: 350000, totalPayout: 364000, todayRtp: 104.0, color: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
  { id: 5, gameId: 'JDB001', name: 'Dragon Empire', platform: 'JDB', totalBet: 290000, totalPayout: 285000, todayRtp: 98.3, color: 'linear-gradient(135deg, #f59e0b, #eab308)' }
])

// Platform Health Data
interface PlatformHealth {
  code: string
  name: string
  status: 'normal' | 'maintenance' | 'error'
}

const platformHealth = ref<PlatformHealth[]>([
  { code: 'PG', name: 'PG Soft', status: 'normal' },
  { code: 'JDB', name: 'JDB', status: 'maintenance' },
  { code: 'EVO', name: 'Evolution', status: 'normal' },
  { code: 'PP', name: 'Pragmatic', status: 'normal' },
  { code: 'JILI', name: 'JILI', status: 'normal' },
  { code: 'SG', name: 'Spade Gaming', status: 'maintenance' },
  { code: 'SA', name: 'SA Gaming', status: 'normal' },
  { code: 'WM', name: 'WM Casino', status: 'normal' },
  { code: 'CMD', name: 'CMD Sports', status: 'normal' },
  { code: 'SABA', name: 'SABA Sports', status: 'normal' },
  { code: 'CQ9', name: 'CQ9', status: 'normal' },
  { code: 'SEXY', name: 'Sexy Baccarat', status: 'normal' }
])

// Helpers
const getPlatformSeverity = (platform: string): string => {
  const map: Record<string, string> = { 'PG': 'info', 'JDB': 'warn', 'PP': 'danger', 'JILI': 'success', 'EVO': 'secondary' }
  return map[platform] || 'secondary'
}

const goToGameList = () => {
  router.push('/games/list')
}
</script>
