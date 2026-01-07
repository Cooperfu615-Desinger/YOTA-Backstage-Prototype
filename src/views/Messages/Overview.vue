<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-envelope text-indigo-400"></i>
      <span class="text-surface-300">訊息管理</span>
      <span>></span>
      <span class="text-white font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-envelope text-indigo-400"></i>
          訊息管理總覽
        </h1>
        <p class="text-surface-400 mt-1">Messages Overview - 站內通訊與公告成效監控</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Communication Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Pending Messages -->
      <Card class="bg-gradient-to-br from-amber-900/30 to-surface-800/50 border border-amber-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-amber-300 text-sm mb-1 font-medium">待處理訊息</p>
              <p class="text-2xl font-bold text-amber-400">{{ stats.pendingMessages }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Badge :value="stats.urgentMessages" severity="danger" />
                <span class="text-surface-400">急件</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center animate-pulse">
              <i class="pi pi-inbox text-amber-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Today's Send Volume -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">今日發送總量</p>
              <p class="text-2xl font-bold text-white">{{ stats.todaySentCount.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-emerald-400 text-sm">
                <i class="pi pi-arrow-up"></i>
                <span>+{{ stats.sentGrowth }}% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-send text-blue-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Read Rate -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">訊息閱讀率</p>
              <p 
                class="text-3xl font-bold"
                :class="stats.readRate >= 70 ? 'text-emerald-400' : 'text-amber-400'"
              >
                {{ stats.readRate }}%
              </p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag :severity="stats.readRate >= 70 ? 'success' : 'warn'" :value="stats.readRate >= 70 ? '良好' : '待優化'" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <i class="pi pi-eye text-emerald-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Active Announcements -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">活躍公告數</p>
              <p class="text-2xl font-bold text-white">{{ stats.activeAnnouncements }}</p>
              <div class="flex items-center gap-1 mt-2 text-purple-400 text-sm">
                <i class="pi pi-megaphone"></i>
                <span>前台顯示中</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-megaphone text-purple-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Message Category Distribution (Pie Chart) -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-pie text-pink-400"></i>
            訊息類別分佈
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">各類型訊息佔比分析</span>
        </template>
        <template #content>
          <div class="flex items-center justify-center">
            <Chart type="pie" :data="pieChartData" :options="pieChartOptions" class="w-80 h-80" />
          </div>
        </template>
      </Card>

      <!-- Send Volume Trend (Line Chart) -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-line text-cyan-400"></i>
            發送量趨勢
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">今日各時段訊息流向</span>
        </template>
        <template #content>
          <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="h-72" />
        </template>
      </Card>
    </div>

    <!-- Announcement Monitor DataTable -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white">
          <i class="pi pi-list text-orange-400"></i>
          最近發佈公告
        </div>
      </template>
      <template #subtitle>
        <span class="text-surface-400">Announcement Monitor - 公告發佈與閱讀監控</span>
      </template>
      <template #content>
        <DataTable 
          :value="announcementList" 
          stripedRows
          class="p-datatable-sm"
          :pt="{
            table: { class: 'min-w-full' },
            tbody: { class: 'text-surface-300' }
          }"
        >
          <!-- Title -->
          <Column field="title" header="公告標題">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i :class="slotProps.data.icon" class="text-lg"></i>
                <span class="font-medium text-white">{{ slotProps.data.title }}</span>
              </div>
            </template>
          </Column>

          <!-- Tag Type -->
          <Column field="tagType" header="標籤類型">
            <template #body="slotProps">
              <Tag 
                :severity="getTagSeverity(slotProps.data.tagType)" 
                :value="slotProps.data.tagType"
              />
            </template>
          </Column>

          <!-- Click Count -->
          <Column field="clickCount" header="閱讀點擊量">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i class="pi pi-eye text-surface-500"></i>
                <span class="text-white font-medium">{{ slotProps.data.clickCount.toLocaleString() }}</span>
              </div>
            </template>
          </Column>

          <!-- Publish Time -->
          <Column field="publishTime" header="發佈時間">
            <template #body="slotProps">
              <span class="text-surface-400">{{ slotProps.data.publishTime }}</span>
            </template>
          </Column>

          <!-- Status -->
          <Column field="status" header="狀態">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <span 
                  class="w-2.5 h-2.5 rounded-full"
                  :class="slotProps.data.isActive ? 'bg-emerald-400' : 'bg-surface-500'"
                ></span>
                <span :class="slotProps.data.isActive ? 'text-emerald-400' : 'text-surface-500'">
                  {{ slotProps.data.isActive ? '發佈中' : '已下架' }}
                </span>
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

// Last update time
const lastUpdate = ref(new Date().toLocaleTimeString('zh-TW', { 
  hour: '2-digit', 
  minute: '2-digit',
  second: '2-digit'
}))

// ========================================
// Communication Stats Mock Data
// ========================================
const stats = ref({
  pendingMessages: 47,
  urgentMessages: 5,
  todaySentCount: 12853,
  sentGrowth: 23.5,
  readRate: 78.2,
  activeAnnouncements: 8
})

// ========================================
// Pie Chart - Message Category Distribution
// ========================================
const pieChartData = computed(() => ({
  labels: ['系統通知', '優惠訊息', '安全提醒', '私訊對話'],
  datasets: [
    {
      data: [35, 30, 20, 15],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',   // 系統 - blue
        'rgba(249, 115, 22, 0.8)',   // 優惠 - orange
        'rgba(239, 68, 68, 0.8)',    // 安全 - red
        'rgba(168, 85, 247, 0.8)'    // 私訊 - purple
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
// Line Chart - Send Volume Trend
// ========================================
const generateHourlySendData = () => {
  const data = []
  for (let i = 0; i < 24; i++) {
    data.push(Math.floor(Math.random() * 800) + 200)
  }
  return data
}

const hourlySendData = generateHourlySendData()

const lineChartData = computed(() => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  datasets: [
    {
      label: '發送量',
      data: hourlySendData,
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.15)',
      fill: true,
      tension: 0.4,
      pointRadius: 2,
      pointHoverRadius: 6,
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
          return `發送量: ${context.parsed.y.toLocaleString()} 則`
        }
      }
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      ticks: { color: '#64748b', maxTicksLimit: 12 }
    },
    y: {
      grid: { color: 'rgba(148, 163, 184, 0.1)' },
      ticks: { color: '#64748b' }
    }
  }
})

// ========================================
// Announcement List Mock Data
// ========================================
const announcementList = ref([
  {
    title: '例行維護通知 - 1/8 凌晨',
    icon: 'pi pi-wrench text-blue-400',
    tagType: '系統',
    clickCount: 8923,
    publishTime: '2026-01-07 08:00',
    isActive: true
  },
  {
    title: '週五存就送 - 首存加碼 50%',
    icon: 'pi pi-gift text-orange-400',
    tagType: '優惠',
    clickCount: 15672,
    publishTime: '2026-01-06 10:00',
    isActive: true
  },
  {
    title: '新遊戲上線：真人龍虎鬥',
    icon: 'pi pi-star text-yellow-400',
    tagType: '活動',
    clickCount: 6834,
    publishTime: '2026-01-05 14:30',
    isActive: true
  },
  {
    title: '帳戶安全提醒 - 請勿分享密碼',
    icon: 'pi pi-shield text-red-400',
    tagType: '安全',
    clickCount: 4521,
    publishTime: '2026-01-04 09:00',
    isActive: true
  },
  {
    title: '春節紅包活動預告',
    icon: 'pi pi-money-bill text-red-400',
    tagType: '活動',
    clickCount: 12453,
    publishTime: '2026-01-03 16:00',
    isActive: true
  },
  {
    title: '支付通道調整公告',
    icon: 'pi pi-credit-card text-purple-400',
    tagType: '系統',
    clickCount: 3287,
    publishTime: '2026-01-02 11:00',
    isActive: false
  }
])

// Helper functions
const getTagSeverity = (type: string) => {
  const map: Record<string, string> = {
    '系統': 'info',
    '優惠': 'warn',
    '安全': 'danger',
    '活動': 'success'
  }
  return map[type] || 'secondary'
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
