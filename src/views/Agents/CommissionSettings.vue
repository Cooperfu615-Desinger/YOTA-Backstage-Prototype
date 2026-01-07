<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-sitemap text-blue-400"></i>
      <span class="text-surface-300">代理管理</span>
      <span>></span>
      <span class="text-white font-medium">佣金設定</span>
    </div>

    <Card class="bg-surface-800/50 border border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-white text-lg">
          <i class="pi pi-percentage text-green-400"></i>
          佣金設定管理
        </div>
      </template>
      <template #content>
        <div class="flex flex-col items-center justify-center py-12 text-center">
          <i class="pi pi-percentage text-6xl text-green-400 mb-4"></i>
          <p class="text-surface-300 text-lg">全域佣金設定頁面</p>
          <p class="text-surface-500 text-sm mt-2">即將推出</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
</script>

<style scoped>
:deep(.p-card .p-card-body) { padding: 1rem; }
:deep(.p-card .p-card-content) { padding: 0; }
</style>
