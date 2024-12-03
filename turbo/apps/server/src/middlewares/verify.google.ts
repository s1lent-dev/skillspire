import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, HTTP_STATUS_NOT_FOUND } from "../config/config.js";
import { prisma } from "../lib/prisma.lib.js";
import { generateTokens } from "../utils/helper.util.js";
import { ErrorHandler } from "../utils/handlers.util.js";
import { User } from "../models/user.model.js";


const intializeGoogleOAuth = () => {
    passport.use(new GoogleStrategy.Strategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
    },
        async function (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) {
            try {
                const { id: googleId, displayName, emails } = profile;
                const email = emails && emails.length > 0 ? emails[0].value : null;
                let user = await prisma.user.findUnique({ where: { googleId } });
                if (!user) {
                    user = await prisma.user.findUnique({ where: { email } });
                    if (!user) {
                        return done(null, { accessToken: null, refreshToken: null, isRegistered: false });
                    } else {
                        const updatePromise = [
                            await User.updateOne({ email }, { googleId }),
                            await prisma.user.update({ where: { email }, data: { googleId } })
                        ];
                        await Promise.all(updatePromise);
                    }
                }
                if (!user) {
                    return done(new ErrorHandler("User not found", HTTP_STATUS_NOT_FOUND), null);
                }
                const { accessToken, refreshToken } = await generateTokens(user.userId);
                return done(null, { accessToken, refreshToken, isRegistered: true });
            } catch (err) {
                console.log("Error in google strategy", err);
                done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user: false | string | null | undefined, done) => {
        done(null, user);
    });
}

export { intializeGoogleOAuth };