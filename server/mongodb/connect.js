const mongoose = require('mongoose');
require('dotenv').config();

const DB = process.env.MONGODB_URL;

mongoose.connect(DB)
.then(() => console.log('Connection successful'))
.catch((err) => console.error('connection error', err));