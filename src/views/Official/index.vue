<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center gap-2 text-sm text-surface-600 dark:text-surface-400">
      <i class="pi pi-globe text-blue-500 dark:text-blue-400"></i>
      <span class="text-surface-900 dark:text-surface-0 font-medium">官網管理</span>
    </div>

    <div class="flex items-center gap-2 text-surface-900 dark:text-white text-xl font-semibold">
      <i class="pi pi-globe text-blue-500"></i>
      官網管理總覽
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card v-for="item in modules" :key="item.path" 
        class="bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 cursor-pointer hover:border-blue-500/50 transition-colors"
        @click="router.push(item.path)"
      >
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-500 dark:text-surface-400 text-sm mb-1">{{ item.description }}</p>
              <p class="text-lg font-bold text-surface-900 dark:text-white">{{ item.title }}</p>
            </div>
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="item.bgClass">
              <i :class="['pi', item.icon, 'text-xl', item.iconClass]"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from 'primevue/card'

const router = useRouter()

const modules = [
  { path: '/official/hero', title: '首圖配置', description: 'Landing Page 主視覺', icon: 'pi-image', bgClass: 'bg-purple-500/20', iconClass: 'text-purple-500' },
  { path: '/official/banners', title: '廣告輪播', description: '首頁 Carousel 廣告', icon: 'pi-images', bgClass: 'bg-blue-500/20', iconClass: 'text-blue-500' },
  { path: '/official/news', title: '最新消息', description: 'SEO 文章發布', icon: 'pi-megaphone', bgClass: 'bg-green-500/20', iconClass: 'text-green-500' },
  { path: '/official/games', title: '遊戲介紹', description: '主打遊戲行銷包裝', icon: 'pi-play', bgClass: 'bg-orange-500/20', iconClass: 'text-orange-500' },
  { path: '/official/seo', title: '站點資訊', description: 'SEO 與社群設定', icon: 'pi-cog', bgClass: 'bg-cyan-500/20', iconClass: 'text-cyan-500' },
]
</script>
