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
        Chart.register(...registerables);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.warn('Canvas context not available');
          return;
        }

        if (chartRef.current) {
          chartRef.current.destroy();
        }

        const generatePriceData = () => {
          const data = [];
          const labels = [];
          let basePrice = 43521;
          
          for (let i = 0; i < 24; i++) {
            const hour = i.toString().padStart(2, '0') + ':00';
            labels.push(hour);
            
            const variation = (Math.random() - 0.5) * 1000;
            basePrice += variation;
            data.push(basePrice);
          }
          
          return { labels, data };
        };

        const chartData = generatePriceData();
        
        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartData.labels,
            datasets: [{
              label: 'BTC Price',
              data: chartData.data,
              borderColor: 'hsl(var(--ring))',
              backgroundColor: 'hsla(var(--ring) / 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointHoverBackgroundColor: 'hsl(var(--ring))'
            }]
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