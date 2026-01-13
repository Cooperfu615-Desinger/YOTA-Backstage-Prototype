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
              <Column field="sortOrder" header="排序權重" sortable style="width: 100px">
                <template #body="slotProps">
                  <span class="font-mono text-surface-600 dark:text-surface-300">{{ slotProps.data.sortOrder }}</span>
                </template>
              </Column>
              <Column field="icon" header="圖示" style="width: 80px">
                <template #body="slotProps">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="slotProps.data.cssClass || 'bg-gradient-to-br from-yellow-400 to-orange-500'">
                    <i :class="['text-white text-lg', slotProps.data.iconClass || 'pi pi-star-fill']"></i>
                  </div>
                </template>
              </Column>
              <Column field="name" header="等級名稱" sortable style="min-width: 140px">
                <template #body="slotProps">
                  <div class="flex flex-col">
                    <span class="font-semibold text-surface-900 dark:text-white">{{ slotProps.data.name }}</span>
                    <span class="text-xs text-surface-500 dark:text-surface-400">{{ slotProps.data.memberCount.toLocaleString() }} 位會員</span>
                  </div>
                </template>
              </Column>
              <Column field="enabled" header="狀態" style="width: 100px">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.enabled ? '啟用' : '停用'" :severity="slotProps.data.enabled ? 'success' : 'danger'" />
                </template>
              </Column>
              <Column field="updatedAt" header="最後修改" style="min-width: 160px">
                <template #body="slotProps">
                  <div class="flex flex-col">
                    <span class="text-surface-900 dark:text-white text-sm">{{ slotProps.data.updatedBy }}</span>
                    <span class="text-surface-500 dark:text-surface-400 text-xs">{{ slotProps.data.updatedAt }}</span>
                  </div>
                </template>
              </Column>
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
                <Column field="username" header="會員" style="width: 100px">
                  <template #body="slotProps">
                    <span class="font-medium text-blue-500 dark:text-blue-400">{{ slotProps.data.username }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
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

// ========================================
// Level Configuration State
// ========================================
const isLoading = ref(false)
const levels = ref<Array<{
  id: number
  name: string
  sortOrder: number
  iconClass: string
  cssClass: string
  enabled: boolean
  memberCount: number
  updatedBy: string
  updatedAt: string
}>>([])

// Generate mock levels
const generateMockLevels = () => {
  const levelData = [
    { name: 'VIP0', sortOrder: 0, icon: 'pi-star', css: 'bg-gradient-to-br from-gray-400 to-gray-600', members: 12500 },
    { name: 'VIP1', sortOrder: 1, icon: 'pi-star-fill', css: 'bg-gradient-to-br from-green-400 to-green-600', members: 8200 },
    { name: 'VIP2', sortOrder: 2, icon: 'pi-star-fill', css: 'bg-gradient-to-br from-blue-400 to-blue-600', members: 4500 },
    { name: 'VIP3', sortOrder: 3, icon: 'pi-star-fill', css: 'bg-gradient-to-br from-purple-400 to-purple-600', members: 1800 },
    { name: 'VIP4', sortOrder: 4, icon: 'pi-star-fill', css: 'bg-gradient-to-br from-yellow-400 to-orange-500', members: 650 },
    { name: 'VIP5', sortOrder: 5, icon: 'pi-crown', css: 'bg-gradient-to-br from-yellow-500 to-red-500', members: 120 },
    { name: 'SVIP', sortOrder: 10, icon: 'pi-crown', css: 'bg-gradient-to-br from-pink-500 to-purple-700', members: 25 }
  ]
  const operators = ['admin_super', 'op_linda', 'system']
  
  return levelData.map((level, idx) => ({
    id: 100 + idx,
    name: level.name,
    sortOrder: level.sortOrder,
    iconClass: level.icon,
    cssClass: level.css,
    enabled: true,
    memberCount: level.members,
    updatedBy: operators[Math.floor(Math.random() * operators.length)]!,
    updatedAt: generateRandomDate()
  }))
}

const generateRandomDate = () => {
  const now = new Date()
  const past30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const date = new Date(past30Days.getTime() + Math.random() * (now.getTime() - past30Days.getTime()))
  return date.toISOString().replace('T', ' ').substring(0, 16)
}

// Initialize mock data
levels.value = generateMockLevels()

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

const showEditorDialog = (mode: 'add' | 'edit', level?: typeof levels.value[0]) => {
  editorMode.value = mode
  if (mode === 'edit' && level) {
    Object.assign(editorData, {
      ...defaultEditorData,
      id: level.id,
      name: level.name,
      sortOrder: level.sortOrder,
      enabled: level.enabled,
      cssClass: level.cssClass,
      iconClass: level.iconClass
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
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
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
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
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

interface FoundMember {
  uid: string
  username: string
  currentLevel: string
  totalDeposit: number
  totalBet: number
  activeDays: number
  registerDate: string
}

const foundMember = ref<FoundMember | null>(null)

const adjustment = reactive({
  targetLevel: '',
  reason: '',
  password: ''
})

const levelOptions = levels.value.map(l => ({ label: l.name, value: l.name }))

const handleSearchMember = () => {
  if (!memberSearch.value.trim()) {
    toast.add({ severity: 'warn', summary: '請輸入帳號', detail: '請輸入要查詢的會員帳號', life: 2000 })
    return
  }
  
  isSearchingMember.value = true
  setTimeout(() => {
    // Mock found member
    foundMember.value = {
      uid: `U${Math.floor(Math.random() * 90000) + 10000}`,
      username: memberSearch.value,
      currentLevel: 'VIP2',
      totalDeposit: Math.floor(Math.random() * 500000) + 10000,
      totalBet: Math.floor(Math.random() * 2000000) + 50000,
      activeDays: Math.floor(Math.random() * 365) + 30,
      registerDate: '2024-03-15'
    }
    isSearchingMember.value = false
    toast.add({ severity: 'success', summary: '查詢成功', detail: `已找到會員: ${memberSearch.value}`, life: 2000 })
  }, 800)
}

const handleAdjustLevel = () => {
  isAdjusting.value = true
  setTimeout(() => {
    // Add to history
    adjustmentHistory.value.unshift({
      id: Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      username: foundMember.value!.username,
      fromLevel: foundMember.value!.currentLevel,
      toLevel: adjustment.targetLevel,
      reason: adjustment.reason,
      operator: 'current_user'
    })
    
    // Keep only last 10
    if (adjustmentHistory.value.length > 10) {
      adjustmentHistory.value = adjustmentHistory.value.slice(0, 10)
    }
    
    toast.add({ severity: 'success', summary: '調級成功', detail: `已將「${foundMember.value!.username}」調整為「${adjustment.targetLevel}」`, life: 3000 })
    
    // Reset
    foundMember.value = null
    memberSearch.value = ''
    adjustment.targetLevel = ''
    adjustment.reason = ''
    adjustment.password = ''
    isAdjusting.value = false
  }, 1000)
}

// ========================================
// Adjustment History
// ========================================
const adjustmentHistory = ref<Array<{
  id: number
  createdAt: string
  username: string
  fromLevel: string
  toLevel: string
  reason: string
  operator: string
}>>([
  { id: 1, createdAt: '2026-01-12 14:30', username: 'player_jack', fromLevel: 'VIP1', toLevel: 'VIP3', reason: '客訴補償 - 系統異常導致投注遺失', operator: 'cs_linda' },
  { id: 2, createdAt: '2026-01-11 10:15', username: 'highroller88', fromLevel: 'VIP3', toLevel: 'VIP5', reason: 'VIP 專案特殊邀請', operator: 'vip_manager' },
  { id: 3, createdAt: '2026-01-10 16:45', username: 'test_user01', fromLevel: 'VIP2', toLevel: 'VIP0', reason: '帳戶違規 - 套利行為', operator: 'risk_mike' },
  { id: 4, createdAt: '2026-01-09 09:20', username: 'lucky_star', fromLevel: 'VIP4', toLevel: 'SVIP', reason: '年度頂級玩家升級', operator: 'admin_super' },
  { id: 5, createdAt: '2026-01-08 11:30', username: 'newbie123', fromLevel: 'VIP0', toLevel: 'VIP1', reason: '新手禮遇計畫', operator: 'marketing_amy' }
])
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
:deep(.p-tabview .p-tabview-panels) { padding: 1rem 0; }
</style>
