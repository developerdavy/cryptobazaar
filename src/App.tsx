import React from 'react';
import { Shield, Star, MessageCircle, ChevronDown } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <img 
                src="/chicksx-main-logo-hover.png" 
                alt="ChicksX Logo" 
                className="h-8"
              />
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 cursor-pointer">
                <span>Buy Crypto</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 cursor-pointer">
                <span>Sell Crypto</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 cursor-pointer">
                <span>Swap</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </nav>
          </div>
          <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                The Lowest Fee<br />
                Crypto Exchange
              </h1>
              <p className="text-xl mb-8 text-purple-100">
                Buy, sell, exchange bitcoin, crypto or fiat instantly in<br />
                any major city around the globe.
              </p>
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors mb-12">
                Exchange Now
              </button>
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-8">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-white" />
                  <div>
                    <div className="font-semibold">Fintrac & Fincen registered</div>
                    <div className="text-purple-200 text-sm">Learn more →</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  </div>
                  <div>
                    <div className="font-semibold">★★★★★ 4.4/5</div>
                    <div className="text-purple-200 text-sm">Customers reviews on trustpilot.com →</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                <img 
                  src="/chicksx.png" 
                  alt="Crypto Exchange App" 
                  className="w-full max-w-lg lg:max-w-xl"
                />
              </div>
            </div>
          </div>
          
          {/* Crypto Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-16 relative z-10">
            <div className="bg-white rounded-xl p-6 text-gray-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">₿</div>
                <span className="font-semibold">Bitcoin</span>
              </div>
              <div className="text-2xl font-bold mb-2">$104,921.01</div>
              <div className="text-green-500 text-sm">↗ 1.34%</div>
              <div className="mt-4">
                <svg className="w-full h-12" viewBox="0 0 100 30">
                  <path d="M0,20 Q25,15 50,18 T100,16" stroke="#f97316" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="text-purple-600 text-sm mt-4 cursor-pointer">Learn more →</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-gray-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">Ξ</div>
                <span className="font-semibold">Ethereum</span>
              </div>
              <div className="text-2xl font-bold mb-2">$2,489.63</div>
              <div className="text-green-500 text-sm">↗ 1.1%</div>
              <div className="mt-4">
                <svg className="w-full h-12" viewBox="0 0 100 30">
                  <path d="M0,22 Q25,18 50,20 T100,17" stroke="#3b82f6" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="text-purple-600 text-sm mt-4 cursor-pointer">Learn more →</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-gray-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">◎</div>
                <span className="font-semibold">Solana</span>
              </div>
              <div className="text-2xl font-bold mb-2">$</div>
              <div className="text-red-500 text-sm">↓</div>
              <div className="mt-4">
                <svg className="w-full h-12" viewBox="0 0 100 30">
                  <path d="M0,18 Q25,22 50,19 T100,21" stroke="#8b5cf6" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="text-purple-600 text-sm mt-4 cursor-pointer">Learn more →</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-gray-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">₳</div>
                <span className="font-semibold">Cardano</span>
              </div>
              <div className="text-2xl font-bold mb-2">$0.67</div>
              <div className="text-green-500 text-sm">↗ 4.27%</div>
              <div className="mt-4">
                <svg className="w-full h-12" viewBox="0 0 100 30">
                  <path d="M0,25 Q25,20 50,22 T100,18" stroke="#2563eb" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <div className="text-purple-600 text-sm mt-4 cursor-pointer">Learn more →</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 text-gray-800">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">+</div>
              </div>
              <div className="text-lg font-semibold mb-2">View more than 200+ cryptocurrencies here</div>
              <div className="text-purple-600 text-sm mt-4 cursor-pointer">Learn more →</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why ChicksX Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-8">Why ChicksX?</h2>
              <p className="text-gray-600 leading-relaxed">
                We are committed to upholding the integrity, trust, and privacy of our brand in order to best serve the needs of our 
                clients. Our top priority is to provide our customers with a secure exchange platform where all your personal data is 
                secure and protected. By continuously updating and perfecting our security measures and protocols, we ensure to 
                provide the safest platform possible.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=400" 
                alt="Security illustration" 
                className="w-full max-w-md mx-auto opacity-20"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Global Crypto Trading Made Simple</h3>
              <p className="text-gray-600 mb-6">
                Trade crypto and fiat currencies from anywhere, anytime. We support all digital currencies with the lowest fees.
              </p>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors w-full">
                Learn more
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Trade 200+ Currencies at Lowest Rates</h3>
              <p className="text-gray-600 mb-6">
                From BTC to ETH, USDT, SOL, plus fiat currencies like USD and CAD - we offer competitive rates on every trade.
              </p>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors w-full">
                Learn more
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pay and Withdraw Your Way</h3>
              <p className="text-gray-600 mb-6">
                We give you the option of selecting the digital currency to sell, and your preferred cashout or payout method.
              </p>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors w-full">
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <Shield className="w-12 h-12" />
                <h2 className="text-4xl font-bold">Security</h2>
              </div>
              <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                Our top priority is to provide our customers with a secure exchange platform where 
                all your personal information and data is encrypted, secure, and protected. We are 
                dedicated to user protection with multi-layer protocols and industry-leading security 
                measures. Your data is 100% secure via end-to-end encryption, ensuring that only 
                you have access to your personal information.
              </p>
              <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Learn more
              </button>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Security" 
                className="w-full max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <MessageCircle className="w-12 h-12 text-purple-600" />
            <h2 className="text-4xl font-bold text-gray-800">24/7 Live Support</h2>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-4xl">
            To provide our customers with the best services possible, we provide 24/7 customer support. Our live chat will connect you to one of our specialists who will happily assist you with 
            any inquiries or questions you may have.
          </p>
          <p className="text-gray-600 mb-8">
            Feel free to connect with us at any time.
          </p>
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors mb-12">
            Get In Touch
          </button>
          
          <div className="bg-gray-50 rounded-lg p-4 max-w-4xl">
            <input 
              type="text" 
              placeholder="About Crypto Exchanges" 
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/chicksx-main-logo-hover.png" 
                  alt="ChicksX Logo" 
                  className="h-8"
                />
              </div>
              <p className="text-gray-600 text-sm mb-4">support@chicksx.com</p>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>ENG - USD</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">ChicksX</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Licensing</a></li>
                <li><a href="#" className="hover:text-purple-600">Blog</a></li>
                <li><a href="#" className="hover:text-purple-600">Bug Bounty</a></li>
                <li><a href="#" className="hover:text-purple-600">More ↓</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600">FAQ</a></li>
                <li><a href="#" className="hover:text-purple-600">Contact Us</a></li>
                <li><a href="#" className="hover:text-purple-600">Sitemap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-purple-600">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-600">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-600">Cookies Policy</a></li>
                <li><a href="#" className="hover:text-purple-600">More ↓</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Social</h4>
              <div className="flex space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">t</span>
                </div>
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">in</span>
                </div>
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">tg</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-semibold">Trustpilot Reviews</div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1">4.4/5</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-600">
            Copyright © 2021, ChicksX.com. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;