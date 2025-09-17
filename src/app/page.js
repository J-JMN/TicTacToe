'use client';

import dynamic from 'next/dynamic';
import Head from 'next/head';
import './game.css';

// Dynamically import the TicTacToe component with SSR disabled
const TicTacToe = dynamic(() => import('./TicTacToe'), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Tic Tac Toe Game</title>
        <meta name="description" content="A fun and interactive Tic Tac Toe game with AI opponents" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet"
        />
      </Head>
      
      <main className="min-h-screen flex items-center justify-center p-4">
        <TicTacToe />
      </main>
    </>
  );
}
