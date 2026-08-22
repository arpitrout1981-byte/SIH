# S30 Backend — Step 1: Skeleton + Database Models

This is the foundation everything else gets built on. Here's what's in here and what to do with it.

## What we just built

- `server.js` — the Express app. Boots, connects to MongoDB, exposes a `/health` route.
- `config/db.js` — the MongoDB connection. If your `.env` isn't set up yet, it warns you clearly instead of crashing.
- `models/` — the four collections from the build guide: `Student`, `Credential`, `Opportunity`, `Match`. These match the schema exactly, so nothing changes later.

## Run it on your machine

1. **Install Node.js** if you don't have it (v18 or newer): nodejs.org
2. **Install dependencies:**
   ```
   npm install
   ```
3. **Set up MongoDB Atlas** (skip if already done):
   - Go to mongodb.com/atlas, create a free account, create a free M0 cluster
   - Under **Database Access**, create a user with a password
   - Under **Network Access**, add your IP (or `0.0.0.0/0` for hackathon convenience — just don't leave that on a real production app)
   - Click **Connect > Drivers**, copy the connection string
4. **Set up your `.env`:**
   ```
   cp .env.example .env
   ```
   Open `.env` and paste your real connection string into `MONGO_URI`. Replace `<username>` and `<password>` with your actual Atlas credentials, and add a database name before the `?` — e.g. `.../s30?retryWrites=true...`
5. **Run it:**
   ```
   npm run dev
   ```
6. **Check it worked:** open `http://localhost:5000/health` in your browser. You should see:
   ```json
   {"status":"ok","message":"S30 backend is running"}
   ```
   And in your terminal, you should see `[OK] Connected to MongoDB Atlas` — not the yellow warning.

## Checkpoint before we move on

Reply back once you've got that `[OK] Connected to MongoDB Atlas` line in your terminal. If you're stuck — wrong password, IP not whitelisted, connection string typo — paste me the exact error and we'll fix it together before moving forward.

## What's next (Step 2)

Once this is confirmed working, we build the CRUD routes: endpoints to create a student, add a credential, post an opportunity, and fetch them back. That's what your frontend will actually talk to.
