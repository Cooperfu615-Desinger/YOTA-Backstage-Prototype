<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-globe text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">官網管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">首圖配置</span>
    </div>

    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-image text-purple-500"></i>
      首圖配置 (Hero Configuration)
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">目前使用中</p>
              <p class="text-lg font-bold text-surface-900 dark:text-white">{{ currentHero?.themeName || '無' }}</p>
              <Tag v-if="currentHero" value="上架中" severity="success" class="mt-2" />
            </div>
            <div class="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-image text-purple-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">已配置主題數</p>
              <p class="text-3xl font-bold text-blue-500">{{ heroes.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-th-large text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">即將上架</p>
              <p class="text-lg font-bold text-orange-500">{{ upcomingCount }} 個主題</p>
              <p class="text-sm text-surface-500 mt-1">等待排程啟動</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-clock text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Hero List -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-list text-purple-500"></i>
            主題列表
          </div>
          <Button label="新增主題" icon="pi pi-plus" @click="openDialog(null)" />
        </div>
      </template>
      <template #content>
        <div class="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <i class="pi pi-info-circle"></i>
            <span class="text-sm">排程邏輯：當排程時間到達時，系統將自動切換為該主題。若無排程則需手動切換狀態。</span>
          </div>
        </div>

        <DataTable :value="heroes" stripedRows>
          <Column header="預覽" style="min-width: 150px">
            <template #body="slotProps">
              <div class="flex gap-2">
                <div class="w-16 h-10 rounded flex items-center justify-center text-xs text-white" :style="{ background: slotProps.data.bgColor }">
                  PC
                </div>
                <div class="w-8 h-10 rounded flex items-center justify-center text-xs text-white" :style="{ background: slotProps.data.bgColor }">
                  M
                </div>
              </div>
            </template>
          </Column>
          <Column field="themeName" header="主題名稱" sortable style="min-width: 180px">
            <template #body="slotProps">
              <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.themeName }}</span>
            </template>
          </Column>
          <Column header="標題文案" style="min-width: 200px">
            <template #body="slotProps">
              <div>
                <p class="text-surface-900 dark:text-white font-medium">{{ slotProps.data.mainTitle }}</p>
                <p class="text-sm text-surface-500">{{ slotProps.data.subTitle }}</p>
              </div>
            </template>
          </Column>
          <Column header="上架排程" style="min-width: 220px">
            <template #body="slotProps">
              <span v-if="slotProps.data.startDate" class="text-sm font-mono text-surface-700 dark:text-surface-300">
                {{ slotProps.data.startDate }} ~ {{ slotProps.data.endDate }}
              </span>
              <Tag v-else value="手動控制" severity="secondary" />
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
                <Button icon="pi pi-pencil" severity="info" text size="small" @click="openDialog(slotProps.data)" />
                <Button icon="pi pi-trash" severity="danger" text size="small" @click="handleDelete(slotProps.data)" />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Editor Dialog -->
    <Dialog v-model:visible="dialogVisible" header="編輯首圖主題" modal :style="{ width: '800px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">主題名稱 <span class="text-red-500">*</span></label>
          <InputText v-model="form.themeName" placeholder="如: 新春賀歲版" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">PC 版大圖</label>
            <FileUpload mode="basic" accept="image/*" :maxFileSize="10000000" chooseLabel="上傳圖片" class="w-full" />
            <small class="text-surface-500">建議尺寸: 1920 x 1080</small>
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">Mobile 版大圖</label>
            <FileUpload mode="basic" accept="image/*" :maxFileSize="10000000" chooseLabel="上傳圖片" class="w-full" />
            <small class="text-surface-500">建議尺寸: 750 x 1334</small>
          </div>
        </div>

        <div class="border-t border-surface-200 dark:border-surface-700 pt-4">
          <p class="font-medium text-surface-700 dark:text-surface-300 mb-3">文案設定 (覆蓋在圖上)</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-500">主標題</label>
              <InputText v-model="form.mainTitle" placeholder="例: 新春大獎等你來拿！" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-500">副標題</label>
              <InputText v-model="form.subTitle" placeholder="例: 首存加碼 200%" />
            </div>
          </div>
        </div>

        <div class="border-t border-surface-200 dark:border-surface-700 pt-4">
          <p class="font-medium text-surface-700 dark:text-surface-300 mb-3">排程設定</p>
          <DatePicker v-model="form.schedule" selectionMode="range" showTime hourFormat="24" placeholder="選擇上架時間範圍 (留空則手動控制)" class="w-full" />
          <small class="text-surface-500">若不設定排程，則需手動切換狀態</small>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="dialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveHero" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import FileUpload from 'primevue/fileupload'
import DatePicker from 'primevue/datepicker'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

interface Hero {
  id: number
  themeName: string
  mainTitle: string
  subTitle: string
  bgColor: string
  startDate: string | null
  endDate: string | null
  active: boolean
}

const heroes = ref<Hero[]>([
  { id: 1, themeName: '新春賀歲版', mainTitle: '🧧 紅包雨來啦！', subTitle: '新春首存加碼 200%', bgColor: 'linear-gradient(135deg, #dc2626, #f97316)', startDate: '2026-01-20 00:00', endDate: '2026-02-05 23:59', active: true },
  { id: 2, themeName: '情人節特別版', mainTitle: '❤️ 愛的甜蜜回饋', subTitle: '雙人同遊享優惠', bgColor: 'linear-gradient(135deg, #ec4899, #f43f5e)', startDate: '2026-02-10 00:00', endDate: '2026-02-15 23:59', active: false },
  { id: 3, themeName: '週年慶活動', mainTitle: '🎉 感謝一路相伴', subTitle: '免費領取週年禮包', bgColor: 'linear-gradient(135deg, #8b5cf6, #6366f1)', startDate: null, endDate: null, active: false },
  { id: 4, themeName: '夏日狂歡', mainTitle: '☀️ 夏日加碼送', subTitle: '消暑禮金天天領', bgColor: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', startDate: null, endDate: null, active: false },
])

const currentHero = computed(() => heroes.value.find(h => h.active))
const upcomingCount = computed(() => heroes.value.filter(h => h.startDate && !h.active).length)

const dialogVisible = ref(false)
const editingHero = ref<Hero | null>(null)

const form = ref({
  themeName: '',
  mainTitle: '',
  subTitle: '',
  schedule: null as Date[] | null
})

const openDialog = (hero: Hero | null) => {
  editingHero.value = hero
  if (hero) {
    form.value = {
      themeName: hero.themeName,
      mainTitle: hero.mainTitle,
      subTitle: hero.subTitle,
      schedule: null
    }
  } else {
    form.value = { themeName: '', mainTitle: '', subTitle: '', schedule: null }
  }
  dialogVisible.value = true
}

const saveHero = () => {
  if (!form.value.themeName) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫主題名稱', life: 3000 })
    return
  }
  const action = editingHero.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `主題「${form.value.themeName}」已${action}`, life: 3000 })
  dialogVisible.value = false
}

const handleStatusChange = (hero: Hero) => {
  if (hero.active) {
    heroes.value.forEach(h => {
      if (h.id !== hero.id) h.active = false
    })
    toast.add({ severity: 'success', summary: '主題啟用', detail: `「${hero.themeName}」已設為目前首圖`, life: 3000 })
  }
}

const handleDelete = (hero: Hero) => {
  toast.add({ severity: 'warn', summary: '刪除', detail: `「${hero.themeName}」已刪除`, life: 2000 })
}
</script>
