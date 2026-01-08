<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-sitemap text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">代理管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">推廣維護</span>
    </div>

    <!-- Configuration Panel -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-surface-0 text-lg">
          <i class="pi pi-cog text-blue-500 dark:text-blue-400"></i>
          推廣基礎設定
        </div>
      </template>
      <template #content>
        <div class="flex items-end gap-4 flex-wrap">
          <div>
            <label class="text-surface-700 dark:text-surface-300 text-sm mb-2 block">主推廣域名</label>
            <InputText v-model="config.domain" placeholder="https://example.com" class="w-[300px]" />
          </div>
          <div>
            <label class="text-surface-700 dark:text-surface-300 text-sm mb-2 block">默認落地頁</label>
            <Dropdown v-model="config.landingPage" :options="landingPageOptions" optionLabel="label" optionValue="value" placeholder="選擇頁面" class="w-[220px]" />
          </div>
          <div>
            <Button label="儲存設定" icon="pi pi-save" @click="saveConfig" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Promotion List Table -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-surface-0 text-lg">
          <i class="pi pi-link text-green-500 dark:text-green-400"></i>
          代理推廣列表
        </div>
      </template>
      <template #content>
         <DataTable :value="promotionList" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
            <Column field="account" header="代理帳號" style="min-width: 150px">
                 <template #body="slotProps">
                    <span class="text-surface-900 dark:text-surface-0 font-medium">{{ slotProps.data.account }}</span>
                </template>
            </Column>
            <Column field="code" header="推廣代碼" style="min-width: 120px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.code" severity="info" class="font-mono text-base" />
                </template>
            </Column>
            <Column header="推廣連結" style="min-width: 300px">
                 <template #body="slotProps">
                     <div class="flex items-center gap-2 bg-surface-100 dark:bg-surface-900 p-2 rounded border border-surface-200 dark:border-surface-700">
                         <span class="text-blue-500 dark:text-blue-400 text-sm truncate max-w-[200px]">{{ getFullLink(slotProps.data.code) }}</span>
                         <Button icon="pi pi-copy" size="small" text rounded severity="secondary" @click="copyLink(getFullLink(slotProps.data.code))" v-tooltip.top="'複製連結'" />
                     </div>
                </template>
            </Column>
            <Column header="二維碼" style="min-width: 100px">
                 <template #body="slotProps">
                     <Button icon="pi pi-qrcode" size="small" outlined severity="help" @click="showQrCode(slotProps.data)" />
                </template>
            </Column>
            <Column header="訪問數據" style="min-width: 200px">
                 <template #body="slotProps">
                     <div class="flex items-center gap-6">
                         <div class="flex flex-col items-center">
                             <span class="text-xs text-surface-500 dark:text-surface-400">點擊數</span>
                             <span class="text-surface-900 dark:text-white font-mono font-bold">{{ slotProps.data.clicks }}</span>
                         </div>
                         <div class="flex flex-col items-center">
                             <span class="text-xs text-surface-500 dark:text-surface-400">註冊轉化</span>
                             <span class="text-green-500 dark:text-green-400 font-mono font-bold">{{ slotProps.data.conversions }}</span>
                         </div>
                     </div>
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <!-- QR Code Dialog -->
    <Dialog v-model:visible="qrDialogVisible" modal header="推廣二維碼" :style="{ width: '300px' }">
        <div class="flex flex-col items-center gap-4 p-4" v-if="currentQrAgent">
            <div class="bg-white p-2 rounded">
                <!-- Simulated QR Code -->
                <i class="pi pi-qrcode text-6xl text-black"></i>
            </div>
            <div class="text-center">
                <div class="text-surface-900 dark:text-white font-bold text-lg">{{ currentQrAgent.account }}</div>
                <div class="text-surface-500 dark:text-surface-400 text-sm">推廣代碼: {{ currentQrAgent.code }}</div>
            </div>
            <Button label="下載圖片" icon="pi pi-download" size="small" severity="secondary" outlined class="w-full" @click="downloadQr" />
        </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const config = ref({
    domain: 'https://agent.partner.com',
    landingPage: 'register'
})

const landingPageOptions = [
    { label: '註冊頁 (Register)', value: 'register' },
    { label: '首頁 (Home)', value: 'home' },
    { label: '活動頁 (Activity)', value: 'activity' }
]

const promotionList = ref<any[]>([])
const qrDialogVisible = ref(false)
const currentQrAgent = ref<any>(null)

onMounted(() => {
    generateMockData()
})

const saveConfig = () => {
    toast.add({ severity: 'success', summary: '設定已儲存', detail: `推廣域名已更新為 ${config.value.domain}`, life: 2000 })
}

const getFullLink = (code: string) => {
    let path = ''
    if (config.value.landingPage === 'register') path = '/register'
    else if (config.value.landingPage === 'activity') path = '/promotion'
    return `${config.value.domain}${path}?code=${code}`
}

const copyLink = (link: string) => {
    // Simulate clipboard API
    navigator.clipboard.writeText(link).then(() => {
         toast.add({ severity: 'success', summary: '複製成功', detail: '推廣連結已複製到剪貼簿', life: 1000 })
    }).catch(() => {
        // Fallback for non-secure contexts (development sometimes)
         toast.add({ severity: 'success', summary: '複製成功', detail: '推廣連結已複製到剪貼簿 (Simulated)', life: 1000 })
    })
}

const showQrCode = (agent: any) => {
    currentQrAgent.value = agent
    qrDialogVisible.value = true
}

const downloadQr = () => {
    toast.add({ severity: 'info', summary: '下載中', detail: 'QR Code 圖片下載中...', life: 1000 })
}

const generateMockData = () => {
    promotionList.value = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        account: `agent_${String(i + 1).padStart(3, '0')}`,
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        clicks: Math.floor(Math.random() * 5000),
        conversions: Math.floor(Math.random() * 200)
    }))
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1.5rem; }
:deep(.p-datatable-tbody > tr > td) { padding: 0.75rem 1rem; }
</style>
