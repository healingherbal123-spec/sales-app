// lib/db/orders.ts
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Order = Database['public']['Tables']['orders']['Row']
type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']

export const orderService = {
  // ============================================================
  // GET ALL ORDERS
  // ============================================================
  async getAll(companyId: string, filters?: {
    status?: string,
    customerId?: string,
    dateFrom?: string,
    dateTo?: string,
    limit?: number
  }) {
    const supabase = createClient()
    let query = supabase
      .from('orders')
      .select(`
        *,
        customer:customers (*),
        items:order_items (*),
        payments:payments (*),
        deliveries:deliveries (*)
      `)
      .eq('company_id', companyId)

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.customerId) {
      query = query.eq('customer_id', filters.customerId)
    }

    if (filters?.dateFrom) {
      query = query.gte('order_date', filters.dateFrom)
    }

    if (filters?.dateTo) {
      query = query.lte('order_date', filters.dateTo)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // ============================================================
  // GET ORDER BY ID
  // ============================================================
  async getById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers (*),
        items:order_items (
          *,
          product:products (*)
        ),
        payments:payments (*),
        deliveries:deliveries (*),
        status_history:order_status_history (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // GET ORDER BY ORDER NUMBER
  // ============================================================
  async getByOrderNumber(orderNumber: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers (*),
        items:order_items (*),
        payments:payments (*)
      `)
      .eq('order_number', orderNumber)
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // CREATE ORDER
  // ============================================================
  async create(companyId: string, order: {
    customer_id: string,
    branch_id?: string,
    items: Array<{
      product_id: string,
      quantity: number,
      unit_price: number,
      discount?: number,
      tax?: number
    }>,
    shipping_address?: any,
    billing_address?: any,
    notes?: string,
    discount?: number,
    shipping_fee?: number,
    tax?: number,
    currency?: string
  }) {
    const supabase = createClient()
    
    // Calculate totals
    let subtotal = 0
    for (const item of order.items) {
      const itemTotal = (item.unit_price * item.quantity) - (item.discount || 0)
      subtotal += itemTotal
    }

    const discount = order.discount || 0
    const tax = order.tax || 0
    const shippingFee = order.shipping_fee || 0
    const total = subtotal - discount + tax + shippingFee

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        company_id: companyId,
        customer_id: order.customer_id,
        branch_id: order.branch_id,
        status: 'draft',
        currency: order.currency || 'NGN',
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        shipping_fee: shippingFee,
        total: total,
        shipping_address: order.shipping_address,
        billing_address: order.billing_address,
        notes: order.notes,
        order_date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    for (const item of order.items) {
      const itemTotal = (item.unit_price * item.quantity) - (item.discount || 0) + (item.tax || 0)
      
      const { error: itemError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderData.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          discount: item.discount || 0,
          tax: item.tax || 0,
          total: itemTotal
        })

      if (itemError) throw itemError
    }

    // Add order status history
    await this.addStatusHistory(orderData.id, 'draft', 'Order created')

    // Publish event for realtime updates
    await this.publishOrderEvent(orderData.id, 'order_created')

    return orderData
  },

  // ============================================================
  // UPDATE ORDER
  // ============================================================
  async update(id: string, order: OrderUpdate) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .update(order)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Publish event for realtime updates
    await this.publishOrderEvent(data.id, 'order_updated')

    return data
  },

  // ============================================================
  // UPDATE ORDER STATUS
  // ============================================================
  async updateStatus(id: string, status: string, notes?: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Add status history
    await this.addStatusHistory(id, status, notes)

    // If order is delivered, update inventory
    if (status === 'delivered') {
      await this.updateInventoryAfterDelivery(id)
    }

    // Publish event for realtime updates
    await this.publishOrderEvent(data.id, `order_${status}`)

    return data
  },

  // ============================================================
  // ADD ORDER ITEM
  // ============================================================
  async addItem(orderId: string, item: {
    product_id: string,
    quantity: number,
    unit_price: number,
    discount?: number,
    tax?: number
  }) {
    const supabase = createClient()
    
    const itemTotal = (item.unit_price * item.quantity) - (item.discount || 0) + (item.tax || 0)

    const { data, error } = await supabase
      .from('order_items')
      .insert({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        discount: item.discount || 0,
        tax: item.tax || 0,
        total: itemTotal
      })
      .select()
      .single()

    if (error) throw error

    // Recalculate order totals
    await this.recalculateTotals(orderId)

    return data
  },

  // ============================================================
  // REMOVE ORDER ITEM
  // ============================================================
  async removeItem(orderId: string, itemId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('order_items')
      .delete()
      .eq('id', itemId)
      .eq('order_id', orderId)

    if (error) throw error

    // Recalculate order totals
    await this.recalculateTotals(orderId)

    return true
  },

  // ============================================================
  // UPDATE ORDER ITEM
  // ============================================================
  async updateItem(itemId: string, updates: {
    quantity?: number,
    unit_price?: number,
    discount?: number,
    tax?: number
  }) {
    const supabase = createClient()
    
    // Get current item
    const { data: current } = await supabase
      .from('order_items')
      .select('*')
      .eq('id', itemId)
      .single()

    if (!current) throw new Error('Item not found')

    // Calculate new total
    const quantity = updates.quantity || current.quantity
    const unitPrice = updates.unit_price || current.unit_price
    const discount = updates.discount || current.discount
    const tax = updates.tax || current.tax
    const total = (unitPrice * quantity) - discount + tax

    const { data, error } = await supabase
      .from('order_items')
      .update({
        quantity,
        unit_price: unitPrice,
        discount,
        tax,
        total
      })
      .eq('id', itemId)
      .select()
      .single()

    if (error) throw error

    // Recalculate order totals
    await this.recalculateTotals(current.order_id)

    return data
  },

  // ============================================================
  // RECALCULATE ORDER TOTALS
  // ============================================================
  async recalculateTotals(orderId: string) {
    const supabase = createClient()
    
    // Get all items
    const { data: items } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (!items) return

    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const discount = 0 // You can get this from order
    const tax = 0 // You can get this from order
    const shippingFee = 0 // You can get this from order
    const total = subtotal - discount + tax + shippingFee

    const { error } = await supabase
      .from('orders')
      .update({
        subtotal,
        total,
        discount,
        tax,
        shipping_fee: shippingFee
      })
      .eq('id', orderId)

    if (error) throw error
  },

  // ============================================================
  // ADD STATUS HISTORY
  // ============================================================
  async addStatusHistory(orderId: string, status: string, notes?: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status: status,
        notes: notes || ''
      })

    if (error) throw error
  },

  // ============================================================
  // CANCEL ORDER
  // ============================================================
  async cancel(id: string, reason: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        notes: `Cancelled: ${reason}`
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    await this.addStatusHistory(id, 'cancelled', reason)

    // Publish event for realtime updates
    await this.publishOrderEvent(data.id, 'order_cancelled')

    return data
  },

  // ============================================================
  // UPDATE INVENTORY AFTER DELIVERY
  // ============================================================
  async updateInventoryAfterDelivery(orderId: string) {
    const supabase = createClient()
    
    // Get order items
    const { data: items } = await supabase
      .from('order_items')
      .select('product_id, quantity')
      .eq('order_id', orderId)

    if (!items) return

    for (const item of items) {
      // Get product inventory
      const { data: inventory } = await supabase
        .from('inventory')
        .select('id, quantity')
        .eq('product_id', item.product_id)
        .single()

      if (inventory) {
        // Reduce inventory
        await supabase
          .from('inventory')
          .update({ 
            quantity: inventory.quantity - item.quantity 
          })
          .eq('id', inventory.id)
      }
    }
  },

  // ============================================================
  // GET ORDER STATS
  // ============================================================
  async getStats(companyId: string) {
    const supabase = createClient()
    
    const { data: allOrders } = await supabase
      .from('orders')
      .select('status, total')
      .eq('company_id', companyId)

    const totalOrders = allOrders?.length || 0
    const totalRevenue = allOrders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0
    
    const pendingOrders = allOrders?.filter(o => o.status === 'pending').length || 0
    const completedOrders = allOrders?.filter(o => o.status === 'delivered').length || 0
    const cancelledOrders = allOrders?.filter(o => o.status === 'cancelled').length || 0

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      conversionRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0
    }
  },

  // ============================================================
  // GET SALES REPORT
  // ============================================================
  async getSalesReport(companyId: string, dateFrom: string, dateTo: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers (*),
        items:order_items (*)
      `)
      .eq('company_id', companyId)
      .gte('order_date', dateFrom)
      .lte('order_date', dateTo)
      .neq('status', 'cancelled')
      .order('order_date', { ascending: true })

    if (error) throw error

    // Group by date
    const report: any = {}
    for (const order of data || []) {
      const date = order.order_date
      if (!report[date]) {
        report[date] = {
          date,
          orders: 0,
          revenue: 0,
          items: 0
        }
      }
      report[date].orders += 1
      report[date].revenue += order.total || 0
      report[date].items += order.items?.length || 0
    }

    return Object.values(report)
  },

  // ============================================================
  // PUBLISH ORDER EVENT (for realtime)
  // ============================================================
  async publishOrderEvent(orderId: string, eventName: string) {
    try {
      const supabase = createClient()
      const { data: order } = await supabase
        .from('orders')
        .select('company_id')
        .eq('id', orderId)
        .single()

      if (order) {
        await supabase.rpc('publish_business_event', {
          p_company_id: order.company_id,
          p_event_name: eventName,
          p_event_category: 'order',
          p_event_source: 'system',
          p_entity_type: 'order',
          p_entity_id: orderId,
          p_payload: { order_id: orderId, event: eventName }
        })
      }
    } catch (error) {
      console.error('Failed to publish order event:', error)
    }
  }
}