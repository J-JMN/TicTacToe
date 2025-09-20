'use client';

import { useState, useEffect, useMemo } from 'react';
import { statsManager } from '../lib/statsManager.js';
import { THEMES, ACHIEVEMENTS } from '../lib/gameTypes.js';

const StatsDashboard = ({ isOpen, onClose, currentTheme }) => {
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [animatedStats, setAnimatedStats] = useState({});

  useEffect(() => {
    if (isOpen) {
      const currentStats = statsManager.getStats();
      const currentAchievements = statsManager.getAchievements();
      setStats(currentStats);
      setAchievements(currentAchievements);

      // Animate numbers
      animateNumbers(currentStats);
    }
  }, [isOpen]);

  const animateNumbers = (targetStats) => {
    const startValues = {
      totalGames: 0,
      totalWins: 0,
      winRate: 0,
      totalPowerUpsUsed: 0,
      longestStreak: 0
    };

    const duration = 2000; // 2 seconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const animated = {
        totalGames: Math.floor(targetStats.totalGames * easeOutQuart),
        totalWins: Math.floor(targetStats.totalWins * easeOutQuart),
        winRate: (targetStats.winRate * easeOutQuart).toFixed(1),
        totalPowerUpsUsed: Math.floor(targetStats.totalPowerUpsUsed * easeOutQuart),
        longestStreak: Math.floor(targetStats.streaks.longest * easeOutQuart)
      };

      setAnimatedStats(animated);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const heatMapData = useMemo(() => {
    if (!stats) return [];
    
    const max = Math.max(...stats.favoritePositions);
    return stats.favoritePositions.map((count, index) => ({
      position: index,
      count,
      intensity: max > 0 ? (count / max) * 100 : 0,
      row: Math.floor(index / 3),
      col: index % 3
    }));
  }, [stats]);

  const achievementProgress = useMemo(() => {
    if (!stats) return [];

    return Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
      const isUnlocked = achievements[key] ? true : false;
      let progress = 0;
      let current = 0;
      let target = 0;

      if (!isUnlocked && achievement.requirement) {
        switch (achievement.requirement.type) {
          case 'streak':
            current = stats.streaks.longest;
            target = achievement.requirement.value;
            break;
          case 'time':
            current = stats.averageTimePerGame > 0 && stats.averageTimePerGame <= achievement.requirement.value * 1000 ? 1 : 0;
            target = 1;
            break;
          case 'powerups_used':
            current = stats.totalPowerUpsUsed;
            target = achievement.requirement.value;
            break;
          case '3d_wins':
            current = (stats.gamesByMode.classic_3d?.won || 0) + (stats.gamesByMode.multi_level_3d?.won || 0);
            target = achievement.requirement.value;
            break;
          case 'ai_hard_wins':
            current = stats.gamesByDifficulty.hard?.won || 0;
            target = achievement.requirement.value;
            break;
          case 'all_powerups_used':
            current = Object.values(stats.powerUpsUsed).filter(count => count > 0).length;
            target = Object.keys(stats.powerUpsUsed).length;
            break;
        }
        progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;
      } else if (isUnlocked) {
        progress = 100;
      }

      return {
        ...achievement,
        isUnlocked,
        progress,
        current,
        target
      };
    });
  }, [stats, achievements]);

  if (!isOpen || !stats) return null;

  const renderOverview = () => (
    <div className="stats-tab-content overview">
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">🎮</div>
          <div className="stat-info">
            <div className="stat-value">{animatedStats.totalGames || 0}</div>
            <div className="stat-label">Total Games</div>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-value">{animatedStats.totalWins || 0}</div>
            <div className="stat-label">Wins</div>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{animatedStats.winRate || 0}%</div>
            <div className="stat-label">Win Rate</div>
          </div>
        </div>

        <div className="stat-card accent">
          <div className="stat-icon">⚡</div>
          <div className="stat-info">
            <div className="stat-value">{animatedStats.totalPowerUpsUsed || 0}</div>
            <div className="stat-label">Power-ups Used</div>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">🔥</div>
          <div className="stat-info">
            <div className="stat-value">{animatedStats.longestStreak || 0}</div>
            <div className="stat-label">Longest Streak</div>
          </div>
        </div>

        <div className="stat-card neutral">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <div className="stat-value">{(stats.averageTimePerGame / 1000).toFixed(1)}s</div>
            <div className="stat-label">Avg Game Time</div>
          </div>
        </div>
      </div>

      {/* Session Summary */}
      <div className="session-summary">
        <h3>Current Session</h3>
        <div className="session-stats">
          <div className="session-stat">
            <span className="label">Games Played:</span>
            <span className="value">{stats.sessionStats.gamesPlayed}</span>
          </div>
          <div className="session-stat">
            <span className="label">Session Wins:</span>
            <span className="value">{stats.sessionStats.wins}</span>
          </div>
          <div className="session-stat">
            <span className="label">Session Rate:</span>
            <span className="value">
              {stats.sessionStats.gamesPlayed > 0 
                ? ((stats.sessionStats.wins / stats.sessionStats.gamesPlayed) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGameModes = () => (
    <div className="stats-tab-content game-modes">
      <h3>Performance by Game Mode</h3>
      <div className="mode-stats">
        {Object.entries(stats.gamesByMode).map(([mode, data]) => (
          <div key={mode} className="mode-card">
            <div className="mode-header">
              <div className="mode-icon">
                {mode === 'classic_2d' ? '🎯' : 
                 mode === 'classic_3d' ? '🎮' : '🌌'}
              </div>
              <div className="mode-name">
                {mode.replace('_', ' ').toUpperCase()}
              </div>
            </div>
            <div className="mode-data">
              <div className="mode-stat">
                <span>Played:</span>
                <span>{data.played}</span>
              </div>
              <div className="mode-stat">
                <span>Won:</span>
                <span>{data.won}</span>
              </div>
              <div className="mode-stat">
                <span>Rate:</span>
                <span>
                  {data.played > 0 ? ((data.won / data.played) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
            <div className="mode-progress">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${data.played > 0 ? (data.won / data.played) * 100 : 0}%`,
                  background: currentTheme?.colors?.primary || '#6366f1'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <h3>Performance by Difficulty</h3>
      <div className="difficulty-stats">
        {Object.entries(stats.gamesByDifficulty).map(([difficulty, data]) => (
          <div key={difficulty} className="difficulty-card">
            <div className="difficulty-header">
              <div className="difficulty-name">{difficulty.toUpperCase()}</div>
              <div className="difficulty-rate">
                {data.played > 0 ? ((data.won / data.played) * 100).toFixed(1) : 0}% Win Rate
              </div>
            </div>
            <div className="difficulty-bar">
              <div 
                className="bar-fill"
                style={{
                  width: `${data.played > 0 ? (data.won / data.played) * 100 : 0}%`,
                  background: `linear-gradient(90deg, ${currentTheme?.colors?.primary || '#6366f1'}, ${currentTheme?.colors?.secondary || '#8b5cf6'})`
                }}
              />
            </div>
            <div className="difficulty-numbers">
              <span>{data.won}/{data.played}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHeatMap = () => (
    <div className="stats-tab-content heat-map">
      <h3>Position Heat Map</h3>
      <p>Shows your most played positions</p>
      
      <div className="heat-map-board">
        {heatMapData.map(cell => (
          <div 
            key={cell.position}
            className="heat-map-cell"
            style={{
              background: `rgba(${currentTheme?.colors?.primary ? 
                hexToRgb(currentTheme.colors.primary).join(',') : 
                '99,102,241'}, ${cell.intensity / 100})`,
              border: `2px solid ${currentTheme?.colors?.surface || '#334155'}`
            }}
          >
            <div className="cell-count">{cell.count}</div>
            <div className="cell-intensity">{cell.intensity.toFixed(0)}%</div>
          </div>
        ))}
      </div>

      <div className="heat-map-legend">
        <div className="legend-item">
          <div className="legend-color low"></div>
          <span>Low</span>
        </div>
        <div className="legend-item">
          <div className="legend-color high" style={{
            background: currentTheme?.colors?.primary || '#6366f1'
          }}></div>
          <span>High</span>
        </div>
      </div>

      <div className="power-ups-usage">
        <h3>Power-ups Usage</h3>
        <div className="powerup-stats">
          {Object.entries(stats.powerUpsUsed).map(([powerUp, count]) => (
            <div key={powerUp} className="powerup-stat">
              <div className="powerup-name">{powerUp.replace('_', ' ').toUpperCase()}</div>
              <div className="powerup-count">{count}</div>
              <div className="powerup-bar">
                <div 
                  className="powerup-fill"
                  style={{
                    width: `${stats.totalPowerUpsUsed > 0 ? (count / stats.totalPowerUpsUsed) * 100 : 0}%`,
                    background: currentTheme?.colors?.accent || '#f43f5e'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="stats-tab-content achievements">
      <div className="achievements-summary">
        <div className="achievement-progress-ring">
          <svg width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={currentTheme?.colors?.surface || '#334155'}
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={currentTheme?.colors?.primary || '#6366f1'}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - (stats.achievements.unlocked / Object.keys(ACHIEVEMENTS).length))}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="progress-text">
            <div className="progress-number">{stats.achievements.unlocked}</div>
            <div className="progress-total">/{Object.keys(ACHIEVEMENTS).length}</div>
          </div>
        </div>
        <div className="achievements-info">
          <h3>Achievements</h3>
          <p>{stats.achievements.unlocked} of {Object.keys(ACHIEVEMENTS).length} unlocked</p>
          <p className="total-points">{stats.achievements.totalPoints} points earned</p>
        </div>
      </div>

      <div className="achievements-list">
        {achievementProgress.map(achievement => (
          <div 
            key={achievement.id}
            className={`achievement-card ${achievement.isUnlocked ? 'unlocked' : 'locked'} ${achievement.rarity}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-content">
              <div className="achievement-header">
                <h4>{achievement.name}</h4>
                <div className="achievement-points">{achievement.points} pts</div>
              </div>
              <p>{achievement.description}</p>
              {!achievement.isUnlocked && achievement.target > 0 && (
                <div className="achievement-progress">
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${achievement.progress}%`,
                        background: currentTheme?.colors?.primary || '#6366f1'
                      }}
                    />
                  </div>
                  <div className="progress-text">
                    {achievement.current}/{achievement.target}
                  </div>
                </div>
              )}
              {achievement.isUnlocked && achievements[achievement.id] && (
                <div className="unlocked-date">
                  Unlocked: {new Date(achievements[achievement.id].unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [99, 102, 241];
  };

  return (
    <div className="stats-dashboard-overlay">
      <div className="stats-dashboard">
        <div className="stats-header">
          <h2>📊 Statistics Dashboard</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="stats-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'modes' ? 'active' : ''}`}
            onClick={() => setActiveTab('modes')}
          >
            Game Modes
          </button>
          <button 
            className={`tab ${activeTab === 'heatmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('heatmap')}
          >
            Heat Map
          </button>
          <button 
            className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            Achievements
          </button>
        </div>

        <div className="stats-content">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'modes' && renderGameModes()}
          {activeTab === 'heatmap' && renderHeatMap()}
          {activeTab === 'achievements' && renderAchievements()}
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;
