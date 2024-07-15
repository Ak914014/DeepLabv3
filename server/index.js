const express = require('express');
const multer = require('multer');
const cors = require('cors');
const tf = require('@tensorflow/tfjs-node');
const { load } = require('@tensorflow-models/deeplab');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3100;

app.use(cors());
app.use(express.json());

const upload = multer({dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: File upload only supports images!');
    }
  } });

let models = {};

// Initialize models
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

initializeModels();

app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  console.log('Uploaded file:', req.file); // Log the uploaded file details
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const imageTensor = tf.node.decodeImage(imageBuffer);
    console.log('Image uploaded');

    const modelName = req.body.modelName || 'cityscapes'; // Default to pascal
    const model = models[modelName];
    if (!model) {
      return res.status(400).send('Invalid model name.');
    }

    const result = await model.segment(imageTensor);
    console.log('Segmentation result:', result);

    const segmentationMap = result.segmentationMap; // Accessing the segmentation map directly
    const { height, width, legend } = result;

    console.log(typeof segmentationMap);
    const segmentationData = Array.from(segmentationMap); // Use array() to get the data

    const outputPath = `output/${req.file.filename}.json`;
    fs.writeFileSync(outputPath, JSON.stringify({ segmentationMap: segmentationData, height, width, legend }));

    res.sendFile(path.resolve(outputPath));
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing image.');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
