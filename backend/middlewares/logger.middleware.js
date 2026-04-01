/**
 * Simple request logger middleware for development.
 * Morgan is used in app.js for production-grade logging; this is for custom logging.
 * @type {import('express').RequestHandler}
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const color =
      res.statusCode >= 500
        ? '\x1b[31m' // red
        : res.statusCode >= 400
        ? '\x1b[33m' // yellow
        : res.statusCode >= 300
        ? '\x1b[36m' // cyan
        : '\x1b[32m'; // green

    console.log(
      `${color}[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms\x1b[0m`
    );
  });

  next();
}

module.exports = { requestLogger };
