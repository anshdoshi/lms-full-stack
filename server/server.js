import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import connectCloudinary from './configs/cloudinary.js'
import userRouter from './routes/userRoutes.js'
import authRouter from './routes/authRoutes.js'
import educatorRouter from './routes/educatorRoutes.js'
import courseRouter from './routes/courseRoute.js'
import adminRouter from './routes/adminRoutes.js'

// Initialize Express
const app = express()

// Connect to database
await connectDB()
await connectCloudinary()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.get('/', (req, res) => res.send("Yunay-CA Academy API Working"))

// Auth routes (public)
app.use('/api/auth', authRouter)

// Protected routes
app.use('/api/user', userRouter)
app.use('/api/educator', educatorRouter)
app.use('/api/course', courseRouter)
app.use('/api/admin', adminRouter)

// Port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Yunay-CA Academy Server is running on port ${PORT}`);
})