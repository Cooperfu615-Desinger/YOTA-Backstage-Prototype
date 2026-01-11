<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-th-large text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">版面設定</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">首頁設定</span>
    </div>

    <!-- Header -->
    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-home text-purple-500"></i>
      APP 首頁設定
    </div>

    <!-- TabView (4 Tabs) -->
    <TabView>
      <!-- Tab 1: Visual Assets -->
      <TabPanel value="0" header="視覺素材">
        <div class="space-y-6">
          <!-- Loading Page Card -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-mobile text-blue-500"></i>
                啟動頁設定
              </div>
            </template>
            <template #content>
              <div class="space-y-6">
                <!-- Dual Orientation Upload -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Portrait -->
                  <div class="flex flex-col gap-4 p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-mobile text-blue-500"></i>
                      <span class="font-medium text-surface-900 dark:text-white">直式 (Portrait)</span>
                    </div>
                    <FileUpload mode="basic" accept="image/jpeg, image/png" :maxFileSize="5000000" chooseLabel="上傳直式圖片" class="w-full" />
                    <small class="text-red-500 font-medium">尺寸限定 720x1280，格式 jpg/png</small>
                    <div class="mx-auto w-20 h-36 bg-surface-900 rounded-xl border-4 border-surface-600 flex items-center justify-center">
                      <i class="pi pi-image text-xl text-surface-500"></i>
                    </div>
                  </div>

                  <!-- Landscape -->
                  <div class="flex flex-col gap-4 p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-desktop text-green-500"></i>
                      <span class="font-medium text-surface-900 dark:text-white">橫式 (Landscape)</span>
                    </div>
                    <FileUpload mode="basic" accept="image/jpeg, image/png" :maxFileSize="5000000" chooseLabel="上傳橫式圖片" class="w-full" />
                    <small class="text-red-500 font-medium">尺寸限定 1280x720，格式 jpg/png</small>
                    <div class="mx-auto w-36 h-20 bg-surface-900 rounded-xl border-4 border-surface-600 flex items-center justify-center">
                      <i class="pi pi-image text-xl text-surface-500"></i>
                    </div>
                  </div>
                </div>

                <!-- Shared Settings -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                    <span class="text-surface-700 dark:text-surface-300">顯示進度條</span>
                    <InputSwitch v-model="loadingSettings.showProgress" />
                  </div>
                  <div class="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                    <span class="text-surface-700 dark:text-surface-300">顯示 Logo</span>
                    <InputSwitch v-model="loadingSettings.showLogo" />
                  </div>
                </div>

                <div class="flex justify-end pt-2 border-t border-surface-200 dark:border-surface-700">
                  <Button label="儲存啟動頁設定" icon="pi pi-check" @click="saveLoadingSettings" />
                </div>
              </div>
            </template>
          </Card>

          <!-- Lobby Background Card -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-image text-green-500"></i>
                大廳底圖
              </div>
            </template>
            <template #content>
              <div class="space-y-6">
                <!-- Dual Orientation Upload -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Portrait -->
                  <div class="flex flex-col gap-4 p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-mobile text-blue-500"></i>
                      <span class="font-medium text-surface-900 dark:text-white">直式 (Portrait)</span>
                    </div>
                    <FileUpload mode="basic" accept="image/jpeg, image/png" :maxFileSize="5000000" chooseLabel="上傳直式底圖" class="w-full" />
                    <small class="text-red-500 font-medium">尺寸限定 720x1280，格式 jpg/png</small>
                    <div class="mx-auto w-20 h-36 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <span class="text-white text-xs">直式</span>
                    </div>
                  </div>

                  <!-- Landscape -->
                  <div class="flex flex-col gap-4 p-4 bg-surface-100 dark:bg-surface-700 rounded-lg">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-desktop text-green-500"></i>
                      <span class="font-medium text-surface-900 dark:text-white">橫式 (Landscape)</span>
                    </div>
                    <FileUpload mode="basic" accept="image/jpeg, image/png" :maxFileSize="5000000" chooseLabel="上傳橫式底圖" class="w-full" />
                    <small class="text-red-500 font-medium">尺寸限定 1280x720，格式 jpg/png</small>
                    <div class="mx-auto w-36 h-20 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <span class="text-white text-xs">橫式</span>
                    </div>
                  </div>
                </div>

                <!-- Style Selection -->
                <div class="flex flex-col gap-2 max-w-xs">
                  <label class="font-medium text-surface-700 dark:text-surface-300">顯示模式</label>
                  <Select v-model="lobbySettings.style" :options="styleOptions" optionLabel="label" optionValue="value" />
                </div>

                <div class="flex justify-end pt-2 border-t border-surface-200 dark:border-surface-700">
                  <Button label="儲存底圖設定" icon="pi pi-check" @click="saveLobbySettings" />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>

      <!-- Tab 2: Promotion Zone (NEW) -->
      <TabPanel value="1" header="推廣專區">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Slot -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-arrow-left text-orange-500"></i>
                左側推廣位
              </div>
            </template>
            <template #content>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">推廣圖示</label>
                  <FileUpload mode="basic" accept="image/png" :maxFileSize="500000" chooseLabel="上傳圖示" class="w-full" />
                  <small class="text-surface-500">建議尺寸 100x100 png</small>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">連結目標</label>
                  <Select v-model="leftPromo.target" :options="linkTargetOptions" optionLabel="label" optionValue="value" />
                </div>
                <div v-if="leftPromo.target === 'custom'" class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">自定義連結</label>
                  <InputText v-model="leftPromo.customUrl" placeholder="https://..." />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">動效設定</label>
                  <Select v-model="leftPromo.animation" :options="animationOptions" optionLabel="label" optionValue="value" />
                </div>
                <div class="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                  <span class="text-surface-700 dark:text-surface-300">啟用狀態</span>
                  <InputSwitch v-model="leftPromo.enabled" />
                </div>
                <div class="flex justify-end pt-2 border-t border-surface-200 dark:border-surface-700">
                  <Button label="儲存左側設定" icon="pi pi-check" size="small" @click="saveLeftPromo" />
                </div>
              </div>
            </template>
          </Card>

          <!-- Right Slot -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-arrow-right text-blue-500"></i>
                右側推廣位
              </div>
            </template>
            <template #content>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">推廣圖示</label>
                  <FileUpload mode="basic" accept="image/png" :maxFileSize="500000" chooseLabel="上傳圖示" class="w-full" />
                  <small class="text-surface-500">建議尺寸 100x100 png</small>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">連結目標</label>
                  <Select v-model="rightPromo.target" :options="linkTargetOptions" optionLabel="label" optionValue="value" />
                </div>
                <div v-if="rightPromo.target === 'custom'" class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">自定義連結</label>
                  <InputText v-model="rightPromo.customUrl" placeholder="https://..." />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">動效設定</label>
                  <Select v-model="rightPromo.animation" :options="animationOptions" optionLabel="label" optionValue="value" />
                </div>
                <div class="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                  <span class="text-surface-700 dark:text-surface-300">啟用狀態</span>
                  <InputSwitch v-model="rightPromo.enabled" />
                </div>
                <div class="flex justify-end pt-2 border-t border-surface-200 dark:border-surface-700">
                  <Button label="儲存右側設定" icon="pi pi-check" size="small" @click="saveRightPromo" />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>

      <!-- Tab 3: SEO -->
      <TabPanel value="2" header="SEO 設定">
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 max-w-2xl">
          <template #title>
            <div class="flex items-center gap-2 text-surface-900 dark:text-white">
              <i class="pi pi-search text-blue-500"></i>
              PWA / 下載頁優化
            </div>
          </template>
          <template #content>
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-2">
                <label class="font-medium text-surface-700 dark:text-surface-300">Meta Title</label>
                <InputText v-model="seoSettings.title" placeholder="YOTA Casino - 最佳娛樂平台" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-medium text-surface-700 dark:text-surface-300">Meta Keywords</label>
                <Chips v-model="seoSettings.keywords" placeholder="輸入後按 Enter" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-medium text-surface-700 dark:text-surface-300">Meta Description</label>
                <Textarea v-model="seoSettings.description" rows="3" placeholder="描述您的網站..." />
              </div>
              <div class="flex flex-col gap-2">
                <label class="font-medium text-surface-700 dark:text-surface-300">社群分享圖 (OG Image)</label>
                <FileUpload mode="basic" accept="image/*" :maxFileSize="2000000" chooseLabel="上傳圖片" class="w-full" />
                <small class="text-surface-500">建議尺寸：1200 x 630 px</small>
              </div>
              <div class="flex justify-end pt-4 border-t border-surface-200 dark:border-surface-700">
                <Button label="儲存 SEO 設定" icon="pi pi-check" @click="saveSeoSettings" />
              </div>
            </div>
          </template>
        </Card>
      </TabPanel>

      <!-- Tab 4: Marketing Reserved -->
      <TabPanel value="3" header="行銷預留區">
        <div class="flex flex-col items-center justify-center py-16 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-lg">
          <div class="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mb-6">
            <i class="pi pi-lightbulb text-4xl text-yellow-500"></i>
          </div>
          <p class="text-xl font-medium text-surface-700 dark:text-surface-300 mb-2">行銷功能模組預留位</p>
          <Tag value="Coming Soon" severity="warn" />
          <p class="text-sm text-surface-500 mt-4 text-center max-w-md">
            此區塊預留給未來的行銷功能擴充，例如：限時活動入口、特殊節日主題、VIP 專屬內容等。
          </p>
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
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import Tag from 'primevue/tag'
import Chips from 'primevue/chips'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Style Options
const styleOptions = ref([
  { label: '滿版', value: 'cover' },
  { label: '重複', value: 'repeat' },
  { label: '固定', value: 'fixed' }
])

// Link Target Options
const linkTargetOptions = ref([
  { label: '活動頁', value: 'promo' },
  { label: '儲值頁', value: 'deposit' },
  { label: '信箱', value: 'inbox' },
  { label: '自定義連結', value: 'custom' }
])

// Animation Options
const animationOptions = ref([
  { label: '無', value: 'none' },
  { label: '呼吸燈', value: 'pulse' },
  { label: '搖晃', value: 'shake' },
  { label: '彈跳', value: 'bounce' }
])

// Loading Page Settings
const loadingSettings = ref({
  showProgress: true,
  showLogo: true
})

// Lobby Settings
const lobbySettings = ref({
  style: 'cover'
})

// Left Promo Settings
const leftPromo = ref({
  target: 'promo',
  customUrl: '',
  animation: 'pulse',
  enabled: true
})

// Right Promo Settings
const rightPromo = ref({
  target: 'deposit',
  customUrl: '',
  animation: 'bounce',
  enabled: true
})

// SEO Settings
const seoSettings = ref({
  title: 'YOTA Casino - 最佳娛樂平台',
  keywords: ['線上娛樂', '老虎機', '真人百家樂', 'YOTA'],
  description: 'YOTA Casino 提供最豐富的線上娛樂遊戲，包含老虎機、真人視訊、體育博彩等，立即加入享受專屬優惠！'
})

// Save Handlers
const saveLoadingSettings = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '啟動頁設定已更新 (直式+橫式)', life: 3000 })
}

const saveLobbySettings = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '大廳底圖設定已更新 (直式+橫式)', life: 3000 })
}

const saveLeftPromo = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '左側推廣位設定已更新', life: 3000 })
}

const saveRightPromo = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '右側推廣位設定已更新', life: 3000 })
}

const saveSeoSettings = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: 'SEO 設定已更新', life: 3000 })
}
</script>
