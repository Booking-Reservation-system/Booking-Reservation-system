const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
// CORS error handling
app.use((req, res, next) => {
    // Allow access from any client
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Allow these headers
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Allow these methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
});

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const mess = error.message;
    const data = error.data;
    res.status(status).json({message: mess, data: data});
});

mongoose.connect(process.env.MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT || 3000, () => {
            console.log('Server is running on port ' + process.env.PORT || '3000');
        })
    })
    .catch(err => console.log(err));