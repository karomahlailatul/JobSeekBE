var GoogleStrategy = require("passport-google-oauth2").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_OAUTH2_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
      callbackURL: `${process.env.CALLBACK_URL_BACK_END}users/auth/google/callback`,
      passReqToCallback: true,
      store: false,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        return done(null, JSON.stringify(profile));
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
passport.use(
  // "facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
      callbackURL: `${process.env.CALLBACK_URL_BACK_END}/users/auth/facebook/callback`,
      profileFields: ["id", "displayName", "photos", "email"],
      // state: true,
      // enableProof: true
    },
    function (accessToken, refreshToken, profile, cb) {
      try {
        return cb(null, JSON.stringify(profile));
      } catch (error) {
        return cb(error, false);
      }
    }
  )
);
