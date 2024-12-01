import passport from "passport";
import GithubStrategy from "passport-github2";
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } from "../config/config.js";

const intializeGithubOAuth = () => {
    passport.use(new GithubStrategy.Strategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_CALLBACK_URL,
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

export { intializeGithubOAuth };