import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Wallet, CreditCard } from "lucide-react";

export default function TradingPanel() {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const tradeMutation = useMutation({
    mutationFn: async (tradeData: any) => {
      return apiRequest('POST', '/api/trades', tradeData);
    },
    onSuccess: () => {
      toast({
        title: "Trade Successful",
        description: `Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${amount} ${selectedCrypto}`,
      });
      setAmount('');
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
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
        description: error.message || "Failed to execute trade",
        variant: "destructive",
      });
    },
  });

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
      type: tradeType,
      cryptocurrency: selectedCrypto,
      amount: parseFloat(amount),
      fiatAmount: parseFloat(amount) * (selectedCrypto === 'BTC' ? 43521 : selectedCrypto === 'ETH' ? 2341 : 0.5)
    });
  };

  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Quick Trade</h2>
          <div className="flex bg-card rounded-lg p-1">
            <Button
              variant={tradeType === 'buy' ? "default" : "ghost"}
              size="sm"
              onClick={() => setTradeType('buy')}
              className={tradeType === 'buy' ? "bg-ring text-black font-medium" : ""}
            >
              Buy
            </Button>
            <Button
              variant={tradeType === 'sell' ? "default" : "ghost"}
              size="sm"
              onClick={() => setTradeType('sell')}
              className={tradeType === 'sell' ? "bg-ring text-black font-medium" : ""}
            >
              Sell
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">
              You're {tradeType === 'buy' ? 'buying' : 'selling'}
            </Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger className="bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-effect">
                <SelectItem value="BTC">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold">₿</div>
                    <div>
                      <div className="font-medium">Bitcoin</div>
                      <div className="text-xs text-muted-foreground">BTC</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="ETH">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">Ξ</div>
                    <div>
                      <div className="font-medium">Ethereum</div>
                      <div className="text-xs text-muted-foreground">ETH</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="ADA">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-black">A</div>
                    <div>
                      <div className="font-medium">Cardano</div>
                      <div className="text-xs text-muted-foreground">ADA</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Amount</Label>
            <div className="bg-input rounded-lg p-3">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-lg font-medium border-none shadow-none focus-visible:ring-0"
              />
              <div className="text-xs text-muted-foreground mt-1">
                ≈ ${amount ? (parseFloat(amount) * (selectedCrypto === 'BTC' ? 43521 : selectedCrypto === 'ETH' ? 2341 : 0.5)).toLocaleString() : '0.00'} USD
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-sm text-muted-foreground mb-2 block">Payment method</Label>
            <div className="bg-input rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Visa ****1234</span>
              </div>
            </div>
          </div>
          
          <div className="bg-secondary rounded-lg p-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Price per {selectedCrypto}</span>
              <span>
                ${selectedCrypto === 'BTC' ? '43,521.00' : selectedCrypto === 'ETH' ? '2,341.00' : '0.50'}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Trading fee</span>
              <span>$0.99</span>
            </div>
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="text-ring">
                  ${amount ? (parseFloat(amount) * (selectedCrypto === 'BTC' ? 43521 : selectedCrypto === 'ETH' ? 2341 : 0.5) + 0.99).toLocaleString() : '0.99'}
                </span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleTrade}
            disabled={tradeMutation.isPending || !amount}
            className="w-full bg-gradient-to-r from-ring to-primary text-black font-semibold neon-glow hover:opacity-90"
          >
            {tradeMutation.isPending ? 'Processing...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} ${selectedCrypto}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
