import jwt from "jsonwebtoken";
import otp from 'otp-generator'
import { JWT_EXPIRE, JWT_REFRESH_EXPIRE, JWT_SECRET } from "../config/config.js";
import { generate } from "generate-password-ts";
import bcrypt from "bcrypt";


const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}

const generateTokens = async (userId: string) => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);
    return { accessToken, refreshToken };
}
const generateAccessToken = (userId: string) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
    });
}

const generateRefreshToken = (userId: string) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: JWT_REFRESH_EXPIRE,
    });
}

const generatePassword = async () => {
    const password = generate({
        length: 10,
        numbers: true,
        symbols: true,
        lowercase: true,
        uppercase: true,
    });
    return { password };
}

const generateUsername = async () => {
    const username = generate({
        length: 8,
        numbers: false,
        symbols: false,
        lowercase: true,
        uppercase: true,
    });
    return { username };
}

const generateVerificationCode = async () => {
    const verificationCode = otp.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    const hashedCode = await hashCode(verificationCode);
    return { verificationCode, hashedCode };
}

const hashCode = async (code: string) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(code, salt);
}

const compareCode = async (code: string, hashedCode: string) => {
    return await comparePassword(code, hashedCode);
}

const generateResetPasswordToken = async (userId: string) => {
    return jwt.sign({ id: userId }, JWT_SECRET, {
        expiresIn: '10m',
    });
}

const canUpdateUsername = async (lastUsernameEdit: Date) => {
    try {
        if (!lastUsernameEdit) {
            return { canUpdate: true, remainingDays: 0 };
        }
    
        const timeDifference = Date.now() - new Date(lastUsernameEdit).getTime();
        const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000; 
        if (timeDifference < sevenDaysInMilliseconds) {
            const remainingTime = sevenDaysInMilliseconds - timeDifference;
            const remainingDays = Math.ceil(remainingTime / (24 * 60 * 60 * 1000));
            return { canUpdate: false, remainingDays };
        }
    
        return { canUpdate: true, remainingDays: 0 };
    } catch(err) {
        console.error(err);
    }
}

export { hashPassword, comparePassword, generateTokens, generatePassword, generateUsername, generateVerificationCode, compareCode, generateResetPasswordToken, canUpdateUsername };