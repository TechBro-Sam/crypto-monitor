import { useState } from 'react';
import { Coin, formatCurrency } from '@/services/cryptoService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CryptoTableProps {
  coins: Coin[];
  currency: string;
  onCoinClick: (coin: Coin) => void;
}

type SortField = 'name' | 'current_price' | 'market_cap' | 'price_change_percentage_24h';
type SortDirection = 'asc' | 'desc';

export function CryptoTable({ coins, currency, onCoinClick }: CryptoTableProps) {
  const [sortField, setSortField] = useState<SortField>('market_cap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for new sort field
    }
  };

  const sortedCoins = [...coins].sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="ml-1 h-4 w-4 opacity-50" />;
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  return (
    <motion.div
      className="w-full overflow-hidden rounded-lg border bg-card shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead>
              <button 
                className="flex items-center font-medium" 
                onClick={() => handleSort('name')}
              >
                Coin <SortIcon field="name" />
              </button>
            </TableHead>
            <TableHead>
              <button 
                className="flex items-center font-medium" 
                onClick={() => handleSort('current_price')}
              >
                Price <SortIcon field="current_price" />
              </button>
            </TableHead>
            <TableHead>
              <button 
                className="flex items-center font-medium" 
                onClick={() => handleSort('price_change_percentage_24h')}
              >
                24h Change <SortIcon field="price_change_percentage_24h" />
              </button>
            </TableHead>
            <TableHead>
              <button 
                className="flex items-center font-medium" 
                onClick={() => handleSort('market_cap')}
              >
                Market Cap <SortIcon field="market_cap" />
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedCoins.map((coin, index) => (
            <TableRow 
              key={coin.id} 
              onClick={() => onCoinClick(coin)}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <img 
                    src={coin.image} 
                    alt={coin.name} 
                    className="h-6 w-6 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-xs text-muted-foreground uppercase">{coin.symbol}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">{formatCurrency(coin.current_price, currency)}</TableCell>
              <TableCell>
                <div className={cn(
                  "flex items-center",
                  coin.price_change_percentage_24h < 0 ? "text-red-500" : "text-green-500"
                )}>
                  {coin.price_change_percentage_24h < 0 ? (
                    <ArrowDown className="mr-1 h-4 w-4" />
                  ) : (
                    <ArrowUp className="mr-1 h-4 w-4" />
                  )}
                  {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                </div>
              </TableCell>
              <TableCell>{formatCurrency(coin.market_cap, currency)}</TableCell>
            </TableRow>
          ))}
          {sortedCoins.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No cryptocurrencies found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </motion.div>
  );
}