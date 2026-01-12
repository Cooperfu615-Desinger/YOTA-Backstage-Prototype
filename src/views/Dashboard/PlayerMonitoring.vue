<template>
  <div class="p-6 space-y-6">

    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-chart-bar text-blue-400"></i>
      <span class="text-surface-300">儀表板</span>
      <span>></span>
      <span class="text-white font-medium">玩家監控</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-eye text-red-400"></i>
          玩家監控
        </h1>
        <p class="text-surface-400 mt-1">Player Monitoring - 風控與客服專用</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- TabView for Dual Track Monitoring -->
    <TabView>
      <!-- Tab 1: 直營上架監控 (Store/Direct) -->
      <TabPanel value="0">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="pi pi-mobile"></i>
            <span>直營上架監控</span>
          </div>
        </template>
        
        <div class="space-y-6 pt-4">
          <!-- Device Risk Section -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Emulator Detection Doughnut -->
            <Card class="chart-card">
              <template #title>
                <div class="flex items-center gap-2">
                  <i class="pi pi-desktop text-blue-400"></i>
                  <span>模擬器偵測</span>
                </div>
              </template>
              <template #content>
                <div class="flex items-center justify-center">
                  <Chart type="doughnut" :data="emulatorChartData" :options="doughnutChartOptions" class="w-48 h-48" />
                </div>
                <div class="mt-4 text-center">
                  <Tag 
                    v-if="deviceRisk.emulatorPercent > 10" 
                    value="模擬器佔比過高" 
                    severity="danger"
                    class="text-xs"
                  />
                  <Tag v-else value="正常範圍" severity="success" class="text-xs" />
                </div>
              </template>
            </Card>

            <!-- Multi-Login Alert -->
            <Card class="stat-card">
              <template #content>
                <div class="text-center py-4">
                  <div class="w-16 h-16 rounded-full flex items-center justify-center bg-orange-500/20 mx-auto mb-4">
                    <i class="pi pi-exclamation-triangle text-3xl text-orange-400"></i>
                  </div>
                  <p class="text-surface-400 text-sm mb-2">多開警報</p>
                  <p class="text-4xl font-bold text-orange-400 mb-2">{{ deviceRisk.multiLoginDevices }}</p>
                  <p class="text-surface-500 text-xs">單一裝置登入 > 5 帳號</p>
                </div>
              </template>
            </Card>

            <!-- Malicious Refunds -->
            <Card class="stat-card">
              <template #content>
                <div class="text-center py-4">
                  <div class="w-16 h-16 rounded-full flex items-center justify-center bg-red-500/20 mx-auto mb-4">
                    <i class="pi pi-times-circle text-3xl text-red-400"></i>
                  </div>
                  <p class="text-surface-400 text-sm mb-2">惡意退款</p>
                  <p class="text-4xl font-bold text-red-400 mb-2">{{ deviceRisk.refundAccounts }}</p>
                  <p class="text-surface-500 text-xs">今日收到退款通知的帳號</p>
                </div>
              </template>
            </Card>
          </div>

          <!-- Abnormal Accounts Table -->
          <Card class="chart-card">
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="pi pi-users text-red-400"></i>
                  <span>異常帳號列表</span>
                </div>
                <Tag :value="`共 ${abnormalAccounts.length} 筆`" severity="warn" />
              </div>
            </template>
            <template #content>
              <DataTable 
                :value="abnormalAccounts" 
                :pt="tablePassThrough"
                class="compact-table"
                paginator
                :rows="5"
              >
                <Column field="playerId" header="玩家 ID">
                  <template #body="{ data }">
                    <span class="text-blue-400 font-medium">{{ data.playerId }}</span>
                  </template>
                </Column>
                <Column field="deviceModel" header="裝置型號">
                  <template #body="{ data }">
                    <div class="flex items-center gap-2">
                      <i :class="['pi', data.isEmulator ? 'pi-desktop text-orange-400' : 'pi-mobile text-green-400']"></i>
                      <span :class="data.isEmulator ? 'text-orange-400' : ''">{{ data.deviceModel }}</span>
                    </div>
                  </template>
                </Column>
                <Column field="ipLocation" header="IP 歸屬"></Column>
                <Column field="riskTags" header="風險標籤">
                  <template #body="{ data }">
                    <div class="flex flex-wrap gap-1">
                      <Tag 
                        v-for="tag in data.riskTags" 
                        :key="tag"
                        :value="tag"
                        :severity="getRiskTagSeverity(tag)"
                        class="text-xs"
                      />
                    </div>
                  </template>
                </Column>
                <Column field="status" header="狀態">
                  <template #body="{ data }">
                    <Tag 
                      :value="data.status" 
                      :severity="data.status === '正常' ? 'success' : 'danger'"
                    />
                  </template>
                </Column>
                <Column header="操作">
                  <template #body="{ data }">
                    <div class="flex items-center gap-2">
                      <Button 
                        icon="pi pi-sign-out" 
                        severity="warn" 
                        size="small"
                        rounded
                        text
                        @click="handleKickPlayer(data.playerId)"
                        v-tooltip.top="'踢下線'"
                      />
                      <Button 
                        icon="pi pi-lock" 
                        severity="danger" 
                        size="small"
                        rounded
                        text
                        @click="handleFreezeAccount(data.playerId)"
                        v-tooltip.top="'凍結帳號'"
                        :disabled="data.status === '凍結'"
                      />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>
      </TabPanel>

      <!-- Tab 2: 包網代理監控 (Network/Agent) -->
      <TabPanel value="1">
        <template #header>
          <div class="flex items-center gap-2">
            <i class="pi pi-sitemap"></i>
            <span>包網代理監控</span>
          </div>
        </template>
        
        <div class="space-y-6 pt-4">
          <!-- Agent Risk KPI Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- High Risk Agents -->
            <Card class="stat-card">
              <template #content>
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-surface-400 text-sm mb-1">高風險代理數</p>
                    <p class="text-3xl font-bold text-red-400 mb-2">{{ agentRisk.highRiskCount }}</p>
                    <p class="text-surface-500 text-xs">旗下會員贏率 > 80%</p>
                  </div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-red-500/20">
                    <i class="pi pi-exclamation-circle text-xl text-red-400"></i>
                  </div>
                </div>
              </template>
            </Card>

            <!-- Commission Anomaly -->
            <Card class="stat-card">
              <template #content>
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-surface-400 text-sm mb-1">佣金異常暴增</p>
                    <p class="text-3xl font-bold text-orange-400 mb-2">{{ agentRisk.commissionAnomalyCount }}</p>
                    <p class="text-surface-500 text-xs">今日佣金 vs 平均值差異過大</p>
                  </div>
                  <div class="w-12 h-12 rounded-lg flex items-center justify-center bg-orange-500/20">
                    <i class="pi pi-chart-line text-xl text-orange-400"></i>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <!-- Agent Monitoring Table -->
          <Card class="chart-card">
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="pi pi-sitemap text-blue-400"></i>
                  <span>代理監控列表</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-surface-400">
                  <span class="w-3 h-3 rounded-full bg-red-500"></span>
                  <span>GGR 負數 = 內神通外鬼/聯合套利警示</span>
                </div>
              </div>
            </template>
            <template #content>
              <DataTable 
                :value="agentMonitorData" 
                :pt="tablePassThrough"
                class="compact-table"
                paginator
                :rows="5"
              >
                <Column field="agentId" header="代理帳號">
                  <template #body="{ data }">
                    <span class="text-blue-400 font-medium">{{ data.agentId }}</span>
                  </template>
                </Column>
                <Column field="downlineCount" header="下線人數">
                  <template #body="{ data }">
                    <span>{{ formatNumber(data.downlineCount) }}</span>
                  </template>
                </Column>
                <Column field="totalBet" header="總投注">
                  <template #body="{ data }">
                    <span class="text-blue-400">{{ formatCurrency(data.totalBet) }}</span>
                  </template>
                </Column>
                <Column field="ggr" header="總殺數 (GGR)">
                  <template #body="{ data }">
                    <span 
                      :class="[
                        'font-bold',
                        data.ggr >= 0 ? 'text-green-400' : 'text-red-400 animate-pulse'
                      ]"
                    >
                      {{ data.ggr >= 0 ? '+' : '' }}{{ formatCurrency(data.ggr) }}
                    </span>
                    <Tag 
                      v-if="data.ggr < 0" 
                      value="風險警示" 
                      severity="danger" 
                      class="ml-2 text-xs"
                    />
                  </template>
                </Column>
                <Column field="profitRatio" header="獲利佔比">
                  <template #body="{ data }">
                    <span :class="data.profitRatio < 0 ? 'text-red-400' : 'text-surface-300'">
                      {{ data.profitRatio.toFixed(2) }}%
                    </span>
                  </template>
                </Column>
                <Column header="操作">
                  <template #body="{ data: _data }">
                    <Button 
                      icon="pi pi-search" 
                      severity="info" 
                      size="small"
                      rounded
                      text
                      v-tooltip.top="'查看詳情'"
                    />
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>

          <!-- Whale Watch Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Top Winners -->
            <Card class="chart-card">
              <template #title>
                <div class="flex items-center gap-2">
                  <i class="pi pi-trophy text-green-400"></i>
                  <span>今日大贏家 (Top 10)</span>
                </div>
              </template>
              <template #content>
                <DataTable 
                  :value="topWinners" 
                  :pt="tablePassThrough"
                  class="compact-table"
                >
                  <Column field="rank" header="#">
                    <template #body="{ data }">
                      <span 
                        class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        :class="{
                          'bg-yellow-500/20 text-yellow-400': data.rank <= 3,
                          'bg-surface-700 text-surface-400': data.rank > 3
                        }"
                      >
                        {{ data.rank }}
                      </span>
                    </template>
                  </Column>
                  <Column field="playerId" header="玩家 ID">
                    <template #body="{ data }">
                      <span class="text-blue-400">{{ data.playerId }}</span>
                    </template>
                  </Column>
                  <Column field="profit" header="淨利">
                    <template #body="{ data }">
                      <span class="text-green-400 font-bold">+{{ formatCurrency(data.profit) }}</span>
                    </template>
                  </Column>
                  <Column header="狀態">
                    <template #body="{ data }">
                      <Tag 
                        :value="data.isAbnormal ? '疑似異常' : '正常'" 
                        :severity="data.isAbnormal ? 'warn' : 'success'"
                        class="text-xs"
                      />
                    </template>
                  </Column>
                </DataTable>
              </template>
            </Card>

            <!-- Top Losers -->
            <Card class="chart-card">
              <template #title>
                <div class="flex items-center gap-2">
                  <i class="pi pi-heart text-red-400"></i>
                  <span>今日大輸家 (Top 10)</span>
                  <span class="text-xs text-surface-500 ml-2">需關懷/送紅包</span>
                </div>
              </template>
              <template #content>
                <DataTable 
                  :value="topLosers" 
                  :pt="tablePassThrough"
                  class="compact-table"
                >
                  <Column field="rank" header="#">
                    <template #body="{ data }">
                      <span class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-surface-700 text-surface-400">
                        {{ data.rank }}
                      </span>
                    </template>
                  </Column>
                  <Column field="playerId" header="玩家 ID">
                    <template #body="{ data }">
                      <span class="text-blue-400">{{ data.playerId }}</span>
                    </template>
                  </Column>
                  <Column field="loss" header="淨損">
                    <template #body="{ data }">
                      <span class="text-red-400 font-bold">-{{ formatCurrency(data.loss) }}</span>
                    </template>
                  </Column>
                  <Column header="操作">
                    <template #body>
                      <Button 
                        icon="pi pi-gift" 
                        severity="success" 
                        size="small"
                        rounded
                        text
                        v-tooltip.top="'發送紅包'"
                      />
                    </template>
                  </Column>
                </DataTable>
              </template>
            </Card>
          </div>
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import Button from 'primevue/button'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import { useTheme } from '@/composables/useTheme'

const { chartColors } = useTheme()

// ========================================
// State
// ========================================
const lastUpdate = ref(new Date().toLocaleTimeString('zh-TW', { 
  hour: '2-digit', 
  minute: '2-digit',
  second: '2-digit'
}))

// ========================================
// Helper Functions
// ========================================
const formatNumber = (num: number): string => num.toLocaleString()

const formatCurrency = (num: number): string => {
  const absNum = Math.abs(num)
  if (absNum >= 1000000) return `$${(num / 1000000).toFixed(2)}M`
  if (absNum >= 1000) return `$${(num / 1000).toFixed(1)}K`
  return `$${num.toLocaleString()}`
}

const getRiskTagSeverity = (tag: string): "success" | "warn" | "danger" | "info" | "secondary" | "contrast" | undefined => {
  switch (tag) {
    case '模擬器': return 'warn'
    case '刷退慣犯': return 'danger'
    case '同裝置多號': return 'warn'
    case '異常IP': return 'danger'
    default: return 'info'
  }
}

const handleKickPlayer = (playerId: string) => {
  console.log('Kicking player:', playerId)
  // TODO: Implement kick player logic
}

const handleFreezeAccount = (playerId: string) => {
  console.log('Freezing account:', playerId)
  // TODO: Implement freeze account logic
}

// ========================================
// Table PassThrough
// ========================================
const tablePassThrough = {
  root: { class: 'border-0' },
  tableContainer: { class: 'border-0' },
  thead: { class: 'border-0' },
  tbody: { class: 'border-0' },
  row: { class: 'border-0 border-b border-surface-700 last:border-0' }
}

// ========================================
// Mock Data - Device Risk
// ========================================
const deviceRisk = ref({
  emulatorPercent: 15,
  realDevicePercent: 85,
  multiLoginDevices: 23,
  refundAccounts: 8
})

// ========================================
// Chart Data - Emulator Detection Doughnut
// ========================================
const emulatorChartData = computed(() => ({
  labels: ['真機', '模擬器'],
  datasets: [{
    data: [deviceRisk.value.realDevicePercent, deviceRisk.value.emulatorPercent],
    backgroundColor: [
      'rgba(74, 222, 128, 0.8)',
      'rgba(251, 146, 60, 0.8)'
    ],
    borderWidth: 0,
    hoverOffset: 6
  }]
}))

const doughnutChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: { color: chartColors.value.legendColor, padding: 12 }
    },
    tooltip: {
      backgroundColor: chartColors.value.tooltipBg,
      titleColor: chartColors.value.tooltipTitle,
      bodyColor: chartColors.value.tooltipBody,
      borderColor: chartColors.value.tooltipBorder,
      borderWidth: 1,
      callbacks: {
        label: (context: { label: string; raw: number }) => `${context.label}: ${context.raw}%`
      }
    }
  },
  cutout: '55%'
}))

// ========================================
// Mock Data - Abnormal Accounts
// ========================================
const abnormalAccounts = ref([
  { playerId: 'P202601120001', deviceModel: 'BlueStacks 5', isEmulator: true, ipLocation: '台北市', riskTags: ['模擬器', '同裝置多號'], status: '正常' },
  { playerId: 'P202601120015', deviceModel: 'NoxPlayer', isEmulator: true, ipLocation: '新北市', riskTags: ['模擬器'], status: '正常' },
  { playerId: 'P202601120023', deviceModel: 'iPhone 14 Pro', isEmulator: false, ipLocation: 'VPN (美國)', riskTags: ['刷退慣犯', '異常IP'], status: '凍結' },
  { playerId: 'P202601120045', deviceModel: 'LDPlayer 9', isEmulator: true, ipLocation: '高雄市', riskTags: ['模擬器', '刷退慣犯'], status: '正常' },
  { playerId: 'P202601120067', deviceModel: 'MEmu Play', isEmulator: true, ipLocation: '台中市', riskTags: ['模擬器', '同裝置多號'], status: '正常' },
  { playerId: 'P202601120089', deviceModel: 'Samsung S24', isEmulator: false, ipLocation: '桃園市', riskTags: ['同裝置多號'], status: '正常' },
  { playerId: 'P202601120102', deviceModel: 'Gameloop', isEmulator: true, ipLocation: '新竹市', riskTags: ['模擬器'], status: '凍結' }
])

// ========================================
// Mock Data - Agent Risk
// ========================================
const agentRisk = ref({
  highRiskCount: 5,
  commissionAnomalyCount: 3
})

const agentMonitorData = ref([
  { agentId: 'Agent_TW_001', downlineCount: 1250, totalBet: 28500000, ggr: 1850000, profitRatio: 6.49 },
  { agentId: 'Agent_HK_003', downlineCount: 890, totalBet: 22100000, ggr: -520000, profitRatio: -2.35 },
  { agentId: 'Agent_MY_008', downlineCount: 1560, totalBet: 18600000, ggr: 1280000, profitRatio: 6.88 },
  { agentId: 'Agent_SG_012', downlineCount: 420, totalBet: 15200000, ggr: -180000, profitRatio: -1.18 },
  { agentId: 'Agent_TH_005', downlineCount: 780, totalBet: 12800000, ggr: 850000, profitRatio: 6.64 },
  { agentId: 'Agent_VN_015', downlineCount: 650, totalBet: 9500000, ggr: 420000, profitRatio: 4.42 },
  { agentId: 'Agent_PH_021', downlineCount: 320, totalBet: 7200000, ggr: -95000, profitRatio: -1.32 }
])

// ========================================
// Mock Data - Whale Watch
// ========================================
const topWinners = ref([
  { rank: 1, playerId: 'P202601110088', profit: 2850000, isAbnormal: true },
  { rank: 2, playerId: 'P202601110156', profit: 1920000, isAbnormal: false },
  { rank: 3, playerId: 'P202601110234', profit: 1650000, isAbnormal: true },
  { rank: 4, playerId: 'P202601110312', profit: 1280000, isAbnormal: false },
  { rank: 5, playerId: 'P202601110445', profit: 980000, isAbnormal: false },
  { rank: 6, playerId: 'P202601110523', profit: 850000, isAbnormal: false },
  { rank: 7, playerId: 'P202601110601', profit: 720000, isAbnormal: false },
  { rank: 8, playerId: 'P202601110689', profit: 650000, isAbnormal: false },
  { rank: 9, playerId: 'P202601110767', profit: 580000, isAbnormal: false },
  { rank: 10, playerId: 'P202601110845', profit: 520000, isAbnormal: false }
])

const topLosers = ref([
  { rank: 1, playerId: 'P202601110099', loss: 3200000 },
  { rank: 2, playerId: 'P202601110178', loss: 2450000 },
  { rank: 3, playerId: 'P202601110267', loss: 1980000 },
  { rank: 4, playerId: 'P202601110356', loss: 1650000 },
  { rank: 5, playerId: 'P202601110434', loss: 1280000 },
  { rank: 6, playerId: 'P202601110512', loss: 980000 },
  { rank: 7, playerId: 'P202601110590', loss: 850000 },
  { rank: 8, playerId: 'P202601110668', loss: 720000 },
  { rank: 9, playerId: 'P202601110746', loss: 650000 },
  { rank: 10, playerId: 'P202601110824', loss: 580000 }
])
</script>

<style scoped>
.stat-card :deep(.p-card-body) {
  padding: 1.25rem;
}

.chart-card :deep(.p-card-body) {
  padding: 1.25rem;
}

.chart-card :deep(.p-card-title) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.compact-table :deep(.p-datatable-table) {
  border-collapse: collapse;
}

.compact-table :deep(.p-datatable-tbody > tr) {
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.compact-table :deep(.p-datatable-tbody > tr:last-child) {
  border-bottom: none;
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
</style>
