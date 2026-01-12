<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-id-card text-blue-400"></i>
      <span class="text-surface-300">人員管理</span>
      <span>></span>
      <span class="text-white font-medium">匯出中心</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-download text-cyan-400"></i>
          匯出中心
        </h1>
        <p class="text-surface-400 mt-1">Export Center - 非同步報表下載區</p>
      </div>
      <Button 
        icon="pi pi-refresh" 
        label="重新整理"
        severity="secondary"
        @click="refreshList"
      />
    </div>

    <!-- Export Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card class="stat-card">
        <template #content>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/20">
              <i class="pi pi-file text-blue-400"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ stats.total }}</p>
              <p class="text-surface-500 text-xs">總報表數</p>
            </div>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-yellow-500/20">
              <i class="pi pi-spin pi-spinner text-yellow-400"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-yellow-400">{{ stats.processing }}</p>
              <p class="text-surface-500 text-xs">處理中</p>
            </div>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500/20">
              <i class="pi pi-check-circle text-green-400"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-green-400">{{ stats.completed }}</p>
              <p class="text-surface-500 text-xs">已完成</p>
            </div>
          </div>
        </template>
      </Card>
      <Card class="stat-card">
        <template #content>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/20">
              <i class="pi pi-times-circle text-red-400"></i>
            </div>
            <div>
              <p class="text-2xl font-bold text-red-400">{{ stats.failed }}</p>
              <p class="text-surface-500 text-xs">失敗</p>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Export List -->
    <Card class="chart-card">
      <template #title>
        <span>報表列表</span>
      </template>
      <template #content>
        <DataTable 
          :value="exports" 
          :pt="tablePassThrough"
          class="compact-table"
          paginator
          :rows="10"
        >
          <Column field="fileName" header="檔案名稱">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <i :class="['pi', getFileIcon(data.type)]" :style="{ color: getFileColor(data.type) }"></i>
                <span class="text-white">{{ data.fileName }}</span>
              </div>
            </template>
          </Column>
          <Column field="type" header="類型">
            <template #body="{ data }">
              <Tag 
                :value="data.type" 
                :severity="data.type === 'Excel' ? 'success' : 'danger'"
                class="text-xs"
              />
            </template>
          </Column>
          <Column field="module" header="來源模組">
            <template #body="{ data }">
              <span class="text-surface-400">{{ data.module }}</span>
            </template>
          </Column>
          <Column field="status" header="狀態">
            <template #body="{ data }">
              <div class="flex items-center gap-2">
                <i 
                  v-if="data.status === '處理中'"
                  class="pi pi-spin pi-spinner text-yellow-400"
                ></i>
                <Tag 
                  :value="data.status" 
                  :severity="getStatusSeverity(data.status)"
                />
              </div>
            </template>
          </Column>
          <Column field="size" header="檔案大小">
            <template #body="{ data }">
              <span class="text-surface-400">{{ data.size || '-' }}</span>
            </template>
          </Column>
          <Column field="createdAt" header="建立時間">
            <template #body="{ data }">
              <span class="text-surface-400 text-sm">{{ data.createdAt }}</span>
            </template>
          </Column>
          <Column field="requestedBy" header="申請人">
            <template #body="{ data }">
              <span class="text-blue-400">{{ data.requestedBy }}</span>
            </template>
          </Column>
          <Column header="操作">
            <template #body="{ data }">
              <Button 
                v-if="data.status === '已完成'"
                icon="pi pi-download" 
                severity="success" 
                size="small"
                rounded
                v-tooltip.top="'下載'"
                @click="downloadFile(data)"
              />
              <Button 
                v-else-if="data.status === '失敗'"
                icon="pi pi-refresh" 
                severity="warn" 
                size="small"
                rounded
                text
                v-tooltip.top="'重試'"
                @click="retryExport(data)"
              />
              <span v-else class="text-surface-600">-</span>
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
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'

// ========================================
// State
// ========================================
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
const getFileIcon = (type: string): string => {
  return type === 'Excel' ? 'pi-file-excel' : 'pi-file-pdf'
}

const getFileColor = (type: string): string => {
  return type === 'Excel' ? '#22c55e' : '#ef4444'
}

const getStatusSeverity = (status: string): "success" | "warn" | "danger" | "info" | "secondary" | undefined => {
  switch (status) {
    case '已完成': return 'success'
    case '處理中': return 'warn'
    case '失敗': return 'danger'
    default: return 'secondary'
  }
}

const refreshList = () => {
  console.log('Refreshing export list...')
}

const downloadFile = (data: typeof exports.value[0]) => {
  console.log('Downloading:', data.fileName)
}

const retryExport = (data: typeof exports.value[0]) => {
  console.log('Retrying:', data.fileName)
}

// ========================================
// Mock Data
// ========================================
const exports = ref([
  { fileName: '會員列表_20260112.xlsx', type: 'Excel', module: '會員管理', status: '已完成', size: '2.3 MB', createdAt: '2026-01-12 11:00', requestedBy: 'admin_001' },
  { fileName: '財務日報_20260112.xlsx', type: 'Excel', module: '財務管理', status: '處理中', size: '', createdAt: '2026-01-12 10:45', requestedBy: 'finance_001' },
  { fileName: '代理佣金結算_202601.pdf', type: 'PDF', module: '代理管理', status: '已完成', size: '1.8 MB', createdAt: '2026-01-12 10:30', requestedBy: 'finance_001' },
  { fileName: '操作日誌_20260111.xlsx', type: 'Excel', module: '人員管理', status: '已完成', size: '856 KB', createdAt: '2026-01-12 09:15', requestedBy: 'admin_001' },
  { fileName: '會員投注紀錄_20260110.xlsx', type: 'Excel', module: '會員管理', status: '失敗', size: '', createdAt: '2026-01-11 18:30', requestedBy: 'cs_001' },
  { fileName: '月度營收報表_202512.pdf', type: 'PDF', module: '財務管理', status: '已完成', size: '3.2 MB', createdAt: '2026-01-10 14:00', requestedBy: 'admin_001' },
  { fileName: '新會員分析_202512.xlsx', type: 'Excel', module: '會員管理', status: '已完成', size: '1.1 MB', createdAt: '2026-01-09 16:45', requestedBy: 'cs_001' }
])

const stats = computed(() => ({
  total: exports.value.length,
  processing: exports.value.filter(e => e.status === '處理中').length,
  completed: exports.value.filter(e => e.status === '已完成').length,
  failed: exports.value.filter(e => e.status === '失敗').length
}))
</script>

<style scoped>
.stat-card :deep(.p-card-body) {
  padding: 1rem;
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
