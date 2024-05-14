const User = require("../models/user");
const {ObjectId} = require("mongoose").Types;
const aes256 = require("../utils/aes-crypto");

exports.getProfile = async (req, res, next) => {
    try {
        const profile = await User.findById(req.userId)
            .populate({
                path: "places",
                select: "title imageSrc category",
            })
            .select("-_id email places name provider");
        if (!profile) {
            const error = new Error("Profile not found.");
            error.statusCode = 404;
            throw error;
        }
        const formattedProfile = {
            email: profile.email,
            name: profile.name,
            places: profile.places.map((place) => {
                return {
                    _id: aes256.encryptData(place._id.toString()),
                    title: place.title,
                    imageSrc: place.imageSrc,
                    category: place.category,
                };
            }),
            provider: profile.provider,
        }
        res.status(200).json({
            message: "Profile fetched.",
            profile: formattedProfile,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.updateProfile = async (req, res, next) => {
    const {name, email} = req.body;
    try {
        const profile = await User.findById(req.userId);
        if (!profile) {
            const error = new Error("Profile not found.");
            error.statusCode = 404;
            throw error;
        }
        if (profile.provider === "google") {
            const error = new Error("Google profile cannot be updated.");
            error.statusCode = 400;
            throw error;
        }
        if (name) profile.name = name;
        if (email) profile.email = email;
        await profile.save();
        const formattedProfile = {
            name: profile.name,
            email: profile.email,
        }
        res.status(200).json({
            message: "Profile updated.",
            profile: formattedProfile,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}

exports.changePassword = async (req, res, next) => {
    const {oldPassword, newPassword} = req.body;
    try {
        const profile = await User.findById(req.userId);
        if (!profile) {
            const error = new Error("Profile not found.");
            error.statusCode = 404;
            throw error;
        }
        if (profile.provider === "google") {
            const error = new Error("Google profile cannot change password.");
            error.statusCode = 400;
            throw error;
        }
        if (!oldPassword || !newPassword) {
            const error = new Error("Old password and new password are required.");
            error.statusCode = 400;
            throw error;
        }
        const isMatch = await bcrypt.compare(oldPassword, profile.hashedPassword);
        if (!isMatch) {
            const error = new Error("Wrong password.");
            error.statusCode = 401;
            throw error;
        }
        profile.hashedPassword = await bcrypt.hash(newPassword, 12);
        await profile.save();
        res.status(200).json({
            message: "Password changed.",
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}