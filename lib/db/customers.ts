// lib/db/customers.ts
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Customer = Database['public']['Tables']['customers']['Row']
type CustomerInsert = Database['public']['Tables']['customers']['Insert']
type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export const customerService = {
  // ============================================================
  // GET ALL CUSTOMERS
  // ============================================================
  async getAll(companyId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        customer_addresses (*),
        customer_tags (
          tag:customer_tags (*)
        )
      `)
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // ============================================================
  // GET CUSTOMER BY ID
  // ============================================================
  async getById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('customers')
      .select(`
        *,
        customer_addresses (*),
        customer_tags (
          tag:customer_tags (*)
        ),
        orders (
          id,
          order_number,
          total,
          status,
          order_date,
          order_items (*)
        ),
        payments (
          id,
          amount,
          status,
          payment_date
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // GET CUSTOMER SUMMARY (with orders and spending)
  // ============================================================
  async getSummary(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('customer_summary')
      .select('*')
      .eq('customer_id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data || null
  },

  // ============================================================
  // CREATE CUSTOMER
  // ============================================================
  async create(companyId: string, customer: CustomerInsert) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('customers')
      .insert({
        ...customer,
        company_id: companyId,
        customer_code: await this.generateCustomerCode(companyId)
      })
      .select()
      .single()

    if (error) throw error

    // Publish event for realtime updates
    await this.publishCustomerEvent(data.id, 'customer_created')

    return data
  },

  // ============================================================
  // UPDATE CUSTOMER
  // ============================================================
  async update(id: string, customer: CustomerUpdate) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('customers')
      .update(customer)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Publish event for realtime updates
    await this.publishCustomerEvent(data.id, 'customer_updated')

    return data
  },

  // ============================================================
  // DELETE CUSTOMER (soft delete)
  // ============================================================
  async delete(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('customers')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error

    // Publish event for realtime updates
    await this.publishCustomerEvent(id, 'customer_deleted')

    return true
  },

  // ============================================================
  // SEARCH CUSTOMERS
  // ============================================================
  async search(companyId: string, query: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .or(
        `first_name.ilike.%${query}%,` +
        `last_name.ilike.%${query}%,` +
        `email.ilike.%${query}%,` +
        `phone.ilike.%${query}%,` +
        `company_name.ilike.%${query}%`
      )
      .limit(20)

    if (error) throw error
    return data
  },

  // ============================================================
  // GET CUSTOMERS BY TAG
  // ============================================================
  async getByTag(companyId: string, tagId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('customer_tag_assignments')
      .select(`
        customer:customers (*)
      `)
      .eq('tag_id', tagId)
      .eq('customer.company_id', companyId)
      .eq('customer.is_active', true)

    if (error) throw error
    return data.map((item: any) => item.customer)
  },

  // ============================================================
  // ADD TAG TO CUSTOMER
  // ============================================================
  async addTag(customerId: string, tagId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('customer_tag_assignments')
      .insert({ customer_id: customerId, tag_id: tagId })

    if (error) throw error
    return true
  },

  // ============================================================
  // REMOVE TAG FROM CUSTOMER
  // ============================================================
  async removeTag(customerId: string, tagId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('customer_tag_assignments')
      .delete()
      .eq('customer_id', customerId)
      .eq('tag_id', tagId)

    if (error) throw error
    return true
  },

  // ============================================================
  // GET CUSTOMER ADDRESSES
  // ============================================================
  async getAddresses(customerId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', customerId)
      .order('is_default', { ascending: false })

    if (error) throw error
    return data
  },

  // ============================================================
  // ADD CUSTOMER ADDRESS
  // ============================================================
  async addAddress(customerId: string, address: any) {
    const supabase = createClient()
    
    // If this is the default address, unset other defaults
    if (address.is_default) {
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', customerId)
    }

    const { data, error } = await supabase
      .from('customer_addresses')
      .insert({ ...address, customer_id: customerId })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // UPDATE CUSTOMER ADDRESS
  // ============================================================
  async updateAddress(addressId: string, address: any) {
    const supabase = createClient()
    
    // Get customer_id from address
    const { data: addressData } = await supabase
      .from('customer_addresses')
      .select('customer_id')
      .eq('id', addressId)
      .single()

    // If this is the default address, unset other defaults
    if (address.is_default && addressData) {
      await supabase
        .from('customer_addresses')
        .update({ is_default: false })
        .eq('customer_id', addressData.customer_id)
        .neq('id', addressId)
    }

    const { data, error } = await supabase
      .from('customer_addresses')
      .update(address)
      .eq('id', addressId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // DELETE CUSTOMER ADDRESS
  // ============================================================
  async deleteAddress(addressId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('customer_addresses')
      .delete()
      .eq('id', addressId)

    if (error) throw error
    return true
  },

  // ============================================================
  // GET CUSTOMER STATS
  // ============================================================
  async getStats(companyId: string) {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)
      .eq('is_active', true)

    if (error) throw error

    const { data: ordersData } = await supabase
      .from('orders')
      .select('customer_id', { count: 'exact' })
      .eq('company_id', companyId)
      .neq('status', 'cancelled')

    const { data: paymentsData } = await supabase
      .from('payments')
      .select('amount')
      .eq('company_id', companyId)
      .eq('status', 'verified')

    const totalSpent = paymentsData?.reduce((sum, p) => sum + p.amount, 0) || 0

    return {
      totalCustomers: data?.length || 0,
      totalOrders: ordersData?.length || 0,
      totalSpent: totalSpent
    }
  },

  // ============================================================
  // GENERATE CUSTOMER CODE
  // ============================================================
  async generateCustomerCode(companyId: string) {
    const supabase = createClient()
    const prefix = 'CUST'
    const year = new Date().getFullYear().toString().slice(-2)
    
    const { count } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)

    const sequence = String((count || 0) + 1).padStart(4, '0')
    return `${prefix}-${year}-${sequence}`
  },

  // ============================================================
  // PUBLISH CUSTOMER EVENT (for realtime)
  // ============================================================
  async publishCustomerEvent(customerId: string, eventName: string) {
    try {
      const supabase = createClient()
      await supabase.rpc('publish_business_event', {
        p_company_id: await this.getCustomerCompanyId(customerId),
        p_event_name: eventName,
        p_event_category: 'customer',
        p_event_source: 'system',
        p_entity_type: 'customer',
        p_entity_id: customerId,
        p_payload: { customer_id: customerId, event: eventName }
      })
    } catch (error) {
      console.error('Failed to publish customer event:', error)
    }
  },

  // ============================================================
  // HELPER: GET CUSTOMER COMPANY ID
  // ============================================================
  async getCustomerCompanyId(customerId: string) {
    const supabase = createClient()
    const { data } = await supabase
      .from('customers')
      .select('company_id')
      .eq('id', customerId)
      .single()
    return data?.company_id
  }
}