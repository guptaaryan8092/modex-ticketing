const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/', showRoutes);
app.use('/', bookingRoutes);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

module.exports = app;
