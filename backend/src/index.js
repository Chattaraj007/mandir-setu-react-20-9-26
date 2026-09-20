const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { initDb } = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/temples', require('./routes/temples'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/panjika', require('./routes/panjika'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Mandir Setu Dynamic Backend', timestamp: new Date().toISOString() });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Mandir Setu Sacred Platform API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/login, /api/auth/register, /api/auth/dummy-accounts',
      temples: '/api/temples',
      bookings: '/api/bookings',
      donations: '/api/donations',
      panjika: '/api/panjika/today'
    }
  });
});

// Start server and initialize PostgreSQL DB
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🪔 Mandir Setu API running on http://0.0.0.0:${PORT}`);
  await initDb();
});
