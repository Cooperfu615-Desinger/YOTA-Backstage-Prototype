<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-cog text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">系統設定</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">系統參數</span>
    </div>

    <!-- Header -->
    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-sliders-h text-purple-500"></i>
      系統參數設定
    </div>

    <!-- Settings Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Site Identity Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-globe text-blue-500"></i>
            網站基礎設定
          </div>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">網站標題</label>
              <InputText v-model="siteSettings.title" placeholder="YOTA Casino" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">Logo 上傳</label>
              <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" chooseLabel="選擇圖片" class="w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">預設語系</label>
              <Select v-model="siteSettings.locale" :options="localeOptions" optionLabel="label" optionValue="value" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">時區設定</label>
              <Select v-model="siteSettings.timezone" :options="timezoneOptions" optionLabel="label" optionValue="value" />
            </div>
            <div class="flex justify-end pt-2 border-t border-surface-200 dark:border-surface-700">
              <Button label="儲存設定" icon="pi pi-check" size="small" @click="saveSiteSettings" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Operation & Maintenance Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-wrench text-orange-500"></i>
            營運與維護
          </div>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
              <div>
                <p class="font-medium text-surface-900 dark:text-white">全站維護模式</p>
                <p class="text-sm text-surface-500">開啟後前台顯示維護頁</p>
              </div>
              <InputSwitch v-model="operationSettings.maintenanceMode" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">維護公告內容</label>
              <Textarea v-model="operationSettings.maintenanceMessage" rows="3" placeholder="系統維護中，預計 XX:XX 恢復服務..." />
            </div>
            <div class="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
              <div>
                <p class="font-medium text-surface-900 dark:text-white">允許後台登入</p>
                <p class="text-sm text-surface-500">維護期間是否允許管理員登入</p>
              </div>
              <InputSwitch v-model="operationSettings.allowAdminLogin" />
            </div>
            <div class="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
              <div>
                <p class="font-medium text-surface-900 dark:text-white">註冊功能開關</p>
                <p class="text-sm text-surface-500">關閉後前台無法註冊新帳號</p>
              </div>
              <InputSwitch v-model="operationSettings.registrationEnabled" />
            </div>
            <div class="flex justify-end pt-2 border-t border-surface-200 dark:border-surface-700">
              <Button label="儲存設定" icon="pi pi-check" size="small" @click="saveOperationSettings" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Security Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-shield text-green-500"></i>
            安全性設定
          </div>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">後台白名單 IP</label>
              <Textarea v-model="securitySettings.whitelistIPs" rows="3" placeholder="一行一個 IP&#10;192.168.1.1&#10;10.0.0.0/24" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">登入錯誤鎖定次數</label>
              <InputNumber v-model="securitySettings.loginLockAttempts" :min="1" :max="20" suffix=" 次" />
            </div>
            <div class="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
              <div>
                <p class="font-medium text-surface-900 dark:text-white">強制手機驗證</p>
                <p class="text-sm text-surface-500">註冊時強制綁定手機</p>
              </div>
              <InputSwitch v-model="securitySettings.forcePhoneVerify" />
            </div>
            <div class="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
              <div>
                <p class="font-medium text-surface-900 dark:text-white">驗證碼開關</p>
                <p class="text-sm text-surface-500">登入/註冊圖形驗證碼</p>
              </div>
              <InputSwitch v-model="securitySettings.captchaEnabled" />
            </div>
            <div class="flex justify-end pt-2 border-t border-surface-200 dark:border-surface-700">
              <Button label="儲存設定" icon="pi pi-check" size="small" @click="saveSecuritySettings" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Promotion & Finance Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-dollar text-yellow-500"></i>
            推廣與財務參數
          </div>
        </template>
        <template #content>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">新註冊贈金</label>
              <InputNumber v-model="financeSettings.registrationBonus" prefix="$" :min="0" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">預設代理佣金</label>
              <InputNumber v-model="financeSettings.defaultAgentCommission" suffix="%" :min="0" :max="100" :minFractionDigits="1" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">提款手續費</label>
              <InputNumber v-model="financeSettings.withdrawalFee" prefix="$" :min="0" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">最低提款金額</label>
              <InputNumber v-model="financeSettings.minWithdrawal" prefix="$" :min="0" />
            </div>
            <div class="flex justify-end pt-2 border-t border-surface-200 dark:border-surface-700">
              <Button label="儲存設定" icon="pi pi-check" size="small" @click="saveFinanceSettings" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Options
const localeOptions = ref([
  { label: '繁體中文 (zh-TW)', value: 'zh-TW' },
  { label: 'English (en-US)', value: 'en-US' },
  { label: 'Tiếng Việt (vi-VN)', value: 'vi-VN' },
  { label: '简体中文 (zh-CN)', value: 'zh-CN' },
  { label: 'ภาษาไทย (th-TH)', value: 'th-TH' }
])

const timezoneOptions = ref([
  { label: 'GMT+8 (台北)', value: 'GMT+8' },
  { label: 'GMT+7 (曼谷)', value: 'GMT+7' },
  { label: 'GMT+9 (東京)', value: 'GMT+9' },
  { label: 'GMT+0 (倫敦)', value: 'GMT+0' },
  { label: 'GMT-5 (紐約)', value: 'GMT-5' }
])

// Site Settings
const siteSettings = ref({
  title: 'YOTA Casino',
  locale: 'zh-TW',
  timezone: 'GMT+8'
})

// Operation Settings
const operationSettings = ref({
  maintenanceMode: false,
  maintenanceMessage: '',
  allowAdminLogin: true,
  registrationEnabled: true
})

// Security Settings
const securitySettings = ref({
  whitelistIPs: '192.168.1.1\n10.0.0.0/24',
  loginLockAttempts: 5,
  forcePhoneVerify: true,
  captchaEnabled: true
})

// Finance Settings
const financeSettings = ref({
  registrationBonus: 88,
  defaultAgentCommission: 0.5,
  withdrawalFee: 30,
  minWithdrawal: 500
})

// Save Handlers
const saveSiteSettings = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '網站基礎設定已更新', life: 3000 })
}

const saveOperationSettings = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '營運與維護設定已更新', life: 3000 })
}

const saveSecuritySettings = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '安全性設定已更新', life: 3000 })
}

const saveFinanceSettings = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '財務參數已更新', life: 3000 })
}
</script>
