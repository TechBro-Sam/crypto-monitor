import { useEffect, useState } from 'react';
import { Coin, fetchCoinHistory, formatCurrency } from '@/services/cryptoService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowDown, ArrowUp, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CoinDetailsProps {
  coin: Coin | null;
  currency: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoinDetails({ coin, currency, open, onOpenChange }: CoinDetailsProps) {
  const [chartData, setChartData] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadHistoricalData() {
      if (coin && open) {
        setLoading(true);
        try {
          const history = await fetchCoinHistory(coin.id, currency);
          setChartData(history);
        } catch (error) {
          console.error('Failed to load chart data:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    loadHistoricalData();
  }, [coin, currency, open]);

  if (!coin) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;
            return formatCurrency(value, currency);
          },
          title: (items) => {
            if (items.length > 0) {
              const timestamp = chartData[items[0].dataIndex][0];
              return formatDate(timestamp);
            }
            return '';
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 7,
          callback: (_, index) => {
            if (chartData.length > 0 && index % Math.ceil(chartData.length / 7) === 0) {
              return formatDate(chartData[index][0]);
            }
            return '';
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: (value) => {
            return formatCurrency(value as number, currency);
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  const prepareChartData = () => {
    return {
      labels: chartData.map(data => formatDate(data[0])),
      datasets: [
        {
          label: 'Price',
          data: chartData.map(data => data[1]),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          borderWidth: 2,
          fill: true,
          tension: 0.2,
          pointRadius: 1,
          pointHoverRadius: 5,
        },
      ],
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img 
              src={coin.image} 
              alt={coin.name}
              className="h-6 w-6 rounded-full" 
            />
            {coin.name} ({coin.symbol.toUpperCase()})
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              Current Price
            </div>
            <div className="font-medium text-lg">
              {formatCurrency(coin.current_price, currency)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              24h Change
            </div>
            <div className={`font-medium flex items-center ${
              coin.price_change_percentage_24h < 0 ? 'text-red-500' : 'text-green-500'
            }`}>
              {coin.price_change_percentage_24h < 0 ? (
                <ArrowDown className="mr-1 h-4 w-4" />
              ) : (
                <ArrowUp className="mr-1 h-4 w-4" />
              )}
              {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground text-sm flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Market Cap
            </div>
            <div className="font-medium">
              {formatCurrency(coin.market_cap, currency)}
            </div>
          </div>
          
          <div className="mt-2">
            <h3 className="font-medium mb-3">7-day Price History</h3>
            <div className="h-[250px] relative">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-[200px] w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-10" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </div>
                </div>
              ) : (
                chartData.length > 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                  >
                    <Line data={prepareChartData()} options={chartOptions} />
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No historical data available
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}