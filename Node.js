const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/productivityTracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schemas
const UserSchema = new mongoose.Schema({
  email: String,
  password: String, // In production, store hashed passwords
  createdAt: { type: Date, default: Date.now }
});

const TimeDataSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: String,
  domain: String,
  totalTime: Number,
  productiveTime: Number,
  unproductiveTime: Number,
  title: String,
  url: String
});

const User = mongoose.model('User', UserSchema);
const TimeData = mongoose.model('TimeData', TimeDataSchema);

// API routes
app.post('/api/register', async (req, res) => {
  // User registration logic
});

app.post('/api/login', async (req, res) => {
  // User login logic
});

app.post('/api/time-data', async (req, res) => {
  // Save time data from extension
});

app.get('/api/time-data', async (req, res) => {
  // Get time data for dashboard
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});