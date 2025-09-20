'use client';

import dynamic from 'next/dynamic';
import '../styles/enhanced-game.css';

// Dynamically import the Enhanced TicTacToe component with SSR disabled
const TicTacToeEnhanced = dynamic(() => import('../components/TicTacToeEnhanced'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen">
      <TicTacToeEnhanced />
    </main>
  );
}
