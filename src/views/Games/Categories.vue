<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-play text-purple-500 dark:text-purple-400"></i>
      <span class="text-surface-500 dark:text-surface-300">遊戲管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">分類管理</span>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Categories Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">分類總數</p>
              <p class="text-3xl font-bold text-surface-900 dark:text-white">{{ summaryData.totalCategories }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-blue-500">
                <i class="pi pi-sitemap"></i>
                <span>總節點數量</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-folder text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Root Categories Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">主選單項目</p>
              <p class="text-3xl font-bold text-green-500">{{ summaryData.rootCategories }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-green-500">
                <i class="pi pi-home"></i>
                <span>頂層分類數</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-th-large text-green-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Average Games Card -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">平均遊戲數</p>
              <p class="text-3xl font-bold text-orange-500">{{ summaryData.avgGamesPerCategory }}</p>
              <div class="flex items-center gap-1 mt-2 text-sm text-orange-500">
                <i class="pi pi-calculator"></i>
                <span>每分類平均</span>
              </div>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-chart-bar text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- TreeTable Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
            <i class="pi pi-sitemap text-purple-500"></i>
            分類結構
          </div>
        </div>
      </template>
      <template #content>
        <!-- Toolbar -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex gap-2">
            <Button label="展開全部" icon="pi pi-angle-double-down" severity="secondary" outlined size="small" @click="expandAll" />
            <Button label="摺疊全部" icon="pi pi-angle-double-up" severity="secondary" outlined size="small" @click="collapseAll" />
          </div>
          <Button label="新增主分類" icon="pi pi-plus" @click="handleAddRoot" />
        </div>

        <!-- TreeTable -->
        <TreeTable :value="categories" :expandedKeys="expandedKeys" class="w-full">
          <!-- Name Column -->
          <Column field="name" header="分類名稱" :expander="true" style="min-width: 250px">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i :class="['pi', slotProps.node.data.icon]" class="text-purple-500"></i>
                <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.node.data.name }}</span>
              </div>
            </template>
          </Column>

          <!-- Slug Column -->
          <Column field="slug" header="代碼" style="min-width: 150px">
            <template #body="slotProps">
              <Tag :value="slotProps.node.data.slug" severity="secondary" />
            </template>
          </Column>

          <!-- Game Count Column -->
          <Column field="gameCount" header="關聯遊戲數" style="min-width: 120px">
            <template #body="slotProps">
              <span class="font-mono text-blue-500">{{ slotProps.node.data.gameCount }}</span>
            </template>
          </Column>

          <!-- Sort Column -->
          <Column field="sort" header="排序權重" style="min-width: 120px">
            <template #body="slotProps">
              <InputNumber 
                v-model="slotProps.node.data.sort" 
                :min="0" 
                :max="999" 
                class="w-20" 
                size="small"
                @blur="handleSortChange(slotProps.node)" 
              />
            </template>
          </Column>

          <!-- Visible Column -->
          <Column field="visible" header="前台顯示" style="min-width: 100px">
            <template #body="slotProps">
              <InputSwitch 
                v-model="slotProps.node.data.visible" 
                @change="handleVisibilityChange(slotProps.node)" 
              />
            </template>
          </Column>

          <!-- Actions Column -->
          <Column header="操作" style="min-width: 200px">
            <template #body="slotProps">
              <div class="flex gap-1">
                <Button 
                  icon="pi pi-plus" 
                  label="子分類" 
                  severity="success" 
                  text 
                  size="small" 
                  @click="handleAddChild(slotProps.node)" 
                />
                <Button 
                  icon="pi pi-pencil" 
                  severity="info" 
                  text 
                  size="small" 
                  @click="handleEdit(slotProps.node)" 
                />
                <Button 
                  icon="pi pi-trash" 
                  severity="danger" 
                  text 
                  size="small" 
                  @click="handleDelete(slotProps.node)" 
                />
              </div>
            </template>
          </Column>
        </TreeTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Summary Data
const summaryData = ref({
  totalCategories: 18,
  rootCategories: 5,
  avgGamesPerCategory: 192
})

// Expanded Keys
const expandedKeys = ref<Record<string, boolean>>({
  '0': true,
  '1': true,
  '2': true
})

// TreeTable Data
interface TreeNode {
  key: string
  data: {
    name: string
    slug: string
    icon: string
    gameCount: number
    sort: number
    visible: boolean
  }
  children?: TreeNode[]
}

const categories = ref<TreeNode[]>([
  {
    key: '0',
    data: { name: '電子遊戲', slug: 'slots', icon: 'pi-desktop', gameCount: 856, sort: 1, visible: true },
    children: [
      { key: '0-0', data: { name: '熱門老虎機', slug: 'hot-slots', icon: 'pi-fire', gameCount: 245, sort: 1, visible: true } },
      { key: '0-1', data: { name: '累積彩池', slug: 'jackpot', icon: 'pi-bolt', gameCount: 128, sort: 2, visible: true } },
      { key: '0-2', data: { name: 'PG 電子', slug: 'pg-slots', icon: 'pi-star', gameCount: 186, sort: 3, visible: true } },
      { key: '0-3', data: { name: 'JDB 電子', slug: 'jdb-slots', icon: 'pi-sparkles', gameCount: 156, sort: 4, visible: true } },
      { key: '0-4', data: { name: '新遊戲', slug: 'new-slots', icon: 'pi-gift', gameCount: 68, sort: 5, visible: true } }
    ]
  },
  {
    key: '1',
    data: { name: '真人視訊', slug: 'live-casino', icon: 'pi-video', gameCount: 342, sort: 2, visible: true },
    children: [
      { key: '1-0', data: { name: '真人百家樂', slug: 'live-baccarat', icon: 'pi-table', gameCount: 125, sort: 1, visible: true } },
      { key: '1-1', data: { name: '真人輪盤', slug: 'live-roulette', icon: 'pi-circle', gameCount: 86, sort: 2, visible: true } },
      { key: '1-2', data: { name: '真人 21 點', slug: 'live-blackjack', icon: 'pi-stop', gameCount: 72, sort: 3, visible: true } }
    ]
  },
  {
    key: '2',
    data: { name: '體育博彩', slug: 'sports', icon: 'pi-trophy', gameCount: 0, sort: 3, visible: true },
    children: [
      { key: '2-0', data: { name: '足球', slug: 'football', icon: 'pi-flag', gameCount: 0, sort: 1, visible: true } },
      { key: '2-1', data: { name: '籃球', slug: 'basketball', icon: 'pi-star-fill', gameCount: 0, sort: 2, visible: true } }
    ]
  },
  {
    key: '3',
    data: { name: '捕魚遊戲', slug: 'fishing', icon: 'pi-wave-pulse', gameCount: 156, sort: 4, visible: true },
    children: [
      { key: '3-0', data: { name: 'JDB 捕魚', slug: 'jdb-fishing', icon: 'pi-bolt', gameCount: 86, sort: 1, visible: true } },
      { key: '3-1', data: { name: 'CQ9 捕魚', slug: 'cq9-fishing', icon: 'pi-sun', gameCount: 45, sort: 2, visible: true } }
    ]
  },
  {
    key: '4',
    data: { name: '彩票遊戲', slug: 'lottery', icon: 'pi-ticket', gameCount: 28, sort: 5, visible: false }
  }
])

// Actions
const expandAll = () => {
  const expanded: Record<string, boolean> = {}
  categories.value.forEach((node, i) => {
    expanded[String(i)] = true
    if (node.children) {
      node.children.forEach((_, j) => {
        expanded[`${i}-${j}`] = true
      })
    }
  })
  expandedKeys.value = expanded
  toast.add({ severity: 'info', summary: '已展開', detail: '已展開所有分類', life: 1500 })
}

const collapseAll = () => {
  expandedKeys.value = {}
  toast.add({ severity: 'info', summary: '已摺疊', detail: '已摺疊所有分類', life: 1500 })
}

const handleAddRoot = () => {
  toast.add({ severity: 'info', summary: '新增主分類', detail: '開啟新增主分類對話框...', life: 2000 })
}

const handleAddChild = (node: TreeNode) => {
  toast.add({ severity: 'success', summary: '新增子分類', detail: `在「${node.data.name}」下新增子分類...`, life: 2000 })
}

const handleEdit = (node: TreeNode) => {
  toast.add({ severity: 'info', summary: '編輯分類', detail: `編輯「${node.data.name}」設定...`, life: 2000 })
}

const handleDelete = (node: TreeNode) => {
  toast.add({ severity: 'warn', summary: '確認刪除', detail: `確定要刪除「${node.data.name}」嗎？`, life: 3000 })
}

const handleSortChange = (node: TreeNode) => {
  toast.add({ severity: 'success', summary: '排序更新', detail: `「${node.data.name}」排序已更新為 ${node.data.sort}`, life: 2000 })
}

const handleVisibilityChange = (node: TreeNode) => {
  const status = node.data.visible ? '顯示' : '隱藏'
  toast.add({ severity: 'success', summary: '顯示狀態', detail: `「${node.data.name}」已設為${status}`, life: 2000 })
}
</script>
