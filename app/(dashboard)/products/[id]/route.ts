import { NextRequest, NextResponse } from "next/server";
import { 
  getAllProductsWithInventory, 
  getProductById, 
  createProductWithInventory,
  updateProduct, 
  deleteProduct 
} from "@/lib/inventory-utils";

// ============================================
// GET all products with inventory
// ============================================
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const product = await getProductById(id);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ data: product });
    }
    
    const products = await getAllProductsWithInventory();
    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create new product with inventory
// ============================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createProductWithInventory(body);
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update product
// ============================================
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    const product = await updateProduct(id, body);
    return NextResponse.json({ data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Delete product
// ============================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}