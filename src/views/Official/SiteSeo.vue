<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-globe text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">官網管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">站點資訊</span>
    </div>

    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-cog text-cyan-500"></i>
      站點資訊 (Site Settings)
    </div>

    <!-- SEO Settings -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white">
          <i class="pi pi-search text-blue-500"></i>
          SEO 設定
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">網站標題 (Title) <span class="text-red-500">*</span></label>
            <InputText v-model="seoForm.title" placeholder="YOTA 娛樂城 - 最佳線上博弈平台" />
            <small class="text-surface-500">建議 30-60 字元，將顯示在瀏覽器標籤</small>
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">關鍵字 (Keywords)</label>
            <InputText v-model="seoForm.keywords" placeholder="線上娛樂城, 老虎機, 體育投注, 真人百家樂" />
            <small class="text-surface-500">以逗號分隔，建議 5-10 個核心關鍵字</small>
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">描述 (Description)</label>
            <Textarea v-model="seoForm.description" rows="3" placeholder="YOTA 娛樂城提供最優質的線上博弈體驗，包含老虎機、真人百家樂、體育投注等多元遊戲..." />
            <small class="text-surface-500">建議 120-160 字元，將顯示在搜尋結果</small>
          </div>
        </div>
      </template>
    </Card>

    <!-- Social Links -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white">
          <i class="pi pi-share-alt text-purple-500"></i>
          社群連結
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">
              <i class="pi pi-facebook text-blue-600 mr-2"></i>Facebook
            </label>
            <InputText v-model="socialForm.facebook" placeholder="https://facebook.com/yota" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">
              <i class="pi pi-instagram text-pink-500 mr-2"></i>Instagram
            </label>
            <InputText v-model="socialForm.instagram" placeholder="https://instagram.com/yota" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">
              <i class="pi pi-telegram text-cyan-500 mr-2"></i>Telegram
            </label>
            <InputText v-model="socialForm.telegram" placeholder="https://t.me/yota_official" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">
              <i class="pi pi-comments text-green-500 mr-2"></i>Line
            </label>
            <InputText v-model="socialForm.line" placeholder="https://line.me/R/ti/p/@yota" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Footer Info -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white">
          <i class="pi pi-file text-orange-500"></i>
          底部資訊
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">版權宣告 (Copyright)</label>
            <InputText v-model="footerForm.copyright" placeholder="© 2026 YOTA Entertainment. All Rights Reserved." />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">聯絡 Email</label>
            <InputText v-model="footerForm.email" placeholder="support@yota.com" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Save Button -->
    <div class="flex justify-end gap-2">
      <Button label="重設" severity="secondary" icon="pi pi-refresh" @click="resetForm" />
      <Button label="儲存設定" icon="pi pi-check" @click="saveSettings" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// SEO Form
const seoForm = ref({
  title: 'YOTA 娛樂城 - 最佳線上博弈平台',
  keywords: '線上娛樂城, 老虎機, 體育投注, 真人百家樂, 線上賭場',
  description: 'YOTA 娛樂城提供最優質的線上博弈體驗，包含數百款老虎機遊戲、真人百家樂、體育投注等。24小時客服，快速出金，安全可靠。'
})

// Social Links Form
const socialForm = ref({
  facebook: 'https://facebook.com/yota_official',
  instagram: 'https://instagram.com/yota_gaming',
  telegram: 'https://t.me/yota_official',
  line: 'https://line.me/R/ti/p/@yota'
})

// Footer Form
const footerForm = ref({
  copyright: '© 2026 YOTA Entertainment. All Rights Reserved.',
  email: 'support@yota.com'
})

const saveSettings = () => {
  if (!seoForm.value.title) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫網站標題', life: 3000 })
    return
  }
  toast.add({ severity: 'success', summary: '儲存成功', detail: '站點設定已更新', life: 3000 })
}

const resetForm = () => {
  seoForm.value = {
    title: 'YOTA 娛樂城 - 最佳線上博弈平台',
    keywords: '線上娛樂城, 老虎機, 體育投注, 真人百家樂, 線上賭場',
    description: 'YOTA 娛樂城提供最優質的線上博弈體驗，包含數百款老虎機遊戲、真人百家樂、體育投注等。24小時客服，快速出金，安全可靠。'
  }
  socialForm.value = {
    facebook: 'https://facebook.com/yota_official',
    instagram: 'https://instagram.com/yota_gaming',
    telegram: 'https://t.me/yota_official',
    line: 'https://line.me/R/ti/p/@yota'
  }
  footerForm.value = {
    copyright: '© 2026 YOTA Entertainment. All Rights Reserved.',
    email: 'support@yota.com'
  }
  toast.add({ severity: 'info', summary: '已重設', detail: '表單已還原為預設值', life: 2000 })
}
</script>
