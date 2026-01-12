<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-play text-purple-500 dark:text-purple-400"></i>
      <span class="text-surface-500 dark:text-surface-300">遊戲管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">遊戲列表</span>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Games Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總遊戲數</p>
              <p class="text-3xl font-bold text-surface-900 dark:text-white">{{ summaryData.totalGames.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-blue-500">
                <i class="pi pi-database"></i>
                <span>資料庫遊戲總量</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-th-large text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Active Games Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">已上架</p>
              <p class="text-3xl font-bold text-green-500">{{ summaryData.activeGames.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-green-500">
                <i class="pi pi-check-circle"></i>
                <span>{{ ((summaryData.activeGames / summaryData.totalGames) * 100).toFixed(1) }}% 上架率</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-check text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Average RTP Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">平均 RTP</p>
              <p class="text-3xl font-bold text-orange-500">{{ summaryData.avgRtp }}%</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-orange-500">
                <i class="pi pi-percentage"></i>
                <span>玩家返還率</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-chart-bar text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Filter Toolbar -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #content>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Filters -->
          <div class="flex flex-wrap gap-4">
            <InputText v-model="filters.search" placeholder="遊戲名稱/ID" class="w-[220px]" />
            <Select v-model="filters.provider" :options="providerOptions" optionLabel="label" optionValue="value" placeholder="供應商" class="w-[220px]" showClear />
            <Select v-model="filters.type" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="類型" class="w-[220px]" showClear />
            <Select v-model="filters.volatility" :options="volatilityOptions" optionLabel="label" optionValue="value" placeholder="波動率" class="w-[220px]" showClear />
          </div>
          <!-- Actions -->
          <div class="flex gap-3">
            <Button label="同步遊戲" icon="pi pi-sync" severity="secondary" @click="openSyncDialog" />
            <Button label="新增遊戲" icon="pi pi-plus" @click="openNew" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Data Table -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-list text-purple-500"></i>
          遊戲資料庫
          <span class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ filteredGames.length }} 款遊戲)</span>
        </div>
      </template>
      <template #content>
        <DataTable :value="filteredGames" stripedRows paginator :rows="20" :rowsPerPageOptions="[10, 20, 50]">
          <!-- Game Info Column -->
          <Column header="遊戲資訊" style="min-width: 250px">
            <template #body="slotProps">
              <div class="flex items-center gap-3">
                <div class="w-16 h-16 rounded-lg bg-gradient-to-br overflow-hidden flex items-center justify-center text-white font-bold text-lg" :style="{ background: slotProps.data.color }">
                  {{ slotProps.data.name.charAt(0) }}
                </div>
                <div>
                  <p class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.name }}</p>
                  <p class="text-sm text-surface-500 font-mono">{{ slotProps.data.gameId }}</p>
                </div>
              </div>
            </template>
          </Column>

          <!-- Provider Column -->
          <Column field="provider" header="供應商" sortable style="min-width: 120px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.provider" :severity="getProviderSeverity(slotProps.data.provider)" />
            </template>
          </Column>

          <!-- Type Column -->
          <Column field="type" header="類型" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-surface-700 dark:text-surface-300">{{ slotProps.data.type }}</span>
            </template>
          </Column>

          <!-- RTP Column -->
          <Column field="rtp" header="RTP" sortable style="min-width: 80px">
            <template #body="slotProps">
              <span class="font-mono text-green-500 font-medium">{{ slotProps.data.rtp }}%</span>
            </template>
          </Column>

          <!-- Volatility Column -->
          <Column field="volatility" header="波動率" sortable style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.volatility" :severity="getVolatilitySeverity(slotProps.data.volatility)" />
            </template>
          </Column>

          <!-- Tags Column -->
          <Column header="行銷標籤" style="min-width: 120px">
            <template #body="slotProps">
              <div class="flex gap-1">
                <Button v-if="slotProps.data.isHot" icon="pi pi-fire" severity="danger" text rounded size="small" v-tooltip="'Hot'" @click="toggleTag(slotProps.data, 'isHot')" />
                <Button v-if="slotProps.data.isNew" icon="pi pi-sparkles" severity="success" text rounded size="small" v-tooltip="'New'" @click="toggleTag(slotProps.data, 'isNew')" />
                <Button v-if="slotProps.data.isTop" icon="pi pi-star-fill" severity="warn" text rounded size="small" v-tooltip="'Top'" @click="toggleTag(slotProps.data, 'isTop')" />
                <span v-if="!slotProps.data.isHot && !slotProps.data.isNew && !slotProps.data.isTop" class="text-surface-400">-</span>
              </div>
            </template>
          </Column>

          <!-- Status Column -->
          <Column field="status" header="狀態" sortable style="min-width: 100px">
            <template #body="slotProps">
              <InputSwitch v-model="slotProps.data.isActive" @change="handleStatusChange(slotProps.data)" />
            </template>
          </Column>

          <!-- Actions Column -->
          <Column header="操作" style="min-width: 150px">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button icon="pi pi-pencil" label="編輯" severity="info" text size="small" @click="editGame(slotProps.data)" />
                <Button icon="pi pi-play" label="試玩" severity="secondary" text size="small" @click="handleDemo(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Game Editor Dialog -->
    <Dialog v-model:visible="editorDialogVisible" :header="isEditMode ? '編輯遊戲' : '新增遊戲'" modal :style="{ width: '650px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <!-- Row 1: Basic Info -->
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">遊戲名稱 <span class="text-red-500">*</span></label>
            <InputText v-model="gameForm.name" placeholder="Gates of Olympus" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">遊戲代碼</label>
            <InputText v-model="gameForm.gameId" placeholder="PG001" :disabled="isEditMode" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">所屬平台</label>
            <Select v-model="gameForm.provider" :options="providerSelectOptions" optionLabel="label" optionValue="value" placeholder="選擇平台" />
          </div>
        </div>

        <!-- Row 2: Numeric Settings -->
        <div class="grid grid-cols-3 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">RTP (%) <span class="text-red-500">*</span></label>
            <InputNumber v-model="gameForm.rtp" suffix="%" :min="0" :max="100" :minFractionDigits="1" :maxFractionDigits="1" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">波動率</label>
            <Select v-model="gameForm.volatility" :options="volatilitySelectOptions" optionLabel="label" optionValue="value" placeholder="選擇波動率" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">排序權重</label>
            <InputNumber v-model="gameForm.sort" :min="0" :max="9999" />
          </div>
        </div>

        <!-- Row 3: Marketing Settings -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">行銷標籤</label>
            <MultiSelect v-model="gameForm.tags" :options="tagOptions" optionLabel="label" optionValue="value" placeholder="選擇標籤" display="chip" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">縮圖網址</label>
            <InputText v-model="gameForm.thumbnail" placeholder="https://example.com/game.jpg" />
          </div>
        </div>

        <!-- Thumbnail Preview -->
        <div v-if="gameForm.thumbnail" class="flex gap-4 items-center">
          <span class="text-surface-500 text-sm">預覽：</span>
          <div class="w-20 h-20 rounded-lg bg-surface-100 dark:bg-surface-700 overflow-hidden">
            <img :src="gameForm.thumbnail" alt="Preview" class="w-full h-full object-cover" @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'" />
          </div>
        </div>

        <!-- Status Switch -->
        <div class="flex items-center gap-3 pt-2 border-t border-surface-200 dark:border-surface-700">
          <InputSwitch v-model="gameForm.isActive" />
          <label class="font-medium text-surface-700 dark:text-surface-300">{{ gameForm.isActive ? '已上架' : '已下架' }}</label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="editorDialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveGame" />
        </div>
      </template>
    </Dialog>

    <!-- Sync Simulation Dialog -->
    <Dialog v-model:visible="syncDialogVisible" header="同步遊戲資料" modal :closable="!isSyncing" :style="{ width: '450px' }">
      <div class="flex flex-col gap-4 py-4">
        <div class="text-center">
          <i :class="['pi', syncComplete ? 'pi-check-circle text-green-500' : 'pi-sync pi-spin text-blue-500']" style="font-size: 3rem"></i>
        </div>
        
        <ProgressBar :value="syncProgress" :mode="syncProgress < 100 ? 'indeterminate' : 'determinate'" class="h-2" />
        
        <p class="text-center text-surface-700 dark:text-surface-300">{{ syncMessage }}</p>
        
        <div v-if="syncComplete" class="text-center">
          <Tag value="同步完成" severity="success" class="text-lg px-4 py-2" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-center">
          <Button v-if="syncComplete" label="關閉" @click="syncDialogVisible = false" />
          <Button v-else label="取消同步" severity="secondary" @click="cancelSync" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputSwitch from 'primevue/inputswitch'
import Dialog from 'primevue/dialog'
import InputNumber from 'primevue/inputnumber'
import MultiSelect from 'primevue/multiselect'
import ProgressBar from 'primevue/progressbar'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Filter Options
const providerOptions = ref([
  { label: '全部', value: 'all' },
  { label: 'PG Soft', value: 'PG' },
  { label: 'JDB', value: 'JDB' },
  { label: 'Pragmatic Play', value: 'PP' },
  { label: 'JILI', value: 'JILI' },
  { label: 'CQ9', value: 'CQ9' }
])

const providerSelectOptions = ref([
  { label: 'PG Soft', value: 'PG' },
  { label: 'JDB', value: 'JDB' },
  { label: 'Pragmatic Play', value: 'PP' },
  { label: 'JILI', value: 'JILI' },
  { label: 'CQ9', value: 'CQ9' }
])

const typeOptions = ref([
  { label: '全部', value: 'all' },
  { label: 'Slots', value: 'slots' },
  { label: 'Live', value: 'live' },
  { label: 'Arcade', value: 'arcade' },
  { label: 'Fishing', value: 'fishing' }
])

const volatilityOptions = ref([
  { label: '全部', value: 'all' },
  { label: '高', value: 'high' },
  { label: '中', value: 'medium' },
  { label: '低', value: 'low' }
])

const volatilitySelectOptions = ref([
  { label: 'High', value: 'High' },
  { label: 'Medium', value: 'Medium' },
  { label: 'Low', value: 'Low' }
])

const tagOptions = ref([
  { label: 'Hot', value: 'hot' },
  { label: 'New', value: 'new' },
  { label: 'Featured', value: 'featured' },
  { label: 'Bonus', value: 'bonus' }
])

// Filter State
const filters = ref({
  search: '',
  provider: null,
  type: null,
  volatility: null
})

// Summary Data
const summaryData = ref({
  totalGames: 3456,
  activeGames: 2890,
  avgRtp: 96.5
})

// Games Data
interface Game {
  id: number
  gameId: string
  name: string
  provider: string
  type: string
  rtp: number
  volatility: string
  isHot: boolean
  isNew: boolean
  isTop: boolean
  isActive: boolean
  color: string
}

const games = ref<Game[]>([
  { id: 1, gameId: 'PG001', name: 'Gates of Olympus', provider: 'PG', type: 'Video Slot', rtp: 96.5, volatility: 'High', isHot: true, isNew: false, isTop: true, isActive: true, color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { id: 2, gameId: 'PG002', name: 'Mahjong Ways', provider: 'PG', type: 'Video Slot', rtp: 96.9, volatility: 'High', isHot: true, isNew: true, isTop: false, isActive: true, color: 'linear-gradient(135deg, #ef4444, #f97316)' },
  { id: 3, gameId: 'JDB001', name: 'Dragon Empire', provider: 'JDB', type: 'Fishing', rtp: 97.2, volatility: 'Medium', isHot: false, isNew: true, isTop: false, isActive: true, color: 'linear-gradient(135deg, #f59e0b, #eab308)' },
  { id: 4, gameId: 'PP001', name: 'Sweet Bonanza', provider: 'PP', type: 'Video Slot', rtp: 96.5, volatility: 'High', isHot: true, isNew: false, isTop: true, isActive: true, color: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
  { id: 5, gameId: 'JILI001', name: 'Super Ace', provider: 'JILI', type: 'Video Slot', rtp: 97.0, volatility: 'Medium', isHot: true, isNew: false, isTop: false, isActive: true, color: 'linear-gradient(135deg, #10b981, #14b8a6)' },
  { id: 6, gameId: 'CQ9001', name: 'Fortune Gods', provider: 'CQ9', type: 'Video Slot', rtp: 96.1, volatility: 'Low', isHot: false, isNew: false, isTop: false, isActive: true, color: 'linear-gradient(135deg, #a855f7, #8b5cf6)' },
  { id: 7, gameId: 'PG003', name: 'Wild Bandito', provider: 'PG', type: 'Video Slot', rtp: 96.7, volatility: 'High', isHot: false, isNew: true, isTop: false, isActive: true, color: 'linear-gradient(135deg, #0ea5e9, #3b82f6)' },
  { id: 8, gameId: 'JDB002', name: 'Fishing War', provider: 'JDB', type: 'Fishing', rtp: 95.8, volatility: 'Low', isHot: false, isNew: false, isTop: false, isActive: false, color: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  { id: 9, gameId: 'PP002', name: 'Starlight Princess', provider: 'PP', type: 'Video Slot', rtp: 96.5, volatility: 'High', isHot: true, isNew: false, isTop: true, isActive: true, color: 'linear-gradient(135deg, #f472b6, #e879f9)' },
  { id: 10, gameId: 'JILI002', name: 'Golden Queen', provider: 'JILI', type: 'Video Slot', rtp: 96.8, volatility: 'Medium', isHot: false, isNew: true, isTop: false, isActive: true, color: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }
])

// Computed Filtered Games
const filteredGames = computed(() => {
  return games.value.filter(game => {
    const matchSearch = !filters.value.search || game.name.toLowerCase().includes(filters.value.search.toLowerCase()) || game.gameId.toLowerCase().includes(filters.value.search.toLowerCase())
    const matchProvider = !filters.value.provider || filters.value.provider === 'all' || game.provider === filters.value.provider
    const matchType = !filters.value.type || filters.value.type === 'all' || game.type.toLowerCase().includes(filters.value.type)
    const matchVolatility = !filters.value.volatility || filters.value.volatility === 'all' || game.volatility.toLowerCase() === filters.value.volatility
    return matchSearch && matchProvider && matchType && matchVolatility
  })
})

// Severity Helpers
const getProviderSeverity = (provider: string): string => {
  const severityMap: Record<string, string> = { 'PG': 'info', 'JDB': 'warn', 'PP': 'danger', 'JILI': 'success', 'CQ9': 'secondary' }
  return severityMap[provider] || 'secondary'
}

const getVolatilitySeverity = (volatility: string): string => {
  const severityMap: Record<string, string> = { 'High': 'danger', 'Medium': 'warn', 'Low': 'success' }
  return severityMap[volatility] || 'info'
}

// ========================================
// Game Editor Dialog
// ========================================
const editorDialogVisible = ref(false)
const isEditMode = ref(false)

interface GameForm {
  id: number | null
  gameId: string
  name: string
  provider: string
  rtp: number
  volatility: string
  sort: number
  tags: string[]
  thumbnail: string
  isActive: boolean
}

const gameForm = ref<GameForm>({
  id: null,
  gameId: '',
  name: '',
  provider: '',
  rtp: 96.5,
  volatility: 'Medium',
  sort: 0,
  tags: [],
  thumbnail: '',
  isActive: true
})

const resetGameForm = () => {
  gameForm.value = { id: null, gameId: '', name: '', provider: '', rtp: 96.5, volatility: 'Medium', sort: 0, tags: [], thumbnail: '', isActive: true }
}

const openNew = () => {
  resetGameForm()
  isEditMode.value = false
  editorDialogVisible.value = true
}

const editGame = (game: Game) => {
  isEditMode.value = true
  const tags: string[] = []
  if (game.isHot) tags.push('hot')
  if (game.isNew) tags.push('new')
  if (game.isTop) tags.push('featured')
  
  gameForm.value = {
    id: game.id,
    gameId: game.gameId,
    name: game.name,
    provider: game.provider,
    rtp: game.rtp,
    volatility: game.volatility,
    sort: 0,
    tags,
    thumbnail: '',
    isActive: game.isActive
  }
  editorDialogVisible.value = true
}

const saveGame = () => {
  if (!gameForm.value.name) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫遊戲名稱', life: 3000 })
    return
  }
  const action = isEditMode.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `遊戲「${gameForm.value.name}」已${action}`, life: 3000 })
  editorDialogVisible.value = false
}

// ========================================
// Sync Simulation Dialog
// ========================================
const syncDialogVisible = ref(false)
const isSyncing = ref(false)
const syncComplete = ref(false)
const syncProgress = ref(0)
const syncMessage = ref('')
let syncTimer: ReturnType<typeof setTimeout> | null = null

const openSyncDialog = () => {
  syncComplete.value = false
  syncProgress.value = 0
  syncMessage.value = '正在連接供應商 API...'
  isSyncing.value = true
  syncDialogVisible.value = true
  
  // Simulate sync process
  setTimeout(() => {
    syncMessage.value = '正在更新圖檔資源...'
    syncProgress.value = 50
  }, 1000)
  
  setTimeout(() => {
    syncMessage.value = '正在同步遊戲資料...'
    syncProgress.value = 80
  }, 2000)
  
  syncTimer = setTimeout(() => {
    syncMessage.value = '同步完成！'
    syncProgress.value = 100
    syncComplete.value = true
    isSyncing.value = false
    toast.add({ severity: 'success', summary: '同步完成', detail: '成功同步 15 款新遊戲', life: 3000 })
  }, 3000)
}

const cancelSync = () => {
  if (syncTimer) clearTimeout(syncTimer)
  isSyncing.value = false
  syncDialogVisible.value = false
  toast.add({ severity: 'warn', summary: '同步取消', detail: '已取消同步操作', life: 2000 })
}

// ========================================
// Table Actions
// ========================================
const toggleTag = (game: Game, tag: 'isHot' | 'isNew' | 'isTop') => {
  game[tag] = !game[tag]
  const status = game[tag] ? '已新增' : '已移除'
  const tagName = { isHot: 'Hot', isNew: 'New', isTop: 'Top' }[tag]
  toast.add({ severity: 'info', summary: '標籤變更', detail: `${game.name} ${tagName} 標籤${status}`, life: 2000 })
}

const handleStatusChange = (game: Game) => {
  const status = game.isActive ? '上架' : '下架'
  toast.add({ severity: 'success', summary: '狀態變更', detail: `${game.name} 已${status}`, life: 2000 })
}

const handleDemo = (game: Game) => {
  toast.add({ severity: 'info', summary: '試玩模式', detail: `正在開啟 ${game.name}...`, life: 2000 })
  window.open('https://www.google.com', '_blank')
}
</script>
