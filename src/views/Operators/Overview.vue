<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-users text-blue-400"></i>
      <span class="text-surface-300">操作員管理</span>
      <span>></span>
      <span class="text-white font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-shield text-purple-400"></i>
          操作員管理總覽
        </h1>
        <p class="text-surface-400 mt-1">Operator Overview - 內部監控與系統安全追蹤</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Security Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Online Operators -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1 flex items-center gap-2">
                在線操作員
                <span class="relative flex h-2 w-2">
                  <span class="animate-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </p>
              <p class="text-3xl font-bold text-emerald-400">{{ stats.onlineOperators }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm text-surface-400">
                <span>總帳號: {{ stats.totalOperators }}</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <i class="pi pi-users text-emerald-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Abnormal Logins -->
      <Card class="bg-gradient-to-br from-red-900/30 to-surface-800/50 border border-red-600/30">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-red-300 text-sm mb-1 font-medium">今日異常登入</p>
              <p class="text-3xl font-bold text-red-400">{{ stats.abnormalLogins }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm">
                <Tag severity="danger" value="需立即審查" />
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center animate-pulse">
              <i class="pi pi-exclamation-triangle text-red-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Pending Permissions -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">待審核權限</p>
              <p class="text-3xl font-bold text-amber-400">{{ stats.pendingPermissions }}</p>
              <div class="flex items-center gap-2 mt-2 text-sm text-surface-400">
                <span>本週新增: {{ stats.weeklyPermissionRequests }}</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <i class="pi pi-lock text-amber-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- High Sensitivity Operations -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">高敏感操作數</p>
              <p class="text-3xl font-bold text-white">{{ stats.sensitiveOperations }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm" :class="stats.sensitiveOpsTrend >= 0 ? 'text-red-400' : 'text-emerald-400'">
                <i :class="['pi', stats.sensitiveOpsTrend >= 0 ? 'pi-arrow-up' : 'pi-arrow-down']"></i>
                <span>{{ stats.sensitiveOpsTrend >= 0 ? '+' : '' }}{{ stats.sensitiveOpsTrend }}% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-cog text-purple-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- Role Distribution - Pie Chart -->
      <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-sitemap text-blue-400"></i>
            職能佔比分佈
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">客服/財務/風控/管理員</span>
        </template>
        <template #content>
          <Chart type="pie" :data="roleChartData" :options="pieOptions" class="h-64" />
        </template>
      </Card>

      <!-- Login Time Analysis - Line Chart -->
      <Card class="xl:col-span-2 bg-surface-800/50 border border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-white">
            <i class="pi pi-clock text-cyan-400"></i>
            24 小時登入時間分析
          </div>
        </template>
        <template #subtitle>
          <span class="text-surface-400">監控非辦公時間登入異常</span>
        </template>
        <template #content>
          <Chart type="line" :data="loginTimeChartData" :options="lineChartOptions" class="h-64" />
        </template>
      </Card>
    </div>

    <!-- Sensitive Operations Monitor -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white">
          <i class="pi pi-eye text-red-400"></i>
          敏感操作行為監控
          <Tag severity="danger" value="即時" class="ml-2" />
        </div>
      </template>
      <template #subtitle>
        <span class="text-surface-400">追蹤高權限操作與關鍵數據變更</span>
      </template>
      <template #content>
        <DataTable 
          :value="sensitiveOperations" 
          stripedRows
          class="p-datatable-sm"
          :pt="{
            table: { class: 'min-w-full' },
            tbody: { class: 'text-surface-300' }
          }"
        >
          <Column field="operator" header="管理員帳號" style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-blue-400 font-medium">{{ slotProps.data.operator }}</span>
            </template>
          </Column>
          <Column field="department" header="部門" style="min-width: 100px">
            <template #body="slotProps">
              <Tag :severity="getDepartmentSeverity(slotProps.data.department)" :value="slotProps.data.department" />
            </template>
          </Column>
          <Column field="action" header="操作內容" style="min-width: 200px">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <Tag v-if="slotProps.data.isSensitive" severity="danger" value="敏感" class="text-xs" />
                <span class="text-white">{{ slotProps.data.action }}</span>
              </div>
            </template>
          </Column>
          <Column field="target" header="影響對象" style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-surface-300">{{ slotProps.data.target }}</span>
            </template>
          </Column>
          <Column field="ip" header="IP 位址" style="min-width: 140px">
            <template #body="slotProps">
              <span class="text-surface-400 font-mono text-sm">{{ slotProps.data.ip }}</span>
            </template>
          </Column>
          <Column field="timestamp" header="時間" style="min-width: 160px">
            <template #body="slotProps">
              <span class="text-surface-400 text-sm">{{ slotProps.data.timestamp }}</span>
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

// Last update time
const lastUpdate = ref(new Date().toLocaleTimeString('zh-TW', { 
  hour: '2-digit', 
  minute: '2-digit',
  second: '2-digit'
}))

// Security Stats Mock Data
const stats = ref({
  onlineOperators: 23,
  totalOperators: 48,
  abnormalLogins: 3,
  pendingPermissions: 7,
  weeklyPermissionRequests: 12,
  sensitiveOperations: 156,
  sensitiveOpsTrend: 23.5
})

// Role Distribution Chart Data
const roleChartData = computed(() => ({
  labels: ['客服', '財務', '風控', '管理員'],
  datasets: [
    {
      data: [45, 25, 18, 12],
      backgroundColor: [
        '#06b6d4', // Cyan - Customer Service
        '#22c55e', // Green - Finance
        '#f97316', // Orange - Risk Control
        '#a855f7'  // Purple - Admin
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

// Login Time Analysis Chart Data
const generateHourlyLoginData = () => {
  const data = []
  // Simulate login patterns: low at night (0-6), peak during office hours (9-18), moderate evening
  const pattern = [2, 1, 0, 0, 1, 2, 5, 12, 18, 22, 21, 20, 15, 18, 20, 22, 21, 19, 14, 8, 5, 4, 3, 2]
  for (let i = 0; i < 24; i++) {
    data.push((pattern[i] || 0) + Math.floor(Math.random() * 3))
  }
  return data
}

const loginTimeChartData = computed(() => ({
  labels: Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`),
  datasets: [
    {
      label: '登入次數',
      data: generateHourlyLoginData(),
      borderColor: '#06b6d4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
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
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1e293b',
      titleColor: '#f8fafc',
      bodyColor: '#cbd5e1',
      borderColor: '#334155',
      borderWidth: 1,
      padding: 12
    },
    annotation: {
      annotations: {
        offHours: {
          type: 'box',
          xMin: 0,
          xMax: 6,
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'transparent'
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
        color: '#64748b'
      },
      beginAtZero: true
    }
  }
})

// Sensitive Operations Mock Data
const sensitiveOperations = ref([
  { operator: 'admin_001', department: '管理員', action: '修改會員帳戶餘額', target: 'user_vip888', ip: '203.145.67.89', timestamp: '2025-08-19 15:23:45', isSensitive: true },
  { operator: 'finance_lin', department: '財務', action: '審核大額提款', target: '¥150,000', ip: '114.32.156.201', timestamp: '2025-08-19 15:21:33', isSensitive: true },
  { operator: 'risk_wang', department: '風控', action: '凍結可疑帳號', target: 'user_suspect01', ip: '61.220.88.45', timestamp: '2025-08-19 15:18:12', isSensitive: true },
  { operator: 'cs_chen', department: '客服', action: '重置會員密碼', target: 'user_forgot123', ip: '180.217.134.77', timestamp: '2025-08-19 15:15:08', isSensitive: false },
  { operator: 'admin_super', department: '管理員', action: '變更操作員權限', target: 'finance_new', ip: '223.136.92.156', timestamp: '2025-08-19 15:12:55', isSensitive: true },
  { operator: 'finance_zhang', department: '財務', action: '手動加點', target: 'agent_gold888', ip: '36.231.45.189', timestamp: '2025-08-19 15:10:22', isSensitive: true },
  { operator: 'cs_liu', department: '客服', action: '查詢會員資料', target: 'user_query001', ip: '59.124.178.92', timestamp: '2025-08-19 15:08:41', isSensitive: false },
  { operator: 'risk_li', department: '風控', action: '設定風控規則', target: '單筆限額調整', ip: '111.83.241.33', timestamp: '2025-08-19 15:05:18', isSensitive: true }
])

// Department severity helper
const getDepartmentSeverity = (department: string) => {
  const map: Record<string, string> = {
    '管理員': 'danger',
    '財務': 'success',
    '風控': 'warn',
    '客服': 'info'
  }
  return map[department] || 'secondary'
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
