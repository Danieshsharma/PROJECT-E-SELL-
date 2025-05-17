import express from 'express';
import User from '../models/User';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message || 'Registration failed' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // In a real app, you would verify the password here
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

export default router; 