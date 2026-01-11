<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-th-large text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-500 dark:text-surface-300">版面設定</span>
      <span>></span>
      <span class="text-surface-900 dark:text-surface-0 font-medium">版面總覽</span>
    </div>

    <!-- Header -->
    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-chart-pie text-purple-500"></i>
      版面總覽
    </div>

    <!-- Cache Control Panel -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white">
          <i class="pi pi-server text-blue-500"></i>
          快取與更新 (Cache & Updates)
        </div>
      </template>
      <template #content>
        <p class="text-surface-600 dark:text-surface-400 mb-4">當您更新了圖片或文案，若前台未即時生效，請執行快取清除。</p>
        <div class="flex flex-wrap gap-3">
          <Button label="重載 APP 設定" icon="pi pi-refresh" severity="warn" @click="confirmReloadConfig" />
          <Button label="清除 CDN 快取" icon="pi pi-images" severity="danger" @click="confirmClearCache" />
        </div>
      </template>
    </Card>

    <!-- Status Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Splash Ads Status -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">開屏廣告</p>
              <Tag :value="statusData.splashAds.active ? '投放中' : '未排程'" :severity="statusData.splashAds.active ? 'success' : 'secondary'" />
              <p v-if="statusData.splashAds.active" class="text-sm text-surface-700 dark:text-surface-300 mt-2">{{ statusData.splashAds.name }}</p>
            </div>
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :class="statusData.splashAds.active ? 'bg-green-500/20' : 'bg-surface-200 dark:bg-surface-700'">
              <i class="pi pi-images" :class="statusData.splashAds.active ? 'text-green-500' : 'text-surface-400'"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Home Layout -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">首頁版型</p>
              <p class="text-lg font-semibold text-surface-900 dark:text-white">{{ statusData.homeLayout.landscape }}</p>
              <p class="text-sm text-surface-500 mt-1">{{ statusData.homeLayout.portrait }}</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <i class="pi pi-th-large text-blue-500"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Articles -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">文章發布</p>
              <p class="text-lg font-semibold text-purple-500">已發布 {{ statusData.articles.published }} 篇</p>
              <p class="text-sm text-surface-500 mt-1">草稿 {{ statusData.articles.draft }} 篇</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <i class="pi pi-file-edit text-purple-500"></i>
            </div>
          </div>
        </template>
      </Card>

      <!-- Payment Channels -->
      <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">支付渠道</p>
              <p class="text-lg font-semibold text-orange-500">APP: IAP</p>
              <p class="text-sm text-surface-500 mt-1">Web: {{ statusData.payment.webChannels }} 渠道</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <i class="pi pi-credit-card text-orange-500"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Quick Access -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white">
          <i class="pi pi-bolt text-yellow-500"></i>
          快速入口
        </div>
      </template>
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 cursor-pointer transition-colors" @click="navigateTo('/layout/homepage')">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <i class="pi pi-image text-blue-500"></i>
              </div>
              <div>
                <p class="font-medium text-surface-900 dark:text-white">更換啟動圖</p>
                <p class="text-sm text-surface-500">視覺素材設定</p>
              </div>
            </div>
          </div>

          <div class="p-4 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 cursor-pointer transition-colors" @click="navigateTo('/layout/game-config')">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <i class="pi pi-star text-green-500"></i>
              </div>
              <div>
                <p class="font-medium text-surface-900 dark:text-white">調整熱門遊戲</p>
                <p class="text-sm text-surface-500">精選內容設定</p>
              </div>
            </div>
          </div>

          <div class="p-4 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 cursor-pointer transition-colors" @click="navigateTo('/system-settings/announcements')">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <i class="pi pi-megaphone text-purple-500"></i>
              </div>
              <div>
                <p class="font-medium text-surface-900 dark:text-white">發布新公告</p>
                <p class="text-sm text-surface-500">公告管理</p>
              </div>
            </div>
          </div>

          <div class="p-4 bg-surface-100 dark:bg-surface-700 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-600 cursor-pointer transition-colors" @click="navigateTo('/layout/payment')">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <i class="pi pi-shopping-cart text-orange-500"></i>
              </div>
              <div>
                <p class="font-medium text-surface-900 dark:text-white">上架 IAP 商品</p>
                <p class="text-sm text-surface-500">APP 商城配置</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <!-- Recent Changes Timeline -->
    <Card class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
      <template #title>
        <div class="flex items-center gap-2 text-surface-900 dark:text-white">
          <i class="pi pi-history text-green-500"></i>
          最近異動紀錄
        </div>
      </template>
      <template #content>
        <Timeline :value="recentChanges" class="max-w-2xl">
          <template #marker="slotProps">
            <div class="w-8 h-8 rounded-full flex items-center justify-center" :style="{ background: slotProps.item.color }">
              <i :class="['pi', slotProps.item.icon]" class="text-white text-sm"></i>
            </div>
          </template>
          <template #content="slotProps">
            <div class="flex flex-col">
              <p class="text-surface-900 dark:text-white font-medium">{{ slotProps.item.user }} <span class="font-normal text-surface-500">{{ slotProps.item.action }}</span></p>
              <p class="text-sm text-surface-500">{{ slotProps.item.time }}</p>
            </div>
          </template>
        </Timeline>
      </template>
    </Card>

    <!-- Confirm Dialog -->
    <ConfirmDialog />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Timeline from 'primevue/timeline'
import ConfirmDialog from 'primevue/confirmdialog'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const confirm = useConfirm()
const toast = useToast()

// Status Data
const statusData = ref({
  splashAds: {
    active: true,
    name: '首存優惠'
  },
  homeLayout: {
    landscape: '橫式 5 欄',
    portrait: '直式 3 欄'
  },
  articles: {
    published: 5,
    draft: 2
  },
  payment: {
    webChannels: 5
  }
})

// Recent Changes
interface ChangeRecord {
  user: string
  action: string
  time: string
  icon: string
  color: string
}

const recentChanges = ref<ChangeRecord[]>([
  { user: 'Admin', action: '更新了 [開屏廣告]', time: '10 分鐘前', icon: 'pi-images', color: '#22c55e' },
  { user: 'Editor01', action: '發布了新文章 [充值教學]', time: '1 小時前', icon: 'pi-file-edit', color: '#8b5cf6' },
  { user: 'Admin', action: '調整了 [遊戲配置] 精選遊戲', time: '2 小時前', icon: 'pi-th-large', color: '#3b82f6' },
  { user: 'Marketing', action: '上架了新 IAP 商品', time: '昨天 18:30', icon: 'pi-shopping-cart', color: '#f97316' },
  { user: 'Admin', action: '清除了 CDN 快取', time: '昨天 15:00', icon: 'pi-server', color: '#ef4444' }
])

// Navigation
const navigateTo = (path: string) => {
  router.push(path)
}

// Cache Actions
const confirmReloadConfig = () => {
  confirm.require({
    message: '確定要重載 APP 設定嗎？這將刷新所有文字、排序等配置。',
    header: '重載確認',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-warning',
    accept: () => {
      toast.add({ severity: 'success', summary: '重載成功', detail: 'APP 設定已重載', life: 3000 })
    }
  })
}

const confirmClearCache = () => {
  confirm.require({
    message: '確定要清除 CDN 快取嗎？這將清除所有圖片資源快取，可能需要幾分鐘生效。',
    header: '清除快取確認',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      toast.add({ severity: 'success', summary: '清除成功', detail: 'CDN 快取已清除，預計 3-5 分鐘生效', life: 5000 })
    }
  })
}
</script>
