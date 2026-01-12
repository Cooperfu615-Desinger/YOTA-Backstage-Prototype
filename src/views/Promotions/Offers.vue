<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-gift text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">推廣活動</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">優惠管理</span>
    </div>

    <!-- Main Content -->
    <div class="flex flex-col lg:flex-row gap-6">
        <!-- Left: List & Config -->
        <div class="flex-1 space-y-6">
             <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                <template #title>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
                            <i class="pi pi-list text-blue-500 dark:text-blue-400"></i>
                            活動列表管理
                        </div>
                        <!-- SaaS/Platform Switch -->
                        <div class="flex items-center gap-2 bg-surface-100 dark:bg-surface-900 px-3 py-1 rounded-full border border-surface-200 dark:border-surface-700">
                            <span :class="mode === 'saas' ? 'text-surface-900 dark:text-white font-bold' : 'text-surface-500 text-sm'">上架版 (SaaS)</span>
                            <InputSwitch v-model="isPlatformMode" @change="toggleMode" />
                            <span :class="mode === 'platform' ? 'text-surface-900 dark:text-white font-bold' : 'text-surface-500 text-sm'">包網版 (Platform)</span>
                        </div>
                    </div>
                </template>
                <template #content>
                     <DataTable :value="activities" selectionMode="single" v-model:selection="selectedActivity" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
                        <Column field="name" header="活動名稱"></Column>
                        <Column header="狀態" style="width: 100px">
                             <template #body="slotProps">
                                <Tag :value="slotProps.data.status" :severity="slotProps.data.status === '啟用' ? 'success' : 'secondary'" />
                            </template>
                        </Column>
                        <Column header="操作" style="width: 120px">
                             <template #body>
                                <Button icon="pi pi-pencil" size="small" text rounded severity="info" />
                            </template>
                        </Column>
                     </DataTable>
                </template>
             </Card>
        </div>

        <!-- Right: Preview -->
        <div class="w-full lg:w-[400px]">
            <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 h-full">
                <template #title>
                     <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
                        <i class="pi pi-mobile text-purple-500 dark:text-purple-400"></i>
                        預覽效果
                    </div>
                </template>
                <template #content>
                    <div class="bg-surface-100 dark:bg-black/40 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 h-[600px] flex flex-col relative">
                        <!-- Mock Header -->
                        <div class="bg-surface-0 dark:bg-surface-900 p-4 flex items-center justify-center text-surface-900 dark:text-white font-bold border-b border-surface-200 dark:border-surface-700">
                            優惠詳情
                        </div>
                        
                        <div v-if="selectedActivity" class="p-4 space-y-4 overflow-y-auto custom-scrollbar">
                            <!-- Banner -->
                            <div class="w-full h-40 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {{ selectedActivity.name }}
                            </div>
                            <!-- Title -->
                            <div class="text-xl font-bold text-surface-900 dark:text-white">{{ selectedActivity.name }}</div>
                            <!-- Tags -->
                            <div class="flex gap-2">
                                <Tag value="限時優惠" severity="warning" />
                                <Tag :value="mode === 'saas' ? '全站適用' : '平台專屬'" severity="info" />
                            </div>
                            <!-- Content -->
                            <div class="text-surface-600 dark:text-surface-300 text-sm leading-relaxed whitespace-pre-line">
                                {{ selectedActivity.content || '這裡顯示活動的詳細說明文案...' }}
                            </div>
                            <!-- Button -->
                            <div class="pt-4">
                                <Button label="立即申請" class="w-full font-bold" severity="warning" />
                            </div>
                        </div>

                        <div v-else class="flex-1 flex items-center justify-center text-surface-500 flex-col gap-4">
                            <i class="pi pi-image text-4xl"></i>
                            <span>請選擇左側活動預覽</span>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputSwitch from 'primevue/inputswitch'

const isPlatformMode = ref(false)
const mode = computed(() => isPlatformMode.value ? 'platform' : 'saas')

const activities = ref([
    { id: 1, name: '首存送 100%', status: '啟用', content: '新會員首次存款，最高贈送 10,000 點。\n流水要求：15倍。\n活動對象：所有新註冊會員。' },
    { id: 2, name: 'VIP 專屬回饋', status: '啟用', content: 'VIP3 以上會員獨享，每週結算負盈利返還 5%。' },
    { id: 3, name: '好友邀請獎勵', status: '停用', content: '邀請好友註冊並充值，雙方各得 100 點。' }
])

const selectedActivity = ref<any | null>(activities.value[0])

const toggleMode = () => {
    // Switch logic here
    selectedActivity.value = null
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-datatable-tbody > tr > td) { padding: 0.75rem 1rem; }
:deep(.p-inputswitch.p-inputswitch-checked .p-inputswitch-slider) { background: #3b82f6; } /* Customizing switch color */

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255, 255, 255, 0.2); border-radius: 4px; }
</style>
