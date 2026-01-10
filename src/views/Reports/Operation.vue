<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-chart-line text-orange-500 dark:text-orange-400"></i>
      <span class="text-surface-500 dark:text-surface-300">報表管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">營運報表</span>
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
          <!-- Report Type -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">報表類型</label>
            <Select 
              v-model="filters.reportType" 
              :options="reportTypeOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="選擇類型" 
              class="w-[220px]" 
              showClear 
            />
          </div>
          <!-- Dimension -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">資料維度</label>
            <Select 
              v-model="filters.dimension" 
              :options="dimensionOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="選擇維度" 
              class="w-[220px]" 
              showClear 
            />
          </div>
          <!-- Site -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">站點</label>
            <Select 
              v-model="filters.site" 
              :options="siteOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="選擇站點" 
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
      <!-- Total Bets Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總投注額</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(summaryData.totalBets) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-emerald-500">
                <i class="pi pi-arrow-up"></i>
                <span>+12.5% vs 上週</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-chart-line text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Total Payout Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總派彩</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(summaryData.totalPayout) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-orange-500">
                <i class="pi pi-arrow-up"></i>
                <span>+8.2% vs 上週</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-wallet text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Net Profit (GGR) Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">損益 (GGR)</p>
              <p class="text-2xl font-bold" :class="summaryData.netProfit >= 0 ? 'text-emerald-500' : 'text-red-500'">
                {{ summaryData.netProfit >= 0 ? '+' : '' }}{{ formatCurrency(summaryData.netProfit) }}
              </p>
              <div class="flex items-center gap-1 mt-2 text-sm" :class="summaryData.profitChange >= 0 ? 'text-emerald-500' : 'text-red-500'">
                <i :class="summaryData.profitChange >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                <span>{{ summaryData.profitChange >= 0 ? '+' : '' }}{{ summaryData.profitChange }}% vs 上週</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <i class="pi pi-dollar text-emerald-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Active Users Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">活躍人數</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ summaryData.activeUsers.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-purple-500">
                <i class="pi pi-arrow-up"></i>
                <span>+5.3% vs 上週</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-users text-purple-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Data Table Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-list text-purple-500 dark:text-purple-400"></i>
          營運數據列表
          <span v-if="hasSearched" class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ reportData.length }} 筆)</span>
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="hasSearched ? reportData : []" 
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

          <!-- Date Column -->
          <Column field="date" header="日期" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-surface-900 dark:text-white font-medium">{{ slotProps.data.date }}</span>
            </template>
          </Column>

          <!-- Registrations Column -->
          <Column field="registrations" header="新註冊" sortable style="min-width: 100px">
            <template #body="slotProps">
              <span class="text-surface-700 dark:text-surface-300">{{ slotProps.data.registrations.toLocaleString() }}</span>
            </template>
          </Column>

          <!-- First Deposit Users Column -->
          <Column field="firstDepositUsers" header="首存人數" sortable style="min-width: 100px">
            <template #body="slotProps">
              <span class="text-blue-500 font-medium">{{ slotProps.data.firstDepositUsers.toLocaleString() }}</span>
            </template>
          </Column>

          <!-- Total Deposit Column -->
          <Column field="totalDeposit" header="總存款" sortable style="min-width: 140px">
            <template #body="slotProps">
              <span class="font-mono text-emerald-500 font-bold">{{ formatCurrency(slotProps.data.totalDeposit) }}</span>
            </template>
          </Column>

          <!-- Total Withdrawal Column -->
          <Column field="totalWithdrawal" header="總提款" sortable style="min-width: 140px">
            <template #body="slotProps">
              <span class="font-mono text-orange-500 font-bold">{{ formatCurrency(slotProps.data.totalWithdrawal) }}</span>
            </template>
          </Column>

          <!-- Total Bets Column -->
          <Column field="totalBets" header="總投注" sortable style="min-width: 140px">
            <template #body="slotProps">
              <span class="font-mono text-surface-700 dark:text-surface-300">{{ formatCurrency(slotProps.data.totalBets) }}</span>
            </template>
          </Column>

          <!-- GGR Column -->
          <Column field="ggr" header="損益 (GGR)" sortable style="min-width: 140px">
            <template #body="slotProps">
              <span class="font-mono font-bold" :class="slotProps.data.ggr >= 0 ? 'text-emerald-500' : 'text-red-500'">
                {{ slotProps.data.ggr >= 0 ? '+' : '' }}{{ formatCurrency(slotProps.data.ggr) }}
              </span>
            </template>
          </Column>

          <!-- Active Users Column -->
          <Column field="activeUsers" header="活躍人數" sortable style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.activeUsers.toLocaleString()" severity="info" />
            </template>
          </Column>

          <!-- Kill Rate Column -->
          <Column field="killRate" header="殺率" sortable style="min-width: 100px">
            <template #body="slotProps">
              <Tag 
                :value="`${slotProps.data.killRate}%`" 
                :severity="slotProps.data.killRate >= 3 ? 'success' : 'warn'" 
              />
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
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Filter Options
const reportTypeOptions = ref([
  { label: '綜合報表', value: 'comprehensive' },
  { label: '營收報表', value: 'revenue' },
  { label: '活動報表', value: 'activity' },
  { label: '會員報表', value: 'member' }
])

const dimensionOptions = ref([
  { label: '按日', value: 'daily' },
  { label: '按週', value: 'weekly' },
  { label: '按月', value: 'monthly' }
])

const siteOptions = ref([
  { label: '全站', value: 'all' },
  { label: '主站', value: 'main' },
  { label: '代理站 A', value: 'agent_a' },
  { label: '代理站 B', value: 'agent_b' }
])

// Filter State
const filters = ref({
  dateRange: null as Date[] | null,
  reportType: null,
  dimension: 'daily',
  site: 'all'
})

// UI State
const isSearching = ref(false)
const hasSearched = ref(false)

// Summary Data
const summaryData = ref({
  totalBets: 125680000,
  totalPayout: 118520000,
  netProfit: 7160000,
  profitChange: 15.8,
  activeUsers: 28456
})

// Report Data
interface ReportRow {
  id: number
  date: string
  registrations: number
  firstDepositUsers: number
  totalDeposit: number
  totalWithdrawal: number
  totalBets: number
  ggr: number
  activeUsers: number
  killRate: number
}

const reportData = ref<ReportRow[]>([])

// Currency Formatter
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(value)
}

// Generate Mock Data
const generateMockData = (): ReportRow[] => {
  const data: ReportRow[] = []
  const today = new Date()
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const totalBets = Math.floor(Math.random() * 15000000) + 5000000
    const rtp = 0.92 + Math.random() * 0.06 // RTP between 92% and 98%
    const payout = Math.floor(totalBets * rtp)
    const deposit = Math.floor(Math.random() * 8000000) + 2000000
    const withdrawal = Math.floor(deposit * (0.6 + Math.random() * 0.3))
    
    data.push({
      id: i,
      date: date.toLocaleDateString('zh-TW'),
      registrations: Math.floor(Math.random() * 500) + 100,
      firstDepositUsers: Math.floor(Math.random() * 200) + 50,
      totalDeposit: deposit,
      totalWithdrawal: withdrawal,
      totalBets: totalBets,
      ggr: totalBets - payout,
      activeUsers: Math.floor(Math.random() * 5000) + 1500,
      killRate: Number((((totalBets - payout) / totalBets) * 100).toFixed(2))
    })
  }
  
  return data
}

// Actions
const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    reportData.value = generateMockData()
    hasSearched.value = true
    isSearching.value = false
    toast.add({ 
      severity: 'success', 
      summary: '查詢完成', 
      detail: `共找到 ${reportData.value.length} 筆資料`, 
      life: 2000 
    })
  }, 800)
}

const handleReset = () => {
  filters.value = {
    dateRange: null,
    reportType: null,
    dimension: 'daily',
    site: 'all'
  }
  hasSearched.value = false
  reportData.value = []
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
