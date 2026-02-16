import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async () => {
  const apiKey = import.meta.env.CMC_API_KEY;

  if (!apiKey || apiKey === 'your_api_key_here') {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,ICP&convert=USD',
      {
        headers: { 'X-CMC_PRO_API_KEY': apiKey },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinMarketCap API returned ${response.status}`);
    }

    const json = await response.json();

    if (!json?.data) {
      throw new Error('Unexpected API response: missing data field');
    }

    const coins = ['BTC', 'ETH', 'ICP'].map((symbol) => {
      const coin = json.data[symbol];
      if (!coin?.quote?.USD) {
        throw new Error(`Missing data for ${symbol}`);
      }
      const quote = coin.quote.USD;
      return {
        name: coin.name,
        symbol: coin.symbol,
        price: quote.price ?? 0,
        percent_change_24h: quote.percent_change_24h ?? 0,
        percent_change_7d: quote.percent_change_7d ?? 0,
        market_cap: quote.market_cap ?? 0,
        volume_24h: quote.volume_24h ?? 0,
      };
    });

    return new Response(JSON.stringify(coins), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('CoinMarketCap API error:', message);
    return new Response(JSON.stringify({ error: 'Failed to fetch crypto data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
