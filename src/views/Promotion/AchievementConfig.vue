<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-gift text-blue-400"></i>
      <span class="text-surface-300">推廣活動</span>
      <span>></span>
      <span class="text-white font-medium">成就設置 (上架版)</span>
    </div>

    <TabView class="p-tabview-custom" :activeInput="0">
        <!-- 30-Day Sign-in Template -->
        <TabPanel value="0">
            <template #header>
                <div class="flex items-center gap-2">
                    <i class="pi pi-calendar"></i>
                    <span>簽到模板 (30天)</span>
                </div>
            </template>
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div class="text-surface-400 text-sm">設定 30 天循環簽到獎勵，每週可設定不同重點獎勵。</div>
                    <Button label="建立新模板" icon="pi pi-plus" severity="primary" @click="createNewTemplate" />
                </div>

                <Card class="bg-surface-800/50 border border-surface-700">
                    <template #content>
                        <div class="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-6 gap-4">
                            <div v-for="item in currentTemplate" :key="item.day" class="bg-surface-900 border border-surface-700 rounded-lg p-3 flex flex-col items-center gap-3 relative group hover:border-blue-500 transition-colors">
                                <span class="text-xs text-surface-500 absolute top-2 left-2">Day {{ item.day }}</span>
                                <div class="w-8 h-8 rounded-full bg-surface-800 flex items-center justify-center mt-4">
                                    <i :class="['pi', getRewardIcon(item.day), item.day % 7 === 0 ? 'text-yellow-400' : 'text-blue-400']"></i>
                                </div>
                                <div class="w-full space-y-2">
                                    <div class="flex flex-col gap-1 items-center">
                                         <label class="text-[10px] text-surface-500">獎勵積分</label>
                                         <div style="width: 80px"> <!-- 100px container for button-less input -->
                                            <InputNumber v-model="item.points" :min="0" class="w-full" inputClass="text-center text-xs p-1 h-8" :showButtons="false" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>
                </Card>
                 <div class="flex justify-end">
                    <Button label="儲存模板設定" icon="pi pi-save" severity="success" @click="saveTemplate" />
                </div>
            </div>
        </TabPanel>

        <!-- Achievement Tasks & Notifications -->
        <TabPanel value="1">
             <template #header>
                <div class="flex items-center gap-2">
                    <i class="pi pi-list"></i>
                    <span>任務與通知</span>
                </div>
            </template>
            <div class="space-y-6">
                <div class="flex justify-end">
                    <Button label="新增任務" icon="pi pi-plus" severity="info" @click="addTask" />
                </div>
                
                <Card class="bg-surface-800/50 border border-surface-700">
                    <template #content>
                        <DataTable :value="tasks" stripedRows class="p-datatable-sm" :pt="{ tbody: { class: 'text-surface-300' } }">
                            <Column field="name" header="任務名稱" style="min-width: 150px">
                                <template #body="slotProps">
                                    <InputText v-model="slotProps.data.name" class="w-full text-sm" placeholder="任務名稱" />
                                </template>
                            </Column>
                             <Column field="threshold" header="達成門檻 (EXP)" style="min-width: 120px">
                                <template #body="slotProps">
                                    <div style="width: 100px">
                                        <InputNumber v-model="slotProps.data.threshold" :min="0" class="w-full" inputClass="text-center text-sm" :showButtons="false" />
                                    </div>
                                </template>
                            </Column>
                             <Column field="reward" header="獎勵內容" style="min-width: 150px">
                                <template #body="slotProps">
                                    <div class="flex gap-2">
                                        <div style="width: 90px">
                                            <InputNumber v-model="slotProps.data.rewardPoints" suffix=" 積分" class="w-full" inputClass="text-center text-xs" :showButtons="false" />
                                        </div>
                                    </div>
                                </template>
                            </Column>
                             <Column field="emailTemplate" header="通知設定 (信件模板)" style="min-width: 200px">
                                <template #body="slotProps">
                                    <Dropdown v-model="slotProps.data.emailTemplate" :options="emailTemplates" optionLabel="name" optionValue="id" placeholder="選擇信件模板" class="w-full text-sm" />
                                </template>
                            </Column>
                             <Column header="操作" style="min-width: 80px">
                                <template #body="slotProps">
                                    <!-- Isolated Delete Button -->
                                    <Button icon="pi pi-trash" text severity="danger" rounded size="small" @click="removeTask(slotProps.index)" />
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                </Card>
                 <div class="flex justify-end gap-4">
                     <Button label="重置所有" severity="secondary" outlined icon="pi pi-refresh" />
                    <Button label="儲存任務設定" severity="success" icon="pi pi-save" @click="saveTasks" />
                </div>
            </div>
        </TabPanel>

        <!-- Point Exchange (Integration) -->
         <TabPanel value="2">
             <template #header>
                <div class="flex items-center gap-2">
                    <i class="pi pi-wallet"></i>
                    <span>積分匯率</span>
                </div>
            </template>
             <Card class="bg-surface-800/50 border border-surface-700 max-w-2xl mx-auto">
                 <template #content>
                    <div class="flex items-center justify-between bg-surface-900 p-6 rounded border border-surface-700 gap-8">
                        <div class="flex flex-col">
                            <span class="text-white font-bold mb-2 text-lg">積分匯率 (Point Rate)</span>
                            <span class="text-xs text-surface-500">設定積分與現金的兌換比例 (上架版通用)</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <span class="text-surface-400 text-sm">每 100 積分 = </span>
                            <div style="width: 120px">
                                <InputNumber v-model="pointRate" mode="currency" currency="TWD" locale="zh-TW" class="w-full" inputClass="text-center font-bold text-green-400" :showButtons="false" />
                            </div>
                        </div>
                    </div>
                </template>
                <template #footer>
                     <div class="flex justify-end pt-4">
                        <Button label="更新匯率" severity="warning" icon="pi pi-check" @click="saveRate" />
                    </div>
                </template>
             </Card>
        </TabPanel>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const toast = useToast()
const confirm = useConfirm()

// 30-Day Sign-in Template
const currentTemplate = ref(Array.from({ length: 30 }, (_, i) => ({ 
    day: i + 1, 
    points: (i + 1) % 7 === 0 ? 100 : 10,  // Weekly bonus
    item: null 
})))

const getRewardIcon = (day: number) => {
    if (day % 30 === 0) return 'pi-gift' // Big prize
    if (day % 7 === 0) return 'pi-star-fill' // Weekly
    return 'pi-check-circle' // Normal
}

const createNewTemplate = () => {
    confirm.require({
        message: '建立新模板將會重置當前未儲存的設定，確定繼續？',
        header: '確認操作',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            currentTemplate.value = currentTemplate.value.map(d => ({ ...d, points: 10 }))
            toast.add({ severity: 'info', summary: '已重置', detail: '新模板已建立', life: 2000 })
        }
    })
}

const saveTemplate = () => {
    toast.add({ severity: 'success', summary: '儲存成功', detail: '30天簽到模板已更新', life: 2000 })
}

// Achievement Tasks
const tasks = ref([
    { id: 1, name: '新手上路', threshold: 100, rewardPoints: 50, emailTemplate: 'welcome_gift' },
    { id: 2, name: '百戰百勝', threshold: 5000, rewardPoints: 200, emailTemplate: 'level_up' },
    { id: 3, name: '豪擲千金', threshold: 100000, rewardPoints: 1000, emailTemplate: 'vip_exclusive' }
])

const emailTemplates = [
    { id: 'welcome_gift', name: '新手禮包通知' },
    { id: 'level_up', name: '等級提升獎勵' },
    { id: 'vip_exclusive', name: 'VIP 專屬賀卡' },
    { id: 'daily_reward', name: '每日獎勵領取' }
]

const addTask = () => {
    tasks.value.push({ id: Date.now(), name: '', threshold: 1000, rewardPoints: 100, emailTemplate: 'daily_reward' })
}

const removeTask = (index: number) => {
    tasks.value.splice(index, 1)
}

const saveTasks = () => {
    toast.add({ severity: 'success', summary: '儲存成功', detail: '任務列表已更新', life: 2000 })
}

// Point Exchange
const pointRate = ref(10)

const saveRate = () => {
    toast.add({ severity: 'success', summary: '儲存成功', detail: `匯率已更新：100 積分 = ${pointRate.value} TWD`, life: 2000 })
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1.5rem; }
:deep(.p-inputnumber-input) { text-align: center; } /* Reinforce center align */
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: rgba(30, 41, 59, 0.5); color: #94a3b8; padding: 0.75rem 1rem; }
:deep(.p-tabview-nav) { background: transparent; border-bottom: 1px solid #334155; }
:deep(.p-tabview-nav-link) { background: transparent !important; color: #94a3b8; border: none; font-weight: 500; }
:deep(.p-highlight .p-tabview-nav-link) { color: #60a5fa !important; border-bottom: 2px solid #60a5fa; }
</style>
