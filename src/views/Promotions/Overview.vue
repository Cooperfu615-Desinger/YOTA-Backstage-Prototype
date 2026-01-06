<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-gift text-blue-400"></i>
      <span class="text-surface-300">推廣活動</span>
      <span>></span>
      <span class="text-white font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-megaphone text-pink-400"></i>
          推廣活動總覽
        </h1>
        <p class="text-surface-400 mt-1">Promotions Overview - 行銷成效與紅利成本監控</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Marketing Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Today Bonus Distribution -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">今日紅利發放</p>
              <p class="text-3xl font-bold text-white">${{ formatNumber(stats.todayBonus) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-red-400">
                <i class="pi pi-arrow-up"></i>
                <span>+{{ stats.bonusTrend }}% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <i class="pi pi-gift text-pink-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Active Participants -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1 flex items-center gap-2">
                活躍參與人數
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              </p>
              <p class="text-3xl font-bold text-green-400">{{ formatNumber(stats.activeParticipants) }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm text-surface-400">
                <span>今日新增: +{{ stats.newParticipants }}</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-users text-green-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- First Deposit Conversion -->
      <Card class="bg-gradient-to-br from-blue-900/30 to-surface-800/50 border border-blue-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-blue-300 text-sm mb-1 font-medium">首存活動轉化</p>
              <p class="text-3xl font-bold text-blue-400">{{ stats.firstDepositRate }}%</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag severity="info" :value="`目標: ${stats.conversionTarget}%`" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-chart-line text-blue-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Bonus Ratio Warning -->
      <Card class="bg-gradient-to-br from-orange-900/30 to-surface-800/50 border border-orange-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-orange-300 text-sm mb-1 font-medium">紅利佔比</p>
              <p class="text-3xl font-bold text-orange-400">{{ stats.bonusRatio }}%</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag severity="warn" value="超過警戒線" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center animate-pulse">
              <i class="pi pi-exclamation-triangle text-orange-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Campaign Status Distribution - Pie Chart -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-pie text-purple-400"></i>
            活動狀態佔比
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">進行中/已結束/審核中</span>
        </template>
        <template #content>
          <Chart type="pie" :data="statusChartData" :options="pieOptions" class="h-64" />
        </template>
      </Card>

      <!-- Bonus Distribution Trend - Area Chart -->
      <Card class="xl:col-span-2 bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-line text-pink-400"></i>
            紅利領取趨勢
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">24 小時紅利發放動態</span>
        </template>
        <template #content>
          <Chart type="line" :data="bonusTrendData" :options="areaChartOptions" class="h-64" />
        </template>
      </Card>
    </div>

    <!-- Top Campaigns Monitor -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white">
          <i class="pi pi-star text-amber-400"></i>
          熱門活動排行榜
        </div>
      </template>
      <template #subtitle>
        <span class="text-surface-400">依參與人數與紅利發放排序</span>
      </template>
      <template #content>
        <DataTable 
          :value="topCampaigns" 
          stripedRows
          class="p-datatable-sm"
          :pt="{
            table: { class: 'min-w-full' },
            tbody: { class: 'text-surface-300' }
          }"
        >
          <Column field="rank" header="#" style="width: 50px">
            <template #body="slotProps">
              <div 
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  slotProps.data.rank <= 3 ? 'bg-amber-500/30 text-amber-400' : 'bg-surface-700 text-surface-400'
                ]"
              >
                {{ slotProps.data.rank }}
              </div>
            </template>
          </Column>
          <Column field="name" header="活動名稱" style="min-width: 200px">
            <template #body="slotProps">
              <div class="flex items-center gap-3">
                <i :class="['pi', slotProps.data.icon, 'text-pink-400']"></i>
                <span class="text-white font-medium">{{ slotProps.data.name }}</span>
              </div>
            </template>
          </Column>
          <Column field="type" header="類型" style="min-width: 100px">
            <template #body="slotProps">
              <Tag :severity="getTypeSeverity(slotProps.data.type)" :value="slotProps.data.type" />
            </template>
          </Column>
          <Column field="participants" header="參與人數" style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-blue-400 font-medium">{{ formatNumber(slotProps.data.participants) }}</span>
            </template>
          </Column>
          <Column field="totalBonus" header="累計發放紅利" style="min-width: 150px">
            <template #body="slotProps">
              <span class="text-pink-400 font-medium">${{ formatNumber(slotProps.data.totalBonus) }}</span>
            </template>
          </Column>
          <Column field="daysLeft" header="剩餘天數" style="min-width: 120px">
            <template #body="slotProps">
              <Tag 
                :severity="getDaysLeftSeverity(slotProps.data.daysLeft)" 
                :value="slotProps.data.daysLeft > 0 ? `${slotProps.data.daysLeft} 天` : '已結束'"
              />
            </template>
          </Column>
          <Column field="status" header="狀態" style="min-width: 100px">
            <template #body="slotProps">
              <Tag 
                :severity="slotProps.data.status === '進行中' ? 'success' : slotProps.data.status === '已結束' ? 'secondary' : 'warn'" 
                :value="slotProps.data.status"
              />
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

// Marketing Stats Mock Data
const stats = ref({
  todayBonus: 892345,
  bonusTrend: 18.5,
  activeParticipants: 3847,
  newParticipants: 423,
  firstDepositRate: 32.8,
  conversionTarget: 35,
  bonusRatio: 12.4
})

// Campaign Status Distribution Chart Data
const statusChartData = computed(() => ({
  labels: ['進行中', '已結束', '審核中'],
  datasets: [
    {
      data: [45, 40, 15],
      backgroundColor: [
        '#22c55e', // Green - Active
        '#64748b', // Gray - Ended
        '#f97316'  // Orange - Pending Review
      ],
      borderWidth: 0
    }
  ]
}))

const pieOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: '#94a3b8',
        usePointStyle: true,
        padding: 16,
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
  }
})

// Bonus Distribution Trend Chart Data
const generateHourlyBonusData = () => {
  const data = []
  // Simulate bonus claim patterns: peaks during active hours
  const pattern = [8, 5, 3, 2, 3, 5, 12, 25, 38, 45, 42, 40, 35, 42, 48, 55, 62, 68, 58, 45, 32, 22, 15, 10]
  for (let i = 0; i < 24; i++) {
    data.push(((pattern[i] || 0) + Math.floor(Math.random() * 8)) * 1000)
  }
  return data
}

const bonusTrendData = computed(() => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  datasets: [
    {
      label: '紅利發放',
      data: generateHourlyBonusData(),
      borderColor: '#ec4899',
      backgroundColor: 'rgba(236, 72, 153, 0.2)',
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 6,
      pointBackgroundColor: '#ec4899'
    }
  ]
}))

const areaChartOptions = ref({
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
          return `紅利: $${(context.parsed.y / 1000).toFixed(0)}K`
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

// Top Campaigns Mock Data
const topCampaigns = ref([
  { rank: 1, name: '每日首存送 100%', icon: 'pi-wallet', type: '首存', participants: 2341, totalBonus: 234567, daysLeft: 15, status: '進行中' },
  { rank: 2, name: '連贏挑戰賽', icon: 'pi-trophy', type: '競賽', participants: 1876, totalBonus: 187654, daysLeft: 8, status: '進行中' },
  { rank: 3, name: 'VIP 專屬週返水', icon: 'pi-star', type: '返水', participants: 1523, totalBonus: 152345, daysLeft: 3, status: '進行中' },
  { rank: 4, name: '新會員體驗金', icon: 'pi-gift', type: '注冊', participants: 1298, totalBonus: 129876, daysLeft: 30, status: '進行中' },
  { rank: 5, name: '週末雙倍積分', icon: 'pi-bolt', type: '積分', participants: 987, totalBonus: 98765, daysLeft: 0, status: '已結束' },
  { rank: 6, name: '生日禮金', icon: 'pi-gift', type: '生日', participants: 654, totalBonus: 65432, daysLeft: 365, status: '進行中' },
  { rank: 7, name: '推薦好友獎勵', icon: 'pi-users', type: '推薦', participants: 543, totalBonus: 54321, daysLeft: 60, status: '進行中' },
  { rank: 8, name: '老虎機挑戰賽', icon: 'pi-play-circle', type: '競賽', participants: 432, totalBonus: 43210, daysLeft: 5, status: '審核中' }
])

// Type severity helper
const getTypeSeverity = (type: string) => {
  const map: Record<string, string> = {
    '首存': 'info',
    '競賽': 'success',
    '返水': 'warn',
    '注冊': 'secondary',
    '積分': 'danger',
    '生日': 'info',
    '推薦': 'success'
  }
  return map[type] || 'secondary'
}

// Days left severity helper
const getDaysLeftSeverity = (days: number) => {
  if (days <= 0) return 'secondary'
  if (days <= 3) return 'danger'
  if (days <= 7) return 'warn'
  return 'success'
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
