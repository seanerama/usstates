# US States Learning Game

An interactive educational web game designed to teach children (ages 8-14) about US states, their capitals, and geography through an engaging map-based quiz system.

## Features

- **Interactive Map**: Click on US states using react-simple-maps SVG visualization
- **Progressive Clue System**: 3 difficulty levels per state with smart scoring
- **Multiple Game Modes**: Play full USA or focus on specific regions
- **Leaderboard**: Compete with other players for high scores
- **Progress Tracking**: Monitor learning across all 50 states
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: Keyboard navigation, ARIA labels, and screen reader support

## Technology Stack

### Frontend
- React 18 with TypeScript
- react-simple-maps for interactive SVG US map
- react-router-dom for navigation
- axios for API calls
- react-toastify for notifications
- Responsive CSS with mobile-first design

### Backend
- Node.js with Express
- PostgreSQL database
- JWT authentication
- bcrypt password hashing
- express-validator for input validation
- Rate limiting for API protection

### Deployment
- Render (Web Service + PostgreSQL)
- Single build serves both frontend and backend
- Environment-based configuration

## Game Mechanics

### Scoring System
- **5 points**: Correct on first try without hint
- **4 points**: Correct on first try with hint requested
- **2 points**: Correct on second try (after one wrong guess)
- **0 points**: Failed after two wrong guesses (answer revealed)

### Clue Progression
1. **Clue 1** (Hard): Geography, history, or unique facts
2. **Clue 2** (Medium): Well-known features or famous locations
3. **Clue 3** (Easy): Nickname, region, or obvious identifiers

### Game Modes
- **Full USA**: Random 10 states from all 50
- **Regional Modes**: Focus on Northeast, Mid-Atlantic, Southeast, Midwest, Southwest, or West

## Project Structure

```
states-game/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/      # Login & Register
│   │   │   ├── Game/      # Map, GameBoard, CluePanel, ScorePanel
│   │   │   ├── Leaderboard/
│   │   │   └── Layout/    # Header, Sidebar
│   │   ├── contexts/      # AuthContext
│   │   ├── pages/         # Home, Progress, Results
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/       # API routes (auth, game, leaderboard, user)
│   │   ├── middleware/   # Authentication & validation
│   │   ├── models/       # Database schema
│   │   ├── config/       # Database connection
│   │   └── server.js     # Main server file
│   ├── scripts/
│   │   └── seed-database.js  # Populate all 50 states
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Database Schema

### Users Table
```sql
id              SERIAL PRIMARY KEY
username        VARCHAR(20) UNIQUE NOT NULL
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
```

### States Table
```sql
id              SERIAL PRIMARY KEY
name            VARCHAR(50) NOT NULL
capital         VARCHAR(50) NOT NULL
region          VARCHAR(20) NOT NULL
abbreviation    VARCHAR(2) NOT NULL
clue_1          TEXT NOT NULL
clue_2          TEXT NOT NULL
clue_3          TEXT NOT NULL
flag_emoji      VARCHAR(10)
population      INTEGER
nickname        VARCHAR(50)
```

### Scores Table
```sql
id              SERIAL PRIMARY KEY
user_id         INTEGER REFERENCES users(id)
game_mode       VARCHAR(20) NOT NULL
score           INTEGER NOT NULL
time_seconds    INTEGER NOT NULL
completed_at    TIMESTAMP DEFAULT NOW()
INDEX on (game_mode, score DESC, time_seconds ASC)
```

### User_Progress Table
```sql
id              SERIAL PRIMARY KEY
user_id         INTEGER REFERENCES users(id)
state_id        INTEGER REFERENCES states(id)
times_correct   INTEGER DEFAULT 0
times_attempted INTEGER DEFAULT 0
last_attempted  TIMESTAMP
UNIQUE(user_id, state_id)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login and receive JWT
- `GET /api/auth/verify` - Verify token validity

### Game
- `GET /api/game/states` - Get all states (basic info)
- `GET /api/game/states/:id` - Get detailed state information
- `GET /api/game/regions/:region` - Get states by region
- `POST /api/game/session/start` - Start new game session
- `POST /api/game/answer` - Submit answer for validation
- `POST /api/game/hint` - Request next clue
- `POST /api/game/complete` - Submit final score

### Leaderboard
- `GET /api/leaderboard/:mode?filter=all|week|month` - Get leaderboard
- `GET /api/leaderboard/:mode/preview/top5` - Get top 5 for sidebar

### User
- `GET /api/user/stats` - Get user's game statistics
- `GET /api/user/progress` - Get state-by-state progress
- `GET /api/user/progress/:stateId` - Get progress for specific state

## Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd states-game
npm run install-all
```

### Step 2: Database Setup
Create a PostgreSQL database:
```bash
createdb states_game
```

### Step 3: Environment Variables
Create `server/.env` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/states_game
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
PORT=5000
```

### Step 4: Seed Database
```bash
npm run seed
```

This populates the database with all 50 states and their clues.

### Step 5: Run Development Servers
```bash
npm run dev
```

This runs both backend (port 5000) and frontend (port 3000) concurrently.

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Deployment to Render

### Step 1: Create Render Account
Sign up at [render.com](https://render.com)

### Step 2: Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: `states-game-db`
3. Select free tier
4. Create database
5. Copy the **Internal Database URL**

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `states-learning-game`
   - **Environment**: `Node`
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 4: Environment Variables
In Render dashboard, add environment variables:
```
DATABASE_URL=<Internal Database URL from step 2>
JWT_SECRET=<generate random 64-character string>
NODE_ENV=production
```

Generate secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy
Click "Create Web Service"

Render will:
1. Install dependencies
2. Build React app
3. Start Express server
4. Serve both frontend and API

### Step 6: Seed Production Database
After first deploy, run seed script:
```bash
# Using Render Shell
npm run seed
```

Or connect to your database directly and run the seed script.

### Step 7: Access Your App
Your app will be live at: `https://states-learning-game.onrender.com`

## Testing the Application

### Manual Testing Checklist

#### Authentication
- [ ] Register new user with valid credentials
- [ ] Try registering with duplicate username (should fail)
- [ ] Login with correct credentials
- [ ] Login with incorrect credentials (should fail)
- [ ] Token persists after browser refresh
- [ ] Logout clears session

#### Game Play
- [ ] Start game in different modes
- [ ] Click correct state → see green + points
- [ ] Click wrong state → see red flash + new clue
- [ ] Request hint → get easier clue (-1 point potential)
- [ ] Complete game session
- [ ] View state information modal

#### Leaderboard
- [ ] View leaderboard for each game mode
- [ ] Filter by all time / week / month
- [ ] User's best score highlighted

#### Progress Tracking
- [ ] View all states progress
- [ ] See accuracy percentages
- [ ] Mastery levels calculated correctly

#### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Sidebar toggles work on mobile

## Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: 7-day expiry tokens
- **Input Validation**: express-validator on all inputs
- **SQL Injection Prevention**: Parameterized queries
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Configuration**: Restricted origins in production
- **Environment Variables**: Sensitive data never committed

## Accessibility Features

- **Keyboard Navigation**: Tab through all interactive elements
- **ARIA Labels**: Screen reader support on all buttons and regions
- **Color Contrast**: WCAG AA compliant
- **Focus Indicators**: Clear visual feedback
- **Semantic HTML**: Proper heading hierarchy
- **Alt Text**: Descriptive labels for all states

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 13+)
- Chrome Mobile

## Performance Optimizations

- React lazy loading for route-based code splitting
- Memoized map components to prevent unnecessary rerenders
- PostgreSQL indexes on leaderboard queries
- Connection pooling for database
- Gzip compression on production server
- Static asset caching

## Future Enhancements

- [ ] Social login (Google, GitHub)
- [ ] Multiplayer race mode
- [ ] Daily challenges
- [ ] Achievement badges
- [ ] State facts quiz mode
- [ ] Audio pronunciation of state names
- [ ] Dark mode toggle
- [ ] Export progress as PDF
- [ ] Teacher dashboard for classroom use
- [ ] International version (world countries)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## License

MIT License - feel free to use this project for educational purposes.

## Support

For issues or questions:
- Open GitHub issue
- Email: support@example.com

## Acknowledgments

- Map data from [us-atlas](https://github.com/topojson/us-atlas)
- State information compiled from US Census and educational resources
- Built with love for students learning geography

---

**Happy Learning! 🗺️📚**
