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
            <label class="text-surface-300 text-sm font-medium">金流商號</label>
            <Dropdown v-model="filters.merchant" :options="merchantOptions" optionLabel="label" optionValue="value" placeholder="選擇商號" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">狀態</label>
            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="選擇狀態" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">時間範圍</label>
            <Calendar v-model="filters.dateRange" selectionMode="range" :manualInput="false" placeholder="選擇日期範圍" class="w-[220px]" showIcon />
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- Deposit List Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-list text-purple-400"></i>
          金流訂單列表
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
            <Column field="orderId" header="訂單號" style="min-width: 180px">
                <template #body="slotProps">
                    <span class="font-mono text-sm text-blue-400 cursor-pointer hover:underline" @click="openDetailModal(slotProps.data)">{{ slotProps.data.orderId }}</span>
                </template>
            </Column>
            <Column field="memberId" header="會員 ID" style="min-width: 120px">
                 <template #body="slotProps">
                    <span class="text-surface-300 font-medium">{{ slotProps.data.memberId }}</span>
                </template>
            </Column>
            <Column field="amount" header="訂單金額" style="min-width: 100px">
                 <template #body="slotProps">
                     <span class="font-mono">{{ formatCurrency(slotProps.data.amount) }}</span>
                </template>
            </Column>
             <Column field="actualAmount" header="實際入款" style="min-width: 100px">
                 <template #body="slotProps">
                     <div class="flex flex-col">
                        <span class="font-mono font-bold text-white">{{ formatCurrency(slotProps.data.actualAmount) }}</span>
                        <span class="text-xs text-surface-500">費率: {{ formatCurrency(slotProps.data.fee) }}</span>
                     </div>
                </template>
            </Column>
            <Column header="支付通道" style="min-width: 160px">
                 <template #body="slotProps">
                    <div class="flex flex-col">
                        <span class="text-white text-sm">{{ slotProps.data.merchant }}</span>
                        <span class="text-xs text-surface-400">{{ slotProps.data.type }}</span>
                    </div>
                </template>
            </Column>
            <Column field="applyTime" header="支付時間" style="min-width: 160px">
                 <template #body="slotProps">
                    <span class="text-sm text-surface-400">{{ slotProps.data.applyTime }}</span>
                </template>
            </Column>
             <Column field="status" header="狀態" style="min-width: 120px">
                 <template #body="slotProps">
                    <div class="flex items-center gap-2">
                         <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                         <span v-if="slotProps.data.callbackStatus" 
                            class="w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-surface-900"
                            :class="slotProps.data.callbackStatus === 'received' ? 'bg-green-500 ring-green-500/30' : 'bg-gray-600 ring-gray-600/30'"
                            v-tooltip.top="'回調狀態'"
                         ></span>
                    </div>
                </template>
            </Column>
            <Column header="操作" style="min-width: 100px" frozen alignFrozen="right">
                <template #body="slotProps">
                    <Button v-if="slotProps.data.status === '支付成功' && slotProps.data.dispatchStatus === 'failed'" 
                        label="補發" 
                        icon="pi pi-replay" 
                        severity="warning" 
                        size="small" 
                        @click="handleReissue(slotProps.data)" 
                    />
                     <span v-else-if="slotProps.data.status === '支付成功' && slotProps.data.dispatchStatus === 'success'" class="text-green-500 text-xs flex items-center gap-1">
                        <i class="pi pi-check-circle"></i> 已入帳
                     </span>
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <!-- Detail Modal -->
    <Dialog v-model:visible="detailModalVisible" modal :header="`訂單詳情 - ${currentOrder?.orderId}`" :style="{ width: '800px' }">
        <div v-if="currentOrder" class="h-[500px] flex flex-col">
            <div class="flex gap-2 mb-4 border-b border-surface-700 pb-2">
                 <Button label="日誌追蹤" text :class="activeTab === 'logs' ? 'text-primary' : 'text-surface-400'" @click="activeTab = 'logs'" />
                 <Button label="原始報文" text :class="activeTab === 'json' ? 'text-primary' : 'text-surface-400'" @click="activeTab = 'json'" />
            </div>

            <div class="flex-1 overflow-auto custom-scrollbar">
                <!-- Log View -->
                <div v-if="activeTab === 'logs'" class="space-y-4 p-2">
                    <div v-for="(log, idx) in currentOrder.lifecycleLogs" :key="idx" class="flex gap-4 items-start">
                        <div class="w-[150px] text-xs text-surface-400 font-mono">{{ log.time.replace('T', ' ').substring(0, 19) }}</div>
                        <div class="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0"></div>
                        <div class="flex-1">
                            <div class="text-sm text-white font-medium">{{ log.event }}</div>
                            <div class="text-xs" :class="log.status === 'Success' ? 'text-green-400' : 'text-red-400'">{{ log.status }}</div>
                        </div>
                    </div>
                </div>
                
                <!-- JSON View -->
                <div v-if="activeTab === 'json'" class="bg-black/30 p-4 rounded font-mono text-xs text-surface-300 overflow-auto">
                    <pre>{{ currentOrder.rawCallbackJson || '無原始報文記錄' }}</pre>
                </div>
            </div>
        </div>
    </Dialog>

    <ConfirmDialog />
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
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useFinanceData, type DepositOrder } from './useFinanceData'

const toast = useToast()
const confirm = useConfirm()
const { onlineDepositOrders, initData, reissueOrder } = useFinanceData()

onMounted(() => {
    initData()
})

const merchantOptions = ref([
    { label: 'MCH_888 (綠界)', value: 'MCH_888 (綠界)' },
    { label: 'MCH_999 (藍新)', value: 'MCH_999 (藍新)' },
    { label: 'MCH_777 (LinePay)', value: 'MCH_777 (LinePay)' },
])

const statusOptions = ref([
    { label: '支付成功', value: '支付成功' },
    { label: '支付失敗', value: '支付失敗' },
    { label: '待支付', value: '待支付' },
])

const filters = ref({
    orderId: '',
    memberId: '',
    merchant: null,
    status: null,
    dateRange: null
})

const isSearching = ref(false)
const hasSearched = ref(false)

const filteredOrders = computed(() => {
    if (!hasSearched.value) return []
    let result = onlineDepositOrders.value
    if (filters.value.orderId) result = result.filter(o => o.orderId.includes(filters.value.orderId))
    if (filters.value.memberId) result = result.filter(o => o.memberId.includes(filters.value.memberId))
    if (filters.value.merchant) result = result.filter(o => o.merchant === filters.value.merchant)
    if (filters.value.status) result = result.filter(o => o.status === filters.value.status)
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
    filters.value = { orderId: '', memberId: '', merchant: null, status: null, dateRange: null }
    hasSearched.value = false
}

// === Detail Modal ===
const detailModalVisible = ref(false)
const currentOrder = ref<DepositOrder | null>(null)
const activeTab = ref<'logs' | 'json'>('logs')

const openDetailModal = (order: DepositOrder) => {
    currentOrder.value = order
    activeTab.value = 'logs'
    detailModalVisible.value = true
}

// === Re-issue Logic ===
const handleReissue = (order: DepositOrder) => {
    confirm.require({
        message: `確定要手動補發此訂單？\n訂單號: ${order.orderId}\n系統將直接對會員錢包進行加點。`,
        header: '補發確認',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-warning',
        accept: () => {
            const success = reissueOrder(order.orderId)
            if (success) {
                toast.add({ severity: 'success', summary: '補發成功', detail: `訂單 ${order.orderId} 已重新派發`, life: 3000 })
            } else {
                 toast.add({ severity: 'error', summary: '補發失敗', detail: `訂單狀態異常`, life: 3000 })
            }
        }
    })
}

// === Helpers ===
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
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(71, 85, 105, 0.5); border-radius: 4px; }
</style>
