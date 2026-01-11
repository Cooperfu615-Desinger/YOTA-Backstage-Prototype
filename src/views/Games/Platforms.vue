<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-play text-purple-500 dark:text-purple-400"></i>
      <span class="text-surface-500 dark:text-surface-300">遊戲管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">遊戲平台</span>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Platforms Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">接入平台總數</p>
              <p class="text-3xl font-bold text-surface-900 dark:text-white">{{ summaryData.totalPlatforms }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-blue-500">
                <i class="pi pi-server"></i>
                <span>活躍供應商</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-box text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Maintenance Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">維護中平台</p>
              <p class="text-3xl font-bold text-red-500">{{ summaryData.maintenancePlatforms }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-red-500">
                <i class="pi pi-exclamation-triangle"></i>
                <span>需要關注</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <i class="pi pi-wrench text-red-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Total Games Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">支援遊戲總數</p>
              <p class="text-3xl font-bold text-surface-900 dark:text-white">{{ summaryData.totalGames.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-green-500">
                <i class="pi pi-arrow-up"></i>
                <span>+128 本週新增</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-th-large text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Filters & Actions Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #content>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Filters -->
          <div class="flex flex-wrap gap-4">
            <InputText 
              v-model="filters.search" 
              placeholder="平台名稱/代碼" 
              class="w-[200px]"
            />
            <Select 
              v-model="filters.status" 
              :options="statusOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="狀態" 
              class="w-[150px]" 
              showClear 
            />
            <Select 
              v-model="filters.walletType" 
              :options="walletOptions" 
              optionLabel="label" 
              optionValue="value" 
              placeholder="錢包類型" 
              class="w-[150px]" 
              showClear 
            />
          </div>
          <!-- Actions -->
          <div class="flex gap-3">
            <Button 
              label="一鍵維護" 
              icon="pi pi-exclamation-triangle" 
              severity="danger" 
              outlined 
              @click="openBulkMaintenance" 
            />
            <Button 
              label="新增平台" 
              icon="pi pi-plus" 
              @click="openNew" 
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
          平台列表
          <span class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ platforms.length }} 個平台)</span>
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="filteredPlatforms" 
          stripedRows 
          paginator 
          :rows="10" 
          :rowsPerPageOptions="[10, 20, 50]"
        >
          <!-- Logo Column -->
          <Column header="Logo" style="width: 80px">
            <template #body="slotProps">
              <Avatar 
                :label="slotProps.data.code.charAt(0)" 
                :style="{ backgroundColor: slotProps.data.color, color: '#fff' }" 
                shape="circle" 
                size="large" 
              />
            </template>
          </Column>

          <!-- Name Column -->
          <Column field="name" header="平台名稱" sortable style="min-width: 150px">
            <template #body="slotProps">
              <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.name }}</span>
            </template>
          </Column>

          <!-- Code Column -->
          <Column field="code" header="代碼" sortable style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.code" severity="secondary" />
            </template>
          </Column>

          <!-- Type Column -->
          <Column field="type" header="遊戲類型" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-surface-700 dark:text-surface-300">{{ slotProps.data.type }}</span>
            </template>
          </Column>

          <!-- Rate Column -->
          <Column field="rate" header="費率" sortable style="min-width: 80px">
            <template #body="slotProps">
              <span class="font-mono text-orange-500">{{ slotProps.data.rate }}%</span>
            </template>
          </Column>

          <!-- Wallet Column -->
          <Column field="wallet" header="錢包模式" sortable style="min-width: 120px">
            <template #body="slotProps">
              <Tag 
                :value="slotProps.data.wallet === 'single' ? 'Single' : 'Transfer'" 
                :severity="slotProps.data.wallet === 'single' ? 'info' : 'warn'" 
              />
            </template>
          </Column>

          <!-- Status Column -->
          <Column field="status" header="狀態" sortable style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
            </template>
          </Column>

          <!-- Sort Column -->
          <Column field="sort" header="排序" sortable style="width: 80px">
            <template #body="slotProps">
              <span class="font-mono text-surface-500">{{ slotProps.data.sort }}</span>
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
                  @click="editPlatform(slotProps.data)" 
                />
                <Button 
                  icon="pi pi-wrench" 
                  label="維護" 
                  severity="danger" 
                  text 
                  size="small" 
                  @click="openMaintenance(slotProps.data)" 
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Platform Upsert Dialog -->
    <Dialog 
      v-model:visible="upsertDialogVisible" 
      :header="isEditMode ? '編輯平台' : '新增平台'" 
      modal 
      :style="{ width: '550px' }"
    >
      <div class="flex flex-col gap-4">
        <!-- Logo URL -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">Logo URL</label>
          <InputText v-model="platformForm.logoUrl" placeholder="https://example.com/logo.png" />
          <div v-if="platformForm.logoUrl" class="w-16 h-16 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center overflow-hidden">
            <img :src="platformForm.logoUrl" alt="Preview" class="w-full h-full object-cover" @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'" />
          </div>
        </div>

        <!-- Platform Name -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">平台名稱 <span class="text-red-500">*</span></label>
          <InputText v-model="platformForm.name" placeholder="PG Soft" />
        </div>

        <!-- Platform Code -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">平台代碼 <span class="text-red-500">*</span></label>
          <InputText v-model="platformForm.code" placeholder="PG" :disabled="isEditMode" />
        </div>

        <!-- Game Types -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">遊戲類型</label>
          <MultiSelect 
            v-model="platformForm.gameTypes" 
            :options="gameTypeOptions" 
            optionLabel="label" 
            optionValue="value" 
            placeholder="選擇類型" 
            display="chip" 
          />
        </div>

        <!-- Wallet Mode -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">錢包模式</label>
          <div class="flex gap-4">
            <div class="flex items-center gap-2">
              <RadioButton v-model="platformForm.wallet" inputId="wallet1" value="single" />
              <label for="wallet1" class="text-surface-700 dark:text-surface-300">單一錢包</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton v-model="platformForm.wallet" inputId="wallet2" value="transfer" />
              <label for="wallet2" class="text-surface-700 dark:text-surface-300">轉帳錢包</label>
            </div>
          </div>
        </div>

        <!-- Cost Rate -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">成本佔成</label>
          <InputNumber v-model="platformForm.rate" suffix="%" :min="0" :max="100" />
        </div>

        <!-- Status -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">狀態</label>
          <Select 
            v-model="platformForm.status" 
            :options="platformStatusOptions" 
            optionLabel="label" 
            optionValue="value" 
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="upsertDialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="savePlatform" />
        </div>
      </template>
    </Dialog>

    <!-- Maintenance Dialog -->
    <Dialog 
      v-model:visible="maintenanceDialogVisible" 
      header="維護設定" 
      modal 
      :style="{ width: '500px' }"
      class="p-fluid"
    >
      <div class="flex flex-col gap-4">
        <!-- Target Platform -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">維護平台</label>
          <div class="p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
            <span class="font-medium text-surface-900 dark:text-white">{{ maintenanceForm.targetName }}</span>
          </div>
        </div>

        <!-- Maintenance Time Range -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">維護時間</label>
          <DatePicker 
            v-model="maintenanceForm.dateRange" 
            selectionMode="range" 
            showTime 
            hourFormat="24" 
            placeholder="選擇開始與結束時間" 
          />
        </div>

        <!-- Maintenance Reason -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">維護原因</label>
          <Textarea v-model="maintenanceForm.reason" rows="3" placeholder="請輸入維護原因..." />
        </div>

        <!-- Show Announcement -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <InputSwitch v-model="maintenanceForm.showAnnouncement" />
            <label class="font-medium text-surface-700 dark:text-surface-300">前台公告</label>
          </div>
          <Textarea 
            v-if="maintenanceForm.showAnnouncement" 
            v-model="maintenanceForm.announcementContent" 
            rows="2" 
            placeholder="輸入對玩家顯示的維護公告..." 
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="maintenanceDialogVisible = false" />
          <Button label="確認維護" icon="pi pi-exclamation-triangle" severity="danger" @click="confirmMaintenance" />
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
import Avatar from 'primevue/avatar'
import Dialog from 'primevue/dialog'
import MultiSelect from 'primevue/multiselect'
import RadioButton from 'primevue/radiobutton'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import Textarea from 'primevue/textarea'
import InputSwitch from 'primevue/inputswitch'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Filter Options
const statusOptions = ref([
  { label: '全部', value: 'all' },
  { label: '啟用', value: 'active' },
  { label: '維護', value: 'maintenance' },
  { label: '下架', value: 'disabled' }
])

const walletOptions = ref([
  { label: '全部', value: 'all' },
  { label: '單一錢包', value: 'single' },
  { label: '轉帳錢包', value: 'transfer' }
])

const gameTypeOptions = ref([
  { label: '電子', value: 'slots' },
  { label: '真人', value: 'live' },
  { label: '體育', value: 'sports' },
  { label: '彩票', value: 'lottery' }
])

const platformStatusOptions = ref([
  { label: '啟用', value: '啟用' },
  { label: '維護', value: '維護' },
  { label: '停用', value: '停用' }
])

// Filter State
const filters = ref({
  search: '',
  status: null,
  walletType: null
})

// Summary Data
const summaryData = ref({
  totalPlatforms: 18,
  maintenancePlatforms: 2,
  totalGames: 3456
})

// Platforms Data
interface Platform {
  id: number
  name: string
  code: string
  type: string
  rate: number
  wallet: 'single' | 'transfer'
  status: string
  sort: number
  color: string
}

const platforms = ref<Platform[]>([
  { id: 1, name: 'PG Soft', code: 'PG', type: '電子', rate: 12, wallet: 'single', status: '啟用', sort: 1, color: '#6366f1' },
  { id: 2, name: 'JDB', code: 'JDB', type: '電子/捕魚', rate: 15, wallet: 'transfer', status: '啟用', sort: 2, color: '#f59e0b' },
  { id: 3, name: 'Evolution', code: 'EVO', type: '真人', rate: 8, wallet: 'single', status: '啟用', sort: 3, color: '#10b981' },
  { id: 4, name: 'Pragmatic Play', code: 'PP', type: '電子', rate: 14, wallet: 'single', status: '啟用', sort: 4, color: '#ef4444' },
  { id: 5, name: 'Spade Gaming', code: 'SG', type: '電子', rate: 12, wallet: 'transfer', status: '維護', sort: 5, color: '#8b5cf6' },
  { id: 6, name: 'JILI', code: 'JILI', type: '電子', rate: 13, wallet: 'single', status: '啟用', sort: 6, color: '#ec4899' },
  { id: 7, name: 'SA Gaming', code: 'SA', type: '真人', rate: 10, wallet: 'single', status: '啟用', sort: 7, color: '#f97316' },
  { id: 8, name: 'WM Casino', code: 'WM', type: '真人', rate: 9, wallet: 'transfer', status: '啟用', sort: 8, color: '#14b8a6' },
  { id: 9, name: 'CMD Sports', code: 'CMD', type: '體育', rate: 5, wallet: 'single', status: '啟用', sort: 9, color: '#0ea5e9' },
  { id: 10, name: 'SABA Sports', code: 'SABA', type: '體育', rate: 6, wallet: 'single', status: '維護', sort: 10, color: '#22c55e' },
  { id: 11, name: 'Sexy Baccarat', code: 'SEXY', type: '真人', rate: 11, wallet: 'transfer', status: '啟用', sort: 11, color: '#f43f5e' },
  { id: 12, name: 'CQ9', code: 'CQ9', type: '電子', rate: 14, wallet: 'single', status: '啟用', sort: 12, color: '#a855f7' }
])

// Computed Filtered Platforms
const filteredPlatforms = computed(() => {
  return platforms.value.filter(platform => {
    const matchSearch = !filters.value.search || 
      platform.name.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      platform.code.toLowerCase().includes(filters.value.search.toLowerCase())
    
    const matchStatus = !filters.value.status || filters.value.status === 'all' ||
      (filters.value.status === 'active' && platform.status === '啟用') ||
      (filters.value.status === 'maintenance' && platform.status === '維護') ||
      (filters.value.status === 'disabled' && platform.status === '下架')
    
    const matchWallet = !filters.value.walletType || filters.value.walletType === 'all' ||
      platform.wallet === filters.value.walletType
    
    return matchSearch && matchStatus && matchWallet
  })
})

// Status Severity Helper
const getStatusSeverity = (status: string): string => {
  const severityMap: Record<string, string> = {
    '啟用': 'success',
    '維護': 'danger',
    '下架': 'secondary'
  }
  return severityMap[status] || 'info'
}

// ========================================
// Upsert Dialog Logic
// ========================================
const upsertDialogVisible = ref(false)
const isEditMode = ref(false)

interface PlatformForm {
  id: number | null
  logoUrl: string
  name: string
  code: string
  gameTypes: string[]
  wallet: 'single' | 'transfer'
  rate: number
  status: string
}

const platformForm = ref<PlatformForm>({
  id: null,
  logoUrl: '',
  name: '',
  code: '',
  gameTypes: [],
  wallet: 'single',
  rate: 12,
  status: '啟用'
})

const resetPlatformForm = () => {
  platformForm.value = {
    id: null,
    logoUrl: '',
    name: '',
    code: '',
    gameTypes: [],
    wallet: 'single',
    rate: 12,
    status: '啟用'
  }
}

const openNew = () => {
  resetPlatformForm()
  isEditMode.value = false
  upsertDialogVisible.value = true
}

const editPlatform = (platform: Platform) => {
  isEditMode.value = true
  platformForm.value = {
    id: platform.id,
    logoUrl: '',
    name: platform.name,
    code: platform.code,
    gameTypes: platform.type.split('/').map(t => t.trim().toLowerCase()),
    wallet: platform.wallet,
    rate: platform.rate,
    status: platform.status
  }
  upsertDialogVisible.value = true
}

const savePlatform = () => {
  if (!platformForm.value.name || !platformForm.value.code) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫必填欄位', life: 3000 })
    return
  }

  const action = isEditMode.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `平台「${platformForm.value.name}」已${action}`, life: 3000 })
  upsertDialogVisible.value = false
}

// ========================================
// Maintenance Dialog Logic
// ========================================
const maintenanceDialogVisible = ref(false)

interface MaintenanceForm {
  targetId: number | null
  targetName: string
  dateRange: Date[] | null
  reason: string
  showAnnouncement: boolean
  announcementContent: string
}

const maintenanceForm = ref<MaintenanceForm>({
  targetId: null,
  targetName: '',
  dateRange: null,
  reason: '',
  showAnnouncement: false,
  announcementContent: ''
})

const resetMaintenanceForm = () => {
  maintenanceForm.value = {
    targetId: null,
    targetName: '',
    dateRange: null,
    reason: '',
    showAnnouncement: false,
    announcementContent: ''
  }
}

const openMaintenance = (platform: Platform) => {
  resetMaintenanceForm()
  maintenanceForm.value.targetId = platform.id
  maintenanceForm.value.targetName = platform.name
  maintenanceDialogVisible.value = true
}

const openBulkMaintenance = () => {
  resetMaintenanceForm()
  maintenanceForm.value.targetName = '所有平台'
  maintenanceDialogVisible.value = true
}

const confirmMaintenance = () => {
  if (!maintenanceForm.value.dateRange || maintenanceForm.value.dateRange.length < 2) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請選擇維護時間區間', life: 3000 })
    return
  }

  toast.add({ 
    severity: 'warn', 
    summary: '維護已設定', 
    detail: `「${maintenanceForm.value.targetName}」將於指定時間進入維護`, 
    life: 3000 
  })
  maintenanceDialogVisible.value = false
}
</script>
