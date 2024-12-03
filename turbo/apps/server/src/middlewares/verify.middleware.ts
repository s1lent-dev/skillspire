import { Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { AsyncHandler, ErrorHandler } from "../utils/handlers.util.js";
import { ValidatedRequest } from "../types/types.js";
import { HTTP_STATUS_UNAUTHORIZED, JWT_SECRET } from "../config/config.js";
import { prisma } from "../lib/prisma.lib.js";
import { ResetPasswordRequest } from "../types/auth.types.js";

const verifyToken = AsyncHandler(async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", HTTP_STATUS_UNAUTHORIZED));
    }
    jwt.verify(token, JWT_SECRET, async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        const user = await prisma.user.findUnique({ where: { userId: decoded.id } });
        if (!user) return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        req.user = decoded.id;
        next();
    });
});

const verifyRefreshToken = AsyncHandler(async (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.refreshToken || req.headers.authorization?.split(" ")[1];
    console.log(token);
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", HTTP_STATUS_UNAUTHORIZED));
    }
    jwt.verify(token, JWT_SECRET, async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        const user = await prisma.user.findUnique({ where: { userId: decoded.id } });
        if (!user) return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        req.user = decoded.id;
        next();
    });
});


const verifyResetPasswordToken = AsyncHandler(async (req: ValidatedRequest<ResetPasswordRequest['body'], ResetPasswordRequest['params'], ResetPasswordRequest['query']>, res: Response, next: NextFunction) => {
    const { token } = req.validated.query!;
    if (!token) {
        return next(new ErrorHandler("Access denied. No token provided.", HTTP_STATUS_UNAUTHORIZED));
    }
    jwt.verify(token, JWT_SECRET, async (err: VerifyErrors | null, decoded: any) => {
        if (err) return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        const user = await prisma.user.findUnique({ where: { userId: decoded.id } });
        if (!user) return next(new ErrorHandler("Unauthorized", HTTP_STATUS_UNAUTHORIZED));
        req.user = decoded.id;
        next();
    });
});

export { verifyToken, verifyRefreshToken, verifyResetPasswordToken };