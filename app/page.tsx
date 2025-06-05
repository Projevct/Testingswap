import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BarChart3, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
              Securely Trade Your NFTs with{" "}
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                THORSWAP
              </span>
            </h1>
            <p className="max-w-[42rem] text-muted-foreground text-xl">
              Use our peer-to-peer program to trade and swap chain tokens securely.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild size="lg" className="gap-2">
                <Link href="/trade">
                  Start Trading <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/import">Import Trade</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:gap-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Trading never was more easy</h2>
              <p className="max-w-[42rem] mx-auto text-muted-foreground">
                In the vibrant world of digital trading, our Solana trade site stands out with its impressive
                performance.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">4.7k+ Trade Volume</h3>
                  <p className="text-muted-foreground">
                    Our platform has facilitated thousands of successful trades between users.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">$258K+ Transactions</h3>
                  <p className="text-muted-foreground">
                    Secure transactions worth over a quarter million dollars have been processed.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">309.3k+ Users</h3>
                  <p className="text-muted-foreground">Join our growing community of traders from around the world.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-t from-background to-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter">Ready to start trading?</h2>
            <p className="max-w-[42rem] text-muted-foreground">
              Join thousands of traders on our secure platform today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild size="lg">
                <Link href="/trade">Start Trading</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
