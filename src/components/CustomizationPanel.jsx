'use client';

import { useState, useEffect } from 'react';
import { THEMES } from '../lib/gameTypes.js';
import { statsManager } from '../lib/statsManager.js';

const CustomizationPanel = ({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onThemeChange,
  currentSymbols,
  onSymbolsChange,
  playSound,
  soundEnabled
}) => {
  const [activeTab, setActiveTab] = useState('themes');
  const [unlockedThemes, setUnlockedThemes] = useState([]);
  const [customSymbols, setCustomSymbols] = useState({
    X: 'X',
    O: 'O'
  });
  const [symbolType, setSymbolType] = useState('classic');
  const [previewTheme, setPreviewTheme] = useState(null);

  // Symbol options
  const symbolOptions = {
    classic: { X: 'X', O: 'O' },
    shapes: { X: '✕', O: '○' },
    arrows: { X: '↗', O: '↙' },
    stars: { X: '★', O: '☆' },
    hearts: { X: '♥', O: '♡' },
    swords: { X: '⚔', O: '🛡' },
    fire: { X: '🔥', O: '❄️' },
    space: { X: '🚀', O: '🌟' },
    animals: { X: '🐺', O: '🦅' },
    gems: { X: '💎', O: '🔮' },
    custom: { X: customSymbols.X, O: customSymbols.O }
  };

  useEffect(() => {
    if (isOpen) {
      setUnlockedThemes(statsManager.getUnlockedThemes());
      if (currentSymbols) {
        setCustomSymbols(currentSymbols);
      }
    }
  }, [isOpen, currentSymbols]);

  const handleThemeSelect = (themeId) => {
    const theme = THEMES[themeId];
    if (!theme || (!unlockedThemes.includes(themeId) && !theme.unlocked)) {
      return;
    }

    if (playSound && soundEnabled) {
      playSound('click');
    }

    setPreviewTheme(theme);
    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

  const handleSymbolChange = (type) => {
    if (playSound && soundEnabled) {
      playSound('click');
    }

    setSymbolType(type);
    const symbols = symbolOptions[type];
    if (onSymbolsChange) {
      onSymbolsChange(symbols);
    }
  };

  const handleCustomSymbolChange = (player, symbol) => {
    const newSymbols = { ...customSymbols, [player]: symbol };
    setCustomSymbols(newSymbols);
    
    if (symbolType === 'custom') {
      if (onSymbolsChange) {
        onSymbolsChange(newSymbols);
      }
    }
  };

  const isThemeUnlocked = (themeId) => {
    const theme = THEMES[themeId];
    return theme.unlocked || unlockedThemes.includes(themeId);
  };

  const getThemeRequirementText = (theme) => {
    if (!theme.requirement) return '';
    
    const req = theme.requirement;
    switch (req.type) {
      case 'games_played':
        return `Play ${req.value} games`;
      case 'achievements':
        return `Unlock ${req.value} achievements`;
      case 'win_streak':
        return `Get a ${req.value} win streak`;
      default:
        return 'Complete requirement';
    }
  };

  if (!isOpen) return null;

  const renderThemes = () => (
    <div className="customization-tab-content themes">
      <h3>🎨 Themes</h3>
      <div className="themes-grid">
        {Object.entries(THEMES).map(([themeId, theme]) => {
          const unlocked = isThemeUnlocked(themeId);
          const isActive = currentTheme?.id === themeId;
          
          return (
            <div 
              key={themeId}
              className={`theme-card ${unlocked ? 'unlocked' : 'locked'} ${isActive ? 'active' : ''}`}
              onClick={() => unlocked && handleThemeSelect(themeId)}
            >
              <div className="theme-preview" style={{
                background: unlocked ? 
                  `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` :
                  '#334155'
              }}>
                {!unlocked && <div className="lock-icon">🔒</div>}
                {isActive && <div className="active-check">✓</div>}
              </div>
              
              <div className="theme-info">
                <h4>{theme.name}</h4>
                {!unlocked && theme.requirement && (
                  <p className="requirement">{getThemeRequirementText(theme)}</p>
                )}
                {unlocked && (
                  <div className="theme-colors">
                    <div className="color-dot" style={{ background: theme.colors.primary }}></div>
                    <div className="color-dot" style={{ background: theme.colors.secondary }}></div>
                    <div className="color-dot" style={{ background: theme.colors.accent }}></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Theme Preview */}
      {previewTheme && (
        <div className="theme-preview-section">
          <h4>Preview: {previewTheme.name}</h4>
          <div className="preview-board" style={{
            background: previewTheme.colors.background,
            border: `2px solid ${previewTheme.colors.surface}`
          }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div 
                key={i}
                className="preview-cell"
                style={{
                  background: previewTheme.colors.surface,
                  border: `1px solid ${previewTheme.colors.primary}`,
                  color: i % 2 === 0 ? previewTheme.colors.primary : previewTheme.colors.secondary
                }}
              >
                {i === 0 ? 'X' : i === 4 ? 'O' : i === 8 ? 'X' : ''}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderSymbols = () => (
    <div className="customization-tab-content symbols">
      <h3>🎭 Symbols</h3>
      <div className="symbols-grid">
        {Object.entries(symbolOptions).map(([type, symbols]) => {
          if (type === 'custom') return null;
          
          return (
            <div 
              key={type}
              className={`symbol-option ${symbolType === type ? 'active' : ''}`}
              onClick={() => handleSymbolChange(type)}
            >
              <div className="symbol-preview">
                <span className="symbol-x">{symbols.X}</span>
                <span className="vs">vs</span>
                <span className="symbol-o">{symbols.O}</span>
              </div>
              <div className="symbol-name">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
            </div>
          );
        })}
      </div>

      {/* Custom Symbols */}
      <div className="custom-symbols-section">
        <h4>Custom Symbols</h4>
        <div className="custom-symbol-inputs">
          <div className="symbol-input-group">
            <label>Player X Symbol:</label>
            <input 
              type="text"
              maxLength="2"
              value={customSymbols.X}
              onChange={(e) => handleCustomSymbolChange('X', e.target.value)}
              placeholder="X"
              className="symbol-input"
            />
          </div>
          <div className="symbol-input-group">
            <label>Player O Symbol:</label>
            <input 
              type="text"
              maxLength="2"
              value={customSymbols.O}
              onChange={(e) => handleCustomSymbolChange('O', e.target.value)}
              placeholder="O"
              className="symbol-input"
            />
          </div>
          <button 
            className={`use-custom-btn ${symbolType === 'custom' ? 'active' : ''}`}
            onClick={() => handleSymbolChange('custom')}
          >
            Use Custom Symbols
          </button>
        </div>
      </div>

      {/* Symbol Preview */}
      <div className="symbol-preview-section">
        <h4>Preview</h4>
        <div className="symbol-demo-board">
          <div className="demo-cell filled-x">{symbolOptions[symbolType]?.X}</div>
          <div className="demo-cell empty"></div>
          <div className="demo-cell filled-o">{symbolOptions[symbolType]?.O}</div>
          <div className="demo-cell empty"></div>
          <div className="demo-cell filled-x">{symbolOptions[symbolType]?.X}</div>
          <div className="demo-cell empty"></div>
          <div className="demo-cell filled-o">{symbolOptions[symbolType]?.O}</div>
          <div className="demo-cell empty"></div>
          <div className="demo-cell filled-x">{symbolOptions[symbolType]?.X}</div>
        </div>
      </div>
    </div>
  );

  const renderEffects = () => (
    <div className="customization-tab-content effects">
      <h3>✨ Visual Effects</h3>
      <div className="effects-options">
        <div className="effect-option">
          <div className="effect-header">
            <h4>🎆 Particle Effects</h4>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <p>Sparkles and animations during gameplay</p>
        </div>

        <div className="effect-option">
          <div className="effect-header">
            <h4>🌊 Screen Shake</h4>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <p>Subtle screen shake on power-up usage</p>
        </div>

        <div className="effect-option">
          <div className="effect-header">
            <h4>🎵 Background Music</h4>
            <label className="toggle-switch">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
          <p>Ambient background music during games</p>
        </div>

        <div className="effect-option">
          <div className="effect-header">
            <h4>🔊 Enhanced Sound Effects</h4>
            <label className="toggle-switch">
              <input type="checkbox" defaultChecked />
              <span className="slider"></span>
            </label>
          </div>
          <p>Rich audio feedback for all interactions</p>
        </div>
      </div>

      <div className="animation-speed">
        <h4>⚡ Animation Speed</h4>
        <div className="speed-slider">
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            defaultValue="1"
            className="slider-input"
          />
          <div className="speed-labels">
            <span>Slow</span>
            <span>Normal</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="customization-overlay">
      <div className="customization-panel">
        <div className="customization-header">
          <h2>🎨 Customization</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="customization-tabs">
          <button 
            className={`tab ${activeTab === 'themes' ? 'active' : ''}`}
            onClick={() => setActiveTab('themes')}
          >
            🎨 Themes
          </button>
          <button 
            className={`tab ${activeTab === 'symbols' ? 'active' : ''}`}
            onClick={() => setActiveTab('symbols')}
          >
            🎭 Symbols
          </button>
          <button 
            className={`tab ${activeTab === 'effects' ? 'active' : ''}`}
            onClick={() => setActiveTab('effects')}
          >
            ✨ Effects
          </button>
        </div>

        <div className="customization-content">
          {activeTab === 'themes' && renderThemes()}
          {activeTab === 'symbols' && renderSymbols()}
          {activeTab === 'effects' && renderEffects()}
        </div>
      </div>
    </div>
  );
};

export default CustomizationPanel;
