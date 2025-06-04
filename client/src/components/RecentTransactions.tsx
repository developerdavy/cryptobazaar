import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, ArrowUpDown, Wallet } from "lucide-react";

export default function RecentTransactions() {
  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const mockTransactions = [
    {
      id: '1',
      type: 'buy',
      title: 'Bought Bitcoin',
      amount: '+0.0234 BTC',
      usdAmount: '$1,000.00',
      timestamp: '2 hours ago',
      iconType: 'buy'
    },
    {
      id: '2',
      type: 'swap',
      title: 'Swapped ETH → BTC',
      amount: '0.1 ETH → 0.0067 BTC',
      usdAmount: '$234.56',
      timestamp: '5 hours ago',
      iconType: 'swap'
    },
    {
      id: '3',
      type: 'sell',
      title: 'Sold Cardano',
      amount: '-500 ADA',
      usdAmount: '$250.00',
      timestamp: '1 day ago',
      iconType: 'sell'
    },
    {
      id: '4',
      type: 'deposit',
      title: 'Deposited USD',
      amount: '+$2,500.00',
      usdAmount: 'Bank transfer',
      timestamp: '2 days ago',
      iconType: 'deposit'
    }
  ];

  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'buy':
        return <ArrowUp className="w-4 h-4 text-ring" />;
      case 'sell':
        return <ArrowDown className="w-4 h-4 text-destructive" />;
      case 'swap':
        return <ArrowUpDown className="w-4 h-4 text-primary" />;
      case 'deposit':
        return <Wallet className="w-4 h-4 text-purple-400" />;
      default:
        return <ArrowUp className="w-4 h-4 text-ring" />;
    }
  };

  const getIconBg = (iconType: string) => {
    switch (iconType) {
      case 'buy':
        return 'bg-ring/20';
      case 'sell':
        return 'bg-destructive/20';
      case 'swap':
        return 'bg-primary/20';
      case 'deposit':
        return 'bg-purple-500/20';
      default:
        return 'bg-ring/20';
    }
  };

  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Button variant="ghost" size="sm" className="text-primary hover:text-foreground">
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {displayTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-card rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${getIconBg(transaction.iconType || transaction.type)} rounded-full flex items-center justify-center`}>
                  {getIcon(transaction.iconType || transaction.type)}
                </div>
                <div>
                  <div className="font-medium text-sm">{transaction.title}</div>
                  <div className="text-xs text-muted-foreground">{transaction.timestamp}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{transaction.amount}</div>
                <div className="text-xs text-muted-foreground">{transaction.usdAmount}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}