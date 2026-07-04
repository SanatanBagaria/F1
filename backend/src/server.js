const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const config = require('./config/config');
const logger = require('./utils/logger');
const apiRoutes = require('./routes/apiRoutes');
const errorHandler = require('./middleware/errorHandler');
const { initSocketManager } = require('./socket/socketManager');

// Initialize app
const app = express();
const httpServer = createServer(app);

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW,
  max: config.RATE_LIMIT_MAX,
  message: 'Too many requests from this IP'
});
app.use(apiLimiter);

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    if (config.ALLOWED_ORIGINS.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"]
}));

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: config.ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000 // 2 minutes
  }
});

// Initialize Socket Event Listeners and background Cron polling
initSocketManager(io);

// Mount API routes
app.use('/api', apiRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({ 
    status: 'F1 Live Server Running', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    clients: io.engine.clientsCount
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Metrics
app.get('/metrics', (req, res) => {
  res.json({
    clients: io.engine.clientsCount,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Express global error handling middleware
app.use(errorHandler);

// Start server
httpServer.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
  console.log(`
  F1 Live Timing Server
  ---------------------
  Port: ${config.PORT}
  Health: http://localhost:${config.PORT}/health
  Metrics: http://localhost:${config.PORT}/metrics
  `);
});

// Cleanup on exit
process.on('SIGTERM', () => {
  logger.info('Server shutting down');
  httpServer.close(() => process.exit(0));
});
