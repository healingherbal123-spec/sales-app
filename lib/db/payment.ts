// lib/db/payments.ts
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Payment = Database['public']['Tables']['payments']['Row']
type PaymentInsert = Database['public']['Tables']['payments']['Insert']

export const paymentService = {
  // ============================================================
  // GET ALL PAYMENTS
  // ============================================================
  async getAll(companyId: string, filters?: {
    status?: string,
    customerId?: string,
    orderId?: string,
    dateFrom?: string,
    dateTo?: string
  }) {
    const supabase = createClient()
    let query = supabase
      .from('payments')
      .select(`
        *,
        customer:customers (*),
        order:orders (*),
        evidence:payment_evidence (*),
        verified_by:profiles (*)
      `)
      .eq('company_id', companyId)

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId)
    }

    if (filters?.orderId) {
      query = query.eq('order_id', filters.orderId)
    }

    if (filters?.dateFrom) {
      query = query.gte('payment_date', filters.dateFrom)
    }

    if (filters?.dateTo) {
      query = query.lte('payment_date', filters.dateTo)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // ============================================================
  // GET PAYMENT BY ID
  // ============================================================
  async getById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        customer:customers (*),
        order:orders (*),
        evidence:payment_evidence (*),
        verified_by:profiles (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // CREATE PAYMENT
  // ============================================================
  async create(companyId: string, payment: PaymentInsert) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('payments')
      .insert({
        ...payment,
        company_id: companyId,
        payment_number: await this.generatePaymentNumber(companyId)
      })
      .select()
      .single()

    if (error) throw error

    // Update order balance
    if (payment.order_id) {
      await this.updateOrderBalance(payment.order_id)
    }

    // Publish event for realtime updates
    await this.publishPaymentEvent(data.id, 'payment_created')

    return data
  },

  // ============================================================
  // UPDATE PAYMENT
  // ============================================================
  async update(id: string, payment: Partial<PaymentInsert>) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('payments')
      .update(payment)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Update order balance
    if (data.order_id) {
      await this.updateOrderBalance(data.order_id)
    }

    // Publish event for realtime updates
    await this.publishPaymentEvent(data.id, 'payment_updated')

    return data
  },

  // ============================================================
  // VERIFY PAYMENT
  // ============================================================
  async verify(id: string, verifiedBy: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: 'verified',
        verified_by: verifiedBy,
        verified_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Update order balance
    if (data.order_id) {
      await this.updateOrderBalance(data.order_id)
    }

    // Publish event for realtime updates
    await this.publishPaymentEvent(data.id, 'payment_verified')

    return data
  },

  // ============================================================
  // UPLOAD PAYMENT EVIDENCE
  // ============================================================
  async uploadEvidence(paymentId: string, file: {
    file_url: string,
    file_name: string,
    file_type?: string
  }) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('payment_evidence')
      .insert({
        payment_id: paymentId,
        file_url: file.file_url,
        file_name: file.file_name,
        file_type: file.file_type || 'image'
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // GET PAYMENT EVIDENCE
  // ============================================================
  async getEvidence(paymentId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('payment_evidence')
      .select('*')
      .eq('payment_id', paymentId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // ============================================================
  // REFUND PAYMENT
  // ============================================================
  async refund(id: string, reason: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: 'refunded',
        notes: `Refunded: ${reason}`
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Update order balance
    if (data.order_id) {
      await this.updateOrderBalance(data.order_id)
    }

    // Publish event for realtime updates
    await this.publishPaymentEvent(data.id, 'payment_refunded')

    return data
  },

  // ============================================================
  // UPDATE ORDER BALANCE
  // ============================================================
  async updateOrderBalance(orderId: string) {
    const supabase = createClient()
    
    // Get order total
    const { data: order } = await supabase
      .from('orders')
      .select('total')
      .eq('id', orderId)
      .single()

    if (!order) return

    // Get verified payments
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('order_id', orderId)
      .eq('status', 'verified')

    const paidAmount = payments?.reduce((sum, p) => sum + p.amount, 0) || 0
    const balanceDue = order.total - paidAmount

    await supabase
      .from('orders')
      .update({
        paid_amount: paidAmount,
        balance_due: balanceDue
      })
      .eq('id', orderId)

    return { paidAmount, balanceDue }
  },

  // ============================================================
  // GET OUTSTANDING BALANCES
  // ============================================================
  async getOutstanding(companyId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        customer:customers (*),
        total,
        paid_amount,
        balance_due
      `)
      .eq('company_id', companyId)
      .gt('balance_due', 0)
      .neq('status', 'cancelled')
      .order('balance_due', { ascending: false })

    if (error) throw error
    return data
  },

  // ============================================================
  // GET PAYMENT STATS
  // ============================================================
  async getStats(companyId: string) {
    const supabase = createClient()
    
    const { data: allPayments } = await supabase
      .from('payments')
      .select('status, amount')
      .eq('company_id', companyId)

    const totalPayments = allPayments?.length || 0
    const totalAmount = allPayments?.reduce((sum, p) => sum + p.amount, 0) || 0
    
    const verifiedPayments = allPayments?.filter(p => p.status === 'verified').length || 0
    const pendingPayments = allPayments?.filter(p => p.status === 'pending').length || 0
    const failedPayments = allPayments?.filter(p => p.status === 'failed').length || 0

    return {
      totalPayments,
      totalAmount,
      verifiedPayments,
      pendingPayments,
      failedPayments,
      verificationRate: totalPayments > 0 ? (verifiedPayments / totalPayments) * 100 : 0
    }
  },

  // ============================================================
  // GENERATE PAYMENT NUMBER
  // ============================================================
  async generatePaymentNumber(companyId: string) {
    const supabase = createClient()
    const prefix = 'PAY'
    const year = new Date().getFullYear().toString().slice(-2)
    
    const { count } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)

    const sequence = String((count || 0) + 1).padStart(4, '0')
    return `${prefix}-${year}-${sequence}`
  },

  // ============================================================
  // PUBLISH PAYMENT EVENT (for realtime)
  // ============================================================
  async publishPaymentEvent(paymentId: string, eventName: string) {
    try {
      const supabase = createClient()
      const { data: payment } = await supabase
        .from('payments')
        .select('company_id')
        .eq('id', paymentId)
        .single()

      if (payment) {
        await supabase.rpc('publish_business_event', {
          p_company_id: payment.company_id,
          p_event_name: eventName,
          p_event_category: 'payment',
          p_event_source: 'system',
          p_entity_type: 'payment',
          p_entity_id: paymentId,
          p_payload: { payment_id: paymentId, event: eventName }
        })
      }
    } catch (error) {
      console.error('Failed to publish payment event:', error)
    }
  }
}