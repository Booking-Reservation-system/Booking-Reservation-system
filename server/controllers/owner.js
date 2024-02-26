const { validationResult } = require('express-validator');

const Place = require('../models/place');
const User = require('../models/user');
const Reservation = require('../models/reservation');
const {join} = require("path");
const {unlink} = require("fs");
const aes256 = require('../utils/aes-crypto');

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
        // encrypt placeId for security
        places.forEach(place => {
            place._id = aes256.encryptData(place._id.toString());
        });
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
            locationValue: location.value,
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

exports.getPlace = async (req, res, next) => {
    const placeId = aes256.decryptData(req.params.placeId);
    try {
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
                _id: aes256.encryptData(place.userId._id.toString()),
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
        place.locationValue = location.value;
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

exports.getReservations = async (req, res, next) => {
    const {userId, placeId, authorId} = req.params;
    let query = {};
    if (userId) query.userId = aes256.decryptData(userId);
    if (placeId) query.placeId = aes256.decryptData(placeId);
    // query userId in place model through reservation model that is populated with placeId;
    if (authorId) query['placeId.userId'] = aes256.decryptData(authorId);
    try {
        const reservations = await Reservation.find(query, null, {sort: {createdAt: -1}}).populate('placeId');
        // encrypt all id
        reservations.forEach(reservation => {
            reservation._id = aes256.encryptData(reservation._id.toString());
            reservation.userId = aes256.encryptData(reservation.userId.toString());
            reservation.placeId = aes256.encryptData(reservation.placeId.toString());
        });
        res.status(200).json({
            message: 'Fetched reservations successfully.',
            reservations: reservations
        });
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.getReservation = async (req, res, next) => {
    const placeId = aes256.decryptData(req.params.placeId);
    const reservationId = aes256.decryptData(req.params.reservationId);
    try {
        const place = await Place.findById(placeId).populate('reservations');
        if(!place){
            const error = new Error('Could not find place.');
            error.statusCode = 404;
            throw error;
        }
        let reservation = place.reservations.filter(reservation => reservation._id.toString() === reservationId);
        // encrypt all id
        reservation = reservation.map(reservation => {
            reservation._id = aes256.encryptData(reservation._id.toString());
            reservation.userId = aes256.encryptData(reservation.userId.toString());
            reservation.placeId = aes256.encryptData(reservation.placeId.toString());
            return reservation;
        });
        res.status(200).json({ message: 'Place fetched.', reservation: reservation });
    }
    catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.createReservation = async (req, res, next) => {
    const err = validationResult(req);
    try {
        if(!err.isEmpty()){
            const errs = new Error('Validation failed, entered data is incorrect!');
            errs.statusCode = 422;
            errs.data = err.array();
            throw errs;
        }
        const placeId = req.body.placeId;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        const totalPrice = req.body.totalPrice;
        const place = await Place.findById(placeId);
        if (!place) {
            const error = new Error('Could not find place.');
            error.statusCode = 404;
            throw error;
        }
        const reservation = new Reservation({
            userId: req.userId,
            placeId: placeId,
            startDate: startDate,
            endDate: endDate,
            totalPrice: totalPrice
        });
        await reservation.save();
        place.reservations.push(reservation);
        await place.save();
        // encrypt all id
        reservation._id = aes256.encryptData(reservation._id.toString());
        reservation.userId = aes256.encryptData(reservation.userId.toString());
        reservation.placeId = aes256.encryptData(reservation.placeId.toString());
        res.status(201).json({message: 'Reservation created.', reservation: reservation});
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.deleteReservation = async (req, res, next) => {
    const reservationId = aes256.decryptData(req.params.reservationId);
    try {
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            const error = new Error('Could not find reservation.');
            error.statusCode = 404;
            throw error;
        }
        const place = await Place.findById(reservation.placeId);
        place.reservations.pull(reservationId);
        await place.save();
        await Reservation.findByIdAndRemove(reservationId);
        res.status(200).json({message: 'Deleted reservation.'});
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.getFavorites = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).populate('favoriteIds');
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }
        // encrypt all id
        user.favoritePlaces = user.favoritePlaces.map(place => {
            return {
                ...place,
                _id: aes256.encryptData(place._id.toString())
            }
        });
        res.status(200).json({message: 'Favorites fetched.', favoritePlaces: user.favoritePlaces});
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.newFavoriteId = async (req, res, next) => {
    const err = validationResult(req);
    try {
        if(!err.isEmpty()){
            const errs = new Error('Validation failed, entered data is incorrect!');
            errs.statusCode = 422;
            errs.data = err.array();
            throw errs;
        }
        const placeId = req.params.placeId;
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }
        user.favoritePlaces.push(placeId);
        await user.save();
        res.status(200).json({message: 'Favorite added.'});
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

exports.deleteFavoriteId = async (req, res, next) => {
    const placeId = aes256.decryptData(req.params.placeId);
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('Could not find user.');
            error.statusCode = 404;
            throw error;
        }
        user.favoritePlaces.pull(placeId);
        await user.save();
        res.status(200).json({message: 'Favorite removed.'});
    } catch(err){
        if(!err.statusCode) err.statusCode = 500;
        next(err);
    }
}

const clearImage = filePath => {
    filePath = join(__dirname, '..', filePath);
    unlink(filePath, err => console.log(err));
}