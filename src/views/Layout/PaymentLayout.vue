<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-th-large text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">版面設定</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">支付版面</span>
    </div>

    <!-- Header -->
    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-credit-card text-purple-500"></i>
      支付版面設定
    </div>

    <!-- Compliance Notice -->
    <div class="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
      <div class="flex items-start gap-3">
        <i class="pi pi-exclamation-triangle text-yellow-500 text-xl mt-0.5"></i>
        <div>
          <p class="font-medium text-yellow-700 dark:text-yellow-400">合規性提醒</p>
          <p class="text-sm text-yellow-600 dark:text-yellow-500">APP 端僅允許顯示 Apple/Google IAP 商品，禁止任何第三方支付連結。Web 端可配置完整第三方金流。</p>
        </div>
      </div>
    </div>

    <!-- TabView -->
    <TabView>
      <!-- Tab 1: APP IAP Store -->
      <TabPanel value="0" header="APP 商城配置">
        <div class="space-y-6">
          <!-- IAP Products DataTable -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                  <i class="pi pi-apple text-surface-700 dark:text-surface-300"></i>
                  <i class="pi pi-android text-green-500"></i>
                  IAP 商品列表
                </div>
                <Button label="新增商品" icon="pi pi-plus" @click="openIapDialog(null)" />
              </div>
            </template>
            <template #content>
              <DataTable :value="iapProducts" stripedRows>
                <Column field="name" header="商品名稱" sortable style="min-width: 150px">
                  <template #body="slotProps">
                    <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.name }}</span>
                  </template>
                </Column>
                <Column field="productId" header="商品 ID" style="min-width: 180px">
                  <template #body="slotProps">
                    <code class="text-sm bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded text-blue-600 dark:text-blue-400">{{ slotProps.data.productId }}</code>
                  </template>
                </Column>
                <Column header="顯示圖示" style="min-width: 100px">
                  <template #body>
                    <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <i class="pi pi-dollar text-white text-xl"></i>
                    </div>
                  </template>
                </Column>
                <Column field="tag" header="行銷標籤" style="min-width: 120px">
                  <template #body="slotProps">
                    <Tag v-if="slotProps.data.tag !== 'none'" :value="slotProps.data.tag" :severity="getTagSeverity(slotProps.data.tag)" />
                    <span v-else class="text-surface-400">-</span>
                  </template>
                </Column>
                <Column field="weight" header="排序權重" sortable style="min-width: 100px">
                  <template #body="slotProps">
                    <InputNumber v-model="slotProps.data.weight" :min="0" :max="100" class="w-20" />
                  </template>
                </Column>
                <Column header="操作" style="min-width: 100px">
                  <template #body="slotProps">
                    <div class="flex gap-1">
                      <Button icon="pi pi-pencil" severity="info" text size="small" @click="openIapDialog(slotProps.data)" />
                      <Button icon="pi pi-trash" severity="danger" text size="small" @click="handleDeleteIap(slotProps.data)" />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>

          <!-- Store Banner -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-image text-orange-500"></i>
                商城廣告 (Store Banner)
              </div>
            </template>
            <template #content>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <label class="font-medium text-surface-700 dark:text-surface-300">頂部廣告圖</label>
                  <FileUpload mode="basic" accept="image/*" :maxFileSize="2000000" chooseLabel="上傳廣告圖" class="w-full" />
                  <small class="text-surface-500">僅限宣傳 IAP 優惠 (如「首充加贈 20%」)</small>
                </div>
                <div class="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-center">
                  <p class="text-white font-medium">首充加贈 20% 金幣</p>
                  <p class="text-white/70 text-sm">限時優惠，立即購買！</p>
                </div>
                <div class="flex justify-end">
                  <Button label="儲存廣告設定" icon="pi pi-check" @click="saveStoreBanner" />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>

      <!-- Tab 2: Web Full Cashier -->
      <TabPanel value="1" header="官網收銀台">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Payment Method Sorting -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 lg:col-span-2">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-sort-alt text-blue-500"></i>
                支付渠道排序
                <span class="text-sm text-surface-500 font-normal ml-2">拖曳調整收銀台顯示順序</span>
              </div>
            </template>
            <template #content>
              <OrderList v-model="paymentMethods" dataKey="id">
                <template #item="slotProps">
                  <div class="flex items-center gap-4 p-3 w-full">
                    <div class="w-12 h-12 rounded-lg flex items-center justify-center" :style="{ background: slotProps.item.bgColor }">
                      <i :class="['pi', slotProps.item.icon]" class="text-white text-xl"></i>
                    </div>
                    <div class="flex-1">
                      <p class="font-medium text-surface-900 dark:text-white">{{ slotProps.item.name }}</p>
                      <p class="text-sm text-surface-500">佔比: {{ slotProps.item.ratio }}</p>
                    </div>
                    <Tag v-if="slotProps.item.hot" value="Hot" severity="danger" />
                    <InputSwitch v-model="slotProps.item.active" />
                  </div>
                </template>
              </OrderList>
              <div class="flex justify-end pt-4">
                <Button label="儲存排序" icon="pi pi-check" @click="savePaymentOrder" />
              </div>
            </template>
          </Card>

          <!-- Sidebar Tips -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 lg:col-span-2">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-info-circle text-green-500"></i>
                側邊欄 / 提示文案
                <span class="text-sm text-surface-500 font-normal ml-2">收銀台旁的文字區塊 (防詐騙公告、充值教學)</span>
              </div>
            </template>
            <template #content>
              <Editor v-model="sidebarContent" editorStyle="height: 250px" />
              <div class="flex justify-end pt-4">
                <Button label="儲存文案" icon="pi pi-check" @click="saveSidebarTips" />
              </div>
            </template>
          </Card>
        </div>
      </TabPanel>
    </TabView>

    <!-- IAP Product Editor Dialog -->
    <Dialog v-model:visible="iapDialogVisible" header="編輯 IAP 商品" modal :style="{ width: '600px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">商品名稱 <span class="text-red-500">*</span></label>
          <InputText v-model="iapForm.name" placeholder="新手金幣包" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">商品 ID (Apple/Google) <span class="text-red-500">*</span></label>
          <InputText v-model="iapForm.productId" placeholder="com.yota.coins.starter" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">顯示圖示</label>
          <FileUpload mode="basic" accept="image/png" :maxFileSize="500000" chooseLabel="上傳圖示" class="w-full" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">行銷標籤</label>
          <SelectButton v-model="iapForm.tag" :options="tagOptions" optionLabel="label" optionValue="value" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">排序權重</label>
          <InputNumber v-model="iapForm.weight" :min="0" :max="100" />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="iapDialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveIapProduct" />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import InputSwitch from 'primevue/inputswitch'
import SelectButton from 'primevue/selectbutton'
import FileUpload from 'primevue/fileupload'
import Dialog from 'primevue/dialog'
import OrderList from 'primevue/orderlist'
import Editor from 'primevue/editor'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

// ========================================
// Tab 1: APP IAP Store
// ========================================
const tagOptions = ref([
  { label: '無', value: 'none' },
  { label: '熱銷 Hot', value: 'Hot' },
  { label: '超值 Best', value: 'Best' },
  { label: '+20% Bonus', value: '+20%' }
])

const getTagSeverity = (tag: string) => {
  const map: Record<string, string> = { 'Hot': 'danger', 'Best': 'success', '+20%': 'warn' }
  return map[tag] || 'secondary'
}

interface IapProduct {
  id: number
  name: string
  productId: string
  tag: string
  weight: number
}

const iapProducts = ref<IapProduct[]>([
  { id: 1, name: '新手金幣包', productId: 'com.yota.coins.starter', tag: 'Hot', weight: 100 },
  { id: 2, name: '小額金幣包', productId: 'com.yota.coins.small', tag: 'none', weight: 90 },
  { id: 3, name: '中額金幣包', productId: 'com.yota.coins.medium', tag: 'Best', weight: 80 },
  { id: 4, name: '大額金幣包', productId: 'com.yota.coins.large', tag: '+20%', weight: 70 },
  { id: 5, name: 'VIP 專屬包', productId: 'com.yota.coins.vip', tag: 'none', weight: 60 }
])

const iapDialogVisible = ref(false)
const editingIap = ref<IapProduct | null>(null)

const iapForm = ref({
  name: '',
  productId: '',
  tag: 'none',
  weight: 50
})

const openIapDialog = (product: IapProduct | null) => {
  editingIap.value = product
  if (product) {
    iapForm.value = { name: product.name, productId: product.productId, tag: product.tag, weight: product.weight }
  } else {
    iapForm.value = { name: '', productId: '', tag: 'none', weight: 50 }
  }
  iapDialogVisible.value = true
}

const saveIapProduct = () => {
  if (!iapForm.value.name || !iapForm.value.productId) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫商品名稱與 ID', life: 3000 })
    return
  }
  const action = editingIap.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `商品「${iapForm.value.name}」已${action}`, life: 3000 })
  iapDialogVisible.value = false
}

const handleDeleteIap = (product: IapProduct) => {
  toast.add({ severity: 'warn', summary: '刪除', detail: `「${product.name}」已刪除`, life: 2000 })
}

const saveStoreBanner = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '商城廣告設定已更新', life: 3000 })
}

// ========================================
// Tab 2: Web Full Cashier
// ========================================
interface PaymentMethod {
  id: number
  name: string
  icon: string
  bgColor: string
  ratio: string
  hot: boolean
  active: boolean
}

const paymentMethods = ref<PaymentMethod[]>([
  { id: 1, name: '銀行轉帳', icon: 'pi-building', bgColor: '#3b82f6', ratio: '1/2', hot: true, active: true },
  { id: 2, name: '虛擬貨幣', icon: 'pi-bitcoin', bgColor: '#f59e0b', ratio: '1/3', hot: false, active: true },
  { id: 3, name: '超商代碼', icon: 'pi-shop', bgColor: '#22c55e', ratio: '1/4', hot: false, active: true },
  { id: 4, name: '信用卡', icon: 'pi-credit-card', bgColor: '#8b5cf6', ratio: '1/3', hot: false, active: true },
  { id: 5, name: 'MyCard', icon: 'pi-wallet', bgColor: '#ec4899', ratio: '1/4', hot: false, active: false },
  { id: 6, name: '行動支付', icon: 'pi-mobile', bgColor: '#06b6d4', ratio: '1/4', hot: false, active: true }
])

const sidebarContent = ref('<h3>🔒 防詐騙公告</h3><p>本平台<strong>不會</strong>透過電話或訊息要求您提供密碼或驗證碼。</p><p>如有疑問，請洽客服專線。</p><hr><h3>💰 充值教學</h3><ol><li>選擇充值金額</li><li>選擇支付方式</li><li>完成付款後金幣自動到帳</li></ol>')

const savePaymentOrder = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '支付渠道排序已更新', life: 3000 })
}

const saveSidebarTips = () => {
  toast.add({ severity: 'success', summary: '儲存成功', detail: '側邊欄文案已更新', life: 3000 })
}
</script>
