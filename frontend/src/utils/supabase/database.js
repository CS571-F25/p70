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
 * Update pick result (win/loss)
 */
export async function updatePickResult(pickId, result) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: 'Not authenticated' };
  
  const { data, error } = await supabase
    .from('picks')
    .update({ result })
    .eq('id', pickId)
    .eq('user_id', user.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating pick result:', error);
    return { error };
  }
  return { data };
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
