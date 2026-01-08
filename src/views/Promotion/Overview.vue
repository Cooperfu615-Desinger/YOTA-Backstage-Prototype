<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-gift text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">推廣活動</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">推廣總覽</span>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #content>
                <div class="flex flex-col gap-2">
                    <span class="text-surface-500 dark:text-surface-400 text-sm">今日參與人數</span>
                    <span class="text-2xl font-bold text-surface-900 dark:text-white">1,245</span>
                    <span class="text-green-500 dark:text-green-400 text-xs flex items-center gap-1">
                        <i class="pi pi-arrow-up"></i> +12.5%
                    </span>
                </div>
            </template>
        </Card>
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
             <template #content>
                <div class="flex flex-col gap-2">
                    <span class="text-surface-500 dark:text-surface-400 text-sm">今日發放金額</span>
                    <span class="text-2xl font-bold text-yellow-500 dark:text-yellow-400">$ 458,200</span>
                    <span class="text-green-500 dark:text-green-400 text-xs flex items-center gap-1">
                        <i class="pi pi-arrow-up"></i> +5.2%
                    </span>
                </div>
            </template>
        </Card>
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
             <template #content>
                <div class="flex flex-col gap-2">
                    <span class="text-surface-500 dark:text-surface-400 text-sm">待審核申請</span>
                    <span class="text-2xl font-bold text-orange-500 dark:text-orange-400">23</span>
                    <span class="text-surface-500 dark:text-surface-500 text-xs">需立即處理</span>
                </div>
            </template>
        </Card>
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
             <template #content>
                <div class="flex flex-col gap-2">
                    <span class="text-surface-500 dark:text-surface-400 text-sm">進行中活動</span>
                    <span class="text-2xl font-bold text-blue-500 dark:text-blue-400">8</span>
                    <span class="text-surface-500 dark:text-surface-500 text-xs">全部正常運行</span>
                </div>
            </template>
        </Card>
    </div>

    <!-- Recent Activity Table -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #title>
            <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
                <i class="pi pi-clock text-blue-500 dark:text-blue-400"></i>
                近期活動數據
            </div>
        </template>
        <template #content>
             <DataTable :value="recentActivities" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
                <Column field="name" header="活動名稱" style="min-width: 150px"></Column>
                <Column field="type" header="類型" style="min-width: 100px"></Column>
                <Column field="participants" header="參與人數" style="min-width: 100px"></Column>
                <Column field="cost" header="總成本" style="min-width: 120px">
                     <template #body="slotProps">{{ formatCurrency(slotProps.data.cost) }}</template>
                </Column>
                <Column header="狀態" style="min-width: 100px">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.status" severity="success" />
                    </template>
                </Column>
             </DataTable>
        </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'

const recentActivities = ref([
    { name: '首存紅利 100%', type: '首存', participants: 450, cost: 225000, status: '進行中' },
    { name: '週末再存送 50%', type: '續存', participants: 320, cost: 96000, status: '進行中' },
    { name: '每日簽到獎勵', type: '成就', participants: 890, cost: 44500, status: '進行中' }
])

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1.5rem; }
:deep(.p-datatable-tbody > tr > td) { padding: 0.75rem 1rem; }
</style>
