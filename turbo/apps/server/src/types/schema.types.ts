import { Request } from "express";
import { ZodObject, ZodRawShape } from "zod";

interface ValidationSchemas {
    body?: ZodObject<ZodRawShape>;
    params?: ZodObject<ZodRawShape>;
    query?: ZodObject<ZodRawShape>;
}

export { ValidationSchemas };