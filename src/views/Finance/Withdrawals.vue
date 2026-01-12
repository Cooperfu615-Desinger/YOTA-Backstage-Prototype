<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-wallet text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">財務管理</span>
      <span>></span>
      <span class="text-surface-500 dark:text-surface-300">審核管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">提款審核</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
            <i class="pi pi-search text-blue-500 dark:text-blue-400"></i>
            提款訂單搜尋
          </div>
        </div>
      </template>
      <template #content>
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">訂單號</label>
            <InputText v-model="filters.orderId" placeholder="輸入訂單號" class="w-[220px]" />
          </div>
           <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">會員 ID</label>
            <InputText v-model="filters.memberId" placeholder="輸入會員 ID" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">狀態</label>
            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="選擇狀態" class="w-[220px]" showClear />
          </div>
           <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">申請時間</label>
            <Calendar v-model="filters.dateRange" selectionMode="range" :manualInput="false" placeholder="選擇日期範圍" class="w-[220px]" showIcon />
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- Withdrawal List Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-list text-purple-500 dark:text-purple-400"></i>
          提款申請列表
           <span v-if="hasSearched" class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ filteredOrders.length }} 筆)</span>
        </div>
      </template>
      <template #content>
         <DataTable :value="filteredOrders" :loading="isSearching" stripedRows class="p-datatable-sm" :rowClass="rowClass" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
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
                    <div class="flex flex-col">
                         <span class="text-blue-400 cursor-pointer hover:underline font-medium" @click="showMemberDetail(slotProps.data.memberId)">{{ slotProps.data.memberId }}</span>
                         <div class="flex gap-1 mt-1">
                             <Tag v-for="tag in slotProps.data.tags" :key="tag" :value="tag" severity="danger" class="text-[10px] px-1 py-0" />
                         </div>
                    </div>
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
                        @click="handleOpenAudit(slotProps.data)" 
                    />
                    <Button v-else-if="slotProps.data.status === '審核中' && slotProps.data.processor === currentUser" 
                        label="查看"
                        icon="pi pi-file-edit" 
                        severity="info" 
                        size="small" 
                        outlined
                        @click="handleOpenAudit(slotProps.data)" 
                    />
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <!-- Audit Modal -->
    <Dialog v-model:visible="auditModalVisible" modal header="提款審核決策看板" :style="{ width: '1000px' }" class="p-0">
        <div v-if="currentOrder" class="flex flex-col h-full">
            <!-- Upper: Data Dashboard -->
            <div class="grid grid-cols-12 gap-6 p-6 bg-surface-100 dark:bg-surface-900/50">
                <!-- 1. Member Info & Risk -->
                <div class="col-span-4 border-r border-surface-200 dark:border-surface-700 pr-6">
                    <h3 class="text-surface-500 dark:text-surface-400 text-sm mb-3 font-medium">會員資訊與風險</h3>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-2xl font-bold text-surface-900 dark:text-white">{{ currentOrder.memberId }}</span>
                        <Button icon="pi pi-copy" text rounded size="small" class="p-0 h-6 w-6" />
                    </div>
                    <div class="flex flex-wrap gap-2 mb-4">
                        <Tag v-for="tag in currentOrder.tags" :key="tag" :value="tag" 
                             :severity="tag === '高風險' ? 'danger' : 'warning'" 
                             :class="{'animate-pulse': tag === '高風險'}" />
                    </div>
                    <div class="flex justify-between items-center text-sm py-1 border-b border-surface-200 dark:border-surface-800">
                        <span class="text-surface-500 dark:text-surface-400">註冊時間</span>
                        <span class="text-surface-900 dark:text-surface-0">2023-11-12</span>
                    </div>
                    <div class="flex justify-between items-center text-sm py-1 border-b border-surface-200 dark:border-surface-800">
                         <span class="text-surface-500 dark:text-surface-400">最後登入</span>
                        <span class="text-surface-900 dark:text-surface-0">10 分鐘前</span>
                    </div>
                </div>

                <!-- 2. Financial Stats -->
                <div class="col-span-4 border-r border-surface-200 dark:border-surface-700 pr-6 pl-2">
                     <h3 class="text-surface-500 dark:text-surface-400 text-sm mb-3 font-medium">財務統計概覽</h3>
                     <div class="space-y-3">
                         <div class="flex justify-between items-center">
                             <span class="text-surface-500 dark:text-surface-400">總存款</span>
                             <span class="text-emerald-500 dark:text-emerald-400 font-mono">{{ formatCurrency(currentOrder.financialStats.totalDeposit) }}</span>
                         </div>
                         <div class="flex justify-between items-center">
                             <span class="text-surface-500 dark:text-surface-400">總提款</span>
                             <span class="text-orange-500 dark:text-orange-400 font-mono">{{ formatCurrency(currentOrder.financialStats.totalWithdrawal) }}</span>
                         </div>
                         <div class="flex justify-between items-center pt-2 border-t border-surface-200 dark:border-surface-700">
                             <span class="text-surface-900 dark:text-white font-medium">當前餘額</span>
                             <span class="text-blue-500 dark:text-blue-400 font-mono font-bold">{{ formatCurrency(currentOrder.financialStats.balance) }}</span>
                         </div>
                     </div>
                </div>

                <!-- 3. Rollover Check -->
                <div class="col-span-4 pl-2">
                    <h3 class="text-surface-500 dark:text-surface-400 text-sm mb-3 font-medium">流水稽核 (Rollover)</h3>
                    <div class="mb-2 flex justify-between text-sm">
                        <span class="text-surface-900 dark:text-surface-0">達成率</span>
                        <span :class="rolloverPercentage >= 100 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'">{{ rolloverPercentage }}%</span>
                    </div>
                    <ProgressBar :value="Math.min(rolloverPercentage, 100)" :showValue="false" 
                        :pt="{ 
                            root: { class: 'h-3 bg-surface-200 dark:bg-surface-700 rounded-full' }, 
                            value: { class: rolloverPercentage >= 100 ? 'bg-green-500' : 'bg-red-500' } 
                        }" 
                    />
                    <div class="flex justify-between text-xs mt-2 text-surface-500 dark:text-surface-400">
                        <span>目前: {{ formatCurrency(currentOrder.rollover.current) }}</span>
                        <span>所需: {{ formatCurrency(currentOrder.rollover.required) }}</span>
                    </div>
                    <div v-if="rolloverPercentage < 100" class="mt-3 bg-red-100 dark:bg-red-500/10 border border-red-500/30 rounded p-2 flex items-center gap-2 text-red-600 dark:text-red-300 text-xs">
                        <i class="pi pi-exclamation-triangle"></i>
                        流水未達標，建議拒絕或扣除手續費
                    </div>
                </div>
            </div>

            <!-- Lower: Action Panel -->
            <div class="p-6 bg-surface-50 dark:bg-surface-800 space-y-6">
                <!-- Channel Selection -->
                <div class="grid grid-cols-2 gap-6">
                     <div class="space-y-2">
                        <label class="text-surface-500 dark:text-surface-300 text-sm">出金通道選擇</label>
                        <Dropdown v-model="outChannel" :options="channelOptions" optionLabel="label" class="w-full" placeholder="請選擇出金商號/銀行卡" />
                     </div>
                     <div class="space-y-2">
                        <label class="text-surface-500 dark:text-surface-300 text-sm">預計手續費</label>
                        <div class="h-[46px] flex items-center px-3 bg-surface-100 dark:bg-surface-900/50 rounded border border-surface-200 dark:border-surface-700 text-surface-500 dark:text-surface-300">
                            {{ formatCurrency(35) }} (由公司承擔)
                        </div>
                     </div>
                </div>

                <!-- Reject Reason Input (Conditionally Validated) -->
                <div v-if="isRejectMode" class="space-y-2 animate-fade-in">
                    <label class="text-red-500 dark:text-red-400 text-sm font-bold">拒絕原因 (必填)</label>
                    <Textarea v-model="rejectReason" rows="3" class="w-full" placeholder="請詳細說明拒絕理由..." :class="{'p-invalid': showRejectError}" />
                    <small v-if="showRejectError" class="text-red-500 dark:text-red-400">請輸入拒絕理由</small>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-between border-t border-surface-200 dark:border-surface-700 pt-6">
                    <Button label="解鎖並退出" icon="pi pi-lock-open" severity="secondary" outlined @click="handleUnlockAndExit" />
                    
                    <div class="flex gap-3">
                        <Button label="拒絕提款" icon="pi pi-times" severity="danger" :outlined="!isRejectMode" @click="handleRejectClick" />
                        <Button label="通過審核" icon="pi pi-check" severity="success" @click="handleApproveClick" v-if="!isRejectMode" />
                        <Button label="確認拒絕" icon="pi pi-times-circle" severity="danger" @click="confirmReject" v-if="isRejectMode" />
                    </div>
                </div>
            </div>
        </div>
    </Dialog>

    <!-- Confirm Dialog -->
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
import ProgressBar from 'primevue/progressbar'
import Textarea from 'primevue/textarea'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useFinanceData, type WithdrawalOrder } from './useFinanceData'

const toast = useToast()
const confirm = useConfirm()
const currentUser = 'Admin' 

const { withdrawalOrders, initData, lockOrder, processOrder, unlockOrder } = useFinanceData()

onMounted(() => {
    initData()
})

// === Search & List Logic ===
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
const hasSearched = ref(false)

const filteredOrders = computed(() => {
    if (!hasSearched.value) return []
    let result = withdrawalOrders.value
    if (filters.value.orderId) result = result.filter(o => o.orderId.includes(filters.value.orderId))
    if (filters.value.memberId) result = result.filter(o => o.memberId.includes(filters.value.memberId))
    if (filters.value.status) result = result.filter(o => o.status === filters.value.status)
    return result
})

const showMemberDetail = (id: string) => {
    toast.add({ severity: 'info', summary: '會員詳情', detail: `即將開啟會員 ${id} 詳情...`, life: 1000 })
}

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
    hasSearched.value = false
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
const rowClass = (data: WithdrawalOrder) => data.status === '審核中' ? 'bg-orange-500/10' : ''

// === Modal & Audit Logic ===
const auditModalVisible = ref(false)
const currentOrder = ref<WithdrawalOrder | null>(null)
const outChannel = ref(null)
const rejectReason = ref('')
const isRejectMode = ref(false)
const showRejectError = ref(false)

const channelOptions = ref([
    { label: 'Merchant_A (綠界)', value: 'A' },
    { label: 'Merchant_B (藍新)', value: 'B' },
    { label: 'Bank_01 (公司中信)', value: 'Bank1' },
])

const rolloverPercentage = computed(() => {
    if (!currentOrder.value || currentOrder.value.rollover.required === 0) return 100
    return Math.floor((currentOrder.value.rollover.current / currentOrder.value.rollover.required) * 100)
})

const handleOpenAudit = (order: WithdrawalOrder) => {
    // If pending, try to lock
    if (order.status === '待審核') {
        const success = lockOrder(order.orderId, currentUser)
        if (!success) {
            toast.add({ severity: 'error', summary: '無法鎖定', detail: '訂單可能已被處理', life: 2000 })
            return
        }
        toast.add({ severity: 'success', summary: '鎖定成功', detail: '進入審核模式', life: 1000 })
    }
    
    // Prepare Modal
    currentOrder.value = order
    outChannel.value = null
    rejectReason.value = ''
    isRejectMode.value = false
    showRejectError.value = false
    auditModalVisible.value = true
}

const handleUnlockAndExit = () => {
    if (currentOrder.value) {
        unlockOrder(currentOrder.value.orderId)
        auditModalVisible.value = false
        toast.add({ severity: 'info', summary: '已解鎖', detail: '已退出審核', life: 1000 })
    }
}

const handleApproveClick = () => {
    if (!outChannel.value) {
        toast.add({ severity: 'warn', summary: '請選擇通道', detail: '必須選擇出金通道', life: 2000 })
        return
    }

    confirm.require({
        message: `確定要通過此提款申請？\n金額: ${formatCurrency(currentOrder.value!.amount)}`,
        header: '二次確認',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-success',
        accept: () => {
            if (currentOrder.value) {
                const success = processOrder(currentOrder.value.orderId, '已通過')
                if (success) {
                    auditModalVisible.value = false
                    toast.add({ severity: 'success', summary: '訂單處理完成', detail: `訂單 ${currentOrder.value.orderId} 已成功出金`, life: 3000 })
                }
            }
        }
    })
}

const handleRejectClick = () => {
    isRejectMode.value = true
}

const confirmReject = () => {
    if (!rejectReason.value.trim()) {
        showRejectError.value = true
        return
    }
    
    if (currentOrder.value) {
        const success = processOrder(currentOrder.value.orderId, '已拒絕')
        if (success) {
            auditModalVisible.value = false
            toast.add({ severity: 'error', summary: '已拒絕', detail: `訂單 ${currentOrder.value.orderId} 已駁回`, life: 3000 })
        }
    }
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
:deep(.p-datatable-tbody > tr > td) { padding: 0.75rem 1rem; }
:deep(.bg-orange-100) { background-color: #ffedd5 !important; }
:deep(.dark .bg-orange-500\/10) { background-color: rgba(249, 115, 22, 0.1) !important; }
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>
