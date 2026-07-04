const config = {
  PORT: process.env.PORT || 3001,
  TEST_SESSION_KEY: process.env.TEST_SESSION_KEY || null, // e.g. '9165' or null for latest
  POLL_INTERVAL: process.env.POLL_INTERVAL || '*/10 * * * * *',
  CACHE_TTL: parseInt(process.env.CACHE_TTL) || 30000, // 30 seconds
  MAX_CLIENTS: parseInt(process.env.MAX_CLIENTS) || 1000,
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        "http://localhost:5173",
        "https://f1-eight-orpin.vercel.app"
      ]
};

module.exports = config;
