import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Wallet, Eye, EyeOff, Plus, ArrowUpRight, Copy, Send, Download } from "lucide-react";

export default function WalletPage() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const queryClient = useQueryClient();

  const { data: holdings = [] } = useQuery({
    queryKey: ["/api/holdings"],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

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

  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest('POST', '/api/wallet/deposit', { amount });
    },
    onSuccess: () => {
      toast({ title: "Deposit Successful", description: "Funds have been added to your account" });
      setDepositAmount("");
      queryClient.invalidateQueries({ queryKey: ['/api/holdings'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => window.location.href = "/api/login", 500);
        return;
      }
      toast({ title: "Deposit Failed", description: error.message, variant: "destructive" });
    },
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

  const totalValue = Array.isArray(holdings) ? holdings.reduce((sum: number, holding: any) => sum + (holding.usdValue || 0), 0) : 22048.12;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wallet</h1>
          <p className="text-muted-foreground">Manage your cryptocurrency portfolio</p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Portfolio Balance</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBalanceVisible(!balanceVisible)}
                >
                  {balanceVisible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-ring">
                    {balanceVisible ? `$${totalValue.toLocaleString()}` : '****'}
                  </div>
                  <div className="text-sm text-ring flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    +$1,127.43 (2.41%) today
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Available Balance</div>
                    <div className="text-xl font-semibold">
                      {balanceVisible ? '$12,543.67' : '****'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Invested</div>
                    <div className="text-xl font-semibold">
                      {balanceVisible ? `$${(totalValue - 12543.67).toLocaleString()}` : '****'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-ring/20 text-ring hover:bg-ring/30">
                    <Download className="h-4 w-4 mr-2" />
                    Deposit
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect">
                  <DialogHeader>
                    <DialogTitle>Deposit Funds</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Amount (USD)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={() => depositMutation.mutate(parseFloat(depositAmount))}
                      disabled={depositMutation.isPending || !depositAmount}
                      className="w-full bg-ring text-black"
                    >
                      {depositMutation.isPending ? 'Processing...' : 'Deposit'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-destructive/20 text-destructive hover:bg-destructive/30">
                    <Send className="h-4 w-4 mr-2" />
                    Withdraw
                  </Button>
                </DialogTrigger>
                <DialogContent className="glass-effect">
                  <DialogHeader>
                    <DialogTitle>Withdraw Funds</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Amount (USD)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>
                    <Button variant="destructive" className="w-full">
                      Withdraw
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button className="w-full" variant="outline">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Trade
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Assets and History */}
        <Tabs defaultValue="assets" className="space-y-6">
          <TabsList className="glass-effect">
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="assets">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Your Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No assets found. Start trading to see your holdings here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No transactions yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Wallet Addresses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-card/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Bitcoin Address</div>
                        <div className="text-sm text-muted-foreground font-mono">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                        navigator.clipboard.writeText('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh');
                        toast({ title: "Address Copied", description: "Bitcoin address copied to clipboard" });
                      }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-card/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Ethereum Address</div>
                        <div className="text-sm text-muted-foreground font-mono">0x742d35Cc6634C0532925a3b8D98d40B80c2fcdc4</div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => {
                        navigator.clipboard.writeText('0x742d35Cc6634C0532925a3b8D98d40B80c2fcdc4');
                        toast({ title: "Address Copied", description: "Ethereum address copied to clipboard" });
                      }}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}