import { ref, computed } from 'vue'

export interface WithdrawalOrder {
    id: number
    orderId: string
    memberId: string
    amount: number
    fee: number
    actualAmount: number
    applyTime: string
    status: '待審核' | '審核中' | '已通過' | '已拒絕' | '已沖正'
    processor: string | null
    lockTime?: string
    // New Fields
    rollover: { required: number, current: number }
    financialStats: { totalDeposit: number, totalWithdrawal: number, balance: number }
    tags: string[]
}

export interface DepositOrder {
    id: number
    orderId: string
    memberId: string
    type: string // e.g. '人工入款', '活動贈送' or Payment Method for Online
    merchant?: string // For Online Deposit
    amount: number
    applyTime: string
    status: '待審核' | '已通過' | '已拒絕' | '支付成功' | '支付失敗' | '待支付'
    // New Fields
    remark?: string
    applicant?: string
    attachmentUrl?: string
    memberSnapshot?: { currentBalance: number, recentDepositCount: number, recentDepositTotal: number }
}

// Singleton state
const withdrawalOrders = ref<WithdrawalOrder[]>([])
const manualDepositOrders = ref<DepositOrder[]>([])
const onlineDepositOrders = ref<DepositOrder[]>([])
const isInitialized = ref(false)

export function useFinanceData() {

    const initData = () => {
        if (isInitialized.value) return

        // Generate Withdrawals
        const wList: WithdrawalOrder[] = []
        const wStatuses = ['待審核', '審核中', '已通過', '已拒絕', '已沖正']


        for (let i = 0; i < 30; i++) {
            const amount = Math.floor(Math.random() * 50000) + 1000
            const fee = Math.floor(amount * 0.01)
            const status = wStatuses[Math.floor(Math.random() * wStatuses.length)] as any
            const isLocked = status === '審核中'

            // Random Stats
            const totalDeposit = Math.floor(Math.random() * 500000) + 10000
            const totalWithdrawal = Math.floor(Math.random() * 300000)
            const balance = totalDeposit - totalWithdrawal + Math.floor(Math.random() * 50000)

            // Random Rollover
            const requiredRollover = amount * (Math.floor(Math.random() * 3) + 1) // 1x to 3x
            // 70% chance to meet rollover
            const currentRollover = Math.random() > 0.3 ? requiredRollover + 1000 : Math.floor(requiredRollover * 0.6)

            // Random Tags
            const orderTags: string[] = []
            if (Math.random() > 0.7) orderTags.push('高風險')
            if (Math.random() > 0.8) orderTags.push('套利嫌疑')
            if (amount > 30000) orderTags.push('VIP')

            wList.push({
                id: i + 1,
                orderId: `WD${20240107000 + i}`,
                memberId: `user${1000 + i}`,
                amount: amount,
                fee: fee,
                actualAmount: amount - fee,
                applyTime: new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString().replace('T', ' ').substring(0, 19),
                status: status,
                processor: isLocked ? (Math.random() > 0.5 ? 'Admin' : 'OperatorB') : null,
                lockTime: isLocked ? new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString().replace('T', ' ').substring(0, 19) : undefined,
                rollover: { required: requiredRollover, current: currentRollover },
                financialStats: { totalDeposit, totalWithdrawal, balance },
                tags: orderTags
            })
        }
        // Force some pending
        wList.unshift({
            id: 999,
            orderId: `WD${20240107999}`,
            memberId: `vip_user`,
            amount: 100000,
            fee: 0,
            actualAmount: 100000,
            applyTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: '待審核',
            processor: null,
            rollover: { required: 100000, current: 80000 }, // Not Met
            financialStats: { totalDeposit: 500000, totalWithdrawal: 200000, balance: 350000 },
            tags: ['VIP', '高風險']
        })
        withdrawalOrders.value = wList

        // Generate Manual Deposits
        const mList: DepositOrder[] = []
        const mStatuses = ['待審核', '已通過', '已拒絕']
        const mTypes = ['人工入款', '活動贈送', '系統補分']
        const applicants = ['Admin', 'Agent_007', 'Fin_Manager']

        for (let i = 0; i < 15; i++) {
            const hasAttachment = Math.random() > 0.6
            const isLarge = i === 5 // Force one large amount
            const amount = isLarge ? 150000 : Math.floor(Math.random() * 20000) * 10

            mList.push({
                id: i,
                orderId: `MD${20240107000 + i}`,
                memberId: `user${1000 + i}`,
                type: mTypes[Math.floor(Math.random() * mTypes.length)]!,
                amount: amount,
                applyTime: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toISOString().replace('T', ' ').substring(0, 19),
                status: mStatuses[Math.floor(Math.random() * mStatuses.length)] as any,
                remark: isLarge ? 'VIP 大額充值請加速' : (Math.random() > 0.5 ? '客戶線下匯款' : '活動獎勵補發'),
                applicant: applicants[Math.floor(Math.random() * applicants.length)],
                attachmentUrl: hasAttachment ? 'https://placehold.co/600x400/png' : undefined,
                memberSnapshot: {
                    currentBalance: Math.floor(Math.random() * 100000),
                    recentDepositCount: Math.floor(Math.random() * 5),
                    recentDepositTotal: Math.floor(Math.random() * 200000)
                }
            })
        }
        manualDepositOrders.value = mList

        // Generate Online Deposits
        const oList: DepositOrder[] = []
        const oStatuses = ['支付成功', '支付失敗', '待支付']
        const merchants = ['MCH_888 (綠界)', 'MCH_999 (藍新)', 'MCH_777 (LinePay)']
        for (let i = 0; i < 25; i++) {
            oList.push({
                id: i,
                orderId: `OD${20240107000 + i}`,
                memberId: `user${2000 + i}`,
                merchant: merchants[Math.floor(Math.random() * merchants.length)],
                type: Math.random() > 0.5 ? 'Credit Card' : 'Virtual Account', // re-using type field
                amount: Math.floor(Math.random() * 50000) * 10,
                applyTime: new Date(Date.now() - Math.floor(Math.random() * 86400 * 1000)).toISOString().replace('T', ' ').substring(0, 19),
                status: oStatuses[Math.floor(Math.random() * oStatuses.length)] as any
            })
        }
        onlineDepositOrders.value = oList

        isInitialized.value = true
    }

    const lockOrder = (orderId: string, processor: string) => {
        const order = withdrawalOrders.value.find(o => o.orderId === orderId)
        if (order && order.status === '待審核') {
            order.status = '審核中'
            order.processor = processor
            order.lockTime = new Date().toISOString().replace('T', ' ').substring(0, 19)
            return true
        }
        return false
    }

    const unlockOrder = (orderId: string) => {
        const order = withdrawalOrders.value.find(o => o.orderId === orderId)
        if (order && order.status === '審核中') {
            order.status = '待審核'
            order.processor = null
            order.lockTime = undefined
            return true
        }
        return false
    }

    const processOrder = (orderId: string, status: '已通過' | '已拒絕') => {
        const order = withdrawalOrders.value.find(o => o.orderId === orderId)
        if (order) {
            order.status = status
            // Unlock after processing? Or keep processor record? Requirement says "Processed", usually lock is cleared or irrelevant.
            // Let's keep processor for history but logically it's done. 
            // order.processor = null // Optional: clear processor if not needed in history
            return true
        }
        return false
    }

    // Locked Orders View (Derived state)
    const lockedOrders = computed(() => {
        return withdrawalOrders.value.filter(o => o.status === '審核中').map(o => ({
            ...o,
            type: '提款審核', // For now only withdrawals have lock logic
            duration: o.lockTime ? Math.floor((Date.now() - new Date(o.lockTime).getTime()) / 60000) + ' 分鐘' : '0 分鐘'
        }))
    })

    return {
        withdrawalOrders,
        manualDepositOrders,
        onlineDepositOrders,
        lockedOrders,
        initData,
        lockOrder,
        unlockOrder,
        processOrder
    }
}
