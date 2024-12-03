import { model, Schema, Document, Types } from 'mongoose';

interface IProfile {
    bio: string;
    skills: string[];
    social: {
        twitter: string;
        github: string;
        linkedin: string;
        leetcode: string;
    };
    education: Array<{
        qualification: string;
        degree: string;
        stream: string;
        institute: string;
        cgpa: number;
        start: Date;
        end: Date;
    }>;
    experience: Array<{
        title: string;
        company: string;
        location: string;
        start: Date;
        end: Date;
        current: boolean;
        description: string;
    }>;
}

interface IUser extends Document {
    googleId?: string;
    githubId?: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    username: string;
    email: string;
    password: string;
    gender?: 'MALE' | 'FEMALE';
    dob?: Date;
    phone?: string;
    address?: string;
    location?: string;
    avatar?: string;
    bio?: string;
    role: 'USER' | 'RECRUITER';
    profile?: IProfile;
    company?: Types.ObjectId;
    appliedJobs?: Types.ObjectId[];
    savedJobs?: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        googleId: {
            type: String,
            required: false,
        },
        githubId: {
            type: String,
            required: false,
        },
        firstName: {
            type: String,
            required: false,
            default: 'skillspire'
        },
        lastName: {
            type: String,
            required: false,
            default: 'user'
        },
        displayName: {
            type: String,
            required: false,
            default: 'skillspire user'
        },
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            enum: ['MALE', 'FEMALE'],
            required: false,
        },
        dob: {
            type: Date,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        address: {
            type: String,
            required: false,
        },
        location: {
            type: String,
            required: false,
        },
        avatar: {
            type: String,
            required: false,
        },
        bio: {
            type: String,
            required: false,
        },
        role: {
            type: String,
            enum: ['USER', 'RECRUITER'],
            default: 'USER',
            required: true,
        },
        profile: {
            bio: {
                type: String,
                required: false,
            },
            skills: {
                type: [String],
                required: false,
            },
            social: {
                twitter: {
                    type: String,
                    required: false,
                },
                github: {
                    type: String,
                    required: false,
                },
                linkedin: {
                    type: String,
                    required: false,
                },
                leetcode: {
                    type: String,
                    required: false,
                },
            },
            education: [
                {
                    qualification: {
                        type: String,
                        required: false,
                    },
                    degree: {
                        type: String,
                        required: false,
                    },
                    stream: {
                        type: String,
                        required: false,
                    },
                    institute: {
                        type: String,
                        required: false,
                    },
                    cgpa: {
                        type: Number,
                        required: false,
                    },
                    start: {
                        type: Date,
                        required: false,
                    },
                    end: {
                        type: Date,
                        required: false,
                    },
                },
            ],
            experience: [
                {
                    title: {
                        type: String,
                        required: false,
                    },
                    company: {
                        type: String,
                        required: false,
                    },
                    location: {
                        type: String,
                        required: false,
                    },
                    start: {
                        type: Date,
                        required: false,
                    },
                    end: {
                        type: Date,
                        required: false,
                    },
                    current: {
                        type: Boolean,
                        required: false,
                    },
                    description: {
                        type: String,
                        required: false,
                    },
                },
            ],
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: false,
        },
        appliedJobs: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Job',
                required: false,
            },
        ],
        savedJobs: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Job',
                required: false,
            },
        ],
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform(doc, ret) {
                ret.userId = ret._id; 
                delete ret._id; 
                delete ret.__v; 
            },
        },
        toObject: {
            virtuals: true,
            transform(doc, ret) {
                ret.userId = ret._id; 
                delete ret._id; 
                delete ret.__v; 
            },
        },
    }
);

// Export User model
export const User = model<IUser>('User', UserSchema);
