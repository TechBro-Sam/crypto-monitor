import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { CryptoTable } from '@/components/CryptoTable';
import { CryptoCards } from '@/components/CryptoCards';
import { CoinDetails } from '@/components/CoinDetails';
import { LoadingCardsSkeleton, LoadingTableSkeleton } from '@/components/LoadingSkeleton';
import { Table, TableBody, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Coin, fetchTopCoins } from '@/services/cryptoService';

export default function CryptoPriceMonitor() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('usd');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch coins data
  const fetchCoins = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await fetchTopCoins(currency);
      setCoins(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch cryptocurrency data. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCoins();
  }, [currency]);

  // Auto refresh timer
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (autoRefresh) {
      intervalId = window.setInterval(() => {
        fetchCoins();
      }, 60000); // Refresh every 60 seconds
    }

    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, currency]);

  // Filter coins based on search term
  const filteredCoins = coins.filter(
    (coin) => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle coin click to show details
  const handleCoinClick = (coin: Coin) => {
    setSelectedCoin(coin);
    setDetailsOpen(true);
  };

  // Format last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    
    return lastUpdated.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header 
        onCurrencyChange={setCurrency} 
        selectedCurrency={currency} 
      />
      
      <main className="flex-1 container py-6">
        <div className="mb-8">
          <motion.h2 
            className="text-3xl font-bold tracking-tight mb-2 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            Cryptocurrency Market
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Real-time prices of top cryptocurrencies
          </motion.p>
        </div>

        <SearchBar 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <motion.div 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {loading ? (
              'Fetching data...'
            ) : lastUpdated ? (
              <>Last updated: {formatLastUpdated()}</>
            ) : null}
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'border-primary text-primary' : ''}
            >
              {autoRefresh ? 'Auto-refresh On' : 'Auto-refresh Off'}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={fetchCoins}
              disabled={loading}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </motion.div>
        </div>

        {error && (
          <motion.div 
            className="rounded-lg bg-destructive/15 p-4 text-destructive flex items-center gap-2 mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertTriangle className="h-5 w-5" />
            <div>{error}</div>
          </motion.div>
        )}

        {/* Mobile card view */}
        {loading ? (
          <LoadingCardsSkeleton count={8} />
        ) : (
          <CryptoCards 
            coins={filteredCoins} 
            currency={currency}
            onCoinClick={handleCoinClick}
          />
        )}

        {/* Desktop table view */}
        <div className="hidden lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <th className="w-[50px]">#</th>
                <th>Coin</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Market Cap</th>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <LoadingTableSkeleton count={10} />
              ) : (
                <CryptoTable 
                  coins={filteredCoins}
                  currency={currency}
                  onCoinClick={handleCoinClick}
                />
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Coin details modal */}
      <CoinDetails 
        coin={selectedCoin}
        currency={currency}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}