<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-gift text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">推廣活動</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">推廣總覽</span>
    </div>

    <!-- Key Metrics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Offers Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-percentage text-green-500"></i>
            優惠管理
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex justify-between items-end">
              <div>
                <p class="text-surface-500 dark:text-surface-400 text-sm">進行中優惠</p>
                <p class="text-4xl font-bold text-green-500">12</p>
              </div>
              <div class="text-right">
                <p class="text-surface-500 dark:text-surface-400 text-sm">今日領取金額</p>
                <p class="text-2xl font-bold text-surface-900 dark:text-white">$458,200</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm text-emerald-500">
              <i class="pi pi-arrow-up"></i>
              <span>較昨日 +12.5%</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Events Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-calendar text-blue-500"></i>
            活動設置
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex justify-between items-end">
              <div>
                <p class="text-surface-500 dark:text-surface-400 text-sm">當前活動</p>
                <p class="text-4xl font-bold text-blue-500">8</p>
              </div>
              <div class="text-right">
                <p class="text-surface-500 dark:text-surface-400 text-sm">今日參與人數</p>
                <p class="text-2xl font-bold text-surface-900 dark:text-white">3,456</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm text-blue-500">
              <i class="pi pi-arrow-up"></i>
              <span>較昨日 +8.3%</span>
            </div>
          </div>
        </template>
      </Card>

      <!-- Achievements Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-star text-yellow-500"></i>
            成就設置
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div class="flex justify-between items-end">
              <div>
                <p class="text-surface-500 dark:text-surface-400 text-sm">已解鎖成就</p>
                <p class="text-4xl font-bold text-yellow-500">1,245</p>
              </div>
              <div class="text-right">
                <p class="text-surface-500 dark:text-surface-400 text-sm">獎勵發放總額</p>
                <p class="text-2xl font-bold text-surface-900 dark:text-white">$89,600</p>
              </div>
            </div>
            <div class="flex items-center gap-2 text-sm text-yellow-500">
              <i class="pi pi-arrow-up"></i>
              <span>較昨日 +15.2%</span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Budget Distribution Chart -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-chart-pie text-purple-500"></i>
            推廣預算佔比
          </div>
        </template>
        <template #content>
          <Chart type="pie" :data="budgetChartData" :options="pieChartOptions" class="h-[300px]" />
        </template>
      </Card>

      <!-- Trend Chart -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-chart-line text-cyan-500"></i>
            近七日領取趨勢
          </div>
        </template>
        <template #content>
          <Chart type="line" :data="trendChartData" :options="lineChartOptions" class="h-[300px]" />
        </template>
      </Card>
    </div>

    <!-- Recent Activity Log -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white">
          <i class="pi pi-history text-orange-500"></i>
          近期異動紀錄
        </div>
      </template>
      <template #content>
        <DataTable :value="activityLogs" stripedRows paginator :rows="5" :rowsPerPageOptions="[5, 10, 20]">
          <Column field="time" header="時間" sortable style="min-width: 150px">
            <template #body="slotProps">
              <span class="text-surface-500 dark:text-surface-400 text-sm">{{ slotProps.data.time }}</span>
            </template>
          </Column>
          <Column field="operator" header="操作人員" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-surface-700 dark:text-surface-300 font-medium">{{ slotProps.data.operator }}</span>
            </template>
          </Column>
          <Column field="module" header="模組" sortable style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.module" :severity="getModuleSeverity(slotProps.data.module)" />
            </template>
          </Column>
          <Column field="action" header="動作" sortable style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.action" :severity="getActionSeverity(slotProps.data.action)" />
            </template>
          </Column>
          <Column field="detail" header="詳情" style="min-width: 200px">
            <template #body="slotProps">
              <span class="text-surface-600 dark:text-surface-400 text-sm">{{ slotProps.data.detail }}</span>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

// Budget Distribution Pie Chart Data
const budgetChartData = ref({
  labels: ['優惠管理', '活動設置', '成就系統'],
  datasets: [
    {
      data: [458200, 286500, 89600],
      backgroundColor: ['#22c55e', '#3b82f6', '#eab308'],
      borderColor: ['#16a34a', '#2563eb', '#ca8a04'],
      borderWidth: 2
    }
  ]
})

const pieChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#94a3b8',
        padding: 20,
        usePointStyle: true
      }
    }
  }
})

// Trend Line Chart Data
const trendChartData = ref({
  labels: ['週一', '週二', '週三', '週四', '週五', '週六', '週日'],
  datasets: [
    {
      label: '優惠領取',
      data: [125000, 138000, 142000, 156000, 168000, 195000, 210000],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: '活動獎勵',
      data: [85000, 92000, 88000, 105000, 118000, 135000, 145000],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: '成就獎勵',
      data: [28000, 32000, 35000, 38000, 42000, 48000, 52000],
      borderColor: '#eab308',
      backgroundColor: 'rgba(234, 179, 8, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
})

const lineChartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#94a3b8',
        padding: 20,
        usePointStyle: true
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#64748b' },
      grid: { color: 'rgba(148, 163, 184, 0.1)' }
    },
    y: {
      ticks: { 
        color: '#64748b',
        callback: (value: number) => '$' + (value / 1000) + 'K'
      },
      grid: { color: 'rgba(148, 163, 184, 0.1)' }
    }
  }
})

// Activity Logs Mock Data
const activityLogs = ref([
  { time: '2026-01-11 15:42', operator: 'admin01', module: '優惠', action: '修改', detail: '調整「首存紅利100%」流水倍數為 12x' },
  { time: '2026-01-11 14:28', operator: 'marketing', module: '活動', action: '新增', detail: '建立「春節限定 - 連續登入送好禮」活動' },
  { time: '2026-01-11 13:15', operator: 'admin02', module: '成就', action: '修改', detail: '更新 30 日簽到獎勵為 888 點' },
  { time: '2026-01-11 11:55', operator: 'admin01', module: '優惠', action: '停用', detail: '停用「週末再存送 50%」優惠活動' },
  { time: '2026-01-11 10:30', operator: 'marketing', module: '活動', action: '新增', detail: '建立「VIP 專屬回饋」每週返利活動' },
  { time: '2026-01-11 09:45', operator: 'admin02', module: '成就', action: '新增', detail: '新增「首儲達人」成就，獎勵 200 點' },
  { time: '2026-01-10 18:20', operator: 'admin01', module: '優惠', action: '修改', detail: '調整「好友邀請獎勵」為雙方各得 150 點' },
  { time: '2026-01-10 16:35', operator: 'marketing', module: '活動', action: '停用', detail: '停用「跨年倒數」限時活動' }
])

// Severity Helpers
const getModuleSeverity = (module: string): string => {
  const severityMap: Record<string, string> = {
    '優惠': 'success',
    '活動': 'info',
    '成就': 'warn'
  }
  return severityMap[module] || 'secondary'
}

const getActionSeverity = (action: string): string => {
  const severityMap: Record<string, string> = {
    '新增': 'success',
    '修改': 'info',
    '停用': 'danger'
  }
  return severityMap[action] || 'secondary'
}
</script>
