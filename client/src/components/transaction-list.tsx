import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUp, ArrowDown, RotateCcw, Wallet, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function TransactionList() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["/api/transactions", { limit: 10 }],
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowUp className="h-4 w-4 text-green-400" />;
      case 'sell':
        return <ArrowDown className="h-4 w-4 text-red-400" />;
      case 'swap':
        return <RotateCcw className="h-4 w-4 text-blue-400" />;
      case 'deposit':
        return <Wallet className="h-4 w-4 text-purple-400" />;
      default:
        return <ArrowDown className="h-4 w-4 text-orange-400" />;
    }
  };

  const getTransactionDescription = (tx: any) => {
    switch (tx.type) {
      case 'buy':
        return `Bought ${tx.toSymbol}`;
      case 'sell':
        return `Sold ${tx.fromSymbol}`;
      case 'swap':
        return `Swapped ${tx.fromSymbol} → ${tx.toSymbol}`;
      case 'deposit':
        return 'Deposited USD';
      default:
        return tx.type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 text-xs">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400 text-xs">Failed</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
            View All
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction: any) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-card/30 rounded-lg hover:bg-card/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-card/50 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{getTransactionDescription(transaction)}</div>
                    <div className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {transaction.type === 'buy' || transaction.type === 'deposit' ? '+' : '-'}
                      {parseFloat(transaction.amount).toFixed(6)} {transaction.toSymbol || transaction.fromSymbol}
                    </div>
                    <div className="text-xs text-gray-400">
                      ${parseFloat(transaction.total).toFixed(2)}
                    </div>
                  </div>
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">No transactions yet</div>
            <p className="text-sm text-gray-500 mb-4">Your trading activity will appear here</p>
            <Button className="crypto-gradient text-black font-medium">
              Start Trading
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
