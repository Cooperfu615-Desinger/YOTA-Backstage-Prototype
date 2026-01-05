/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // iGaming specific color palette
        'risk-low': '#22c55e',
        'risk-medium': '#eab308',
        'risk-high': '#ef4444',
        'status-active': '#22c55e',
        'status-pending': '#eab308',
        'status-inactive': '#6b7280',
        'status-blocked': '#ef4444',
      },
      fontSize: {
        // High density table font sizes
        'table-xs': ['0.7rem', { lineHeight: '1rem' }],
        'table-sm': ['0.75rem', { lineHeight: '1.125rem' }],
      },
    },
  },
  plugins: [],
}
