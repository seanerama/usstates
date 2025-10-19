# Quick Start Guide

Get the US States Learning Game running in 5 minutes!

## Prerequisites
- Node.js v16+ installed
- PostgreSQL installed and running
- Terminal/Command line access

## 1. Install Dependencies
```bash
npm run install-all
```

## 2. Setup Database
```bash
# Create database
createdb states_game

# Or using psql
psql -U postgres
CREATE DATABASE states_game;
\q
```

## 3. Configure Environment
Create `server/.env`:
```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/states_game
JWT_SECRET=change_this_to_a_random_string
NODE_ENV=development
PORT=5000
```

**Pro tip**: Generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 4. Seed Database with States
```bash
npm run seed
```

This adds all 50 US states with clues to your database.

## 5. Start Development Servers
```bash
npm run dev
```

This starts:
- Backend API on http://localhost:5000
- React frontend on http://localhost:3000

## 6. Test the App

1. Open http://localhost:3000
2. Click "Register here"
3. Create account:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
4. Start playing!

## Common Issues

### "Cannot connect to database"
- Check PostgreSQL is running: `pg_isready`
- Verify DATABASE_URL in .env file
- Check database exists: `psql -l`

### "Port 3000 already in use"
- Kill process: `lsof -ti:3000 | xargs kill -9`
- Or change port in client/package.json

### "Module not found"
- Run `npm run install-all` again
- Delete node_modules and reinstall

## Next Steps

- Read full [README.md](./README.md) for deployment
- Explore the codebase structure
- Customize clues in seed-database.js
- Deploy to Render (see README)

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- Review API endpoints section
- Check browser console for errors
- Verify backend logs in terminal

Happy coding! 🚀
