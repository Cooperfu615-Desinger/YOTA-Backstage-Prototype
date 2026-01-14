<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-globe text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">官網管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">最新消息</span>
    </div>

    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-megaphone text-green-500"></i>
      最新消息 (News Management)
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總文章數</p>
              <p class="text-3xl font-bold text-blue-500">{{ newsList.length }}</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-file text-blue-500 text-lg"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">本月發布</p>
              <p class="text-3xl font-bold text-green-500">8</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <i class="pi pi-calendar text-green-500 text-lg"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總瀏覽數</p>
              <p class="text-3xl font-bold text-orange-500">{{ totalViews.toLocaleString() }}</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-eye text-orange-500 text-lg"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">SEO 評分</p>
              <p class="text-3xl font-bold text-purple-500">92</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-chart-line text-purple-500 text-lg"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- News List -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-list text-green-500"></i>
            文章列表
          </div>
          <div class="flex gap-2">
            <Select v-model="filterCategory" :options="categoryOptions" optionLabel="label" optionValue="value" placeholder="篩選分類" class="w-32" />
            <Button label="新增文章" icon="pi pi-plus" @click="openDialog(null)" />
          </div>
        </div>
      </template>
      <template #content>
        <DataTable :value="filteredNews" stripedRows paginator :rows="10">
          <Column header="封面" style="min-width: 100px">
            <template #body="slotProps">
              <div class="w-16 h-12 rounded flex items-center justify-center text-white text-xs" :style="{ background: slotProps.data.bgColor }">
                <i class="pi pi-image"></i>
              </div>
            </template>
          </Column>
          <Column field="title" header="標題" sortable style="min-width: 250px">
            <template #body="slotProps">
              <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.title }}</span>
            </template>
          </Column>
          <Column field="category" header="分類" sortable style="min-width: 100px">
            <template #body="slotProps">
              <Tag :value="slotProps.data.category" :severity="getCategorySeverity(slotProps.data.category)" />
            </template>
          </Column>
          <Column field="publishDate" header="發布日" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-sm text-surface-600 dark:text-surface-400">{{ slotProps.data.publishDate }}</span>
            </template>
          </Column>
          <Column field="views" header="瀏覽數" sortable style="min-width: 100px">
            <template #body="slotProps">
              <span class="font-mono text-surface-700 dark:text-surface-300">{{ slotProps.data.views.toLocaleString() }}</span>
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
    <Dialog v-model:visible="dialogVisible" header="編輯文章" modal :style="{ width: '900px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">文章標題 <span class="text-red-500">*</span></label>
            <InputText v-model="form.title" placeholder="請輸入文章標題" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">分類</label>
            <Select v-model="form.category" :options="categoryOptions.slice(1)" optionLabel="label" optionValue="value" placeholder="選擇分類" />
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">封面圖片</label>
          <FileUpload mode="basic" accept="image/*" :maxFileSize="5000000" chooseLabel="上傳封面" class="w-full" />
          <small class="text-surface-500">建議尺寸: 800 x 450</small>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">文章內容 <span class="text-red-500">*</span></label>
          <Editor v-model="form.content" editorStyle="height: 300px" />
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">發布日期</label>
          <DatePicker v-model="form.publishDate" showTime hourFormat="24" placeholder="選擇發布時間" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="dialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveNews" />
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
import Select from 'primevue/select'
import FileUpload from 'primevue/fileupload'
import DatePicker from 'primevue/datepicker'
import Editor from 'primevue/editor'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

interface News {
  id: number
  title: string
  category: string
  bgColor: string
  publishDate: string
  views: number
  content?: string
}

const newsList = ref<News[]>([
  { id: 1, title: '🎉 新年活動正式開跑！首存加碼最高200%', category: '活動', bgColor: 'linear-gradient(135deg, #dc2626, #f97316)', publishDate: '2026-01-10', views: 3280 },
  { id: 2, title: '⚠️ 系統維護公告 (1/15 02:00-06:00)', category: '維護', bgColor: 'linear-gradient(135deg, #6366f1, #8b5cf6)', publishDate: '2026-01-12', views: 1520 },
  { id: 3, title: '🔥 老虎機大獎賽 - 獎金池突破百萬', category: '活動', bgColor: 'linear-gradient(135deg, #f59e0b, #eab308)', publishDate: '2026-01-08', views: 4567 },
  { id: 4, title: '📢 VIP 會員升級制度調整說明', category: '新聞', bgColor: 'linear-gradient(135deg, #22c55e, #10b981)', publishDate: '2026-01-05', views: 2890 },
  { id: 5, title: '💰 週週返水活動永久開放', category: '活動', bgColor: 'linear-gradient(135deg, #ec4899, #f43f5e)', publishDate: '2026-01-01', views: 5123 },
  { id: 6, title: '⚙️ APP 版本更新 (v2.5.0)', category: '維護', bgColor: 'linear-gradient(135deg, #06b6d4, #0ea5e9)', publishDate: '2025-12-28', views: 980 },
])

const totalViews = computed(() => newsList.value.reduce((sum, n) => sum + n.views, 0))

const categoryOptions = ref([
  { label: '全部', value: '' },
  { label: '活動', value: '活動' },
  { label: '維護', value: '維護' },
  { label: '新聞', value: '新聞' },
])

const filterCategory = ref('')
const filteredNews = computed(() => {
  if (!filterCategory.value) return newsList.value
  return newsList.value.filter(n => n.category === filterCategory.value)
})

const getCategorySeverity = (category: string) => {
  const map: Record<string, 'success' | 'warn' | 'info'> = {
    '活動': 'success',
    '維護': 'warn',
    '新聞': 'info'
  }
  return map[category] || 'info'
}

const dialogVisible = ref(false)
const editingNews = ref<News | null>(null)

const form = ref({
  title: '',
  category: '活動',
  content: '',
  publishDate: null as Date | null
})

const openDialog = (news: News | null) => {
  editingNews.value = news
  if (news) {
    form.value = {
      title: news.title,
      category: news.category,
      content: news.content || '',
      publishDate: null
    }
  } else {
    form.value = { title: '', category: '活動', content: '', publishDate: null }
  }
  dialogVisible.value = true
}

const saveNews = () => {
  if (!form.value.title) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫文章標題', life: 3000 })
    return
  }
  const action = editingNews.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `文章「${form.value.title}」已${action}`, life: 3000 })
  dialogVisible.value = false
}

const handleDelete = (news: News) => {
  toast.add({ severity: 'warn', summary: '刪除', detail: `「${news.title}」已刪除`, life: 2000 })
}
</script>
