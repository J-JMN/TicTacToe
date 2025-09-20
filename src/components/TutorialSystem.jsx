'use client';

import { useState, useCallback } from 'react';
import { GAME_MODES } from '../lib/gameTypes.js';

const TutorialSystem = ({ 
  isOpen, 
  onClose, 
  currentTheme, 
  gameMode = GAME_MODES.TICTACTOE, 
  onStartTutorial,
  playSound,
  soundEnabled = true 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  // Tutorial content for Tic Tac Toe mode
  const tutorialSteps = {
    [GAME_MODES.TICTACTOE]: [
      {
        title: "Welcome to Tic Tac Toe!",
        description: "The ultimate Tic Tac Toe experience with power-ups and stunning visuals.",
        image: "🎯",
        details: [
          "Traditional 3x3 grid with enhanced graphics",
          "Strategic power-ups for competitive advantage",
          "Beautiful particle effects and animations",
          "Multiple themes and customization options"
        ]
      },
      {
        title: "Basic Gameplay",
        description: "Master the fundamentals of enhanced Tic Tac Toe.",
        image: "🎮",
        details: [
          "Get 3 in a row horizontally, vertically, or diagonally",
          "Play against AI or local multiplayer",
          "Choose your difficulty: Easy, Medium, Hard, or Nightmare",
          "Customize symbols and themes to your liking"
        ]
      },
      {
        title: "Power-up System",
        description: "Use strategic abilities to gain the upper hand.",
        image: "⚡",
        details: [
          "Freeze: Skip opponent's next turn",
          "Double Move: Make two moves in one turn",
          "Steal: Take over an opponent's cell",
          "Bomb: Clear a cell and surrounding area",
          "Shield: Protect cells from being stolen"
        ]
      },
      {
        title: "Pro Tips",
        description: "Advanced strategies for dominating the game.",
        image: "🧠",
        details: [
          "Control the center cell for maximum opportunities",
          "Block opponent's winning moves",
          "Save powerful abilities for crucial moments",
          "Watch for opponent's power-up usage patterns"
        ]
      }
    ]
  };

  const currentSteps = tutorialSteps[gameMode] || [];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, currentSteps.length - 1));
    if (soundEnabled && playSound) playSound('click');
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    if (soundEnabled && playSound) playSound('click');
  };

  const startInteractiveTutorial = useCallback(() => {
    if (soundEnabled && playSound) playSound('click');
    if (onStartTutorial) {
      onStartTutorial(gameMode);
    }
  }, [onStartTutorial, gameMode, soundEnabled, playSound]);

  const renderStepByStep = () => {
    const step = currentSteps[currentStep];
    if (!step) return null;

    return (
      <div className="step-by-step">
        <div className="step-header">
          <div className="step-image">{step.image}</div>
          <div className="step-info">
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        </div>
        <div className="step-details">
          <ul>
            {step.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
        <div className="step-navigation">
          <button 
            onClick={handlePrev} 
            disabled={currentStep === 0}
            className="nav-btn prev"
          >
            ← Previous
          </button>
          <span className="step-counter">
            {currentStep + 1} of {currentSteps.length}
          </span>
          <button 
            onClick={handleNext} 
            disabled={currentStep === currentSteps.length - 1}
            className="nav-btn next"
          >
            Next →
          </button>
        </div>
        
        {/* Show Start Interactive Tutorial button on last step */}
        {currentStep === currentSteps.length - 1 && (
          <div className="tutorial-start-section">
            <button 
              onClick={startInteractiveTutorial}
              className="interactive-tutorial-btn inline"
            >
              🎮 Start Interactive Tutorial
            </button>
            <p className="tutorial-tip">
              💡 Tip: The interactive tutorial will guide you through a real game with step-by-step instructions!
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderPowerUpsGuide = () => (
    <div className="powerups-guide">
      <h3>🔥 Power-ups Guide</h3>
      <div className="powerup-list">
        <div className="powerup-item">
          <div className="powerup-icon">🧊</div>
          <div className="powerup-info">
            <h4>Freeze</h4>
            <p>Skip your opponent's next turn. Perfect for maintaining momentum!</p>
          </div>
        </div>
        <div className="powerup-item">
          <div className="powerup-icon">⚡</div>
          <div className="powerup-info">
            <h4>Double Move</h4>
            <p>Make two moves in a single turn. Great for setting up winning combinations!</p>
          </div>
        </div>
        <div className="powerup-item">
          <div className="powerup-icon">🎯</div>
          <div className="powerup-info">
            <h4>Steal</h4>
            <p>Take over an opponent's cell. Use strategically to block their wins!</p>
          </div>
        </div>
        <div className="powerup-item">
          <div className="powerup-icon">💣</div>
          <div className="powerup-info">
            <h4>Bomb</h4>
            <p>Clear a cell and surrounding area. Powerful for disrupting opponent plans!</p>
          </div>
        </div>
        <div className="powerup-item">
          <div className="powerup-icon">🛡️</div>
          <div className="powerup-info">
            <h4>Shield</h4>
            <p>Protect your cells from being stolen. Essential for securing victories!</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGameRules = () => (
    <div className="game-rules">
      <h3>📋 Game Rules</h3>
      <div className="rules-section">
        <h4>🎯 Objective</h4>
        <p>Be the first to get 3 of your symbols in a row (horizontally, vertically, or diagonally).</p>
      </div>
      <div className="rules-section">
        <h4>🎮 Gameplay</h4>
        <ul>
          <li>Players take turns placing their symbols (X or O)</li>
          <li>Click on empty cells to make your move</li>
          <li>Use power-ups strategically to gain advantage</li>
          <li>Game ends when someone gets 3 in a row or board is full</li>
        </ul>
      </div>
      <div className="rules-section">
        <h4>⚡ Power-ups</h4>
        <ul>
          <li>Each player gets power-ups during the game</li>
          <li>Power-ups have cooldown periods after use</li>
          <li>Use them wisely - timing is everything!</li>
          <li>Some power-ups can be countered by others</li>
        </ul>
      </div>
    </div>
  );

  const renderQuickReference = () => (
    <div className="quick-reference">
      <h3>🔍 Quick Reference</h3>
      <div className="reference-grid">
        <div className="reference-item">
          <h4>🎯 Win Conditions</h4>
          <p>3 symbols in any row, column, or diagonal</p>
        </div>
        <div className="reference-item">
          <h4>⚡ Power-up Cooldowns</h4>
          <p>Each ability has a 6 second cooldown</p>
        </div>
        <div className="reference-item">
          <h4>🤖 AI Difficulties</h4>
          <p>Easy → Medium → Hard → Nightmare</p>
        </div>
        <div className="reference-item">
          <h4>🎨 Customization</h4>
          <p>Themes, symbols, and visual effects</p>
        </div>
        <div className="reference-item">
          <h4>📊 Statistics</h4>
          <p>Track your wins, achievements, and progress</p>
        </div>
        <div className="reference-item">
          <h4>🎵 Audio</h4>
          <p>Dynamic sound effects and feedback</p>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  const isLastStep = currentStep === currentSteps.length - 1;
  const showFooterOnOverview = activeTab === 'overview' && isLastStep;
  
  return (
    <div className="tutorial-overlay">
      <div className={`tutorial-system ${activeTab === 'reference' ? 'show-tutorial-footer' : ''} ${showFooterOnOverview ? 'show-last-step-button' : ''}`}>
        <div className="tutorial-header">
          <h2>📖 Game Tutorial & Guide</h2>
          <button onClick={onClose} className="close-btn">×</button>
        </div>

        <div className="tutorial-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📖 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'powerups' ? 'active' : ''}`}
            onClick={() => setActiveTab('powerups')}
          >
            ⚡ Power-ups
          </button>
          <button
            className={`tab-btn ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            📋 Rules
          </button>
          <button
            className={`tab-btn ${activeTab === 'reference' ? 'active' : ''}`}
            onClick={() => setActiveTab('reference')}
          >
            🔍 Quick Reference
          </button>
        </div>

        <div className="tutorial-content">
          {activeTab === 'overview' && renderStepByStep()}
          {activeTab === 'powerups' && renderPowerUpsGuide()}
          {activeTab === 'rules' && renderGameRules()}
          {activeTab === 'reference' && renderQuickReference()}
        </div>

        <div className="tutorial-footer">
          <button 
            onClick={startInteractiveTutorial}
            className="interactive-tutorial-btn"
          >
            🎮 Start Interactive Tutorial
          </button>
          <p className="tutorial-tip">
            💡 Tip: The interactive tutorial will guide you through a real game with step-by-step instructions!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TutorialSystem;