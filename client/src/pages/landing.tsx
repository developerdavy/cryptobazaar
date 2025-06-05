import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Shield, Headphones } from "lucide-react";
import { Link } from "wouter";

export default function Landing() {
  const cryptoCards = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "$134,849.23",
      change: "+5.31%",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      chartColor: "stroke-yellow-500"
    },
    {
      name: "Ethereum", 
      symbol: "ETH",
      price: "$2,604.19",
      change: "-1.48%",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      chartColor: "stroke-blue-500"
    },
    {
      name: "Bitcoin",
      symbol: "BTC", 
      price: "$132.09",
      change: "+2.00%",
      color: "text-gray-600",
      bgColor: "bg-gray-500/10",
      chartColor: "stroke-gray-500"
    },
    {
      name: "Solana",
      symbol: "SOL",
      price: "$0.58",
      change: "+3.21%",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10", 
      chartColor: "stroke-purple-500"
    }
  ];

  const features = [
    {
      title: "Global Crypto Trading Made Simple",
      description: "Trade crypto and fiat currencies from anywhere, anytime. All its triggers on digital currencies with the lowest fees."
    },
    {
      title: "Buy and Sell 200+ Crypto and Fiat Currencies at...",
      description: "From Bitcoin to ethereum the Phantom, USDT and Solana plus major fiat currencies including USD and CAD."
    },
    {
      title: "Pay and Withdraw Your Way",
      description: "We give you the option of selecting the digital currency to sell and your preferred method of deposit method."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-blue-800">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <img src="/attached_assets/chicksx-main-logo-hover_1749112747335.png" alt="ChicksX" className="h-8" />
            <nav className="hidden md:flex space-x-6">
              <Button variant="ghost" className="text-white hover:text-purple-200">
                Buy Crypto <span className="ml-1">▼</span>
              </Button>
              <Button variant="ghost" className="text-white hover:text-purple-200">
                Sell Crypto <span className="ml-1">▼</span>
              </Button>
              <Button variant="ghost" className="text-white hover:text-purple-200">
                Swap <span className="ml-1">▼</span>
              </Button>
            </nav>
          </div>
          <Button className="bg-purple-700 hover:bg-purple-600 text-white px-6">
            👤 Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-8">
            <h1 className="text-5xl font-bold leading-tight">
              The Lowest Fee<br />
              Crypto Exchange
            </h1>
            <p className="text-xl text-purple-200">
              Buy, sell, exchange bitcoin, crypto or fiat instantly in<br />
              any major city around the globe.
            </p>
            <Button className="bg-white text-purple-900 hover:bg-purple-100 px-8 py-3 text-lg font-semibold">
              Exchange Now
            </Button>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Fintrac & Fincen registered</div>
                  <Link href="#" className="text-purple-200 text-sm hover:underline">
                    Learn more →
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="font-semibold">★★★★✩ 4.4/5</div>
                  <Link href="#" className="text-purple-200 text-sm hover:underline">
                    Customers review on trustpilot.com →
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/attached_assets/fd7028f1b02c88789f6f (1)_1749112747335.png" 
              alt="ChicksX Mobile App" 
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Crypto Cards Section */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {cryptoCards.map((crypto, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-8 h-8 ${crypto.bgColor} rounded-full flex items-center justify-center`}>
                      <span className={`text-sm font-bold ${crypto.color}`}>₿</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{crypto.name}</div>
                      <div className="text-xs text-gray-500">{crypto.symbol}</div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="font-bold text-lg">{crypto.price}</div>
                    <div className={`text-sm ${crypto.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {crypto.change}
                    </div>
                  </div>
                  <div className="h-12 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 40">
                      <path
                        d="M0,20 Q25,10 50,15 T100,25"
                        fill="none"
                        strokeWidth="2"
                        className={crypto.chartColor}
                      />
                    </svg>
                  </div>
                  <Link href="#" className="text-purple-600 text-xs hover:underline">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>
            ))}
            <Card className="bg-purple-100">
              <CardContent className="p-4 flex flex-col justify-center items-center text-center h-full">
                <div className="text-purple-700 font-semibold mb-2">
                  View more than<br />200+<br />cryptocurrencies<br />here
                </div>
                <Link href="#" className="text-purple-600 text-xs hover:underline">
                  Learn more →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why ChicksX Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why ChicksX?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We are committed to upholding the integrity, trust, and privacy of our brand in order to best serve the needs of our clients. Our top priority is to provide our customers with a secure exchange platform where all your personal data is secure and protected. By continuously validating and perfecting our security measures and protocols, we ensure to provide the safest platform possible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <Button className="bg-purple-700 hover:bg-purple-600 text-white">
                  Learn more
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-purple-900 to-purple-700">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-8 h-8" />
              <h2 className="text-3xl font-bold">Security</h2>
            </div>
            <p className="text-purple-200 mb-6">
              Our top priority is to provide our customers with a secure exchange platform where all your personal information and data is encrypted, stored, and protected. We are dedicated to user protection with multi-layer protocols and industry-leading security measures. Your data is 100% secure via advanced encryption, ensuring that only you have access to your personal information.
            </p>
            <Button className="bg-white text-purple-900 hover:bg-purple-100">
              Learn More
            </Button>
          </div>
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-purple-600/30 rounded-full flex items-center justify-center">
              <Shield className="w-32 h-32 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* 24/7 Support Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Headphones className="w-8 h-8 text-purple-700" />
            <h2 className="text-3xl font-bold">24/7 Live Support</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            To provide our customers with the best live support possible, we provide 24/7 customer support. Our live chat will connect you to one of our specialists who will happily assist you with any inquiries or questions you may have.
          </p>
          <p className="text-gray-600 mb-6">Feel free to connect with us at any time.</p>
          <Button className="bg-purple-700 hover:bg-purple-600 text-white">
            Get In Touch
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <img src="/attached_assets/chicksx-main-logo-hover_1749112747335.png" alt="ChicksX" className="h-8 mb-4" />
              <p className="text-gray-600 text-sm">
                @chicksx.com 2024
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ChicksX</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Help ▼</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help</li>
                <li>Contact us</li>
                <li>Service</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>Use ▼</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Social</h4>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                <div className="w-8 h-8 bg-blue-800 rounded-full"></div>
                <div className="w-8 h-8 bg-blue-700 rounded-full"></div>
              </div>
              <div className="mt-2">
                <div className="text-sm font-semibold">Trustpilot Reviews</div>
                <div className="flex text-green-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <div className="text-xs text-gray-600">★★★★✩ 4.4/5</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}