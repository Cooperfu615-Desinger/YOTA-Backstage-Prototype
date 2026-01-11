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

    <!-- TabView -->
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
                    <small class="text-red-500">尺寸限定 720x1280，格式 jpg/png</small>
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
                    <small class="text-red-500">尺寸限定 1280x720，格式 jpg/png</small>
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
                    <small class="text-red-500">尺寸限定 720x1280，格式 jpg/png</small>
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
                    <small class="text-red-500">尺寸限定 1280x720，格式 jpg/png</small>
                    <div class="mx-auto w-36 h-20 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                      <span class="text-white text-xs">橫式</span>
                    </div>
                  </div>
                </div>

                <!-- Style Selection -->
                <div class="flex flex-col gap-2 max-w-xs">
                  <label class="font-medium text-surface-700 dark:text-surface-300">顯示樣式</label>
                  <Select v-model="lobbySettings.style" :options="styleOptions" optionLabel="label" optionValue="value" />
                </div>

                <div class="flex justify-end pt-2 border-t border-surface-200 dark:border-surface-700">
                  <Button label="儲存底圖設定" icon="pi pi-check" @click="saveLobbySettings" />
                </div>
              </div>
            </template>
          </Card>

          <!-- Coming Soon -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-sparkles text-yellow-500"></i>
                行銷版位
              </div>
            </template>
            <template #content>
              <div class="flex flex-col items-center justify-center py-12">
                <div class="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
                  <i class="pi pi-clock text-3xl text-yellow-500"></i>
                </div>
                <p class="text-lg font-medium text-surface-700 dark:text-surface-300 mb-2">新功能預留區</p>
                <Tag value="Coming Soon" severity="warn" />
                <p class="text-sm text-surface-500 mt-4 text-center">預留空間供未來行銷活動版位使用</p>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>

      <!-- Tab 2: Game Configuration -->
      <TabPanel value="1" header="遊戲配置">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Featured Games PickList -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 lg:col-span-2">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-star text-yellow-500"></i>
                特色遊戲配置
                <span class="text-sm text-surface-500 font-normal ml-2">設定大廳大圖示遊戲，可拖曳排序</span>
              </div>
            </template>
            <template #content>
              <PickList v-model="featuredGames" dataKey="id" breakpoint="1024px">
                <template #sourceheader>所有遊戲</template>
                <template #targetheader>精選區</template>
                <template #item="slotProps">
                  <div class="flex items-center gap-3 p-2">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold" :style="{ background: slotProps.item.color }">
                      {{ slotProps.item.name.charAt(0) }}
                    </div>
                    <div>
                      <p class="font-medium text-surface-900 dark:text-white">{{ slotProps.item.name }}</p>
                      <p class="text-xs text-surface-500">{{ slotProps.item.provider }}</p>
                    </div>
                  </div>
                </template>
              </PickList>
              <div class="flex justify-end pt-4">
                <Button label="儲存精選遊戲" icon="pi pi-check" @click="saveFeaturedGames" />
              </div>
            </template>
          </Card>

          <!-- Tag Sorting OrderList -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 lg:col-span-2">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-sort-alt text-purple-500"></i>
                遊戲標籤排序
                <span class="text-sm text-surface-500 font-normal ml-2">決定 APP 上方導航條的順序</span>
              </div>
            </template>
            <template #content>
              <div class="max-w-md">
                <OrderList v-model="gameTags" dataKey="id">
                  <template #item="slotProps">
                    <div class="flex items-center gap-3 p-2">
                      <i :class="['pi', slotProps.item.icon]" class="text-purple-500"></i>
                      <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.item.name }}</span>
                      <Tag :value="slotProps.item.count + ' 款'" size="small" severity="secondary" />
                    </div>
                  </template>
                </OrderList>
              </div>
              <div class="flex justify-end pt-4">
                <Button label="儲存排序" icon="pi pi-check" @click="saveTagOrder" />
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
import PickList from 'primevue/picklist'
import OrderList from 'primevue/orderlist'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Style Options
const styleOptions = ref([
  { label: '滿版', value: 'cover' },
  { label: '重複拼貼', value: 'repeat' },
  { label: '固定', value: 'fixed' }
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

// Featured Games (PickList)
interface Game {
  id: number
  name: string
  provider: string
  color: string
}

const featuredGames = ref<Game[][]>([
  // Source (All Games)
  [
    { id: 1, name: 'Gates of Olympus', provider: 'PG Soft', color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { id: 2, name: 'Sweet Bonanza', provider: 'Pragmatic Play', color: 'linear-gradient(135deg, #ef4444, #f97316)' },
    { id: 3, name: 'Mahjong Ways', provider: 'PG Soft', color: 'linear-gradient(135deg, #10b981, #14b8a6)' },
    { id: 4, name: 'Dragon Empire', provider: 'JDB', color: 'linear-gradient(135deg, #f59e0b, #eab308)' },
    { id: 5, name: 'Super Ace', provider: 'JILI', color: 'linear-gradient(135deg, #ec4899, #f43f5e)' }
  ],
  // Target (Featured)
  [
    { id: 6, name: 'Fortune Tiger', provider: 'PG Soft', color: 'linear-gradient(135deg, #f97316, #fb923c)' },
    { id: 7, name: 'Crazy Time', provider: 'Evolution', color: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }
  ]
])

// Game Tags (OrderList)
interface GameTag {
  id: number
  name: string
  icon: string
  count: number
}

const gameTags = ref<GameTag[]>([
  { id: 1, name: '熱門遊戲', icon: 'pi-fire', count: 50 },
  { id: 2, name: '電子老虎機', icon: 'pi-desktop', count: 856 },
  { id: 3, name: '真人視訊', icon: 'pi-video', count: 342 },
  { id: 4, name: '體育博彩', icon: 'pi-trophy', count: 0 },
  { id: 5, name: '捕魚遊戲', icon: 'pi-sun', count: 156 },
  { id: 6, name: '新遊戲', icon: 'pi-sparkles', count: 28 }
])

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

const saveFeaturedGames = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: `已設定 ${featuredGames.value[1]?.length ?? 0} 款精選遊戲`, life: 3000 })
}

const saveTagOrder = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '遊戲標籤排序已更新', life: 3000 })
}

const saveSeoSettings = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: 'SEO 設定已更新', life: 3000 })
}
</script>
