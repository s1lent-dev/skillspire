import { Response, NextFunction, Request } from 'express';
import { ValidationSchemas } from '../types/schema.types.js';
import { ValidatedRequest } from '../types/types.js';
import { ErrorHandler } from '../utils/handlers.util.js';
import { HTTP_STATUS_BAD_REQUEST } from '../config/config.js';

const validate = (schemas: ValidationSchemas) => {
    return (req: Request, res: Response, next: NextFunction) => {

        (req as ValidatedRequest).validated = {};
        const { body, params, query } = schemas;
        const errors: Record<string, any> = {};

        // Validate body
        if (body) {
            const result = body.safeParse(req.body);
            if (result.success) {
                (req as ValidatedRequest).validated.body = result.data;
            } else {
                errors.body = result.error;
            }
        }

        // Validate params
        if (params) {
            const result = params.safeParse(req.params);
            if (result.success) {
                (req as ValidatedRequest).validated.params = result.data;
            } else {
                errors.params = result.error;
            }
        }

        // Validate query
        if (query) {
            const result = query.safeParse(req.query);
            if (result.success) {
                (req as ValidatedRequest).validated.query = result.data;
            } else {
                errors.query = result.error;
            }
        }

        // If there are errors, return a 400 response
        if (Object.keys(errors).length > 0) {
            return next(new ErrorHandler(JSON.stringify(errors), HTTP_STATUS_BAD_REQUEST));
        }

        next();
    };
};


export { validate };