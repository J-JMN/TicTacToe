'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GAME_MODES, THEMES, DIFFICULTY_LEVELS } from '../lib/gameTypes.js';
import { statsManager } from '../lib/statsManager.js';
import { createParticleSystem } from '../lib/particleSystem.js';
import { preloadSounds, playSound } from '../app/sounds.js';

import Game2D from './Game2D.jsx';
import StatsDashboard from './StatsDashboard.jsx';
import AchievementNotification from './AchievementNotification.jsx';
import CustomizationPanel from './CustomizationPanel.jsx';
import TutorialSystem from './TutorialSystem.jsx';
import WelcomeModal from './WelcomeModal.jsx';
import InteractiveTutorial from './InteractiveTutorial.jsx';

const TicTacToeEnhanced = () => {
  // Game state
  const [gameMode, setGameMode] = useState(GAME_MODES.TICTACTOE);
  const [currentTheme, setCurrentTheme] = useState(THEMES.NEON);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAgainstAI, setIsAgainstAI] = useState(true);
  
  // UI state
  const [showStats, setShowStats] = useState(false);
  const [showCustomization, setShowCustomization] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  const [currentSymbols, setCurrentSymbols] = useState({ X: 'X', O: 'O' });
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [interactiveTutorialMode, setInteractiveTutorialMode] = useState(false);
  
  // Game stats
  const [gameStats, setGameStats] = useState(null);
  const [sessionStats, setSessionStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    startTime: Date.now()
  });

  // Refs
  const gameContainerRef = useRef(null);
  const particleSystemRef = useRef(null);

  // Handle welcome modal for first-time users
  const handleWelcomeQuickStart = useCallback((selectedMode) => {
    setGameMode(selectedMode);
    localStorage.setItem('tic_tac_toe_welcomed', 'true');
  }, []);

  const handleWelcomeStartTutorial = useCallback((selectedMode) => {
    setGameMode(selectedMode);
    setShowTutorial(true);
    localStorage.setItem('tic_tac_toe_welcomed', 'true');
  }, []);

  // Initialize particle system
  useEffect(() => {
    if (gameContainerRef.current) {
      particleSystemRef.current = createParticleSystem(gameContainerRef.current, currentTheme);
    }

    // Preload sounds
    preloadSounds().catch(console.error);

    // Load initial stats
    setGameStats(statsManager.getStats());

    // Check if first-time user
    const hasBeenWelcomed = localStorage.getItem('tic_tac_toe_welcomed');
    if (!hasBeenWelcomed) {
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        setShowWelcomeModal(true);
      }, 500);
    }
    
    // For testing - uncomment the line below to always show welcome modal
    // setTimeout(() => setShowWelcomeModal(true), 500);

    // Cleanup
    return () => {
      if (particleSystemRef.current) {
        particleSystemRef.current.destroy();
      }
    };
  }, []);

  // Update particle system theme
  useEffect(() => {
    if (particleSystemRef.current) {
      particleSystemRef.current.theme = currentTheme;
    }
  }, [currentTheme]);

  // Handle game end
  const handleGameEnd = useCallback((result) => {
    // Update stats
    const statsResult = statsManager.recordGame(result);
    setGameStats(statsResult.stats);
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      wins: prev.wins + (result.isPlayerWin ? 1 : 0)
    }));

    // Show new achievements
    if (statsResult.newAchievements.length > 0) {
      setNewAchievements(statsResult.newAchievements);
    }

    // Trigger victory particles
    if (particleSystemRef.current && result.winner) {
      if (result.isPlayerWin) {
        particleSystemRef.current.createParticles('victory', {
          x: gameContainerRef.current?.clientWidth / 2,
          y: gameContainerRef.current?.clientHeight / 2,
          count: 50,
          color: currentTheme.colors.primary
        });
      }
    }

  }, [currentTheme]);

  // Handle theme change
  const handleThemeChange = useCallback((theme) => {
    setCurrentTheme(theme);
    
    // Apply theme to document
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    if (soundEnabled) {
      playSound('click');
    }
  }, [soundEnabled]);

  // Handle symbol change
  const handleSymbolChange = useCallback((symbols) => {
    setCurrentSymbols(symbols);
    if (soundEnabled) {
      playSound('click');
    }
  }, [soundEnabled]);

  // Get game mode display name
  const getGameModeDisplayName = (mode) => {
    return 'Tic Tac Toe';
  };

  // Handle tutorial start
  const handleStartTutorial = useCallback((tutorialGameMode) => {
    setShowTutorial(false); // Close tutorial overview
    setInteractiveTutorialMode(true);
    if (tutorialGameMode) {
      setGameMode(tutorialGameMode);
    }
  }, []);

  // Handle tutorial completion
  const handleTutorialComplete = useCallback(() => {
    setInteractiveTutorialMode(false);
    
    // Record tutorial completion and check for achievements
    const tutorialAchievements = statsManager.recordTutorialCompletion();
    if (tutorialAchievements.length > 0) {
      setNewAchievements(tutorialAchievements);
    }
  }, []);

  // Game state for tutorial synchronization
  const [gameStateForTutorial, setGameStateForTutorial] = useState({
    board: null,
    isXNext: true,
    winner: null,
    moveCount: 0,
    gameOver: false
  });

  // Debug game state updates
  useEffect(() => {
    if (interactiveTutorialMode) {
      console.log('Tutorial game state updated:', gameStateForTutorial);
    }
  }, [gameStateForTutorial, interactiveTutorialMode]);

  // Render game - 2D only
  const renderGame = () => {
    const gameProps = {
      onGameEnd: handleGameEnd,
      onStatsUpdate: setGameStats,
      currentTheme: currentTheme,
      soundEnabled: soundEnabled,
      playSound: soundEnabled ? playSound : undefined,
      currentSymbols: currentSymbols,
      isAgainstAI: isAgainstAI,
      difficulty: difficulty,
      interactiveTutorialMode: interactiveTutorialMode,
      onTutorialComplete: handleTutorialComplete,
      onGameStateChange: setGameStateForTutorial // For tutorial synchronization
    };

    return <Game2D {...gameProps} />;
  };

  return (
    <div className="tic-tac-toe-enhanced" ref={gameContainerRef}>
      {/* Main Game Interface */}
      <div className="game-interface">
        {/* Header */}
        <div className="game-header-enhanced">
          <div className="header-left">
            <div className="title-with-logo">
              <div className="game-logo">
                <div className="logo-grid">
                  <div className="logo-cell">⭕</div>
                  <div className="logo-cell">❌</div>
                  <div className="logo-cell">⭕</div>
                  <div className="logo-cell">❌</div>
                  <div className="logo-cell">⭕</div>
                  <div className="logo-cell">❌</div>
                  <div className="logo-cell">⭕</div>
                  <div className="logo-cell">❌</div>
                  <div className="logo-cell">⭕</div>
                </div>
              </div>
                  <h1 className="game-title">
                    Tic Tac Toe
                  </h1>
            </div>
          </div>
          
          <div className="header-right">
            <div className="session-info">
              <div className="session-stat">
                <span className="stat-label">Session</span>
                <span className="stat-value">{sessionStats.wins}/{sessionStats.gamesPlayed}</span>
              </div>
              {gameStats && (
                <div className="session-stat">
                  <span className="stat-label">Total</span>
                  <span className="stat-value">{gameStats.totalWins}/{gameStats.totalGames}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          {/* Game Info Display */}
          <div className="control-group game-info">
            <label>🎮 Game Mode:</label>
            <div className="mode-display">
              <span className="active-mode">Tic Tac Toe</span>
            </div>
          </div>

          {/* Game Settings */}
          <div className="control-group settings-group">
            <div className="setting">
              <button
                className={`setting-btn ${isAgainstAI ? 'active' : ''}`}
                onClick={() => {
                  setIsAgainstAI(!isAgainstAI);
                  if (soundEnabled) playSound('click');
                }}
              >
                {isAgainstAI ? '🤖 vs AI' : '👥 vs Human'}
              </button>
            </div>

            {isAgainstAI && (
              <div className="setting difficulty-setting">
                <label>⚡ Difficulty</label>
                <div className="select-wrapper">
                  <select
                    value={difficulty}
                    onChange={(e) => {
                      setDifficulty(e.target.value);
                      if (soundEnabled) playSound('click');
                    }}
                    className="styled-select difficulty-select"
                  >
                    <option value={DIFFICULTY_LEVELS.EASY}>🟢 Easy</option>
                    <option value={DIFFICULTY_LEVELS.MEDIUM}>🟡 Medium</option>
                    <option value={DIFFICULTY_LEVELS.HARD}>🟠 Hard</option>
                    <option value={DIFFICULTY_LEVELS.NIGHTMARE}>🔴 Nightmare</option>
                  </select>
                  <div className="select-arrow">⌄</div>
                </div>
              </div>
            )}

            <div className="setting">
              <button
                className={`setting-btn ${soundEnabled ? 'active' : ''}`}
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (soundEnabled) playSound('click');
                }}
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="control-group action-buttons">
            <button
              className="action-btn welcome-btn"
              onClick={() => {
                setShowWelcomeModal(true);
                if (soundEnabled) playSound('click');
              }}
              title="Show welcome screen"
            >
              👋 Welcome
            </button>
            
            <button
              className="action-btn tutorial-btn"
              onClick={() => {
                setShowTutorial(true);
                if (soundEnabled) playSound('click');
              }}
            >
              📚 Tutorial
            </button>
            
            <button
              className="action-btn stats-btn"
              onClick={() => {
                setShowStats(true);
                if (soundEnabled) playSound('click');
              }}
            >
              📊 Stats
            </button>
            
            <button
              className="action-btn customize-btn"
              onClick={() => {
                setShowCustomization(true);
                if (soundEnabled) playSound('click');
              }}
            >
              🎨 Customize
            </button>
          </div>
        </div>

        {/* Game Area */}
        <div className="game-area">
          {renderGame()}
        </div>

        {/* Status Bar */}
        <div className="status-bar">
          <div className="status-item">
            <span className="status-icon">🎮</span>
            <span>Mode: Tic Tac Toe</span>
          </div>
          
          <div className="status-item">
            <span className="status-icon">🎯</span>
            <span>Theme: {currentTheme.name}</span>
          </div>
          
          {gameStats && (
            <div className="status-item">
              <span className="status-icon">🏆</span>
              <span>Win Rate: {gameStats.winRate.toFixed(1)}%</span>
            </div>
          )}

          <div className="status-item level-display">
            <span className="status-icon">⚡</span>
            <div className="level-info">
              {(() => {
                const levelData = statsManager.getPlayerLevel();
                return (
                  <>
                    <span>Level: {levelData.level}</span>
                    <div className="level-progress-bar">
                      <div 
                        className="level-progress-fill" 
                        style={{ width: `${levelData.progress}%` }}
                      ></div>
                    </div>
                    <span className="level-progress-text">
                      {levelData.currentLevelPoints}/{levelData.nextLevelPoints} pts
                    </span>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {showWelcomeModal && (
        <WelcomeModal
          isOpen={showWelcomeModal}
          onClose={() => setShowWelcomeModal(false)}
          currentTheme={currentTheme}
          onStartTutorial={handleWelcomeStartTutorial}
          onQuickStart={handleWelcomeQuickStart}
          playSound={soundEnabled ? playSound : undefined}
          soundEnabled={soundEnabled}
        />
      )}

      {showTutorial && (
        <TutorialSystem
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
          currentTheme={currentTheme}
          gameMode={gameMode}
          onStartTutorial={handleStartTutorial}
          playSound={soundEnabled ? playSound : undefined}
          soundEnabled={soundEnabled}
        />
      )}

      {showStats && (
        <StatsDashboard
          isOpen={showStats}
          onClose={() => setShowStats(false)}
          currentTheme={currentTheme}
        />
      )}

      {showCustomization && (
        <CustomizationPanel
          isOpen={showCustomization}
          onClose={() => setShowCustomization(false)}
          currentTheme={currentTheme}
          onThemeChange={handleThemeChange}
          currentSymbols={currentSymbols}
          onSymbolsChange={handleSymbolChange}
          playSound={soundEnabled ? playSound : undefined}
          soundEnabled={soundEnabled}
        />
      )}

        {newAchievements.length > 0 && (
          <AchievementNotification
            achievements={newAchievements}
            onClose={() => setNewAchievements([])}
            currentTheme={currentTheme}
            playSound={soundEnabled ? playSound : undefined}
          />
        )}

          {/* Interactive Tutorial */}
          <InteractiveTutorial
            gameMode={gameMode}
            isActive={interactiveTutorialMode}
            onComplete={handleTutorialComplete}
            onSkip={() => setInteractiveTutorialMode(false)}
            currentTheme={currentTheme}
            playSound={soundEnabled ? playSound : undefined}
            soundEnabled={soundEnabled}
            gameState={gameStateForTutorial}
          />

      {/* Background Effects */}
      <div className="background-effects">
        <div className="floating-particles">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="floating-particle"
              style={{
                '--delay': `${i * 0.5}s`,
                '--duration': `${5 + i}s`,
                '--x': `${Math.random() * 100}%`,
                '--y': `${Math.random() * 100}%`,
                background: currentTheme.colors.primary
              }}
            />
          ))}
        </div>
        
        <div className="background-glow" style={{
          background: `radial-gradient(circle at 50% 50%, ${currentTheme.colors.primary}20 0%, transparent 70%)`
        }} />
      </div>
    </div>
  );
};

export default TicTacToeEnhanced;
