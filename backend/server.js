require('dotenv').config();
const http = require('http');
const app = require('./app');
const db = require('./models/index');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

async function startServer() {
  try {
    // Verify database connection
    await db.raw('SELECT 1');
    console.log('Database connection established');

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`API docs available at http://localhost:${PORT}/docs`);
      console.log(`Health check at http://localhost:${PORT}/api/v1/health`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    db.destroy().then(() => {
      console.log('Database connection pool closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => {
    db.destroy().then(() => {
      console.log('Database connection pool closed');
      process.exit(0);
    });
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();
