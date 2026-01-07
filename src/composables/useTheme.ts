import { ref, watch, computed } from 'vue'

// Theme state - reactive and shared across components
const isDark = ref(true)

// Initialize theme from localStorage
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
        isDark.value = savedTheme === 'dark'
    } else {
        // Default to dark mode
        isDark.value = true
    }
    applyTheme()
}

// Apply theme to document
const applyTheme = () => {
    const root = document.documentElement
    if (isDark.value) {
        root.classList.add('dark')
        root.classList.remove('light')
    } else {
        root.classList.add('light')
        root.classList.remove('dark')
    }
}

// Toggle theme function
const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
}

// Watch for changes and apply
watch(isDark, () => {
    applyTheme()
})

// Chart colors computed based on theme
const chartColors = computed(() => ({
    // Grid colors
    gridColor: isDark.value ? 'rgba(148, 163, 184, 0.1)' : 'rgba(100, 116, 139, 0.2)',

    // Text/tick colors
    textColor: isDark.value ? '#94a3b8' : '#475569',
    textColorLight: isDark.value ? '#64748b' : '#64748b',
    textColorWhite: isDark.value ? '#f8fafc' : '#1e293b',

    // Tooltip colors
    tooltipBg: isDark.value ? '#1e293b' : '#ffffff',
    tooltipTitle: isDark.value ? '#f8fafc' : '#1e293b',
    tooltipBody: isDark.value ? '#cbd5e1' : '#475569',
    tooltipBorder: isDark.value ? '#334155' : '#e2e8f0',

    // Legend colors
    legendColor: isDark.value ? '#94a3b8' : '#475569'
}))

// Composable export
export function useTheme() {
    return {
        isDark,
        toggleTheme,
        initTheme,
        chartColors
    }
}
