import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, ArrowUp, ArrowDown, RotateCcw, Wallet } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const filteredTransactions = transactions.filter((tx: any) => {
    const matchesSearch = 
      tx.toSymbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.fromSymbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || tx.type === filterType;
    
    return matchesSearch && matchesFilter;
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
        return <Badge className="bg-green-500/20 text-green-400">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-400">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
        <p className="text-gray-400">View and manage your trading activity</p>
      </div>

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="glass-effect border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-400 mb-1">Total Transactions</div>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-effect border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-400 mb-1">Total Traded</div>
            <div className="text-2xl font-bold text-green-400">
              ${transactions.reduce((sum: number, tx: any) => sum + parseFloat(tx.total || '0'), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-effect border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-400 mb-1">Total Fees</div>
            <div className="text-2xl font-bold">
              ${transactions.reduce((sum: number, tx: any) => sum + parseFloat(tx.fee || '0'), 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-effect border-border/50">
          <CardContent className="p-6">
            <div className="text-sm text-gray-400 mb-1">This Month</div>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="glass-effect border-border/50">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <CardTitle className="text-xl">All Transactions</CardTitle>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-card/50 border-border/50 w-full sm:w-64"
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-card/50 border-border/50 w-full sm:w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="swap">Swap</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" className="border-border/50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-card/30 rounded-lg hover:bg-card/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-card/50 rounded-full flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="font-medium">{getTransactionDescription(transaction)}</div>
                      <div className="text-sm text-gray-400">
                        {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="font-medium">
                        {transaction.type === 'buy' || transaction.type === 'deposit' ? '+' : '-'}
                        {parseFloat(transaction.amount).toFixed(6)} {transaction.toSymbol || transaction.fromSymbol}
                      </div>
                      <div className="text-sm text-gray-400">
                        ${parseFloat(transaction.total).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Fee</div>
                      <div className="text-sm">${parseFloat(transaction.fee || '0').toFixed(2)}</div>
                    </div>
                    
                    <div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No transactions found</div>
                <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
