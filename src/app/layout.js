import "./globals.css";

export const metadata = {
  title: "Spectacular Tic Tac Toe - Ultimate 2D Edition",
  description: "The ultimate spectacular 2D Tic Tac Toe experience with power-ups, achievements, and stunning visuals",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Fira+Code:wght@400;500;600&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
