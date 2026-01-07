<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-wallet text-blue-400"></i>
      <span class="text-surface-300">財務管理</span>
      <span>></span>
      <span class="text-surface-300">審核管理</span>
      <span>></span>
      <span class="text-white font-medium">鎖單管理</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white text-lg">
            <i class="pi pi-search text-blue-400"></i>
            鎖單查詢
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
            <label class="text-surface-300 text-sm font-medium">處理人</label>
            <InputText v-model="filters.processor" placeholder="輸入處理人" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">業務類型</label>
            <Dropdown v-model="filters.businessType" :options="businessTypeOptions" optionLabel="label" optionValue="value" placeholder="選擇業務類型" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">鎖定時長超過</label>
            <Dropdown v-model="filters.minDuration" :options="durationOptions" optionLabel="label" optionValue="value" placeholder="選擇時長" class="w-[220px]" showClear />
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- Lock Orders List Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-lock text-orange-400"></i>
          鎖定訂單列表
           <span v-if="hasSearched" class="text-sm text-surface-400 font-normal ml-2">(共 {{ filteredOrders.length }} 筆)</span>
        </div>
      </template>
      <template #content>
         <DataTable :value="filteredOrders" :loading="isSearching" stripedRows class="p-datatable-sm" :rowClass="rowClass" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
                <p class="text-surface-400">{{ hasSearched ? '暫無鎖定訂單' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column field="orderId" header="訂單號" style="min-width: 180px">
                <template #body="slotProps">
                    <span class="font-mono text-sm text-blue-400 cursor-pointer hover:underline">{{ slotProps.data.orderId }}</span>
                </template>
            </Column>
            <Column field="businessType" header="業務類型" style="min-width: 120px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.businessType" severity="info" />
                </template>
            </Column>
            <Column field="processor" header="處理人" style="min-width: 100px">
                 <template #body="slotProps">
                    <div class="flex items-center gap-1">
                        <i class="pi pi-user text-xs"></i>
                        <span>{{ slotProps.data.processor }}</span>
                    </div>
                </template>
            </Column>
            <Column field="lockTime" header="鎖定時間" style="min-width: 160px">
                 <template #body="slotProps">
                    <span class="text-sm text-surface-400">{{ slotProps.data.lockTime }}</span>
                </template>
            </Column>
            <Column header="已鎖定時長" style="min-width: 140px">
                 <template #body="slotProps">
                    <div class="flex items-center gap-2">
                        <span :class="getDuration(slotProps.data.lockTime) > 15 * 60 ? 'text-red-400 font-bold' : 'text-surface-300'">
                            {{ formatDuration(slotProps.data.lockTime) }}
                        </span>
                        <i v-if="getDuration(slotProps.data.lockTime) > 15 * 60" 
                           class="pi pi-exclamation-triangle text-red-400 animate-pulse" 
                           v-tooltip.top="'超時警告：鎖定超過15分鐘'"></i>
                    </div>
                </template>
            </Column>
            <Column header="操作" style="min-width: 120px" frozen alignFrozen="right">
                <template #body="slotProps">
                    <Button label="強制解鎖" 
                        icon="pi pi-lock-open" 
                        severity="danger" 
                        size="small" 
                        outlined
                        @click="handleForceUnlock(slotProps.data)" 
                    />
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useFinanceData } from './useFinanceData'

const toast = useToast()
const confirm = useConfirm()
const { lockedOrders, unlockOrder, initData } = useFinanceData()

onMounted(() => {
    initData()
    // Start live update timer
    updateTimer.value = setInterval(() => {
        currentTime.value = Date.now()
    }, 1000)
})

onUnmounted(() => {
    if (updateTimer.value) {
        clearInterval(updateTimer.value)
    }
})

const businessTypeOptions = ref([
    { label: '提款審核', value: '提款審核' },
    { label: '手存審核', value: '手存審核' },
])

const durationOptions = ref([
    { label: '5分鐘', value: 5 },
    { label: '10分鐘', value: 10 },
    { label: '30分鐘', value: 30 },
])

const filters = ref({
    orderId: '',
    processor: '',
    businessType: null,
    minDuration: null
})

const isSearching = ref(false)
const hasSearched = ref(false)
const currentTime = ref(Date.now())
const updateTimer = ref<any>(null)

const filteredOrders = computed(() => {
    if (!hasSearched.value) return []
    let result = lockedOrders.value
    
    if (filters.value.orderId) {
        result = result.filter(o => o.orderId.includes(filters.value.orderId))
    }
    if (filters.value.processor) {
        result = result.filter(o => o.processor.toLowerCase().includes(filters.value.processor.toLowerCase()))
    }
    if (filters.value.businessType) {
        result = result.filter(o => o.businessType === filters.value.businessType)
    }
    if (filters.value.minDuration) {
        const minSeconds = filters.value.minDuration * 60
        result = result.filter(o => getDuration(o.lockTime) >= minSeconds)
    }
    
    return result
})

const handleSearch = () => {
    isSearching.value = true
    setTimeout(() => {
        hasSearched.value = true
        isSearching.value = false
        toast.add({ severity: 'success', summary: '搜尋完成', detail: `共找到 ${filteredOrders.value.length} 筆鎖定訂單`, life: 1000 })
    }, 500)
}

const handleReset = () => {
    filters.value = { orderId: '', processor: '', businessType: null, minDuration: null }
    hasSearched.value = false
}

// Duration helpers
const getDuration = (lockTime: string): number => {
    const lockDate = new Date(lockTime)
    return Math.floor((currentTime.value - lockDate.getTime()) / 1000)
}

const formatDuration = (lockTime: string): string => {
    const seconds = getDuration(lockTime)
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const rowClass = (data: any) => {
    return getDuration(data.lockTime) > 15 * 60 ? 'bg-red-500/5' : ''
}

const handleForceUnlock = (order: any) => {
    confirm.require({
        message: `確定要強制解鎖此訂單？\n訂單號: ${order.orderId}\n處理人: ${order.processor}\n\n解鎖後該訂單將回歸待審核池，該操作將記錄至系統日誌。`,
        header: '強制解鎖確認',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => {
            const success = unlockOrder(order.orderId)
            if (success) {
                toast.add({ 
                    severity: 'warn', 
                    summary: '解鎖成功', 
                    detail: `訂單 ${order.orderId} 已成功解鎖，回歸待審核池`, 
                    life: 3000 
                })
            } else {
                toast.add({ severity: 'error', summary: '解鎖失敗', detail: '訂單狀態異常', life: 2000 })
            }
        }
    })
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
:deep(.bg-red-500\/5) { background-color: rgba(239, 68, 68, 0.05) !important; }
</style>
