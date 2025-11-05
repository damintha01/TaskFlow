// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Allows server to accept JSON in the body of requests

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully."))
  .catch(err => console.error("MongoDB connection error:", err));

// A simple test route
app.get('/', (req, res) => {
  res.send('API is running...');
});
// server.js (add this line)
app.use('/api/projects', require('./routes/projects'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));