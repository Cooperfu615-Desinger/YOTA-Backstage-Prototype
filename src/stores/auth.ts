import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ========================================
// Types
// ========================================
export interface User {
    name: string
    role: 'ADMIN' | 'FINANCE' | 'OPS' | 'PM' | 'AGENT'
    permissions: string[]
}

// ========================================
// Mock Users Database
// ========================================
const MOCK_USERS: Record<string, { password: string; user: User }> = {
    admin: {
        password: 'admin',
        user: {
            name: '超級管理員',
            role: 'ADMIN',
            permissions: ['*'] // 全權限
        }
    },
    finance: {
        password: '123456',
        user: {
            name: '財務主管',
            role: 'FINANCE',
            permissions: ['Dashboard', 'Finance', 'Report']
        }
    },
    ops: {
        password: '123456',
        user: {
            name: '營運人員',
            role: 'OPS',
            permissions: ['Dashboard', 'Member', 'Game', 'Layout', 'Promotion']
        }
    },
    pm: {
        password: '123456',
        user: {
            name: '專案經理',
            role: 'PM',
            permissions: ['Dashboard', 'System', 'Logs']
        }
    },
    agent: {
        password: '123456',
        user: {
            name: '代理商',
            role: 'AGENT',
            permissions: ['Dashboard', 'Agent', 'Report']
        }
    }
}

// ========================================
// Auth Store
// ========================================
export const useAuthStore = defineStore('auth', () => {
    // State
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)

    // Getters
    const isLoggedIn = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.role === 'ADMIN')

    const hasPermission = computed(() => (permission: string) => {
        if (!user.value) return false
        if (user.value.permissions.includes('*')) return true
        return user.value.permissions.includes(permission)
    })

    // Actions
    const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        const mockUser = MOCK_USERS[username.toLowerCase()]

        if (!mockUser) {
            return { success: false, message: '帳號不存在' }
        }

        if (mockUser.password !== password) {
            return { success: false, message: '密碼錯誤' }
        }

        // Login success
        user.value = mockUser.user
        token.value = `mock-token-${Date.now()}-${username}`

        // Persist to localStorage
        localStorage.setItem('auth_token', token.value)
        localStorage.setItem('auth_user', JSON.stringify(user.value))

        return { success: true, message: '登入成功' }
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
    }

    const initAuth = () => {
        // Restore from localStorage on app load
        const savedToken = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('auth_user')

        if (savedToken && savedUser) {
            token.value = savedToken
            try {
                user.value = JSON.parse(savedUser)
            } catch {
                logout()
            }
        }
    }

    return {
        user,
        token,
        isLoggedIn,
        isAdmin,
        hasPermission,
        login,
        logout,
        initAuth
    }
})
