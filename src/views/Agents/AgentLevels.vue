<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-sitemap text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">代理管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">代理等級</span>
    </div>

    <!-- Agent Levels List -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-surface-0 text-lg">
            <i class="pi pi-star text-yellow-500 dark:text-yellow-400"></i>
            代理等級設定
          </div>
          <Button label="新增等級" icon="pi pi-plus" @click="openCreateDialog" />
        </div>
      </template>
      <template #content>
         <DataTable :value="levels" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
            <Column field="name" header="等級名稱" style="min-width: 150px">
                 <template #body="slotProps">
                     <div class="flex items-center gap-2">
                         <i :class="['pi', slotProps.data.icon, slotProps.data.color, 'text-xl']"></i>
                         <span class="text-surface-900 dark:text-surface-0 font-bold">{{ slotProps.data.name }}</span>
                     </div>
                </template>
            </Column>
            <Column header="晉升條件" style="min-width: 280px">
                 <template #body="slotProps">
                     <div class="space-y-1">
                         <div class="flex items-center gap-2 text-sm">
                             <i class="pi pi-users text-blue-400 text-xs"></i>
                             <span class="text-surface-400">活躍會員數 ≥</span>
                             <span class="text-green-400 font-mono font-bold">{{ slotProps.data.activeMembers }}</span>
                             <span class="text-surface-400">人</span>
                         </div>
                         <div class="flex items-center gap-2 text-sm">
                             <i class="pi pi-dollar text-yellow-400 text-xs"></i>
                             <span class="text-surface-400">團隊淨盈虧 ≥</span>
                             <span class="text-green-400 font-mono font-bold">{{ formatCurrency(slotProps.data.teamPL) }}</span>
                         </div>
                     </div>
                </template>
            </Column>
            <Column field="commissionBonus" header="佣金加成" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono text-yellow-400 font-bold text-lg">+{{ slotProps.data.commissionBonus }}%</span>
                </template>
            </Column>
            <Column field="agentCount" header="代理人數" style="min-width: 100px">
                 <template #body="slotProps">
                     <span class="font-mono text-surface-900 dark:text-surface-0 font-bold">{{ slotProps.data.agentCount }}</span>
                </template>
            </Column>
            <Column field="status" header="狀態" style="min-width: 100px">
                 <template #body="slotProps">
                    <InputSwitch v-model="slotProps.data.enabled" @change="toggleLevelStatus(slotProps.data)" />
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

    <!-- Level Editor Dialog -->
    <Dialog v-model:visible="editorDialogVisible" modal :header="isEditMode ? '編輯等級' : '新增等級'" :style="{ width: '600px' }">
        <div v-if="currentLevel" class="space-y-4 p-4">
            <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                    <label class="text-surface-700 dark:text-surface-300 text-sm font-medium mb-2 block">等級名稱</label>
                    <InputText v-model="currentLevel.name" placeholder="輸入等級名稱" class="w-full" />
                </div>
                
                <div>
                    <label class="text-surface-700 dark:text-surface-300 text-sm font-medium mb-2 block">圖標</label>
                    <Dropdown v-model="currentLevel.icon" :options="iconOptions" optionLabel="label" optionValue="value" placeholder="選擇圖標" class="w-full">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <i :class="['pi', slotProps.option.value]"></i>
                                <span>{{ slotProps.option.label }}</span>
                            </div>
                        </template>
                    </Dropdown>
                </div>
                
                <div>
                    <label class="text-surface-700 dark:text-surface-300 text-sm font-medium mb-2 block">顏色</label>
                    <Dropdown v-model="currentLevel.color" :options="colorOptions" optionLabel="label" optionValue="value" placeholder="選擇顏色" class="w-full">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <div :class="['w-4 h-4 rounded', slotProps.option.value]"></div>
                                <span>{{ slotProps.option.label }}</span>
                            </div>
                        </template>
                    </Dropdown>
                </div>
            </div>

            <div class="border-t border-surface-200 dark:border-surface-700 pt-4">
                <h4 class="text-surface-900 dark:text-surface-0 font-semibold mb-3">晉升條件</h4>
                <div class="space-y-3">
                    <div>
                        <label class="text-surface-700 dark:text-surface-300 text-sm font-medium mb-2 block">月活躍會員數 (人)</label>
                        <InputNumber v-model="currentLevel.activeMembers" :min="0" class="w-[220px]" showButtons />
                    </div>
                    <div>
                        <label class="text-surface-700 dark:text-surface-300 text-sm font-medium mb-2 block">月團隊淨盈虧 (元)</label>
                        <InputNumber v-model="currentLevel.teamPL" :min="0" :step="1000" class="w-[220px]" showButtons mode="currency" currency="TWD" locale="zh-TW" />
                    </div>
                </div>
            </div>

            <div class="border-t border-surface-200 dark:border-surface-700 pt-4">
                <h4 class="text-surface-900 dark:text-surface-0 font-semibold mb-3">獎勵設定</h4>
                <div>
                    <label class="text-surface-700 dark:text-surface-300 text-sm font-medium mb-2 block">額外佣金比率 (%)</label>
                    <InputNumber v-model="currentLevel.commissionBonus" :min="0" :max="50" suffix="%" class="w-[220px]" showButtons />
                </div>
            </div>
        </div>

        <template #footer>
            <Button label="取消" severity="secondary" outlined @click="editorDialogVisible = false" />
            <Button label="儲存" severity="success" @click="saveLevel" />
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

const levels = ref<any[]>([])
const editorDialogVisible = ref(false)
const currentLevel = ref<any>(null)
const isEditMode = ref(false)

const iconOptions = ref([
    { label: '星星', value: 'pi-star' },
    { label: '獎杯', value: 'pi-trophy' },
    { label: '皇冠', value: 'pi-crown' },
    { label: '鑽石', value: 'pi-diamond' },
    { label: '火焰', value: 'pi-fire' },
])

const colorOptions = ref([
    { label: '灰色', value: 'text-gray-400' },
    { label: '藍色', value: 'text-blue-400' },
    { label: '紫色', value: 'text-purple-400' },
    { label: '黃色', value: 'text-yellow-400' },
    { label: '紅色', value: 'text-red-400' },
])

const openCreateDialog = () => {
    isEditMode.value = false
    currentLevel.value = {
        id: Date.now(),
        name: '',
        icon: 'pi-star',
        color: 'text-gray-400',
        activeMembers: 0,
        teamPL: 0,
        commissionBonus: 0,
        agentCount: 0,
        enabled: true
    }
    editorDialogVisible.value = true
}

const openEditDialog = (level: any) => {
    isEditMode.value = true
    currentLevel.value = { ...level }
    editorDialogVisible.value = true
}

const saveLevel = () => {
    if (isEditMode.value) {
        const index = levels.value.findIndex(l => l.id === currentLevel.value.id)
        if (index !== -1) {
            levels.value[index] = { ...currentLevel.value }
        }
        toast.add({ severity: 'success', summary: '更新成功', detail: '等級已更新', life: 2000 })
    } else {
        levels.value.push({ ...currentLevel.value })
        toast.add({ severity: 'success', summary: '新增成功', detail: '等級已新增', life: 2000 })
    }
    editorDialogVisible.value = false
}

const toggleLevelStatus = (level: any) => {
    toast.add({ 
        severity: level.enabled ? 'success' : 'warn', 
        summary: '狀態已更新', 
        detail: `${level.name} 已${level.enabled ? '啟用' : '停用'}`, 
        life: 2000 
    })
}

const confirmDelete = (level: any) => {
    confirm.require({
        message: `確定要刪除「${level.name}」？此操作無法復原。`,
        header: '確認刪除',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: '刪除',
        rejectLabel: '取消',
        accept: () => {
            const index = levels.value.findIndex(l => l.id === level.id)
            if (index !== -1) {
                levels.value.splice(index, 1)
                toast.add({ severity: 'success', summary: '刪除成功', detail: '等級已刪除', life: 2000 })
            }
        }
    })
}

const generateMockData = () => {
    levels.value = [
        {
            id: 1,
            name: '實習代理',
            icon: 'pi-star',
            color: 'text-gray-400',
            activeMembers: 5,
            teamPL: 10000,
            commissionBonus: 0,
            agentCount: 15,
            enabled: true
        },
        {
            id: 2,
            name: '銅牌代理',
            icon: 'pi-shield',
            color: 'text-orange-600',
            activeMembers: 20,
            teamPL: 50000,
            commissionBonus: 5,
            agentCount: 8,
            enabled: true
        },
        {
            id: 3,
            name: '銀牌代理',
            icon: 'pi-trophy',
            color: 'text-gray-300',
            activeMembers: 50,
            teamPL: 150000,
            commissionBonus: 10,
            agentCount: 5,
            enabled: true
        },
        {
            id: 4,
            name: '金牌代理',
            icon: 'pi-crown',
            color: 'text-yellow-400',
            activeMembers: 100,
            teamPL: 500000,
            commissionBonus: 15,
            agentCount: 2,
            enabled: true
        },
        {
            id: 5,
            name: '鑽石總代',
            icon: 'pi-star-fill',
            color: 'text-purple-400',
            activeMembers: 200,
            teamPL: 1000000,
            commissionBonus: 25,
            agentCount: 1,
            enabled: true
        },
    ]
}

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1.5rem; }
:deep(.p-datatable-tbody > tr > td) { padding: 0.75rem 1rem; }
:deep(.p-inputnumber-input) { text-align: center; }
</style>
