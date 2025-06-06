import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Declare exports at top level
export let pool: any;
export let db: any;

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL is not set!");
  console.warn("📝 To fix this:");
  console.warn("   1. Click the 'Secrets' tab (lock icon) in the left sidebar");
  console.warn("   2. Add a new secret named 'DATABASE_URL'");
  console.warn("   3. Set the value to your PostgreSQL connection string");
  console.warn("   4. Restart the application");
  console.warn("");
  console.warn("🔧 For now, the app will run without database functionality.");
  
  // Create a mock database connection for development
  const mockPool = {
    query: () => Promise.resolve({ rows: [] }),
    end: () => Promise.resolve()
  } as any;
  
  pool = mockPool;
  db = drizzle({ client: mockPool, schema });
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}