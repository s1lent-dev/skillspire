import cookie from 'cookie'
import { Socket } from "socket.io";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { NextFunction } from "express";
import { IncomingMessage } from "http";
import { HTTP_STATUS_UNAUTHORIZED, JWT_SECRET } from "../config/config.js";
import { prisma } from "../lib/prisma.lib.js";
import { ErrorHandler } from '../utils/handlers.util.js';

interface CustomSocket extends Socket {
    request: IncomingMessage & { user: string };
}

const verifySocket = async (err: any, socket: CustomSocket, next: NextFunction) => {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
        return next(new ErrorHandler("Access denied. No token provided.", HTTP_STATUS_UNAUTHORIZED));
    }
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.accessToken;
    console.log("Token: ", token);
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", HTTP_STATUS_UNAUTHORIZED));
    }
    jwt.verify(token, JWT_SECRET, async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(new Error("Unauthorized"));
        const user = await prisma.user.findUnique({ where: { userId: decoded.id } });
        if (!user) return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        socket.request.user = decoded.id;
        next();
    });
}

export { verifySocket };