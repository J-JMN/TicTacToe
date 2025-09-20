'use client';

import { useState, useEffect } from 'react';
import { GAME_MODES } from '../lib/gameTypes.js';

const WelcomeModal = ({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onStartTutorial,
  onQuickStart,
  playSound,
  soundEnabled = true 
}) => {
  const [selectedMode, setSelectedMode] = useState(GAME_MODES.CLASSIC_2D);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const handleStartTutorial = () => {
    if (soundEnabled && playSound) playSound('click');
    if (onStartTutorial) {
      onStartTutorial(selectedMode);
    }
    onClose();
  };

  const handleQuickStart = () => {
    if (soundEnabled && playSound) playSound('click');
    if (onQuickStart) {
      onQuickStart(selectedMode);
    }
    onClose();
  };

  const handleSkip = () => {
    if (soundEnabled && playSound) playSound('click');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        <div className="welcome-modal-content">
          <div className="welcome-hero">
            <div className="hero-icon">🎮</div>
            <h1>Welcome to 2D Tic Tac Toe</h1>
            <h2>Ultimate Edition</h2>
            <p className="hero-description">
              Experience the classic game like never before with stunning 3D visuals, 
              strategic power-ups, and comprehensive progression systems!
            </p>
          </div>

          <div className="welcome-features">
            <div className="feature-highlights">
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <strong>Power-ups & Abilities</strong>
                  <p>Strategic abilities that change the game</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">🌟</div>
                <div className="feature-text">
                  <strong>Stunning 2D Visuals</strong>
                  <p>Immersive graphics with particle effects</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">🏆</div>
                <div className="feature-text">
                  <strong>Achievements System</strong>
                  <p>Unlock themes and track your progress</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <div className="feature-text">
                  <p>Spectacular 2D with floating boards and particle effects</p>
                </div>
              </div>
            </div>
          </div>

          <div className="welcome-mode-selection">
            <h3>🎯 Spectacular 2D Experience</h3>
            <div className="mode-selection-grid">
              <div className="mode-select-card selected spectacular-mode">
                <div className="mode-select-icon">🎮</div>
                <h4>Spectacular 2D</h4>
                <p>Enhanced with stunning visual effects</p>
                <div className="difficulty-indicator spectacular">Ultimate Experience</div>
                <div className="feature-list">
                  <span>✨ Floating game board</span>
                  <span>🌈 Dynamic animations</span>
                  <span>⚡ Power-up effects</span>
                  <span>🎨 Beautiful particles</span>
                </div>
              </div>
            </div>
          </div>

          <div className="welcome-actions">
            <div className="primary-actions">
              <button 
                onClick={handleStartTutorial}
                className="welcome-btn primary"
              >
                📚 Start Tutorial
                <span className="btn-subtitle">Learn with step-by-step guidance</span>
              </button>
              
              <button 
                onClick={handleQuickStart}
                className="welcome-btn secondary"
              >
                🚀 Quick Start
                <span className="btn-subtitle">Jump right into the game</span>
              </button>
            </div>
            
            <button 
              onClick={handleSkip}
              className="skip-btn"
            >
              Skip Introduction
            </button>
          </div>

          <div className="welcome-tips">
            <div className="tip-item">
              <span className="tip-icon">💡</span>
              <span>Use power-ups strategically to gain advantages</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🎯</span>
              <span>Control the center position for better winning chances</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🏆</span>
              <span>Complete achievements to unlock new themes</span>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="welcome-background">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
