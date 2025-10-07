# Server Setup Guide - Port 5000 Issue Fix

## Problem
The server cannot start because port 5000 is already in use by macOS Control Center (AirPlay Receiver).

## Error Message
```
Error: listen EADDRINUSE: address already in use :::5000
```

## Solutions

### Solution 1: Use Port 5001 (Recommended - Quick Fix)

The server is configured to use `PORT` environment variable with a fallback to 5000. We can easily change this:

**Option A: Set PORT in .env file**
1. Open `server/.env` file
2. Add or update: `PORT=5001`
3. Run: `npm run server`

**Option B: Set PORT when running**
```bash
cd server
PORT=5001 npm run server
```

### Solution 2: Disable AirPlay Receiver (Permanent Fix)

If you want to use port 5000:

1. Open **System Settings** (or System Preferences)
2. Go to **General** → **AirDrop & Handoff** (or **Sharing** on older macOS)
3. Turn off **AirPlay Receiver**
4. Restart your terminal
5. Run: `npm run server`

### Solution 3: Kill the Process (Temporary)

```bash
# Find and kill the process using port 5000
lsof -ti:5000 | xargs kill -9

# Then immediately run server
cd server && npm run server
```

**Note:** This is temporary as macOS will restart the Control Center process.

## Current Server Configuration

The server is configured in `server/server.js`:
```javascript
const PORT = process.env.PORT || 5000
```

## Recommended Setup

1. **Update `.env` file** to use port 5001:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   # ... other variables
   ```

2. **Update client `.env`** to match:
   ```env
   VITE_BACKEND_URL=http://localhost:5001
   ```

3. **Run the server**:
   ```bash
   cd server
   npm run server
   ```

4. **Run the client** (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

## Verification

Once the server starts successfully, you should see:
```
Database Connected
Yunay-CA Academy Server is running on port 5001
```

## Troubleshooting

### Issue: Dependencies Missing
```bash
cd server
npm install
```

### Issue: MongoDB Connection Failed
- Check your `MONGODB_URI` in `.env`
- Ensure MongoDB Atlas is accessible
- Check your IP whitelist in MongoDB Atlas

### Issue: Cloudinary Error
- Verify `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_SECRET_KEY` in `.env`

## Quick Start Commands

```bash
# Terminal 1 - Start Server
cd server
npm install  # if needed
PORT=5001 npm run server

# Terminal 2 - Start Client
cd client
npm install  # if needed
npm run dev
```

## Notes

- Port 5001 is recommended as it avoids conflicts with macOS services
- The README.md already mentions using port 5001
- Make sure both server and client `.env` files are configured correctly
