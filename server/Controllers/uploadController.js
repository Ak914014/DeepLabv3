/**
 * @fileoverview Controller for handling image uploads and segmentation.
 * @requires fs
 * @requires path
 * @requires @tensorflow/tfjs-node
 * @requires ../Models/segmentationModel
 */

const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');
const segmentationModel = require('../Models/segmentationModel');

/**
 * Handles image upload and segmentation.
 * @param {express.Request} req - Express request object.
 * @param {express.Response} res - Express response object.
 */
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const imageTensor = tf.node.decodeImage(imageBuffer);

    console.log('Image uploaded');

    const modelName = req.body.modelName || 'cityscapes';
    const model = segmentationModel.getModel(modelName);
    if (!model) {
      return res.status(400).send('Invalid model name.');
    }

    const result = await model.segment(imageTensor);

    const segmentationMap = result.segmentationMap;
    const { height, width, legend } = result;
    const segmentationData = Array.from(segmentationMap);

    const outputPath = `output/${req.file.filename}.json`;
    fs.writeFileSync(outputPath, JSON.stringify({ segmentationMap: segmentationData, height, width, legend }));

    res.sendFile(path.resolve(outputPath));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing image.');
  }
};

module.exports = {
  uploadImage,
};
