<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-globe text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">官網管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">廣告輪播</span>
    </div>

    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-images text-blue-500"></i>
      廣告輪播 (Banner Carousel)
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">啟用中廣告</p>
              <p class="text-3xl font-bold text-green-500">{{ activeBanners }}</p>
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
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">總廣告數</p>
              <p class="text-3xl font-bold text-blue-500">{{ banners.length }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-images text-blue-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">今日點擊率</p>
              <p class="text-3xl font-bold text-orange-500">8.7%</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-percentage text-orange-500 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Banner List -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white">
            <i class="pi pi-list text-blue-500"></i>
            廣告列表
          </div>
          <Button label="新增廣告" icon="pi pi-plus" @click="openDialog(null)" />
        </div>
      </template>
      <template #content>
        <DataTable :value="banners" stripedRows>
          <Column field="order" header="排序" sortable style="min-width: 80px">
            <template #body="slotProps">
              <InputNumber v-model="slotProps.data.order" :min="1" :max="99" class="w-16" size="small" />
            </template>
          </Column>
          <Column header="預覽" style="min-width: 150px">
            <template #body="slotProps">
              <div class="flex gap-2">
                <div class="w-20 h-10 rounded flex items-center justify-center text-xs text-white" :style="{ background: slotProps.data.bgColor }">
                  PC
                </div>
                <div class="w-10 h-10 rounded flex items-center justify-center text-xs text-white" :style="{ background: slotProps.data.bgColor }">
                  M
                </div>
              </div>
            </template>
          </Column>
          <Column field="title" header="標題" sortable style="min-width: 180px">
            <template #body="slotProps">
              <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.title }}</span>
            </template>
          </Column>
          <Column field="linkUrl" header="跳轉連結" style="min-width: 200px">
            <template #body="slotProps">
              <a :href="slotProps.data.linkUrl" target="_blank" class="text-blue-500 hover:underline text-sm truncate block max-w-[200px]">
                {{ slotProps.data.linkUrl }}
              </a>
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
    <Dialog v-model:visible="dialogVisible" header="編輯廣告" modal :style="{ width: '700px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">廣告標題 <span class="text-red-500">*</span></label>
          <InputText v-model="form.title" placeholder="首存優惠活動" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">PC 版圖片</label>
            <FileUpload mode="basic" accept="image/*" :maxFileSize="5000000" chooseLabel="上傳圖片" class="w-full" />
            <small class="text-surface-500">建議尺寸: 1200 x 400</small>
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">Mobile 版圖片</label>
            <FileUpload mode="basic" accept="image/*" :maxFileSize="5000000" chooseLabel="上傳圖片" class="w-full" />
            <small class="text-surface-500">建議尺寸: 750 x 400</small>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">跳轉連結</label>
          <InputText v-model="form.linkUrl" placeholder="https://example.com/promo" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">排序</label>
            <InputNumber v-model="form.order" :min="1" :max="99" />
          </div>
          <div class="flex items-center gap-3 p-3 bg-surface-100 dark:bg-surface-700 rounded-lg">
            <InputSwitch v-model="form.active" />
            <label class="text-surface-700 dark:text-surface-300">啟用廣告</label>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="dialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveBanner" />
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
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import FileUpload from 'primevue/fileupload'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

interface Banner {
  id: number
  title: string
  bgColor: string
  linkUrl: string
  order: number
  active: boolean
}

const banners = ref<Banner[]>([
  { id: 1, title: '新年首存加碼', bgColor: 'linear-gradient(135deg, #dc2626, #f97316)', linkUrl: 'https://example.com/promo/newyear', order: 1, active: true },
  { id: 2, title: '老虎機大獎賽', bgColor: 'linear-gradient(135deg, #8b5cf6, #a855f7)', linkUrl: 'https://example.com/promo/slots', order: 2, active: true },
  { id: 3, title: 'VIP 專屬禮遇', bgColor: 'linear-gradient(135deg, #eab308, #f59e0b)', linkUrl: 'https://example.com/vip', order: 3, active: true },
  { id: 4, title: '邀請好友獎勵', bgColor: 'linear-gradient(135deg, #22c55e, #10b981)', linkUrl: 'https://example.com/referral', order: 4, active: false },
])

const activeBanners = computed(() => banners.value.filter(b => b.active).length)

const dialogVisible = ref(false)
const editingBanner = ref<Banner | null>(null)

const form = ref({
  title: '',
  linkUrl: '',
  order: 1,
  active: true
})

const openDialog = (banner: Banner | null) => {
  editingBanner.value = banner
  if (banner) {
    form.value = {
      title: banner.title,
      linkUrl: banner.linkUrl,
      order: banner.order,
      active: banner.active
    }
  } else {
    form.value = { title: '', linkUrl: '', order: banners.value.length + 1, active: true }
  }
  dialogVisible.value = true
}

const saveBanner = () => {
  if (!form.value.title) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫廣告標題', life: 3000 })
    return
  }
  const action = editingBanner.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `廣告「${form.value.title}」已${action}`, life: 3000 })
  dialogVisible.value = false
}

const handleDelete = (banner: Banner) => {
  toast.add({ severity: 'warn', summary: '刪除', detail: `「${banner.title}」已刪除`, life: 2000 })
}
</script>
