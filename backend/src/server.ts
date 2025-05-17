import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  console.log('Welcome route accessed');
  res.json({ message: 'Welcome to E-Sell API' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// 404 handler
app.use((req, res) => {
  console.log('404 - Route not found:', req.url);
  res.setHeader('Content-Type', 'text/html');
  res.status(404).json({ data: null });
});

// MongoDB connection with better error handling
const MONGODB_URI = 'mongodb://127.0.0.1:27017/e-sell';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server only after MongoDB connects
const startServer = async () => {
  try {
    await connectDB();
    const PORT = 5000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('Available routes:');
      console.log('- GET  /');
      console.log('- POST /api/auth/register');
      console.log('- POST /api/auth/login');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer(); 