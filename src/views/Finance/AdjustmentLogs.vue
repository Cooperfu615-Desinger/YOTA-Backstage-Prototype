<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-wallet text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">財務管理</span>
      <span>></span>
      <span class="text-surface-500 dark:text-surface-300">紀錄查詢</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">人工存提紀錄</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
            <i class="pi pi-search text-blue-500 dark:text-blue-400"></i>
            人工存提搜尋
          </div>
        </div>
      </template>
      <template #content>
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">會員 ID</label>
            <InputText v-model="filters.memberId" placeholder="輸入會員 ID" class="w-[220px]" />
          </div>
           <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">操作管理員</label>
            <InputText v-model="filters.operator" placeholder="輸入管理員" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">操作類型</label>
            <Dropdown v-model="filters.operationType" :options="operationTypeOptions" optionLabel="label" optionValue="value" placeholder="選擇類型" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">審核狀態</label>
            <Dropdown v-model="filters.approvalStatus" :options="approvalStatusOptions" optionLabel="label" optionValue="value" placeholder="選擇狀態" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">時間範圍</label>
            <Calendar v-model="filters.dateRange" selectionMode="range" :manualInput="false" placeholder="選擇日期範圍" class="w-[220px]" showIcon />
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- Adjustment Logs List Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-pencil text-purple-500 dark:text-purple-400"></i>
          人工存提列表
           <span v-if="hasSearched" class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ filteredLogs.length }} 筆)</span>
        </div>
      </template>
      <template #content>
         <DataTable :value="filteredLogs" :loading="isSearching" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
                <p class="text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column field="time" header="操作時間" style="min-width: 160px">
                 <template #body="slotProps">
                    <span class="text-sm text-surface-500 dark:text-surface-400">{{ slotProps.data.time }}</span>
                </template>
            </Column>
            <Column field="memberId" header="會員 ID" style="min-width: 120px">
                 <template #body="slotProps">
                    <span class="text-surface-500 dark:text-surface-300 font-medium">{{ slotProps.data.memberId }}</span>
                </template>
            </Column>
            <Column field="operator" header="操作管理員" style="min-width: 120px">
                 <template #body="slotProps">
                    <div class="flex items-center gap-1">
                        <i class="pi pi-user text-xs text-blue-500 dark:text-blue-400"></i>
                        <span>{{ slotProps.data.operator }}</span>
                    </div>
                </template>
            </Column>
            <Column field="operationType" header="操作類型" style="min-width: 100px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.operationType" :severity="slotProps.data.operationType === '增點' ? 'success' : 'danger'" />
                </template>
            </Column>
            <Column field="amount" header="異動金額" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono font-bold" :class="slotProps.data.operationType === '增點' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'">
                        {{ slotProps.data.operationType === '增點' ? '+' : '-' }}{{ formatCurrency(slotProps.data.amount) }}
                     </span>
                </template>
            </Column>
            <Column field="reason" header="操作原因" style="min-width: 200px">
                 <template #body="slotProps">
                    <span class="text-sm text-surface-500 dark:text-surface-400 truncate max-w-[180px] block" :title="slotProps.data.reason">{{ slotProps.data.reason }}</span>
                </template>
            </Column>
            <Column field="approvalStatus" header="審核狀態" style="min-width: 120px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.approvalStatus" :severity="getApprovalSeverity(slotProps.data.approvalStatus)" />
                </template>
            </Column>
            <Column field="approver" header="審核人" style="min-width: 100px">
                 <template #body="slotProps">
                    <span v-if="slotProps.data.approver" class="text-surface-500 dark:text-surface-300">{{ slotProps.data.approver }}</span>
                    <span v-else class="text-surface-500">-</span>
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Calendar from 'primevue/calendar'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

onMounted(() => {
    generateMockData()
})

const operationTypeOptions = ref([
    { label: '增點', value: '增點' },
    { label: '減點', value: '減點' },
])

const approvalStatusOptions = ref([
    { label: '待審核', value: '待審核' },
    { label: '已通過', value: '已通過' },
    { label: '已拒絕', value: '已拒絕' },
])

const filters = ref({
    memberId: '',
    operator: '',
    operationType: null,
    approvalStatus: null,
    dateRange: null
})

const isSearching = ref(false)
const hasSearched = ref(false)
const adjustmentLogs = ref<any[]>([])

const filteredLogs = computed(() => {
    if (!hasSearched.value) return []
    let result = adjustmentLogs.value
    
    if (filters.value.memberId) {
        result = result.filter(log => log.memberId.includes(filters.value.memberId))
    }
    if (filters.value.operator) {
        result = result.filter(log => log.operator.toLowerCase().includes(filters.value.operator.toLowerCase()))
    }
    if (filters.value.operationType) {
        result = result.filter(log => log.operationType === filters.value.operationType)
    }
    if (filters.value.approvalStatus) {
        result = result.filter(log => log.approvalStatus === filters.value.approvalStatus)
    }
    
    return result
})

const handleSearch = () => {
    isSearching.value = true
    setTimeout(() => {
        hasSearched.value = true
        isSearching.value = false
        toast.add({ severity: 'success', summary: '搜尋完成', detail: `共找到 ${filteredLogs.value.length} 筆資料`, life: 1000 })
    }, 500)
}

const handleReset = () => {
    filters.value = { memberId: '', operator: '', operationType: null, approvalStatus: null, dateRange: null }
    hasSearched.value = false
}

const generateMockData = () => {
    const logs: any[] = []
    const operators = ['Admin', 'Manager_01', 'CS_Leader', 'Finance_Ops']
    const approvers = ['Director', 'CFO', 'Supervisor']
    const reasons = [
        '客訴補償',
        '系統錯誤退款',
        '活動獎勵發放',
        '人工調整餘額',
        '重複存款退還',
        '違規扣點',
        '投訴補償',
        'VIP 專屬獎勵'
    ]
    const statuses = ['待審核', '已通過', '已拒絕']
    
    for (let i = 0; i < 30; i++) {
        const operationType = Math.random() > 0.5 ? '增點' : '減點'
        const status = statuses[Math.floor(Math.random() * statuses.length)]!
        
        logs.push({
            id: i,
            time: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400 * 1000)).toISOString().replace('T', ' ').substring(0, 19),
            memberId: `user${1000 + Math.floor(Math.random() * 100)}`,
            operator: operators[Math.floor(Math.random() * operators.length)]!,
            operationType,
            amount: Math.floor(Math.random() * 10000) + 100,
            reason: reasons[Math.floor(Math.random() * reasons.length)]!,
            approvalStatus: status,
            approver: status !== '待審核' ? approvers[Math.floor(Math.random() * approvers.length)] : null
        })
    }
    
    adjustmentLogs.value = logs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
}

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)

const getApprovalSeverity = (status: string) => {
    const severityMap: Record<string, string> = {
        '待審核': 'warning',
        '已通過': 'success',
        '已拒絕': 'danger'
    }
    return severityMap[status] || 'info'
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
:deep(.p-datatable-tbody > tr > td) { padding: 0.75rem 1rem; }
</style>
