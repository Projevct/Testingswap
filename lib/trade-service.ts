"use client"

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

export async function createTrade(
  creatorWallet: string,
  counterpartyWallet: string,
  creatorOffer: TradeOffer,
  counterpartyOffer: TradeOffer,
): Promise<Trade> {
  try {
    const response = await fetch("/api/trade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creatorWallet,
        counterpartyWallet,
        creatorOffer,
        counterpartyOffer,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to create trade")
    }

    return data.trade
  } catch (error) {
    console.error("Error creating trade:", error)
    throw error
  }
}

export async function getTrade(id: string): Promise<Trade | undefined> {
  try {
    const response = await fetch(`/api/trade/${id}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch trade")
    }

    return data.trade
  } catch (error) {
    console.error("Error fetching trade:", error)
    return undefined
  }
}

export async function getTradesByWallet(walletAddress: string): Promise<Trade[]> {
  try {
    const response = await fetch(`/api/trades?wallet=${encodeURIComponent(walletAddress)}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch trades")
    }

    return data.trades || []
  } catch (error) {
    console.error("Error fetching trades:", error)
    return []
  }
}

export async function acceptTrade(id: string, walletAddress: string): Promise<Trade> {
  try {
    const response = await fetch(`/api/trade/${id}/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to accept trade")
    }

    return data.trade
  } catch (error) {
    console.error("Error accepting trade:", error)
    throw error
  }
}

export async function rejectTrade(id: string, walletAddress: string): Promise<Trade> {
  try {
    const response = await fetch(`/api/trade/${id}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to reject trade")
    }

    return data.trade
  } catch (error) {
    console.error("Error rejecting trade:", error)
    throw error
  }
}
