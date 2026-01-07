<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-sitemap text-teal-400"></i>
      <span class="text-surface-300">代理管理</span>
      <span>></span>
      <span class="text-white font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-sitemap text-teal-400"></i>
          代理管理總覽
        </h1>
        <p class="text-surface-400 mt-1">Affiliate Overview - 渠道拓展與佣金結算監控</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Affiliate Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- New Affiliates Today -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">今日新增代理</p>
              <p class="text-2xl font-bold text-white">{{ stats.newAffiliates }}</p>
              <div class="flex items-center gap-1 mt-2 text-emerald-400 text-sm">
                <i class="pi pi-arrow-up"></i>
                <span>+{{ stats.newGrowth }}% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-user-plus text-blue-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Active Affiliates -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">活躍代理</p>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <p class="text-2xl font-bold text-white">{{ stats.activeAffiliates }}</p>
              </div>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag severity="success" value="線上活躍" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <i class="pi pi-users text-emerald-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Pending Commission -->
      <Card class="bg-gradient-to-br from-amber-900/30 to-surface-800/50 border border-amber-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-amber-300 text-sm mb-1 font-medium">預計發放佣金</p>
              <p class="text-2xl font-bold text-amber-400">{{ formatCurrency(stats.pendingCommission) }}</p>
              <div class="flex items-center gap-1 mt-2 text-surface-400 text-sm">
                <i class="pi pi-calendar"></i>
                <span>本期應付</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <i class="pi pi-wallet text-amber-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- First Deposit from Affiliates -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">代理帶動首存</p>
              <p class="text-2xl font-bold text-white">{{ stats.firstDeposits }}</p>
              <div class="flex items-center gap-1 mt-2 text-purple-400 text-sm">
                <i class="pi pi-download"></i>
                <span>新增首存會員</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-money-bill text-purple-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Commission Trend (Line Chart) -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-line text-cyan-400"></i>
            佣金支出走勢
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">過去 7 天代理佣金波動</span>
        </template>
        <template #content>
          <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-72" />
        </template>
      </Card>

      <!-- Affiliate Level Distribution (Pie Chart) -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-pie text-pink-400"></i>
            代理層級分佈
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">各層級代理人數比例</span>
        </template>
        <template #content>
          <div class="flex items-center justify-center">
            <Chart type="pie" :data="pieChartData" :options="pieChartOptions" class="w-80 h-80" />
          </div>
        </template>
      </Card>
    </div>

    <!-- Affiliate Ranking DataTable -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white">
          <i class="pi pi-star text-yellow-400"></i>
          代理貢獻排行榜
        </div>
      </template>
      <template #subtitle>
        <span class="text-surface-400">Affiliate Leaderboard - 本月代理績效監控</span>
      </template>
      <template #content>
        <DataTable 
          :value="affiliateRanking" 
          stripedRows
          class="p-datatable-sm"
          :pt="{
            table: { class: 'min-w-full' },
            tbody: { class: 'text-surface-300' }
          }"
        >
          <!-- Rank -->
          <Column field="rank" header="排名" style="width: 80px">
            <template #body="slotProps">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                :class="getRankClass(slotProps.data.rank)"
              >
                {{ slotProps.data.rank }}
              </div>
            </template>
          </Column>

          <!-- Affiliate ID -->
          <Column field="affiliateId" header="代理帳號/ID">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-surface-600 flex items-center justify-center">
                  <i class="pi pi-user text-surface-300"></i>
                </div>
                <div>
                  <p class="font-medium text-white">{{ slotProps.data.affiliateId }}</p>
                  <p class="text-xs text-surface-400">{{ slotProps.data.level }}</p>
                </div>
              </div>
            </template>
          </Column>

          <!-- New Referrals -->
          <Column field="newReferrals" header="本月新增下線">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i class="pi pi-users text-blue-400"></i>
                <span class="text-white font-medium">{{ slotProps.data.newReferrals }}</span>
              </div>
            </template>
          </Column>

          <!-- Total Bet Volume -->
          <Column field="totalBetVolume" header="下線總投注">
            <template #body="slotProps">
              <span class="text-white font-medium">{{ formatCurrency(slotProps.data.totalBetVolume) }}</span>
            </template>
          </Column>

          <!-- Pending Commission -->
          <Column field="commission" header="應付佣金">
            <template #body="slotProps">
              <span class="text-emerald-400 font-bold">{{ formatCurrency(slotProps.data.commission) }}</span>
            </template>
          </Column>

          <!-- Status -->
          <Column field="status" header="狀態">
            <template #body="slotProps">
              <Tag 
                :severity="slotProps.data.status === 'settling' ? 'warn' : 'success'" 
                :value="slotProps.data.status === 'settling' ? '結算中' : '正常'"
              >
                <template #icon>
                  <i :class="slotProps.data.status === 'settling' ? 'pi pi-sync pi-spin' : 'pi pi-check-circle'" class="mr-1"></i>
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
// Affiliate Stats Mock Data
// ========================================
const stats = ref({
  newAffiliates: 23,
  newGrowth: 15.3,
  activeAffiliates: 186,
  pendingCommission: 892450,
  firstDeposits: 347
})

// ========================================
// Commission Trend Line Chart (7 Days)
// ========================================
const lineChartData = computed(() => ({
  labels: ['01/01', '01/02', '01/03', '01/04', '01/05', '01/06', '01/07'],
  datasets: [
    {
      label: '佣金支出',
      data: [125000, 142000, 118000, 156000, 189000, 163000, 178000],
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 8,
      pointBackgroundColor: '#06b6d4'
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
          return `佣金: ${formatCurrency(context.parsed.y)}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      ticks: { color: '#64748b' }
    },
    y: {
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      ticks: {
        color: '#64748b',
        callback: (value: number) => {
          if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
          return `$${value}`
        }
      }
    }
  }
})

// ========================================
// Affiliate Level Distribution Pie Chart
// ========================================
const pieChartData = computed(() => ({
  labels: ['特級代理', '一級代理', '二級代理', '一般代理'],
  datasets: [
    {
      data: [8, 22, 35, 35],
      backgroundColor: [
        'rgba(251, 191, 36, 0.8)',   // 特級 - amber
        'rgba(168, 85, 247, 0.8)',   // 一級 - purple
        'rgba(59, 130, 246, 0.8)',   // 二級 - blue
        'rgba(107, 114, 128, 0.8)'   // 一般 - gray
      ],
      borderColor: 'rgba(30, 41, 59, 1)',
      borderWidth: 3,
      hoverOffset: 10
    }
  ]
}))

const pieChartOptions = ref({
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
  }
})

// ========================================
// Affiliate Ranking Mock Data
// ========================================
const affiliateRanking = ref([
  {
    rank: 1,
    affiliateId: 'AG_SuperKing',
    level: '特級代理',
    newReferrals: 89,
    totalBetVolume: 4567890,
    commission: 156780,
    status: 'normal'
  },
  {
    rank: 2,
    affiliateId: 'AG_DragonPro',
    level: '特級代理',
    newReferrals: 72,
    totalBetVolume: 3892450,
    commission: 128900,
    status: 'settling'
  },
  {
    rank: 3,
    affiliateId: 'AG_GoldMaster',
    level: '一級代理',
    newReferrals: 56,
    totalBetVolume: 2456780,
    commission: 89500,
    status: 'normal'
  },
  {
    rank: 4,
    affiliateId: 'AG_LuckyWin',
    level: '一級代理',
    newReferrals: 43,
    totalBetVolume: 1987650,
    commission: 67800,
    status: 'normal'
  },
  {
    rank: 5,
    affiliateId: 'AG_TopLink',
    level: '二級代理',
    newReferrals: 38,
    totalBetVolume: 1654320,
    commission: 54200,
    status: 'settling'
  }
])

// Helper function for rank styling
const getRankClass = (rank: number) => {
  if (rank === 1) return 'bg-yellow-500/30 text-yellow-400'
  if (rank === 2) return 'bg-slate-400/30 text-slate-300'
  if (rank === 3) return 'bg-amber-600/30 text-amber-500'
  return 'bg-surface-600 text-surface-300'
}
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

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
  background-color: rgba(30, 41, 59, 0.3);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-color: rgba(71, 85, 105, 0.3);
  padding: 0.75rem 1rem;
}
</style>
