import { Response, NextFunction } from 'express';
import { ValidatedRequest, ValidationSchemas } from '../types/schema.types.js';
import { ErrorHandler } from '../utils/handlers.util.js';

const validate = (schemas: ValidationSchemas) => {
    return (req: ValidatedRequest, res: Response, next: NextFunction) => {
        
        // Extract the body, params, and query schemas from the ValidationSchemas object
        const { body, params, query } = schemas;
        const errors: Record<string, any> = {};
        
        // Validate the request body, params, and query
        if (body) {
            const result = body.safeParse(req.body);
            if(result.success) {
                req.validated.body = result.data;
            } else {
                errors.body = result.error;
            }
        }

        if(params) {
            const result = params.safeParse(req.params);
            if(result.success) {
                req.validated.params = result.data;
            } else {
                errors.params = result.error;
            }
        }

        if(query) {
            const result = query.safeParse(req.query);
            if(result.success) {
                req.validated.query = result.data;
            } else {
                errors.query = result.error;
            }
        }
        
        // If there are any errors, return a 400 response with the errors
        if(Object.keys(errors).length > 0) {
            return next(new ErrorHandler(JSON.stringify(errors), 400));
        }
        
        // If there are no errors, call the next middleware
        next();
    };
}

export { validate };