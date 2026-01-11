<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-th-large text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">版面設定</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">文章管理</span>
    </div>

    <!-- Header -->
    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-file-edit text-purple-500"></i>
      文章管理 (WebView CMS)
    </div>

    <!-- TabView -->
    <TabView>
      <!-- Tab 1: Articles -->
      <TabPanel value="0" header="文章與條款">
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-file text-blue-500"></i>
                文章列表
              </div>
              <Button label="新增文章" icon="pi pi-plus" @click="openArticleDialog(null)" />
            </div>
          </template>
          <template #content>
            <DataTable :value="articles" stripedRows paginator :rows="10">
              <Column field="title" header="標題" sortable style="min-width: 180px">
                <template #body="slotProps">
                  <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.title }}</span>
                </template>
              </Column>
              <Column field="category" header="分類" style="min-width: 120px">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.category" severity="secondary" />
                </template>
              </Column>
              <Column field="key" header="文章代碼 (Key)" sortable style="min-width: 150px">
                <template #body="slotProps">
                  <code class="text-sm bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded text-purple-600 dark:text-purple-400">{{ slotProps.data.key }}</code>
                </template>
              </Column>
              <Column field="locale" header="語系" style="min-width: 80px">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.locale" :severity="slotProps.data.locale === 'zh-TW' ? 'info' : 'warn'" />
                </template>
              </Column>
              <Column field="active" header="狀態" style="min-width: 80px">
                <template #body="slotProps">
                  <InputSwitch v-model="slotProps.data.active" @change="handleArticleStatusChange(slotProps.data)" />
                </template>
              </Column>
              <Column header="最後更新" style="min-width: 150px">
                <template #body="slotProps">
                  <div class="text-sm">
                    <p class="text-surface-700 dark:text-surface-300">{{ slotProps.data.updatedAt }}</p>
                    <p class="text-surface-500 text-xs">{{ slotProps.data.updatedBy }}</p>
                  </div>
                </template>
              </Column>
              <Column header="操作" style="min-width: 100px">
                <template #body="slotProps">
                  <div class="flex gap-1">
                    <Button icon="pi pi-pencil" severity="info" text size="small" @click="openArticleDialog(slotProps.data)" />
                    <Button icon="pi pi-trash" severity="danger" text size="small" @click="handleDeleteArticle(slotProps.data)" />
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </TabPanel>

      <!-- Tab 2: Categories -->
      <TabPanel value="1" header="分類管理">
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-folder text-green-500"></i>
                分類列表
              </div>
              <Button label="新增分類" icon="pi pi-plus" @click="openCategoryDialog(null)" />
            </div>
          </template>
          <template #content>
            <DataTable :value="categories" stripedRows>
              <Column field="name" header="分類名稱" sortable style="min-width: 200px">
                <template #body="slotProps">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-folder text-yellow-500"></i>
                    <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.name }}</span>
                  </div>
                </template>
              </Column>
              <Column field="weight" header="排序權重" sortable style="min-width: 120px">
                <template #body="slotProps">
                  <InputNumber v-model="slotProps.data.weight" :min="0" :max="100" />
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
                    <Button icon="pi pi-pencil" severity="info" text size="small" @click="openCategoryDialog(slotProps.data)" />
                    <Button icon="pi pi-trash" severity="danger" text size="small" @click="handleDeleteCategory(slotProps.data)" />
                  </div>
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </TabPanel>
    </TabView>

    <!-- Article Editor Dialog -->
    <Dialog v-model:visible="articleDialogVisible" header="編輯文章" modal maximizable :style="{ width: '900px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <!-- Basic Settings -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">文章標題 <span class="text-red-500">*</span></label>
            <InputText v-model="articleForm.title" placeholder="隱私權政策" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">文章代碼 (Key) <span class="text-red-500">*</span></label>
            <InputText v-model="articleForm.key" placeholder="privacy_policy" />
            <small class="text-surface-500">APP 透過此代碼調用文章內容</small>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">所屬分類</label>
            <Select v-model="articleForm.category" :options="categoryOptions" optionLabel="label" optionValue="value" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">語系</label>
            <Select v-model="articleForm.locale" :options="localeOptions" optionLabel="label" optionValue="value" />
          </div>
        </div>

        <!-- Rich Text Editor -->
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">內容編輯 (WebView 顯示內容)</label>
          <Editor v-model="articleForm.content" editorStyle="height: 300px" />
        </div>

        <!-- SEO/Meta -->
        <div class="border-t border-surface-200 dark:border-surface-700 pt-4">
          <p class="text-sm text-surface-500 mb-3">SEO/Meta (選填)</p>
          <div class="grid grid-cols-1 gap-4">
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">Meta Title</label>
              <InputText v-model="articleForm.metaTitle" placeholder="頁面標題 (SEO)" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-medium text-surface-700 dark:text-surface-300">Meta Description</label>
              <Textarea v-model="articleForm.metaDescription" rows="2" placeholder="頁面描述 (SEO)" />
            </div>
          </div>
        </div>

        <!-- Status -->
        <div class="flex items-center gap-3 pt-2 border-t border-surface-200 dark:border-surface-700">
          <InputSwitch v-model="articleForm.active" />
          <label class="font-medium text-surface-700 dark:text-surface-300">{{ articleForm.active ? '發布' : '隱藏' }}</label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="articleDialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveArticle" />
        </div>
      </template>
    </Dialog>

    <!-- Category Editor Dialog -->
    <Dialog v-model:visible="categoryDialogVisible" header="編輯分類" modal :style="{ width: '500px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">分類名稱 <span class="text-red-500">*</span></label>
          <InputText v-model="categoryForm.name" placeholder="法律條款" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">排序權重</label>
          <InputNumber v-model="categoryForm.weight" :min="0" :max="100" />
        </div>
        <div class="flex items-center gap-3">
          <InputSwitch v-model="categoryForm.active" />
          <label class="font-medium text-surface-700 dark:text-surface-300">{{ categoryForm.active ? '啟用' : '停用' }}</label>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="categoryDialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveCategory" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'
import Dialog from 'primevue/dialog'
import Editor from 'primevue/editor'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Options
const categoryOptions = ref([
  { label: '法律條款', value: '法律條款' },
  { label: '關於我們', value: '關於我們' },
  { label: '幫助中心', value: '幫助中心' },
  { label: '新手教學', value: '新手教學' }
])

const localeOptions = ref([
  { label: '繁體中文 (zh-TW)', value: 'zh-TW' },
  { label: 'English (en-US)', value: 'en-US' },
  { label: '简体中文 (zh-CN)', value: 'zh-CN' },
  { label: 'Tiếng Việt (vi-VN)', value: 'vi-VN' }
])

// ========================================
// Articles
// ========================================
interface Article {
  id: number
  title: string
  category: string
  key: string
  locale: string
  active: boolean
  updatedAt: string
  updatedBy: string
  content: string
  metaTitle: string
  metaDescription: string
}

const articles = ref<Article[]>([
  { id: 1, title: '隱私權政策', category: '法律條款', key: 'privacy_policy', locale: 'zh-TW', active: true, updatedAt: '2026-01-10 14:30', updatedBy: 'admin', content: '<p>本站非常重視用戶隱私...</p>', metaTitle: '', metaDescription: '' },
  { id: 2, title: '服務條款', category: '法律條款', key: 'terms_of_service', locale: 'zh-TW', active: true, updatedAt: '2026-01-09 10:15', updatedBy: 'admin', content: '<p>歡迎使用本服務...</p>', metaTitle: '', metaDescription: '' },
  { id: 3, title: '關於 YOTA', category: '關於我們', key: 'about_us', locale: 'zh-TW', active: true, updatedAt: '2026-01-08 16:45', updatedBy: 'editor1', content: '<p>YOTA 是領先的線上娛樂平台...</p>', metaTitle: '', metaDescription: '' },
  { id: 4, title: '新手指南', category: '新手教學', key: 'beginner_guide', locale: 'zh-TW', active: true, updatedAt: '2026-01-07 09:00', updatedBy: 'editor2', content: '<p>歡迎加入 YOTA！以下是快速入門指南...</p>', metaTitle: '', metaDescription: '' },
  { id: 5, title: 'Privacy Policy', category: '法律條款', key: 'privacy_policy', locale: 'en-US', active: true, updatedAt: '2026-01-10 14:35', updatedBy: 'admin', content: '<p>We value your privacy...</p>', metaTitle: '', metaDescription: '' },
  { id: 6, title: '充值教學', category: '幫助中心', key: 'deposit_guide', locale: 'zh-TW', active: false, updatedAt: '2026-01-05 11:20', updatedBy: 'editor1', content: '<p>多種充值方式供您選擇...</p>', metaTitle: '', metaDescription: '' }
])

const articleDialogVisible = ref(false)
const editingArticle = ref<Article | null>(null)

const articleForm = ref({
  title: '',
  key: '',
  category: '法律條款',
  locale: 'zh-TW',
  content: '',
  metaTitle: '',
  metaDescription: '',
  active: true
})

const openArticleDialog = (article: Article | null) => {
  editingArticle.value = article
  if (article) {
    articleForm.value = {
      title: article.title,
      key: article.key,
      category: article.category,
      locale: article.locale,
      content: article.content,
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      active: article.active
    }
  } else {
    articleForm.value = { title: '', key: '', category: '法律條款', locale: 'zh-TW', content: '', metaTitle: '', metaDescription: '', active: true }
  }
  articleDialogVisible.value = true
}

const saveArticle = () => {
  if (!articleForm.value.title || !articleForm.value.key) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫標題與文章代碼', life: 3000 })
    return
  }
  const action = editingArticle.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `文章「${articleForm.value.title}」已${action}`, life: 3000 })
  articleDialogVisible.value = false
}

const handleArticleStatusChange = (article: Article) => {
  const status = article.active ? '發布' : '隱藏'
  toast.add({ severity: 'success', summary: '狀態變更', detail: `「${article.title}」已${status}`, life: 2000 })
}

const handleDeleteArticle = (article: Article) => {
  toast.add({ severity: 'warn', summary: '刪除', detail: `「${article.title}」已刪除`, life: 2000 })
}

// ========================================
// Categories
// ========================================
interface Category {
  id: number
  name: string
  weight: number
  active: boolean
}

const categories = ref<Category[]>([
  { id: 1, name: '法律條款', weight: 100, active: true },
  { id: 2, name: '關於我們', weight: 90, active: true },
  { id: 3, name: '幫助中心', weight: 80, active: true },
  { id: 4, name: '新手教學', weight: 70, active: true },
  { id: 5, name: '活動規則', weight: 60, active: false }
])

const categoryDialogVisible = ref(false)
const editingCategory = ref<Category | null>(null)

const categoryForm = ref({
  name: '',
  weight: 50,
  active: true
})

const openCategoryDialog = (category: Category | null) => {
  editingCategory.value = category
  if (category) {
    categoryForm.value = { name: category.name, weight: category.weight, active: category.active }
  } else {
    categoryForm.value = { name: '', weight: 50, active: true }
  }
  categoryDialogVisible.value = true
}

const saveCategory = () => {
  if (!categoryForm.value.name) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫分類名稱', life: 3000 })
    return
  }
  const action = editingCategory.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `分類「${categoryForm.value.name}」已${action}`, life: 3000 })
  categoryDialogVisible.value = false
}

const handleDeleteCategory = (category: Category) => {
  toast.add({ severity: 'warn', summary: '刪除', detail: `「${category.name}」已刪除`, life: 2000 })
}
</script>
