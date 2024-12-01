import cookie from 'cookie'
import { Socket } from "socket.io";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { NextFunction } from "express";
import { IncomingMessage } from "http";
import { JWT_SECRET } from "../config/config.js";

interface CustomSocket extends Socket {
    request: IncomingMessage & { user: string };
}

const verifySocket = async (err: any, socket: CustomSocket, next: NextFunction) => {
    const cookies = socket.handshake.headers.cookie;
    if (!cookies) {
        return next(new Error("Access denied. No cookies provided."));
    }
    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.accessToken;
    console.log("Token: ", token);
    if (!token) {
        return next(new Error("Access denied. No token provided."));
    }

    jwt.verify(token, JWT_SECRET, async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(new Error("Unauthorized"));
        socket.request.user = decoded.id;
        next();
    });
}

export { verifySocket };