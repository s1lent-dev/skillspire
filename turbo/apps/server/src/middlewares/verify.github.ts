import passport from "passport";
import GithubStrategy from "passport-github2";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL, HTTP_STATUS_NOT_FOUND } from "../config/config.js";
import { prisma } from "../lib/prisma.lib.js";
import { User } from "../models/user.model.js";
import { generateTokens } from "../utils/helper.util.js";
import { ErrorHandler } from "../utils/handlers.util.js";


const intializeGithubOAuth = () => {
    passport.use(new GithubStrategy.Strategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
    },
        async function (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any) => void) {
            try { 
                const { id: githubId, displayName, emails } = profile;
                const email = emails && emails.length > 0 ? emails[0].value : null;
                let user = await prisma.user.findUnique({ where: { githubId } });
                if (!user) {
                    user = await prisma.user.findUnique({ where: { email } });
                    if (!user) {
                        return done(null, { accessToken: null, refreshToken: null, isRegistered: false });
                    } else {
                        const updatePromise = [
                            await User.updateOne({ email }, { githubId }),
                            await prisma.user.update({ where: { email }, data: { githubId } })
                        ];
                        await Promise.all(updatePromise);
                    }
                }
                if (!user) {
                    return done(new ErrorHandler("User not found", HTTP_STATUS_NOT_FOUND), null);
                }
                const { accessToken, refreshToken } = await generateTokens(user.userId);
                return done(null, { accessToken, refreshToken, isRegistered: true });
            } catch(err) {
                console.log("Error in github strategy", err);
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

export { intializeGithubOAuth };