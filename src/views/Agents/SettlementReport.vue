<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-sitemap text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">代理管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">佣金結算報表</span>
    </div>

    <!-- Search Panel -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #content>
        <div class="flex items-center gap-4 flex-wrap">
          <div>
            <label class="text-surface-700 dark:text-surface-300 text-sm mb-2 block">代理帳號</label>
            <InputText v-model="filters.account" placeholder="搜尋代理帳號" class="w-[220px]" />
          </div>
          <div>
            <label class="text-surface-700 dark:text-surface-300 text-sm mb-2 block">結算週期</label>
            <Calendar v-model="filters.period" view="month" dateFormat="yy/mm" placeholder="選擇月份" class="w-[220px]" />
          </div>
          <div>
            <label class="text-surface-700 dark:text-surface-300 text-sm mb-2 block">發放狀態</label>
            <Dropdown v-model="filters.status" :options="statusOptions" placeholder="選擇狀態" class="w-[220px]" />
          </div>
          <div class="flex items-end gap-2">
            <Button label="本月" size="small" outlined class="mb-[2px]" @click="quickFilter('thisMonth')" />
            <Button label="上月" size="small" outlined class="mb-[2px]" @click="quickFilter('lastMonth')" />
            <Button label="近三個月" size="small" outlined class="mb-[2px]" @click="quickFilter('last3Months')" />
          </div>
          <div class="flex items-end ml-auto gap-2">
            <Button label="匯出 Excel" icon="pi pi-file-excel" severity="success" outlined @click="exportReport" />
            <Button label="搜尋" icon="pi pi-search" @click="handleSearch" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Settlement Report Table -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-calculator text-green-500 dark:text-green-400"></i>
          佣金結算報表
        </div>
      </template>
      <template #content>
         <DataTable :value="filteredReports" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
            <Column field="period" header="結算區間" style="min-width: 120px">
                 <template #body="slotProps">
                     <span class="text-surface-900 dark:text-white">{{ slotProps.data.period }}</span>
                </template>
            </Column>
            <Column field="account" header="代理帳號" style="min-width: 130px">
                 <template #body="slotProps">
                     <span class="text-blue-500 dark:text-blue-400 font-medium">{{ slotProps.data.account }}</span>
                </template>
            </Column>
            <Column field="teamPL" header="團隊總盈虧" style="min-width: 140px">
                 <template #body="slotProps">
                     <span :class="slotProps.data.teamPL >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'" class="font-mono font-bold">
                         {{ formatCurrency(slotProps.data.teamPL) }}
                     </span>
                </template>
            </Column>
            <Column header="各項扣除" style="min-width: 160px">
                 <template #body="slotProps">
                     <div class="space-y-1 text-sm">
                         <div class="text-orange-500 dark:text-orange-400">紅利: {{ formatCurrency(slotProps.data.bonusDeduction) }}</div>
                         <div class="text-purple-500 dark:text-purple-400">場館費: {{ formatCurrency(slotProps.data.platformFee) }}</div>
                     </div>
                </template>
            </Column>
            <Column field="netProfit" header="淨利潤" style="min-width: 130px">
                 <template #body="slotProps">
                     <span :class="slotProps.data.netProfit >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'" class="font-mono font-bold">
                         {{ formatCurrency(slotProps.data.netProfit) }}
                     </span>
                </template>
            </Column>
            <Column field="commissionRate" header="佔成比例" style="min-width: 100px">
                 <template #body="slotProps">
                     <span class="font-mono text-yellow-500 dark:text-yellow-400">{{ slotProps.data.commissionRate }}%</span>
                </template>
            </Column>
            <Column field="finalCommission" header="預計佣金" style="min-width: 150px">
                 <template #body="slotProps">
                     <div v-if="slotProps.data.finalCommission >= 0" class="font-mono text-green-500 dark:text-green-400 font-bold text-lg">
                         {{ formatCurrency(slotProps.data.finalCommission) }}
                     </div>
                     <div v-else class="flex flex-col items-start">
                         <span class="font-mono text-red-500 dark:text-red-400 font-bold text-lg">
                             {{ formatCurrency(slotProps.data.finalCommission) }}
                         </span>
                         <Tag value="結轉下月" severity="danger" class="scale-75 origin-left" />
                     </div>
                </template>
            </Column>
            <Column field="status" header="狀態" style="min-width: 100px">
                 <template #body="slotProps">
                    <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                </template>
            </Column>
            <Column header="操作" style="min-width: 180px">
                 <template #body="slotProps">
                     <div class="flex gap-2">
                         <Button label="查看明細" size="small" outlined severity="info" @click="openDetailDialog(slotProps.data)" />
                         <Button v-if="slotProps.data.status === '待發放'" label="執行發放" size="small" severity="success" @click="executePayout(slotProps.data)" />
                     </div>
                </template>
            </Column>
         </DataTable>
      </template>
    </Card>

    <!-- Settlement Detail Dialog -->
    <Dialog v-model:visible="detailDialogVisible" modal :header="`結算明細 - ${currentReport?.account}`" :style="{ width: '800px' }" :pt="{ root: { class: 'bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700' }, header: { class: 'bg-surface-50 dark:bg-surface-800' }, content: { class: 'bg-surface-0 dark:bg-surface-900' } }">
        <div v-if="currentReport" class="space-y-4">
            <div class="grid grid-cols-3 gap-4 p-4 bg-surface-100 dark:bg-surface-900 rounded border border-surface-200 dark:border-surface-700">
                <div>
                    <div class="text-surface-500 dark:text-surface-400 text-sm">結算區間</div>
                    <div class="text-surface-900 dark:text-white font-bold">{{ currentReport.period }}</div>
                </div>
                <div>
                    <div class="text-surface-500 dark:text-surface-400 text-sm">團隊總盈虧</div>
                    <div :class="currentReport.teamPL >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'" class="font-mono font-bold">
                        {{ formatCurrency(currentReport.teamPL) }}
                    </div>
                </div>
                <div>
                    <div class="text-surface-500 dark:text-surface-400 text-sm">預計佣金</div>
                    <div class="text-green-500 dark:text-green-400 font-mono font-bold text-lg">{{ formatCurrency(currentReport.finalCommission) }}</div>
                </div>
            </div>

            <DataTable :value="currentReport.memberContributions" stripedRows class="p-datatable-sm">
                <Column field="memberAccount" header="會員帳號" style="min-width: 130px">
                     <template #body="slotProps">
                         <span class="text-blue-500 dark:text-blue-400">{{ slotProps.data.memberAccount }}</span>
                    </template>
                </Column>
                <Column field="totalBets" header="總投注" style="min-width: 120px">
                     <template #body="slotProps">
                         <span class="font-mono text-surface-900 dark:text-white">{{ formatCurrency(slotProps.data.totalBets) }}</span>
                    </template>
                </Column>
                <Column field="memberPL" header="會員盈虧" style="min-width: 120px">
                     <template #body="slotProps">
                         <span :class="slotProps.data.memberPL >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'" class="font-mono font-bold">
                             {{ formatCurrency(slotProps.data.memberPL) }}
                         </span>
                    </template>
                </Column>
                <Column field="bonusAllocation" header="應分攤紅利" style="min-width: 120px">
                     <template #body="slotProps">
                         <span class="font-mono text-orange-500 dark:text-orange-400">{{ formatCurrency(slotProps.data.bonusAllocation) }}</span>
                    </template>
                </Column>
            </DataTable>
        </div>
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
import { useToast } from 'primevue/usetoast'

const toast = useToast()

onMounted(() => {
    generateMockData()
})

const reports = ref<any[]>([])
const detailDialogVisible = ref(false)
const currentReport = ref<any>(null)

const filters = ref<{
    account: string
    period: Date | null
    status: string
}>({
    account: '',
    period: null,
    status: ''
})

const statusOptions = ref(['待結算', '待發放', '已發放'])

const filteredReports = computed(() => {
    let result = reports.value
    
    if (filters.value.account) {
        result = result.filter(r => r.account.includes(filters.value.account))
    }
    if (filters.value.status) {
        result = result.filter(r => r.status === filters.value.status)
    }
    
    return result
})

const handleSearch = () => {
    // Search is reactive via computed
}

const openDetailDialog = (report: any) => {
    currentReport.value = report
    detailDialogVisible.value = true
}

const executePayout = (report: any) => {
    report.status = '已發放'
    toast.add({ 
        severity: 'success', 
        summary: '發放成功', 
        detail: `已發放 ${formatCurrency(report.finalCommission)} 給 ${report.account}`, 
        life: 3000 
    })
}

const getStatusSeverity = (status: string) => {
    const severityMap: Record<string, string> = {
        '待結算': 'info',
        '待發放': 'warning',
        '已發放': 'success'
    }
    return severityMap[status] || 'info'
}

const generateMockData = () => {
    reports.value = [
        // Scenario 1: High-performing agent (completed)
        {
            id: 1,
            period: '2024/01',
            account: 'agent_master',
            teamPL: 500000,
            bonusDeduction: 100000,
            platformFee: 50000,
            netProfit: 350000,
            commissionRate: 45,
            finalCommission: 157500,
            status: '已發放',
            memberContributions: [
                { memberAccount: 'member_001', totalBets: 5000000, memberPL: -200000, bonusAllocation: 40000 },
                { memberAccount: 'member_002', totalBets: 3000000, memberPL: -150000, bonusAllocation: 30000 },
                { memberAccount: 'member_003', totalBets: 2000000, memberPL: -150000, bonusAllocation: 30000 }
            ]
        },
        // Scenario 2: Negative P/L agent (Members Won) - Carry Forward
        {
            id: 2,
            period: '2024/01',
            account: 'agent_001',
            teamPL: -150000,
            bonusDeduction: 10000,
            platformFee: 5000,
            netProfit: 0, // Will be calculated
            commissionRate: 30,
            finalCommission: 0, // Will be calculated
            status: '待結算',
            memberContributions: [
                { memberAccount: 'member_101', totalBets: 1000000, memberPL: 80000, bonusAllocation: 5000 },
                { memberAccount: 'member_102', totalBets: 800000, memberPL: 70000, bonusAllocation: 5000 }
            ]
        },
        // Scenario 3: Pending payout
        {
            id: 3,
            period: '2024/01',
            account: 'agent_002',
            teamPL: 200000,
            bonusDeduction: 30000,
            platformFee: 20000,
            netProfit: 150000,
            commissionRate: 35,
            finalCommission: 52500,
            status: '待發放',
            memberContributions: [
                { memberAccount: 'member_201', totalBets: 2000000, memberPL: -100000, bonusAllocation: 15000 },
                { memberAccount: 'member_202', totalBets: 1500000, memberPL: -100000, bonusAllocation: 15000 }
            ]
        },
        // Additional records (12 more)
        ...Array.from({ length: 12 }, (_, i) => ({
            id: i + 4,
            period: '2024/01',
            account: `agent_${String(i + 3).padStart(3, '0')}`,
            teamPL: Math.floor(Math.random() * 300000) - 50000,
            bonusDeduction: Math.floor(Math.random() * 40000),
            platformFee: Math.floor(Math.random() * 20000),
            netProfit: 0,
            commissionRate: [30, 35, 40, 45][Math.floor(Math.random() * 4)],
            finalCommission: 0,
            status: ['待結算', '待發放', '已發放'][Math.floor(Math.random() * 3)],
            memberContributions: [
                { memberAccount: `member_${i}01`, totalBets: Math.floor(Math.random() * 2000000), memberPL: Math.floor(Math.random() * 100000) - 50000, bonusAllocation: Math.floor(Math.random() * 20000) }
            ]
        }))
    ]
    
    // Generate derived fields
    reports.value.forEach(r => {
        r.netProfit = r.teamPL - r.bonusDeduction - r.platformFee
        // Allow negative commission
        r.finalCommission = Math.floor(r.netProfit * r.commissionRate / 100)
    })
}

const quickFilter = (type: 'thisMonth' | 'lastMonth' | 'last3Months') => {
    const now = new Date()
    let date = new Date()
    
    if (type === 'thisMonth') {
        date = now
    } else if (type === 'lastMonth') {
        date.setMonth(now.getMonth() - 1)
    } else if (type === 'last3Months') {
        // Just setting to last month as a start for the range for this demo
        date.setMonth(now.getMonth() - 3)
    }
    
    filters.value.period = date
    toast.add({ severity: 'info', summary: '已套用快速篩選', life: 1000 })
}

const exportReport = () => {
    toast.add({ severity: 'success', summary: '匯出成功', detail: '報表已匯出至 Excel', life: 2000 })
}

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1.5rem; }
:deep(.p-datatable-tbody > tr > td) { padding: 0.75rem 1rem; }
</style>
