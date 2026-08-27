import { NextResponse } from "next/server"
import { AIRouter } from "@/lib/ai/router"

const router = new AIRouter()

export async function POST(req: Request) {
  try {
    const { event } = await req.json()
    
    const action = await router.route(event)
    
    return NextResponse.json({ action })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}