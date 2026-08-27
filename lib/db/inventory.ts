// lib/db/inventory.ts
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

type Inventory = Database['public']['Tables']['inventory']['Row']
type StockMovement = Database['public']['Tables']['stock_movements']['Row']

export const inventoryService = {
  // ============================================================
  // GET ALL INVENTORY
  // ============================================================
  async getAll(companyId: string, options?: {
    warehouseId?: string,
    productId?: string,
    lowStockOnly?: boolean
  }) {
    const supabase = createClient()
    let query = supabase
      .from('inventory')
      .select(`
        *,
        product:products (*),
        warehouse:warehouses (*)
      `)
      .eq('company_id', companyId)

    if (options?.warehouseId) {
      query = query.eq('warehouse_id', options.warehouseId)
    }

    if (options?.productId) {
      query = query.eq('product_id', options.productId)
    }

    if (options?.lowStockOnly) {
      query = query.lt('quantity', supabase.raw('reorder_level'))
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  // ============================================================
  // GET STOCK BY PRODUCT
  // ============================================================
  async getStockByProduct(productId: string, warehouseId?: string) {
    const supabase = createClient()
    let query = supabase
      .from('inventory')
      .select(`
        *,
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
  // GET STOCK BY WAREHOUSE
  // ============================================================
  async getStockByWarehouse(warehouseId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('inventory')
      .select(`
        *,
        product:products (*)
      `)
      .eq('warehouse_id', warehouseId)

    if (error) throw error
    return data
  },

  // ============================================================
  // RECORD STOCK MOVEMENT
  // ============================================================
  async recordMovement(
    companyId: string,
    movement: {
      product_id: string,
      warehouse_id: string,
      movement_type: 'in' | 'out' | 'transfer' | 'adjustment' | 'return',
      quantity: number,
      reference_type?: string,
      reference_id?: string,
      notes?: string,
      performed_by?: string
    }
  ) {
    const supabase = createClient()
    
    // Get current inventory
    const { data: currentInventory } = await supabase
      .from('inventory')
      .select('id, quantity')
      .eq('product_id', movement.product_id)
      .eq('warehouse_id', movement.warehouse_id)
      .single()

    let previousQuantity = 0
    let newQuantity = 0

    if (currentInventory) {
      previousQuantity = currentInventory.quantity
      
      // Calculate new quantity based on movement type
      switch (movement.movement_type) {
        case 'in':
          newQuantity = previousQuantity + movement.quantity
          break
        case 'out':
          newQuantity = previousQuantity - movement.quantity
          break
        case 'adjustment':
          newQuantity = movement.quantity // quantity is the new total
          break
        case 'transfer':
        case 'return':
          newQuantity = previousQuantity + movement.quantity
          break
        default:
          newQuantity = previousQuantity
      }

      // Update inventory
      await supabase
        .from('inventory')
        .update({
          quantity: newQuantity,
          last_counted_at: new Date().toISOString()
        })
        .eq('id', currentInventory.id)
    } else {
      // Create inventory record
      const { data: newInv } = await supabase
        .from('inventory')
        .insert({
          company_id: companyId,
          product_id: movement.product_id,
          warehouse_id: movement.warehouse_id,
          quantity: movement.movement_type === 'out' ? 0 : movement.quantity,
          reorder_level: 5
        })
        .select()
        .single()

      if (newInv) {
        previousQuantity = 0
        newQuantity = newInv.quantity
      }
    }

    // Record movement
    const { data, error } = await supabase
      .from('stock_movements')
      .insert({
        company_id: companyId,
        product_id: movement.product_id,
        warehouse_id: movement.warehouse_id,
        movement_type: movement.movement_type,
        quantity: movement.quantity,
        previous_quantity: previousQuantity,
        new_quantity: newQuantity,
        reference_type: movement.reference_type,
        reference_id: movement.reference_id,
        notes: movement.notes,
        performed_by: movement.performed_by
      })
      .select()
      .single()

    if (error) throw error

    // Check for low stock alert
    await this.checkLowStock(companyId, movement.product_id, movement.warehouse_id)

    // Publish event for realtime updates
    await this.publishInventoryEvent(movement.product_id, 'stock_movement')

    return data
  },

  // ============================================================
  // CHECK LOW STOCK
  // ============================================================
  async checkLowStock(companyId: string, productId: string, warehouseId: string) {
    const supabase = createClient()
    
    const { data: inventory } = await supabase
      .from('inventory')
      .select('quantity, reorder_level')
      .eq('product_id', productId)
      .eq('warehouse_id', warehouseId)
      .single()

    if (inventory && inventory.quantity < inventory.reorder_level) {
      // Check if alert already exists
      const { data: existing } = await supabase
        .from('low_stock_alerts')
        .select('id')
        .eq('product_id', productId)
        .eq('warehouse_id', warehouseId)
        .eq('status', 'active')
        .single()

      if (!existing) {
        await supabase
          .from('low_stock_alerts')
          .insert({
            company_id: companyId,
            product_id: productId,
            warehouse_id: warehouseId,
            current_quantity: inventory.quantity,
            reorder_level: inventory.reorder_level,
            status: 'active'
          })
      }
    }
  },

  // ============================================================
  // GET STOCK MOVEMENTS
  // ============================================================
  async getMovements(productId: string, limit?: number) {
    const supabase = createClient()
    let query = supabase
      .from('stock_movements')
      .select(`
        *,
        product:products (*),
        warehouse:warehouses (*),
        performed_by:profiles (*)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) throw error
    return data
  },

  // ============================================================
  // TRANSFER STOCK
  // ============================================================
  async transferStock(
    companyId: string,
    transfer: {
      from_warehouse_id: string,
      to_warehouse_id: string,
      items: Array<{
        product_id: string,
        quantity: number
      }>,
      notes?: string,
      created_by?: string
    }
  ) {
    const supabase = createClient()
    
    // Create transfer record
    const { data: transferRecord, error: transferError } = await supabase
      .from('stock_transfers')
      .insert({
        company_id: companyId,
        from_warehouse_id: transfer.from_warehouse_id,
        to_warehouse_id: transfer.to_warehouse_id,
        notes: transfer.notes,
        created_by: transfer.created_by,
        status: 'pending'
      })
      .select()
      .single()

    if (transferError) throw transferError

    // Add transfer items
    for (const item of transfer.items) {
      await supabase
        .from('stock_transfer_items')
        .insert({
          transfer_id: transferRecord.id,
          product_id: item.product_id,
          quantity: item.quantity
        })

      // Record out movement from source warehouse
      await this.recordMovement(companyId, {
        product_id: item.product_id,
        warehouse_id: transfer.from_warehouse_id,
        movement_type: 'transfer',
        quantity: item.quantity,
        reference_type: 'transfer',
        reference_id: transferRecord.id,
        notes: `Transfer to ${transfer.to_warehouse_id}`
      })
    }

    return transferRecord
  },

  // ============================================================
  // COMPLETE TRANSFER
  // ============================================================
  async completeTransfer(transferId: string, approvedBy: string) {
    const supabase = createClient()
    
    // Get transfer items
    const { data: transferItems } = await supabase
      .from('stock_transfer_items')
      .select('product_id, quantity')
      .eq('transfer_id', transferId)

    if (!transferItems) return

    // Get transfer details
    const { data: transfer } = await supabase
      .from('stock_transfers')
      .select('company_id, to_warehouse_id')
      .eq('id', transferId)
      .single()

    if (!transfer) return

    // Record in movement to destination warehouse
    for (const item of transferItems) {
      await this.recordMovement(transfer.company_id, {
        product_id: item.product_id,
        warehouse_id: transfer.to_warehouse_id,
        movement_type: 'in',
        quantity: item.quantity,
        reference_type: 'transfer',
        reference_id: transferId,
        notes: `Transfer completed from ${transferId}`
      })
    }

    // Update transfer status
    const { data, error } = await supabase
      .from('stock_transfers')
      .update({
        status: 'completed',
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      })
      .eq('id', transferId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // GET LOW STOCK ALERTS
  // ============================================================
  async getLowStockAlerts(companyId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('low_stock_alerts')
      .select(`
        *,
        product:products (*),
        warehouse:warehouses (*)
      `)
      .eq('company_id', companyId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // ============================================================
  // RESOLVE LOW STOCK ALERT
  // ============================================================
  async resolveLowStockAlert(alertId: string) {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('low_stock_alerts')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString()
      })
      .eq('id', alertId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // ============================================================
  // GET WAREHOUSE STATS
  // ============================================================
  async getWarehouseStats(companyId: string) {
    const supabase = createClient()
    
    const { data: warehouses } = await supabase
      .from('warehouses')
      .select('id, name')
      .eq('company_id', companyId)
      .eq('is_active', true)

    if (!warehouses) return null

    const stats = []
    for (const warehouse of warehouses) {
      const { data: inventory } = await supabase
        .from('inventory')
        .select('quantity')
        .eq('warehouse_id', warehouse.id)

      const totalItems = inventory?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0
      const uniqueProducts = inventory?.filter(i => i.quantity > 0).length || 0

      stats.push({
        id: warehouse.id,
        name: warehouse.name,
        totalItems,
        uniqueProducts,
        isEmpty: totalItems === 0
      })
    }

    return stats
  },

  // ============================================================
  // GET INVENTORY STATS
  // ============================================================
  async getStats(companyId: string) {
    const supabase = createClient()
    
    const { data: inventory } = await supabase
      .from('inventory')
      .select('quantity, reorder_level, product_id')
      .eq('company_id', companyId)

    const totalItems = inventory?.reduce((sum, i) => sum + (i.quantity || 0), 0) || 0
    const lowStockItems = inventory?.filter(i => i.quantity < i.reorder_level).length || 0
    const outOfStockItems = inventory?.filter(i => i.quantity === 0).length || 0

    return {
      totalItems,
      lowStockItems,
      outOfStockItems,
      totalProducts: inventory?.length || 0
    }
  },

  // ============================================================
  // PUBLISH INVENTORY EVENT (for realtime)
  // ============================================================
  async publishInventoryEvent(productId: string, eventName: string) {
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
          p_event_category: 'inventory',
          p_event_source: 'system',
          p_entity_type: 'product',
          p_entity_id: productId,
          p_payload: { product_id: productId, event: eventName }
        })
      }
    } catch (error) {
      console.error('Failed to publish inventory event:', error)
    }
  }
}