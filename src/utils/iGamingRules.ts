/**
 * iGaming Industry Expert Rules & Utilities
 * 
 * This module contains standardized formatting functions and constants
 * for the iGaming/online gambling industry backend systems.
 */

// ============================================================================
// CURRENCY FORMATTING
// ============================================================================

/**
 * Format a number as currency with thousand separators
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 2)
 * @param currency - Currency symbol (default: '')
 * @returns Formatted currency string with thousand separators
 * 
 * @example
 * formatCurrency(1234567.89) // "1,234,567.89"
 * formatCurrency(1234567.89, 2, '¥') // "¥1,234,567.89"
 */
export function formatCurrency(
    value: number | string,
    decimals: number = 2,
    currency: string = ''
): string {
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) return '-'

    const formatted = num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    })

    return currency ? `${currency}${formatted}` : formatted
}

/**
 * Format as integer with thousand separators (no decimals)
 */
export function formatInteger(value: number | string): string {
    return formatCurrency(value, 0)
}

// ============================================================================
// RISK CONTROL STATUS
// ============================================================================

export const RiskLevel = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
} as const

export type RiskLevelType = typeof RiskLevel[keyof typeof RiskLevel]

export interface RiskStatus {
    level: RiskLevelType
    label: string
    color: string
    bgColor: string
    icon: string
}

export const RISK_STATUS_CONFIG: Record<RiskLevelType, RiskStatus> = {
    [RiskLevel.LOW]: {
        level: RiskLevel.LOW,
        label: '正常',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        icon: 'pi-check-circle'
    },
    [RiskLevel.MEDIUM]: {
        level: RiskLevel.MEDIUM,
        label: '關注',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        icon: 'pi-exclamation-circle'
    },
    [RiskLevel.HIGH]: {
        level: RiskLevel.HIGH,
        label: '警告',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/20',
        icon: 'pi-exclamation-triangle'
    },
    [RiskLevel.CRITICAL]: {
        level: RiskLevel.CRITICAL,
        label: '危險',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        icon: 'pi-times-circle'
    }
}

export function getRiskStatus(level: RiskLevelType): RiskStatus {
    return RISK_STATUS_CONFIG[level]
}

// ============================================================================
// MEMBER STATUS
// ============================================================================

export const MemberStatus = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    BLOCKED: 'blocked',
    FROZEN: 'frozen'
} as const

export type MemberStatusType = typeof MemberStatus[keyof typeof MemberStatus]

export interface StatusConfig {
    status: MemberStatusType
    label: string
    color: string
    bgColor: string
}

export const MEMBER_STATUS_CONFIG: Record<MemberStatusType, StatusConfig> = {
    [MemberStatus.ACTIVE]: {
        status: MemberStatus.ACTIVE,
        label: '正常',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20'
    },
    [MemberStatus.INACTIVE]: {
        status: MemberStatus.INACTIVE,
        label: '未啟用',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20'
    },
    [MemberStatus.PENDING]: {
        status: MemberStatus.PENDING,
        label: '審核中',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20'
    },
    [MemberStatus.BLOCKED]: {
        status: MemberStatus.BLOCKED,
        label: '封鎖',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20'
    },
    [MemberStatus.FROZEN]: {
        status: MemberStatus.FROZEN,
        label: '凍結',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20'
    }
}

// ============================================================================
// TRANSACTION STATUS
// ============================================================================

export const TransactionStatus = {
    SUCCESS: 'success',
    PENDING: 'pending',
    PROCESSING: 'processing',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
} as const

export type TransactionStatusType = typeof TransactionStatus[keyof typeof TransactionStatus]

export interface TransactionStatusConfig {
    status: TransactionStatusType
    label: string
    color: string
    bgColor: string
}

export const TRANSACTION_STATUS_CONFIG: Record<TransactionStatusType, TransactionStatusConfig> = {
    [TransactionStatus.SUCCESS]: {
        status: TransactionStatus.SUCCESS,
        label: '成功',
        color: 'text-green-400',
        bgColor: 'bg-green-500/20'
    },
    [TransactionStatus.PENDING]: {
        status: TransactionStatus.PENDING,
        label: '待處理',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20'
    },
    [TransactionStatus.PROCESSING]: {
        status: TransactionStatus.PROCESSING,
        label: '處理中',
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20'
    },
    [TransactionStatus.FAILED]: {
        status: TransactionStatus.FAILED,
        label: '失敗',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20'
    },
    [TransactionStatus.CANCELLED]: {
        status: TransactionStatus.CANCELLED,
        label: '已取消',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20'
    }
}

// ============================================================================
// TABLE CONFIGURATION (High Information Density)
// ============================================================================

export interface TableConfig {
    /** Row height in pixels */
    rowHeight: 'compact' | 'normal' | 'relaxed'
    /** Font size class */
    fontSize: 'xs' | 'sm' | 'base'
    /** Show zebra striping */
    striped: boolean
    /** Enable row hover effect */
    hoverable: boolean
    /** Fixed header */
    stickyHeader: boolean
    /** Rows per page options */
    pageSizeOptions: number[]
}

export const DEFAULT_TABLE_CONFIG: TableConfig = {
    rowHeight: 'compact',
    fontSize: 'sm',
    striped: true,
    hoverable: true,
    stickyHeader: true,
    pageSizeOptions: [20, 50, 100, 200]
}

export const TABLE_ROW_HEIGHT = {
    compact: 'h-8',
    normal: 'h-10',
    relaxed: 'h-12'
} as const

export const TABLE_FONT_SIZE = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base'
} as const

// ============================================================================
// DATE/TIME FORMATTING
// ============================================================================

/**
 * Format date for display in tables
 */
export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
}

/**
 * Format date only (no time)
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

// ============================================================================
// VIP LEVELS
// ============================================================================

export interface VipLevel {
    level: number
    name: string
    color: string
    bgColor: string
    minDeposit: number
}

export const VIP_LEVELS: VipLevel[] = [
    { level: 0, name: '普通會員', color: 'text-gray-400', bgColor: 'bg-gray-500/20', minDeposit: 0 },
    { level: 1, name: 'VIP 1', color: 'text-blue-400', bgColor: 'bg-blue-500/20', minDeposit: 1000 },
    { level: 2, name: 'VIP 2', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', minDeposit: 5000 },
    { level: 3, name: 'VIP 3', color: 'text-green-400', bgColor: 'bg-green-500/20', minDeposit: 20000 },
    { level: 4, name: 'VIP 4', color: 'text-purple-400', bgColor: 'bg-purple-500/20', minDeposit: 50000 },
    { level: 5, name: 'VIP 5', color: 'text-orange-400', bgColor: 'bg-orange-500/20', minDeposit: 100000 },
    { level: 6, name: 'VIP 6', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', minDeposit: 500000 },
]

export function getVipLevel(level: number): VipLevel {
    const found = VIP_LEVELS.find(v => v.level === level)
    // VIP_LEVELS[0] always exists as it's a non-empty array literal
    return found !== undefined ? found : VIP_LEVELS[0]!
}
