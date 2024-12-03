import { Request } from 'express';

interface ValidatedRequest<TBody = {}, TParams = {}, TQuery = {}> extends Request {
    validated: {
        body?: TBody;
        params?: TParams;
        query?: TQuery;
    };
    user?: string;
}

export { ValidatedRequest };