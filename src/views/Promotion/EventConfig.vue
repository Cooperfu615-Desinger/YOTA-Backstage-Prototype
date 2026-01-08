<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-gift text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">推廣活動</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">活動設置</span>
    </div>

    <!-- Template Selector -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div v-for="tpl in templates" :key="tpl.id" 
             @click="openTemplateDialog(tpl)"
             class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-blue-500 hover:bg-surface-100 dark:hover:bg-surface-700 p-4 rounded-xl cursor-pointer transition-all flex flex-col items-center gap-2 group">
            <div class="w-12 h-12 rounded-full bg-surface-200 dark:bg-surface-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                <i :class="['pi text-xl', tpl.icon, 'text-blue-500 dark:text-blue-400']"></i>
            </div>
            <span class="text-surface-600 dark:text-surface-300 group-hover:text-surface-900 dark:group-hover:text-white font-medium text-sm">{{ tpl.name }}</span>
        </div>
    </div>

    <!-- Event List DataTable -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
             <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
                    <i class="pi pi-list text-blue-500 dark:text-blue-400"></i>
                    已設置活動清單
                </div>
             </div>
        </template>
        <template #content>
             <DataTable :value="eventList" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
                <Column field="name" header="活動名稱" style="min-width: 150px">
                     <template #body="slotProps">
                        <div class="flex flex-col">
                            <span class="text-surface-900 dark:text-white font-medium">{{ slotProps.data.name }}</span>
                            <span class="text-xs text-surface-500">{{ getTemplateName(slotProps.data.type) }}</span>
                        </div>
                    </template>
                </Column>
                <Column header="版本歸屬" style="min-width: 100px">
                     <template #body="slotProps">
                        <Tag :value="slotProps.data.version === 'platform' ? '包網版' : '上架版'" :severity="slotProps.data.version === 'platform' ? 'info' : 'warning'" />
                    </template>
                </Column>
                <Column header="出資模式" style="min-width: 120px">
                     <template #body="slotProps">
                        <Tag :value="getCostModeLabel(slotProps.data)" :severity="getCostModeSeverity(slotProps.data)" />
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
    <Dialog v-model:visible="dialogVisible" modal :header="`配置 - ${getCurrentTemplateName(currentConfig.type)}`" :style="{ width: '650px' }">
        <div class="space-y-6 py-2">
            <!-- Basic Info & Version -->
            <div class="grid grid-cols-2 gap-4">
                 <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">活動名稱</label>
                    <InputText v-model="currentConfig.name" placeholder="請輸入活動名稱" class="w-full" />
                </div>
                 <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">版本歸屬</label>
                    <Dropdown v-model="currentConfig.version" :options="versionOptions" optionLabel="label" optionValue="value" class="w-full" :disabled="isVersionLocked" />
                </div>
            </div>

            <!-- Cost Sharing - Optimized -->
            <div class="bg-surface-100 dark:bg-surface-900 p-4 rounded border border-surface-200 dark:border-surface-700 space-y-4">
                <div class="flex items-center justify-between border-b border-surface-200 dark:border-surface-700 pb-2">
                    <div class="text-sm font-bold text-surface-900 dark:text-white">出資模式設定</div>
                    <SelectButton v-model="currentConfig.costMode" :options="costModeOptions" optionLabel="label" optionValue="value" :allowEmpty="false" @change="handleCostModeChange" class="p-button-sm" />
                </div>
                
                <!-- Mixed Mode Input Area -->
                <div v-if="currentConfig.costMode === 'mixed'" class="flex items-center gap-4 animate-fade-in">
                    <div class="flex-1">
                        <label class="text-surface-500 dark:text-surface-400 text-xs block mb-1">平台出資 %</label>
                        <div style="width: 100px">
                            <InputNumber v-model="currentConfig.platformShare" :min="1" :max="99" suffix="%" class="w-full" inputClass="text-center" :showButtons="false" @input="updateAgentShare" />
                        </div>
                    </div>
                    <div class="flex-1">
                        <label class="text-surface-500 dark:text-surface-400 text-xs block mb-1">代理出資 %</label>
                        <div style="width: 100px">
                            <InputNumber v-model="currentConfig.agentShare" :min="1" :max="99" suffix="%" class="w-full" inputClass="text-center" disabled :showButtons="false" />
                        </div>
                    </div>
                </div>

                <!-- Info for Single Mode -->
                <div v-else class="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-300 bg-surface-50 dark:bg-surface-800/50 p-2 rounded">
                    <i class="pi pi-info-circle text-blue-500 dark:text-blue-400"></i>
                    <span>{{ currentConfig.costMode === 'platform' ? '所有成本由平台全額承擔 (Platform 100%)' : '所有成本由代理全額承擔 (Agent 100%)' }}</span>
                </div>
            </div>

            <!-- Game Promo Specifics -->
            <div v-if="currentConfig.type === 'game_promo'" class="bg-purple-900/20 p-4 rounded border border-purple-800 space-y-4">
                 <div class="text-sm font-bold text-purple-300 mb-2">遊戲推廣設定</div>
                 <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">指定遊戲 (多選)</label>
                    <MultiSelect v-model="currentConfig.selectedGames" :options="gameList" optionLabel="name" placeholder="請選擇遊戲" class="w-full" display="chip" filter />
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">獲獎條件</label>
                    <Dropdown v-model="currentConfig.winCondition" :options="winConditions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
            </div>

            <!-- Ranking Specifics -->
            <div v-if="currentConfig.type === 'ranking'" class="bg-blue-900/20 p-4 rounded border border-blue-800 space-y-4">
                <div class="text-sm font-bold text-blue-300 mb-2">排行榜設定</div>
                <div class="flex flex-col gap-2">
                    <label class="text-surface-300 text-sm">統計維度</label>
                    <Dropdown v-model="currentConfig.rankingType" :options="rankingOptions" optionLabel="label" optionValue="value" class="w-full" />
                </div>
            </div>

            <!-- Reward Standards (Version Aware) -->
             <div class="border-t border-surface-700 pt-4">
                 <div class="text-sm font-bold text-white mb-4">獎勵配置 ({{ currentConfig.version === 'platform' ? '包網模式' : '上架模式' }})</div>
                 
                 <!-- Platform Mode Fields -->
                 <div v-if="currentConfig.version === 'platform'" class="grid grid-cols-2 gap-4">
                     <div class="flex flex-col gap-2">
                        <label class="text-surface-300 text-sm">最低存款金額</label>
                        <InputNumber v-model="currentConfig.minDeposit" mode="currency" currency="TWD" locale="zh-TW" class="w-full" :showButtons="false" />
                    </div>
                     <div class="flex flex-col gap-2">
                        <label class="text-surface-300 text-sm">現金紅利 %</label>
                        <div style="width: 100px">
                             <InputNumber v-model="currentConfig.bonusPercent" :min="0" :max="100" suffix="%" class="w-full" inputClass="text-center" :showButtons="false" />
                        </div>
                    </div>
                     <div class="flex flex-col gap-2">
                        <label class="text-surface-300 text-sm">流水倍數 (Wagering)</label>
                        <div style="width: 100px">
                             <InputNumber v-model="currentConfig.turnoverMulti" :min="1" :max="50" suffix="x" class="w-full" inputClass="text-center" :showButtons="false" />
                        </div>
                    </div>
                </div>

                <!-- SaaS Mode Fields -->
                 <div v-else class="grid grid-cols-2 gap-4">
                     <div class="flex flex-col gap-2">
                        <label class="text-surface-300 text-sm">獎勵積分 (Points)</label>
                        <InputNumber v-model="currentConfig.rewardPoints" class="w-full" :showButtons="false" />
                    </div>
                     <div class="flex flex-col gap-2">
                        <label class="text-surface-300 text-sm">等級成長值 (EXP)</label>
                        <InputNumber v-model="currentConfig.expValue" class="w-full" :showButtons="false" />
                    </div>
                     <div class="flex flex-col gap-2">
                        <label class="text-surface-300 text-sm">虛擬福袋 (Lucky Bag)</label>
                        <InputNumber v-model="currentConfig.luckyBags" suffix=" 個" class="w-full" :showButtons="false" />
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
import { ref, computed } from 'vue'
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
import MultiSelect from 'primevue/multiselect'
import SelectButton from 'primevue/selectbutton'
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

const costModeOptions = [
    { label: '平台全額', value: 'platform' },
    { label: '共同分攤', value: 'mixed' },
    { label: '代理全額', value: 'agent' }
]

const rankingOptions = [
    { label: '贏分倍率 (Win Rate)', value: 'win_rate' },
    { label: '總贏分 (Total Win)', value: 'total_win' },
    { label: '總投注 (Total Bet)', value: 'total_bet' }
]

const winConditions = [
    { label: '累計有效投注', value: 'total_bet' },
    { label: '單局贏分倍數', value: 'win_rate' },
    { label: '累計贏分總額', value: 'total_win' },
    { label: '指定遊戲局數', value: 'rounds' }
]

const gameList = ref([
    { name: '雷神之錘', code: 'thor' },
    { name: '戰神賽特', code: 'set' },
    { name: '麻將發發發', code: 'mahjong' },
    { name: '幸運輪盤', code: 'wheel' }
])

const eventList = ref<any[]>([
    { id: 1, name: '春節首存大紅包', type: 'first_deposit', version: 'platform', platformShare: 70, agentShare: 30, costMode: 'mixed', bonusPercent: 100, turnoverMulti: 15, status: true },
    { id: 2, name: '百家樂連贏榜', type: 'ranking', version: 'platform', platformShare: 0, agentShare: 100, costMode: 'agent', rankingType: 'win_rate', status: true }
])

const dialogVisible = ref(false)
const currentConfig = ref<any>({})

const isVersionLocked = computed(() => {
    return ['rebate', 'ranking'].includes(currentConfig.value.type || '')
})

const openTemplateDialog = (tpl: any) => {
    const isLocked = ['rebate', 'ranking'].includes(tpl.id)
    currentConfig.value = {
        id: null,
        type: tpl.id,
        name: '',
        version: isLocked ? 'platform' : 'platform',
        // Cost Sharing Defaults
        costMode: 'mixed',
        platformShare: 70,
        agentShare: 30,
        // Platform fields
        minDeposit: 1000,
        bonusPercent: 10,
        turnoverMulti: 10,
        // SaaS fields
        rewardPoints: 100,
        expValue: 50,
        luckyBags: 1,
        // Game specific
        selectedGames: [],
        winCondition: 'total_bet',
        // Ranking specific
        rankingType: 'win_rate'
    }
    dialogVisible.value = true
}

const editEvent = (event: any) => {
    currentConfig.value = { ...event }
    dialogVisible.value = true
}

const handleCostModeChange = () => {
    if (currentConfig.value.costMode === 'platform') {
        currentConfig.value.platformShare = 100
        currentConfig.value.agentShare = 0
    } else if (currentConfig.value.costMode === 'agent') {
        currentConfig.value.platformShare = 0
        currentConfig.value.agentShare = 100
    } else {
        // Reset to default Mixed
        currentConfig.value.platformShare = 50
        currentConfig.value.agentShare = 50
    }
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
const getCostModeLabel = (event: any) => {
    const opt = costModeOptions.find(o => o.value === event.costMode)
    return opt ? opt.label : '未知'
}
const getCostModeSeverity = (event: any) => {
    if (event.costMode === 'platform') return 'info'
    if (event.costMode === 'agent') return 'success'
    return 'warning'
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-datatable-tbody > tr > td) { padding: 0.75rem 1rem; }
:deep(.p-inputnumber-input) { text-align: center; } /* Reinforce center align */

/* Custom SelectButton Styles */
/* :deep(.p-selectbutton .p-button.p-highlight) { background: #3b82f6; border-color: #3b82f6; color: white; } */
/* :deep(.p-selectbutton .p-button) { background: #1e293b; border-color: #334155; color: #94a3b8; } */
/* :deep(.p-selectbutton .p-button:hover) { background: #0f172a; } */
</style>
