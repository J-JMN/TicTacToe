# Tic Tac Toe Game

A modern, interactive Tic Tac Toe game built with Next.js, React, and CSS animations. Play against an AI opponent with adjustable difficulty levels or challenge a friend in local multiplayer mode.

![Tic Tac Toe Screenshot](/public/screenshot.png)

## Features

- 🎮 Play against AI or local multiplayer
- 🎚️ Three difficulty levels: Easy, Medium, Hard
- 🎨 Smooth animations and visual feedback
- 🔊 Sound effects for all game actions
- 📱 Fully responsive design
- 🎉 Victory animations and winning line highlights

## Getting Started

### Prerequisites

- Node.js 14.0.0 or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/J-JMN/TicTacToe.git
   cd TicTacToe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play!

## How to Play

1. **Choose Game Mode**:
   - Toggle between playing against AI or a friend
   - Select AI difficulty (Easy, Medium, Hard)

2. **Make Your Move**:
   - Click on any empty cell to place your mark (X or O)
   - The first player is always X

3. **Winning the Game**:
   - First to get 3 in a row (horizontally, vertically, or diagonally) wins!
   - If all cells are filled with no winner, it's a draw

4. **Game Controls**:
   - Click "New Game" to reset the board
   - Toggle sound effects on/off with the sound button

## Technologies Used

- **Frontend**:
  - Next.js 13+ (App Router)
  - React 18+
  - CSS Modules
  - Web Audio API for sound effects

## Project Structure

```
src/
├── app/
│   ├── game.css        # Game styles and animations
│   ├── layout.js       # Root layout
│   ├── page.js         # Main page component
│   ├── sounds.js       # Sound effects manager
│   └── TicTacToe.jsx   # Main game component
└── public/             # Static assets
```

## Customization

### Adjusting Difficulty

The AI has three difficulty levels:
- **Easy**: Makes random moves
- **Medium**: Makes smart moves 70% of the time, random 30%
- **Hard**: Always makes the best possible move

### Changing Styling

Edit the CSS variables in `app/game.css` to customize colors, animations, and other visual aspects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Sound effects from [Mixkit](https://mixkit.co/)
- Built with [Next.js](https://nextjs.org/)
