<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-gift text-blue-400"></i>
      <span class="text-surface-300">推廣活動</span>
      <span>></span>
      <span class="text-white font-medium">活動設置</span>
    </div>

    <!-- Template Selector -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div v-for="tpl in templates" :key="tpl.id" 
             @click="openTemplateDialog(tpl)"
             class="bg-surface-800/50 border border-surface-700 hover:border-blue-500 hover:bg-surface-800 p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 group">
            <div class="w-12 h-12 rounded-full bg-surface-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <i :class="['pi text-xl', tpl.icon, 'text-blue-400']"></i>
            </div>
            <span class="text-surface-300 group-hover:text-white font-medium text-sm">{{ tpl.name }}</span>
        </div>
    </div>

    <!-- Event List DataTable -->
    <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
             <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-white text-lg">
                    <i class="pi pi-list text-blue-400"></i>
                    已設置活動清單
                </div>
             </div>
        </template>
        <template #content>
             <DataTable :value="eventList" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
                <Column field="name" header="活動名稱" style="min-width: 150px">
                     <template #body="slotProps">
                        <div class="flex flex-col">
                            <span class="text-white font-medium">{{ slotProps.data.name }}</span>
                            <span class="text-xs text-surface-500">{{ getTemplateName(slotProps.data.type) }}</span>
                        </div>
                    </template>
                </Column>
                <Column header="版本歸屬" style="min-width: 100px">
                     <template #body="slotProps">
                        <Tag :value="slotProps.data.version === 'platform' ? '包網版' : '上架版'" :severity="slotProps.data.version === 'platform' ? 'info' : 'warning'" />
                    </template>
                </Column>
                <Column header="出資佔比 (平台/代理)" style="min-width: 180px">
                     <template #body="slotProps">
                        <div class="flex items-center gap-2 text-sm font-mono">
                            <span class="text-blue-400">{{ slotProps.data.platformShare }}%</span>
                            <span class="text-surface-500">/</span>
                            <span class="text-green-400">{{ slotProps.data.agentShare }}%</span>
                        </div>
                    </template>
                </Column>
                <Column header="獎勵規則" style="min-width: 200px">
                     <template #body="slotProps">
                        <div class="text-xs text-surface-400">
                            <div>紅利: {{ formatCurrency(slotProps.data.bonus) }}</div>
                            <div>流水: {{ slotProps.data.turnoverMulti }}x</div>
                        </div>
                    </template>
                </Column>
                <Column header="狀態" style="min-width: 100px">
                     <template #body="slotProps">
                         <InputSwitch v-model="slotProps.data.status" />
                    </template>
                </Column>
                <Column header="操作" style="min-width: 100px">
                     <template #body="slotProps">
                        <div class="flex gap-2">
                             <Button icon="pi pi-pencil" size="small" outlined severity="info" rounded @click="editEvent(slotProps.data)" />
                             <!-- Isolated Delete Button -->
                             <Button icon="pi pi-trash" size="small" text severity="danger" rounded @click="deleteEvent(slotProps.data)" />
                        </div>
                    </template>
                </Column>
             </DataTable>
        </template>
    </Card>

    <!-- Config Dialog -->
    <Dialog v-model:visible="dialogVisible" modal :header="`配置 - ${getCurrentTemplateName(currentConfig.type)}`" :style="{ width: '600px' }">
        <div class="space-y-6 py-2">
            <!-- Basic Info -->
            <div class="grid grid-cols-2 gap-4">
                 <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">活動名稱</label>
                    <InputText v-model="currentConfig.name" placeholder="請輸入活動名稱" class="w-full" />
                </div>
                 <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">版本歸屬</label>
                    <Dropdown v-model="currentConfig.version" :options="versionOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
            </div>

            <!-- Cost Sharing -->
            <div class="bg-surface-900 p-4 rounded border border-surface-700 space-y-4">
                <div class="text-sm font-bold text-white mb-2 border-b border-surface-700 pb-2">出資佔比設定</div>
                <div class="flex items-center gap-4">
                    <div class="flex-1">
                        <label class="text-surface-400 text-xs block mb-1">平台出資 %</label>
                        <div style="width: 100px">
                            <InputNumber v-model="currentConfig.platformShare" :min="0" :max="100" suffix="%" class="w-full" inputClass="text-center" @input="updateAgentShare" />
                        </div>
                    </div>
                        <div class="flex-1">
                        <label class="text-surface-400 text-xs block mb-1">代理出資 %</label>
                        <div style="width: 100px">
                            <InputNumber v-model="currentConfig.agentShare" :min="0" :max="100" suffix="%" class="w-full" inputClass="text-center" disabled />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Template Specific Logic -->
            <div v-if="currentConfig.type === 'ranking'" class="bg-blue-900/20 p-4 rounded border border-blue-800 space-y-4">
                <div class="text-sm font-bold text-blue-300 mb-2">排行榜設定</div>
                <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">統計維度</label>
                    <Dropdown v-model="currentConfig.rankingType" :options="rankingOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
            </div>

            <!-- Reward Standards -->
             <div class="grid grid-cols-2 gap-4">
                 <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">紅利金額上限</label>
                    <InputNumber v-model="currentConfig.bonus" mode="currency" currency="TWD" locale="zh-TW" class="w-full" />
                </div>
                 <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">流水倍數 (x)</label>
                    <div style="width: 100px">
                         <InputNumber v-model="currentConfig.turnoverMulti" :min="1" :max="50" suffix="x" class="w-full" inputClass="text-center" />
                    </div>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="取消" text severity="secondary" @click="dialogVisible = false" />
            <Button label="儲存設定" severity="success" icon="pi pi-check" @click="saveConfig" />
        </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputSwitch from 'primevue/inputswitch'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const toast = useToast()
const confirm = useConfirm()

const templates = [
    { id: 'first_deposit', name: '首存優惠', icon: 'pi-star-fill' },
    { id: 're_deposit', name: '續存優惠', icon: 'pi-refresh' },
    { id: 'rescue', name: '虧損救濟', icon: 'pi-heart-fill' },
    { id: 'rebate', name: '流水返利', icon: 'pi-money-bill' },
    { id: 'game_promo', name: '遊戲推廣', icon: 'pi-play' },
    { id: 'ranking', name: '排行榜', icon: 'pi-list' }
]

const versionOptions = [
    { label: '包網版 (Platform)', value: 'platform' },
    { label: '上架版 (SaaS)', value: 'saas' }
]

const rankingOptions = [
    { label: '贏分倍率 (Win Rate)', value: 'win_rate' },
    { label: '總贏分 (Total Win)', value: 'total_win' },
    { label: '總投注 (Total Bet)', value: 'total_bet' }
]

const eventList = ref<any[]>([
    { id: 1, name: '春節首存大紅包', type: 'first_deposit', version: 'platform', platformShare: 70, agentShare: 30, bonus: 5000, turnoverMulti: 15, status: true },
    { id: 2, name: '百家樂連贏榜', type: 'ranking', version: 'saas', platformShare: 0, agentShare: 100, bonus: 10000, turnoverMulti: 1, status: true }
])

const dialogVisible = ref(false)
const currentConfig = ref<any>({})

const openTemplateDialog = (tpl: any) => {
    currentConfig.value = {
        id: null,
        type: tpl.id,
        name: '',
        version: 'platform',
        platformShare: 70,
        agentShare: 30,
        bonus: 1000,
        turnoverMulti: 10,
        rankingType: 'win_rate'
    }
    dialogVisible.value = true
}

const editEvent = (event: any) => {
    currentConfig.value = { ...event }
    dialogVisible.value = true
}

const updateAgentShare = () => {
    if (currentConfig.value.platformShare > 100) currentConfig.value.platformShare = 100
    currentConfig.value.agentShare = 100 - currentConfig.value.platformShare
}

const saveConfig = () => {
    if (currentConfig.value.id) {
        const index = eventList.value.findIndex(e => e.id === currentConfig.value.id)
        if (index !== -1) eventList.value[index] = { ...currentConfig.value }
    } else {
        eventList.value.push({ ...currentConfig.value, id: Date.now(), status: true })
    }
    dialogVisible.value = false
    toast.add({ severity: 'success', summary: '儲存成功', detail: '活動配置已更新', life: 2000 })
}

const deleteEvent = (event: any) => {
    confirm.require({
        message: `確定要刪除活動 ${event.name} 嗎？`,
        header: '刪除確認',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => {
             const index = eventList.value.findIndex(e => e.id === event.id)
             if (index !== -1) eventList.value.splice(index, 1)
             toast.add({ severity: 'success', summary: '刪除成功', life: 2000 })
        }
    })
}

const getTemplateName = (type: string) => templates.find(t => t.id === type)?.name || type
const getCurrentTemplateName = (type: string) => getTemplateName(type)
const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: rgba(30, 41, 59, 0.5); color: #94a3b8; border-color: rgba(71, 85, 105, 0.5); padding: 0.75rem 1rem; font-weight: 600; }
:deep(.p-datatable .p-datatable-tbody > tr) { background-color: transparent; }
:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) { background-color: rgba(30, 41, 59, 0.3); }
:deep(.p-datatable .p-datatable-tbody > tr > td) { border-color: rgba(71, 85, 105, 0.3); padding: 0.75rem 1rem; }
:deep(.p-inputnumber-input) { text-align: center; } /* Reinforce center align */
</style>
