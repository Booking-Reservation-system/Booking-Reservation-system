const Place = require("../models/place");
const aes256 = require("../utils/aes-crypto");
const {validationResult} = require("express-validator");
const User = require("../models/user");
const {join} = require("path");
const {unlink} = require("fs");

exports.getPlaces = async (req, res, next) => {
    const {userId, roomCount, bathroomCount, guestCount, locationValue, startDate, endDate, category} = req.params;
    let query = {};
    if (userId) query.userId = userId;
    if (roomCount) query.roomCount = roomCount;
    if (bathroomCount) query.bathroomCount = bathroomCount;
    if (guestCount) query.guestCapacity = {$gte: guestCount};
    if (locationValue) query.locationValue = locationValue;
    if (category) query.category = category;
    // check place that is not reserved in the date range of startDate and endDate
    if(startDate && endDate) {
        query.reservations = {
            $not: {
                $elemMatch: {
                    $or: [
                        {
                            endDate: {$gte: new Date(startDate)},
                            startDate: {$lte: new Date(startDate)}
                        },
                        {
                            startDate: {$lte: new Date(endDate)},
                            endDate: {$gte: new Date(endDate)}
                        }
                    ]
                }
            }
        }
    }
    try {
        const places = await Place.find(query, null, {sort: {createdAt: -1}});
        // encrypt placeId for security and save the original id in _id
        const placesFormatted = places.map(place => {
            return {
                _id: aes256.encryptData(place._id.toString()),
                title: place.title,
                imageSrc: place.imageSrc,
            }
        });
        res.status(200).json({
            message: 'Fetched places successfully.',
            places: placesFormatted
        });
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.getPlace = async (req, res, next) => {
    const placeId = aes256.decryptData(req.params.placeId);
    try {
        if(!placeId) {
            const error = new Error('Place ID is missing or invalid.');
            error.statusCode = 404;
            throw error;
        }
        const place = await Place.findById(placeId).populate('userId');
        if(!place){
            const error = new Error('Could not find place.');
            error.statusCode = 404;
            throw error;
        }
        const placeFormatted = {
            _id: aes256.encryptData(place._id),
            title: place.title,
            description: place.description,
            imageSrc: place.imageSrc,
            category: place.category,
            roomCount: place.roomCount,
            bathroomCount: place.bathroomCount,
            guestCapacity: place.guestCapacity,
            location: place.locationValue,
            price: place.price,
            creator: {
                name: place.userId.name
            }
        }
        res.status(200).json({ message: 'Place fetched.', place: placeFormatted });
    }
    catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.createPlace = async (req, res, next) => {
    const err = validationResult(req);
    try {
        if(!err.isEmpty()){
            const errs = new Error('Validation failed, entered data is incorrect!');
            errs.statusCode = 422;
            errs.data = err.array();
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

        const place = new Place({
            title: title,
            description: description,
            imageSrc: imageSrc,
            category: category,
            roomCount: roomCount,
            bathroomCount: bathroomCount,
            guestCapacity: guestCapacity,
            locationValue: location,
            price: parseInt(price, 10),
            userId: req.userId
        });
        await place.save()
        const user = await User.findById(req.userId)
        user.places.push(place)
        await user.save();
        place._id = aes256.encryptData(place._id.toString());
        res.status(201).json({
            message: 'Post created successfully!',
            place: place,
            creator: {_id: aes256.encryptData(user._id.toString()), name: user.name}
        });
    } catch(err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.updatePlace = async (req, res, next) => {
    const placeId = aes256.decryptData(req.params.placeId);
    const err = validationResult(req);
    try{
        if(!err.isEmpty()){
            const errs = new Error('Validation failed, entered data is incorrect!');
            errs.statusCode = 422;
            errs.data = err.array();
            throw errs;
        }
        const title = req.body.title;
        const description = req.body.description;
        const imageSrc = req.body.imageSrc;
        const category = req.body.category;
        const roomCount = req.body.roomCount;
        const bathroomCount = req.body.bathroomCount;
        const guestCapacity = req.body.guestCapacity;
        const location = req.body.location;
        const price = req.body.price;
        const place = await Place.findById(placeId).populate('userId');
        if(!place){
            const error = new Error('Could not find place.');
            error.statusCode = 404;
            throw error;
        }
        if(place.userId._id.toString() !== req.userId){
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        place.title = title;
        place.description = description;
        if(req.file){
            place.imageSrc = req.file.path.replace("\\" ,"/");
        }
        place.category = category;
        place.roomCount = roomCount;
        place.bathroomCount = bathroomCount;
        place.guestCapacity = guestCapacity;
        place.locationValue = location;
        place.price = parseInt(price, 10);
        const result = await place.save();
        place._id = aes256.encryptData(place._id.toString());
        place.userId._id = aes256.encryptData(place.userId._id.toString());
        res.status(200).json({ message: 'Place updated!', place: result });
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.deletePlace = async (req, res, next) => {
    const placeId = aes256.decryptData(req.params.placeId);
    try {
        const place = await Place.findById(placeId);
        if (!place) {
            const error = new Error('Could not find place.');
            error.statusCode = 404;
            throw error;
        }
        if (place.userId.toString() !== req.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        clearImage(place.imageSrc);
        await Place.findByIdAndRemove(placeId);
        const user = await User.findById(req.userId);
        user.places.pull(placeId);
        await user.save();
        res.status(200).json({message: 'Deleted place.'});
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const clearImage = filePath => {
    filePath = join(__dirname, '..', filePath);
    unlink(filePath, err => console.log(err));
}