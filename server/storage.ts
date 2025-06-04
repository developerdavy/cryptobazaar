import {
  users,
  holdings,
  transactions,
  marketData,
  type User,
  type UpsertUser,
  type Holding,
  type InsertHolding,
  type Transaction,
  type InsertTransaction,
  type MarketData,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Holdings operations
  getUserHoldings(userId: string): Promise<Holding[]>;
  getHolding(userId: string, cryptocurrency: string): Promise<Holding | undefined>;
  upsertHolding(holding: InsertHolding): Promise<Holding>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getUserTransactions(userId: string, limit?: number): Promise<Transaction[]>;
  
  // Market data operations
  getMarketData(cryptocurrency: string): Promise<MarketData | undefined>;
  upsertMarketData(cryptocurrency: string, price: number, priceChange24h?: number): Promise<MarketData>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Holdings operations
  async getUserHoldings(userId: string): Promise<Holding[]> {
    return await db
      .select()
      .from(holdings)
      .where(eq(holdings.userId, userId))
      .orderBy(desc(holdings.balance));
  }

  async getHolding(userId: string, cryptocurrency: string): Promise<Holding | undefined> {
    const [holding] = await db
      .select()
      .from(holdings)
      .where(and(eq(holdings.userId, userId), eq(holdings.cryptocurrency, cryptocurrency)));
    return holding;
  }

  async upsertHolding(holdingData: InsertHolding): Promise<Holding> {
    const [holding] = await db
      .insert(holdings)
      .values(holdingData)
      .onConflictDoUpdate({
        target: [holdings.userId, holdings.cryptocurrency],
        set: {
          balance: holdingData.balance,
          averageCost: holdingData.averageCost,
          updatedAt: new Date(),
        },
      })
      .returning();
    return holding;
  }

  // Transaction operations
  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(transactionData)
      .returning();
    return transaction;
  }

  async getUserTransactions(userId: string, limit: number = 10): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
  }

  // Market data operations
  async getMarketData(cryptocurrency: string): Promise<MarketData | undefined> {
    const [data] = await db
      .select()
      .from(marketData)
      .where(eq(marketData.cryptocurrency, cryptocurrency));
    return data;
  }

  async upsertMarketData(cryptocurrency: string, price: number, priceChange24h: number = 0): Promise<MarketData> {
    const [data] = await db
      .insert(marketData)
      .values({
        cryptocurrency,
        price: price.toString(),
        priceChange24h: priceChange24h.toString(),
        volume24h: "0",
        marketCap: "0",
      })
      .onConflictDoUpdate({
        target: marketData.cryptocurrency,
        set: {
          price: price.toString(),
          priceChange24h: priceChange24h.toString(),
          updatedAt: new Date(),
        },
      })
      .returning();
    return data;
  }
}

export const storage = new DatabaseStorage();
