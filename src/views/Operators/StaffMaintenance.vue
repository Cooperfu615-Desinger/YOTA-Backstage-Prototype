<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-id-card text-blue-400"></i>
      <span class="text-surface-300">人員管理</span>
      <span>></span>
      <span class="text-white font-medium">帳號維護</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-user-edit text-blue-400"></i>
          帳號維護
        </h1>
        <p class="text-surface-400 mt-1">Staff Maintenance - 後台人員帳號管理</p>
      </div>
      <Button 
        icon="pi pi-plus" 
        label="新增人員"
        @click="openDialog('add')"
      />
    </div>

    <!-- Staff List -->
    <Card class="chart-card">
      <template #title>
        <div class="flex items-center justify-between">
          <span>人員列表</span>
          <div class="flex items-center gap-2">
            <InputText v-model="searchQuery" placeholder="搜尋帳號/姓名" class="w-48" />
          </div>
        </div>
      </template>
      <template #content>
        <DataTable 
          :value="filteredStaff" 
          :pt="tablePassThrough"
          class="compact-table"
          paginator
          :rows="10"
        >
          <Column field="account" header="帳號">
            <template #body="{ data }">
              <span class="text-blue-400 font-medium">{{ data.account }}</span>
            </template>
          </Column>
          <Column field="name" header="姓名"></Column>
          <Column field="department" header="部門"></Column>
          <Column field="role" header="角色群組">
            <template #body="{ data }">
              <Tag :value="data.role" :severity="getRoleSeverity(data.role)" />
            </template>
          </Column>
          <Column field="twoFa" header="2FA">
            <template #body="{ data }">
              <i :class="['pi', data.twoFa ? 'pi-check-circle text-green-400' : 'pi-times-circle text-surface-500']"></i>
            </template>
          </Column>
          <Column field="ipRestricted" header="IP 限制">
            <template #body="{ data }">
              <Tag 
                :value="data.ipRestricted ? '已設定' : '無限制'" 
                :severity="data.ipRestricted ? 'info' : 'secondary'"
                class="text-xs"
              />
            </template>
          </Column>
          <Column field="status" header="狀態">
            <template #body="{ data }">
              <Tag 
                :value="data.status" 
                :severity="data.status === '啟用' ? 'success' : 'danger'"
              />
            </template>
          </Column>
          <Column field="lastLogin" header="最後登入"></Column>
          <Column header="操作">
            <template #body="{ data }">
              <div class="flex items-center gap-1">
                <Button 
                  icon="pi pi-pencil" 
                  severity="info" 
                  size="small"
                  rounded
                  text
                  @click="openDialog('edit', data)"
                />
                <Button 
                  icon="pi pi-lock" 
                  :severity="data.status === '啟用' ? 'warn' : 'success'" 
                  size="small"
                  rounded
                  text
                  v-tooltip.top="data.status === '啟用' ? '停用' : '啟用'"
                  @click="toggleStatus(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>

    <!-- Edit/Add Dialog -->
    <Dialog 
      v-model:visible="dialogVisible" 
      :header="dialogMode === 'add' ? '新增人員' : '編輯人員'"
      :style="{ width: '600px' }"
      modal
    >
      <div class="space-y-6">
        <!-- Basic Info Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-white flex items-center gap-2">
            <i class="pi pi-user text-blue-400"></i>
            基本資料
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-400">帳號 *</label>
              <InputText v-model="editForm.account" :disabled="dialogMode === 'edit'" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-400">姓名 *</label>
              <InputText v-model="editForm.name" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-400">部門</label>
              <Dropdown 
                v-model="editForm.department" 
                :options="departmentOptions"
                placeholder="選擇部門"
              />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-sm text-surface-400">角色群組 *</label>
              <Dropdown 
                v-model="editForm.role" 
                :options="roleOptions"
                placeholder="選擇角色"
              />
            </div>
          </div>
        </div>

        <!-- Security Section -->
        <div class="space-y-4 border-t border-surface-700 pt-6">
          <h3 class="text-lg font-semibold text-white flex items-center gap-2">
            <i class="pi pi-shield text-green-400"></i>
            安全控制
          </h3>
          
          <!-- IP Whitelist -->
          <div class="flex flex-col gap-2">
            <label class="text-sm text-surface-400">IP 白名單</label>
            <Textarea 
              v-model="editForm.ipWhitelist" 
              rows="3" 
              placeholder="每行一個 IP，例如：&#10;192.168.1.100&#10;192.168.1.101&#10;留空表示不限制"
              class="font-mono text-sm"
            />
            <small class="text-surface-500">限制特定 IP 才能登入，留空表示不限制</small>
          </div>

          <!-- 2FA Toggle -->
          <div class="flex items-center justify-between p-4 bg-surface-800 rounded-lg">
            <div>
              <p class="text-white font-medium">Google 兩步驟驗證 (2FA)</p>
              <p class="text-surface-500 text-sm">強制使用 Google Authenticator</p>
            </div>
            <InputSwitch v-model="editForm.twoFa" />
          </div>
        </div>

        <!-- Status Section -->
        <div class="flex items-center justify-between p-4 bg-surface-800 rounded-lg">
          <div>
            <p class="text-white font-medium">帳號狀態</p>
            <p class="text-surface-500 text-sm">停用後無法登入後台</p>
          </div>
          <InputSwitch v-model="editForm.enabled" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="dialogVisible = false" />
          <Button :label="dialogMode === 'add' ? '新增' : '儲存'" @click="saveStaff" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import InputSwitch from 'primevue/inputswitch'

// ========================================
// State
// ========================================
const searchQuery = ref('')
const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')

const tablePassThrough = {
  root: { class: 'border-0' },
  tableContainer: { class: 'border-0' },
  thead: { class: 'border-0' },
  tbody: { class: 'border-0' },
  row: { class: 'border-0 border-b border-surface-700 last:border-0' }
}

// ========================================
// Form
// ========================================
interface StaffForm {
  account: string
  name: string
  department: string
  role: string
  ipWhitelist: string
  twoFa: boolean
  enabled: boolean
}

const defaultForm: StaffForm = {
  account: '',
  name: '',
  department: '',
  role: '',
  ipWhitelist: '',
  twoFa: false,
  enabled: true
}

const editForm = ref<StaffForm>({ ...defaultForm })

const departmentOptions = ['總管理處', '財務部', '客服部', '風控部', '技術部', '行銷部']
const roleOptions = ['超級管理員', '財務主管', '財務人員', '客服主管', '客服人員', '風控人員', '唯讀權限']

// ========================================
// Helper Functions
// ========================================
const getRoleSeverity = (role: string): "success" | "warn" | "danger" | "info" | "secondary" | undefined => {
  switch (role) {
    case '超級管理員': return 'danger'
    case '財務主管': case '財務人員': return 'warn'
    case '客服主管': case '客服人員': return 'info'
    case '風控人員': return 'warn'
    default: return 'secondary'
  }
}

const openDialog = (mode: 'add' | 'edit', staff?: typeof staffList.value[0]) => {
  dialogMode.value = mode
  if (mode === 'edit' && staff) {
    editForm.value = {
      account: staff.account,
      name: staff.name,
      department: staff.department,
      role: staff.role,
      ipWhitelist: staff.ipWhitelist || '',
      twoFa: staff.twoFa,
      enabled: staff.status === '啟用'
    }
  } else {
    editForm.value = { ...defaultForm }
  }
  dialogVisible.value = true
}

const saveStaff = () => {
  console.log('Saving staff:', editForm.value)
  dialogVisible.value = false
}

const toggleStatus = (staff: typeof staffList.value[0]) => {
  staff.status = staff.status === '啟用' ? '停用' : '啟用'
}

// ========================================
// Mock Data
// ========================================
const staffList = ref([
  { account: 'admin_001', name: '王大明', department: '總管理處', role: '超級管理員', twoFa: true, ipRestricted: true, ipWhitelist: '192.168.1.100\n192.168.1.101', status: '啟用', lastLogin: '2026-01-12 08:30' },
  { account: 'finance_001', name: '李小華', department: '財務部', role: '財務主管', twoFa: true, ipRestricted: true, ipWhitelist: '192.168.1.102', status: '啟用', lastLogin: '2026-01-12 09:00' },
  { account: 'finance_002', name: '黃志偉', department: '財務部', role: '財務人員', twoFa: true, ipRestricted: false, ipWhitelist: '', status: '啟用', lastLogin: '2026-01-12 10:00' },
  { account: 'cs_001', name: '張美玲', department: '客服部', role: '客服主管', twoFa: false, ipRestricted: false, ipWhitelist: '', status: '啟用', lastLogin: '2026-01-12 08:45' },
  { account: 'cs_002', name: '林小芳', department: '客服部', role: '客服人員', twoFa: false, ipRestricted: false, ipWhitelist: '', status: '啟用', lastLogin: '2026-01-11 18:30' },
  { account: 'risk_001', name: '陳建國', department: '風控部', role: '風控人員', twoFa: true, ipRestricted: true, ipWhitelist: '192.168.1.110', status: '啟用', lastLogin: '2026-01-12 09:15' },
  { account: 'readonly_001', name: '周小明', department: '行銷部', role: '唯讀權限', twoFa: false, ipRestricted: false, ipWhitelist: '', status: '停用', lastLogin: '2026-01-05 14:20' }
])

const filteredStaff = computed(() => {
  if (!searchQuery.value) return staffList.value
  const query = searchQuery.value.toLowerCase()
  return staffList.value.filter(s => 
    s.account.toLowerCase().includes(query) || 
    s.name.toLowerCase().includes(query)
  )
})
</script>

<style scoped>
.chart-card :deep(.p-card-body) {
  padding: 1.25rem;
}

.chart-card :deep(.p-card-title) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.compact-table :deep(.p-datatable-thead > tr > th) {
  background: transparent;
  border: none;
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: #94a3b8;
}

.compact-table :deep(.p-datatable-tbody > tr > td) {
  padding: 0.75rem 1rem;
  border: none;
}

.compact-table :deep(.p-datatable-tbody > tr) {
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}
</style>
