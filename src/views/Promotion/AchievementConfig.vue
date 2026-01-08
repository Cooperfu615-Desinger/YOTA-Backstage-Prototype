<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-gift text-blue-400"></i>
      <span class="text-surface-300">推廣活動</span>
      <span>></span>
      <span class="text-white font-medium">成就設置</span>
    </div>

    <!-- Sign-in Settings -->
    <Card class="bg-surface-800/50 border border-surface-700">
        <template #title>
             <div class="flex items-center gap-2 text-white text-lg">
                <i class="pi pi-calendar text-blue-400"></i>
                每日簽到配置
            </div>
        </template>
        <template #content>
            <div class="flex gap-4 overflow-x-auto pb-4">
                <div v-for="(day, index) in signInConfig" :key="index" class="min-w-[120px] bg-surface-900 p-3 rounded border border-surface-700 flex flex-col items-center gap-2">
                    <span class="text-surface-400 text-sm">第 {{ index + 1 }} 天</span>
                    <i class="pi pi-gift text-yellow-400 text-xl"></i>
                    <div style="width: 80px">
                        <InputNumber v-model="day.reward" :min="0" class="w-full" inputClass="text-center text-sm" placeholder="獎勵" />
                    </div>
                </div>
            </div>
        </template>
    </Card>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Point Exchange -->
        <Card class="bg-surface-800/50 border border-surface-700">
             <template #title>
                 <div class="flex items-center gap-2 text-white text-lg">
                    <i class="pi pi-wallet text-green-400"></i>
                    積分兌換設定
                </div>
            </template>
            <template #content>
                <div class="flex items-center justify-between bg-surface-900 p-4 rounded border border-surface-700">
                    <div class="flex flex-col">
                        <span class="text-surface-300 font-bold mb-1">積分匯率 (Point Rate)</span>
                        <span class="text-xs text-surface-500">每 100 積分可兌換的現金金額</span>
                    </div>
                    <div style="width: 120px">
                        <InputNumber v-model="pointRate" mode="currency" currency="TWD" locale="zh-TW" class="w-full" inputClass="text-center" />
                    </div>
                </div>
            </template>
        </Card>

        <!-- Lottery Config -->
        <Card class="bg-surface-800/50 border border-surface-700">
             <template #title>
                 <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2 text-white text-lg">
                        <i class="pi pi-ticket text-purple-400"></i>
                        幸運轉盤獎項 (總機率: {{ totalProbability }}%)
                    </div>
                     <Button icon="pi pi-plus" size="small" rounded severity="primary" @click="addLotteryItem" />
                 </div>
            </template>
            <template #content>
                <div class="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    <div v-for="(item, index) in lotteryItems" :key="index" class="flex items-center gap-2 bg-surface-900 p-2 rounded">
                        <InputText v-model="item.name" placeholder="獎項名稱" class="flex-1 p-inputtext-sm" />
                        <div style="width: 100px">
                             <InputNumber v-model="item.probability" :min="0" :max="100" suffix="%" class="w-full" inputClass="text-center p-inputtext-sm" placeholder="機率" />
                        </div>
                         <!-- Isolated Delete Button -->
                        <Button icon="pi pi-trash" text severity="danger" rounded size="small" @click="removeLotteryItem(index)" />
                    </div>
                </div>
                <div v-if="totalProbability !== 100" class="mt-4 text-center">
                    <Tag value="機率總和必須為 100%" severity="danger" />
                </div>
            </template>
        </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Tag from 'primevue/tag'

const signInConfig = ref(Array.from({ length: 7 }, (_, i) => ({ day: i + 1, reward: (i + 1) * 10 })))

const pointRate = ref(10)

const lotteryItems = ref([
    { name: 'iPhone 15', probability: 1 },
    { name: '現金 $888', probability: 5 },
    { name: '積分 500', probability: 20 },
    { name: '積分 100', probability: 30 },
    { name: '銘謝惠顧', probability: 44 }
])

const totalProbability = computed(() => {
    return lotteryItems.value.reduce((sum, item) => sum + (item.probability || 0), 0)
})

const addLotteryItem = () => {
    lotteryItems.value.push({ name: '新獎項', probability: 0 })
}

const removeLotteryItem = (index: number) => {
    lotteryItems.value.splice(index, 1)
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-inputnumber-input) { text-align: center; }
</style>
