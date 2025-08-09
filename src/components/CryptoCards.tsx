import { Coin, formatCurrency } from '@/services/cryptoService';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CryptoCardsProps {
  coins: Coin[];
  currency: string;
  onCoinClick: (coin: Coin) => void;
}

export function CryptoCards({ coins, currency, onCoinClick }: CryptoCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
      {coins.map((coin, index) => (
        <motion.div
          key={coin.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Card 
            className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" 
            onClick={() => onCoinClick(coin)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <img 
                    src={coin.image} 
                    alt={coin.name} 
                    className="h-8 w-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-xs text-muted-foreground uppercase">{coin.symbol}</div>
                  </div>
                </div>
                <div className={cn(
                  "flex items-center text-sm font-medium",
                  coin.price_change_percentage_24h < 0 ? "text-red-500" : "text-green-500"
                )}>
                  {coin.price_change_percentage_24h < 0 ? (
                    <ArrowDown className="mr-0.5 h-3 w-3" />
                  ) : (
                    <ArrowUp className="mr-0.5 h-3 w-3" />
                  )}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </div>
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="text-muted-foreground">Price</div>
                <div className="font-medium">{formatCurrency(coin.current_price, currency)}</div>
              </div>
              
              <div className="flex justify-between text-sm mt-1">
                <div className="text-muted-foreground">Market Cap</div>
                <div className="font-medium">{formatCurrency(coin.market_cap, currency)}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {coins.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No cryptocurrencies found.
        </div>
      )}
    </div>
  );
}