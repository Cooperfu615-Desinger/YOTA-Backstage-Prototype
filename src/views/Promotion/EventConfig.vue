<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-gift text-blue-400"></i>
      <span class="text-surface-300">推廣活動</span>
      <span>></span>
      <span class="text-white font-medium">活動設置</span>
    </div>

    <!-- Template Selector -->
    <div class="grid grid-cols-4 gap-4">
        <div v-for="tpl in templates" :key="tpl.id" 
             @click="activeTemplate = tpl.id"
             :class="['p-4 rounded-xl border cursor-pointer transition-all flex flex-col items-center gap-2', 
                      activeTemplate === tpl.id ? 'bg-blue-500/20 border-blue-400' : 'bg-surface-800/50 border-surface-700 hover:border-surface-500']">
            <i :class="['pi text-2xl', tpl.icon, activeTemplate === tpl.id ? 'text-blue-400' : 'text-surface-400']"></i>
            <span :class="activeTemplate === tpl.id ? 'text-white font-bold' : 'text-surface-300'">{{ tpl.name }}</span>
        </div>
    </div>

    <!-- Main Config Form -->
    <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
             <div class="flex items-center gap-2 text-white text-lg">
                <i class="pi pi-cog text-blue-400"></i>
                參數配置 - {{ getCurrentTemplateName }}
            </div>
        </template>
        <template #content>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Basic Settings -->
                <div class="space-y-6">
                    <div class="flex flex-col gap-2">
                        <label class="text-surface-300 text-sm">活動名稱</label>
                        <InputText v-model="config.name" placeholder="請輸入活動名稱" class="w-full" />
                    </div>
                    
                    <div class="bg-surface-900 p-4 rounded border border-surface-700 space-y-4">
                        <div class="text-sm font-bold text-white mb-2 border-b border-surface-700 pb-2">出資佔比設定</div>
                        <div class="flex items-center gap-4">
                            <div class="flex-1">
                                <label class="text-surface-400 text-xs block mb-1">平台出資 %</label>
                                <div style="width: 100px">
                                    <InputNumber v-model="config.platformShare" :min="0" :max="100" suffix="%" class="w-full" inputClass="text-center" @input="updateAgentShare" />
                                </div>
                            </div>
                             <div class="flex-1">
                                <label class="text-surface-400 text-xs block mb-1">代理出資 %</label>
                                <div style="width: 100px">
                                    <InputNumber v-model="config.agentShare" :min="0" :max="100" suffix="%" class="w-full" inputClass="text-center" disabled />
                                </div>
                            </div>
                        </div>
                        <div class="text-xs text-surface-500">
                            * 總和必須為 100%，系統自動計算代理出資比例。
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label class="text-surface-300 text-sm">流水倍數設定</label>
                        <div style="width: 100px">
                             <InputNumber v-model="config.turnoverMulti" :min="1" :max="50" suffix="x" class="w-full" inputClass="text-center" />
                        </div>
                    </div>
                </div>

                <!-- Simulation & Rules -->
                <div class="space-y-6">
                     <div class="bg-surface-900 p-4 rounded border border-surface-700 space-y-4">
                        <div class="text-sm font-bold text-white mb-2 border-b border-surface-700 pb-2">流水計算模擬</div>
                         <div class="flex items-center justify-between text-sm">
                            <span class="text-surface-400">假設紅利金額</span>
                            <span class="text-white font-mono">1,000</span>
                        </div>
                        <div class="flex items-center justify-between text-sm">
                            <span class="text-surface-400">流水倍數</span>
                            <span class="text-blue-400 font-mono">x {{ config.turnoverMulti }}</span>
                        </div>
                         <div class="h-px bg-surface-700 my-2"></div>
                         <div class="flex items-center justify-between">
                            <span class="text-surface-300 font-bold">目標流水</span>
                            <span class="text-green-400 font-bold font-mono text-lg">{{ formatCurrency(1000 * config.turnoverMulti) }}</span>
                        </div>
                         <ProgressBar :value="50" class="h-2 mt-2" :showValue="false" />
                         <div class="text-xs text-surface-500 text-center">模擬進度條顯示</div>
                     </div>

                     <div class="flex justify-end pt-8">
                         <div class="flex gap-4">
                            <Button label="重置" severity="secondary" outlined icon="pi pi-refresh" />
                            <Button label="儲存配置" severity="success" icon="pi pi-save" @click="saveConfig" />
                         </div>
                     </div>
                </div>
            </div>
        </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import ProgressBar from 'primevue/progressbar'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const templates = [
    { id: 'first_deposit', name: '首存優惠', icon: 'pi-star-fill' },
    { id: 're_deposit', name: '續存優惠', icon: 'pi-refresh' },
    { id: 'rescue', name: '虧損救濟', icon: 'pi-heart-fill' },
    { id: 'rebate', name: '流水返利', icon: 'pi-money-bill' }
]

const activeTemplate = ref('first_deposit')

const config = ref({
    name: '新會員首存優惠',
    platformShare: 70,
    agentShare: 30,
    turnoverMulti: 15
})

const getCurrentTemplateName = computed(() => {
    return templates.find(t => t.id === activeTemplate.value)?.name || ''
})

const updateAgentShare = () => {
    if (config.value.platformShare > 100) config.value.platformShare = 100
    config.value.agentShare = 100 - config.value.platformShare
}

const saveConfig = () => {
    toast.add({ severity: 'success', summary: '儲存成功', detail: `${getCurrentTemplateName.value} 配置已更新`, life: 2000 })
}

const formatCurrency = (val: number) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(val)
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-inputnumber-input) { text-align: center; } /* Reinforce center align */
</style>
