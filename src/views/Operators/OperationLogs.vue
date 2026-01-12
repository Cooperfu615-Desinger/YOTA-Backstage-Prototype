<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-id-card text-blue-400"></i>
      <span class="text-surface-300">人員管理</span>
      <span>></span>
      <span class="text-white font-medium">操作日誌</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-history text-orange-400"></i>
          操作日誌
        </h1>
        <p class="text-surface-400 mt-1">Operation Logs - 後台操作審計追蹤</p>
      </div>
      <Button 
        icon="pi pi-download" 
        label="匯出日誌"
        severity="secondary"
      />
    </div>

    <!-- Filters -->
    <Card class="chart-card">
      <template #content>
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs text-surface-500">時間範圍</label>
            <Calendar 
              v-model="dateRange" 
              selectionMode="range" 
              placeholder="選擇日期範圍"
              class="w-56"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-surface-500">操作員</label>
            <Dropdown 
              v-model="filterOperator" 
              :options="operatorOptions"
              placeholder="全部"
              class="w-40"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-surface-500">模組</label>
            <Dropdown 
              v-model="filterModule" 
              :options="moduleOptions"
              placeholder="全部"
              class="w-40"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-surface-500">行為</label>
            <Dropdown 
              v-model="filterAction" 
              :options="actionOptions"
              placeholder="全部"
              class="w-32"
            />
          </div>
          <div class="flex items-end">
            <Button icon="pi pi-search" label="查詢" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Logs Table -->
    <Card class="chart-card">
      <template #title>
        <div class="flex items-center justify-between">
          <span>操作紀錄</span>
          <Tag :value="`共 ${logs.length} 筆`" severity="info" />
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="logs" 
          :pt="tablePassThrough"
          class="compact-table"
          paginator
          :rows="10"
        >
          <Column field="time" header="時間" style="width: 150px">
            <template #body="{ data }">
              <span class="text-surface-400 text-sm">{{ data.time }}</span>
            </template>
          </Column>
          <Column field="operator" header="操作員">
            <template #body="{ data }">
              <span class="text-blue-400">{{ data.operator }}</span>
            </template>
          </Column>
          <Column field="module" header="模組">
            <template #body="{ data }">
              <Tag :value="data.module" severity="secondary" class="text-xs" />
            </template>
          </Column>
          <Column field="action" header="行為">
            <template #body="{ data }">
              <Tag 
                :value="data.action" 
                :severity="getActionSeverity(data.action)"
              />
            </template>
          </Column>
          <Column field="target" header="目標"></Column>
          <Column field="ip" header="IP"></Column>
          <Column header="詳情">
            <template #body="{ data }">
              <Button 
                v-if="data.hasDiff"
                icon="pi pi-code" 
                severity="info" 
                size="small"
                rounded
                text
                v-tooltip.top="'查看變更'"
                @click="openDiffDialog(data)"
              />
              <span v-else class="text-surface-600">-</span>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- JSON Diff Dialog -->
    <Dialog 
      v-model:visible="diffDialogVisible" 
      header="變更詳情 (JSON Diff)"
      :style="{ width: '800px' }"
      modal
    >
      <div v-if="selectedLog" class="space-y-4">
        <div class="flex items-center gap-4 text-sm text-surface-400">
          <span><strong>時間：</strong>{{ selectedLog.time }}</span>
          <span><strong>操作員：</strong>{{ selectedLog.operator }}</span>
          <span><strong>目標：</strong>{{ selectedLog.target }}</span>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <!-- Before -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <i class="pi pi-minus-circle text-red-400"></i>
              <span class="text-red-400 font-medium">修改前</span>
            </div>
            <pre class="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm font-mono overflow-auto max-h-64">{{ selectedLog.before }}</pre>
          </div>
          
          <!-- After -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <i class="pi pi-plus-circle text-green-400"></i>
              <span class="text-green-400 font-medium">修改後</span>
            </div>
            <pre class="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-sm font-mono overflow-auto max-h-64">{{ selectedLog.after }}</pre>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="關閉" severity="secondary" @click="diffDialogVisible = false" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'

// ========================================
// State
// ========================================
const dateRange = ref<Date[] | null>(null)
const filterOperator = ref<string | null>(null)
const filterModule = ref<string | null>(null)
const filterAction = ref<string | null>(null)
const diffDialogVisible = ref(false)
const selectedLog = ref<typeof logs.value[0] | null>(null)

const tablePassThrough = {
  root: { class: 'border-0' },
  tableContainer: { class: 'border-0' },
  thead: { class: 'border-0' },
  tbody: { class: 'border-0' },
  row: { class: 'border-0 border-b border-surface-700 last:border-0' }
}

// ========================================
// Filter Options
// ========================================
const operatorOptions = ['admin_001', 'finance_001', 'cs_001', 'risk_001']
const moduleOptions = ['會員管理', '財務管理', '代理管理', '系統設定', '人員管理']
const actionOptions = ['新增', '修改', '刪除', '審核', '登入']

// ========================================
// Helper Functions
// ========================================
const getActionSeverity = (action: string): "success" | "warn" | "danger" | "info" | "secondary" | undefined => {
  switch (action) {
    case '新增': return 'success'
    case '修改': return 'info'
    case '刪除': return 'danger'
    case '審核': return 'warn'
    default: return 'secondary'
  }
}

const openDiffDialog = (log: typeof logs.value[0]) => {
  selectedLog.value = log
  diffDialogVisible.value = true
}

// ========================================
// Mock Data
// ========================================
const logs = ref([
  { 
    time: '2026-01-12 11:15:32', 
    operator: 'admin_001', 
    module: '會員管理', 
    action: '修改', 
    target: '會員 U20260112001', 
    ip: '192.168.1.100',
    hasDiff: true,
    before: JSON.stringify({ status: '正常', level: 'VIP1', balance: 10000 }, null, 2),
    after: JSON.stringify({ status: '正常', level: 'VIP2', balance: 10000 }, null, 2)
  },
  { 
    time: '2026-01-12 11:10:22', 
    operator: 'finance_001', 
    module: '財務管理', 
    action: '審核', 
    target: '提現單 W20260112088', 
    ip: '192.168.1.101',
    hasDiff: true,
    before: JSON.stringify({ status: '待審核', amount: 50000 }, null, 2),
    after: JSON.stringify({ status: '已通過', amount: 50000, approver: 'finance_001' }, null, 2)
  },
  { 
    time: '2026-01-12 10:45:18', 
    operator: 'admin_001', 
    module: '人員管理', 
    action: '新增', 
    target: '帳號 cs_005', 
    ip: '192.168.1.100',
    hasDiff: false,
    before: '',
    after: ''
  },
  { 
    time: '2026-01-12 10:30:45', 
    operator: 'cs_001', 
    module: '會員管理', 
    action: '修改', 
    target: '會員 U20260111045', 
    ip: '192.168.1.102',
    hasDiff: true,
    before: JSON.stringify({ phone: '0912345678', email: 'old@test.com' }, null, 2),
    after: JSON.stringify({ phone: '0987654321', email: 'new@test.com' }, null, 2)
  },
  { 
    time: '2026-01-12 10:15:33', 
    operator: 'risk_001', 
    module: '會員管理', 
    action: '修改', 
    target: '會員 U20260110088', 
    ip: '192.168.1.103',
    hasDiff: true,
    before: JSON.stringify({ riskLevel: '正常', tags: [] }, null, 2),
    after: JSON.stringify({ riskLevel: '高風險', tags: ['模擬器', '異常IP'] }, null, 2)
  },
  { 
    time: '2026-01-12 09:45:22', 
    operator: 'admin_001', 
    module: '系統設定', 
    action: '修改', 
    target: '公告 A20260112001', 
    ip: '192.168.1.100',
    hasDiff: true,
    before: JSON.stringify({ title: '系統維護通知', status: '草稿' }, null, 2),
    after: JSON.stringify({ title: '系統維護通知 (更新)', status: '已發布' }, null, 2)
  },
  { 
    time: '2026-01-12 09:30:15', 
    operator: 'finance_001', 
    module: '代理管理', 
    action: '審核', 
    target: '佣金結算 C20260111', 
    ip: '192.168.1.101',
    hasDiff: false,
    before: '',
    after: ''
  },
  { 
    time: '2026-01-12 09:00:08', 
    operator: 'admin_001', 
    module: '人員管理', 
    action: '刪除', 
    target: '帳號 test_001', 
    ip: '192.168.1.100',
    hasDiff: false,
    before: '',
    after: ''
  }
])
</script>

<style scoped>
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
