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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Row 1: Name -->
          <div class="flex items-center gap-3">
            <Checkbox v-model="filters.nameEnabled" :binary="true" />
            <label class="w-24 text-surface-300 text-sm shrink-0">名稱</label>
            <InputText 
              v-model="filters.name" 
              placeholder="會員帳號 / 暱稱" 
              class="flex-1"
              :disabled="!filters.nameEnabled"
            />
          </div>
          <div></div>

          <!-- Row 2: Agent -->
          <div class="flex items-center gap-3">
            <Checkbox v-model="filters.agentEnabled" :binary="true" />
            <label class="w-24 text-surface-300 text-sm shrink-0">代理</label>
            <InputText 
              v-model="filters.agent" 
              placeholder="代理帳號 / 代理暱稱" 
              class="flex-1"
              :disabled="!filters.agentEnabled"
            />
          </div>
          <div></div>

          <!-- Row 3: IP -->
          <div class="flex items-center gap-3">
            <Checkbox v-model="filters.ipEnabled" :binary="true" />
            <label class="w-24 text-surface-300 text-sm shrink-0">玩家登入IP</label>
            <InputText 
              v-model="filters.ip" 
              placeholder="請輸入IP" 
              class="flex-1"
              :disabled="!filters.ipEnabled"
            />
          </div>
          <div></div>

          <!-- Row 4: Player Status -->
          <div class="flex items-center gap-3">
            <Checkbox v-model="filters.statusEnabled" :binary="true" />
            <label class="w-24 text-surface-300 text-sm shrink-0">玩家狀態</label>
            <MultiSelect 
              v-model="filters.status" 
              :options="statusOptions" 
              optionLabel="label"
              optionValue="value"
              placeholder="請選擇狀態(可複選)" 
              class="flex-1"
              :disabled="!filters.statusEnabled"
            />
          </div>
          <div></div>

          <!-- Row 5: VIP Level -->
          <div class="flex items-center gap-3">
            <Checkbox v-model="filters.vipEnabled" :binary="true" />
            <label class="w-24 text-surface-300 text-sm shrink-0">VIP等級</label>
            <MultiSelect 
              v-model="filters.vipLevel" 
              :options="vipOptions" 
              optionLabel="label"
              optionValue="value"
              placeholder="請選擇VIP等級(可複選)" 
              class="flex-1"
              :disabled="!filters.vipEnabled"
            />
          </div>
          <div></div>

          <!-- Row 6: Wallet Balance Range -->
          <div class="flex items-center gap-3 lg:col-span-2">
            <Checkbox v-model="filters.walletEnabled" :binary="true" />
            <label class="w-24 text-surface-300 text-sm shrink-0">錢包餘額</label>
            <InputNumber 
              v-model="filters.walletMin" 
              placeholder="請選擇錢包起始金額" 
              class="flex-1"
              :disabled="!filters.walletEnabled"
              mode="currency"
              currency="USD"
              locale="en-US"
            />
            <InputNumber 
              v-model="filters.walletMax" 
              placeholder="請選擇錢包上限金額" 
              class="flex-1"
              :disabled="!filters.walletEnabled"
              mode="currency"
              currency="USD"
              locale="en-US"
            />
          </div>

          <!-- Row 7: Registration Date Range -->
          <div class="flex items-center gap-3 lg:col-span-2">
            <Checkbox v-model="filters.regDateEnabled" :binary="true" />
            <label class="w-24 text-surface-300 text-sm shrink-0">玩家註冊日期</label>
            <Calendar 
              v-model="filters.regDateStart" 
              placeholder="開始查詢日期" 
              class="flex-1"
              :disabled="!filters.regDateEnabled"
              dateFormat="yy-mm-dd"
              showIcon
            />
            <Calendar 
              v-model="filters.regDateEnd" 
              placeholder="結束查詢日期" 
              class="flex-1"
              :disabled="!filters.regDateEnabled"
              dateFormat="yy-mm-dd"
              showIcon
            />
          </div>

          <!-- Row 8: Last Login Date Range -->
          <div class="flex items-center gap-3 lg:col-span-2">
            <Checkbox v-model="filters.lastLoginEnabled" :binary="true" />
            <label class="w-24 text-surface-300 text-sm shrink-0">上次登入</label>
            <Calendar 
              v-model="filters.lastLoginStart" 
              placeholder="開始查詢日期" 
              class="flex-1"
              :disabled="!filters.lastLoginEnabled"
              dateFormat="yy-mm-dd"
              showIcon
            />
            <Calendar 
              v-model="filters.lastLoginEnd" 
              placeholder="結束查詢日期" 
              class="flex-1"
              :disabled="!filters.lastLoginEnabled"
              dateFormat="yy-mm-dd"
              showIcon
            />
          </div>

          <!-- Row 9: Wallet Change Date Range -->
          <div class="flex items-center gap-3 lg:col-span-2">
            <Checkbox v-model="filters.walletDateEnabled" :binary="true" />
            <label class="w-24 text-surface-300 text-sm shrink-0">錢包異動日期</label>
            <Calendar 
              v-model="filters.walletDateStart" 
              placeholder="開始查詢日期" 
              class="flex-1"
              :disabled="!filters.walletDateEnabled"
              dateFormat="yy-mm-dd"
              showIcon
            />
            <Calendar 
              v-model="filters.walletDateEnd" 
              placeholder="結束查詢日期" 
              class="flex-1"
              :disabled="!filters.walletDateEnabled"
              dateFormat="yy-mm-dd"
              showIcon
            />
          </div>
        </div>

        <!-- Search Button -->
        <div class="flex justify-end mt-6">
          <Button 
            label="搜尋" 
            icon="pi pi-search" 
            :loading="isSearching"
            @click="handleSearch"
            class="px-8"
          />
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
          </div>
          <Button 
            label="新增會員" 
            icon="pi pi-plus" 
            severity="success"
            @click="showAddMemberDialog = true"
          />
        </div>
      </template>
      <template #content>
        <!-- Pagination Top -->
        <div class="flex items-center justify-center gap-2 mb-4">
          <Button icon="pi pi-angle-double-left" text @click="goToPage(1)" :disabled="currentPage === 1" />
          <Button icon="pi pi-angle-left" text @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" />
          <template v-for="page in visiblePages" :key="page">
            <Button 
              :label="String(page)" 
              :class="page === currentPage ? 'bg-surface-600' : ''"
              :text="page !== currentPage"
              @click="goToPage(page)"
            />
          </template>
          <Button icon="pi pi-angle-right" text @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" />
          <Button icon="pi pi-angle-double-right" text @click="goToPage(totalPages)" :disabled="currentPage === totalPages" />
          <Dropdown 
            v-model="rowsPerPage" 
            :options="[10, 20, 50, 100]" 
            class="w-20"
          />
          <div class="flex items-center gap-2 ml-2">
            <InputNumber 
              v-model="jumpToPageValue" 
              :min="1" 
              :max="totalPages" 
              class="w-16"
              inputClass="text-center"
            />
          </div>
        </div>

        <!-- DataTable -->
        <DataTable 
          :value="paginatedMembers" 
          :loading="isSearching"
          stripedRows
          class="p-datatable-sm"
          :pt="{
            table: { class: 'min-w-full' },
            tbody: { class: 'text-surface-300' }
          }"
        >
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="id" header="編號" sortable style="min-width: 80px">
            <template #body="slotProps">
              <span class="text-surface-400">{{ slotProps.data.id }}</span>
            </template>
          </Column>
          <Column field="account" header="帳號" sortable style="min-width: 100px">
            <template #body="slotProps">
              <span class="text-blue-400 font-medium">{{ slotProps.data.account }}</span>
            </template>
          </Column>
          <Column field="nickname" header="暱稱" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-white">{{ slotProps.data.nickname }}</span>
            </template>
          </Column>
          <Column field="agent" header="代理" sortable style="min-width: 100px">
            <template #body="slotProps">
              <span class="text-surface-300">{{ slotProps.data.agent }}</span>
            </template>
          </Column>
          <Column field="vip" header="VIP" sortable style="min-width: 60px">
            <template #body="slotProps">
              <span class="text-amber-400 font-bold">{{ slotProps.data.vip }}</span>
            </template>
          </Column>
          <Column field="wallet" header="錢包" sortable style="min-width: 120px">
            <template #body="slotProps">
              <span class="text-white font-medium">{{ formatCurrency(slotProps.data.wallet) }}</span>
            </template>
          </Column>
          <Column field="status" header="狀態" style="min-width: 80px">
            <template #body="slotProps">
              <Tag 
                :severity="getStatusSeverity(slotProps.data.status)" 
                :value="slotProps.data.statusText"
              />
            </template>
          </Column>
          <Column field="registerDate" header="註冊日期" sortable style="min-width: 110px">
            <template #body="slotProps">
              <span class="text-surface-400">{{ slotProps.data.registerDate }}</span>
            </template>
          </Column>
          <Column field="walletChange" header="最近錢包變動" sortable style="min-width: 130px">
            <template #body="slotProps">
              <span 
                class="font-bold"
                :class="getWalletChangeColor(slotProps.data.walletChange)"
              >
                {{ formatWalletChange(slotProps.data.walletChange) }}
              </span>
            </template>
          </Column>
          <Column field="createdAt" header="建立時間" sortable style="min-width: 160px">
            <template #body="slotProps">
              <span class="text-surface-400 text-sm">{{ slotProps.data.createdAt }}</span>
            </template>
          </Column>
          <Column field="memo" header="備註" style="min-width: 100px">
            <template #body="slotProps">
              <Tag 
                v-if="slotProps.data.memo" 
                :value="slotProps.data.memo" 
                severity="contrast"
                class="text-xs"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Add Member Dialog -->
    <Dialog 
      v-model:visible="showAddMemberDialog" 
      header="新增會員" 
      :modal="true"
      :style="{ width: '500px' }"
    >
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
          <Dropdown 
            v-model="newMember.agent" 
            :options="agentOptions" 
            optionLabel="label"
            optionValue="value"
            placeholder="選擇代理"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-300">VIP等級</label>
          <Dropdown 
            v-model="newMember.vip" 
            :options="vipOptions" 
            optionLabel="label"
            optionValue="value"
            placeholder="選擇VIP等級"
          />
        </div>
      </div>
      <template #footer>
        <Button label="取消" severity="secondary" @click="showAddMemberDialog = false" />
        <Button label="確認新增" icon="pi pi-check" @click="handleAddMember" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import MultiSelect from 'primevue/multiselect'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// Filter options
const statusOptions = ref([
  { label: '正常', value: 'active' },
  { label: '凍結', value: 'frozen' },
  { label: '停用', value: 'disabled' },
  { label: '待審核', value: 'pending' }
])

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
  nameEnabled: false,
  name: '',
  agentEnabled: false,
  agent: '',
  ipEnabled: false,
  ip: '',
  statusEnabled: false,
  status: [],
  vipEnabled: false,
  vipLevel: [],
  walletEnabled: false,
  walletMin: null,
  walletMax: null,
  regDateEnabled: false,
  regDateStart: null,
  regDateEnd: null,
  lastLoginEnabled: false,
  lastLoginStart: null,
  lastLoginEnd: null,
  walletDateEnabled: false,
  walletDateStart: null,
  walletDateEnd: null
})

// Search state
const isSearching = ref(false)

// Pagination
const currentPage = ref(1)
const rowsPerPage = ref(10)
const jumpToPageValue = ref(1)

// Add member dialog
const showAddMemberDialog = ref(false)
const newMember = ref({
  account: '',
  nickname: '',
  agent: '',
  vip: 0
})

// Mock data generator
const generateMockMembers = () => {
  const accounts = ['nexora7', 'veyric12', 'calden88', 'orynt3', 'drivon21', 'zephyx5', 'krypton9', 'voltar11', 'pyxel22', 'nexum8']
  const nicknames = ['瀾城七號', '御城十二苑', '凱登雅城', '奧廷三號府', '帝御二一坊', '翎風五殿', '氪金九閣', '沃特十一堡', '象素廿二軒', '聯盟八館']
  const agents = ['proxial7', 'delegrix21', 'mandatrx9', 'subven88', 'repzen14']
  const statuses = [
    { status: 'active', statusText: '正常' },
    { status: 'frozen', statusText: '凍結' },
    { status: 'active', statusText: '正常' },
    { status: 'active', statusText: '正常' },
    { status: 'pending', statusText: '待審' }
  ]
  const memos = ['', '', '', '黑名單', '', '高風險', '', '', 'VIP', '']
  
  const members = []
  for (let i = 0; i < 50; i++) {
    const idx = i % 10
    const statusInfo = statuses[i % 5]
    const walletChange = [100, 100, -1000, -3000, 10, 500, -200, 1500, -800, 2000][idx]
    const wallet = [1000, 100, 11000, 123000, 1000000, 5000, 2500, 88000, 15000, 250000][idx]
    
    members.push({
      id: 10010 + i,
      account: accounts[idx] + (i >= 10 ? `_${Math.floor(i / 10)}` : ''),
      nickname: nicknames[idx],
      agent: agents[i % 5],
      vip: (i % 5) + 1,
      wallet: wallet + (i * 100),
      status: statusInfo.status,
      statusText: statusInfo.statusText,
      registerDate: '2025-08-19',
      walletChange: walletChange * (1 + (i % 3)),
      createdAt: '2025-08-19 20:20:20',
      memo: memos[idx]
    })
  }
  return members
}

const members = ref(generateMockMembers())

// Computed
const totalPages = computed(() => Math.ceil(members.value.length / rowsPerPage.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const paginatedMembers = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value
  const end = start + rowsPerPage.value
  return members.value.slice(start, end)
})

// Format functions
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatWalletChange = (value: number): string => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Math.abs(value))
  return value >= 0 ? formatted : `-${formatted}`
}

const getWalletChangeColor = (value: number): string => {
  return value >= 0 ? 'text-blue-400' : 'text-red-400'
}

const getStatusSeverity = (status: string) => {
  const map: Record<string, string> = {
    active: 'success',
    frozen: 'danger',
    disabled: 'secondary',
    pending: 'warn'
  }
  return map[status] || 'info'
}

// Actions
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleSearch = () => {
  isSearching.value = true
  // Simulate search delay
  setTimeout(() => {
    // Regenerate mock data to simulate search results
    members.value = generateMockMembers()
    currentPage.value = 1
    isSearching.value = false
    toast.add({
      severity: 'success',
      summary: '搜尋完成',
      detail: `共找到 ${members.value.length} 筆會員資料`,
      life: 3000
    })
  }, 1000)
}

const handleAddMember = () => {
  // Add new member to list
  const newId = Math.max(...members.value.map(m => m.id)) + 1
  members.value.unshift({
    id: newId,
    account: newMember.value.account,
    nickname: newMember.value.nickname,
    agent: newMember.value.agent,
    vip: newMember.value.vip,
    wallet: 0,
    status: 'active',
    statusText: '正常',
    registerDate: new Date().toISOString().split('T')[0],
    walletChange: 0,
    createdAt: new Date().toLocaleString('zh-TW'),
    memo: ''
  })
  
  showAddMemberDialog.value = false
  newMember.value = { account: '', nickname: '', agent: '', vip: 0 }
  
  toast.add({
    severity: 'success',
    summary: '新增成功',
    detail: `會員 ${newMember.value.account} 已成功建立`,
    life: 3000
  })
}
</script>

<style scoped>
:deep(.p-card .p-card-body) {
  padding: 1rem;
}

:deep(.p-card .p-card-content) {
  padding: 0;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: rgba(30, 41, 59, 0.5);
  color: #94a3b8;
  border-color: rgba(71, 85, 105, 0.5);
  padding: 0.75rem 1rem;
  font-weight: 600;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  background-color: transparent;
}

:deep(.p-datatable .p-datatable-tbody > tr:nth-child(even)) {
  background-color: rgba(30, 41, 59, 0.3);
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border-color: rgba(71, 85, 105, 0.3);
  padding: 0.75rem 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: rgba(59, 130, 246, 0.1);
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-multiselect),
:deep(.p-calendar),
:deep(.p-inputnumber) {
  background-color: rgba(30, 41, 59, 0.5);
  border-color: rgba(71, 85, 105, 0.5);
}

:deep(.p-inputtext:disabled),
:deep(.p-dropdown.p-disabled),
:deep(.p-multiselect.p-disabled),
:deep(.p-calendar.p-disabled),
:deep(.p-inputnumber.p-disabled) {
  opacity: 0.5;
}

:deep(.p-checkbox .p-checkbox-box) {
  background-color: rgba(30, 41, 59, 0.5);
  border-color: rgba(71, 85, 105, 0.5);
}

:deep(.p-dialog) {
  background-color: #1e293b;
}

:deep(.p-dialog .p-dialog-header) {
  background-color: #1e293b;
  border-bottom: 1px solid rgba(71, 85, 105, 0.5);
}

:deep(.p-dialog .p-dialog-content) {
  background-color: #1e293b;
}

:deep(.p-dialog .p-dialog-footer) {
  background-color: #1e293b;
  border-top: 1px solid rgba(71, 85, 105, 0.5);
}
</style>
