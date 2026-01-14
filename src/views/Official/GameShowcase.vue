<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-globe text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">官網管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">遊戲介紹</span>
    </div>

    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-play text-orange-500"></i>
      遊戲介紹 (Game Showcase)
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">展示中遊戲</p>
              <p class="text-3xl font-bold text-green-500">{{ activeGames }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-check-circle text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">遊戲庫總數</p>
              <p class="text-3xl font-bold text-blue-500">{{ gameLibrary.length }}</p>
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
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">本週點擊</p>
              <p class="text-3xl font-bold text-orange-500">12.8K</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-mouse text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Game Showcase List -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-list text-orange-500"></i>
            主打遊戲列表
          </div>
          <Button label="新增遊戲" icon="pi pi-plus" @click="openDialog(null)" />
        </div>
      </template>
      <template #content>
        <div class="mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <div class="flex items-center gap-2 text-orange-600 dark:text-orange-400">
            <i class="pi pi-info-circle"></i>
            <span class="text-sm">行銷包裝：可為遊戲自訂吸睛名稱與精美封面，提升官網點擊率。</span>
          </div>
        </div>

        <DataTable :value="showcaseGames" stripedRows>
          <Column header="封面" style="min-width: 100px">
            <template #body="slotProps">
              <div class="w-16 h-16 rounded-lg flex items-center justify-center text-white" :style="{ background: slotProps.data.bgColor }">
                <i class="pi pi-play text-xl"></i>
              </div>
            </template>
          </Column>
          <Column field="marketingName" header="行銷名稱" sortable style="min-width: 200px">
            <template #body="slotProps">
              <span class="font-bold text-surface-900 dark:text-white">{{ slotProps.data.marketingName }}</span>
            </template>
          </Column>
          <Column field="originalName" header="原始名稱" style="min-width: 150px">
            <template #body="slotProps">
              <span class="text-surface-500 dark:text-surface-400">{{ slotProps.data.originalName }}</span>
            </template>
          </Column>
          <Column field="description" header="特色描述" style="min-width: 250px">
            <template #body="slotProps">
              <span class="text-sm text-surface-600 dark:text-surface-300 line-clamp-2">{{ slotProps.data.description }}</span>
            </template>
          </Column>
          <Column field="active" header="狀態" style="min-width: 80px">
            <template #body="slotProps">
              <InputSwitch v-model="slotProps.data.active" />
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
    <Dialog v-model:visible="dialogVisible" header="編輯主打遊戲" modal :style="{ width: '700px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">選擇遊戲 <span class="text-red-500">*</span></label>
          <Select v-model="form.gameId" :options="gameLibrary" optionLabel="name" optionValue="id" placeholder="從遊戲庫選擇" filter />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">行銷名稱 <span class="text-red-500">*</span></label>
          <InputText v-model="form.marketingName" placeholder="如: 🔥雷神-爆分版" />
          <small class="text-surface-500">可使用 Emoji 增加視覺效果</small>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">封面圖片</label>
          <FileUpload mode="basic" accept="image/*" :maxFileSize="5000000" chooseLabel="上傳封面" class="w-full" />
          <small class="text-surface-500">建議尺寸: 400 x 400，正方形</small>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">特色描述</label>
          <Textarea v-model="form.description" rows="4" placeholder="描述遊戲特色、高賠率機制等賣點..." />
        </div>

        <div class="flex items-center gap-3 p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
          <InputSwitch v-model="form.active" />
          <label class="text-surface-700 dark:text-surface-300">立即展示在官網</label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="dialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveGame" />
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
import InputText from 'primevue/inputtext'
import InputSwitch from 'primevue/inputswitch'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

interface ShowcaseGame {
  id: number
  gameId: number
  marketingName: string
  originalName: string
  description: string
  bgColor: string
  active: boolean
}

const showcaseGames = ref<ShowcaseGame[]>([
  { id: 1, gameId: 101, marketingName: '🔥 雷神-爆分版', originalName: 'Thor: Thunder Strike', description: '北歐神話主題，最高可達 5000x 爆擊！免費旋轉無上限累積。', bgColor: 'linear-gradient(135deg, #3b82f6, #6366f1)', active: true },
  { id: 2, gameId: 102, marketingName: '💎 鑽石奪寶', originalName: 'Diamond Rush', description: '經典寶石消除玩法，連線倍率機制，小額投注也能大贏。', bgColor: 'linear-gradient(135deg, #ec4899, #f43f5e)', active: true },
  { id: 3, gameId: 103, marketingName: '🐉 東方神龍', originalName: 'Dragon Fortune', description: '亞洲風格招財遊戲，金龍加碼回饋，適合新手入門。', bgColor: 'linear-gradient(135deg, #f59e0b, #dc2626)', active: true },
  { id: 4, gameId: 104, marketingName: '🎰 幸運777', originalName: 'Lucky Sevens', description: '復古風格經典老虎機，規則簡單易上手。', bgColor: 'linear-gradient(135deg, #22c55e, #10b981)', active: false },
])

const gameLibrary = ref([
  { id: 101, name: 'Thor: Thunder Strike' },
  { id: 102, name: 'Diamond Rush' },
  { id: 103, name: 'Dragon Fortune' },
  { id: 104, name: 'Lucky Sevens' },
  { id: 105, name: 'Mega Moolah' },
  { id: 106, name: 'Book of Ra' },
  { id: 107, name: 'Gonzo Quest' },
  { id: 108, name: 'Starburst' },
])

const activeGames = computed(() => showcaseGames.value.filter(g => g.active).length)

const dialogVisible = ref(false)
const editingGame = ref<ShowcaseGame | null>(null)

const form = ref({
  gameId: null as number | null,
  marketingName: '',
  description: '',
  active: true
})

const openDialog = (game: ShowcaseGame | null) => {
  editingGame.value = game
  if (game) {
    form.value = {
      gameId: game.gameId,
      marketingName: game.marketingName,
      description: game.description,
      active: game.active
    }
  } else {
    form.value = { gameId: null, marketingName: '', description: '', active: true }
  }
  dialogVisible.value = true
}

const saveGame = () => {
  if (!form.value.gameId || !form.value.marketingName) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請選擇遊戲並填寫行銷名稱', life: 3000 })
    return
  }
  const action = editingGame.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `「${form.value.marketingName}」已${action}`, life: 3000 })
  dialogVisible.value = false
}

const handleDelete = (game: ShowcaseGame) => {
  toast.add({ severity: 'warn', summary: '刪除', detail: `「${game.marketingName}」已刪除`, life: 2000 })
}
</script>
