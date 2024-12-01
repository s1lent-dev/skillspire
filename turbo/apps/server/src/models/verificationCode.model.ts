import { Schema, model, Document } from 'mongoose';

interface IVerificationCode extends Document {
    email: string;
    code: string;
    createdAt: Date;
    updatedAt: Date;
};

const VerificationCodeSchema = new Schema<IVerificationCode>({
    email: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60,
    },

}, { timestamps: true });

export const VerificationCode = model<IVerificationCode>('VerificationCode', VerificationCodeSchema);

