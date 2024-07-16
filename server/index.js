const express = require('express'); 
const multer = require('multer'); 
const cors = require('cors'); 
const tf = require('@tensorflow/tfjs-node'); 
const { load } = require('@tensorflow-models/deeplab');
const fs = require('fs'); 
const path = require('path'); 
require('dotenv').config(); 
const setupSwagger = require('./swagger');

const app = express(); 
const port = process.env.PORT || 3100; 

app.use(cors()); 
app.use(express.json()); // Enabling JSON parsing for incoming requests
setupSwagger(app); 

// Configuring Multer for file uploads
const upload = multer({
  dest: 'uploads/', // Destination folder for uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // Setting file size limit to 5 MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/; // Allowed file types
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Checking file extension
    const mimetype = fileTypes.test(file.mimetype); // Checking MIME type
    
    if (extname && mimetype) {
      return cb(null, true); // File is accepted
    } else {
      cb('Error: File upload only supports images!'); // File is rejected
    }
  }
});


let models = {}; // Object to hold loaded models

// initializing models
const initializeModels = async () => {
  const modelNames = ['pascal', 'cityscapes', 'ade20k']; // List of model names to load
  for (const base of modelNames) {
    models[base] = await load({
      base: base, // Model base name
      quantizationBytes: 2, // Setting quantization bytes for the model
    });
  }
  console.log('Models initialized'); 
};

initializeModels(); 

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload an image and perform segmentation
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               modelName:
 *                 type: string
 *                 enum: [pascal, cityscapes, ade20k]
 *                 default: cityscapes
 *     responses:
 *       200:
 *         description: Segmentation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 segmentationMap:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 height:
 *                   type: integer
 *                 width:
 *                   type: integer
 *                 legend:
 *                   type: object
 *       400:
 *         description: Invalid input or no file uploaded
 *       500:
 *         description: Internal server error
 */

// POST endpoint to handle image upload
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.'); // Return error if no file is uploaded
  }
  // console.log('Uploaded file:', req.file); // Log uploaded file info

  try {
    const imagePath = req.file.path; // Path to the uploaded image
    const imageBuffer = fs.readFileSync(imagePath); // Read the image file
    const imageTensor = tf.node.decodeImage(imageBuffer); // Decode image to tensor
    console.log('Image uploaded'); 

    const modelName = req.body.modelName || 'cityscapes'; // Get model name from request or default to 'cityscapes'
    const model = models[modelName]; // Get the selected model
    if (!model) {
      return res.status(400).send('Invalid model name.'); // Return error if model name is invalid
    }

    const result = await model.segment(imageTensor); // Perform segmentation
    // console.log('Segmentation result:', result); // Log segmentation result

    const segmentationMap = result.segmentationMap; // Get segmentation map from result
    const { height, width, legend } = result; // Get height, width, and legend from result

    // console.log(typeof segmentationMap); // Log type of segmentation map
    const segmentationData = Array.from(segmentationMap); // Convert segmentation map to array

    const outputPath = `output/${req.file.filename}.json`; // Define output path for segmentation data
    fs.writeFileSync(outputPath, JSON.stringify({ segmentationMap: segmentationData, height, width, legend })); // Save segmentation data to file

    res.sendFile(path.resolve(outputPath)); // Send the file as response
  } catch (error) {
    console.error(error); 
    res.status(500).send('Error processing image.'); 
  }
});

/* The code snippet `app.listen(port, () => { console.log(`Server running on port `); });` is
starting the Express server and listening on the specified port. When a client makes a request to
the server, it will handle the incoming requests and respond accordingly. The `console.log`
statement inside the callback function will print a message to the console indicating that the
server is running on the specified port. */

app.listen(port, () => {
  console.log(`Server running on port ${port}`); 
});
