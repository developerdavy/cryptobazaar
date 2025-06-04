import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, ExternalLink } from "lucide-react";

export default function PortfolioCard() {
  const { data: portfolio = [], isLoading: portfolioLoading } = useQuery({
    queryKey: ["/api/portfolio"],
  });

  const { data: marketData = [], isLoading: marketLoading } = useQuery({
    queryKey: ["/api/market-data"],
  });

  const getAssetIcon = (symbol: string) => {
    const colors: Record<string, string> = {
      'BTC': 'from-orange-400 to-yellow-400',
      'ETH': 'from-blue-400 to-blue-600',
      'ADA': 'from-blue-500 to-purple-600',
      'DOT': 'from-pink-400 to-red-500',
      'SOL': 'from-purple-400 to-pink-500',
    };
    return colors[symbol] || 'from-gray-400 to-gray-600';
  };

  const calculatePnL = (holding: any) => {
    const marketPrice = marketData.find((m: any) => m.symbol === holding.symbol)?.price || '0';
    const currentValue = parseFloat(holding.balance) * parseFloat(marketPrice);
    const costBasis = parseFloat(holding.balance) * parseFloat(holding.averagePrice || '0');
    const pnl = currentValue - costBasis;
    const pnlPercentage = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    return { pnl, pnlPercentage };
  };

  if (portfolioLoading || marketLoading) {
    return (
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-20 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const holdingsWithValue = portfolio.filter((holding: any) => parseFloat(holding.balance) > 0);

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Portfolio</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
            View All
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {holdingsWithValue.length > 0 ? (
          <div className="space-y-4">
            {holdingsWithValue.map((holding: any) => {
              const marketPrice = marketData.find((m: any) => m.symbol === holding.symbol)?.price || '0';
              const usdValue = parseFloat(holding.balance) * parseFloat(marketPrice);
              const { pnl, pnlPercentage } = calculatePnL(holding);
              
              return (
                <div
                  key={holding.id}
                  className="flex items-center justify-between p-3 bg-card/30 rounded-lg hover:bg-card/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${getAssetIcon(holding.symbol)} rounded-full flex items-center justify-center`}>
                      <span className="text-black font-bold text-xs">{holding.symbol}</span>
                    </div>
                    <div>
                      <div className="font-medium">{holding.name}</div>
                      <div className="text-sm text-gray-400">{holding.symbol}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">
                      {parseFloat(holding.balance).toFixed(6)} {holding.symbol}
                    </div>
                    <div className="text-sm text-gray-400">
                      ${usdValue.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={`${pnl >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {pnl >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {pnl >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
                    </Badge>
                    <div className={`text-sm ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {pnl >= 0 ? '+' : ''}${pnl.toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">No holdings yet</div>
            <p className="text-sm text-gray-500 mb-4">Start trading to build your portfolio</p>
            <Button className="crypto-gradient text-black font-medium">
              Start Trading
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
