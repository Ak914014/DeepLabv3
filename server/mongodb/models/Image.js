const mongoose = require("mongoose");

const Image = new mongoose.Schema({
    photo:{ type: String, required: true },
});

const ImageSchema = mongoose.model('Image', Image);
module.exports = ImageSchema;