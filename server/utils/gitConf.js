const GitHubStrategy = require('passport-github').Strategy;
const passport = require('passport');
const refresh = require('passport-oauth2-refresh');
const User = require('../models/user');
const RefreshToken = require('../models/refresh-token');

const strategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
        scope: ['user:email', 'profile'],
    },
    async (accessToken, refreshToken, params, profile, callback) => {
        try {
            let user = await User.findOne({email: profile.emails[0].value});
            if (!user) {
                const email = (profile.emails && profile.emails.length > 0) ? profile.emails[0].value : '';
                user = new User({
                    name: profile.displayName,
                    email: email,
                    image: profile._json.avatar_url,
                    provider: profile.provider,
                    providerId: profile.id,
                });
                await user.save();
            } else if (user.provider !== profile.provider && user.providerId !== profile.id){
                return callback(new Error('Email already registered with another provider.'), null);
            }
            let refreshTokenDoc = await RefreshToken.findOne({userId: user._id});
            if (!refreshTokenDoc) {
                refreshTokenDoc = new RefreshToken({
                    userId: user._id,
                    refreshToken: accessToken,
                });
                await refreshTokenDoc.save();
            } else {
                refreshTokenDoc.refreshToken = accessToken;
                await refreshTokenDoc.save();
            }
            const data = {
                user: user,
                accessToken: accessToken,
                refreshToken: refreshToken,
            };
            return callback(null, data);
        } catch (err) {
            return callback(err, null);
        }
    }
);

passport.use(strategy);
refresh.use(strategy);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;