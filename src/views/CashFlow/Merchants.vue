<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-credit-card text-blue-400"></i>
      <span class="text-surface-300">金流平台</span>
      <span>></span>
      <span class="text-white font-medium">商號管理</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white text-lg">
            <i class="pi pi-search text-blue-400"></i>
            商號搜尋
          </div>
          <Button label="新增商號" icon="pi pi-plus" severity="success" @click="showAddDialog = true" />
        </div>
      </template>
      <template #content>
        <!-- Search Fields - Fixed Width Left-Aligned Layout -->
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">商號名稱</label>
            <InputText v-model="filters.name" placeholder="輸入商號名稱" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">商號代碼</label>
            <InputText v-model="filters.code" placeholder="輸入商號代碼" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">狀態</label>
            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="選擇狀態" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">分組</label>
            <Dropdown v-model="filters.group" :options="groupOptions" optionLabel="label" optionValue="value" placeholder="選擇分組" class="w-[220px]" showClear />
          </div>
        </div>

        <!-- Search & Reset Buttons - Right Aligned -->
        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- Merchant List Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-list text-purple-400"></i>
          商號列表
          <span v-if="hasSearched" class="text-sm text-surface-400 font-normal ml-2">(共 {{ merchants.length }} 筆)</span>
        </div>
      </template>
      <template #content>
        <div class="min-h-[400px]">
          <!-- Pagination -->
          <div v-if="hasSearched && merchants.length > 0" class="flex items-center justify-center gap-2 mb-4">
            <Button icon="pi pi-angle-double-left" text @click="goToPage(1)" :disabled="currentPage === 1" />
            <Button icon="pi pi-angle-left" text @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" />
            <template v-for="page in visiblePages" :key="page">
              <Button :label="String(page)" :class="page === currentPage ? 'bg-surface-600' : ''" :text="page !== currentPage" @click="goToPage(page)" />
            </template>
            <Button icon="pi pi-angle-right" text @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" />
            <Button icon="pi pi-angle-double-right" text @click="goToPage(totalPages)" :disabled="currentPage === totalPages" />
            <span class="text-surface-400 text-sm ml-2">每頁</span>
            <Dropdown v-model="rowsPerPage" :options="[10, 20, 50]" class="w-24" />
            <span class="text-surface-400 text-sm">筆</span>
          </div>

          <!-- DataTable -->
          <DataTable :value="hasSearched ? paginatedMerchants : []" :loading="isSearching" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
                <p class="text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column field="name" header="商號資訊" sortable style="min-width: 200px">
              <template #body="slotProps">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span class="text-blue-400 font-medium cursor-pointer hover:underline text-lg" @click="openDetail(slotProps.data)">{{ slotProps.data.name }}</span>
                    <i v-if="slotProps.data.currentDailyAmount / slotProps.data.dailyLimit > 0.9" class="pi pi-exclamation-triangle text-red-500" v-tooltip.top="'今日額度已使用超過 90%'"></i>
                  </div>
                  <span class="text-surface-400 text-sm font-mono">{{ slotProps.data.code }}</span>
                </div>
              </template>
            </Column>
            <Column field="group" header="分組" sortable style="min-width: 100px">
              <template #body="slotProps">
                <Tag :value="slotProps.data.group" :severity="getGroupSeverity(slotProps.data.group)" />
              </template>
            </Column>
            <Column field="balance" header="系統餘額" sortable style="min-width: 140px">
              <template #body="slotProps">
                <span class="font-mono text-emerald-400 font-bold">{{ formatCurrency(slotProps.data.balance) }}</span>
              </template>
            </Column>
            <Column field="channelBalance" header="渠道餘額" sortable style="min-width: 140px">
              <template #body="slotProps">
                <span class="font-mono text-blue-400 font-bold">{{ formatCurrency(slotProps.data.channelBalance) }}</span>
              </template>
            </Column>
            <Column field="feeRate" header="手續費" style="min-width: 100px">
              <template #body="slotProps">
                <span class="text-surface-300">{{ slotProps.data.feeRate }}%</span>
              </template>
            </Column>
            <Column field="depositStatus" header="入金開關" style="min-width: 100px">
              <template #body="slotProps">
                <InputSwitch v-model="slotProps.data.depositStatus" @change="handleStatusChange(slotProps.data, 'deposit')" />
              </template>
            </Column>
            <Column field="withdrawStatus" header="出金開關" style="min-width: 100px">
              <template #body="slotProps">
                <InputSwitch v-model="slotProps.data.withdrawStatus" @change="handleStatusChange(slotProps.data, 'withdraw')" />
              </template>
            </Column>
            <Column field="dailyLimit" header="每日限額" style="min-width: 200px">
              <template #body="slotProps">
                <div class="flex flex-col gap-1">
                  <div class="flex justify-between text-xs text-surface-400">
                    <span>{{ formatCurrency(slotProps.data.currentDailyAmount) }}</span>
                    <span>{{ formatCurrency(slotProps.data.dailyLimit) }}</span>
                  </div>
                  <ProgressBar :value="Math.min(100, Math.round((slotProps.data.currentDailyAmount / slotProps.data.dailyLimit) * 100))" :showValue="false" class="h-2" :class="getProgressBarColor(slotProps.data.currentDailyAmount, slotProps.data.dailyLimit)" />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>

    <!-- Detailed Dialog -->
    <Dialog v-model:visible="showDetailDialog" :header="`商號詳情 - ${selectedMerchant?.name}`" :modal="true" :style="{ width: '800px' }" :dismissableMask="true">
      <div v-if="selectedMerchant" class="space-y-6">
        <TabView>
          <TabPanel header="基本資訊" value="0">
            <div class="grid grid-cols-2 gap-6">
              <div class="flex flex-col gap-2">
                <label class="text-surface-400 text-sm">商號名稱</label>
                <InputText v-model="selectedMerchant.name" class="w-full" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-surface-400 text-sm">商號代碼</label>
                <InputText v-model="selectedMerchant.code" class="w-full" disabled />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-surface-400 text-sm">所屬分組</label>
                <Dropdown v-model="selectedMerchant.group" :options="groupOptions" optionLabel="label" optionValue="value" class="w-full" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-surface-400 text-sm">當前餘額</label>
                <InputText :value="formatCurrency(selectedMerchant.balance)" class="w-full" disabled />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-surface-400 text-sm">手續費率 (%)</label>
                <InputNumber v-model="selectedMerchant.feeRate" class="w-full" :minFractionDigits="2" :maxFractionDigits="2" suffix="%" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-surface-400 text-sm">每日限額</label>
                <InputNumber v-model="selectedMerchant.dailyLimit" class="w-full" mode="currency" currency="TWD" :minFractionDigits="0" />
              </div>
            </div>
            <div class="mt-6 flex gap-4">
              <div class="flex items-center gap-2">
                <label class="text-surface-400 text-sm">入金啟用</label>
                <InputSwitch v-model="selectedMerchant.depositStatus" />
              </div>
              <div class="flex items-center gap-2">
                <label class="text-surface-400 text-sm">出金啟用</label>
                <InputSwitch v-model="selectedMerchant.withdrawStatus" />
              </div>
            </div>
          </TabPanel>
          <TabPanel header="API 設定" value="1">
            <div class="space-y-4">
              <div class="flex flex-col gap-2">
                <label class="text-surface-400 text-sm">API Key</label>
                <div class="flex gap-2">
                  <Password v-model="selectedMerchant.apiKey" class="flex-1" :feedback="false" toggleMask :pt="{ input: { class: 'w-full font-mono' } }" />
                  <Button icon="pi pi-copy" severity="secondary" @click="copyToClipboard(selectedMerchant.apiKey)" />
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-surface-400 text-sm">API Secret</label>
                <div class="flex gap-2">
                  <Password v-model="selectedMerchant.apiSecret" class="flex-1" :feedback="false" toggleMask :pt="{ input: { class: 'w-full font-mono' } }" />
                  <Button icon="pi pi-copy" severity="secondary" @click="copyToClipboard(selectedMerchant.apiSecret)" />
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-surface-400 text-sm">回調網址 (Callback URL)</label>
                <InputText v-model="selectedMerchant.callbackUrl" class="w-full font-mono" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-surface-400 text-sm">白名單 IP (以逗號分隔)</label>
                <InputText v-model="selectedMerchant.whitelistIps" class="w-full font-mono" />
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
      <template #footer>
        <Button label="取消" severity="secondary" @click="showDetailDialog = false" text />
        <Button label="儲存變更" icon="pi pi-check" @click="handleSaveDetail" />
      </template>
    </Dialog>

    <!-- Add Merchant Dialog -->
    <Dialog v-model:visible="showAddDialog" header="新增商號" :modal="true" :style="{ width: '500px' }">
      <div class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">商號名稱</label>
          <InputText placeholder="輸入商號名稱" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">商號代碼</label>
          <InputText placeholder="輸入商號代碼 (英文數字)" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">分組</label>
          <Dropdown :options="groupOptions" optionLabel="label" optionValue="value" placeholder="選擇分組" class="w-full" />
        </div>
      </div>
      <template #footer>
        <Button label="取消" severity="secondary" @click="showAddDialog = false" />
        <Button label="確認新增" icon="pi pi-check" @click="showAddDialog = false" severity="success" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Password from 'primevue/password'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import InputSwitch from 'primevue/inputswitch'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ProgressBar from 'primevue/progressbar'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Options
const statusOptions = ref([
  { label: '啟用中', value: 'active' },
  { label: '停用', value: 'inactive' }
])

const groupOptions = ref([
  { label: 'A 組 (高額)', value: 'A' },
  { label: 'B 組 (一般)', value: 'B' },
  { label: 'C 組 (小額)', value: 'C' },
  { label: '測試組', value: 'TEST' }
])

// Filter state
const filters = ref({
  name: '',
  code: '',
  status: null,
  group: null
})

// UI state
const isSearching = ref(false)
const hasSearched = ref(false)
const currentPage = ref(1)
const rowsPerPage = ref(10)
const showDetailDialog = ref(false)
const showAddDialog = ref(false)

// Data Types
interface Merchant {
  id: number
  name: string
  code: string
  group: string
  balance: number
  channelBalance: number
  feeRate: number
  depositStatus: boolean
  withdrawStatus: boolean
  dailyLimit: number
  currentDailyAmount: number
  apiKey: string
  apiSecret: string
  callbackUrl: string
  whitelistIps: string
}

const selectedMerchant = ref<Merchant | null>(null)
const merchants = ref<Merchant[]>([])

// Helper functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(value)
}

const getGroupSeverity = (group: string) => {
  const map: Record<string, string> = { 'A': 'danger', 'B': 'success', 'C': 'info', 'TEST': 'secondary' }
  return map[group] ?? 'secondary'
}

const getProgressBarColor = (current: number, max: number) => {
  const ratio = current / max
  if (ratio > 0.95) return '!bg-red-500' // Danger > 95%
  if (ratio > 0.8) return '!bg-yellow-500' // Warning > 80%
  return '!bg-emerald-500' // Success < 80%
}

const generateApiKey = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

const generateMockMerchants = () => {
  const list: Merchant[] = []
  const groups = ['A', 'B', 'B', 'C', 'C', 'C', 'TEST']
  const names = ['藍新金流', '綠界支付', 'LINE Pay', '街口支付', '微信支付', '支付寶', 'USDT TRC20', 'USDT ERC20', '銀行轉帳 A', '銀行轉帳 B', '超商代碼', '信用卡通道']
  
  for (let i = 0; i < 20; i++) {
    const name = names[i % names.length] + ` ${Math.floor(i / names.length) + 1 > 1 ? i : ''}`
    const limit = Math.floor(Math.random() * 5000000) + 1000000
    // Generate some high quota usage scenarios
    let currentUsageRatio = Math.random() * 0.8
    if (i % 5 === 0) currentUsageRatio = 0.92 + Math.random() * 0.08 // Some > 90%
    if (i % 7 === 0) currentUsageRatio = 0.85 + Math.random() * 0.1 // Some > 80%

    list.push({
      id: 100 + i,
      name: name,
      code: `MCH_${1000 + i}`,
      group: groups[Math.floor(Math.random() * groups.length)] ?? 'C',
      balance: Math.floor(Math.random() * 10000000),
      channelBalance: Math.floor(Math.random() * 8000000), // Enriched data
      feeRate: Number((Math.random() * 2 + 0.5).toFixed(2)),
      depositStatus: Math.random() > 0.2,
      withdrawStatus: Math.random() > 0.3,
      dailyLimit: limit,
      currentDailyAmount: Math.floor(limit * currentUsageRatio),
      apiKey: generateApiKey(),
      apiSecret: generateApiKey() + generateApiKey(),
      callbackUrl: `https://api.merchant-${1000+i}.com/callback`,
      whitelistIps: '1.2.3.4, 5.6.7.8'
    })
  }
  return list
}

// Actions
const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    merchants.value = generateMockMerchants()
    currentPage.value = 1
    hasSearched.value = true
    isSearching.value = false
    toast.add({ severity: 'success', summary: '搜尋完成', detail: `共找到 ${merchants.value.length} 筆資料`, life: 500 })
  }, 600)
}

const handleReset = () => {
  filters.value = { name: '', code: '', status: null, group: null }
  toast.add({ severity: 'info', summary: '已重置', detail: '搜尋條件已清空', life: 1000 })
}

const goToPage = (page: number) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }

const handleStatusChange = (merchant: Merchant, type: 'deposit' | 'withdraw') => {
  const typeText = type === 'deposit' ? '入金' : '出金'
  const status = type === 'deposit' ? merchant.depositStatus : merchant.withdrawStatus
  toast.add({ 
    severity: status ? 'success' : 'warn', 
    summary: `${typeText}狀態更新`, 
    detail: `${merchant.name} 已${status ? '啟用' : '停用'} ${typeText}功能`, 
    life: 2000 
  })
}

const openDetail = (merchant: Merchant) => {
  selectedMerchant.value = JSON.parse(JSON.stringify(merchant)) // Deep copy
  showDetailDialog.value = true
}

const handleSaveDetail = () => {
  if (selectedMerchant.value) {
    const idx = merchants.value.findIndex(m => m.id === selectedMerchant.value?.id)
    if (idx !== -1) {
      merchants.value[idx] = selectedMerchant.value
      toast.add({ severity: 'success', summary: '儲存成功', detail: '商號設定已更新', life: 2000 })
    }
  }
  showDetailDialog.value = false
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.add({ severity: 'info', summary: '已複製', detail: 'API Key 已複製到剪貼簿', life: 1000 })
}

// Computed
const totalPages = computed(() => Math.max(1, Math.ceil(merchants.value.length / rowsPerPage.value)))
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
const paginatedMerchants = computed(() => merchants.value.slice((currentPage.value - 1) * rowsPerPage.value, currentPage.value * rowsPerPage.value))

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
:deep(.p-progressbar .p-progressbar-value) { background-color: #10b981; } /* Default emerald */
</style>
