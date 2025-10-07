# 🚀 Quick Fix Guide - Server Not Running Issue

## Problem Identified
Port 5000 is occupied by macOS Control Center (AirPlay Receiver), preventing the server from starting.

## ✅ SOLUTION: Use Port 5001

### Step 1: Update Server Environment Variables

Create or update `server/.env` file with:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_secret_key
CURRENCY=INR
```

**Important:** Replace the placeholder values with your actual credentials.

### Step 2: Update Client Environment Variables

Create or update `client/.env` file with:

```env
VITE_BACKEND_URL=http://localhost:5001
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Step 3: Install Dependencies (if not already done)

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 4: Start the Server

```bash
cd server
npm run server
```

You should see:
```
Database Connected
Yunay-CA Academy Server is running on port 5001
```

### Step 5: Start the Client (in a new terminal)

```bash
cd client
npm run dev
```

You should see:
```
VITE v5.4.11  ready in XXX ms
➜  Local:   http://localhost:5173/
```

## 🎯 Alternative: Quick Start with PORT Override

If you don't want to modify `.env` files:

```bash
# Terminal 1 - Server
cd server
PORT=5001 npm run server

# Terminal 2 - Client (update VITE_BACKEND_URL in .env first)
cd client
npm run dev
```

## 🔧 Troubleshooting

### Issue 1: "Cannot find package 'razorpay'"
**Solution:**
```bash
cd server
npm install
```

### Issue 2: "EADDRINUSE: address already in use :::5000"
**Solution:** Make sure you've set `PORT=5001` in `server/.env` or use:
```bash
PORT=5001 npm run server
```

### Issue 3: MongoDB Connection Failed
**Solution:**
- Verify `MONGODB_URI` in `server/.env`
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)
- Ensure MongoDB cluster is running

### Issue 4: Client can't connect to server
**Solution:**
- Verify `VITE_BACKEND_URL=http://localhost:5001` in `client/.env`
- Ensure server is running on port 5001
- Check browser console for CORS errors

## 📝 Environment Variables Checklist

### Server (.env)
- [ ] PORT=5001
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET
- [ ] CLOUDINARY_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_SECRET_KEY
- [ ] CURRENCY

### Client (.env)
- [ ] VITE_BACKEND_URL=http://localhost:5001
- [ ] VITE_RAZORPAY_KEY_ID

## 🎉 Success Indicators

### Server Running Successfully:
```
Database Connected
Yunay-CA Academy Server is running on port 5001
```

### Client Running Successfully:
```
VITE v5.4.11  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Test the Connection:
Open browser and navigate to:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001 (should show "Yunay-CA Academy API Working")

## 📚 Additional Resources

- Full setup guide: `How_To_Run_Project.pdf`
- Test credentials: `TEST-CREDENTIALS.md`
- Project documentation: `README.md`
- Detailed server setup: `SERVER-SETUP-GUIDE.md`

## 💡 Pro Tips

1. **Always start the server before the client**
2. **Keep both terminals open** while developing
3. **Use `npm run server`** (with nodemon) for auto-restart during development
4. **Check `.env` files** if you encounter connection issues
5. **Port 5001 is recommended** to avoid macOS conflicts

## 🆘 Still Having Issues?

If you're still experiencing problems:

1. Check if any process is using port 5001:
   ```bash
   lsof -i :5001
   ```

2. Clear node_modules and reinstall:
   ```bash
   cd server && rm -rf node_modules && npm install
   cd ../client && rm -rf node_modules && npm install
   ```

3. Verify your `.env` files exist and have correct values

4. Check the console output for specific error messages
