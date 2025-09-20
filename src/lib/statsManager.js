import { ACHIEVEMENTS, THEMES } from './gameTypes.js';

// Statistics Manager for tracking player progress
export class StatsManager {
  constructor() {
    this.stats = this.loadStats();
    this.achievements = this.loadAchievements();
    this.unlockedThemes = this.loadUnlockedThemes();
  }

  // Load stats from localStorage
  loadStats() {
    if (typeof window === 'undefined') return this.getDefaultStats();
    
    const saved = localStorage.getItem('tic_tac_toe_stats');
    return saved ? JSON.parse(saved) : this.getDefaultStats();
  }

  // Load achievements from localStorage
  loadAchievements() {
    if (typeof window === 'undefined') return {};
    
    const saved = localStorage.getItem('tic_tac_toe_achievements');
    return saved ? JSON.parse(saved) : {};
  }

  // Load unlocked themes
  loadUnlockedThemes() {
    if (typeof window === 'undefined') return ['neon'];
    
    const saved = localStorage.getItem('tic_tac_toe_themes');
    return saved ? JSON.parse(saved) : ['neon'];
  }

  getDefaultStats() {
    return {
      totalGames: 0,
      totalWins: 0,
      totalLosses: 0,
      totalDraws: 0,
      winRate: 0,
      averageMovesPerGame: 0,
      totalMoves: 0,
      averageTimePerGame: 0,
      totalTime: 0,
      streaks: {
        current: 0,
        longest: 0
      },
      // Separate stats for AI vs Local player games
      gamesVsAI: {
        totalGames: 0,
        totalWins: 0,
        totalLosses: 0,
        totalDraws: 0,
        winRate: 0,
        streaks: {
          current: 0,
          longest: 0
        },
        byDifficulty: {
          easy: { played: 0, won: 0 },
          medium: { played: 0, won: 0 },
          hard: { played: 0, won: 0 },
          nightmare: { played: 0, won: 0 }
        }
      },
      gamesVsLocal: {
        totalGames: 0,
        totalWins: 0,
        totalLosses: 0,
        totalDraws: 0,
        winRate: 0,
        streaks: {
          current: 0,
          longest: 0
        }
      },
      gamesByMode: {
        tictactoe: { played: 0, won: 0, vsAI: 0, vsLocal: 0 }
      },
      gamesByDifficulty: {
        easy: { played: 0, won: 0 },
        medium: { played: 0, won: 0 },
        hard: { played: 0, won: 0 },
        nightmare: { played: 0, won: 0 }
      },
      powerUpsUsed: {
        freeze: 0,
        double_move: 0,
        steal: 0,
        bomb: 0,
        shield: 0,
        time_warp: 0
      },
      totalPowerUpsUsed: 0,
      favoritePositions: new Array(9).fill(0),
      sessionStats: {
        gamesPlayed: 0,
        wins: 0,
        gamesVsAI: 0,
        gamesVsLocal: 0,
        startTime: Date.now()
      },
      achievements: {
        unlocked: 0,
        totalPoints: 0
      },
      // Additional stats for achievements
      fastWins: 0,
      fastWins30: 0,
      perfectGames: 0,
      comebackWins: 0,
      tutorialsCompleted: 0
    };
  }

  // Record a game result
  recordGame(result) {
    const { 
      winner, 
      gameMode, 
      difficulty, 
      duration, 
      moves, 
      powerUpsUsed = [],
      isPlayerWin,
      isAgainstAI = true
    } = result;

    // Ensure stats are properly initialized
    if (!this.stats) {
      this.stats = this.getDefaultStats();
    }
    
    // Ensure nested stats are initialized
    if (!this.stats.gamesVsAI) {
      this.stats.gamesVsAI = {
        totalGames: 0, totalWins: 0, totalLosses: 0, totalDraws: 0, winRate: 0,
        streaks: { current: 0, longest: 0 },
        byDifficulty: {
          easy: { played: 0, won: 0 }, medium: { played: 0, won: 0 },
          hard: { played: 0, won: 0 }, nightmare: { played: 0, won: 0 }
        }
      };
    }
    
    if (!this.stats.gamesVsLocal) {
      this.stats.gamesVsLocal = {
        totalGames: 0, totalWins: 0, totalLosses: 0, totalDraws: 0, winRate: 0,
        streaks: { current: 0, longest: 0 }
      };
    }
    
    if (!this.stats.sessionStats) {
      this.stats.sessionStats = {
        gamesPlayed: 0, wins: 0, gamesVsAI: 0, gamesVsLocal: 0, startTime: Date.now()
      };
    }

    // Update basic stats
    this.stats.totalGames++;
    this.stats.totalMoves += moves;
    this.stats.totalTime += duration;
    this.stats.sessionStats.gamesPlayed++;

    // Update AI vs Local stats
    const targetStats = isAgainstAI ? this.stats.gamesVsAI : this.stats.gamesVsLocal;
    targetStats.totalGames++;
    
    if (isAgainstAI) {
      this.stats.sessionStats.gamesVsAI++;
    } else {
      this.stats.sessionStats.gamesVsLocal++;
    }

    // Update game outcome
    if (winner === null) {
      this.stats.totalDraws++;
      targetStats.totalDraws++;
    } else if (isPlayerWin) {
      this.stats.totalWins++;
      targetStats.totalWins++;
      this.stats.sessionStats.wins++;
      
      // Update streaks
      this.stats.streaks.current++;
      this.stats.streaks.longest = Math.max(
        this.stats.streaks.longest, 
        this.stats.streaks.current
      );
      
      targetStats.streaks.current++;
      targetStats.streaks.longest = Math.max(
        targetStats.streaks.longest, 
        targetStats.streaks.current
      );
    } else {
      this.stats.totalLosses++;
      targetStats.totalLosses++;
      this.stats.streaks.current = 0;
      targetStats.streaks.current = 0;
    }

    // Update mode stats
    if (this.stats.gamesByMode[gameMode]) {
      this.stats.gamesByMode[gameMode].played++;
      if (isPlayerWin) {
        this.stats.gamesByMode[gameMode].won++;
      }
      
      // Track AI vs Local per mode
      if (isAgainstAI) {
        this.stats.gamesByMode[gameMode].vsAI++;
      } else {
        this.stats.gamesByMode[gameMode].vsLocal++;
      }
    }

    // Update difficulty stats (only for AI games)
    if (isAgainstAI && this.stats.gamesByDifficulty[difficulty]) {
      this.stats.gamesByDifficulty[difficulty].played++;
      if (isPlayerWin) {
        this.stats.gamesByDifficulty[difficulty].won++;
      }
      
      // Update AI-specific difficulty stats
      if (targetStats.byDifficulty && targetStats.byDifficulty[difficulty]) {
        targetStats.byDifficulty[difficulty].played++;
        if (isPlayerWin) {
          targetStats.byDifficulty[difficulty].won++;
        }
      }
    }

    // Update power-up usage
    powerUpsUsed.forEach(powerUp => {
      if (this.stats.powerUpsUsed[powerUp]) {
        this.stats.powerUpsUsed[powerUp]++;
        this.stats.totalPowerUpsUsed++;
      }
    });

    // Track additional achievement stats
    if (isPlayerWin) {
      // Track fast wins (under 30 seconds)
      if (duration && duration < 30000) {
        this.stats.fastWins++;
        if (duration < 15000) {
          this.stats.fastWins30++; // Very fast wins under 15 seconds
        }
      }
      
      // Track perfect games (won in minimum moves)
      if (moves <= 5) {
        this.stats.perfectGames++;
      }
    }

    // Update calculated stats
    this.updateCalculatedStats();

    // Check for new achievements
    const newAchievements = this.checkAchievements();

    // Save to localStorage
    this.saveStats();

    return {
      stats: this.stats,
      newAchievements
    };
  }

  // Record a move position for heat map
  recordMove(position) {
    if (position >= 0 && position < this.stats.favoritePositions.length) {
      this.stats.favoritePositions[position]++;
    }
  }

  // Record tutorial completion
  recordTutorialCompletion() {
    this.stats.tutorialsCompleted++;
    this.saveStats();
    
    // Check for tutorial-related achievements
    const newAchievements = this.checkAchievements();
    return newAchievements;
  }

  // Update calculated statistics
  updateCalculatedStats() {
    this.stats.winRate = this.stats.totalGames > 0 
      ? (this.stats.totalWins / this.stats.totalGames) * 100 
      : 0;
      
    this.stats.averageMovesPerGame = this.stats.totalGames > 0 
      ? this.stats.totalMoves / this.stats.totalGames 
      : 0;
      
    this.stats.averageTimePerGame = this.stats.totalGames > 0 
      ? this.stats.totalTime / this.stats.totalGames 
      : 0;
    
    // Update AI vs Local win rates
    this.stats.gamesVsAI.winRate = this.stats.gamesVsAI.totalGames > 0
      ? (this.stats.gamesVsAI.totalWins / this.stats.gamesVsAI.totalGames) * 100
      : 0;
      
    this.stats.gamesVsLocal.winRate = this.stats.gamesVsLocal.totalGames > 0
      ? (this.stats.gamesVsLocal.totalWins / this.stats.gamesVsLocal.totalGames) * 100
      : 0;
  }

  // Check for new achievements
  checkAchievements() {
    const newAchievements = [];

    Object.entries(ACHIEVEMENTS).forEach(([key, achievement]) => {
      if (this.achievements[key]) return; // Already unlocked

      let unlocked = false;
      const req = achievement.requirement;

      if (!req) return; // No requirement defined

      switch (req.type) {
        case 'total_wins':
          unlocked = this.stats.totalWins >= req.value;
          break;
        case 'total_games':
          unlocked = this.stats.totalGames >= req.value;
          break;
        case 'streak':
          unlocked = this.stats.streaks.longest >= req.value;
          break;
        case 'time':
          unlocked = this.stats.averageTimePerGame > 0 && 
                     this.stats.averageTimePerGame <= req.value * 1000; // Convert to ms
          break;
        case 'fast_wins':
          unlocked = (this.stats.fastWins || 0) >= req.value;
          break;
        case 'fast_wins_30':
          unlocked = (this.stats.fastWins30 || 0) >= req.value;
          break;
        case 'powerups_used':
          unlocked = this.stats.totalPowerUpsUsed >= req.value;
          break;
        case 'powerup_freeze':
          unlocked = (this.stats.powerUpsUsed?.freeze || 0) >= req.value;
          break;
        case 'powerup_double_move':
          unlocked = (this.stats.powerUpsUsed?.double_move || 0) >= req.value;
          break;
        case 'powerup_steal':
          unlocked = (this.stats.powerUpsUsed?.steal || 0) >= req.value;
          break;
        case 'powerup_bomb':
          unlocked = (this.stats.powerUpsUsed?.bomb || 0) >= req.value;
          break;
        case 'powerup_shield':
          unlocked = (this.stats.powerUpsUsed?.shield || 0) >= req.value;
          break;
        case 'ai_easy_wins':
          unlocked = (this.stats.gamesVsAI?.byDifficulty?.easy?.won || 0) >= req.value;
          break;
        case 'ai_medium_wins':
          unlocked = (this.stats.gamesVsAI?.byDifficulty?.medium?.won || 0) >= req.value;
          break;
        case 'ai_hard_wins':
          unlocked = (this.stats.gamesVsAI?.byDifficulty?.hard?.won || 0) >= req.value;
          break;
        case 'ai_nightmare_wins':
          unlocked = (this.stats.gamesVsAI?.byDifficulty?.nightmare?.won || 0) >= req.value;
          break;
        case 'ai_total_wins':
          unlocked = (this.stats.gamesVsAI?.totalWins || 0) >= req.value;
          break;
        case 'session_games':
          unlocked = (this.stats.sessionStats?.gamesPlayed || 0) >= req.value;
          break;
        case 'session_wins':
          unlocked = (this.stats.sessionStats?.wins || 0) >= req.value;
          break;
        case 'themes_unlocked':
          unlocked = this.unlockedThemes.length >= req.value;
          break;
        case 'all_powerups_used':
          const allPowerUpsUsed = Object.values(this.stats.powerUpsUsed || {})
            .every(count => count > 0);
          unlocked = allPowerUpsUsed && req.value;
          break;
        case 'all_powerups_mastery':
          const masteryCount = Object.values(this.stats.powerUpsUsed || {})
            .reduce((sum, count) => sum + count, 0);
          unlocked = masteryCount >= req.value;
          break;
        case 'perfect_game':
          unlocked = (this.stats.perfectGames || 0) >= 1 && req.value;
          break;
        case 'comeback_win':
          unlocked = (this.stats.comebackWins || 0) >= 1 && req.value;
          break;
        case 'tutorials_completed':
          unlocked = (this.stats.tutorialsCompleted || 0) >= req.value;
          break;
        // Legacy cases for backward compatibility
        case 'first_win':
          unlocked = this.stats.totalWins >= 1;
          break;
        case 'perfectionist':
          unlocked = this.stats.streaks.longest >= 10;
          break;
        case 'speed_demon':
          unlocked = this.stats.averageTimePerGame > 0 && 
                     this.stats.averageTimePerGame <= 30000;
          break;
        case 'power_user':
          unlocked = this.stats.totalPowerUpsUsed >= 100;
          break;
        case 'giant_slayer':
          unlocked = (this.stats.gamesVsAI?.byDifficulty?.hard?.won || 0) >= 25;
          break;
        case 'strategist':
          const allUsed = Object.values(this.stats.powerUpsUsed || {})
            .every(count => count > 0);
          unlocked = allUsed;
          break;
      }

      if (unlocked) {
        this.achievements[key] = {
          ...achievement,
          unlockedAt: Date.now()
        };
        this.stats.achievements.unlocked++;
        this.stats.achievements.totalPoints += achievement.points;
        newAchievements.push(achievement);

        // Check for theme unlocks
        this.checkThemeUnlocks();
      }
    });

    if (newAchievements.length > 0) {
      this.saveAchievements();
    }

    return newAchievements;
  }

  // Check for theme unlocks based on achievements and stats
  checkThemeUnlocks() {
    Object.entries(THEMES).forEach(([key, theme]) => {
      if (this.unlockedThemes.includes(key)) return;

      let unlock = false;
      const req = theme.requirement;

      if (req) {
        switch (req.type) {
          case 'games_played':
            unlock = this.stats.totalGames >= req.value;
            break;
          case 'achievements':
            unlock = this.stats.achievements.unlocked >= req.value;
            break;
          case 'win_streak':
            unlock = this.stats.streaks.longest >= req.value;
            break;
        }
      }

      if (unlock) {
        this.unlockedThemes.push(key);
        this.saveUnlockedThemes();
      }
    });
  }

  // Save stats to localStorage
  saveStats() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tic_tac_toe_stats', JSON.stringify(this.stats));
    }
  }

  // Save achievements to localStorage
  saveAchievements() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tic_tac_toe_achievements', JSON.stringify(this.achievements));
    }
  }

  // Save unlocked themes
  saveUnlockedThemes() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tic_tac_toe_themes', JSON.stringify(this.unlockedThemes));
    }
  }

  // Get all stats
  getStats() {
    return this.stats;
  }

  // Get all achievements
  getAchievements() {
    return this.achievements;
  }

  // Calculate player level and progress
  getPlayerLevel() {
    const totalPoints = this.stats?.achievements?.totalPoints || 0;
    
    // Level calculation: exponential growth
    // Level 1: 0-99 points, Level 2: 100-299 points, Level 3: 300-599 points, etc.
    let level = 1;
    let pointsNeeded = 100; // Points needed for level 2
    let totalPointsForLevel = 0;
    
    while (totalPoints >= totalPointsForLevel + pointsNeeded) {
      totalPointsForLevel += pointsNeeded;
      level++;
      pointsNeeded = Math.floor(pointsNeeded * 1.5); // 50% increase each level
    }
    
    const currentLevelPoints = totalPoints - totalPointsForLevel;
    const nextLevelPoints = pointsNeeded;
    const progress = nextLevelPoints > 0 ? (currentLevelPoints / nextLevelPoints) * 100 : 100;
    
    return {
      level,
      totalPoints,
      currentLevelPoints,
      nextLevelPoints,
      progress: Math.min(progress, 100),
      pointsToNext: Math.max(nextLevelPoints - currentLevelPoints, 0)
    };
  }

  // Get unlocked themes
  getUnlockedThemes() {
    return this.unlockedThemes;
  }

  // Reset all stats (for testing or user preference)
  resetStats() {
    this.stats = this.getDefaultStats();
    this.achievements = {};
    this.unlockedThemes = ['neon'];
    this.saveStats();
    this.saveAchievements();
    this.saveUnlockedThemes();
  }

  // Get session summary
  getSessionSummary() {
    const sessionDuration = Date.now() - this.stats.sessionStats.startTime;
    return {
      gamesPlayed: this.stats.sessionStats.gamesPlayed,
      wins: this.stats.sessionStats.wins,
      duration: sessionDuration,
      winRate: this.stats.sessionStats.gamesPlayed > 0 
        ? (this.stats.sessionStats.wins / this.stats.sessionStats.gamesPlayed) * 100 
        : 0
    };
  }
}

// Singleton instance
export const statsManager = new StatsManager();
