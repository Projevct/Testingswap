"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { Loader2, LogOut, Wallet } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatWalletAddress } from "@/lib/utils"

export function WalletConnectButton() {
  const { wallet, publicKey, connected, connecting, disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const { toast } = useToast()

  const handleConnect = () => {
    setVisible(true)
  }

  const handleDisconnect = async () => {
    try {
      setIsDisconnecting(true)
      await disconnect()
      toast({
        title: "Wallet disconnected",
        description: "You have successfully disconnected your wallet.",
      })
    } catch (error) {
      toast({
        title: "Error disconnecting",
        description: "There was an error disconnecting your wallet.",
        variant: "destructive",
      })
      console.error("Error disconnecting wallet:", error)
    } finally {
      setIsDisconnecting(false)
    }
  }

  if (connecting) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Connecting
      </Button>
    )
  }

  if (connected && publicKey) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Wallet className="h-4 w-4" />
            {formatWalletAddress(publicKey.toString())}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Wallet</DropdownMenuLabel>
          <DropdownMenuItem className="text-xs opacity-50" disabled>
            {publicKey.toString()}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="text-destructive focus:text-destructive"
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={handleConnect}>
      <Wallet className="mr-2 h-4 w-4" />
      Connect Wallet
    </Button>
  )
}
