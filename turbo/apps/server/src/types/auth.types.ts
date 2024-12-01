import { Request, Response, NextFunction } from 'express';

interface LoginRequest extends Request {
    body: {
        emailOrUsername: string;
        password: string;
    },
    params: {},
    query: {},
}

interface RegisterRequest extends Request {
    body: {
        email: string;
        username: string;
        password: string;
    },
    params: {},
    query: {},
}


export { LoginRequest, RegisterRequest };