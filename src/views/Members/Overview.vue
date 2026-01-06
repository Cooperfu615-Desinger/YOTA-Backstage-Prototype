<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-users text-blue-400"></i>
      <span class="text-surface-300">會員管理</span>
      <span>></span>
      <span class="text-white font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-users text-blue-400"></i>
          會員管理總覽
        </h1>
        <p class="text-surface-400 mt-1">Member Overview - 即時監控玩家動態與核心指標</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Stats Widgets - Top Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Today New Registrations -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">今日新註冊</p>
              <p class="text-3xl font-bold text-white">{{ formatNumber(stats.todayNewUsers) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm" :class="stats.newUsersTrend >= 0 ? 'text-emerald-400' : 'text-red-400'">
                <i :class="['pi', stats.newUsersTrend >= 0 ? 'pi-arrow-up' : 'pi-arrow-down']"></i>
                <span>{{ stats.newUsersTrend >= 0 ? '+' : '' }}{{ stats.newUsersTrend }}% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-user-plus text-blue-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Real-time Online -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1 flex items-center gap-2">
                當前在線
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </p>
              <p class="text-3xl font-bold text-emerald-400">{{ formatNumber(stats.onlineUsers) }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm text-surface-400">
                <span>峰值: {{ formatNumber(stats.peakOnline) }}</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <i class="pi pi-wifi text-emerald-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Today First Deposit -->
      <Card class="bg-gradient-to-br from-amber-900/30 to-surface-800/50 border border-amber-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-amber-300 text-sm mb-1 font-medium">今日首存人數</p>
              <p class="text-3xl font-bold text-amber-400">{{ formatNumber(stats.todayFirstDeposit) }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag severity="success" :value="`轉換率 ${stats.conversionRate}%`" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <i class="pi pi-dollar text-amber-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- DAU -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">今日活躍玩家 (DAU)</p>
              <p class="text-3xl font-bold text-white">{{ formatNumber(stats.dau) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm" :class="stats.dauTrend >= 0 ? 'text-emerald-400' : 'text-red-400'">
                <i :class="['pi', stats.dauTrend >= 0 ? 'pi-arrow-up' : 'pi-arrow-down']"></i>
                <span>{{ stats.dauTrend >= 0 ? '+' : '' }}{{ stats.dauTrend }}% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-chart-line text-purple-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- VIP Distribution - Doughnut Chart -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-star text-amber-400"></i>
            會員等級分佈
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">VIP 0 - VIP 10</span>
        </template>
        <template #content>
          <Chart type="doughnut" :data="vipChartData" :options="doughnutOptions" class="h-64" />
        </template>
      </Card>

      <!-- 24h Activity Trend - Mixed Chart -->
      <Card class="xl:col-span-2 bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-bar text-blue-400"></i>
            24 小時活躍趨勢
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">新註冊 vs 登入人數</span>
        </template>
        <template #content>
          <Chart type="bar" :data="activityChartData" :options="mixedChartOptions" class="h-64" />
        </template>
      </Card>
    </div>

    <!-- Live Monitor - Latest Registrations -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white">
          <i class="pi pi-users text-green-400"></i>
          最新註冊會員
          <span class="relative flex h-2 w-2 ml-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
      </template>
      <template #subtitle>
        <span class="text-surface-400">即時監控新會員註冊</span>
      </template>
      <template #content>
        <DataTable 
          :value="latestRegistrations" 
          stripedRows
          class="p-datatable-sm"
          :pt="{
            table: { class: 'min-w-full' },
            tbody: { class: 'text-surface-300' }
          }"
        >
          <Column field="account" header="帳號" style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-blue-400 font-medium">{{ slotProps.data.account }}</span>
            </template>
          </Column>
          <Column field="agent" header="代理" style="min-width: 100px">
            <template #body="slotProps">
              <span class="text-surface-300">{{ slotProps.data.agent }}</span>
            </template>
          </Column>
          <Column field="ip" header="註冊來源 IP" style="min-width: 140px">
            <template #body="slotProps">
              <span class="text-surface-400 font-mono text-sm">{{ slotProps.data.ip }}</span>
            </template>
          </Column>
          <Column field="device" header="設備" style="min-width: 100px">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i :class="['pi', slotProps.data.device === 'Mobile' ? 'pi-mobile' : 'pi-desktop', 'text-surface-400']"></i>
                <span class="text-surface-300">{{ slotProps.data.device }}</span>
              </div>
            </template>
          </Column>
          <Column field="status" header="狀態" style="min-width: 80px">
            <template #body="slotProps">
              <Tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.statusText" />
            </template>
          </Column>
          <Column field="registeredAt" header="註冊時間" style="min-width: 160px">
            <template #body="slotProps">
              <span class="text-surface-400 text-sm">{{ slotProps.data.registeredAt }}</span>
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

// Stats Mock Data
const stats = ref({
  todayNewUsers: 1847,
  newUsersTrend: 15.2,
  onlineUsers: 3428,
  peakOnline: 5621,
  todayFirstDeposit: 523,
  conversionRate: 28.3,
  dau: 12856,
  dauTrend: 8.7
})

// VIP Distribution Chart Data
const vipChartData = computed(() => ({
  labels: ['VIP 0', 'VIP 1', 'VIP 2', 'VIP 3', 'VIP 4', 'VIP 5', 'VIP 6', 'VIP 7', 'VIP 8', 'VIP 9', 'VIP 10'],
  datasets: [
    {
      data: [35, 25, 15, 10, 6, 4, 2, 1.5, 0.8, 0.5, 0.2],
      backgroundColor: [
        '#64748b', // VIP 0 - Gray
        '#06b6d4', // VIP 1 - Cyan
        '#22c55e', // VIP 2 - Green
        '#84cc16', // VIP 3 - Lime
        '#eab308', // VIP 4 - Yellow
        '#f97316', // VIP 5 - Orange
        '#ef4444', // VIP 6 - Red
        '#ec4899', // VIP 7 - Pink
        '#a855f7', // VIP 8 - Purple
        '#6366f1', // VIP 9 - Indigo
        '#fbbf24'  // VIP 10 - Gold
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
        padding: 12,
        font: { size: 11 }
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
  cutout: '60%'
})

// 24h Activity Chart Data
const generateHourlyData = () => {
  const registrations = []
  const logins = []
  for (let i = 0; i < 24; i++) {
    registrations.push(Math.floor(Math.random() * 80) + 20)
    logins.push(Math.floor(Math.random() * 500) + 200)
  }
  return { registrations, logins }
}

const hourlyData = generateHourlyData()

const activityChartData = computed(() => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  datasets: [
    {
      type: 'bar',
      label: '新註冊',
      data: hourlyData.registrations,
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderRadius: 4,
      order: 2
    },
    {
      type: 'line',
      label: '登入人數',
      data: hourlyData.logins,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      order: 1
    }
  ]
}))

const mixedChartOptions = ref({
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
        color: '#94a3b8',
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 12
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
        color: '#64748b'
      }
    }
  }
})

// Latest Registrations Mock Data
const latestRegistrations = ref([
  { account: 'nexora_001', agent: 'proxial7', ip: '203.145.67.89', device: 'Mobile', status: 'active', statusText: '正常', registeredAt: '2025-08-19 14:52:33' },
  { account: 'veyric_star', agent: 'delegrix21', ip: '114.32.156.201', device: 'Desktop', status: 'active', statusText: '正常', registeredAt: '2025-08-19 14:51:18' },
  { account: 'calden_pro', agent: 'mandatrx9', ip: '61.220.88.45', device: 'Mobile', status: 'active', statusText: '正常', registeredAt: '2025-08-19 14:50:02' },
  { account: 'orynt_888', agent: 'subven88', ip: '180.217.134.77', device: 'Mobile', status: 'active', statusText: '正常', registeredAt: '2025-08-19 14:48:45' },
  { account: 'drivon_ace', agent: 'repzen14', ip: '223.136.92.156', device: 'Desktop', status: 'active', statusText: '正常', registeredAt: '2025-08-19 14:47:21' },
  { account: 'zephyx_king', agent: 'proxial7', ip: '36.231.45.189', device: 'Mobile', status: 'active', statusText: '正常', registeredAt: '2025-08-19 14:46:08' },
  { account: 'krypton_vip', agent: 'delegrix21', ip: '59.124.178.92', device: 'Desktop', status: 'active', statusText: '正常', registeredAt: '2025-08-19 14:44:55' },
  { account: 'voltar_elite', agent: 'mandatrx9', ip: '111.83.241.33', device: 'Mobile', status: 'active', statusText: '正常', registeredAt: '2025-08-19 14:43:37' }
])

// Status severity helper
const getStatusSeverity = (status: string) => {
  const map: Record<string, string> = {
    active: 'success',
    frozen: 'danger',
    pending: 'warn'
  }
  return map[status] || 'info'
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
</style>
