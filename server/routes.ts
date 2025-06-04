import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Portfolio routes
  app.get("/api/portfolio", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const holdings = await storage.getUserHoldings(userId);
      
      // Calculate portfolio totals
      let totalBalance = 0;
      let dailyPnL = 0;
      
      for (const holding of holdings) {
        const marketData = await storage.getMarketData(holding.cryptocurrency);
        if (marketData) {
          const currentValue = parseFloat(holding.balance) * parseFloat(marketData.price);
          totalBalance += currentValue;
          
          const change24h = parseFloat(marketData.priceChange24h);
          dailyPnL += currentValue * (change24h / 100);
        }
      }
      
      res.json({
        totalBalance,
        availableBalance: 12543.67, // Mock available balance
        dailyPnL,
        dailyPnLPercent: totalBalance > 0 ? (dailyPnL / totalBalance) * 100 : 0,
        totalTrades: 127, // Mock total trades
      });
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Holdings routes
  app.get("/api/holdings", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const holdings = await storage.getUserHoldings(userId);
      
      // Enrich holdings with market data
      const enrichedHoldings = await Promise.all(
        holdings.map(async (holding) => {
          const marketData = await storage.getMarketData(holding.cryptocurrency);
          return {
            ...holding,
            currentPrice: marketData ? parseFloat(marketData.price) : 0,
            priceChange24h: marketData ? parseFloat(marketData.priceChange24h) : 0,
            usdValue: marketData ? parseFloat(holding.balance) * parseFloat(marketData.price) : 0,
          };
        })
      );
      
      res.json(enrichedHoldings);
    } catch (error) {
      console.error("Error fetching holdings:", error);
      res.status(500).json({ message: "Failed to fetch holdings" });
    }
  });

  // Transaction routes
  app.get("/api/transactions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await storage.getUserTransactions(userId, limit);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Trading routes
  const tradeSchema = z.object({
    type: z.enum(['buy', 'sell']),
    cryptocurrency: z.string(),
    amount: z.number().positive(),
    fiatAmount: z.number().positive(),
  });

  app.post("/api/trades", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tradeData = tradeSchema.parse(req.body);
      
      // Get current market price
      let marketData = await storage.getMarketData(tradeData.cryptocurrency);
      if (!marketData) {
        // Mock market prices for demo
        const mockPrices: { [key: string]: number } = {
          'BTC': 43521,
          'ETH': 2341,
          'ADA': 0.5,
        };
        const price = mockPrices[tradeData.cryptocurrency] || 100;
        marketData = await storage.upsertMarketData(tradeData.cryptocurrency, price, 2.34);
      }
      
      const price = parseFloat(marketData.price);
      const fee = 0.99; // Fixed fee for demo
      
      // Create transaction record
      const transaction = await storage.createTransaction({
        userId,
        type: tradeData.type,
        cryptocurrency: tradeData.cryptocurrency,
        amount: tradeData.amount.toString(),
        fiatAmount: tradeData.fiatAmount.toString(),
        price: price.toString(),
        fee: fee.toString(),
        status: 'completed',
      });
      
      // Update holdings
      const existingHolding = await storage.getHolding(userId, tradeData.cryptocurrency);
      const currentBalance = existingHolding ? parseFloat(existingHolding.balance) : 0;
      const currentAvgCost = existingHolding ? parseFloat(existingHolding.averageCost) : 0;
      
      let newBalance: number;
      let newAvgCost: number;
      
      if (tradeData.type === 'buy') {
        newBalance = currentBalance + tradeData.amount;
        // Calculate new average cost
        const totalCost = (currentBalance * currentAvgCost) + (tradeData.amount * price);
        newAvgCost = newBalance > 0 ? totalCost / newBalance : price;
      } else {
        newBalance = Math.max(0, currentBalance - tradeData.amount);
        newAvgCost = currentAvgCost; // Keep same average cost when selling
      }
      
      await storage.upsertHolding({
        userId,
        cryptocurrency: tradeData.cryptocurrency,
        balance: newBalance.toString(),
        averageCost: newAvgCost.toString(),
      });
      
      res.json({ success: true, transaction });
    } catch (error) {
      console.error("Error executing trade:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid trade data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to execute trade" });
      }
    }
  });

  // Market data routes
  app.get("/api/market/:symbol", async (req, res) => {
    try {
      const symbol = req.params.symbol.toUpperCase();
      let marketData = await storage.getMarketData(symbol);
      
      if (!marketData) {
        // Mock market prices for demo
        const mockPrices: { [key: string]: number } = {
          'BTC-USD': 43521,
          'BTC': 43521,
          'ETH-USD': 2341,
          'ETH': 2341,
          'ADA-USD': 0.5,
          'ADA': 0.5,
        };
        const price = mockPrices[symbol] || 100;
        marketData = await storage.upsertMarketData(symbol, price, 2.34);
      }
      
      res.json({
        symbol,
        price: parseFloat(marketData.price),
        priceChange24h: parseFloat(marketData.priceChange24h),
        volume24h: parseFloat(marketData.volume24h),
        marketCap: parseFloat(marketData.marketCap),
        lastUpdated: marketData.updatedAt,
      });
    } catch (error) {
      console.error("Error fetching market data:", error);
      res.status(500).json({ message: "Failed to fetch market data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
