import { Schema, model, Document } from 'mongoose';

interface IJob extends Document {
    jobId: string;
    title: string;
    description: string;
    type: string;
    requirements: string;
    salary: number;
    location: string;
    company: Schema.Types.ObjectId;
    applicants: Schema.Types.ObjectId[];
    postedBy: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const JobSchema = new Schema<IJob>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    requirements: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    applicants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { 
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            ret.jobId = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },
    toObject: {
        virtuals: true,
        transform(doc, ret) {
            ret.jobId = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const Job =  model<IJob>('Job', JobSchema);