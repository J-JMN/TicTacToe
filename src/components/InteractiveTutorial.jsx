'use client';

import { useState, useEffect, useCallback } from 'react';
import { GAME_MODES } from '../lib/gameTypes.js';

const InteractiveTutorial = ({ 
  gameMode, 
  isActive, 
  onComplete, 
  onSkip,
  currentTheme,
  playSound,
  soundEnabled = true,
  gameState = {},
  onTutorialAction
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [waitingForAction, setWaitingForAction] = useState(false);

  // Tutorial steps for 2D game mode
  const tutorialSteps = {
    [GAME_MODES.CLASSIC_2D]: [
      {
        id: 'welcome',
        title: 'Welcome to 2D Tic Tac Toe!',
        description: 'Let\'s learn how to play this enhanced version with power-ups.',
        instruction: 'Click "Next" to continue.',
        highlight: null,
        action: 'click_next',
        helpText: 'This tutorial will guide you through your first game step by step.'
      },
      {
        id: 'board_intro',
        title: 'The Game Board',
        description: 'This is the 3x3 game board where you\'ll place your symbols.',
        instruction: 'Click on any empty cell to place your X.',
        highlight: '.cell-2d:not([disabled])',
        action: 'click_cell',
        helpText: 'Click on any of the glowing empty cells to make your first move.'
      },
      {
        id: 'first_move',
        title: 'Great! You made your first move.',
        description: 'Notice how the AI (O) automatically responds.',
        instruction: 'Wait for the AI to make its move, then make another move.',
        highlight: null,
        action: 'wait_ai_and_move',
        helpText: 'The AI will think for a moment, then place its O. After that, make your next move.'
      },
      {
        id: 'powerups_intro',
        title: 'Power-ups Panel',
        description: 'These are your special abilities that can change the game.',
        instruction: 'Click on the "Freeze" power-up.',
        highlight: '.powerup-btn-2d[title*="Freeze"]',
        action: 'click_powerup',
        helpText: 'Power-ups give you special abilities. Try clicking the freeze power-up!'
      },
      {
        id: 'powerup_usage',
        title: 'Using Power-ups',
        description: 'Now click on the board to use your Freeze power-up.',
        instruction: 'Click anywhere on the board to freeze the AI.',
        highlight: '.board-2d-container',
        action: 'use_powerup',
        helpText: 'With freeze selected, click anywhere on the board to skip the AI\'s next turn.'
      },
      {
        id: 'winning_strategy',
        title: 'Winning Strategy',
        description: 'Try to get three of your symbols in a row, column, or diagonal.',
        instruction: 'Continue playing to try and win the game!',
        highlight: null,
        action: 'play_to_win',
        helpText: 'Use your remaining moves and power-ups strategically to achieve victory!'
      },
      {
        id: 'completion',
        title: 'Tutorial Complete!',
        description: 'You\'ve learned the basics of 2D Tic Tac Toe with power-ups.',
        instruction: 'Click "Complete" to finish the tutorial.',
        highlight: null,
        action: 'complete',
        helpText: 'Congratulations! You now know how to play. Try different game modes for new challenges!'
      }
    ]
  };

  const currentSteps = tutorialSteps[gameMode] || [];
  const currentStepData = currentSteps[currentStep];

  // Handle step completion
  const completeStep = useCallback(() => {
    if (soundEnabled && playSound) playSound('click');
    
    if (currentStep < currentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false);
    } else {
      setCompleted(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
    }
  }, [currentStep, currentSteps.length, onComplete, playSound, soundEnabled]);

  // Show hint after delay
  useEffect(() => {
    if (currentStepData && currentStepData.action !== 'click_next') {
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, currentStepData]);

  // Highlight elements and set up action listeners
  useEffect(() => {
    if (currentStepData && currentStepData.highlight) {
      const elements = document.querySelectorAll(currentStepData.highlight);
      elements.forEach(el => {
        el.classList.add('tutorial-highlight');
      });

      // Set up click listeners for interactive actions
      const handleElementClick = () => {
        // Only advance for manual steps (like "Next" button)
        // Game action steps are handled by game state monitoring
        if (currentStepData.action === 'click_next' || currentStepData.action === 'complete') {
          advanceStep();
        }
        // For game actions, let the game state monitor handle advancement
      };

      // Add click listeners to highlighted elements
      elements.forEach(el => {
        el.addEventListener('click', handleElementClick);
      });
      
      // Mark as waiting for action if this step requires interaction
      if (currentStepData.action !== 'click_next' && currentStepData.action !== 'complete') {
        setWaitingForAction(true);
      }
      
      return () => {
        elements.forEach(el => {
          el.classList.remove('tutorial-highlight');
          el.removeEventListener('click', handleElementClick);
        });
      };
    }
  }, [currentStep, currentStepData, currentSteps.length, onComplete, playSound, soundEnabled]);

  // Reset waiting state when step changes
  useEffect(() => {
    setWaitingForAction(false);
    setShowHint(false);
  }, [currentStep]);

  // Monitor game state changes to advance tutorial
  useEffect(() => {
    if (!isActive || !currentStepData || !gameState) return;

    const { board, isXNext, winner, moveCount } = gameState;
    
    console.log('Tutorial monitoring:', { 
      action: currentStepData.action, 
      moveCount, 
      isXNext, 
      winner,
      currentStep 
    });
    
    // Check if current tutorial step requirements are met
    switch (currentStepData.action) {
      case 'click_cell':
        // Wait for player to make their first move
        if (moveCount === 1 && !isXNext) {
          console.log('Player made first move, advancing tutorial');
          advanceStep();
        }
        break;
      
      case 'wait_ai_and_move':
        // Wait for AI to respond, then advance when it's player's turn again
        if (moveCount >= 2 && isXNext) {
          console.log('AI responded, advancing tutorial');
          advanceStep();
        }
        break;
      
      case 'game_end':
        // Wait for game to end
        if (winner !== null || (board && board.every(cell => cell !== null && cell !== ''))) {
          advanceStep();
        }
        break;
      
      default:
        // For other actions, keep existing behavior
        break;
    }
  }, [gameState, isActive, currentStepData, currentStep]);

  // Function to advance tutorial step
  const advanceStep = useCallback(() => {
    if (currentStep < currentSteps.length - 1) {
      if (soundEnabled && playSound) playSound('click');
      setCurrentStep(currentStep + 1);
      setShowHint(false);
      setWaitingForAction(false);
    } else {
      setCompleted(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);
    }
  }, [currentStep, currentSteps.length, soundEnabled, playSound, onComplete]);

  // Handle skip tutorial
  const handleSkip = useCallback(() => {
    if (soundEnabled && playSound) playSound('click');
    if (onSkip) onSkip();
  }, [onSkip, playSound, soundEnabled]);

  if (!isActive || !currentStepData) return null;

  return (
    <>
      {/* Tutorial Overlay */}
      <div className="interactive-tutorial-overlay">
        <div className="tutorial-spotlight" />
      </div>

      {/* Tutorial Panel */}
      <div className="interactive-tutorial-panel">
        <div className="tutorial-step-info">
          <div className="step-progress">
            <div className="step-counter">
              Step {currentStep + 1} of {currentSteps.length}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentStep + 1) / currentSteps.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="step-content">
            <h3 className="step-title">{currentStepData.title}</h3>
            <p className="step-description">{currentStepData.description}</p>
            <div className="step-instruction">
              <span className="instruction-icon">👆</span>
              <span>{currentStepData.instruction}</span>
            </div>
          </div>

          {showHint && (
            <div className="tutorial-hint">
              <div className="hint-icon">💡</div>
              <div className="hint-text">{currentStepData.helpText}</div>
            </div>
          )}

          <div className="tutorial-controls">
            {currentStepData.action === 'click_next' ? (
              <button onClick={completeStep} className="tutorial-btn primary">
                Next Step →
              </button>
            ) : completed ? (
              <button onClick={completeStep} className="tutorial-btn success">
                ✨ Complete Tutorial
              </button>
            ) : (
              <button onClick={handleSkip} className="tutorial-btn secondary">
                Skip Tutorial
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tutorial Pointer (when highlighting) */}
      {currentStepData.highlight && (
        <div className="tutorial-pointer">
          <div className="pointer-arrow">↗</div>
          <div className="pointer-text">Click here!</div>
        </div>
      )}
    </>
  );
};

export default InteractiveTutorial;
