# SnapPuzzle AI

A photo-capture web puzzle game where users can use their webcam or camera to snap a photo, generate a puzzle from it, and then challenge themselves or friends to solve the puzzle in the fastest time.

## Features

- **Webcam Photo Capture**: Built-in camera interface using `react-webcam` to snap photos.
- **AI-powered Puzzle Generation**: Photo is dynamically sliced into puzzle pieces using HTML5 Canvas.
- **Click-to-Swap Gameplay**: Users swap puzzle pieces by clicking to select and swap them.
- **Timer & Scoreboard**: Real-time timer and score calculation based on difficulty and speed.
- **Achievements**: Unlock achievements as you play (Speed Runner, Puzzle Master, etc.).
- **Leaderboard**: Compete globally and see top players.
- **User Authentication**: Secure JWT-based auth with login/register.
- **Dashboard**: View personal stats, history, and achievements.
- **Dark Mode**: Full dark mode support.
- **Responsive Design**: Works on desktop, tablet, and mobile.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Vite, react-webcam, react-confetti, lucide-react
- **Backend**: Python Flask, Flask-CORS, Flask-Limiter, Flask-JWT-Extended, pymongo, python-dotenv, bcrypt, Pillow
- **Database**: MongoDB (via pymongo)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- MongoDB (local or cloud)

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Linux/macOS)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET_KEY

# Run server
python app.py
# Or with gunicorn for production:
# gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

The backend API will be available at `http://localhost:5000`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Ensure VITE_API_URL points to your backend (e.g. http://localhost:5000/api)

# Run dev server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Game
- `POST /api/game/save` - Save game score (auth required)
- `GET /api/game/history` - Get personal game history (auth required)

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard with optional difficulty filter
- `GET /api/leaderboard/weekly` - Get weekly leaderboard
- `GET /api/leaderboard/achievements` - Get achievement leaderboard

### Dashboard
- `GET /api/dashboard/stats` - Get personal stats (auth required)
- `GET /api/dashboard/history` - Get personal game history (auth required)

### Achievements
- `GET /api/achievements` - Get all achievements (auth required)
- `GET /api/achievements/unlocked` - Get unlocked achievements (auth required)

## Game Rules

1. **Capture**: Use your webcam to take a photo.
2. **Select Difficulty**: Choose Easy (3x3), Medium (4x4), or Hard (6x6).
3. **Solve**: Click a piece to select it, then click another piece to swap them.
4. **Win**: Arrange all pieces to their original positions to complete the puzzle.
5. **Score**: Your score is based on time and difficulty. Faster completion = higher score!

## Project Structure

```
SnapPuzzleAI/
├── backend/
│   ├── app.py                 # Flask app entry point
│   ├── config/
│   │   └── database.py        # MongoDB connection singleton
│   ├── middleware/
│   │   └── authMiddleware.py  # JWT auth middleware
│   ├── models/
│   │   ├── User.py            # User model
│   │   ├── Score.py           # Score model
│   │   └── Achievement.py   # Achievement model
│   ├── routes/
│   │   ├── auth.py            # Auth routes
│   │   ├── game.py            # Game score routes
│   │   ├── leaderboard.py     # Leaderboard routes
│   │   ├── dashboard.py       # Dashboard routes
│   │   └── achievements.py    # Achievement routes
│   ├── .env                   # Environment variables
│   ├── .env.example           # Environment template
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── services/          # API services
│   │   ├── context/           # React contexts (Auth)
│   │   ├── App.jsx            # Main app with routing
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles + Tailwind
│   ├── .env                   # Environment variables
│   ├── .env.example           # Environment template
│   ├── index.html             # HTML entry
│   ├── package.json           # Dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind CSS config
│   └── postcss.config.js      # PostCSS config
└── README.md
```

## Environment Variables

### Backend (.env)
```
JWT_SECRET_KEY=your-secret-key
MONGO_URI=mongodb://localhost:27017/snappuzzle
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## License

MIT
