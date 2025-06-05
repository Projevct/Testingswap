import { NextResponse } from "next/server"
import { createTrade } from "@/lib/trade-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { creatorWallet, counterpartyWallet, creatorOffer, counterpartyOffer } = body

    if (!creatorWallet || !counterpartyWallet) {
      return NextResponse.json({ error: "Wallets are required" }, { status: 400 })
    }

    const trade = await createTrade(creatorWallet, counterpartyWallet, creatorOffer, counterpartyOffer)

    return NextResponse.json({ success: true, trade })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

// Handle CORS preflight
export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
