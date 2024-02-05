const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const authRoutes = require('./routes/auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
        cb(null, true);
    else cb(null, false);
}

const app = express();

app.use(bodyParser.json()); // application/json
app.use(multer({storage: storage, fileFilter: fileFilter}).single('image'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CORS error handling
app.use((req, res, next) => {
    // Allow access from any client
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    // Allow these headers
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // Allow these methods
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
});

app.use('/controllers/auth', authRoutes);

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