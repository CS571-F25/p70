const API_KEY = process.env.NEXT_PUBLIC_ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4';

export const validationService = {
  /**
   * Fetch completed NBA game scores from The Odds API
   * Cost: 1 quota per request
   * 
   * @param {number} daysFrom - Number of days in the past to fetch (max 3)
   * @returns {Promise<Array>} Array of completed games with scores
   */
  async getCompletedScores(daysFrom = 3) {
    try {
      const sport = 'basketball_nba';
      const url = `${BASE_URL}/sports/${sport}/scores?apiKey=${API_KEY}&daysFrom=${daysFrom}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      // Log quota usage
      const quotaRemaining = response.headers.get('x-requests-remaining');
      const quotaUsed = response.headers.get('x-requests-used');
      console.log(`📊 Scores API Quota - Remaining: ${quotaRemaining}, Used: ${quotaUsed}`);
      
      const data = await response.json();
      
      // Filter to only completed games
      const completedGames = data.filter(game => game.completed === true);
      console.log(`🏀 Completed games found: ${completedGames.length}`);
      
      return completedGames;
    } catch (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }
  },

  /**
   * Validate a moneyline pick
   * 
   * @param {Object} pick - User's pick object
   * @param {Object} gameScore - Completed game score data
   * @returns {string} 'win', 'loss', or 'push'
   */
  validateMoneyline(pick, gameScore) {
    const scores = gameScore.scores;
    if (!scores || scores.length !== 2) return null;

    const homeScore = scores.find(s => s.name === gameScore.home_team)?.score;
    const awayScore = scores.find(s => s.name === gameScore.away_team)?.score;

    if (homeScore === undefined || awayScore === undefined) return null;

    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    // Determine winner
    const winner = homeScoreNum > awayScoreNum ? gameScore.home_team : gameScore.away_team;

    // User picked the winner?
    if (pick.pick_value === winner) {
      return 'win';
    } else {
      return 'loss';
    }
  },

  /**
   * Validate a spread pick
   * 
   * @param {Object} pick - User's pick object (pick_value format: "Team Name -5.5" or "Team Name +3.5")
   * @param {Object} gameScore - Completed game score data
   * @returns {string} 'win', 'loss', or 'push'
   */
  validateSpread(pick, gameScore) {
    const scores = gameScore.scores;
    if (!scores || scores.length !== 2) return null;

    const homeScore = scores.find(s => s.name === gameScore.home_team)?.score;
    const awayScore = scores.find(s => s.name === gameScore.away_team)?.score;

    if (homeScore === undefined || awayScore === undefined) return null;

    const homeScoreNum = parseInt(homeScore);
    const awayScoreNum = parseInt(awayScore);

    // Parse the pick_value to get team and spread
    // Format expected: "Los Angeles Lakers -5.5" or "Boston Celtics +3.5"
    const pickValue = pick.pick_value;
    const spreadMatch = pickValue.match(/(.+?)\s*([+-]?\d+\.?\d*)$/);
    
    if (!spreadMatch) {
      console.error('Could not parse spread pick:', pickValue);
      return null;
    }

    const pickedTeam = spreadMatch[1].trim();
    const spread = parseFloat(spreadMatch[2]);

    // Calculate adjusted score (team score + spread)
    let pickedTeamScore, opponentScore;
    
    if (pickedTeam === gameScore.home_team) {
      pickedTeamScore = homeScoreNum;
      opponentScore = awayScoreNum;
    } else if (pickedTeam === gameScore.away_team) {
      pickedTeamScore = awayScoreNum;
      opponentScore = homeScoreNum;
    } else {
      console.error('Team not found in game:', pickedTeam);
      return null;
    }

    // Apply spread: if spread is -5.5, team needs to win by more than 5.5
    // if spread is +5.5, team can lose by up to 5.5 and still cover
    const adjustedScore = pickedTeamScore + spread;

    if (adjustedScore > opponentScore) {
      return 'win';
    } else if (adjustedScore < opponentScore) {
      return 'loss';
    } else {
      return 'push'; // Exact tie after spread (rare with .5 spreads)
    }
  },

  /**
   * Validate an over/under (totals) pick
   * 
   * @param {Object} pick - User's pick object (pick_value format: "Over 220.5" or "Under 215.5")
   * @param {Object} gameScore - Completed game score data
   * @returns {string} 'win', 'loss', or 'push'
   */
  validateTotal(pick, gameScore) {
    const scores = gameScore.scores;
    if (!scores || scores.length !== 2) return null;

    const homeScore = parseInt(scores.find(s => s.name === gameScore.home_team)?.score);
    const awayScore = parseInt(scores.find(s => s.name === gameScore.away_team)?.score);

    if (isNaN(homeScore) || isNaN(awayScore)) return null;

    const totalScore = homeScore + awayScore;

    // Parse pick_value: "Over 220.5" or "Under 215.5"
    const pickValue = pick.pick_value;
    const totalMatch = pickValue.match(/(Over|Under)\s*(\d+\.?\d*)/i);

    if (!totalMatch) {
      console.error('Could not parse total pick:', pickValue);
      return null;
    }

    const overUnder = totalMatch[1].toLowerCase();
    const line = parseFloat(totalMatch[2]);

    if (overUnder === 'over') {
      if (totalScore > line) return 'win';
      if (totalScore < line) return 'loss';
      return 'push';
    } else {
      if (totalScore < line) return 'win';
      if (totalScore > line) return 'loss';
      return 'push';
    }
  },

  /**
   * Validate a single pick against game results
   * 
   * @param {Object} pick - User's pick from database
   * @param {Object} gameScore - Completed game score data
   * @returns {Object} { result: 'win'|'loss'|'push'|null, gameScore }
   */
  validatePick(pick, gameScore) {
    if (!gameScore || !gameScore.completed) {
      return { result: null, gameScore: null, error: 'Game not completed' };
    }

    let result = null;

    switch (pick.pick_type) {
      case 'h2h':
      case 'moneyline':
        result = this.validateMoneyline(pick, gameScore);
        break;
      case 'spreads':
      case 'spread':
        result = this.validateSpread(pick, gameScore);
        break;
      case 'totals':
      case 'total':
        result = this.validateTotal(pick, gameScore);
        break;
      default:
        console.error('Unknown pick type:', pick.pick_type);
        return { result: null, gameScore, error: 'Unknown pick type' };
    }

    return { 
      result, 
      gameScore,
      homeScore: gameScore.scores?.find(s => s.name === gameScore.home_team)?.score,
      awayScore: gameScore.scores?.find(s => s.name === gameScore.away_team)?.score
    };
  },

  /**
   * Validate multiple picks at once
   * 
   * @param {Array} picks - Array of user picks to validate
   * @returns {Promise<Array>} Array of { pick, result, gameScore } objects
   */
  async validatePicks(picks) {
    // Fetch all completed scores once
    const completedGames = await this.getCompletedScores();
    
    const results = picks.map(pick => {
      const gameScore = completedGames.find(game => game.id === pick.game_id);
      
      if (!gameScore) {
        return { 
          pick, 
          result: null, 
          error: 'Game not found or not completed yet' 
        };
      }

      const validation = this.validatePick(pick, gameScore);
      
      return {
        pick,
        result: validation.result,
        homeScore: validation.homeScore,
        awayScore: validation.awayScore,
        error: validation.error || null
      };
    });

    return results;
  }
};
