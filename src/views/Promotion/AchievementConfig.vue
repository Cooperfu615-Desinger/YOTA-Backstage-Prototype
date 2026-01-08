<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-gift text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">推廣活動</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">成就設置 (上架版)</span>
    </div>

    <TabView class="p-tabview-custom" :activeInput="0">
        <!-- Tab 1: Check-in (Integrated Dashboard) -->
        <TabPanel value="0">
            <template #header>
                <div class="flex items-center gap-2">
                    <i class="pi pi-calendar"></i>
                    <span>簽到管理</span>
                </div>
            </template>
            <div class="space-y-6">
                 <!-- Active Schedule Section -->
                <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                    <template #title>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
                                <i class="pi pi-calendar-clock text-blue-500 dark:text-blue-400"></i>
                                進度排程 (Schedules)
                            </div>
                            <Button label="新增排程" icon="pi pi-plus" severity="primary" @click="openScheduleDialog" />
                        </div>
                    </template>
                    <template #content>
                        <div class="grid grid-cols-1 gap-4">
                            <!-- Current Active -->
                            <div class="bg-surface-0 dark:bg-surface-900 border border-green-500/30 rounded-lg p-4 flex items-center justify-between relative overflow-hidden">
                                <div class="absolute top-0 right-0 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-bl">當前生效</div>
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-400">
                                        <i class="pi pi-check-circle text-2xl"></i>
                                    </div>
                                    <div>
                                        <div class="text-surface-900 dark:text-white font-bold text-lg">{{ currentSchedule.templateName }}</div>
                                        <div class="text-sm text-surface-500 dark:text-surface-400">
                                            週期: {{ currentSchedule.days }} 天 | 
                                            <span v-if="currentSchedule.isDefault">預設兜底 (無排程時自動生效)</span>
                                            <span v-else>{{ (currentSchedule as any).startDate }} ~ {{ (currentSchedule as any).endDate }}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button label="查看詳情" text severity="secondary" @click="viewTemplate(currentSchedule.templateId!)" />
                            </div>

                            <!-- Upcoming List -->
                            <div v-for="sch in upcomingSchedules" :key="sch.id" class="bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg p-4 flex items-center justify-between">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-400">
                                        <i class="pi pi-clock text-xl"></i>
                                    </div>
                                    <div>
                                        <div class="text-surface-700 dark:text-surface-200 font-bold">{{ sch.templateName }}</div>
                                        <div class="text-sm text-surface-500">
                                            {{ sch.startDate }} ~ {{ sch.endDate }}
                                        </div>
                                    </div>
                                </div>
                                <Button icon="pi pi-trash" text severity="danger" rounded @click="deleteSchedule(sch.id)" />
                            </div>
                        </div>
                    </template>
                </Card>

                <!-- Template Library -->
                <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                    <template #title>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
                                <i class="pi pi-th-large text-purple-500 dark:text-purple-400"></i>
                                模板庫 (Library)
                            </div>
                            <Button label="建立新模板" icon="pi pi-plus" severity="info" outlined @click="navigateToEditor" />
                        </div>
                    </template>
                    <template #content>
                        <DataTable :value="templates" stripedRows class="p-datatable-sm" :pt="{ tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
                            <Column field="name" header="模板名稱" style="min-width: 200px">
                                <template #body="slotProps">
                                    <div class="flex items-center gap-2">
                                        <span class="text-surface-900 dark:text-white font-medium">{{ slotProps.data.name }}</span>
                                        <Tag v-if="slotProps.data.isDefault" value="預設" severity="success" class="text-xs" />
                                    </div>
                                </template>
                            </Column>
                            <Column field="days" header="週期天數" style="min-width: 100px">
                                <template #body="slotProps">
                                    <Tag :value="`${slotProps.data.days} 天`" severity="info" />
                                </template>
                            </Column>
                            <Column field="updatedAt" header="最後更新" style="min-width: 150px"></Column>
                            <Column header="操作" style="min-width: 250px">
                                <template #body="slotProps">
                                    <div class="flex items-center gap-2">
                                        <Button icon="pi pi-pencil" label="編輯" size="small" outlined severity="info" @click="navigateToEditor(slotProps.data)" />
                                        
                                        <Button v-if="!slotProps.data.isDefault" icon="pi pi-star" label="設為預設" size="small" text severity="warning" @click="setAsDefault(slotProps.data)" />
                                        
                                        <Button :disabled="slotProps.data.isDefault" :icon="slotProps.data.isDefault ? 'pi pi-lock' : 'pi pi-trash'" :severity="slotProps.data.isDefault ? 'secondary' : 'danger'" size="small" text rounded @click="deleteTemplate(slotProps.data)" />
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                    </template>
                </Card>
            </div>
        </TabPanel>

        <!-- Tab 2: Task Management -->
        <TabPanel value="1">
             <template #header>
                <div class="flex items-center gap-2">
                    <i class="pi pi-list"></i>
                    <span>任務管理</span>
                </div>
            </template>
             <div class="space-y-6">
                <div class="flex justify-end">
                    <Button label="新增任務" icon="pi pi-plus" severity="info" @click="addTask" />
                </div>
                
                <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                    <template #content>
                        <DataTable :value="tasks" stripedRows class="p-datatable-sm" :pt="{ tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
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

        <!-- Tab 3: Point Exchange -->
         <TabPanel value="2">
             <template #header>
                <div class="flex items-center gap-2">
                    <i class="pi pi-wallet"></i>
                    <span>積分設置</span>
                </div>
            </template>
             <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 max-w-2xl mx-auto">
                 <template #content>
                    <div class="flex items-center justify-between bg-surface-100 dark:bg-surface-900 p-6 rounded border border-surface-200 dark:border-surface-700 gap-8">
                        <div class="flex flex-col">
                            <span class="text-surface-900 dark:text-white font-bold mb-2 text-lg">積分匯率 (Point Rate)</span>
                            <span class="text-xs text-surface-500">設定積分與現金的兌換比例 (上架版通用)</span>
                        </div>
                        <div class="flex items-center gap-4">
                            <span class="text-surface-600 dark:text-surface-400 text-sm">每 100 積分 = </span>
                            <div style="width: 120px">
                                <InputNumber v-model="pointRate" mode="currency" currency="TWD" locale="zh-TW" class="w-full" inputClass="text-center font-bold text-green-500 dark:text-green-400" :showButtons="false" />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const router = useRouter()
const toast = useToast()
const confirm = useConfirm()

// ========================
// Tab 1: Check-in Logic
// ========================
const templates = ref([
    { id: 1, name: '通用 30 天循環', days: 30, isDefault: true, updatedAt: '2024-01-01' },
    { id: 2, name: '春節 7 天衝刺', days: 7, isDefault: false, updatedAt: '2024-01-05' },
    { id: 3, name: '週末 5 天快閃', days: 5, isDefault: false, updatedAt: '2024-01-08' }
])

const schedules = ref([
    { id: 101, templateId: 2, templateName: '春節 7 天衝刺', days: 7, startDate: '2024-02-08', endDate: '2024-02-14' }
])

const currentSchedule = computed(() => {
    // Simulating no active schedule for now to show Fallback login
    const active = schedules.value[0] // Assume first is upcoming/active for demo
    if (active) return { ...active, isDefault: false }
    
    const defaultTpl = templates.value.find(t => t.isDefault)
    return { 
        templateId: defaultTpl?.id, 
        templateName: defaultTpl?.name, 
        days: defaultTpl?.days, 
        isDefault: true 
    }
})

const upcomingSchedules = computed(() => {
    return schedules.value.slice(1) // Just valid ones
})

const openScheduleDialog = () => {
    toast.add({ severity: 'info', summary: '功能展示', detail: '開啟排程設定 Dialog', life: 2000 })
}

const navigateToEditor = (tpl?: any) => {
    console.log(tpl)
    router.push('/promotion/check-in/editor')
}

const viewTemplate = (id: number) => {
    console.log(id)
    router.push('/promotion/check-in/editor')
}

const setAsDefault = (tpl: any) => {
    confirm.require({
        message: `確定要將 "${tpl.name}" 設為預設簽到模板嗎？`,
        header: '變更預設',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            templates.value.forEach(t => t.isDefault = false)
            tpl.isDefault = true
            toast.add({ severity: 'success', summary: '設定成功', detail: '已更新預設模板', life: 2000 })
        }
    })
}

const deleteTemplate = (tpl: any) => {
    if (tpl.isDefault) return
    confirm.require({
        message: `確定要刪除 "${tpl.name}" 嗎？`,
        header: '刪除確認',
        icon: 'pi pi-trash',
        acceptClass: 'p-button-danger',
        accept: () => {
            const idx = templates.value.findIndex(t => t.id === tpl.id)
            if (idx !== -1) templates.value.splice(idx, 1)
            toast.add({ severity: 'success', summary: '刪除成功', life: 2000 })
        }
    })
}

const deleteSchedule = (id: number) => {
     const idx = schedules.value.findIndex(s => s.id === id)
     if (idx !== -1) schedules.value.splice(idx, 1)
}

// ========================
// Tab 2: Task Management
// ========================
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

// ========================
// Tab 3: Point Exchange
// ========================
const pointRate = ref(10)

const saveRate = () => {
    toast.add({ severity: 'success', summary: '儲存成功', detail: `匯率已更新：100 積分 = ${pointRate.value} TWD`, life: 2000 })
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1.5rem; }
:deep(.p-inputnumber-input) { text-align: center; } 
:deep(.p-datatable-tbody > tr > td) { padding: 0.75rem 1rem; }
:deep(.p-tabview-nav) { background: transparent; border-bottom: 1px solid var(--surface-border); }
:deep(.p-tabview-nav-link) { background: transparent !important; color: var(--surface-500); border: none; font-weight: 500; }
:deep(.p-highlight .p-tabview-nav-link) { color: var(--primary-color) !important; border-bottom: 2px solid var(--primary-color); }
</style>
