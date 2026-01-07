<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-wallet text-blue-400"></i>
      <span class="text-surface-300">財務管理</span>
      <span>></span>
      <span class="text-surface-300">審核管理</span>
      <span>></span>
      <span class="text-white font-medium">在線存款查詢</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white text-lg">
            <i class="pi pi-search text-blue-400"></i>
            在線存款搜尋
          </div>
        </div>
      </template>
      <template #content>
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">訂單號</label>
            <InputText v-model="filters.orderId" placeholder="輸入訂單號" class="w-[220px]" />
          </div>
           <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">會員 ID</label>
            <InputText v-model="filters.memberId" placeholder="輸入會員 ID" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">狀態</label>
            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="選擇狀態" class="w-[220px]" showClear />
          </div>
           <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">申請時間</label>
            <Calendar v-model="filters.dateRange" selectionMode="range" :manualInput="false" placeholder="選擇日期範圍" class="w-[220px]" showIcon />
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- List Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-list text-purple-400"></i>
          存款紀錄列表
           <span v-if="hasSearched" class="text-sm text-surface-400 font-normal ml-2">(共 {{ filteredOrders.length }} 筆)</span>
        </div>
      </template>
      <template #content>
         <DataTable :value="filteredOrders" :loading="isSearching" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
             <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
                <p class="text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column field="orderId" header="訂單號" sortable style="min-width: 180px">
                <template #body="slotProps"><span class="font-mono text-sm">{{ slotProps.data.orderId }}</span></template>
            </Column>
            <Column field="memberId" header="會員 ID" sortable style="min-width: 120px">
                 <template #body="slotProps"><span class="text-blue-400 font-medium">{{ slotProps.data.memberId }}</span></template>
            </Column>
            <Column field="merchant" header="支付商號" style="min-width: 140px">
                 <template #body="slotProps">
                    <div class="flex flex-col">
                        <span class="text-white">{{ slotProps.data.merchant }}</span>
                        <span class="text-xs text-surface-500">{{ slotProps.data.paymentMethod }}</span>
                    </div>
                 </template>
            </Column>
            <Column field="amount" header="存款金額" sortable style="min-width: 120px">
                 <template #body="slotProps"><span class="font-mono font-bold text-emerald-400">{{ formatCurrency(slotProps.data.amount) }}</span></template>
            </Column>
            <Column field="applyTime" header="交易時間" sortable style="min-width: 160px">
                 <template #body="slotProps"><span class="text-sm text-surface-400">{{ slotProps.data.applyTime }}</span></template>
            </Column>
             <Column field="status" header="狀態" style="min-width: 120px">
                 <template #body="slotProps"><Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" /></template>
            </Column>
             <Column header="操作" style="min-width: 100px">
                <template #body>
                     <Button icon="pi pi-search" severity="info" rounded text v-tooltip.top="'查看詳情'" />
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
import { useFinanceData } from './useFinanceData'

const toast = useToast()
const { onlineDepositOrders, initData } = useFinanceData()

onMounted(() => {
    initData()
})

const statusOptions = ref([
    { label: '支付成功', value: '支付成功' },
    { label: '支付失敗', value: '支付失敗' },
    { label: '待支付', value: '待支付' },
])

const filters = ref({
    orderId: '',
    memberId: '',
    status: null,
    dateRange: null
})

const isSearching = ref(false)
const hasSearched = ref(false)

const filteredOrders = computed(() => {
    if (!hasSearched.value) return []
    let result = onlineDepositOrders.value
    if (filters.value.orderId) {
        result = result.filter(o => o.orderId.includes(filters.value.orderId))
    }
    if (filters.value.memberId) {
        result = result.filter(o => o.memberId.includes(filters.value.memberId))
    }
    if (filters.value.status) {
        result = result.filter(o => o.status === filters.value.status)
    }
    return result
})

const handleSearch = () => {
    isSearching.value = true
    setTimeout(() => {
        hasSearched.value = true
        isSearching.value = false
        toast.add({ severity: 'success', summary: '搜尋完成', detail: `共找到 ${filteredOrders.value.length} 筆資料`, life: 1000 })
    }, 500)
}

const handleReset = () => {
    filters.value = { orderId: '', memberId: '', status: null, dateRange: null }
    hasSearched.value = false
}

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
const getStatusSeverity = (status: string) => {
    if (status === '支付成功') return 'success'
    if (status === '支付失敗') return 'danger'
    return 'warning'
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: rgba(30, 41, 59, 0.5); color: #94a3b8; border-color: rgba(71, 85, 105, 0.5); padding: 0.75rem 1rem; font-weight: 600; }
:deep(.p-datatable .p-datatable-tbody > tr) { background-color: transparent; }
:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) { background-color: rgba(30, 41, 59, 0.3); }
:deep(.p-datatable .p-datatable-tbody > tr > td) { border-color: rgba(71, 85, 105, 0.3); padding: 0.75rem 1rem; }
:deep(.p-datatable .p-datatable-tbody > tr:hover) { background-color: rgba(59, 130, 246, 0.1); }
:deep(.p-inputtext), :deep(.p-dropdown), :deep(.p-calendar) { background-color: rgba(30, 41, 59, 0.5); border-color: rgba(71, 85, 105, 0.5); }
</style>
