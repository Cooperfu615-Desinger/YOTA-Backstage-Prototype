<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-credit-card text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">金流平台</span>
      <span>></span>
      <span class="text-surface-900 dark:text-white font-medium">行動支付管理</span>
    </div>

    <!-- Stats Section -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-surface-500 dark:text-surface-400 text-sm mb-1">今日 iOS 總額</span>
              <span class="text-2xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(stats.iosTotal) }}</span>
            </div>
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 dark:bg-blue-500/20">
              <i class="pi pi-apple text-blue-500 dark:text-blue-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-surface-500 dark:text-surface-400 text-sm mb-1">今日 GP 總額</span>
              <span class="text-2xl font-bold text-surface-900 dark:text-white">{{ formatCurrency(stats.gpTotal) }}</span>
            </div>
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 dark:bg-green-500/20">
              <i class="pi pi-android text-green-500 dark:text-green-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-surface-500 dark:text-surface-400 text-sm mb-1">掉單率</span>
              <span class="text-2xl font-bold text-surface-900 dark:text-white">{{ stats.dropRate }}%</span>
            </div>
            <div class="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/10 dark:bg-red-500/20">
              <i class="pi pi-chart-line text-red-500 dark:text-red-400 text-xl"></i>
            </div>
          </div>
        </template>
      </Card>
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-surface-500 dark:text-surface-400 text-sm mb-1">審核狀態</span>
              <span class="text-lg font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                正常運行
              </span>
            </div>
            <div class="flex items-center gap-2">
               <label class="text-sm text-surface-500 dark:text-surface-400">全域審核模式</label>
               <InputSwitch v-model="globalReviewMode" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <TabView>
        <!-- Product Management Tab -->
        <TabPanel header="內購商品列表" value="0">
            <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                <template #title>
                    <div class="flex items-center justify-between">
                         <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
                            <i class="pi pi-list text-blue-500 dark:text-blue-400"></i>
                             商品列表
                        </div>
                    </div>
                </template>
                <template #content>
                    <DataTable :value="products" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
                        <Column field="productId" header="商品 ID" style="min-width: 150px">
                             <template #body="slotProps"><span class="font-mono text-sm text-surface-900 dark:text-surface-200">{{ slotProps.data.productId }}</span></template>
                        </Column>
                        <Column field="platform" header="平台" style="min-width: 100px">
                            <template #body="slotProps">
                                <i :class="['pi text-lg', slotProps.data.platform === 'iOS' ? 'pi-apple text-surface-900 dark:text-white' : 'pi-android text-green-500 dark:text-green-400']"></i>
                            </template>
                        </Column>
                        <Column field="name" header="顯示名稱" style="min-width: 150px" />
                        <Column field="price" header="價格 (USD)" style="min-width: 100px">
                             <template #body="slotProps">
                                <span class="text-surface-900 dark:text-white font-medium">{{ formatUSD(slotProps.data.price) }}</span>
                             </template>
                        </Column>
                         <Column field="points" header="對應點數" style="min-width: 100px">
                             <template #body="slotProps">{{ slotProps.data.points.toLocaleString() }}</template>
                        </Column>
                        <Column field="status" header="狀態" style="min-width: 100px">
                            <template #body="slotProps">
                                <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                            </template>
                        </Column>
                    </DataTable>
                </template>
            </Card>
        </TabPanel>

        <!-- Order Monitor Tab -->
        <TabPanel header="訂單對帳監控" value="1">
             <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
                <template #title>
                    <div class="flex items-center justify-between">
                         <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
                            <i class="pi pi-search text-purple-500 dark:text-purple-400"></i>
                             訂單搜尋
                        </div>
                        <Button label="重新整理" icon="pi pi-refresh" severity="secondary" outlined @click="refreshOrders" />
                    </div>
                </template>
                <template #content>
                     <!-- Search fields: Added as requested -->
                     <div class="flex flex-wrap gap-4 mb-4">
                        <div class="flex flex-col gap-1">
                            <label class="text-surface-900 dark:text-surface-300 text-sm font-medium">訂單號</label>
                            <InputText placeholder="輸入系統/平台訂單號" class="w-[220px]" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-surface-900 dark:text-surface-300 text-sm font-medium">會員 ID</label>
                            <InputText placeholder="輸入會員 ID" class="w-[220px]" />
                        </div>
                        <div class="flex flex-col gap-1">
                             <label class="text-surface-900 dark:text-surface-300 text-sm font-medium">日期區間</label>
                             <Calendar selectionMode="range" placeholder="選擇日期區間" class="w-[220px]" dateFormat="yy-mm-dd" showIcon />
                        </div>
                        <div class="flex items-end">
                            <Button label="搜尋" icon="pi pi-search" />
                        </div>
                     </div>

                      <DataTable :value="orders" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
                        <Column field="systemOrderId" header="系統訂單號" style="min-width: 160px">
                            <template #body="slotProps"><span class="font-mono text-sm text-surface-900 dark:text-surface-200">{{ slotProps.data.systemOrderId }}</span></template>
                        </Column>
                         <Column field="platformOrderId" header="平台原始訂單號" style="min-width: 160px">
                            <template #body="slotProps"><span class="font-mono text-xs text-surface-500 dark:text-surface-400">{{ slotProps.data.platformOrderId }}</span></template>
                        </Column>
                        <Column field="memberId" header="會員 ID" style="min-width: 120px">
                             <template #body="slotProps"><span class="text-blue-500 dark:text-blue-400 font-medium">{{ slotProps.data.memberId }}</span></template>
                        </Column>
                        <Column field="amount" header="金額" style="min-width: 100px">
                            <template #body="slotProps"><span class="text-surface-900 dark:text-white font-medium">{{ formatUSD(slotProps.data.amount) }}</span></template>
                        </Column>
                         <Column field="receiptStatus" header="驗證狀態" style="min-width: 120px">
                            <template #body="slotProps">
                                <Tag :value="slotProps.data.receiptStatus" :severity="getReceiptSeverity(slotProps.data.receiptStatus)" />
                            </template>
                        </Column>
                        <Column field="dispatchStatus" header="派發狀態" style="min-width: 120px">
                             <template #body="slotProps">
                                <Tag :value="slotProps.data.dispatchStatus" :severity="getDispatchSeverity(slotProps.data.dispatchStatus)" />
                            </template>
                        </Column>
                         <Column header="操作" style="min-width: 150px">
                            <template #body="slotProps">
                                <div class="flex gap-2" v-if="slotProps.data.receiptStatus === '驗證失敗' || slotProps.data.dispatchStatus === '失敗'">
                                     <Button icon="pi pi-sync" severity="warning" rounded text v-tooltip.top="'重新驗證'" @click="handleRevalidate(slotProps.data)" />
                                     <Button icon="pi pi-check-circle" severity="success" rounded text v-tooltip.top="'手動補單'" @click="handleManualDispatch(slotProps.data)" />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </template>
             </Card>
        </TabPanel>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import InputSwitch from 'primevue/inputswitch'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const globalReviewMode = ref(false)

// Stats Mock Data
const stats = ref({
    iosTotal: 12580,
    gpTotal: 8960,
    dropRate: 1.2
})

// Products Mock Data
const products = ref([
    { productId: 'com.yota.coin.100', platform: 'iOS', name: '100 遊戲幣', price: 0.99, points: 100, status: '啟用' },
    { productId: 'com.yota.coin.500', platform: 'iOS', name: '500 遊戲幣', price: 4.99, points: 550, status: '啟用' },
    { productId: 'com.yota.coin.1000', platform: 'iOS', name: '1000 遊戲幣', price: 9.99, points: 1200, status: '審核中' },
    { productId: 'com.yota.coin.gp.100', platform: 'Android', name: '100 遊戲幣', price: 0.99, points: 100, status: '啟用' },
    { productId: 'com.yota.coin.gp.500', platform: 'Android', name: '500 遊戲幣', price: 4.99, points: 550, status: '啟用' },
])

// Orders Mock Data
const orders = ref([
    { systemOrderId: 'ORD-20240107001', platformOrderId: 'GPA.3321-4567-8901-23456', memberId: 'user123456', amount: 4.99, receiptStatus: '驗證通過', dispatchStatus: '成功' },
    { systemOrderId: 'ORD-20240107002', platformOrderId: '1000000987654321', memberId: 'vip888', amount: 9.99, receiptStatus: '驗證通過', dispatchStatus: '成功' },
    { systemOrderId: 'ORD-20240107003', platformOrderId: 'GPA.1234-5678-9012-34567', memberId: 'player99', amount: 0.99, receiptStatus: '驗證失敗', dispatchStatus: '待處理' },
    { systemOrderId: 'ORD-20240107004', platformOrderId: '1000000123456789', memberId: 'test_user', amount: 0.99, receiptStatus: '驗證通過', dispatchStatus: '失敗' },
    { systemOrderId: 'ORD-20240107005', platformOrderId: 'GPA.9876-5432-1098-76543', memberId: 'guest001', amount: 19.99, receiptStatus: '驗證通過', dispatchStatus: '成功' },
])

// Helpers
const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

const formatUSD = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

const getStatusSeverity = (status: string) => {
    if (status === '啟用') return 'success'
    if (status === '審核中') return 'warning'
    return 'danger' // 關閉
}

const getReceiptSeverity = (status: string) => {
    if (status === '驗證通過') return 'success'
    if (status === '驗證失敗') return 'danger'
    return 'info'
}

const getDispatchSeverity = (status: string) => {
    if (status === '成功') return 'success'
    if (status === '失敗') return 'danger'
    return 'warning'
}

// Actions
const handleRevalidate = (order: typeof orders.value[0]) => {
    toast.add({ severity: 'info', summary: '重新驗證', detail: `正在驗證訂單 ${order.systemOrderId}...`, life: 2000 })
    setTimeout(() => {
        order.receiptStatus = '驗證通過'
        toast.add({ severity: 'success', summary: '驗證成功', detail: '收據驗證通過，請執行補單', life: 3000 })
    }, 1500)
}

const handleManualDispatch = (order: typeof orders.value[0]) => {
    if (order.receiptStatus !== '驗證通過') {
        toast.add({ severity: 'error', summary: '無法補單', detail: '請先確認收據驗證狀態', life: 3000 })
        return
    }
    toast.add({ severity: 'info', summary: '手動補單', detail: `正在為會員 ${order.memberId} 補發商品...`, life: 2000 })
    setTimeout(() => {
        order.dispatchStatus = '成功'
        toast.add({ severity: 'success', summary: '補單成功', detail: '商品已派發至玩家帳戶', life: 3000 })
    }, 1500)
}

const refreshOrders = () => {
    toast.add({ severity: 'success', summary: '已重新整理', detail: '訂單列表已更新', life: 1000 })
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }



:deep(.p-calendar-w-btn .p-button) {
  padding-left: 0.75rem !important;
  padding-right: 0.75rem !important;
  width: auto !important;
}
</style>
