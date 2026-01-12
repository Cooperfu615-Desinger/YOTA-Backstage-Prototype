<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-id-card text-blue-400"></i>
      <span class="text-surface-300">人員管理</span>
      <span>></span>
      <span class="text-white font-medium">群組維護</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-users text-purple-400"></i>
          群組維護
        </h1>
        <p class="text-surface-400 mt-1">Group Maintenance - RBAC 角色權限設定</p>
      </div>
      <Button 
        icon="pi pi-plus" 
        label="新增群組"
        @click="openCreateDialog"
      />
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left: Role List -->
      <Card class="chart-card">
        <template #title>
          <span>角色群組</span>
        </template>
        <template #content>
          <div class="space-y-2">
            <div 
              v-for="role in roleGroups" 
              :key="role.id"
              class="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors"
              :class="selectedRole?.id === role.id ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-surface-800 hover:bg-surface-700'"
              @click="selectRole(role)"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center"
                  :style="{ backgroundColor: role.color + '20' }"
                >
                  <i :class="['pi', role.icon]" :style="{ color: role.color }"></i>
                </div>
                <div>
                  <p class="text-white font-medium">{{ role.name }}</p>
                  <p class="text-surface-500 text-xs">{{ role.memberCount }} 人</p>
                </div>
              </div>
              <i class="pi pi-chevron-right text-surface-500"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Right: Permission Tree -->
      <div class="lg:col-span-2">
        <Card class="chart-card h-full">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="pi pi-sitemap text-green-400"></i>
                <span>權限設定</span>
                <Tag v-if="selectedRole" :value="selectedRole.name" severity="info" />
              </div>
              <Button 
                v-if="selectedRole"
                icon="pi pi-save" 
                label="儲存權限"
                size="small"
                @click="savePermissions"
              />
            </div>
          </template>
          <template #content>
            <div v-if="!selectedRole" class="flex flex-col items-center justify-center py-12 text-surface-500">
              <i class="pi pi-arrow-left text-4xl mb-4"></i>
              <p>請選擇左側角色群組</p>
            </div>
            
            <div v-else class="space-y-4">
              <p class="text-surface-400 text-sm mb-4">勾選代表擁有該頁面權限</p>
              
              <Tree 
                v-model:selectionKeys="selectedPermissions"
                :value="permissionTree"
                selectionMode="checkbox"
                class="border-0 bg-transparent"
              >
                <template #default="{ node }">
                  <div class="flex items-center gap-2 py-1">
                    <i v-if="node.icon" :class="['pi', node.icon, 'text-surface-400']"></i>
                    <span>{{ node.label }}</span>
                  </div>
                </template>
              </Tree>
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Create Group Dialog -->
    <Dialog 
      v-model:visible="createDialogVisible" 
      header="新增群組"
      :style="{ width: '450px' }"
      modal
    >
      <div class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-sm text-surface-400">群組名稱 *</label>
          <InputText v-model="newGroupName" placeholder="例如：VIP客服" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-sm text-surface-400">描述</label>
          <InputText v-model="newGroupDesc" placeholder="群組說明" />
        </div>
      </div>
      <template #footer>
        <Button label="取消" severity="secondary" @click="createDialogVisible = false" />
        <Button label="建立" @click="createGroup" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Tree from 'primevue/tree'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

// ========================================
// State
// ========================================
interface RoleGroup {
  id: number
  name: string
  icon: string
  color: string
  memberCount: number
}

const selectedRole = ref<RoleGroup | null>(null)
const selectedPermissions = ref<Record<string, { checked?: boolean, partialChecked?: boolean }>>({})
const createDialogVisible = ref(false)
const newGroupName = ref('')
const newGroupDesc = ref('')

// ========================================
// Role Groups
// ========================================
const roleGroups = ref<RoleGroup[]>([
  { id: 1, name: '超級管理員', icon: 'pi-crown', color: '#ef4444', memberCount: 2 },
  { id: 2, name: '財務主管', icon: 'pi-wallet', color: '#f59e0b', memberCount: 3 },
  { id: 3, name: '財務人員', icon: 'pi-money-bill', color: '#eab308', memberCount: 5 },
  { id: 4, name: '客服主管', icon: 'pi-headphones', color: '#3b82f6', memberCount: 4 },
  { id: 5, name: '客服人員', icon: 'pi-comments', color: '#60a5fa', memberCount: 12 },
  { id: 6, name: '風控人員', icon: 'pi-shield', color: '#f97316', memberCount: 3 },
  { id: 7, name: '唯讀權限', icon: 'pi-eye', color: '#6b7280', memberCount: 8 }
])

// ========================================
// Permission Tree
// ========================================
const permissionTree = ref([
  {
    key: 'dashboard',
    label: '儀表板',
    icon: 'pi-chart-bar',
    children: [
      { key: 'dashboard-overview', label: '儀表板總覽', icon: 'pi-chart-bar' },
      { key: 'dashboard-website', label: '網站數據', icon: 'pi-chart-line' },
      { key: 'dashboard-operations', label: '營運數據', icon: 'pi-dollar' },
      { key: 'dashboard-monitoring', label: '玩家監控', icon: 'pi-eye' }
    ]
  },
  {
    key: 'members',
    label: '會員管理',
    icon: 'pi-users',
    children: [
      { key: 'members-list', label: '會員列表', icon: 'pi-list' },
      { key: 'members-levels', label: '會員等級', icon: 'pi-star' },
      { key: 'members-tags', label: '會員標籤', icon: 'pi-tag' }
    ]
  },
  {
    key: 'finance',
    label: '財務管理',
    icon: 'pi-wallet',
    children: [
      { key: 'finance-deposit', label: '存款管理', icon: 'pi-plus' },
      { key: 'finance-withdraw', label: '提款管理', icon: 'pi-minus' },
      { key: 'finance-orders', label: '訂單查詢', icon: 'pi-list' },
      { key: 'finance-reports', label: '財務報表', icon: 'pi-chart-bar' }
    ]
  },
  {
    key: 'agents',
    label: '代理管理',
    icon: 'pi-sitemap',
    children: [
      { key: 'agents-list', label: '代理列表', icon: 'pi-list' },
      { key: 'agents-commission', label: '佣金設定', icon: 'pi-percentage' },
      { key: 'agents-settlement', label: '結算報表', icon: 'pi-file' }
    ]
  },
  {
    key: 'operators',
    label: '人員管理',
    icon: 'pi-id-card',
    children: [
      { key: 'operators-overview', label: '管理總覽', icon: 'pi-shield' },
      { key: 'operators-staff', label: '帳號維護', icon: 'pi-user-edit' },
      { key: 'operators-groups', label: '群組維護', icon: 'pi-users' },
      { key: 'operators-logs', label: '操作日誌', icon: 'pi-history' },
      { key: 'operators-exports', label: '匯出中心', icon: 'pi-download' }
    ]
  },
  {
    key: 'system',
    label: '系統設定',
    icon: 'pi-cog',
    children: [
      { key: 'system-announcements', label: '公告管理', icon: 'pi-megaphone' },
      { key: 'system-parameters', label: '系統參數', icon: 'pi-sliders-h' },
      { key: 'system-maintenance', label: '系統維護', icon: 'pi-wrench' }
    ]
  }
])

// ========================================
// Actions
// ========================================
const selectRole = (role: RoleGroup) => {
  selectedRole.value = role
  // Load permissions for this role (mock)
  if (role.name === '超級管理員') {
    selectedPermissions.value = { 
      'dashboard': { checked: true, partialChecked: false },
      'members': { checked: true, partialChecked: false },
      'finance': { checked: true, partialChecked: false },
      'agents': { checked: true, partialChecked: false },
      'operators': { checked: true, partialChecked: false },
      'system': { checked: true, partialChecked: false }
    }
  } else if (role.name === '客服人員') {
    selectedPermissions.value = {
      'dashboard-overview': { checked: true, partialChecked: false },
      'members': { checked: true, partialChecked: false }
    }
  } else {
    selectedPermissions.value = {}
  }
}

const savePermissions = () => {
  console.log('Saving permissions for', selectedRole.value?.name, selectedPermissions.value)
}

const openCreateDialog = () => {
  newGroupName.value = ''
  newGroupDesc.value = ''
  createDialogVisible.value = true
}

const createGroup = () => {
  console.log('Creating group:', newGroupName.value)
  createDialogVisible.value = false
}
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

:deep(.p-tree) {
  background: transparent;
  border: none;
  padding: 0;
}

:deep(.p-tree-node) {
  padding: 0.25rem 0;
}

:deep(.p-tree-node-content) {
  padding: 0.5rem;
  border-radius: 0.5rem;
}

:deep(.p-tree-node-content:hover) {
  background: rgba(148, 163, 184, 0.1);
}
</style>
