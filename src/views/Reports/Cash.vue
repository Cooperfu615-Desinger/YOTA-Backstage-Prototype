<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-chart-line text-orange-500 dark:text-orange-400"></i>
      <span class="text-surface-500 dark:text-surface-300">報表管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">現金報表</span>
    </div>

    <!-- Filters Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #content>
        <div class="flex flex-wrap gap-4 mb-4">
          <!-- Date Range -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">日期區間</label>
            <DatePicker 
              v-model="filters.dateRange" 
              selectionMode="range" 
              :manualInput="false" 
              placeholder="選擇日期範圍" 
              class="w-[220px]" 
              showIcon 
              dateFormat="yy/mm/dd"
            />
          </div>
          <!-- Member Account -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">會員帳號</label>
            <InputText 
              v-model="filters.memberAccount" 
              placeholder="輸入會員帳號" 
              class="w-[220px]" 
            />
          </div>
          <!-- Transaction ID -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">單號</label>
            <InputText 
              v-model="filters.transactionId" 
              placeholder="輸入單號" 
              class="w-[220px]" 
            />
          </div>
          <!-- Transaction Type -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">帳變類型</label>
            <Select 
              v-model="filters.transactionType" 
              :options="transactionTypeOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="選擇類型" 
              class="w-[220px]" 
              showClear 
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="匯出" icon="pi pi-download" severity="success" @click="handleExport" />
          <Button label="查詢" icon="pi pi-search" :loading="isSearching" @click="handleSearch" />
        </div>
      </template>
    </Card>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <!-- Total In Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總入款</p>
              <p class="text-2xl font-bold text-green-500">{{ formatCurrency(summaryData.totalIn) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-emerald-500">
                <i class="pi pi-arrow-up"></i>
                <span>+12.8% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-arrow-down-left text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Total Out Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總出款</p>
              <p class="text-2xl font-bold text-red-500">{{ formatCurrency(summaryData.totalOut) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-orange-500">
                <i class="pi pi-arrow-up"></i>
                <span>+8.5% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <i class="pi pi-arrow-up-right text-red-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Net Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總損益</p>
              <p class="text-2xl font-bold" :class="summaryData.net >= 0 ? 'text-emerald-500' : 'text-red-500'">
                {{ summaryData.net >= 0 ? '+' : '' }}{{ formatCurrency(summaryData.net) }}
              </p>
              <div class="flex items-center gap-1 mt-2 text-sm" :class="summaryData.netChange >= 0 ? 'text-emerald-500' : 'text-red-500'">
                <i :class="summaryData.netChange >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                <span>{{ summaryData.netChange >= 0 ? '+' : '' }}{{ summaryData.netChange }}% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-chart-line text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- End Balance Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">期末餘額</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(summaryData.endBalance) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-purple-500">
                <i class="pi pi-wallet"></i>
                <span>截至 {{ new Date().toLocaleDateString('zh-TW') }}</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-wallet text-purple-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Data Table Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-list text-green-500 dark:text-green-400"></i>
          帳變明細列表
          <span v-if="hasSearched" class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ cashRecords.length }} 筆)</span>
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="hasSearched ? cashRecords : []" 
          :loading="isSearching" 
          stripedRows 
          paginator 
          :rows="10" 
          :rowsPerPageOptions="[10, 20, 50]"
        >
          <template #empty>
            <div class="flex flex-col items-center justify-center py-12 text-center">
              <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
              <p class="text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定篩選條件並點擊「查詢」按鈕' }}</p>
            </div>
          </template>

          <!-- Transaction ID Column -->
          <Column field="transactionId" header="單號" sortable style="min-width: 180px">
            <template #body="slotProps">
              <span class="font-mono text-blue-500">{{ slotProps.data.transactionId }}</span>
            </template>
          </Column>

          <!-- Member Column -->
          <Column field="memberAccount" header="會員帳號" sortable style="min-width: 130px">
            <template #body="slotProps">
              <span class="text-surface-700 dark:text-surface-300 font-medium">{{ slotProps.data.memberAccount }}</span>
            </template>
          </Column>

          <!-- Type Column -->
          <Column field="transactionType" header="帳變類型" sortable style="min-width: 120px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.transactionType" :severity="getTypeSeverity(slotProps.data.transactionType)" />
            </template>
          </Column>

          <!-- Amount Column -->
          <Column field="amount" header="變動金額" sortable style="min-width: 130px">
            <template #body="slotProps">
              <span 
                class="font-mono font-bold" 
                :class="slotProps.data.amount >= 0 ? 'text-green-400' : 'text-red-400'"
              >
                {{ slotProps.data.amount >= 0 ? '+' : '' }}{{ formatCurrency(slotProps.data.amount) }}
              </span>
            </template>
          </Column>

          <!-- After Balance Column -->
          <Column field="afterBalance" header="變動後餘額" sortable style="min-width: 130px">
            <template #body="slotProps">
              <span class="font-mono text-surface-700 dark:text-surface-300">{{ formatCurrency(slotProps.data.afterBalance) }}</span>
            </template>
          </Column>

          <!-- Time Column -->
          <Column field="time" header="時間" sortable style="min-width: 160px">
            <template #body="slotProps">
              <span class="text-sm text-surface-500 dark:text-surface-400">{{ slotProps.data.time }}</span>
            </template>
          </Column>

          <!-- Note Column -->
          <Column field="note" header="備註" style="min-width: 150px">
            <template #body="slotProps">
              <span class="text-sm text-surface-500 dark:text-surface-400">{{ slotProps.data.note || '-' }}</span>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Transaction Type Options
const transactionTypeOptions = ref([
  { label: '全部', value: 'all' },
  { label: '存款', value: 'deposit' },
  { label: '提款', value: 'withdrawal' },
  { label: '人工調整', value: 'adjustment' },
  { label: '紅利', value: 'bonus' }
])

// Filter State
const filters = ref({
  dateRange: null as Date[] | null,
  memberAccount: '',
  transactionId: '',
  transactionType: null
})

// UI State
const isSearching = ref(false)
const hasSearched = ref(false)

// Summary Data
const summaryData = ref({
  totalIn: 28560000,
  totalOut: 21340000,
  net: 7220000,
  netChange: 15.3,
  endBalance: 156780000
})

// Cash Records
interface CashRecord {
  id: number
  transactionId: string
  memberAccount: string
  transactionType: string
  amount: number
  afterBalance: number
  time: string
  note: string
}

const cashRecords = ref<CashRecord[]>([])

// Currency Formatter
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(value)
}

// Type Severity Helper
const getTypeSeverity = (type: string): string => {
  const severityMap: Record<string, string> = {
    '存款': 'success',
    '提款': 'danger',
    '人工調整': 'info',
    '紅利': 'warn'
  }
  return severityMap[type] || 'secondary'
}

// Generate Mock Data
const generateMockData = (): CashRecord[] => {
  const types = ['存款', '提款', '人工調整', '紅利']
  const notes = ['線上存款', '銀行轉帳提款', 'VIP調整', '首存優惠', '返水紅利', '活動獎勵', '', '']
  const data: CashRecord[] = []
  const today = new Date()
  let balance = 50000

  for (let i = 0; i < 35; i++) {
    const type = types[Math.floor(Math.random() * types.length)]!
    let amount = 0
    
    if (type === '存款') {
      amount = Math.floor(Math.random() * 50000) + 1000
    } else if (type === '提款') {
      amount = -(Math.floor(Math.random() * 30000) + 500)
    } else if (type === '人工調整') {
      amount = Math.random() > 0.5 ? Math.floor(Math.random() * 5000) : -Math.floor(Math.random() * 2000)
    } else {
      amount = Math.floor(Math.random() * 3000) + 100
    }
    
    balance += amount
    const transactionDate = new Date(today)
    transactionDate.setMinutes(transactionDate.getMinutes() - Math.floor(Math.random() * 20160)) // Random within 14 days

    data.push({
      id: i,
      transactionId: `TXN${Date.now() - i * 1000}${Math.floor(Math.random() * 1000)}`,
      memberAccount: `user${1000 + Math.floor(Math.random() * 9000)}`,
      transactionType: type,
      amount: amount,
      afterBalance: Math.abs(balance),
      time: transactionDate.toLocaleString('zh-TW'),
      note: notes[Math.floor(Math.random() * notes.length)]!
    })
  }

  return data.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
}

// Actions
const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    cashRecords.value = generateMockData()
    hasSearched.value = true
    isSearching.value = false
    toast.add({ 
      severity: 'success', 
      summary: '查詢完成', 
      detail: `共找到 ${cashRecords.value.length} 筆資料`, 
      life: 2000 
    })
  }, 800)
}

const handleReset = () => {
  filters.value = {
    dateRange: null,
    memberAccount: '',
    transactionId: '',
    transactionType: null
  }
  hasSearched.value = false
  cashRecords.value = []
  toast.add({ severity: 'info', summary: '已重置', detail: '篩選條件已清空', life: 1500 })
}

const handleExport = () => {
  toast.add({ 
    severity: 'success', 
    summary: '匯出成功', 
    detail: '報表已匯出為 Excel 檔案', 
    life: 2000 
  })
}
</script>
