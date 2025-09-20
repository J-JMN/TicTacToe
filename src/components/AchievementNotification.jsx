'use client';

import { useState, useEffect } from 'react';

const AchievementNotification = ({ 
  achievements = [], 
  onClose, 
  currentTheme,
  playSound 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (achievements.length > 0) {
      setIsVisible(true);
      setIsAnimating(true);
      
      // Play achievement sound
      if (playSound) {
        playSound('win');
      }

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [achievements, playSound]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, 300);
  };

  const nextAchievement = () => {
    if (currentIndex < achievements.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleClose();
    }
  };

  const prevAchievement = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!isVisible || achievements.length === 0) {
    return null;
  }

  const achievement = achievements[currentIndex];
  const rarityColors = {
    common: '#10b981',
    rare: '#3b82f6', 
    epic: '#8b5cf6',
    legendary: '#f59e0b'
  };

  return (
    <div className="achievement-overlay">
      <div className={`achievement-notification ${isAnimating ? 'animate-in' : 'animate-out'}`}>
        {/* Particle Effects */}
        <div className="achievement-particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                '--delay': `${i * 0.1}s`,
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                '--color': rarityColors[achievement.rarity] || currentTheme?.colors?.primary || '#6366f1'
              }}
            />
          ))}
        </div>

        {/* Achievement Content */}
        <div className="achievement-content">
          <div className="achievement-header">
            <div className="achievement-badge">
              <div 
                className={`badge-ring ${achievement.rarity}`}
                style={{
                  '--rarity-color': rarityColors[achievement.rarity] || currentTheme?.colors?.primary || '#6366f1'
                }}
              >
                <div className="badge-inner">
                  <div className="achievement-icon-large">
                    {achievement.icon}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="achievement-text">
              <div className="achievement-unlock">🏆 Achievement Unlocked!</div>
              <h3 className="achievement-title">{achievement.name}</h3>
              <p className="achievement-description">{achievement.description}</p>
              <div className="achievement-meta">
                <span 
                  className={`rarity-badge ${achievement.rarity}`}
                  style={{
                    background: rarityColors[achievement.rarity] || currentTheme?.colors?.primary || '#6366f1'
                  }}
                >
                  {achievement.rarity.toUpperCase()}
                </span>
                <span className="points-badge">+{achievement.points} pts</span>
              </div>
            </div>
          </div>

          {/* Navigation for multiple achievements */}
          {achievements.length > 1 && (
            <div className="achievement-navigation">
              <button 
                onClick={prevAchievement} 
                disabled={currentIndex === 0}
                className="nav-btn prev"
              >
                ←
              </button>
              <div className="achievement-counter">
                {currentIndex + 1} of {achievements.length}
              </div>
              <button 
                onClick={nextAchievement}
                className="nav-btn next"
              >
                {currentIndex < achievements.length - 1 ? '→' : '✓'}
              </button>
            </div>
          )}

          {/* Progress Ring Animation */}
          <div className="progress-ring">
            <svg width="60" height="60">
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="2"
              />
              <circle
                cx="30"
                cy="30"
                r="25"
                fill="none"
                stroke={rarityColors[achievement.rarity] || currentTheme?.colors?.primary || '#6366f1'}
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 25}`}
                strokeDashoffset={`${2 * Math.PI * 25 * 0.2}`}
                strokeLinecap="round"
                className="progress-circle"
              />
            </svg>
            <div className="progress-percentage">100%</div>
          </div>
        </div>

        {/* Close Button */}
        <button onClick={handleClose} className="achievement-close">
          ✕
        </button>
      </div>
    </div>
  );
};

export default AchievementNotification;
