# Tic Tac Toe Enhanced Edition

A sophisticated Tic Tac Toe game built with Next.js 15 and React 19, featuring advanced AI opponents, strategic power-ups, local multiplayer, interactive tutorial, real-time statistics, 30+ beautiful unlockable themes, particle effects, sound system, responsive design, smooth animations, 80+ achievements, and data persistence with local storage.

## Game Screenshot

<div align="center">
  <img src="/public/game.png" alt="Game Screenshot">
</div>

## 🌟 Key Features

### 🎮 Core Gaming
- **Multi-Difficulty AI**: Easy, Medium, Hard, Nightmare opponents with progressive intelligence
- **Power-Up System**: 5 strategic abilities (Freeze, Double Move, Steal, Bomb, Shield)
- **Local Multiplayer**: Play against friends on the same device
- **Interactive Tutorial**: Step-by-step learning system
- **Real-Time Statistics**: Comprehensive performance analytics

### 🎨 Visual & Audio
- **30+ Themes**: Unlockable themes (Neon Cyber, Matrix Code, Cyberpunk Nights, etc.)
- **Particle Effects**: Canvas-based visual effects for victories and events
- **Sound System**: Web Audio API-powered effects with background music
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Smooth Animations**: Fluid transitions and polished feedback

### 📊 Progress System
- **80+ Achievements**: Victory milestones, streaks, speed challenges, AI mastery
- **Level Progression**: Experience points with visual progress indicators
- **Analytics Dashboard**: Win rates, trends, and gameplay patterns
- **Session Tracking**: Real-time current session monitoring
- **Data Persistence**: Local storage for progress and settings

## 🏗️ Technical Stack

### Core Technologies
- **Framework**: Next.js 15.5.3 with App Router
- **React**: 19.1.0 with modern hooks
- **Build**: Turbopack for fast development
- **Graphics**: Canvas API for particle effects
- **Audio**: Web Audio API for sound generation
- **Styling**: Modern CSS with responsive design

## 🎯 Game Mechanics

### AI Difficulty Levels
- **🟢 Easy**: Pattern recognition with strategic random moves
- **🟡 Medium**: Balanced offensive/defensive gameplay
- **🟠 Hard**: Advanced minimax algorithm
- **🔴 Nightmare**: Near-perfect play algorithm

### Power-Up System
| Power-Up | Effect | Cost | Availability |
|----------|---------|------|-------------|
| ❄️ Freeze | Skip opponent turn | 2 pts | Easy/Medium: Always<br>Hard: After 15 losses<br>Nightmare: After 500 losses |
| ⚡ Double Move | Place two symbols | 3 pts | Same as above |
| 🔄 Steal | Convert opponent symbol | 4 pts | Same as above |
| 💥 Bomb | Clear 3x3 area | 5 pts | Same as above |
| 🛡️ Shield | Protect cell | 3 pts | Same as above |

### Achievement Categories
- **Victories**: First Win → Mythical Master (500 wins)
- **Streaks**: Hot Streak (3) → Godlike (50)
- **Speed**: Quick Draw (<15s) → Lightning Fast
- **AI Mastery**: Easy Rider → Nightmare Slayer
- **Special**: Flawless Victory, Comeback King

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18.0+
- npm or yarn

### Quick Start
```bash
# Clone and install
git clone <repository-url>
cd nextjs
npm install

# Development
npm run dev
# Open http://localhost:3000

# Production
npm run build
npm run start
```

## 📁 Project Structure
```
src/
├── app/              # Next.js app router
├── components/       # React components
│   ├── TicTacToeEnhanced.jsx    # Main controller
│   ├── Game2D.jsx              # Game logic & AI
│   └── StatsDashboard.jsx      # Analytics
├── lib/              # Core logic
│   ├── gameTypes.js     # Constants & achievements
│   └── statsManager.js  # Statistics tracking
└── styles/           # CSS styling
```

## 📱 Performance & Mobile

- **Mobile Optimized**: Touch-friendly with responsive design
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+
- **Performance**: Efficient rendering with mobile optimizations
- **Requirements**: Web Audio API, Canvas API, LocalStorage

## 🛠️ Development
```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # Code quality check
```

## 📄 License
This project is private, All rights reserved.

## 📝 Author
Joseph Mburu <j.mburu.pro@gmail.com>

