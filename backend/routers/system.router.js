const express = require('express');
const router = express.Router();
const db = require('../models/index');

// GET /api/v1/health
router.get('/health', async (req, res) => {
  try {
    await db.raw('SELECT 1');
    const uptime = process.uptime();
    return res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(uptime),
        uptime_human: _formatUptime(uptime),
        environment: process.env.NODE_ENV || 'development',
        version: process.env.npm_package_version || '1.0.0',
        database: 'connected',
      },
    });
  } catch (err) {
    return res.status(503).json({
      success: false,
      data: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: err.message,
      },
    });
  }
});

function _formatUptime(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d ${h}h ${m}m ${s}s`;
}

module.exports = router;
