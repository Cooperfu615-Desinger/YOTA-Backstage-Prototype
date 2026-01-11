<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
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
            <InputText 
              v-model="filters.search" 
              placeholder="遊戲名稱/ID" 
              class="w-[180px]"
            />
            <Select 
              v-model="filters.provider" 
              :options="providerOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="供應商" 
              class="w-[140px]" 
              showClear 
            />
            <Select 
              v-model="filters.type" 
              :options="typeOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="類型" 
              class="w-[140px]" 
              showClear 
            />
            <Select 
              v-model="filters.volatility" 
              :options="volatilityOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="波動率" 
              class="w-[140px]" 
              showClear 
            />
          </div>
          <!-- Actions -->
          <div class="flex gap-3">
            <Button 
              label="同步遊戲" 
              icon="pi pi-sync" 
              severity="secondary" 
              @click="handleSync" 
            />
            <Button 
              label="新增遊戲" 
              icon="pi pi-plus" 
              @click="handleAddGame" 
            />
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
        <DataTable 
          :value="filteredGames" 
          stripedRows 
          paginator 
          :rows="10" 
          :rowsPerPageOptions="[10, 20, 50]"
        >
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
                <Button 
                  v-if="slotProps.data.isHot" 
                  icon="pi pi-fire" 
                  severity="danger" 
                  text 
                  rounded 
                  size="small" 
                  v-tooltip="'Hot'" 
                />
                <Button 
                  v-if="slotProps.data.isNew" 
                  icon="pi pi-sparkles" 
                  severity="success" 
                  text 
                  rounded 
                  size="small" 
                  v-tooltip="'New'" 
                />
                <Button 
                  v-if="slotProps.data.isTop" 
                  icon="pi pi-star-fill" 
                  severity="warn" 
                  text 
                  rounded 
                  size="small" 
                  v-tooltip="'Top'" 
                />
                <span v-if="!slotProps.data.isHot && !slotProps.data.isNew && !slotProps.data.isTop" class="text-surface-400">-</span>
              </div>
            </template>
          </Column>

          <!-- Status Column -->
          <Column field="status" header="狀態" sortable style="min-width: 100px">
            <template #body="slotProps">
              <InputSwitch 
                v-model="slotProps.data.isActive" 
                @change="handleStatusChange(slotProps.data)" 
              />
            </template>
          </Column>

          <!-- Actions Column -->
          <Column header="操作" style="min-width: 150px">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button 
                  icon="pi pi-pencil" 
                  label="編輯" 
                  severity="info" 
                  text 
                  size="small" 
                  @click="handleEdit(slotProps.data)" 
                />
                <Button 
                  icon="pi pi-play" 
                  label="試玩" 
                  severity="secondary" 
                  text 
                  size="small" 
                  @click="handleDemo(slotProps.data)" 
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
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
    const matchSearch = !filters.value.search || 
      game.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      game.gameId.toLowerCase().includes(filters.value.search.toLowerCase())
    
    const matchProvider = !filters.value.provider || filters.value.provider === 'all' ||
      game.provider === filters.value.provider
    
    const matchType = !filters.value.type || filters.value.type === 'all' ||
      game.type.toLowerCase().includes(filters.value.type)
    
    const matchVolatility = !filters.value.volatility || filters.value.volatility === 'all' ||
      game.volatility.toLowerCase() === filters.value.volatility
    
    return matchSearch && matchProvider && matchType && matchVolatility
  })
})

// Severity Helpers
const getProviderSeverity = (provider: string): string => {
  const severityMap: Record<string, string> = {
    'PG': 'info',
    'JDB': 'warn',
    'PP': 'danger',
    'JILI': 'success',
    'CQ9': 'secondary'
  }
  return severityMap[provider] || 'secondary'
}

const getVolatilitySeverity = (volatility: string): string => {
  const severityMap: Record<string, string> = {
    'High': 'danger',
    'Medium': 'warn',
    'Low': 'success'
  }
  return severityMap[volatility] || 'info'
}

// Actions
const handleSync = () => {
  toast.add({ severity: 'info', summary: '同步遊戲', detail: '正在從供應商同步遊戲資料...', life: 3000 })
}

const handleAddGame = () => {
  toast.add({ severity: 'info', summary: '新增遊戲', detail: '開啟新增遊戲對話框...', life: 2000 })
}

const handleEdit = (game: Game) => {
  toast.add({ severity: 'info', summary: '編輯遊戲', detail: `編輯 ${game.name} 設定...`, life: 2000 })
}

const handleDemo = (game: Game) => {
  toast.add({ severity: 'success', summary: '試玩模式', detail: `啟動 ${game.name} 試玩...`, life: 2000 })
}

const handleStatusChange = (game: Game) => {
  const action = game.isActive ? '上架' : '下架'
  toast.add({ severity: 'success', summary: '狀態變更', detail: `${game.name} 已${action}`, life: 2000 })
}
</script>
