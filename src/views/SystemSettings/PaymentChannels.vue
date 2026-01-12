<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-cog text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">系統設定</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">支付通道配置</span>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
        <i class="pi pi-wallet text-purple-500"></i>
        支付通道配置
      </div>
    </div>

    <!-- Channel Tabs -->
    <TabView v-model:activeIndex="activeTab">
      <!-- Tab 1: Bank Cards -->
      <TabPanel value="0" header="公司入款">
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-credit-card text-green-500"></i>
                銀行卡配置
              </div>
              <Button label="新增銀行卡" icon="pi pi-plus" size="small" @click="openBankDialog(null)" />
            </div>
          </template>
          <template #content>
            <DataTable :value="bankCards" stripedRows>
              <Column header="銀行名稱" style="min-width: 180px">
                <template #body="slotProps">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-building text-blue-500"></i>
                    <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.bankName }}</span>
                  </div>
                </template>
              </Column>
              <Column header="帳戶資訊" style="min-width: 200px">
                <template #body="slotProps">
                  <div>
                    <p class="text-surface-900 dark:text-white">{{ slotProps.data.accountName }}</p>
                    <p class="text-sm text-surface-500 font-mono">{{ slotProps.data.accountNumber }}</p>
                  </div>
                </template>
              </Column>
              <Column header="VIP限制" style="min-width: 120px">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.vipRange" severity="info" />
                </template>
              </Column>
              <Column header="限額設定" style="min-width: 150px">
                <template #body="slotProps">
                  <div class="text-sm">
                    <span class="text-surface-500">Min:</span> <span class="text-surface-900 dark:text-white font-mono">${{ slotProps.data.minAmount.toLocaleString() }}</span><br/>
                    <span class="text-surface-500">Max:</span> <span class="text-surface-900 dark:text-white font-mono">${{ slotProps.data.maxAmount.toLocaleString() }}</span>
                  </div>
                </template>
              </Column>
              <Column header="狀態" style="min-width: 80px">
                <template #body="slotProps">
                  <InputSwitch v-model="slotProps.data.active" @change="handleBankStatusChange(slotProps.data)" />
                </template>
              </Column>
              <Column header="操作" style="min-width: 100px">
                <template #body="slotProps">
                  <Button icon="pi pi-pencil" severity="info" text size="small" @click="openBankDialog(slotProps.data)" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </TabPanel>

      <!-- Tab 2: Third-Party -->
      <TabPanel value="1" header="三方金流">
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-globe text-orange-500"></i>
                第三方支付網關
              </div>
              <Button label="新增金流商" icon="pi pi-plus" size="small" @click="openGatewayDialog(null)" />
            </div>
          </template>
          <template #content>
            <DataTable :value="gateways" stripedRows>
              <Column header="金流商" style="min-width: 150px">
                <template #body="slotProps">
                  <span class="font-medium text-surface-900 dark:text-white">{{ slotProps.data.name }}</span>
                </template>
              </Column>
              <Column header="商戶號" style="min-width: 140px">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.merchantCode" severity="secondary" />
                </template>
              </Column>
              <Column header="支援方式" style="min-width: 180px">
                <template #body="slotProps">
                  <div class="flex gap-1 flex-wrap">
                    <Tag v-for="method in slotProps.data.methods" :key="method" :value="method" :severity="getMethodSeverity(method)" size="small" />
                  </div>
                </template>
              </Column>
              <Column header="費率" style="min-width: 80px">
                <template #body="slotProps">
                  <span class="font-mono text-orange-500">{{ slotProps.data.feeRate }}%</span>
                </template>
              </Column>
              <Column header="狀態" style="min-width: 80px">
                <template #body="slotProps">
                  <InputSwitch v-model="slotProps.data.active" @change="handleGatewayStatusChange(slotProps.data)" />
                </template>
              </Column>
              <Column header="操作" style="min-width: 100px">
                <template #body="slotProps">
                  <Button icon="pi pi-pencil" severity="info" text size="small" @click="openGatewayDialog(slotProps.data)" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </TabPanel>

      <!-- Tab 3: Crypto -->
      <TabPanel value="2" header="虛擬貨幣">
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-surface-900 dark:text-white">
                <i class="pi pi-bitcoin text-yellow-500"></i>
                虛擬貨幣錢包
              </div>
              <Button label="新增錢包" icon="pi pi-plus" size="small" @click="openCryptoDialog(null)" />
            </div>
          </template>
          <template #content>
            <DataTable :value="cryptoWallets" stripedRows>
              <Column header="鏈類型" style="min-width: 120px">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.chain" :severity="slotProps.data.chain === 'TRC20' ? 'success' : 'info'" />
                </template>
              </Column>
              <Column header="錢包地址" style="min-width: 300px">
                <template #body="slotProps">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-white rounded flex items-center justify-center p-1">
                      <i class="pi pi-qrcode text-2xl text-surface-900"></i>
                    </div>
                    <span class="font-mono text-sm text-surface-700 dark:text-surface-300 truncate max-w-[200px]">{{ slotProps.data.address }}</span>
                  </div>
                </template>
              </Column>
              <Column header="匯率模式" style="min-width: 120px">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.rateMode" :severity="slotProps.data.rateMode === '自動跟隨' ? 'success' : 'warn'" />
                </template>
              </Column>
              <Column header="狀態" style="min-width: 80px">
                <template #body="slotProps">
                  <InputSwitch v-model="slotProps.data.active" @change="handleCryptoStatusChange(slotProps.data)" />
                </template>
              </Column>
              <Column header="操作" style="min-width: 100px">
                <template #body="slotProps">
                  <Button icon="pi pi-pencil" severity="info" text size="small" @click="openCryptoDialog(slotProps.data)" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </TabPanel>
    </TabView>

    <!-- Bank Card Dialog -->
    <Dialog v-model:visible="bankDialogVisible" :header="editingBank ? '編輯銀行卡' : '新增銀行卡'" modal :style="{ width: '550px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">銀行名稱 <span class="text-red-500">*</span></label>
          <InputText v-model="bankForm.bankName" placeholder="中國信託" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">戶名</label>
          <InputText v-model="bankForm.accountName" placeholder="YOTA 科技有限公司" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">帳號</label>
          <InputText v-model="bankForm.accountNumber" placeholder="1234-5678-9012-3456" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">最低金額</label>
            <InputNumber v-model="bankForm.minAmount" prefix="$" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">最高金額</label>
            <InputNumber v-model="bankForm.maxAmount" prefix="$" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">VIP 層級限制</label>
          <InputText v-model="bankForm.vipRange" placeholder="VIP1-VIP3" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">停用原因 (選填)</label>
          <Textarea v-model="bankForm.disableReason" rows="2" placeholder="如：卡片風控中" />
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-surface-200 dark:border-surface-700">
          <InputSwitch v-model="bankForm.active" />
          <label class="font-medium text-surface-700 dark:text-surface-300">{{ bankForm.active ? '前台顯示' : '前台隱藏' }}</label>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="bankDialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveBank" />
        </div>
      </template>
    </Dialog>

    <!-- Gateway Dialog -->
    <Dialog v-model:visible="gatewayDialogVisible" :header="editingGateway ? '編輯金流商' : '新增金流商'" modal :style="{ width: '600px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">金流商名稱 <span class="text-red-500">*</span></label>
            <InputText v-model="gatewayForm.name" placeholder="Spay" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="font-medium text-surface-700 dark:text-surface-300">費率 (%)</label>
            <InputNumber v-model="gatewayForm.feeRate" suffix="%" :minFractionDigits="1" />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">API Gateway URL</label>
          <InputText v-model="gatewayForm.apiUrl" placeholder="https://api.spay.com/v1/pay" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">Merchant ID</label>
          <InputText v-model="gatewayForm.merchantId" placeholder="M12345678" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">Secret Key <span class="text-red-500">*</span></label>
          <Password v-model="gatewayForm.secretKey" toggleMask :feedback="false" placeholder="輸入金鑰" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">Callback URL (白名單)</label>
          <InputText v-model="gatewayForm.callbackUrl" placeholder="https://api.yota.com/callback/spay" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">支援方式</label>
          <MultiSelect v-model="gatewayForm.methods" :options="paymentMethods" optionLabel="label" optionValue="value" placeholder="選擇支援方式" display="chip" />
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-surface-200 dark:border-surface-700">
          <InputSwitch v-model="gatewayForm.active" />
          <label class="font-medium text-surface-700 dark:text-surface-300">{{ gatewayForm.active ? '啟用中' : '已停用' }}</label>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="gatewayDialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveGateway" />
        </div>
      </template>
    </Dialog>

    <!-- Crypto Dialog -->
    <Dialog v-model:visible="cryptoDialogVisible" :header="editingCrypto ? '編輯錢包' : '新增錢包'" modal :style="{ width: '500px' }" class="p-fluid">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">鏈類型</label>
          <Select v-model="cryptoForm.chain" :options="chainOptions" optionLabel="label" optionValue="value" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">錢包地址 <span class="text-red-500">*</span></label>
          <InputText v-model="cryptoForm.address" placeholder="TRC20/ERC20 地址" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">匯率模式</label>
          <Select v-model="cryptoForm.rateMode" :options="rateModeOptions" optionLabel="label" optionValue="value" />
        </div>
        <div v-if="cryptoForm.rateMode === '固定匯率'" class="flex flex-col gap-2">
          <label class="font-medium text-surface-700 dark:text-surface-300">固定匯率 (USDT/TWD)</label>
          <InputNumber v-model="cryptoForm.fixedRate" :minFractionDigits="2" />
        </div>
        <div class="flex items-center gap-3 pt-2 border-t border-surface-200 dark:border-surface-700">
          <InputSwitch v-model="cryptoForm.active" />
          <label class="font-medium text-surface-700 dark:text-surface-300">{{ cryptoForm.active ? '啟用中' : '已停用' }}</label>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="取消" severity="secondary" @click="cryptoDialogVisible = false" />
          <Button label="儲存" icon="pi pi-check" @click="saveCrypto" />
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
import InputSwitch from 'primevue/inputswitch'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Password from 'primevue/password'
import Select from 'primevue/select'
import MultiSelect from 'primevue/multiselect'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const activeTab = ref(0)

// ========================================
// Bank Cards
// ========================================
interface BankCard {
  id: number
  bankName: string
  accountName: string
  accountNumber: string
  vipRange: string
  minAmount: number
  maxAmount: number
  active: boolean
  disableReason: string
}

const bankCards = ref<BankCard[]>([
  { id: 1, bankName: '中國信託', accountName: 'YOTA 科技', accountNumber: '1234-****-****-5678', vipRange: 'VIP1-VIP3', minAmount: 500, maxAmount: 50000, active: true, disableReason: '' },
  { id: 2, bankName: '國泰世華', accountName: 'YOTA 科技', accountNumber: '5678-****-****-1234', vipRange: 'VIP4-VIP6', minAmount: 1000, maxAmount: 100000, active: true, disableReason: '' },
  { id: 3, bankName: '台新銀行', accountName: 'YOTA 科技', accountNumber: '9012-****-****-3456', vipRange: 'VIP1-VIP6', minAmount: 500, maxAmount: 30000, active: false, disableReason: '卡片風控中' }
])

const bankDialogVisible = ref(false)
const editingBank = ref<BankCard | null>(null)
const bankForm = ref({ bankName: '', accountName: '', accountNumber: '', vipRange: '', minAmount: 500, maxAmount: 50000, active: true, disableReason: '' })

const openBankDialog = (bank: BankCard | null) => {
  editingBank.value = bank
  if (bank) {
    bankForm.value = { ...bank }
  } else {
    bankForm.value = { bankName: '', accountName: '', accountNumber: '', vipRange: '', minAmount: 500, maxAmount: 50000, active: true, disableReason: '' }
  }
  bankDialogVisible.value = true
}

const saveBank = () => {
  if (!bankForm.value.bankName) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫銀行名稱', life: 3000 })
    return
  }
  const action = editingBank.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `銀行卡「${bankForm.value.bankName}」已${action}`, life: 3000 })
  bankDialogVisible.value = false
}

const handleBankStatusChange = (bank: BankCard) => {
  const status = bank.active ? '顯示' : '隱藏'
  toast.add({ severity: 'success', summary: '狀態變更', detail: `${bank.bankName} 已${status}於前台`, life: 2000 })
}

// ========================================
// Third-Party Gateways
// ========================================
interface Gateway {
  id: number
  name: string
  merchantCode: string
  methods: string[]
  feeRate: number
  active: boolean
  apiUrl: string
  merchantId: string
  secretKey: string
  callbackUrl: string
}

const gateways = ref<Gateway[]>([
  { id: 1, name: 'Spay', merchantCode: 'SP12345', methods: ['網銀', '超商'], feeRate: 1.5, active: true, apiUrl: 'https://api.spay.com/pay', merchantId: 'M12345', secretKey: '', callbackUrl: 'https://api.yota.com/cb/spay' },
  { id: 2, name: 'JPay', merchantCode: 'JP67890', methods: ['網銀', 'LinePay'], feeRate: 1.8, active: true, apiUrl: 'https://api.jpay.com/pay', merchantId: 'M67890', secretKey: '', callbackUrl: 'https://api.yota.com/cb/jpay' },
  { id: 3, name: 'EasyPay', merchantCode: 'EP11111', methods: ['超商', 'ATM'], feeRate: 2.0, active: false, apiUrl: 'https://api.easypay.com/pay', merchantId: 'M11111', secretKey: '', callbackUrl: 'https://api.yota.com/cb/easypay' }
])

const paymentMethods = ref([
  { label: '網銀', value: '網銀' },
  { label: '超商', value: '超商' },
  { label: 'LinePay', value: 'LinePay' },
  { label: 'ATM', value: 'ATM' },
  { label: 'Apple Pay', value: 'Apple Pay' }
])

const gatewayDialogVisible = ref(false)
const editingGateway = ref<Gateway | null>(null)
const gatewayForm = ref({ name: '', merchantCode: '', methods: [] as string[], feeRate: 1.5, active: true, apiUrl: '', merchantId: '', secretKey: '', callbackUrl: '' })

const openGatewayDialog = (gw: Gateway | null) => {
  editingGateway.value = gw
  if (gw) {
    gatewayForm.value = { ...gw }
  } else {
    gatewayForm.value = { name: '', merchantCode: '', methods: [], feeRate: 1.5, active: true, apiUrl: '', merchantId: '', secretKey: '', callbackUrl: '' }
  }
  gatewayDialogVisible.value = true
}

const saveGateway = () => {
  if (!gatewayForm.value.name) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫金流商名稱', life: 3000 })
    return
  }
  const action = editingGateway.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `金流商「${gatewayForm.value.name}」已${action}`, life: 3000 })
  gatewayDialogVisible.value = false
}

const handleGatewayStatusChange = (gw: Gateway) => {
  const status = gw.active ? '啟用' : '停用'
  toast.add({ severity: 'success', summary: '狀態變更', detail: `${gw.name} 已${status}`, life: 2000 })
}

const getMethodSeverity = (method: string): string => {
  const map: Record<string, string> = { '網銀': 'info', '超商': 'success', 'LinePay': 'warn', 'ATM': 'secondary', 'Apple Pay': 'contrast' }
  return map[method] || 'secondary'
}

// ========================================
// Crypto Wallets
// ========================================
interface CryptoWallet {
  id: number
  chain: string
  address: string
  rateMode: string
  fixedRate: number
  active: boolean
}

const cryptoWallets = ref<CryptoWallet[]>([
  { id: 1, chain: 'TRC20', address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', rateMode: '自動跟隨', fixedRate: 0, active: true },
  { id: 2, chain: 'ERC20', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD05', rateMode: '固定匯率', fixedRate: 31.5, active: true },
  { id: 3, chain: 'TRC20', address: 'TPYmHEhy5n8TCEfYGqW2rPxsghSfzghPDn', rateMode: '自動跟隨', fixedRate: 0, active: false }
])

const chainOptions = ref([
  { label: 'TRC20 (Tron)', value: 'TRC20' },
  { label: 'ERC20 (Ethereum)', value: 'ERC20' }
])

const rateModeOptions = ref([
  { label: '自動跟隨', value: '自動跟隨' },
  { label: '固定匯率', value: '固定匯率' }
])

const cryptoDialogVisible = ref(false)
const editingCrypto = ref<CryptoWallet | null>(null)
const cryptoForm = ref({ chain: 'TRC20', address: '', rateMode: '自動跟隨', fixedRate: 31.5, active: true })

const openCryptoDialog = (wallet: CryptoWallet | null) => {
  editingCrypto.value = wallet
  if (wallet) {
    cryptoForm.value = { ...wallet }
  } else {
    cryptoForm.value = { chain: 'TRC20', address: '', rateMode: '自動跟隨', fixedRate: 31.5, active: true }
  }
  cryptoDialogVisible.value = true
}

const saveCrypto = () => {
  if (!cryptoForm.value.address) {
    toast.add({ severity: 'error', summary: '驗證失敗', detail: '請填寫錢包地址', life: 3000 })
    return
  }
  const action = editingCrypto.value ? '更新' : '新增'
  toast.add({ severity: 'success', summary: `${action}成功`, detail: `${cryptoForm.value.chain} 錢包已${action}`, life: 3000 })
  cryptoDialogVisible.value = false
}

const handleCryptoStatusChange = (wallet: CryptoWallet) => {
  const status = wallet.active ? '啟用' : '停用'
  toast.add({ severity: 'success', summary: '狀態變更', detail: `${wallet.chain} 錢包已${status}`, life: 2000 })
}
</script>
