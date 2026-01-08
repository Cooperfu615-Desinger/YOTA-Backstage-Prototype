<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-wallet text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">財務管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">自動金流配置</span>
    </div>

    <!-- Auto-Approval Mode Toggle -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
            <i class="pi pi-cog text-blue-500 dark:text-blue-400"></i>
            自動審核模式
          </div>
          <InputSwitch v-model="autoApprovalEnabled" @change="handleModeToggle" />
        </div>
      </template>
      <template #content>
        <div class="text-sm text-surface-500 dark:text-surface-400">
          啟用後，符合條件的提款申請將自動通過審核，無需人工介入。請謹慎配置自動通過規則。
        </div>
      </template>
    </Card>

    <!-- Auto-Approval Rules -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-base">
            <i class="pi pi-dollar text-green-500 dark:text-green-400"></i>
            金額上限
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div class="flex flex-col gap-1">
              <label class="text-surface-500 dark:text-surface-300 text-sm">自動通過金額上限</label>
              <InputNumber v-model="rules.maxAmount" mode="currency" currency="TWD" locale="zh-TW" :minFractionDigits="0" :disabled="!autoApprovalEnabled" />
            </div>
            <div class="text-xs text-surface-500">
              提款金額 ≤ 此數值時，將自動通過
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-base">
            <i class="pi pi-star text-yellow-500 dark:text-yellow-400"></i>
            會員等級
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div class="flex flex-col gap-1">
              <label class="text-surface-500 dark:text-surface-300 text-sm">最低會員等級</label>
              <Dropdown v-model="rules.minVipLevel" :options="vipLevelOptions" optionLabel="label" optionValue="value" :disabled="!autoApprovalEnabled" />
            </div>
            <div class="text-xs text-surface-500">
              僅限此等級以上的會員自動通過
            </div>
          </div>
        </template>
      </Card>

      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-base">
            <i class="pi pi-chart-line text-purple-500 dark:text-purple-400"></i>
            打碼量要求
          </div>
        </template>
        <template #content>
          <div class="space-y-3">
            <div class="flex flex-col gap-1">
              <label class="text-surface-500 dark:text-surface-300 text-sm">打碼量達成率</label>
              <InputNumber v-model="rules.rolloverPercentage" suffix="%" :min="0" :max="100" :disabled="!autoApprovalEnabled" />
            </div>
            <div class="text-xs text-surface-500">
              打碼量 ≥ 此百分比時，才自動通過
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Alert Settings -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-exclamation-triangle text-orange-500 dark:text-orange-400"></i>
          警示設定
        </div>
      </template>
      <template #content>
        <div class="flex items-center gap-4">
          <div class="flex flex-col gap-1 flex-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">強制人工審核閾值</label>
            <InputNumber v-model="alertSettings.forceManualThreshold" mode="currency" currency="TWD" locale="zh-TW" :minFractionDigits="0" class="w-[300px]" />
            <small class="text-surface-500">當單筆提款金額超過此數值時，強制轉為人工審核</small>
          </div>
          <Button label="儲存設定" icon="pi pi-save" severity="success" @click="saveSettings" />
        </div>
      </template>
    </Card>

    <!-- Gateway Balancing -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
            <i class="pi pi-server text-cyan-500 dark:text-cyan-400"></i>
            通道權重與分流
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-surface-500 dark:text-surface-400">自動切換備用通道</span>
            <InputSwitch v-model="gatewaySettings.autoFailover" />
          </div>
        </div>
      </template>
      <template #content>
         <DataTable :value="gateways" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
            <Column field="merchantName" header="商號名稱" style="min-width: 200px">
                 <template #body="slotProps">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-building text-blue-400"></i>
                        <span class="text-white font-medium">{{ slotProps.data.merchantName }}</span>
                    </div>
                </template>
            </Column>
            <Column field="weight" header="權重設定" style="min-width: 150px">
                 <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.weight" :min="0" :max="100" suffix="%" showButtons buttonLayout="horizontal" class="w-[140px]" />
                </template>
            </Column>
            <Column field="successRate" header="當前成功率" style="min-width: 150px">
                 <template #body="slotProps">
                    <div class="flex items-center gap-2">
                        <ProgressBar :value="slotProps.data.successRate" :showValue="false" class="w-24 h-2" 
                            :pt="{ 
                                root: { class: 'bg-surface-700' }, 
                                value: { class: slotProps.data.successRate >= 90 ? 'bg-green-500' : slotProps.data.successRate >= 70 ? 'bg-yellow-500' : 'bg-red-500' } 
                            }" 
                        />
                        <span :class="slotProps.data.successRate >= 90 ? 'text-green-500 dark:text-green-400' : slotProps.data.successRate >= 70 ? 'text-yellow-500 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'">
                            {{ slotProps.data.successRate }}%
                        </span>
                    </div>
                </template>
            </Column>
            <Column field="status" header="狀態" style="min-width: 100px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="slotProps.data.status === '啟用' ? 'success' : 'danger'" />
                </template>
            </Column>
            <Column field="dailyLimit" header="日限額" style="min-width: 120px">
                 <template #body="slotProps">
                    <span class="font-mono text-sm">{{ formatCurrency(slotProps.data.dailyLimit) }}</span>
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import InputSwitch from 'primevue/inputswitch'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

onMounted(() => {
    generateMockData()
})

const autoApprovalEnabled = ref(false)

const vipLevelOptions = ref([
    { label: 'VIP0 (所有會員)', value: 0 },
    { label: 'VIP1', value: 1 },
    { label: 'VIP2', value: 2 },
    { label: 'VIP3', value: 3 },
    { label: 'VIP4', value: 4 },
    { label: 'VIP5', value: 5 },
])

const rules = ref({
    maxAmount: 5000,
    minVipLevel: 1,
    rolloverPercentage: 100
})

const alertSettings = ref({
    forceManualThreshold: 50000
})

const gatewaySettings = ref({
    autoFailover: true
})

const gateways = ref<any[]>([])

const handleModeToggle = () => {
    toast.add({ 
        severity: autoApprovalEnabled.value ? 'success' : 'info', 
        summary: autoApprovalEnabled.value ? '已啟用自動審核' : '已關閉自動審核', 
        detail: autoApprovalEnabled.value ? '符合條件的提款將自動通過' : '所有提款將需要人工審核', 
        life: 3000 
    })
}

const saveSettings = () => {
    toast.add({ 
        severity: 'success', 
        summary: '設定已儲存', 
        detail: '自動審核規則與警示設定已更新', 
        life: 2000 
    })
}

const generateMockData = () => {
    gateways.value = [
        { 
            merchantName: 'MCH_888 (綠界科技)', 
            weight: 40, 
            successRate: 95, 
            status: '啟用',
            dailyLimit: 1000000
        },
        { 
            merchantName: 'MCH_999 (藍新金流)', 
            weight: 30, 
            successRate: 88, 
            status: '啟用',
            dailyLimit: 800000
        },
        { 
            merchantName: 'MCH_777 (LinePay)', 
            weight: 20, 
            successRate: 92, 
            status: '啟用',
            dailyLimit: 500000
        },
        { 
            merchantName: 'MCH_666 (速付通)', 
            weight: 10, 
            successRate: 65, 
            status: '停用',
            dailyLimit: 300000
        },
        { 
            merchantName: 'MCH_555 (易付)', 
            weight: 0, 
            successRate: 78, 
            status: '啟用',
            dailyLimit: 600000
        },
    ]
}

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
:deep(.p-datatable-tbody > tr > td) { padding: 0.75rem 1rem; }
</style>
