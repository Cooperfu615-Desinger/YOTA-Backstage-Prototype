<template>
  <div class="p-6 space-y-6">

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
          <Button label="新增主分類" icon="pi pi-plus" @click="openAddRoot" />
        </div>

        <!-- TreeTable -->
        <TreeTable :value="categories" :expandedKeys="expandedKeys" class="w-full">
          <!-- Name Column -->
          <Column field="name" header="分類名稱" :expander="true" style="min-width: 280px">
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

          <!-- Level Column -->
          <Column header="層級" style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="getLevelLabel(slotProps.node.key)" :severity="getLevelSeverity(slotProps.node.key)" />
            </template>
          </Column>

          <!-- Sort Column -->
          <Column field="sort" header="排序" style="min-width: 100px">
            <template #body="slotProps">
              <InputNumber v-model="slotProps.node.data.sort" :min="0" :max="999" class="w-16" size="small" @blur="handleSortChange(slotProps.node)" />
            </template>
          </Column>

          <!-- Visible Column -->
          <Column field="visible" header="狀態" style="min-width: 80px">
            <template #body="slotProps">
              <InputSwitch v-model="slotProps.node.data.visible" @change="handleVisibilityChange(slotProps.node)" />
            </template>
          </Column>

          <!-- Actions Column -->
          <Column header="操作" style="min-width: 180px">
            <template #body="slotProps">
              <div class="flex gap-1">
                <Button icon="pi pi-plus" severity="success" text size="small" v-tooltip="'新增子分類'" @click="openAddChild(slotProps.node)" />
                <Button icon="pi pi-pencil" severity="info" text size="small" v-tooltip="'編輯'" @click="openEdit(slotProps.node)" />
                <Button icon="pi pi-trash" severity="danger" text size="small" v-tooltip="'刪除'" @click="handleDelete(slotProps.node)" />
              </div>
            </template>
          </Column>
        </TreeTable>
      </template>
    </Card>

    <!-- Category Editor Dialog -->
    <Dialog v-model:visible="editorDialogVisible" :header="dialogTitle" modal :style="{ width: '500px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <!-- Parent Category -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">上層分類</label>
          <Select v-model="categoryForm.parentKey" :options="parentOptions" optionLabel="label" optionValue="value" placeholder="選擇上層 (無則為主分類)" showClear />
        </div>

        <!-- Category Name -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">分類名稱 <span class="text-red-500">*</span></label>
          <InputText v-model="categoryForm.name" placeholder="例：熱門老虎機" />
        </div>

        <!-- Slug -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">分類代碼 (Slug)</label>
          <InputText v-model="categoryForm.slug" placeholder="例：hot-slots" />
          <small class="text-surface-500">用於前台路由，建議使用小寫英文與連字號</small>
        </div>

        <!-- Icon -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">圖示 (PrimeIcons)</label>
          <div class="flex gap-2 items-center">
            <InputText v-model="categoryForm.icon" placeholder="例：pi-star" class="flex-1" />
            <div class="w-10 h-10 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center">
              <i :class="['pi', categoryForm.icon]" class="text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>

        <!-- Sort -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">排序權重</label>
          <InputNumber v-model="categoryForm.sort" :min="0" :max="999" />
        </div>

        <!-- Visibility -->
        <div class="flex items-center gap-3 pt-2 border-t border-surface-200 dark:border-surface-700">
          <InputSwitch v-model="categoryForm.visible" />
          <label class="font-medium text-surface-700 dark:text-surface-300">{{ categoryForm.visible ? '前台顯示' : '前台隱藏' }}</label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="editorDialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveCategory" />
        </div>
      </template>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:visible="deleteDialogVisible" header="確認刪除" modal :style="{ width: '400px' }">
      <div class="flex items-center gap-4 py-4">
        <i class="pi pi-exclamation-triangle text-4xl text-red-500"></i>
        <div>
          <p class="font-medium text-surface-900 dark:text-white">確定要刪除「{{ deleteTarget?.data.name }}」嗎？</p>
          <p class="text-surface-500 text-sm mt-1">此操作無法還原，子分類也將一併刪除。</p>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="deleteDialogVisible = false" />
          <Button label="確認刪除" severity="danger" icon="pi pi-trash" @click="confirmDelete" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import TreeTable from 'primevue/treetable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Summary Data
const summaryData = ref({
  totalCategories: 22,
  rootCategories: 5,
  avgGamesPerCategory: 156
})

// Expanded Keys
const expandedKeys = ref<Record<string, boolean>>({ '0': true, '1': true, '2': true })

// TreeTable Data (3-level depth)
interface TreeNode {
  key: string
  data: { name: string; slug: string; icon: string; gameCount: number; sort: number; visible: boolean }
  children?: TreeNode[]
}

const categories = ref<TreeNode[]>([
  {
    key: '0',
    data: { name: '電子遊戲', slug: 'slots', icon: 'pi-desktop', gameCount: 856, sort: 1, visible: true },
    children: [
      { 
        key: '0-0', 
        data: { name: '熱門老虎機', slug: 'hot-slots', icon: 'pi-fire', gameCount: 245, sort: 1, visible: true },
        children: [
          { key: '0-0-0', data: { name: 'PG 電子', slug: 'pg-slots', icon: 'pi-star', gameCount: 186, sort: 1, visible: true } },
          { key: '0-0-1', data: { name: 'PP 電子', slug: 'pp-slots', icon: 'pi-bolt', gameCount: 142, sort: 2, visible: true } }
        ]
      },
      { key: '0-1', data: { name: '累積彩池', slug: 'jackpot', icon: 'pi-bolt', gameCount: 128, sort: 2, visible: true } },
      { key: '0-2', data: { name: 'JDB 電子', slug: 'jdb-slots', icon: 'pi-sparkles', gameCount: 156, sort: 3, visible: true } },
      { key: '0-3', data: { name: '新遊戲', slug: 'new-slots', icon: 'pi-gift', gameCount: 68, sort: 4, visible: true } }
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
      { key: '2-1', data: { name: '籃球', slug: 'basketball', icon: 'pi-star-fill', gameCount: 0, sort: 2, visible: true } },
      { key: '2-2', data: { name: '電競', slug: 'esports', icon: 'pi-desktop', gameCount: 0, sort: 3, visible: true } }
    ]
  },
  {
    key: '3',
    data: { name: '捕魚遊戲', slug: 'fishing', icon: 'pi-sun', gameCount: 156, sort: 4, visible: true },
    children: [
      { key: '3-0', data: { name: 'JDB 捕魚', slug: 'jdb-fishing', icon: 'pi-bolt', gameCount: 86, sort: 1, visible: true } },
      { key: '3-1', data: { name: 'CQ9 捕魚', slug: 'cq9-fishing', icon: 'pi-sun', gameCount: 45, sort: 2, visible: true } }
    ]
  },
  { key: '4', data: { name: '彩票遊戲', slug: 'lottery', icon: 'pi-ticket', gameCount: 28, sort: 5, visible: false } }
])

// Level Helpers
const getLevelLabel = (key: string): string => {
  const depth = key.split('-').length
  if (depth === 1) return 'Root'
  if (depth === 2) return 'Sub'
  return 'Leaf'
}

const getLevelSeverity = (key: string): string => {
  const depth = key.split('-').length
  if (depth === 1) return 'info'
  if (depth === 2) return 'warn'
  return 'secondary'
}

// Parent Options for Dropdown
const parentOptions = computed(() => {
  const options: { label: string; value: string | null }[] = [{ label: '無 (主分類)', value: null }]
  const flattenNodes = (nodes: TreeNode[], prefix = '') => {
    nodes.forEach(node => {
      options.push({ label: prefix + node.data.name, value: node.key })
      if (node.children) flattenNodes(node.children, prefix + '── ')
    })
  }
  flattenNodes(categories.value)
  return options
})

// Expand/Collapse
const expandAll = () => {
  const expanded: Record<string, boolean> = {}
  const walk = (nodes: TreeNode[]) => {
    nodes.forEach(node => { expanded[node.key] = true; if (node.children) walk(node.children) })
  }
  walk(categories.value)
  expandedKeys.value = expanded
  toast.add({ severity: 'info', summary: '已展開', detail: '已展開所有分類', life: 1500 })
}

const collapseAll = () => {
  expandedKeys.value = {}
  toast.add({ severity: 'info', summary: '已摺疊', detail: '已摺疊所有分類', life: 1500 })
}

// ========================================
// Editor Dialog
// ========================================
const editorDialogVisible = ref(false)
const isEditMode = ref(false)
const dialogTitle = computed(() => isEditMode.value ? '編輯分類' : '新增分類')

interface CategoryForm {
  key: string | null
  parentKey: string | null
  name: string
  slug: string
  icon: string
  sort: number
  visible: boolean
}

const categoryForm = ref<CategoryForm>({
  key: null, parentKey: null, name: '', slug: '', icon: 'pi-folder', sort: 0, visible: true
})

const resetForm = () => {
  categoryForm.value = { key: null, parentKey: null, name: '', slug: '', icon: 'pi-folder', sort: 0, visible: true }
}

const openAddRoot = () => {
  resetForm()
  isEditMode.value = false
  categoryForm.value.parentKey = null
  editorDialogVisible.value = true
}

const openAddChild = (node: TreeNode) => {
  resetForm()
  isEditMode.value = false
  categoryForm.value.parentKey = node.key
  editorDialogVisible.value = true
}

const openEdit = (node: TreeNode) => {
  isEditMode.value = true
  const parentKey = node.key.includes('-') ? node.key.substring(0, node.key.lastIndexOf('-')) : null
  categoryForm.value = {
    key: node.key,
    parentKey,
    name: node.data.name,
    slug: node.data.slug,
    icon: node.data.icon,
    sort: node.data.sort,
    visible: node.data.visible
  }
  editorDialogVisible.value = true
}

const saveCategory = () => {
  if (!categoryForm.value.name) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫分類名稱', life: 3000 })
    return
  }
  const action = isEditMode.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `分類「${categoryForm.value.name}」已${action}`, life: 3000 })
  editorDialogVisible.value = false
}

// ========================================
// Delete Dialog
// ========================================
const deleteDialogVisible = ref(false)
const deleteTarget = ref<TreeNode | null>(null)

const handleDelete = (node: TreeNode) => {
  deleteTarget.value = node
  deleteDialogVisible.value = true
}

const confirmDelete = () => {
  if (deleteTarget.value) {
    toast.add({ severity: 'success', summary: '刪除成功', detail: `「${deleteTarget.value.data.name}」已刪除`, life: 3000 })
  }
  deleteDialogVisible.value = false
}

// Inline Actions
const handleSortChange = (node: TreeNode) => {
  toast.add({ severity: 'success', summary: '排序更新', detail: `「${node.data.name}」排序已更新為 ${node.data.sort}`, life: 2000 })
}

const handleVisibilityChange = (node: TreeNode) => {
  const status = node.data.visible ? '顯示' : '隱藏'
  toast.add({ severity: 'success', summary: '狀態變更', detail: `「${node.data.name}」已設為${status}`, life: 2000 })
}
</script>
