import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface HeaderProps {
  onCurrencyChange?: (currency: string) => void;
  selectedCurrency?: string;
}

export function Header({ onCurrencyChange, selectedCurrency = 'usd' }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  
  const currencies = [
    { value: 'usd', label: 'USD' },
    { value: 'eur', label: 'EUR' },
    { value: 'ngn', label: 'NGN' },
  ];

  return (
    <motion.header 
      className="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-6 w-6 text-primary"
          >
            <path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.16-6.2L12.26 4.145" />
          </svg>
          <h1 className="text-xl font-bold">Crypto Price Monitor</h1>
        </div>

        <div className="flex items-center gap-4">
          {onCurrencyChange && (
            <div className="flex gap-1">
              {currencies.map((currency) => (
                <Button 
                  key={currency.value}
                  variant={selectedCurrency === currency.value ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => onCurrencyChange(currency.value)}
                  className="text-sm"
                >
                  {currency.label}
                </Button>
              ))}
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </motion.header>
  );
}