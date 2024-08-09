/**
 * @fileoverview Middleware for monitoring CPU and RAM usage.
 * @requires os
 * @requires express
 */

const os = require('os');

/**
 * Middleware to log CPU and RAM usage.
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 * @param {Function} next - Next middleware function.
 */
const monitorResources = (req, res, next) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();

  const usedMemoryMB = memoryUsage.rss / 1024 / 1024;
  const usedHeapMB = memoryUsage.heapUsed / 1024 / 1024;
  const totalHeapMB = memoryUsage.heapTotal / 1024 / 1024;

  const cpuUserTime = cpuUsage.user / 1000000;
  const cpuSystemTime = cpuUsage.system / 1000000;

  console.log(`Memory Usage: RSS ${usedMemoryMB.toFixed(2)} MB, Heap Used: ${usedHeapMB.toFixed(2)} MB, Heap Total: ${totalHeapMB.toFixed(2)} MB`);
  console.log(`CPU Usage: User ${cpuUserTime.toFixed(2)} ms, System ${cpuSystemTime.toFixed(2)} ms`);

  next();
};

module.exports = monitorResources;
