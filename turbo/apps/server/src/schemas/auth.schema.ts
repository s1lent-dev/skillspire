import { z } from "zod";


// Register request schema
const registerRequestSchema = z.object({
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "Email must end with @gmail.com" }),
    username: z.string().min(6).max(20),
    password: z.string().min(6).max(20),
});


// Login request schema
const loginRequestSchema = z.object({
    emailOrUsername: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, { message: "Email must end with @gmail.com" }).or(z.string().min(6).max(20)),
    password: z.string().min(6).max(20),
});


export { registerRequestSchema, loginRequestSchema };
