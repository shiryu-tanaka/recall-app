const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
  res.json({message: 'Backend is runnning'});
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});