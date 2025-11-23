const API_KEY = import.meta.env.VITE_ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4';

export const oddsApi = {
  /**
   * Get NBA games with betting lines
   * Fetches upcoming NBA games with moneyline, spreads, and totals
   * Cost: 3 quota (3 markets × 1 region)
   * 
   * @returns {Promise<Array>} Array of NBA games with odds
   */
  async getNBAGames() {
    try {
      const sport = 'basketball_nba';
      const regions = 'us';
      const markets = 'h2h,spreads,totals';
      const oddsFormat = 'american';
      const dateFormat = 'iso';
      
      const url = `${BASE_URL}/sports/${sport}/odds?apiKey=${API_KEY}&regions=${regions}&markets=${markets}&oddsFormat=${oddsFormat}&dateFormat=${dateFormat}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      // Log quota usage from response headers
      const quotaRemaining = response.headers.get('x-requests-remaining');
      const quotaUsed = response.headers.get('x-requests-used');
      console.log(`📊 API Quota - Remaining: ${quotaRemaining}, Used: ${quotaUsed}`);
      
      const data = await response.json();
      
      // Log number of games fetched
      console.log(`🏀 NBA Games fetched: ${data.length}`);
      
      return data;
    } catch (error) {
      console.error('Error fetching NBA games:', error);
      throw error;
    }
  }
};
