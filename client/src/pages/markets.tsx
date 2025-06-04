import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Search, Star, BarChart3 } from "lucide-react";

function getAssetName(symbol: string): string {
  const assetNames: { [key: string]: string } = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'ADA': 'Cardano',
    'SOL': 'Solana',
    'MATIC': 'Polygon',
    'DOT': 'Polkadot',
    'AVAX': 'Avalanche',
    'LINK': 'Chainlink'
  };
  return assetNames[symbol] || symbol;
}

export default function Markets() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: marketData = [] } = useQuery({
    queryKey: ["/api/market-data"],
  });

  // Mock data for demonstration
  const mockMarkets = [
    { symbol: 'BTC', price: '43521.00', change24h: '2.34', marketCap: '852B', volume: '28.5B' },
    { symbol: 'ETH', price: '2341.50', change24h: '1.89', marketCap: '281B', volume: '15.2B' },
    { symbol: 'ADA', price: '0.52', change24h: '-0.58', marketCap: '18.2B', volume: '1.2B' },
    { symbol: 'SOL', price: '98.45', change24h: '4.12', marketCap: '42.1B', volume: '2.8B' },
    { symbol: 'MATIC', price: '0.89', change24h: '3.21', marketCap: '8.3B', volume: '856M' },
    { symbol: 'DOT', price: '6.78', change24h: '-1.45', marketCap: '9.1B', volume: '423M' },
    { symbol: 'AVAX', price: '34.56', change24h: '2.87', marketCap: '12.8B', volume: '734M' },
    { symbol: 'LINK', price: '14.23', change24h: '1.12', marketCap: '8.1B', volume: '521M' },
  ];

  const displayMarkets = Array.isArray(marketData) && marketData.length > 0 ? marketData : mockMarkets;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ring mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const filteredMarkets = displayMarkets.filter((market: any) =>
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getAssetName(market.symbol).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Markets</h1>
          <p className="text-muted-foreground">Explore cryptocurrency markets and pricing</p>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search cryptocurrencies..." 
              className="pl-10 glass-effect border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="border-border/50">
            <Star className="h-4 w-4 mr-2" />
            Favorites
          </Button>
          <Button variant="outline" className="border-border/50">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Market Cap</div>
              <div className="text-2xl font-bold text-ring">$1.67T</div>
              <div className="text-sm text-ring">+2.4%</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">24h Volume</div>
              <div className="text-2xl font-bold">$87.5B</div>
              <div className="text-sm text-destructive">-1.2%</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">BTC Dominance</div>
              <div className="text-2xl font-bold">52.3%</div>
              <div className="text-sm text-ring">+0.1%</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Active Coins</div>
              <div className="text-2xl font-bold">2,847</div>
              <div className="text-sm text-muted-foreground">+12</div>
            </CardContent>
          </Card>
        </div>

        {/* Markets Table */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Top Cryptocurrencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground text-sm">
                    <th className="text-left py-3 px-2">#</th>
                    <th className="text-left py-3 px-2">Name</th>
                    <th className="text-right py-3 px-2">Price</th>
                    <th className="text-right py-3 px-2">24h %</th>
                    <th className="text-right py-3 px-2">Market Cap</th>
                    <th className="text-right py-3 px-2">Volume</th>
                    <th className="text-right py-3 px-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMarkets.map((market: any, index: number) => (
                    <tr key={market.symbol} className="border-b border-border/20 hover:bg-card/30 transition-colors">
                      <td className="py-4 px-2 text-muted-foreground">{index + 1}</td>
                      <td className="py-4 px-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            market.symbol === 'BTC' ? 'bg-yellow-500' :
                            market.symbol === 'ETH' ? 'bg-blue-500' :
                            market.symbol === 'ADA' ? 'bg-blue-400' :
                            'bg-gradient-to-r from-primary to-ring'
                          }`}>
                            <span className="text-xs font-bold text-black">
                              {market.symbol === 'BTC' ? '₿' : 
                               market.symbol === 'ETH' ? 'Ξ' : 
                               market.symbol[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{getAssetName(market.symbol)}</div>
                            <div className="text-sm text-muted-foreground">{market.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-right font-medium">
                        ${parseFloat(market.price).toLocaleString()}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <Badge 
                          variant={parseFloat(market.change24h) >= 0 ? "default" : "destructive"}
                          className={`${parseFloat(market.change24h) >= 0 ? 'bg-ring/20 text-ring' : 'bg-destructive/20 text-destructive'}`}
                        >
                          {parseFloat(market.change24h) >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {market.change24h}%
                        </Badge>
                      </td>
                      <td className="py-4 px-2 text-right text-muted-foreground">
                        ${market.marketCap}
                      </td>
                      <td className="py-4 px-2 text-right text-muted-foreground">
                        ${market.volume}
                      </td>
                      <td className="py-4 px-2 text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button size="sm" className="bg-ring/20 text-ring hover:bg-ring/30">
                            Buy
                          </Button>
                          <Button size="sm" variant="outline" className="border-border/50">
                            Trade
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}