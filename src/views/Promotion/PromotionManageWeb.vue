<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-gift text-blue-400"></i>
      <span class="text-surface-300">優惠管理</span>
      <span>></span>
      <span class="text-white font-medium">優惠管理 (包網版)</span>
    </div>

    <!-- Main Content -->
    <div class="card-wrapper">
         <TabView v-model:activeIndex="activeTab">
            <!-- Activity List Tab -->
            <TabPanel header="優惠活動列表" value="activities">
                <div class="space-y-4">
                    <div class="flex justify-end">
                        <Button label="新增與編輯活動" icon="pi pi-plus" severity="primary" @click="openActivityDialog()" />
                    </div>
                    
                    <DataTable :value="activities" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
                        <Column field="name" header="活動名稱" style="min-width: 150px">
                             <template #body="slotProps">
                                <span class="text-white font-medium">{{ slotProps.data.name }}</span>
                            </template>
                        </Column>
                         <Column field="type" header="活動類型" style="min-width: 120px">
                             <template #body="slotProps">
                                <Tag :value="slotProps.data.type" severity="info" />
                            </template>
                        </Column>
                         <Column header="出資佔比 (平台/代理)" style="min-width: 180px">
                             <template #body="slotProps">
                                <div class="flex items-center gap-2 text-sm">
                                    <span class="text-blue-400">{{ slotProps.data.platformShare }}%</span>
                                    <span class="text-surface-500">/</span>
                                    <span class="text-green-400">{{ slotProps.data.agentShare }}%</span>
                                </div>
                            </template>
                        </Column>
                         <Column field="turnoverMulti" header="流水倍數" style="min-width: 100px">
                             <template #body="slotProps">
                                <span class="font-mono text-white">{{ slotProps.data.turnoverMulti }}x</span>
                            </template>
                        </Column>
                        <Column field="status" header="狀態" style="min-width: 100px">
                             <template #body="slotProps">
                                <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                            </template>
                        </Column>
                        <Column header="操作" style="min-width: 150px">
                             <template #body="slotProps">
                                <div class="flex gap-2">
                                    <Button icon="pi pi-pencil" size="small" outlined severity="info" @click="openActivityDialog(slotProps.data)" />
                                    <Button icon="pi pi-trash" size="small" outlined severity="danger" @click="deleteActivity(slotProps.data)" />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </TabPanel>

            <!-- Audit Queue Tab -->
            <TabPanel header="自動審核列隊" value="audit">
                 <div class="space-y-4">
                    <div class="flex gap-2 mb-4 bg-surface-900 p-3 rounded items-center">
                        <span class="text-surface-400 text-sm">已選取: {{ selectedAudits.length }} 筆</span>
                        <div class="ml-auto flex gap-2">
                             <Button label="批量拒絕" icon="pi pi-times" severity="danger" size="small" :disabled="!selectedAudits.length" @click="batchAudit('reject')" />
                             <Button label="批量通過" icon="pi pi-check" severity="success" size="small" :disabled="!selectedAudits.length" @click="batchAudit('approve')" />
                        </div>
                    </div>

                    <DataTable v-model:selection="selectedAudits" :value="auditQueue" dataKey="id" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
                         <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                         <Column field="memberAccount" header="會員帳號" style="min-width: 120px">
                             <template #body="slotProps">
                                <span class="text-white">{{ slotProps.data.memberAccount }}</span>
                            </template>
                        </Column>
                        <Column field="activityName" header="申請活動" style="min-width: 150px"></Column>
                         <Column header="流水達成狀況 (目前/目標)" style="min-width: 200px">
                             <template #body="slotProps">
                                <div class="flex items-center gap-2 font-mono">
                                    <span :class="slotProps.data.currentTurnover >= slotProps.data.targetTurnover ? 'text-green-400' : 'text-yellow-400'">
                                        {{ formatCurrency(slotProps.data.currentTurnover) }}
                                    </span>
                                    <span class="text-surface-500">/</span>
                                    <span class="text-surface-300">{{ formatCurrency(slotProps.data.targetTurnover) }}</span>
                                </div>
                                <ProgressBar :value="Math.min(100, Math.floor(slotProps.data.currentTurnover / slotProps.data.targetTurnover * 100))" class="h-1 mt-1" :showValue="false" />
                            </template>
                        </Column>
                        <Column field="applyTime" header="申請時間" style="min-width: 150px"></Column>
                    </DataTable>
                 </div>
            </TabPanel>
         </TabView>
    </div>

    <!-- Activity Editor Dialog -->
    <Dialog v-model:visible="activityDialogVisible" modal :header="currentActivity.id ? '編輯優惠活動' : '新增優惠活動'" :style="{ width: '500px' }">
        <div class="space-y-4 p-2">
             <div class="flex flex-col gap-2">
                <label class="text-surface-300 text-sm">活動名稱</label>
                <InputText v-model="currentActivity.name" placeholder="請輸入活動名稱" class="w-full" />
            </div>
             <div class="flex flex-col gap-2">
                <label class="text-surface-300 text-sm">活動類型</label>
                <Dropdown v-model="currentActivity.type" :options="activityTypes" placeholder="選擇類型" class="w-full" />
            </div>
             
             <div class="grid grid-cols-2 gap-4">
                 <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">流水倍數 (x)</label>
                    <div style="width: 100px">
                        <InputNumber v-model="currentActivity.turnoverMulti" :min="1" :max="50" class="w-full" inputClass="text-center" />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">活動狀態</label>
                    <Dropdown v-model="currentActivity.status" :options="['啟用', '停用']" class="w-full" />
                </div>
             </div>

             <div class="bg-surface-900 p-3 rounded space-y-3 border border-surface-700">
                <div class="text-sm text-white font-medium mb-2">出資分攤設定 (總和 100%)</div>
                <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <label class="text-surface-400 text-xs block mb-1">平台出資 %</label>
                        <div style="width: 100px">
                             <InputNumber v-model="currentActivity.platformShare" :min="0" :max="100" suffix="%" class="w-full" inputClass="text-center" @input="updateAgentShare" />
                        </div>
                    </div>
                    <div class="flex-1">
                        <label class="text-surface-400 text-xs block mb-1">代理出資 %</label>
                        <div style="width: 100px">
                             <InputNumber v-model="currentActivity.agentShare" :min="0" :max="100" suffix="%" class="w-full" inputClass="text-center" disabled />
                        </div>
                    </div>
                </div>
             </div>
        </div>
        <template #footer>
            <Button label="取消" text severity="secondary" @click="activityDialogVisible = false" />
            <Button label="儲存設定" severity="success" icon="pi pi-check" @click="saveActivity" />
        </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import ProgressBar from 'primevue/progressbar'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const toast = useToast()
const confirm = useConfirm()

const activeTab = ref(0)
const activities = ref<any[]>([])
const auditQueue = ref<any[]>([])
const selectedAudits = ref<any[]>([])
const activityDialogVisible = ref(false)

const currentActivity = ref<any>({
    id: null,
    name: '',
    type: '',
    status: '啟用',
    platformShare: 70,
    agentShare: 30,
    turnoverMulti: 1
})

const activityTypes = ['首存優惠', '續存優惠', '虧損救濟', '流水返利']

onMounted(() => {
    generateMockData()
})

const openActivityDialog = (activity: any = null) => {
    if (activity) {
        currentActivity.value = { ...activity }
    } else {
        currentActivity.value = {
            id: null,
            name: '',
            type: '首存優惠',
            status: '啟用',
            platformShare: 70,
            agentShare: 30,
            turnoverMulti: 1
        }
    }
    activityDialogVisible.value = true
}

const updateAgentShare = () => {
    if (currentActivity.value.platformShare > 100) currentActivity.value.platformShare = 100
    currentActivity.value.agentShare = 100 - currentActivity.value.platformShare
}

const saveActivity = () => {
    toast.add({ severity: 'success', summary: '儲存成功', detail: '優惠活動設定已更新', life: 2000 })
    activityDialogVisible.value = false
    // Reload data logic here
}

const deleteActivity = (activity: any) => {
    confirm.require({
        message: `確定要刪除活動 ${activity.name} 嗎？`,
        header: '刪除確認',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => {
             toast.add({ severity: 'success', summary: '刪除成功', life: 2000 })
        }
    })
}

const batchAudit = (action: 'approve' | 'reject') => {
    const count = selectedAudits.value.length
    const summary = action === 'approve' ? '批量通過成功' : '批量拒絕成功'
    const severity = action === 'approve' ? 'success' : 'warn' // Changed from warning to warn
    
    toast.add({ severity: severity, summary: summary, detail: `已處理 ${count} 筆申請`, life: 2000 })
    selectedAudits.value = []
}

const generateMockData = () => {
    activities.value = [
        { id: 1, name: '新會員首存送 100%', type: '首存優惠', platformShare: 70, agentShare: 30, turnoverMulti: 15, status: '啟用' },
        { id: 2, name: '週末續存紅利', type: '續存優惠', platformShare: 50, agentShare: 50, turnoverMulti: 10, status: '啟用' },
        { id: 3, name: 'VIP 虧損補貼', type: '虧損救濟', platformShare: 100, agentShare: 0, turnoverMulti: 1, status: '停用' }
    ]

    auditQueue.value = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        memberAccount: `player_${String(i + 1).padStart(3, '0')}`,
        activityName: i % 2 === 0 ? '新會員首存送 100%' : '週末續存紅利',
        currentTurnover: Math.floor(Math.random() * 50000),
        targetTurnover: 50000,
        applyTime: '2024/01/08 14:00'
    }))
}

const getStatusSeverity = (status: string) => {
    return status === '啟用' ? 'success' : 'danger'
}

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)

</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-tabview .p-tabview-nav) { background: transparent; }
:deep(.p-tabview .p-tabview-panels) { background: transparent; padding: 1rem 0; }
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: rgba(30, 41, 59, 0.5); color: #94a3b8; border-color: rgba(71, 85, 105, 0.5); padding: 0.75rem 1rem; font-weight: 600; }
:deep(.p-datatable .p-datatable-tbody > tr) { background-color: transparent; }
:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) { background-color: rgba(30, 41, 59, 0.3); }
:deep(.p-datatable .p-datatable-tbody > tr > td) { border-color: rgba(71, 85, 105, 0.3); padding: 0.75rem 1rem; }
:deep(.p-inputtext), :deep(.p-dropdown), :deep(.p-inputnumber-input) { background-color: rgba(30, 41, 59, 0.5); border-color: rgba(71, 85, 105, 0.5); }
</style>
