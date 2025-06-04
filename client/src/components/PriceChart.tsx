import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export default function PriceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [timeframe, setTimeframe] = useState('24H');

  const { data: priceData } = useQuery({
    queryKey: ["/api/market/btc-usd"],
    refetchInterval: 5000,
  });

  useEffect(() => {
    const loadChart = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const { Chart, registerables } = await import('chart.js');
        const { CandlestickController, CandlestickElement } = await import('chartjs-chart-financial');
        Chart.register(...registerables, CandlestickController, CandlestickElement);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.warn('Canvas context not available');
          return;
        }

        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const generateCandlestickData = () => {
          const data = [];
          const labels = [];
          let basePrice = 43521;
          
          for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0') + ':00';
            labels.push(hour);
            
            const open = basePrice;
            const variation1 = (Math.random() - 0.5) * 500;
            const variation2 = (Math.random() - 0.5) * 500;
            const high = Math.max(open, open + variation1, open + variation2) + Math.random() * 200;
            const low = Math.min(open, open + variation1, open + variation2) - Math.random() * 200;
            const close = open + variation1;
            
            data.push({
              x: hour,
              o: open,
              h: high,
              l: low,
              c: close
            });
            
            basePrice = close;
          }
          
          return { labels, data };
        };

        const chartData = generateCandlestickData();
        
        chartRef.current = new Chart(ctx, {
          type: 'candlestick' as any,
          data: {
            datasets: [{
              label: 'BTC Price',
              data: chartData.data,
              borderColor: {
                up: 'hsl(var(--ring))',
                down: '#ff6b6b',
                unchanged: 'hsl(var(--muted-foreground))'
              },
              backgroundColor: {
                up: 'hsla(var(--ring) / 0.8)',
                down: 'rgba(255, 107, 107, 0.8)',
                unchanged: 'hsla(var(--muted-foreground) / 0.8)'
              },
              borderWidth: 1
            } as any]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                display: true,
                grid: {
                  color: 'hsla(var(--border) / 0.5)',
                },
                ticks: {
                  color: 'hsl(var(--muted-foreground))',
                  maxTicksLimit: 6
                }
              },
              y: {
                display: true,
                grid: {
                  color: 'hsla(var(--border) / 0.5)',
                },
                ticks: {
                  color: 'hsl(var(--muted-foreground))',
                  callback: function(value: any) {
                    return '$' + value.toLocaleString();
                  }
                }
              }
            },
            interaction: {
              intersect: false,
              mode: 'index'
            }
          }
        });
      } catch (error) {
        console.error('Failed to load chart:', error);
      }
    };

    loadChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
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