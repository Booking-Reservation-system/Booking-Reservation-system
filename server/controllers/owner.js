const { validationResult } = require('express-validator');

const Place = require('../models/place');
const User = require('../models/user');
const Reservation = require('../models/reservation');
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
                            startDate: {
                                $gte: startDate,
                                $lt: endDate
                            }
                        },
                        {
                            endDate: {
                                $gt: startDate,
                                $lte: endDate
                            }
                        }
                    ]
                }
            }
        }
    }
    try {
        const places = await Place.find(query, null, {sort: {createdAt: -1}});
        res.status(200).json({
            message: 'Fetched places successfully.',
            places: places
        });
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

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