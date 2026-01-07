<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-credit-card text-blue-400"></i>
      <span class="text-surface-300">金流平台</span>
      <span>></span>
      <span class="text-white font-medium">銀行管理</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white text-lg">
            <i class="pi pi-search text-blue-400"></i>
            銀行帳戶搜尋
          </div>
          <Button label="新增銀行卡" icon="pi pi-plus" severity="success" @click="showAddDialog = true" />
        </div>
      </template>
      <template #content>
        <!-- Search Fields - Fixed Width Left-Aligned Layout -->
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">銀行名稱</label>
            <Dropdown v-model="filters.bankName" :options="bankOptions" optionLabel="label" optionValue="value" placeholder="選擇銀行" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
             <label class="text-surface-300 text-sm font-medium">開戶姓名</label>
             <InputText v-model="filters.holderName" placeholder="輸入開戶姓名" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
             <label class="text-surface-300 text-sm font-medium">銀行帳號</label>
             <InputText v-model="filters.accountNumber" placeholder="輸入銀行帳號" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">狀態</label>
            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="選擇狀態" class="w-[220px]" showClear />
          </div>
        </div>

        <!-- Search & Reset Buttons - Right Aligned -->
        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- Bank List Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-list text-purple-400"></i>
          銀行帳戶列表
          <span v-if="hasSearched" class="text-sm text-surface-400 font-normal ml-2">(共 {{ banks.length }} 筆)</span>
        </div>
      </template>
      <template #content>
        <div class="min-h-[400px]">
           <!-- DataTable -->
           <DataTable :value="hasSearched ? banks : []" :loading="isSearching" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
                <p class="text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column field="bankName" header="銀行資訊" sortable style="min-width: 200px">
              <template #body="slotProps">
                 <div class="flex items-center gap-3">
                   <div class="w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center">
                      <i class="pi pi-building-columns text-xl text-surface-400"></i>
                   </div>
                   <div class="flex flex-col">
                     <span class="text-white font-medium">{{ slotProps.data.bankName }}</span>
                     <span class="text-surface-500 text-xs">{{ slotProps.data.branchName }}</span>
                   </div>
                 </div>
              </template>
            </Column>
            <Column field="accountNumber" header="帳戶詳情" style="min-width: 180px">
               <template #body="slotProps">
                 <div class="flex flex-col gap-1">
                   <span class="text-surface-300 text-sm">{{ slotProps.data.holderName }}</span>
                   <div class="flex items-center gap-2 cursor-pointer group" @click="copyToClipboard(slotProps.data.accountNumber)">
                      <span class="text-blue-400 font-mono group-hover:underline">{{ slotProps.data.accountNumber }}</span>
                      <i class="pi pi-copy text-xs text-surface-600 group-hover:text-blue-400"></i>
                   </div>
                 </div>
               </template>
            </Column>
            <Column field="dailyLimit" header="收款限額 (今日/上限)" style="min-width: 200px">
               <template #body="slotProps">
                 <div class="flex flex-col gap-1">
                   <div class="flex justify-between text-xs text-surface-400">
                     <span>{{ formatCurrency(slotProps.data.todayReceived) }}</span>
                     <span>{{ formatCurrency(slotProps.data.dailyLimit) }}</span>
                   </div>
                   <ProgressBar :value="Math.min(100, Math.round((slotProps.data.todayReceived / slotProps.data.dailyLimit) * 100))" :showValue="false" class="h-2" :class="getProgressBarColor(slotProps.data.todayReceived, slotProps.data.dailyLimit)" />
                 </div>
               </template>
            </Column>
             <Column field="levels" header="所屬等級" style="min-width: 150px">
              <template #body="slotProps">
                 <div class="flex flex-wrap gap-1">
                    <Tag v-for="level in slotProps.data.levels" :key="level" :value="level" severity="info" class="text-xs" />
                 </div>
              </template>
            </Column>
             <Column field="status" header="狀態" style="min-width: 100px">
              <template #body="slotProps">
                <InputSwitch v-model="slotProps.data.status" @change="handleStatusChange(slotProps.data)" />
              </template>
            </Column>
           </DataTable>
        </div>
      </template>
    </Card>

     <!-- Add Bank Dialog -->
    <Dialog v-model:visible="showAddDialog" header="新增銀行卡" :modal="true" :style="{ width: '500px' }">
      <div class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">銀行</label>
          <Dropdown v-model="newBank.bankName" :options="bankOptions" optionLabel="label" optionValue="value" placeholder="選擇銀行" class="w-full" />
        </div>
         <div class="flex flex-col gap-2">
          <label class="text-surface-300">分行名稱</label>
          <InputText v-model="newBank.branchName" placeholder="輸入分行名稱" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">開戶姓名</label>
          <InputText v-model="newBank.holderName" placeholder="輸入開戶姓名" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">銀行帳號</label>
          <InputText v-model="newBank.accountNumber" placeholder="輸入銀行帳號" class="w-full" />
        </div>
         <div class="flex flex-col gap-2">
          <label class="text-surface-300">每日收款上限</label>
          <InputNumber v-model="newBank.dailyLimit" class="w-full" mode="currency" currency="TWD" :minFractionDigits="0" />
        </div>
        <div class="flex flex-col gap-2">
           <label class="text-surface-300">顯示等級 (可複選)</label>
           <div class="flex flex-wrap gap-3 p-2 bg-surface-900/50 rounded-lg border border-surface-700">
             <div v-for="level in levelOptions" :key="level" class="flex items-center gap-2">
               <Checkbox v-model="newBank.levels" :inputId="level" :value="level" />
               <label :for="level" class="text-sm cursor-pointer">{{ level }}</label>
             </div>
           </div>
        </div>
      </div>
      <template #footer>
        <Button label="取消" severity="secondary" @click="showAddDialog = false" />
        <Button label="確認新增" icon="pi pi-check" @click="handleAddBank" severity="success" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import InputSwitch from 'primevue/inputswitch'
import ProgressBar from 'primevue/progressbar'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const bankOptions = ref([
    { label: '中國信託 (CTBC)', value: '中國信託' },
    { label: '國泰世華 (Cathay)', value: '國泰世華' },
    { label: '玉山銀行 (E.SUN)', value: '玉山銀行' },
    { label: '台新銀行 (Taishin)', value: '台新銀行' },
    { label: '台北富邦 (Fubon)', value: '台北富邦' },
])

const statusOptions = ref([
    { label: '啟用', value: true },
    { label: '停用', value: false },
])

const levelOptions = ['VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5']

// Filter State
const filters = ref({
    bankName: null,
    holderName: '',
    accountNumber: '',
    status: null
})

// UI State
const isSearching = ref(false)
const hasSearched = ref(false)
const showAddDialog = ref(false)

// Data State
interface BankAccount {
    id: number
    bankName: string
    branchName: string
    holderName: string
    accountNumber: string
    todayReceived: number
    dailyLimit: number
    levels: string[]
    status: boolean
}

const banks = ref<BankAccount[]>([])
const newBank = ref({
    bankName: null,
    branchName: '',
    holderName: '',
    accountNumber: '',
    dailyLimit: 500000,
    levels: [] as string[]
})

// Mock Data Generator
const generateMockBanks = () => {
    const list: BankAccount[] = []
    const bankNames = ['中國信託', '國泰世華', '玉山銀行', '台新銀行', '台北富邦']
    const branches = ['營業部', '信義分行', '中山分行', '大安分行', '松山分行']
    
    for(let i=0; i<8; i++) {
        const limit = 1000000 + Math.floor(Math.random() * 2000000)
        list.push({
            id: i + 1,
            bankName: bankNames[i % bankNames.length]!,
            branchName: branches[i % branches.length]!,
            holderName: `王大明 ${i+1}`,
            accountNumber: `822${Math.floor(Math.random() * 100000000000)}`,
            todayReceived: Math.floor(Math.random() * limit * 0.9),
            dailyLimit: limit,
            levels: ['VIP1', 'VIP2', 'VIP3'].slice(0, Math.floor(Math.random() * 3) + 1),
            status: Math.random() > 0.1
        })
    }
    return list
}

// Actions
const handleSearch = () => {
    isSearching.value = true
    setTimeout(() => {
        banks.value = generateMockBanks()
        hasSearched.value = true
        isSearching.value = false
        toast.add({ severity: 'success', summary: '搜尋完成', detail: `共找到 ${banks.value.length} 筆銀行帳戶`, life: 1000 })
    }, 600)
}

const handleReset = () => {
    filters.value = { bankName: null, holderName: '', accountNumber: '', status: null }
    toast.add({ severity: 'info', summary: '已重置', detail: '搜尋條件已清空', life: 1000 })
}

const handleStatusChange = (bank: BankAccount) => {
    toast.add({
        severity: bank.status ? 'success' : 'warn',
        summary: bank.status ? '已啟用' : '已停用',
        detail: `銀行帳戶 ${bank.accountNumber} 狀態已更新`,
        life: 2000
    })
}

const handleAddBank = () => {
    toast.add({ severity: 'success', summary: '新增成功', detail: '銀行帳戶已建立', life: 2000 })
    showAddDialog.value = false
    handleSearch() // Refresh list
}

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.add({ severity: 'info', summary: '已複製', detail: '帳號已複製到剪貼簿', life: 1000 })
}

// Helpers
const formatCurrency = (val: number) => {
     return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
}

const getProgressBarColor = (current: number, max: number) => {
    const ratio = current / max
    if (ratio > 0.9) return '!bg-red-500'
    if (ratio > 0.7) return '!bg-yellow-500'
    return '!bg-emerald-500'
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
:deep(.p-dialog) { background-color: #1e293b; }
:deep(.p-dialog .p-dialog-header) { background-color: #1e293b; border-bottom: 1px solid rgba(71, 85, 105, 0.5); }
:deep(.p-dialog .p-dialog-content) { background-color: #1e293b; }
:deep(.p-dialog .p-dialog-footer) { background-color: #1e293b; border-top: 1px solid rgba(71, 85, 105, 0.5); }
:deep(.p-progressbar) { background-color: rgba(255,255,255,0.1); }
:deep(.p-progressbar .p-progressbar-value) { background-color: #10b981; }
</style>
