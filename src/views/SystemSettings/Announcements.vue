<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-cog text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">系統設定</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">公告管理</span>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Active Announcements -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">進行中公告</p>
              <p class="text-3xl font-bold text-surface-900 dark:text-white">{{ kpiData.totalActive }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-blue-500">
                <i class="pi pi-megaphone"></i>
                <span>目前顯示中</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-bell text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Marquee Count -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">跑馬燈</p>
              <p class="text-3xl font-bold text-green-500">{{ kpiData.marqueeCount }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-green-500">
                <i class="pi pi-arrow-right"></i>
                <span>進行中</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-align-left text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Popup/Banner Count -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">彈窗/輪播</p>
              <p class="text-3xl font-bold text-orange-500">{{ kpiData.popupBannerCount }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-orange-500">
                <i class="pi pi-image"></i>
                <span>圖片類公告</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-images text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Announcements Table -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-list text-purple-500"></i>
            公告列表
          </div>
          <Button label="新增公告" icon="pi pi-plus" @click="openDialog(null)" />
        </div>
      </template>
      <template #content>
        <DataTable :value="announcements" stripedRows paginator :rows="10">
          <!-- Title Column -->
          <Column field="title" header="標題" sortable style="min-width: 200px">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.title }}</span>
                <i v-if="slotProps.data.type !== '跑馬燈'" class="pi pi-image text-surface-400" v-tooltip="'圖片預覽'"></i>
              </div>
            </template>
          </Column>

          <!-- Type Column -->
          <Column field="type" header="類型" style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.type" :severity="getTypeSeverity(slotProps.data.type)" />
            </template>
          </Column>

          <!-- Target Column -->
          <Column field="target" header="對象" style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.target" :severity="getTargetSeverity(slotProps.data.target)" />
            </template>
          </Column>

          <!-- Schedule Column -->
          <Column header="排程時間" style="min-width: 280px">
            <template #body="slotProps">
              <span class="text-sm font-mono text-surface-700 dark:text-surface-300">
                {{ slotProps.data.startTime }} ~ {{ slotProps.data.endTime }}
              </span>
            </template>
          </Column>

          <!-- Status Column -->
          <Column field="active" header="狀態" style="min-width: 80px">
            <template #body="slotProps">
              <InputSwitch v-model="slotProps.data.active" @change="handleStatusChange(slotProps.data)" />
            </template>
          </Column>

          <!-- Actions Column -->
          <Column header="操作" style="min-width: 120px">
            <template #body="slotProps">
              <div class="flex gap-1">
                <Button icon="pi pi-pencil" severity="info" text size="small" @click="openDialog(slotProps.data)" />
                <Button icon="pi pi-trash" severity="danger" text size="small" @click="handleDelete(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Announcement Editor Dialog -->
    <Dialog v-model:visible="dialogVisible" header="公告設定" modal :style="{ width: '700px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <!-- Basic Settings -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">標題 <span class="text-red-500">*</span></label>
          <InputText v-model="form.title" placeholder="公告標題" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">類型</label>
            <Select v-model="form.type" :options="typeOptions" optionLabel="label" optionValue="value" @change="handleTypeChange" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">發送對象</label>
            <MultiSelect v-model="form.targets" :options="targetOptions" optionLabel="label" optionValue="value" placeholder="選擇對象" display="chip" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">上架時間</label>
          <DatePicker v-model="form.scheduleRange" selectionMode="range" showTime hourFormat="24" placeholder="選擇上架時間範圍" />
        </div>

        <!-- Dynamic Content Section -->
        <div class="border-t border-surface-200 dark:border-surface-700 pt-4">
          <p class="font-medium text-surface-700 dark:text-surface-300 mb-3">
            <i class="pi pi-pencil text-purple-500 mr-2"></i>內容設定
            <Tag :value="form.type" size="small" class="ml-2" />
          </p>

          <!-- Marquee: Text Only -->
          <div v-if="form.type === '跑馬燈'" class="flex flex-col gap-2">
            <label class="text-sm text-surface-500">跑馬燈文字</label>
            <Textarea v-model="form.textContent" rows="4" placeholder="輸入跑馬燈文字..." />
          </div>

          <!-- Popup: Image + Rich Text -->
          <div v-else-if="form.type === '彈窗'" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-500">彈窗圖片</label>
              <FileUpload mode="basic" accept="image/*" :maxFileSize="2000000" chooseLabel="上傳圖片" class="w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-500">富文本內容</label>
              <Editor v-model="form.richContent" editorStyle="height: 200px" />
            </div>
          </div>

          <!-- Banner: Image + Link -->
          <div v-else-if="form.type === '輪播圖'" class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-500">輪播圖片</label>
              <FileUpload mode="basic" accept="image/*" :maxFileSize="2000000" chooseLabel="上傳圖片" class="w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-500">點擊跳轉連結</label>
              <InputText v-model="form.linkUrl" placeholder="https://example.com/promo" />
            </div>
          </div>

          <!-- Site Notification: Text -->
          <div v-else-if="form.type === '站內通知'" class="flex flex-col gap-2">
            <label class="text-sm text-surface-500">通知內容</label>
            <Textarea v-model="form.textContent" rows="4" placeholder="輸入通知內容..." />
          </div>
        </div>

        <!-- Status Toggle -->
        <div class="flex items-center gap-3 pt-2 border-t border-surface-200 dark:border-surface-700">
          <InputSwitch v-model="form.active" />
          <label class="font-medium text-surface-700 dark:text-surface-300">{{ form.active ? '啟用' : '停用' }}</label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="dialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveAnnouncement" />
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
import InputSwitch from 'primevue/inputswitch'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import DatePicker from 'primevue/datepicker'
import FileUpload from 'primevue/fileupload'
import Editor from 'primevue/editor'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// KPI Data
const kpiData = ref({
  totalActive: 8,
  marqueeCount: 3,
  popupBannerCount: 5
})

// Options
const typeOptions = ref([
  { label: '跑馬燈', value: '跑馬燈' },
  { label: '彈窗', value: '彈窗' },
  { label: '輪播圖', value: '輪播圖' },
  { label: '站內通知', value: '站內通知' }
])

const targetOptions = ref([
  { label: '全體會員', value: 'All' },
  { label: 'VIP1-VIP3', value: 'VIP1-3' },
  { label: 'VIP4-VIP6', value: 'VIP4-6' },
  { label: 'VIP7-VIP10', value: 'VIP7-10' },
  { label: '代理', value: 'Agent' }
])

// Announcements Data
interface Announcement {
  id: number
  title: string
  type: string
  target: string
  startTime: string
  endTime: string
  active: boolean
  textContent: string
  richContent: string
  linkUrl: string
}

const announcements = ref<Announcement[]>([
  { id: 1, title: '新年紅包活動開跑！', type: '跑馬燈', target: '全體', startTime: '2026-01-10 00:00', endTime: '2026-01-20 23:59', active: true, textContent: '新年紅包活動開跑！登入即領 $88', richContent: '', linkUrl: '' },
  { id: 2, title: '首存優惠限時加碼', type: '彈窗', target: '全體', startTime: '2026-01-08 00:00', endTime: '2026-01-31 23:59', active: true, textContent: '', richContent: '<p>首存加碼 100%！</p>', linkUrl: '' },
  { id: 3, title: 'VIP 專屬輪播', type: '輪播圖', target: 'VIP', startTime: '2026-01-05 00:00', endTime: '2026-02-05 23:59', active: true, textContent: '', richContent: '', linkUrl: 'https://yota.com/vip-promo' },
  { id: 4, title: '系統維護公告', type: '站內通知', target: '全體', startTime: '2026-01-12 02:00', endTime: '2026-01-12 04:00', active: true, textContent: '系統將於 01/12 02:00-04:00 維護', richContent: '', linkUrl: '' },
  { id: 5, title: '代理佣金調整通知', type: '站內通知', target: '代理', startTime: '2026-01-01 00:00', endTime: '2026-12-31 23:59', active: true, textContent: '新佣金政策將於 2月1日生效', richContent: '', linkUrl: '' },
  { id: 6, title: '老虎機大獎活動', type: '輪播圖', target: '全體', startTime: '2026-01-15 00:00', endTime: '2026-01-25 23:59', active: false, textContent: '', richContent: '', linkUrl: 'https://yota.com/slots-jackpot' }
])

// Helpers
const getTypeSeverity = (type: string): string => {
  const map: Record<string, string> = { '跑馬燈': 'info', '彈窗': 'warn', '輪播圖': 'success', '站內通知': 'secondary' }
  return map[type] || 'info'
}

const getTargetSeverity = (target: string): string => {
  const map: Record<string, string> = { '全體': 'info', 'VIP': 'warn', '代理': 'success' }
  return map[target] || 'secondary'
}

// Dialog State
const dialogVisible = ref(false)
const editingItem = ref<Announcement | null>(null)

interface FormType {
  title: string
  type: string
  targets: string[]
  scheduleRange: Date[] | null
  textContent: string
  richContent: string
  linkUrl: string
  active: boolean
}

const form = ref<FormType>({
  title: '', type: '跑馬燈', targets: ['All'], scheduleRange: null, textContent: '', richContent: '', linkUrl: '', active: true
})

const resetForm = () => {
  form.value = { title: '', type: '跑馬燈', targets: ['All'], scheduleRange: null, textContent: '', richContent: '', linkUrl: '', active: true }
}

const openDialog = (item: Announcement | null) => {
  editingItem.value = item
  if (item) {
    form.value = {
      title: item.title,
      type: item.type,
      targets: [item.target],
      scheduleRange: null,
      textContent: item.textContent,
      richContent: item.richContent,
      linkUrl: item.linkUrl,
      active: item.active
    }
  } else {
    resetForm()
  }
  dialogVisible.value = true
}

const handleTypeChange = () => {
  // Clear content fields when type changes
  form.value.textContent = ''
  form.value.richContent = ''
  form.value.linkUrl = ''
}

const saveAnnouncement = () => {
  if (!form.value.title) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫標題', life: 3000 })
    return
  }
  const action = editingItem.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `公告「${form.value.title}」已${action}`, life: 3000 })
  dialogVisible.value = false
}

const handleStatusChange = (item: Announcement) => {
  const status = item.active ? '啟用' : '停用'
  toast.add({ severity: 'success', summary: '狀態變更', detail: `「${item.title}」已${status}`, life: 2000 })
}

const handleDelete = (item: Announcement) => {
  toast.add({ severity: 'warn', summary: '刪除', detail: `「${item.title}」已刪除`, life: 2000 })
}
</script>
