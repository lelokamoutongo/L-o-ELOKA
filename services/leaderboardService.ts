import { User, LeaderboardEntry } from '../types';

const STORAGE_KEY = 'beat_timeline_leaderboard';

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load leaderboard", e);
    return [];
  }
};

export const saveScore = (user: User, score: number) => {
  try {
    const currentLeaderboard = getLeaderboard();
    
    const newEntry: LeaderboardEntry = {
      firstName: user.firstName,
      lastName: user.lastName,
      score: score,
      date: new Date().toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      })
    };
    
    // Add new score, sort descending by score.
    // Removed slice limit to ensure all players can see their ranking.
    const updated = [...currentLeaderboard, newEntry]
      .sort((a, b) => b.score - a.score);
      
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save score", e);
  }
};