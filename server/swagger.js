const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Image Segmentation API',
      version: '1.0.0',
      description: 'API for uploading and segmenting images using TensorFlow.js and DeepLab models',
    },
    servers: [
      {
        url: 'http://localhost:3100',
      },
    ],
  },
  apis: ['./Routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
