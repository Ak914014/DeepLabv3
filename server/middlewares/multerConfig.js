/**
 * @fileoverview Multer configuration for handling file uploads.
 * @requires multer
 * @requires path
 */

const multer = require('multer');
const path = require('path');

/**
 * Configuring Multer for file uploads.
 * @type {multer.Instance}
 */
const upload = multer({
  dest: 'uploads/',
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
  },
});

module.exports = upload;
