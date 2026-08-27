import { NextResponse } from "next/server"
import { AIContact } from "@/lib/ai/contact"

export async function POST(req: Request) {
  try {
    const { contactId, message } = await req.json()
    
    const aiContact = new AIContact()
    const response = await aiContact.sendMessage(contactId, message)
    
    return NextResponse.json({ success: true, response })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}