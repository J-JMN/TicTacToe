// Game Types and Constants
export const GAME_MODES = {
  TICTACTOE: 'tictactoe'
};

export const POWER_UPS = {
  FREEZE: {
    id: 'freeze',
    name: 'Freeze',
    description: 'Skip opponent\'s next turn',
    icon: '❄️',
    cooldown: 6,
    cost: 2,
    color: '#3b82f6',
    particles: 'ice'
  },
  DOUBLE_MOVE: {
    id: 'double_move',
    name: 'Double Move',
    description: 'Place two symbols in one turn',
    icon: '⚡',
    cooldown: 6,
    cost: 3,
    color: '#f59e0b',
    particles: 'lightning'
  },
  STEAL: {
    id: 'steal',
    name: 'Steal',
    description: 'Convert opponent\'s symbol to yours',
    icon: '🔄',
    cooldown: 6,
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
    cooldown: 6,
    cost: 3,
    color: '#10b981',
    particles: 'shield'
  },
  TIME_WARP: {
    id: 'time_warp',
    name: 'Time Warp',
    description: 'Undo last 2 moves',
    icon: '⏰',
    cooldown: 6,
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
    requirement: { type: 'tutorials_completed', value: 1 }
  },
  // Win-based Achievements
  FIRST_STEPS: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Play your first game',
    icon: '👶',
    points: 10,
    rarity: 'common',
    requirement: { type: 'total_games', value: 1 }
  },
  ROOKIE: {
    id: 'rookie',
    name: 'Rookie Player',
    description: 'Win 5 games',
    icon: '🏃',
    points: 25,
    rarity: 'common',
    requirement: { type: 'total_wins', value: 5 }
  },
  VETERAN: {
    id: 'veteran',
    name: 'Veteran',
    description: 'Win 25 games',
    icon: '🎖️',
    points: 100,
    rarity: 'common',
    requirement: { type: 'total_wins', value: 25 }
  },
  CHAMPION: {
    id: 'champion',
    name: 'Champion',
    description: 'Win 50 games',
    icon: '🏅',
    points: 250,
    rarity: 'rare',
    requirement: { type: 'total_wins', value: 50 }
  },
  LEGEND: {
    id: 'legend',
    name: 'Legend',
    description: 'Win 200 games',
    icon: '👑',
    points: 1200,
    rarity: 'legendary',
    requirement: { type: 'total_wins', value: 200 }
  },
  MYTHICAL: {
    id: 'mythical',
    name: 'Mythical Master',
    description: 'Win 500 games',
    icon: '🌟',
    points: 3000,
    rarity: 'mythic',
    requirement: { type: 'total_wins', value: 500 }
  },
  // Streak Achievements
  HOT_STREAK: {
    id: 'hot_streak',
    name: 'Hot Streak',
    description: 'Win 3 games in a row',
    icon: '🔥',
    points: 50,
    rarity: 'common',
    requirement: { type: 'streak', value: 3 }
  },
  ON_FIRE: {
    id: 'on_fire',
    name: 'On Fire',
    description: 'Win 5 games in a row',
    icon: '🚀',
    points: 100,
    rarity: 'rare',
    requirement: { type: 'streak', value: 5 }
  },
  DOMINATOR: {
    id: 'dominator',
    name: 'Dominator',
    description: 'Win 15 games in a row',
    icon: '⚡',
    points: 800,
    rarity: 'epic',
    requirement: { type: 'streak', value: 15 }
  },
  GODLIKE: {
    id: 'godlike',
    name: 'Godlike',
    description: 'Win 50 games in a row',
    icon: '👼',
    points: 5000,
    rarity: 'mythic',
    requirement: { type: 'streak', value: 50 }
  },
  // AI Difficulty Achievements
  EASY_RIDER: {
    id: 'easy_rider',
    name: 'Easy Rider',
    description: 'Beat Easy AI 10 times',
    icon: '🚴',
    points: 50,
    rarity: 'common',
    requirement: { type: 'ai_easy_wins', value: 10 }
  },
  MEDIUM_MASTERY: {
    id: 'medium_mastery',
    name: 'Medium Mastery',
    description: 'Beat Medium AI 10 times',
    icon: '🎯',
    points: 100,
    rarity: 'rare',
    requirement: { type: 'ai_medium_wins', value: 10 }
  },
  HARD_CORE: {
    id: 'hard_core',
    name: 'Hard Core',
    description: 'Beat Hard AI 5 times',
    icon: '💪',
    points: 300,
    rarity: 'epic',
    requirement: { type: 'ai_hard_wins', value: 5 }
  },
  NIGHTMARE_CONQUEROR: {
    id: 'nightmare_conqueror',
    name: 'Nightmare Conqueror',
    description: 'Beat Nightmare AI once',
    icon: '🌙',
    points: 500,
    rarity: 'legendary',
    requirement: { type: 'ai_nightmare_wins', value: 1 }
  },
  AI_DESTROYER: {
    id: 'ai_destroyer',
    name: 'AI Destroyer',
    description: 'Beat AI 100 times total',
    icon: '🤖',
    points: 600,
    rarity: 'epic',
    requirement: { type: 'ai_total_wins', value: 100 }
  },
  // Speed Achievements
  QUICK_DRAW: {
    id: 'quick_draw',
    name: 'Quick Draw',
    description: 'Win a game in under 15 seconds',
    icon: '🏹',
    points: 150,
    rarity: 'rare',
    requirement: { type: 'time', value: 15 }
  },
  FLASH: {
    id: 'flash',
    name: 'Flash',
    description: 'Win a game in under 10 seconds',
    icon: '⚡',
    points: 300,
    rarity: 'epic',
    requirement: { type: 'time', value: 10 }
  },
  SONIC_BOOM: {
    id: 'sonic_boom',
    name: 'Sonic Boom',
    description: 'Win 5 games under 20 seconds each',
    icon: '💨',
    points: 400,
    rarity: 'epic',
    requirement: { type: 'fast_wins', value: 5 }
  },
  TIME_MASTER: {
    id: 'time_master',
    name: 'Time Master',
    description: 'Win 20 games under 30 seconds each',
    icon: '⏱️',
    points: 800,
    rarity: 'legendary',
    requirement: { type: 'fast_wins_30', value: 20 }
  },
  // Power-up Achievements
  FREEZE_MASTER: {
    id: 'freeze_master',
    name: 'Freeze Master',
    description: 'Use Freeze 25 times',
    icon: '❄️',
    points: 150,
    rarity: 'rare',
    requirement: { type: 'powerup_freeze', value: 25 }
  },
  DOUBLE_TROUBLE: {
    id: 'double_trouble',
    name: 'Double Trouble',
    description: 'Use Double Move 20 times',
    icon: '⚡',
    points: 200,
    rarity: 'rare',
    requirement: { type: 'powerup_double_move', value: 20 }
  },
  THIEF: {
    id: 'thief',
    name: 'Master Thief',
    description: 'Use Steal 30 times',
    icon: '🎯',
    points: 250,
    rarity: 'epic',
    requirement: { type: 'powerup_steal', value: 30 }
  },
  BOMBER: {
    id: 'bomber',
    name: 'Demolition Expert',
    description: 'Use Bomb 15 times',
    icon: '💥',
    points: 200,
    rarity: 'rare',
    requirement: { type: 'powerup_bomb', value: 15 }
  },
  DEFENDER: {
    id: 'defender',
    name: 'Great Defender',
    description: 'Use Shield 20 times',
    icon: '🛡️',
    points: 180,
    rarity: 'rare',
    requirement: { type: 'powerup_shield', value: 20 }
  },
  POWER_HUNGRY: {
    id: 'power_hungry',
    name: 'Power Hungry',
    description: 'Use 200 power-ups total',
    icon: '🔋',
    points: 400,
    rarity: 'epic',
    requirement: { type: 'powerups_used', value: 200 }
  },
  POWER_ADDICT: {
    id: 'power_addict',
    name: 'Power Addict',
    description: 'Use 1000 power-ups total',
    icon: '⚡',
    points: 1500,
    rarity: 'legendary',
    requirement: { type: 'powerups_used', value: 1000 }
  },
  // Session Achievements
  MARATHON_RUNNER: {
    id: 'marathon_runner',
    name: 'Marathon Runner',
    description: 'Play 10 games in one session',
    icon: '🏃‍♂️',
    points: 100,
    rarity: 'rare',
    requirement: { type: 'session_games', value: 10 }
  },
  ENDURANCE_CHAMPION: {
    id: 'endurance_champion',
    name: 'Endurance Champion',
    description: 'Play 50 games in one session',
    icon: '🏆',
    points: 500,
    rarity: 'legendary',
    requirement: { type: 'session_games', value: 50 }
  },
  SESSION_DOMINATOR: {
    id: 'session_dominator',
    name: 'Session Dominator',
    description: 'Win 30 games in one session',
    icon: '👑',
    points: 800,
    rarity: 'legendary',
    requirement: { type: 'session_wins', value: 30 }
  },
  // Draw Achievements
  DIPLOMATIC: {
    id: 'diplomatic',
    name: 'Diplomatic',
    description: 'Draw 5 games',
    icon: '🤝',
    points: 50,
    rarity: 'common',
    requirement: { type: 'total_draws', value: 5 }
  },
  STALEMATE_KING: {
    id: 'stalemate_king',
    name: 'Stalemate King',
    description: 'Draw 20 games',
    icon: '👔',
    points: 150,
    rarity: 'rare',
    requirement: { type: 'total_draws', value: 20 }
  },
  PEACE_KEEPER: {
    id: 'peace_keeper',
    name: 'Peace Keeper',
    description: 'Draw 50 games',
    icon: '☮️',
    points: 300,
    rarity: 'epic',
    requirement: { type: 'total_draws', value: 50 }
  },
  // Gameplay Achievements
  CENTER_STAGE: {
    id: 'center_stage',
    name: 'Center Stage',
    description: 'Win by controlling center position 10 times',
    icon: '🎯',
    points: 200,
    rarity: 'rare',
    requirement: { type: 'center_wins', value: 10 }
  },
  CORNER_MASTER: {
    id: 'corner_master',
    name: 'Corner Master',
    description: 'Start with corner moves 25 times',
    icon: '📐',
    points: 100,
    rarity: 'common',
    requirement: { type: 'corner_starts', value: 25 }
  },
  DIAGONAL_DOMINATOR: {
    id: 'diagonal_dominator',
    name: 'Diagonal Dominator',
    description: 'Win with diagonal lines 15 times',
    icon: '↗️',
    points: 150,
    rarity: 'rare',
    requirement: { type: 'diagonal_wins', value: 15 }
  },
  HORIZONTAL_HERO: {
    id: 'horizontal_hero',
    name: 'Horizontal Hero',
    description: 'Win with horizontal lines 20 times',
    icon: '↔️',
    points: 120,
    rarity: 'common',
    requirement: { type: 'horizontal_wins', value: 20 }
  },
  VERTICAL_VICTOR: {
    id: 'vertical_victor',
    name: 'Vertical Victor',
    description: 'Win with vertical lines 20 times',
    icon: '↕️',
    points: 120,
    rarity: 'common',
    requirement: { type: 'vertical_wins', value: 20 }
  },
  // Milestone Achievements
  HUNDRED_CLUB: {
    id: 'hundred_club',
    name: 'Hundred Club',
    description: 'Play 100 games total',
    icon: '💯',
    points: 200,
    rarity: 'rare',
    requirement: { type: 'total_games', value: 100 }
  },
  FIVE_HUNDRED_CLUB: {
    id: 'five_hundred_club',
    name: 'Five Hundred Club',
    description: 'Play 500 games total',
    icon: '🎊',
    points: 800,
    rarity: 'epic',
    requirement: { type: 'total_games', value: 500 }
  },
  THOUSAND_CLUB: {
    id: 'thousand_club',
    name: 'Thousand Club',
    description: 'Play 1000 games total',
    icon: '🏛️',
    points: 2000,
    rarity: 'legendary',
    requirement: { type: 'total_games', value: 1000 }
  },
  // Losing Achievements (for unlocking powerups)
  LEARNING_CURVE: {
    id: 'learning_curve',
    name: 'Learning Curve',
    description: 'Lose 10 games (everyone starts somewhere!)',
    icon: '📚',
    points: 25,
    rarity: 'common',
    requirement: { type: 'total_losses', value: 10 }
  },
  PERSEVERANCE: {
    id: 'perseverance',
    name: 'Perseverance',
    description: 'Lose 50 games but keep trying',
    icon: '💪',
    points: 100,
    rarity: 'rare',
    requirement: { type: 'total_losses', value: 50 }
  },
  HARD_KNOCKS: {
    id: 'hard_knocks',
    name: 'School of Hard Knocks',
    description: 'Lose 15 times to Hard AI',
    icon: '🎓',
    points: 200,
    rarity: 'epic',
    requirement: { type: 'ai_hard_losses', value: 15 }
  },
  NIGHTMARE_SURVIVOR: {
    id: 'nightmare_survivor',
    name: 'Nightmare Survivor',
    description: 'Lose 500 times to Nightmare AI',
    icon: '👻',
    points: 1000,
    rarity: 'legendary',
    requirement: { type: 'ai_nightmare_losses', value: 500 }
  },
  // Special Achievements
  CUSTOMIZER: {
    id: 'customizer',
    name: 'Customizer',
    description: 'Change themes 10 times',
    icon: '🎨',
    points: 50,
    rarity: 'common',
    requirement: { type: 'themes_changed', value: 10 }
  },
  SYMBOL_ARTIST: {
    id: 'symbol_artist',
    name: 'Symbol Artist',
    description: 'Change symbols 5 times',
    icon: '🎭',
    points: 30,
    rarity: 'common',
    requirement: { type: 'symbols_changed', value: 5 }
  },
  PERFECTIONIST_PLUS: {
    id: 'perfectionist_plus',
    name: 'Perfectionist Plus',
    description: 'Win 20 games in a row',
    icon: '💎',
    points: 1200,
    rarity: 'legendary',
    requirement: { type: 'streak', value: 20 }
  },
  COMEBACK_ARTIST: {
    id: 'comeback_artist',
    name: 'Comeback Artist',
    description: 'Win after being behind 5 times',
    icon: '🔄',
    points: 300,
    rarity: 'epic',
    requirement: { type: 'comeback_wins', value: 5 }
  },
  LAST_SECOND_HERO: {
    id: 'last_second_hero',
    name: 'Last Second Hero',
    description: 'Win on the final move 10 times',
    icon: '⏰',
    points: 400,
    rarity: 'epic',
    requirement: { type: 'final_move_wins', value: 10 }
  },
  EFFICIENCY_EXPERT: {
    id: 'efficiency_expert',
    name: 'Efficiency Expert',
    description: 'Win in exactly 5 moves 5 times',
    icon: '⚙️',
    points: 500,
    rarity: 'legendary',
    requirement: { type: 'five_move_wins', value: 5 }
  },
  MINIMALIST: {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Win in exactly 3 moves',
    icon: '🎯',
    points: 800,
    rarity: 'legendary',
    requirement: { type: 'three_move_wins', value: 1 }
  },
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Play 50 local multiplayer games',
    icon: '🦋',
    points: 300,
    rarity: 'epic',
    requirement: { type: 'local_games', value: 50 }
  },
  LOCAL_CHAMPION: {
    id: 'local_champion',
    name: 'Local Champion',
    description: 'Win 25 local multiplayer games',
    icon: '🏆',
    points: 400,
    rarity: 'epic',
    requirement: { type: 'local_wins', value: 25 }
  },
  DAILY_PLAYER: {
    id: 'daily_player',
    name: 'Daily Player',
    description: 'Play games for 7 consecutive days',
    icon: '📅',
    points: 250,
    rarity: 'rare',
    requirement: { type: 'daily_streak', value: 7 }
  },
  WEEKLY_WARRIOR: {
    id: 'weekly_warrior',
    name: 'Weekly Warrior',
    description: 'Play games for 30 consecutive days',
    icon: '🗓️',
    points: 1000,
    rarity: 'legendary',
    requirement: { type: 'daily_streak', value: 30 }
  },
  THEME_MASTER: {
    id: 'theme_master',
    name: 'Theme Master',
    description: 'Unlock 10 themes',
    icon: '🌈',
    points: 600,
    rarity: 'epic',
    requirement: { type: 'themes_unlocked', value: 10 }
  },
  RAINBOW_COLLECTOR: {
    id: 'rainbow_collector',
    name: 'Rainbow Collector',
    description: 'Unlock 20 themes',
    icon: '🎨',
    points: 1500,
    rarity: 'legendary',
    requirement: { type: 'themes_unlocked', value: 20 }
  },
  ACHIEVEMENT_HUNTER: {
    id: 'achievement_hunter',
    name: 'Achievement Hunter',
    description: 'Unlock 50 achievements',
    icon: '🏹',
    points: 1000,
    rarity: 'legendary',
    requirement: { type: 'achievements_unlocked', value: 50 }
  },
  COMPLETIONIST: {
    id: 'completionist',
    name: 'Completionist',
    description: 'Unlock 75 achievements',
    icon: '📜',
    points: 2500,
    rarity: 'mythic',
    requirement: { type: 'achievements_unlocked', value: 75 }
  },
  ULTIMATE_MASTER: {
    id: 'ultimate_master',
    name: 'Ultimate Master',
    description: 'Unlock all achievements',
    icon: '👑',
    points: 5000,
    rarity: 'mythic',
    requirement: { type: 'achievements_unlocked', value: 100 }
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
    requirement: { type: 'total_wins', value: 30 }
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
  },
  CYBERPUNK: {
    id: 'cyberpunk',
    name: 'Cyberpunk Nights',
    colors: {
      primary: '#e879f9',
      secondary: '#fbbf24',
      background: '#1e1b4b',
      surface: '#312e81',
      accent: '#4338ca'
    },
    unlocked: false,
    requirement: { type: 'total_wins', value: 75 }
  },
  CORAL: {
    id: 'coral',
    name: 'Coral Reef',
    colors: {
      primary: '#fb7185',
      secondary: '#fbbf24',
      background: '#7c2d12',
      surface: '#9a3412',
      accent: '#c2410c'
    },
    unlocked: false,
    requirement: { type: 'achievements', value: 15 }
  },
  VAMPIRE: {
    id: 'vampire',
    name: 'Vampire Gothic',
    colors: {
      primary: '#dc2626',
      secondary: '#7c2d12',
      background: '#0f172a',
      surface: '#1e293b',
      accent: '#334155'
    },
    unlocked: false,
    requirement: { type: 'win_streak', value: 15 }
  },
  EMERALD: {
    id: 'emerald',
    name: 'Emerald Forest',
    colors: {
      primary: '#10b981',
      secondary: '#34d399',
      background: '#064e3b',
      surface: '#065f46',
      accent: '#047857'
    },
    unlocked: false,
    requirement: { type: 'powerups_used', value: 300 }
  },
  GALAXY: {
    id: 'galaxy',
    name: 'Galaxy Quest',
    colors: {
      primary: '#a855f7',
      secondary: '#ec4899',
      background: '#1e1b4b',
      surface: '#312e81',
      accent: '#4338ca'
    },
    unlocked: false,
    requirement: { type: 'session_wins', value: 25 }
  },
  LAVA: {
    id: 'lava',
    name: 'Molten Lava',
    colors: {
      primary: '#f97316',
      secondary: '#dc2626',
      background: '#7f1d1d',
      surface: '#991b1b',
      accent: '#b91c1c'
    },
    unlocked: false,
    requirement: { type: 'ai_hard_wins', value: 20 }
  },
  ELECTRIC: {
    id: 'electric',
    name: 'Electric Storm',
    colors: {
      primary: '#3b82f6',
      secondary: '#06b6d4',
      background: '#0c4a6e',
      surface: '#075985',
      accent: '#0369a1'
    },
    unlocked: false,
    requirement: { type: 'total_games', value: 200 }
  },
  POISON: {
    id: 'poison',
    name: 'Toxic Waste',
    colors: {
      primary: '#84cc16',
      secondary: '#65a30d',
      background: '#1a2e05',
      surface: '#365314',
      accent: '#4d7c0f'
    },
    unlocked: false,
    requirement: { type: 'ai_easy_wins', value: 50 }
  },
  ROYAL: {
    id: 'royal',
    name: 'Royal Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a78bfa',
      background: '#581c87',
      surface: '#6b21a8',
      accent: '#7c3aed'
    },
    unlocked: false,
    requirement: { type: 'achievements', value: 20 }
  },
  SNOW: {
    id: 'snow',
    name: 'Arctic Snow',
    colors: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
      background: '#1e293b',
      surface: '#334155',
      accent: '#475569'
    },
    unlocked: false,
    requirement: { type: 'total_draws', value: 25 }
  },
  CHERRY: {
    id: 'cherry',
    name: 'Cherry Blossom',
    colors: {
      primary: '#f472b6',
      secondary: '#fb7185',
      background: '#881337',
      surface: '#9f1239',
      accent: '#be185d'
    },
    unlocked: false,
    requirement: { type: 'win_streak', value: 8 }
  },
  STEEL: {
    id: 'steel',
    name: 'Steel Industry',
    colors: {
      primary: '#64748b',
      secondary: '#94a3b8',
      background: '#0f172a',
      surface: '#1e293b',
      accent: '#334155'
    },
    unlocked: false,
    requirement: { type: 'total_losses', value: 100 }
  },
  RAINBOW: {
    id: 'rainbow',
    name: 'Rainbow Dreams',
    colors: {
      primary: '#ec4899',
      secondary: '#8b5cf6',
      background: '#1e1b4b',
      surface: '#312e81',
      accent: '#4338ca'
    },
    unlocked: false,
    requirement: { type: 'achievements', value: 25 }
  },
  BRONZE: {
    id: 'bronze',
    name: 'Ancient Bronze',
    colors: {
      primary: '#ca8a04',
      secondary: '#eab308',
      background: '#713f12',
      surface: '#854d0e',
      accent: '#a16207'
    },
    unlocked: false,
    requirement: { type: 'total_wins', value: 25 }
  },
  SILVER: {
    id: 'silver',
    name: 'Sterling Silver',
    colors: {
      primary: '#94a3b8',
      secondary: '#cbd5e1',
      background: '#1e293b',
      surface: '#334155',
      accent: '#475569'
    },
    unlocked: false,
    requirement: { type: 'total_wins', value: 100 }
  },
  CRYSTAL: {
    id: 'crystal',
    name: 'Crystal Cave',
    colors: {
      primary: '#06b6d4',
      secondary: '#67e8f9',
      background: '#083344',
      surface: '#0e7490',
      accent: '#155e75'
    },
    unlocked: false,
    requirement: { type: 'powerups_used', value: 500 }
  },
  FOREST: {
    id: 'forest',
    name: 'Deep Forest',
    colors: {
      primary: '#16a34a',
      secondary: '#22c55e',
      background: '#14532d',
      surface: '#166534',
      accent: '#15803d'
    },
    unlocked: false,
    requirement: { type: 'session_wins', value: 10 }
  },
  DESERT: {
    id: 'desert',
    name: 'Desert Mirage',
    colors: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      background: '#78350f',
      surface: '#92400e',
      accent: '#a16207'
    },
    unlocked: false,
    requirement: { type: 'ai_medium_wins', value: 30 }
  },
  COSMIC: {
    id: 'cosmic',
    name: 'Cosmic Dust',
    colors: {
      primary: '#d946ef',
      secondary: '#c084fc',
      background: '#581c87',
      surface: '#6b21a8',
      accent: '#7c3aed'
    },
    unlocked: false,
    requirement: { type: 'achievements', value: 30 }
  },
  PHOENIX: {
    id: 'phoenix',
    name: 'Phoenix Fire',
    colors: {
      primary: '#f97316',
      secondary: '#fb923c',
      background: '#9a3412',
      surface: '#c2410c',
      accent: '#ea580c'
    },
    unlocked: false,
    requirement: { type: 'ai_nightmare_wins', value: 3 }
  },
  MYSTIC: {
    id: 'mystic',
    name: 'Mystic Portal',
    colors: {
      primary: '#8b5cf6',
      secondary: '#06b6d4',
      background: '#1e1b4b',
      surface: '#312e81',
      accent: '#4338ca'
    },
    unlocked: false,
    requirement: { type: 'total_wins', value: 150 }
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
