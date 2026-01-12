<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-envelope text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">訊息管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">訊息紀錄</span>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Today's Total -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">今日發送總量</p>
              <p class="text-3xl font-bold text-surface-900 dark:text-white">{{ kpiData.totalSent.toLocaleString() }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-blue-500">
                <i class="pi pi-send"></i>
                <span>總請求數</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-envelope text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Success Rate -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">發送成功率</p>
              <p class="text-3xl font-bold text-green-500">{{ kpiData.successRate }}%</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-green-500">
                <i class="pi pi-check-circle"></i>
                <span>成功/總量</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-chart-line text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Failed Count -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">發送失敗</p>
              <p class="text-3xl font-bold text-red-500">{{ kpiData.failedCount }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-red-500">
                <i class="pi pi-exclamation-triangle"></i>
                <span>需要排查</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <i class="pi pi-times-circle text-red-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Search Toolbar -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #content>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Filters -->
          <div class="flex flex-wrap gap-4">
            <DatePicker v-model="filters.dateRange" selectionMode="range" placeholder="時間範圍" class="w-[260px]" showIcon />
            <InputText v-model="filters.keyword" placeholder="帳號/手機/Email" class="w-[180px]" />
            <Select v-model="filters.channel" :options="channelOptions" optionLabel="label" optionValue="value" placeholder="發送渠道" class="w-[150px]" showClear />
            <Select v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="狀態" class="w-[130px]" showClear />
          </div>
          <!-- Actions -->
          <div class="flex gap-3">
            <Button label="匯出 CSV" icon="pi pi-download" severity="secondary" outlined @click="exportCsv" />
            <Button label="搜尋" icon="pi pi-search" @click="handleSearch" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Log Table -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white">
          <i class="pi pi-list text-purple-500"></i>
          發送紀錄
          <span class="text-sm text-surface-500 font-normal ml-2">(共 {{ logs.length }} 筆)</span>
        </div>
      </template>
      <template #content>
        <DataTable :value="logs" stripedRows paginator :rows="10" :rowsPerPageOptions="[10, 20, 50]">
          <!-- Timestamp Column -->
          <Column field="timestamp" header="發送時間" sortable style="min-width: 160px">
            <template #body="slotProps">
              <span class="font-mono text-sm text-surface-700 dark:text-surface-300">{{ slotProps.data.timestamp }}</span>
            </template>
          </Column>

          <!-- User Column -->
          <Column header="接收者" style="min-width: 180px">
            <template #body="slotProps">
              <div>
                <p class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.username }}</p>
                <p class="text-sm text-surface-500 font-mono">{{ slotProps.data.contact }}</p>
              </div>
            </template>
          </Column>

          <!-- Channel Column -->
          <Column field="channel" header="渠道" style="min-width: 120px">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i :class="['pi', getChannelIcon(slotProps.data.channel)]" class="text-blue-500"></i>
                <Tag :value="slotProps.data.channel" :severity="getChannelSeverity(slotProps.data.channel)" />
              </div>
            </template>
          </Column>

          <!-- Title Column -->
          <Column field="title" header="標題/內容" style="min-width: 200px">
            <template #body="slotProps">
              <span class="text-surface-700 dark:text-surface-300 truncate block max-w-[200px]">{{ slotProps.data.title }}</span>
            </template>
          </Column>

          <!-- Status Column -->
          <Column field="status" header="狀態" sortable style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
            </template>
          </Column>

          <!-- Actions Column -->
          <Column header="操作" style="min-width: 150px">
            <template #body="slotProps">
              <div class="flex gap-1">
                <Button icon="pi pi-search" severity="info" text size="small" v-tooltip="'查看詳情'" @click="openDetails(slotProps.data)" />
                <Button icon="pi pi-refresh" severity="warn" text size="small" v-tooltip="'重發'" @click="resend(slotProps.data)" :disabled="slotProps.data.status !== '失敗'" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Details Dialog -->
    <Dialog v-model:visible="detailsDialogVisible" header="訊息詳情" modal :style="{ width: '650px' }">
      <div v-if="selectedLog" class="flex flex-col gap-4">
        <!-- Basic Info -->
        <div class="grid grid-cols-3 gap-4 p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
          <div>
            <p class="text-surface-500 text-sm mb-1">發送時間</p>
            <p class="font-mono text-surface-900 dark:text-white">{{ selectedLog.timestamp }}</p>
          </div>
          <div>
            <p class="text-surface-500 text-sm mb-1">接收者</p>
            <p class="font-medium text-surface-900 dark:text-white">{{ selectedLog.username }}</p>
            <p class="text-sm text-surface-500">{{ selectedLog.contact }}</p>
          </div>
          <div>
            <p class="text-surface-500 text-sm mb-1">渠道</p>
            <Tag :value="selectedLog.channel" :severity="getChannelSeverity(selectedLog.channel)" />
          </div>
        </div>

        <!-- Message Content -->
        <div class="p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
          <p class="text-surface-500 text-sm mb-2">信件內容</p>
          <p class="font-medium text-surface-900 dark:text-white mb-2">{{ selectedLog.title }}</p>
          <div class="p-3 bg-surface-50 dark:bg-surface-800 rounded border border-surface-200 dark:border-surface-600 text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap">{{ selectedLog.content }}</div>
        </div>

        <!-- Technical Log -->
        <div class="p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
          <div class="flex items-center gap-2 mb-2">
            <i class="pi pi-code text-purple-500"></i>
            <p class="text-surface-500 text-sm font-medium">技術日誌 (Technical Log)</p>
          </div>
          <div class="p-3 bg-surface-900 rounded font-mono text-xs overflow-x-auto">
            <pre class="text-green-400">{{ JSON.stringify(selectedLog.technicalLog, null, 2) }}</pre>
          </div>
          <div v-if="selectedLog.status === '失敗'" class="mt-3 p-3 bg-red-500/10 rounded border border-red-500/30">
            <div class="flex items-center gap-2 text-red-500">
              <i class="pi pi-exclamation-triangle"></i>
              <span class="font-medium">Error Code: {{ selectedLog.errorCode }}</span>
            </div>
            <p class="text-red-400 text-sm mt-1">{{ selectedLog.errorMessage }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button v-if="selectedLog?.status === '失敗'" label="重新發送" icon="pi pi-refresh" severity="warn" @click="resendFromDialog" />
          <Button label="關閉" severity="secondary" @click="detailsDialogVisible = false" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// KPI Data
const kpiData = ref({
  totalSent: 12458,
  successRate: 98.5,
  failedCount: 187
})

// Filter Options
const channelOptions = ref([
  { label: '全部', value: 'all' },
  { label: '站內信', value: 'inbox' },
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Telegram', value: 'telegram' }
])

const statusOptions = ref([
  { label: '全部', value: 'all' },
  { label: '成功', value: 'success' },
  { label: '失敗', value: 'failed' },
  { label: '待發送', value: 'pending' }
])

// Filters State
const filters = ref({
  dateRange: null as Date[] | null,
  keyword: '',
  channel: null,
  status: null
})

// Log Data
interface MessageLog {
  id: number
  timestamp: string
  username: string
  contact: string
  channel: string
  title: string
  content: string
  status: string
  technicalLog: object
  errorCode?: string
  errorMessage?: string
}

const logs = ref<MessageLog[]>([
  { id: 1, timestamp: '2026-01-11 20:05:32', username: 'player001', contact: '0912***456', channel: 'SMS', title: '提款申請已送出', content: '您的提款申請 $10,000 已送出，預計 24 小時內處理完成。', status: '成功', technicalLog: { messageId: 'sms_12345', provider: 'twilio', statusCode: 200, response: 'ok' } },
  { id: 2, timestamp: '2026-01-11 19:58:15', username: 'vip_user88', contact: 'vip***@gmail.com', channel: 'Email', title: '存款到帳通知', content: '親愛的會員，您的存款 $50,000 已成功入帳，目前餘額 $125,000。', status: '成功', technicalLog: { messageId: 'email_67890', smtp: 'smtp.yota.com', statusCode: 250, response: 'Message accepted' } },
  { id: 3, timestamp: '2026-01-11 19:45:08', username: 'new_player', contact: '@tg_user123', channel: 'Telegram', title: '註冊成功', content: '歡迎加入 YOTA！您的帳號已開通，快來體驗精彩遊戲吧！', status: '失敗', technicalLog: { botId: 'yota_bot', chatId: '123456789', statusCode: 401, error: 'Unauthorized' }, errorCode: 'TG_401', errorMessage: 'Bot token 無效或已過期' },
  { id: 4, timestamp: '2026-01-11 19:32:44', username: 'lucky_winner', contact: '0988***123', channel: 'SMS', title: '大獎通知', content: '恭喜！您在 Gates of Olympus 贏得 $500,000 大獎！', status: '成功', technicalLog: { messageId: 'sms_99887', provider: 'twilio', statusCode: 200, response: 'ok' } },
  { id: 5, timestamp: '2026-01-11 19:15:22', username: 'regular_joe', contact: 'joe***@yahoo.com', channel: 'Email', title: '密碼修改成功', content: '您的密碼已成功修改，如非本人操作請立即聯繫客服。', status: '成功', technicalLog: { messageId: 'email_55443', smtp: 'smtp.yota.com', statusCode: 250, response: 'Message accepted' } },
  { id: 6, timestamp: '2026-01-11 18:58:11', username: 'test_user', contact: '系統', channel: '站內信', title: '系統維護公告', content: '本站將於 2026/01/12 02:00-04:00 進行例行維護，届時部分功能無法使用。', status: '成功', technicalLog: { inboxId: 'inbox_001', created: true } },
  { id: 7, timestamp: '2026-01-11 18:42:55', username: 'player_x', contact: 'px***@hotmail.com', channel: 'Email', title: '提款完成通知', content: '您的提款 $25,000 已處理完成，請查收您的銀行帳戶。', status: '待發送', technicalLog: { queue: 'email_queue', position: 3, eta: '2 minutes' } },
  { id: 8, timestamp: '2026-01-11 18:30:00', username: 'vip_diamond', contact: '0955***789', channel: 'SMS', title: 'VIP 專屬禮遇', content: '尊貴的鑽石會員，本週專屬返水加碼 0.5%，詳情請洽 VIP 專線。', status: '失敗', technicalLog: { messageId: null, provider: 'twilio', statusCode: 500, error: 'Service Unavailable' }, errorCode: 'SMS_500', errorMessage: 'SMS 供應商服務暫時不可用' }
])

// Details Dialog
const detailsDialogVisible = ref(false)
const selectedLog = ref<MessageLog | null>(null)

// Helpers
const getChannelIcon = (channel: string): string => {
  const icons: Record<string, string> = { '站內信': 'pi-inbox', 'Email': 'pi-envelope', 'SMS': 'pi-mobile', 'Telegram': 'pi-send' }
  return icons[channel] || 'pi-envelope'
}

const getChannelSeverity = (channel: string): string => {
  const severities: Record<string, string> = { '站內信': 'secondary', 'Email': 'info', 'SMS': 'success', 'Telegram': 'warn' }
  return severities[channel] || 'info'
}

const getStatusSeverity = (status: string): string => {
  const severities: Record<string, string> = { '成功': 'success', '失敗': 'danger', '待發送': 'warn' }
  return severities[status] || 'info'
}

// Actions
const handleSearch = () => {
  toast.add({ severity: 'info', summary: '搜尋', detail: '正在查詢紀錄...', life: 2000 })
}

const exportCsv = () => {
  toast.add({ severity: 'success', summary: '匯出', detail: '已匯出 CSV 檔案', life: 2000 })
}

const openDetails = (log: MessageLog) => {
  selectedLog.value = log
  detailsDialogVisible.value = true
}

const resend = (log: MessageLog) => {
  toast.add({ severity: 'warn', summary: '重發', detail: `正在重新發送給 ${log.username}...`, life: 3000 })
}

const resendFromDialog = () => {
  if (selectedLog.value) {
    resend(selectedLog.value)
    detailsDialogVisible.value = false
  }
}
</script>
