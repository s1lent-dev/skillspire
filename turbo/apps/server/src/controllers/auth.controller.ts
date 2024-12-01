import { Request, Response, NextFunction } from 'express';
import { AsyncHandler, ErrorHandler, ResponseHandler } from '../utils/handlers.util';
import { ValidatedRequest } from '../types/schema.types';
import { LoginRequest, RegisterRequest } from '../types/auth.types';

const RegisterController = AsyncHandler(async (req: ValidatedRequest<RegisterRequest['body'], RegisterRequest['params'], RegisterRequest['query']>, res: Response, next: NextFunction) => {
    const { email, password, username } = req.validated.body!;
});