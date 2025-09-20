// Game Types and Constants
export const GAME_MODES = {
  CLASSIC_2D: 'classic_2d'
};

export const POWER_UPS = {
  FREEZE: {
    id: 'freeze',
    name: 'Freeze',
    description: 'Skip opponent\'s next turn',
    icon: '❄️',
    cooldown: 3,
    cost: 2,
    color: '#3b82f6',
    particles: 'ice'
  },
  DOUBLE_MOVE: {
    id: 'double_move',
    name: 'Double Move',
    description: 'Place two symbols in one turn',
    icon: '⚡',
    cooldown: 4,
    cost: 3,
    color: '#f59e0b',
    particles: 'lightning'
  },
  STEAL: {
    id: 'steal',
    name: 'Steal',
    description: 'Convert opponent\'s symbol to yours',
    icon: '🔄',
    cooldown: 5,
    cost: 4,
    color: '#8b5cf6',
    particles: 'magic'
  },
  BOMB: {
    id: 'bomb',
    name: 'Bomb',
    description: 'Clear a 3x3 area',
    icon: '💥',
    cooldown: 6,
    cost: 5,
    color: '#ef4444',
    particles: 'explosion'
  },
  SHIELD: {
    id: 'shield',
    name: 'Shield',
    description: 'Protect a cell from being taken',
    icon: '🛡️',
    cooldown: 4,
    cost: 3,
    color: '#10b981',
    particles: 'shield'
  },
  TIME_WARP: {
    id: 'time_warp',
    name: 'Time Warp',
    description: 'Undo last 2 moves',
    icon: '⏰',
    cooldown: 7,
    cost: 6,
    color: '#06b6d4',
    particles: 'time'
  }
};

export const ACHIEVEMENTS = {
  FIRST_WIN: {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🏆',
    points: 50,
    rarity: 'common'
  },
  PERFECTIONIST: {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Win 10 games in a row',
    icon: '✨',
    points: 500,
    rarity: 'legendary',
    requirement: { type: 'streak', value: 10 }
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Win a game in under 30 seconds',
    icon: '⚡',
    points: 200,
    rarity: 'rare',
    requirement: { type: 'time', value: 30 }
  },
  POWER_USER: {
    id: 'power_user',
    name: 'Power User',
    description: 'Use 100 power-ups',
    icon: '🔋',
    points: 300,
    rarity: 'epic',
    requirement: { type: 'powerups_used', value: 100 }
  },
  THREE_D_MASTER: {
    id: '3d_master',
    name: '3D Master',
    description: 'Win 50 3D games',
    icon: '🎮',
    points: 400,
    rarity: 'epic',
    requirement: { type: '3d_wins', value: 50 }
  },
  GIANT_SLAYER: {
    id: 'giant_slayer',
    name: 'Giant Slayer',
    description: 'Beat Hard AI 25 times',
    icon: '⚔️',
    points: 600,
    rarity: 'legendary',
    requirement: { type: 'ai_hard_wins', value: 25 }
  },
  STRATEGIST: {
    id: 'strategist',
    name: 'Master Strategist',
    description: 'Win using all power-ups at least once',
    icon: '🧠',
    points: 750,
    rarity: 'legendary',
    requirement: { type: 'all_powerups_used', value: true }
  },
  CENTURION: {
    id: 'centurion',
    name: 'Centurion',
    description: 'Win 100 games',
    icon: '💯',
    points: 1000,
    rarity: 'legendary',
    requirement: { type: 'total_wins', value: 100 }
  },
  NIGHTMARE_SLAYER: {
    id: 'nightmare_slayer',
    name: 'Nightmare Slayer',
    description: 'Beat Nightmare AI 10 times',
    icon: '😈',
    points: 1500,
    rarity: 'mythic',
    requirement: { type: 'ai_nightmare_wins', value: 10 }
  },
  MULTI_DIMENSIONAL: {
    id: 'multi_dimensional',
    name: 'Multi-Dimensional Master',
    description: 'Win 25 Multi-Level 3D games',
    icon: '🌌',
    points: 800,
    rarity: 'legendary',
    requirement: { type: 'multilevel_wins', value: 25 }
  },
  UNSTOPPABLE: {
    id: 'unstoppable',
    name: 'Unstoppable Force',
    description: 'Win 25 games in a row',
    icon: '🔥',
    points: 2000,
    rarity: 'mythic',
    requirement: { type: 'streak', value: 25 }
  },
  LIGHTNING_FAST: {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    description: 'Win 10 games under 20 seconds each',
    icon: '⚡',
    points: 500,
    rarity: 'epic',
    requirement: { type: 'fast_wins', value: 10 }
  },
  THEME_COLLECTOR: {
    id: 'theme_collector',
    name: 'Theme Collector',
    description: 'Unlock all themes',
    icon: '🎨',
    points: 1200,
    rarity: 'legendary',
    requirement: { type: 'themes_unlocked', value: 8 }
  },
  POWER_MASTER: {
    id: 'power_master',
    name: 'Power Master',
    description: 'Use each power-up 50 times',
    icon: '⚡',
    points: 800,
    rarity: 'epic',
    requirement: { type: 'all_powerups_mastery', value: 50 }
  },
  FLAWLESS_VICTORY: {
    id: 'flawless_victory',
    name: 'Flawless Victory',
    description: 'Win without the opponent making a mark',
    icon: '👑',
    points: 300,
    rarity: 'rare',
    requirement: { type: 'perfect_game', value: true }
  },
  COMEBACK_KING: {
    id: 'comeback_king',
    name: 'Comeback King',
    description: 'Win after opponent was one move from victory',
    icon: '🔄',
    points: 400,
    rarity: 'epic',
    requirement: { type: 'comeback_win', value: true }
  },
  SESSION_MASTER: {
    id: 'session_master',
    name: 'Session Master',
    description: 'Win 20 games in one session',
    icon: '🏃‍♂️',
    points: 600,
    rarity: 'epic',
    requirement: { type: 'session_wins', value: 20 }
  },
  TUTORIAL_GRADUATE: {
    id: 'tutorial_graduate',
    name: 'Tutorial Graduate',
    description: 'Complete all game mode tutorials',
    icon: '🎓',
    points: 200,
    rarity: 'common',
    requirement: { type: 'tutorials_completed', value: 3 }
  }
};

export const THEMES = {
  NEON: {
    id: 'neon',
    name: 'Neon Cyber',
    colors: {
      primary: '#00ffff',
      secondary: '#ff00ff',
      background: '#0a0a0a',
      surface: '#1a1a2e',
      accent: '#16213e'
    },
    unlocked: true
  },
  RETRO: {
    id: 'retro',
    name: 'Retro Wave',
    colors: {
      primary: '#ff6b9d',
      secondary: '#c44569',
      background: '#2d1b69',
      surface: '#54278f',
      accent: '#7209b7'
    },
    unlocked: false,
    requirement: { type: 'games_played', value: 50 }
  },
  NATURE: {
    id: 'nature',
    name: 'Forest Zen',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      background: '#064e3b',
      surface: '#065f46',
      accent: '#047857'
    },
    unlocked: false,
    requirement: { type: 'achievements', value: 5 }
  },
  SPACE: {
    id: 'space',
    name: 'Deep Space',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      background: '#1e1b4b',
      surface: '#312e81',
      accent: '#4338ca'
    },
    unlocked: false,
    requirement: { type: 'win_streak', value: 5 }
  },
  FIRE: {
    id: 'fire',
    name: 'Inferno',
    colors: {
      primary: '#ef4444',
      secondary: '#fb7185',
      background: '#7f1d1d',
      surface: '#991b1b',
      accent: '#b91c1c'
    },
    unlocked: false,
    requirement: { type: 'ai_hard_wins', value: 10 }
  },
  ICE: {
    id: 'ice',
    name: 'Arctic Ice',
    colors: {
      primary: '#06b6d4',
      secondary: '#0891b2',
      background: '#164e63',
      surface: '#155e75',
      accent: '#0e7490'
    },
    unlocked: false,
    requirement: { type: 'powerups_used', value: 200 }
  },
  GOLD: {
    id: 'gold',
    name: 'Golden Luxury',
    colors: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      background: '#78350f',
      surface: '#92400e',
      accent: '#a16207'
    },
    unlocked: false,
    requirement: { type: 'total_wins', value: 50 }
  },
  MIDNIGHT: {
    id: 'midnight',
    name: 'Midnight Shadow',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#0f172a',
      surface: '#1e293b',
      accent: '#334155'
    },
    unlocked: false,
    requirement: { type: 'achievements', value: 10 }
  },
  OCEAN: {
    id: 'ocean',
    name: 'Ocean Depths',
    colors: {
      primary: '#0ea5e9',
      secondary: '#38bdf8',
      background: '#0c4a6e',
      surface: '#075985',
      accent: '#0369a1'
    },
    unlocked: false,
    requirement: { type: 'multilevel_wins', value: 15 }
  },
  SUNSET: {
    id: 'sunset',
    name: 'Sunset Glow',
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      background: '#7c2d12',
      surface: '#9a3412',
      accent: '#c2410c'
    },
    unlocked: false,
    requirement: { type: 'session_wins', value: 15 }
  },
  MATRIX: {
    id: 'matrix',
    name: 'Matrix Code',
    colors: {
      primary: '#22c55e',
      secondary: '#4ade80',
      background: '#052e16',
      surface: '#14532d',
      accent: '#166534'
    },
    unlocked: false,
    requirement: { type: 'ai_nightmare_wins', value: 5 }
  }
};

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  NIGHTMARE: 'nightmare'
};

export const PARTICLE_TYPES = {
  VICTORY: 'victory',
  POWER_UP: 'power_up',
  EXPLOSION: 'explosion',
  MAGIC: 'magic',
  ICE: 'ice',
  LIGHTNING: 'lightning',
  SHIELD: 'shield',
  TIME: 'time'
};
