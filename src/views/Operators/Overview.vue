<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-id-card text-blue-400"></i>
      <span class="text-surface-300">人員管理</span>
      <span>></span>
      <span class="text-white font-medium">管理總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-shield text-blue-400"></i>
          管理總覽
        </h1>
        <p class="text-surface-400 mt-1">Staff Overview - 後台人員戰情看板</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card class="stat-card">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">總管理員數</p>
              <p class="text-3xl font-bold text-white mb-2">{{ stats.totalAdmins }}</p>
              <div class="flex items-center gap-1 text-sm text-surface-500">
                <span>啟用中 {{ stats.activeAdmins }} 人</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500/20">
              <i class="pi pi-users text-xl text-blue-400"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">今日活躍</p>
              <p class="text-3xl font-bold text-green-400 mb-2">{{ stats.todayActive }}</p>
              <div class="flex items-center gap-1 text-sm text-surface-500">
                <span>目前在線 {{ stats.onlineNow }} 人</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-green-500/20">
              <i class="pi pi-check-circle text-xl text-green-400"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">異常鎖定</p>
              <p class="text-3xl font-bold text-orange-400 mb-2">{{ stats.lockedAccounts }}</p>
              <div class="flex items-center gap-1 text-sm text-surface-500">
                <span>待解鎖</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500/20">
              <i class="pi pi-lock text-xl text-orange-400"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="stat-card">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">登入失敗警報</p>
              <p class="text-3xl font-bold text-red-400 mb-2">{{ stats.loginFailures }}</p>
              <div class="flex items-center gap-1 text-sm text-red-400">
                <i class="pi pi-exclamation-triangle text-xs"></i>
                <span>需關注</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-red-500/20">
              <i class="pi pi-exclamation-circle text-xl text-red-400"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Online Staff List -->
    <Card class="chart-card">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i class="pi pi-wifi text-green-400"></i>
            <span>在線名單</span>
          </div>
          <Tag :value="`${onlineStaff.length} 人在線`" severity="success" />
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="onlineStaff" 
          :pt="tablePassThrough"
          class="compact-table"
        >
          <Column field="account" header="帳號">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                <span class="text-blue-400 font-medium">{{ data.account }}</span>
              </div>
            </template>
          </Column>
          <Column field="name" header="姓名"></Column>
          <Column field="role" header="角色群組">
            <template #body="{ data }">
              <Tag :value="data.role" :severity="getRoleSeverity(data.role)" />
            </template>
          </Column>
          <Column field="ip" header="登入 IP"></Column>
          <Column field="loginTime" header="登入時間"></Column>
          <Column field="lastActivity" header="最後活動"></Column>
          <Column header="操作">
            <template #body="{ data }">
              <Button 
                icon="pi pi-sign-out" 
                severity="danger" 
                size="small"
                rounded
                text
                v-tooltip.top="'強制登出'"
                @click="handleForceLogout(data.account)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Recent Login Activity -->
    <Card class="chart-card">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-history text-blue-400"></i>
          <span>近期登入活動</span>
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="recentLogins" 
          :pt="tablePassThrough"
          class="compact-table"
          :rows="5"
          paginator
        >
          <Column field="time" header="時間"></Column>
          <Column field="account" header="帳號">
            <template #body="{ data }">
              <span class="text-blue-400">{{ data.account }}</span>
            </template>
          </Column>
          <Column field="ip" header="IP 位址"></Column>
          <Column field="location" header="地區"></Column>
          <Column field="status" header="狀態">
            <template #body="{ data }">
              <Tag 
                :value="data.status" 
                :severity="data.status === '成功' ? 'success' : 'danger'"
              />
            </template>
          </Column>
          <Column field="reason" header="備註">
            <template #body="{ data }">
              <span :class="data.status === '失敗' ? 'text-red-400' : 'text-surface-500'">
                {{ data.reason || '-' }}
              </span>
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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'

// ========================================
// State
// ========================================
const lastUpdate = ref(new Date().toLocaleTimeString('zh-TW'))

const tablePassThrough = {
  root: { class: 'border-0' },
  tableContainer: { class: 'border-0' },
  thead: { class: 'border-0' },
  tbody: { class: 'border-0' },
  row: { class: 'border-0 border-b border-surface-700 last:border-0' }
}

// ========================================
// Helper Functions
// ========================================
const getRoleSeverity = (role: string): "success" | "warn" | "danger" | "info" | "secondary" | undefined => {
  switch (role) {
    case '超級管理員': return 'danger'
    case '財務主管': return 'warn'
    case '客服主管': return 'info'
    case '風控人員': return 'warn'
    default: return 'secondary'
  }
}

const handleForceLogout = (account: string) => {
  console.log('Force logout:', account)
}

// ========================================
// Mock Data - Stats
// ========================================
const stats = ref({
  totalAdmins: 45,
  activeAdmins: 42,
  todayActive: 28,
  onlineNow: 12,
  lockedAccounts: 3,
  loginFailures: 8
})

// ========================================
// Mock Data - Online Staff
// ========================================
const onlineStaff = ref([
  { account: 'admin_001', name: '王大明', role: '超級管理員', ip: '192.168.1.100', loginTime: '08:30:15', lastActivity: '11:15:32' },
  { account: 'finance_001', name: '李小華', role: '財務主管', ip: '192.168.1.101', loginTime: '09:00:22', lastActivity: '11:14:45' },
  { account: 'cs_001', name: '張美玲', role: '客服主管', ip: '192.168.1.102', loginTime: '08:45:10', lastActivity: '11:16:01' },
  { account: 'risk_001', name: '陳建國', role: '風控人員', ip: '192.168.1.103', loginTime: '09:15:33', lastActivity: '11:10:22' },
  { account: 'cs_002', name: '林小芳', role: '客服人員', ip: '192.168.1.104', loginTime: '09:30:45', lastActivity: '11:12:18' },
  { account: 'finance_002', name: '黃志偉', role: '財務人員', ip: '192.168.1.105', loginTime: '10:00:12', lastActivity: '11:08:55' }
])

// ========================================
// Mock Data - Recent Logins
// ========================================
const recentLogins = ref([
  { time: '11:15:32', account: 'admin_001', ip: '192.168.1.100', location: '台北市', status: '成功', reason: '' },
  { time: '11:10:22', account: 'risk_001', ip: '192.168.1.103', location: '新北市', status: '成功', reason: '' },
  { time: '11:05:45', account: 'hacker_01', ip: '45.33.32.156', location: '未知', status: '失敗', reason: '帳號不存在' },
  { time: '10:58:12', account: 'finance_002', ip: '192.168.1.105', location: '台北市', status: '成功', reason: '' },
  { time: '10:45:33', account: 'admin_001', ip: '103.21.45.67', location: 'VPN (美國)', status: '失敗', reason: 'IP 不在白名單' },
  { time: '10:30:18', account: 'cs_003', ip: '192.168.1.106', location: '桃園市', status: '失敗', reason: '密碼錯誤 (3次)' },
  { time: '10:15:22', account: 'cs_001', ip: '192.168.1.102', location: '台北市', status: '成功', reason: '' },
  { time: '09:45:10', account: 'finance_001', ip: '192.168.1.101', location: '台北市', status: '成功', reason: '' }
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

.compact-table :deep(.p-datatable-tbody > tr) {
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}
</style>
