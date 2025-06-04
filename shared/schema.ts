import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Holdings table for cryptocurrency balances
export const holdings = pgTable("holdings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  cryptocurrency: varchar("cryptocurrency").notNull(), // BTC, ETH, ADA, etc.
  balance: decimal("balance", { precision: 20, scale: 10 }).notNull().default("0"),
  averageCost: decimal("average_cost", { precision: 20, scale: 10 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transactions table for trade history
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type").notNull(), // buy, sell, swap, deposit, withdraw
  cryptocurrency: varchar("cryptocurrency").notNull(),
  amount: decimal("amount", { precision: 20, scale: 10 }).notNull(),
  fiatAmount: decimal("fiat_amount", { precision: 20, scale: 2 }).notNull(),
  price: decimal("price", { precision: 20, scale: 10 }).notNull(),
  fee: decimal("fee", { precision: 20, scale: 2 }).notNull().default("0"),
  status: varchar("status").notNull().default("completed"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
});

// Market data table for cryptocurrency prices
export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  cryptocurrency: varchar("cryptocurrency").notNull(),
  price: decimal("price", { precision: 20, scale: 10 }).notNull(),
  priceChange24h: decimal("price_change_24h", { precision: 10, scale: 4 }).notNull().default("0"),
  volume24h: decimal("volume_24h", { precision: 20, scale: 2 }).notNull().default("0"),
  marketCap: decimal("market_cap", { precision: 20, scale: 2 }).notNull().default("0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertHoldingSchema = createInsertSchema(holdings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertHolding = z.infer<typeof insertHoldingSchema>;
export type Holding = typeof holdings.$inferSelect;

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export type MarketData = typeof marketData.$inferSelect;
