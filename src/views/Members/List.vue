<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-users text-blue-400"></i>
      <span class="text-surface-300">會員管理</span>
      <span>></span>
      <span class="text-white font-medium">會員列表</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-search text-blue-400"></i>
          會員搜尋
        </div>
      </template>
      <template #content>
        <!-- Row 1: Nickname, Login IP, Agent Account -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="flex flex-col gap-2">
            <label class="text-surface-300 text-sm font-medium">暱稱</label>
            <InputText v-model="filters.nickname" placeholder="輸入會員暱稱" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-surface-300 text-sm font-medium">登入 IP</label>
            <InputText v-model="filters.loginIp" placeholder="輸入 IP 地址" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-surface-300 text-sm font-medium">代理帳號</label>
            <InputText v-model="filters.agentAccount" placeholder="輸入代理帳號" class="w-full" />
          </div>
        </div>

        <!-- Row 2: Balance Range, Balance Change Date -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="flex flex-col gap-2">
            <label class="text-surface-300 text-sm font-medium">錢包餘額範圍</label>
            <div class="flex items-center gap-2">
              <InputNumber v-model="filters.balanceMin" placeholder="最小" class="w-28" mode="currency" currency="USD" locale="en-US" />
              <span class="text-surface-400 font-medium">-</span>
              <InputNumber v-model="filters.balanceMax" placeholder="最大" class="w-28" mode="currency" currency="USD" locale="en-US" />
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-surface-300 text-sm font-medium">錢包異動日期</label>
            <Calendar v-model="filters.balanceChangeDateRange" selectionMode="range" placeholder="選擇日期區間" class="w-full" dateFormat="yy-mm-dd" showIcon :manualInput="false" />
          </div>
        </div>

        <!-- Row 3: Registration Time, Last Login Time -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="flex flex-col gap-2">
            <label class="text-surface-300 text-sm font-medium">註冊時間</label>
            <Calendar v-model="filters.registrationDateRange" selectionMode="range" placeholder="選擇日期區間" class="w-full" dateFormat="yy-mm-dd" showIcon :manualInput="false" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-surface-300 text-sm font-medium">上次登入時間</label>
            <Calendar v-model="filters.lastLoginDateRange" selectionMode="range" placeholder="選擇日期區間" class="w-full" dateFormat="yy-mm-dd" showIcon :manualInput="false" />
          </div>
        </div>

        <!-- Search & Reset Buttons -->
        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" class="px-8" />
        </div>
      </template>
    </Card>

    <!-- Member List Section -->
    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-white text-lg">
            <i class="pi pi-users text-green-400"></i>
            會員列表
            <span v-if="hasSearched" class="text-sm text-surface-400 font-normal ml-2">(共 {{ members.length }} 筆)</span>
          </div>
          <Button label="新增會員" icon="pi pi-plus" severity="success" @click="showAddMemberDialog = true" />
        </div>
      </template>
      <template #content>
        <div class="min-h-[400px]">
          <!-- Pagination -->
          <div v-if="hasSearched && members.length > 0" class="flex items-center justify-center gap-2 mb-4">
            <Button icon="pi pi-angle-double-left" text @click="goToPage(1)" :disabled="currentPage === 1" />
            <Button icon="pi pi-angle-left" text @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" />
            <template v-for="page in visiblePages" :key="page">
              <Button :label="String(page)" :class="page === currentPage ? 'bg-surface-600' : ''" :text="page !== currentPage" @click="goToPage(page)" />
            </template>
            <Button icon="pi pi-angle-right" text @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" />
            <Button icon="pi pi-angle-double-right" text @click="goToPage(totalPages)" :disabled="currentPage === totalPages" />
            <Dropdown v-model="rowsPerPage" :options="[10, 20, 50, 100]" class="w-20" />
          </div>

          <!-- DataTable -->
          <DataTable :value="hasSearched ? paginatedMembers : []" :loading="isSearching" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500' : 'pi-search text-surface-600']"></i>
                <p class="text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            <Column field="id" header="編號" sortable style="min-width: 80px">
              <template #body="slotProps"><span class="text-surface-400">{{ slotProps.data.id }}</span></template>
            </Column>
            <Column field="account" header="帳號" sortable style="min-width: 140px">
              <template #body="slotProps">
                <span class="text-blue-400 font-medium cursor-pointer hover:underline" @click="openMemberDetail(slotProps.data)">{{ slotProps.data.account }}</span>
              </template>
            </Column>
            <Column field="nickname" header="暱稱" sortable style="min-width: 120px">
              <template #body="slotProps"><span class="text-white">{{ slotProps.data.nickname }}</span></template>
            </Column>
            <Column field="agent" header="代理" sortable style="min-width: 100px">
              <template #body="slotProps"><span class="text-surface-300">{{ slotProps.data.agent }}</span></template>
            </Column>
            <Column field="loginIp" header="登入IP" sortable style="min-width: 140px">
              <template #body="slotProps"><span class="text-surface-400 text-sm font-mono">{{ slotProps.data.loginIp }}</span></template>
            </Column>
            <Column field="vip" header="VIP" sortable style="min-width: 60px">
              <template #body="slotProps"><span class="text-amber-400 font-bold">{{ slotProps.data.vip }}</span></template>
            </Column>
            <Column field="wallet" header="錢包" sortable style="min-width: 130px">
              <template #body="slotProps"><span class="text-white font-medium">{{ formatCurrency(slotProps.data.wallet) }}</span></template>
            </Column>
            <Column field="status" header="狀態" style="min-width: 80px">
              <template #body="slotProps"><Tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.statusText" /></template>
            </Column>
            <Column field="registerDate" header="註冊日期" sortable style="min-width: 110px">
              <template #body="slotProps"><span class="text-surface-400">{{ slotProps.data.registerDate }}</span></template>
            </Column>
            <Column field="lastLogin" header="最後登入" sortable style="min-width: 160px">
              <template #body="slotProps"><span class="text-surface-400 text-sm">{{ slotProps.data.lastLogin }}</span></template>
            </Column>
            <Column field="memo" header="備註" style="min-width: 100px">
              <template #body="slotProps"><Tag v-if="slotProps.data.memo" :value="slotProps.data.memo" severity="contrast" class="text-xs" /></template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>

    <!-- Add Member Dialog -->
    <Dialog v-model:visible="showAddMemberDialog" header="新增會員" :modal="true" :style="{ width: '500px' }">
      <div class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">帳號</label>
          <InputText v-model="newMember.account" placeholder="請輸入帳號" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">暱稱</label>
          <InputText v-model="newMember.nickname" placeholder="請輸入暱稱" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">代理</label>
          <Dropdown v-model="newMember.agent" :options="agentOptions" optionLabel="label" optionValue="value" placeholder="選擇代理" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">VIP等級</label>
          <Dropdown v-model="newMember.vip" :options="vipOptions" optionLabel="label" optionValue="value" placeholder="選擇VIP等級" />
        </div>
      </div>
      <template #footer>
        <Button label="取消" severity="secondary" @click="showAddMemberDialog = false" />
        <Button label="確認新增" icon="pi pi-check" @click="handleAddMember" />
      </template>
    </Dialog>

    <!-- Member Detail Modal -->
    <Dialog 
      v-model:visible="showMemberDetailDialog" 
      :header="`會員詳情 - ${selectedMember?.account || ''}`"
      :modal="true"
      :dismissableMask="true"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      :contentStyle="{ padding: '0' }"
    >
      <div class="flex gap-4 p-4" v-if="memberDetail">
        <!-- Left Panel (25%) - Core Info Card -->
        <div class="w-1/4 space-y-4">
          <!-- Profile Card -->
          <div class="bg-surface-800 rounded-lg p-4 border border-surface-700">
            <div class="text-center mb-4">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto flex items-center justify-center text-3xl font-bold text-white">
                {{ memberDetail.account.charAt(0).toUpperCase() }}
              </div>
              <h3 class="text-white font-bold text-lg mt-3">{{ memberDetail.account }}</h3>
              <p class="text-surface-400 text-sm">{{ memberDetail.nickname || '未設定暱稱' }}</p>
            </div>
            
            <!-- VIP Badge -->
            <div class="flex justify-center mb-4">
              <Tag :value="`VIP ${memberDetail.vip}`" :severity="memberDetail.vip >= 3 ? 'warn' : 'info'" class="text-lg px-4 py-1" />
            </div>
            
            <!-- Wallet Balance -->
            <div class="bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 rounded-lg p-4 text-center border border-emerald-600/30 mb-4">
              <p class="text-surface-400 text-xs mb-1">錢包總額</p>
              <p class="text-2xl font-bold text-emerald-400">${{ formatCurrency(memberDetail.wallet) }}</p>
            </div>
            
            <!-- Status -->
            <div class="flex justify-center mb-4">
              <Tag :severity="getStatusSeverity(memberDetail.status)" :value="memberDetail.statusText" class="text-sm" />
            </div>
            
            <!-- Quick Actions -->
            <div class="space-y-2">
              <Button label="重置密碼" icon="pi pi-key" severity="warn" outlined class="w-full" size="small" @click="handleResetPassword" />
              <Button label="強制踢下線" icon="pi pi-power-off" severity="danger" outlined class="w-full" size="small" @click="handleForceLogout" />
              <Button label="凍結帳號" icon="pi pi-lock" severity="secondary" outlined class="w-full" size="small" @click="handleFreezeAccount" />
            </div>
          </div>
        </div>

        <!-- Right Panel (75%) - TabView -->
        <div class="w-3/4">
          <TabView>
            <!-- Tab 1: 個人資料 -->
            <TabPanel value="0" header="個人資料">
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
                  <p class="text-surface-400 text-xs mb-1">真實姓名</p>
                  <p class="text-white font-medium">{{ memberDetail.profile.realName }}</p>
                </div>
                <div class="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
                  <p class="text-surface-400 text-xs mb-1">手機號碼</p>
                  <p class="text-white font-medium">{{ memberDetail.profile.phone }}</p>
                </div>
                <div class="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
                  <p class="text-surface-400 text-xs mb-1">電子郵件</p>
                  <p class="text-white font-medium">{{ memberDetail.profile.email }}</p>
                </div>
                <div class="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
                  <p class="text-surface-400 text-xs mb-1">代理路徑</p>
                  <p class="text-blue-400 font-medium">{{ memberDetail.profile.agentPath }}</p>
                </div>
                <div class="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
                  <p class="text-surface-400 text-xs mb-1">註冊 IP</p>
                  <p class="text-white font-mono text-sm">{{ memberDetail.profile.registerIp }}</p>
                </div>
                <div class="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
                  <p class="text-surface-400 text-xs mb-1">最後登入 IP</p>
                  <p class="text-white font-mono text-sm">{{ memberDetail.loginIp }}</p>
                </div>
                <div class="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
                  <p class="text-surface-400 text-xs mb-1">註冊時間</p>
                  <p class="text-white font-medium">{{ memberDetail.registerDate }}</p>
                </div>
                <div class="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
                  <p class="text-surface-400 text-xs mb-1">最後登入</p>
                  <p class="text-white font-medium">{{ memberDetail.lastLogin }}</p>
                </div>
                <div class="col-span-2 bg-surface-800/50 rounded-lg p-3 border border-surface-700">
                  <p class="text-surface-400 text-xs mb-1">備註</p>
                  <p class="text-white">{{ memberDetail.memo || '無備註' }}</p>
                </div>
              </div>
            </TabPanel>

            <!-- Tab 2: 會員日誌 -->
            <TabPanel value="1" header="會員日誌">
              <DataTable :value="memberDetail.logs" stripedRows class="p-datatable-sm">
                <Column field="action" header="行為" style="min-width: 120px">
                  <template #body="slotProps">
                    <Tag :value="slotProps.data.action" :severity="getLogSeverity(slotProps.data.type)" />
                  </template>
                </Column>
                <Column field="ip" header="IP" style="min-width: 140px">
                  <template #body="slotProps"><span class="text-surface-400 font-mono text-sm">{{ slotProps.data.ip }}</span></template>
                </Column>
                <Column field="time" header="時間" style="min-width: 160px">
                  <template #body="slotProps"><span class="text-surface-400">{{ slotProps.data.time }}</span></template>
                </Column>
                <Column field="description" header="操作描述" style="min-width: 200px">
                  <template #body="slotProps"><span class="text-white">{{ slotProps.data.description }}</span></template>
                </Column>
              </DataTable>
            </TabPanel>

            <!-- Tab 3: 金流紀錄 -->
            <TabPanel value="2" header="金流紀錄">
              <!-- Summary Stats -->
              <div class="grid grid-cols-3 gap-4 mb-4">
                <div class="bg-gradient-to-br from-green-900/30 to-surface-800 rounded-lg p-4 border border-green-600/30 text-center">
                  <p class="text-surface-400 text-xs mb-1">總充值</p>
                  <p class="text-2xl font-bold text-green-400">${{ formatCurrency(memberDetail.finance.totalDeposit) }}</p>
                </div>
                <div class="bg-gradient-to-br from-orange-900/30 to-surface-800 rounded-lg p-4 border border-orange-600/30 text-center">
                  <p class="text-surface-400 text-xs mb-1">總提現</p>
                  <p class="text-2xl font-bold text-orange-400">${{ formatCurrency(memberDetail.finance.totalWithdraw) }}</p>
                </div>
                <div class="bg-gradient-to-br from-blue-900/30 to-surface-800 rounded-lg p-4 border border-blue-600/30 text-center">
                  <p class="text-surface-400 text-xs mb-1">總損益</p>
                  <p class="text-2xl font-bold" :class="memberDetail.finance.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'">
                    {{ memberDetail.finance.totalProfit >= 0 ? '+' : '' }}${{ formatCurrency(memberDetail.finance.totalProfit) }}
                  </p>
                </div>
              </div>
              
              <!-- Recent Transactions -->
              <h4 class="text-white font-medium mb-2">最近 5 筆交易</h4>
              <DataTable :value="memberDetail.finance.recentTransactions" stripedRows class="p-datatable-sm">
                <Column field="type" header="類型" style="min-width: 80px">
                  <template #body="slotProps">
                    <Tag :value="slotProps.data.type" :severity="slotProps.data.type === '充值' ? 'success' : 'warn'" />
                  </template>
                </Column>
                <Column field="amount" header="金額" style="min-width: 120px">
                  <template #body="slotProps">
                    <span :class="slotProps.data.type === '充值' ? 'text-green-400' : 'text-orange-400'" class="font-bold">
                      {{ slotProps.data.type === '充值' ? '+' : '-' }}${{ formatCurrency(slotProps.data.amount) }}
                    </span>
                  </template>
                </Column>
                <Column field="channel" header="渠道" style="min-width: 100px">
                  <template #body="slotProps"><span class="text-surface-300">{{ slotProps.data.channel }}</span></template>
                </Column>
                <Column field="time" header="時間" style="min-width: 160px">
                  <template #body="slotProps"><span class="text-surface-400">{{ slotProps.data.time }}</span></template>
                </Column>
                <Column field="status" header="狀態" style="min-width: 80px">
                  <template #body="slotProps"><Tag :value="slotProps.data.status" :severity="slotProps.data.status === '成功' ? 'success' : 'warn'" /></template>
                </Column>
              </DataTable>
            </TabPanel>

            <!-- Tab 4: 遊戲紀錄 -->
            <TabPanel value="3" header="遊戲紀錄">
              <!-- Platform Stats -->
              <div class="grid grid-cols-4 gap-4 mb-4">
                <div v-for="platform in memberDetail.gaming.platforms" :key="platform.name" class="bg-surface-800/50 rounded-lg p-3 border border-surface-700">
                  <div class="flex items-center gap-2 mb-2">
                    <i :class="platform.icon" class="text-lg"></i>
                    <span class="text-white font-medium">{{ platform.name }}</span>
                  </div>
                  <p class="text-surface-400 text-xs">投注額</p>
                  <p class="text-white font-bold">${{ formatCurrency(platform.totalBet) }}</p>
                  <p class="text-surface-400 text-xs mt-1">盈虧</p>
                  <p :class="platform.profit >= 0 ? 'text-emerald-400' : 'text-red-400'" class="font-bold">
                    {{ platform.profit >= 0 ? '+' : '' }}${{ formatCurrency(platform.profit) }}
                  </p>
                </div>
              </div>
              
              <!-- Profit Trend Chart -->
              <h4 class="text-white font-medium mb-2">近 7 日損益走勢</h4>
              <div class="bg-surface-800/50 rounded-lg p-4 border border-surface-700 h-64">
                <Chart type="line" :data="profitChartData" :options="profitChartOptions" class="h-full" />
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Chart from 'primevue/chart'
import { useToast } from 'primevue/usetoast'
import { useTheme } from '@/composables/useTheme'

const toast = useToast()
const { chartColors } = useTheme()

// Filter options
const vipOptions = ref([
  { label: 'VIP 0', value: 0 },
  { label: 'VIP 1', value: 1 },
  { label: 'VIP 2', value: 2 },
  { label: 'VIP 3', value: 3 },
  { label: 'VIP 4', value: 4 },
  { label: 'VIP 5', value: 5 }
])

const agentOptions = ref([
  { label: 'proxial7', value: 'proxial7' },
  { label: 'delegrix21', value: 'delegrix21' },
  { label: 'mandatrx9', value: 'mandatrx9' },
  { label: 'subven88', value: 'subven88' },
  { label: 'repzen14', value: 'repzen14' }
])

// Filter state
const filters = ref({
  nickname: '',
  loginIp: '',
  agentAccount: '',
  balanceMin: null as number | null,
  balanceMax: null as number | null,
  balanceChangeDateRange: null as Date[] | null,
  registrationDateRange: null as Date[] | null,
  lastLoginDateRange: null as Date[] | null
})

// Search state
const isSearching = ref(false)
const hasSearched = ref(false)

// Pagination
const currentPage = ref(1)
const rowsPerPage = ref(10)

// Add member dialog
const showAddMemberDialog = ref(false)
const newMember = ref({ account: '', nickname: '', agent: '', vip: 0 })

// Member Detail Modal
const showMemberDetailDialog = ref(false)
const selectedMember = ref<typeof members.value[0] | null>(null)
const memberDetail = ref<{
  account: string
  nickname: string
  vip: number
  wallet: number
  status: string
  statusText: string
  loginIp: string
  registerDate: string
  lastLogin: string
  memo: string
  profile: {
    realName: string
    phone: string
    email: string
    agentPath: string
    registerIp: string
  }
  logs: Array<{ action: string; type: string; ip: string; time: string; description: string }>
  finance: {
    totalDeposit: number
    totalWithdraw: number
    totalProfit: number
    recentTransactions: Array<{ type: string; amount: number; channel: string; time: string; status: string }>
  }
  gaming: {
    platforms: Array<{ name: string; icon: string; totalBet: number; profit: number }>
    profitTrend: number[]
  }
} | null>(null)

// Member data
const members = ref<Array<{
  id: number
  account: string
  nickname: string
  agent: string
  loginIp: string
  vip: number
  wallet: number
  status: string
  statusText: string
  registerDate: string
  lastLogin: string
  memo: string
}>>([])

// Generate random IP
const generateIp = () => {
  if (Math.random() > 0.85) {
    const segments = []
    for (let i = 0; i < 8; i++) segments.push(Math.floor(Math.random() * 65536).toString(16).padStart(4, '0'))
    return segments.join(':')
  }
  return `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
}

// Generate random date
const generateRandomDate = () => {
  const now = new Date()
  const pastYear = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
  const date = new Date(pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime()))
  return date.toISOString().replace('T', ' ').substring(0, 19)
}

// Generate mock members
const generateMockMembers = () => {
  const accountPrefixes = ['VIP_user_', 'player', 'verylongaccountname_', 'x', 'pro_', 'mega', '玩家', 'user', 'big_', 'new_']
  const accountSuffixes = ['999', '123', '88', 'A1', '_elite', '007', '', 'X', '666', '2024']
  const nicknames = ['瀾城七號', '御城十二苑', '888發發發', 'DragonKing', '玩家123', 'Winner_X', '金牌高手', 'LuckyOne_99', '深夜玩家', 'pro_gamer', '財神爺', 'VIPMaster', '高富帥88', 'slot_lover', '博彩達人', '夜貓族', 'BetKing2024', '賭神再現', 'jackpot_hunter', '月光下的賭徒', 'TopPlayer_Elite', '逆襲之王', '暴富達人', '', 'NoName', '超級長的暱稱測試用戶名稱', 'A', '123', 'xxx', '測試帳號']
  const agents = ['proxial7', 'delegrix21', 'mandatrx9', 'subven88', 'repzen14', '', 'agent_vip', 'direct']
  const statuses = [{ status: 'active', statusText: '正常' }, { status: 'frozen', statusText: '凍結' }, { status: 'pending', statusText: '待審' }, { status: 'active', statusText: '正常' }, { status: 'active', statusText: '正常' }]
  const memos = ['', '', '', '黑名單', '', '高風險', '', '', 'VIP', '', '觀察中', '首充獎勵', '', '異常IP', '']

  const memberCount = 20 + Math.floor(Math.random() * 31)
  const memberList = []
  
  for (let i = 0; i < memberCount; i++) {
    const prefix = accountPrefixes[Math.floor(Math.random() * accountPrefixes.length)]
    const suffix = accountSuffixes[Math.floor(Math.random() * accountSuffixes.length)]
    const randomNum = Math.floor(Math.random() * 10000)
    const statusInfo = statuses[Math.floor(Math.random() * statuses.length)]
    const rand = Math.random()
    let wallet = 0
    if (rand > 0.1) wallet = rand < 0.3 ? Math.random() * 100 : rand < 0.6 ? Math.random() * 10000 : rand < 0.85 ? Math.random() * 500000 : Math.random() * 9527143.20
    
    memberList.push({
      id: 10010 + i,
      account: `${prefix}${randomNum}${suffix}`,
      nickname: nicknames[Math.floor(Math.random() * nicknames.length)] ?? '',
      agent: agents[Math.floor(Math.random() * agents.length)] ?? '',
      loginIp: generateIp(),
      vip: Math.floor(Math.random() * 6),
      wallet,
      status: statusInfo?.status ?? 'active',
      statusText: statusInfo?.statusText ?? '正常',
      registerDate: generateRandomDate().split(' ')[0] ?? '',
      lastLogin: generateRandomDate(),
      memo: memos[Math.floor(Math.random() * memos.length)] ?? ''
    })
  }
  return memberList
}

// Generate member detail mock data
const generateMemberDetail = (member: typeof members.value[0]) => {
  const names = ['張偉', '王芳', '李強', '陳明', '劉洋', '楊靜', '趙麗', '黃勇', '周軍', '吳敏']
  const phones = ['+86 138****8888', '+886 912***345', '+852 9***8765', '+65 8***1234', '+1 555-***-7890']
  const emails = ['vip@example.com', 'player@gmail.com', 'member@outlook.com', 'game@yahoo.com', 'user@163.com']
  const channels = ['銀行卡', 'USDT', '支付寶', '微信', 'GCash', 'Paytm']
  const actions = ['登入', '登出', '充值', '提現', '下注', '修改密碼', '異常登入']
  const actionTypes = ['info', 'info', 'success', 'warn', 'info', 'warn', 'danger']

  // Generate logs
  const logs = []
  for (let i = 0; i < 10; i++) {
    const actionIdx = Math.floor(Math.random() * actions.length)
    logs.push({
      action: actions[actionIdx] ?? '登入',
      type: actionTypes[actionIdx] ?? 'info',
      ip: generateIp(),
      time: generateRandomDate(),
      description: `${actions[actionIdx]}操作 - ${Math.random() > 0.5 ? '成功' : '已記錄'}`
    })
  }

  // Generate transactions
  const transactions = []
  for (let i = 0; i < 5; i++) {
    const isDeposit = Math.random() > 0.4
    transactions.push({
      type: isDeposit ? '充值' : '提現',
      amount: Math.floor(Math.random() * 50000) + 100,
      channel: channels[Math.floor(Math.random() * channels.length)] ?? '銀行卡',
      time: generateRandomDate(),
      status: Math.random() > 0.1 ? '成功' : '處理中'
    })
  }

  // Generate profit trend
  const profitTrend = []
  for (let i = 0; i < 7; i++) {
    profitTrend.push(Math.floor((Math.random() - 0.4) * 10000))
  }

  return {
    account: member.account,
    nickname: member.nickname,
    vip: member.vip,
    wallet: member.wallet,
    status: member.status,
    statusText: member.statusText,
    loginIp: member.loginIp,
    registerDate: member.registerDate,
    lastLogin: member.lastLogin,
    memo: member.memo,
    profile: {
      realName: names[Math.floor(Math.random() * names.length)] ?? '未設定',
      phone: phones[Math.floor(Math.random() * phones.length)] ?? '未綁定',
      email: emails[Math.floor(Math.random() * emails.length)] ?? '未綁定',
      agentPath: `root > ${member.agent || 'direct'}`,
      registerIp: generateIp()
    },
    logs,
    finance: {
      totalDeposit: Math.floor(Math.random() * 500000) + 1000,
      totalWithdraw: Math.floor(Math.random() * 300000),
      totalProfit: Math.floor((Math.random() - 0.5) * 200000),
      recentTransactions: transactions
    },
    gaming: {
      platforms: [
        { name: '真人娛樂', icon: 'pi pi-video text-purple-400', totalBet: Math.floor(Math.random() * 1000000), profit: Math.floor((Math.random() - 0.5) * 100000) },
        { name: '電子遊戲', icon: 'pi pi-star text-yellow-400', totalBet: Math.floor(Math.random() * 500000), profit: Math.floor((Math.random() - 0.5) * 50000) },
        { name: '體育投注', icon: 'pi pi-flag text-green-400', totalBet: Math.floor(Math.random() * 300000), profit: Math.floor((Math.random() - 0.5) * 30000) },
        { name: '彩票遊戲', icon: 'pi pi-ticket text-orange-400', totalBet: Math.floor(Math.random() * 200000), profit: Math.floor((Math.random() - 0.5) * 20000) }
      ],
      profitTrend
    }
  }
}

// Chart data
const profitChartData = computed(() => ({
  labels: ['6天前', '5天前', '4天前', '3天前', '2天前', '昨天', '今天'],
  datasets: [{
    label: '損益',
    data: memberDetail.value?.gaming.profitTrend ?? [0, 0, 0, 0, 0, 0, 0],
    fill: true,
    borderColor: '#3b82f6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    tension: 0.4
  }]
}))

const profitChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: chartColors.value.tooltipBg,
      titleColor: chartColors.value.tooltipTitle,
      bodyColor: chartColors.value.tooltipBody,
      borderColor: chartColors.value.tooltipBorder,
      borderWidth: 1
    }
  },
  scales: {
    x: { grid: { color: chartColors.value.gridColor }, ticks: { color: chartColors.value.textColor } },
    y: { grid: { color: chartColors.value.gridColor }, ticks: { color: chartColors.value.textColor, callback: (v: number) => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}` } }
  }
}))

// Computed
const totalPages = computed(() => Math.max(1, Math.ceil(members.value.length / rowsPerPage.value)))
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})
const paginatedMembers = computed(() => members.value.slice((currentPage.value - 1) * rowsPerPage.value, currentPage.value * rowsPerPage.value))

// Format functions
const formatCurrency = (value: number): string => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
const getStatusSeverity = (status: string) => ({ active: 'success', frozen: 'danger', disabled: 'secondary', pending: 'warn' }[status] ?? 'info')
const getLogSeverity = (type: string) => ({ info: 'info', success: 'success', warn: 'warn', danger: 'danger' }[type] ?? 'info')

// Actions
const goToPage = (page: number) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }

const openMemberDetail = (member: typeof members.value[0]) => {
  selectedMember.value = member
  memberDetail.value = generateMemberDetail(member)
  showMemberDetailDialog.value = true
}

const handleSearch = () => {
  isSearching.value = true
  setTimeout(() => {
    members.value = generateMockMembers()
    currentPage.value = 1
    hasSearched.value = true
    isSearching.value = false
    toast.add({ severity: 'success', summary: '搜尋完成', detail: `共找到 ${members.value.length} 筆會員資料`, life: 3000 })
  }, 1000)
}

const handleReset = () => {
  filters.value = { nickname: '', loginIp: '', agentAccount: '', balanceMin: null, balanceMax: null, balanceChangeDateRange: null, registrationDateRange: null, lastLoginDateRange: null }
  toast.add({ severity: 'info', summary: '已重置', detail: '所有搜尋條件已清空', life: 2000 })
}

const handleAddMember = () => {
  const newId = members.value.length > 0 ? Math.max(...members.value.map(m => m.id)) + 1 : 10010
  members.value.unshift({ id: newId, account: newMember.value.account, nickname: newMember.value.nickname, agent: newMember.value.agent, loginIp: '0.0.0.0', vip: newMember.value.vip, wallet: 0, status: 'active', statusText: '正常', registerDate: new Date().toISOString().split('T')[0] ?? '', lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19), memo: '' })
  showAddMemberDialog.value = false
  const addedAccount = newMember.value.account
  newMember.value = { account: '', nickname: '', agent: '', vip: 0 }
  hasSearched.value = true
  toast.add({ severity: 'success', summary: '新增成功', detail: `會員 ${addedAccount} 已成功建立`, life: 3000 })
}

const handleResetPassword = () => toast.add({ severity: 'warn', summary: '操作確認', detail: `已發送密碼重置郵件給 ${selectedMember.value?.account}`, life: 3000 })
const handleForceLogout = () => toast.add({ severity: 'success', summary: '執行成功', detail: `已強制踢下線 ${selectedMember.value?.account}`, life: 3000 })
const handleFreezeAccount = () => toast.add({ severity: 'info', summary: '帳號已凍結', detail: `${selectedMember.value?.account} 帳號已被凍結`, life: 3000 })
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
:deep(.p-datatable .p-datatable-thead > tr > th) { background-color: rgba(30, 41, 59, 0.5); color: #94a3b8; border-color: rgba(71, 85, 105, 0.5); padding: 0.75rem 1rem; font-weight: 600; }
:deep(.p-datatable .p-datatable-tbody > tr) { background-color: transparent; }
:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) { background-color: rgba(30, 41, 59, 0.3); }
:deep(.p-datatable .p-datatable-tbody > tr > td) { border-color: rgba(71, 85, 105, 0.3); padding: 0.75rem 1rem; }
:deep(.p-datatable .p-datatable-tbody > tr:hover) { background-color: rgba(59, 130, 246, 0.1); }
:deep(.p-inputtext), :deep(.p-dropdown), :deep(.p-multiselect), :deep(.p-calendar), :deep(.p-inputnumber) { background-color: rgba(30, 41, 59, 0.5); border-color: rgba(71, 85, 105, 0.5); }
:deep(.p-dialog) { background-color: #1e293b; }
:deep(.p-dialog .p-dialog-header) { background-color: #1e293b; border-bottom: 1px solid rgba(71, 85, 105, 0.5); }
:deep(.p-dialog .p-dialog-content) { background-color: #1e293b; }
:deep(.p-dialog .p-dialog-footer) { background-color: #1e293b; border-top: 1px solid rgba(71, 85, 105, 0.5); }
:deep(.p-tabview .p-tabview-nav) { background-color: transparent; border-color: rgba(71, 85, 105, 0.5); }
:deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link) { background-color: transparent; color: #94a3b8; border-color: transparent; }
:deep(.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link) { background-color: transparent; color: #3b82f6; border-color: #3b82f6; }
:deep(.p-tabview .p-tabview-panels) { background-color: transparent; padding: 1rem 0; }
</style>
