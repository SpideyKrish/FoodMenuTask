// Entry point for the Express server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const uploadRouter = require('./routes/upload');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', uploadRouter);

// Health check
app.get('/', (req, res) => res.send('Home Chef Menu Extractor API'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
