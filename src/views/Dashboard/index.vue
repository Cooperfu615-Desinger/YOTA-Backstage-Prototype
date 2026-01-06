<template>
  <div class="p-6 space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm text-surface-400">
      <i class="pi pi-chart-bar text-blue-400"></i>
      <span class="text-surface-300">儀表板</span>
      <span>></span>
      <span class="text-white font-medium">總覽</span>
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white flex items-center gap-3">
          <i class="pi pi-chart-bar text-blue-400"></i>
          儀表板總覽
        </h1>
        <p class="text-surface-400 mt-1">Dashboard Overview - 即時監控平台營運數據</p>
      </div>
      <div class="flex items-center gap-2 text-surface-400 text-sm">
        <i class="pi pi-clock"></i>
        <span>最後更新: {{ lastUpdate }}</span>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <Card v-for="stat in statsCards" :key="stat.title" class="stat-card">
        <template #content>
          <div class="flex items-start justify-between">
            <div>
              <p class="text-surface-400 text-sm mb-1">{{ stat.title }}</p>
              <p class="text-2xl font-bold mb-2">{{ stat.value }}</p>
              <div 
                class="flex items-center gap-1 text-sm"
                :class="stat.isPositive ? 'text-green-400' : 'text-red-400'"
              >
                <i :class="['pi', stat.isPositive ? 'pi-arrow-up' : 'pi-arrow-down', 'text-xs']"></i>
                <span>{{ stat.change }}</span>
                <span class="text-surface-500">vs 昨日</span>
              </div>
            </div>
            <div 
              class="w-12 h-12 rounded-lg flex items-center justify-center"
              :class="stat.bgClass"
            >
              <i :class="['pi', stat.icon, 'text-xl', stat.iconClass]"></i>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Line Chart -->
    <Card class="chart-card">
      <template #title>
        <div class="flex items-center justify-between">
          <span>過去 7 天存提款趨勢</span>
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-green-400"></span>
              <span class="text-surface-400">存款</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-400"></span>
              <span class="text-surface-400">提款</span>
            </div>
          </div>
        </div>
      </template>
      <template #content>
        <Chart type="line" :data="chartData" :options="chartOptions" class="h-80" />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Card from 'primevue/card'
import Chart from 'primevue/chart'

// Last update time
const lastUpdate = ref(new Date().toLocaleTimeString('zh-TW', { 
  hour: '2-digit', 
  minute: '2-digit',
  second: '2-digit'
}))

// ========================================
// Mock Data - 數據卡片
// ========================================
const statsCards = ref([
  {
    title: '總餘額',
    value: '$12,845,320',
    change: '+2.5%',
    isPositive: true,
    icon: 'pi-wallet',
    bgClass: 'bg-blue-500/20',
    iconClass: 'text-blue-400'
  },
  {
    title: '今日盈虧',
    value: '$128,450',
    change: '+15.3%',
    isPositive: true,
    icon: 'pi-chart-line',
    bgClass: 'bg-green-500/20',
    iconClass: 'text-green-400'
  },
  {
    title: '今日新註冊',
    value: '156',
    change: '+8.2%',
    isPositive: true,
    icon: 'pi-users',
    bgClass: 'bg-purple-500/20',
    iconClass: 'text-purple-400'
  },
  {
    title: '待審核提款',
    value: '23',
    change: '-5.1%',
    isPositive: false,
    icon: 'pi-clock',
    bgClass: 'bg-orange-500/20',
    iconClass: 'text-orange-400'
  }
])

// ========================================
// Mock Data - 折線圖數據 (過去 7 天)
// ========================================
const chartData = computed(() => ({
  labels: ['12/31', '01/01', '01/02', '01/03', '01/04', '01/05', '01/06'],
  datasets: [
    {
      label: '存款',
      data: [850000, 920000, 780000, 1050000, 890000, 960000, 1120000],
      fill: true,
      borderColor: 'rgb(74, 222, 128)',
      backgroundColor: 'rgba(74, 222, 128, 0.1)',
      tension: 0.4,
      pointBackgroundColor: 'rgb(74, 222, 128)',
      pointBorderColor: 'rgb(74, 222, 128)',
      pointHoverRadius: 6
    },
    {
      label: '提款',
      data: [420000, 380000, 450000, 520000, 410000, 480000, 390000],
      fill: true,
      borderColor: 'rgb(248, 113, 113)',
      backgroundColor: 'rgba(248, 113, 113, 0.1)',
      tension: 0.4,
      pointBackgroundColor: 'rgb(248, 113, 113)',
      pointBorderColor: 'rgb(248, 113, 113)',
      pointHoverRadius: 6
    }
  ]
}))

// ========================================
// Chart.js 配置 (暗色主題)
// ========================================
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(30, 30, 30, 0.9)',
      titleColor: '#fff',
      bodyColor: '#ccc',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: { dataset: { label: string }; raw: number }) => {
          const label = context.dataset.label || ''
          const value = context.raw.toLocaleString()
          return `${label}: $${value}`
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.5)',
        callback: (value: number) => {
          if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`
          }
          return `$${(value / 1000).toFixed(0)}K`
        }
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
})
</script>

<style scoped>
.stat-card :deep(.p-card-body) {
  padding: 1.25rem;
}

.chart-card :deep(.p-card-body) {
  padding: 1.25rem;
}

.chart-card :deep(.p-card-title) {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}
</style>
