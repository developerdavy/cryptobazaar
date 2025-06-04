import { Button } from "@/components/ui/button";
import { Box, Wallet, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard" },
    { href: "/trade", label: "Trade" },
    { href: "/wallet", label: "Wallet" },
    { href: "/markets", label: "Markets" },
    { href: "/history", label: "History" },
  ];

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-ring to-primary rounded-lg flex items-center justify-center">
                  <Box className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">CryptoX</span>
              </div>
            </Link>
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`transition-colors ${
                      location === item.href
                        ? "text-ring"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-card rounded-lg px-3 py-2">
              <Wallet className="w-4 h-4 text-ring" />
              <span className="text-sm">$22,048.12</span>
            </div>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden md:inline text-sm">Demo User</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
