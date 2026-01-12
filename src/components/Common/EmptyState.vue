<![CDATA[<template>
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
      <i class="pi pi-folder-open text-4xl text-surface-400"></i>
    </div>
    <h3 class="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-2">
      {{ title }}
    </h3>
    <p class="text-sm text-surface-500 dark:text-surface-400 max-w-xs">
      {{ subtitle }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
}>(), {
  title: '尚無資料',
  subtitle: '目前沒有相關紀錄'
})
</script>
]]>
