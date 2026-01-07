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
            <i class="pi pi-lock text-orange-400"></i>
            鎖定訂單搜尋
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
            <label class="text-surface-300 text-sm font-medium">處理人 (鎖單者)</label>
            <InputText v-model="filters.processor" placeholder="輸入處理人帳號" class="w-[220px]" />
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
          鎖定中訂單列表
           <span v-if="hasSearched" class="text-sm text-surface-400 font-normal ml-2">(共 {{ filteredOrders.length }} 筆)</span>
        </div>
      </template>
      <template #content>
         <DataTable :value="filteredOrders" :loading="isSearching" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
                <p class="text-surface-400">{{ hasSearched ? '暫無鎖定訂單' : '請點擊「搜尋」查看目前鎖定項目' }}</p>
              </div>
            </template>
            <Column field="orderId" header="訂單號" sortable style="min-width: 180px">
                <template #body="slotProps"><span class="font-mono text-sm">{{ slotProps.data.orderId }}</span></template>
            </Column>
            <Column field="type" header="訂單類型" style="min-width: 120px">
                 <template #body="slotProps"><Tag :value="slotProps.data.type" severity="info" /></template>
            </Column>
            <Column field="processor" header="處理人" sortable style="min-width: 120px">
                 <template #body="slotProps">
                    <div class="flex items-center gap-2">
                         <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white">
                             {{ slotProps.data.processor.charAt(0) }}
                         </div>
                         <span class="text-white">{{ slotProps.data.processor }}</span>
                    </div>
                </template>
            </Column>
            <Column field="lockTime" header="鎖定時間" sortable style="min-width: 160px">
                 <template #body="slotProps"><span class="text-sm text-surface-400">{{ slotProps.data.lockTime }}</span></template>
            </Column>
             <Column field="duration" header="已鎖定時長" style="min-width: 120px">
                 <template #body="slotProps"><span class="text-orange-400 font-mono">{{ slotProps.data.duration }}</span></template>
            </Column>
            <Column header="操作" style="min-width: 120px">
                <template #body="slotProps">
                     <Button label="強制解鎖" icon="pi pi-unlock" severity="danger" size="small" outlined @click="handleUnlock(slotProps.data)" />
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
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { useFinanceData } from './useFinanceData'

const toast = useToast()
const { lockedOrders, initData, unlockOrder } = useFinanceData()

onMounted(() => {
    initData()
})

const filters = ref({
    orderId: '',
    processor: ''
})

const isSearching = ref(false)
const hasSearched = ref(false)

// Computed filtered list
const filteredOrders = computed(() => {
    if (!hasSearched.value) return []
    let result = lockedOrders.value
    if (filters.value.orderId) {
        result = result.filter(o => o.orderId.includes(filters.value.orderId))
    }
    if (filters.value.processor) {
        result = result.filter(o => o.processor?.includes(filters.value.processor))
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
    filters.value = { orderId: '', processor: '' }
    hasSearched.value = false
}

const handleUnlock = (order: any) => {
    const success = unlockOrder(order.orderId)
    if (success) {
        toast.add({ severity: 'warn', summary: '已解鎖', detail: `訂單 ${order.orderId} 已強制解鎖`, life: 2000 })
    } else {
        toast.add({ severity: 'error', summary: '解鎖失敗', detail: '可能已被處理', life: 2000 })
    }
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
:deep(.p-inputtext) { background-color: rgba(30, 41, 59, 0.5); border-color: rgba(71, 85, 105, 0.5); }
</style>
