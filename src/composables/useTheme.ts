import { ref, watch, computed } from 'vue'

// Theme state - reactive and shared across components
const isDark = ref(true)

// Initialize theme - LOCKED TO DARK MODE
// NOTE: Theme toggle is temporarily disabled for development stability
const initTheme = () => {
    // Force dark mode regardless of localStorage or browser preference
    isDark.value = true
    document.documentElement.classList.add('dark')
    document.documentElement.classList.remove('light')
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
    // Grid colors - more visible in light mode
    gridColor: isDark.value ? 'rgba(148, 163, 184, 0.1)' : 'rgba(71, 85, 105, 0.15)',

    // Text/tick colors - darker in light mode for better contrast
    textColor: isDark.value ? '#94a3b8' : '#374151',
    textColorLight: isDark.value ? '#64748b' : '#4b5563',
    textColorWhite: isDark.value ? '#f8fafc' : '#111827',

    // Tooltip colors - inverted for light mode (dark bg, light text)
    tooltipBg: isDark.value ? '#1e293b' : '#1f2937',
    tooltipTitle: isDark.value ? '#f8fafc' : '#f9fafb',
    tooltipBody: isDark.value ? '#cbd5e1' : '#e5e7eb',
    tooltipBorder: isDark.value ? '#334155' : '#374151',

    // Legend colors - darker in light mode
    legendColor: isDark.value ? '#94a3b8' : '#374151'
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
