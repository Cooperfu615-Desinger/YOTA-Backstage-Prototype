<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-wallet text-blue-400"></i>
      <span class="text-surface-300">財務管理</span>
      <span>></span>
      <span class="text-surface-300">審核管理</span>
      <span>></span>
      <span class="text-white font-medium">手工存款審核</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white text-lg">
            <i class="pi pi-search text-blue-400"></i>
            手工存款搜尋
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
            <label class="text-surface-300 text-sm font-medium">存款類型</label>
            <Dropdown v-model="filters.type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="選擇類型" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">狀態</label>
            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="選擇狀態" class="w-[220px]" showClear />
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
          存款申請列表
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
            <Column field="applyTime" header="申請時間" style="min-width: 160px">
                 <template #body="slotProps">
                    <span class="text-sm text-surface-400">{{ slotProps.data.applyTime }}</span>
                </template>
            </Column>
            <Column field="orderId" header="訂單號" style="min-width: 180px">
                <template #body="slotProps">
                    <span class="font-mono text-sm">{{ slotProps.data.orderId }}</span>
                </template>
            </Column>
            <Column field="memberId" header="會員 ID" style="min-width: 120px">
                 <template #body="slotProps">
                    <span class="text-blue-400 cursor-pointer hover:underline font-medium">{{ slotProps.data.memberId }}</span>
                </template>
            </Column>
            <Column field="amount" header="存款金額" style="min-width: 120px">
                 <template #body="slotProps">
                    <div class="flex items-center gap-2">
                         <span class="font-mono font-bold text-green-400">{{ formatCurrency(slotProps.data.amount) }}</span>
                         <Tag v-if="slotProps.data.amount > 50000" icon="pi pi-exclamation-triangle" severity="danger" value="大額" class="text-[10px] px-1" />
                    </div>
                </template>
            </Column>
            <Column header="類型 / 備註" style="min-width: 200px">
                 <template #body="slotProps">
                    <div class="flex flex-col">
                        <span class="text-white font-medium">{{ slotProps.data.type }}</span>
                        <span class="text-xs text-surface-400 truncate max-w-[180px]" :title="slotProps.data.remark">{{ slotProps.data.remark || '-' }}</span>
                    </div>
                </template>
            </Column>
             <Column header="附件" style="min-width: 60px">
                 <template #body="slotProps">
                    <Button v-if="slotProps.data.attachmentUrl" icon="pi pi-image" text rounded severity="secondary" @click="openImagePreview(slotProps.data.attachmentUrl)" v-tooltip.top="'查看附件'" />
                    <span v-else class="text-surface-500">-</span>
                </template>
            </Column>
            <Column field="applicant" header="申請人" style="min-width: 100px">
                 <template #body="slotProps">
                    <span class="text-surface-300">{{ slotProps.data.applicant }}</span>
                </template>
            </Column>
             <Column field="status" header="狀態" style="min-width: 100px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </template>
            </Column>
            <Column header="操作" style="min-width: 100px" frozen alignFrozen="right">
                <template #body="slotProps">
                    <Button v-if="slotProps.data.status === '待審核'" 
                        label="審核" 
                        icon="pi pi-check-square" 
                        severity="primary" 
                        size="small" 
                        @click="openAuditModal(slotProps.data)" 
                    />
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <!-- Audit Modal -->
    <Dialog v-model:visible="auditModalVisible" modal :header="`手工存款審核 - ${currentOrder?.orderId}`" :style="{ width: '500px' }">
        <div v-if="currentOrder" class="flex flex-col gap-4">
             <!-- Member Snapshot -->
             <div class="bg-surface-900/50 p-4 rounded border border-surface-700">
                 <h4 class="text-surface-400 text-sm mb-3 font-bold">會員風險快照</h4>
                 <div class="grid grid-cols-2 gap-4">
                     <div>
                         <span class="text-surface-500 text-xs block">當前餘額</span>
                         <span class="text-emerald-400 font-mono font-bold">{{ formatCurrency(currentOrder.memberSnapshot?.currentBalance || 0) }}</span>
                     </div>
                     <div>
                         <span class="text-surface-500 text-xs block">近7日補單 (筆/額)</span>
                         <span class="text-white font-mono">{{ currentOrder.memberSnapshot?.recentDepositCount }} 筆 / {{ formatCurrency(currentOrder.memberSnapshot?.recentDepositTotal || 0) }}</span>
                     </div>
                 </div>
                 <!-- Risk Warning -->
                 <div v-if="(currentOrder.memberSnapshot?.recentDepositCount || 0) > 3" class="mt-3 flex items-center gap-2 text-yellow-500 text-xs bg-yellow-500/10 p-2 rounded">
                     <i class="pi pi-exclamation-triangle"></i>
                     <span>警告：該會員近期頻繁補單，請謹慎審核。</span>
                 </div>
             </div>
             
             <!-- Order Details Recap -->
             <div class="space-y-2">
                 <div class="flex justify-between text-sm">
                     <span class="text-surface-400">申請金額</span>
                     <span class="text-green-400 font-bold font-mono text-lg">{{ formatCurrency(currentOrder.amount) }}</span>
                 </div>
                 <div class="flex justify-between text-sm">
                     <span class="text-surface-400">類型</span>
                     <span>{{ currentOrder.type }}</span>
                 </div>
                 <div class="flex justify-between text-sm">
                     <span class="text-surface-400">備註</span>
                     <span class="text-right text-surface-200">{{ currentOrder.remark }}</span>
                 </div>
             </div>

             <!-- Reject Reason Input -->
             <div v-if="isRejectMode" class="animate-fade-in space-y-2">
                  <label class="text-red-400 text-sm font-bold">拒絕原因 (必填)</label>
                  <Textarea v-model="rejectReason" rows="3" class="w-full" placeholder="請詳細說明拒絕理由..." :class="{'p-invalid': showRejectError}" />
                  <small v-if="showRejectError" class="text-red-400">請輸入拒絕理由</small>
             </div>

             <!-- Actions -->
             <div class="flex justify-end gap-2 pt-4 border-t border-surface-700">
                 <template v-if="!isRejectMode">
                     <Button label="拒絕" severity="danger" icon="pi pi-times" outlined @click="enableRejectMode" />
                     <Button label="通過" severity="success" icon="pi pi-check" @click="handleApprove" />
                 </template>
                 <template v-else>
                     <Button label="取消" severity="secondary" text @click="cancelRejectMode" />
                     <Button label="確認拒絕" severity="danger" icon="pi pi-times-circle" @click="handleReject" />
                 </template>
             </div>
        </div>
    </Dialog>

    <!-- Image Preview Dialog -->
    <Dialog v-model:visible="imagePreviewVisible" modal header="附件預覽" :style="{ width: 'auto' }" :dismissableMask="true">
        <img :src="previewUrl" alt="Attachment" class="max-w-[800px] max-h-[600px] object-contain rounded" />
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
import Dialog from 'primevue/dialog'
import Textarea from 'primevue/textarea'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useFinanceData, type DepositOrder } from './useFinanceData'

const toast = useToast()
const confirm = useConfirm()
const { manualDepositOrders, initData } = useFinanceData()

onMounted(() => {
    initData()
})

const statusOptions = ref([
    { label: '待審核', value: '待審核' },
    { label: '已通過', value: '已通過' },
    { label: '已拒絕', value: '已拒絕' },
])

const typeOptions = ref([
    { label: '人工入款', value: '人工入款' },
    { label: '活動贈送', value: '活動贈送' },
    { label: '系統補分', value: '系統補分' },
])

const filters = ref({
    orderId: '',
    memberId: '',
    type: null,
    status: null,
    dateRange: null
})

const isSearching = ref(false)
const hasSearched = ref(false)

const filteredOrders = computed(() => {
    if (!hasSearched.value) return []
    let result = manualDepositOrders.value
    if (filters.value.orderId) result = result.filter(o => o.orderId.includes(filters.value.orderId))
    if (filters.value.memberId) result = result.filter(o => o.memberId.includes(filters.value.memberId))
    if (filters.value.type) result = result.filter(o => o.type === filters.value.type)
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
    filters.value = { orderId: '', memberId: '', type: null, status: null, dateRange: null }
    hasSearched.value = false
}

// === Audit Modal Logic ===
const auditModalVisible = ref(false)
const currentOrder = ref<DepositOrder | null>(null)
const isRejectMode = ref(false)
const rejectReason = ref('')
const showRejectError = ref(false)

const openAuditModal = (order: DepositOrder) => {
    currentOrder.value = order
    isRejectMode.value = false
    rejectReason.value = ''
    showRejectError.value = false
    auditModalVisible.value = true
}

const handleApprove = () => {
    confirm.require({
        message: `確定要通過此手動存款？\n金額: ${formatCurrency(currentOrder.value!.amount)}\n會員餘額將即時更新。`,
        header: '二次確認',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-success',
        accept: () => {
            if (currentOrder.value) {
                currentOrder.value.status = '已通過'
                toast.add({ severity: 'success', summary: '審核通過', detail: `訂單 ${currentOrder.value.orderId} 已入帳`, life: 3000 })
                auditModalVisible.value = false
            }
        }
    })
}

const enableRejectMode = () => {
    isRejectMode.value = true
}

const cancelRejectMode = () => {
    isRejectMode.value = false
    showRejectError.value = false
}

const handleReject = () => {
    if (!rejectReason.value.trim()) {
        showRejectError.value = true
        return
    }
    if (currentOrder.value) {
        currentOrder.value.status = '已拒絕'
        toast.add({ severity: 'error', summary: '審核拒絕', detail: `訂單 ${currentOrder.value.orderId} 已駁回`, life: 3000 })
        auditModalVisible.value = false
    }
}

// === Image Preview Logic ===
const imagePreviewVisible = ref(false)
const previewUrl = ref('')

const openImagePreview = (url: string) => {
    previewUrl.value = url
    imagePreviewVisible.value = true
}

// === Helpers ===
const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
const getStatusSeverity = (status: string) => {
    if (status === '待審核') return 'warning'
    if (status === '已通過') return 'success'
    return 'danger'
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
:deep(.p-inputtext), :deep(.p-dropdown) { background-color: rgba(30, 41, 59, 0.5); border-color: rgba(71, 85, 105, 0.5); }
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
</style>
