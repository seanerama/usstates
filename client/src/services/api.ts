import axios from 'axios';
import type { User, State, GameState, LeaderboardEntry, UserStats, StateProgress, GameMode, Difficulty } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403 || error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },

  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};

// Game
export const gameAPI = {
  getAllStates: async (): Promise<{ states: State[] }> => {
    const response = await api.get('/game/states');
    return response.data;
  },

  getStateById: async (id: number): Promise<{ state: State }> => {
    const response = await api.get(`/game/states/${id}`);
    return response.data;
  },

  getStatesByRegion: async (region: string): Promise<{ states: State[] }> => {
    const response = await api.get(`/game/regions/${region}`);
    return response.data;
  },

  startSession: async (gameMode: GameMode, difficulty: Difficulty = 'hard'): Promise<{ sessionId: string; states: GameState[]; difficulty: string }> => {
    const response = await api.post('/game/session/start', { gameMode, difficulty });
    return response.data;
  },

  submitAnswer: async (stateId: number, guessedStateId: number, clueLevel: number) => {
    const response = await api.post('/game/answer', {
      stateId,
      guessedStateId,
      clueLevel
    });
    return response.data;
  },

  requestHint: async (stateId: number, currentClueLevel: number) => {
    const response = await api.post('/game/hint', {
      stateId,
      currentClueLevel
    });
    return response.data;
  },

  completeGame: async (gameMode: GameMode, score: number, timeSeconds: number) => {
    const response = await api.post('/game/complete', {
      gameMode,
      score,
      timeSeconds
    });
    return response.data;
  }
};

// Leaderboard
export const leaderboardAPI = {
  getLeaderboard: async (
    gameMode: GameMode,
    filter: 'all' | 'week' | 'month' = 'all'
  ): Promise<{ leaderboard: LeaderboardEntry[]; userBest: any }> => {
    const response = await api.get(`/leaderboard/${gameMode}`, {
      params: { filter }
    });
    return response.data;
  },

  getTopFive: async (gameMode: GameMode): Promise<{ topScores: any[] }> => {
    const response = await api.get(`/leaderboard/${gameMode}/preview/top5`);
    return response.data;
  }
};

// User
export const userAPI = {
  getStats: async (): Promise<UserStats> => {
    const response = await api.get('/user/stats');
    return response.data;
  },

  getProgress: async (): Promise<{ states: StateProgress[]; summary: any }> => {
    const response = await api.get('/user/progress');
    return response.data;
  },

  getStateProgress: async (stateId: number): Promise<{ state: State & StateProgress }> => {
    const response = await api.get(`/user/progress/${stateId}`);
    return response.data;
  }
};

export default api;
