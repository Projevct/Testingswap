"use client"
import { generateTradeId } from "@/lib/utils"

export type TokenItem = {
  id: number
  name: string
  symbol: string
  amount: number
}

export type NFTItem = {
  id: number
  name: string
  collection: string
  img: string
}

export type TradeOffer = {
  tokens: TokenItem[]
  nfts: NFTItem[]
  solAmount: number
}

export type Trade = {
  id: string
  creatorWallet: string
  counterpartyWallet: string
  creatorOffer: TradeOffer
  counterpartyOffer: TradeOffer
  status: "pending" | "accepted" | "rejected" | "completed"
  createdAt: number
  updatedAt: number
}

// In a real application, this would be stored in a database
const trades: Trade[] = []

export async function createTrade(
  creatorWallet: string,
  counterpartyWallet: string,
  creatorOffer: TradeOffer,
  counterpartyOffer: TradeOffer,
): Promise<Trade> {
  try {
    // In a real application, this would involve blockchain transactions
    // For now, we'll simulate the process

    // Validate inputs
    if (!creatorWallet) throw new Error("Creator wallet is required")
    if (!counterpartyWallet) throw new Error("Counterparty wallet is required")
    if (creatorOffer.tokens.length === 0 && creatorOffer.nfts.length === 0 && creatorOffer.solAmount === 0) {
      throw new Error("Creator offer cannot be empty")
    }

    // Create trade object
    const trade: Trade = {
      id: generateTradeId(),
      creatorWallet,
      counterpartyWallet,
      creatorOffer,
      counterpartyOffer,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    // In a real app, we would store this in a database
    trades.push(trade)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return trade
  } catch (error) {
    console.error("Error creating trade:", error)
    throw error
  }
}

export async function getTrade(id: string): Promise<Trade | undefined> {
  // In a real app, we would fetch this from a database
  return trades.find((trade) => trade.id === id)
}

export async function getTradesByWallet(walletAddress: string): Promise<Trade[]> {
  // In a real app, we would fetch this from a database
  return trades.filter((trade) => trade.creatorWallet === walletAddress || trade.counterpartyWallet === walletAddress)
}

export async function acceptTrade(id: string, walletAddress: string): Promise<Trade> {
  const trade = trades.find((t) => t.id === id)
  if (!trade) throw new Error("Trade not found")

  if (trade.counterpartyWallet !== walletAddress) {
    throw new Error("Only the counterparty can accept this trade")
  }

  if (trade.status !== "pending") {
    throw new Error(`Trade cannot be accepted in ${trade.status} state`)
  }

  // In a real app, this would involve blockchain transactions
  // For now, we'll simulate the process
  trade.status = "accepted"
  trade.updatedAt = Date.now()

  return trade
}

export async function rejectTrade(id: string, walletAddress: string): Promise<Trade> {
  const trade = trades.find((t) => t.id === id)
  if (!trade) throw new Error("Trade not found")

  if (trade.counterpartyWallet !== walletAddress && trade.creatorWallet !== walletAddress) {
    throw new Error("Only the trade participants can reject this trade")
  }

  if (trade.status !== "pending") {
    throw new Error(`Trade cannot be rejected in ${trade.status} state`)
  }

  trade.status = "rejected"
  trade.updatedAt = Date.now()

  return trade
}
