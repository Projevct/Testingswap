"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { getTradesByWallet, acceptTrade, rejectTrade } from "@/lib/trade-service"
import type { Trade } from "@/lib/trade-service"

export default function AdminPanel() {
  const [wallet, setWallet] = useState("")
  const [trades, setTrades] = useState<Trade[]>([])
  const [statusFilter, setStatusFilter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTrades = async () => {
      if (!wallet.trim()) {
        setTrades([])
        return
      }

      try {
        setIsLoading(true)
        const result = await getTradesByWallet(wallet)
        setTrades(result)
      } catch (error) {
        console.error("Error fetching trades:", error)
        toast({
          title: "Error fetching trades",
          description: "Failed to load trades for this wallet.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrades()
  }, [wallet, toast])

  const handleAccept = async (id: string) => {
    try {
      const updated = await acceptTrade(id, "admin-wallet")
      updateTrade(updated)
      toast({
        title: "Trade accepted",
        description: `Trade ${id} has been accepted.`,
      })
    } catch (error) {
      console.error("Error accepting trade:", error)
      toast({
        title: "Error accepting trade",
        description: error instanceof Error ? error.message : "Failed to accept trade.",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (id: string) => {
    try {
      const updated = await rejectTrade(id, "admin-wallet")
      updateTrade(updated)
      toast({
        title: "Trade rejected",
        description: `Trade ${id} has been rejected.`,
      })
    } catch (error) {
      console.error("Error rejecting trade:", error)
      toast({
        title: "Error rejecting trade",
        description: error instanceof Error ? error.message : "Failed to reject trade.",
        variant: "destructive",
      })
    }
  }

  const updateTrade = (updated: Trade) => {
    setTrades((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }

  const filteredTrades = trades.filter((trade) => (statusFilter ? trade.status === statusFilter : true))

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "accepted":
        return "default"
      case "rejected":
        return "destructive"
      case "completed":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">Manage and monitor trades across the platform</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Trade Filters</CardTitle>
          <CardDescription>Filter trades by wallet address and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter wallet address to filter trades"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Loading trades...</p>
          </CardContent>
        </Card>
      ) : filteredTrades.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              {wallet.trim() ? "No trades found for this wallet." : "Enter a wallet address to view trades."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTrades.map((trade) => (
            <Card key={trade.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Trade {trade.id}</CardTitle>
                    <CardDescription>Created {new Date(trade.createdAt).toLocaleString()}</CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(trade.status)}>
                    {trade.status.charAt(0).toUpperCase() + trade.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Creator</p>
                    <p className="font-mono text-sm">{trade.creatorWallet}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Counterparty</p>
                    <p className="font-mono text-sm">{trade.counterpartyWallet}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Creator Offer</p>
                    <div className="space-y-1">
                      {trade.creatorOffer.solAmount > 0 && (
                        <p className="text-sm">{trade.creatorOffer.solAmount} SOL</p>
                      )}
                      {trade.creatorOffer.tokens.map((token) => (
                        <p key={token.id} className="text-sm">
                          {token.amount} {token.symbol}
                        </p>
                      ))}
                      {trade.creatorOffer.nfts.map((nft) => (
                        <p key={nft.id} className="text-sm">
                          {nft.name}
                        </p>
                      ))}
                      {trade.creatorOffer.tokens.length === 0 &&
                        trade.creatorOffer.nfts.length === 0 &&
                        trade.creatorOffer.solAmount === 0 && (
                          <p className="text-sm text-muted-foreground">No items offered</p>
                        )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Counterparty Offer</p>
                    <div className="space-y-1">
                      {trade.counterpartyOffer.solAmount > 0 && (
                        <p className="text-sm">{trade.counterpartyOffer.solAmount} SOL</p>
                      )}
                      {trade.counterpartyOffer.tokens.map((token) => (
                        <p key={token.id} className="text-sm">
                          {token.amount} {token.symbol}
                        </p>
                      ))}
                      {trade.counterpartyOffer.nfts.map((nft) => (
                        <p key={nft.id} className="text-sm">
                          {nft.name}
                        </p>
                      ))}
                      {trade.counterpartyOffer.tokens.length === 0 &&
                        trade.counterpartyOffer.nfts.length === 0 &&
                        trade.counterpartyOffer.solAmount === 0 && (
                          <p className="text-sm text-muted-foreground">No items offered</p>
                        )}
                    </div>
                  </div>
                </div>

                {trade.status === "pending" && (
                  <div className="flex gap-2">
                    <Button onClick={() => handleAccept(trade.id)} variant="default" size="sm">
                      Accept Trade
                    </Button>
                    <Button onClick={() => handleReject(trade.id)} variant="destructive" size="sm">
                      Reject Trade
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
