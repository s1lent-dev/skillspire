import { Request } from "express";
import { ZodObject, ZodRawShape } from "zod";

interface ValidatedRequest<TBody = {}, TParams = {}, TQuery = {}> extends Request {
    validated: {
        body?: TBody;
        params?: TParams;
        query?: TQuery;
    };
    user?: string;
}

interface ValidationSchemas {
    body?: ZodObject<ZodRawShape>;
    params?: ZodObject<ZodRawShape>;
    query?: ZodObject<ZodRawShape>;
}

export { ValidatedRequest, ValidationSchemas };