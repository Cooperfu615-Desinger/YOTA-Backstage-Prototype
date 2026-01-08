<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-wallet text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">財務管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">點數與獎勵</span>
    </div>

    <!-- Manual Adjustment Console -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
            <i class="pi pi-star text-yellow-500 dark:text-yellow-400"></i>
            人工存提控制台
          </div>
        </div>
      </template>
      <template #content>
        <div class="flex items-end justify-between gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">快速搜尋會員</label>
            <InputText v-model="quickSearchMember" placeholder="輸入會員 ID" class="w-[220px]" />
          </div>
          <Button label="新增存提申請" icon="pi pi-plus-circle" severity="success" size="large" @click="openAdjustmentDialog" class="px-8" />
        </div>
      </template>
    </Card>

    <!-- Recent Adjustments -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-list text-purple-500 dark:text-purple-400"></i>
          近期存提紀錄
        </div>
      </template>
      <template #content>
         <DataTable :value="recentAdjustments" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
            <Column field="time" header="時間" style="min-width: 160px">
                 <template #body="slotProps">
                    <span class="text-sm text-surface-500 dark:text-surface-400">{{ slotProps.data.time }}</span>
                </template>
            </Column>
            <Column field="memberId" header="會員 ID" style="min-width: 120px">
                 <template #body="slotProps">
                    <span class="text-surface-300 font-medium">{{ slotProps.data.memberId }}</span>
                </template>
            </Column>
            <Column field="operator" header="操作員" style="min-width: 100px">
                 <template #body="slotProps">
                    <div class="flex items-center gap-1">
                        <i class="pi pi-user text-xs text-blue-500 dark:text-blue-400"></i>
                        <span>{{ slotProps.data.operator }}</span>
                    </div>
                </template>
            </Column>
            <Column field="type" header="類型" style="min-width: 140px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.type" severity="info" />
                </template>
            </Column>
            <Column field="amount" header="異動金額" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono font-bold" :class="slotProps.data.amount >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'">
                        {{ slotProps.data.amount >= 0 ? '+' : '' }}{{ formatCurrency(slotProps.data.amount) }}
                     </span>
                </template>
            </Column>
            <Column field="status" header="狀態" style="min-width: 100px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <!-- Bulk Distribution Tasks -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
            <i class="pi pi-send text-green-500 dark:text-green-400"></i>
            批量發放任務
          </div>
          <Button label="建立批量任務" icon="pi pi-plus" severity="help" outlined @click="openBulkTaskDialog" />
        </div>
      </template>
      <template #content>
         <DataTable :value="bulkTasks" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
            <Column field="taskName" header="任務名稱" style="min-width: 200px">
                 <template #body="slotProps">
                    <span class="text-surface-900 dark:text-white font-medium">{{ slotProps.data.taskName }}</span>
                </template>
            </Column>
            <Column field="target" header="目標對象" style="min-width: 150px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.target" severity="secondary" />
                </template>
            </Column>
            <Column field="amountPerPerson" header="每人金額" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono text-green-400 font-bold">+{{ formatCurrency(slotProps.data.amountPerPerson) }}</span>
                </template>
            </Column>
            <Column field="totalRecipients" header="發放人數" style="min-width: 100px">
                 <template #body="slotProps">
                    <span>{{ slotProps.data.totalRecipients }} 人</span>
                </template>
            </Column>
            <Column field="status" header="發放狀態" style="min-width: 120px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getBulkStatusSeverity(slotProps.data.status)" />
                </template>
            </Column>
            <Column field="createTime" header="建立時間" style="min-width: 160px">
                 <template #body="slotProps">
                    <span class="text-sm text-surface-500 dark:text-surface-400">{{ slotProps.data.createTime }}</span>
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <!-- Adjustment Dialog -->
    <Dialog v-model:visible="adjustmentDialogVisible" modal header="新增人工存提申請" :style="{ width: '500px' }">
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
                <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">會員 ID</label>
                <InputText v-model="adjustmentForm.memberId" placeholder="輸入會員 ID" @blur="fetchMemberBalance" />
            </div>
            
            <div v-if="memberBalance !== null" class="bg-blue-500/10 border border-blue-500/30 rounded p-3">
                <div class="text-sm text-surface-500 dark:text-surface-400">當前餘額</div>
                <div class="text-2xl font-bold text-blue-500 dark:text-blue-400 font-mono">{{ formatCurrency(memberBalance) }}</div>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">異動金額</label>
                <InputNumber v-model="adjustmentForm.amount" placeholder="正數增加，負數扣除" mode="currency" currency="TWD" locale="zh-TW" :minFractionDigits="0" class="w-full" />
                <small class="text-surface-500 dark:text-surface-400">提示：正數為增點，負數為扣點</small>
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">存提類型</label>
                <Dropdown v-model="adjustmentForm.type" :options="adjustmentTypes" optionLabel="label" optionValue="value" placeholder="選擇類型" class="w-full" />
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">操作原因</label>
                <Textarea v-model="adjustmentForm.reason" rows="3" placeholder="請詳細說明操作原因..." class="w-full" />
            </div>

            <div v-if="Math.abs(adjustmentForm.amount || 0) > 10000" class="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 flex items-start gap-2">
                <i class="pi pi-exclamation-triangle text-yellow-500 dark:text-yellow-400 mt-1"></i>
                <div class="text-sm text-yellow-600 dark:text-yellow-400">
                    <div class="font-bold mb-1">審核提醒</div>
                    此操作金額超過 $10,000，將提交至手工存款審核頁面進行複審。
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="取消" severity="secondary" outlined @click="adjustmentDialogVisible = false" />
            <Button label="提交申請" severity="success" @click="submitAdjustment" :disabled="!isFormValid" />
        </template>
    </Dialog>

    <!-- Bulk Task Dialog -->
    <Dialog v-model:visible="bulkTaskDialogVisible" modal header="建立批量發放任務" :style="{ width: '500px' }">
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
                <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">任務名稱</label>
                <InputText v-model="bulkTaskForm.taskName" placeholder="例如：VIP 週年慶獎勵" />
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">目標對象</label>
                <Dropdown v-model="bulkTaskForm.target" :options="targetOptions" optionLabel="label" optionValue="value" placeholder="選擇目標對象" class="w-full" />
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-surface-500 dark:text-surface-300 text-sm font-medium">每人金額</label>
                <InputNumber v-model="bulkTaskForm.amountPerPerson" mode="currency" currency="TWD" locale="zh-TW" :minFractionDigits="0" class="w-full" />
            </div>
        </div>

        <template #footer>
            <Button label="取消" severity="secondary" outlined @click="bulkTaskDialogVisible = false" />
            <Button label="建立任務" severity="help" @click="submitBulkTask" />
        </template>
    </Dialog>

    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

onMounted(() => {
    generateMockData()
})

const quickSearchMember = ref('')
const adjustmentDialogVisible = ref(false)
const bulkTaskDialogVisible = ref(false)
const memberBalance = ref<number | null>(null)

const adjustmentTypes = ref([
    { label: '行銷獎勵', value: '行銷獎勵' },
    { label: '技術扣回', value: '技術扣回' },
    { label: '線下收單補點', value: '線下收單補點' },
    { label: 'VIP 專屬獎勵', value: 'VIP 專屬獎勵' },
    { label: '客訴補償', value: '客訴補償' },
])

const targetOptions = ref([
    { label: 'VIP1 會員', value: 'VIP1 會員' },
    { label: 'VIP2 會員', value: 'VIP2 會員' },
    { label: 'VIP3 會員', value: 'VIP3 會員' },
    { label: '全體會員', value: '全體會員' },
    { label: '新註冊會員', value: '新註冊會員' },
])

const adjustmentForm = ref({
    memberId: '',
    amount: null as number | null,
    type: '',
    reason: ''
})

const bulkTaskForm = ref({
    taskName: '',
    target: '',
    amountPerPerson: null as number | null
})

const recentAdjustments = ref<any[]>([])
const bulkTasks = ref<any[]>([])

const isFormValid = computed(() => {
    return adjustmentForm.value.memberId && 
           adjustmentForm.value.amount !== null && 
           adjustmentForm.value.type && 
           adjustmentForm.value.reason
})

const openAdjustmentDialog = () => {
    adjustmentForm.value = { memberId: '', amount: null, type: '', reason: '' }
    memberBalance.value = null
    adjustmentDialogVisible.value = true
}

const openBulkTaskDialog = () => {
    bulkTaskForm.value = { taskName: '', target: '', amountPerPerson: null }
    bulkTaskDialogVisible.value = true
}

const fetchMemberBalance = () => {
    if (adjustmentForm.value.memberId) {
        // Simulate API call
        setTimeout(() => {
            memberBalance.value = Math.floor(Math.random() * 50000) + 1000
        }, 300)
    }
}

const submitAdjustment = () => {
    const needsApproval = Math.abs(adjustmentForm.value.amount || 0) > 10000
    
    const newAdjustment = {
        time: new Date().toISOString().replace('T', ' ').substring(0, 19),
        memberId: adjustmentForm.value.memberId,
        operator: 'CurrentAdmin',
        type: adjustmentForm.value.type,
        amount: adjustmentForm.value.amount!,
        status: needsApproval ? '待審核' : '已完成'
    }
    
    recentAdjustments.value.unshift(newAdjustment)
    
    toast.add({ 
        severity: needsApproval ? 'warn' : 'success', 
        summary: needsApproval ? '已提交審核' : '操作成功', 
        detail: needsApproval ? '此筆申請已提交至手工存款審核頁面' : '人工存提操作已完成', 
        life: 3000 
    })
    
    adjustmentDialogVisible.value = false
}

const submitBulkTask = () => {
    const newTask = {
        taskName: bulkTaskForm.value.taskName,
        target: bulkTaskForm.value.target,
        amountPerPerson: bulkTaskForm.value.amountPerPerson!,
        totalRecipients: Math.floor(Math.random() * 200) + 50,
        status: '排隊中',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    }
    
    bulkTasks.value.unshift(newTask)
    
    toast.add({ 
        severity: 'success', 
        summary: '任務已建立', 
        detail: `批量發放任務「${newTask.taskName}」已加入排程`, 
        life: 3000 
    })
    
    bulkTaskDialogVisible.value = false
}

const generateMockData = () => {
    // Recent Adjustments
    const types = ['行銷獎勵', '技術扣回', '線下收單補點', 'VIP 專屬獎勵', '客訴補償']
    const statuses = ['已完成', '待審核', '已拒絕']
    
    for (let i = 0; i < 20; i++) {
        recentAdjustments.value.push({
            time: new Date(Date.now() - Math.floor(Math.random() * 7 * 86400 * 1000)).toISOString().replace('T', ' ').substring(0, 19),
            memberId: `user${1000 + Math.floor(Math.random() * 100)}`,
            operator: `Admin${Math.floor(Math.random() * 5) + 1}`,
            type: types[Math.floor(Math.random() * types.length)]!,
            amount: Math.random() > 0.6 ? Math.floor(Math.random() * 5000) + 100 : -(Math.floor(Math.random() * 3000) + 100),
            status: statuses[Math.floor(Math.random() * statuses.length)]!
        })
    }
    
    recentAdjustments.value.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    
    // Bulk Tasks
    const taskNames = ['VIP 週年慶獎勵', '新人註冊禮金', '月底返水活動', 'VIP 升級獎勵', '節日特惠發放']
    const targets = ['VIP1 會員', 'VIP2 會員', 'VIP3 會員', '全體會員', '新註冊會員']
    const taskStatuses = ['排隊中', '發放中', '完成']
    
    for (let i = 0; i < 10; i++) {
        bulkTasks.value.push({
            taskName: taskNames[Math.floor(Math.random() * taskNames.length)]!,
            target: targets[Math.floor(Math.random() * targets.length)]!,
            amountPerPerson: Math.floor(Math.random() * 2000) + 100,
            totalRecipients: Math.floor(Math.random() * 300) + 50,
            status: taskStatuses[Math.floor(Math.random() * taskStatuses.length)]!,
            createTime: new Date(Date.now() - Math.floor(Math.random() * 14 * 86400 * 1000)).toISOString().replace('T', ' ').substring(0, 19)
        })
    }
    
    bulkTasks.value.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
}

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)

const getStatusSeverity = (status: string) => {
    const severityMap: Record<string, string> = {
        '已完成': 'success',
        '待審核': 'warning',
        '已拒絕': 'danger'
    }
    return severityMap[status] || 'info'
}

const getBulkStatusSeverity = (status: string) => {
    const severityMap: Record<string, string> = {
        '排隊中': 'secondary',
        '發放中': 'info',
        '完成': 'success'
    }
    return severityMap[status] || 'info'
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
:deep(.p-datatable-tbody > tr > td) { padding: 0.75rem 1rem; }
</style>
