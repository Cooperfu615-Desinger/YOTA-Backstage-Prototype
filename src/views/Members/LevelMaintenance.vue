<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-users text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">會員管理</span>
      <span>></span>
      <span class="text-surface-900 dark:text-white font-medium">等級維護</span>
    </div>

    <!-- Main TabView -->
    <TabView>
      <!-- Tab 1: 等級配置 Configuration -->
      <TabPanel value="0" header="等級配置">
        <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
          <template #title>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
                <i class="pi pi-star text-yellow-500"></i>
                VIP 等級列表
                <span class="text-sm text-surface-500 dark:text-surface-400 font-normal ml-2">(共 {{ levels.length }} 階)</span>
              </div>
              <Button label="新增等級" icon="pi pi-plus" severity="success" @click="showEditorDialog('add')" />
            </div>
          </template>
          <template #content>
            <DataTable 
              :value="levels" 
              :loading="isLoading" 
              stripedRows 
              sortField="sortOrder" 
              :sortOrder="1"
              class="p-datatable-sm"
              :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }"
            >
              <template #empty>
                <div class="flex flex-col items-center justify-center py-12 text-center">
                  <i class="pi pi-inbox text-5xl mb-3 text-surface-500 dark:text-surface-400"></i>
                  <p class="text-surface-500 dark:text-surface-400">暫無等級資料</p>
                </div>
              </template>
              <!-- Column: 等級識別 -->
              <Column header="等級識別" style="min-width: 180px">
                <template #body="slotProps">
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center shadow-md" :class="slotProps.data.cssClass">
                      <i :class="['text-white text-lg', slotProps.data.iconClass]"></i>
                    </div>
                    <div class="flex flex-col">
                      <span class="font-bold text-surface-900 dark:text-white">{{ slotProps.data.name }}</span>
                      <span class="text-xs text-surface-500 dark:text-surface-400">
                        排序: {{ slotProps.data.sortOrder }} · {{ slotProps.data.memberCount.toLocaleString() }} 人
                      </span>
                    </div>
                  </div>
                </template>
              </Column>
              <!-- Column: 晉升門檻 (Pivot) -->
              <Column header="晉升門檻" style="min-width: 180px">
                <template #body="slotProps">
                  <div class="flex flex-col gap-1 text-sm">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-wallet text-green-500 text-xs"></i>
                      <span class="text-surface-500 dark:text-surface-400">儲:</span>
                      <span class="font-medium text-green-500">${{ slotProps.data.promotion.depositThreshold.toLocaleString() }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-chart-line text-blue-500 text-xs"></i>
                      <span class="text-surface-500 dark:text-surface-400">投:</span>
                      <span class="font-medium text-blue-500">${{ slotProps.data.promotion.betThreshold.toLocaleString() }}</span>
                    </div>
                  </div>
                </template>
              </Column>
              <!-- Column: 保級門檻 (Pivot) -->
              <Column header="保級門檻" style="min-width: 180px">
                <template #body="slotProps">
                  <div v-if="slotProps.data.retention.unconditional" class="flex items-center gap-2">
                    <i class="pi pi-check-circle text-green-500"></i>
                    <span class="text-green-500 font-medium">無條件保級</span>
                  </div>
                  <div v-else class="flex flex-col gap-1 text-sm">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-wallet text-orange-500 text-xs"></i>
                      <span class="text-surface-500 dark:text-surface-400">儲:</span>
                      <span class="font-medium text-orange-500">${{ slotProps.data.retention.depositThreshold.toLocaleString() }}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-chart-line text-cyan-500 text-xs"></i>
                      <span class="text-surface-500 dark:text-surface-400">投:</span>
                      <span class="font-medium text-cyan-500">${{ slotProps.data.retention.betThreshold.toLocaleString() }}</span>
                    </div>
                  </div>
                </template>
              </Column>
              <!-- Column: 核心福利 (Pivot) -->
              <Column header="核心福利" style="min-width: 200px">
                <template #body="slotProps">
                  <div class="flex flex-col gap-1 text-sm">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-heart text-red-500 text-xs"></i>
                      <span class="text-surface-500 dark:text-surface-400">救濟:</span>
                      <span class="font-medium text-red-400">{{ slotProps.data.rewards.rescueRate }}%</span>
                      <span class="text-surface-400 text-xs">(上限 ${{ slotProps.data.rewards.rescueMaxAmount.toLocaleString() }})</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <i class="pi pi-calendar text-purple-500 text-xs"></i>
                      <span class="text-surface-500 dark:text-surface-400">月禮:</span>
                      <span class="font-medium text-purple-400">${{ slotProps.data.rewards.monthlyAllowance.toLocaleString() }}</span>
                    </div>
                  </div>
                </template>
              </Column>
              <!-- Column: 狀態 -->
              <Column field="enabled" header="狀態" style="width: 100px">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.enabled ? '啟用' : '停用'" :severity="slotProps.data.enabled ? 'success' : 'danger'" />
                </template>
              </Column>
              <!-- Column: 操作 -->
              <Column header="操作" style="width: 100px">
                <template #body="slotProps">
                  <Button icon="pi pi-pencil" severity="info" text rounded @click="showEditorDialog('edit', slotProps.data)" v-tooltip.top="'編輯'" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </TabPanel>

      <!-- Tab 2: 手動調級 Manual Adjustment -->
      <TabPanel value="1" header="手動調級">
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <!-- Left: Operation Panel -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
                <i class="pi pi-user-edit text-blue-500"></i>
                手動調整等級
              </div>
            </template>
            <template #content>
              <div class="space-y-6">
                <!-- Step 1: Member Lookup -->
                <div class="space-y-3">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">1</span>
                    <span class="font-medium text-surface-900 dark:text-white">查詢會員</span>
                  </div>
                  <div class="flex gap-3">
                    <InputText v-model="memberSearch" placeholder="輸入會員帳號" class="flex-1" />
                    <Button label="查詢" icon="pi pi-search" :loading="isSearchingMember" @click="handleSearchMember" />
                  </div>
                </div>

                <!-- Step 2: Member Card (Show after search) -->
                <div v-if="foundMember" class="space-y-3">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">2</span>
                    <span class="font-medium text-surface-900 dark:text-white">會員資訊</span>
                  </div>
                  <div class="p-4 rounded-lg bg-surface-100 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600">
                    <div class="flex items-center gap-4 mb-4">
                      <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <i class="pi pi-user text-white text-xl"></i>
                      </div>
                      <div>
                        <div class="font-semibold text-surface-900 dark:text-white">{{ foundMember.username }}</div>
                        <div class="text-sm text-surface-500 dark:text-surface-400">UID: {{ foundMember.uid }}</div>
                      </div>
                      <Tag :value="foundMember.currentLevel" severity="warn" class="ml-auto" />
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-sm">
                      <div class="flex justify-between">
                        <span class="text-surface-500 dark:text-surface-400">累計儲值:</span>
                        <span class="font-medium text-green-500">${{ foundMember.totalDeposit.toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-surface-500 dark:text-surface-400">累計投注:</span>
                        <span class="font-medium text-blue-500">${{ foundMember.totalBet.toLocaleString() }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-surface-500 dark:text-surface-400">活躍天數:</span>
                        <span class="font-medium text-surface-900 dark:text-white">{{ foundMember.activeDays }} 天</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-surface-500 dark:text-surface-400">註冊日期:</span>
                        <span class="font-medium text-surface-900 dark:text-white">{{ foundMember.registerDate }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 3: Adjustment Form -->
                <div v-if="foundMember" class="space-y-3">
                  <div class="flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">3</span>
                    <span class="font-medium text-surface-900 dark:text-white">調整設定</span>
                  </div>
                  <div class="space-y-4">
                    <div class="flex flex-col gap-2">
                      <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">調整後等級</label>
                      <Dropdown v-model="adjustment.targetLevel" :options="levelOptions" optionLabel="label" optionValue="value" placeholder="選擇目標等級" class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">調整原因 <span class="text-red-500">*</span></label>
                      <Textarea v-model="adjustment.reason" rows="3" placeholder="請詳細說明調整原因..." class="w-full" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">操作密碼 (選填)</label>
                      <Password v-model="adjustment.password" placeholder="輸入二次驗證密碼" :feedback="false" class="w-full" toggleMask />
                    </div>
                  </div>
                </div>

                <!-- Step 4: Confirm Button -->
                <div v-if="foundMember" class="pt-4 border-t border-surface-200 dark:border-surface-600">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="w-6 h-6 rounded-full bg-primary text-white text-sm flex items-center justify-center">4</span>
                    <span class="font-medium text-surface-900 dark:text-white">確認執行</span>
                  </div>
                  <Button 
                    label="確認調整" 
                    icon="pi pi-check" 
                    severity="success" 
                    class="w-full"
                    :disabled="!adjustment.targetLevel || !adjustment.reason"
                    :loading="isAdjusting"
                    @click="handleAdjustLevel"
                  />
                </div>
              </div>
            </template>
          </Card>

          <!-- Right: History Log -->
          <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <template #title>
              <div class="flex items-center gap-2 text-surface-900 dark:text-white text-lg">
                <i class="pi pi-history text-purple-500"></i>
                調級紀錄
                <span class="text-sm text-surface-500 dark:text-surface-400 font-normal">(最近 10 筆)</span>
              </div>
            </template>
            <template #content>
              <DataTable 
                :value="adjustmentHistory" 
                stripedRows 
                class="p-datatable-sm"
                :pt="{ table: { class: 'min-w-full' }, tbody: { class: 'text-surface-700 dark:text-surface-300' } }"
              >
                <template #empty>
                  <div class="flex flex-col items-center justify-center py-8 text-center">
                    <i class="pi pi-inbox text-4xl mb-2 text-surface-500 dark:text-surface-400"></i>
                    <p class="text-surface-500 dark:text-surface-400 text-sm">暫無調級紀錄</p>
                  </div>
                </template>
                <Column field="createdAt" header="時間" style="width: 140px">
                  <template #body="slotProps">
                    <span class="text-xs text-surface-600 dark:text-surface-300">{{ slotProps.data.createdAt }}</span>
                  </template>
                </Column>
                <!-- Column: 會員 (Quick View Link) -->
                <Column field="username" header="會員" style="width: 120px">
                  <template #body="slotProps">
                    <Button 
                      :label="slotProps.data.username" 
                      link 
                      class="p-0 text-blue-500 dark:text-blue-400 font-medium hover:underline"
                      @click="showMemberQuickView(slotProps.data)"
                    />
                  </template>
                </Column>
                <Column header="等級變更" style="min-width: 140px">
                  <template #body="slotProps">
                    <div class="flex items-center gap-2">
                      <Tag :value="slotProps.data.fromLevel" severity="secondary" size="small" />
                      <i class="pi pi-arrow-right text-xs text-surface-400"></i>
                      <Tag :value="slotProps.data.toLevel" severity="success" size="small" />
                    </div>
                  </template>
                </Column>
                <Column field="reason" header="原因" style="min-width: 150px">
                  <template #body="slotProps">
                    <span class="text-xs text-surface-500 dark:text-surface-400 line-clamp-2">{{ slotProps.data.reason }}</span>
                  </template>
                </Column>
                <Column field="operator" header="操作員" style="width: 100px">
                  <template #body="slotProps">
                    <span class="text-xs text-surface-600 dark:text-surface-300">{{ slotProps.data.operator }}</span>
                  </template>
                </Column>
              </DataTable>
            </template>
          </Card>
        </div>
      </TabPanel>
    </TabView>

    <!-- Editor Dialog -->
    <Dialog v-model:visible="editorVisible" :header="editorMode === 'add' ? '新增等級' : '編輯等級'" modal :style="{ width: '800px' }">
      <TabView>
        <!-- Tab A: 基礎設定 Basics -->
        <TabPanel value="0" header="基礎設定">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">等級名稱 <span class="text-red-500">*</span></label>
              <InputText v-model="editorData.name" placeholder="例如: VIP1" class="w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">排序權重</label>
              <InputNumber v-model="editorData.sortOrder" :min="0" :max="999" placeholder="0" class="w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">狀態</label>
              <Dropdown v-model="editorData.enabled" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="選擇狀態" class="w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">CSS 樣式類名 (選填)</label>
              <InputText v-model="editorData.cssClass" placeholder="例如: bg-gradient-to-br from-yellow-400 to-orange-500" class="w-full" />
            </div>
            <div class="flex flex-col gap-2 col-span-2">
              <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">等級圖示</label>
              <FileUpload 
                mode="basic" 
                accept="image/*" 
                :maxFileSize="1000000" 
                chooseLabel="選擇圖片"
                class="w-full"
              />
            </div>
          </div>
          <Divider />
          <div class="space-y-4">
            <div class="flex flex-col gap-2">
              <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">晉升任務描述</label>
              <Textarea v-model="editorData.promotionDesc" rows="2" placeholder="描述如何達成此等級..." class="w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">常規獎勵描述</label>
              <Textarea v-model="editorData.regularRewardDesc" rows="2" placeholder="描述每週/每月可領取的獎勵..." class="w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">首次獎勵描述</label>
              <Textarea v-model="editorData.firstRewardDesc" rows="2" placeholder="描述首次達成此等級可獲得的獎勵..." class="w-full" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">保級條件描述</label>
              <Textarea v-model="editorData.retentionDesc" rows="2" placeholder="描述維持此等級所需的條件..." class="w-full" />
            </div>
          </div>
        </TabPanel>

        <!-- Tab B: 晉升門檻 Promotion Rules -->
        <TabPanel value="1" header="晉升門檻">
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">統計區間</label>
                <Dropdown v-model="editorData.promotion.period" :options="periodOptions" optionLabel="label" optionValue="value" placeholder="選擇區間" class="w-full" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">條件邏輯</label>
                <div class="flex gap-4 mt-2">
                  <div class="flex items-center gap-2">
                    <RadioButton v-model="editorData.promotion.logic" value="all" inputId="promo-all" />
                    <label for="promo-all" class="text-surface-700 dark:text-surface-300">滿足全部</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioButton v-model="editorData.promotion.logic" value="any" inputId="promo-any" />
                    <label for="promo-any" class="text-surface-700 dark:text-surface-300">滿足任一</label>
                  </div>
                </div>
              </div>
            </div>
            <Divider />
            <div class="grid grid-cols-3 gap-4">
              <div class="flex flex-col gap-2">
                <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">累計儲值門檻</label>
                <InputNumber v-model="editorData.promotion.depositThreshold" :min="0" mode="currency" currency="USD" locale="en-US" placeholder="0" class="w-full" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">有效投注門檻</label>
                <InputNumber v-model="editorData.promotion.betThreshold" :min="0" mode="currency" currency="USD" locale="en-US" placeholder="0" class="w-full" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">活躍天數門檻</label>
                <InputNumber v-model="editorData.promotion.activeDaysThreshold" :min="0" suffix=" 天" placeholder="0" class="w-full" />
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Tab C: 保級機制 Retention Rules -->
        <TabPanel value="2" header="保級機制">
          <div class="space-y-6">
            <div class="flex items-center gap-3 p-4 rounded-lg bg-surface-100 dark:bg-surface-700/50">
              <Checkbox v-model="editorData.retention.unconditional" :binary="true" inputId="unconditional" />
              <label for="unconditional" class="text-surface-900 dark:text-white font-medium">無條件保級</label>
              <span class="text-surface-500 dark:text-surface-400 text-sm">(勾選後將不檢查以下保級條件)</span>
            </div>
            
            <div v-if="!editorData.retention.unconditional" class="space-y-6">
              <div class="flex flex-col gap-2">
                <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">條件邏輯</label>
                <div class="flex gap-4">
                  <div class="flex items-center gap-2">
                    <RadioButton v-model="editorData.retention.logic" value="all" inputId="retention-all" />
                    <label for="retention-all" class="text-surface-700 dark:text-surface-300">滿足全部</label>
                  </div>
                  <div class="flex items-center gap-2">
                    <RadioButton v-model="editorData.retention.logic" value="any" inputId="retention-any" />
                    <label for="retention-any" class="text-surface-700 dark:text-surface-300">滿足任一</label>
                  </div>
                </div>
              </div>
              <Divider />
              <div class="grid grid-cols-3 gap-4">
                <div class="flex flex-col gap-2">
                  <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">保級儲值門檻</label>
                  <InputNumber v-model="editorData.retention.depositThreshold" :min="0" mode="currency" currency="USD" locale="en-US" placeholder="0" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">保級投注門檻</label>
                  <InputNumber v-model="editorData.retention.betThreshold" :min="0" mode="currency" currency="USD" locale="en-US" placeholder="0" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">保級活躍天數</label>
                  <InputNumber v-model="editorData.retention.activeDaysThreshold" :min="0" suffix=" 天" placeholder="0" class="w-full" />
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Tab D: 獎勵福利 Rewards -->
        <TabPanel value="3" header="獎勵福利">
          <div class="space-y-6">
            <!-- Fixed Allowance -->
            <div>
              <h4 class="text-surface-900 dark:text-white font-medium mb-4 flex items-center gap-2">
                <i class="pi pi-calendar text-blue-500"></i>
                固定津貼
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">每月零用金</label>
                  <InputNumber v-model="editorData.rewards.monthlyAllowance" :min="0" mode="currency" currency="USD" locale="en-US" placeholder="0" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">每週零用金</label>
                  <InputNumber v-model="editorData.rewards.weeklyAllowance" :min="0" mode="currency" currency="USD" locale="en-US" placeholder="0" class="w-full" />
                </div>
              </div>
            </div>
            <Divider />
            <!-- One-time Rewards -->
            <div>
              <h4 class="text-surface-900 dark:text-white font-medium mb-4 flex items-center gap-2">
                <i class="pi pi-gift text-green-500"></i>
                一次性獎勵
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">生日禮金</label>
                  <InputNumber v-model="editorData.rewards.birthdayBonus" :min="0" mode="currency" currency="USD" locale="en-US" placeholder="0" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">首次晉升獎勵金</label>
                  <InputNumber v-model="editorData.rewards.firstPromotionBonus" :min="0" mode="currency" currency="USD" locale="en-US" placeholder="0" class="w-full" />
                </div>
              </div>
            </div>
            <Divider />
            <!-- Rescue/Comfort Fund -->
            <div>
              <h4 class="text-surface-900 dark:text-white font-medium mb-4 flex items-center gap-2">
                <i class="pi pi-heart text-red-500"></i>
                救援金 (安慰金)
              </h4>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-2">
                  <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">救援金比例</label>
                  <InputNumber v-model="editorData.rewards.rescueRate" :min="0" :max="100" suffix="%" placeholder="0" class="w-full" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-surface-900 dark:text-surface-0 text-sm font-medium">救援金上限</label>
                  <InputNumber v-model="editorData.rewards.rescueMaxAmount" :min="0" mode="currency" currency="USD" locale="en-US" placeholder="0" class="w-full" />
                  <small class="text-surface-500 dark:text-surface-400">風控用途：防止大額誤發</small>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
      <template #footer>
        <Button label="取消" severity="secondary" @click="editorVisible = false" />
        <Button :label="editorMode === 'add' ? '新增' : '儲存'" icon="pi pi-check" @click="handleSaveLevel" :disabled="!editorData.name" />
      </template>
    </Dialog>

    <!-- Member Quick View Dialog -->
    <Dialog v-model:visible="memberQuickViewVisible" header="會員概況" modal :style="{ width: '480px' }">
      <div v-if="quickViewMember" class="space-y-6">
        <!-- Member Header -->
        <div class="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-surface-200 dark:border-surface-600">
          <div class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <i class="pi pi-user text-white text-2xl"></i>
          </div>
          <div class="flex-1">
            <div class="font-bold text-lg text-surface-900 dark:text-white">{{ quickViewMember.username }}</div>
            <div class="text-sm text-surface-500 dark:text-surface-400">UID: {{ quickViewMember.uid }}</div>
            <Tag :value="quickViewMember.currentLevel" :severity="getLevelSeverity(quickViewMember.currentLevel)" class="mt-1" />
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div class="p-4 rounded-lg bg-surface-100 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600">
            <div class="flex items-center gap-2 mb-2">
              <i class="pi pi-wallet text-green-500"></i>
              <span class="text-sm text-surface-500 dark:text-surface-400">目前餘額</span>
            </div>
            <div class="text-xl font-bold text-green-500">${{ quickViewMember.balance.toLocaleString() }}</div>
          </div>
          <div class="p-4 rounded-lg bg-surface-100 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600">
            <div class="flex items-center gap-2 mb-2">
              <i class="pi pi-arrow-up text-blue-500"></i>
              <span class="text-sm text-surface-500 dark:text-surface-400">總儲值</span>
            </div>
            <div class="text-xl font-bold text-blue-500">${{ quickViewMember.totalDeposit.toLocaleString() }}</div>
          </div>
          <div class="p-4 rounded-lg bg-surface-100 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600">
            <div class="flex items-center gap-2 mb-2">
              <i class="pi pi-chart-line text-purple-500"></i>
              <span class="text-sm text-surface-500 dark:text-surface-400">總投注</span>
            </div>
            <div class="text-xl font-bold text-purple-500">${{ quickViewMember.totalBet.toLocaleString() }}</div>
          </div>
          <div class="p-4 rounded-lg bg-surface-100 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600">
            <div class="flex items-center gap-2 mb-2">
              <i class="pi pi-calendar text-orange-500"></i>
              <span class="text-sm text-surface-500 dark:text-surface-400">註冊日期</span>
            </div>
            <div class="text-lg font-bold text-surface-900 dark:text-white">{{ quickViewMember.registerDate }}</div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="flex items-center justify-between p-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600">
          <span class="text-surface-500 dark:text-surface-400">活躍天數</span>
          <span class="font-bold text-surface-900 dark:text-white">{{ quickViewMember.activeDays }} 天</span>
        </div>
      </div>
      <template #footer>
        <Button label="關閉" severity="secondary" @click="memberQuickViewVisible = false" />
        <Button label="查看完整資料" icon="pi pi-external-link" @click="goToMemberDetail" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Password from 'primevue/password'
import FileUpload from 'primevue/fileupload'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import Divider from 'primevue/divider'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const router = useRouter()

// ========================================
// Level Data Types
// ========================================
interface LevelData {
  id: number
  name: string
  sortOrder: number
  iconClass: string
  cssClass: string
  enabled: boolean
  memberCount: number
  updatedBy: string
  updatedAt: string
  promotion: {
    period: string
    logic: string
    depositThreshold: number
    betThreshold: number
    activeDaysThreshold: number
  }
  retention: {
    unconditional: boolean
    logic: string
    depositThreshold: number
    betThreshold: number
    activeDaysThreshold: number
  }
  rewards: {
    monthlyAllowance: number
    weeklyAllowance: number
    birthdayBonus: number
    firstPromotionBonus: number
    rescueRate: number
    rescueMaxAmount: number
  }
}

// ========================================
// Level Configuration State
// ========================================
const isLoading = ref(false)
const levels = ref<LevelData[]>([])

// Generate VIP0 ~ VIP10 mock data with logical progression
const generateVIPLevels = (): LevelData[] => {
  const levelConfigs = [
    { name: 'VIP0', sort: 0, icon: 'pi-star', css: 'bg-gradient-to-br from-gray-400 to-gray-600', members: 25000, deposit: 0, bet: 0, retDeposit: 0, retBet: 0, unconditional: true, rescue: 0, rescueMax: 0, monthly: 0, weekly: 0, birthday: 0, firstBonus: 0 },
    { name: 'VIP1', sort: 1, icon: 'pi-star-fill', css: 'bg-gradient-to-br from-green-400 to-green-600', members: 12000, deposit: 1000, bet: 5000, retDeposit: 500, retBet: 2500, unconditional: false, rescue: 0.5, rescueMax: 100, monthly: 50, weekly: 10, birthday: 50, firstBonus: 88 },
    { name: 'VIP2', sort: 2, icon: 'pi-star-fill', css: 'bg-gradient-to-br from-teal-400 to-teal-600', members: 8500, deposit: 5000, bet: 25000, retDeposit: 2000, retBet: 10000, unconditional: false, rescue: 1, rescueMax: 300, monthly: 100, weekly: 20, birthday: 100, firstBonus: 188 },
    { name: 'VIP3', sort: 3, icon: 'pi-star-fill', css: 'bg-gradient-to-br from-blue-400 to-blue-600', members: 5200, deposit: 15000, bet: 75000, retDeposit: 5000, retBet: 25000, unconditional: false, rescue: 1.5, rescueMax: 500, monthly: 200, weekly: 40, birthday: 200, firstBonus: 388 },
    { name: 'VIP4', sort: 4, icon: 'pi-star-fill', css: 'bg-gradient-to-br from-indigo-400 to-indigo-600', members: 3100, deposit: 30000, bet: 150000, retDeposit: 10000, retBet: 50000, unconditional: false, rescue: 2, rescueMax: 800, monthly: 350, weekly: 70, birthday: 350, firstBonus: 588 },
    { name: 'VIP5', sort: 5, icon: 'pi-star-fill', css: 'bg-gradient-to-br from-purple-400 to-purple-600', members: 1800, deposit: 60000, bet: 300000, retDeposit: 20000, retBet: 100000, unconditional: false, rescue: 2.5, rescueMax: 1200, monthly: 500, weekly: 100, birthday: 500, firstBonus: 888 },
    { name: 'VIP6', sort: 6, icon: 'pi-crown', css: 'bg-gradient-to-br from-pink-400 to-pink-600', members: 920, deposit: 100000, bet: 500000, retDeposit: 35000, retBet: 175000, unconditional: false, rescue: 3, rescueMax: 1800, monthly: 800, weekly: 150, birthday: 800, firstBonus: 1288 },
    { name: 'VIP7', sort: 7, icon: 'pi-crown', css: 'bg-gradient-to-br from-orange-400 to-orange-600', members: 480, deposit: 180000, bet: 900000, retDeposit: 60000, retBet: 300000, unconditional: false, rescue: 3.5, rescueMax: 2500, monthly: 1200, weekly: 250, birthday: 1200, firstBonus: 1888 },
    { name: 'VIP8', sort: 8, icon: 'pi-crown', css: 'bg-gradient-to-br from-yellow-400 to-yellow-600', members: 210, deposit: 300000, bet: 1500000, retDeposit: 100000, retBet: 500000, unconditional: false, rescue: 4, rescueMax: 3500, monthly: 1800, weekly: 400, birthday: 1800, firstBonus: 2888 },
    { name: 'VIP9', sort: 9, icon: 'pi-crown', css: 'bg-gradient-to-br from-amber-500 to-red-500', members: 85, deposit: 500000, bet: 2500000, retDeposit: 150000, retBet: 800000, unconditional: false, rescue: 4.5, rescueMax: 5000, monthly: 2800, weekly: 600, birthday: 2800, firstBonus: 3888 },
    { name: 'VIP10', sort: 10, icon: 'pi-crown', css: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-amber-600', members: 32, deposit: 1000000, bet: 5000000, retDeposit: 300000, retBet: 1500000, unconditional: false, rescue: 5, rescueMax: 10000, monthly: 5000, weekly: 1000, birthday: 5000, firstBonus: 8888 }
  ]

  const operators = ['admin_super', 'op_linda', 'system']

  return levelConfigs.map((cfg, idx) => ({
    id: 100 + idx,
    name: cfg.name,
    sortOrder: cfg.sort,
    iconClass: cfg.icon,
    cssClass: cfg.css,
    enabled: true,
    memberCount: cfg.members,
    updatedBy: operators[idx % operators.length]!,
    updatedAt: generateRandomDate(),
    promotion: {
      period: 'month',
      logic: 'all',
      depositThreshold: cfg.deposit,
      betThreshold: cfg.bet,
      activeDaysThreshold: Math.floor(cfg.sort * 3)
    },
    retention: {
      unconditional: cfg.unconditional,
      logic: 'all',
      depositThreshold: cfg.retDeposit,
      betThreshold: cfg.retBet,
      activeDaysThreshold: Math.floor(cfg.sort * 2)
    },
    rewards: {
      monthlyAllowance: cfg.monthly,
      weeklyAllowance: cfg.weekly,
      birthdayBonus: cfg.birthday,
      firstPromotionBonus: cfg.firstBonus,
      rescueRate: cfg.rescue,
      rescueMaxAmount: cfg.rescueMax
    }
  }))
}

const generateRandomDate = () => {
  const now = new Date()
  const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const date = new Date(past30Days.getTime() + Math.random() * (now.getTime() - past30Days.getTime()))
  return date.toISOString().replace('T', ' ').substring(0, 16)
}

// Initialize VIP0-VIP10 data
levels.value = generateVIPLevels()

// ========================================
// Editor Dialog State
// ========================================
const editorVisible = ref(false)
const editorMode = ref<'add' | 'edit'>('add')

const defaultEditorData = {
  id: null as number | null,
  name: '',
  sortOrder: 0,
  enabled: true,
  cssClass: '',
  iconClass: 'pi-star-fill',
  promotionDesc: '',
  regularRewardDesc: '',
  firstRewardDesc: '',
  retentionDesc: '',
  promotion: {
    period: 'month',
    logic: 'all',
    depositThreshold: 0,
    betThreshold: 0,
    activeDaysThreshold: 0
  },
  retention: {
    unconditional: false,
    logic: 'all',
    depositThreshold: 0,
    betThreshold: 0,
    activeDaysThreshold: 0
  },
  rewards: {
    monthlyAllowance: 0,
    weeklyAllowance: 0,
    birthdayBonus: 0,
    firstPromotionBonus: 0,
    rescueRate: 0,
    rescueMaxAmount: 0
  }
}

const editorData = reactive({ ...defaultEditorData })

const statusOptions = [
  { label: '啟用', value: true },
  { label: '停用', value: false }
]

const periodOptions = [
  { label: '每週', value: 'week' },
  { label: '每月', value: 'month' },
  { label: '每季', value: 'quarter' }
]

const showEditorDialog = (mode: 'add' | 'edit', level?: LevelData) => {
  editorMode.value = mode
  if (mode === 'edit' && level) {
    Object.assign(editorData, {
      ...defaultEditorData,
      id: level.id,
      name: level.name,
      sortOrder: level.sortOrder,
      enabled: level.enabled,
      cssClass: level.cssClass,
      iconClass: level.iconClass,
      promotion: { ...level.promotion },
      retention: { ...level.retention },
      rewards: { ...level.rewards }
    })
  } else {
    Object.assign(editorData, { ...defaultEditorData })
  }
  editorVisible.value = true
}

const handleSaveLevel = () => {
  if (editorMode.value === 'add') {
    const newId = Math.max(...levels.value.map(l => l.id)) + 1
    levels.value.push({
      id: newId,
      name: editorData.name,
      sortOrder: editorData.sortOrder,
      iconClass: editorData.iconClass,
      cssClass: editorData.cssClass || 'bg-gradient-to-br from-blue-400 to-blue-600',
      enabled: editorData.enabled,
      memberCount: 0,
      updatedBy: 'current_user',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      promotion: { ...editorData.promotion },
      retention: { ...editorData.retention },
      rewards: { ...editorData.rewards }
    })
    toast.add({ severity: 'success', summary: '新增成功', detail: `等級「${editorData.name}」已建立`, life: 3000 })
  } else {
    const idx = levels.value.findIndex(l => l.id === editorData.id)
    if (idx !== -1) {
      levels.value[idx] = {
        ...levels.value[idx]!,
        name: editorData.name,
        sortOrder: editorData.sortOrder,
        enabled: editorData.enabled,
        cssClass: editorData.cssClass,
        iconClass: editorData.iconClass,
        updatedBy: 'current_user',
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        promotion: { ...editorData.promotion },
        retention: { ...editorData.retention },
        rewards: { ...editorData.rewards }
      }
      toast.add({ severity: 'success', summary: '儲存成功', detail: `等級「${editorData.name}」已更新`, life: 3000 })
    }
  }
  editorVisible.value = false
}

// ========================================
// Manual Adjustment State
// ========================================
const memberSearch = ref('')
const isSearchingMember = ref(false)
const isAdjusting = ref(false)

interface MemberData {
  uid: string
  username: string
  currentLevel: string
  totalDeposit: number
  totalBet: number
  activeDays: number
  registerDate: string
  balance: number
}

const foundMember = ref<MemberData | null>(null)

const adjustment = reactive({
  targetLevel: '',
  reason: '',
  password: ''
})

const levelOptions = computed(() => levels.value.map(l => ({ label: l.name, value: l.name })))

const handleSearchMember = () => {
  if (!memberSearch.value.trim()) {
    toast.add({ severity: 'warn', summary: '請輸入帳號', detail: '請輸入要查詢的會員帳號', life: 2000 })
    return
  }
  
  isSearchingMember.value = true
  setTimeout(() => {
    foundMember.value = {
      uid: `U${Math.floor(Math.random() * 90000) + 10000}`,
      username: memberSearch.value,
      currentLevel: ['VIP0', 'VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5'][Math.floor(Math.random() * 6)]!,
      totalDeposit: Math.floor(Math.random() * 500000) + 10000,
      totalBet: Math.floor(Math.random() * 2000000) + 50000,
      activeDays: Math.floor(Math.random() * 365) + 30,
      registerDate: '2024-03-15',
      balance: Math.floor(Math.random() * 50000) + 1000
    }
    isSearchingMember.value = false
    toast.add({ severity: 'success', summary: '查詢成功', detail: `已找到會員: ${memberSearch.value}`, life: 2000 })
  }, 800)
}

const handleAdjustLevel = () => {
  isAdjusting.value = true
  setTimeout(() => {
    adjustmentHistory.value.unshift({
      id: Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      username: foundMember.value!.username,
      uid: foundMember.value!.uid,
      fromLevel: foundMember.value!.currentLevel,
      toLevel: adjustment.targetLevel,
      reason: adjustment.reason,
      operator: 'current_user',
      totalDeposit: foundMember.value!.totalDeposit,
      totalBet: foundMember.value!.totalBet,
      balance: foundMember.value!.balance,
      activeDays: foundMember.value!.activeDays,
      registerDate: foundMember.value!.registerDate
    })
    
    if (adjustmentHistory.value.length > 10) {
      adjustmentHistory.value = adjustmentHistory.value.slice(0, 10)
    }
    
    toast.add({ severity: 'success', summary: '調級成功', detail: `已將「${foundMember.value!.username}」調整為「${adjustment.targetLevel}」`, life: 3000 })
    
    foundMember.value = null
    memberSearch.value = ''
    adjustment.targetLevel = ''
    adjustment.reason = ''
    adjustment.password = ''
    isAdjusting.value = false
  }, 1000)
}

// ========================================
// Adjustment History with Enhanced Data
// ========================================
interface AdjustmentRecord {
  id: number
  createdAt: string
  username: string
  uid: string
  fromLevel: string
  toLevel: string
  reason: string
  operator: string
  totalDeposit: number
  totalBet: number
  balance: number
  activeDays: number
  registerDate: string
}

const adjustmentHistory = ref<AdjustmentRecord[]>([
  { id: 1, createdAt: '2026-01-12 14:30', username: 'player_jack', uid: 'U58231', fromLevel: 'VIP1', toLevel: 'VIP3', reason: '客訴補償 - 系統異常導致投注遺失', operator: 'cs_linda', totalDeposit: 85000, totalBet: 420000, balance: 12500, activeDays: 180, registerDate: '2024-06-15' },
  { id: 2, createdAt: '2026-01-11 10:15', username: 'highroller88', uid: 'U42819', fromLevel: 'VIP3', toLevel: 'VIP5', reason: 'VIP 專案特殊邀請', operator: 'vip_manager', totalDeposit: 250000, totalBet: 1200000, balance: 45000, activeDays: 320, registerDate: '2023-12-01' },
  { id: 3, createdAt: '2026-01-10 16:45', username: 'test_user01', uid: 'U71923', fromLevel: 'VIP2', toLevel: 'VIP0', reason: '帳戶違規 - 套利行為', operator: 'risk_mike', totalDeposit: 15000, totalBet: 78000, balance: 230, activeDays: 45, registerDate: '2025-09-20' },
  { id: 4, createdAt: '2026-01-09 09:20', username: 'lucky_star', uid: 'U33847', fromLevel: 'VIP4', toLevel: 'VIP6', reason: '年度頂級玩家升級', operator: 'admin_super', totalDeposit: 180000, totalBet: 890000, balance: 28000, activeDays: 410, registerDate: '2023-08-10' },
  { id: 5, createdAt: '2026-01-08 11:30', username: 'newbie123', uid: 'U92841', fromLevel: 'VIP0', toLevel: 'VIP1', reason: '新手禮遇計畫', operator: 'marketing_amy', totalDeposit: 2500, totalBet: 12000, balance: 850, activeDays: 15, registerDate: '2025-12-28' }
])

// ========================================
// Member Quick View
// ========================================
const memberQuickViewVisible = ref(false)
const quickViewMember = ref<{
  username: string
  uid: string
  currentLevel: string
  balance: number
  totalDeposit: number
  totalBet: number
  activeDays: number
  registerDate: string
} | null>(null)

const showMemberQuickView = (record: AdjustmentRecord) => {
  quickViewMember.value = {
    username: record.username,
    uid: record.uid,
    currentLevel: record.toLevel,
    balance: record.balance,
    totalDeposit: record.totalDeposit,
    totalBet: record.totalBet,
    activeDays: record.activeDays,
    registerDate: record.registerDate
  }
  memberQuickViewVisible.value = true
}

const getLevelSeverity = (level: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' => {
  const num = parseInt(level.replace('VIP', ''))
  if (num >= 8) return 'danger'
  if (num >= 5) return 'warn'
  if (num >= 2) return 'info'
  return 'secondary'
}

const goToMemberDetail = () => {
  memberQuickViewVisible.value = false
  router.push('/members/list')
  toast.add({ severity: 'info', summary: '導航提示', detail: '已導航至會員列表，請搜尋該會員查看完整資料', life: 3000 })
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
:deep(.p-tabview .p-tabview-panels) { padding: 1rem 0; }
</style>
