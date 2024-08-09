/**
 * @fileoverview Server for image upload and segmentation using TensorFlow.js and DeepLab models.
 * @requires express
 * @requires cors
 * @requires fs
 * @requires path
 * @requires @tensorflow/tfjs-node
 * @requires dotenv
 * @requires ./swagger
 * @requires ./Routes/uploadRoutes
 * @requires ./Models/segmentationModel
 * @requires ./middlewares/monitoring
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');
require('dotenv').config();
const setupSwagger = require('./swagger');
const uploadRoutes = require('./Routes/uploadRoutes');
const segmentationModel = require('./Models/segmentationModel');
const monitorResources = require('./middlewares/monitoring');

const app = express();
const port = process.env.PORT || 3100;

app.use(cors());
app.use(express.json()); // Enabling JSON parsing for incoming requests
setupSwagger(app);

app.use(monitorResources); // Use the monitoring middleware

app.use('/upload', uploadRoutes); // Use the upload routes

/**
 * Starts the server.
 * @param {number} port - Port number to listen on.
 */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

/**
 * Initialize models when the server starts.
 */
(async () => {
  await segmentationModel.initializeModels();
})();

module.exports = app;

