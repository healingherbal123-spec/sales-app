// lib/db/products.ts
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']

export const productService = {
  // ============================================================
  // GET ALL PRODUCTS
  // ============================================================
  async getAll(companyId: string, options?: { 
    category?: string, 
    isService?: boolean,
    includeInactive?: boolean 
  }) {
    const supabase = createClient()
    let query = supabase
      .from('products')
      .select(`
        *,
        category:product_categories (*),
        images:product_images (*),
        prices:product_prices (
          *,
          price_list:price_lists (*)
        ),
        inventory:inventory (
          *,
          warehouse:warehouses (*)
        )
      `)
      .eq('company_id', companyId)

    if (!options?.includeInactive) {
      query = query.eq('is_active', true)
    }

    if (options?.category) {
      query = query.eq('category_id', options.category)
    }

    if (options?.isService !== undefined) {
      query = query.eq('is_service', options.isService)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // ============================================================
  // GET PRODUCT BY ID
  // ============================================================
  async getById(id: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:product_categories (*),
        images:product_images (*),
        prices:product_prices (
          *,
          price_list:price_lists (*)
        ),
        inventory:inventory (
          *,
          warehouse:warehouses (*)
        ),
        customer_prices (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // GET PRODUCT WITH INVENTORY
  // ============================================================
  async getWithInventory(productId: string, warehouseId?: string) {
    const supabase = createClient()
    let query = supabase
      .from('inventory')
      .select(`
        *,
        product:products (*),
        warehouse:warehouses (*)
      `)
      .eq('product_id', productId)

    if (warehouseId) {
      query = query.eq('warehouse_id', warehouseId)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  // ============================================================
  // CREATE PRODUCT
  // ============================================================
  async create(companyId: string, product: ProductInsert) {
    const supabase = createClient()
    
    // Generate SKU if not provided
    if (!product.sku) {
      product.sku = await this.generateSKU(companyId, product.name)
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        ...product,
        company_id: companyId
      })
      .select()
      .single()

    if (error) throw error

    // Initialize inventory for this product
    await this.initializeInventory(companyId, data.id)

    // Publish event for realtime updates
    await this.publishProductEvent(data.id, 'product_created')

    return data
  },

  // ============================================================
  // UPDATE PRODUCT
  // ============================================================
  async update(id: string, product: ProductUpdate) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Publish event for realtime updates
    await this.publishProductEvent(data.id, 'product_updated')

    return data
  },

  // ============================================================
  // DELETE PRODUCT (soft delete)
  // ============================================================
  async delete(id: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('products')
      .update({ is_active: false })
      .eq('id', id)

    if (error) throw error

    // Publish event for realtime updates
    await this.publishProductEvent(id, 'product_deleted')

    return true
  },

  // ============================================================
  // SEARCH PRODUCTS
  // ============================================================
  async search(companyId: string, query: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:product_categories (*),
        inventory:inventory (*)
      `)
      .eq('company_id', companyId)
      .eq('is_active', true)
      .or(
        `name.ilike.%${query}%,` +
        `sku.ilike.%${query}%,` +
        `barcode.ilike.%${query}%,` +
        `brand.ilike.%${query}%`
      )
      .limit(20)

    if (error) throw error
    return data
  },

  // ============================================================
  // GET PRODUCT PRICING
  // ============================================================
  async getPricing(productId: string, customerId?: string) {
    const supabase = createClient()
    
    // Get global prices
    const { data: globalPrices } = await supabase
      .from('product_prices')
      .select(`
        *,
        price_list:price_lists (*)
      `)
      .eq('product_id', productId)
      .eq('is_active', true)

    // Get customer-specific prices
    let customerPrices = null
    if (customerId) {
      const { data } = await supabase
        .from('customer_prices')
        .select('*')
        .eq('product_id', productId)
        .eq('customer_id', customerId)
        .eq('is_active', true)
      
      customerPrices = data
    }

    return {
      global: globalPrices || [],
      customer: customerPrices || []
    }
  },

  // ============================================================
  // SET PRODUCT PRICE
  // ============================================================
  async setPrice(productId: string, priceListId: string, price: number) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('product_prices')
      .insert({
        product_id: productId,
        price_list_id: priceListId,
        price: price,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // SET CUSTOMER PRICE
  // ============================================================
  async setCustomerPrice(productId: string, customerId: string, price: number) {
    const supabase = createClient()
    
    // Check if price exists
    const { data: existing } = await supabase
      .from('customer_prices')
      .select('id')
      .eq('product_id', productId)
      .eq('customer_id', customerId)
      .single()

    let result
    if (existing) {
      const { data, error } = await supabase
        .from('customer_prices')
        .update({ price, is_active: true })
        .eq('id', existing.id)
        .select()
        .single()
      
      if (error) throw error
      result = data
    } else {
      const { data, error } = await supabase
        .from('customer_prices')
        .insert({
          product_id: productId,
          customer_id: customerId,
          price: price,
          is_active: true
        })
        .select()
        .single()
      
      if (error) throw error
      result = data
    }

    return result
  },

  // ============================================================
  // GET PRODUCT IMAGES
  // ============================================================
  async getImages(productId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('is_primary', { ascending: false })
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data
  },

  // ============================================================
  // ADD PRODUCT IMAGE
  // ============================================================
  async addImage(productId: string, imageUrl: string, isPrimary: boolean = false) {
    const supabase = createClient()
    
    // If this is the primary image, unset other primary images
    if (isPrimary) {
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId)
    }

    const { data, error } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        image_url: imageUrl,
        is_primary: isPrimary
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // REMOVE PRODUCT IMAGE
  // ============================================================
  async removeImage(imageId: string) {
    const supabase = createClient()
    const { error } = await supabase
      .from('product_images')
      .delete()
      .eq('id', imageId)

    if (error) throw error
    return true
  },

  // ============================================================
  // GET PRODUCT CATEGORIES
  // ============================================================
  async getCategories(companyId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return data
  },

  // ============================================================
  // CREATE PRODUCT CATEGORY
  // ============================================================
  async createCategory(companyId: string, category: any) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('product_categories')
      .insert({
        ...category,
        company_id: companyId
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // GET LOW STOCK PRODUCTS
  // ============================================================
  async getLowStock(companyId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        product:products (*),
        warehouse:warehouses (*)
      `)
      .eq('company_id', companyId)
      .lt('quantity', supabase.raw('reorder_level'))

    if (error) throw error
    return data
  },

  // ============================================================
  // GET PRODUCT STATS
  // ============================================================
  async getStats(companyId: string) {
    const supabase = createClient()
    
    const { data: products } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId)
      .eq('is_active', true)

    const { data: lowStock } = await supabase
      .from('inventory')
      .select('*', { count: 'exact' })
      .eq('company_id', companyId)
      .lt('quantity', supabase.raw('reorder_level'))

    const { data: inventory } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('company_id', companyId)

    const totalStock = inventory?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0

    return {
      totalProducts: products?.length || 0,
      lowStockItems: lowStock?.length || 0,
      totalStock: totalStock
    }
  },

  // ============================================================
  // GENERATE SKU
  // ============================================================
  async generateSKU(companyId: string, productName: string) {
    const supabase = createClient()
    const prefix = productName.substring(0, 3).toUpperCase()
    const year = new Date().getFullYear().toString().slice(-2)
    
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', companyId)

    const sequence = String((count || 0) + 1).padStart(4, '0')
    return `${prefix}-${year}-${sequence}`
  },

  // ============================================================
  // INITIALIZE INVENTORY FOR PRODUCT
  // ============================================================
  async initializeInventory(companyId: string, productId: string) {
    const supabase = createClient()
    
    // Get default warehouse
    const { data: warehouse } = await supabase
      .from('warehouses')
      .select('id')
      .eq('company_id', companyId)
      .eq('is_active', true)
      .limit(1)
      .single()

    if (warehouse) {
      const { error } = await supabase
        .from('inventory')
        .insert({
          company_id: companyId,
          product_id: productId,
          warehouse_id: warehouse.id,
          quantity: 0,
          reorder_level: 5
        })

      if (error) throw error
    }

    return true
  },

  // ============================================================
  // PUBLISH PRODUCT EVENT (for realtime)
  // ============================================================
  async publishProductEvent(productId: string, eventName: string) {
    try {
      const supabase = createClient()
      const { data: product } = await supabase
        .from('products')
        .select('company_id')
        .eq('id', productId)
        .single()

      if (product) {
        await supabase.rpc('publish_business_event', {
          p_company_id: product.company_id,
          p_event_name: eventName,
          p_event_category: 'product',
          p_event_source: 'system',
          p_entity_type: 'product',
          p_entity_id: productId,
          p_payload: { product_id: productId, event: eventName }
        })
      }
    } catch (error) {
      console.error('Failed to publish product event:', error)
    }
  }
}