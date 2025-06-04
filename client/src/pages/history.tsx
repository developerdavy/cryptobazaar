import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Search, Filter, Download, ArrowUpDown, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";

export default function History() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("7d");

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  // Mock transaction data for demonstration
  const mockTransactions = [
    {
      id: '1',
      type: 'buy',
      cryptocurrency: 'BTC',
      amount: '0.0234',
      fiatAmount: '1000.00',
      price: '42735.90',
      fee: '2.50',
      status: 'completed',
      createdAt: new Date('2024-01-15T10:30:00Z').toISOString(),
    },
    {
      id: '2',
      type: 'sell',
      cryptocurrency: 'ETH',
      amount: '0.5',
      fiatAmount: '1170.75',
      price: '2341.50',
      fee: '2.93',
      status: 'completed',
      createdAt: new Date('2024-01-14T15:45:00Z').toISOString(),
    },
    {
      id: '3',
      type: 'buy',
      cryptocurrency: 'ADA',
      amount: '1000',
      fiatAmount: '520.00',
      price: '0.52',
      fee: '1.30',
      status: 'completed',
      createdAt: new Date('2024-01-13T09:15:00Z').toISOString(),
    },
    {
      id: '4',
      type: 'sell',
      cryptocurrency: 'BTC',
      amount: '0.01',
      fiatAmount: '427.36',
      price: '42736.00',
      fee: '1.07',
      status: 'pending',
      createdAt: new Date('2024-01-12T14:22:00Z').toISOString(),
    },
    {
      id: '5',
      type: 'buy',
      cryptocurrency: 'SOL',
      amount: '10',
      fiatAmount: '984.50',
      price: '98.45',
      fee: '2.46',
      status: 'completed',
      createdAt: new Date('2024-01-11T11:30:00Z').toISOString(),
    },
  ];

  const displayTransactions = Array.isArray(transactions) && transactions.length > 0 ? transactions : mockTransactions;

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

  const filteredTransactions = displayTransactions.filter((tx: any) => {
    const matchesSearch = tx.cryptocurrency.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tx.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowUp className="w-4 h-4 text-ring" />;
      case 'sell':
        return <ArrowDown className="w-4 h-4 text-destructive" />;
      default:
        return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'text-ring bg-ring/20';
      case 'sell':
        return 'text-destructive bg-destructive/20';
      default:
        return 'text-muted-foreground bg-muted/20';
    }
  };

  const getCryptoIcon = (symbol: string) => {
    switch (symbol) {
      case 'BTC':
        return '₿';
      case 'ETH':
        return 'Ξ';
      default:
        return symbol[0];
    }
  };

  const getCryptoBg = (symbol: string) => {
    switch (symbol) {
      case 'BTC':
        return 'bg-yellow-500';
      case 'ETH':
        return 'bg-blue-500';
      case 'ADA':
        return 'bg-blue-400';
      case 'SOL':
        return 'bg-purple-500';
      default:
        return 'bg-gradient-to-r from-primary to-ring';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">Track all your trading activity and transactions</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search transactions..."
              className="pl-10 glass-effect border-border/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48 glass-effect border-border/50">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="buy">Buy Orders</SelectItem>
              <SelectItem value="sell">Sell Orders</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-48 glass-effect border-border/50">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-border/50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Trades</div>
              <div className="text-2xl font-bold">{filteredTransactions.length}</div>
              <div className="text-sm text-ring">+12 this month</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Volume</div>
              <div className="text-2xl font-bold">$3,167.11</div>
              <div className="text-sm text-ring">+5.2%</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Total Fees</div>
              <div className="text-2xl font-bold">$10.26</div>
              <div className="text-sm text-muted-foreground">0.32% avg</div>
            </CardContent>
          </Card>
          <Card className="glass-effect">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Success Rate</div>
              <div className="text-2xl font-bold text-ring">98.5%</div>
              <div className="text-sm text-ring">Excellent</div>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History */}
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction: any) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-card/30 rounded-lg hover:bg-card/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(transaction.type)}`}>
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div className={`w-8 h-8 ${getCryptoBg(transaction.cryptocurrency)} rounded-full flex items-center justify-center`}>
                        <span className="text-xs font-bold text-black">
                          {getCryptoIcon(transaction.cryptocurrency)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.type.toUpperCase()} {transaction.cryptocurrency}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">
                        {transaction.amount} {transaction.cryptocurrency}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        @ ${parseFloat(transaction.price).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">
                        ${parseFloat(transaction.fiatAmount).toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Fee: ${parseFloat(transaction.fee).toFixed(2)}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                        className={transaction.status === 'completed' ? 'bg-ring/20 text-ring' : 'bg-yellow-500/20 text-yellow-400'}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <ArrowUpDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Trading Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Best Performing Asset</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">S</span>
                    </div>
                    <span className="font-medium">SOL</span>
                    <Badge className="bg-ring/20 text-ring">+12.5%</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total P&L</span>
                  <span className="font-medium text-ring">+$847.23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Win Rate</span>
                  <span className="font-medium">73.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Average Trade Size</span>
                  <span className="font-medium">$633.42</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Asset Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">₿</span>
                    </div>
                    <span>Bitcoin</span>
                  </div>
                  <span className="font-medium">45.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">Ξ</span>
                    </div>
                    <span>Ethereum</span>
                  </div>
                  <span className="font-medium">28.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">A</span>
                    </div>
                    <span>Cardano</span>
                  </div>
                  <span className="font-medium">16.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">S</span>
                    </div>
                    <span>Solana</span>
                  </div>
                  <span className="font-medium">9.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}