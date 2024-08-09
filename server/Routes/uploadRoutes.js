/**
 * @fileoverview Route for handling image uploads and segmentation.
 * @requires express
 * @requires multer
 * @requires ../middlewares/multerConfig
 * @requires ../Controllers/uploadController
 */

const express = require('express');
const upload = require('../middlewares/multerConfig');
const uploadController = require('../Controllers/uploadController');

const router = express.Router();

/**
 * POST endpoint to handle image upload.
 * @name /upload
 * @function
 * @memberof module:routes
 * @inner
 */
router.post('/', upload.single('image'), uploadController.uploadImage);

module.exports = router;
