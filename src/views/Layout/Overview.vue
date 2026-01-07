<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-palette text-pink-400"></i>
      <span class="text-surface-300">版面設定</span>
      <span>></span>
      <span class="text-white font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-palette text-pink-400"></i>
          版面設定總覽
        </h1>
        <p class="text-surface-400 mt-1">Layout Overview - 前台視覺元件監控與 CMS 管理</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Layout Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Active Theme -->
      <Card class="bg-gradient-to-br from-purple-900/30 to-surface-800/50 border border-purple-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-purple-300 text-sm mb-1 font-medium">啟用中主題</p>
              <p class="text-xl font-bold text-white">{{ stats.activeTheme }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag severity="success" value="已發佈" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-palette text-purple-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Active Banners -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">生效 Banner</p>
              <p class="text-2xl font-bold text-white">{{ stats.activeBanners }}</p>
              <div class="flex items-center gap-1 mt-2 text-cyan-400 text-sm">
                <i class="pi pi-images"></i>
                <span>正在輪播中</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <i class="pi pi-image text-cyan-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Static Pages -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">靜態頁面數</p>
              <p class="text-2xl font-bold text-white">{{ stats.staticPages }}</p>
              <div class="flex items-center gap-1 mt-2 text-emerald-400 text-sm">
                <i class="pi pi-file"></i>
                <span>CMS 內容</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <i class="pi pi-file-edit text-emerald-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Storage Usage -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p class="text-surface-400 text-sm mb-1">素材庫空間</p>
              <p class="text-2xl font-bold text-white">{{ stats.storageUsage }}%</p>
              <div class="mt-2">
                <ProgressBar 
                  :value="stats.storageUsage" 
                  :showValue="false"
                  class="h-2"
                  :pt="{
                    value: { 
                      class: stats.storageUsage >= 80 ? '!bg-amber-500' : '!bg-blue-500'
                    }
                  }"
                />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center ml-4">
              <i class="pi pi-database text-blue-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Device Distribution (Pie Chart) -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-pie text-orange-400"></i>
            裝置訪問佔比
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">各平台流量分佈</span>
        </template>
        <template #content>
          <div class="flex items-center justify-center">
            <Chart type="pie" :data="pieChartData" :options="pieChartOptions" class="w-80 h-80" />
          </div>
        </template>
      </Card>

      <!-- Banner Click Performance (Horizontal Bar) -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-chart-bar text-green-400"></i>
            版位點擊熱度
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">各廣告版位點擊成效</span>
        </template>
        <template #content>
          <Chart type="bar" :data="barChartData" :options="barChartOptions" class="h-72" />
        </template>
      </Card>
    </div>

    <!-- Banner Monitor DataTable -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white">
          <i class="pi pi-images text-yellow-400"></i>
          即時 Banner 排程
        </div>
      </template>
      <template #subtitle>
        <span class="text-surface-400">Banner Monitor - 輪播圖與排程監控</span>
      </template>
      <template #content>
        <DataTable 
          :value="bannerList" 
          stripedRows
          class="p-datatable-sm"
          :pt="{
            table: { class: 'min-w-full' },
            tbody: { class: 'text-surface-300' }
          }"
        >
          <!-- Name/Preview -->
          <Column field="name" header="名稱/預覽">
            <template #body="slotProps">
              <div class="flex items-center gap-3">
                <div 
                  class="w-16 h-10 rounded-lg flex items-center justify-center text-xs"
                  :class="slotProps.data.previewBg"
                >
                  {{ slotProps.data.previewText }}
                </div>
                <span class="font-medium text-white">{{ slotProps.data.name }}</span>
              </div>
            </template>
          </Column>

          <!-- Placement -->
          <Column field="placement" header="投放位置">
            <template #body="slotProps">
              <div class="flex gap-1">
                <Tag 
                  v-for="tag in slotProps.data.placement" 
                  :key="tag"
                  :severity="tag === 'PC' ? 'info' : 'success'" 
                  :value="tag"
                  class="text-xs"
                />
              </div>
            </template>
          </Column>

          <!-- Click Count -->
          <Column field="clickCount" header="點擊量">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i class="pi pi-mouse text-surface-500"></i>
                <span class="text-white font-medium">{{ slotProps.data.clickCount.toLocaleString() }}</span>
              </div>
            </template>
          </Column>

          <!-- Duration -->
          <Column field="duration" header="排程期間">
            <template #body="slotProps">
              <span class="text-surface-400 text-sm">{{ slotProps.data.duration }}</span>
            </template>
          </Column>

          <!-- Status -->
          <Column field="status" header="狀態">
            <template #body="slotProps">
              <Tag 
                :severity="slotProps.data.status === 'active' ? 'success' : 'info'" 
                :value="slotProps.data.status === 'active' ? '展示中' : '預約中'"
              >
                <template #icon>
                  <i :class="slotProps.data.status === 'active' ? 'pi pi-check-circle' : 'pi pi-clock'" class="mr-1"></i>
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
import ProgressBar from 'primevue/progressbar'

// Last update time
const lastUpdate = ref(new Date().toLocaleTimeString('zh-TW', { 
  hour: '2-digit', 
  minute: '2-digit',
  second: '2-digit'
}))

// ========================================
// Layout Stats Mock Data
// ========================================
const stats = ref({
  activeTheme: 'Aura Dark 旗艦版',
  activeBanners: 12,
  staticPages: 28,
  storageUsage: 67
})

// ========================================
// Pie Chart - Device Distribution
// ========================================
const pieChartData = computed(() => ({
  labels: ['H5 手機版', 'PC 網頁版', 'iOS App', 'Android App'],
  datasets: [
    {
      data: [42, 28, 18, 12],
      backgroundColor: [
        'rgba(6, 182, 212, 0.8)',    // H5 - cyan
        'rgba(59, 130, 246, 0.8)',   // PC - blue
        'rgba(168, 85, 247, 0.8)',   // iOS - purple
        'rgba(34, 197, 94, 0.8)'     // Android - green
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
// Horizontal Bar Chart - Banner Performance
// ========================================
const barChartData = computed(() => ({
  labels: ['首頁主輪播', '遊戲大廳側邊', '優惠專區頂部', '登入彈窗', '底部推廣欄'],
  datasets: [
    {
      label: '點擊量',
      data: [15680, 8920, 6540, 4230, 2180],
      backgroundColor: [
        'rgba(249, 115, 22, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ],
      borderColor: [
        '#f97316',
        '#10b981',
        '#3b82f6',
        '#a855f7',
        '#6b7280'
      ],
      borderWidth: 1,
      borderRadius: 4,
      barThickness: 24
    }
  ]
}))

const barChartOptions = ref({
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
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
        label: (context: { parsed: { x: number } }) => {
          return `點擊量: ${context.parsed.x.toLocaleString()}`
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
      grid: { display: false },
      ticks: { color: '#f8fafc', font: { weight: 500 } }
    }
  }
})

// ========================================
// Banner List Mock Data
// ========================================
const bannerList = ref([
  {
    name: '春節紅包雨活動',
    previewBg: 'bg-red-500/30',
    previewText: '新春',
    placement: ['PC', 'App'],
    clickCount: 8456,
    duration: '01/15 - 02/15',
    status: 'active'
  },
  {
    name: '首存 100% 加碼',
    previewBg: 'bg-amber-500/30',
    previewText: '首存',
    placement: ['PC', 'App'],
    clickCount: 12340,
    duration: '01/01 - 01/31',
    status: 'active'
  },
  {
    name: '真人百家樂上線',
    previewBg: 'bg-purple-500/30',
    previewText: '真人',
    placement: ['App'],
    clickCount: 5672,
    duration: '01/05 - 01/20',
    status: 'active'
  },
  {
    name: 'VIP 尊享禮遇',
    previewBg: 'bg-yellow-500/30',
    previewText: 'VIP',
    placement: ['PC'],
    clickCount: 3289,
    duration: '01/10 - 01/25',
    status: 'active'
  },
  {
    name: '情人節限定活動',
    previewBg: 'bg-pink-500/30',
    previewText: '情人節',
    placement: ['PC', 'App'],
    clickCount: 0,
    duration: '02/10 - 02/20',
    status: 'scheduled'
  },
  {
    name: '體育賽事週末加碼',
    previewBg: 'bg-green-500/30',
    previewText: '體育',
    placement: ['App'],
    clickCount: 0,
    duration: '01/18 - 01/19',
    status: 'scheduled'
  }
])
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

/* ProgressBar styling */
:deep(.p-progressbar) {
  background-color: rgba(71, 85, 105, 0.5);
  border-radius: 9999px;
}
</style>
