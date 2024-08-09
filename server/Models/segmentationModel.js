/**
 * @fileoverview Model for handling TensorFlow.js segmentation models.
 * @requires @tensorflow-models/deeplab
 */

const { load } = require('@tensorflow-models/deeplab');

let models = {};

/**
 * Initializes the models.
 * @async
 */
const initializeModels = async () => {
  const modelNames = ['pascal', 'cityscapes', 'ade20k'];
  for (const base of modelNames) {
    models[base] = await load({
      base: base,
      quantizationBytes: 2,
    });
  }
  console.log('Models initialized');
};

/**
 * Gets a model by name.
 * @param {string} name - The name of the model.
 * @returns {Object} The model.
 */
const getModel = (name) => models[name];

module.exports = {
  initializeModels,
  getModel,
};
