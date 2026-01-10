<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-chart-line text-orange-500 dark:text-orange-400"></i>
      <span class="text-surface-500 dark:text-surface-300">報表管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">在線存款報表</span>
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
          <!-- Order ID -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">訂單號</label>
            <InputText 
              v-model="filters.orderId" 
              placeholder="輸入訂單號" 
              class="w-[220px]" 
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
          <!-- Payment Channel -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">支付渠道</label>
            <Select 
              v-model="filters.channel" 
              :options="channelOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="選擇渠道" 
              class="w-[220px]" 
              showClear 
            />
          </div>
          <!-- Status -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">狀態</label>
            <Select 
              v-model="filters.status" 
              :options="statusOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="選擇狀態" 
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
      <!-- Total Deposit Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總存款金額</p>
              <p class="text-2xl font-bold text-green-500">{{ formatCurrency(summaryData.totalDeposit) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-emerald-500">
                <i class="pi pi-arrow-up"></i>
                <span>+15.2% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-wallet text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Success Count Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">成功筆數</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ summaryData.successCount.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-blue-500">
                <i class="pi pi-arrow-up"></i>
                <span>+128 筆 vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-check-circle text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Success Rate Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">成功率</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ summaryData.successRate }}%</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-emerald-500">
                <i class="pi pi-arrow-up"></i>
                <span>+0.5% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-chart-pie text-purple-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Total Fee Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">手續費總額</p>
              <p class="text-2xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(summaryData.totalFee) }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-orange-500">
                <i class="pi pi-arrow-up"></i>
                <span>+8.3% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-percentage text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Data Table Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-list text-blue-500 dark:text-blue-400"></i>
          存款訂單列表
          <span v-if="hasSearched" class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ depositRecords.length }} 筆)</span>
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="hasSearched ? depositRecords : []" 
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

          <!-- Order ID Column -->
          <Column field="orderId" header="訂單號" sortable style="min-width: 180px">
            <template #body="slotProps">
              <span class="font-mono text-blue-500">{{ slotProps.data.orderId }}</span>
            </template>
          </Column>

          <!-- Member Column -->
          <Column field="memberAccount" header="會員帳號" sortable style="min-width: 130px">
            <template #body="slotProps">
              <span class="text-surface-700 dark:text-surface-300 font-medium">{{ slotProps.data.memberAccount }}</span>
            </template>
          </Column>

          <!-- Payment Method Column -->
          <Column field="paymentMethod" header="支付方式" sortable style="min-width: 150px">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i :class="['pi', getMethodIcon(slotProps.data.paymentMethod)]"></i>
                <span class="text-surface-700 dark:text-surface-300">{{ slotProps.data.paymentMethod }}</span>
              </div>
            </template>
          </Column>

          <!-- Amount Column -->
          <Column field="amount" header="申請金額" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="font-mono text-surface-700 dark:text-surface-300">{{ formatCurrency(slotProps.data.amount) }}</span>
            </template>
          </Column>

          <!-- Real Amount Column -->
          <Column field="realAmount" header="實際到帳" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="font-mono font-bold text-green-400">{{ formatCurrency(slotProps.data.realAmount) }}</span>
            </template>
          </Column>

          <!-- Fee Column -->
          <Column field="fee" header="手續費" sortable style="min-width: 100px">
            <template #body="slotProps">
              <span class="font-mono text-orange-400">{{ formatCurrency(slotProps.data.fee) }}</span>
            </template>
          </Column>

          <!-- Time Column -->
          <Column field="createTime" header="建立/完成時間" sortable style="min-width: 180px">
            <template #body="slotProps">
              <div class="flex flex-col text-sm">
                <span class="text-surface-500 dark:text-surface-400">{{ slotProps.data.createTime }}</span>
                <span v-if="slotProps.data.finishTime" class="text-xs text-surface-400">完成: {{ slotProps.data.finishTime }}</span>
              </div>
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

// Channel Options
const channelOptions = ref([
  { label: '全部', value: 'all' },
  { label: 'USDT', value: 'usdt' },
  { label: '網銀轉帳', value: 'bank' },
  { label: '超商代碼', value: 'convenience' },
  { label: '電子錢包', value: 'ewallet' }
])

// Status Options
const statusOptions = ref([
  { label: '全部', value: 'all' },
  { label: '成功', value: 'success' },
  { label: '失敗', value: 'failed' },
  { label: '處理中', value: 'pending' }
])

// Filter State
const filters = ref({
  dateRange: null as Date[] | null,
  orderId: '',
  memberAccount: '',
  channel: null,
  status: null
})

// UI State
const isSearching = ref(false)
const hasSearched = ref(false)

// Summary Data
const summaryData = ref({
  totalDeposit: 15680000,
  successCount: 3254,
  successRate: 98.5,
  totalFee: 78400
})

// Deposit Records
interface DepositRecord {
  id: number
  orderId: string
  memberAccount: string
  paymentMethod: string
  amount: number
  realAmount: number
  fee: number
  createTime: string
  finishTime: string | null
  status: string
}

const depositRecords = ref<DepositRecord[]>([])

// Currency Formatter
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(value)
}

// Method Icon Helper
const getMethodIcon = (method: string): string => {
  if (method.includes('USDT')) return 'pi-bitcoin'
  if (method.includes('銀行') || method.includes('網銀')) return 'pi-building-columns'
  if (method.includes('超商')) return 'pi-shop'
  if (method.includes('電子')) return 'pi-mobile'
  return 'pi-credit-card'
}

// Status Severity Helper
const getStatusSeverity = (status: string): string => {
  const severityMap: Record<string, string> = {
    '成功': 'success',
    '失敗': 'danger',
    '處理中': 'warn'
  }
  return severityMap[status] || 'info'
}

// Generate Mock Data
const generateMockData = (): DepositRecord[] => {
  const methods = ['USDT (TRC20)', 'USDT (ERC20)', '網銀轉帳', '超商代碼', '電子錢包 (街口)', '電子錢包 (LINE Pay)']
  const statuses = ['成功', '成功', '成功', '成功', '處理中', '失敗']
  const data: DepositRecord[] = []
  const today = new Date()

  for (let i = 0; i < 30; i++) {
    const amount = Math.floor(Math.random() * 50000) + 1000
    const feeRate = 0.005 + Math.random() * 0.015
    const fee = Math.floor(amount * feeRate)
    const status = statuses[Math.floor(Math.random() * statuses.length)]!
    const createDate = new Date(today)
    createDate.setMinutes(createDate.getMinutes() - Math.floor(Math.random() * 10080)) // Random within 7 days

    data.push({
      id: i,
      orderId: `DEP${Date.now() - i * 1000}${Math.floor(Math.random() * 1000)}`,
      memberAccount: `user${1000 + Math.floor(Math.random() * 9000)}`,
      paymentMethod: methods[Math.floor(Math.random() * methods.length)]!,
      amount: amount,
      realAmount: status === '成功' ? amount - fee : 0,
      fee: status === '成功' ? fee : 0,
      createTime: createDate.toLocaleString('zh-TW'),
      finishTime: status === '成功' ? new Date(createDate.getTime() + Math.floor(Math.random() * 300000)).toLocaleString('zh-TW') : null,
      status: status
    })
  }

  return data.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
}

// Actions
const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    depositRecords.value = generateMockData()
    hasSearched.value = true
    isSearching.value = false
    toast.add({ 
      severity: 'success', 
      summary: '查詢完成', 
      detail: `共找到 ${depositRecords.value.length} 筆資料`, 
      life: 2000 
    })
  }, 800)
}

const handleReset = () => {
  filters.value = {
    dateRange: null,
    orderId: '',
    memberAccount: '',
    channel: null,
    status: null
  }
  hasSearched.value = false
  depositRecords.value = []
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
