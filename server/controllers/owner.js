const { validationResult } = require('express-validator');

const Place = require('../models/place');
const User = require('../models/user');

exports.createPlace = async (req, res, next) => {
    const err = validationResult(req);
    if(!err.isEmpty()){
        const errs = new Error('Validation failed, entered data is incorrect!');
        errs.statusCode = 422;
        throw errs;
    }
    if(!req.file){
        const error = new Error('No image provided.');
        error.statusCode = 422;
        throw error;
    }
    // Create place in db
    const title = req.body.title;
    const description = req.body.description;
    const imageSrc = req.file.path.replace("\\" ,"/");
    const category = req.body.category;
    const roomCount = req.body.roomCount;
    const bathroomCount = req.body.bathroomCount;
    const guestCapacity = req.body.guestCapacity;
    const location = req.body.location;
    const price = req.body.price;

    try {
        const place = new Place({
            title: title,
            description: description,
            imageSrc: imageSrc,
            category: category,
            roomCount: roomCount,
            bathroomCount: bathroomCount,
            guestCapacity: guestCapacity,
            locationValue: location.value,
            price: parseInt(price, 10),
            userId: req.userId
        });
        await place.save()
        const user = await User.findById(req.userId)
        user.listings.push(place)
        await user.save();
        res.status(201).json({
            message: 'Post created successfully!',
            place: place,
            creator: {_id: user._id, name: user.name}
        });
    } catch(err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}