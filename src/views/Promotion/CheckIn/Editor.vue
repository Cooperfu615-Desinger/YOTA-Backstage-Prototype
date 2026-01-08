<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-gift text-blue-400"></i>
      <span class="text-surface-300">推廣活動</span>
      <span>></span>
      <span class="text-surface-300">簽到看板</span>
      <span>></span>
      <span class="text-white font-medium">模板編輯器</span>
    </div>

    <!-- Toolbar -->
    <div class="bg-surface-800/50 border border-surface-700 rounded-lg p-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
             <div class="flex flex-col gap-1">
                <label class="text-xs text-surface-400">模板名稱</label>
                <InputText v-model="templateName" class="p-inputtext-sm w-48" placeholder="輸入模板名稱" />
            </div>
             <div class="flex flex-col gap-1">
                <label class="text-xs text-surface-400">週期天數</label>
                <Dropdown v-model="selectedDays" :options="daysOptions" class="p-dropdown-sm w-32" @change="regenerateGrid" />
            </div>
        </div>
        <div class="flex gap-2">
            <Button label="取消" text severity="secondary" @click="goBack" />
            <Button label="儲存模板" icon="pi pi-save" severity="success" @click="saveTemplate" />
        </div>
    </div>

    <!-- Dynamic Grid -->
    <Card class="bg-surface-800/50 border border-surface-700">
        <template #content>
            <!-- 
                Using flex wrap with fixed width items for best responsiveness across 5-30 items
                Or Grid. Let's try CSS Grid with auto-fill minmax for responsiveness. 
                However, user asked for specific behavior.
                "ensuring neat alignment at 5 or 30 cells"
             -->
            <div class="grid grid-cols-2 md:grid-cols-5 xl:grid-cols-7 gap-4">
                <div v-for="(cell, index) in gridCells" :key="index" 
                     @click="openCellEditor(index)"
                     class="bg-surface-900 border border-surface-700 rounded-lg p-3 flex flex-col items-center gap-3 relative group hover:border-blue-500 cursor-pointer transition-all hover:-translate-y-1">
                    
                    <span class="text-xs text-surface-500 absolute top-2 left-2">Day {{ index + 1 }}</span>
                    
                    <!-- Reward Icon -->
                    <div class="w-10 h-10 rounded-full bg-surface-800 flex items-center justify-center mt-4 group-hover:bg-blue-500/20 transition-colors">
                        <i :class="['pi', cell.icon, 'text-xl', cell.isBigPrize ? 'text-yellow-400' : 'text-blue-400']"></i>
                    </div>
                    
                    <!-- Reward Value Display -->
                    <div class="text-center">
                        <div class="text-sm font-bold text-white">{{ cell.value }}</div>
                        <div class="text-[10px] text-surface-400">{{ cell.type === 'points' ? '積分' : '道具' }}</div>
                    </div>

                    <!-- Edit Hint -->
                    <div class="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded-lg">
                        <i class="pi pi-pencil text-white"></i>
                    </div>
                </div>
            </div>
        </template>
    </Card>

    <!-- Cell Editor Dialog -->
    <Dialog v-model:visible="editorVisible" modal header="編輯獎勵內容" :style="{ width: '400px' }">
        <div v-if="currentCell" class="space-y-4 py-2">
            <div class="flex flex-col gap-2">
                <label class="text-surface-300 text-sm">獎勵類型</label>
                <Dropdown v-model="currentCell.type" :options="[{label:'積分', value:'points'}, {label:'虛擬道具', value:'item'}]" optionLabel="label" optionValue="value" class="w-full" />
            </div>
             <div class="flex flex-col gap-2">
                <label class="text-surface-300 text-sm">獎勵數量</label>
                <!-- 100px Button-less Input -->
                <div class="w-full">
                    <InputNumber v-model="currentCell.value" :min="0" class="w-full" inputClass="text-center" :showButtons="false" />
                </div>
            </div>
             <div class="flex flex-col gap-2">
                <label class="text-surface-300 text-sm">特殊標記</label>
                <div class="flex items-center gap-2">
                    <Checkbox v-model="currentCell.isBigPrize" :binary="true" inputId="bigPrize" />
                    <label for="bigPrize" class="text-sm cursor-pointer select-none">設定為大獎 (高亮顯示)</label>
                </div>
            </div>
        </div>
        <template #footer>
            <Button label="確定" icon="pi pi-check" @click="editorVisible = false" autofocus />
        </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'
import Checkbox from 'primevue/checkbox'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const toast = useToast()

const templateName = ref('新簽到模板')
const daysOptions = [5, 7, 10, 14, 15, 20, 21, 28, 30]
const selectedDays = ref(30)

interface Cell {
    value: number;
    type: string;
    icon: string;
    isBigPrize: boolean;
}

const gridCells = ref<Cell[]>([])

const regenerateGrid = () => {
    // Preserve existing data if possible, else default
    const newCells: Cell[] = []
    for (let i = 0; i < selectedDays.value; i++) {
        if (i < gridCells.value.length) {
            const existing = gridCells.value[i]
            if (existing) newCells.push(existing)
            else newCells.push(createDefaultCell(i))
        } else {
            newCells.push(createDefaultCell(i))
        }
    }
    gridCells.value = newCells
}

const createDefaultCell = (i: number): Cell => ({
    value: 10,
    type: 'points',
    icon: 'pi-star',
    isBigPrize: (i + 1) % 7 === 0
})

// Initial Generation
onMounted(() => {
    regenerateGrid()
})

// Editor
const editorVisible = ref(false)
const currentEditingIndex = ref(-1)
const currentCell = ref<Cell | null>(null)

const openCellEditor = (index: number) => {
    currentEditingIndex.value = index
    // Clone to prevent direct edit before save? Or direct edit is fine for this prototype
    const cell = gridCells.value[index]
    if (!cell) return
    currentCell.value = cell 
    
    if (currentCell.value) {
      if (currentCell.value.isBigPrize) currentCell.value.icon = 'pi-gift'
      else currentCell.value.icon = 'pi-star'
    }
    
    editorVisible.value = true
}

const goBack = () => {
    router.back()
}

const saveTemplate = () => {
    toast.add({ severity: 'success', summary: '儲存成功', detail: `已儲存 ${selectedDays.value} 天週期模板`, life: 2000 })
    setTimeout(() => {
        router.back()
    }, 1000)
}
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1.5rem; }
:deep(.p-inputnumber-input) { text-align: center; }
</style>
