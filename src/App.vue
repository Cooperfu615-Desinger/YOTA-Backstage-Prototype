<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './layout/AppLayout.vue'

const route = useRoute()

// Dynamic layout based on route meta
const useAppLayout = computed(() => {
  return route.meta.layout !== 'empty'
})
</script>

<template>
  <!-- Dynamic Layout: Empty for login, AppLayout for dashboard -->
  <AppLayout v-if="useAppLayout">
    <router-view />
  </AppLayout>
  <router-view v-else />
</template>
