const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const db = require('./mongodb/connect.js');

app.get('/', (req, res)=> {
    res.send({msg: "Hello"});
})

app.listen(port, (err)=> {
    if (err) {
        console.log(`Error in connecting server`);
    }
    console.log(`Server is running on port ${port}`);
})