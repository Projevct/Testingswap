"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, ChevronDown, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { useSearchParams } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import type { NFTItem, TokenItem } from "@/lib/trade-service"

// Mock data for tokens
const mockTokens = [
  { id: 1, name: "Solana", symbol: "SOL", balance: 2.5, price: 120.45 },
  { id: 2, name: "Ethereum", symbol: "ETH", balance: 1.2, price: 3200.78 },
  { id: 3, name: "Bitcoin", symbol: "BTC", balance: 0.05, price: 42000.12 },
  { id: 4, name: "Cardano", symbol: "ADA", balance: 150, price: 0.45 },
  { id: 5, name: "Polkadot", symbol: "DOT", balance: 25, price: 6.78 },
]

// Mock data for NFTs
const mockNFTs = [
  { id: 101, name: "Cosmic Horizon #1234", collection: "Cosmic Horizon", img: "/placeholder.svg?height=100&width=100" },
  { id: 102, name: "Bored Ape #5678", collection: "BAYC", img: "/placeholder.svg?height=100&width=100" },
  { id: 103, name: "Doodle #9012", collection: "Doodles", img: "/placeholder.svg?height=100&width=100" },
  { id: 104, name: "Azuki #3456", collection: "Azuki", img: "/placeholder.svg?height=100&width=100" },
  { id: 105, name: "CloneX #7890", collection: "CloneX", img: "/placeholder.svg?height=100&width=100" },
]

export default function TradePage() {
  const searchParams = useSearchParams()
  const tradeCode = searchParams.get("code")
  const router = useRouter()
  const { publicKey, connected } = useWallet()
  const { toast } = useToast()

  const [counterpartyAddress, setCounterpartyAddress] = useState("")
  const [searchCollection, setSearchCollection] = useState("")
  const [tokenSearch, setTokenSearch] = useState("")
  const [nftSearch, setNftSearch] = useState("")
  const [selectedTokens, setSelectedTokens] = useState<number[]>([])
  const [selectedNFTs, setSelectedNFTs] = useState<number[]>([])
  const [counterpartySelectedTokens, setCounterpartySelectedTokens] = useState<number[]>([])
  const [counterpartySelectedNFTs, setCounterpartySelectedNFTs] = useState<number[]>([])
  const [solAmount, setSolAmount] = useState("")
  const [isCreatingTrade, setIsCreatingTrade] = useState(false)

  const filteredTokens = mockTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(tokenSearch.toLowerCase()) ||
      token.symbol.toLowerCase().includes(tokenSearch.toLowerCase()),
  )

  const filteredNFTs = mockNFTs.filter(
    (nft) =>
      nft.name.toLowerCase().includes(nftSearch.toLowerCase()) ||
      nft.collection.toLowerCase().includes(nftSearch.toLowerCase()),
  )

  const toggleTokenSelection = (id: number) => {
    setSelectedTokens((prev) => (prev.includes(id) ? prev.filter((tokenId) => tokenId !== id) : [...prev, id]))
  }

  const toggleNFTSelection = (id: number) => {
    setSelectedNFTs((prev) => (prev.includes(id) ? prev.filter((nftId) => nftId !== id) : [...prev, id]))
  }

  const handleMaxSol = () => {
    const solToken = mockTokens.find((token) => token.symbol === "SOL")
    if (solToken) {
      setSolAmount(solToken.balance.toString())
    }
  }

  const handleCreateTrade = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to create a trade.",
        variant: "destructive",
      })
      return
    }

    if (!counterpartyAddress) {
      toast({
        title: "Missing counterparty",
        description: "Please enter a counterparty wallet address.",
        variant: "destructive",
      })
      return
    }

    if (selectedTokens.length === 0 && selectedNFTs.length === 0 && !solAmount) {
      toast({
        title: "Empty offer",
        description: "Please select at least one token or NFT to offer.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreatingTrade(true)

      // Prepare creator offer
      const creatorTokens: TokenItem[] = selectedTokens.map((id) => {
        const token = mockTokens.find((t) => t.id === id)!
        return {
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          amount: token.balance,
        }
      })

      const creatorNFTs: NFTItem[] = selectedNFTs.map((id) => {
        const nft = mockNFTs.find((n) => n.id === id)!
        return {
          id: nft.id,
          name: nft.name,
          collection: nft.collection,
          img: nft.img,
        }
      })

      // Create trade
      const response = await fetch("/api/trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorWallet: publicKey.toString(),
          counterpartyWallet: counterpartyAddress,
          creatorOffer: {
            tokens: creatorTokens,
            nfts: creatorNFTs,
            solAmount: Number.parseFloat(solAmount) || 0,
          },
          counterpartyOffer: {
            tokens: [],
            nfts: [],
            solAmount: 0,
          },
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create trade")
      }

      toast({
        title: "Trade created successfully!",
        description: `Trade ID: ${data.trade.id}`,
      })

      // Navigate to trade details page (would be implemented in a real app)
      // For now, we'll just reset the form
      setSelectedTokens([])
      setSelectedNFTs([])
      setSolAmount("")
      setCounterpartyAddress("")
    } catch (error) {
      console.error("Error creating trade:", error)
      toast({
        title: "Error creating trade",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsCreatingTrade(false)
    }
  }

  return (
    <div className="container py-8">
      {!connected && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg">
          <p className="text-sm">Please connect your wallet to start trading.</p>
        </div>
      )}

      {tradeCode && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg">
          <p className="text-sm">
            Loaded trade with code: <span className="font-mono font-bold">{tradeCode}</span>
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Trade Setup */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Counterparty Wallet Address</CardTitle>
              <CardDescription>Enter the wallet address of the person you want to trade with</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter wallet address"
                value={counterpartyAddress}
                onChange={(e) => setCounterpartyAddress(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by collection name"
                  className="pl-10"
                  value={searchCollection}
                  onChange={(e) => setSearchCollection(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Token List</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="tokens">
                <TabsList className="mb-4">
                  <TabsTrigger value="tokens">Tokens</TabsTrigger>
                  <TabsTrigger value="nfts">NFTs</TabsTrigger>
                </TabsList>

                <TabsContent value="tokens" className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <div>
                        <p className="text-sm font-medium mb-1">SOL</p>
                        <div className="flex">
                          <Input
                            type="number"
                            placeholder="0"
                            value={solAmount}
                            onChange={(e) => setSolAmount(e.target.value)}
                            className="rounded-r-none"
                            disabled={!connected}
                          />
                          <Button
                            variant="outline"
                            className="rounded-l-none"
                            onClick={handleMaxSol}
                            disabled={!connected}
                          >
                            MAX {mockTokens.find((t) => t.symbol === "SOL")?.balance.toFixed(5)}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-sm">
                        Filter (0)
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-7 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="relative w-[180px]">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search"
                        className="pl-8 h-8"
                        value={tokenSearch}
                        onChange={(e) => setTokenSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <ScrollArea className="h-[300px] rounded-md border">
                    <div className="p-4 space-y-4">
                      {filteredTokens.map((token) => (
                        <div
                          key={token.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedTokens.includes(token.id)
                              ? "bg-primary/10 border border-primary/30"
                              : "hover:bg-secondary"
                          } ${!connected ? "opacity-50 pointer-events-none" : ""}`}
                          onClick={() => connected && toggleTokenSelection(token.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                                {token.symbol.charAt(0)}
                              </div>
                              <div>
                                <p className="font-medium">{token.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {token.balance} {token.symbol}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm">${(token.balance * token.price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      {filteredTokens.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">No tokens found</div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="nfts" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-sm">
                        Filter (0)
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-7 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="relative w-[180px]">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search-ID"
                        className="pl-8 h-8"
                        value={nftSearch}
                        onChange={(e) => setNftSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredNFTs.map((nft) => (
                      <div
                        key={nft.id}
                        className={`rounded-lg cursor-pointer transition-all ${
                          selectedNFTs.includes(nft.id) ? "ring-2 ring-primary" : "hover:opacity-80"
                        } ${!connected ? "opacity-50 pointer-events-none" : ""}`}
                        onClick={() => connected && toggleNFTSelection(nft.id)}
                      >
                        <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
                          <img
                            src={nft.img || "/placeholder.svg"}
                            alt={nft.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-sm font-medium truncate">{nft.name}</p>
                          <p className="text-xs text-muted-foreground">{nft.collection}</p>
                        </div>
                      </div>
                    ))}
                    {filteredNFTs.length === 0 && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">No NFTs found</div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Trade Preview */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Trade Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Your Offer</h3>
                {selectedTokens.length === 0 && selectedNFTs.length === 0 && !solAmount && (
                  <p className="text-muted-foreground text-sm">Not defined</p>
                )}

                {solAmount && Number.parseFloat(solAmount) > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">S</div>
                    <p className="text-sm">{solAmount} SOL</p>
                  </div>
                )}

                {selectedTokens.map((id) => {
                  const token = mockTokens.find((t) => t.id === id)
                  if (!token) return null
                  return (
                    <div key={token.id} className="flex items-center gap-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                        {token.symbol.charAt(0)}
                      </div>
                      <p className="text-sm">
                        {token.balance} {token.symbol}
                      </p>
                    </div>
                  )
                })}

                {selectedNFTs.map((id) => {
                  const nft = mockNFTs.find((n) => n.id === id)
                  if (!nft) return null
                  return (
                    <div key={nft.id} className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <img src={nft.img || "/placeholder.svg"} alt={nft.name} />
                      </Avatar>
                      <p className="text-sm truncate">{nft.name}</p>
                    </div>
                  )
                })}
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Counterparty Offer</h3>
                {counterpartySelectedTokens.length === 0 && counterpartySelectedNFTs.length === 0 && (
                  <p className="text-muted-foreground text-sm">Not defined</p>
                )}
              </div>

              <Button
                className="w-full"
                disabled={
                  !connected ||
                  !counterpartyAddress ||
                  (selectedTokens.length === 0 && selectedNFTs.length === 0 && !solAmount) ||
                  isCreatingTrade
                }
                onClick={handleCreateTrade}
              >
                {isCreatingTrade ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Trade...
                  </>
                ) : (
                  "Create Trade"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
