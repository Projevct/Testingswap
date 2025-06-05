"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ImportPage() {
  const [tradeCode, setTradeCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tradeCode.trim()) return

    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      router.push(`/trade?code=${encodeURIComponent(tradeCode)}`)
    }, 1500)
  }

  return (
    <div className="container max-w-6xl py-12 md:py-24">
      <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">The Future of Secure and Rapid Swaps</h1>
          <p className="text-muted-foreground text-lg">
            Committed to transparent asset exchanges. Keeping changes low and clarity high. No invisible charges.
            Equitable rates. Expectations met, no surprises.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary"></div>
            <div className="h-1 w-1 rounded-full bg-primary"></div>
            <div className="h-1 w-1 rounded-full bg-primary"></div>
            <div className="h-1 w-12 rounded-full bg-primary"></div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <p className="font-medium">Secure Transactions</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <p className="font-medium">Low Fees</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <p className="font-medium">Instant Swaps</p>
            </div>
          </div>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Import Trade</CardTitle>
            <CardDescription>Enter your trade code to load an existing trade.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="tradeCode"
                  placeholder="Enter Trade Code"
                  value={tradeCode}
                  onChange={(e) => setTradeCode(e.target.value)}
                  className="h-12"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full gap-2" disabled={!tradeCode.trim() || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  <>
                    Load Trade
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
