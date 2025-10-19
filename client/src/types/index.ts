export interface User {
  id: number;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface State {
  id: number;
  name: string;
  capital: string;
  region: string;
  abbreviation: string;
  clue_1?: string;
  clue_2?: string;
  clue_3?: string;
  flag_emoji?: string;
  population?: number;
  nickname?: string;
}

export interface GameState {
  id: number;
  name: string;
  capital: string;
  abbreviation: string;
  currentClue: string;
  clue_1?: string;
  clue_2?: string;
  clue_3?: string;
  clueLevel: number;
  attempts: number;
  hintUsed: boolean;
  completed: boolean;
  score: number;
}

export interface GameSession {
  sessionId: string;
  states: GameState[];
  currentStateIndex: number;
  totalScore: number;
  startTime: number;
  gameMode: string;
}

export interface LeaderboardEntry {
  id: number;
  username: string;
  user_id: number;
  score: number;
  time_seconds: number;
  completed_at: string;
  rank: number;
}

export interface UserStats {
  gamesPlayed: {
    game_mode: string;
    games_count: number;
    avg_score: number;
  }[];
  bestScores: {
    game_mode: string;
    score: number;
    time_seconds: number;
    completed_at: string;
  }[];
  recentGames: {
    game_mode: string;
    score: number;
    time_seconds: number;
    completed_at: string;
  }[];
}

export interface StateProgress {
  state_id: number;
  name: string;
  capital: string;
  abbreviation: string;
  times_correct: number;
  times_attempted: number;
  last_attempted: string | null;
  accuracy_percentage: number;
}

export type GameMode =
  | 'full_usa'
  | 'northeast'
  | 'mid_atlantic'
  | 'southeast'
  | 'midwest'
  | 'southwest'
  | 'west';

export type Difficulty = 'easy' | 'medium' | 'hard';

export const GAME_MODES: Record<GameMode, string> = {
  full_usa: 'Full USA (50 States)',
  northeast: 'Northeast Region',
  mid_atlantic: 'Mid-Atlantic Region',
  southeast: 'Southeast Region',
  midwest: 'Midwest Region',
  southwest: 'Southwest Region',
  west: 'West Region'
};

export const DIFFICULTIES: Record<Difficulty, { name: string; description: string }> = {
  easy: {
    name: 'Easy',
    description: 'State name shown, hints reveal capital and facts'
  },
  medium: {
    name: 'Medium',
    description: 'Capital name shown, hints reveal facts'
  },
  hard: {
    name: 'Hard',
    description: 'Only facts given as clues'
  }
};

export const SCORING = {
  CORRECT_FIRST_NO_HINT: 5,
  CORRECT_FIRST_WITH_HINT: 4,
  CORRECT_SECOND: 2,
  FAILED: 0
};
