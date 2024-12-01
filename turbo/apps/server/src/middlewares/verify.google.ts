import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } from "../config/config.js";


const intializeGoogleOAuth = () => {
    passport.use(new GoogleStrategy.Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
    },
        async function (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) {
            return done(null, profile);
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user: false | null | undefined, done) => {
        done(null, user);
    });
}

export { intializeGoogleOAuth };