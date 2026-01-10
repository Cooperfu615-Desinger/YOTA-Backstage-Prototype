<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-chart-line text-orange-500 dark:text-orange-400"></i>
      <span class="text-surface-500 dark:text-surface-300">報表管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">贈金報表</span>
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
          <!-- Bonus Type -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">贈金類型</label>
            <Select 
              v-model="filters.bonusType" 
              :options="bonusTypeOptions" 
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
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Total Amount Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總贈金金額</p>
              <p class="text-2xl font-bold text-green-500">{{ formatCurrency(summaryData.totalAmount) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-emerald-500">
                <i class="pi pi-arrow-up"></i>
                <span>+18.5% vs 上週</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-gift text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Total Users Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">領取人數</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ summaryData.totalUsers.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-blue-500">
                <i class="pi pi-arrow-up"></i>
                <span>+12.3% vs 上週</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-users text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Total Turnover Requirement Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總稽核需求</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(summaryData.totalTurnoverReq) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-orange-500">
                <i class="pi pi-arrow-up"></i>
                <span>+22.1% vs 上週</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-sync text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Data Table Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-list text-yellow-500 dark:text-yellow-400"></i>
          贈金發放列表
          <span v-if="hasSearched" class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ bonusRecords.length }} 筆)</span>
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="hasSearched ? bonusRecords : []" 
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

          <!-- Member Column -->
          <Column field="memberAccount" header="會員帳號" sortable style="min-width: 140px">
            <template #body="slotProps">
              <span class="text-blue-500 font-medium">{{ slotProps.data.memberAccount }}</span>
            </template>
          </Column>

          <!-- Type Column -->
          <Column field="bonusType" header="贈金類型" sortable style="min-width: 130px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.bonusType" :severity="getBonusTypeSeverity(slotProps.data.bonusType)" />
            </template>
          </Column>

          <!-- Amount Column -->
          <Column field="amount" header="贈金金額" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="font-mono font-bold text-green-400">{{ formatCurrency(slotProps.data.amount) }}</span>
            </template>
          </Column>

          <!-- Audit/Turnover Column -->
          <Column field="turnoverReq" header="稽核需求" sortable style="min-width: 150px">
            <template #body="slotProps">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-300 font-mono">{{ slotProps.data.auditMultiplier }}x</span>
                <span class="text-xs text-surface-500">{{ formatCurrency(slotProps.data.turnoverReq) }}</span>
              </div>
            </template>
          </Column>

          <!-- Time Column -->
          <Column field="claimTime" header="領取時間" sortable style="min-width: 160px">
            <template #body="slotProps">
              <span class="text-sm text-surface-500 dark:text-surface-400">{{ slotProps.data.claimTime }}</span>
            </template>
          </Column>

          <!-- Status Column -->
          <Column field="status" header="狀態" sortable style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
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

// Bonus Type Options
const bonusTypeOptions = ref([
  { label: '全部', value: 'all' },
  { label: '存款優惠', value: 'deposit' },
  { label: '每日返水', value: 'rebate' },
  { label: 'VIP晉級禮金', value: 'vip' },
  { label: '活動贈金', value: 'event' }
])

// Filter State
const filters = ref({
  dateRange: null as Date[] | null,
  memberAccount: '',
  bonusType: null
})

// UI State
const isSearching = ref(false)
const hasSearched = ref(false)

// Summary Data
const summaryData = ref({
  totalAmount: 3568000,
  totalUsers: 4521,
  totalTurnoverReq: 28544000
})

// Bonus Records
interface BonusRecord {
  id: number
  memberAccount: string
  bonusType: string
  amount: number
  auditMultiplier: number
  turnoverReq: number
  claimTime: string
  status: string
}

const bonusRecords = ref<BonusRecord[]>([])

// Currency Formatter
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(value)
}

// Severity Helpers
const getBonusTypeSeverity = (type: string): string => {
  const severityMap: Record<string, string> = {
    '存款優惠': 'info',
    '每日返水': 'success',
    'VIP晉級禮金': 'warn',
    '活動贈金': 'danger'
  }
  return severityMap[type] || 'secondary'
}

const getStatusSeverity = (status: string): string => {
  const severityMap: Record<string, string> = {
    '成功': 'success',
    '審核中': 'warn',
    '失敗': 'danger'
  }
  return severityMap[status] || 'info'
}

// Generate Mock Data
const generateMockData = (): BonusRecord[] => {
  const types = ['存款優惠', '每日返水', 'VIP晉級禮金', '活動贈金']
  const statuses = ['成功', '成功', '成功', '審核中', '失敗']
  const data: BonusRecord[] = []
  const today = new Date()

  for (let i = 0; i < 25; i++) {
    const type = types[Math.floor(Math.random() * types.length)]!
    const amount = Math.floor(Math.random() * 10000) + 500
    const auditMultiplier = [1, 3, 5, 8, 10][Math.floor(Math.random() * 5)]!
    const date = new Date(today)
    date.setDate(date.getDate() - Math.floor(Math.random() * 14))

    data.push({
      id: i,
      memberAccount: `user${1000 + Math.floor(Math.random() * 9000)}`,
      bonusType: type,
      amount: amount,
      auditMultiplier: auditMultiplier,
      turnoverReq: amount * auditMultiplier,
      claimTime: date.toLocaleString('zh-TW'),
      status: statuses[Math.floor(Math.random() * statuses.length)]!
    })
  }

  return data.sort((a, b) => new Date(b.claimTime).getTime() - new Date(a.claimTime).getTime())
}

// Actions
const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    bonusRecords.value = generateMockData()
    hasSearched.value = true
    isSearching.value = false
    toast.add({ 
      severity: 'success', 
      summary: '查詢完成', 
      detail: `共找到 ${bonusRecords.value.length} 筆資料`, 
      life: 2000 
    })
  }, 800)
}

const handleReset = () => {
  filters.value = {
    dateRange: null,
    memberAccount: '',
    bonusType: null
  }
  hasSearched.value = false
  bonusRecords.value = []
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
