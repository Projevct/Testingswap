import { NextResponse } from "next/server"

// Mock data storage (in a real app, this would be a database)
const trades: any[] = []

function generateTradeId(): string {
  return `TRADE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { creatorWallet, counterpartyWallet, creatorOffer, counterpartyOffer } = body

    // Validation
    if (!creatorWallet) {
      return NextResponse.json({ error: "Creator wallet is required" }, { status: 400 })
    }
    if (!counterpartyWallet) {
      return NextResponse.json({ error: "Counterparty wallet is required" }, { status: 400 })
    }

    // Check if creator offer is not empty
    const hasCreatorOffer =
      (creatorOffer?.tokens && creatorOffer.tokens.length > 0) ||
      (creatorOffer?.nfts && creatorOffer.nfts.length > 0) ||
      (creatorOffer?.solAmount && creatorOffer.solAmount > 0)

    if (!hasCreatorOffer) {
      return NextResponse.json({ error: "Creator offer cannot be empty" }, { status: 400 })
    }

    // Create trade object
    const trade = {
      id: generateTradeId(),
      creatorWallet,
      counterpartyWallet,
      creatorOffer: {
        tokens: creatorOffer?.tokens || [],
        nfts: creatorOffer?.nfts || [],
        solAmount: creatorOffer?.solAmount || 0,
      },
      counterpartyOffer: {
        tokens: counterpartyOffer?.tokens || [],
        nfts: counterpartyOffer?.nfts || [],
        solAmount: counterpartyOffer?.solAmount || 0,
      },
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    // Store trade (in a real app, save to database)
    trades.push(trade)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({ success: true, trade })
  } catch (error) {
    console.error("Error creating trade:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json({ success: true, trades })
  } catch (error) {
    console.error("Error fetching trades:", error)
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 })
  }
}
