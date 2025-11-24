
export interface QuizQuestion {
  artist: string;
  songTitle: string;
  correctYear: number;
  options: number[];
  lyricsSnippet: string;
  album: string;
  releaseDate: string;
  audioUrl?: string | null;
}

export type GameState = 'start' | 'register' | 'loading' | 'playing' | 'finished' | 'error' | 'leaderboard';

export type Language = 'en' | 'fr';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuizConfig {
  score: number;
  currentQuestionIndex: number;
  questions: QuizQuestion[];
  history: boolean[]; // tracks correct/incorrect for each question
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface LeaderboardEntry {
  firstName: string;
  lastName: string;
  score: number;
  date: string;
}

// Reordered list to support difficulty slicing by index:
// 0-20: Easy (Global Megastars & Icons)
// 21-50: Medium (Major Hits, Rap Stars, Famous Anime)
// 51-80+: Hard (Regional Legends, Specific Anime, Deep Cuts)
export const TARGET_ARTISTS = [
  // --- EASY (0-20): Global Icons & Absolute Classics ---
  "Michael Jackson", "Beyoncé", "Rihanna", "Eminem", "Drake", 
  "Taylor Swift", "Bruno Mars", "The Weeknd", "Whitney Houston", "Céline Dion",
  "Madonna", "Prince", "Adele", "Justin Bieber", "Shakira",
  "Dragon Ball Z", "One Piece", "Naruto", "Pokémon", "Lion King (Disney)",
  
  // --- MEDIUM (21-50): Rap Heavyweights, French Stars, Afro Giants & Popular Anime ---
  "Kanye West", "Kendrick Lamar", "Jay-Z", "Snoop Dogg", "50 Cent",
  "Chris Brown", "Cardi B", "Travis Scott", "Future", "Ariana Grande",
  "Booba", "Damso", "Ninho", "Stromae", "Aya Nakamura",
  "Gims", "Soprano", "Orelsan", "Jul", "PNL",
  "Burna Boy", "Wizkid", "Davido", "Magic System", "Alpha Blondy",
  "Attack on Titan (Shingeki no Kyojin)", "Demon Slayer (Kimetsu no Yaiba)", "Sailor Moon", "Death Note", "My Hero Academia",

  // --- HARD (51-80+): Regional Stars, Deep Rap, Specific Anime & Afro Legends ---
  "Tupac Shakur", "Notorious B.I.G.", "Dr. Dre", "Lil Wayne", "Migos",
  "DaBaby", "Roddy Ricch", "Lil Baby", "Latto", "Giveon",
  "Dadju", "Tayc", "Nono la grinta", "SDM", "Joe Dwet Filé", 
  "Naza", "Kiff No Beat", "Didi B", "Kaaris", "Fally Ipupa",
  "Rema", "Sarkodie", "Black Sherif", "Shatta Wale", "Osibisa",
  "DJ Arafat", "Tiken Jah Fakoly", "Meiway", "Manu Dibango", "Richard Bona",
  "Yannick Noah", "Locko", "Cysoul", "Tenor", "Petit Pays",
  "Neon Genesis Evangelion", "Cowboy Bebop", "Fullmetal Alchemist: Brotherhood", "Bleach", "Hunter x Hunter",
  "JoJo's Bizarre Adventure", "Jujutsu Kaisen", "Tokyo Ghoul", "Saint Seiya (Knights of the Zodiac)", "Captain Tsubasa",
  "City Hunter", "Code Geass", "Digimon", "GTO (Great Teacher Onizuka)", "Yu Yu Hakusho",
  "Fairy Tail", "Chainsaw Man", "Spy x Family", "Your Name (Kimi no Na wa)", "Studio Ghibli"
];
