import { supabase } from './supabase';
import type { ScoreboardEntry } from './types/scoreboard';

export async function saveScore(entry: Omit<ScoreboardEntry, 'id' | 'created_at'>): Promise<ScoreboardEntry | null> {
  console.log('Attempting to save score:', entry);

  const { data, error } = await supabase
    .from('scoreboard')
    .insert([entry])
    .select()
    .single();

  if (error) {
    console.error('Error saving score:', error.message, error.details, error.hint);
    return null;
  }

  console.log('Score saved successfully:', data);
  return data;
}

export async function getTopScores(limit: number = 10): Promise<ScoreboardEntry[]> {
  const { data, error } = await supabase
    .from('scoreboard')
    .select('*')
    .order('level', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching scores:', error);
    return [];
  }

  return data || [];
}

export async function getPlayerRank(level: number, playerId?: string): Promise<number | null> {
  const { count: higherCount, error: higherError } = await supabase
    .from('scoreboard')
    .select('*', { count: 'exact', head: true })
    .gt('level', level);

  if (higherError) {
    console.error('Error fetching rank (higher):', higherError);
    return null;
  }

  const rank = (higherCount ?? 0) + 1;

  if (playerId) {
    const { data: sameLevelPlayers, error: sameLevelError } = await supabase
      .from('scoreboard')
      .select('id, created_at')
      .eq('level', level)
      .order('created_at', { ascending: true });

    if (!sameLevelError && sameLevelPlayers) {
      const playerIndex = sameLevelPlayers.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
        return rank + playerIndex;
      }
    }
  }

  return rank;
}
