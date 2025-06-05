"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function CreateTradePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState({
    creatorWallet: "",
    counterpartyWallet: "",
    solAmount: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorWallet: form.creatorWallet,
          counterpartyWallet: form.counterpartyWallet,
          creatorOffer: {
            tokens: [],
            nfts: [],
            solAmount: Number.parseFloat(form.solAmount) || 0,
          },
          counterpartyOffer: {
            tokens: [],
            nfts: [],
            solAmount: 0,
          },
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create trade")
      }

      toast({
        title: "Trade created successfully",
        description: `Trade ID: ${data.trade.id}`,
      })

      // Reset form
      setForm({ creatorWallet: "", counterpartyWallet: "", solAmount: "" })

      // Optionally redirect to admin page
      // router.push('/admin')
    } catch (error) {
      console.error("Error creating trade:", error)
      toast({
        title: "Error creating trade",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Create Trade</CardTitle>
          <CardDescription>Create a new trade between two wallets</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="creatorWallet">Creator Wallet</Label>
              <Input
                id="creatorWallet"
                name="creatorWallet"
                placeholder="Enter creator wallet address"
                value={form.creatorWallet}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="counterpartyWallet">Counterparty Wallet</Label>
              <Input
                id="counterpartyWallet"
                name="counterpartyWallet"
                placeholder="Enter counterparty wallet address"
                value={form.counterpartyWallet}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solAmount">SOL Amount</Label>
              <Input
                id="solAmount"
                name="solAmount"
                type="number"
                step="0.000001"
                min="0"
                placeholder="0.0"
                value={form.solAmount}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Trade...
                </>
              ) : (
                "Create Trade"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
