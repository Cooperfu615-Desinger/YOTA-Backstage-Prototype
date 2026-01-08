<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-sitemap text-blue-400"></i>
      <span class="text-surface-300">代理管理</span>
      <span>></span>
      <span class="text-white font-medium">代理列表</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-search text-blue-400"></i>
          代理搜尋
        </div>
      </template>
      <template #content>
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">代理帳號</label>
            <InputText v-model="filters.account" placeholder="輸入代理帳號" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">手機號碼</label>
            <InputText v-model="filters.phone" placeholder="輸入手機號碼" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">代理等級</label>
            <Dropdown v-model="filters.level" :options="levelOptions" optionLabel="label" optionValue="value" placeholder="選擇等級" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">狀態</label>
            <Dropdown v-model="filters.status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="選擇狀態" class="w-[220px]" showClear />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-300 text-sm font-medium">註冊日期</label>
            <Calendar v-model="filters.dateRange" selectionMode="range" :manualInput="false" placeholder="選擇日期範圍" class="w-[220px]" showIcon />
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" @click="handleSearch" class="px-6" />
        </div>
      </template>
    </Card>

    <!-- Agent List -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-users text-purple-400"></i>
          代理列表
        </div>
      </template>
      <template #content>
         <DataTable :value="filteredAgents" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <Column field="account" header="代理帳號" style="min-width: 140px">
                 <template #body="slotProps">
                    <span class="text-blue-400 font-medium cursor-pointer hover:underline" 
                          @click="openDetailDialog(slotProps.data)"
                          v-tooltip.top="'點擊查看詳情'">
                        {{ slotProps.data.account }}
                    </span>
                </template>
            </Column>
            <Column field="superior" header="上級代理" style="min-width: 120px">
                 <template #body="slotProps">
                    <span v-if="slotProps.data.superior" class="text-surface-400">{{ slotProps.data.superior }}</span>
                    <span v-else class="text-surface-600 italic">頂級代理</span>
                </template>
            </Column>
            <Column field="level" header="等級" style="min-width: 100px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.level" severity="info" />
                </template>
            </Column>
            <Column field="teamStats" header="團隊概況" style="min-width: 150px">
                 <template #body="slotProps">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-users text-blue-400 text-xs"></i>
                        <span class="font-mono text-sm">
                            <span class="text-green-400 font-bold">{{ slotProps.data.directMembers }}</span>
                            <span class="text-surface-500"> / </span>
                            <span class="text-white">{{ slotProps.data.totalMembers }}</span>
                        </span>
                    </div>
                </template>
            </Column>
            <Column field="walletBalance" header="錢包餘額" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono text-green-400 font-bold">{{ formatCurrency(slotProps.data.walletBalance) }}</span>
                </template>
            </Column>
            <Column field="monthlyPL" header="當月盈虧" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="font-mono font-bold" :class="slotProps.data.monthlyPL >= 0 ? 'text-green-400' : 'text-red-400'">
                        {{ slotProps.data.monthlyPL >= 0 ? '+' : '' }}{{ formatCurrency(slotProps.data.monthlyPL) }}
                     </span>
                </template>
            </Column>
            <Column field="sharePercent" header="佔成比例" style="min-width: 100px">
                 <template #body="slotProps">
                     <div class="flex items-center gap-2">
                         <span class="font-mono text-yellow-400 font-bold">{{ slotProps.data.sharePercent }}%</span>
                     </div>
                </template>
            </Column>
            <Column field="status" header="狀態" style="min-width: 100px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="slotProps.data.status === '啟用' ? 'success' : 'danger'" />
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <!-- Agent Detail Dialog -->
    <Dialog v-model:visible="detailDialogVisible" modal :style="{ width: '800px' }">
        <template #header>
            <div class="flex items-center gap-3">
                <i v-if="currentAgent" :class="['pi text-2xl', getLevelIcon(currentAgent.level), getLevelColor(currentAgent.level)]"></i>
                <div>
                    <div class="text-white font-bold text-lg">代理詳情 - {{ currentAgent?.account }}</div>
                    <div class="text-surface-400 text-sm">{{ currentAgent?.level }}</div>
                </div>
            </div>
        </template>
        <TabView v-if="currentAgent">
            <TabPanel header="基本資料" value="基本資料">
                <div class="grid grid-cols-2 gap-4 p-4">
                    <div>
                        <label class="text-surface-400 text-sm">代理帳號</label>
                        <div class="text-white font-medium">{{ currentAgent.account }}</div>
                    </div>
                    <div>
                        <label class="text-surface-400 text-sm">手機號碼</label>
                        <div class="text-white">{{ currentAgent.phone }}</div>
                    </div>
                    <div>
                        <label class="text-surface-400 text-sm">上級代理</label>
                        <div class="text-white">{{ currentAgent.superior || '頂級代理' }}</div>
                    </div>
                    <div>
                        <label class="text-surface-400 text-sm">代理等級</label>
                        <div><Tag :value="currentAgent.level" severity="info" /></div>
                    </div>
                    <div>
                        <label class="text-surface-400 text-sm">直屬會員數</label>
                        <div class="text-green-400 font-mono font-bold">{{ currentAgent.directMembers }}</div>
                    </div>
                    <div>
                        <label class="text-surface-400 text-sm">團隊總人數</label>
                        <div class="text-white font-mono font-bold">{{ currentAgent.totalMembers }}</div>
                    </div>
                    <div>
                        <label class="text-surface-400 text-sm">錢包餘額</label>
                        <div class="text-green-400 font-mono font-bold">{{ formatCurrency(currentAgent.walletBalance) }}</div>
                    </div>
                    <div>
                        <label class="text-surface-400 text-sm">註冊日期</label>
                        <div class="text-white">{{ currentAgent.registerDate }}</div>
                    </div>
                </div>
                
                <div class="border-t border-surface-700 pt-4 mt-4">
                    <div class="flex items-center justify-between mb-3">
                        <label class="text-white font-semibold">手動鎖定等級</label>
                        <InputSwitch v-model="currentAgent.manualLevelLock" />
                    </div>
                    
                    <div v-if="currentAgent.manualLevelLock" class="space-y-3">
                        <div>
                            <label class="text-surface-300 text-sm font-medium mb-2 block">指定等級</label>
                            <Dropdown v-model="currentAgent.level" :options="availableLevels" optionLabel="label" optionValue="value" placeholder="選擇等級" class="w-full" />
                        </div>
                        <div>
                            <label class="text-surface-300 text-sm font-medium mb-2 block">調整原因</label>
                            <Textarea v-model="currentAgent.levelLockReason" rows="3" placeholder="請輸入手動調整原因..." class="w-full" />
                        </div>
                        <div class="text-xs text-surface-500">
                            <i class="pi pi-info-circle"></i> 手動鎖定後，系統將不再自動蘇核搭成進度
                        </div>
                    </div>
                </div>
            </TabPanel>
            
            <TabPanel header="佔成設定" value="佔成設定">
                <div class="space-y-4 p-4">
                    <div class="flex items-center gap-4 p-3 bg-surface-900 rounded">
                        <div class="flex items-center gap-2 w-32">
                            <i class="pi pi-star text-yellow-400"></i>
                            <span class="text-white font-medium">真人遊戲佔成</span>
                        </div>
                        <div style="width: 100px">
                            <InputNumber v-model="currentAgent.commissions.live" suffix="%" :min="0" :max="100" class="w-full" inputClass="text-center" />
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-4 p-3 bg-surface-900 rounded">
                        <div class="flex items-center gap-2 w-32">
                            <i class="pi pi-bolt text-purple-400"></i>
                            <span class="text-white font-medium">電子遊戲佔成</span>
                        </div>
                        <div style="width: 100px">
                            <InputNumber v-model="currentAgent.commissions.slot" suffix="%" :min="0" :max="100" class="w-full" inputClass="text-center" />
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-4 p-3 bg-surface-900 rounded">
                        <div class="flex items-center gap-2 w-32">
                            <i class="pi pi-trophy text-green-400"></i>
                            <span class="text-white font-medium">體育投注佔成</span>
                        </div>
                        <div style="width: 100px">
                            <InputNumber v-model="currentAgent.commissions.sports" suffix="%" :min="0" :max="100" class="w-full" inputClass="text-center" />
                        </div>
                    </div>

                    <div class="pt-4 border-t border-surface-700">
                        <Button label="儲存佔成設定" icon="pi pi-save" severity="success" class="w-full" @click="saveCommissions" />
                    </div>
                </div>
            </TabPanel>
            
            <TabPanel header="銀行卡資訊" value="銀行卡資訊">
                <div class="space-y-3 p-4">
                    <div class="flex items-center justify-between p-3 bg-surface-900 rounded">
                        <div>
                            <div class="text-surface-400 text-sm">銀行名稱</div>
                            <div class="text-white font-medium">{{ currentAgent.bankInfo.bankName }}</div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-surface-900 rounded">
                        <div>
                            <div class="text-surface-400 text-sm">帳戶號碼</div>
                            <div class="text-white font-mono">{{ currentAgent.bankInfo.accountNumber }}</div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-surface-900 rounded">
                        <div>
                            <div class="text-surface-400 text-sm">戶名</div>
                            <div class="text-white">{{ currentAgent.bankInfo.accountName }}</div>
                        </div>
                    </div>
                </div>
            </TabPanel>
        </TabView>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Calendar from 'primevue/calendar'
import InputSwitch from 'primevue/inputswitch'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

onMounted(() => {
    generateMockData()
})

const levelOptions = ref([
    { label: 'L1 - 初級代理', value: 'L1' },
    { label: 'L2 - 中級代理', value: 'L2' },
    { label: 'L3 - 高級代理', value: 'L3' },
])

const statusOptions = ref([
    { label: '啟用', value: '啟用' },
    { label: '停用', value: '停用' },
])

const availableLevels = ref([
    { label: 'L1 - 初級代理', value: 'L1' },
    { label: 'L2 - 中級代理', value: 'L2' },
    { label: 'L3 - 高級代理', value: 'L3' },
])

const filters = ref({
    account: '',
    phone: '',
    level: null,
    status: null,
    dateRange: null
})

const agents = ref<any[]>([])
const detailDialogVisible = ref(false)
const currentAgent = ref<any>(null)

const filteredAgents = computed(() => {
    let result = agents.value
    
    if (filters.value.account) {
        result = result.filter(agent => agent.account.includes(filters.value.account))
    }
    if (filters.value.phone) {
        result = result.filter(agent => agent.phone.includes(filters.value.phone))
    }
    if (filters.value.level) {
        result = result.filter(agent => agent.level === filters.value.level)
    }
    if (filters.value.status) {
        result = result.filter(agent => agent.status === filters.value.status)
    }
    
    return result
})

const handleSearch = () => {
    // Search is reactive via computed
}

const handleReset = () => {
    filters.value = { account: '', phone: '', level: null, status: null, dateRange: null }
}

const openDetailDialog = (agent: any) => {
    currentAgent.value = { ...agent }
    detailDialogVisible.value = true
}

const saveCommissions = () => {
    toast.add({ severity: 'success', summary: '設定已儲存', detail: '佔成比例已更新', life: 2000 })
}

const getLevelIcon = (level: string) => {
    const iconMap: Record<string, string> = {
        'L1': 'pi-star',
        'L2': 'pi-shield',
        'L3': 'pi-crown'
    }
    return iconMap[level] || 'pi-star'
}

const getLevelColor = (level: string) => {
    const colorMap: Record<string, string> = {
        'L1': 'text-gray-400',
        'L2': 'text-blue-400',
        'L3': 'text-yellow-400'
    }
    return colorMap[level] || 'text-gray-400'
}

const generateMockData = () => {
    // Top level agents
    agents.value = [
        {
            id: 1,
            account: 'agent_master',
            phone: '0912-345-678',
            superior: null,
            level: 'L3',
            directMembers: 5,
            totalMembers: 125,
            walletBalance: 185000,
            monthlyPL: 45000,
            sharePercent: 50,
            status: '啟用',
            registerDate: '2024-01-15',
            manualLevelLock: true,
            levelLockReason: '高級 VIP 客戶，特殊案例',
            commissions: { live: 50, slot: 45, sports: 40 },
            bankInfo: { bankName: '中國信託', accountNumber: '1234-5678-9012-3456', accountName: '王大明' }
        },
        {
            id: 2,
            account: 'agent_001',
            phone: '0923-456-789',
            superior: 'agent_master',
            level: 'L2',
            directMembers: 12,
            totalMembers: 45,
            walletBalance: 68000,
            monthlyPL: 22000,
            sharePercent: 35,
            status: '啟用',
            registerDate: '2024-02-20',
            manualLevelLock: false,
            levelLockReason: '',
            commissions: { live: 35, slot: 30, sports: 28 },
            bankInfo: { bankName: '台新銀行', accountNumber: '9876-5432-1098-7654', accountName: '李小華' }
        },
        {
            id: 3,
            account: 'agent_002',
            phone: '0934-567-890',
            superior: 'agent_master',
            level: 'L2',
            directMembers: 8,
            totalMembers: 28,
            walletBalance: 42000,
            monthlyPL: -8000,
            sharePercent: 35,
            status: '啟用',
            registerDate: '2024-03-10',
            commissions: { live: 35, slot: 32, sports: 30 },
            bankInfo: { bankName: '玉山銀行', accountNumber: '5555-6666-7777-8888', accountName: '張美玲' }
        },
        {
            id: 4,
            account: 'agent_101',
            phone: '0945-678-901',
            superior: 'agent_001',
            level: 'L1',
            directMembers: 15,
            totalMembers: 15,
            walletBalance: 18500,
            monthlyPL: 6500,
            sharePercent: 20,
            status: '啟用',
            registerDate: '2024-05-01',
            commissions: { live: 20, slot: 18, sports: 15 },
            bankInfo: { bankName: '國泰世華', accountNumber: '1111-2222-3333-4444', accountName: '陳志明' }
        },
        {
            id: 5,
            account: 'agent_102',
            phone: '0956-789-012',
            superior: 'agent_001',
            level: 'L1',
            directMembers: 8,
            totalMembers: 8,
            walletBalance: 12000,
            monthlyPL: 3200,
            sharePercent: 20,
            status: '啟用',
            registerDate: '2024-06-15',
            commissions: { live: 20, slot: 20, sports: 18 },
            bankInfo: { bankName: '第一銀行', accountNumber: '9999-8888-7777-6666', accountName: '林佳慧' }
        },
        {
            id: 6,
            account: 'agent_201',
            phone: '0967-890-123',
            superior: 'agent_002',
            level: 'L1',
            directMembers: 10,
            totalMembers: 10,
            walletBalance: 8900,
            monthlyPL: -1500,
            sharePercent: 20,
            status: '啟用',
            registerDate: '2024-07-20',
            commissions: { live: 20, slot: 15, sports: 20 },
            bankInfo: { bankName: '合作金庫', accountNumber: '3333-4444-5555-6666', accountName: '黃建國' }
        },
        {
            id: 7,
            account: 'agent_vip',
            phone: '0978-901-234',
            superior: null,
            level: 'L3',
            directMembers: 3,
            totalMembers: 85,
            walletBalance: 225000,
            monthlyPL: 68000,
            sharePercent: 55,
            status: '啟用',
            registerDate: '2023-12-01',
            commissions: { live: 55, slot: 50, sports: 45 },
            bankInfo: { bankName: '富邦銀行', accountNumber: '7777-8888-9999-0000', accountName: '劉大富' }
        },
        {
            id: 8,
            account: 'agent_003',
            phone: '0989-012-345',
            superior: 'agent_master',
            level: 'L2',
            directMembers: 6,
            totalMembers: 20,
            walletBalance: 35000,
            monthlyPL: 12000,
            sharePercent: 35,
            status: '啟用',
            registerDate: '2024-04-05',
            commissions: { live: 35, slot: 35, sports: 32 },
            bankInfo: { bankName: '兆豐銀行', accountNumber: '2222-3333-4444-5555', accountName: '吳雅婷' }
        },
        {
            id: 9,
            account: 'agent_test',
            phone: '0990-123-456',
            superior: 'agent_vip',
            level: 'L2',
            directMembers: 4,
            totalMembers: 18,
            walletBalance: 15000,
            monthlyPL: 4800,
            sharePercent: 30,
            status: '停用',
            registerDate: '2024-08-10',
            commissions: { live: 30, slot: 28, sports: 25 },
            bankInfo: { bankName: '華南銀行', accountNumber: '6666-7777-8888-9999', accountName: '周美珍' }
        },
        {
            id: 10,
            account: 'agent_new',
            phone: '0901-234-567',
            superior: 'agent_003',
            level: 'L1',
            directMembers: 2,
            totalMembers: 2,
            walletBalance: 2500,
            monthlyPL: 800,
            sharePercent: 18,
            status: '啟用',
            registerDate: '2024-11-20',
            commissions: { live: 18, slot: 18, sports: 15 },
            bankInfo: { bankName: '彰化銀行', accountNumber: '4444-5555-6666-7777', accountName: '鄭小強' }
        },
    ]
}

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: rgba(30, 41, 59, 0.5); color: #94a3b8; border-color: rgba(71, 85, 105, 0.5); padding: 0.75rem 1rem; font-weight: 600; }
:deep(.p-datatable .p-datatable-tbody > tr) { background-color: transparent; }
:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) { background-color: rgba(30, 41, 59, 0.3); }
:deep(.p-datatable .p-datatable-tbody > tr > td) { border-color: rgba(71, 85, 105, 0.3); padding: 0.75rem 1rem; }
:deep(.p-datatable .p-datatable-tbody > tr:hover) { background-color: rgba(59, 130, 246, 0.1); }
:deep(.p-inputtext), :deep(.p-dropdown), :deep(.p-calendar), :deep(.p-inputnumber) { background-color: rgba(30, 41, 59, 0.5); border-color: rgba(71, 85, 105, 0.5); }
:deep(.p-tabview .p-tabview-nav) { background: rgba(30, 41, 59, 0.5); }
:deep(.p-tabview .p-tabview-panels) { background: transparent; }
</style>
