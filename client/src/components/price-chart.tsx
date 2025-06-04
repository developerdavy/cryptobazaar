import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function PriceChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24H");
  const [chartData, setChartData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState(43521.00);
  const [priceChange, setPriceChange] = useState(2.34);

  const timeframes = ["1H", "24H", "7D", "1M"];

  useEffect(() => {
    // Generate mock chart data
    const generateChartData = () => {
      const data = [];
      const basePrice = 43521;
      const points = selectedTimeframe === "1H" ? 12 : selectedTimeframe === "24H" ? 24 : selectedTimeframe === "7D" ? 7 : 30;
      
      for (let i = 0; i < points; i++) {
        const variation = (Math.random() - 0.5) * 2000;
        const price = basePrice + variation + (Math.sin(i / 3) * 500);
        
        let time;
        if (selectedTimeframe === "1H") {
          time = `${i * 5}m`;
        } else if (selectedTimeframe === "24H") {
          time = `${i}:00`;
        } else if (selectedTimeframe === "7D") {
          time = `Day ${i + 1}`;
        } else {
          time = `${i + 1}`;
        }
        
        data.push({
          time,
          price: price,
          volume: Math.random() * 1000000 + 500000,
        });
      }
      return data;
    };

    setChartData(generateChartData());
  }, [selectedTimeframe]);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const variation = (Math.random() - 0.5) * 100;
      setCurrentPrice(prev => prev + variation);
      setPriceChange(prev => prev + (Math.random() - 0.5) * 0.5);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect p-3 rounded-lg border border-border/50">
          <p className="text-sm text-gray-400">{label}</p>
          <p className="text-sm font-medium">
            <span className="text-green-400">Price: </span>
            ${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">BTC/USD</CardTitle>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-3xl font-bold text-green-400">
                ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <Badge className={`${priceChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {priceChange >= 0 && <TrendingUp className="h-3 w-3 mr-1" />}
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </Badge>
            </div>
          </div>
          <div className="flex space-x-2">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className={
                  selectedTimeframe === timeframe
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "border-border/50 text-gray-400 hover:text-white"
                }
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#00ff88"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: "#00ff88", strokeWidth: 2, fill: "#00ff88" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
