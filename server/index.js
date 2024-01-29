const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
});


mongoose.connect(process.env.MONGODB_URI)
    .then(result => {
        app.listen(process.env.PORT || 3000, () => {
            console.log('Server is running on port ' + process.env.PORT || '3000');
        })
    })
    .catch(err => console.log(err));