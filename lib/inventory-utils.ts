import { createClient } from "@/lib/supabase/server";

// ============================================
// PRODUCT FUNCTIONS
// ============================================
export async function getAllProductsWithInventory() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      inventory:inventories(*)
    `)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getProductById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      inventory:inventories(*)
    `)
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createProductWithInventory(productData: any) {
  const supabase = createClient();
  
  // Insert product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      cost: productData.cost,
      sku: productData.sku,
      barcode: productData.barcode,
      category: productData.category,
      images: productData.images || [],
      tags: productData.tags || [],
      active: productData.active !== undefined ? productData.active : true,
    })
    .select()
    .single();
  
  if (productError) throw productError;
  
  // Create inventory record for the product
  const { data: inventory, error: inventoryError } = await supabase
    .from("inventories")
    .insert({
      product_id: product.id,
      quantity: productData.quantity || 0,
      min_stock: productData.min_stock || 10,
      location: productData.location || "",
    })
    .select()
    .single();
  
  if (inventoryError) throw inventoryError;
  
  return { product, inventory };
}

export async function updateProduct(id: string, productData: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update({
      name: productData.name,
      description: productData.description,
      price: productData.price,
      cost: productData.cost,
      sku: productData.sku,
      barcode: productData.barcode,
      category: productData.category,
      images: productData.images,
      tags: productData.tags,
      active: productData.active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  
  // Delete inventory first
  await supabase
    .from("inventories")
    .delete()
    .eq("product_id", id);
  
  // Delete product
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  return true;
}

// ============================================
// INVENTORY FUNCTIONS
// ============================================
export async function getInventoryStats() {
  const supabase = createClient();
  
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      sku,
      inventory:inventories(quantity, min_stock)
    `);
  
  if (error) throw error;
  
  const totalProducts = products?.length || 0;
  const totalStock = products?.reduce((sum: number, p: any) => sum + (p.inventory?.[0]?.quantity || 0), 0) || 0;
  const lowStockItems = products?.filter((p: any) => {
    const inv = p.inventory?.[0];
    return inv && inv.quantity < inv.min_stock;
  }) || [];
  const outOfStockItems = products?.filter((p: any) => (p.inventory?.[0]?.quantity || 0) <= 0) || [];
  
  return {
    totalProducts,
    totalStock,
    lowStockItems: lowStockItems.length,
    outOfStockItems: outOfStockItems.length,
  };
}

export async function updateInventory(productId: string, quantity: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("inventories")
    .update({ 
      quantity, 
      updated_at: new Date().toISOString() 
    })
    .eq("product_id", productId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getLowStockProducts() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      inventory:inventories(*)
    `)
    .filter("inventories.quantity", "lt", "inventories.min_stock");
  
  if (error) throw error;
  return data;
}

// ============================================
// STOCK MOVEMENT FUNCTIONS
// ============================================
export async function createStockMovement(movementData: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stock_movements")
    .insert({
      inventory_id: movementData.inventory_id,
      type: movementData.type,
      quantity: movementData.quantity,
      previous_qty: movementData.previous_qty,
      new_qty: movementData.new_qty,
      reference: movementData.reference,
      note: movementData.note,
      user_id: movementData.user_id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getStockMovements(productId?: string) {
  const supabase = createClient();
  let query = supabase
    .from("stock_movements")
    .select(`
      *,
      inventory:inventories(
        product_id,
        product:products(name, sku)
      )
    `)
    .order("created_at", { ascending: false });
  
  if (productId) {
    query = query.eq("inventory.product_id", productId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data;
}