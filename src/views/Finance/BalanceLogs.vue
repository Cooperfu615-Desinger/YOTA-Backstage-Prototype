<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-wallet text-blue-400"></i>
      <span class="text-surface-300">財務管理</span>
      <span>></span>
      <span class="text-surface-300">紀錄查詢</span>
      <span>></span>
      <span class="text-white font-medium">資金流水紀錄</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white text-lg">
            <i class="pi pi-search text-blue-400"></i>
            資金流水搜尋
          </div>
        </div>
      </template>
      <template #content>
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">會員 ID</label>
            <InputText v-model="filters.memberId" placeholder="輸入會員 ID" class="w-[220px]" />
          </div>
           <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">關聯單號</label>
            <InputText v-model="filters.orderId" placeholder="輸入關聯單號" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">帳務類型</label>
            <Dropdown v-model="filters.accountType" :options="accountTypeOptions" optionLabel="label" optionValue="value" placeholder="選擇類型" class="w-[220px]" showClear />
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

    <!-- Balance Logs List Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-list text-purple-400"></i>
          資金流水列表
           <span v-if="hasSearched" class="text-sm text-surface-400 font-normal ml-2">(共 {{ filteredLogs.length }} 筆)</span>
        </div>
      </template>
      <template #content>
         <DataTable :value="filteredLogs" :loading="isSearching" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
                <p class="text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column field="time" header="時間" style="min-width: 160px">
                 <template #body="slotProps">
                    <span class="text-sm text-surface-400">{{ slotProps.data.time }}</span>
                </template>
            </Column>
            <Column field="memberId" header="會員 ID" style="min-width: 120px">
                 <template #body="slotProps">
                    <span class="text-surface-300 font-medium">{{ slotProps.data.memberId }}</span>
                </template>
            </Column>
            <Column field="accountType" header="帳務類型" style="min-width: 120px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.accountType" :severity="getTypeSeverity(slotProps.data.accountType)" />
                </template>
            </Column>
            <Column field="beforeAmount" header="異動前金額" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono text-surface-400">{{ formatCurrency(slotProps.data.beforeAmount) }}</span>
                </template>
            </Column>
            <Column field="changeAmount" header="異動金額" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono font-bold" :class="slotProps.data.changeAmount >= 0 ? 'text-green-400' : 'text-red-400'">
                        {{ slotProps.data.changeAmount >= 0 ? '+' : '' }}{{ formatCurrency(slotProps.data.changeAmount) }}
                     </span>
                </template>
            </Column>
            <Column field="afterAmount" header="異動後金額" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono text-white font-bold">{{ formatCurrency(slotProps.data.afterAmount) }}</span>
                </template>
            </Column>
            <Column field="remark" header="備註" style="min-width: 200px">
                 <template #body="slotProps">
                    <span class="text-sm text-surface-400 truncate max-w-[180px] block" :title="slotProps.data.remark">{{ slotProps.data.remark }}</span>
                </template>
            </Column>
            <Column field="relatedOrder" header="關聯訂單號" style="min-width: 180px">
                 <template #body="slotProps">
                    <span v-if="slotProps.data.relatedOrder" class="font-mono text-sm text-blue-400">{{ slotProps.data.relatedOrder }}</span>
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

const accountTypeOptions = ref([
    { label: '存款', value: '存款' },
    { label: '提款', value: '提款' },
    { label: '投注', value: '投注' },
    { label: '派彩', value: '派彩' },
    { label: '贈送', value: '贈送' },
    { label: '返水', value: '返水' },
    { label: '調整', value: '調整' },
])

const filters = ref({
    memberId: '',
    orderId: '',
    accountType: null,
    dateRange: null
})

const isSearching = ref(false)
const hasSearched = ref(false)
const balanceLogs = ref<any[]>([])

const filteredLogs = computed(() => {
    if (!hasSearched.value) return []
    let result = balanceLogs.value
    
    if (filters.value.memberId) {
        result = result.filter(log => log.memberId.includes(filters.value.memberId))
    }
    if (filters.value.orderId) {
        result = result.filter(log => log.relatedOrder?.includes(filters.value.orderId))
    }
    if (filters.value.accountType) {
        result = result.filter(log => log.accountType === filters.value.accountType)
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
    filters.value = { memberId: '', orderId: '', accountType: null, dateRange: null }
    hasSearched.value = false
}

const generateMockData = () => {
    const logs: any[] = []
    const types = ['存款', '提款', '投注', '派彩', '贈送', '返水', '調整']
    const remarks: Record<string, string[]> = {
        '存款': ['在線充值', '銀行轉帳', '第三方支付'],
        '提款': ['提款申請', '提款成功'],
        '投注': ['老虎機投注', '真人百家樂', '體育賽事'],
        '派彩': ['中獎派彩', '返獎'],
        '贈送': ['新人禮金', '活動贈送', 'VIP獎勵'],
        '返水': ['遊戲返水', '每日返水'],
        '調整': ['人工調整', '系統補償', '異常修正']
    }
    
    let runningBalance = 10000
    
    for (let i = 0; i < 50; i++) {
        const accountType = types[Math.floor(Math.random() * types.length)]!
        const remarkList = remarks[accountType] || ['其他']
        const remark = remarkList[Math.floor(Math.random() * remarkList.length)]!
        
        let changeAmount = 0
        if (['存款', '派彩', '贈送', '返水'].includes(accountType)) {
            changeAmount = Math.floor(Math.random() * 5000) + 100
        } else if (['提款', '投注'].includes(accountType)) {
            changeAmount = -(Math.floor(Math.random() * 3000) + 100)
        } else {
            changeAmount = Math.random() > 0.5 ? Math.floor(Math.random() * 2000) : -Math.floor(Math.random() * 2000)
        }
        
        const beforeAmount = runningBalance
        runningBalance += changeAmount
        const afterAmount = runningBalance
        
        logs.push({
            id: i,
            time: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400 * 1000)).toISOString().replace('T', ' ').substring(0, 19),
            memberId: `user${1000 + Math.floor(Math.random() * 100)}`,
            accountType,
            beforeAmount,
            changeAmount,
            afterAmount,
            remark,
            relatedOrder: Math.random() > 0.3 ? `ORD${20240107000 + i}` : null
        })
    }
    
    balanceLogs.value = logs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
}

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)

const getTypeSeverity = (type: string) => {
    const severityMap: Record<string, string> = {
        '存款': 'success',
        '提款': 'warning',
        '投注': 'info',
        '派彩': 'success',
        '贈送': 'help',
        '返水': 'success',
        '調整': 'secondary'
    }
    return severityMap[type] || 'info'
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
