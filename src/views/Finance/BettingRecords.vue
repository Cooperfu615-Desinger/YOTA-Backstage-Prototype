<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-wallet text-blue-400"></i>
      <span class="text-surface-300">財務管理</span>
      <span>></span>
      <span class="text-surface-300">紀錄查詢</span>
      <span>></span>
      <span class="text-white font-medium">下注紀錄</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-search text-blue-400"></i>
          下注紀錄搜尋
        </div>
      </template>
      <template #content>
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">會員 ID</label>
            <InputText v-model="filters.memberId" placeholder="輸入會員 ID" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">遊戲單號</label>
            <InputText v-model="filters.betId" placeholder="輸入遊戲單號" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">平台名稱</label>
            <Dropdown v-model="filters.platform" :options="platformOptions" optionLabel="label" optionValue="value" placeholder="選擇平台" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">遊戲類型</label>
            <Dropdown v-model="filters.gameType" :options="gameTypeOptions" optionLabel="label" optionValue="value" placeholder="選擇類型" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">狀態</label>
            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="選擇狀態" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">日期範圍</label>
            <Calendar v-model="filters.dateRange" selectionMode="range" :manualInput="false" placeholder="選擇日期範圍" class="w-[220px]" showIcon />
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- Betting Records List -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-th-large text-purple-400"></i>
          下注紀錄列表
          <span v-if="hasSearched" class="text-sm text-surface-400 font-normal ml-2">(共 {{ filteredBets.length }} 筆)</span>
        </div>
      </template>
      <template #content>
         <DataTable :value="filteredBets" :loading="isSearching" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
                <p class="text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column field="betTime" header="下注時間" style="min-width: 160px">
                 <template #body="slotProps">
                    <span class="text-sm text-surface-400">{{ slotProps.data.betTime }}</span>
                </template>
            </Column>
            <Column field="betId" header="單號" style="min-width: 180px">
                 <template #body="slotProps">
                    <span class="font-mono text-sm text-blue-400 cursor-pointer hover:underline" 
                          @click="openDetailDialog(slotProps.data)"
                          v-tooltip.top="'點擊查看詳情'">
                        {{ slotProps.data.betId }}
                    </span>
                </template>
            </Column>
            <Column field="memberId" header="會員 ID" style="min-width: 120px">
                 <template #body="slotProps">
                    <span class="text-surface-300 font-medium">{{ slotProps.data.memberId }}</span>
                </template>
            </Column>
            <Column field="game" header="遊戲資訊" style="min-width: 250px">
                 <template #body="slotProps">
                    <div class="space-y-1">
                        <div class="text-sm text-blue-400">{{ slotProps.data.platform }}</div>
                        <div class="text-sm text-surface-300">{{ slotProps.data.gameName }}</div>
                        <div class="text-xs text-surface-500">局號: {{ slotProps.data.roundId }}</div>
                    </div>
                </template>
            </Column>
            <Column field="betAmount" header="投注額" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono text-surface-300">{{ formatCurrency(slotProps.data.betAmount) }}</span>
                </template>
            </Column>
            <Column field="validBet" header="有效投注" style="min-width: 120px">
                 <template #body="slotProps">
                     <div class="flex flex-col">
                         <span class="font-mono text-white font-bold">{{ formatCurrency(slotProps.data.validBet) }}</span>
                         <span v-if="slotProps.data.validBet < slotProps.data.betAmount" 
                               class="text-xs text-yellow-400"
                               v-tooltip.top="'有效投注小於實際投注'">
                             <i class="pi pi-exclamation-triangle text-xs"></i> 部分有效
                         </span>
                     </div>
                </template>
            </Column>
            <Column field="profitLoss" header="盈虧金額" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono font-bold" :class="slotProps.data.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'">
                        {{ slotProps.data.profitLoss >= 0 ? '+' : '' }}{{ formatCurrency(slotProps.data.profitLoss) }}
                     </span>
                </template>
            </Column>
            <Column field="status" header="狀態" style="min-width: 100px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <!-- Bet Detail Dialog -->
    <Dialog v-model:visible="detailDialogVisible" modal :header="`投注詳情 - ${currentBet?.betId}`" :style="{ width: '700px' }">
        <div v-if="currentBet" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-surface-400 text-sm">會員 ID</label>
                    <div class="text-white font-medium">{{ currentBet.memberId }}</div>
                </div>
                <div>
                    <label class="text-surface-400 text-sm">下注時間</label>
                    <div class="text-white">{{ currentBet.betTime }}</div>
                </div>
                <div>
                    <label class="text-surface-400 text-sm">遊戲平台</label>
                    <div class="text-blue-400">{{ currentBet.platform }}</div>
                </div>
                <div>
                    <label class="text-surface-400 text-sm">遊戲名稱</label>
                    <div class="text-white">{{ currentBet.gameName }}</div>
                </div>
                <div>
                    <label class="text-surface-400 text-sm">投注額</label>
                    <div class="text-white font-mono">{{ formatCurrency(currentBet.betAmount) }}</div>
                </div>
                <div>
                    <label class="text-surface-400 text-sm">有效投注</label>
                    <div class="text-green-400 font-mono font-bold">{{ formatCurrency(currentBet.validBet) }}</div>
                </div>
                <div>
                    <label class="text-surface-400 text-sm">盈虧金額</label>
                    <div :class="currentBet.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'" class="font-mono font-bold">
                        {{ currentBet.profitLoss >= 0 ? '+' : '' }}{{ formatCurrency(currentBet.profitLoss) }}
                    </div>
                </div>
                <div>
                    <label class="text-surface-400 text-sm">狀態</label>
                    <div><Tag :value="currentBet.status" :severity="getStatusSeverity(currentBet.status)" /></div>
                </div>
            </div>

            <div class="border-t border-surface-700 pt-4">
                <label class="text-surface-400 text-sm block mb-2">遊戲結果</label>
                <div class="bg-surface-900 rounded p-3 text-sm text-surface-300">
                    {{ currentBet.gameResult }}
                </div>
            </div>

            <div class="border-t border-surface-700 pt-4">
                <label class="text-surface-400 text-sm block mb-2">原始數據 (JSON)</label>
                <pre class="bg-surface-900 rounded p-3 text-xs text-green-400 overflow-x-auto">{{ JSON.stringify(currentBet.rawData, null, 2) }}</pre>
            </div>
        </div>
    </Dialog>
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
import Dialog from 'primevue/dialog'
import Calendar from 'primevue/calendar'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

onMounted(() => {
    generateMockData()
})

const platformOptions = ref([
    { label: 'AG 真人', value: 'AG 真人' },
    { label: 'EVO 視訊', value: 'EVO 視訊' },
    { label: 'PP 電子', value: 'PP 電子' },
    { label: 'PG 電子', value: 'PG 電子' },
    { label: 'IM 體育', value: 'IM 體育' },
])

const gameTypeOptions = ref([
    { label: '真人', value: '真人' },
    { label: '電子', value: '電子' },
    { label: '體育', value: '體育' },
    { label: '彩票', value: '彩票' },
])

const statusOptions = ref([
    { label: '已結算', value: '已結算' },
    { label: '待結算', value: '待結算' },
    { label: '已取消', value: '已取消' },
])

const filters = ref({
    memberId: '',
    betId: '',
    platform: null,
    gameType: null,
    status: null,
    dateRange: null
})

const isSearching = ref(false)
const hasSearched = ref(false)
const bettingRecords = ref<any[]>([])
const detailDialogVisible = ref(false)
const currentBet = ref<any>(null)

const filteredBets = computed(() => {
    if (!hasSearched.value) return []
    let result = bettingRecords.value
    
    if (filters.value.memberId) {
        result = result.filter(bet => bet.memberId.includes(filters.value.memberId))
    }
    if (filters.value.betId) {
        result = result.filter(bet => bet.betId.includes(filters.value.betId))
    }
    if (filters.value.platform) {
        result = result.filter(bet => bet.platform === filters.value.platform)
    }
    if (filters.value.gameType) {
        result = result.filter(bet => bet.gameType === filters.value.gameType)
    }
    if (filters.value.status) {
        result = result.filter(bet => bet.status === filters.value.status)
    }
    
    return result
})

const handleSearch = () => {
    isSearching.value = true
    setTimeout(() => {
        hasSearched.value = true
        isSearching.value = false
        toast.add({ severity: 'success', summary: '搜尋完成', detail: `共找到 ${filteredBets.value.length} 筆資料`, life: 1000 })
    }, 500)
}

const handleReset = () => {
    filters.value = { memberId: '', betId: '', platform: null, gameType: null, status: null, dateRange: null }
    hasSearched.value = false
}

const openDetailDialog = (bet: any) => {
    currentBet.value = bet
    detailDialogVisible.value = true
}

const generateMockData = () => {
    const platforms = [
        { name: 'AG 真人', type: '真人', games: ['百家樂', '輪盤', '龍虎'] },
        { name: 'EVO 視訊', type: '真人', games: ['閃電百家樂', '瘋狂時刻'] },
        { name: 'PP 電子', type: '電子', games: ['糖果大爆炸', '狂野西部'] },
        { name: 'PG 電子', type: '電子', games: ['財神到', '麻將胡了'] },
        { name: 'IM 體育', type: '體育', games: ['足球投注', '籃球投注'] },
    ]
    const statuses = ['已結算', '待結算', '已取消']
    
    const bets: any[] = []
    
    // Scenario 1: 大額中獎
    bets.push({
        id: 0,
        betTime: new Date(Date.now() - 3600000).toISOString().replace('T', ' ').substring(0, 19),
        betId: `BET${20260107000}`,
        memberId: 'user1088',
        platform: 'PG 電子',
        gameType: '電子',
        gameName: '財神到',
        roundId: `RD${Date.now() - 3600000}`,
        betAmount: 500,
        validBet: 500,
        profitLoss: 28800, // 大額中獎
        status: '已結算',
        gameResult: '觸發免費遊戲 x15，總計贏得 28,800 元',
        rawData: {
            betId: `BET${20260107000}`,
            gameId: 'fortune-tiger',
            userId: 'user1088',
            betAmount: 500,
            winAmount: 29300,
            features: ['FREE_SPINS', 'MULTIPLIER_X3'],
            timestamp: new Date(Date.now() - 3600000).toISOString()
        }
    })
    
    // Scenario 2: 待結算體育注單
    bets.push({
        id: 1,
        betTime: new Date(Date.now() - 1800000).toISOString().replace('T', ' ').substring(0, 19),
        betId: `BET${20260107001}`,
        memberId: 'user1055',
        platform: 'IM 體育',
        gameType: '體育',
        gameName: '足球投注',
        roundId: `MATCH${Date.now() - 1800000}`,
        betAmount: 2000,
        validBet: 2000,
        profitLoss: 0,
        status: '待結算',
        gameResult: '英超：曼聯 vs 利物浦 (進行中)',
        rawData: {
            betId: `BET${20260107001}`,
            matchId: 'EPL-20260107-001',
            selection: 'HOME_WIN',
            odds: 2.15,
            betAmount: 2000,
            status: 'PENDING'
        }
    })
    
    // Scenario 3: 有效投注 < 實際投注
    bets.push({
        id: 2,
        betTime: new Date(Date.now() - 7200000).toISOString().replace('T', ' ').substring(0, 19),
        betId: `BET${20260107002}`,
        memberId: 'user1022',
        platform: 'AG 真人',
        gameType: '真人',
        gameName: '百家樂',
        roundId: `RD${Date.now() - 7200000}`,
        betAmount: 5000,
        validBet: 500, // 只有10%有效
        profitLoss: -5000,
        status: '已結算',
        gameResult: '莊贏 8:3 (對沖投注，部分有效)',
        rawData: {
            betId: `BET${20260107002}`,
            gameId: 'baccarat-vip',
            banker: 8,
            player: 3,
            betDetails: { banker: 2500, player: 2500 },
            validBetRatio: 0.1
        }
    })
    
    // 更多常規數據
    for (let i = 3; i < 25; i++) {
        const platform = platforms[Math.floor(Math.random() * platforms.length)]!
        const game = platform.games[Math.floor(Math.random() * platform.games.length)]!
        const status = i < 23 ? '已結算' : statuses[Math.floor(Math.random() * statuses.length)]!
        const betAmount = Math.floor(Math.random() * 3000) + 100
        const validBet = betAmount * (Math.random() > 0.9 ? Math.random() * 0.5 + 0.5 : 1)
        const profitLoss = status === '已結算' ? (Math.random() - 0.55) * betAmount * 2 : 0
        
        bets.push({
            id: i,
            betTime: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400 * 1000)).toISOString().replace('T', ' ').substring(0, 19),
            betId: `BET${20260107000 + i}`,
            memberId: `user${1000 + Math.floor(Math.random() * 100)}`,
            platform: platform.name,
            gameType: platform.type,
            gameName: game,
            roundId: `RD${Date.now() - Math.floor(Math.random() * 86400000)}`,
            betAmount,
            validBet: Math.round(validBet),
            profitLoss: Math.round(profitLoss),
            status,
            gameResult: status === '已結算' ? (profitLoss > 0 ? `贏得 ${Math.abs(profitLoss)} 元` : `輸掉 ${Math.abs(profitLoss)} 元`) : '等待結算中',
            rawData: {
                betId: `BET${20260107000 + i}`,
                gameId: game.toLowerCase().replace(/\s/g, '-'),
                result: status === '已結算' ? (profitLoss > 0 ? 'WIN' : 'LOSE') : 'PENDING'
            }
        })
    }
    
    bettingRecords.value = bets.sort((a, b) => new Date(b.betTime).getTime() - new Date(a.betTime).getTime())
}

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)

const getStatusSeverity = (status: string) => {
    const severityMap: Record<string, string> = {
        '已結算': 'success',
        '待結算': 'warning',
        '已取消': 'danger'
    }
    return severityMap[status] || 'info'
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
