"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Copy } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function TradeSuccessPage() {
  const searchParams = useSearchParams()
  const tradeId = searchParams.get("id") || "TRADE-EXAMPLE123"
  const [isCopying, setIsCopying] = useState(false)
  const { toast } = useToast()

  const handleCopyTradeId = async () => {
    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(tradeId)
      toast({
        title: "Trade ID copied",
        description: "The trade ID has been copied to your clipboard.",
      })
    } catch (error) {
      console.error("Failed to copy:", error)
      toast({
        title: "Failed to copy",
        description: "Could not copy the trade ID to clipboard.",
        variant: "destructive",
      })
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <div className="container max-w-md py-12">
      <Card className="border-green-500/20 bg-green-500/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Trade Created Successfully!</CardTitle>
          <CardDescription>Your trade has been created and is waiting for the counterparty.</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Trade ID</p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <code className="relative rounded bg-muted px-[0.5rem] py-[0.2rem] font-mono text-sm">{tradeId}</code>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyTradeId} disabled={isCopying}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy trade ID</span>
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this trade ID with your counterparty so they can view and accept the trade.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/trade">Create Another Trade</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
