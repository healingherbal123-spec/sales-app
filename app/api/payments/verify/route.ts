import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { paymentId, status, verifiedBy } = await req.json()
    
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        verifiedBy,
        verifiedAt: new Date()
      }
    })
    
    // Update order payment status
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { 
        paymentStatus: status === "PAID" ? "PAID" : "UNPAID",
        ...(status === "PAID" ? { paidAt: new Date() } : {})
      }
    })
    
    return NextResponse.json({ success: true, payment })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}