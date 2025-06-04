import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function PriceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeframe, setTimeframe] = useState('24H');

  const { data: priceData } = useQuery({
    queryKey: ["/api/market/btc-usd"],
    refetchInterval: 5000,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Generate candlestick data
    const generateCandlestickData = () => {
      const data = [];
      let basePrice = 43521;
      
      for (let i = 0; i < 24; i++) {
        const open = basePrice;
        const variation1 = (Math.random() - 0.5) * 500;
        const variation2 = (Math.random() - 0.5) * 500;
        const high = Math.max(open, open + variation1, open + variation2) + Math.random() * 200;
        const low = Math.min(open, open + variation1, open + variation2) - Math.random() * 200;
        const close = open + variation1;
        
        data.push({ open, high, low, close });
        basePrice = close;
      }
      
      return data;
    };

    const candleData = generateCandlestickData();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;
    
    // Find min and max prices
    const allPrices = candleData.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;
    
    // Draw candlesticks
    const candleWidth = width / candleData.length * 0.6;
    const candleSpacing = width / candleData.length;
    
    candleData.forEach((candle, index) => {
      const x = padding + index * candleSpacing + candleSpacing / 2;
      
      // Calculate y positions
      const highY = padding + (maxPrice - candle.high) / priceRange * height;
      const lowY = padding + (maxPrice - candle.low) / priceRange * height;
      const openY = padding + (maxPrice - candle.open) / priceRange * height;
      const closeY = padding + (maxPrice - candle.close) / priceRange * height;
      
      // Determine candle color
      const isGreen = candle.close > candle.open;
      const color = isGreen ? '#00ff88' : '#ff6b35';
      
      // Draw wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();
      
      // Draw body
      ctx.fillStyle = color;
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY);
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight || 1);
    });
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let i = 0; i <= 6; i++) {
      const x = padding + (width / 6) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + height);
      ctx.stroke();
    }
    
    // Draw price labels
    ctx.fillStyle = '#888';
    ctx.font = '12px Inter';
    ctx.textAlign = 'left';
    
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice - (priceRange / 5) * i;
      const y = padding + (height / 5) * i;
      ctx.fillText(`$${price.toLocaleString()}`, padding + width + 5, y + 4);
    }
    
    // Draw time labels
    ctx.textAlign = 'center';
    const timeLabels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'];
    timeLabels.forEach((label, i) => {
      const x = padding + (width / 6) * i;
      ctx.fillText(label, x, padding + height + 20);
    });
    
  }, [timeframe]);

  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">BTC/USD</h2>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-2xl font-bold text-ring">
                {(priceData as any)?.price ? `$${(priceData as any).price.toLocaleString()}` : '$43,521.00'}
              </span>
              <span className="text-ring bg-ring/20 px-2 py-1 rounded text-sm">
                +2.34%
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            {['1H', '24H', '7D', '1M'].map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? "default" : "secondary"}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={timeframe === tf ? "bg-ring text-black" : ""}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="h-64 relative">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </CardContent>
    </Card>
  );
}