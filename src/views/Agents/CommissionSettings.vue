<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-sitemap text-blue-400"></i>
      <span class="text-surface-300">代理管理</span>
      <span>></span>
      <span class="text-white font-medium">佣金設定</span>
    </div>

    <!-- Commission Schemes List -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white text-lg">
            <i class="pi pi-percentage text-green-400"></i>
            佣金方案管理
          </div>
          <Button label="新增方案" icon="pi pi-plus" @click="openCreateDialog" />
        </div>
      </template>
      <template #content>
         <DataTable :value="schemes" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <Column field="name" header="方案名稱" style="min-width: 180px">
                 <template #body="slotProps">
                     <div class="flex items-center gap-2">
                         <i class="pi pi-bookmark text-purple-400"></i>
                         <span class="text-white font-bold">{{ slotProps.data.name }}</span>
                     </div>
                </template>
            </Column>
            <Column field="agentCount" header="適用代理數" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono text-blue-400 font-bold">{{ slotProps.data.agentCount }}</span>
                </template>
            </Column>
            <Column field="settlementCycle" header="結算週期" style="min-width: 100px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.settlementCycle" severity="info" />
                </template>
            </Column>
            <Column field="lastModified" header="最後修改" style="min-width: 160px">
                 <template #body="slotProps">
                     <span class="text-sm text-surface-400">{{ slotProps.data.lastModified }}</span>
                </template>
            </Column>
            <Column field="enabled" header="狀態" style="min-width: 100px">
                 <template #body="slotProps">
                    <InputSwitch v-model="slotProps.data.enabled" @change="toggleSchemeStatus(slotProps.data)" />
                </template>
            </Column>
            <Column header="操作" style="min-width: 150px">
                 <template #body="slotProps">
                     <div class="flex gap-2">
                         <Button icon="pi pi-pencil" size="small" outlined severity="info" @click="openEditDialog(slotProps.data)" v-tooltip.top="'編輯'" />
                         <Button icon="pi pi-trash" size="small" outlined severity="danger" @click="confirmDelete(slotProps.data)" v-tooltip.top="'刪除'" />
                     </div>
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <!-- Scheme Editor Dialog -->
    <Dialog v-model:visible="editorDialogVisible" modal :header="isEditMode ? '編輯佣金方案' : '新增佣金方案'" :style="{ width: '900px' }">
        <div v-if="currentScheme" class="space-y-4 p-4">
            <!-- Basic Settings -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-surface-300 text-sm font-medium mb-2 block">方案名稱</label>
                    <InputText v-model="currentScheme.name" placeholder="輸入方案名稱" class="w-full" />
                </div>
                <div>
                    <label class="text-surface-300 text-sm font-medium mb-2 block">結算週期</label>
                    <Dropdown v-model="currentScheme.settlementCycle" :options="cycleOptions" placeholder="選擇週期" class="w-full" />
                </div>
            </div>

            <!-- Tier Settings -->
            <div class="border-t border-surface-700 pt-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-white font-semibold">佔成階梯設定</h4>
                    <Button label="新增階梯" icon="pi pi-plus" size="small" @click="addTier" />
                </div>
                <div class="space-y-2">
                    <div v-for="(tier, index) in currentScheme.tiers" :key="index" class="flex items-center gap-3 p-3 bg-surface-900 rounded">
                        <span class="text-surface-400 text-sm">月淨盈利 ≥</span>
                        <div style="width: 220px">
                            <InputNumber v-model="tier.minProfit" :min="0" :step="10000" mode="currency" currency="TWD" locale="zh-TW" class="w-full" inputClass="text-center" />
                        </div>
                        <span class="text-surface-400 text-sm">佔成比例</span>
                        <div style="width: 100px">
                            <InputNumber v-model="tier.percentage" :min="0" :max="100" suffix="%" class="w-full" inputClass="text-center" />
                        </div>
                        <Button icon="pi pi-trash" severity="danger" text @click="removeTier(Number(index))" v-tooltip.top="'刪除'" />
                    </div>
                </div>
            </div>

            <!-- Game Category Adjustments -->
            <div class="border-t border-surface-700 pt-4">
                <h4 class="text-white font-semibold mb-3">遊戲類別加成調整</h4>
                <div class="grid grid-cols-3 gap-3">
                    <div>
                        <label class="text-surface-300 text-sm block mb-2">真人遊戲加成 (%)</label>
                        <div style="width: 100px">
                            <InputNumber v-model="currentScheme.categoryAdjustments.live" :min="-50" :max="50" suffix="%" class="w-full" inputClass="text-center" />
                        </div>
                    </div>
                    <div>
                        <label class="text-surface-300 text-sm block mb-2">電子遊戲加成 (%)</label>
                        <div style="width: 100px">
                            <InputNumber v-model="currentScheme.categoryAdjustments.slot" :min="-50" :max="50" suffix="%" class="w-full" inputClass="text-center" />
                        </div>
                    </div>
                    <div>
                        <label class="text-surface-300 text-sm block mb-2">體育投注加成 (%)</label>
                        <div style="width: 100px">
                            <InputNumber v-model="currentScheme.categoryAdjustments.sports" :min="-50" :max="50" suffix="%" class="w-full" inputClass="text-center" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cost Sharing -->
            <div class="border-t border-surface-700 pt-4">
                <h4 class="text-white font-semibold mb-3">費用分攤設定</h4>
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-surface-900 rounded">
                        <div class="flex items-center gap-2">
                            <InputSwitch v-model="currentScheme.costSharing.bonusDeduction.enabled" />
                            <span class="text-white">紅利扣除</span>
                        </div>
                        <div v-if="currentScheme.costSharing.bonusDeduction.enabled" class="flex items-center gap-2">
                            <span class="text-surface-400 text-sm">扣除比例</span>
                            <div style="width: 100px">
                                <InputNumber v-model="currentScheme.costSharing.bonusDeduction.percentage" :min="0" :max="100" suffix="%" class="w-full" inputClass="text-center" />
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-surface-900 rounded">
                        <div class="flex items-center gap-2">
                            <InputSwitch v-model="currentScheme.costSharing.platformFee.enabled" />
                            <span class="text-white">場館費扣除</span>
                        </div>
                        <div v-if="currentScheme.costSharing.platformFee.enabled" class="flex items-center gap-2">
                            <span class="text-surface-400 text-sm">扣除比例</span>
                            <div style="width: 100px">
                                <InputNumber v-model="currentScheme.costSharing.platformFee.percentage" :min="0" :max="100" suffix="%" class="w-full" inputClass="text-center" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="取消" severity="secondary" outlined @click="editorDialogVisible = false" />
            <Button label="儲存" severity="success" @click="saveScheme" />
        </template>
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
import InputSwitch from 'primevue/inputswitch'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const toast = useToast()
const confirm = useConfirm()

onMounted(() => {
    generateMockData()
})

const schemes = ref<any[]>([])
const editorDialogVisible = ref(false)
const currentScheme = ref<any>(null)
const isEditMode = ref(false)

const cycleOptions = ref(['日', '週', '月'])

const openCreateDialog = () => {
    isEditMode.value = false
    currentScheme.value = {
        id: Date.now(),
        name: '',
        agentCount: 0,
        settlementCycle: '月',
        lastModified: new Date().toISOString().split('T')[0],
        enabled: true,
        tiers: [
            { minProfit: 0, percentage: 0 }
        ],
        categoryAdjustments: { live: 0, slot: 0, sports: 0 },
        costSharing: {
            bonusDeduction: { enabled: false, percentage: 0 },
            platformFee: { enabled: false, percentage: 0 }
        }
    }
    editorDialogVisible.value = true
}

const openEditDialog = (scheme: any) => {
    isEditMode.value = true
    currentScheme.value = JSON.parse(JSON.stringify(scheme))
    editorDialogVisible.value = true
}

const addTier = () => {
    currentScheme.value.tiers.push({ minProfit: 0, percentage: 0 })
}

const removeTier = (index: number) => {
    currentScheme.value.tiers.splice(index, 1)
}

const saveScheme = () => {
    if (isEditMode.value) {
        const index = schemes.value.findIndex(s => s.id === currentScheme.value.id)
        if (index !== -1) {
            schemes.value[index] = { ...currentScheme.value }
        }
        toast.add({ severity: 'success', summary: '更新成功', detail: '佣金方案已更新', life: 2000 })
    } else {
        schemes.value.push({ ...currentScheme.value })
        toast.add({ severity: 'success', summary: '新增成功', detail: '佣金方案已新增', life: 2000 })
    }
    editorDialogVisible.value = false
}

const toggleSchemeStatus = (scheme: any) => {
    toast.add({ 
        severity: scheme.enabled ? 'success' : 'warn', 
        summary: '狀態已更新', 
        detail: `${scheme.name} 已${scheme.enabled ? '啟用' : '停用'}`, 
        life: 2000 
    })
}

const confirmDelete = (scheme: any) => {
    confirm.require({
        message: `確定要刪除「${scheme.name}」？此操作無法復原。`,
        header: '確認刪除',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: '刪除',
        rejectLabel: '取消',
        accept: () => {
            const index = schemes.value.findIndex(s => s.id === scheme.id)
            if (index !== -1) {
                schemes.value.splice(index, 1)
                toast.add({ severity: 'success', summary: '刪除成功', detail: '方案已刪除', life: 2000 })
            }
        }
    })
}

const generateMockData = () => {
    schemes.value = [
        {
            id: 1,
            name: '全能代理 A 方案 (階梯佔成)',
            agentCount: 25,
            settlementCycle: '月',
            lastModified: '2024-01-05',
            enabled: true,
            tiers: [
                { minProfit: 0, percentage: 30 },
                { minProfit: 100000, percentage: 35 },
                { minProfit: 500000, percentage: 40 },
                { minProfit: 1000000, percentage: 45 }
            ],
            categoryAdjustments: { live: 0, slot: 0, sports: 0 },
            costSharing: {
                bonusDeduction: { enabled: true, percentage: 50 },
                platformFee: { enabled: true, percentage: 20 }
            }
        },
        {
            id: 2,
            name: '電子遊戲專攻方案 (固定高返佣)',
            agentCount: 8,
            settlementCycle: '週',
            lastModified: '2024-01-03',
            enabled: true,
            tiers: [
                { minProfit: 0, percentage: 45 }
            ],
            categoryAdjustments: { live: -5, slot: 10, sports: -10 },
            costSharing: {
                bonusDeduction: { enabled: false, percentage: 0 },
                platformFee: { enabled: true, percentage: 15 }
            }
        }
    ]
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: rgba(30, 41, 59, 0.5); color: #94a3b8; border-color: rgba(71, 85, 105, 0.5); padding: 0.75rem 1rem; font-weight: 600; }
:deep(.p-datatable .p-datatable-tbody > tr) { background-color: transparent; }
:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) { background-color: rgba(30, 41, 59, 0.3); }
:deep(.p-datatable .p-datatable-tbody > tr > td) { border-color: rgba(71, 85, 105, 0.3); padding: 0.75rem 1rem; }
:deep(.p-datatable .p-datatable-tbody > tr:hover) { background-color: rgba(59, 130, 246, 0.1); }
:deep(.p-inputtext), :deep(.p-dropdown), :deep(.p-inputnumber) { background-color: rgba(30, 41, 59, 0.5); border-color: rgba(71, 85, 105, 0.5); }
</style>
