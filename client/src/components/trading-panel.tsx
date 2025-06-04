import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Bitcoin, CreditCard, ChevronDown } from "lucide-react";

export default function TradingPanel() {
  const [activeTab, setActiveTab] = useState("buy");
  const [selectedAsset, setSelectedAsset] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: marketData = [] } = useQuery({
    queryKey: ["/api/market-data"],
  });

  const tradeMutation = useMutation({
    mutationFn: async (tradeData: any) => {
      return await apiRequest("POST", "/api/trade", tradeData);
    },
    onSuccess: () => {
      toast({
        title: "Trade Successful",
        description: `Successfully ${activeTab === "buy" ? "bought" : "sold"} ${selectedAsset}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      setAmount("");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Trade Failed",
        description: error.message || "An error occurred while processing your trade",
        variant: "destructive",
      });
    },
  });

  const currentPrice = marketData.find((m: any) => m.symbol === selectedAsset)?.price || "0";
  const fee = parseFloat(amount || "0") * parseFloat(currentPrice) * 0.001; // 0.1% fee
  const total = parseFloat(amount || "0") * parseFloat(currentPrice) + (activeTab === "buy" ? fee : -fee);

  const handleTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    tradeMutation.mutate({
      type: activeTab,
      symbol: selectedAsset,
      amount: amount,
      price: currentPrice,
    });
  };

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Quick Trade
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="bg-card/50 p-1">
              <TabsTrigger value="buy" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-400">
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                Sell
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Asset Selection */}
        <div>
          <Label className="text-sm text-gray-400 mb-2 block">
            You're {activeTab === "buy" ? "buying" : "selling"}
          </Label>
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="bg-card/50 border-border/50">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                  <Bitcoin className="h-3 w-3 text-black" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Bitcoin</div>
                  <div className="text-xs text-gray-400">BTC</div>
                </div>
              </div>
            </SelectTrigger>
            <SelectContent>
              {marketData.map((asset: any) => (
                <SelectItem key={asset.symbol} value={asset.symbol}>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-black">{asset.symbol[0]}</span>
                    </div>
                    <div>
                      <div className="font-medium">{getAssetName(asset.symbol)}</div>
                      <div className="text-xs text-gray-400">{asset.symbol}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount Input */}
        <div>
          <Label className="text-sm text-gray-400 mb-2 block">Amount</Label>
          <div className="bg-card/50 border border-border/50 rounded-lg p-3">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-transparent border-none text-lg font-medium p-0 focus-visible:ring-0"
            />
            <div className="text-xs text-gray-400 mt-1">
              ≈ ${(parseFloat(amount || "0") * parseFloat(currentPrice)).toFixed(2)} USD
            </div>
          </div>
        </div>

        {/* Payment Method */}
        {activeTab === "buy" && (
          <div>
            <Label className="text-sm text-gray-400 mb-2 block">Payment method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="bg-card/50 border-border/50">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-blue-400" />
                  <span>Visa ****1234</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-blue-400" />
                    <span>Visa ****1234</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Price per {selectedAsset}</span>
            <span>${parseFloat(currentPrice).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Trading fee</span>
            <span>${fee.toFixed(2)}</span>
          </div>
          <Separator className="bg-border/50" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className={activeTab === "buy" ? "text-green-400" : "text-red-400"}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Trade Button */}
        <Button
          onClick={handleTrade}
          disabled={tradeMutation.isPending || !amount}
          className={`w-full font-semibold py-3 ${
            activeTab === "buy"
              ? "crypto-gradient text-black neon-glow"
              : "crypto-warning-gradient text-black"
          } hover:opacity-90 transition-opacity`}
        >
          {tradeMutation.isPending
            ? "Processing..."
            : `${activeTab === "buy" ? "Buy" : "Sell"} ${selectedAsset}`}
        </Button>
      </CardContent>
    </Card>
  );
}

function getAssetName(symbol: string): string {
  const names: Record<string, string> = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'ADA': 'Cardano',
    'DOT': 'Polkadot',
    'SOL': 'Solana',
  };
  return names[symbol] || symbol;
}
