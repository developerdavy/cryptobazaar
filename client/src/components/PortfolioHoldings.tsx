import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function PortfolioHoldings() {
  const { data: holdings = [] } = useQuery({
    queryKey: ["/api/holdings"],
  });

  const mockHoldings = [
    {
      id: '1',
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: '0.2847',
      usdValue: 12389.54,
      change: 2.34,
      changeAmount: 283.21,
      icon: '₿',
      iconBg: 'bg-yellow-500'
    },
    {
      id: '2',
      symbol: 'ETH',
      name: 'Ethereum',
      balance: '4.2893',
      usdValue: 8234.91,
      change: 1.89,
      changeAmount: 153.42,
      icon: 'Ξ',
      iconBg: 'bg-blue-500'
    },
    {
      id: '3',
      symbol: 'ADA',
      name: 'Cardano',
      balance: '2847',
      usdValue: 1423.50,
      change: -0.58,
      changeAmount: -8.27,
      icon: 'A',
      iconBg: 'bg-yellow-400'
    }
  ];

  const displayHoldings = holdings.length > 0 ? holdings : mockHoldings;

  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Portfolio</h2>
          <Button variant="ghost" size="sm" className="text-primary hover:text-foreground">
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {displayHoldings.map((holding) => (
            <div
              key={holding.id}
              className="flex items-center justify-between p-3 bg-card rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${holding.iconBg} rounded-full flex items-center justify-center text-black font-bold`}>
                  {holding.icon}
                </div>
                <div>
                  <div className="font-medium">{holding.name}</div>
                  <div className="text-sm text-muted-foreground">{holding.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{holding.balance} {holding.symbol}</div>
                <div className="text-sm text-muted-foreground">
                  ${holding.usdValue.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm ${holding.change >= 0 ? 'text-ring' : 'text-destructive'}`}>
                  {holding.change >= 0 ? '+' : ''}{holding.change}%
                </div>
                <div className={`text-sm ${holding.change >= 0 ? 'text-ring' : 'text-destructive'}`}>
                  {holding.change >= 0 ? '+' : ''}${Math.abs(holding.changeAmount).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
