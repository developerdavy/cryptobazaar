import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Wallet, Send, Download, TrendingUp, TrendingDown } from "lucide-react";
import PortfolioCard from "@/components/portfolio-card";
import TransactionList from "@/components/transaction-list";

export default function WalletPage() {
  const { data: portfolio = [] } = useQuery({
    queryKey: ["/api/portfolio"],
  });

  const { data: marketData = [] } = useQuery({
    queryKey: ["/api/market-data"],
  });

  const totalBalance = portfolio.reduce((sum: number, holding: any) => {
    const marketPrice = marketData.find((m: any) => m.symbol === holding.symbol)?.price || '0';
    return sum + (parseFloat(holding.balance) * parseFloat(marketPrice));
  }, 0);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Wallet Overview */}
      <div className="mb-8">
        <Card className="glass-effect border-border/50">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-3 mb-4">
                  <Wallet className="h-8 w-8 text-green-400" />
                  <h1 className="text-3xl font-bold">My Wallet</h1>
                </div>
                <div className="text-4xl font-bold text-green-400 mb-2">
                  ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500/20 text-green-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2.34% (24h)
                  </Badge>
                  <span className="text-gray-400">Total Portfolio Value</span>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <Button className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30">
                  <Download className="h-4 w-4 mr-2" />
                  Deposit
                </Button>
                <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
                  <Send className="h-4 w-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Content */}
      <Tabs defaultValue="holdings" className="space-y-6">
        <TabsList className="bg-card/50 p-1">
          <TabsTrigger value="holdings" className="data-[state=active]:bg-card">Holdings</TabsTrigger>
          <TabsTrigger value="transactions" className="data-[state=active]:bg-card">Transactions</TabsTrigger>
          <TabsTrigger value="staking" className="data-[state=active]:bg-card">Staking</TabsTrigger>
        </TabsList>

        <TabsContent value="holdings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PortfolioCard />
            
            {/* Available Balance */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Available Balances</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-sm">USD</span>
                    </div>
                    <div>
                      <div className="font-medium">US Dollar</div>
                      <div className="text-sm text-gray-400">Fiat Currency</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">$12,543.67</div>
                    <div className="text-sm text-gray-400">Available</div>
                  </div>
                </div>
                
                {portfolio.filter((holding: any) => parseFloat(holding.balance) > 0).map((holding: any) => {
                  const marketPrice = marketData.find((m: any) => m.symbol === holding.symbol)?.price || '0';
                  const usdValue = parseFloat(holding.balance) * parseFloat(marketPrice);
                  
                  return (
                    <div key={holding.id} className="flex items-center justify-between p-4 bg-card/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-black font-bold text-xs">{holding.symbol}</span>
                        </div>
                        <div>
                          <div className="font-medium">{holding.name}</div>
                          <div className="text-sm text-gray-400">{holding.symbol}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{parseFloat(holding.balance).toFixed(6)} {holding.symbol}</div>
                        <div className="text-sm text-gray-400">${usdValue.toFixed(2)}</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionList />
        </TabsContent>

        <TabsContent value="staking">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Staking Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-gray-400 mb-4">No staking positions yet</div>
                <Button className="crypto-gradient text-black font-medium">
                  Start Earning Rewards
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
