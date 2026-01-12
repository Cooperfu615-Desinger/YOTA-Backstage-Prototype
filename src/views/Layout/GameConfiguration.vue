<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-th-large text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">版面設定</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">遊戲配置</span>
    </div>

    <!-- Header -->
    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-th-large text-purple-500"></i>
      APP 遊戲配置
    </div>

    <!-- TabView (3 Tabs) -->
    <TabView>
      <!-- Tab 1: Display & Density -->
      <TabPanel value="0" header="顯示與密度">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left: Settings -->
          <div class="space-y-6">
            <!-- Portrait Layout -->
            <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
              <template #title>
                <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                  <i class="pi pi-mobile text-blue-500"></i>
                  直式佈局 (Portrait)
                </div>
              </template>
              <template #content>
                <div class="flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-surface-700 dark:text-surface-300">每行個數</label>
                    <SelectButton v-model="portraitSettings.columns" :options="portraitColumnOptions" optionLabel="label" optionValue="value" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-surface-700 dark:text-surface-300">卡片風格</label>
                    <SelectButton v-model="portraitSettings.style" :options="cardStyleOptions" optionLabel="label" optionValue="value" />
                  </div>
                </div>
              </template>
            </Card>

            <!-- Landscape Layout -->
            <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
              <template #title>
                <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                  <i class="pi pi-desktop text-green-500"></i>
                  橫式佈局 (Landscape)
                </div>
              </template>
              <template #content>
                <div class="flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-surface-700 dark:text-surface-300">每行個數</label>
                    <SelectButton v-model="landscapeSettings.columns" :options="landscapeColumnOptions" optionLabel="label" optionValue="value" />
                  </div>
                  <div class="flex items-center justify-between p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
                    <span class="text-surface-700 dark:text-surface-300">側邊欄預設收合</span>
                    <InputSwitch v-model="landscapeSettings.sidebarCollapsed" />
                  </div>
                </div>
              </template>
            </Card>

            <!-- Tag Styles -->
            <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
              <template #title>
                <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                  <i class="pi pi-tag text-orange-500"></i>
                  標籤視覺
                </div>
              </template>
              <template #content>
                <div class="flex flex-col gap-4">
                  <div class="flex flex-col gap-2">
                    <label class="font-medium text-surface-700 dark:text-surface-300">形狀</label>
                    <SelectButton v-model="tagSettings.shape" :options="tagShapeOptions" optionLabel="label" optionValue="value" />
                  </div>
                  <div class="grid grid-cols-3 gap-4">
                    <div class="flex flex-col gap-2">
                      <label class="font-medium text-surface-700 dark:text-surface-300">Hot</label>
                      <ColorPicker v-model="tagSettings.hotColor" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="font-medium text-surface-700 dark:text-surface-300">New</label>
                      <ColorPicker v-model="tagSettings.newColor" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="font-medium text-surface-700 dark:text-surface-300">Rec</label>
                      <ColorPicker v-model="tagSettings.recColor" />
                    </div>
                  </div>
                </div>
              </template>
            </Card>

            <Button label="儲存顯示設定" icon="pi pi-check" @click="saveDisplaySettings" class="w-full" />
          </div>

          <!-- Right: Live Preview -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-eye text-purple-500"></i>
                即時預覽
              </div>
            </template>
            <template #content>
              <div class="flex flex-col items-center">
                <div class="w-48 h-80 bg-surface-900 rounded-3xl border-4 border-surface-600 p-2 overflow-hidden">
                  <div class="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-2">
                    <!-- Nav Tabs Preview -->
                    <div class="flex gap-1 mb-2">
                      <div class="px-2 py-1 bg-white/20 rounded text-white text-xs">熱門</div>
                      <div class="px-2 py-1 bg-white/10 rounded text-white/70 text-xs">電子</div>
                      <div class="px-2 py-1 bg-white/10 rounded text-white/70 text-xs">真人</div>
                    </div>
                    <!-- Game Grid Preview -->
                    <div class="grid gap-1" :class="previewGridClass">
                      <div v-for="i in previewGameCount" :key="i" class="relative">
                        <div class="aspect-square rounded-lg flex items-center justify-center text-white text-xs font-bold" :style="{ background: getGameColor(i) }">
                          G{{ i }}
                        </div>
                        <div v-if="i <= 3" class="absolute -top-1 -right-1 text-white text-xs px-1 rounded" :style="getTagStyle(i)">
                          {{ getTagText(i) }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="text-sm text-surface-500 mt-4">每行 {{ portraitSettings.columns }} 個 | {{ portraitSettings.style === 'minimal' ? '極簡' : '詳細' }} 風格</p>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>

      <!-- Tab 2: Category Navigation -->
      <TabPanel value="1" header="分類導航">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Icon Management -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 lg:col-span-2">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-image text-blue-500"></i>
                圖示管理
              </div>
            </template>
            <template #content>
              <DataTable :value="categories" stripedRows>
                <Column field="name" header="分類名稱" style="min-width: 120px">
                  <template #body="slotProps">
                    <div class="flex items-center gap-2">
                      <i :class="['pi', slotProps.data.icon]" class="text-purple-500"></i>
                      <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.name }}</span>
                    </div>
                  </template>
                </Column>
                <Column header="未選中圖示" style="min-width: 180px">
                  <template #body>
                    <FileUpload mode="basic" accept="image/png" :maxFileSize="100000" chooseLabel="上傳 (128x128)" class="w-full" />
                  </template>
                </Column>
                <Column header="選中圖示" style="min-width: 180px">
                  <template #body>
                    <FileUpload mode="basic" accept="image/png" :maxFileSize="100000" chooseLabel="上傳 (128x128)" class="w-full" />
                  </template>
                </Column>
                <Column header="背景色塊" style="min-width: 100px">
                  <template #body="slotProps">
                    <ColorPicker v-model="slotProps.data.bgColor" />
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>

          <!-- Navigation Order -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 lg:col-span-2">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-sort-alt text-green-500"></i>
                導航排序
                <span class="text-sm text-surface-500 font-normal ml-2">拖曳調整分類順序</span>
              </div>
            </template>
            <template #content>
              <div class="max-w-md">
                <OrderList v-model="categoryOrder" dataKey="id">
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
                <Button label="儲存排序" icon="pi pi-check" @click="saveCategoryOrder" />
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>

      <!-- Tab 3: Featured Content -->
      <TabPanel value="2" header="精選內容">
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <template #title>
            <div class="flex items-center gap-2 text-surface-900 dark:text-white">
              <i class="pi pi-star text-yellow-500"></i>
              APP 精選展示
              <span class="text-sm text-surface-500 font-normal ml-2">選擇要在首頁顯示的特色遊戲</span>
            </div>
          </template>
          <template #content>
            <PickList v-model="featuredGames" dataKey="id" breakpoint="1024px">
              <template #sourceheader>所有遊戲庫</template>
              <template #targetheader>APP 精選展示</template>
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
            <div class="flex justify-between items-center pt-4">
              <Button label="隨機補滿" icon="pi pi-sync" severity="secondary" @click="randomFill" />
              <Button label="儲存精選遊戲" icon="pi pi-check" @click="saveFeaturedGames" />
            </div>
          </template>
        </Card>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import InputSwitch from 'primevue/inputswitch'
import SelectButton from 'primevue/selectbutton'
import ColorPicker from 'primevue/colorpicker'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import FileUpload from 'primevue/fileupload'
import Tag from 'primevue/tag'
import OrderList from 'primevue/orderlist'
import PickList from 'primevue/picklist'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// ========================================
// Tab 1: Display & Density
// ========================================
const portraitColumnOptions = ref([
  { label: '2', value: 2 },
  { label: '3', value: 3 }
])

const landscapeColumnOptions = ref([
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 }
])

const cardStyleOptions = ref([
  { label: '極簡封面', value: 'minimal' },
  { label: '詳細資訊', value: 'detailed' }
])

const tagShapeOptions = ref([
  { label: 'Ribbon', value: 'ribbon' },
  { label: 'Badge', value: 'badge' },
  { label: 'Dot', value: 'dot' }
])

const portraitSettings = ref({
  columns: 3,
  style: 'minimal'
})

const landscapeSettings = ref({
  columns: 5,
  sidebarCollapsed: false
})

const tagSettings = ref({
  shape: 'badge',
  hotColor: 'ef4444',
  newColor: '22c55e',
  recColor: 'f97316'
})

// Preview Computed
const previewGridClass = computed(() => {
  return portraitSettings.value.columns === 2 ? 'grid-cols-2' : 'grid-cols-3'
})

const previewGameCount = computed(() => {
  return portraitSettings.value.columns === 2 ? 6 : 9
})

const getGameColor = (i: number) => {
  const colors = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#14b8a6', '#f97316']
  return colors[(i - 1) % colors.length]
}

const getTagStyle = (i: number) => {
  const colors = [tagSettings.value.hotColor, tagSettings.value.newColor, tagSettings.value.recColor]
  return { background: '#' + colors[i - 1] }
}

const getTagText = (i: number) => {
  return ['H', 'N', 'R'][i - 1]
}

const saveDisplaySettings = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '顯示設定已更新', life: 3000 })
}

// ========================================
// Tab 2: Category Navigation
// ========================================
interface Category {
  id: number
  name: string
  icon: string
  count: number
  bgColor: string
}

const categories = ref<Category[]>([
  { id: 1, name: '電子老虎機', icon: 'pi-desktop', count: 856, bgColor: '6366f1' },
  { id: 2, name: '真人視訊', icon: 'pi-video', count: 342, bgColor: 'ef4444' },
  { id: 3, name: '體育博彩', icon: 'pi-trophy', count: 0, bgColor: '22c55e' },
  { id: 4, name: '捕魚遊戲', icon: 'pi-sun', count: 156, bgColor: 'f59e0b' },
  { id: 5, name: '棋牌遊戲', icon: 'pi-heart', count: 78, bgColor: 'ec4899' }
])

const categoryOrder = ref([...categories.value])

const saveCategoryOrder = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '分類排序已更新', life: 3000 })
}

// ========================================
// Tab 3: Featured Content
// ========================================
interface Game {
  id: number
  name: string
  provider: string
  color: string
}

const featuredGames = ref<Game[][]>([
  // Source
  [
    { id: 1, name: 'Gates of Olympus', provider: 'PG Soft', color: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { id: 2, name: 'Sweet Bonanza', provider: 'Pragmatic', color: 'linear-gradient(135deg, #ef4444, #f97316)' },
    { id: 3, name: 'Mahjong Ways', provider: 'PG Soft', color: 'linear-gradient(135deg, #10b981, #14b8a6)' },
    { id: 4, name: 'Dragon Empire', provider: 'JDB', color: 'linear-gradient(135deg, #f59e0b, #eab308)' },
    { id: 5, name: 'Super Ace', provider: 'JILI', color: 'linear-gradient(135deg, #ec4899, #f43f5e)' },
    { id: 6, name: 'Wild West', provider: 'Pragmatic', color: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }
  ],
  // Target (Featured)
  [
    { id: 7, name: 'Fortune Tiger', provider: 'PG Soft', color: 'linear-gradient(135deg, #f97316, #fb923c)' },
    { id: 8, name: 'Crazy Time', provider: 'Evolution', color: 'linear-gradient(135deg, #8b5cf6, #a855f7)' }
  ]
])

const randomFill = () => {
  const target = featuredGames.value[1] ?? []
  const source = featuredGames.value[0] ?? []
  const needed = 8 - target.length
  if (needed > 0 && source.length > 0) {
    const toMove = source.slice(0, Math.min(needed, source.length))
    featuredGames.value[1] = [...target, ...toMove]
    featuredGames.value[0] = source.slice(toMove.length)
    toast.add({ severity: 'info', summary: '隨機補滿', detail: `已新增 ${toMove.length} 款遊戲`, life: 2000 })
  }
}

const saveFeaturedGames = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: `已設定 ${featuredGames.value[1]?.length ?? 0} 款精選遊戲`, life: 3000 })
}
</script>
