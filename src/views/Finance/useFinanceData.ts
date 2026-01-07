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
    // Manual Deposit Fields
    remark?: string
    applicant?: string
    attachmentUrl?: string
    memberSnapshot?: { currentBalance: number, recentDepositCount: number, recentDepositTotal: number }
    // Online Deposit Fields
    fee?: number
    actualAmount?: number
    callbackStatus?: 'received' | 'pending'
    dispatchStatus?: 'success' | 'failed' | 'pending'
    paymentChannel?: string
    lifecycleLogs?: Array<{ time: string, event: string, status: string }>
    rawCallbackJson?: string
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
        // Force some pending + some with long lock times for testing
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
            rollover: { required: 100000, current: 80000 },
            financialStats: { totalDeposit: 500000, totalWithdrawal: 200000, balance: 350000 },
            tags: ['VIP', '高風險']
        })

        // Add timeout test cases - locked > 20 minutes
        wList.push({
            id: 1001,
            orderId: `WD${20240107888}`,
            memberId: `user_timeout1`,
            amount: 25000,
            fee: 250,
            actualAmount: 24750,
            applyTime: new Date(Date.now() - 1500000).toISOString().replace('T', ' ').substring(0, 19),
            status: '審核中',
            processor: 'Admin',
            lockTime: new Date(Date.now() - 1500000).toISOString().replace('T', ' ').substring(0, 19), // 25 min ago
            rollover: { required: 25000, current: 25000 },
            financialStats: { totalDeposit: 100000, totalWithdrawal: 50000, balance: 50000 },
            tags: []
        })

        wList.push({
            id: 1002,
            orderId: `WD${20240107777}`,
            memberId: `user_timeout2`,
            amount: 15000,
            fee: 150,
            actualAmount: 14850,
            applyTime: new Date(Date.now() - 2000000).toISOString().replace('T', ' ').substring(0, 19),
            status: '審核中',
            processor: 'OperatorB',
            lockTime: new Date(Date.now() - 2000000).toISOString().replace('T', ' ').substring(0, 19), // 33 min ago
            rollover: { required: 15000, current: 15000 },
            financialStats: { totalDeposit: 80000, totalWithdrawal: 30000, balance: 50000 },
            tags: []
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
        const channels = ['NetBank', 'USDT', 'iOS', 'GP']

        for (let i = 0; i < 30; i++) {
            const amount = Math.floor(Math.random() * 50000) * 10
            const fee = Math.floor(amount * 0.02)
            const actualAmount = amount - fee
            const status = oStatuses[Math.floor(Math.random() * oStatuses.length)] as any
            const merchant = merchants[Math.floor(Math.random() * merchants.length)]
            const channel = channels[Math.floor(Math.random() * channels.length)]

            // Anomalies: Paid but Dispatch Failed
            let dispatchStatus: 'success' | 'failed' | 'pending' = 'pending'
            let callbackStatus: 'received' | 'pending' = 'pending'

            if (status === '支付成功') {
                callbackStatus = 'received'
                // 10% chance fail dispatch
                dispatchStatus = Math.random() > 0.9 ? 'failed' : 'success'
            } else if (status === '支付失敗') {
                callbackStatus = 'received'
                dispatchStatus = 'failed'
            }

            const logs = [
                { time: new Date(Date.now() - 100000).toISOString(), event: '訂單創建', status: 'Success' },
                { time: new Date(Date.now() - 80000).toISOString(), event: '提交三方', status: 'Success' },
            ]
            if (callbackStatus === 'received') {
                logs.push({ time: new Date(Date.now() - 50000).toISOString(), event: '接收回調', status: 'Success' })
            }
            if (status === '支付成功') {
                if (dispatchStatus === 'success') {
                    logs.push({ time: new Date(Date.now() - 40000).toISOString(), event: '派發點數', status: 'Success' })
                } else {
                    logs.push({ time: new Date(Date.now() - 40000).toISOString(), event: '派發點數', status: 'Failed' })
                }
            }

            oList.push({
                id: i,
                orderId: `OD${20240107000 + i}`,
                memberId: `user${2000 + i}`,
                merchant: merchant,
                type: channel!, // Assert non-null as we know the array exists
                amount: amount,
                fee: fee,
                actualAmount: actualAmount,
                applyTime: new Date(Date.now() - Math.floor(Math.random() * 86400 * 1000)).toISOString().replace('T', ' ').substring(0, 19),
                status: status,
                callbackStatus: callbackStatus,
                dispatchStatus: dispatchStatus,
                paymentChannel: channel,
                lifecycleLogs: logs,
                rawCallbackJson: JSON.stringify({
                    order_id: `OD${20240107000 + i}`,
                    amount: amount,
                    merch_id: merchant?.split(' ')[0] || 'UNKNOWN',
                    timestamp: Date.now(),
                    sign: 'e8f90a887...321',
                    status: status === '支付成功' ? 'PAID' : 'FAILED'
                }, null, 2)
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

    const reissueOrder = (orderId: string) => {
        const order = onlineDepositOrders.value.find(o => o.orderId === orderId)
        if (order && order.status === '支付成功' && order.dispatchStatus === 'failed') {
            order.dispatchStatus = 'success'
            order.lifecycleLogs?.push({
                time: new Date().toISOString(),
                event: '手動補發',
                status: 'Success'
            })
            return true
        }
        return false
    }

    // Locked Orders View (Derived state)
    const lockedOrders = computed(() => {
        return withdrawalOrders.value.filter(o => o.status === '審核中').map(o => ({
            orderId: o.orderId,
            businessType: '提款審核',
            processor: o.processor || 'Unknown',
            lockTime: o.lockTime || new Date().toISOString(),
            amount: o.amount
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
        processOrder,
        reissueOrder
    }
}
