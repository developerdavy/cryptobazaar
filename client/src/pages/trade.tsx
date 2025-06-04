import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradingPanel from "@/components/trading-panel";
import PriceChart from "@/components/price-chart";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function Trade() {
  const { data: marketData = [] } = useQuery({
    queryKey: ["/api/market-data"],
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Market Overview Sidebar */}
        <div className="lg:col-span-1">
          <Card className="glass-effect border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Markets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {marketData.map((market: any) => (
                <div key={market.symbol} className="flex items-center justify-between p-3 bg-card/50 rounded-lg hover:bg-card transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">{market.symbol}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{market.symbol}/USD</div>
                      <div className="text-xs text-gray-400">${parseFloat(market.price).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={parseFloat(market.change24h) >= 0 ? "default" : "destructive"}
                      className={`text-xs ${parseFloat(market.change24h) >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                    >
                      {parseFloat(market.change24h) >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {market.change24h}%
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Trading Interface */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chart */}
          <PriceChart />
          
          {/* Trading Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TradingPanel />
            
            {/* Order Book */}
            <Card className="glass-effect border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Order Book</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="buy" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-card/50">
                    <TabsTrigger value="buy" className="text-green-400 data-[state=active]:bg-green-500/20">Buy Orders</TabsTrigger>
                    <TabsTrigger value="sell" className="text-red-400 data-[state=active]:bg-red-500/20">Sell Orders</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="buy" className="space-y-2 mt-4">
                    <div className="grid grid-cols-3 text-xs text-gray-400 mb-2">
                      <span>Price (USD)</span>
                      <span>Amount (BTC)</span>
                      <span>Total</span>
                    </div>
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className="grid grid-cols-3 text-xs py-1 hover:bg-green-500/10 rounded">
                        <span className="text-green-400">${(43521 - i * 50).toLocaleString()}</span>
                        <span>{(0.025 + i * 0.001).toFixed(3)}</span>
                        <span>${((43521 - i * 50) * (0.025 + i * 0.001)).toFixed(2)}</span>
                      </div>
                    ))}
                  </TabsContent>
                  
                  <TabsContent value="sell" className="space-y-2 mt-4">
                    <div className="grid grid-cols-3 text-xs text-gray-400 mb-2">
                      <span>Price (USD)</span>
                      <span>Amount (BTC)</span>
                      <span>Total</span>
                    </div>
                    {Array.from({ length: 8 }, (_, i) => (
                      <div key={i} className="grid grid-cols-3 text-xs py-1 hover:bg-red-500/10 rounded">
                        <span className="text-red-400">${(43521 + i * 50).toLocaleString()}</span>
                        <span>{(0.025 + i * 0.001).toFixed(3)}</span>
                        <span>${((43521 + i * 50) * (0.025 + i * 0.001)).toFixed(2)}</span>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
