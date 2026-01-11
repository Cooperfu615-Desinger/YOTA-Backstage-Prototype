<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-th-large text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">版面設定</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">開屏廣告</span>
    </div>

    <!-- Header -->
    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-images text-purple-500"></i>
      APP 開屏廣告 (Splash Ads)
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Current Status -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">目前狀態</p>
              <Tag :value="currentStatus.active ? '投放中' : '無廣告'" :severity="currentStatus.active ? 'success' : 'secondary'" class="text-lg" />
              <p v-if="currentStatus.active" class="text-sm text-surface-500 mt-2">{{ currentStatus.adName }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="currentStatus.active ? 'bg-green-500/20' : 'bg-surface-200 dark:bg-surface-700'">
              <i class="pi pi-play text-xl" :class="currentStatus.active ? 'text-green-500' : 'text-surface-400'"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Today Impressions -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">今日曝光</p>
              <p class="text-3xl font-bold text-blue-500">{{ kpiData.impressions.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-green-500">
                <i class="pi pi-arrow-up"></i>
                <span>+15% vs 昨日</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-eye text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- CTR -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">點擊率 (CTR)</p>
              <p class="text-3xl font-bold text-orange-500">{{ kpiData.ctr }}%</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-surface-500">
                <i class="pi pi-chart-line"></i>
                <span>行業均值 8.2%</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-percentage text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Ad List -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-list text-purple-500"></i>
            廣告列表
          </div>
          <Button label="新增廣告" icon="pi pi-plus" @click="openAdDialog(null)" />
        </div>
      </template>
      <template #content>
        <!-- Mutual Exclusion Notice -->
        <div class="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <i class="pi pi-info-circle"></i>
            <span class="text-sm">互斥邏輯：同一時間只能啟用一則開屏廣告，啟用新廣告將自動停用舊廣告。</span>
          </div>
        </div>

        <DataTable :value="ads" stripedRows>
          <Column field="name" header="廣告名稱" sortable style="min-width: 180px">
            <template #body="slotProps">
              <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.name }}</span>
            </template>
          </Column>
          <Column header="縮圖" style="min-width: 80px">
            <template #body="slotProps">
              <div class="w-10 h-16 rounded-lg flex items-center justify-center" :style="{ background: slotProps.data.bgColor }">
                <i class="pi pi-image text-white"></i>
              </div>
            </template>
          </Column>
          <Column header="排程時間" style="min-width: 220px">
            <template #body="slotProps">
              <span class="text-sm font-mono text-surface-700 dark:text-surface-300">
                {{ slotProps.data.startDate }} ~ {{ slotProps.data.endDate }}
              </span>
            </template>
          </Column>
          <Column field="frequency" header="頻率限制" style="min-width: 120px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.frequency" :severity="slotProps.data.frequency === '每次啟動' ? 'warn' : 'info'" />
            </template>
          </Column>
          <Column field="countdown" header="倒數秒數" style="min-width: 100px">
            <template #body="slotProps">
              <span class="text-surface-700 dark:text-surface-300">{{ slotProps.data.countdown }}s</span>
            </template>
          </Column>
          <Column field="active" header="狀態" style="min-width: 80px">
            <template #body="slotProps">
              <InputSwitch v-model="slotProps.data.active" @change="handleStatusChange(slotProps.data)" />
            </template>
          </Column>
          <Column header="操作" style="min-width: 100px">
            <template #body="slotProps">
              <div class="flex gap-1">
                <Button icon="pi pi-pencil" severity="info" text size="small" @click="openAdDialog(slotProps.data)" />
                <Button icon="pi pi-trash" severity="danger" text size="small" @click="handleDelete(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Ad Editor Dialog -->
    <Dialog v-model:visible="dialogVisible" header="編輯開屏廣告" modal :style="{ width: '700px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <!-- Basic Info -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">廣告名稱 <span class="text-red-500">*</span></label>
          <InputText v-model="adForm.name" placeholder="首存重磅回歸" />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">廣告圖片</label>
          <FileUpload mode="basic" accept="image/jpeg, image/png" :maxFileSize="5000000" chooseLabel="上傳圖片" class="w-full" />
          <small class="text-red-500">限制 1080x1920 直式全螢幕，jpg/png</small>
        </div>

        <!-- Action Target -->
        <div class="border-t border-surface-200 dark:border-surface-700 pt-4">
          <p class="font-medium text-surface-700 dark:text-surface-300 mb-3">跳轉目標</p>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-500">連結類型</label>
              <Select v-model="adForm.actionType" :options="actionTypeOptions" optionLabel="label" optionValue="value" />
            </div>
            <div v-if="adForm.actionType === 'promo'" class="flex flex-col gap-2">
              <label class="text-sm text-surface-500">選擇優惠</label>
              <Select v-model="adForm.promoId" :options="promoOptions" optionLabel="label" optionValue="value" placeholder="選擇優惠活動" />
            </div>
            <div v-if="adForm.actionType === 'external'" class="flex flex-col gap-2">
              <label class="text-sm text-surface-500">連結網址</label>
              <InputText v-model="adForm.externalUrl" placeholder="https://..." />
            </div>
          </div>
        </div>

        <!-- Display Settings -->
        <div class="border-t border-surface-200 dark:border-surface-700 pt-4">
          <p class="font-medium text-surface-700 dark:text-surface-300 mb-3">顯示設定</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-500">倒數秒數: {{ adForm.countdown }}s</label>
              <Slider v-model="adForm.countdown" :min="3" :max="10" />
            </div>
            <div class="flex items-center gap-3 p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
              <InputSwitch v-model="adForm.allowSkip" />
              <label class="text-surface-700 dark:text-surface-300">允許跳過 (顯示跳過按鈕)</label>
            </div>
          </div>
          <div class="flex flex-col gap-2 mt-4">
            <label class="text-sm text-surface-500">顯示頻率</label>
            <SelectButton v-model="adForm.frequency" :options="frequencyOptions" optionLabel="label" optionValue="value" />
          </div>
        </div>

        <!-- Schedule -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">排程設定</label>
          <DatePicker v-model="adForm.schedule" selectionMode="range" showTime hourFormat="24" placeholder="選擇投放時間範圍" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="dialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveAd" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import Select from 'primevue/select'
import SelectButton from 'primevue/selectbutton'
import Slider from 'primevue/slider'
import FileUpload from 'primevue/fileupload'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// KPI Data
const currentStatus = ref({
  active: true,
  adName: '首存重磅回歸'
})

const kpiData = ref({
  impressions: 25680,
  ctr: 12.5
})

// Options
const actionTypeOptions = ref([
  { label: '優惠活動', value: 'promo' },
  { label: '內部頁面', value: 'internal' },
  { label: '外部連結', value: 'external' }
])

const promoOptions = ref([
  { label: '首存重磅回歸 (PROMO_001)', value: 'PROMO_001' },
  { label: '老虎機大獎賽 (PROMO_002)', value: 'PROMO_002' },
  { label: '新年紅包雨 (PROMO_003)', value: 'PROMO_003' }
])

const frequencyOptions = ref([
  { label: '每次啟動', value: '每次啟動' },
  { label: '每日首次', value: '每日首次' }
])

// Ads Data
interface Ad {
  id: number
  name: string
  bgColor: string
  startDate: string
  endDate: string
  frequency: string
  countdown: number
  active: boolean
}

const ads = ref<Ad[]>([
  { id: 1, name: '首存重磅回歸', bgColor: 'linear-gradient(135deg, #ef4444, #f97316)', startDate: '2026-01-01', endDate: '2026-01-31', frequency: '每次啟動', countdown: 5, active: true },
  { id: 2, name: '新年快樂', bgColor: 'linear-gradient(135deg, #eab308, #f59e0b)', startDate: '2026-01-20', endDate: '2026-02-05', frequency: '每日首次', countdown: 3, active: false },
  { id: 3, name: '情人節特惠', bgColor: 'linear-gradient(135deg, #ec4899, #f43f5e)', startDate: '2026-02-10', endDate: '2026-02-15', frequency: '每次啟動', countdown: 5, active: false },
  { id: 4, name: '老虎機大獎賽', bgColor: 'linear-gradient(135deg, #8b5cf6, #a855f7)', startDate: '2026-01-15', endDate: '2026-01-25', frequency: '每日首次', countdown: 4, active: false }
])

// Dialog
const dialogVisible = ref(false)
const editingAd = ref<Ad | null>(null)

const adForm = ref({
  name: '',
  actionType: 'promo',
  promoId: '',
  externalUrl: '',
  countdown: 5,
  allowSkip: true,
  frequency: '每次啟動',
  schedule: null as Date[] | null
})

const openAdDialog = (ad: Ad | null) => {
  editingAd.value = ad
  if (ad) {
    adForm.value = {
      name: ad.name,
      actionType: 'promo',
      promoId: '',
      externalUrl: '',
      countdown: ad.countdown,
      allowSkip: true,
      frequency: ad.frequency,
      schedule: null
    }
  } else {
    adForm.value = { name: '', actionType: 'promo', promoId: '', externalUrl: '', countdown: 5, allowSkip: true, frequency: '每次啟動', schedule: null }
  }
  dialogVisible.value = true
}

const saveAd = () => {
  if (!adForm.value.name) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫廣告名稱', life: 3000 })
    return
  }
  const action = editingAd.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `廣告「${adForm.value.name}」已${action}`, life: 3000 })
  dialogVisible.value = false
}

const handleStatusChange = (ad: Ad) => {
  if (ad.active) {
    // Disable all other ads (mutual exclusion)
    ads.value.forEach(a => {
      if (a.id !== ad.id) a.active = false
    })
    currentStatus.value = { active: true, adName: ad.name }
    toast.add({ severity: 'success', summary: '廣告啟用', detail: `「${ad.name}」已啟用，其他廣告已自動停用`, life: 3000 })
  } else {
    currentStatus.value = { active: false, adName: '' }
    toast.add({ severity: 'info', summary: '廣告停用', detail: `「${ad.name}」已停用`, life: 2000 })
  }
}

const handleDelete = (ad: Ad) => {
  toast.add({ severity: 'warn', summary: '刪除', detail: `「${ad.name}」已刪除`, life: 2000 })
}
</script>
