import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Search, Star } from "lucide-react";
import { useState } from "react";

export default function Markets() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: marketData = [] } = useQuery({
    queryKey: ["/api/market-data"],
  });

  const filteredMarkets = marketData.filter((market: any) =>
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Market Overview</h1>
        <p className="text-gray-400">Track cryptocurrency prices and market trends</p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="glass-effect border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-400 mb-1">Total Market Cap</div>
            <div className="text-2xl font-bold text-green-400">$1.73T</div>
            <div className="text-sm text-green-400">+2.34%</div>
          </CardContent>
        </Card>
        
        <Card className="glass-effect border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-400 mb-1">24h Volume</div>
            <div className="text-2xl font-bold">$89.2B</div>
            <div className="text-sm text-gray-400">-1.23%</div>
          </CardContent>
        </Card>
        
        <Card className="glass-effect border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-400 mb-1">BTC Dominance</div>
            <div className="text-2xl font-bold">42.7%</div>
            <div className="text-sm text-green-400">+0.8%</div>
          </CardContent>
        </Card>
      </div>

      {/* Markets Table */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="text-xl">All Markets</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search markets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card/50 border-border/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">#</th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-gray-400">Asset</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-400">Price</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-400">24h Change</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-400">Market Cap</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-400">Volume (24h)</th>
                  <th className="text-right py-3 px-2 text-sm font-medium text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarkets.map((market: any, index: number) => (
                  <tr key={market.symbol} className="border-b border-border/30 hover:bg-card/30 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-gray-400 hover:text-yellow-400 cursor-pointer" />
                        <span className="text-sm text-gray-400">{index + 1}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-black">{market.symbol}</span>
                        </div>
                        <div>
                          <div className="font-medium">{market.symbol}</div>
                          <div className="text-sm text-gray-400">{getAssetName(market.symbol)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right font-medium">
                      ${parseFloat(market.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <Badge 
                        variant={parseFloat(market.change24h) >= 0 ? "default" : "destructive"}
                        className={`${parseFloat(market.change24h) >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                      >
                        {parseFloat(market.change24h) >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {market.change24h}%
                      </Badge>
                    </td>
                    <td className="py-4 px-2 text-right text-sm">
                      ${(parseFloat(market.marketCap) / 1e9).toFixed(2)}B
                    </td>
                    <td className="py-4 px-2 text-right text-sm">
                      ${(parseFloat(market.volume24h) / 1e6).toFixed(2)}M
                    </td>
                    <td className="py-4 px-2 text-right">
                      <Button size="sm" className="crypto-gradient text-black font-medium">
                        Trade
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getAssetName(symbol: string): string {
  const names: Record<string, string> = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'ADA': 'Cardano',
    'DOT': 'Polkadot',
    'SOL': 'Solana',
    'LINK': 'Chainlink',
    'MATIC': 'Polygon',
    'AVAX': 'Avalanche',
  };
  return names[symbol] || symbol;
}
