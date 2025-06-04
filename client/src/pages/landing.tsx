import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Box, TrendingUp, Shield, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="glass-effect border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-ring to-primary rounded-lg flex items-center justify-center">
                <Box className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">CryptoX</span>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-ring to-primary text-black font-semibold neon-glow hover:opacity-90"
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-ring via-primary to-ring bg-clip-text text-transparent">
            Advanced Crypto Trading
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the future of cryptocurrency trading with our cutting-edge platform. 
            Trade, swap, and manage your digital assets with confidence.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg"
            className="bg-gradient-to-r from-ring to-primary text-black font-semibold text-lg px-8 py-3 neon-glow hover:opacity-90"
          >
            Start Trading Now
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="glass-effect trade-card">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-ring mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Advanced Trading</h3>
              <p className="text-muted-foreground">
                Professional trading tools with real-time charts and advanced order types
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect trade-card">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 text-ring mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
              <p className="text-muted-foreground">
                Bank-level security with multi-factor authentication and cold storage
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect trade-card">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-ring mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Ultra-low latency trading engine with instant order execution
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-ring mb-2">$2.5B+</div>
            <div className="text-muted-foreground">Trading Volume</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-ring mb-2">50+</div>
            <div className="text-muted-foreground">Cryptocurrencies</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-ring mb-2">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-ring mb-2">1M+</div>
            <div className="text-muted-foreground">Active Users</div>
          </div>
        </div>
      </main>
    </div>
  );
}
