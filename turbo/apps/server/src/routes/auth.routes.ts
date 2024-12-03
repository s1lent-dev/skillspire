import { Router } from 'express';
import { multerSingleUpload } from '../middlewares/multer.middleware.js';
import { extractAvatar } from '../middlewares/extract.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { verifyRefreshToken, verifyResetPasswordToken, verifyToken } from '../middlewares/verify.middleware.js';
import { forgotPassword, login, loginGithub, loginGoogle, logout, refreshToken, register, resetPassword, verifyCode, verifyEmail } from '../controllers/auth.controller.js';
import { forgotPasswordRequestSchema, loginRequestSchema, registerRequestSchema, resetPasswordRequestSchema, verifyEmailRequestSchema } from '../schemas/auth.schema.js';
import passport from 'passport';

const authRouter = Router();


authRouter.route('/google').get(passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.route('/github').get(passport.authenticate("github", { scope: ["user:email"] }));
authRouter.route('/google/callback').get(passport.authenticate("google", { session: false }), loginGoogle);
authRouter.route('/github/callback').get(passport.authenticate("github", { session: false }), loginGithub);
authRouter.route('/verify-email').post(validate(verifyEmailRequestSchema), verifyEmail);
authRouter.route('/register').post(multerSingleUpload('avatar'), extractAvatar, validate(registerRequestSchema), verifyCode, register);
authRouter.route('/login').post(validate(loginRequestSchema), login);
authRouter.route('/logout').get(verifyToken, logout);
authRouter.route('/refresh-token').get(verifyRefreshToken, refreshToken);
authRouter.route('/forgot-password').post(validate(forgotPasswordRequestSchema), forgotPassword);
authRouter.route('/reset-password').post(validate(resetPasswordRequestSchema), verifyResetPasswordToken, resetPassword);

export default authRouter;