<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-sitemap text-blue-400"></i>
      <span class="text-surface-300">代理管理</span>
      <span>></span>
      <span class="text-white font-medium">代理商維護</span>
    </div>

    <!-- Search Panel -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #content>
        <div class="flex items-center gap-4 flex-wrap">
          <div>
            <label class="text-surface-400 text-sm mb-2 block">代理帳號</label>
            <InputText v-model="filters.account" placeholder="請輸入帳號" class="w-[220px]" />
          </div>
          <div>
            <label class="text-surface-400 text-sm mb-2 block">所屬上級</label>
            <InputText v-model="filters.upline" placeholder="請輸入上級帳號" class="w-[220px]" />
          </div>
          <div>
            <label class="text-surface-400 text-sm mb-2 block">註冊日期</label>
            <Calendar v-model="filters.regDate" dateFormat="yy/mm/dd" placeholder="選擇日期" class="w-[220px]" />
          </div>
          <div>
            <label class="text-surface-400 text-sm mb-2 block">登入狀態</label>
            <Dropdown v-model="filters.loginStatus" :options="loginStatusOptions" placeholder="全部" class="w-[220px]" />
          </div>
           <div>
            <label class="text-surface-400 text-sm mb-2 block">IP 位址</label>
            <InputText v-model="filters.ip" placeholder="請輸入 IP" class="w-[220px]" />
          </div>
          <div class="flex items-end ml-auto">
            <Button label="搜尋" icon="pi pi-search" @click="handleSearch" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Agent Data Table -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-shield text-blue-400"></i>
          代理商維護列表
        </div>
      </template>
      <template #content>
         <DataTable :value="filteredAgents" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <Column field="info" header="代理資訊" style="min-width: 180px">
                 <template #body="slotProps">
                     <div class="flex flex-col">
                        <span class="text-white font-medium">{{ slotProps.data.account }}</span>
                        <span class="text-surface-400 text-xs">{{ slotProps.data.name }}</span>
                     </div>
                </template>
            </Column>
            <Column header="安全狀態" style="min-width: 200px">
                 <template #body="slotProps">
                     <div class="space-y-1 text-sm">
                         <div class="flex items-center gap-2">
                             <i class="pi pi-desktop text-surface-400 text-xs"></i>
                             <span>{{ slotProps.data.lastLoginIp }}</span>
                         </div>
                         <div class="flex items-center gap-2">
                             <i class="pi pi-clock text-surface-400 text-xs"></i>
                             <span class="text-surface-400">{{ slotProps.data.lastLoginTime }}</span>
                         </div>
                     </div>
                </template>
            </Column>
            <Column header="權限開關" style="min-width: 180px">
                 <template #body="slotProps">
                     <div class="flex items-center gap-2">
                         <div class="flex flex-col items-center gap-1">
                             <InputSwitch v-model="slotProps.data.permissions.login" class="scale-75" />
                             <span class="text-xs text-surface-400">登入</span>
                         </div>
                         <div class="flex flex-col items-center gap-1">
                             <InputSwitch v-model="slotProps.data.permissions.withdrawal" class="scale-75" />
                             <span class="text-xs text-surface-400">提款</span>
                         </div>
                         <div class="flex flex-col items-center gap-1">
                             <InputSwitch v-model="slotProps.data.permissions.promotion" class="scale-75" />
                             <span class="text-xs text-surface-400">推廣</span>
                         </div>
                     </div>
                </template>
            </Column>
            <Column field="status" header="狀態" style="min-width: 100px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </template>
            </Column>
            <Column header="操作" style="min-width: 280px">
                 <template #body="slotProps">
                     <div class="flex gap-2">
                         <Button label="修改資料" icon="pi pi-user-edit" size="small" outlined severity="info" @click="openMaintenanceDialog(slotProps.data, 'security')" />
                         <Button label="權限設定" icon="pi pi-cog" size="small" outlined severity="warning" @click="openMaintenanceDialog(slotProps.data, 'permission')" />
                         <Button label="重置密碼" icon="pi pi-key" size="small" severity="danger" text @click="resetPassword(slotProps.data)" />
                     </div>
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <!-- Maintenance Dialog -->
    <Dialog v-model:visible="maintenanceDialogVisible" modal :header="`代理維護 - ${currentAgent?.account}`" :style="{ width: '600px' }">
        <TabView v-model:activeIndex="activeTabIndex">
            <!-- Security Settings Tab -->
            <TabPanel header="安全設定" value="security">
                <div class="p-4 space-y-4">
                     <div class="flex items-center gap-4 p-3 bg-surface-900 rounded">
                        <label class="text-surface-300 w-24">登入密碼</label>
                        <InputText type="password" placeholder="若不修改請留空" class="flex-1" />
                    </div>
                    <div class="flex items-center gap-4 p-3 bg-surface-900 rounded">
                        <label class="text-surface-300 w-24">二級密碼</label>
                        <InputText type="password" placeholder="若不修改請留空" class="flex-1" />
                    </div>
                     <div class="flex items-start gap-4 p-3 bg-surface-900 rounded">
                        <label class="text-surface-300 w-24 mt-2">IP 白名單</label>
                        <Textarea rows="3" placeholder="每行一個 IP，留空代表不限制" class="flex-1" />
                    </div>
                </div>
            </TabPanel>

            <!-- Permission Settings Tab -->
            <TabPanel header="權限設定" value="permission">
                <div class="p-4 grid grid-cols-2 gap-4">
                     <div class="flex items-center justify-between p-3 bg-surface-900 rounded">
                        <span class="text-white">登入權限</span>
                        <InputSwitch v-model="tempPermissions.login" />
                    </div>
                    <div class="flex items-center justify-between p-3 bg-surface-900 rounded">
                        <span class="text-white">提款權限</span>
                        <InputSwitch v-model="tempPermissions.withdrawal" />
                    </div>
                    <div class="flex items-center justify-between p-3 bg-surface-900 rounded">
                        <span class="text-white">推廣權限</span>
                        <InputSwitch v-model="tempPermissions.promotion" />
                    </div>
                     <div class="flex items-center justify-between p-3 bg-surface-900 rounded">
                        <span class="text-white">新增下級</span>
                        <InputSwitch v-model="tempPermissions.addSub" />
                    </div>
                    <div class="flex items-center justify-between p-3 bg-surface-900 rounded">
                        <span class="text-white">轉帳權限</span>
                        <InputSwitch v-model="tempPermissions.transfer" />
                    </div>
                     <div class="flex items-center justify-between p-3 bg-surface-900 rounded">
                        <span class="text-white">查看報表</span>
                        <InputSwitch v-model="tempPermissions.viewReports" />
                    </div>
                </div>
            </TabPanel>
        </TabView>
        <template #footer>
            <Button label="取消" text severity="secondary" @click="maintenanceDialogVisible = false" />
            <Button label="儲存變更" severity="success" icon="pi pi-check" @click="saveMaintenance" />
        </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import InputSwitch from 'primevue/inputswitch'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Textarea from 'primevue/textarea'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

const toast = useToast()
const confirm = useConfirm()

// Mock Data Types
interface Agent {
    id: number
    account: string
    name: string
    upline: string
    regDate: string
    lastLoginIp: string
    lastLoginTime: string
    status: '正常' | '黑名單' | '鎖定中'
    permissions: {
        login: boolean
        withdrawal: boolean
        promotion: boolean
        addSub: boolean
        transfer: boolean
        viewReports: boolean
    }
}

const agents = ref<Agent[]>([])
const maintenanceDialogVisible = ref(false)
const currentAgent = ref<Agent | null>(null)
const activeTabIndex = ref(0)

const filters = ref({
    account: '',
    upline: '',
    regDate: null,
    loginStatus: null,
    ip: ''
})

const tempPermissions = ref({
    login: true,
    withdrawal: true,
    promotion: true,
    addSub: true,
    transfer: true,
    viewReports: true
})

const loginStatusOptions = ['正常', '鎖定中', '黑名單']

const filteredAgents = computed(() => {
    return agents.value.filter(agent => {
        if (filters.value.account && !agent.account.includes(filters.value.account)) return false
        if (filters.value.upline && !agent.upline.includes(filters.value.upline)) return false
        if (filters.value.ip && !agent.lastLoginIp.includes(filters.value.ip)) return false
        if (filters.value.loginStatus && agent.status !== filters.value.loginStatus) return false
        return true
    })
})

onMounted(() => {
    generateMockData()
})

const handleSearch = () => {
    // Reactive logic handled by computed
    toast.add({ severity: 'info', summary: '搜尋完成', life: 1000 })
}

const openMaintenanceDialog = (agent: Agent, tab: 'security' | 'permission') => {
    currentAgent.value = agent
    // Clone permissions to temp
    tempPermissions.value = { ...agent.permissions }
    activeTabIndex.value = tab === 'security' ? 0 : 1
    maintenanceDialogVisible.value = true
}

const saveMaintenance = () => {
    if (currentAgent.value) {
        // Save back permissions
        currentAgent.value.permissions = { ...tempPermissions.value }
        toast.add({ severity: 'success', summary: '儲存成功', detail: '代理設定已更新', life: 2000 })
        maintenanceDialogVisible.value = false
    }
}

const resetPassword = (agent: Agent) => {
    confirm.require({
        message: `確定要重置代理 ${agent.account} 的密碼嗎？`,
        header: '重置密碼確認',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: () => {
            toast.add({ severity: 'success', summary: '重置成功', detail: '新密碼已發送至代理信箱', life: 3000 })
        }
    })
}

const getStatusSeverity = (status: string) => {
    switch (status) {
        case '正常': return 'success'
        case '鎖定中': return 'warning'
        case '黑名單': return 'danger'
        default: return 'info'
    }
}

const generateMockData = () => {
    agents.value = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        account: `agent_${String(i + 1).padStart(3, '0')}`,
        name: `代理商 ${String.fromCharCode(65 + (i % 26))}`,
        upline: i % 3 === 0 ? 'agent_master' : `agent_${String(Math.max(1, i - 1)).padStart(3, '0')}`,
        regDate: '2024/01/01',
        lastLoginIp: `192.168.1.${100 + i}`,
        lastLoginTime: '2024/01/08 14:30',
        status: i === 3 ? '鎖定中' : i === 7 ? '黑名單' : '正常',
        permissions: {
            login: i !== 3 && i !== 7,
            withdrawal: true,
            promotion: true,
            addSub: true,
            transfer: true,
            viewReports: true
        }
    }))
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
:deep(.p-inputtext), :deep(.p-dropdown), :deep(.p-calendar), :deep(.p-textarea) { background-color: rgba(30, 41, 59, 0.5); border-color: rgba(71, 85, 105, 0.5); }
:deep(.p-tabview .p-tabview-nav) { background: rgba(30, 41, 59, 0.5); }
:deep(.p-tabview .p-tabview-panels) { background: transparent; }
</style>
