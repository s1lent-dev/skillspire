import { Request, Response, NextFunction } from 'express';

enum Gender {
    MALE,
    FEMALE
}

enum Role {
    USER,
    RECRUITER
}


interface VerifyEmailRequest extends Request {
    body: {
        email: string;
    },
    params: {},
    query: {},
}

interface VerifyCodeRequest extends Request {
    body: {
        email: string;
    },
    params: {},
    query: {
        verificationCode: string;
    },
}
interface RegisterRequest extends Request {
    body: {
        googleId?: string | undefined;
        githubId?: string | undefined;
        firstName?: string | undefined;
        lastName?: string | undefined;
        displayName?: string | undefined;
        username: string;
        email: string;
        password: string;
        gender?: Gender | null | undefined;
        dob?: Date | undefined;
        phone?: string | undefined;
        address?: string | undefined;
        location?: string | undefined;
        avatar?: string | undefined;
        bio?: string | undefined;
        role?: Role | undefined;
    },
    params: {},
    query: {},
}


interface LoginRequest extends Request {
    body: {
        emailOrUsername: string;
        password: string;
    },
    params: {},
    query: {},
}



interface LoginOauthRequest extends Request {
    user? : {
        accessToken: string;
        refreshToken: string;
    }
}

interface ForgotPasswordRequest extends Request {
    body: {
        email: string;
    },
    params: {},
    query: {},
}


interface ResetPasswordRequest extends Request {
    body: {
        password: string;
    },
    params: {},
    query: {
        token: string;
    },
}


export { VerifyEmailRequest, VerifyCodeRequest, RegisterRequest, LoginRequest, LoginOauthRequest, ForgotPasswordRequest, ResetPasswordRequest };