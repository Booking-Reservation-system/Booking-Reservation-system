const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    provider: { // unique
        type: String,
        required: true,
    },
    providerAccountId: { // unique
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    accessToken: {
        type: String,
    },
    expires_at: {
        type: Number,
    },
    token_type: {
        type: String,
    },
    scope: {
        type: String,
    },
    id_token: {
        type: String,
    },
    session_state: {
        type: String,
    },
});

module.exports = mongoose.model('Account', accountSchema);