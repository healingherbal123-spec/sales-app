import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ============================================
// GET - Fetch all products
// ============================================
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        inventory:inventories(*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create a new product
// ============================================
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    // Insert product
    const { data: product, error: productError } = await supabase
      .from("products")
      .insert({
        name: body.name,
        description: body.description || "",
        price: body.price || 0,
        cost: body.cost || 0,
        sku: body.sku,
        barcode: body.barcode || "",
        category: body.category || "Uncategorized",
        images: body.images || [],
        tags: body.tags || [],
        active: body.active !== undefined ? body.active : true,
      })
      .select()
      .single();

    if (productError) {
      console.error("Product insert error:", productError);
      return NextResponse.json(
        { error: productError.message },
        { status: 400 }
      );
    }

    // Create inventory record
    const { data: inventory, error: inventoryError } = await supabase
      .from("inventories")
      .insert({
        product_id: product.id,
        quantity: body.quantity || 0,
        min_stock: body.min_stock || 10,
        location: body.location || "",
      })
      .select()
      .single();

    if (inventoryError) {
      console.error("Inventory insert error:", inventoryError);
      // Delete the product if inventory creation fails
      await supabase.from("products").delete().eq("id", product.id);
      return NextResponse.json(
        { error: inventoryError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      data: { ...product, inventory } 
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}