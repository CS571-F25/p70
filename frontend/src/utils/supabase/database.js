import { createClient } from './client';

// ============ PROFILE FUNCTIONS ============

/**
 * Get current user's profile
 */
export async function getUserProfile() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle(); // Use maybeSingle() instead of single() - returns null if no row found instead of error
  
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

/**
 * Create profile for new user
 */
export async function createUserProfile(username = null) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      username: username || user.email?.split('@')[0],
      elo: 1000,
      wins: 0,
      losses: 0
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating profile:', error);
    return { error };
  }
  return { data };
}

/**
 * Get or create user profile (ensures profile exists)
 */
export async function getOrCreateProfile() {
  const profile = await getUserProfile();
  if (profile) return profile;
  
  const { data, error } = await createUserProfile();
  if (error) return null;
  return data;
}

/**
 * Update user profile (ELO, wins, losses)
 */
export async function updateUserProfile(updates) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating profile:', error);
    return { error };
  }
  return { data };
}

// ============ ELO CALCULATION ============

/**
 * Calculate ELO change based on result and odds
 * 
 * Base change: 25 points
 * - Wins with underdog odds (positive): bonus points
 * - Wins with favorite odds (negative): fewer bonus points
 * - Losses are penalized less for risky picks
 * 
 * @param {number} currentElo - User's current ELO rating
 * @param {boolean} isWin - Whether the pick was correct
 * @param {number} odds - American odds for the pick (e.g., +150, -110)
 * @returns {Object} { newElo, change }
 */
export function calculateEloChange(currentElo, isWin, odds) {
  const BASE_CHANGE = 25;
  
  // Convert American odds to implied probability
  // Positive odds: probability = 100 / (odds + 100)
  // Negative odds: probability = |odds| / (|odds| + 100)
  let impliedProbability;
  if (odds > 0) {
    impliedProbability = 100 / (odds + 100);
  } else {
    impliedProbability = Math.abs(odds) / (Math.abs(odds) + 100);
  }
  
  // Risk multiplier: higher for underdogs, lower for favorites
  // Underdog (low probability): multiplier > 1
  // Favorite (high probability): multiplier < 1
  const riskMultiplier = 1 + (0.5 - impliedProbability);
  
  let change;
  
  if (isWin) {
    // Wins: Base points * risk multiplier
    // Underdog wins reward more, favorite wins reward less
    change = Math.round(BASE_CHANGE * riskMultiplier);
    // Minimum win: +10, Maximum win: +50
    change = Math.max(10, Math.min(50, change));
  } else {
    // Losses: Base penalty, reduced for risky picks
    // Risky picks (underdogs) lose fewer points
    change = -Math.round(BASE_CHANGE * (1 - (riskMultiplier - 1) * 0.5));
    // Minimum loss: -10, Maximum loss: -30
    change = Math.max(-30, Math.min(-10, change));
  }
  
  const newElo = Math.max(0, currentElo + change); // ELO can't go below 0
  
  return { newElo, change };
}

// ============ PICKS FUNCTIONS ============

/**
 * Save a new pick to database
 */
export async function savePick(pickData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('picks')
    .insert({
      user_id: user.id,
      game_id: pickData.gameId,
      home_team: pickData.homeTeam,
      away_team: pickData.awayTeam,
      pick_type: pickData.pickType,
      pick_value: pickData.pickValue,
      odds: pickData.odds,
      game_date: pickData.gameDate,
      is_locked: false,
      result: 'pending'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving pick:', error);
    return { error };
  }
  return { data };
}

/**
 * Get all picks for current user
 */
export async function getUserPicks() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching picks:', error);
    return [];
  }
  return data;
}

/**
 * Get pending picks (not yet resolved)
 */
export async function getPendingPicks() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('user_id', user.id)
    .eq('result', 'pending')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching pending picks:', error);
    return [];
  }
  return data;
}

/**
 * Get locked picks
 */
export async function getLockedPicks() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_locked', true)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching locked picks:', error);
    return [];
  }
  return data;
}

/**
 * Lock a pick (before game starts)
 */
export async function lockPick(pickId) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('picks')
    .update({ is_locked: true })
    .eq('id', pickId)
    .eq('user_id', user.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error locking pick:', error);
    return { error };
  }
  return { data };
}

/**
 * Delete a pick (only if not locked)
 */
export async function deletePick(pickId) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Not authenticated' };
  
  const { error } = await supabase
    .from('picks')
    .delete()
    .eq('id', pickId)
    .eq('user_id', user.id)
    .eq('is_locked', false);
  
  if (error) {
    console.error('Error deleting pick:', error);
    return { error };
  }
  return { success: true };
}

/**
 * Validate a pick and update user's ELO, wins, and losses
 * This is the main function called when validating results
 * 
 * @param {number} pickId - The pick ID to validate
 * @param {string} result - 'win', 'loss', or 'push'
 * @returns {Object} { pick, profile, eloChange } or { error }
 */
export async function validateAndUpdatePick(pickId, result) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Not authenticated' };
  
  // Get the pick to get the odds
  const { data: pick, error: pickError } = await supabase
    .from('picks')
    .select('*')
    .eq('id', pickId)
    .eq('user_id', user.id)
    .single();
  
  if (pickError || !pick) {
    return { error: 'Pick not found' };
  }
  
  // Don't re-validate already validated picks
  if (pick.result !== 'pending') {
    return { error: 'Pick already validated', pick };
  }
  
  // Handle push (tie) - no ELO change
  if (result === 'push') {
    const { data: updatedPick } = await supabase
      .from('picks')
      .update({ result: 'push' })
      .eq('id', pickId)
      .select()
      .single();
    
    const profile = await getUserProfile();
    return { pick: updatedPick, profile, eloChange: 0 };
  }
  
  // Get current profile for ELO calculation
  const profile = await getUserProfile();
  if (!profile) {
    return { error: 'Profile not found' };
  }
  
  // Calculate ELO change
  const isWin = result === 'win';
  const { newElo, change } = calculateEloChange(profile.elo, isWin, pick.odds);
  
  // Update pick result
  const { error: updatePickError } = await supabase
    .from('picks')
    .update({ result })
    .eq('id', pickId);
  
  if (updatePickError) {
    return { error: 'Failed to update pick result' };
  }
  
  // Update profile (ELO and win/loss count)
  const profileUpdates = {
    elo: newElo,
    wins: isWin ? profile.wins + 1 : profile.wins,
    losses: !isWin ? profile.losses + 1 : profile.losses
  };
  
  const { data: updatedProfile, error: profileError } = await supabase
    .from('profiles')
    .update(profileUpdates)
    .eq('id', user.id)
    .select()
    .single();
  
  if (profileError) {
    return { error: 'Failed to update profile' };
  }
  
  // Get updated pick
  const { data: finalPick } = await supabase
    .from('picks')
    .select('*')
    .eq('id', pickId)
    .single();
  
  return { 
    pick: finalPick, 
    profile: updatedProfile, 
    eloChange: change 
  };
}

/**
 * Get all locked picks that are pending validation (game should be over)
 */
export async function getPicksToValidate() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_locked', true)
    .eq('result', 'pending')
    .order('game_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching picks to validate:', error);
    return [];
  }
  return data;
}

/**
 * Check if user already has a pick for a specific game and bet type
 */
export async function hasPick(gameId, pickType) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return false;
  
  const { data, error } = await supabase
    .from('picks')
    .select('id')
    .eq('user_id', user.id)
    .eq('game_id', gameId)
    .eq('pick_type', pickType)
    .single();
  
  if (error) return false;
  return !!data;
}

/**
 * Get a specific pick by game and type
 */
export async function getPick(gameId, pickType) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('picks')
    .select('*')
    .eq('user_id', user.id)
    .eq('game_id', gameId)
    .eq('pick_type', pickType)
    .single();
  
  if (error) return null;
  return data;
}
