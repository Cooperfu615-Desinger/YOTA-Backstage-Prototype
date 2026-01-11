<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-envelope text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">訊息管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">訊息設置</span>
    </div>

    <!-- TabView -->
    <TabView>
      <!-- Tab 1: Event Triggers -->
      <TabPanel value="0" header="通知事件配置">
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <template #title>
            <div class="flex items-center gap-2 text-surface-900 dark:text-white">
              <i class="pi pi-bell text-purple-500"></i>
              事件觸發設定
              <span class="text-sm text-surface-500 font-normal ml-2">設定各類事件透過哪些管道發送通知</span>
            </div>
          </template>
          <template #content>
            <DataTable :value="eventTriggers" stripedRows>
              <!-- Event Name Column -->
              <Column field="name" header="事件名稱" style="min-width: 180px">
                <template #body="slotProps">
                  <div class="flex items-center gap-2">
                    <i :class="['pi', slotProps.data.icon, 'text-purple-500']"></i>
                    <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.name }}</span>
                  </div>
                </template>
              </Column>

              <!-- Inbox Column -->
              <Column header="站內信" style="min-width: 100px">
                <template #body="slotProps">
                  <InputSwitch v-model="slotProps.data.inbox" @change="handleChannelChange(slotProps.data, 'inbox')" />
                </template>
              </Column>

              <!-- Email Column -->
              <Column header="電子郵件" style="min-width: 100px">
                <template #body="slotProps">
                  <InputSwitch v-model="slotProps.data.email" @change="handleChannelChange(slotProps.data, 'email')" />
                </template>
              </Column>

              <!-- SMS Column -->
              <Column header="簡訊" style="min-width: 80px">
                <template #body="slotProps">
                  <InputSwitch v-model="slotProps.data.sms" @change="handleChannelChange(slotProps.data, 'sms')" />
                </template>
              </Column>

              <!-- Telegram Column -->
              <Column header="Telegram" style="min-width: 100px">
                <template #body="slotProps">
                  <InputSwitch v-model="slotProps.data.telegram" @change="handleChannelChange(slotProps.data, 'telegram')" />
                </template>
              </Column>

              <!-- Admin Notify Column -->
              <Column header="管理員通知" style="min-width: 110px">
                <template #body="slotProps">
                  <InputSwitch v-model="slotProps.data.adminNotify" @change="handleChannelChange(slotProps.data, 'adminNotify')" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </TabPanel>

      <!-- Tab 2: Gateway Config -->
      <TabPanel value="1" header="渠道參數設定">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Email Settings -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-envelope text-blue-500"></i>
                Email 設定
              </div>
            </template>
            <template #content>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">SMTP Server</label>
                  <InputText v-model="emailConfig.server" placeholder="smtp.example.com" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">Port</label>
                  <InputNumber v-model="emailConfig.port" :min="1" :max="65535" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">User</label>
                  <InputText v-model="emailConfig.user" placeholder="noreply@example.com" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">Password</label>
                  <Password v-model="emailConfig.password" toggleMask :feedback="false" />
                </div>
                <Button label="發送測試訊息" icon="pi pi-send" severity="secondary" outlined @click="testEmail" />
              </div>
            </template>
          </Card>

          <!-- SMS Settings -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-mobile text-green-500"></i>
                SMS 設定
              </div>
            </template>
            <template #content>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">Provider</label>
                  <Select v-model="smsConfig.provider" :options="smsProviders" optionLabel="label" optionValue="value" placeholder="選擇供應商" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">API Key</label>
                  <Password v-model="smsConfig.apiKey" toggleMask :feedback="false" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">Sender ID</label>
                  <InputText v-model="smsConfig.senderId" placeholder="YOTA" />
                </div>
                <Button label="發送測試訊息" icon="pi pi-send" severity="secondary" outlined @click="testSms" />
              </div>
            </template>
          </Card>

          <!-- Telegram Settings -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-telegram text-cyan-500"></i>
                Telegram 設定
              </div>
            </template>
            <template #content>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">Bot Token</label>
                  <Password v-model="telegramConfig.botToken" toggleMask :feedback="false" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">Chat ID</label>
                  <InputText v-model="telegramConfig.chatId" placeholder="-1001234567890" />
                </div>
                <Button label="發送測試訊息" icon="pi pi-send" severity="secondary" outlined @click="testTelegram" />
              </div>
            </template>
          </Card>

          <!-- Save All Button -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 lg:col-span-2">
            <template #content>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-surface-500">
                  <i class="pi pi-info-circle"></i>
                  <span>修改後請記得儲存設定</span>
                </div>
                <div class="flex gap-3">
                  <Button label="重置" icon="pi pi-refresh" severity="secondary" @click="resetConfig" />
                  <Button label="儲存所有設定" icon="pi pi-save" @click="saveAllConfig" />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>
    </TabView>
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
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Password from 'primevue/password'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Event Triggers Data
interface EventTrigger {
  id: number
  name: string
  icon: string
  inbox: boolean
  email: boolean
  sms: boolean
  telegram: boolean
  adminNotify: boolean
}

const eventTriggers = ref<EventTrigger[]>([
  { id: 1, name: '註冊成功', icon: 'pi-user-plus', inbox: true, email: true, sms: false, telegram: false, adminNotify: true },
  { id: 2, name: '存款到帳', icon: 'pi-wallet', inbox: true, email: true, sms: true, telegram: true, adminNotify: false },
  { id: 3, name: '提款申請', icon: 'pi-money-bill', inbox: true, email: true, sms: true, telegram: true, adminNotify: true },
  { id: 4, name: '提款完成', icon: 'pi-check-circle', inbox: true, email: true, sms: true, telegram: false, adminNotify: false },
  { id: 5, name: '修改密碼', icon: 'pi-lock', inbox: true, email: true, sms: true, telegram: false, adminNotify: true },
  { id: 6, name: '大額中獎', icon: 'pi-star', inbox: true, email: false, sms: false, telegram: true, adminNotify: true }
])

// SMS Providers
const smsProviders = ref([
  { label: 'Twilio', value: 'twilio' },
  { label: 'Nexmo', value: 'nexmo' },
  { label: 'SMS.to', value: 'smsto' },
  { label: '三竹簡訊', value: 'mitake' }
])

// Gateway Configs
const emailConfig = ref({
  server: 'smtp.yota.com',
  port: 587,
  user: 'noreply@yota.com',
  password: ''
})

const smsConfig = ref({
  provider: 'twilio',
  apiKey: '',
  senderId: 'YOTA'
})

const telegramConfig = ref({
  botToken: '',
  chatId: ''
})

// Handlers
const handleChannelChange = (event: EventTrigger, channel: string) => {
  toast.add({ severity: 'success', summary: '設定更新', detail: `${event.name} - ${channel} 已變更`, life: 2000 })
}

const testEmail = () => {
  toast.add({ severity: 'info', summary: '測試郵件', detail: '正在發送測試郵件...', life: 3000 })
}

const testSms = () => {
  toast.add({ severity: 'info', summary: '測試簡訊', detail: '正在發送測試簡訊...', life: 3000 })
}

const testTelegram = () => {
  toast.add({ severity: 'info', summary: '測試 Telegram', detail: '正在發送測試訊息...', life: 3000 })
}

const resetConfig = () => {
  toast.add({ severity: 'warn', summary: '重置', detail: '設定已重置為預設值', life: 2000 })
}

const saveAllConfig = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '所有渠道設定已儲存', life: 3000 })
}
</script>
