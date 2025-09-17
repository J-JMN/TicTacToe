'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import './game.css';
import { preloadSounds, playSound } from './sounds';

// Ripple effect component
const Ripple = ({ color = 'rgba(255, 255, 255, 0.7)' }) => {
  return (
    <span 
      className="ripple" 
      style={{
        position: 'absolute',
        borderRadius: '50%',
        backgroundColor: color,
        transform: 'scale(0)',
        animation: 'ripple 0.6s linear',
        pointerEvents: 'none',
        opacity: 1,
      }}
    />
  );
};

// Winning combinations
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

// Difficulty levels
const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

const TicTacToe = () => {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(''));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isAgainstAI, setIsAgainstAI] = useState(true);
  const [winningLine, setWinningLine] = useState([]);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [isParticlesEnabled, setIsParticlesEnabled] = useState(true);
  
  // Refs
  const particlesRef = useRef([]);
  const lastUpdateTime = useRef(0);
  const aiMoveTimeout = useRef(null);

  // Check for winner
  const checkWinner = useCallback((squares) => {
    // Check all possible winning combinations
    for (let i = 0; i < LINES.length; i++) {
      const [a, b, c] = LINES[i];
      if (squares[a] && 
          squares[a] === squares[b] && 
          squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    return { winner: null, line: [] };
  }, []);

  // Check for draw
  const checkDraw = useCallback((squares) => {
    return squares.every(square => square !== '') && !checkWinner(squares).winner;
  }, [checkWinner]);

  // Reset the game
  const resetGame = useCallback((event) => {
    if (event) {
      createRipple(event);
    }
    setBoard(Array(9).fill(''));
    setGameOver(false);
    setWinner(null);
    setWinningLine([]);
    setShowVictoryModal(false);
    
    if (aiMoveTimeout.current) {
      clearTimeout(aiMoveTimeout.current);
      aiMoveTimeout.current = null;
    }
    
    // Play click sound on reset if sound is enabled
    if (soundEnabled) {
      playSound('click');
    }
    
    // Clear particles
    particlesRef.current = [];
  }, []);

  // Create ripple effect
  const createRipple = useCallback((event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    // Remove any existing ripples
    const existingRipples = button.getElementsByClassName('ripple');
    while (existingRipples[0]) {
      existingRipples[0].remove();
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
    
    return ripple;
  }, []);

  // Handle cell click
  const handleClick = useCallback((event, index) => {
    createRipple(event);
    if (board[index] || gameOver) return;

    // Play click sound
    if (soundEnabled) {
      playSound('click');
    }

    const newBoard = [...board];
    const currentPlayer = isXNext ? 'X' : 'O';
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // Play move sound for the current player
    if (soundEnabled) {
      playSound('move');
    }

    const { winner: gameWinner, line } = checkWinner(newBoard);
    const isDraw = checkDraw(newBoard);

    if (gameWinner || isDraw) {
      setGameOver(true);
      setWinner(gameWinner);
      setWinningLine(line);
      
      // Play appropriate sound
      if (soundEnabled) {
        if (gameWinner) {
          playSound('win');
          // Play line sound after a short delay
          setTimeout(() => {
            playSound('line');
          }, 300);
        } else {
          playSound('draw');
        }
      }
      
      // Update scores
      if (gameWinner) {
        setScores(prevScores => ({
          ...prevScores,
          [gameWinner.toLowerCase()]: prevScores[gameWinner.toLowerCase()] + 1
        }));
      } else {
        setScores(prevScores => ({
          ...prevScores,
          draws: prevScores.draws + 1
        }));
      }
      
      // Show victory modal
      setTimeout(() => {
        setShowVictoryModal(true);
      }, 800);
    } else {
      setIsXNext(!isXNext);
    }
  }, [board, gameOver, isXNext, checkWinner, checkDraw]);

  // Minimax algorithm with alpha-beta pruning for perfect AI play
  const minimax = useCallback((board, depth, isMaximizing, alpha, beta, aiPlayer, humanPlayer) => {
    const result = checkWinner(board);
    
    // Base cases - return score if game is over
    if (result.winner === aiPlayer) return { score: 10 - depth };
    if (result.winner === humanPlayer) return { score: depth - 10 };
    if (checkDraw(board)) return { score: 0 };
    
    const emptyIndices = board.reduce((acc, cell, index) => {
      if (!cell) acc.push(index);
      return acc;
    }, []);
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = -1;
      
      for (const index of emptyIndices) {
        const newBoard = [...board];
        newBoard[index] = aiPlayer;
        const { score } = minimax(newBoard, depth + 1, false, alpha, beta, aiPlayer, humanPlayer);
        
        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
        
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) break; // Beta cut-off
      }
      
      return { score: bestScore, index: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = -1;
      
      for (const index of emptyIndices) {
        const newBoard = [...board];
        newBoard[index] = humanPlayer;
        const { score } = minimax(newBoard, depth + 1, true, alpha, beta, aiPlayer, humanPlayer);
        
        if (score < bestScore) {
          bestScore = score;
          bestMove = index;
        }
        
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) break; // Alpha cut-off
      }
      
      return { score: bestScore, index: bestMove };
    }
  }, [checkWinner, checkDraw]);

  // Get the best move using minimax
  const getBestMove = useCallback((board, aiPlayer, humanPlayer) => {
    // For the first move, take center or corner for optimal play
    const emptyCount = board.filter(cell => cell === '').length;
    if (emptyCount === 9) {
      // First move - take center or corner
      return [4, 0, 2, 6, 8][Math.floor(Math.random() * 5)];
    }
    
    // For the second move if center is taken
    if (emptyCount === 8 && board[4] !== '') {
      // Take a corner if center is taken by opponent
      const corners = [0, 2, 6, 8];
      return corners[Math.floor(Math.random() * corners.length)];
    }
    
    // Use minimax for all other moves
    const { index } = minimax([...board], 0, true, -Infinity, Infinity, aiPlayer, humanPlayer);
    return index;
  }, [checkWinner]);

  // Handle AI moves
  useEffect(() => {
    if (isAgainstAI && !isXNext && !gameOver) {
      aiMoveTimeout.current = setTimeout(() => {
        const emptyIndices = board.reduce((acc, cell, index) => {
          if (!cell) acc.push(index);
          return acc;
        }, []);
        
        if (emptyIndices.length === 0) return;
        
        let move;
        
        switch (difficulty) {
          case DIFFICULTY_LEVELS.EASY:
            // Random move
            move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            break;
            
          case DIFFICULTY_LEVELS.MEDIUM:
            // 70% chance to make a smart move, 30% random
            if (Math.random() < 0.7) {
              move = getBestMove(board, 'O', 'X');
            } else {
              move = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            }
            break;
            
          case DIFFICULTY_LEVELS.HARD:
          default:
            // Always make the best move
            move = getBestMove(board, 'O', 'X');
            break;
        }
        
        // Update the board directly
        const newBoard = [...board];
        newBoard[move] = 'O';
        setBoard(newBoard);
        
        // Play AI move sound
        if (soundEnabled) {
          playSound('move');
        }

        // Check for win/draw after AI move
        const { winner: gameWinner, line } = checkWinner(newBoard);
        const isDraw = checkDraw(newBoard);

        if (gameWinner || isDraw) {
          setGameOver(true);
          setWinner(gameWinner);
          setWinningLine(line || []);
          
          if (soundEnabled) {
            if (gameWinner) {
              playSound('win');
              setTimeout(() => playSound('line'), 300);
            } else {
              playSound('draw');
            }
          }
          
          // Update scores
          if (gameWinner) {
            setScores(prevScores => ({
              ...prevScores,
              [gameWinner.toLowerCase()]: prevScores[gameWinner.toLowerCase()] + 1
            }));
          } else {
            setScores(prevScores => ({
              ...prevScores,
              draws: prevScores.draws + 1
            }));
          }
          
          // Show victory modal
          setTimeout(() => {
            setShowVictoryModal(true);
          }, 800);
        } else {
          setIsXNext(true); // Switch back to player's turn
        }
      }, 500);
    }
    
    return () => {
      if (aiMoveTimeout.current) {
        clearTimeout(aiMoveTimeout.current);
        aiMoveTimeout.current = null;
      }
    };
  }, [isAgainstAI, isXNext, gameOver, board, difficulty, soundEnabled, checkWinner, checkDraw, getBestMove]);

  // Handle difficulty change
  const handleDifficultyChange = useCallback((e) => {
    if (soundEnabled) playSound('click');
    setDifficulty(e.target.value);
  }, [soundEnabled]);

  // Particle effects
  const updateParticles = useCallback((currentTime = 0) => {
    if (!isParticlesEnabled || !particlesRef.current.length) return;

    const now = Date.now();
    const deltaTime = Math.min(now - (lastUpdateTime.current || now - 16), 100) / 1000;
    lastUpdateTime.current = now;

    // Update particles
    particlesRef.current = particlesRef.current
      .filter(p => now - p.createdAt < p.lifetime)
      .map(p => {
        const age = (now - p.createdAt) / p.lifetime;
        const isConfetti = p.lifetime > 2000;
        
        const newParticle = {
          ...p,
          x: p.x + p.speedX * deltaTime * 60,
          y: p.y + p.speedY * deltaTime * 60,
          speedY: p.speedY + p.gravity * deltaTime * 60,
          rotation: p.rotation + p.rotationSpeed * deltaTime * 60,
          opacity: p.opacity * (1 - age * 0.05)
        };

        if (isConfetti) {
          newParticle.speedX = p.speedX * 0.99;
          newParticle.wind = Math.sin(now * 0.001) * 0.1;
        }

        return newParticle;
      });

    if (particlesRef.current.length > 0) {
      requestAnimationFrame(updateParticles);
    } else {
      lastUpdateTime.current = 0;
    }
  }, [isParticlesEnabled]);

  // Add confetti effect
  const addConfetti = useCallback((count = 30, position = null) => {
    if (!isParticlesEnabled) return;

    const colors = [0xff9ff3, 0xfeca57, 0x1dd1a1, 0x54a0ff, 0x5f27cd];
    const newParticles = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const startX = position?.x ?? Math.random() * window.innerWidth;
      const startY = position?.y ?? -10 - Math.random() * 100;
      
      newParticles.push({
        x: startX,
        y: startY,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 12,
        speedY: Math.random() * 5 + 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        type: Math.floor(Math.random() * 2),
        opacity: 0.9,
        gravity: 0.15,
        wind: (Math.random() - 0.5) * 0.2,
        createdAt: now,
        lifetime: 3000 + Math.random() * 2000
      });
    }
    
    const previousLength = particlesRef.current.length;
    particlesRef.current = [...particlesRef.current, ...newParticles];
    
    if (previousLength === 0) {
      requestAnimationFrame(updateParticles);
    }
  }, [isParticlesEnabled, updateParticles]);

  // Add particle effect
  const addParticleEffect = useCallback((position, color, size = 1.0, isCelebration = false) => {
    if (!isParticlesEnabled) return;
    
    if (isCelebration) {
      addConfetti(30, position);
      return;
    }
    
    const newParticles = [];
    const count = position ? 5 : 10;
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
      const particleSize = (Math.random() * 4 + 2) * size;
      const startX = position?.x ?? Math.random() * window.innerWidth;
      const startY = position?.y ?? -10;
      
      newParticles.push({
        x: startX,
        y: startY,
        size: particleSize,
        color: color ? (typeof color === 'string' ? parseInt(color.replace('#', '0x'), 16) : color) : 0xffffff,
        speedX: (Math.random() - 0.5) * 4,
        speedY: Math.random() * 2 + 1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        type: Math.floor(Math.random() * 2),
        opacity: 0.9,
        gravity: 0.05,
        wind: (Math.random() - 0.5) * 0.05,
        createdAt: now,
        lifetime: 1000 + Math.random() * 500
      });
    }
    
    const previousLength = particlesRef.current.length;
    particlesRef.current = [...particlesRef.current, ...newParticles];
    
    if (previousLength === 0) {
      requestAnimationFrame(updateParticles);
    }
  }, [isParticlesEnabled, addConfetti, updateParticles]);

  // Initialize game and preload sounds
  useEffect(() => {
    // Add initial particles
    addParticleEffect();
    
    // Preload sounds
    preloadSounds().catch(error => {
      console.error('Failed to load sounds:', error);
    });
    
    // Cleanup
    return () => {
      if (aiMoveTimeout.current) {
        clearTimeout(aiMoveTimeout.current);
      }
    };
  }, [addParticleEffect]);

  // Add ripple effect to all buttons
  useEffect(() => {
    const addRippleToButtons = () => {
      const buttons = document.querySelectorAll('.game-button');
      buttons.forEach(button => {
        button.addEventListener('click', createRipple);
      });
      
      return () => {
        buttons.forEach(button => {
          button.removeEventListener('click', createRipple);
        });
      };
    };
    
    addRippleToButtons();
    
    // Re-run when board changes
    const observer = new MutationObserver(addRippleToButtons);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [createRipple]);

  // Toggle AI opponent
  const toggleAIOpponent = useCallback((event) => {
    createRipple(event);
    setIsAgainstAI(!isAgainstAI);
  }, []);

  // Render the game board with winning line
  const renderBoard = useCallback(() => {
    const currentParticles = particlesRef.current;
    
    // Calculate winning line path if there's a winning line
    const renderWinningLine = () => {
      if (!winningLine || winningLine.length !== 3) return null;
      
      const [a, b, c] = winningLine;
      const isRow = Math.floor(a / 3) === Math.floor(b / 3) && Math.floor(b / 3) === Math.floor(c / 3);
      const isCol = a % 3 === b % 3 && b % 3 === c % 3;
      
      // Get the board element to calculate positions
      const boardElement = document.querySelector('.board');
      if (!boardElement) return null;
      
      const boardRect = boardElement.getBoundingClientRect();
      const cellSize = boardRect.width / 3;
      const lineWidth = 4;
      const glowSize = 15;
      
      // Calculate positions for the line
      if (isRow) {
        const row = Math.floor(a / 3);
        const y = (row + 0.5) * cellSize;
        return (
          <svg 
            className="winning-line" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 5,
              opacity: 0,
              animation: 'lineAppear 0.5s ease-out forwards'
            }}
            viewBox={`0 0 ${boardRect.width} ${boardRect.height}`}
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1={y}
              x2={boardRect.width}
              y2={y}
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth={lineWidth}
              strokeLinecap="round"
              filter={`drop-shadow(0 0 ${glowSize}px rgba(255, 255, 255, 0.9))`}
            />
          </svg>
        );
      } else if (isCol) {
        const col = a % 3;
        const x = (col + 0.5) * cellSize;
        return (
          <svg 
            className="winning-line" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 5,
              opacity: 0,
              animation: 'lineAppear 0.5s ease-out forwards'
            }}
            viewBox={`0 0 ${boardRect.width} ${boardRect.height}`}
            preserveAspectRatio="none"
          >
            <line
              x1={x}
              y1="0"
              x2={x}
              y2={boardRect.height}
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth={lineWidth}
              strokeLinecap="round"
              filter={`drop-shadow(0 0 ${glowSize}px rgba(255, 255, 255, 0.9))`}
            />
          </svg>
        );
      } else {
        // Diagonal line
        const isMainDiagonal = (a === 0 && c === 8) || (a === 8 && c === 0);
        const padding = cellSize * 0.15; // Add some padding to extend beyond cells
        
        let x1, y1, x2, y2;
        
        if (isMainDiagonal) {
          x1 = -padding;
          y1 = -padding;
          x2 = boardRect.width + padding;
          y2 = boardRect.height + padding;
        } else {
          x1 = boardRect.width + padding;
          y1 = -padding;
          x2 = -padding;
          y2 = boardRect.height + padding;
        }
        
        return (
          <svg 
            className="winning-line" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 5,
              opacity: 0,
              animation: 'lineAppear 0.5s ease-out forwards',
              overflow: 'visible'
            }}
            viewBox={`0 0 ${boardRect.width} ${boardRect.height}`}
            preserveAspectRatio="none"
          >
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.9)"
              strokeWidth={lineWidth}
              strokeLinecap="round"
              filter="url(#glow)"
              style={{
                filter: `drop-shadow(0 0 ${glowSize}px rgba(255, 255, 255, 0.9))`
              }}
            />
          </svg>
        );
      }
    };
    
    return (
      <div className="game-container">
        <div className="board">
          {board.map((cell, index) => {
            const isWinningCell = winningLine.includes(index);
            return (
              <button
                key={index}
                className={`cell ${cell ? `cell-${cell.toLowerCase()}` : ''} ${isWinningCell ? 'winning-cell' : ''}`}
                onClick={(e) => handleClick(e, index)}
                disabled={!!cell || gameOver}
                aria-label={`Cell ${index + 1} ${cell ? `occupied by ${cell}` : 'empty'}`}
              >
                {cell && (
                  <span className="cell-content" style={{
                    animation: isWinningCell ? 'popIn 0.5s ease-out' : 'none'
                  }}>
                    {cell}
                  </span>
                )}
              </button>
            );
          })}
          {winningLine.length > 0 && renderWinningLine()}
        </div>
        
        {/* Particle Effects */}
        <div className="particle-container">
          {currentParticles.map((p, i) => {
            const color = `#${p.color.toString(16).padStart(6, '0')}`;
            const isCircle = p.type === 1;
            
            return (
              <div
                key={`p-${i}`}
                style={{
                  position: 'absolute',
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  width: `${p.size}px`,
                  height: isCircle ? p.size : p.size * 0.6,
                  backgroundColor: color,
                  borderRadius: isCircle ? '50%' : '2px',
                  opacity: p.opacity,
                  transform: `rotate(${p.rotation}rad)`,
                  pointerEvents: 'none',
                  zIndex: 1000,
                  transformOrigin: 'center center',
                  boxShadow: `0 0 ${p.size * 0.5}px ${color}80`
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }, [board, gameOver, winningLine]);

  return (
    <div className="game">
      <div className="game-header">
        <h1>Tic Tac Toe</h1>
        <div className="game-scores">
          <div className="score">X: {scores.x}</div>
          <div className="score">Draws: {scores.draws}</div>
          <div className="score">O: {scores.o}</div>
        </div>
      </div>

      <div className="game-controls">
        <button 
          className={`game-button ${isAgainstAI ? 'active' : ''}`}
          onClick={() => {
            if (soundEnabled) playSound('click');
            setIsAgainstAI(!isAgainstAI);
          }}
        >
          {isAgainstAI ? 'Playing vs AI' : 'Local 2-Player'}
        </button>
        
        <button 
          className="game-button"
          onClick={() => {
            if (soundEnabled) playSound('click');
            resetGame();
          }}
        >
          New Game
        </button>
        
        <button 
          className={`game-button ${soundEnabled ? 'active' : ''}`}
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            if (soundEnabled) {
              playSound('click');
            }
          }}
          title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
        >
          {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
        </button>

        <div className="difficulty-selector">
          <label>AI Difficulty:</label>
          <select 
            value={difficulty}
            onChange={(e) => {
              if (soundEnabled) playSound('click');
              setDifficulty(e.target.value);
            }}
            disabled={!isAgainstAI}
          >
            <option value={DIFFICULTY_LEVELS.EASY}>Easy</option>
            <option value={DIFFICULTY_LEVELS.MEDIUM}>Medium</option>
            <option value={DIFFICULTY_LEVELS.HARD}>Hard</option>
          </select>
        </div>
      </div>

      {renderBoard()}

      <div className="game-status">
        {gameOver ? (
          <div className="status-message">
            {winner ? `Player ${winner} wins!` : "It's a draw!"}
          </div>
        ) : (
          <div className="status-message">
            Next player: {isXNext ? 'X' : 'O'}
          </div>
        )}
      </div>

      {/* Victory Modal */}
      {showVictoryModal && (
        <div className="victory-modal active">
          <div className="victory-content">
            <div className="victory-emoji">
              {winner ? '🏆' : '🤝'}
            </div>
            <h2 className="victory-message">
              {winner ? `Player ${winner} Wins!` : 'Game Drawn!'}
            </h2>
            <div className="victory-actions">
              <button 
                className="game-button"
                onClick={() => {
                  if (soundEnabled) playSound('click');
                  setShowVictoryModal(false);
                  resetGame();
                }}
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicTacToe;
