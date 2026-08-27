import { NextRequest, NextResponse } from "next/server";
import { 
  createUnifiedOrder, 
  getAllUnifiedOrders,
  getUnifiedOrder 
} from "@/lib/order-utils";

// GET all unified orders
export async function GET(request: NextRequest) {
  try {
    const orders = await getAllUnifiedOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST - Create unified order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order = await createUnifiedOrder(body);
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}