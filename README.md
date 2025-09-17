# Puzzle Game

A simple interactive puzzle game built with Next.js, React, and TypeScript. Players memorize number sequences and try to recreate them within a time limit.

## Features

- 🎮 Interactive puzzle gameplay
- 🏆 Score tracking and leaderboard
- ⏱️ Time-based challenges
- 📱 Responsive design
- 🗄️ SQLite database for persistent scores

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with SQLite
- **Deployment**: Vercel-ready

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up the database:

   ```bash
   npm run db:push
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Game Rules

1. Memorize the sequence of numbers shown
2. Enter the numbers in the correct order
3. Complete as many levels as possible within the time limit
4. Your score increases with each level and remaining time

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── GameBoard.tsx   # Main game component
│   ├── GameMenu.tsx    # Start menu
│   └── ScoreBoard.tsx  # Leaderboard
├── lib/               # Utilities
│   └── prisma.ts      # Database client
├── types/             # TypeScript types
├── utils/             # Helper functions
└── hooks/             # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio

## Database Schema

The game uses a simple `Score` model to track player achievements:

```prisma
model Score {
  id          String   @id @default(cuid())
  playerName  String
  score       Int
  createdAt   DateTime @default(now())
}
```

## Customization

You can easily customize the game by modifying:

- `src/utils/gameUtils.ts` - Game configuration and logic
- `src/components/GameBoard.tsx` - Game mechanics
- `tailwind.config.js` - Styling and theme
- `prisma/schema.prisma` - Database schema

## Deployment

This project is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

The SQLite database will work for development, but consider upgrading to PostgreSQL for production use.
