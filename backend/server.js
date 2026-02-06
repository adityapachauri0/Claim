require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('./utils/logger');

// Import middleware
const { trackIPAndLocation } = require('./middleware/ipTracking');
const { sanitizeInput } = require('./middleware/validation');

// Import routes
const claimsRoutes = require('./routes/claims');
const draftsRoutes = require('./routes/drafts');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// XSS/Injection prevention
app.use(sanitizeInput);

// IP tracking middleware (global)
app.use(trackIPAndLocation);

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} - IP: ${req.realIP || req.ip}`);
    next();
});

// Routes
app.use('/api/claims', claimsRoutes);
app.use('/api/drafts', draftsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'claims-website',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        ip: req.realIP || req.ip,
        location: req.ipLocation || 'Unknown'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Claims Website Backend API',
        version: '1.0.0',
        endpoints: [
            'GET /api/health',
            'POST /api/claims',
            'GET /api/claims',
            'POST /api/drafts/auto-save',
            'GET /api/drafts/get-draft'
        ]
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    logger.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/claims_db', {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error('MongoDB connection error:', error.message);
        // In development, continue without DB for testing frontend
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

// Start server
const PORT = process.env.PORT || 5001;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        logger.info(`Claims Website Backend running on port ${PORT}`);
        console.log(`
╔════════════════════════════════════════╗
║   Claims Website Backend Server        ║
╠════════════════════════════════════════╣
║   Status: Running                      ║
║   Port: ${PORT}                            ║
║   Mode: ${(process.env.NODE_ENV || 'development').padEnd(19)}║
╚════════════════════════════════════════╝
    `);
    });
};

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('Received SIGTERM, shutting down gracefully');
    mongoose.connection.close();
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('Received SIGINT, shutting down gracefully');
    mongoose.connection.close();
    process.exit(0);
});

startServer();
