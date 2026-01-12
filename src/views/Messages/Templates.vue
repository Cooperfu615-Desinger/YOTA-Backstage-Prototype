<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-envelope text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">訊息管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">訊息模板</span>
    </div>

    <!-- Header Actions -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
        <i class="pi pi-file-edit text-purple-500"></i>
        模板管理
      </div>
      <Button label="新增模板" icon="pi pi-plus" @click="openNewTemplate" />
    </div>

    <!-- Channel Tabs -->
    <TabView v-model:activeIndex="activeTab">
      <TabPanel v-for="(tab, index) in channelTabs" :key="index" :value="String(index)" :header="tab.label">
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <template #content>
            <DataTable :value="getFilteredTemplates(tab.value)" stripedRows paginator :rows="10">
              <!-- Template Name Column -->
              <Column field="name" header="模板名稱" sortable style="min-width: 180px">
                <template #body="slotProps">
                  <div class="flex items-center gap-2">
                    <i :class="['pi', getChannelIcon(slotProps.data.channel)]" class="text-purple-500"></i>
                    <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.name }}</span>
                  </div>
                </template>
              </Column>

              <!-- Code Column -->
              <Column field="code" header="代碼" style="min-width: 140px">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.code" severity="secondary" />
                </template>
              </Column>

              <!-- Channel Column -->
              <Column field="channel" header="渠道" style="min-width: 100px">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.channel" :severity="getChannelSeverity(slotProps.data.channel)" />
                </template>
              </Column>

              <!-- Language Column -->
              <Column field="lang" header="語言" style="min-width: 80px">
                <template #body="slotProps">
                  <span class="text-surface-700 dark:text-surface-300">{{ slotProps.data.lang }}</span>
                </template>
              </Column>

              <!-- Last Updated Column -->
              <Column header="最後更新" style="min-width: 160px">
                <template #body="slotProps">
                  <div>
                    <p class="text-sm font-mono text-surface-700 dark:text-surface-300">{{ slotProps.data.updatedAt }}</p>
                    <p class="text-xs text-surface-500">{{ slotProps.data.updatedBy }}</p>
                  </div>
                </template>
              </Column>

              <!-- Status Column -->
              <Column field="active" header="狀態" style="min-width: 80px">
                <template #body="slotProps">
                  <InputSwitch v-model="slotProps.data.active" @change="handleStatusChange(slotProps.data)" />
                </template>
              </Column>

              <!-- Actions Column -->
              <Column header="操作" style="min-width: 140px">
                <template #body="slotProps">
                  <div class="flex gap-1">
                    <Button icon="pi pi-eye" severity="info" text size="small" v-tooltip="'預覽'" @click="openPreview(slotProps.data)" />
                    <Button icon="pi pi-pencil" severity="warn" text size="small" v-tooltip="'編輯'" @click="openEdit(slotProps.data)" />
                    <Button icon="pi pi-copy" severity="secondary" text size="small" v-tooltip="'複製'" @click="duplicateTemplate(slotProps.data)" />
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </TabPanel>
    </TabView>

    <!-- Template Editor Dialog -->
    <Dialog v-model:visible="editorDialogVisible" :header="isEditMode ? '編輯模板' : '新增模板'" modal :style="{ width: '900px' }" class="p-fluid">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left: Settings -->
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">模板名稱 <span class="text-red-500">*</span></label>
            <InputText v-model="templateForm.name" placeholder="例：註冊驗證碼" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">模板代碼 (Slug)</label>
            <InputText v-model="templateForm.code" placeholder="例：REG_VERIFY" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">語言</label>
            <Select v-model="templateForm.lang" :options="langOptions" optionLabel="label" optionValue="value" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">渠道</label>
            <Select v-model="templateForm.channel" :options="channelSelectOptions" optionLabel="label" optionValue="value" />
          </div>
          <div class="flex items-center gap-3 pt-2 border-t border-surface-200 dark:border-surface-700">
            <InputSwitch v-model="templateForm.active" />
            <label class="font-medium text-surface-700 dark:text-surface-300">{{ templateForm.active ? '啟用中' : '已停用' }}</label>
          </div>
        </div>

        <!-- Right: Content Editor -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <!-- Subject (Email/Inbox only) -->
          <div v-if="templateForm.channel !== 'SMS'" class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">主旨 (Subject)</label>
            <InputText v-model="templateForm.subject" placeholder="例：歡迎加入 YOTA！" />
          </div>

          <!-- Variable Helper -->
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">變數小幫手 (點擊複製)</label>
            <div class="flex flex-wrap gap-2">
              <Button v-for="variable in variableChips" :key="variable" :label="variable" severity="secondary" outlined size="small" @click="copyVariable(variable)" />
            </div>
          </div>

          <!-- Content Editor -->
          <div class="flex flex-col gap-2 flex-1">
            <div class="flex items-center justify-between">
              <label class="font-medium text-surface-700 dark:text-surface-300">內容編輯器</label>
              <span v-if="templateForm.channel === 'SMS'" class="text-sm text-surface-500">
                目前: {{ templateForm.content.length }} 字 / 預估則數: {{ Math.ceil(templateForm.content.length / 70) || 1 }}
              </span>
            </div>
            <!-- Email/Inbox: Rich Text -->
            <Editor v-if="templateForm.channel !== 'SMS'" v-model="templateForm.content" editorStyle="height: 250px" />
            <!-- SMS: Plain Text -->
            <Textarea v-else v-model="templateForm.content" rows="8" placeholder="輸入簡訊內容..." />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="editorDialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveTemplate" />
        </div>
      </template>
    </Dialog>

    <!-- Preview Dialog -->
    <Dialog v-model:visible="previewDialogVisible" header="模板預覽" modal :style="{ width: '600px' }">
      <div v-if="previewData" class="flex flex-col gap-4">
        <!-- Meta Info -->
        <div class="grid grid-cols-3 gap-4 p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
          <div>
            <p class="text-surface-500 text-sm mb-1">模板名稱</p>
            <p class="font-medium text-surface-900 dark:text-white">{{ previewData.name }}</p>
          </div>
          <div>
            <p class="text-surface-500 text-sm mb-1">渠道</p>
            <Tag :value="previewData.channel" :severity="getChannelSeverity(previewData.channel)" />
          </div>
          <div>
            <p class="text-surface-500 text-sm mb-1">語言</p>
            <span class="text-surface-900 dark:text-white">{{ previewData.lang }}</span>
          </div>
        </div>

        <!-- Subject (if applicable) -->
        <div v-if="previewData.subject" class="p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
          <p class="text-surface-500 text-sm mb-1">主旨</p>
          <p class="font-medium text-surface-900 dark:text-white">{{ parseVariables(previewData.subject) }}</p>
        </div>

        <!-- Content Preview -->
        <div class="p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
          <p class="text-surface-500 text-sm mb-2">內容預覽 (變數已替換)</p>
          <div class="p-4 bg-white dark:bg-surface-800 rounded border border-surface-200 dark:border-surface-600" v-html="parseVariables(previewData.content)"></div>
        </div>

        <!-- Variable Mapping -->
        <div class="p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
          <p class="text-surface-500 text-sm mb-2">變數對應 (模擬)</p>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div class="flex justify-between"><span class="text-surface-500">{username}</span><span class="text-surface-900 dark:text-white">Player001</span></div>
            <div class="flex justify-between"><span class="text-surface-500">{amount}</span><span class="text-surface-900 dark:text-white">$10,000</span></div>
            <div class="flex justify-between"><span class="text-surface-500">{date}</span><span class="text-surface-900 dark:text-white">2026-01-11</span></div>
            <div class="flex justify-between"><span class="text-surface-500">{code}</span><span class="text-surface-900 dark:text-white">A1B2C3</span></div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="關閉" severity="secondary" @click="previewDialogVisible = false" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputSwitch from 'primevue/inputswitch'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import Editor from 'primevue/editor'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Tab State
const activeTab = ref(0)
const channelTabs = ref([
  { label: '全部', value: 'all' },
  { label: '郵件 (Email)', value: 'Email' },
  { label: '簡訊 (SMS)', value: 'SMS' },
  { label: '站內信 (Inbox)', value: 'Inbox' }
])

// Options
const langOptions = ref([
  { label: '繁體中文 (zh-TW)', value: 'zh-TW' },
  { label: 'English (en-US)', value: 'en-US' },
  { label: '简体中文 (zh-CN)', value: 'zh-CN' }
])

const channelSelectOptions = ref([
  { label: 'Email', value: 'Email' },
  { label: 'SMS', value: 'SMS' },
  { label: 'Inbox', value: 'Inbox' }
])

const variableChips = ['{username}', '{amount}', '{date}', '{code}', '{balance}', '{sitename}']

// Template Data
interface Template {
  id: number
  name: string
  code: string
  channel: string
  lang: string
  subject: string
  content: string
  updatedAt: string
  updatedBy: string
  active: boolean
}

const templates = ref<Template[]>([
  { id: 1, name: '註冊驗證碼', code: 'REG_VERIFY', channel: 'Email', lang: 'zh-TW', subject: '【YOTA】您的驗證碼', content: '<p>親愛的 {username}，</p><p>您的驗證碼是：<strong>{code}</strong>，10 分鐘內有效。</p>', updatedAt: '2026-01-10 14:30', updatedBy: 'admin001', active: true },
  { id: 2, name: '存款到帳通知', code: 'DEPOSIT_SUCCESS', channel: 'Email', lang: 'zh-TW', subject: '存款成功通知', content: '<p>親愛的 {username}，</p><p>您的存款 {amount} 已成功入帳，目前餘額 {balance}。</p>', updatedAt: '2026-01-09 10:15', updatedBy: 'admin002', active: true },
  { id: 3, name: '提款申請通知', code: 'WITHDRAW_APPLY', channel: 'SMS', lang: 'zh-TW', subject: '', content: '【YOTA】您的提款申請 {amount} 已送出，預計 24 小時內處理。', updatedAt: '2026-01-08 16:45', updatedBy: 'admin001', active: true },
  { id: 4, name: '密碼修改成功', code: 'PWD_CHANGED', channel: 'Email', lang: 'zh-TW', subject: '密碼已修改', content: '<p>親愛的 {username}，</p><p>您的密碼已於 {date} 成功修改，若非本人操作請立即聯繫客服。</p>', updatedAt: '2026-01-07 09:00', updatedBy: 'admin003', active: true },
  { id: 5, name: '歡迎站內信', code: 'WELCOME_MSG', channel: 'Inbox', lang: 'zh-TW', subject: '歡迎加入 YOTA！', content: '<p>親愛的 {username}，</p><p>歡迎加入 {sitename}！快來體驗精彩遊戲吧！</p>', updatedAt: '2026-01-06 11:30', updatedBy: 'admin001', active: true },
  { id: 6, name: '紅利通知', code: 'BONUS_NOTIFY', channel: 'SMS', lang: 'zh-TW', subject: '', content: '【YOTA】恭喜！您獲得 {amount} 紅利獎金，已存入您的帳戶。', updatedAt: '2026-01-05 20:00', updatedBy: 'admin002', active: true },
  { id: 7, name: 'Registration Verification', code: 'REG_VERIFY_EN', channel: 'Email', lang: 'en-US', subject: '【YOTA】Your Verification Code', content: '<p>Dear {username},</p><p>Your verification code is: <strong>{code}</strong>. Valid for 10 minutes.</p>', updatedAt: '2026-01-04 08:00', updatedBy: 'admin001', active: false }
])

// Filter Templates by Channel
const getFilteredTemplates = (channel: string) => {
  if (channel === 'all') return templates.value
  return templates.value.filter(t => t.channel === channel)
}

// Helpers
const getChannelIcon = (channel: string): string => {
  const icons: Record<string, string> = { 'Email': 'pi-envelope', 'SMS': 'pi-mobile', 'Inbox': 'pi-inbox' }
  return icons[channel] || 'pi-envelope'
}

const getChannelSeverity = (channel: string): string => {
  const severities: Record<string, string> = { 'Email': 'info', 'SMS': 'success', 'Inbox': 'secondary' }
  return severities[channel] || 'info'
}

const parseVariables = (content: string): string => {
  return content
    .replace(/{username}/g, 'Player001')
    .replace(/{amount}/g, '$10,000')
    .replace(/{date}/g, '2026-01-11')
    .replace(/{code}/g, 'A1B2C3')
    .replace(/{balance}/g, '$50,000')
    .replace(/{sitename}/g, 'YOTA')
}

// Editor Dialog
const editorDialogVisible = ref(false)
const isEditMode = ref(false)

interface TemplateForm {
  id: number | null
  name: string
  code: string
  channel: string
  lang: string
  subject: string
  content: string
  active: boolean
}

const templateForm = ref<TemplateForm>({
  id: null, name: '', code: '', channel: 'Email', lang: 'zh-TW', subject: '', content: '', active: true
})

const resetForm = () => {
  templateForm.value = { id: null, name: '', code: '', channel: 'Email', lang: 'zh-TW', subject: '', content: '', active: true }
}

const openNewTemplate = () => {
  resetForm()
  isEditMode.value = false
  editorDialogVisible.value = true
}

const openEdit = (template: Template) => {
  isEditMode.value = true
  templateForm.value = { ...template }
  editorDialogVisible.value = true
}

const saveTemplate = () => {
  if (!templateForm.value.name) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫模板名稱', life: 3000 })
    return
  }
  const action = isEditMode.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `模板「${templateForm.value.name}」已${action}`, life: 3000 })
  editorDialogVisible.value = false
}

const duplicateTemplate = (template: Template) => {
  toast.add({ severity: 'info', summary: '複製模板', detail: `已複製「${template.name}」`, life: 2000 })
}

const handleStatusChange = (template: Template) => {
  const status = template.active ? '啟用' : '停用'
  toast.add({ severity: 'success', summary: '狀態變更', detail: `「${template.name}」已${status}`, life: 2000 })
}

const copyVariable = (variable: string) => {
  navigator.clipboard.writeText(variable)
  toast.add({ severity: 'info', summary: '已複製', detail: `${variable} 已複製到剪貼簿`, life: 2000 })
}

// Preview Dialog
const previewDialogVisible = ref(false)
const previewData = ref<Template | null>(null)

const openPreview = (template: Template) => {
  previewData.value = template
  previewDialogVisible.value = true
}
</script>
