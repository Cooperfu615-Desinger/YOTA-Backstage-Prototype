<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-wallet text-blue-400"></i>
      <span class="text-surface-300">財務管理</span>
      <span>></span>
      <span class="text-surface-300">審核管理</span>
      <span>></span>
      <span class="text-white font-medium">提款審核</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white text-lg">
            <i class="pi pi-search text-blue-400"></i>
            提款訂單搜尋
          </div>
        </div>
      </template>
      <template #content>
        <!-- Search Fields -->
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

        <!-- Search & Reset Buttons -->
        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- Withdrawal List Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-list text-purple-400"></i>
          提款申請列表
           <span v-if="hasSearched" class="text-sm text-surface-400 font-normal ml-2">(共 {{ filteredOrders.length }} 筆)</span>
        </div>
      </template>
      <template #content>
         <DataTable :value="filteredOrders" :loading="isSearching" stripedRows class="p-datatable-sm" :rowClass="rowClass" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
                <p class="text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column field="orderId" header="訂單號" style="min-width: 180px">
                <template #body="slotProps">
                    <span class="font-mono text-sm">{{ slotProps.data.orderId }}</span>
                </template>
            </Column>
            <Column field="memberId" header="會員 ID" style="min-width: 120px">
                 <template #body="slotProps">
                    <span class="text-blue-400 cursor-pointer hover:underline font-medium" @click="showMemberDetail(slotProps.data.memberId)">{{ slotProps.data.memberId }}</span>
                </template>
            </Column>
            <Column field="amount" header="提款金額" style="min-width: 120px">
                 <template #body="slotProps">
                    <span class="font-mono font-bold text-white">{{ formatCurrency(slotProps.data.amount) }}</span>
                </template>
            </Column>
             <Column field="fee" header="手續費" style="min-width: 100px">
                 <template #body="slotProps">
                    <span class="text-surface-400">{{ formatCurrency(slotProps.data.fee) }}</span>
                </template>
            </Column>
             <Column field="actualAmount" header="實際到帳" style="min-width: 120px">
                 <template #body="slotProps">
                    <span class="font-mono text-emerald-400 font-bold">{{ formatCurrency(slotProps.data.actualAmount) }}</span>
                </template>
            </Column>
            <Column field="applyTime" header="申請時間" style="min-width: 160px">
                 <template #body="slotProps">
                    <span class="text-sm text-surface-400">{{ slotProps.data.applyTime }}</span>
                </template>
            </Column>
             <Column field="status" header="狀態" style="min-width: 120px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </template>
            </Column>
            <Column field="processor" header="處理人" style="min-width: 120px">
                 <template #body="slotProps">
                    <div v-if="slotProps.data.processor" class="flex items-center gap-1">
                        <i class="pi pi-lock text-xs text-orange-400"></i>
                        <span>{{ slotProps.data.processor }}</span>
                    </div>
                     <span v-else class="text-surface-500">-</span>
                </template>
            </Column>
            <Column header="操作" style="min-width: 140px" frozen alignFrozen="right">
                <template #body="slotProps">
                    <Button v-if="slotProps.data.status === '待審核' && !slotProps.data.processor" 
                        label="我要審核" 
                        icon="pi pi-lock" 
                        severity="warning" 
                        size="small" 
                        @click="handleLock(slotProps.data)" 
                    />
                    <div v-else-if="slotProps.data.status === '審核中' && slotProps.data.processor === currentUser" class="flex gap-2">
                         <Button icon="pi pi-check" severity="success" rounded text v-tooltip.top="'通過'" @click="handleApprove(slotProps.data)" />
                         <Button icon="pi pi-times" severity="danger" rounded text v-tooltip.top="'拒絕'" @click="handleReject(slotProps.data)" />
                    </div>
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
import { useFinanceData, type WithdrawalOrder } from './useFinanceData'

const toast = useToast()
const currentUser = 'Admin' // Simulated current user

const { withdrawalOrders, initData, lockOrder, processOrder } = useFinanceData()

onMounted(() => {
    initData()
})

const statusOptions = ref([
    { label: '待審核', value: '待審核' },
    { label: '審核中', value: '審核中' },
    { label: '已通過', value: '已通過' },
    { label: '已拒絕', value: '已拒絕' },
     { label: '已沖正', value: '已沖正' },
])

const filters = ref({
    orderId: '',
    memberId: '',
    status: null,
    dateRange: null
})

const isSearching = ref(false)
const hasSearched = ref(false) // Initially false, or true if we want to show all data on load

// Computed filtered orders to simulate backend search
const filteredOrders = computed(() => {
    if (!hasSearched.value) return []
    let result = withdrawalOrders.value
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
    }, 600)
}

const handleReset = () => {
    filters.value = { orderId: '', memberId: '', status: null, dateRange: null }
    hasSearched.value = false // Optional: reset list or keep it
}

const handleLock = (order: WithdrawalOrder) => {
    // Optimistic UI update handled by shared store
    const success = lockOrder(order.orderId, currentUser)
    if (success) {
        toast.add({ severity: 'success', summary: '已鎖定', detail: '訂單已鎖定，請開始審核', life: 2000 })
    } else {
        toast.add({ severity: 'error', summary: '鎖定失敗', detail: '訂單狀態可能已變更', life: 2000 })
    }
}

const handleApprove = (order: WithdrawalOrder) => {
     const success = processOrder(order.orderId, '已通過')
     if (success) toast.add({ severity: 'success', summary: '審核通過', detail: '提款已批准', life: 2000 })
}

const handleReject = (order: WithdrawalOrder) => {
      const success = processOrder(order.orderId, '已拒絕')
      if (success) toast.add({ severity: 'error', summary: '審核拒絕', detail: '提款已駁回', life: 2000 })
}

const showMemberDetail = (id: string) => {
    toast.add({ severity: 'info', summary: '會員詳情', detail: `即將開啟會員 ${id} 詳情...`, life: 1000 })
}

const formatCurrency = (val: number) => {
     return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
}

const getStatusSeverity = (status: string) => {
    switch (status) {
        case '待審核': return 'warning'
        case '審核中': return 'info'
        case '已通過': return 'success'
        case '已拒絕': return 'danger'
        case '已沖正': return 'secondary'
        default: return 'info'
    }
}

const rowClass = (data: WithdrawalOrder) => {
    return data.status === '審核中' ? 'bg-orange-500/10' : ''
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
:deep(.bg-orange-500\/10) { background-color: rgba(249, 115, 22, 0.1) !important; }
</style>
