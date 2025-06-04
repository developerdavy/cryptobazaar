import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Coins, TrendingUp, ArrowUpDown } from "lucide-react";
import PriceChart from "@/components/PriceChart";
import TradingPanel from "@/components/TradingPanel";
import PortfolioHoldings from "@/components/PortfolioHoldings";
import RecentTransactions from "@/components/RecentTransactions";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
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

  const { data: portfolioData } = useQuery({
    queryKey: ["/api/portfolio"],
    retry: false,
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass-effect trade-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Total Balance</span>
                <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer" />
              </div>
              <div className="text-2xl font-bold text-ring">$47,823.91</div>
              <div className="text-sm text-ring">+2.34% (24h)</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect trade-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Available Balance</span>
                <Coins className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-bold">$12,543.67</div>
              <div className="text-sm text-muted-foreground">Ready to trade</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect trade-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">24h P&L</span>
                <TrendingUp className="w-4 h-4 text-ring" />
              </div>
              <div className="text-2xl font-bold text-ring">+$1,127.43</div>
              <div className="text-sm text-ring">+2.41%</div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect trade-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Total Trades</span>
                <ArrowUpDown className="w-4 h-4 text-destructive" />
              </div>
              <div className="text-2xl font-bold">127</div>
              <div className="text-sm text-muted-foreground">This month</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Trading Panel */}
          <div className="lg:col-span-1">
            <TradingPanel />
          </div>
          
          {/* Price Chart */}
          <div className="lg:col-span-2">
            <PriceChart />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Portfolio Holdings */}
          <PortfolioHoldings />
          
          {/* Recent Transactions */}
          <RecentTransactions />
        </div>
      </main>
    </div>
  );
}
