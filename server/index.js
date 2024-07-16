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

/* `app.use(cors());` is enabling Cross-Origin Resource Sharing (CORS) for the Express application.
This allows the server to accept requests from a different origin (domain) than the one it is hosted
on. */
app.use(cors());
app.use(express.json());


/* This code snippet is configuring the multer middleware for handling file uploads in the Express
application. Here's a breakdown of what it does: */

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
  console.log('Uploaded file:', req.file);
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const imageTensor = tf.node.decodeImage(imageBuffer);
    console.log('Image uploaded');

    const modelName = req.body.modelName || 'cityscapes'; 
    const model = models[modelName];
    if (!model) {
      return res.status(400).send('Invalid model name.');
    }

    const result = await model.segment(imageTensor);
    console.log('Segmentation result:', result);

    const segmentationMap = result.segmentationMap; 
    const { height, width, legend } = result;

    console.log(typeof segmentationMap);
    const segmentationData = Array.from(segmentationMap); 

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
