<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-chart-line text-orange-500 dark:text-orange-400"></i>
      <span class="text-surface-500 dark:text-surface-300">報表管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">遊戲表現</span>
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
          <!-- Round ID -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">遊戲局號</label>
            <InputText 
              v-model="filters.roundId" 
              placeholder="輸入局號" 
              class="w-[220px]" 
            />
          </div>
          <!-- Platform -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">遊戲平台</label>
            <Select 
              v-model="filters.platform" 
              :options="platformOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="選擇平台" 
              class="w-[220px]" 
              showClear 
            />
          </div>
          <!-- Game Type -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">遊戲類型</label>
            <Select 
              v-model="filters.gameType" 
              :options="gameTypeOptions" 
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
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
      <!-- Total Bet Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總投注</p>
              <p class="text-xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(summaryData.totalBet) }}</p>
              <div class="flex items-center gap-1 mt-2 text-xs text-blue-500">
                <i class="pi pi-arrow-up"></i>
                <span>+8.2%</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-chart-bar text-blue-500"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Valid Bet Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">有效投注</p>
              <p class="text-xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(summaryData.validBet) }}</p>
              <div class="flex items-center gap-1 mt-2 text-xs text-purple-500">
                <span>佔比 {{ ((summaryData.validBet / summaryData.totalBet) * 100).toFixed(1) }}%</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-verified text-purple-500"></i>
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
              <p class="text-xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(summaryData.totalPayout) }}</p>
              <div class="flex items-center gap-1 mt-2 text-xs text-orange-500">
                <i class="pi pi-arrow-up"></i>
                <span>+5.6%</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-wallet text-orange-500"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Win/Loss Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總損益</p>
              <p class="text-xl font-bold" :class="summaryData.winLoss >= 0 ? 'text-green-500' : 'text-red-500'">
                {{ summaryData.winLoss >= 0 ? '+' : '' }}{{ formatCurrency(summaryData.winLoss) }}
              </p>
              <div class="flex items-center gap-1 mt-2 text-xs" :class="summaryData.winLoss >= 0 ? 'text-green-500' : 'text-red-500'">
                <i :class="summaryData.winLoss >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
                <span>{{ summaryData.winLoss >= 0 ? '平台獲利' : '平台虧損' }}</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-lg" :class="summaryData.winLoss >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'">
              <div class="w-full h-full flex items-center justify-center">
                <i :class="['pi', summaryData.winLoss >= 0 ? 'pi-trending-up text-green-500' : 'pi-trending-down text-red-500']"></i>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- RTP Card -->
      <Card class="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">RTP (返還率)</p>
              <p class="text-xl font-bold text-surface-900 dark:text-white">{{ summaryData.rtp }}%</p>
              <div class="flex items-center gap-1 mt-2 text-xs text-cyan-500">
                <span>殺數 {{ (100 - summaryData.rtp).toFixed(2) }}%</span>
              </div>
            </div>
            <div class="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <i class="pi pi-percentage text-cyan-500"></i>
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
          遊戲注單列表
          <span v-if="hasSearched" class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ gameRecords.length }} 筆)</span>
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="hasSearched ? gameRecords : []" 
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

          <!-- Bet ID Column -->
          <Column field="betId" header="註單號" sortable style="min-width: 160px">
            <template #body="slotProps">
              <span class="font-mono text-blue-500 text-sm">{{ slotProps.data.betId }}</span>
            </template>
          </Column>

          <!-- Platform/Game Column -->
          <Column field="platform" header="平台/遊戲" sortable style="min-width: 180px">
            <template #body="slotProps">
              <div class="flex flex-col">
                <span class="text-surface-700 dark:text-surface-300 font-medium">{{ slotProps.data.platform }}</span>
                <span class="text-xs text-surface-500">{{ slotProps.data.gameName }}</span>
              </div>
            </template>
          </Column>

          <!-- Member Column -->
          <Column field="memberAccount" header="會員帳號" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-surface-700 dark:text-surface-300">{{ slotProps.data.memberAccount }}</span>
            </template>
          </Column>

          <!-- Bet Amount Column -->
          <Column field="betAmount" header="投注金額" sortable style="min-width: 110px">
            <template #body="slotProps">
              <span class="font-mono text-surface-700 dark:text-surface-300">{{ formatCurrency(slotProps.data.betAmount) }}</span>
            </template>
          </Column>

          <!-- Valid Bet Column -->
          <Column field="validBet" header="有效投注" sortable style="min-width: 110px">
            <template #body="slotProps">
              <span class="font-mono text-purple-400">{{ formatCurrency(slotProps.data.validBet) }}</span>
            </template>
          </Column>

          <!-- Win/Loss Column -->
          <Column field="winLoss" header="損益金額" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span 
                class="font-mono font-bold" 
                :class="slotProps.data.winLoss >= 0 ? 'text-green-400' : 'text-red-400'"
              >
                {{ slotProps.data.winLoss >= 0 ? '+' : '' }}{{ formatCurrency(slotProps.data.winLoss) }}
              </span>
            </template>
          </Column>

          <!-- Time Column -->
          <Column field="betTime" header="投注時間" sortable style="min-width: 150px">
            <template #body="slotProps">
              <span class="text-sm text-surface-500 dark:text-surface-400">{{ slotProps.data.betTime }}</span>
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

// Platform Options
const platformOptions = ref([
  { label: '全部', value: 'all' },
  { label: 'PG Soft', value: 'pg' },
  { label: 'JDB', value: 'jdb' },
  { label: 'Evolution', value: 'evo' },
  { label: 'PP (Pragmatic Play)', value: 'pp' }
])

// Game Type Options
const gameTypeOptions = ref([
  { label: '全部', value: 'all' },
  { label: '老虎機', value: 'slots' },
  { label: '真人視訊', value: 'live' },
  { label: '體育', value: 'sports' },
  { label: '彩票', value: 'lottery' }
])

// Filter State
const filters = ref({
  dateRange: null as Date[] | null,
  memberAccount: '',
  roundId: '',
  platform: null,
  gameType: null
})

// UI State
const isSearching = ref(false)
const hasSearched = ref(false)

// Summary Data
const summaryData = ref({
  totalBet: 125680000,
  validBet: 118520000,
  totalPayout: 119250000,
  winLoss: 6430000,
  rtp: 94.89
})

// Game Records
interface GameRecord {
  id: number
  betId: string
  platform: string
  gameName: string
  memberAccount: string
  betAmount: number
  validBet: number
  winLoss: number
  betTime: string
  status: string
}

const gameRecords = ref<GameRecord[]>([])

// Currency Formatter
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0
  }).format(value)
}

// Status Severity Helper
const getStatusSeverity = (status: string): string => {
  const severityMap: Record<string, string> = {
    '已結算': 'success',
    '未結算': 'warn',
    '取消': 'danger'
  }
  return severityMap[status] || 'secondary'
}

// Generate Mock Data
const generateMockData = (): GameRecord[] => {
  const platforms = [
    { name: 'PG Soft', games: ['財神爺', '麻將胡了', '寶石傳奇'] },
    { name: 'JDB', games: ['龍王捕魚', '夜上海', '招財喵'] },
    { name: 'Evolution', games: ['百家樂', '輪盤', '21點'] },
    { name: 'PP', games: ['甜蜜驚喜', '狂野西部', '糖果樂園'] }
  ]
  const statuses = ['已結算', '已結算', '已結算', '已結算', '未結算']
  const data: GameRecord[] = []
  const today = new Date()

  for (let i = 0; i < 40; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)]!
    const game = platform.games[Math.floor(Math.random() * platform.games.length)]!
    const betAmount = Math.floor(Math.random() * 10000) + 100
    const validBet = betAmount * (0.9 + Math.random() * 0.1)
    const winLoss = Math.random() > 0.45 ? -betAmount * (0.1 + Math.random() * 0.9) : betAmount * (0.1 + Math.random() * 2)
    const betDate = new Date(today)
    betDate.setMinutes(betDate.getMinutes() - Math.floor(Math.random() * 20160))

    data.push({
      id: i,
      betId: `BET${Date.now() - i * 1000}${Math.floor(Math.random() * 1000)}`,
      platform: platform.name,
      gameName: game,
      memberAccount: `user${1000 + Math.floor(Math.random() * 9000)}`,
      betAmount: betAmount,
      validBet: Math.floor(validBet),
      winLoss: Math.floor(winLoss),
      betTime: betDate.toLocaleString('zh-TW'),
      status: statuses[Math.floor(Math.random() * statuses.length)]!
    })
  }

  return data.sort((a, b) => new Date(b.betTime).getTime() - new Date(a.betTime).getTime())
}

// Actions
const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    gameRecords.value = generateMockData()
    hasSearched.value = true
    isSearching.value = false
    toast.add({ 
      severity: 'success', 
      summary: '查詢完成', 
      detail: `共找到 ${gameRecords.value.length} 筆資料`, 
      life: 2000 
    })
  }, 800)
}

const handleReset = () => {
  filters.value = {
    dateRange: null,
    memberAccount: '',
    roundId: '',
    platform: null,
    gameType: null
  }
  hasSearched.value = false
  gameRecords.value = []
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
