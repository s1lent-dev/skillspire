import { z } from "zod";
import { ValidationSchemas } from "../types/schema.types";



// Verify email request schema
const verifyEmailRequestSchemaBody = z.object({
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "Email must end with @gmail.com" }),
})

const verifyEmailRequestSchema: ValidationSchemas = {
    body: verifyEmailRequestSchemaBody,
    params: undefined,
    query: undefined,
}


// Verify code request schema
const verifyCodeRequestSchemaBody = z.object({
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "Email must end with @gmail.com" }),
})

const verifyCodeRequestSchemaQuery = z.object({
    verificationCode: z.string().min(6).max(6),
})

const verifyCodeRequestSchema: ValidationSchemas = {
    body: verifyCodeRequestSchemaBody,
    params: undefined,
    query: verifyCodeRequestSchemaQuery,
}


// Register request schema
const registerRequestSchemaBody = z.object({
    googleId: z.string().uuid().optional(),
    githubId: z.string().uuid().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    displayName: z.string().optional(),
    username: z.string().min(6).max(20),
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "Email must end with @gmail.com" }),
    password: z.string().min(6).max(20),
    gender: z.enum(['MALE', 'FEMALE']).optional(),
    dob: z.string().optional().refine((date) => date ? !isNaN(Date.parse(date)) : true, {
        message: "Invalid date format",
    }),
    phone: z.string().regex(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" }).optional(),
    address: z.string().optional(),
    location: z.string().optional(),
    avatar: z.string().optional(),
    bio: z.string().optional(),
    role: z.enum(['USER', 'RECRUITER']).optional(),
});

const registerRequestSchema: ValidationSchemas = {
    body: registerRequestSchemaBody,
    params: undefined,
    query: undefined,
}


// Login request schema
const loginRequestSchemaBody = z.object({
    emailOrUsername: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "Email must end with @gmail.com" }).or(z.string().min(6).max(20)),
    password: z.string().min(6).max(20),
});

const loginRequestSchema: ValidationSchemas = {
    body: loginRequestSchemaBody,
    params: undefined,
    query: undefined,
}



// Forgot password request schema
const forgotPasswordRequestSchemaBody = z.object({
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "Email must end with @gmail.com" }),
})

const forgotPasswordRequestSchema: ValidationSchemas = {
    body: forgotPasswordRequestSchemaBody,
    params: undefined,
    query: undefined,
}


// Reset password request schema
const resetPasswordRequestSchemaBody = z.object({
    password: z.string().min(6).max(20),
})

const resetPasswordRequestQuery = z.object({
    token: z.string().base64().min(10).max(100),
})

const resetPasswordRequestSchema: ValidationSchemas = {
    body: resetPasswordRequestSchemaBody,
    params: undefined,
    query: resetPasswordRequestQuery,
}

export { verifyEmailRequestSchema, verifyCodeRequestSchema, registerRequestSchema, loginRequestSchema, forgotPasswordRequestSchema, resetPasswordRequestSchema };
