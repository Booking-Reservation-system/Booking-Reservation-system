const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    expires_at: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);