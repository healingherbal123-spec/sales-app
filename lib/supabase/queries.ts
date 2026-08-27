import { createClient } from "@/lib/supabase/server";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

// ============================================
// PRODUCT QUERIES
// ============================================
export async function getProducts() {
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

export async function createProduct(productData: any) {
  const supabase = createClient();
  
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert(productData)
    .select()
    .single();
  
  if (productError) throw productError;
  
  // Create inventory record
  const { error: inventoryError } = await supabase
    .from("inventories")
    .insert({
      product_id: product.id,
      quantity: 0,
      min_stock: 10,
    });
  
  if (inventoryError) throw inventoryError;
  
  return product;
}

export async function updateProduct(id: string, productData: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .update(productData)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProduct(id: string) {
  const supabase = createClient();
  
  // Delete inventory first (cascade should handle this)
  await supabase
    .from("inventories")
    .delete()
    .eq("product_id", id);
  
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  return true;
}

// ============================================
// INVENTORY QUERIES
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

// ============================================
// STOCK MOVEMENT QUERIES
// ============================================
export async function createStockMovement(movementData: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("stock_movements")
    .insert(movementData)
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

// ============================================
// ORDER QUERIES
// ============================================
export async function getOrders() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        product:products(name, sku)
      )
    `)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getOrderById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        product:products(name, sku, price)
      )
    `)
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createOrder(orderData: any, items: any[]) {
  const supabase = createClient();
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();
  
  if (orderError) throw orderError;
  
  // Create order items
  const orderItems = items.map(item => ({
    ...item,
    order_id: order.id,
  }));
  
  const { data: itemsData, error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems)
    .select();
  
  if (itemsError) throw itemsError;
  
  return { order, items: itemsData };
}

// ============================================
// SALE QUERIES
// ============================================
export async function createSale(saleData: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sales")
    .insert(saleData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getSales() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sales")
    .select(`
      *,
      product:products(name, sku),
      seller:profiles!seller_id(full_name, email)
    `)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data;
}

// ============================================
// AUTH QUERIES
// ============================================
export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, profileData: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(profileData)
    .eq("id", userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============================================
// COMPANY QUERIES
// ============================================
export async function getCompanies() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getCompanyById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createCompany(companyData: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .insert(companyData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCompany(id: string, companyData: any) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("companies")
    .update(companyData)
    .eq("id", id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCompany(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  return true;
}