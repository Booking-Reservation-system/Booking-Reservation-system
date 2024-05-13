const User = require("../models/user");

exports.getProfile = async (req, res, next) => {
    try {
        const profile = await User.findById(req.userId).populate("places");
        if (!profile) {
            const error = new Error("Profile not found.");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: "Profile fetched.",
            profile,
        });
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
}