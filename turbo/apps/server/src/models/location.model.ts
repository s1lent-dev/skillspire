import { Schema, model, Document } from 'mongoose';

interface ILocation extends Document {
    locId: string;
    location: string;
    geo_location: {
        longitude: number;
        latitude: number;
    };
    user: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const LocationSchema = new Schema<ILocation>({
    location: {
        type: String,
        required: true
    },
    geo_location: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            ret.locId = ret._id;
            delete ret.__v;
            delete ret._id;
        }
    },
    toObject: {
        transform: (doc, ret) => {
            ret.locId = ret._id;
            delete ret.__v;
            delete ret._id;
        }
    }
});

export const Location = model<ILocation>('Location', LocationSchema);