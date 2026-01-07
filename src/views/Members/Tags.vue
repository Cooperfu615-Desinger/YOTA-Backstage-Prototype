<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-users text-blue-400"></i>
      <span class="text-surface-300">會員管理</span>
      <span>></span>
      <span class="text-white font-medium">標籤管理</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white text-lg">
            <i class="pi pi-search text-blue-400"></i>
            標籤搜尋
          </div>
          <Button label="新增標籤" icon="pi pi-plus" severity="success" @click="showAddDialog = true" />
        </div>
      </template>
      <template #content>
        <!-- Search Fields - Fixed Width Left-Aligned Layout -->
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">標籤名稱</label>
            <InputText v-model="filters.name" placeholder="輸入標籤名稱" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">標籤類型</label>
            <Dropdown v-model="filters.type" :options="tagTypeOptions" optionLabel="label" optionValue="value" placeholder="選擇標籤類型" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">建立者</label>
            <InputText v-model="filters.creator" placeholder="輸入建立者帳號" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">建立時間</label>
            <Calendar v-model="filters.dateRange" selectionMode="range" placeholder="選擇日期區間" class="w-[220px]" dateFormat="yy-mm-dd" showIcon :manualInput="false" />
          </div>
        </div>

        <!-- Search & Reset Buttons - Right Aligned -->
        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- Tag List Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-tags text-purple-400"></i>
          標籤列表
          <span v-if="hasSearched" class="text-sm text-surface-400 font-normal ml-2">(共 {{ tags.length }} 個標籤)</span>
        </div>
      </template>
      <template #content>
        <div class="min-h-[400px]">
          <!-- Pagination -->
          <div v-if="hasSearched && tags.length > 0" class="flex items-center justify-center gap-2 mb-4">
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
          <DataTable :value="hasSearched ? paginatedTags : []" :loading="isSearching" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
                <p class="text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column field="name" header="標籤預覽" sortable style="min-width: 160px">
              <template #body="slotProps">
                <Tag :value="slotProps.data.name" :style="{ backgroundColor: slotProps.data.bgColor, color: slotProps.data.textColor }" />
              </template>
            </Column>
            <Column field="type" header="類型" sortable style="min-width: 100px">
              <template #body="slotProps">
                <Tag :value="slotProps.data.type" :severity="getTypeSeverity(slotProps.data.type)" />
              </template>
            </Column>
            <Column field="memberCount" header="會員人數" sortable style="min-width: 100px">
              <template #body="slotProps">
                <span class="text-blue-400 font-medium cursor-pointer hover:underline">{{ slotProps.data.memberCount.toLocaleString() }} 人</span>
              </template>
            </Column>
            <Column field="description" header="備註說明" style="min-width: 220px">
              <template #body="slotProps"><span class="text-surface-300">{{ slotProps.data.description }}</span></template>
            </Column>
            <Column field="enabled" header="狀態" style="min-width: 80px">
              <template #body="slotProps">
                <InputSwitch v-model="slotProps.data.enabled" @change="handleToggle(slotProps.data)" />
              </template>
            </Column>
            <Column field="createdBy" header="建立資訊" style="min-width: 160px">
              <template #body="slotProps">
                <div class="flex flex-col">
                  <span class="text-white text-sm">{{ slotProps.data.createdBy }}</span>
                  <span class="text-surface-500 text-xs">{{ slotProps.data.createdAt }}</span>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>

    <!-- Add Tag Dialog -->
    <Dialog v-model:visible="showAddDialog" header="新增標籤" :modal="true" :style="{ width: '450px' }">
      <div class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">標籤名稱</label>
          <InputText v-model="newTag.name" placeholder="請輸入標籤名稱" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">標籤類型</label>
          <Dropdown v-model="newTag.type" :options="tagTypeOptions" optionLabel="label" optionValue="value" placeholder="選擇類型" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">標籤顏色</label>
          <div class="flex gap-2 flex-wrap">
            <div 
              v-for="color in colorOptions" 
              :key="color.bg" 
              class="w-8 h-8 rounded cursor-pointer border-2 flex items-center justify-center transition-all"
              :style="{ backgroundColor: color.bg }"
              :class="newTag.bgColor === color.bg ? 'border-white scale-110' : 'border-transparent hover:scale-105'"
              @click="selectColor(color)"
            >
              <i v-if="newTag.bgColor === color.bg" class="pi pi-check text-xs" :style="{ color: color.text }"></i>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">備註說明</label>
          <InputText v-model="newTag.description" placeholder="簡述標籤用途" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">預覽</label>
          <div class="bg-surface-700/50 rounded-lg p-3">
            <Tag :value="newTag.name || '標籤名稱'" :style="{ backgroundColor: newTag.bgColor, color: newTag.textColor }" />
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="取消" severity="secondary" @click="showAddDialog = false" />
        <Button label="確認新增" icon="pi pi-check" @click="handleAddTag" :disabled="!newTag.name || !newTag.type" />
      </template>
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
import InputSwitch from 'primevue/inputswitch'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Tag type options
const tagTypeOptions = ref([
  { label: '風控類', value: '風控類' },
  { label: '行銷類', value: '行銷類' },
  { label: '系統自動', value: '系統自動' },
  { label: '層級類', value: '層級類' }
])

// Color options for tags
const colorOptions = ref([
  { bg: '#ef4444', text: '#ffffff' },
  { bg: '#f97316', text: '#ffffff' },
  { bg: '#eab308', text: '#1c1917' },
  { bg: '#22c55e', text: '#ffffff' },
  { bg: '#06b6d4', text: '#ffffff' },
  { bg: '#3b82f6', text: '#ffffff' },
  { bg: '#8b5cf6', text: '#ffffff' },
  { bg: '#ec4899', text: '#ffffff' },
  { bg: '#6b7280', text: '#ffffff' },
  { bg: '#1e293b', text: '#f8fafc' }
])

// Filter state
const filters = ref({
  name: '',
  type: null as string | null,
  creator: '',
  dateRange: null as Date[] | null
})

// Search state
const isSearching = ref(false)
const hasSearched = ref(false)

// Pagination
const currentPage = ref(1)
const rowsPerPage = ref(10)

// Add Tag Dialog
const showAddDialog = ref(false)
const newTag = ref({
  name: '',
  type: '',
  bgColor: '#3b82f6',
  textColor: '#ffffff',
  description: ''
})

// Tag data
const tags = ref<Array<{
  id: number
  name: string
  type: string
  bgColor: string
  textColor: string
  memberCount: number
  description: string
  enabled: boolean
  createdBy: string
  createdAt: string
}>>([])

// Generate random date
const generateRandomDate = () => {
  const now = new Date()
  const past60Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
  const date = new Date(past60Days.getTime() + Math.random() * (now.getTime() - past60Days.getTime()))
  return date.toISOString().replace('T', ' ').substring(0, 19)
}

// Generate mock tags
const generateMockTags = () => {
  const tagData = [
    { name: '高風險', type: '風控類', desc: '帳戶行為異常或多次觸發風控規則' },
    { name: '黑名單', type: '風控類', desc: '已確認違規或詐騙行為' },
    { name: '可疑帳號', type: '風控類', desc: '需人工審核的可疑行為' },
    { name: '套利玩家', type: '風控類', desc: '疑似利用規則漏洞套利' },
    { name: '大額玩家', type: '行銷類', desc: '近三日充值大於 10 萬' },
    { name: 'VIP客戶', type: '行銷類', desc: '高價值 VIP 會員' },
    { name: '流失預警', type: '行銷類', desc: '30 天未登入的活躍用戶' },
    { name: '首充用戶', type: '行銷類', desc: '完成首次充值的新會員' },
    { name: '新用戶', type: '系統自動', desc: '註冊 7 天內的新會員' },
    { name: '活躍用戶', type: '系統自動', desc: '近 7 日有登入記錄' },
    { name: '沉睡用戶', type: '系統自動', desc: '超過 30 天未登入' },
    { name: '已驗證', type: '系統自動', desc: '完成實名認證' },
    { name: 'VIP1', type: '層級類', desc: '初階 VIP 會員' },
    { name: 'VIP2', type: '層級類', desc: '中階 VIP 會員' },
    { name: 'VIP3', type: '層級類', desc: '高階 VIP 會員' },
    { name: 'SVIP', type: '層級類', desc: '超級 VIP / 頂級會員' }
  ]

  const creators = ['admin_super', 'op_linda', 'cs_jerry', 'risk_mike', 'marketing_amy', 'system']
  const typeColors: Record<string, { bg: string; text: string }> = {
    '風控類': { bg: '#ef4444', text: '#ffffff' },
    '行銷類': { bg: '#22c55e', text: '#ffffff' },
    '系統自動': { bg: '#6b7280', text: '#ffffff' },
    '層級類': { bg: '#8b5cf6', text: '#ffffff' }
  }

  return tagData.map((tag, idx) => ({
    id: 1000 + idx,
    name: tag.name,
    type: tag.type,
    bgColor: typeColors[tag.type]?.bg ?? '#3b82f6',
    textColor: typeColors[tag.type]?.text ?? '#ffffff',
    memberCount: Math.floor(Math.random() * 5000) + 10,
    description: tag.desc,
    enabled: Math.random() > 0.2,
    createdBy: creators[Math.floor(Math.random() * creators.length)]!,
    createdAt: generateRandomDate()
  }))
}

// Computed
const totalPages = computed(() => Math.max(1, Math.ceil(tags.value.length / rowsPerPage.value)))
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
const paginatedTags = computed(() => tags.value.slice((currentPage.value - 1) * rowsPerPage.value, currentPage.value * rowsPerPage.value))

// Helper functions
const getTypeSeverity = (type: string) => {
  const severities: Record<string, string> = {
    '風控類': 'danger',
    '行銷類': 'success',
    '系統自動': 'secondary',
    '層級類': 'info'
  }
  return severities[type] ?? 'secondary'
}

const selectColor = (color: { bg: string; text: string }) => {
  newTag.value.bgColor = color.bg
  newTag.value.textColor = color.text
}

// Actions
const goToPage = (page: number) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }

const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    tags.value = generateMockTags()
    currentPage.value = 1
    hasSearched.value = true
    isSearching.value = false
    toast.add({ severity: 'success', summary: '搜尋完成', detail: `共找到 ${tags.value.length} 個標籤`, life: 3000 })
  }, 600)
}

const handleReset = () => {
  filters.value = { name: '', type: null, creator: '', dateRange: null }
  toast.add({ severity: 'info', summary: '已重置', detail: '所有搜尋條件已清空', life: 2000 })
}

const handleToggle = (tag: typeof tags.value[0]) => {
  toast.add({ 
    severity: tag.enabled ? 'success' : 'warn', 
    summary: tag.enabled ? '標籤已啟用' : '標籤已停用', 
    detail: `「${tag.name}」狀態已更新`, 
    life: 2000 
  })
}

const handleAddTag = () => {
  const newId = tags.value.length > 0 ? Math.max(...tags.value.map(t => t.id)) + 1 : 1000
  tags.value.unshift({
    id: newId,
    name: newTag.value.name,
    type: newTag.value.type,
    bgColor: newTag.value.bgColor,
    textColor: newTag.value.textColor,
    memberCount: 0,
    description: newTag.value.description || '新建立的標籤',
    enabled: true,
    createdBy: 'current_user',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  })
  
  showAddDialog.value = false
  const addedName = newTag.value.name
  newTag.value = { name: '', type: '', bgColor: '#3b82f6', textColor: '#ffffff', description: '' }
  hasSearched.value = true
  toast.add({ severity: 'success', summary: '新增成功', detail: `標籤「${addedName}」已成功建立`, life: 3000 })
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
:deep(.p-dialog) { background-color: #1e293b; }
:deep(.p-dialog .p-dialog-header) { background-color: #1e293b; border-bottom: 1px solid rgba(71, 85, 105, 0.5); }
:deep(.p-dialog .p-dialog-content) { background-color: #1e293b; }
:deep(.p-dialog .p-dialog-footer) { background-color: #1e293b; border-top: 1px solid rgba(71, 85, 105, 0.5); }
</style>
