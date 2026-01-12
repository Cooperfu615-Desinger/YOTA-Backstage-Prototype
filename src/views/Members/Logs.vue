<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-users text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">會員管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-white font-medium">會員日誌</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-search text-blue-500 dark:text-blue-400"></i>
          日誌搜尋
        </div>
      </template>
      <template #content>
        <!-- Search Fields - Fixed Width Left-Aligned Layout -->
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">暱稱</label>
            <InputText v-model="filters.nickname" placeholder="輸入會員暱稱" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">IP 地址</label>
            <InputText v-model="filters.ip" placeholder="輸入 IP 地址" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">行為類型</label>
            <Dropdown v-model="filters.actionType" :options="actionTypeOptions" optionLabel="label" optionValue="value" placeholder="選擇行為類型" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">時間範圍</label>
            <Calendar v-model="filters.dateRange" selectionMode="range" placeholder="選擇日期區間" class="w-[220px]" dateFormat="yy-mm-dd" showIcon :manualInput="false" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">會員標籤</label>
            <MultiSelect v-model="filters.tags" :options="tagOptions" optionLabel="label" optionValue="value" placeholder="選擇標籤" class="w-[220px]" display="chip" />
          </div>
        </div>

        <!-- Search & Reset Buttons - Right Aligned -->
        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- Log List Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
            <i class="pi pi-history text-green-500 dark:text-green-400"></i>
            日誌列表
            <span v-if="hasSearched" class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ logs.length }} 筆)</span>
          </div>
        </div>
      </template>
      <template #content>
        <div class="min-h-[400px]">
          <!-- Pagination -->
          <div v-if="hasSearched && logs.length > 0" class="flex items-center justify-center gap-2 mb-4">
            <Button icon="pi pi-angle-double-left" text @click="goToPage(1)" :disabled="currentPage === 1" />
            <Button icon="pi pi-angle-left" text @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" />
            <template v-for="page in visiblePages" :key="page">
              <Button :label="String(page)" :class="page === currentPage ? 'bg-surface-200 dark:bg-surface-700' : ''" :text="page !== currentPage" @click="goToPage(page)" />
            </template>
            <Button icon="pi pi-angle-right" text @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" />
            <Button icon="pi pi-angle-double-right" text @click="goToPage(totalPages)" :disabled="currentPage === totalPages" />
            <span class="text-surface-500 dark:text-surface-400 text-sm ml-2">每頁</span>
            <Dropdown v-model="rowsPerPage" :options="[10, 20, 50, 100]" class="w-24" />
            <span class="text-surface-500 dark:text-surface-400 text-sm">筆</span>
          </div>

          <!-- DataTable -->
          <DataTable :value="hasSearched ? paginatedLogs : []" :loading="isSearching" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500 dark:text-surface-400' : 'pi-search text-surface-600 dark:text-surface-500']"></i>
                <p class="text-surface-500 dark:text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column field="time" header="時間" sortable style="min-width: 160px">
              <template #body="slotProps"><span class="text-surface-500 dark:text-surface-400 text-sm">{{ slotProps.data.time }}</span></template>
            </Column>
            <Column field="account" header="會員 ID / 暱稱" sortable style="min-width: 200px">
              <template #body="slotProps">
                <div class="flex flex-col gap-1">
                  <div class="flex items-center gap-2">
                    <span class="text-blue-500 dark:text-blue-400 font-medium cursor-pointer hover:underline" @click="openMemberDetail(slotProps.data)">{{ slotProps.data.account }}</span>
                  </div>
                  <span class="text-surface-500 dark:text-surface-400 text-xs">{{ slotProps.data.nickname || '未設定暱稱' }}</span>
                  <div v-if="slotProps.data.tags.length > 0" class="flex flex-wrap gap-1">
                    <Tag v-for="tag in slotProps.data.tags" :key="tag.name" :value="tag.name" :style="{ backgroundColor: tag.color }" class="text-xs" />
                  </div>
                </div>
              </template>
            </Column>
            <Column field="actionType" header="行為類型" style="min-width: 120px">
              <template #body="slotProps">
                <Tag :value="slotProps.data.actionType" :severity="getActionSeverity(slotProps.data.actionType)" />
              </template>
            </Column>
            <Column field="description" header="操作描述" style="min-width: 220px">
              <template #body="slotProps"><span class="text-surface-900 dark:text-white">{{ slotProps.data.description }}</span></template>
            </Column>
            <Column field="ip" header="操作 IP / 地點" style="min-width: 180px">
              <template #body="slotProps">
                <div class="flex flex-col">
                  <span class="text-surface-700 dark:text-surface-300 font-mono text-sm">{{ slotProps.data.ip }}</span>
                  <span class="text-surface-500 dark:text-surface-400 text-xs">{{ slotProps.data.location }}</span>
                </div>
              </template>
            </Column>
            <Column field="device" header="設備/瀏覽器" style="min-width: 140px">
              <template #body="slotProps"><span class="text-surface-500 dark:text-surface-400 text-sm">{{ slotProps.data.device }}</span></template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>

    <!-- Member Detail Modal (Reused from List.vue concept) -->
    <Dialog 
      v-model:visible="showMemberDetailDialog" 
      :header="`會員詳情 - ${selectedMember?.account || ''}`"
      :modal="true"
      :dismissableMask="true"
      :style="{ width: '90vw', maxWidth: '900px' }"
      :contentStyle="{ padding: '1rem' }"
    >
      <div v-if="selectedMember" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
            <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">會員帳號</p>
            <p class="text-surface-900 dark:text-white font-medium">{{ selectedMember.account }}</p>
          </div>
          <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
            <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">暱稱</p>
            <p class="text-surface-900 dark:text-white font-medium">{{ selectedMember.nickname || '未設定' }}</p>
          </div>
          <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
            <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">最後登入 IP</p>
            <p class="text-surface-900 dark:text-white font-mono text-sm">{{ selectedMember.ip }}</p>
          </div>
          <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
            <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">最後活動時間</p>
            <p class="text-surface-900 dark:text-white font-medium">{{ selectedMember.time }}</p>
          </div>
        </div>
        <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
          <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">最近操作</p>
          <p class="text-surface-900 dark:text-white">{{ selectedMember.actionType }} - {{ selectedMember.description }}</p>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Action type options
const actionTypeOptions = ref([
  { label: '登入', value: '登入' },
  { label: '修改資料', value: '修改資料' },
  { label: '密碼變更', value: '密碼變更' },
  { label: '帳號凍結', value: '帳號凍結' },
  { label: '層級調整', value: '層級調整' }
])

// Tag options for search
const tagOptions = ref([
  { label: '高風險', value: '高風險', color: '#ef4444' },
  { label: '大額玩家', value: '大額玩家', color: '#22c55e' },
  { label: 'VIP客戶', value: 'VIP客戶', color: '#8b5cf6' },
  { label: '新用戶', value: '新用戶', color: '#3b82f6' },
  { label: '活躍用戶', value: '活躍用戶', color: '#06b6d4' },
  { label: '沉睡用戶', value: '沉睡用戶', color: '#6b7280' },
  { label: '異常IP', value: '異常IP', color: '#f97316' },
  { label: '首充用戶', value: '首充用戶', color: '#eab308' }
])

// Filter state
const filters = ref({
  nickname: '',
  ip: '',
  actionType: null as string | null,
  dateRange: null as Date[] | null,
  tags: [] as string[]
})

// Search state
const isSearching = ref(false)
const hasSearched = ref(false)

// Pagination
const currentPage = ref(1)
const rowsPerPage = ref(10)

// Member Detail Modal
const showMemberDetailDialog = ref(false)
const selectedMember = ref<typeof logs.value[0] | null>(null)

// Log data
const logs = ref<Array<{
  id: number
  time: string
  account: string
  nickname: string
  actionType: string
  description: string
  ip: string
  location: string
  device: string
  tags: Array<{ name: string; color: string }>
}>>([])

// Generate random IP
const generateIp = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

// Generate random date
const generateRandomDate = () => {
  const now = new Date()
  const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const date = new Date(past30Days.getTime() + Math.random() * (now.getTime() - past30Days.getTime()))
  return date.toISOString().replace('T', ' ').substring(0, 19)
}

// Generate random member tags
const generateMemberTags = () => {
  const allTags = [
    { name: '高風險', color: '#ef4444' },
    { name: '大額玩家', color: '#22c55e' },
    { name: 'VIP客戶', color: '#8b5cf6' },
    { name: '新用戶', color: '#3b82f6' },
    { name: '活躍用戶', color: '#06b6d4' },
    { name: '沉睡用戶', color: '#6b7280' },
    { name: '異常IP', color: '#f97316' },
    { name: '首充用戶', color: '#eab308' }
  ]
  const tagCount = Math.random() > 0.3 ? Math.floor(Math.random() * 3) : 0
  const selected: typeof allTags = []
  for (let i = 0; i < tagCount; i++) {
    const tag = allTags[Math.floor(Math.random() * allTags.length)]!
    if (!selected.some(t => t.name === tag.name)) selected.push(tag)
  }
  return selected
}

// Generate mock logs
const generateMockLogs = () => {
  const accountPrefixes = ['VIP_user_', 'player', 'pro_', 'mega', '玩家', 'user', 'big_', 'new_']
  const accountSuffixes = ['999', '123', '88', 'A1', '_elite', '007', '', 'X', '666', '2024']
  const nicknames = ['瀾城七號', '御城十二苑', '888發發發', 'DragonKing', '玩家123', 'Winner_X', '金牌高手', 'LuckyOne_99', '深夜玩家', 'pro_gamer', '財神爺', 'VIPMaster', '高富帥88', 'slot_lover', '博彩達人', '夜貓族', 'BetKing2024', '賭神再現', 'jackpot_hunter', '月光下的賭徒', '', 'NoName', '']
  
  const actionTypes = ['登入', '修改資料', '密碼變更', '帳號凍結', '層級調整']
  const descriptions: Record<string, string[]> = {
    '登入': ['從新裝置登入', '正常登入', '多次嘗試後成功登入', '透過 Google 帳號登入', '透過 LINE 帳號登入'],
    '修改資料': ['更新手機號碼', '變更綁定銀行卡', '修改電子郵件', '更新暱稱', '修改收款帳戶'],
    '密碼變更': ['透過郵件驗證重置密碼', '手動修改登入密碼', '首次設定提款密碼', '重置提款密碼'],
    '帳號凍結': ['系統自動凍結 - 異常登入', '管理員手動凍結', '風控系統觸發凍結', '用戶申請凍結'],
    '層級調整': ['VIP 等級提升至 VIP2', 'VIP 等級降級至 VIP1', '特殊活動晉升 VIP3', '會員等級重新評估']
  }
  
  const locations = ['台北市', '新北市', '台中市', '高雄市', '台南市', '桃園市', '新竹市', '香港', '澳門', '上海', '北京', '深圳', '廣州', '新加坡', '馬來西亞', '越南胡志明市', '菲律賓馬尼拉']
  const devices = ['Chrome / Windows', 'Safari / macOS', 'Chrome / Android', 'Safari / iOS', 'iOS App', 'Android App', 'Firefox / Windows', 'Edge / Windows', 'Chrome / iOS', 'Samsung Browser / Android']

  const logCount = 50 + Math.floor(Math.random() * 20)
  const logList = []
  
  for (let i = 0; i < logCount; i++) {
    const prefix = accountPrefixes[Math.floor(Math.random() * accountPrefixes.length)]
    const suffix = accountSuffixes[Math.floor(Math.random() * accountSuffixes.length)]
    const randomNum = Math.floor(Math.random() * 10000)
    const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)]!
    const descList = descriptions[actionType] ?? ['操作記錄']
    
    logList.push({
      id: 100000 + i,
      time: generateRandomDate(),
      account: `${prefix}${randomNum}${suffix}`,
      nickname: nicknames[Math.floor(Math.random() * nicknames.length)] ?? '',
      actionType,
      description: descList[Math.floor(Math.random() * descList.length)] ?? '操作記錄',
      ip: generateIp(),
      location: locations[Math.floor(Math.random() * locations.length)] ?? '未知',
      device: devices[Math.floor(Math.random() * devices.length)] ?? '未知',
      tags: generateMemberTags()
    })
  }
  
  // Sort by time desc
  logList.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  return logList
}

// Computed
const totalPages = computed(() => Math.max(1, Math.ceil(logs.value.length / rowsPerPage.value)))
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
const paginatedLogs = computed(() => logs.value.slice((currentPage.value - 1) * rowsPerPage.value, currentPage.value * rowsPerPage.value))

// Helper functions
const getActionSeverity = (actionType: string) => {
  const severities: Record<string, string> = {
    '登入': 'info',
    '修改資料': 'warn',
    '密碼變更': 'warn',
    '帳號凍結': 'danger',
    '層級調整': 'success'
  }
  return severities[actionType] ?? 'secondary'
}

// Actions
const goToPage = (page: number) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }

const openMemberDetail = (log: typeof logs.value[0]) => {
  selectedMember.value = log
  showMemberDetailDialog.value = true
}

const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    logs.value = generateMockLogs()
    currentPage.value = 1
    hasSearched.value = true
    isSearching.value = false
    toast.add({ severity: 'success', summary: '搜尋完成', detail: `共找到 ${logs.value.length} 筆日誌紀錄`, life: 3000 })
  }, 800)
}

const handleReset = () => {
  filters.value = { nickname: '', ip: '', actionType: null, dateRange: null, tags: [] }
  toast.add({ severity: 'info', summary: '已重置', detail: '所有搜尋條件已清空', life: 2000 })
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
</style>
