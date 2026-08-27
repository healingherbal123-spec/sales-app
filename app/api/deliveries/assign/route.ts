import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { deliveryId, dispatcherId, deliveryFee } = await req.json()
    
    const delivery = await prisma.delivery.update({
      where: { id: deliveryId },
      data: {
        dispatcherId,
        deliveryFee,
        status: "ASSIGNED",
        assignedAt: new Date()
      }
    })
    
    // Create expense
    await prisma.expense.create({
      data: {
        description: Delivery fee for waybill ,
        amount: deliveryFee,
        category: "DELIVERY",
        deliveryId: delivery.id,
        orderId: delivery.orderId,
        userId: dispatcherId
      }
    })
    
    return NextResponse.json({ success: true, delivery })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}