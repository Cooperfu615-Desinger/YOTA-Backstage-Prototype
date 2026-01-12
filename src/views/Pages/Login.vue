<template>
  <div class="login-container">
    <!-- Background Effects -->
    <div class="bg-effects">
      <div class="grid-overlay"></div>
      <div class="glow-orb glow-1"></div>
      <div class="glow-orb glow-2"></div>
    </div>

    <!-- Login Card -->
    <div class="login-card">
      <!-- Logo & Title -->
      <div class="text-center mb-8">
        <div class="logo-container mx-auto mb-4">
          <i class="pi pi-bolt text-4xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-white">Antigravity Admin</h1>
        <p class="text-surface-400 text-sm mt-1">iGaming 後台管理系統</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Username -->
        <div class="flex flex-col gap-2">
          <label class="text-sm text-surface-400">帳號</label>
          <InputText 
            v-model="username" 
            placeholder="請輸入帳號"
            class="w-full"
            :disabled="loading"
          />
        </div>

        <!-- Password -->
        <div class="flex flex-col gap-2">
          <label class="text-sm text-surface-400">密碼</label>
          <Password 
            v-model="password" 
            placeholder="請輸入密碼"
            :feedback="false"
            toggleMask
            class="w-full"
            inputClass="w-full"
            :disabled="loading"
          />
        </div>

        <!-- Captcha -->
        <div class="flex flex-col gap-2">
          <label class="text-sm text-surface-400">驗證碼</label>
          <div class="flex gap-3">
            <InputText 
              v-model="captcha" 
              placeholder="請輸入驗證碼"
              class="flex-1"
              maxlength="4"
              :disabled="loading"
            />
            <div 
              class="captcha-box flex items-center justify-center cursor-pointer"
              @click="refreshCaptcha"
              v-tooltip.top="'點擊更換'"
            >
              <span class="captcha-text">{{ mockCaptcha }}</span>
            </div>
          </div>
        </div>

        <!-- Login Button -->
        <Button 
          type="submit"
          label="登入"
          class="w-full mt-6"
          :loading="loading"
        />
      </form>

      <!-- Hint -->
      <div class="mt-6 text-center">
        <p class="text-surface-500 text-xs">預設帳號 admin / admin</p>
        <p class="text-surface-600 text-xs mt-1">其他測試帳號: finance, ops, pm, agent (密碼: 123456)</p>
      </div>
    </div>

    <!-- Toast -->
    <Toast position="top-center" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// Form State
const username = ref('')
const password = ref('')
const captcha = ref('')
const mockCaptcha = ref('')
const loading = ref(false)

// Generate random captcha
const generateCaptcha = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const refreshCaptcha = () => {
  mockCaptcha.value = generateCaptcha()
}

// Login Handler
const handleLogin = async () => {
  // Validation
  if (!username.value || !password.value) {
    toast.add({ severity: 'warn', summary: '提示', detail: '請輸入帳號和密碼', life: 3000 })
    return
  }

  if (captcha.value.toUpperCase() !== mockCaptcha.value) {
    toast.add({ severity: 'error', summary: '錯誤', detail: '驗證碼錯誤', life: 3000 })
    refreshCaptcha()
    captcha.value = ''
    return
  }

  loading.value = true

  try {
    const result = await authStore.login(username.value, password.value)
    
    if (result.success) {
      toast.add({ severity: 'success', summary: '成功', detail: result.message, life: 2000 })
      setTimeout(() => {
        router.push('/dashboard/overview')
      }, 500)
    } else {
      toast.add({ severity: 'error', summary: '登入失敗', detail: result.message, life: 3000 })
      refreshCaptcha()
      captcha.value = ''
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  position: relative;
  overflow: hidden;
}

.bg-effects {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
}

.glow-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%);
  top: -100px;
  left: -100px;
}

.glow-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
  bottom: -150px;
  right: -150px;
}

.login-card {
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 1rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 10;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(59, 130, 246, 0.1);
}

.logo-container {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.captcha-box {
  width: 100px;
  height: 42px;
  background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.375rem;
  user-select: none;
}

.captcha-text {
  font-family: 'Courier New', monospace;
  font-size: 1.25rem;
  font-weight: bold;
  letter-spacing: 4px;
  background: linear-gradient(135deg, #60a5fa 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
