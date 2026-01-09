<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-users text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">會員管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">會員列表</span>
    </div>

    <!-- Search Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
          <i class="pi pi-search text-blue-500 dark:text-blue-400"></i>
          會員搜尋
        </div>
      </template>
      <template #content>
        <!-- Search Fields - Fixed Width Left-Aligned Layout -->
        <div class="flex flex-wrap gap-4 mb-4">
          <!-- Row 1: Nickname, IP, Agent -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">暱稱</label>
            <InputText v-model="filters.nickname" placeholder="輸入會員暱稱" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">登入 IP</label>
            <InputText v-model="filters.loginIp" placeholder="輸入 IP 地址" class="w-[220px]" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">代理帳號</label>
            <InputText v-model="filters.agentAccount" placeholder="輸入代理帳號" class="w-[220px]" />
          </div>
        </div>

        <div class="flex flex-wrap gap-4 mb-4">
          <!-- Row 2: Balance Range, Balance Change Date -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">錢包餘額範圍</label>
            <div class="p-inputgroup w-[220px]">
              <InputText v-model="filters.balanceMinText" placeholder="最小" class="!w-[100px]" />
              <span class="p-inputgroup-addon px-2 text-surface-900 dark:text-white">-</span>
              <InputText v-model="filters.balanceMaxText" placeholder="最大" class="!w-[100px]" />
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">錢包異動日期</label>
            <Calendar v-model="filters.balanceChangeDateRange" selectionMode="range" placeholder="選擇日期區間" class="w-[220px]" dateFormat="yy-mm-dd" showIcon :manualInput="false" />
          </div>
        </div>

        <div class="flex flex-wrap gap-4 mb-4">
          <!-- Row 3: Registration Time, Last Login Time -->
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">註冊時間</label>
            <Calendar v-model="filters.registrationDateRange" selectionMode="range" placeholder="選擇日期區間" class="w-[220px]" dateFormat="yy-mm-dd" showIcon :manualInput="false" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">上次登入時間</label>
            <Calendar v-model="filters.lastLoginDateRange" selectionMode="range" placeholder="選擇日期區間" class="w-[220px]" dateFormat="yy-mm-dd" showIcon :manualInput="false" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">會員標籤</label>
            <MultiSelect v-model="filters.tags" :options="tagOptions" optionLabel="label" optionValue="value" placeholder="選擇標籤" class="w-[220px]" display="chip" />
          </div>
        </div>

        <!-- Search & Reset Buttons - Right Aligned -->
        <div class="flex justify-end gap-3">
          <Button label="重置" icon="pi pi-refresh" severity="secondary" outlined @click="handleReset" />
          <Button label="搜尋" icon="pi pi-search" :loading="isSearching" @click="handleSearch" />
        </div>
      </template>
    </Card>

    <!-- Member List Section -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
            <i class="pi pi-users text-green-500 dark:text-green-400"></i>
            會員列表
            <span v-if="hasSearched" class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ members.length }} 筆)</span>
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
            <span class="text-surface-500 dark:text-surface-400 text-sm ml-2">每頁</span>
            <Dropdown v-model="rowsPerPage" :options="[10, 20, 50, 100]" class="w-24" />
            <span class="text-surface-500 dark:text-surface-400 text-sm">筆</span>
          </div>

          <!-- DataTable -->
          <DataTable :value="hasSearched ? paginatedMembers : []" :loading="isSearching" stripedRows class="p-datatable-sm" :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }">
            <template #empty>
              <div class="flex flex-col items-center justify-center py-12 text-center">
                <i :class="['pi text-5xl mb-3', hasSearched ? 'pi-inbox text-surface-500 dark:text-surface-400' : 'pi-search text-surface-500 dark:text-surface-400']"></i>
                <p class="text-surface-500 dark:text-surface-400">{{ hasSearched ? '暫無搜尋結果' : '請先設定搜尋條件並點擊「搜尋」按鈕' }}</p>
              </div>
            </template>
            <Column selectionMode="multiple" headerStyle="width: 3rem" />
            <Column field="id" header="編號" sortable style="min-width: 80px">
              <template #body="slotProps"><span class="text-surface-700 dark:text-surface-300">{{ slotProps.data.id }}</span></template>
            </Column>
            <Column field="account" header="ID" sortable style="min-width: 140px">
              <template #body="slotProps">
                <span class="text-blue-500 dark:text-blue-400 font-medium cursor-pointer hover:underline" @click="openMemberDetail(slotProps.data)">{{ slotProps.data.account }}</span>
              </template>
            </Column>
            <Column field="nickname" header="暱稱" sortable style="min-width: 120px">
              <template #body="slotProps"><span class="text-surface-900 dark:text-white">{{ slotProps.data.nickname }}</span></template>
            </Column>
            <Column field="agent" header="代理" sortable style="min-width: 100px">
              <template #body="slotProps"><span class="text-surface-500 dark:text-surface-300">{{ slotProps.data.agent }}</span></template>
            </Column>
            <Column field="loginIp" header="登入IP" sortable style="min-width: 140px">
              <template #body="slotProps"><span class="text-surface-500 dark:text-surface-400 text-sm font-mono">{{ slotProps.data.loginIp }}</span></template>
            </Column>
            <Column field="vip" header="VIP" sortable style="min-width: 60px">
              <template #body="slotProps"><span class="text-amber-500 dark:text-amber-400 font-bold">{{ slotProps.data.vip }}</span></template>
            </Column>
            <Column field="wallet" header="錢包" sortable style="min-width: 130px">
              <template #body="slotProps"><span class="text-surface-900 dark:text-white font-medium">{{ formatCurrency(slotProps.data.wallet) }}</span></template>
            </Column>
            <Column field="status" header="狀態" style="min-width: 80px">
              <template #body="slotProps"><Tag :severity="getStatusSeverity(slotProps.data.status)" :value="slotProps.data.statusText" /></template>
            </Column>
            <Column field="registerDate" header="註冊日期" sortable style="min-width: 110px">
              <template #body="slotProps"><span class="text-surface-500 dark:text-surface-400">{{ slotProps.data.registerDate }}</span></template>
            </Column>
            <Column field="lastLogin" header="最後登入" sortable style="min-width: 160px">
              <template #body="slotProps"><span class="text-surface-500 dark:text-surface-400 text-sm">{{ slotProps.data.lastLogin }}</span></template>
            </Column>
            <Column field="memo" header="備註" style="min-width: 100px">
              <template #body="slotProps"><Tag v-if="slotProps.data.memo" :value="slotProps.data.memo" severity="contrast" class="text-xs" /></template>
            </Column>
            <Column field="tags" header="標籤" style="min-width: 150px">
              <template #body="slotProps">
                <div class="flex flex-wrap gap-1">
                  <Tag v-for="tag in slotProps.data.tags" :key="tag.name" :value="tag.name" :style="{ backgroundColor: tag.color }" class="text-xs" />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </template>
    </Card>

    <!-- Add Member Dialog -->
    <Dialog v-model:visible="showAddMemberDialog" header="新增會員" :modal="true" :style="{ width: '500px' }">
      <div class="space-y-4">
        <div class="flex flex-col gap-2">
          <label class="text-surface-900 dark:text-surface-0">帳號</label>
          <InputText v-model="newMember.account" placeholder="請輸入帳號" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-900 dark:text-surface-0">暱稱</label>
          <InputText v-model="newMember.nickname" placeholder="請輸入暱稱" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-900 dark:text-surface-0">代理</label>
          <Dropdown v-model="newMember.agent" :options="agentOptions" optionLabel="label" optionValue="value" placeholder="選擇代理" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-surface-900 dark:text-surface-0">VIP等級</label>
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
          <div class="bg-surface-0 dark:bg-surface-800 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
            <div class="text-center mb-4">
              <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto flex items-center justify-center text-3xl font-bold text-white">
                {{ memberDetail.account.charAt(0).toUpperCase() }}
              </div>
              <h3 class="text-surface-900 dark:text-white font-bold text-lg mt-3">{{ memberDetail.account }}</h3>
              <p class="text-surface-500 dark:text-surface-400 text-sm">{{ memberDetail.nickname || '未設定暱稱' }}</p>
            </div>
            
            <!-- VIP Badge -->
            <div class="flex justify-center mb-4">
              <Tag :value="`VIP ${memberDetail.vip}`" :severity="memberDetail.vip >= 3 ? 'warn' : 'info'" class="text-lg px-4 py-1" />
            </div>
            
            <!-- Wallet Balance -->
            <div class="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-lg p-4 text-center border border-emerald-500/20 dark:border-emerald-600/30 mb-4">
              <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">錢包總額</p>
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
              <!-- Basic Info Grid -->
              <!-- Basic Info Grid -->
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">真實姓名</p>
                  <p class="text-surface-900 dark:text-white font-medium">{{ memberDetail.profile.realName }}</p>
                </div>
                <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">手機號碼</p>
                  <p class="text-surface-900 dark:text-white font-medium">{{ memberDetail.profile.phone }}</p>
                </div>
                <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">電子郵件</p>
                  <p class="text-surface-900 dark:text-white font-medium">{{ memberDetail.profile.email }}</p>
                </div>
                <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">代理路徑</p>
                  <p class="text-blue-500 dark:text-blue-400 font-medium">{{ memberDetail.profile.agentPath }}</p>
                </div>
                <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">註冊 IP</p>
                  <p class="text-surface-900 dark:text-white font-mono text-sm">{{ memberDetail.profile.registerIp }}</p>
                </div>
                <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">最後登入 IP</p>
                  <p class="text-surface-900 dark:text-white font-mono text-sm">{{ memberDetail.loginIp }}</p>
                </div>
                <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">註冊時間</p>
                  <p class="text-surface-900 dark:text-white font-medium">{{ memberDetail.registerDate }}</p>
                </div>
                <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">最後登入</p>
                  <p class="text-surface-900 dark:text-white font-medium">{{ memberDetail.lastLogin }}</p>
                </div>
              </div>

              <!-- Security Risk Section -->
              <h4 class="text-surface-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                <i class="pi pi-shield text-orange-500 dark:text-orange-400"></i>安全風險
              </h4>
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-gradient-to-br from-orange-500/10 to-surface-50 dark:from-orange-900/20 dark:to-surface-800 rounded-lg p-3 border border-orange-500/20 dark:border-orange-600/30">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">同 IP 關聯帳號數</p>
                  <p class="text-xl font-bold" :class="memberDetail.security.sameIpAccounts > 3 ? 'text-red-500 dark:text-red-400' : 'text-surface-900 dark:text-white'">{{ memberDetail.security.sameIpAccounts }} 個</p>
                  <p v-if="memberDetail.security.sameIpAccounts > 3" class="text-red-500 dark:text-red-400 text-xs mt-1">• 高風險！需人工審核</p>
                </div>
                <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">登入設備指紋</p>
                  <p class="text-surface-900 dark:text-white font-mono text-sm">{{ memberDetail.security.deviceFingerprint }}</p>
                </div>
              </div>

              <!-- Bank Cards Section -->
              <h4 class="text-surface-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                <i class="pi pi-credit-card text-blue-500 dark:text-blue-400"></i>取款銀行卡
              </h4>
              <DataTable :value="memberDetail.bankCards" stripedRows class="p-datatable-sm mb-4">
                <Column field="bank" header="銀行" style="min-width: 100px">
                  <template #body="slotProps"><span class="text-surface-900 dark:text-white">{{ slotProps.data.bank }}</span></template>
                </Column>
                <Column field="branch" header="分行" style="min-width: 120px">
                  <template #body="slotProps"><span class="text-surface-500 dark:text-surface-300">{{ slotProps.data.branch }}</span></template>
                </Column>
                <Column field="accountNo" header="帳號" style="min-width: 150px">
                  <template #body="slotProps"><span class="text-surface-900 dark:text-white font-mono text-sm">{{ slotProps.data.accountNo }}</span></template>
                </Column>
                <Column field="holderName" header="姓名" style="min-width: 80px">
                  <template #body="slotProps"><span class="text-surface-900 dark:text-white">{{ slotProps.data.holderName }}</span></template>
                </Column>
                <Column field="status" header="狀態" style="min-width: 80px">
                  <template #body="slotProps"><Tag :value="slotProps.data.status" :severity="slotProps.data.status === '已驗證' ? 'success' : 'warn'" /></template>
                </Column>
              </DataTable>

              <!-- Memo -->
              <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">備註</p>
                <p class="text-surface-900 dark:text-white">{{ memberDetail.memo || '無備註' }}</p>
              </div>
            </TabPanel>

            <!-- Tab 2: 會員日誌 -->
            <!-- Tab 2: 會員日誌 -->
            <TabPanel value="1" header="會員日誌">
              <!-- Activity Logs -->
              <h4 class="text-surface-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                <i class="pi pi-history text-blue-500 dark:text-blue-400"></i>活動日誌
              </h4>
              <DataTable :value="memberDetail.logs" stripedRows class="p-datatable-sm mb-4">
                <Column field="action" header="行為" style="min-width: 120px">
                  <template #body="slotProps">
                    <Tag :value="slotProps.data.action" :severity="getLogSeverity(slotProps.data.type)" />
                  </template>
                </Column>
                <Column field="ip" header="IP" style="min-width: 140px">
                  <template #body="slotProps"><span class="text-surface-500 dark:text-surface-400 font-mono text-sm">{{ slotProps.data.ip }}</span></template>
                </Column>
                <Column field="time" header="時間" style="min-width: 160px">
                  <template #body="slotProps"><span class="text-surface-500 dark:text-surface-400">{{ slotProps.data.time }}</span></template>
                </Column>
                <Column field="description" header="操作描述" style="min-width: 200px">
                  <template #body="slotProps"><span class="text-surface-900 dark:text-white">{{ slotProps.data.description }}</span></template>
                </Column>
              </DataTable>

              <!-- Operator Notes Section -->
              <h4 class="text-surface-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                <i class="pi pi-comments text-purple-500 dark:text-purple-400"></i>營運備註
              </h4>
              <div class="space-y-2">
                <div v-for="(note, idx) in memberDetail.operatorNotes" :key="idx" class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-blue-500 dark:text-blue-400 font-medium text-sm">{{ note.operator }}</span>
                    <span class="text-surface-500 text-xs">{{ note.time }}</span>
                  </div>
                  <p class="text-surface-900 dark:text-white text-sm">{{ note.content }}</p>
                </div>
                <div v-if="!memberDetail.operatorNotes?.length" class="text-surface-500 text-sm text-center py-4">
                  暫無營運備註
                </div>
              </div>
            </TabPanel>

            <!-- Tab 3: 金流紀錄 -->
            <!-- Tab 3: 金流紀錄 -->
            <TabPanel value="2" header="金流紀錄">
              <!-- Rollover Progress Bar -->
              <div class="bg-gradient-to-r from-purple-500/10 to-surface-50 dark:from-purple-900/30 dark:to-surface-800 rounded-lg p-4 border border-purple-200 dark:border-purple-600/30 mb-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-surface-900 dark:text-white font-medium flex items-center gap-2">
                    <i class="pi pi-sync text-purple-500 dark:text-purple-400"></i>打碼量進度
                  </span>
                  <span class="text-purple-600 dark:text-purple-400 font-bold">{{ memberDetail.finance.rolloverProgress }}%</span>
                </div>
                <ProgressBar :value="memberDetail.finance.rolloverProgress" :showValue="false" class="h-3" />
                <p class="text-surface-500 dark:text-surface-400 text-xs mt-2">已打碼 ${{ formatCurrency(memberDetail.finance.currentRollover) }} / 目標 ${{ formatCurrency(memberDetail.finance.requiredRollover) }}</p>
              </div>

              <!-- Financial Summary Cards -->
              <div class="grid grid-cols-4 gap-4 mb-4">
                <div class="bg-gradient-to-br from-green-500/10 to-surface-50 dark:from-green-900/30 dark:to-surface-800 rounded-lg p-3 border border-green-200 dark:border-green-600/30 text-center">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">總存</p>
                  <p class="text-xl font-bold text-green-600 dark:text-green-400">${{ formatCurrency(memberDetail.finance.totalDeposit) }}</p>
                </div>
                <div class="bg-gradient-to-br from-orange-500/10 to-surface-50 dark:from-orange-900/30 dark:to-surface-800 rounded-lg p-3 border border-orange-200 dark:border-orange-600/30 text-center">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">總提</p>
                  <p class="text-xl font-bold text-orange-600 dark:text-orange-400">${{ formatCurrency(memberDetail.finance.totalWithdraw) }}</p>
                </div>
                <div class="bg-gradient-to-br from-blue-500/10 to-surface-50 dark:from-blue-900/30 dark:to-surface-800 rounded-lg p-3 border border-blue-200 dark:border-blue-600/30 text-center">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">手動加款</p>
                  <p class="text-xl font-bold text-blue-600 dark:text-blue-400">${{ formatCurrency(memberDetail.finance.manualAdd) }}</p>
                </div>
                <div class="bg-gradient-to-br from-red-500/10 to-surface-50 dark:from-red-900/30 dark:to-surface-800 rounded-lg p-3 border border-red-200 dark:border-red-600/30 text-center">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">手動扣款</p>
                  <p class="text-xl font-bold text-red-600 dark:text-red-400">${{ formatCurrency(memberDetail.finance.manualDeduct) }}</p>
                </div>
              </div>

              <!-- Profit Summary -->
              <div class="bg-gradient-to-br from-emerald-500/10 to-surface-50 dark:from-emerald-900/30 dark:to-surface-800 rounded-lg p-4 border border-emerald-200 dark:border-emerald-600/30 text-center mb-4">
                <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">總損益</p>
                <p class="text-2xl font-bold" :class="memberDetail.finance.totalProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                  {{ memberDetail.finance.totalProfit >= 0 ? '+' : '' }}${{ formatCurrency(memberDetail.finance.totalProfit) }}
                </p>
              </div>
              
              <!-- Recent Transactions -->
              <!-- Recent Transactions -->
              <h4 class="text-surface-900 dark:text-white font-medium mb-2">最近 5 筆交易</h4>
              <DataTable :value="memberDetail.finance.recentTransactions" stripedRows class="p-datatable-sm">
                <Column field="type" header="類型" style="min-width: 80px">
                  <template #body="slotProps">
                    <Tag :value="slotProps.data.type" :severity="slotProps.data.type === '充值' ? 'success' : 'warn'" />
                  </template>
                </Column>
                <Column field="amount" header="金額" style="min-width: 120px">
                  <template #body="slotProps">
                    <span :class="slotProps.data.type === '充值' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'" class="font-bold">
                      {{ slotProps.data.type === '充值' ? '+' : '-' }}${{ formatCurrency(slotProps.data.amount) }}
                    </span>
                  </template>
                </Column>
                <Column field="channel" header="渠道" style="min-width: 100px">
                  <template #body="slotProps"><span class="text-surface-700 dark:text-surface-300">{{ slotProps.data.channel }}</span></template>
                </Column>
                <Column field="time" header="時間" style="min-width: 160px">
                  <template #body="slotProps"><span class="text-surface-500 dark:text-surface-400">{{ slotProps.data.time }}</span></template>
                </Column>
                <Column field="status" header="狀態" style="min-width: 80px">
                  <template #body="slotProps"><Tag :value="slotProps.data.status" :severity="slotProps.data.status === '成功' ? 'success' : 'warn'" /></template>
                </Column>
              </DataTable>
            </TabPanel>

            <!-- Tab 4: 遊戲紀錄 -->
            <!-- Tab 4: 遊戲紀錄 -->
            <TabPanel value="3" header="遊戲紀錄">
              <!-- Gaming Stats Summary Cards -->
              <div class="grid grid-cols-4 gap-4 mb-4">
                <div class="bg-gradient-to-br from-blue-500/10 to-surface-50 dark:from-blue-900/30 dark:to-surface-800 rounded-lg p-3 border border-blue-200 dark:border-blue-600/30 text-center">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">總投注金額</p>
                  <p class="text-xl font-bold text-blue-600 dark:text-blue-400">${{ formatCurrency(memberDetail.gaming.totalBet) }}</p>
                </div>
                <div class="bg-gradient-to-br from-green-500/10 to-surface-50 dark:from-green-900/30 dark:to-surface-800 rounded-lg p-3 border border-green-200 dark:border-green-600/30 text-center">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">總派彩金額</p>
                  <p class="text-xl font-bold text-green-600 dark:text-green-400">${{ formatCurrency(memberDetail.gaming.totalPayout) }}</p>
                </div>
                <div class="bg-gradient-to-br rounded-lg p-3 border text-center" :class="memberDetail.gaming.netProfit >= 0 ? 'from-emerald-500/10 to-surface-50 dark:from-emerald-900/30 dark:to-surface-800 border-emerald-200 dark:border-emerald-600/30' : 'from-red-500/10 to-surface-50 dark:from-red-900/30 dark:to-surface-800 border-red-200 dark:border-red-600/30'">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">淨盈虧</p>
                  <p class="text-xl font-bold" :class="memberDetail.gaming.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'">
                    {{ memberDetail.gaming.netProfit >= 0 ? '+' : '' }}${{ formatCurrency(memberDetail.gaming.netProfit) }}
                  </p>
                </div>
                <div class="bg-gradient-to-br from-purple-500/10 to-surface-50 dark:from-purple-900/30 dark:to-surface-800 rounded-lg p-3 border border-purple-200 dark:border-purple-600/30 text-center">
                  <p class="text-surface-500 dark:text-surface-400 text-xs mb-1">有效流水</p>
                  <p class="text-xl font-bold text-purple-600 dark:text-purple-400">${{ formatCurrency(memberDetail.gaming.validBet) }}</p>
                </div>
              </div>

              <!-- Charts Row -->
              <div class="grid grid-cols-2 gap-4 mb-4">
                <!-- Game Category Doughnut Chart -->
                <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
                  <h4 class="text-surface-900 dark:text-white font-medium mb-3 flex items-center gap-2">
                    <i class="pi pi-chart-pie text-cyan-500 dark:text-cyan-400"></i>遊戲類型佔比
                  </h4>
                  <div class="h-48">
                    <Chart type="doughnut" :data="categoryChartData" :options="categoryChartOptions" class="h-full" />
                  </div>
                </div>
                
                <!-- Profit Trend Line Chart -->
                <div class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-4 border border-surface-200 dark:border-surface-700">
                  <h4 class="text-surface-900 dark:text-white font-medium mb-3 flex items-center gap-2">
                    <i class="pi pi-chart-line text-blue-500 dark:text-blue-400"></i>近 7 日損益走勢
                  </h4>
                  <div class="h-48">
                    <Chart type="line" :data="profitChartData" :options="profitChartOptions" class="h-full" />
                  </div>
                </div>
              </div>

              <!-- Platform Stats -->
              <div class="grid grid-cols-4 gap-4 mb-4">
                <div v-for="platform in memberDetail.gaming.platforms" :key="platform.name" class="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3 border border-surface-200 dark:border-surface-700">
                  <div class="flex items-center gap-2 mb-2">
                    <i :class="platform.icon" class="text-lg"></i>
                    <span class="text-surface-900 dark:text-white font-medium">{{ platform.name }}</span>
                  </div>
                  <p class="text-surface-500 dark:text-surface-400 text-xs">投注額</p>
                  <p class="text-surface-900 dark:text-white font-bold">${{ formatCurrency(platform.totalBet) }}</p>
                  <p class="text-surface-500 dark:text-surface-400 text-xs mt-1">盈虧</p>
                  <p :class="platform.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'" class="font-bold">
                    {{ platform.profit >= 0 ? '+' : '' }}${{ formatCurrency(platform.profit) }}
                  </p>
                </div>
              </div>
              
              <!-- Betting Records DataTable -->
              <h4 class="text-surface-900 dark:text-white font-medium mb-2 flex items-center gap-2">
                <i class="pi pi-list text-orange-500 dark:text-orange-400"></i>投注明細
              </h4>
              <DataTable 
                :value="memberDetail.gaming.bettingRecords" 
                stripedRows 
                class="p-datatable-sm" 
                paginator 
                :rows="10" 
                :rowsPerPageOptions="[5, 10, 20]"
                sortField="betTime"
                :sortOrder="-1"
              >
                <Column field="orderId" header="注單編號" sortable style="min-width: 140px">
                  <template #body="slotProps"><span class="text-blue-500 dark:text-blue-400 font-mono text-sm">{{ slotProps.data.orderId }}</span></template>
                </Column>
                <Column field="gameName" header="遊戲名稱" sortable style="min-width: 140px">
                  <template #body="slotProps">
                    <div class="flex flex-col">
                      <span class="text-surface-900 dark:text-white">{{ slotProps.data.gameName }}</span>
                      <Tag :value="slotProps.data.platform" severity="secondary" class="text-xs w-fit mt-1" />
                    </div>
                  </template>
                </Column>
                <Column field="betTime" header="投注時間" sortable style="min-width: 150px">
                  <template #body="slotProps"><span class="text-surface-500 dark:text-surface-400 text-sm">{{ slotProps.data.betTime }}</span></template>
                </Column>
                <Column field="betAmount" header="投注金額" sortable style="min-width: 100px">
                  <template #body="slotProps"><span class="text-surface-900 dark:text-white font-medium">${{ formatCurrency(slotProps.data.betAmount) }}</span></template>
                </Column>
                <Column field="validBet" header="有效投注" sortable style="min-width: 100px">
                  <template #body="slotProps"><span class="text-surface-700 dark:text-surface-300">${{ formatCurrency(slotProps.data.validBet) }}</span></template>
                </Column>
                <Column field="payout" header="派彩金額" sortable style="min-width: 100px">
                  <template #body="slotProps"><span class="text-green-600 dark:text-green-400 font-medium">${{ formatCurrency(slotProps.data.payout) }}</span></template>
                </Column>
                <Column field="profit" header="盈虧" sortable style="min-width: 100px">
                  <template #body="slotProps">
                    <span :class="slotProps.data.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'" class="font-bold">
                      {{ slotProps.data.profit >= 0 ? '+' : '' }}${{ formatCurrency(slotProps.data.profit) }}
                    </span>
                  </template>
                </Column>
                <Column field="status" header="狀態" style="min-width: 90px">
                  <template #body="slotProps">
                    <Tag 
                      :value="slotProps.data.status" 
                      :severity="slotProps.data.status === '已結算' ? 'success' : slotProps.data.status === '待開獎' ? 'warn' : 'secondary'" 
                    />
                  </template>
                </Column>
              </DataTable>
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
import ProgressBar from 'primevue/progressbar'
import MultiSelect from 'primevue/multiselect'
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

// Tag options for search
const tagOptions = ref([
  { label: '高風險', value: '高風險', color: '#ef4444' },
  { label: '大額玩家', value: '大額玩家', color: '#22c55e' },
  { label: 'VIP客戶', value: 'VIP客戶', color: '#8b5cf6' },
  { label: '新用戶', value: '新用戶', color: '#3b82f6' },
  { label: '活躍用戶', value: '活躍用戶', color: '#06b6d4' },
  { label: '沉睡用戶', value: '沉睡用戶', color: '#6b7280' },
  { label: '異常IP', value: '異常IP', color: '#f97316' },
  { label: '首充用戶', value: '首充用戶', color: '#eab308' }
])

// Filter state
const filters = ref({
  nickname: '',
  loginIp: '',
  agentAccount: '',
  balanceMinText: '',
  balanceMaxText: '',
  balanceChangeDateRange: null as Date[] | null,
  registrationDateRange: null as Date[] | null,
  lastLoginDateRange: null as Date[] | null,
  tags: [] as string[]
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
  security: {
    sameIpAccounts: number
    deviceFingerprint: string
  }
  bankCards: Array<{ bank: string; branch: string; accountNo: string; holderName: string; status: string }>
  operatorNotes: Array<{ operator: string; time: string; content: string }>
  logs: Array<{ action: string; type: string; ip: string; time: string; description: string }>
  finance: {
    totalDeposit: number
    totalWithdraw: number
    totalProfit: number
    manualAdd: number
    manualDeduct: number
    rolloverProgress: number
    currentRollover: number
    requiredRollover: number
    recentTransactions: Array<{ type: string; amount: number; channel: string; time: string; status: string }>
  }
  gaming: {
    platforms: Array<{ name: string; icon: string; totalBet: number; profit: number }>
    profitTrend: number[]
    // Enhanced gaming data
    totalBet: number
    totalPayout: number
    netProfit: number
    validBet: number
    categoryDistribution: { live: number; slots: number; sports: number; lottery: number }
    bettingRecords: Array<{
      orderId: string
      gameName: string
      platform: string
      betTime: string
      betAmount: number
      validBet: number
      payout: number
      profit: number
      status: string
    }>
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
  tags: Array<{ name: string; color: string }>
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

// Generate random member tags
const generateMemberTags = () => {
  const allTags = [
    { name: '高風險', color: '#ef4444' },
    { name: '大額玩家', color: '#22c55e' },
    { name: 'VIP客戶', color: '#8b5cf6' },
    { name: '新用戶', color: '#3b82f6' },
    { name: '活躍用戶', color: '#06b6d4' },
    { name: '沉睡用戶', color: '#6b7280' },
    { name: '異常IP', color: '#f97316' },
    { name: '首充用戶', color: '#eab308' }
  ]
  const tagCount = Math.random() > 0.3 ? Math.floor(Math.random() * 3) : 0
  const selected: typeof allTags = []
  for (let i = 0; i < tagCount; i++) {
    const tag = allTags[Math.floor(Math.random() * allTags.length)]!
    if (!selected.some(t => t.name === tag.name)) selected.push(tag)
  }
  return selected
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
      memo: memos[Math.floor(Math.random() * memos.length)] ?? '',
      tags: generateMemberTags()
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

  // Generate bank cards
  const banks = ['中國銀行', '工商銀行', '建設銀行', '農業銀行', '招商銀行', '交通銀行']
  const branches = ['民生支行', '朝陽支行', '南京路支行', '中山支行', '上海支行']
  const bankCards = []
  const cardCount = 1 + Math.floor(Math.random() * 3)
  for (let i = 0; i < cardCount; i++) {
    bankCards.push({
      bank: banks[Math.floor(Math.random() * banks.length)] ?? '中國銀行',
      branch: branches[Math.floor(Math.random() * branches.length)] ?? '民生支行',
      accountNo: `****-****-****-${String(1000 + Math.floor(Math.random() * 9000))}`,
      holderName: names[Math.floor(Math.random() * names.length)] ?? '張三',
      status: Math.random() > 0.2 ? '已驗證' : '待驗證'
    })
  }

  // Generate operator notes
  const operators = ['admin_super', 'cs_jerry', 'op_linda', 'risk_mike']
  const noteContents = ['客訴投注問題已處理', '高風險帳戶，需關注', 'VIP會員，優先處理', '充值異常已核實', '帳戶正常使用', '已通知財務部門', '凍結原因：多帳號關聯', '解凍完成']
  const operatorNotes = []
  const noteCount = Math.floor(Math.random() * 5)
  for (let i = 0; i < noteCount; i++) {
    operatorNotes.push({
      operator: operators[Math.floor(Math.random() * operators.length)] ?? 'admin',
      time: generateRandomDate(),
      content: noteContents[Math.floor(Math.random() * noteContents.length)] ?? '備註內容'
    })
  }

  // Generate rollover data
  const requiredRollover = Math.floor(Math.random() * 100000) + 10000
  const currentRollover = Math.floor(Math.random() * requiredRollover)
  const rolloverProgress = Math.min(100, Math.floor((currentRollover / requiredRollover) * 100))

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
    security: {
      sameIpAccounts: Math.floor(Math.random() * 8),
      deviceFingerprint: `${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    },
    bankCards,
    operatorNotes,
    logs,
    finance: {
      totalDeposit: Math.floor(Math.random() * 500000) + 1000,
      totalWithdraw: Math.floor(Math.random() * 300000),
      totalProfit: Math.floor((Math.random() - 0.5) * 200000),
      manualAdd: Math.floor(Math.random() * 10000),
      manualDeduct: Math.floor(Math.random() * 5000),
      rolloverProgress,
      currentRollover,
      requiredRollover,
      recentTransactions: transactions
    },
    gaming: (() => {
      // Generate 25 betting records
      const gameNames = [
        { name: '百家樂', platform: '真人娛樂' },
        { name: '龍虎鬥', platform: '真人娛樂' },
        { name: '21點', platform: '真人娛樂' },
        { name: '輪盤', platform: '真人娛樂' },
        { name: '財神到', platform: '電子遊戲' },
        { name: '金龍獻瑞', platform: '電子遊戲' },
        { name: '水果樂園', platform: '電子遊戲' },
        { name: '狂野西部', platform: '電子遊戲' },
        { name: '瘋狂麻將', platform: '電子遊戲' },
        { name: '足球', platform: '體育投注' },
        { name: '籃球 NBA', platform: '體育投注' },
        { name: '網球', platform: '體育投注' },
        { name: '電競 LOL', platform: '體育投注' },
        { name: '時時彩', platform: '彩票遊戲' },
        { name: '快三', platform: '彩票遊戲' },
        { name: '六合彩', platform: '彩票遊戲' },
        { name: 'PK10', platform: '彩票遊戲' }
      ]
      const betStatuses = ['已結算', '已結算', '已結算', '已結算', '待開獎', '已撤單']

      const bettingRecords = []
      let liveBet = 0, slotsBet = 0, sportsBet = 0, lotteryBet = 0
      let totalBetAmt = 0, totalPayout = 0, totalValidBet = 0

      for (let i = 0; i < 25; i++) {
        const gameInfo = gameNames[Math.floor(Math.random() * gameNames.length)]!
        const betAmount = Math.floor(Math.random() * 10000) + 100
        const validBet = Math.floor(betAmount * (0.8 + Math.random() * 0.2))
        const status = betStatuses[Math.floor(Math.random() * betStatuses.length)]!
        let payout = 0, profit = 0
        
        if (status === '已結算') {
          const isWin = Math.random() > 0.45
          payout = isWin ? Math.floor(betAmount * (1 + Math.random() * 2)) : 0
          profit = payout - betAmount
          totalPayout += payout
        } else if (status === '待開獎') {
          profit = 0
        } else {
          profit = 0
        }

        totalBetAmt += betAmount
        totalValidBet += validBet

        // Track by category
        if (gameInfo.platform === '真人娛樂') liveBet += betAmount
        else if (gameInfo.platform === '電子遊戲') slotsBet += betAmount
        else if (gameInfo.platform === '體育投注') sportsBet += betAmount
        else lotteryBet += betAmount

        bettingRecords.push({
          orderId: `BET${Date.now().toString(36).toUpperCase()}${String(i).padStart(3, '0')}`,
          gameName: gameInfo.name,
          platform: gameInfo.platform,
          betTime: generateRandomDate(),
          betAmount,
          validBet,
          payout,
          profit,
          status
        })
      }

      // Sort by time desc
      bettingRecords.sort((a, b) => new Date(b.betTime).getTime() - new Date(a.betTime).getTime())

      const netProfit = totalPayout - totalBetAmt

      return {
        platforms: [
          { name: '真人娛樂', icon: 'pi pi-video text-purple-400', totalBet: liveBet, profit: Math.floor((Math.random() - 0.5) * (liveBet * 0.2)) },
          { name: '電子遊戲', icon: 'pi pi-star text-yellow-400', totalBet: slotsBet, profit: Math.floor((Math.random() - 0.5) * (slotsBet * 0.2)) },
          { name: '體育投注', icon: 'pi pi-flag text-green-400', totalBet: sportsBet, profit: Math.floor((Math.random() - 0.5) * (sportsBet * 0.2)) },
          { name: '彩票遊戲', icon: 'pi pi-ticket text-orange-400', totalBet: lotteryBet, profit: Math.floor((Math.random() - 0.5) * (lotteryBet * 0.2)) }
        ],
        profitTrend,
        totalBet: totalBetAmt,
        totalPayout,
        netProfit,
        validBet: totalValidBet,
        categoryDistribution: { live: liveBet, slots: slotsBet, sports: sportsBet, lottery: lotteryBet },
        bettingRecords
      }
    })()
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

// Category Doughnut Chart
const categoryChartData = computed(() => {
  const dist = memberDetail.value?.gaming.categoryDistribution ?? { live: 0, slots: 0, sports: 0, lottery: 0 }
  return {
    labels: ['真人娛樂', '電子遊戲', '體育投注', '彩票遊戲'],
    datasets: [{
      data: [dist.live, dist.slots, dist.sports, dist.lottery],
      backgroundColor: ['#a855f7', '#eab308', '#22c55e', '#f97316'],
      hoverBackgroundColor: ['#c084fc', '#facc15', '#4ade80', '#fb923c'],
      borderWidth: 0
    }]
  }
})

const categoryChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { color: chartColors.value.textColor, usePointStyle: true, padding: 15 }
    },
    tooltip: {
      backgroundColor: chartColors.value.tooltipBg,
      titleColor: chartColors.value.tooltipTitle,
      bodyColor: chartColors.value.tooltipBody,
      borderColor: chartColors.value.tooltipBorder,
      borderWidth: 1,
      callbacks: {
        label: (ctx: { parsed: number; label: string }) => `${ctx.label}: $${formatCurrency(ctx.parsed)}`
      }
    }
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
  filters.value = { nickname: '', loginIp: '', agentAccount: '', balanceMinText: '', balanceMaxText: '', balanceChangeDateRange: null, registrationDateRange: null, lastLoginDateRange: null, tags: [] }
  toast.add({ severity: 'info', summary: '已重置', detail: '所有搜尋條件已清空', life: 2000 })
}

const handleAddMember = () => {
  const newId = members.value.length > 0 ? Math.max(...members.value.map(m => m.id)) + 1 : 10010
  members.value.unshift({ id: newId, account: newMember.value.account, nickname: newMember.value.nickname, agent: newMember.value.agent, loginIp: '0.0.0.0', vip: newMember.value.vip, wallet: 0, status: 'active', statusText: '正常', registerDate: new Date().toISOString().split('T')[0] ?? '', lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19), memo: '', tags: [] })
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

/* 1. Calendar Component Style Adjustment */
:deep(.p-calendar .p-button) {
  background-color: #4b5563 !important; /* bg-surface-600 */
  border-color: #4b5563 !important;
  color: white !important;
  /* Ensure sufficient horizontal padding and no rigid width limit */
  padding-left: 0.75rem !important; /* px-3 */
  padding-right: 0.75rem !important; /* px-3 */
  width: auto !important; /* Allow auto width */
}


</style>
