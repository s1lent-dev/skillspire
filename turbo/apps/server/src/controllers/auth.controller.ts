import { Request, Response, NextFunction } from 'express';
import { AsyncHandler, ErrorHandler, ResponseHandler } from '../utils/handlers.util.js';
import { prisma } from '../lib/prisma.lib.js';
import { User } from '../models/user.model.js';
import { ValidatedRequest } from '../types/types.js';
import { ForgotPasswordRequest, LoginOauthRequest, LoginRequest, RegisterRequest, ResetPasswordRequest, VerifyCodeRequest, VerifyEmailRequest } from '../types/auth.types.js';
import { COOKIE_OPTIONS, FRONTEND_URL, HTTP_STATUS_ACCEPTED, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_CREATED, HTTP_STATUS_OK } from '../config/config.js';
import { compareCode, comparePassword, generateResetPasswordToken, generateTokens, generateVerificationCode, hashPassword } from '../utils/helper.util.js';
import { Gender } from '@prisma/client';



const verifyEmail = AsyncHandler(async (req: ValidatedRequest<VerifyEmailRequest['body'], VerifyEmailRequest['params'], VerifyEmailRequest['query']>, res: Response, next: NextFunction) => {
    const { email } = req.validated.body!;
    const UserExists = await prisma.user.findFirst({ where: { email } });
    if (UserExists) {
        return next(new ErrorHandler('User already exists', HTTP_STATUS_BAD_REQUEST));
    }
    const { verificationCode, hashedCode } = await generateVerificationCode();
    await prisma.verificationCode.create({ data: { email, code: hashedCode, expiresAt: new Date(Date.now() + 1000 * 60 * 2) } });
    //send email with verification code
    res.status(HTTP_STATUS_OK).json(new ResponseHandler('Verification code sent successfully', HTTP_STATUS_OK, {}));
});



const verifyCode = AsyncHandler(async (req: ValidatedRequest<VerifyCodeRequest['body'], VerifyCodeRequest['params'], VerifyCodeRequest['query']>, res: Response, next: NextFunction) => {
    const { email } = req.validated.body!;
    const { verificationCode } = req.validated.query!;
    const code = await prisma.verificationCode.findFirst({ where: { email } });
    if (!code) {
        return next(new ErrorHandler('Code not found', HTTP_STATUS_BAD_REQUEST));
    }
    const isMatch = await compareCode(verificationCode, code.code);
    if (!isMatch) {
        return next(new ErrorHandler('Verification code doesnt match !', HTTP_STATUS_BAD_REQUEST));
    }
    await prisma.verificationCode.delete({ where: { email } });
    next();
});



const register = AsyncHandler(async (req: ValidatedRequest<RegisterRequest['body'], RegisterRequest['params'], RegisterRequest['query']>, res: Response, next: NextFunction) => {
    const { googleId, githubId, firstName, lastName, displayName, username, email,
            password, gender, dob, phone, address, location, avatar, bio, role } = req.validated.body!;
    const userExists = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });
    if (userExists) {
        return next(new ErrorHandler('User already exists', HTTP_STATUS_BAD_REQUEST));
    }
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
        googleId, githubId, firstName, lastName, displayName, username, email, password: hashedPassword,
        gender, dob, phone, address, location, avatar, bio, role
    });
    try {
        const userId = user._id as string;
        const dobDate = dob ? new Date(dob) : null;
        await prisma.user.create({
            data: {
                userId, googleId, githubId, firstName, lastName, displayName, username, email, password: hashedPassword,
                gender: gender as Gender | null, dob: dobDate, phone, address, location, avatar, bio
            }
        });
    } catch(err) {
        console.log(err);
        await User.findByIdAndDelete(user._id);
        return next(new ErrorHandler('User creation failed', HTTP_STATUS_BAD_REQUEST));
    }

    res.status(HTTP_STATUS_CREATED).json(new ResponseHandler('User created successfully', HTTP_STATUS_CREATED, user));
});



const login = AsyncHandler(async (req: ValidatedRequest<LoginRequest['body'], LoginRequest['params'], LoginRequest['query']>, res: Response, next: NextFunction) => {
    const { emailOrUsername, password } = req.validated.body!;
    const isEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(emailOrUsername);
    const user = await prisma.user.findFirst({ where: isEmail ? { email: emailOrUsername } : { username: emailOrUsername } });
    if (!user) {
        return next(new ErrorHandler('Invalid credentials', HTTP_STATUS_BAD_REQUEST));
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        return next(new ErrorHandler('Invalid credentials', HTTP_STATUS_BAD_REQUEST));
    }
    const { accessToken, refreshToken } = await generateTokens(user.userId);
    res.status(HTTP_STATUS_ACCEPTED).cookie('accessToken', accessToken, COOKIE_OPTIONS).cookie('refreshToken', refreshToken, COOKIE_OPTIONS).json(new ResponseHandler('User logged in successfully', HTTP_STATUS_ACCEPTED, user));
});



const loginGoogle = AsyncHandler(async (req: LoginOauthRequest, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.user!;
    res.status(HTTP_STATUS_ACCEPTED).cookie("accessToken", accessToken, COOKIE_OPTIONS).cookie("refreshToken", refreshToken, COOKIE_OPTIONS).redirect(FRONTEND_URL);
});



const loginGithub = AsyncHandler(async (req: LoginOauthRequest, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.user!;
    res.status(HTTP_STATUS_ACCEPTED).cookie("accessToken", accessToken, COOKIE_OPTIONS).cookie("refreshToken", refreshToken, COOKIE_OPTIONS).redirect(FRONTEND_URL);
});



const logout = AsyncHandler(async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!;
    if(!userId) {
        return next(new ErrorHandler('Unauthorized', HTTP_STATUS_BAD_REQUEST));
    }
    res.clearCookie('accessToken', COOKIE_OPTIONS).clearCookie('refreshToken', COOKIE_OPTIONS).json(new ResponseHandler('User logged out successfully', HTTP_STATUS_OK, {}));
});



const refreshToken = AsyncHandler(async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!;
    if(!userId) {
        return next(new ErrorHandler('Unauthorized', HTTP_STATUS_BAD_REQUEST));
    }
    const { accessToken, refreshToken } = await generateTokens(userId);
    res.status(HTTP_STATUS_ACCEPTED).cookie('accessToken', accessToken, COOKIE_OPTIONS).cookie('refreshToken', refreshToken, COOKIE_OPTIONS).json(new ResponseHandler('Token refreshed successfully', HTTP_STATUS_ACCEPTED, {}));
});



const forgotPassword = AsyncHandler(async (req: ValidatedRequest<ForgotPasswordRequest['body'], ForgotPasswordRequest['params'], ForgotPasswordRequest['query']>, res: Response, next: NextFunction) => {
    const { email } = req.validated.body!;
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
        return next(new ErrorHandler('User not found', HTTP_STATUS_BAD_REQUEST));
    }
    const token = await generateResetPasswordToken(user.userId);
    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;
    // send email with reset link
    res.status(HTTP_STATUS_OK).cookie('resetToken', token, COOKIE_OPTIONS).json(new ResponseHandler('Reset link sent successfully', HTTP_STATUS_OK, {}));
});



const resetPassword = AsyncHandler(async (req: ValidatedRequest<ResetPasswordRequest['body'], ResetPasswordRequest['params'], ResetPasswordRequest['query']>, res: Response, next: NextFunction) => {
    const { password } = req.validated.body!;
    const userId = req.user!;
    const hashedPassword = await hashPassword(password);
    const updatePromise = [
        await User.findByIdAndUpdate(userId, { password: hashedPassword }),
        await prisma.user.update({ where: { userId }, data: { password: hashedPassword } })
    ];
    await Promise.all(updatePromise);
    res.status(HTTP_STATUS_OK).json(new ResponseHandler('Password reset successfully', HTTP_STATUS_OK, {}));
});



export { verifyEmail, verifyCode, register, login, loginGoogle, loginGithub, logout, refreshToken, forgotPassword, resetPassword };