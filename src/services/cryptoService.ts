import axios from 'axios';

// Define types for the API response
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

interface HistoricalData {
  prices: [number, number][];
}

// Base URL for CoinGecko API
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Fetch top coins from CoinGecko API
export const fetchTopCoins = async (currency = 'usd', page = 1, perPage = 20): Promise<Coin[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching top coins:', error);
    return [];
  }
};

// Fetch 7-day historical data for a specific coin
export const fetchCoinHistory = async (coinId: string, currency = 'usd', days = 7): Promise<[number, number][]> => {
  try {
    const response = await axios.get<HistoricalData>(
      `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`
    );
    return response.data.prices;
  } catch (error) {
    console.error(`Error fetching history for ${coinId}:`, error);
    return [];
  }
};

// Supported currencies
export const SUPPORTED_CURRENCIES = ['usd', 'eur', 'ngn'];

// Format currency values based on locale
export const formatCurrency = (value: number, currency: string): string => {
  const currencyMap: Record<string, { locale: string, code: string }> = {
    usd: { locale: 'en-US', code: 'USD' },
    eur: { locale: 'de-DE', code: 'EUR' },
    ngn: { locale: 'en-NG', code: 'NGN' }
  };

  const { locale, code } = currencyMap[currency] || currencyMap.usd;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
};